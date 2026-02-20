'use client';

import React from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { Switch, Select, Button } from '@/components/ui';

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
    return (
        <div style={cs.page}>
            <SettingsTabs />
            <div style={cs.card}>
                <div style={cs.cardTitle}>Appearance</div>
                <div style={cs.cardDesc}>Customize the look and feel of your dashboard.</div>

                <div style={cs.field}>
                    <Select
                        label="Theme"
                        options={[
                            { value: 'light', label: 'Light' },
                            { value: 'dark', label: 'Dark' },
                            { value: 'system', label: 'System' }
                        ]}
                        defaultValue="light"
                        style={{ maxWidth: 400 }}
                    />
                </div>

                <div style={cs.field}>
                    <label style={cs.label}>Brand Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <input type="color" defaultValue="#00B166" style={{ width: 42, height: 42, border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} />
                        <input style={{ ...cs.input, maxWidth: 120 }} defaultValue="#00B166" />
                    </div>
                </div>

                <div style={cs.field}>
                    <Select
                        label="Language"
                        options={[
                            { value: 'en', label: 'English' },
                            { value: 'ar', label: 'العربية' }
                        ]}
                        defaultValue="en"
                        style={{ maxWidth: 400 }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                    <Switch checked={false} label="Compact sidebar" />
                    <Switch checked={true} label="Show animations" />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button>Save Changes</Button>
            </div>
        </div>
    );
}
