'use client';

import React, { useState } from 'react';
import { Button, Switch, Modal, useToast } from '@/components/ui';
import { Database, Download, Upload } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

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
    const { t, lang } = useTranslation();
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [autoBackup, setAutoBackup] = useState(true);

    const handleExport = () => {
        setIsExportOpen(false);
        addToast('success', t('settings.data.toastExport'));
    };

    const handleImport = () => {
        setIsImportOpen(false);
        addToast('success', t('settings.data.toastImport'));
    };

    return (
        <div style={cs.page}>
<div style={cs.card}>
                <div style={cs.cardTitle}>{t('settings.data.title')}</div>
                <div style={cs.cardDesc}>{t('settings.data.desc')}</div>

                <div style={cs.actionRow}>
                    <div style={cs.actionInfo}>
                        <div style={cs.iconBox}><Download size={20} /></div>
                        <div>
                            <div style={{ fontWeight: 'var(--font-medium)' }}>{t('settings.data.exportAll')}</div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{t('settings.data.exportAllDesc')}</div>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => setIsExportOpen(true)}>{t('settings.data.exportNow')}</Button>
                </div>

                <div style={cs.actionRow}>
                    <div style={cs.actionInfo}>
                        <div style={cs.iconBox}><Database size={20} /></div>
                        <div>
                            <div style={{ fontWeight: 'var(--font-medium)' }}>{t('settings.data.autoBackup')}</div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{t('settings.data.autoBackupDesc')}</div>
                        </div>
                    </div>
                    <Switch checked={autoBackup} onChange={() => {
                        setAutoBackup(!autoBackup);
                        addToast('info', !autoBackup ? t('settings.data.toastAutoBackupEnabled') : t('settings.data.toastAutoBackupDisabled'));
                    }} />
                </div>

                <div style={{ ...cs.actionRow, borderBottom: 'none' }}>
                    <div style={cs.actionInfo}>
                        <div style={cs.iconBox}><Upload size={20} /></div>
                        <div>
                            <div style={{ fontWeight: 'var(--font-medium)' }}>{t('settings.data.importData')}</div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{t('settings.data.importDataDesc')}</div>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => setIsImportOpen(true)}>{t('settings.data.importWizard')}</Button>
                </div>
            </div>

            {/* Export Modal */}
            <Modal
                open={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                title={t('settings.data.exportModalTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsExportOpen(false)}>{t('settings.data.cancel')}</Button>
                        <Button onClick={handleExport}>{t('settings.data.startExport')}</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('settings.data.exportModalMsg1')}</p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>{t('settings.data.exportModalMsg2')}</p>
                </div>
            </Modal>

            {/* Import Modal */}
            <Modal
                open={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                title={t('settings.data.importModalTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsImportOpen(false)}>{t('settings.data.cancel')}</Button>
                        <Button onClick={handleImport}>{t('settings.data.proceedImport')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('settings.data.importModalMsg1')}</p>
                    <div style={{ padding: 'var(--space-6)', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>{t('settings.data.dragDrop')}</div>
                        <Button variant="outline" size="sm">{t('settings.data.browseFiles')}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
