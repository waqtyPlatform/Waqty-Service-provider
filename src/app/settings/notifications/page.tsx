'use client';

import React from 'react';
import { Switch, Button } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' },
    cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' },
};

export default function NotificationsSettingsPage() {
    const { t } = useTranslation();
    return (
        <div style={cs.page}>
<div style={cs.card}>
                <div style={cs.cardTitle}>{t('settings.notifications.title')}</div>
                <div style={cs.cardDesc}>{t('settings.notifications.desc')}</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Switch checked={true} label={t('settings.notifications.newBooking')} />
                    <Switch checked={true} label={t('settings.notifications.cancelBooking')} />
                    <Switch checked={true} label={t('settings.notifications.paymentReceived')} />
                    <Switch checked={false} label={t('settings.notifications.dailySummary')} />
                    <Switch checked={false} label={t('settings.notifications.employeeClockIn')} />
                    <Switch checked={true} label={t('settings.notifications.clientBirthday')} />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => alert(t('settings.notifications.saved') || 'Notification preferences saved!')}>{t('settings.notifications.saveChanges')}</Button>
            </div>
        </div>
    );
}
