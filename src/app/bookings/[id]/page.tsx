'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar, Clock, User, Scissors, CreditCard, Printer, Edit,
    XCircle, CheckCircle, Phone, Mail, AlertTriangle, ChevronRight,
    Banknote, CreditCard as CardIcon, Wallet,
} from 'lucide-react';
import { Button, Badge, Stepper, useToast } from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = 'draft' | 'confirmed' | 'arrived' | 'inService' | 'completed' | 'cancelled' | 'no_show';

const STATUS_STEPS: BookingStatus[] = ['draft', 'confirmed', 'arrived', 'inService', 'completed'];
const STEP_INDEX: Record<BookingStatus, number> = {
    draft: 0, confirmed: 1, arrived: 2, inService: 3, completed: 4, cancelled: -1, no_show: -1,
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemStatus = 'confirmed' | 'pending_assignment';

// ─── Mock data ────────────────────────────────────────────────────────────────

const BOOKING_DATA = {
    id: '#BK-28492',
    date: 'Feb 18, 2026',
    time: '14:30',
    duration: '2h 15m',
    initialStatus: 'confirmed' as BookingStatus,
    packageId: 'PKG-003',
    packageName: 'VIP Hair Care Bundle',
    packageSessionsRemaining: 3,
    client: {
        id: '1',
        name: 'Fatima Al-Rashid',
        phone: '+20 123 456 7890',
        email: 'fatima@example.com',
        avatar: 'FA',
        vip: true,
        notes: 'Latex allergy',
    },
    items: [
        { id: 1, name: 'Hair Coloring - Full', employee: 'Sarah Ahmed', price: 1200, duration: '90m', itemStatus: 'confirmed' as ItemStatus },
        { id: 2, name: 'Hair Cut & Style',     employee: 'Sarah Ahmed', price: 450,  duration: '45m', itemStatus: 'confirmed' as ItemStatus },
        { id: 3, name: 'Deep Conditioning',    employee: '',            price: 300,  duration: '30m', itemStatus: 'pending_assignment' as ItemStatus },
    ],
    financials: {
        subtotal: 2000,
        discount: 200,
        discountLabel: 'VIP 10%',
        tax: 252,
        total: 2052,
        paid: 500,
        due: 1552,
    },
    activityLog: [
        { label: 'Created',         detail: 'by Receptionist',                             time: 'Feb 15, 10:00 AM' },
        { label: 'Package Applied', detail: 'VIP Hair Care Bundle — 3 sessions remaining', time: 'Feb 15, 10:02 AM' },
        { label: 'Deposit Paid',    detail: '500 EGP (Credit Card)',                       time: 'Feb 15, 10:05 AM' },
        { label: 'Confirmed',       detail: 'SMS Reminder Sent',                           time: 'Feb 17, 09:00 AM' },
    ],
};

const BADGE_COLOR: Record<BookingStatus, 'primary' | 'success' | 'warning' | 'error' | 'neutral'> = {
    draft: 'neutral', confirmed: 'primary', arrived: 'warning',
    inService: 'primary', completed: 'success', cancelled: 'error', no_show: 'error',
};

// ─── Modals ───────────────────────────────────────────────────────────────────

function CancelModal({ onConfirm, onClose }: { onConfirm: (reason: string) => void; onClose: () => void }) {
    const [reason, setReason] = useState('');
    const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' };
    const box: React.CSSProperties = { background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', width: 420, maxWidth: '90vw', border: '1px solid var(--border-color)' };
    return (
        <div style={overlay} onClick={onClose}>
            <div style={box} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <AlertTriangle size={20} color="#ef4444" />
                    <h3 style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-lg)' }}>Cancel Booking</h3>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                    This action cannot be undone. The booking will be marked as cancelled and the client will be notified.
                </p>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>
                        Reason for cancellation
                    </label>
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        style={{ width: '100%', height: 42, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                        <option value="">Select a reason…</option>
                        <option value="client_request">Client requested cancellation</option>
                        <option value="staff_unavailable">Staff unavailable</option>
                        <option value="double_booking">Double booking</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                    <Button variant="outline" onClick={onClose}>Keep Booking</Button>
                    <Button variant="destructive" onClick={() => reason && onConfirm(reason)} >
                        Confirm Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}

function PaymentModal({ due, onConfirm, onClose }: {
    due: number;
    onConfirm: (amount: number, method: string) => void;
    onClose: () => void;
}) {
    const [amount, setAmount] = useState(String(due));
    const [method, setMethod] = useState('card');
    const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' };
    const box: React.CSSProperties = { background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', width: 440, maxWidth: '90vw', border: '1px solid var(--border-color)' };
    const methodBtn = (val: string, icon: React.ReactNode, label: string): React.CSSProperties => ({
        flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
        border: method === val ? '2px solid var(--color-primary-500)' : '1px solid var(--border-color)',
        background: method === val ? 'var(--color-primary-50, #eff6ff)' : 'var(--bg-secondary)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
        color: method === val ? 'var(--color-primary-600)' : 'var(--text-secondary)',
    });

    return (
        <div style={overlay} onClick={onClose}>
            <div style={box} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                    <CreditCard size={20} color="var(--color-primary-500)" />
                    <h3 style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-lg)' }}>Process Payment</h3>
                </div>

                <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>Balance due</span>
                        <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>{due.toLocaleString()} EGP</span>
                    </div>
                </div>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>
                        Amount to collect (EGP)
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ width: '100%', height: 42, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
                    />
                </div>

                <div style={{ marginBottom: 'var(--space-5)' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-3)' }}>
                        Payment method
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <button style={methodBtn('cash', null, 'Cash')} onClick={() => setMethod('cash')}>
                            <Banknote size={18} /> Cash
                        </button>
                        <button style={methodBtn('card', null, 'Card')} onClick={() => setMethod('card')}>
                            <CardIcon size={18} /> Card
                        </button>
                        <button style={methodBtn('wallet', null, 'Wallet')} onClick={() => setMethod('wallet')}>
                            <Wallet size={18} /> Wallet
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onConfirm(Number(amount), method)}>
                        Collect {Number(amount).toLocaleString()} EGP
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { addToast } = useToast();
    const { t, lang } = useTranslation();
    const router = useRouter();

    const [status, setStatus] = useState<BookingStatus>(BOOKING_DATA.initialStatus);
    const [paid, setPaid] = useState(BOOKING_DATA.financials.paid);
    const [log, setLog] = useState(BOOKING_DATA.activityLog);
    const [showCancel, setShowCancel] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [bookingItems, setBookingItems] = useState(BOOKING_DATA.items);
    const [assignTarget, setAssignTarget] = useState<number | null>(null);
    const [assignForm, setAssignForm] = useState({ employee: '', time: '', room: '' });

    const due = Math.max(0, BOOKING_DATA.financials.total - paid);
    const currentStep = STEP_INDEX[status] ?? 1;
    const isCancelled = status === 'cancelled';
    const isNoShow = status === 'no_show';
    const isTerminal = isCancelled || isNoShow || status === 'completed';
    const isCompleted = status === 'completed';
    const canCheckIn = status === 'confirmed';
    const canComplete = status === 'inService';
    const canStartService = status === 'arrived';
    const canMarkNoShow = status === 'confirmed' || status === 'arrived';
    const pendingItems = bookingItems.filter(i => i.itemStatus === 'pending_assignment');

    const handleAssign = () => {
        if (!assignTarget) return;
        setBookingItems(prev => prev.map(i =>
            i.id === assignTarget ? { ...i, itemStatus: 'confirmed' as ItemStatus, employee: assignForm.employee || i.employee } : i
        ));
        const item = bookingItems.find(i => i.id === assignTarget);
        addLog('Service Assigned', `${item?.name} assigned to ${assignForm.employee} at ${assignForm.time}${assignForm.room ? ' in ' + assignForm.room : ''}`);
        addToast('success', 'Service assigned successfully');
        setAssignTarget(null);
        setAssignForm({ employee: '', time: '', room: '' });
    };

    const addLog = (label: string, detail: string) => {
        const now = new Date();
        setLog(prev => [...prev, {
            label,
            detail,
            time: now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        }]);
    };

    const handleCheckIn = () => {
        setStatus('arrived');
        addLog('Client Arrived', 'Check-in completed');
        addToast('success', 'Client checked in successfully');
    };

    const handleStartService = () => {
        setStatus('inService');
        addLog('Service Started', 'In progress');
        addToast('success', 'Service started');
    };

    const handleComplete = () => {
        setStatus('completed');
        addLog('Service Completed', 'Awaiting payment');
        addToast('success', 'Booking marked as completed');
    };

    const handleCancel = (reason: string) => {
        setStatus('cancelled');
        setShowCancel(false);
        addLog('Cancelled', reason.replace(/_/g, ' '));
        addToast('error', 'Booking cancelled');
    };

    const handleNoShow = () => {
        setStatus('no_show');
        addLog('No-Show', 'Marked by Reception');
        addToast('warning', 'Client marked as no-show');
    };

    const handlePayment = (amount: number, method: string) => {
        setPaid(prev => prev + amount);
        setShowPayment(false);
        addLog('Payment Received', `${amount.toLocaleString()} EGP via ${method}`);
        addToast('success', `${amount.toLocaleString()} EGP collected`);
    };

    const handlePrint = () => {
        window.print();
        addToast('info', 'Printing booking receipt…');
    };

    return (
        <>
            {showCancel && <CancelModal onConfirm={handleCancel} onClose={() => setShowCancel(false)} />}
            {showPayment && <PaymentModal due={due} onConfirm={handlePayment} onClose={() => setShowPayment(false)} />}
            {assignTarget !== null && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setAssignTarget(null)}>
                    <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', width: 440, maxWidth: '90vw', border: '1px solid var(--border-color)' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Assign Service</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <div>
                                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Employee</label>
                                <select value={assignForm.employee} onChange={e => setAssignForm(p => ({ ...p, employee: e.target.value }))}
                                    style={{ width: '100%', height: 42, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                                    <option value="">Select employee…</option>
                                    <option>Sarah Ahmed</option><option>Nora Ali</option><option>Layla Hassan</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Time</label>
                                <input type="time" value={assignForm.time} onChange={e => setAssignForm(p => ({ ...p, time: e.target.value }))}
                                    style={{ width: '100%', height: 42, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Room (optional)</label>
                                <select value={assignForm.room} onChange={e => setAssignForm(p => ({ ...p, room: e.target.value }))}
                                    style={{ width: '100%', height: 42, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                                    <option value="">No room</option>
                                    <option>Styling Station 1</option><option>Spa Room A</option><option>VIP Suite</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-5)' }}>
                            <Button variant="outline" onClick={() => setAssignTarget(null)}>Cancel</Button>
                            <Button onClick={handleAssign} disabled={!assignForm.employee || !assignForm.time}>Assign</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.page} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                {/* Back + Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                    onClick={() => router.push('/bookings/list')}>
                    <ChevronRight size={14} style={{ transform: lang === 'ar' ? 'none' : 'scaleX(-1)' }} />
                    Back to bookings
                </div>

                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <div className={styles.subtitle}>
                            <Calendar size={14} /> {BOOKING_DATA.date} • {BOOKING_DATA.time}
                        </div>
                        <h1>
                            {t('bk.lblBooking')} {id.startsWith('#') ? id : `#${id}`}
                            <Badge color={BADGE_COLOR[status] ?? 'neutral'} style={{ marginLeft: 8 }}>
                                {status.replace('inService', 'In Service')}
                            </Badge>
                        </h1>
                    </div>

                    <div className={styles.actions}>
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer size={16} /> {t('bk.btnPrint')}
                        </Button>
                        {!isTerminal && (
                            <>
                                <Button variant="outline" onClick={() => router.push(`/bookings/new?edit=${id}`)}>
                                    <Edit size={16} /> {t('bk.btnEdit')}
                                </Button>
                                <Button variant="destructive" onClick={() => setShowCancel(true)}>
                                    <XCircle size={16} /> {t('bk.btnCancel2')}
                                </Button>
                            </>
                        )}
                        {canMarkNoShow && (
                            <Button variant="outline" onClick={handleNoShow} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                                <AlertTriangle size={16} /> Mark No-Show
                            </Button>
                        )}
                        {canCheckIn && (
                            <Button onClick={handleCheckIn}>
                                <CheckCircle size={16} /> {t('bk.btnCheckIn')}
                            </Button>
                        )}
                        {canStartService && (
                            <Button onClick={handleStartService}>
                                <Scissors size={16} /> Start Service
                            </Button>
                        )}
                        {canComplete && (
                            <Button onClick={handleComplete}>
                                <CheckCircle size={16} /> Mark Complete
                            </Button>
                        )}
                    </div>
                </div>

                {/* Status stepper */}
                {!isCancelled && !isNoShow ? (
                    <div className={styles.statusBar}>
                        <div className={styles.statusSteps}>
                            <Stepper
                                steps={[
                                    t('bk.stepDraft'), t('bk.stepConfirmed'), t('bk.stepArrived'),
                                    t('bk.stepInService'), t('bk.stepCompleted'),
                                ]}
                                current={currentStep}
                            />
                        </div>
                    </div>
                ) : isCancelled ? (
                    <div style={{ padding: 'var(--space-3) var(--space-4)', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: '#dc2626', marginBottom: 'var(--space-4)' }}>
                        <AlertTriangle size={16} />
                        <strong>Booking is cancelled.</strong> No further actions can be taken.
                    </div>
                ) : (
                    <div style={{ padding: 'var(--space-3) var(--space-4)', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: '#dc2626', marginBottom: 'var(--space-4)' }}>
                        <AlertTriangle size={16} />
                        <strong>Client did not show up.</strong> No further actions can be taken.
                    </div>
                )}

                {/* Task 08: Package Applied banner */}
                {BOOKING_DATA.packageId && (
                    <div style={{ padding: 'var(--space-3) var(--space-4)', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: '#1d4ed8', marginBottom: 'var(--space-2)' }}>
                        <CheckCircle size={16} />
                        <span>This visit is covered by <strong>{BOOKING_DATA.packageName}</strong> — <strong>{BOOKING_DATA.packageSessionsRemaining} sessions</strong> remaining</span>
                    </div>
                )}

                {/* Task 04: Pending assignment banner */}
                {pendingItems.length > 0 && !isTerminal && (
                    <div style={{ padding: 'var(--space-3) var(--space-4)', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: '#92400e', marginBottom: 'var(--space-4)' }}>
                        <AlertTriangle size={16} />
                        <span><strong>{pendingItems.length} service{pendingItems.length > 1 ? 's' : ''} added by employee</strong> {pendingItems.length > 1 ? 'are' : 'is'} awaiting assignment.</span>
                    </div>
                )}

                {/* Content grid */}
                <div className={styles.grid}>
                    {/* Main column */}
                    <div className={styles.mainCol}>
                        {/* Services */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}><Scissors size={18} /> {t('bk.cardSvcItems')}</span>
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
                                        {bookingItems.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                        <span style={{ fontWeight: 'var(--font-medium)' }}>{item.name}</span>
                                                        {item.itemStatus === 'pending_assignment' && (
                                                            <span style={{ padding: '1px 7px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 600, background: '#fef3c7', color: '#92400e' }}>Pending Assignment</span>
                                                        )}
                                                    </div>
                                                    {item.duration && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{item.duration}</div>}
                                                </td>
                                                <td>{item.employee || <span style={{ color: 'var(--text-tertiary)' }}>Unassigned</span>}</td>
                                                <td style={{ textAlign: lang === 'ar' ? 'left' : 'right', fontFamily: 'var(--font-mono)' }} dir="ltr">
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                                                        {item.price}
                                                        {item.itemStatus === 'pending_assignment' && !isTerminal && (
                                                            <Button size="sm" variant="outline" onClick={() => { setAssignTarget(item.id); setAssignForm({ employee: '', time: '', room: '' }); }} style={{ fontSize: 11, padding: '2px 8px' }}>
                                                                Assign
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Financials */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}><CreditCard size={18} /> {t('bk.cardPaySummary')}</span>
                                <Badge color={due > 0 ? 'warning' : 'success'}>
                                    {due > 0 ? t('bk.lblPayDue') : t('bk.lblPaidInFull')}
                                </Badge>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.summaryRow}>
                                    <span>{t('bk.lblSubtotal')}</span>
                                    <span dir="ltr">{BOOKING_DATA.financials.subtotal.toLocaleString()} EGP</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span style={{ color: 'var(--color-success-600)' }}>
                                        {t('bk.lblDiscount')} ({BOOKING_DATA.financials.discountLabel})
                                    </span>
                                    <span style={{ color: 'var(--color-success-600)' }} dir="ltr">
                                        -{BOOKING_DATA.financials.discount.toLocaleString()} EGP
                                    </span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>{t('bk.lblTax')} (14%)</span>
                                    <span dir="ltr">{BOOKING_DATA.financials.tax.toLocaleString()} EGP</span>
                                </div>
                                <div className={styles.summaryTotal}>
                                    <span>{t('bk.lblTotal')}</span>
                                    <span dir="ltr">{BOOKING_DATA.financials.total.toLocaleString()} EGP</span>
                                </div>
                                {BOOKING_DATA.packageId && (
                                    <div className={styles.summaryRow} style={{ marginTop: 'var(--space-2)', color: '#1d4ed8' }}>
                                        <span>Package Credit ({BOOKING_DATA.packageName})</span>
                                        <span dir="ltr">-{BOOKING_DATA.financials.subtotal.toLocaleString()} EGP</span>
                                    </div>
                                )}
                                <div className={styles.summaryRow} style={{ marginTop: 'var(--space-2)' }}>
                                    <span>{t('bk.lblPaidDeposit')}</span>
                                    <span dir="ltr">-{paid.toLocaleString()} EGP</span>
                                </div>
                                <div className={styles.summaryTotal} style={{ color: due > 0 ? 'var(--color-destructive-600)' : 'var(--color-success-600)' }}>
                                    <span>{t('bk.lblBalanceDue')}</span>
                                    <span dir="ltr">{due.toLocaleString()} EGP</span>
                                </div>

                                {due > 0 && !isCancelled && !isNoShow && (
                                    <div style={{ marginTop: 'var(--space-5)' }}>
                                        <Button fullWidth onClick={() => setShowPayment(true)}>
                                            {t('bk.btnProcessPayment')} ({due.toLocaleString()} EGP)
                                        </Button>
                                    </div>
                                )}
                                {due === 0 && (
                                    <div style={{ marginTop: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-success-600)', fontWeight: 'var(--font-medium)' }}>
                                        ✓ Fully paid
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Side column */}
                    <div className={styles.sideCol}>
                        {/* Client */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}><User size={18} /> {t('bk.cardClientDetails')}</span>
                                <Button variant="ghost" size="sm" iconOnly
                                    onClick={() => router.push(`/customers/${BOOKING_DATA.client.id}`)}>
                                    <Edit size={14} />
                                </Button>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.clientHeader}>
                                    <div className={styles.clientAvatar}>{BOOKING_DATA.client.avatar}</div>
                                    <div>
                                        <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>
                                            {BOOKING_DATA.client.name}
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }} dir="ltr">
                                            ID #{BOOKING_DATA.client.id}
                                        </div>
                                    </div>
                                </div>

                                {BOOKING_DATA.client.vip && (
                                    <div style={{ marginBottom: 'var(--space-4)' }}>
                                        <Badge color="amber">{t('bk.lblVipClient')}</Badge>
                                    </div>
                                )}

                                <div className={styles.infoRow}>
                                    <Phone size={14} className={styles.infoIcon} />
                                    <div className={styles.infoContent}>
                                        <a href={`tel:${BOOKING_DATA.client.phone}`}
                                            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-500)', textDecoration: 'none' }}
                                            dir="ltr">
                                            {BOOKING_DATA.client.phone}
                                        </a>
                                    </div>
                                </div>
                                <div className={styles.infoRow}>
                                    <Mail size={14} className={styles.infoIcon} />
                                    <div className={styles.infoContent}>
                                        <a href={`mailto:${BOOKING_DATA.client.email}`}
                                            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-500)', textDecoration: 'none' }}>
                                            {BOOKING_DATA.client.email}
                                        </a>
                                    </div>
                                </div>

                                {BOOKING_DATA.client.notes && (
                                    <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-warning-light)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
                                        <strong style={{ color: 'var(--color-warning-dark)' }}>{t('bk.lblNote')}:</strong>{' '}
                                        {BOOKING_DATA.client.notes}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Activity log */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}><Clock size={16} /> {t('bk.cardActivityLog')}</span>
                            </div>
                            <div className={styles.cardBody}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {log.map((entry, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary-400)', marginTop: 4, flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{entry.label}</div>
                                                <div style={{ color: 'var(--text-secondary)' }}>{entry.detail}</div>
                                                <div style={{ color: 'var(--text-tertiary)' }}>{entry.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
