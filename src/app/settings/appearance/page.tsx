'use client';

import React from 'react';
import { Switch, Select, Button } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' },
    cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' },
    field: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' },
    label: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' },
    input: { height: 42, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', width: '100%', maxWidth: 400 },
};

export default function AppearanceSettingsPage() {
    const { t } = useTranslation();
    return (
        <div style={cs.page}>
<div style={cs.card}>
                <div style={cs.cardTitle}>{t('settings.appearance.title')}</div>
                <div style={cs.cardDesc}>{t('settings.appearance.desc')}</div>

                <div style={cs.field}>
                    <Select
                        label={t('settings.appearance.theme')}
                        options={[
                            { value: 'light', label: t('settings.appearance.themeLight') },
                            { value: 'dark', label: t('settings.appearance.themeDark') },
                            { value: 'system', label: t('settings.appearance.themeSystem') }
                        ]}
                        defaultValue="light"
                        style={{ maxWidth: 400 }}
                    />
                </div>

                <div style={cs.field}>
                    <label style={cs.label}>{t('settings.appearance.brandColor')}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <input type="color" defaultValue="#00B166" style={{ width: 42, height: 42, border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} />
                        <input style={{ ...cs.input, maxWidth: 120 }} defaultValue="#00B166" />
                    </div>
                </div>

                <div style={cs.field}>
                    <Select
                        label={t('settings.appearance.language')}
                        options={[
                            { value: 'en', label: t('settings.appearance.langEn') },
                            { value: 'ar', label: t('settings.appearance.langAr') }
                        ]}
                        defaultValue="en"
                        style={{ maxWidth: 400 }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                    <Switch checked={false} label={t('settings.appearance.compactSidebar')} />
                    <Switch checked={true} label={t('settings.appearance.showAnimations')} />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => alert(t('settings.appearance.saved') || 'Appearance settings saved!')}>{t('settings.appearance.saveChanges')}</Button>
            </div>
        </div>
    );
}
