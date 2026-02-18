'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Plus,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Users,
    Calendar,
    BarChart3,
    Clock,
    Award,
    Target,
    Briefcase,
    UserCog,
} from 'lucide-react';

const employees = [
    { id: 'E001', name: 'Sara Ahmed', role: 'Senior Stylist', phone: '+20 123 456 789', branch: 'Main', status: 'available', bookingsToday: 7, rating: 4.9, revenue: 14200, avatar: 'SA', color: '#8B5CF6' },
    { id: 'E002', name: 'Nora Ali', role: 'Skin Specialist', phone: '+20 111 222 333', branch: 'Main', status: 'in-session', bookingsToday: 6, rating: 4.8, revenue: 12800, avatar: 'NA', color: '#EC4899' },
    { id: 'E003', name: 'Layla Hassan', role: 'Senior Therapist', phone: '+20 100 200 300', branch: 'Main', status: 'available', bookingsToday: 8, rating: 4.9, revenue: 11500, avatar: 'LH', color: '#3B82F6' },
    { id: 'E004', name: 'Reem Mohamed', role: 'Massage Therapist', phone: '+20 155 666 777', branch: 'Main', status: 'break', bookingsToday: 5, rating: 4.7, revenue: 9800, avatar: 'RM', color: '#10B981' },
    { id: 'E005', name: 'Hana Youssef', role: 'Nail Technician', phone: '+20 199 888 999', branch: 'Main', status: 'available', bookingsToday: 4, rating: 4.6, revenue: 8100, avatar: 'HY', color: '#F59E0B' },
    { id: 'E006', name: 'Dina Kamal', role: 'Junior Stylist', phone: '+20 144 555 666', branch: 'Downtown', status: 'off', bookingsToday: 0, rating: 4.5, revenue: 5400, avatar: 'DK', color: '#6366F1' },
];

const statusMap: Record<string, { label: string; bg: string; color: string }> = {
    available: { label: 'Available', bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    'in-session': { label: 'In Session', bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    break: { label: 'On Break', bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    off: { label: 'Day Off', bg: 'var(--color-gray-100)', color: 'var(--color-gray-500)' },
};

const tabItems = [
    { label: 'Staff List', href: '/employees', icon: <Users size={16} /> },
    { label: 'Schedule', href: '/employees/schedule', icon: <Calendar size={16} /> },
    { label: 'Performance', href: '/employees/performance', icon: <BarChart3 size={16} /> },
    { label: 'Time Tracking', href: '/employees/time-tracking', icon: <Clock size={16} /> },
    { label: 'Commissions', href: '/employees/commissions', icon: <Award size={16} /> },
    { label: 'Targets', href: '/employees/targets', icon: <Target size={16} /> },
    { label: 'Roles', href: '/employees/roles', icon: <Briefcase size={16} /> },
    { label: 'Permissions', href: '/employees/permissions', icon: <UserCog size={16} /> },
];

const cardStyles: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    h1: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    p: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' },
    tabs: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', transition: 'all var(--transition-fast)', textDecoration: 'none', whiteSpace: 'nowrap' as const },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', transition: 'all var(--transition-fast)', cursor: 'pointer' },
    cardTop: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' },
    avatar: { width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'white' },
    name: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
    role: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    badge: { display: 'inline-flex', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)' },
    statItem: { textAlign: 'center' as const },
    statVal: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    statLabel: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    btn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
};

export default function EmployeesPage() {
    const [search, setSearch] = useState('');
    const filtered = employees.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={cardStyles.page}>
            <div style={cardStyles.header}>
                <div>
                    <h1 style={cardStyles.h1}>Employees</h1>
                    <p style={cardStyles.p}>Manage your team, roles, and performance.</p>
                </div>
                <button style={cardStyles.btn}>
                    <Plus size={16} /> Add Employee
                </button>
            </div>

            <div style={cardStyles.tabs}>
                {tabItems.map((tab) => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        style={tab.href === '/employees' ? { ...cardStyles.tab, ...cardStyles.tabActive } : cardStyles.tab}
                    >
                        {tab.icon} {tab.label}
                    </Link>
                ))}
            </div>

            <div style={{ maxWidth: 320, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                    style={{
                        width: '100%', height: 40, padding: '0 var(--space-4) 0 36px',
                        border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
                        background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)',
                    }}
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div style={cardStyles.grid}>
                {filtered.map((emp) => {
                    const st = statusMap[emp.status];
                    return (
                        <div
                            key={emp.id}
                            style={cardStyles.card}
                            onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-primary-200)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-color)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
                        >
                            <div style={cardStyles.cardTop}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <div style={{ ...cardStyles.avatar, background: emp.color }}>{emp.avatar}</div>
                                    <div>
                                        <div style={cardStyles.name}>{emp.name}</div>
                                        <div style={cardStyles.role}>{emp.role}</div>
                                    </div>
                                </div>
                                <span style={{ ...cardStyles.badge, background: st.bg, color: st.color }}>
                                    {st.label}
                                </span>
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                                {emp.branch} Branch • {emp.phone}
                            </div>
                            <div style={cardStyles.statsRow}>
                                <div style={cardStyles.statItem}>
                                    <div style={cardStyles.statVal}>{emp.bookingsToday}</div>
                                    <div style={cardStyles.statLabel}>Today</div>
                                </div>
                                <div style={cardStyles.statItem}>
                                    <div style={{ ...cardStyles.statVal, color: '#F59E0B' }}>★ {emp.rating}</div>
                                    <div style={cardStyles.statLabel}>Rating</div>
                                </div>
                                <div style={cardStyles.statItem}>
                                    <div style={{ ...cardStyles.statVal, color: 'var(--color-primary-600)' }}>{(emp.revenue / 1000).toFixed(1)}K</div>
                                    <div style={cardStyles.statLabel}>Revenue</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
