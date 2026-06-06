import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import './responsive.css';
import AppShell from '@/components/layout/AppShell';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Self-host fonts via `next/font/google` (same-origin, no cross-origin round-trip
// to fonts.googleapis.com → fonts.gstatic.com that was costing ~400ms of LCP).
// Design Language v2 — "Refined & premium": IBM Plex Sans (Latin UI), IBM Plex
// Sans Arabic (RTL), IBM Plex Mono (money / tabular figures). Plex tops out at 700.
const plexSans = IBM_Plex_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-plex-sans',
});

const plexArabic = IBM_Plex_Sans_Arabic({
    subsets: ['arabic'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-plex-arabic',
});

const plexMono = IBM_Plex_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-plex-mono',
});

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
    title: 'Waqty — Service Provider Dashboard',
    description: 'All-in-one salon, spa & beauty management dashboard',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Waqty',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            dir="ltr"
            suppressHydrationWarning
            className={`${plexSans.variable} ${plexArabic.variable} ${plexMono.variable}`}
        >
            <head>
                <link rel="manifest" href="/manifest.json" />
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
