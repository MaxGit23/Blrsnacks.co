import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role, User } from '@prisma/client';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async findByGoogleId(googleId: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { googleId } });
    }

    async create(data: {
        email: string;
        passwordHash?: string;
        googleId?: string;
        role?: Role;
    }): Promise<User> {
        this.logger.log(`Creating user: ${data.email}`);
        return this.prisma.user.create({ data });
    }

    async linkGoogleId(userId: string, googleId: string): Promise<User> {
        return this.prisma.user.update({
            where: { id: userId },
            data: { googleId },
        });
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}
