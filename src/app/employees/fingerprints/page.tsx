'use client';

import React, { useState } from 'react';
import { Fingerprint, Search, RefreshCw, Trash2 } from 'lucide-react';
import { Modal, Select, Button, useToast, EmptyState } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

interface FingerprintRecord {
    id: number;
    employee: string;
    device: string;
    enrollDate: string;
    fingers: number;
    status: string;
}

const initialData: FingerprintRecord[] = [
    { id: 1, employee: 'Sara Ahmed', device: 'BioStation A2', enrollDate: '2026-03-17', fingers: 2, status: 'enrolled' },
    { id: 2, employee: 'Nora Ali', device: 'BioStation A2', enrollDate: '2026-03-21', fingers: 2, status: 'enrolled' },
    { id: 3, employee: 'Layla Hassan', device: 'BioStation A2', enrollDate: '2026-03-22', fingers: 2, status: 'enrolled' },
    { id: 4, employee: 'Hana Youssef', device: 'BioStation A2', enrollDate: '2026-03-23', fingers: 1, status: 'partial' },
    { id: 5, employee: 'Reem Mohamed', device: 'BioStation A2', enrollDate: '-', fingers: 0, status: 'not_enrolled' },
    { id: 6, employee: 'Dina Nabil', device: 'FaceStation F2', enrollDate: '2026-03-26', fingers: 2, status: 'enrolled' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' },
    filterGroup: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 },
    searchBox: { position: 'relative', width: '100%', maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
    btnHoverText: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', fontSize: 12, fontWeight: 'var(--font-medium)' }
};

export default function FingerprintsPage() {
    const [fingerprints, setFingerprints] = useState(initialData);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const { addToast } = useToast();
    const { t, lang } = useTranslation();

    // Modals
    const [isEnrollOpen, setIsEnrollOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<FingerprintRecord | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const statusMap: Record<string, { label: string; bg: string; color: string }> = {
        enrolled: { label: t('fp.enrolled'), bg: 'var(--color-success-light)', color: 'var(--color-success)' },
        partial: { label: t('fp.partial'), bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
        not_enrolled: { label: t('fp.notEnrolled'), bg: 'var(--color-error-light)', color: 'var(--color-error)' },
    };

    const filtered = fingerprints.filter(f => {
        const matchesSearch = f.employee.toLowerCase().includes(search.toLowerCase()) ||
            f.device.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleStartScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            if (selectedEmployee) {
                setFingerprints(fingerprints.map(f => f.id === selectedEmployee.id ? {
                    ...f,
                    status: 'enrolled',
                    fingers: 2,
                    enrollDate: new Date().toISOString().split('T')[0]
                } : f));
            }
            setIsEnrollOpen(false);
            setSelectedEmployee(null);
            addToast('success', t('fp.enrollSuccess'));
        }, 2000);
    };

    const handleDelete = () => {
        if (selectedEmployee) {
            setFingerprints(fingerprints.map(f => f.id === selectedEmployee.id ? {
                ...f,
                status: 'not_enrolled',
                fingers: 0,
                enrollDate: '-'
            } : f));
        }
        setIsDeleteOpen(false);
        setSelectedEmployee(null);
        addToast('success', t('fp.clearSuccess'));
    };

    const columns = [t('fp.colEmployee'), t('fp.colDevice'), t('fp.colEnrollDate'), t('fp.colFingers'), t('fp.colStatus'), t('fp.colActions')];

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{t('fp.title')}</div>

            <div style={s.toolbar}>
                <div style={s.filterGroup as React.CSSProperties}>
                    <div style={s.searchBox as React.CSSProperties}>
                        <Search size={16} style={s.searchIcon as React.CSSProperties} />
                        <input style={s.searchInput} placeholder={t('fp.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <Select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        options={[
                            { label: t('fp.allStatuses'), value: 'All' },
                            { label: t('fp.enrolled'), value: 'enrolled' },
                            { label: t('fp.partial'), value: 'partial' },
                            { label: t('fp.notEnrolled'), value: 'not_enrolled' },
                        ]}
                        style={{ width: 160 }}
                    />
                </div>
            </div>

            {filtered.length > 0 ? (
                <table style={s.table}>
                    <thead>
                        <tr>
                            {columns.map(h =>
                                <th key={h} style={s.th as React.CSSProperties}>{h}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(row => {
                            const st = statusMap[row.status];
                            return (
                                <tr key={row.id} className="hoverRow">
                                    <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.employee}</td>
                                    <td style={s.td}>{row.device}</td>
                                    <td style={s.td}>{row.enrollDate}</td>
                                    <td style={s.td}>{row.fingers}/2</td>
                                    <td style={s.td}><span style={{ ...s.badge, background: st.bg, color: st.color }}>{st.label}</span></td>
                                    <td style={s.td}>
                                        <div style={s.actions}>
                                            <button
                                                style={{ ...s.btnHoverText, color: 'var(--color-primary-600)' }}
                                                onClick={() => { setSelectedEmployee(row); setIsEnrollOpen(true); }}
                                            >
                                                <RefreshCw size={14} /> {row.status === 'not_enrolled' ? t('fp.enrollBtn') : t('fp.reEnrollBtn')}
                                            </button>
                                            {row.status !== 'not_enrolled' && (
                                                <button
                                                    style={{ ...s.btnIcon, color: 'var(--color-error)' }}
                                                    onClick={() => { setSelectedEmployee(row); setIsDeleteOpen(true); }}
                                                    title={t('fp.clearTitle')}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <EmptyState icon={<Fingerprint size={32} color="var(--text-tertiary)" />} title={t('fp.emptyTitle')} description={t('fp.emptyDesc')} />
            )}

            <style>{`
                .hoverRow:hover { background-color: var(--bg-secondary); }
                .hoverRow:last-child td { border-bottom: none !important; }
                
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.5; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.5; }
                }
                .fingerprint-icon-scanning {
                    animation: pulse 1.5s infinite ease-in-out;
                    color: var(--color-primary-600);
                }
            `}</style>

            {/* Enroll Modal */}
            <Modal
                title={t('fp.enrollTitle')}
                open={isEnrollOpen}
                onClose={() => !isScanning && setIsEnrollOpen(false)}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEnrollOpen(false)} disabled={isScanning}>{t('fp.cancel')}</Button>
                        <Button onClick={handleStartScan} disabled={isScanning}>
                            {isScanning ? t('fp.scanning') : t('fp.startScan')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-6)', padding: 'var(--space-4) 0' }}>

                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Fingerprint size={40} className={isScanning ? 'fingerprint-icon-scanning' : ''} color={isScanning ? "var(--color-primary-600)" : "var(--text-tertiary)"} />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-lg)', marginBottom: 4 }}>
                            {isScanning ? t('fp.scanningInProgress') : t('fp.readyToEnroll')}
                        </div>
                    </div>

                    {isScanning && (
                        <div style={{ width: '100%', maxWidth: 240, height: 4, background: 'var(--bg-secondary)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: '100%', height: '100%', background: 'var(--color-primary-600)', transformOrigin: 'left', animation: 'progress 2s linear infinite' }} />
                            <style>{`
                                @keyframes progress {
                                    0% { transform: scaleX(0); }
                                    50% { transform: scaleX(1); opacity: 1; }
                                    100% { transform: scaleX(1); opacity: 0; }
                                }
                            `}</style>
                        </div>
                    )}

                </div>
            </Modal>

            {/* Delete/Clear Modal */}
            <Modal
                title={t('fp.clearTitle')}
                open={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>{t('fp.cancel')}</Button>
                        <Button variant="destructive" onClick={handleDelete}>{t('fp.confirmClear')}</Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    {t('fp.clearConfirmMsg')} <strong>{selectedEmployee?.employee}</strong>{t('fp.clearConfirmMsg2')}
                </p>
            </Modal>
        </div>
    );
}
