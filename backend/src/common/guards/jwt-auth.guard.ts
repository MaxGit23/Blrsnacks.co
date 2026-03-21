import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // --- AUTH BYPASSED ---
    request['user'] = {
      sub: 'mock-admin-id',
      email: 'admin@blrsnacks.co',
      role: 'ADMIN',
    };
    return true;
  }

  private extractToken(request: Request): string | undefined {
    // Priority 1: httpOnly cookie
    const cookieToken = request.cookies?.access_token;
    if (cookieToken) return cookieToken;

    // Priority 2: Authorization header (for API clients)
    const [type, headerToken] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? headerToken : undefined;
  }
}
