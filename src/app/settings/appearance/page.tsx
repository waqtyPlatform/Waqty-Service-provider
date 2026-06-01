'use client';

import React, { useState } from 'react';
import { Switch, Select, Button, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';
import { Palette } from 'lucide-react';

interface AppearanceSettings {
    theme: string;
    brandColor: string;
    language: string;
    compactSidebar: boolean;
    showAnimations: boolean;
}

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
    },
    cardTitle: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-primary)',
        marginBottom: 'var(--space-1)',
    },
    cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' },
    field: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' },
    label: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' },
    input: {
        height: 42,
        padding: '0 var(--space-4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        width: '100%',
        maxWidth: 400,
    },
};

const fallbackAppearance: AppearanceSettings = {
    theme: 'light',
    brandColor: '#00B166',
    language: 'en',
    compactSidebar: false,
    showAnimations: true,
};

export default function AppearanceSettingsPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();

    const {
        data: settings,
        loading,
        error,
        refetch,
    } = useApiQuery<AppearanceSettings>(
        () =>
            (settingsApi.getAppearanceSettings?.() as
                | Promise<import('@/lib/api').ApiResponse<AppearanceSettings>>
                | undefined) ?? Promise.resolve({ success: true, message: '', data: fallbackAppearance }),
        [],
        { fallbackData: fallbackAppearance }
    );

    const [theme, setTheme] = useState(fallbackAppearance.theme);
    const [brandColor, setBrandColor] = useState(fallbackAppearance.brandColor);
    const [language, setLanguage] = useState(fallbackAppearance.language);
    const [compactSidebar, setCompactSidebar] = useState(fallbackAppearance.compactSidebar);
    const [showAnimations, setShowAnimations] = useState(fallbackAppearance.showAnimations);

    React.useEffect(() => {
        if (settings) {
            setTheme(settings.theme);
            setBrandColor(settings.brandColor);
            setLanguage(settings.language);
            setCompactSidebar(settings.compactSidebar);
            setShowAnimations(settings.showAnimations);
        }
    }, [settings]);

    const handleSave = async () => {
        try {
            const payload = { theme, brandColor, language, compactSidebar, showAnimations };
            if (settingsApi.updateAppearanceSettings) {
                await settingsApi.updateAppearanceSettings(payload);
            }
            // Always persist to localStorage as backup
            localStorage.setItem('hagzy_appearance', JSON.stringify(payload));
            addToast('success', t('settings.appearance.saved'));
            refetch();
        } catch {
            localStorage.setItem(
                'hagzy_appearance',
                JSON.stringify({ theme, brandColor, language, compactSidebar, showAnimations })
            );
            addToast('success', t('settings.appearance.saved'));
        }
    };

    return (
        <div style={cs.page}>
            <DataGuard
                loading={loading}
                error={error}
                data={settings ? [settings] : []}
                emptyIcon={<Palette size={48} />}
                emptyTitle={t('settings.appearance.title')}
                emptyDescription={t('settings.appearance.desc')}
                onRetry={refetch}
                skeletonCount={2}
                skeletonVariant="card"
            >
                <div style={cs.card}>
                    <div style={cs.cardTitle}>{t('settings.appearance.title')}</div>
                    <div style={cs.cardDesc}>{t('settings.appearance.desc')}</div>

                    <div style={cs.field}>
                        <Select
                            label={t('settings.appearance.theme')}
                            options={[
                                { value: 'light', label: t('settings.appearance.themeLight') },
                                { value: 'dark', label: t('settings.appearance.themeDark') },
                                { value: 'system', label: t('settings.appearance.themeSystem') },
                            ]}
                            value={theme}
                            onChange={e => setTheme(e.target.value)}
                            style={{ maxWidth: 400 }}
                        />
                    </div>

                    <div style={cs.field}>
                        <label style={cs.label}>{t('settings.appearance.brandColor')}</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <input
                                type="color"
                                value={brandColor}
                                onChange={e => setBrandColor(e.target.value)}
                                style={{
                                    width: 42,
                                    height: 42,
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                }}
                            />
                            <input
                                style={{ ...cs.input, maxWidth: 120 }}
                                value={brandColor}
                                onChange={e => setBrandColor(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={cs.field}>
                        <Select
                            label={t('settings.appearance.language')}
                            options={[
                                { value: 'en', label: t('settings.appearance.langEn') },
                                { value: 'ar', label: t('settings.appearance.langAr') },
                            ]}
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            style={{ maxWidth: 400 }}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-4)',
                            marginTop: 'var(--space-4)',
                        }}
                    >
                        <Switch
                            checked={compactSidebar}
                            onChange={() => setCompactSidebar(!compactSidebar)}
                            label={t('settings.appearance.compactSidebar')}
                        />
                        <Switch
                            checked={showAnimations}
                            onChange={() => setShowAnimations(!showAnimations)}
                            label={t('settings.appearance.showAnimations')}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleSave}>{t('settings.appearance.saveChanges')}</Button>
                </div>
            </DataGuard>
        </div>
    );
}
