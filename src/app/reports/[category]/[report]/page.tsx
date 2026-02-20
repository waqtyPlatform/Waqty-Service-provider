'use client';

import React from 'react';
import Link from 'next/link';
import {
    BarChart3,
    Calendar,
    Download,
    Filter,
    Search,
    TrendingUp,
    Users,
    DollarSign,
    CalendarDays,
    Clock,
    Star,
    Package,
    FileText,
    PieChart,
    Activity,
    ArrowUpRight,
    ArrowRight
} from 'lucide-react';
import {
    Button,
    Select,
    Input,
    Badge
} from '@/components/ui';
import styles from './page.module.css';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart as ReLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    AreaChart,
    Area
} from 'recharts';

const getSalesData = (report: string) => {
    const common = {
        chartType: 'bar',
        rows: [
            { id: 1, date: '2026-02-18', amount: 3200, count: 12, status: 'Completed', link: '/transactions/dailies?date=2026-02-18' },
            { id: 2, date: '2026-02-17', amount: 2800, count: 10, status: 'Completed', link: '/transactions/dailies?date=2026-02-17' },
            { id: 3, date: '2026-02-16', amount: 4100, count: 15, status: 'Completed', link: '/transactions/dailies?date=2026-02-16' },
            { id: 4, date: '2026-02-15', amount: 3500, count: 14, status: 'Completed', link: '/transactions/dailies?date=2026-02-15' },
            { id: 5, date: '2026-02-14', amount: 5200, count: 20, status: 'Completed', link: '/transactions/dailies?date=2026-02-14' },
        ],
        chartData: [
            { name: 'Feb 14', value: 5200 },
            { name: 'Feb 15', value: 3500 },
            { name: 'Feb 16', value: 4100 },
            { name: 'Feb 17', value: 2800 },
            { name: 'Feb 18', value: 3200 },
        ]
    };

    if (report === 'daily-revenue') {
        return {
            title: 'Daily Revenue Report',
            chartType: 'bar',
            columns: ['Date', 'Transactions', 'Revenue', 'Avg Ticket', 'Status', 'Action'],
            rows: common.rows.map(r => ({
                ...r,
                col1: r.date,
                col2: r.count,
                col3: `${r.amount} EGP`,
                col4: `${Math.round(r.amount / r.count)} EGP`,
                col5: r.status,
                action: { label: 'View Day', href: r.link }
            })),
            chartData: common.chartData
        };
    }
    if (report === 'payment-methods') {
        return {
            title: 'Payment Methods Analysis',
            chartType: 'bar',
            columns: ['Method', 'Transactions', 'Total Amount', '% of Total'],
            rows: [
                { id: 1, col1: 'Cash', col2: 145, col3: '45,200 EGP', col4: '45%' },
                { id: 2, col1: 'Credit Card', col2: 110, col3: '38,500 EGP', col4: '38%' },
                { id: 3, col1: 'Bank Transfer', col2: 25, col3: '12,000 EGP', col4: '12%' },
                { id: 4, col1: 'Gift Card', col2: 15, col3: '5,300 EGP', col4: '5%' },
            ],
            chartData: [{ name: 'Cash', value: 45200 }, { name: 'Card', value: 38500 }, { name: 'Transfer', value: 12000 }, { name: 'Gift', value: 5300 }]
        };
    }
    if (report === 'service-revenue') {
        return {
            title: 'Revenue by Service',
            chartType: 'bar',
            columns: ['Service Name', 'Category', 'Qty Sold', 'Revenue'],
            rows: [
                { id: 1, col1: 'Hair Cut & Style', col2: 'Hair', col3: 85, col4: '12,750 EGP' },
                { id: 2, col1: 'Gel Manicure', col2: 'Nails', col3: 65, col4: '9,750 EGP' },
                { id: 3, col1: 'Classic Facial', col2: 'Skin', col3: 40, col4: '14,000 EGP' },
                { id: 4, col1: 'Full Body Massage', col2: 'Body', col3: 30, col4: '15,000 EGP' },
            ],
            chartData: [{ name: 'Hair Cut', value: 12750 }, { name: 'Manicure', value: 9750 }, { name: 'Facial', value: 14000 }, { name: 'Massage', value: 15000 }]
        };
    }
    return { title: 'Sales Report', ...common, columns: ['Date', 'Count', 'Amount', 'Avg', 'Status', 'Action'], rows: common.rows.map(r => ({ ...r, col1: r.date, col2: r.count, col3: r.amount, col4: Math.round(r.amount / r.count), col5: r.status, action: { label: 'View', href: '#' } })), chartData: common.chartData };
};

const getBookingsData = (report: string) => {
    if (report === 'cancellations') {
        return {
            title: 'Cancellation Report',
            chartType: 'bar',
            columns: ['Date', 'Cancelled By', 'Reason', 'Lost Revenue', 'Action'],
            rows: [
                { id: 1, col1: '2026-02-18', col2: 'Client', col3: 'Sick', col4: '450 EGP', action: { label: 'View Booking', href: '/bookings/BK-28492' } },
                { id: 2, col1: '2026-02-17', col2: 'Client', col3: 'Schedule Conflict', col4: '300 EGP', action: { label: 'View Booking', href: '/bookings/BK-28491' } },
                { id: 3, col1: '2026-02-15', col2: 'System', col3: 'No Show', col4: '600 EGP', action: { label: 'View Booking', href: '/bookings/BK-28490' } },
            ],
            chartData: [{ name: 'Feb 15', value: 1 }, { name: 'Feb 16', value: 0 }, { name: 'Feb 17', value: 1 }, { name: 'Feb 18', value: 1 }]
        };
    }
    // Mock for Booking History
    if (report === 'history') {
        return {
            title: 'Booking History',
            chartType: 'none',
            columns: ['ID', 'Date', 'Client', 'Service', 'Status', 'Action'],
            rows: [
                { id: 1, col1: '#BK-1001', col2: 'Feb 18', col3: 'Fatima Al-Rashid', col4: 'Hair Cut', col5: 'Completed', action: { label: 'View', href: '/bookings/BK-1001' } },
                { id: 2, col1: '#BK-1002', col2: 'Feb 18', col3: 'Maha Mahmoud', col4: 'Manicure', col5: 'Confirmed', action: { label: 'View', href: '/bookings/BK-1002' } },
                { id: 3, col1: '#BK-1003', col2: 'Feb 17', col3: 'Layla Ahmed', col4: 'Facial', col5: 'Cancelled', action: { label: 'View', href: '/bookings/BK-1003' } },
            ],
            chartData: []
        };
    }

    return {
        title: 'Booking Report',
        chartType: 'bar',
        columns: ['Date', 'Total Bookings', 'Completed', 'Cancelled', 'Utilization', 'Action'],
        rows: [
            { id: 1, col1: 'Feb 18', col2: 45, col3: 40, col4: 2, col5: '88%', action: { label: 'Details', href: '/reports/bookings/daily?date=2026-02-18' } },
            { id: 2, col1: 'Feb 17', col2: 42, col3: 38, col4: 1, col5: '85%', action: { label: 'Details', href: '/reports/bookings/daily?date=2026-02-17' } },
        ],
        chartData: [{ name: 'Feb 17', value: 42 }, { name: 'Feb 18', value: 45 }]
    };
};

const getEmployeesData = (report: string) => {
    if (report === 'commissions') {
        return {
            title: 'Commission Report',
            chartType: 'bar',
            columns: ['Employee', 'Service Revenue', 'Total Commission', 'Payout Status', 'Action'],
            rows: [
                { id: 1, col1: 'Sara Ahmed', col2: '24,000 EGP', col3: '2,600 EGP', col4: 'Pending', action: { label: 'View Profile', href: '/employees/EMP-001' } },
                { id: 2, col1: 'Nora Ali', col2: '18,000 EGP', col3: '1,880 EGP', col4: 'Paid', action: { label: 'View Profile', href: '/employees/EMP-002' } },
                { id: 3, col1: 'Mona Zein', col2: '15,000 EGP', col3: '1,650 EGP', col4: 'Pending', action: { label: 'View Profile', href: '/employees/EMP-003' } },
            ],
            chartData: [{ name: 'Sara', value: 2600 }, { name: 'Nora', value: 1880 }, { name: 'Mona', value: 1650 }]
        };
    }
    return {
        title: 'Employee Report',
        chartType: 'bar',
        columns: ['Employee', 'Metric A', 'Metric B', 'Action'],
        rows: [],
        chartData: []
    };
};

const generateData = (category: string, report: string) => {
    if (category === 'sales' || category === 'revenue') return getSalesData(report);
    if (category === 'bookings') return getBookingsData(report);
    if (category === 'employees') return getEmployeesData(report);

    // Fallback
    return {
        title: `${report.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        chartType: 'none',
        columns: ['ID', 'Date', 'Description', 'Value', 'Status', 'Action'],
        rows: [
            { id: 1, col1: '#001', col2: '2026-02-18', col3: 'Sample Item 1', col4: '100', col5: 'Active', action: { label: 'View', href: '#' } },
            { id: 2, col1: '#002', col2: '2026-02-17', col3: 'Sample Item 2', col4: '200', col5: 'Active', action: { label: 'View', href: '#' } },
        ],
        chartData: []
    };
};

export default function DynamicReportPage({ params }: { params: Promise<{ category: string; report: string }> }) {
    const { category, report } = React.use(params);
    const data = generateData(category, report);

    const tabItems = [
        { label: 'Overview', href: '/reports', icon: <BarChart3 size={16} /> },
        { label: 'Revenue', href: '/reports/revenue', icon: <DollarSign size={16} /> },
        { label: 'Bookings', href: '/reports/bookings', icon: <CalendarDays size={16} /> },
        { label: 'Clients', href: '/reports/clients', icon: <Users size={16} /> },
        { label: 'Employees', href: '/reports/employees', icon: <Star size={16} /> },
        { label: 'Services', href: '/reports/services', icon: <Package size={16} /> },
        { label: 'Inventory', href: '/reports/inventory', icon: <FileText size={16} /> },
        { label: 'Custom', href: '/reports/custom', icon: <Activity size={16} /> },
    ];

    const currentTabHref = `/reports/${category}`;

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Reports</h1>
                    <div className={styles.subtitle}>
                        Reports &gt; {category} &gt; {report.replace(/-/g, ' ')}
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button variant="outline"><Filter size={16} /> Filters</Button>
                    <Button><Download size={16} /> Export PDF</Button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto', marginBottom: 'var(--space-6)' }}>
                {tabItems.map((t) => {
                    const isActive = t.href === currentTabHref;
                    return (
                        <Link key={t.href} href={t.href} style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                            padding: 'var(--space-3) var(--space-4)',
                            fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)',
                            color: isActive ? 'var(--color-primary-500)' : 'var(--text-tertiary)',
                            borderBottom: isActive ? '2px solid var(--color-primary-500)' : '2px solid transparent',
                            marginBottom: '-2px', textDecoration: 'none', whiteSpace: 'nowrap'
                        }}>
                            {t.icon} {t.label}
                        </Link>
                    )
                })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)' }}>{data.title}</h2>
                <Badge color="primary">Generated Just Now</Badge>
            </div>

            {/* Filters */}
            <div className={styles.filtersBar}>
                <div className={styles.filterItem}>
                    <Calendar size={16} color="var(--text-tertiary)" />
                    <Select
                        options={[{ value: '7d', label: 'Last 7 Days' }, { value: '30d', label: 'Last 30 Days' }, { value: 'tm', label: 'This Month' }]}
                        style={{ width: 140 }}
                    />
                </div>
                <div className={styles.filterItem}>
                    <Filter size={16} color="var(--text-tertiary)" />
                    <Select
                        options={[{ value: 'all', label: 'All Branches' }, { value: 'main', label: 'Main Branch' }]}
                        style={{ width: 140 }}
                    />
                </div>
                <div className={styles.filterItem} style={{ marginLeft: 'auto' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: 8, top: 10, color: 'var(--text-tertiary)' }} />
                        <Input placeholder="Search..." style={{ paddingLeft: 28, width: 200 }} />
                    </div>
                </div>
            </div>

            {/* Chart */}
            {data.chartType !== 'none' && data.chartData && data.chartData.length > 0 && (
                <div className={styles.chartContainer}>
                    <div className={styles.chartPlaceholder}>
                        <ResponsiveContainer width="100%" height="100%">
                            {data.chartType === 'line' ? (
                                <ReLineChart data={data.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                                    <Line type="monotone" dataKey="value" stroke="var(--color-primary-500)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-primary-500)' }} />
                                </ReLineChart>
                            ) : (
                                <BarChart data={data.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'var(--bg-secondary)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                                    <Bar dataKey="value" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <span className={styles.tableTitle}>Detailed Data</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {data.columns.map((col, i) => (
                                    <th key={i}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.rows.map((row: any, i) => (
                                <tr key={i}>
                                    {['col1', 'col2', 'col3', 'col4', 'col5'].map((key) => row[key] && (
                                        <td key={key} style={{ fontWeight: key === 'col1' || key === 'col3' ? 'var(--font-bold)' : 'normal' }}>
                                            {row[key]}
                                        </td>
                                    ))}
                                    {/* Link Action Column */}
                                    {row.action && (
                                        <td>
                                            <Link href={row.action.href} style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                fontSize: 'var(--text-sm)', color: 'var(--color-primary-600)', fontWeight: 'var(--font-medium)',
                                                textDecoration: 'none'
                                            }}>
                                                {row.action.label} <ArrowRight size={14} />
                                            </Link>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
