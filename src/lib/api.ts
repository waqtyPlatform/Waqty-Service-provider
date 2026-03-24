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

    async postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
        const token = this.getToken();
        const headers: Record<string, string> = {
            Accept: 'application/json',
            'Accept-Language': typeof window !== 'undefined' ? localStorage.getItem('hagzy_language') || 'en' : 'en',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData,
        });
        const data: ApiResponse<T> = await response.json();
        if (!response.ok) throw { status: response.status, ...data };
        return data;
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

// ── Provider Resource Types ─────────────────────────────

export interface Branch {
    uuid: string;
    name: string;
    phone: string;
    city_uuid: string;
    city?: { uuid: string; name: string };
    latitude: number | null;
    longitude: number | null;
    active: boolean;
    is_main: boolean;
    created_at: string;
    updated_at: string;
}

export interface Employee {
    uuid: string;
    name: string;
    email: string;
    phone: string;
    branch_uuid: string;
    branch?: { uuid: string; name: string };
    active: boolean;
    blocked: boolean;
    created_at: string;
    updated_at: string;
}

export interface Service {
    uuid: string;
    name: string;
    description: string | null;
    sub_category_uuid: string | null;
    sub_category?: { uuid: string; name: string };
    estimated_duration_minutes: number | null;
    image_url: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ShiftTemplate {
    uuid: string;
    name: string;
    start_time: string;
    end_time: string;
    break_start: string | null;
    break_end: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Shift {
    uuid: string;
    title: string | null;
    start_time: string;
    end_time: string;
    break_start: string | null;
    break_end: string | null;
    active: boolean;
    dates?: ShiftDate[];
    employees?: Employee[];
    created_at: string;
    updated_at: string;
}

export interface ShiftDate {
    uuid: string;
    date: string;
    shift_uuid: string;
}

export interface ServicePrice {
    uuid: string;
    service_uuid: string;
    service?: Service;
    branch_uuid: string | null;
    branch?: Branch;
    employee_uuid: string | null;
    employee?: Employee;
    pricing_group_uuid: string | null;
    pricing_group?: PricingGroup;
    price: number;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PricingGroup {
    uuid: string;
    name: string;
    active: boolean;
    employees?: Employee[];
    created_at: string;
    updated_at: string;
}

export interface Booking {
    uuid: string;
    branch_uuid: string;
    branch?: Branch;
    service_uuid: string;
    service?: Service;
    employee_uuid: string | null;
    employee?: Employee;
    user?: { uuid: string; name: string; email: string; phone: string };
    booking_date: string;
    start_time: string;
    end_time: string | null;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface AttendanceRecord {
    uuid: string;
    employee_uuid: string;
    employee?: Employee;
    shift_date_uuid: string | null;
    check_in: string;
    check_out: string | null;
    working_minutes: number | null;
    notes: string | null;
    created_at: string;
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

// ── Provider API ────────────────────────────────────────

export const providerApi = {
    // Profile
    updateProfile: (formData: FormData) => api.postFormData<ProviderProfile>('/api/provider/profile', formData),

    // Branches
    getBranches: () => api.get<Branch[]>('/api/provider/branches'),
    getBranch: (uuid: string) => api.get<Branch>(`/api/provider/branches/${uuid}`),
    createBranch: (data: Record<string, unknown>) => api.post<Branch>('/api/provider/branches', data),
    updateBranch: (uuid: string, data: Record<string, unknown>) =>
        api.put<Branch>(`/api/provider/branches/${uuid}`, data),
    deleteBranch: (uuid: string) => api.delete(`/api/provider/branches/${uuid}`),
    setMainBranch: (uuid: string) => api.patch(`/api/provider/branches/${uuid}/main`),

    // Employees
    getEmployees: () => api.get<Employee[]>('/api/provider/employees'),
    getEmployee: (uuid: string) => api.get<Employee>(`/api/provider/employees/${uuid}`),
    createEmployee: (data: Record<string, unknown>) => api.post<Employee>('/api/provider/employees', data),
    updateEmployee: (uuid: string, data: Record<string, unknown>) =>
        api.put<Employee>(`/api/provider/employees/${uuid}`, data),
    deleteEmployee: (uuid: string) => api.delete(`/api/provider/employees/${uuid}`),
    toggleEmployeeActive: (uuid: string, active: boolean) =>
        api.patch(`/api/provider/employees/${uuid}/active`, { active }),
    toggleEmployeeBlock: (uuid: string, blocked: boolean) =>
        api.patch(`/api/provider/employees/${uuid}/block`, { blocked }),

    // Services
    getServices: () => api.get<Service[]>('/api/provider/services'),
    getService: (uuid: string) => api.get<Service>(`/api/provider/services/${uuid}`),
    createService: (formData: FormData) => api.postFormData<Service>('/api/provider/services', formData),
    updateService: (uuid: string, formData: FormData) =>
        api.postFormData<Service>(`/api/provider/services/${uuid}`, formData),
    deleteService: (uuid: string) => api.delete(`/api/provider/services/${uuid}`),
    toggleServiceActive: (uuid: string, active: boolean) =>
        api.patch(`/api/provider/services/${uuid}/active`, { active }),

    // Shift Templates
    getShiftTemplates: () => api.get<ShiftTemplate[]>('/api/provider/shift-templates'),
    getShiftTemplate: (uuid: string) => api.get<ShiftTemplate>(`/api/provider/shift-templates/${uuid}`),
    createShiftTemplate: (data: Record<string, unknown>) =>
        api.post<ShiftTemplate>('/api/provider/shift-templates', data),
    updateShiftTemplate: (uuid: string, data: Record<string, unknown>) =>
        api.put<ShiftTemplate>(`/api/provider/shift-templates/${uuid}`, data),
    deleteShiftTemplate: (uuid: string) => api.delete(`/api/provider/shift-templates/${uuid}`),
    toggleShiftTemplateActive: (uuid: string, active: boolean) =>
        api.patch(`/api/provider/shift-templates/${uuid}/active`, { active }),

    // Shifts
    getShifts: () => api.get<Shift[]>('/api/provider/shifts'),
    getShift: (uuid: string) => api.get<Shift>(`/api/provider/shifts/${uuid}`),
    createShift: (data: Record<string, unknown>) => api.post<Shift>('/api/provider/shifts', data),
    updateShift: (uuid: string, data: Record<string, unknown>) => api.put<Shift>(`/api/provider/shifts/${uuid}`, data),
    deleteShift: (uuid: string) => api.delete(`/api/provider/shifts/${uuid}`),

    // Service Prices
    getServicePrices: () => api.get<ServicePrice[]>('/api/provider/service-prices'),
    getServicePrice: (uuid: string) => api.get<ServicePrice>(`/api/provider/service-prices/${uuid}`),
    createServicePrice: (data: Record<string, unknown>) => api.post<ServicePrice>('/api/provider/service-prices', data),
    updateServicePrice: (uuid: string, data: Record<string, unknown>) =>
        api.put<ServicePrice>(`/api/provider/service-prices/${uuid}`, data),
    deleteServicePrice: (uuid: string) => api.delete(`/api/provider/service-prices/${uuid}`),
    toggleServicePriceActive: (uuid: string) => api.patch(`/api/provider/service-prices/${uuid}/active`),

    // Pricing Groups
    getPricingGroups: () => api.get<PricingGroup[]>('/api/provider/pricing-groups'),
    getPricingGroup: (uuid: string) => api.get<PricingGroup>(`/api/provider/pricing-groups/${uuid}`),
    createPricingGroup: (data: Record<string, unknown>) => api.post<PricingGroup>('/api/provider/pricing-groups', data),
    updatePricingGroup: (uuid: string, data: Record<string, unknown>) =>
        api.put<PricingGroup>(`/api/provider/pricing-groups/${uuid}`, data),
    deletePricingGroup: (uuid: string) => api.delete(`/api/provider/pricing-groups/${uuid}`),
    togglePricingGroupActive: (uuid: string) => api.patch(`/api/provider/pricing-groups/${uuid}/active`),
    syncPricingGroupEmployees: (uuid: string, employeeUuids: string[]) =>
        api.put(`/api/provider/pricing-groups/${uuid}/employees`, { employee_uuids: employeeUuids }),
    addPricingGroupEmployees: (uuid: string, employeeUuids: string[]) =>
        api.post(`/api/provider/pricing-groups/${uuid}/employees`, { employee_uuids: employeeUuids }),
    removePricingGroupEmployees: (uuid: string, _employeeUuids: string[]) =>
        api.delete(`/api/provider/pricing-groups/${uuid}/employees`),

    // Bookings
    getBookings: () => api.get<Booking[]>('/api/provider/bookings'),
    getBooking: (uuid: string) => api.get<Booking>(`/api/provider/bookings/${uuid}`),
    updateBookingStatus: (uuid: string, status: string) =>
        api.patch(`/api/provider/bookings/${uuid}/status`, { status }),

    // Attendance
    getAttendance: () => api.get<AttendanceRecord[]>('/api/provider/attendance'),
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
