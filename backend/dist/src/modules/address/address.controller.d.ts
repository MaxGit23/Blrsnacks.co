import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';
export declare class AddressController {
    private readonly addressService;
    constructor(addressService: AddressService);
    findAll(user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        isDefault: boolean;
    }[]>;
    findOne(id: string, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        isDefault: boolean;
    }>;
    create(dto: CreateAddressDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        isDefault: boolean;
    }>;
    update(id: string, dto: UpdateAddressDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        isDefault: boolean;
    }>;
    remove(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
}
