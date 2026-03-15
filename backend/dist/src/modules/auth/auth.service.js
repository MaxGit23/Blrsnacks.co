"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
let AuthService = AuthService_1 = class AuthService {
    usersService;
    jwtService;
    configService;
    prisma;
    logger = new common_1.Logger(AuthService_1.name);
    googleClient;
    BCRYPT_ROUNDS = 12;
    constructor(usersService, jwtService, configService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = prisma;
        const clientId = this.configService.get('GOOGLE_CLIENT_ID');
        this.googleClient = new google_auth_library_1.OAuth2Client(clientId);
    }
    async register(dto, userAgent, ipAddress) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, this.BCRYPT_ROUNDS);
        const user = await this.usersService.create({
            email: dto.email,
            passwordHash,
        });
        this.logger.log(`User registered: ${user.email}`);
        return this.generateAndPersistTokens({ sub: user.id, email: user.email, role: user.role }, userAgent, ipAddress);
    }
    async login(dto, userAgent, ipAddress) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            this.logger.warn(`Failed login attempt for: ${dto.email}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        this.logger.log(`User logged in: ${user.email} (${user.role})`);
        return this.generateAndPersistTokens({ sub: user.id, email: user.email, role: user.role }, userAgent, ipAddress);
    }
    async googleAuth(dto, userAgent, ipAddress) {
        const googleClientId = this.configService.get('GOOGLE_CLIENT_ID');
        let payload;
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: dto.idToken,
                audience: googleClientId,
            });
            payload = ticket.getPayload();
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid Google token');
        }
        if (!payload.email || !payload.sub) {
            throw new common_1.UnauthorizedException('Google token missing required fields');
        }
        let user = await this.usersService.findByGoogleId(payload.sub);
        if (!user) {
            const existingByEmail = await this.usersService.findByEmail(payload.email);
            if (existingByEmail) {
                user = await this.usersService.linkGoogleId(existingByEmail.id, payload.sub);
                this.logger.log(`Linked Google account to existing user: ${payload.email}`);
            }
            else {
                user = await this.usersService.create({
                    email: payload.email,
                    googleId: payload.sub,
                });
                this.logger.log(`New user created via Google OAuth: ${payload.email}`);
            }
        }
        return this.generateAndPersistTokens({ sub: user.id, email: user.email, role: user.role }, userAgent, ipAddress);
    }
    async refreshTokens(refreshToken, userAgent, ipAddress) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const tokenHash = this.hashToken(refreshToken);
        const session = await this.prisma.session.findFirst({
            where: {
                userId: payload.sub,
                refreshTokenHash: tokenHash,
                expiresAt: { gt: new Date() },
            },
        });
        if (!session) {
            this.logger.warn(`Refresh token reuse detected for user: ${payload.sub}. Revoking all sessions.`);
            await this.prisma.session.deleteMany({ where: { userId: payload.sub } });
            throw new common_1.UnauthorizedException('Refresh token has been revoked');
        }
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            await this.prisma.session.delete({ where: { id: session.id } });
            throw new common_1.UnauthorizedException('User not found');
        }
        await this.prisma.session.delete({ where: { id: session.id } });
        this.logger.log(`Token rotated for user: ${user.email}`);
        return this.generateAndPersistTokens({ sub: user.id, email: user.email, role: user.role }, userAgent, ipAddress);
    }
    async logout(refreshToken, userId) {
        if (refreshToken) {
            const tokenHash = this.hashToken(refreshToken);
            await this.prisma.session.deleteMany({
                where: { refreshTokenHash: tokenHash },
            });
            this.logger.log('Session deleted on logout');
        }
        else if (userId) {
            await this.prisma.session.deleteMany({ where: { userId } });
            this.logger.log(`All sessions cleared for user: ${userId}`);
        }
    }
    async logoutAll(userId) {
        const { count } = await this.prisma.session.deleteMany({ where: { userId } });
        this.logger.log(`Revoked ${count} sessions for user: ${userId}`);
    }
    async generateAndPersistTokens(payload, userAgent, ipAddress) {
        const accessExpiresIn = this.configService.get('JWT_EXPIRES_IN_SECONDS', 900);
        const refreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN_SECONDS', 604800);
        const tokenPayload = { sub: payload.sub, email: payload.email, role: payload.role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(tokenPayload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: accessExpiresIn,
            }),
            this.jwtService.signAsync(tokenPayload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: refreshExpiresIn,
            }),
        ]);
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
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map