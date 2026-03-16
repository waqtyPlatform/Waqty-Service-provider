const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://waqty.alemtayaz.shop/public';

interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('hagzy_token');
    }

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        const token = this.getToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Language': typeof window !== 'undefined'
                ? (localStorage.getItem('hagzy_language') || 'en')
                : 'en',
            ...options.headers as Record<string, string>,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        const data: ApiResponse<T> = await response.json();

        if (!response.ok) {
            throw { status: response.status, ...data };
        }

        return data;
    }

    async post<T>(endpoint: string, body: Record<string, unknown>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async put<T>(endpoint: string, body: Record<string, unknown>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    async patch<T>(endpoint: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiClient(API_BASE_URL);
export type { ApiResponse };
