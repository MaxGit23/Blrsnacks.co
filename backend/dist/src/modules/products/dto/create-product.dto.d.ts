export declare class CreateProductDto {
    name: string;
    slug: string;
    description: string;
    price: number;
    categoryId: string;
    images?: string[];
    isPublished?: boolean;
}
