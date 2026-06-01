'use client';

import React, { useState } from 'react';
import { Switch, Button, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi, type NotificationSetting } from '@/lib/api';

const fallbackNotifications: NotificationSetting[] = [
    { key: 'new_booking', label: 'New Booking', enabled: true, channels: ['push'] },
    { key: 'cancel_booking', label: 'Cancel Booking', enabled: true, channels: ['push'] },
    { key: 'payment_received', label: 'Payment Received', enabled: true, channels: ['push'] },
    { key: 'daily_summary', label: 'Daily Summary', enabled: false, channels: ['email'] },
    { key: 'employee_clock_in', label: 'Employee Clock In', enabled: false, channels: ['push'] },
    { key: 'client_birthday', label: 'Client Birthday', enabled: true, channels: ['push'] },
];

const labelMap: Record<string, string> = {
    new_booking: 'settings.notifications.newBooking',
    cancel_booking: 'settings.notifications.cancelBooking',
    payment_received: 'settings.notifications.paymentReceived',
    daily_summary: 'settings.notifications.dailySummary',
    employee_clock_in: 'settings.notifications.employeeClockIn',
    client_birthday: 'settings.notifications.clientBirthday',
};

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
};

export default function NotificationsSettingsPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();

    const {
        data: apiNotifications,
        loading,
        refetch,
    } = useApiQuery<NotificationSetting[]>(() => settingsApi.getNotificationSettings(), [], {
        fallbackData: fallbackNotifications,
    });

    const [localSettings, setLocalSettings] = useState<NotificationSetting[] | null>(null);
    const settings =
        localSettings ?? (apiNotifications && apiNotifications.length > 0 ? apiNotifications : fallbackNotifications);
    const setSettings = setLocalSettings;

    const toggleSetting = (key: string) => {
        setSettings(prev => (prev ?? []).map(s => (s.key === key ? { ...s, enabled: !s.enabled } : s)));
    };

    const handleSave = async () => {
        try {
            await settingsApi.updateNotificationSettings({ settings } as Record<string, unknown>);
            addToast('success', t('settings.notifications.saved'));
            refetch();
        } catch {
            addToast('error', t('settings.notifications.saveFailed'));
        }
    };

    return (
        <div style={cs.page}>
            <div style={cs.card}>
                <div style={cs.cardTitle}>{t('settings.notifications.title')}</div>
                <div style={cs.cardDesc}>{t('settings.notifications.desc')}</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {settings.map(s => (
                        <Switch
                            key={s.key}
                            checked={s.enabled}
                            label={t(labelMap[s.key] || s.label)}
                            onChange={() => toggleSetting(s.key)}
                        />
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleSave}>{t('settings.notifications.saveChanges')}</Button>
            </div>
        </div>
    );
}
