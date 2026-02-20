'use client';

import React from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { Save } from 'lucide-react';

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', maxWidth: 700 },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    section: { marginBottom: 'var(--space-6)' },
    sectionTitle: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border-color)' },
    row: { display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' },
    label: { flex: '0 0 160px', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' },
    input: { flex: 1, height: 40, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    select: { flex: 1, height: 40, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)' },
    textarea: { flex: 1, minHeight: 60, padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', resize: 'vertical' as const },
    saveBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-6)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' },
};

export default function InvoiceSettingsPage() {
    return (
        <div style={s.page}>
            <SettingsTabs />

            <div style={s.card}>
                <div style={s.section}>
                    <div style={s.sectionTitle}>Business Information</div>
                    <div style={s.row}><div style={s.label}>Business Name</div><input style={s.input} defaultValue="Hagzy Beauty Center" /></div>
                    <div style={s.row}><div style={s.label}>Tax Registration No.</div><input style={s.input} defaultValue="123-456-789" /></div>
                    <div style={s.row}><div style={s.label}>Address</div><input style={s.input} defaultValue="15 Tahrir Street, Cairo" /></div>
                    <div style={s.row}><div style={s.label}>Phone</div><input style={s.input} defaultValue="+20 2 2345 6789" /></div>
                </div>

                <div style={s.section}>
                    <div style={s.sectionTitle}>Invoice Format</div>
                    <div style={s.row}><div style={s.label}>Prefix</div><input style={s.input} defaultValue="INV-" /></div>
                    <div style={s.row}><div style={s.label}>Next Number</div><input style={s.input} defaultValue="2043" type="number" /></div>
                    <div style={s.row}><div style={s.label}>Tax Rate %</div><input style={s.input} defaultValue="14" type="number" /></div>
                    <div style={s.row}><div style={s.label}>Currency</div><select style={s.select}><option>EGP</option><option>USD</option><option>EUR</option><option>SAR</option></select></div>
                </div>

                <div style={s.section}>
                    <div style={s.sectionTitle}>Footer Text</div>
                    <div style={s.row}><textarea style={s.textarea} defaultValue="Thank you for choosing Hagzy Beauty Center! We look forward to seeing you again." /></div>
                </div>

                <button style={s.saveBtn}><Save size={16} /> Save Settings</button>
            </div>
        </div>
    );
}
