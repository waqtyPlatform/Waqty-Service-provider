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
    Phone,
    Mail
} from 'lucide-react';
import {
    Button,
    Badge,
    Stepper,
    useToast
} from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';

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
    const { t, lang } = useTranslation();
    return (
        <div className={styles.page} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <div className={styles.subtitle}>
                        <Calendar size={14} /> {booking.date} • {booking.time}
                    </div>
                    <h1>
                        {t('bk.lblBooking')} {booking.id}
                        <Badge color="primary">{booking.status}</Badge>
                    </h1>
                </div>
                <div className={styles.actions}>
                    <Button variant="outline" onClick={() => addToast('info', 'Printing booking receipt...')}>
                        <Printer size={16} /> {t('bk.btnPrint')}
                    </Button>
                    <Button variant="outline" onClick={() => addToast('info', 'Edit mode enabled')}>
                        <Edit size={16} /> {t('bk.btnEdit')}
                    </Button>
                    <Button variant="destructive" onClick={() => addToast('error', 'Booking cancelled successfully')}>
                        <XCircle size={16} /> {t('bk.btnCancel2')}
                    </Button>
                    <Button onClick={() => addToast('success', 'Client checked in successfully')}>
                        <CheckCircle size={16} /> {t('bk.btnCheckIn')}
                    </Button>
                </div>
            </div>

            {/* Status Bar */}
            <div className={styles.statusBar}>
                <div className={styles.statusSteps}>
                    <Stepper steps={[t('bk.stepDraft'), t('bk.stepConfirmed'), t('bk.stepArrived'), t('bk.stepInService'), t('bk.stepCompleted')]} current={currentStep} />
                </div>
            </div>

            {/* Content Grid */}
            <div className={styles.grid}>
                {/* Main Column */}
                <div className={styles.mainCol}>
                    {/* Services & Items */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}><Scissors size={18} /> {t('bk.cardSvcItems')}</span>
                            <Button variant="ghost" size="sm" onClick={() => addToast('info', 'Add item dialog opened')}>{t('bk.btnAddItem')}</Button>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>{t('bk.thItem2')}</th>
                                        <th>{t('bk.thStaffInfo')}</th>
                                        <th style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>{t('bk.thPrice2')}</th>
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
                                            <td style={{ textAlign: lang === 'ar' ? 'left' : 'right', fontFamily: 'var(--font-mono)' }} dir="ltr">{item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}><CreditCard size={18} /> {t('bk.cardPaySummary')}</span>
                            <Badge color={booking.financials.due > 0 ? 'warning' : 'success'}>
                                {booking.financials.due > 0 ? t('bk.lblPayDue') : t('bk.lblPaidInFull')}
                            </Badge>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.summaryRow}>
                                <span>{t('bk.lblSubtotal')}</span>
                                <span dir="ltr">{booking.financials.subtotal.toLocaleString()} EGP</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span style={{ color: 'var(--color-success-600)' }}>{t('bk.lblDiscount')} ({booking.financials.discountLabel})</span>
                                <span style={{ color: 'var(--color-success-600)' }} dir="ltr">-{booking.financials.discount.toLocaleString()} EGP</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>{t('bk.lblTax')} (14%)</span>
                                <span dir="ltr">{booking.financials.tax.toLocaleString()} EGP</span>
                            </div>
                            <div className={styles.summaryTotal}>
                                <span>{t('bk.lblTotal')}</span>
                                <span dir="ltr">{booking.financials.total.toLocaleString()} EGP</span>
                            </div>
                            <div className={styles.summaryRow} style={{ marginTop: 'var(--space-2)' }}>
                                <span>{t('bk.lblPaidDeposit')}</span>
                                <span dir="ltr">-{booking.financials.paid.toLocaleString()} EGP</span>
                            </div>
                            <div className={styles.summaryTotal} style={{ color: 'var(--color-destructive-600)' }}>
                                <span>{t('bk.lblBalanceDue')}</span>
                                <span dir="ltr">{booking.financials.due.toLocaleString()} EGP</span>
                            </div>

                            <div style={{ marginTop: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)' }}>
                                <Button fullWidth onClick={() => addToast('success', `Payment of ${booking.financials.due} EGP processed`)}>
                                    {t('bk.btnProcessPayment')} ({booking.financials.due})
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
                            <span className={styles.cardTitle}><User size={18} /> {t('bk.cardClientDetails')}</span>
                            <Button variant="ghost" size="sm" iconOnly onClick={() => addToast('info', 'Edit client profile clicked')}>
                                <Edit size={14} />
                            </Button>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.clientHeader}>
                                <div className={styles.clientAvatar}>{booking.client.avatar}</div>
                                <div>
                                    <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>{booking.client.name}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }} dir="ltr">#{booking.client.id} :ID</div>
                                </div>
                            </div>

                            {booking.client.vip && (
                                <div style={{ marginBottom: 'var(--space-4)' }}>
                                    <Badge color="amber">{t('bk.lblVipClient')}</Badge>
                                </div>
                            )}

                            <div className={styles.infoRow}>
                                <Phone size={14} className={styles.infoIcon} />
                                <div className={styles.infoContent}>
                                    <span className={styles.infoValue} dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left', display: 'block' }}>{booking.client.phone}</span>
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
                                    <strong style={{ color: 'var(--color-warning-dark)' }}>{t('bk.lblNote')}:</strong> {booking.client.notes}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline Log */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}><Clock size={16} /> {t('bk.cardActivityLog')}</span>
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
