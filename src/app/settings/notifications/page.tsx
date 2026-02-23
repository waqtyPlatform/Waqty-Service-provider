'use client';

import React from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { Switch, Button } from '@/components/ui';

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' },
    cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' },
};

export default function NotificationsSettingsPage() {
    return (
        <div style={cs.page}>
            <SettingsTabs />
            <div style={cs.card}>
                <div style={cs.cardTitle}>Notification Preferences</div>
                <div style={cs.cardDesc}>Choose what notifications you receive.</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Switch checked={true} label="New booking alerts" />
                    <Switch checked={true} label="Booking cancellation alerts" />
                    <Switch checked={true} label="Payment received" />
                    <Switch checked={false} label="Daily summary email" />
                    <Switch checked={false} label="Employee clock-in alerts" />
                    <Switch checked={true} label="Client birthday reminders" />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button>Save Changes</Button>
            </div>
        </div>
    );
}
