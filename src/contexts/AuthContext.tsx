'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ApiError, authApi } from '@/lib/api';
import { type BusinessCategory, normalizeBusinessCategory } from '@/lib/contract';
import { safeJsonParse } from '@/lib/storage';

export type UserRole = 'admin' | 'manager' | 'staff';
// PR-10: the canonical business category (salon|barber|clinic|spa|nails|other).
export type BusinessType = BusinessCategory;

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
    forgotPassword: (identifier: string) => Promise<{ success: boolean; type: 'email' | 'phone'; error?: string }>;
    verifyOtpCode: (email: string, otp: string) => Promise<{ success: boolean; valid?: boolean; error?: string }>;
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
    'clinic@waqty.com': {
        id: 'U1',
        name: 'Dr. Admin',
        email: 'clinic@waqty.com',
        role: 'admin',
        businessType: 'clinic',
    },
    'salon@waqty.com': {
        id: 'U2',
        name: 'Salon Admin',
        email: 'salon@waqty.com',
        role: 'admin',
        businessType: 'salon',
    },
    'barber@waqty.com': {
        id: 'U3',
        name: 'Barber Admin',
        email: 'barber@waqty.com',
        role: 'admin',
        businessType: 'barber',
    },
    'manager@waqty.com': {
        id: 'U4',
        name: 'Shift Manager',
        email: 'manager@waqty.com',
        role: 'manager',
        businessType: 'salon',
    },
    'staff@waqty.com': {
        id: 'U5',
        name: 'Receptionist',
        email: 'staff@waqty.com',
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

    // Helper to set/clear the middleware cookie marker.
    // NOTE: role is intentionally NOT stored in a cookie — RoleGuard reads it from
    // AuthContext on the client. A client-set cookie would be forgeable.
    const setAuthCookie = useCallback((loggedIn: boolean) => {
        if (loggedIn) {
            document.cookie = `waqty_logged_in=true;path=/;max-age=${60 * 60 * 24 * 30};SameSite=Lax`;
        } else {
            document.cookie = 'waqty_logged_in=;path=/;max-age=0';
            // Clear legacy cookie set by previous versions of this app.
            document.cookie = 'waqty_auth=;path=/;max-age=0';
        }
    }, []);

    useEffect(() => {
        // Hydrate from localStorage — use queueMicrotask to avoid synchronous setState in effect
        const storedUser = localStorage.getItem('waqty_user');
        const storedToken = localStorage.getItem('waqty_provider_token');
        const parsed = safeJsonParse<User | null>(storedUser, null);
        if (parsed && storedToken) {
            queueMicrotask(() => {
                setUser(parsed);
                setAuthCookie(true);
                setLoading(false);
            });
        } else {
            // Clear partial or corrupt state if token or user is missing/invalid
            localStorage.removeItem('waqty_user');
            localStorage.removeItem('waqty_provider_token');
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

    const login = useCallback(
        async (identifier: string, password: string) => {
            try {
                const res = await authApi.login(identifier, password);

                if (res.success && res.data) {
                    const { token, provider } = res.data;
                    localStorage.setItem('waqty_provider_token', token);

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

                    // Enrich with profile data (category, etc.)
                    try {
                        const profile = await authApi.me();
                        if (profile.success && profile.data) {
                            if (profile.data.category?.name) {
                                // PR-10: derive the canonical category deterministically.
                                loggedInUser.businessType = normalizeBusinessCategory(profile.data.category.name);
                            }
                        }
                    } catch {
                        // Profile fetch is optional — proceed with defaults
                    }

                    setUser(loggedInUser);
                    localStorage.setItem('waqty_user', JSON.stringify(loggedInUser));
                    setAuthCookie(true);
                    router.push('/');
                    return { success: true, user: loggedInUser };
                }

                return { success: false, error: res.message || 'Login failed' };
            } catch (err: unknown) {
                const message = err instanceof ApiError ? err.message : 'Invalid email or password';
                return { success: false, error: message };
            }
        },
        [router, setAuthCookie]
    );

    const requestOTP = useCallback(async (identifier: string) => {
        const type = identifier.includes('@') ? 'email' : 'phone';
        const res = await authApi.sendOtp(identifier);
        return { success: !!res.success, type } as const;
    }, []);

    const verifyOTP = useCallback(
        async (identifier: string, code: string, redirect = true) => {
            try {
                const res = await authApi.verifyOtp(identifier, code);
                if (!res.success || res.data?.valid === false) {
                    return { success: false, error: res.message || 'Invalid verification code' };
                }

                const verifiedUser = MOCK_USERS[identifier] || MOCK_USERS['clinic@waqty.com'];
                setUser(verifiedUser);
                localStorage.setItem('waqty_user', JSON.stringify(verifiedUser));
                setAuthCookie(true);
                if (redirect) {
                    router.push('/');
                }
                return { success: true, user: verifiedUser };
            } catch (err: unknown) {
                const message = err instanceof ApiError ? err.message : 'Invalid verification code';
                return { success: false, error: message };
            }
        },
        [router, setAuthCookie]
    );

    const forgotPassword = useCallback(async (identifier: string) => {
        try {
            const res = await authApi.sendOtp(identifier);
            if (res.success) {
                const type = identifier.includes('@') ? 'email' : 'phone';
                return { success: true, type } as const;
            }
            return { success: false, type: 'email' as const, error: res.message || 'Failed to send reset code' };
        } catch (err: unknown) {
            if (err instanceof ApiError && err.status === 429) {
                return {
                    success: false,
                    type: 'email' as const,
                    error: 'Too many attempts. Please wait and try again.',
                };
            }
            const message = err instanceof ApiError ? err.message : 'Failed to send reset code';
            return { success: false, type: 'email' as const, error: message };
        }
    }, []);

    const verifyOtpCode = useCallback(async (email: string, otp: string) => {
        try {
            const res = await authApi.verifyOtp(email, otp);
            if (res.success && res.data) {
                return { success: true, valid: res.data.valid };
            }
            return { success: false, valid: false, error: res.message || 'Invalid code' };
        } catch (err: unknown) {
            const message = err instanceof ApiError ? err.message : 'Invalid or expired code';
            return { success: false, valid: false, error: message };
        }
    }, []);

    const resetPassword = useCallback(async (identifier: string, code: string, newPassword: string) => {
        try {
            const res = await authApi.resetPassword(identifier, code, newPassword);
            if (res.success) return { success: true };
            return { success: false, error: res.message || 'Failed to reset password' };
        } catch (err: unknown) {
            if (err instanceof ApiError && err.status === 429) {
                return { success: false, error: 'Too many attempts. Please wait and try again.' };
            }
            const message = err instanceof ApiError ? err.message : 'Failed to reset password';
            return { success: false, error: message };
        }
    }, []);

    const updateUser = useCallback((data: Partial<User>) => {
        setUser(prev => {
            if (!prev) return prev;
            const updated = { ...prev, ...data };
            localStorage.setItem('waqty_user', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            // Ignore logout API errors — clear local state regardless
        }
        localStorage.removeItem('waqty_provider_token');
        setUser(null);
        localStorage.removeItem('waqty_user');
        setAuthCookie(false);
        router.push('/login');
    }, [router, setAuthCookie]);

    const value = useMemo(
        () => ({
            user,
            login,
            requestOTP,
            verifyOTP,
            forgotPassword,
            verifyOtpCode,
            resetPassword,
            updateUser,
            logout,
            loading,
        }),
        [user, login, requestOTP, verifyOTP, forgotPassword, verifyOtpCode, resetPassword, updateUser, logout, loading]
    );

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
