'use client';

import React from 'react';
import {
    Calendar,
    Clock,
    User,
    Scissors,
    CreditCard,
    Printer,
    Edit,
    XCircle,
    CheckCircle,
    AlertTriangle,
    MapPin,
    Phone,
    Mail
} from 'lucide-react';
import {
    Button,
    Badge,
    Stepper,
    EmptyState,
    useToast
} from '@/components/ui';
import styles from './page.module.css';

// Mock Data
const booking = {
    id: '#BK-28492',
    date: 'Feb 18, 2026',
    time: '14:30',
    duration: '2h 15m',
    status: 'confirmed', // draft, confirmed, arrived, completed, cancelled
    client: {
        id: '1',
        name: 'Fatima Al-Rashid',
        phone: '+20 123 456 7890',
        email: 'fatima@example.com',
        avatar: 'FA',
        vip: true,
        notes: 'Latex allergy'
    },
    items: [
        { id: 1, name: 'Hair Coloring - Full', employee: 'Sarah Ahmed', price: 1200, duration: '90m' },
        { id: 2, name: 'Hair Cut & Style', employee: 'Sarah Ahmed', price: 450, duration: '45m' },
    ],
    financials: {
        subtotal: 2000,
        discount: 200,
        discountLabel: 'VIP 10%',
        tax: 252, // 14% of (2000-200)
        total: 2052,
        paid: 500, // Deposit
        due: 1552
    }
};

const steps = ['Draft', 'Confirmed', 'Arrived', 'In Service', 'Completed'];
const currentStep = 1; // Confirmed

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { addToast } = useToast();
    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <div className={styles.subtitle}>
                        <Calendar size={14} /> {booking.date} • {booking.time}
                    </div>
                    <h1>
                        Booking {booking.id}
                        <Badge color="primary">{booking.status}</Badge>
                    </h1>
                </div>
                <div className={styles.actions}>
                    <Button variant="outline" onClick={() => addToast('info', 'Printing booking receipt...')}>
                        <Printer size={16} /> Print
                    </Button>
                    <Button variant="outline" onClick={() => addToast('info', 'Edit mode enabled')}>
                        <Edit size={16} /> Edit
                    </Button>
                    <Button variant="destructive" onClick={() => addToast('error', 'Booking cancelled successfully')}>
                        <XCircle size={16} /> Cancel
                    </Button>
                    <Button onClick={() => addToast('success', 'Client checked in successfully')}>
                        <CheckCircle size={16} /> Check In
                    </Button>
                </div>
            </div>

            {/* Status Bar */}
            <div className={styles.statusBar}>
                <div className={styles.statusSteps}>
                    <Stepper steps={steps} current={currentStep} />
                </div>
            </div>

            {/* Content Grid */}
            <div className={styles.grid}>
                {/* Main Column */}
                <div className={styles.mainCol}>
                    {/* Services & Items */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}><Scissors size={18} /> Services & Items</span>
                            <Button variant="ghost" size="sm" onClick={() => addToast('info', 'Add item dialog opened')}>Add Item</Button>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Staff / Info</th>
                                        <th style={{ textAlign: 'right' }}>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {booking.items.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div style={{ fontWeight: 'var(--font-medium)' }}>{item.name}</div>
                                                {item.duration && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{item.duration}</div>}
                                            </td>
                                            <td>{item.employee || 'Staff'}</td>
                                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}><CreditCard size={18} /> Payment Summary</span>
                            <Badge color={booking.financials.due > 0 ? 'warning' : 'success'}>
                                {booking.financials.due > 0 ? 'Payment Due' : 'Paid in Full'}
                            </Badge>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>{booking.financials.subtotal.toLocaleString()} EGP</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span style={{ color: 'var(--color-success-600)' }}>Discount ({booking.financials.discountLabel})</span>
                                <span style={{ color: 'var(--color-success-600)' }}>-{booking.financials.discount.toLocaleString()} EGP</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Tax (14%)</span>
                                <span>{booking.financials.tax.toLocaleString()} EGP</span>
                            </div>
                            <div className={styles.summaryTotal}>
                                <span>Total</span>
                                <span>{booking.financials.total.toLocaleString()} EGP</span>
                            </div>
                            <div className={styles.summaryRow} style={{ marginTop: 'var(--space-2)' }}>
                                <span>Paid (Deposit)</span>
                                <span>-{booking.financials.paid.toLocaleString()} EGP</span>
                            </div>
                            <div className={styles.summaryTotal} style={{ color: 'var(--color-destructive-600)' }}>
                                <span>Balance Due</span>
                                <span>{booking.financials.due.toLocaleString()} EGP</span>
                            </div>

                            <div style={{ marginTop: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)' }}>
                                <Button fullWidth onClick={() => addToast('success', `Payment of ${booking.financials.due} EGP processed`)}>
                                    Process Payment ({booking.financials.due})
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Column */}
                <div className={styles.sideCol}>
                    {/* Client Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}><User size={18} /> Client Details</span>
                            <Button variant="ghost" size="sm" iconOnly onClick={() => addToast('info', 'Edit client profile clicked')}>
                                <Edit size={14} />
                            </Button>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.clientHeader}>
                                <div className={styles.clientAvatar}>{booking.client.avatar}</div>
                                <div>
                                    <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>{booking.client.name}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>ID: #{booking.client.id}</div>
                                </div>
                            </div>

                            {booking.client.vip && (
                                <div style={{ marginBottom: 'var(--space-4)' }}>
                                    <Badge color="amber">VIP Client</Badge>
                                </div>
                            )}

                            <div className={styles.infoRow}>
                                <Phone size={14} className={styles.infoIcon} />
                                <div className={styles.infoContent}>
                                    <span className={styles.infoValue}>{booking.client.phone}</span>
                                </div>
                            </div>
                            <div className={styles.infoRow}>
                                <Mail size={14} className={styles.infoIcon} />
                                <div className={styles.infoContent}>
                                    <span className={styles.infoValue}>{booking.client.email}</span>
                                </div>
                            </div>

                            {booking.client.notes && (
                                <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-warning-light)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
                                    <strong style={{ color: 'var(--color-warning-dark)' }}>Note:</strong> {booking.client.notes}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline Log */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}><Clock size={16} /> Activity Log</span>
                        </div>
                        <div className={styles.cardBody}>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <div>
                                    <strong>Created</strong> • Feb 15, 10:00 AM<br />
                                    by Receptionist
                                </div>
                                <div>
                                    <strong>Deposit Paid</strong> • Feb 15, 10:05 AM<br />
                                    500 EGP (Credit Card)
                                </div>
                                <div>
                                    <strong>Confirmed</strong> • Feb 17, 09:00 AM<br />
                                    SMS Reminder Sent
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
