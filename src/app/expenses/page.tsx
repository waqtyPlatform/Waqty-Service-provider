'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Plus,
    Download,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Receipt,
    FileText,
    Repeat,
    Wallet,
    PieChart,
} from 'lucide-react';

const expenses = [
    { id: 'EXP-401', date: 'Feb 17, 2026', category: 'Supplies', description: 'Hair color products (L\'Oréal)', vendor: 'Beauty Suppliers Co.', amount: 2500, method: 'Transfer', status: 'approved' },
    { id: 'EXP-400', date: 'Feb 16, 2026', category: 'Rent', description: 'Branch rent – February 2026', vendor: 'Al-Masry Properties', amount: 15000, method: 'Transfer', status: 'approved' },
    { id: 'EXP-399', date: 'Feb 15, 2026', category: 'Utilities', description: 'Electricity & Water bill', vendor: 'Utility Company', amount: 1800, method: 'Cash', status: 'approved' },
    { id: 'EXP-398', date: 'Feb 14, 2026', category: 'Marketing', description: 'Instagram sponsored posts – Feb', vendor: 'Meta Ads', amount: 3000, method: 'Card', status: 'pending' },
    { id: 'EXP-397', date: 'Feb 13, 2026', category: 'Equipment', description: 'New hair dryer – Dyson Supersonic', vendor: 'Dyson Egypt', amount: 8500, method: 'Card', status: 'approved' },
    { id: 'EXP-396', date: 'Feb 12, 2026', category: 'Supplies', description: 'Facial masks & serums restock', vendor: 'DermaCare Ltd.', amount: 1200, method: 'Cash', status: 'approved' },
    { id: 'EXP-395', date: 'Feb 10, 2026', category: 'Salary', description: 'Employee salaries – February', vendor: '—', amount: 45000, method: 'Transfer', status: 'approved' },
    { id: 'EXP-394', date: 'Feb 8, 2026', category: 'Maintenance', description: 'AC repair & servicing', vendor: 'CoolTech Services', amount: 650, method: 'Cash', status: 'approved' },
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

const tabItems = [
    { label: 'Expense List', href: '/expenses', icon: <Receipt size={16} /> },
    { label: 'Invoices', href: '/expenses/invoices', icon: <FileText size={16} /> },
    { label: 'Recurring', href: '/expenses/recurring', icon: <Repeat size={16} /> },
    { label: 'Vendors', href: '/expenses/vendors', icon: <Wallet size={16} /> },
    { label: 'By Category', href: '/expenses/categories', icon: <PieChart size={16} /> },
];

export default function ExpensesPage() {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('all');

    const filtered = expenses.filter((e) => {
        const matchSearch =
            e.id.toLowerCase().includes(search.toLowerCase()) ||
            e.description.toLowerCase().includes(search.toLowerCase()) ||
            e.vendor.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === 'all' || e.category.toLowerCase() === catFilter;
        return matchSearch && matchCat;
    });

    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

    const s: Record<string, React.CSSProperties> = {
        page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
        h1: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
        sub: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' },
        actions: { display: 'flex', gap: 'var(--space-3)' },
        btnPrimary: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
        btnOutline: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' },
        tabs: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
        tab: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', textDecoration: 'none', whiteSpace: 'nowrap' as const },
        tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
        controls: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' as const, alignItems: 'center' },
        card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
        th: { textAlign: 'left' as const, padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' as const },
        td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle' as const },
        searchWrap: { position: 'relative' as const, flex: '1', minWidth: 200, maxWidth: 320 },
        searchIcon: { position: 'absolute' as const, left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' as const },
        input: { width: '100%', height: 40, padding: '0 var(--space-4) 0 36px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
        select: { height: 40, padding: '0 var(--space-8) 0 var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', cursor: 'pointer' },
        badge: { display: 'inline-flex', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' },
        catDot: { width: 10, height: 10, borderRadius: '50%', display: 'inline-block', marginRight: 8 },
        pag: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--border-color)' },
    };

    return (
        <div style={s.page}>
            <div style={s.header}>
                <div>
                    <h1 style={s.h1}>Expenses</h1>
                    <p style={s.sub}>Track and manage all business expenses.</p>
                </div>
                <div style={s.actions}>
                    <button style={s.btnOutline}><Download size={16} /> Export</button>
                    <button style={s.btnPrimary}><Plus size={16} /> Add Expense</button>
                </div>
            </div>

            <div style={s.tabs}>
                {tabItems.map((tab) => (
                    <Link key={tab.href} href={tab.href} style={tab.href === '/expenses' ? { ...s.tab, ...s.tabActive } : s.tab}>
                        {tab.icon} {tab.label}
                    </Link>
                ))}
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Total Expenses (Month)</div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-error)', marginTop: 'var(--space-1)' }}>{totalExpenses.toLocaleString()} EGP</div>
                </div>
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Pending Approval</div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-warning)', marginTop: 'var(--space-1)' }}>{expenses.filter(e => e.status === 'pending').length}</div>
                </div>
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Top Category</div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginTop: 'var(--space-1)' }}>Salary</div>
                </div>
            </div>

            <div style={s.controls}>
                <div style={s.searchWrap}>
                    <Search size={16} style={s.searchIcon} />
                    <input style={s.input} placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select style={s.select} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
                    <option value="all">All Categories</option>
                    <option value="supplies">Supplies</option>
                    <option value="rent">Rent</option>
                    <option value="utilities">Utilities</option>
                    <option value="marketing">Marketing</option>
                    <option value="equipment">Equipment</option>
                    <option value="salary">Salary</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </div>

            <div style={s.card}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={s.th}>Expense #</th>
                            <th style={s.th}>Date</th>
                            <th style={s.th}>Category</th>
                            <th style={s.th}>Description</th>
                            <th style={s.th}>Vendor</th>
                            <th style={s.th}>Method</th>
                            <th style={{ ...s.th, textAlign: 'right' }}>Amount</th>
                            <th style={s.th}>Status</th>
                            <th style={s.th}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((exp) => {
                            const st = statusStyles[exp.status];
                            return (
                                <tr key={exp.id} style={{ transition: 'background var(--transition-fast)' }}>
                                    <td style={{ ...s.td, color: 'var(--color-primary-500)', fontWeight: 'var(--font-medium)', cursor: 'pointer' }}>{exp.id}</td>
                                    <td style={s.td}>{exp.date}</td>
                                    <td style={s.td}>
                                        <span style={s.catDot} className="" role="presentation" aria-hidden="true">
                                            <span style={{ ...s.catDot, background: categoryColors[exp.category] || 'var(--text-tertiary)' }} />
                                        </span>
                                        {exp.category}
                                    </td>
                                    <td style={{ ...s.td, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.description}</td>
                                    <td style={{ ...s.td, color: 'var(--text-secondary)' }}>{exp.vendor}</td>
                                    <td style={s.td}>{exp.method}</td>
                                    <td style={{ ...s.td, textAlign: 'right', fontWeight: 'var(--font-semibold)', color: 'var(--color-error)' }}>
                                        -{exp.amount.toLocaleString()} EGP
                                    </td>
                                    <td style={s.td}>
                                        <span style={{ ...s.badge, background: st.bg, color: st.color }}>
                                            {exp.status.charAt(0).toUpperCase() + exp.status.slice(1)}
                                        </span>
                                    </td>
                                    <td style={s.td}>
                                        <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-tertiary)' }}>
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div style={s.pag}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Showing {filtered.length} of {expenses.length}</span>
                </div>
            </div>
        </div>
    );
}
