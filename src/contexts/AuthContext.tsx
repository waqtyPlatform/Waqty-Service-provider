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
}

interface AuthContextType {
    user: User | null;
    requestOTP: (identifier: string) => Promise<{ success: boolean, type: 'email' | 'phone' }>;
    verifyOTP: (identifier: string, code: string) => Promise<{ success: boolean, user?: User, error?: string }>;
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
            if (!user && pathname !== '/login') {
                router.push('/login');
            } else if (user && pathname === '/login') {
                router.push('/'); // Redirect to dashboard if logged in
            }
        }
    }, [user, loading, pathname, router]);

    const requestOTP = async (identifier: string) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Basic detection for demo: if it has an '@', it's an email; otherwise assume phone.
        const type = identifier.includes('@') ? 'email' : 'phone';

        // In a real app we'd dispatch the OTP here.
        console.log(`Mock OTP requested for ${type}: ${identifier}`);
        return { success: true, type } as const;
    };

    const verifyOTP = async (identifier: string, code: string) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For the demo, "123456" is the magical successful code.
        if (code !== '123456') {
            return { success: false, error: 'Invalid verification code' };
        }

        // Logic to get the right mock user based on the email. If they enter a random email, default to admin to appease the demo.
        const mockUser = MOCK_USERS[identifier] || MOCK_USERS['clinic@hagzy.com'];

        setUser(mockUser);
        localStorage.setItem('hagzy_user', JSON.stringify(mockUser));
        router.push('/');
        return { success: true, user: mockUser };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hagzy_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, requestOTP, verifyOTP, logout, loading }}>
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
