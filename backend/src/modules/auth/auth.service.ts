import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, GoogleAuthDto } from './dto';
import { Role } from '@prisma/client';
import * as crypto from 'crypto';

export interface TokenPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient: OAuth2Client;
  private readonly BCRYPT_ROUNDS = 12;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(clientId);
  }

  // ─── Email/Password Registration ────────────────────────────────────────────

  async register(dto: RegisterDto, userAgent?: string, ipAddress?: string) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.BCRYPT_ROUNDS);

    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
    });

    this.logger.log(`User registered: ${user.email}`);

    return this.generateAndPersistTokens(
      { sub: user.id, email: user.email, role: user.role },
      userAgent,
      ipAddress,
    );
  }

  // ─── Email/Password Login ──────────────────────────────────────────────────

  async login(dto: LoginDto, userAgent?: string, ipAddress?: string) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      this.logger.warn(`Failed login attempt for: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in: ${user.email} (${user.role})`);

    return this.generateAndPersistTokens(
      { sub: user.id, email: user.email, role: user.role },
      userAgent,
      ipAddress,
    );
  }

  // ─── Google OAuth ──────────────────────────────────────────────────────────

  async googleAuth(dto: GoogleAuthDto, userAgent?: string, ipAddress?: string) {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

    let payload: { sub?: string; email?: string };
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: dto.idToken,
        audience: googleClientId,
      });
      payload = ticket.getPayload() as { sub: string; email: string };
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }

    if (!payload.email || !payload.sub) {
      throw new UnauthorizedException('Google token missing required fields');
    }

    let user = await this.usersService.findByGoogleId(payload.sub);

    if (!user) {
      const existingByEmail = await this.usersService.findByEmail(
        payload.email,
      );

      if (existingByEmail) {
        user = await this.usersService.linkGoogleId(
          existingByEmail.id,
          payload.sub,
        );
        this.logger.log(
          `Linked Google account to existing user: ${payload.email}`,
        );
      } else {
        user = await this.usersService.create({
          email: payload.email,
          googleId: payload.sub,
        });
        this.logger.log(`New user created via Google OAuth: ${payload.email}`);
      }
    }

    return this.generateAndPersistTokens(
      { sub: user.id, email: user.email, role: user.role },
      userAgent,
      ipAddress,
    );
  }

  // ─── Token Refresh with DB verification + Rotation ─────────────────────────

  async refreshTokens(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    // 1. Verify the JWT signature
    let payload: TokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<TokenPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 2. Hash the incoming token and look it up in the DB
    const tokenHash = this.hashToken(refreshToken);

    const session = await this.prisma.session.findFirst({
      where: {
        userId: payload.sub,
        refreshTokenHash: tokenHash,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      // Possible token reuse attack — invalidate ALL sessions for this user
      this.logger.warn(
        `Refresh token reuse detected for user: ${payload.sub}. Revoking all sessions.`,
      );
      await this.prisma.session.deleteMany({ where: { userId: payload.sub } });
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    // 3. Verify user still exists
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      await this.prisma.session.delete({ where: { id: session.id } });
      throw new UnauthorizedException('User not found');
    }

    // 4. Rotate: delete old session, generate new tokens + new session
    await this.prisma.session.delete({ where: { id: session.id } });

    this.logger.log(`Token rotated for user: ${user.email}`);

    return this.generateAndPersistTokens(
      { sub: user.id, email: user.email, role: user.role },
      userAgent,
      ipAddress,
    );
  }

  // ─── Logout — Delete Session ────────────────────────────────────────────────

  async logout(refreshToken: string | undefined, userId?: string) {
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await this.prisma.session.deleteMany({
        where: { refreshTokenHash: tokenHash },
      });
      this.logger.log('Session deleted on logout');
    } else if (userId) {
      // Fallback: clear all sessions for the user
      await this.prisma.session.deleteMany({ where: { userId } });
      this.logger.log(`All sessions cleared for user: ${userId}`);
    }
  }

  // ─── Logout All Devices ────────────────────────────────────────────────────

  async logoutAll(userId: string) {
    const { count } = await this.prisma.session.deleteMany({
      where: { userId },
    });
    this.logger.log(`Revoked ${count} sessions for user: ${userId}`);
  }

  // ─── Token Generation + Session Persistence ────────────────────────────────

  private async generateAndPersistTokens(
    payload: TokenPayload,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthTokens> {
    const accessExpiresIn = this.configService.get<number>(
      'JWT_EXPIRES_IN_SECONDS',
      900,
    );
    const refreshExpiresIn = this.configService.get<number>(
      'JWT_REFRESH_EXPIRES_IN_SECONDS',
      604800,
    );

    const tokenPayload = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(tokenPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(tokenPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshExpiresIn,
      }),
    ]);

    // Persist the hashed refresh token in the Session table
    const refreshTokenHash = this.hashToken(refreshToken);

    await this.prisma.session.create({
      data: {
        userId: payload.sub,
        refreshTokenHash,
        userAgent: userAgent ?? null,
        ipAddress: ipAddress ?? null,
        expiresAt: new Date(Date.now() + refreshExpiresIn * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  // ─── Utility: SHA-256 hash for token storage ──────────────────────────────

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
