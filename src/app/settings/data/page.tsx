'use client';

import React from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { Button, Switch } from '@/components/ui';
import { Database, Download, Upload } from 'lucide-react';

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' },
    cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' },
    actionRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--border-color)' },
    actionInfo: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    iconBox: { width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' },
};

export default function DataSettingsPage() {
    return (
        <div style={cs.page}>
            <SettingsTabs />
            <div style={cs.card}>
                <div style={cs.cardTitle}>Data & Backup</div>
                <div style={cs.cardDesc}>Manage your data exports and system backups.</div>

                <div style={cs.actionRow}>
                    <div style={cs.actionInfo}>
                        <div style={cs.iconBox}><Download size={20} /></div>
                        <div>
                            <div style={{ fontWeight: 'var(--font-medium)' }}>Export All Data</div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Download a .zip file of all your data (CSV/JSON).</div>
                        </div>
                    </div>
                    <Button variant="outline">Export Now</Button>
                </div>

                <div style={cs.actionRow}>
                    <div style={cs.actionInfo}>
                        <div style={cs.iconBox}><Database size={20} /></div>
                        <div>
                            <div style={{ fontWeight: 'var(--font-medium)' }}>Daily Auto-Backup</div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Automatically backup data every night at 3:00 AM.</div>
                        </div>
                    </div>
                    <Switch checked={true} />
                </div>

                <div style={{ ...cs.actionRow, borderBottom: 'none' }}>
                    <div style={cs.actionInfo}>
                        <div style={cs.iconBox}><Upload size={20} /></div>
                        <div>
                            <div style={{ fontWeight: 'var(--font-medium)' }}>Import Data</div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Import customers or inventory from CSV.</div>
                        </div>
                    </div>
                    <Button variant="outline">Import Wizard</Button>
                </div>
            </div>
        </div>
    );
}
