import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, GoogleAuthDto } from './dto';
import { Role } from '@prisma/client';
export interface TokenPayload {
    sub: string;
    email: string;
    role: Role;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    private readonly prisma;
    private readonly logger;
    private readonly googleClient;
    private readonly BCRYPT_ROUNDS;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, prisma: PrismaService);
    register(dto: RegisterDto, userAgent?: string, ipAddress?: string): Promise<AuthTokens>;
    login(dto: LoginDto, userAgent?: string, ipAddress?: string): Promise<AuthTokens>;
    googleAuth(dto: GoogleAuthDto, userAgent?: string, ipAddress?: string): Promise<AuthTokens>;
    refreshTokens(refreshToken: string, userAgent?: string, ipAddress?: string): Promise<AuthTokens>;
    logout(refreshToken: string | undefined, userId?: string): Promise<void>;
    logoutAll(userId: string): Promise<void>;
    private generateAndPersistTokens;
    private hashToken;
}
