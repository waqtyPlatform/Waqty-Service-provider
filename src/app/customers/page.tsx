'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Plus,
    Download,
    Upload,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Phone,
    Mail,
    Star,
    AlertTriangle,
    Users,
    UserPlus,
    CreditCard,
    Clock,
} from 'lucide-react';
import styles from './customers.module.css';

const clients = [
    { id: 'C001', name: 'Fatima Al-Rashid', phone: '+20 123 456 789', email: 'fatima@email.com', visits: 24, spend: 8400, lastVisit: 'Feb 15, 2026', vip: true, hasAllergy: true, group: 'VIP', status: 'active' },
    { id: 'C002', name: 'Aisha Mohammed', phone: '+20 111 222 333', email: 'aisha@email.com', visits: 19, spend: 6250, lastVisit: 'Feb 12, 2026', vip: true, hasAllergy: false, group: 'VIP', status: 'active' },
    { id: 'C003', name: 'Maryam Ibrahim', phone: '+20 100 200 300', email: 'maryam@email.com', visits: 17, spend: 5800, lastVisit: 'Feb 10, 2026', vip: false, hasAllergy: false, group: 'Regular', status: 'active' },
    { id: 'C004', name: 'Huda Saleh', phone: '+20 155 666 777', email: 'huda@email.com', visits: 15, spend: 4900, lastVisit: 'Feb 8, 2026', vip: false, hasAllergy: true, group: 'Regular', status: 'active' },
    { id: 'C005', name: 'Noura Ahmed', phone: '+20 199 888 999', email: 'noura@email.com', visits: 12, spend: 3600, lastVisit: 'Feb 5, 2026', vip: false, hasAllergy: false, group: 'Regular', status: 'active' },
    { id: 'C006', name: 'Rania Khalil', phone: '+20 133 444 555', email: 'rania@email.com', visits: 8, spend: 2400, lastVisit: 'Jan 28, 2026', vip: false, hasAllergy: false, group: 'New', status: 'active' },
    { id: 'C007', name: 'Dana Faris', phone: '+20 177 333 222', email: 'dana@email.com', visits: 6, spend: 1800, lastVisit: 'Jan 20, 2026', vip: false, hasAllergy: false, group: 'New', status: 'inactive' },
    { id: 'C008', name: 'Lina Tariq', phone: '+20 122 555 666', email: 'lina@email.com', visits: 3, spend: 750, lastVisit: 'Jan 10, 2026', vip: false, hasAllergy: false, group: 'New', status: 'inactive' },
];

const tabItems = [
    { label: 'Clients', href: '/customers', icon: <Users size={16} /> },
    { label: 'Client Groups', href: '/customers/groups', icon: <Star size={16} /> },
    { label: 'Account Statements', href: '/customers/statements', icon: <CreditCard size={16} /> },
    { label: 'Last Visits', href: '/customers/last-visits', icon: <Clock size={16} /> },
];

export default function CustomersPage() {
    const [search, setSearch] = useState('');
    const [groupFilter, setGroupFilter] = useState('all');

    const filtered = clients.filter((c) => {
        const matchSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search) ||
            c.email.toLowerCase().includes(search.toLowerCase());
        const matchGroup = groupFilter === 'all' || c.group.toLowerCase() === groupFilter;
        return matchSearch && matchGroup;
    });

    return (
        <div className={styles.customersPage}>
            <div className={styles.header}>
                <div>
                    <h1>Customers</h1>
                    <p>Manage your client database and relationships.</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.btnOutline}>
                        <Upload size={16} /> Import
                    </button>
                    <button className={styles.btnOutline}>
                        <Download size={16} /> Export
                    </button>
                    <button className={styles.btnPrimary}>
                        <Plus size={16} /> Add Client
                    </button>
                </div>
            </div>

            <div className={styles.tabs}>
                {tabItems.map((tab) => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`${styles.tab} ${tab.href === '/customers' ? styles.tabActive : ''}`}
                    >
                        {tab.icon} {tab.label}
                    </Link>
                ))}
            </div>

            {/* KPI Row */}
            <div className={styles.kpiRow}>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                        <Users size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{clients.length}</div>
                        <div className={styles.kpiLabel}>Total Clients</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: '#FEF3C7', color: '#B45309' }}>
                        <Star size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{clients.filter((c) => c.vip).length}</div>
                        <div className={styles.kpiLabel}>VIP Clients</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>
                        <UserPlus size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{clients.filter((c) => c.group === 'New').length}</div>
                        <div className={styles.kpiLabel}>New This Month</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: 'var(--color-error-light)', color: 'var(--color-error)' }}>
                        <AlertTriangle size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{clients.filter((c) => c.status === 'inactive').length}</div>
                        <div className={styles.kpiLabel}>Inactive (30d+)</div>
                    </div>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder="Search by name, phone, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className={styles.selectFilter}
                    value={groupFilter}
                    onChange={(e) => setGroupFilter(e.target.value)}
                >
                    <option value="all">All Groups</option>
                    <option value="vip">VIP</option>
                    <option value="regular">Regular</option>
                    <option value="new">New</option>
                </select>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Contact</th>
                            <th>Group</th>
                            <th>Visits</th>
                            <th>Total Spend</th>
                            <th>Last Visit</th>
                            <th>Flags</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((c) => (
                            <tr key={c.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div className={styles.avatar}>
                                            {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'var(--font-semibold)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                                {c.name}
                                                {c.vip && <Star size={14} fill="#F59E0B" stroke="#F59E0B" />}
                                            </div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{c.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
                                            <Phone size={12} style={{ color: 'var(--text-tertiary)' }} /> {c.phone}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            <Mail size={12} /> {c.email}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.groupBadge} ${styles[`group${c.group}`]}`}>
                                        {c.group}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 'var(--font-medium)' }}>{c.visits}</td>
                                <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)' }}>
                                    {c.spend.toLocaleString()} EGP
                                </td>
                                <td>
                                    <span style={{ color: c.status === 'inactive' ? 'var(--color-error)' : 'var(--text-secondary)' }}>
                                        {c.lastVisit}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                        {c.hasAllergy && (
                                            <span className={styles.flagBadge} title="Has Allergies">
                                                <AlertTriangle size={12} /> Allergy
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <button className={styles.actionBtn}>
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>Showing {filtered.length} of {clients.length} clients</span>
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
