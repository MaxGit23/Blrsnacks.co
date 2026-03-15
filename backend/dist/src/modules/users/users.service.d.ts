import { PrismaService } from '../../prisma/prisma.service';
import { Role, User } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    create(data: {
        email: string;
        passwordHash?: string;
        googleId?: string;
        role?: Role;
    }): Promise<User>;
    linkGoogleId(userId: string, googleId: string): Promise<User>;
    findAll(): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
