import type { Metadata, Viewport } from 'next';
import './globals.css';
import './responsive.css';
import AppShell from '@/components/layout/AppShell';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
        { media: '(prefers-color-scheme: dark)', color: '#111827' },
    ],
};

export const metadata: Metadata = {
    title: 'Hagzy — Service Provider Dashboard',
    description: 'All-in-one salon, spa & beauty management dashboard',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Hagzy',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" dir="ltr" suppressHydrationWarning>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icons/icon-192.png" />
            </head>
            <body suppressHydrationWarning>
                <ThemeProvider>
                    <LanguageProvider>
                        <AuthProvider>
                            <SettingsProvider>
                                <AppShell>{children}</AppShell>
                            </SettingsProvider>
                        </AuthProvider>
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
