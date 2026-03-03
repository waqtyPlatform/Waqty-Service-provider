'use client';

import React from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { Switch, Input, Button } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' },
    cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' },
};

export default function SecuritySettingsPage() {
    const { t } = useTranslation();
    return (
        <div style={cs.page}>
            <SettingsTabs />
            <div style={cs.card}>
                <div style={cs.cardTitle}>{t('settings.security.title')}</div>
                <div style={cs.cardDesc}>{t('settings.security.desc')}</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Switch checked={true} label={t('settings.security.twoFactor')} />
                    <Switch checked={false} label={t('settings.security.passwordChange')} />
                    <Switch checked={true} label={t('settings.security.lockAttempts')} />

                    <div style={{ marginTop: 'var(--space-2)' }}>
                        <Input
                            label={t('settings.security.sessionTimeout')}
                            type="number"
                            defaultValue={30}
                            style={{ maxWidth: 200 }}
                        />
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button>{t('settings.security.saveChanges')}</Button>
            </div>
        </div>
    );
}
