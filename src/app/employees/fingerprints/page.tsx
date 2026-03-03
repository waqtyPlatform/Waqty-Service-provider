'use client';

import React, { useState } from 'react';
import { Fingerprint, Search, RefreshCw, Trash2 } from 'lucide-react';
import { Modal, Select, Button, useToast, EmptyState } from '@/components/ui';

const initialData = [
    { id: 1, employee: 'Sara Ahmed', device: 'BioStation A2', enrollDate: '2026-01-05', fingers: 2, status: 'enrolled' },
    { id: 2, employee: 'Nora Ali', device: 'BioStation A2', enrollDate: '2026-01-05', fingers: 2, status: 'enrolled' },
    { id: 3, employee: 'Layla Hassan', device: 'BioStation A2', enrollDate: '2026-01-10', fingers: 2, status: 'enrolled' },
    { id: 4, employee: 'Hana Youssef', device: 'BioStation A2', enrollDate: '2026-01-10', fingers: 1, status: 'partial' },
    { id: 5, employee: 'Reem Mohamed', device: 'BioStation A2', enrollDate: '-', fingers: 0, status: 'not_enrolled' },
    { id: 6, employee: 'Dina Nabil', device: 'FaceStation F2', enrollDate: '2026-02-01', fingers: 2, status: 'enrolled' },
];

const statusMap: Record<string, { label: string; bg: string; color: string }> = {
    enrolled: { label: ' Enrolled', bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    partial: { label: ' Partial', bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    not_enrolled: { label: ' Not Enrolled', bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

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

    // Modals
    const [isEnrollOpen, setIsEnrollOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [isScanning, setIsScanning] = useState(false);

    const filtered = fingerprints.filter(f => {
        const matchesSearch = f.employee.toLowerCase().includes(search.toLowerCase()) ||
            f.device.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleStartScan = () => {
        setIsScanning(true);
        // Simulate scanning delay
        setTimeout(() => {
            setIsScanning(false);
            setFingerprints(fingerprints.map(f => f.id === selectedEmployee.id ? {
                ...f,
                status: 'enrolled',
                fingers: 2,
                enrollDate: new Date().toISOString().split('T')[0]
            } : f));
            setIsEnrollOpen(false);
            setSelectedEmployee(null);
            addToast('success', 'Fingerprint enrolled successfully.');
        }, 2000);
    };

    const handleDelete = () => {
        setFingerprints(fingerprints.map(f => f.id === selectedEmployee.id ? {
            ...f,
            status: 'not_enrolled',
            fingers: 0,
            enrollDate: '-'
        } : f));
        setIsDeleteOpen(false);
        setSelectedEmployee(null);
        addToast('success', 'Fingerprint data cleared.');
    };

    return (
        <div style={s.page}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Fingerprint Management</div>

            <div style={s.toolbar}>
                <div style={s.filterGroup as React.CSSProperties}>
                    <div style={s.searchBox as React.CSSProperties}>
                        <Search size={16} style={s.searchIcon as React.CSSProperties} />
                        <input style={s.searchInput} placeholder="Search employees or devices..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <Select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        options={[
                            { label: 'All Statuses', value: 'All' },
                            { label: 'Enrolled', value: 'enrolled' },
                            { label: 'Partial', value: 'partial' },
                            { label: 'Not Enrolled', value: 'not_enrolled' },
                        ]}
                        style={{ width: 160 }}
                    />
                </div>
            </div>

            {filtered.length > 0 ? (
                <table style={s.table}>
                    <thead>
                        <tr>
                            {['Employee', 'Verification Device', 'Enrolled Date', 'Fingers Scanned', 'Status', 'Actions'].map(h =>
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
                                                <RefreshCw size={14} /> {row.status === 'not_enrolled' ? 'Enroll Fingerprint' : 'Re-enroll'}
                                            </button>
                                            {row.status !== 'not_enrolled' && (
                                                <button
                                                    style={{ ...s.btnIcon, color: 'var(--color-error)' }}
                                                    onClick={() => { setSelectedEmployee(row); setIsDeleteOpen(true); }}
                                                    title="Clear Fingerprint Data"
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
                <EmptyState icon={<Fingerprint size={32} color="var(--text-tertiary)" />} title="No fingerprint records found" description="Adjust your filters or search query to find what you're looking for." />
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
                title="Device Sync & Enrollment"
                open={isEnrollOpen}
                onClose={() => !isScanning && setIsEnrollOpen(false)}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEnrollOpen(false)} disabled={isScanning}>Cancel</Button>
                        <Button onClick={handleStartScan} disabled={isScanning}>
                            {isScanning ? 'Scanning...' : 'Start Scan on Device'}
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
                            {isScanning ? 'Scanning in progress...' : 'Ready to Enroll'}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                            {isScanning
                                ? `Please wait while ${selectedEmployee?.employee} scans their fingers on the ${selectedEmployee?.device} device.`
                                : `Instruct ${selectedEmployee?.employee} to step up to the ${selectedEmployee?.device} device and place their finger on the sensor. Click Start Scan below to begin.`
                            }
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
                title="Clear Fingerprint Data"
                open={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Confirm Clear</Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    Are you sure you want to permanently clear the enrolled fingerprint data for <strong>{selectedEmployee?.employee}</strong>? They will need to re-enroll on the device to authenticate.
                </p>
            </Modal>
        </div>
    );
}
