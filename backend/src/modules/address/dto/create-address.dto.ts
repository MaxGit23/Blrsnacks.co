import { IsString, IsBoolean, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateAddressDto {
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    street: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    city: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    state: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    zip: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    country: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}
