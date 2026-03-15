import { HttpStatus } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, GoogleAuthDto } from './dto';
import { ConfigService } from '@nestjs/config';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    private readonly logger;
    constructor(authService: AuthService, configService: ConfigService);
    register(dto: RegisterDto, req: Request, res: Response): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    login(dto: LoginDto, req: Request, res: Response): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    googleAuth(dto: GoogleAuthDto, req: Request, res: Response): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    logout(req: Request, res: Response): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    logoutAll(user: JwtPayload, res: Response): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    private setTokenCookies;
}
