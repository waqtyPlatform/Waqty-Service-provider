'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Download,
    ChevronLeft,
    ChevronRight,
    Receipt,
    Wallet,
    CreditCard,
    PiggyBank,
    ArrowLeftRight,
    ShieldCheck,
    CalendarClock,
    ClipboardList,
    TrendingUp,
    Users,
    Package,
} from 'lucide-react';
import styles from './transactions.module.css';

const transactions = [
    { id: 'TXN-2048', date: 'Feb 17, 2026', time: '09:15', type: 'sale', client: 'Fatima Al-Rashid', service: 'Hair Coloring', employee: 'Sara Ahmed', method: 'Card', amount: 400 },
    { id: 'TXN-2047', date: 'Feb 17, 2026', time: '09:40', type: 'sale', client: 'Aisha Mohammed', service: 'Keratin', employee: 'Nora Ali', method: 'Cash', amount: 500 },
    { id: 'TXN-2046', date: 'Feb 17, 2026', time: '10:10', type: 'sale', client: 'Maryam Ibrahim', service: 'Classic Facial', employee: 'Layla Hassan', method: 'Card', amount: 200 },
    { id: 'TXN-2045', date: 'Feb 17, 2026', time: '10:45', type: 'refund', client: 'Huda Saleh', service: 'Gel Manicure', employee: 'Hana Youssef', method: 'Cash', amount: -150 },
    { id: 'TXN-2044', date: 'Feb 17, 2026', time: '11:00', type: 'sale', client: 'Noura Ahmed', service: 'Massage', employee: 'Reem Mohamed', method: 'Cash', amount: 300 },
    { id: 'TXN-2043', date: 'Feb 17, 2026', time: '11:30', type: 'petty', client: '—', service: 'Office Supplies', employee: 'Admin', method: 'Cash', amount: -80 },
    { id: 'TXN-2042', date: 'Feb 17, 2026', time: '12:00', type: 'advance', client: 'Rania Khalil', service: 'Bridal Package', employee: 'Nora Ali', method: 'Card', amount: 1000 },
    { id: 'TXN-2041', date: 'Feb 17, 2026', time: '13:15', type: 'sale', client: 'Dana Faris', service: 'HydraFacial', employee: 'Layla Hassan', method: 'Card', amount: 450 },
    { id: 'TXN-2040', date: 'Feb 17, 2026', time: '14:00', type: 'transfer', client: '—', service: 'Cashier Transfer', employee: 'Manager', method: 'Internal', amount: 5000 },
    { id: 'TXN-2039', date: 'Feb 17, 2026', time: '14:30', type: 'sale', client: 'Lina Tariq', service: 'Olaplex', employee: 'Sara Ahmed', method: 'Cash', amount: 350 },
];

const typeConfig: Record<string, { class: string; label: string }> = {
    sale: { class: styles.typeSale, label: 'Sale' },
    refund: { class: styles.typeRefund, label: 'Refund' },
    petty: { class: styles.typePetty, label: 'Petty Cash' },
    advance: { class: styles.typeAdvance, label: 'Advance' },
    transfer: { class: styles.typeTransfer, label: 'Transfer' },
};

const tabItems = [
    { label: 'Transaction Log', href: '/transactions', icon: <Receipt size={16} /> },
    { label: 'Cash Sales', href: '/transactions/cash-sales', icon: <Wallet size={16} /> },
    { label: 'Advance', href: '/transactions/advance-payments', icon: <CreditCard size={16} /> },
    { label: 'Petty Cash', href: '/transactions/petty-cash', icon: <PiggyBank size={16} /> },
    { label: 'Transfers', href: '/transactions/transfers', icon: <ArrowLeftRight size={16} /> },
    { label: 'Safe Balances', href: '/transactions/safe-balances', icon: <ShieldCheck size={16} /> },
    { label: 'Shifts', href: '/transactions/shifts', icon: <CalendarClock size={16} /> },
    { label: 'Dailies', href: '/transactions/dailies', icon: <ClipboardList size={16} /> },
    { label: 'Best Sales', href: '/transactions/best-sales', icon: <TrendingUp size={16} /> },
    { label: 'Client Sales', href: '/transactions/client-sales', icon: <Users size={16} /> },
    { label: 'Packages', href: '/transactions/package-sales', icon: <Package size={16} /> },
];

export default function TransactionsPage() {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const filtered = transactions.filter((t) => {
        const matchSearch =
            t.id.toLowerCase().includes(search.toLowerCase()) ||
            t.client.toLowerCase().includes(search.toLowerCase()) ||
            t.service.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'all' || t.type === typeFilter;
        return matchSearch && matchType;
    });

    const totalSales = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const totalRefunds = Math.abs(transactions.filter((t) => t.type === 'refund').reduce((s, t) => s + t.amount, 0));
    const netRevenue = transactions.reduce((s, t) => s + t.amount, 0);

    return (
        <div className={styles.transactionsPage}>
            <div className={styles.header}>
                <div>
                    <h1>Transactions</h1>
                    <p>All financial activities across the branch.</p>
                </div>
                <button className={styles.btnOutline}>
                    <Download size={16} /> Export
                </button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                {tabItems.map((tab) => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`${styles.tab} ${tab.href === '/transactions' ? styles.tabActive : ''}`}
                    >
                        {tab.icon} {tab.label}
                    </Link>
                ))}
            </div>

            {/* KPI Row */}
            <div className={styles.kpiRow}>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>Total Sales</div>
                    <div className={styles.kpiValue} style={{ color: 'var(--color-success)' }}>
                        {totalSales.toLocaleString()} EGP
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>Total Refunds</div>
                    <div className={styles.kpiValue} style={{ color: 'var(--color-error)' }}>
                        {totalRefunds.toLocaleString()} EGP
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>Net Revenue</div>
                    <div className={styles.kpiValue} style={{ color: 'var(--color-primary-600)' }}>
                        {netRevenue.toLocaleString()} EGP
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>Transactions</div>
                    <div className={styles.kpiValue}>{transactions.length}</div>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder="Search transaction #, client..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className={styles.selectFilter}
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option value="all">All Types</option>
                    <option value="sale">Sales</option>
                    <option value="refund">Refunds</option>
                    <option value="petty">Petty Cash</option>
                    <option value="advance">Advance</option>
                    <option value="transfer">Transfers</option>
                </select>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Txn #</th>
                            <th>Date & Time</th>
                            <th>Type</th>
                            <th>Client</th>
                            <th>Description</th>
                            <th>Employee</th>
                            <th>Method</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((t) => (
                            <tr key={t.id}>
                                <td className={styles.txnId}>{t.id}</td>
                                <td>
                                    <div style={{ fontWeight: 'var(--font-medium)' }}>{t.date}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t.time}</div>
                                </td>
                                <td>
                                    <span className={`${styles.typeBadge} ${typeConfig[t.type]?.class}`}>
                                        {typeConfig[t.type]?.label}
                                    </span>
                                </td>
                                <td style={{ fontWeight: t.client !== '—' ? 'var(--font-medium)' : undefined, color: t.client === '—' ? 'var(--text-tertiary)' : undefined }}>
                                    {t.client}
                                </td>
                                <td>{t.service}</td>
                                <td>{t.employee}</td>
                                <td>{t.method}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <span className={t.amount >= 0 ? styles.amountPositive : styles.amountNegative}>
                                        {t.amount >= 0 ? '+' : ''}{t.amount.toLocaleString()} EGP
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>Showing {filtered.length} of {transactions.length}</span>
                    <div className={styles.pageButtons}>
                        <button className={styles.pageBtn}><ChevronLeft size={16} /></button>
                        <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                        <button className={styles.pageBtn}><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
