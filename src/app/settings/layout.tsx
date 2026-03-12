'use client';

import React from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { useTranslation } from '@/hooks/useTranslation';

const layoutStyles: Record<string, React.CSSProperties> = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
    },
    header: {
        marginBottom: 'var(--space-2)',
    },
    title: {
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--font-bold)',
        color: 'var(--text-primary)',
    },
    description: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-tertiary)',
        marginTop: 'var(--space-1)',
    },
    body: {
        display: 'flex',
        gap: 'var(--space-6)',
        alignItems: 'flex-start',
    },
    content: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
    },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const { t, lang } = useTranslation();

    return (
        <div style={{ ...layoutStyles.wrapper, direction: lang === 'ar' ? 'rtl' : 'ltr' } as React.CSSProperties}>
            <div style={layoutStyles.header}>
                <h1 style={layoutStyles.title}>{t('settings.title')}</h1>
                <p style={layoutStyles.description}>{t('settings.desc')}</p>
            </div>

            <div style={layoutStyles.body}>
                <SettingsTabs />
                <div style={layoutStyles.content as React.CSSProperties}>
                    {children}
                </div>
            </div>
        </div>
    );
}
