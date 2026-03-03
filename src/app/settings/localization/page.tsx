'use client';

import React from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { Select, Button } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' },
    cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' },
    field: { marginBottom: 'var(--space-4)' },
};

export default function LocalizationSettingsPage() {
    const { t } = useTranslation();
    return (
        <div style={cs.page}>
            <SettingsTabs />
            <div style={cs.card}>
                <div style={cs.cardTitle}>{t('settings.localization.title')}</div>
                <div style={cs.cardDesc}>{t('settings.localization.desc')}</div>

                <div style={cs.field}>
                    <Select
                        label={t('settings.localization.timezone')}
                        options={[
                            { value: 'Africa/Cairo', label: t('settings.localization.cairo') },
                            { value: 'Asia/Riyadh', label: t('settings.localization.riyadh') },
                            { value: 'Asia/Dubai', label: t('settings.localization.dubai') },
                            { value: 'UTC', label: t('settings.localization.utc') }
                        ]}
                        defaultValue="Africa/Cairo"
                        style={{ maxWidth: 400 }}
                    />
                </div>

                <div style={cs.field}>
                    <Select
                        label={t('settings.localization.currency')}
                        options={[
                            { value: 'EGP', label: t('settings.localization.egp') },
                            { value: 'SAR', label: t('settings.localization.sar') },
                            { value: 'AED', label: t('settings.localization.aed') },
                            { value: 'USD', label: t('settings.localization.usd') }
                        ]}
                        defaultValue="EGP"
                        style={{ maxWidth: 400 }}
                    />
                </div>

                <div style={cs.field}>
                    <Select
                        label={t('settings.localization.dateFormat')}
                        options={[
                            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2026)' },
                            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2026)' },
                            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-12-31)' }
                        ]}
                        defaultValue="YYYY-MM-DD"
                        style={{ maxWidth: 400 }}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button>{t('settings.localization.saveChanges')}</Button>
            </div>
        </div>
    );
}
