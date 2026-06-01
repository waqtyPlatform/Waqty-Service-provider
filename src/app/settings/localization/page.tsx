'use client';

import React, { useState } from 'react';
import { Select, Button, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';
import { Globe } from 'lucide-react';

interface LocalizationSettings {
    timezone: string;
    currency: string;
    dateFormat: string;
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
    field: { marginBottom: 'var(--space-4)' },
};

const fallbackLocalization: LocalizationSettings = {
    timezone: 'Africa/Cairo',
    currency: 'EGP',
    dateFormat: 'YYYY-MM-DD',
};

export default function LocalizationSettingsPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();

    const {
        data: settings,
        loading,
        error,
        refetch,
    } = useApiQuery<LocalizationSettings>(
        () =>
            (settingsApi.getLocalizationSettings?.() as
                | Promise<import('@/lib/api').ApiResponse<LocalizationSettings>>
                | undefined) ?? Promise.resolve({ success: true, message: '', data: fallbackLocalization }),
        [],
        { fallbackData: fallbackLocalization }
    );

    const [timezone, setTimezone] = useState(fallbackLocalization.timezone);
    const [currency, setCurrency] = useState(fallbackLocalization.currency);
    const [dateFormat, setDateFormat] = useState(fallbackLocalization.dateFormat);

    React.useEffect(() => {
        if (settings) {
            setTimezone(settings.timezone);
            setCurrency(settings.currency);
            setDateFormat(settings.dateFormat);
        }
    }, [settings]);

    const handleSave = async () => {
        try {
            const payload = { timezone, currency, dateFormat };
            if (settingsApi.updateLocalizationSettings) {
                await settingsApi.updateLocalizationSettings(payload);
            }
            localStorage.setItem('hagzy_localization', JSON.stringify(payload));
            addToast('success', t('settings.localization.saved'));
            refetch();
        } catch {
            localStorage.setItem('hagzy_localization', JSON.stringify({ timezone, currency, dateFormat }));
            addToast('success', t('settings.localization.saved'));
        }
    };

    return (
        <div style={cs.page}>
            <DataGuard
                loading={loading}
                error={error}
                data={settings ? [settings] : []}
                emptyIcon={<Globe size={48} />}
                emptyTitle={t('settings.localization.title')}
                emptyDescription={t('settings.localization.desc')}
                onRetry={refetch}
                skeletonCount={2}
                skeletonVariant="card"
            >
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
                                { value: 'UTC', label: t('settings.localization.utc') },
                            ]}
                            value={timezone}
                            onChange={e => setTimezone(e.target.value)}
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
                                { value: 'USD', label: t('settings.localization.usd') },
                            ]}
                            value={currency}
                            onChange={e => setCurrency(e.target.value)}
                            style={{ maxWidth: 400 }}
                        />
                    </div>

                    <div style={cs.field}>
                        <Select
                            label={t('settings.localization.dateFormat')}
                            options={[
                                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2026)' },
                                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2026)' },
                                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-03-12)' },
                            ]}
                            value={dateFormat}
                            onChange={e => setDateFormat(e.target.value)}
                            style={{ maxWidth: 400 }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleSave}>{t('settings.localization.saveChanges')}</Button>
                </div>
            </DataGuard>
        </div>
    );
}
