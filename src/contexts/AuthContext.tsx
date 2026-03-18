'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export type UserRole = 'admin' | 'manager' | 'staff';
export type BusinessType = 'clinic' | 'salon' | 'barber';

export interface User {
    id: string;
    uuid?: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    businessType: BusinessType;
    active?: boolean;
    blocked?: boolean;
    banned?: boolean;
    isNewWorkspace?: boolean;
}

interface ProviderLoginResponse {
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

interface AuthContextType {
    user: User | null;
    login: (identifier: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
    requestOTP: (identifier: string) => Promise<{ success: boolean; type: 'email' | 'phone' }>;
    verifyOTP: (
        identifier: string,
        code: string,
        redirect?: boolean
    ) => Promise<{ success: boolean; user?: User; error?: string }>;
    forgotPassword: (identifier: string) => Promise<{ success: boolean; type: 'email' | 'phone' }>;
    resetPassword: (
        identifier: string,
        code: string,
        newPassword: string
    ) => Promise<{ success: boolean; error?: string }>;
    updateUser: (data: Partial<User>) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users for Demo
export const MOCK_USERS: Record<string, User> = {
    'clinic@hagzy.com': {
        id: 'U1',
        name: 'Dr. Admin',
        email: 'clinic@hagzy.com',
        role: 'admin',
        businessType: 'clinic',
    },
    'salon@hagzy.com': {
        id: 'U2',
        name: 'Salon Admin',
        email: 'salon@hagzy.com',
        role: 'admin',
        businessType: 'salon',
    },
    'barber@hagzy.com': {
        id: 'U3',
        name: 'Barber Admin',
        email: 'barber@hagzy.com',
        role: 'admin',
        businessType: 'barber',
    },
    'manager@hagzy.com': {
        id: 'U4',
        name: 'Shift Manager',
        email: 'manager@hagzy.com',
        role: 'manager',
        businessType: 'salon',
    },
    'staff@hagzy.com': {
        id: 'U5',
        name: 'Receptionist',
        email: 'staff@hagzy.com',
        role: 'staff',
        businessType: 'salon',
    },
};

// Mock password for demo — any password with 6+ characters works
const MOCK_PASSWORD = 'password';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Helper to set/clear middleware cookie marker
    const setAuthCookie = (loggedIn: boolean, role?: string) => {
        if (loggedIn) {
            document.cookie = `hagzy_logged_in=true;path=/;max-age=${60 * 60 * 24 * 30};SameSite=Lax`;
            if (role) {
                document.cookie = `hagzy_auth=${JSON.stringify({ token: true, role })};path=/;max-age=${60 * 60 * 24 * 30};SameSite=Lax`;
            }
        } else {
            document.cookie = 'hagzy_logged_in=;path=/;max-age=0';
            document.cookie = 'hagzy_auth=;path=/;max-age=0';
        }
    };

    useEffect(() => {
        // Hydrate from localStorage — use queueMicrotask to avoid synchronous setState in effect
        const storedUser = localStorage.getItem('hagzy_user');
        const storedToken = localStorage.getItem('hagzy_token');
        if (storedUser && storedToken) {
            const parsed = JSON.parse(storedUser);
            queueMicrotask(() => {
                setUser(parsed);
                setAuthCookie(true, parsed.role);
                setLoading(false);
            });
        } else {
            // Clear partial state if token or user is missing
            localStorage.removeItem('hagzy_user');
            localStorage.removeItem('hagzy_token');
            setAuthCookie(false);
            queueMicrotask(() => setLoading(false));
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            const isPublicRoute =
                pathname === '/login' ||
                pathname === '/onboarding' ||
                pathname === '/forgot-password' ||
                pathname.startsWith('/invite/');
            if (!user && !isPublicRoute) {
                router.push('/login');
            } else if (user && pathname === '/login') {
                router.push('/');
            }
        }
    }, [user, loading, pathname, router]);

    const login = async (identifier: string, password: string) => {
        try {
            const res = await api.post<ProviderLoginResponse>('/api/provider/auth/login', {
                email: identifier,
                password,
            });

            if (res.success && res.data) {
                const { token, provider } = res.data;

                // Store JWT token
                localStorage.setItem('hagzy_token', token);

                // Map provider data to User
                const loggedInUser: User = {
                    id: provider.uuid,
                    uuid: provider.uuid,
                    name: provider.name,
                    email: provider.email,
                    phone: provider.phone,
                    role: 'admin',
                    businessType: 'salon',
                    active: provider.active,
                    blocked: provider.blocked,
                    banned: provider.banned,
                };

                setUser(loggedInUser);
                localStorage.setItem('hagzy_user', JSON.stringify(loggedInUser));
                setAuthCookie(true, loggedInUser.role);
                router.push('/');
                return { success: true, user: loggedInUser };
            }

            return { success: false, error: res.message || 'Login failed' };
        } catch (err: unknown) {
            const error = err as { message?: string; status?: number };
            return { success: false, error: error.message || 'Invalid email or password' };
        }
    };

    const requestOTP = async (identifier: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const type = identifier.includes('@') ? 'email' : 'phone';
        console.log(`Mock OTP requested for ${type}: ${identifier}`);
        return { success: true, type } as const;
    };

    const verifyOTP = async (identifier: string, code: string, redirect = true) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (code !== '123456') {
            return { success: false, error: 'Invalid verification code' };
        }

        const mockUser = MOCK_USERS[identifier] || MOCK_USERS['clinic@hagzy.com'];
        setUser(mockUser);
        localStorage.setItem('hagzy_user', JSON.stringify(mockUser));
        setAuthCookie(true, mockUser.role);
        if (redirect) {
            router.push('/');
        }
        return { success: true, user: mockUser };
    };

    const forgotPassword = async (identifier: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const type = identifier.includes('@') ? 'email' : 'phone';
        console.log(`Mock reset OTP sent to ${type}: ${identifier}`);
        return { success: true, type } as const;
    };

    const resetPassword = async (identifier: string, code: string, newPassword: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (code !== '123456') {
            return { success: false, error: 'Invalid verification code' };
        }

        if (newPassword.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters' };
        }

        console.log(`Mock password reset for: ${identifier}`);
        return { success: true };
    };

    const updateUser = (data: Partial<User>) => {
        setUser(prev => {
            if (!prev) return prev;
            const updated = { ...prev, ...data };
            localStorage.setItem('hagzy_user', JSON.stringify(updated));
            return updated;
        });
    };

    const logout = async () => {
        try {
            await api.post('/api/provider/auth/logout', {});
        } catch {
            // Ignore logout API errors — clear local state regardless
        }
        localStorage.removeItem('hagzy_token');
        setUser(null);
        localStorage.removeItem('hagzy_user');
        setAuthCookie(false);
        router.push('/login');
    };

    return (
        <AuthContext.Provider
            value={{ user, login, requestOTP, verifyOTP, forgotPassword, resetPassword, updateUser, logout, loading }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
