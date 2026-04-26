import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import './responsive.css';
import AppShell from '@/components/layout/AppShell';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Self-host the same fonts that were previously fetched at runtime via
// `@import url('https://fonts.googleapis.com/...')` in globals.css. Doing it
// through `next/font/google` eliminates the cross-origin round-trip
// (fonts.googleapis.com → fonts.gstatic.com → woff2) that was costing ~400ms
// of LCP on cold load. Fonts are bundled with the app and served same-origin.
const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
    variable: '--font-inter',
});

const notoSansArabic = Noto_Sans_Arabic({
    subsets: ['arabic'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
    variable: '--font-noto-arabic',
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
        <html lang="en" dir="ltr" suppressHydrationWarning className={`${inter.variable} ${notoSansArabic.variable}`}>
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
