import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInventoryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;
}
