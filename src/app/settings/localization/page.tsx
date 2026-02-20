'use client';

import React from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { Select, Button } from '@/components/ui';

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' },
    cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' },
    field: { marginBottom: 'var(--space-4)' },
};

export default function LocalizationSettingsPage() {
    return (
        <div style={cs.page}>
            <SettingsTabs />
            <div style={cs.card}>
                <div style={cs.cardTitle}>Localization</div>
                <div style={cs.cardDesc}>Manage region, currency, and time settings.</div>

                <div style={cs.field}>
                    <Select
                        label="Timezone"
                        options={[
                            { value: 'Africa/Cairo', label: '(GMT+02:00) Cairo' },
                            { value: 'Asia/Riyadh', label: '(GMT+03:00) Riyadh' },
                            { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
                            { value: 'UTC', label: 'UTC' }
                        ]}
                        defaultValue="Africa/Cairo"
                        style={{ maxWidth: 400 }}
                    />
                </div>

                <div style={cs.field}>
                    <Select
                        label="Currency"
                        options={[
                            { value: 'EGP', label: 'Egyptian Pound (EGP)' },
                            { value: 'SAR', label: 'Saudi Riyal (SAR)' },
                            { value: 'AED', label: 'UAE Dirham (AED)' },
                            { value: 'USD', label: 'US Dollar (USD)' }
                        ]}
                        defaultValue="EGP"
                        style={{ maxWidth: 400 }}
                    />
                </div>

                <div style={cs.field}>
                    <Select
                        label="Date Format"
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
                <Button>Save Changes</Button>
            </div>
        </div>
    );
}
