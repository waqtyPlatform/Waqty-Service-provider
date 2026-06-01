'use client';

import React, { useState } from 'react';
import { Switch, Input, Button, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';
import { Shield } from 'lucide-react';

interface SecuritySettings {
    twoFactor: boolean;
    passwordChange: boolean;
    lockAttempts: boolean;
    sessionTimeout: number;
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
};

const fallbackSecurity: SecuritySettings = {
    twoFactor: true,
    passwordChange: false,
    lockAttempts: true,
    sessionTimeout: 30,
};

export default function SecuritySettingsPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();

    const {
        data: settings,
        loading,
        error,
        refetch,
    } = useApiQuery<SecuritySettings>(
        () =>
            (settingsApi.getSecuritySettings?.() as
                | Promise<import('@/lib/api').ApiResponse<SecuritySettings>>
                | undefined) ?? Promise.resolve({ success: true, message: '', data: fallbackSecurity }),
        [],
        { fallbackData: fallbackSecurity }
    );

    const [twoFactor, setTwoFactor] = useState(fallbackSecurity.twoFactor);
    const [passwordChange, setPasswordChange] = useState(fallbackSecurity.passwordChange);
    const [lockAttempts, setLockAttempts] = useState(fallbackSecurity.lockAttempts);
    const [sessionTimeout, setSessionTimeout] = useState(fallbackSecurity.sessionTimeout);

    React.useEffect(() => {
        if (settings) {
            setTwoFactor(settings.twoFactor);
            setPasswordChange(settings.passwordChange);
            setLockAttempts(settings.lockAttempts);
            setSessionTimeout(settings.sessionTimeout);
        }
    }, [settings]);

    const handleSave = async () => {
        try {
            const payload = { twoFactor, passwordChange, lockAttempts, sessionTimeout };
            if (settingsApi.updateSecuritySettings) {
                await settingsApi.updateSecuritySettings(payload);
            }
            localStorage.setItem('hagzy_security', JSON.stringify(payload));
            addToast('success', t('settings.security.saved'));
            refetch();
        } catch {
            localStorage.setItem(
                'hagzy_security',
                JSON.stringify({ twoFactor, passwordChange, lockAttempts, sessionTimeout })
            );
            addToast('success', t('settings.security.saved'));
        }
    };

    return (
        <div style={cs.page}>
            <DataGuard
                loading={loading}
                error={error}
                data={settings ? [settings] : []}
                emptyIcon={<Shield size={48} />}
                emptyTitle={t('settings.security.title')}
                emptyDescription={t('settings.security.desc')}
                onRetry={refetch}
                skeletonCount={2}
                skeletonVariant="card"
            >
                <div style={cs.card}>
                    <div style={cs.cardTitle}>{t('settings.security.title')}</div>
                    <div style={cs.cardDesc}>{t('settings.security.desc')}</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Switch
                            checked={twoFactor}
                            onChange={() => setTwoFactor(!twoFactor)}
                            label={t('settings.security.twoFactor')}
                        />
                        <Switch
                            checked={passwordChange}
                            onChange={() => setPasswordChange(!passwordChange)}
                            label={t('settings.security.passwordChange')}
                        />
                        <Switch
                            checked={lockAttempts}
                            onChange={() => setLockAttempts(!lockAttempts)}
                            label={t('settings.security.lockAttempts')}
                        />

                        <div style={{ marginTop: 'var(--space-2)' }}>
                            <Input
                                label={t('settings.security.sessionTimeout')}
                                type="number"
                                value={sessionTimeout}
                                onChange={e => setSessionTimeout(parseInt(e.target.value) || 30)}
                                style={{ maxWidth: 200 }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleSave}>{t('settings.security.saveChanges')}</Button>
                </div>
            </DataGuard>
        </div>
    );
}
