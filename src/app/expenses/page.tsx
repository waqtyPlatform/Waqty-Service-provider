'use client';

import React, { useState } from 'react';
import { DropdownMenu, useToast, EmptyState, Modal, Input, Select, Button } from '@/components/ui';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Plus, Download, MoreVertical, Receipt, FileText, Repeat, Wallet, PieChart } from 'lucide-react';
import styles from './expenses.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { egpLabel } from '@/lib/money';
import { expenseApi, type Expense } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

const fallbackExpenses = [
    {
        id: 'EXP-401',
        date: 'Mar 17, 2026',
        category: 'Supplies',
        description: "Hair color supplies (L'Oréal)",
        vendor: 'Beauty Suppliers Co.',
        amount: 2500,
        method: 'Transfer',
        status: 'approved',
    },
    {
        id: 'EXP-400',
        date: 'Mar 16, 2026',
        category: 'Rent',
        description: 'Branch rent – February 2026',
        vendor: 'Al-Masry Properties',
        amount: 15000,
        method: 'Transfer',
        status: 'approved',
    },
    {
        id: 'EXP-399',
        date: 'Mar 23, 2026',
        category: 'Utilities',
        description: 'Electricity & Water bill',
        vendor: 'Utility Company',
        amount: 1800,
        method: 'Cash',
        status: 'approved',
    },
    {
        id: 'EXP-398',
        date: 'Mar 13, 2026',
        category: 'Marketing',
        description: 'Instagram sponsored posts – Feb',
        vendor: 'Meta Ads',
        amount: 3000,
        method: 'Card',
        status: 'pending',
    },
    {
        id: 'EXP-397',
        date: 'Mar 25, 2026',
        category: 'Equipment',
        description: 'New hair dryer – Dyson Supersonic',
        vendor: 'Dyson Egypt',
        amount: 8500,
        method: 'Card',
        status: 'approved',
    },
    {
        id: 'EXP-396',
        date: 'Mar 24, 2026',
        category: 'Supplies',
        description: 'Facial masks & serums restock',
        vendor: 'DermaCare Ltd.',
        amount: 1200,
        method: 'Cash',
        status: 'approved',
    },
    {
        id: 'EXP-395',
        date: 'Mar 23, 2026',
        category: 'Salary',
        description: 'Employee salaries – February',
        vendor: '—',
        amount: 45000,
        method: 'Transfer',
        status: 'approved',
    },
    {
        id: 'EXP-394',
        date: 'Mar 16, 2026',
        category: 'Maintenance',
        description: 'AC repair & servicing',
        vendor: 'CoolTech Services',
        amount: 650,
        method: 'Cash',
        status: 'approved',
    },
];

const categoryColors: Record<string, string> = {
    Supplies: 'var(--color-primary-500)',
    Rent: '#8B5CF6',
    Utilities: '#3B82F6',
    Marketing: '#EC4899',
    Equipment: '#F59E0B',
    Salary: '#10B981',
    Maintenance: '#6366F1',
};

const statusStyles: Record<string, { bg: string; color: string }> = {
    approved: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    pending: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    rejected: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

const getTabItems = (t: (key: string) => string) => [
    { label: t('exp.tabList'), href: '/expenses', icon: <Receipt size={16} /> },
    { label: t('exp.tabInvoices'), href: '/expenses/invoices', icon: <FileText size={16} /> },
    { label: t('exp.tabRecurring'), href: '/expenses/recurring', icon: <Repeat size={16} /> },
    { label: t('exp.tabVendors'), href: '/expenses/vendors', icon: <Wallet size={16} /> },
    { label: t('exp.tabCategories'), href: '/expenses/categories', icon: <PieChart size={16} /> },
];

export default function ExpensesPage() {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('all');
    const { addToast } = useToast();
    const { t } = useTranslation();
    const { user } = useAuth();
    const isNewWorkspace = user?.isNewWorkspace;

    // API: fetch expenses
    const {
        data: apiExpenses,
        loading: expensesLoading,
        error: expensesError,
        refetch: refetchExpenses,
        setData: setExpensesData,
    } = useApiQuery<Expense[]>(() => expenseApi.getExpenses(), [], {
        fallbackData: fallbackExpenses as unknown as Expense[],
    });

    const expenses = (apiExpenses as unknown as typeof fallbackExpenses) || fallbackExpenses;

    // Add-Expense modal (controlled form + optimistic insert). The page previously
    // had two "Add Expense" buttons with no handler and no modal at all.
    type ExpenseRow = (typeof fallbackExpenses)[number];
    const emptyExpense = {
        description: '',
        category: 'Supplies',
        vendor: '',
        amount: '',
        method: 'Cash',
        status: 'pending',
    };
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [expForm, setExpForm] = useState(emptyExpense);
    const openAdd = () => {
        setExpForm(emptyExpense);
        setIsAddOpen(true);
    };
    const saveExpense = async () => {
        if (!expForm.description.trim()) {
            addToast('error', t('expenses.descRequired'));
            return;
        }
        const amountNum = Number(expForm.amount);
        if (!amountNum || amountNum <= 0) {
            addToast('error', t('expenses.amountRequired'));
            return;
        }
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const newRow: ExpenseRow = {
            id: `EXP-${Date.now()}`,
            date: today,
            category: expForm.category,
            description: expForm.description.trim(),
            vendor: expForm.vendor.trim() || '—',
            amount: amountNum,
            method: expForm.method,
            status: expForm.status,
        };
        setExpensesData(prev => [newRow as unknown as Expense, ...(prev ?? [])]);
        setIsAddOpen(false);
        try {
            await expenseApi.createExpense({ ...newRow });
        } catch {
            // offline/demo: keep the optimistic local row
        }
        addToast('success', t('expenses.toastAdded'));
    };

    const filtered = expenses.filter((e: (typeof fallbackExpenses)[number]) => {
        const matchSearch =
            e.id.toLowerCase().includes(search.toLowerCase()) ||
            e.description.toLowerCase().includes(search.toLowerCase()) ||
            e.vendor.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === 'all' || e.category.toLowerCase() === catFilter;
        return matchSearch && matchCat;
    });

    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.h1}>{t('expenses.title')}</h1>
                    <p className={styles.sub}>{t('expenses.desc')}</p>
                </div>
                <div className={styles.actions}>
                    <button
                        className={styles.btnOutline}
                        onClick={() => {
                            const csv = [
                                'Date,Category,Description,Vendor,Amount,Method,Status',
                                ...expenses.map(
                                    e =>
                                        `${e.date},${e.category},"${e.description}",${e.vendor},${e.amount},${e.method},${e.status}`
                                ),
                            ].join('\n');
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = 'expenses.csv';
                            a.click();
                        }}
                    >
                        <Download size={16} /> {t('expenses.export')}
                    </button>
                    <button className={styles.btnPrimary} onClick={openAdd}>
                        <Plus size={16} /> {t('expenses.add')}
                    </button>
                </div>
            </div>

            <div className={styles.tabs}>
                {getTabItems(t).map(tab => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`${styles.tab} ${tab.href === '/expenses' ? styles.tabActive : ''}`}
                    >
                        {tab.icon} {tab.label}
                    </Link>
                ))}
            </div>

            {/* Summary */}
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>{t('expenses.total')}</div>
                    <div className={styles.summaryValue}>
                        {totalExpenses.toLocaleString()} {egpLabel()}
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>{t('expenses.pending')}</div>
                    <div className={styles.summaryValueWarning}>
                        {expenses.filter(e => e.status === 'pending').length}
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>{t('expenses.topCategory')}</div>
                    <div className={styles.summaryValueNormal}>{t('exp.catSalary')}</div>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrap}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.input}
                        placeholder={t('exp.search')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select className={styles.select} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                    <option value="all">{t('exp.catAll')}</option>
                    <option value="supplies">{t('exp.catSupplies')}</option>
                    <option value="rent">{t('exp.catRent')}</option>
                    <option value="utilities">{t('exp.catUtilities')}</option>
                    <option value="marketing">{t('exp.catMarketing')}</option>
                    <option value="equipment">{t('exp.catEquipment')}</option>
                    <option value="salary">{t('exp.catSalary')}</option>
                    <option value="maintenance">{t('exp.catMaintenance')}</option>
                </select>
            </div>

            {isNewWorkspace ? (
                <div
                    style={{
                        padding: 'var(--space-12) 0',
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-color)',
                        marginTop: 'var(--space-6)',
                    }}
                >
                    <EmptyState
                        icon={<Receipt size={48} color="var(--color-primary-500)" />}
                        title={t('expenses.emptyNewWorkspaceTitle')}
                        description={t('expenses.emptyNewWorkspaceDesc')}
                        action={
                            <button
                                className={styles.btnPrimary}
                                style={{ margin: '0 auto', display: 'flex', marginTop: 'var(--space-4)' }}
                                onClick={openAdd}
                            >
                                <Plus size={16} style={{ marginInlineEnd: 'var(--space-1)' }} /> {t('expenses.add')}
                            </button>
                        }
                    />
                </div>
            ) : (
                <DataGuard
                    loading={expensesLoading}
                    error={expensesError}
                    data={filtered}
                    emptyIcon={<Receipt size={48} />}
                    emptyTitle={t('expenses.title')}
                    emptyDescription={t('expenses.noExpensesFound')}
                    onRetry={refetchExpenses}
                >
                    <div className={styles.card}>
                        <div className={styles.tableResponsive}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th className={styles.th}>{t('exp.thId')}</th>
                                        <th className={styles.th}>{t('exp.thDate')}</th>
                                        <th className={styles.th}>{t('exp.thCategory')}</th>
                                        <th className={styles.th}>{t('exp.thDesc')}</th>
                                        <th className={styles.th}>{t('exp.thVendor')}</th>
                                        <th className={styles.th}>{t('exp.thMethod')}</th>
                                        <th className={`${styles.th} ${styles.thRight}`}>{t('exp.thAmount')}</th>
                                        <th className={styles.th}>{t('exp.thStatus')}</th>
                                        <th className={styles.th}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(exp => {
                                        const st = statusStyles[exp.status];
                                        return (
                                            <tr
                                                key={exp.id}
                                                className={`${styles.tr} ${styles.trInteractive}`}
                                                onClick={() =>
                                                    addToast('info', t('expenses.toastViewing').replace('{id}', exp.id))
                                                }
                                            >
                                                <td className={`${styles.td} ${styles.idCell}`}>{exp.id}</td>
                                                <td className={styles.td}>{exp.date}</td>
                                                <td className={styles.td}>
                                                    <span
                                                        className={styles.catDot}
                                                        role="presentation"
                                                        aria-hidden="true"
                                                        style={{
                                                            background:
                                                                categoryColors[exp.category] || 'var(--text-tertiary)',
                                                        }}
                                                    />
                                                    {exp.category}
                                                </td>
                                                <td className={`${styles.td} ${styles.truncate}`}>{exp.description}</td>
                                                <td className={`${styles.td} ${styles.vendorCell}`}>{exp.vendor}</td>
                                                <td className={styles.td}>{exp.method}</td>
                                                <td className={`${styles.td} ${styles.amountCell}`}>
                                                    -{exp.amount.toLocaleString()} {egpLabel()}
                                                </td>
                                                <td className={styles.td}>
                                                    <span
                                                        className={styles.badge}
                                                        style={{ background: st.bg, color: st.color }}
                                                    >
                                                        {t(
                                                            `exp.st${exp.status.charAt(0).toUpperCase() + exp.status.slice(1)}`
                                                        )}
                                                    </span>
                                                </td>
                                                <td className={styles.td}>
                                                    <DropdownMenu
                                                        trigger={
                                                            <button className={styles.actionBtn}>
                                                                <MoreVertical size={16} />
                                                            </button>
                                                        }
                                                        items={[
                                                            {
                                                                label: t('exp.actionView'),
                                                                icon: <Search size={14} />,
                                                                onClick: () =>
                                                                    addToast('info', t('expenses.toastViewingDetails')),
                                                            },
                                                            {
                                                                label: t('exp.actionEdit'),
                                                                icon: <FileText size={14} />,
                                                                onClick: () =>
                                                                    addToast('info', t('expenses.toastEditMode')),
                                                            },
                                                            {
                                                                label: t('exp.actionDelete'),
                                                                icon: <MoreVertical size={14} />,
                                                                onClick: async () => {
                                                                    try {
                                                                        await expenseApi.deleteExpense(exp.id);
                                                                        refetchExpenses();
                                                                    } catch {
                                                                        /* fallback */
                                                                    }
                                                                    addToast('error', t('expenses.toastDeleted'));
                                                                },
                                                                destructive: true,
                                                            },
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
                            <span className={styles.pageInfo}>
                                {t('exp.showing')
                                    .replace('{visible}', filtered.length.toString())
                                    .replace('{total}', expenses.length.toString())}
                            </span>
                        </div>
                    </div>
                </DataGuard>
            )}

            {/* Add Expense Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('expenses.addTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button onClick={saveExpense}>{t('common.save')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('exp.thDesc')}
                        value={expForm.description}
                        onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))}
                    />
                    <Select
                        label={t('exp.thCategory')}
                        value={expForm.category}
                        onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))}
                        options={[
                            { label: t('exp.catSupplies'), value: 'Supplies' },
                            { label: t('exp.catRent'), value: 'Rent' },
                            { label: t('exp.catUtilities'), value: 'Utilities' },
                            { label: t('exp.catMarketing'), value: 'Marketing' },
                            { label: t('exp.catEquipment'), value: 'Equipment' },
                            { label: t('exp.catSalary'), value: 'Salary' },
                            { label: t('exp.catMaintenance'), value: 'Maintenance' },
                        ]}
                    />
                    <Input
                        label={t('exp.thVendor')}
                        value={expForm.vendor}
                        onChange={e => setExpForm(f => ({ ...f, vendor: e.target.value }))}
                    />
                    <Input
                        label={t('exp.thAmount')}
                        type="number"
                        value={expForm.amount}
                        onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))}
                    />
                    <Select
                        label={t('exp.thMethod')}
                        value={expForm.method}
                        onChange={e => setExpForm(f => ({ ...f, method: e.target.value }))}
                        options={[
                            { label: t('expenses.methodCash'), value: 'Cash' },
                            { label: t('expenses.methodCard'), value: 'Card' },
                            { label: t('expenses.methodTransfer'), value: 'Transfer' },
                        ]}
                    />
                    <Select
                        label={t('exp.thStatus')}
                        value={expForm.status}
                        onChange={e => setExpForm(f => ({ ...f, status: e.target.value }))}
                        options={[
                            { label: t('exp.stPending'), value: 'pending' },
                            { label: t('exp.stApproved'), value: 'approved' },
                            { label: t('exp.stRejected'), value: 'rejected' },
                        ]}
                    />
                </div>
            </Modal>
        </div>
    );
}
