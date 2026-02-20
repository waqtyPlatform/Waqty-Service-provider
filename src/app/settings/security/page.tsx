'use client';

import React from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { Switch, Input, Button } from '@/components/ui';

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' },
    cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' },
};

export default function SecuritySettingsPage() {
    return (
        <div style={cs.page}>
            <SettingsTabs />
            <div style={cs.card}>
                <div style={cs.cardTitle}>Security Settings</div>
                <div style={cs.cardDesc}>Protect your account and data.</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Switch checked={true} label="Two-factor authentication" />
                    <Switch checked={false} label="Require password change every 90 days" />
                    <Switch checked={true} label="Lock after 3 failed login attempts" />

                    <div style={{ marginTop: 'var(--space-2)' }}>
                        <Input
                            label="Session Timeout (minutes)"
                            type="number"
                            defaultValue={30}
                            style={{ maxWidth: 200 }}
                        />
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button>Save Changes</Button>
            </div>
        </div>
    );
}
