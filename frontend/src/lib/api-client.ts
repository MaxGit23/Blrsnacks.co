// ─────────────────────────────────────────────────────────────────────────────
// STATIC SITE MODE — the REST layer is disabled.
// Every API method rejects immediately without touching the network so that
// pages can fall back to the local demo catalogue in `lib/mock-products.ts`.
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
    data: T;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ApiError {
    statusCode: number;
    message: string;
    error?: string;
}

/** Thrown by every API method while the site runs in static mode. */
export class ApiClientDisabledError extends Error {
    constructor() {
        super('API disabled — this site is running in static mode without a backend.');
        this.name = 'ApiClientDisabledError';
    }
}

class ApiClient {
    private async request<T>(): Promise<T> {
        throw new ApiClientDisabledError();
    }

    async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
        void endpoint;
        void params;
        return this.request<T>();
    }

    async post<T>(endpoint: string, body?: unknown): Promise<T> {
        void endpoint;
        void body;
        return this.request<T>();
    }

    async put<T>(endpoint: string, body?: unknown): Promise<T> {
        void endpoint;
        void body;
        return this.request<T>();
    }

    async patch<T>(endpoint: string, body?: unknown): Promise<T> {
        void endpoint;
        void body;
        return this.request<T>();
    }

    async delete<T>(endpoint: string, body?: unknown): Promise<T> {
        void endpoint;
        void body;
        return this.request<T>();
    }
}

export const api = new ApiClient();
export default api;
