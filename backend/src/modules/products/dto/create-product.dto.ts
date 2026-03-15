import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    name: string;

    @IsString()
    @MinLength(2)
    @MaxLength(200)
    slug: string;

    @IsString()
    @MinLength(10)
    description: string;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;

    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;
}
