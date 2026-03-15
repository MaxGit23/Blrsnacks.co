import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Get()
    async findAll(@CurrentUser() user: JwtPayload) {
        return this.addressService.findAllByUser(user.sub);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
        return this.addressService.findById(id, user.sub);
    }

    @Post()
    async create(@Body() dto: CreateAddressDto, @CurrentUser() user: JwtPayload) {
        return this.addressService.create(dto, user.sub);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateAddressDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.addressService.update(id, dto, user.sub);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
        return this.addressService.remove(id, user.sub);
    }
}
