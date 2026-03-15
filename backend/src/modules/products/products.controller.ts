import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
    Logger,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
    private readonly logger = new Logger(ProductsController.name);

    constructor(private readonly productsService: ProductsService) { }

    // ─── Public Routes ─────────────────────────────────────────────────────────

    @Get()
    async findAll(@Query() query: QueryProductDto) {
        return this.productsService.findAll({ ...query, isPublished: true });
    }

    @Get(':slug')
    async findBySlug(@Param('slug') slug: string) {
        return this.productsService.findBySlug(slug);
    }

    // ─── Admin Routes ──────────────────────────────────────────────────────────

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async create(
        @Body() dto: CreateProductDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.create(dto, user.sub);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.update(id, dto, user.sub);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async remove(@Param('id') id: string) {
        return this.productsService.softDelete(id);
    }

    @Post(':id/images')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
            fileFilter: (_req, file, cb) => {
                if (!file.mimetype.match(/^image\/(jpeg|png|webp|avif)$/)) {
                    cb(new Error('Only image files (jpeg, png, webp, avif) are allowed'), false);
                } else {
                    cb(null, true);
                }
            },
        }),
    )
    async uploadImages(
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File[],
        @CurrentUser() user: JwtPayload,
    ) {
        // In production, upload to S3/R2 and return URLs
        // For now, generate local placeholder paths
        const imageUrls = files.map(
            (file) => `/uploads/products/${id}/${file.originalname}`,
        );

        this.logger.log(`Uploaded ${files.length} images for product ${id}`);
        return this.productsService.updateImages(id, imageUrls, user.sub);
    }
}
