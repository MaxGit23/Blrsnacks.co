import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
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
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException('Authentication token is missing');
        }

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            request['user'] = payload;
        } catch (error) {
            this.logger.warn(`Invalid JWT token attempt from ${request.ip}`);
            throw new UnauthorizedException('Invalid or expired token');
        }

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
