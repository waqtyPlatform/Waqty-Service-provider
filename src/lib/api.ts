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
            Accept: 'application/json',
            'Accept-Language': typeof window !== 'undefined' ? localStorage.getItem('hagzy_language') || 'en' : 'en',
            ...(options.headers as Record<string, string>),
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

// ── Response Types ──────────────────────────────────────

export interface ProviderLoginResponse {
    token: string;
    token_type: string;
    expires_in: number;
    provider: {
        uuid: string;
        name: string;
        email: string;
        phone: string;
        code: string | null;
        active: boolean;
        blocked: boolean;
        banned: boolean;
        created_at: string;
        updated_at: string;
    };
}

export interface ProviderProfile {
    uuid: string;
    name: string;
    email: string;
    phone: string;
    code: string | null;
    active: boolean;
    blocked: boolean;
    banned: boolean;
    category?: { uuid: string; name: string };
    branches?: Array<{ uuid: string; name: string; phone: string }>;
    created_at: string;
    updated_at: string;
}

export interface VerifyOtpResponse {
    valid: boolean;
}

export interface Category {
    uuid: string;
    name: string;
    image_url: string | null;
    subcategories_count: number;
    subcategories?: Subcategory[];
}

export interface Subcategory {
    uuid: string;
    name: string;
    category_uuid: string;
}

export interface Country {
    uuid: string;
    name: string;
    code: string;
    cities: City[];
}

export interface City {
    uuid: string;
    name: string;
    country_uuid: string;
}

// ── Phone Helper ────────────────────────────────────────

export function toInternationalPhone(phone: string): string {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    if (cleaned.startsWith('+20')) return cleaned;
    if (cleaned.startsWith('20')) return `+${cleaned}`;
    if (cleaned.startsWith('0')) return `+2${cleaned}`;
    return `+20${cleaned}`;
}

// ── Auth API ────────────────────────────────────────────

export const authApi = {
    login: (email: string, password: string) =>
        api.post<ProviderLoginResponse>('/api/provider/auth/login', { email, password }),

    me: () => api.get<ProviderProfile>('/api/provider/auth/me'),

    logout: () => api.post('/api/provider/auth/logout', {}),

    sendOtp: (email: string) => api.post('/api/provider/auth/send-otp', { email }),

    verifyOtp: (email: string, otp: string) =>
        api.post<VerifyOtpResponse>('/api/provider/auth/verify-otp', { email, otp }),

    resetPassword: (email: string, otp: string, newPassword: string) =>
        api.post('/api/provider/auth/reset-password', {
            email,
            otp,
            new_password: newPassword,
            new_password_confirmation: newPassword,
        }),
};

// ── Public API ──────────────────────────────────────────

export const publicApi = {
    getCategories: () => api.get<Category[]>('/api/public/categories'),

    getCategory: (uuid: string) => api.get<Category>(`/api/public/categories/${uuid}`),

    getSubcategories: (categoryUuid: string) =>
        api.get<Subcategory[]>(`/api/public/categories/${categoryUuid}/subcategories`),

    getCountries: () => api.get<Country[]>('/api/public/countries'),

    getCountry: (uuid: string) => api.get<Country>(`/api/public/countries/${uuid}`),

    getCities: () => api.get<City[]>('/api/public/cities'),
};
