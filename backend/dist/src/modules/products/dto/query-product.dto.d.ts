export declare class QueryProductDto {
    search?: string;
    categoryId?: string;
    categorySlug?: string;
    isPublished?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
