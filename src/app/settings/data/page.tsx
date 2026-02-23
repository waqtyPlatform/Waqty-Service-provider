'use client';

import React, { useState } from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { Button, Switch, Modal, useToast } from '@/components/ui';
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
    const { addToast } = useToast();
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [autoBackup, setAutoBackup] = useState(true);

    const handleExport = () => {
        setIsExportOpen(false);
        addToast('success', 'Export started. You will receive an email when it is ready.');
    };

    const handleImport = () => {
        setIsImportOpen(false);
        addToast('success', 'Import processed successfully.');
    };

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
                    <Button variant="outline" onClick={() => setIsExportOpen(true)}>Export Now</Button>
                </div>

                <div style={cs.actionRow}>
                    <div style={cs.actionInfo}>
                        <div style={cs.iconBox}><Database size={20} /></div>
                        <div>
                            <div style={{ fontWeight: 'var(--font-medium)' }}>Daily Auto-Backup</div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Automatically backup data every night at 3:00 AM.</div>
                        </div>
                    </div>
                    <Switch checked={autoBackup} onChange={() => {
                        setAutoBackup(!autoBackup);
                        addToast('info', `Auto-backup ${!autoBackup ? 'enabled' : 'disabled'}`);
                    }} />
                </div>

                <div style={{ ...cs.actionRow, borderBottom: 'none' }}>
                    <div style={cs.actionInfo}>
                        <div style={cs.iconBox}><Upload size={20} /></div>
                        <div>
                            <div style={{ fontWeight: 'var(--font-medium)' }}>Import Data</div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Import customers or services from CSV.</div>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => setIsImportOpen(true)}>Import Wizard</Button>
                </div>
            </div>

            {/* Export Modal */}
            <Modal
                open={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                title="Export Data"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsExportOpen(false)}>Cancel</Button>
                        <Button onClick={handleExport}>Start Export</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>You are about to export all your operational data including customers, transactions, and bookings.</p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>The generated CSV/JSON folder will be emailed to your admin address. This might take a few minutes depending on the size of your data.</p>
                </div>
            </Modal>

            {/* Import Modal */}
            <Modal
                open={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                title="Import Wizard"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsImportOpen(false)}>Cancel</Button>
                        <Button onClick={handleImport}>Proceed Import</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Upload your CSV file to batch import Customers, Services, or Historical Transactions.</p>
                    <div style={{ padding: 'var(--space-6)', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>Drag & Drop your CSV file here</div>
                        <Button variant="outline" size="sm">Browse Files</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
