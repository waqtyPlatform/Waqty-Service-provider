'use client';

import React, { useState } from 'react';
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    CreditCard,
    FileText,
    Clock,
    Scissors,
    AlertCircle,
    Star,
    Upload,
    MoreHorizontal,
    Edit,
    Plus,
    CheckCircle
} from 'lucide-react';
import {
    Tabs,
    Button,
    Badge,
    KPICard,
    Timeline,
    EmptyState
} from '@/components/ui';
import styles from './page.module.css';

// Mock Data
const client = {
    id: '1',
    name: 'Fatima Al-Rashid',
    email: 'fatima.rashid@example.com',
    phone: '+20 123 456 7890',
    address: '15 Tahrir St, Downtown Cairo',
    avatar: 'FA',
    status: 'active',
    vip: true,
    joined: 'Jan 15, 2024',
    dob: '1992-05-12',
    notes: 'Prefers quiet sessions. Latex allergy.',
    stats: {
        visits: 47,
        spend: '12,400',
        points: 850,
        lastVisit: '2 days ago'
    }
};

const timelineEvents = [
    { time: 'Feb 15, 2026', title: 'Completed Appointment', description: 'Hair Coloring with Sarah Ahmed. Paid 1,200 EGP.' },
    { time: 'Feb 10, 2026', title: 'Service Add-on', description: 'Added Deep Conditioning. Paid 450 EGP.' },
    { time: 'Jan 28, 2026', title: 'Missed Appointment', description: 'No-show for Manicure. Marked by Reception.' },
    { time: 'Jan 15, 2026', title: 'Membership Upgrade', description: 'Upgraded to Gold Tier.' },
];

const bookings = [
    { id: 1042, date: 'Feb 15, 2026', time: '10:00 AM', service: 'Hair Coloring', employee: 'Sarah Ahmed', status: 'completed', price: 1200 },
    { id: 1055, date: 'Feb 28, 2026', time: '02:00 PM', service: 'Keratin Treatment', employee: 'Nora Ali', status: 'confirmed', price: 2500 },
];

const sales = [
    { id: 'INV-001', date: 'Feb 15, 2026', items: 'Hair Coloring, Shampoo', total: 1450, status: 'paid' },
    { id: 'INV-002', date: 'Feb 10, 2026', items: 'Deep Conditioning Add-on', total: 450, status: 'paid' },
];

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [activeTab, setActiveTab] = useState('overview');

    const renderOverview = () => (
        <div className={styles.content}>
            <div className={styles.mainPanel}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}><Calendar size={18} /> Recent Timeline</span>
                    </div>
                    <div className={styles.cardBody}>
                        <Timeline events={timelineEvents} />
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}><AlertCircle size={18} /> Medical & Notes</span>
                        <Button variant="ghost" size="sm" iconOnly><Edit size={14} /></Button>
                    </div>
                    <div className={styles.cardBody}>
                        <div style={{ padding: 'var(--space-3)', background: 'var(--color-warning-light)', color: 'var(--color-warning-dark)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: 'var(--text-sm)' }}><strong>Allergy Alert:</strong> Latex sensitivity reported on Jan 20, 2024.</span>
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Client prefers evening appointments. Usually requests tea with no sugar.
                            Has sensitive scalp, avoid strong chemical shampoos.
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.sidePanel}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Contact Info</span>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.infoGrid} style={{ gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Phone</span>
                                <span className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={14} /> {client.phone}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Email</span>
                                <span className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={14} /> {client.email}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Address</span>
                                <span className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {client.address}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Date of Birth</span>
                                <span className={styles.infoValue}>{client.dob}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Tags</span>
                        <Button variant="ghost" size="sm" iconOnly><Plus size={14} /></Button>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.tags}>
                            <span className={styles.tag}>VIP</span>
                            <span className={styles.tag}>Latex Allergy</span>
                            <span className={styles.tag}>Weekend</span>
                            <span className={styles.tag}>Big Spender</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderBookings = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>Booking History</span>
                    <Button size="sm"><Plus size={16} /> New Booking</Button>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Service</th>
                                <th>Employee</th>
                                <th>Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id}>
                                    <td>#{b.id}</td>
                                    <td>
                                        <div style={{ fontWeight: 'var(--font-medium)' }}>{b.date}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{b.time}</div>
                                    </td>
                                    <td>{b.service}</td>
                                    <td>{b.employee}</td>
                                    <td>{b.price} EGP</td>
                                    <td>
                                        <Badge color={b.status === 'completed' ? 'success' : b.status === 'confirmed' ? 'primary' : 'neutral'}>
                                            {b.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderSales = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>Purchase History</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(s => (
                                <tr key={s.id}>
                                    <td style={{ fontFamily: 'var(--font-mono)' }}>{s.id}</td>
                                    <td>{s.date}</td>
                                    <td>{s.items}</td>
                                    <td style={{ fontWeight: 'var(--font-bold)' }}>{s.total} EGP</td>
                                    <td><Badge color="success">{s.status}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.profileInfo}>
                        <div className={styles.avatar}>{client.avatar}</div>
                        <div className={styles.details}>
                            <h1>
                                {client.name}
                                {client.vip && <Star size={20} fill="var(--color-warning)" color="var(--color-warning)" />}
                            </h1>
                            <div className={styles.meta}>
                                <span className={styles.metaItem}><User size={14} /> Client #{client.id}</span>
                                <span className={styles.metaItem}><Calendar size={14} /> Joined {client.joined}</span>
                                <Badge color="success">Active</Badge>
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <Button variant="outline" iconOnly><MoreHorizontal size={20} /></Button>
                        <Button variant="outline"><Edit size={16} /> Edit Profile</Button>
                        <Button><Plus size={16} /> New Booking</Button>
                    </div>
                </div>

                <div className={styles.headerStats}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{client.stats.visits}</span>
                        <span className={styles.statLabel}>Visits</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{client.stats.spend} EGP</span>
                        <span className={styles.statLabel}>Total Spend</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{client.stats.points}</span>
                        <span className={styles.statLabel}>Loyalty Pts</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{client.stats.lastVisit}</span>
                        <span className={styles.statLabel}>Last Visit</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs
                active={activeTab}
                onChange={setActiveTab}
                items={[
                    { key: 'overview', label: 'Overview', icon: <User size={16} /> },
                    { key: 'bookings', label: 'Bookings', icon: <Calendar size={16} /> },
                    { key: 'sales', label: 'Sales', icon: <CreditCard size={16} /> },
                    { key: 'files', label: 'Files', icon: <FileText size={16} /> },
                ]}
            />

            {/* Content */}
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'sales' && renderSales()}
            {activeTab === 'files' && (
                <EmptyState
                    icon={<Upload size={48} />}
                    title="No files uploaded"
                    description="Upload contracts, consent forms, or before/after photos here."
                    action={<Button variant="outline">Upload File</Button>}
                />
            )}
        </div>
    );
}
