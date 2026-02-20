'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of our settings
export interface SettingsState {
    businessName: string;
    legalName: string;
    crNumber: string; // Commercial Registration
    vatNumber: string;
    address: string;
    phone: string;
    email: string;

    // Preferences
    allowOnlineBooking: boolean;
    allowWalkIn: boolean;
    requireDeposit: boolean;
    sendSmsReminders: boolean;
    autoConfirm: boolean;
    defaultGap: number;
    cancellationWindow: number;
}

// Default values
const defaultSettings: SettingsState = {
    businessName: 'Hagzy Beauty Salon',
    legalName: 'Hagzy Beauty Services LLC',
    crNumber: 'CR-2024-12345',
    vatNumber: '300-456-789',
    address: '12 El-Nozha St, Heliopolis, Cairo, Egypt',
    phone: '+20 2 1234 5678',
    email: 'info@hagzy.com',
    allowOnlineBooking: true,
    allowWalkIn: true,
    requireDeposit: false,
    sendSmsReminders: true,
    autoConfirm: true,
    defaultGap: 15,
    cancellationWindow: 24,
};

interface SettingsContextType {
    settings: SettingsState;
    updateSettings: (newSettings: Partial<SettingsState>) => void;
    resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SettingsState>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('hagzy_settings');
            if (stored) {
                setSettings({ ...defaultSettings, ...JSON.parse(stored) });
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Update settings wrapper
    const updateSettings = (newSettings: Partial<SettingsState>) => {
        setSettings((prev) => {
            const updated = { ...prev, ...newSettings };
            try {
                localStorage.setItem('hagzy_settings', JSON.stringify(updated));
            } catch (error) {
                console.error('Failed to save settings', error);
            }
            return updated;
        });
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.removeItem('hagzy_settings');
    };

    // Prevent hydration mismatch by rendering children only after load (optional, 
    // but for settings usually fine to render defaults or loading state)
    // For dashboard, immediate render with defaults is often acceptable to avoid flicker

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
