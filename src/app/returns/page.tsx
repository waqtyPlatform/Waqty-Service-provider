'use client';

import React, { useState } from 'react';
import { DropdownMenu, useToast } from '@/components/ui';
import Link from 'next/link';
import {
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    RotateCcw,
    Receipt,
    Wallet,
    CreditCard,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
} from 'lucide-react';
import styles from './returns.module.css';

const returns = [
    { id: 'RTN-301', date: 'Feb 17, 2026', time: '10:30', type: 'service', originalTxn: 'TXN-2045', client: 'Huda Saleh', item: 'Gel Manicure', reason: 'Client dissatisfied with result', amount: 150, method: 'Cash', status: 'approved', employee: 'Hana Youssef' },
    { id: 'RTN-299', date: 'Feb 15, 2026', time: '11:45', type: 'service', originalTxn: 'TXN-2028', client: 'Noura Ahmed', item: 'Swedish Massage', reason: 'Service not completed – emergency', amount: 300, method: 'Cash', status: 'pending', employee: 'Reem Mohamed' },
    { id: 'RTN-298', date: 'Feb 14, 2026', time: '13:00', type: 'advance', originalTxn: 'TXN-2025', client: 'Rania Khalil', item: 'Bridal Package Down Payment', reason: 'Wedding postponed', amount: 1000, method: 'Card', status: 'approved', employee: 'Nora Ali' },
    { id: 'RTN-296', date: 'Feb 10, 2026', time: '16:30', type: 'petty', originalTxn: 'TXN-2015', client: '—', item: 'Petty Cash Refund – Supplier Overcharge', reason: 'Vendor corrected invoice', amount: 120, method: 'Internal', status: 'approved', employee: 'Admin' },
    { id: 'RTN-295', date: 'Feb 8, 2026', time: '12:00', type: 'service', originalTxn: 'TXN-2010', client: 'Maryam Ibrahim', item: 'HydraFacial', reason: 'Double booking – service cancelled', amount: 450, method: 'Card', status: 'rejected', employee: 'Nora Ali' },
];

const typeConfig: Record<string, { bg: string; color: string; label: string }> = {
    service: { bg: 'var(--color-info-light)', color: 'var(--color-info)', label: 'Service' },
    advance: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: 'Advance' },
    petty: { bg: 'var(--color-primary-50)', color: 'var(--color-primary-600)', label: 'Petty Cash' },
};

const statusConfig: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
    approved: { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Approved', icon: <CheckCircle2 size={12} /> },
    pending: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: 'Pending', icon: <Clock size={12} /> },
    rejected: { bg: 'var(--color-error-light)', color: 'var(--color-error)', label: 'Rejected', icon: <XCircle size={12} /> },
};

const tabItems = [
    { label: 'All Returns', key: 'all', icon: <RotateCcw size={16} /> },
    { label: 'Service Refunds', key: 'service', icon: <Receipt size={16} /> },
    { label: 'Advance Cancellations', key: 'advance', icon: <CreditCard size={16} /> },
    { label: 'Petty Cash Refunds', key: 'petty', icon: <Wallet size={16} /> },
];

export default function ReturnsPage() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');

    const filteredReturns = returns.filter((r) => {
        const matchSearch = r.client.toLowerCase().includes(search.toLowerCase()) ||
            r.id.toLowerCase().includes(search.toLowerCase()) ||
            r.item.toLowerCase().includes(search.toLowerCase());
        const matchTab = activeTab === 'all' || r.type === activeTab;
        return matchSearch && matchTab;
    });

    const totalRefunded = returns.filter(r => r.status === 'approved').reduce((s, r) => s + r.amount, 0);
    const pendingCount = returns.filter(r => r.status === 'pending').length;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.h1}>Returns & Refunds</h1>
                    <p className={styles.sub}>Manage refunds and advance cancellations.</p>
                </div>
                <button className={styles.btnP}><Plus size={16} /> New Return</button>
            </div>

            <div className={styles.tabs}>
                {tabItems.map((t) => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)} className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            <div className={styles.kpiRow}>
                <div className={styles.kpi}>
                    <div className={styles.kpiL}>Total Returns</div>
                    <div className={styles.kpiV}>{returns.length}</div>
                </div>
                <div className={styles.kpi}>
                    <div className={styles.kpiL}>Total Refunded</div>
                    <div className={`${styles.kpiV} ${styles.kpiVError}`}>{totalRefunded.toLocaleString()} EGP</div>
                </div>
                <div className={styles.kpi}>
                    <div className={styles.kpiL}>Pending Approval</div>
                    <div className={`${styles.kpiV} ${styles.kpiVWarning}`}>{pendingCount}</div>
                </div>
                <div className={styles.kpi}>
                    <div className={styles.kpiL}>Avg Refund Time</div>
                    <div className={styles.kpiV}>1.2 days</div>
                </div>
            </div>

            <div className={styles.ctrl}>
                <div className={styles.sw}>
                    <Search size={16} className={styles.si} />
                    <input className={styles.inp} placeholder="Search returns..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.tableResponsive}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Return #</th>
                                <th className={styles.th}>Date</th>
                                <th className={styles.th}>Type</th>
                                <th className={styles.th}>Client</th>
                                <th className={styles.th}>Item</th>
                                <th className={styles.th}>Reason</th>
                                <th className={`${styles.th} ${styles.thRight}`}>Amount</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReturns.map((r) => {
                                const tp = typeConfig[r.type];
                                const st = statusConfig[r.status];
                                return (
                                    <tr key={r.id} className={`${styles.tr} ${styles.trInteractive}`} onClick={() => addToast('info', `Viewing return ${r.id} details`)}>
                                        <td className={`${styles.td} ${styles.idCell}`}>{r.id}</td>
                                        <td className={styles.td}>
                                            <div className={styles.dateCell}>{r.date}</div>
                                            <div className={styles.timeCell}>{r.time}</div>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.badge} style={{ background: tp.bg, color: tp.color }}>{tp.label}</span>
                                        </td>
                                        <td className={`${styles.td} ${r.client !== '—' ? styles.clientName : ''}`}>
                                            {r.client}
                                        </td>
                                        <td className={`${styles.td} ${styles.truncate}`}>{r.item}</td>
                                        <td className={`${styles.td} ${styles.truncateReason}`}>{r.reason}</td>
                                        <td className={`${styles.td} ${styles.amountRefund}`}>
                                            -{r.amount.toLocaleString()} EGP
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.badge} style={{ background: st.bg, color: st.color }}>
                                                {st.icon} {st.label}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <DropdownMenu
                                                trigger={<button className={styles.actionBtn}><MoreVertical size={16} /></button>}
                                                items={[
                                                    { label: 'View Return', icon: <Search size={14} />, onClick: () => addToast('info', 'Viewing return details') },
                                                    { label: 'Approve', icon: <CheckCircle2 size={14} />, onClick: () => addToast('success', 'Return approved') },
                                                    { label: 'Reject', icon: <XCircle size={14} />, onClick: () => addToast('error', 'Return rejected'), destructive: true },
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={styles.pag}>
                    <span className={styles.pageInfo}>Showing {filteredReturns.length} of {returns.length}</span>
                </div>
            </div>
        </div>
    );
}
