'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'admin' | 'manager' | 'staff';
export type BusinessType = 'clinic' | 'salon' | 'barber';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    businessType: BusinessType;
    isNewWorkspace?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (identifier: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
    requestOTP: (identifier: string) => Promise<{ success: boolean; type: 'email' | 'phone' }>;
    verifyOTP: (identifier: string, code: string, redirect?: boolean) => Promise<{ success: boolean; user?: User; error?: string }>;
    forgotPassword: (identifier: string) => Promise<{ success: boolean; type: 'email' | 'phone' }>;
    resetPassword: (identifier: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
    updateUser: (data: Partial<User>) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users for Demo
export const MOCK_USERS: Record<string, User> = {
    'clinic@hagzy.com': { id: 'U1', name: 'Dr. Admin', email: 'clinic@hagzy.com', role: 'admin', businessType: 'clinic' },
    'salon@hagzy.com': { id: 'U2', name: 'Salon Admin', email: 'salon@hagzy.com', role: 'admin', businessType: 'salon' },
    'barber@hagzy.com': { id: 'U3', name: 'Barber Admin', email: 'barber@hagzy.com', role: 'admin', businessType: 'barber' },
    'manager@hagzy.com': { id: 'U4', name: 'Shift Manager', email: 'manager@hagzy.com', role: 'manager', businessType: 'salon' },
    'staff@hagzy.com': { id: 'U5', name: 'Receptionist', email: 'staff@hagzy.com', role: 'staff', businessType: 'salon' },
};

// Mock password for demo — any password with 6+ characters works
const MOCK_PASSWORD = 'password';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Hydrate from localStorage
        const storedUser = localStorage.getItem('hagzy_user');
        if (storedUser) {
            Promise.resolve().then(() => setUser(JSON.parse(storedUser)));
        }
        Promise.resolve().then(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!loading) {
            const isPublicRoute = pathname === '/login' || pathname === '/onboarding' || pathname === '/forgot-password' || pathname.startsWith('/invite/');
            if (!user && !isPublicRoute) {
                router.push('/login');
            } else if (user && pathname === '/login') {
                router.push('/');
            }
        }
    }, [user, loading, pathname, router]);

    const login = async (identifier: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For the demo, any password with 6+ characters works
        if (password.length < 6) {
            return { success: false, error: 'Invalid email/phone or password' };
        }

        const mockUser = MOCK_USERS[identifier] || MOCK_USERS['clinic@hagzy.com'];
        setUser(mockUser);
        localStorage.setItem('hagzy_user', JSON.stringify(mockUser));
        router.push('/');
        return { success: true, user: mockUser };
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

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hagzy_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, requestOTP, verifyOTP, forgotPassword, resetPassword, updateUser, logout, loading }}>
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
