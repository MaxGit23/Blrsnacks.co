import {
    Controller,
    Post,
    Body,
    Res,
    Req,
    HttpCode,
    HttpStatus,
    Logger,
    UseGuards,
    UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, GoogleAuthDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) { }

    @Post('register')
    async register(
        @Body() dto: RegisterDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.register(
            dto,
            req.headers['user-agent'],
            req.ip,
        );
        this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Registration successful',
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: LoginDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.login(
            dto,
            req.headers['user-agent'],
            req.ip,
        );
        this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

        return {
            statusCode: HttpStatus.OK,
            message: 'Login successful',
        };
    }

    @Post('google')
    @HttpCode(HttpStatus.OK)
    async googleAuth(
        @Body() dto: GoogleAuthDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.googleAuth(
            dto,
            req.headers['user-agent'],
            req.ip,
        );
        this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

        return {
            statusCode: HttpStatus.OK,
            message: 'Google authentication successful',
        };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        const tokens = await this.authService.refreshTokens(
            refreshToken,
            req.headers['user-agent'],
            req.ip,
        );
        this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

        return {
            statusCode: HttpStatus.OK,
            message: 'Token refreshed',
        };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refresh_token;
        await this.authService.logout(refreshToken);

        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });

        this.logger.log('User logged out');

        return {
            statusCode: HttpStatus.OK,
            message: 'Logged out successfully',
        };
    }

    @Post('logout-all')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async logoutAll(
        @CurrentUser() user: JwtPayload,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logoutAll(user.sub);

        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });

        return {
            statusCode: HttpStatus.OK,
            message: 'Logged out from all devices',
        };
    }

    // ─── Cookie Helpers ─────────────────────────────────────────────────────────

    private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
        const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 15 * 60 * 1000,
            path: '/',
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
    }
}
