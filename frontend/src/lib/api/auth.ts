export interface User {
    id: string;
    email: string;
    role: 'CUSTOMER' | 'ADMIN';
    createdAt: string;
}
