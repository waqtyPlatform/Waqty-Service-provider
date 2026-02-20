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
import { EmptyState } from '@/components/ui';
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

export default function TransactionsPage() {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

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

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedTransactions = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                {filtered.length > 0 ? (
                    <>
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
                                {paginatedTransactions.map((t) => (
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
                            <span className={styles.pageInfo}>
                                Showing {paginatedTransactions.length} of {filtered.length} transactions
                            </span>
                            {totalPages > 1 && (
                                <div className={styles.pageButtons}>
                                    <button
                                        className={styles.pageBtn}
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>
                                        {currentPage}
                                    </button>
                                    <button
                                        className={styles.pageBtn}
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ padding: 'var(--space-12) 0' }}>
                        <EmptyState
                            icon={<Receipt size={32} color="var(--text-tertiary)" />}
                            title="No transactions found"
                            description="There are no transactions matching your search criteria or filter."
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
