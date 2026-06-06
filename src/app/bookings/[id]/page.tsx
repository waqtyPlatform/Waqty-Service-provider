'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    Mail,
    AlertTriangle,
    ChevronRight,
    Banknote,
    CreditCard as CardIcon,
    Wallet,
    Timer,
} from 'lucide-react';
import { Button, Badge, Stepper, useToast } from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { providerApi, type Booking, type BookingStatus } from '@/lib/api';
import { checkInCode } from '@/lib/waqty_contract';
import type { CanonicalPaymentMethod, PaymentModel } from '@/lib/contract';
import { egp, fromMinor, toMinor, formatMoney, DEFAULT_CURRENCY } from '@/lib/money';
import type { PriceSource } from '@/lib/priceResolver';
import { type DisplayStatus, STEP_INDEX, statusToDisplay } from '@/lib/displayStatus';

// ─── Types ────────────────────────────────────────────────────────────────────

// DisplayStatus / STATUS_STEPS / STEP_INDEX are single-sourced from
// `@/lib/displayStatus` (G2) — imported above — so the detail page, rooms board
// and home charts share one display vocabulary.

type ItemStatus = 'confirmed' | 'pending_assignment';

// A booking line as the UI renders it — a view-model of the canonical
// `VisitLineItem` (one service, OPTIONAL specialist, own slot). `employeeId === ''`
// represents the canonical `employee_uuid: null` ("any available"); such a line
// shows as `pending_assignment` until a specialist is assigned (PR-3).
interface BookingItem {
    id: number; // -> VisitLineItem.uuid
    serviceId: string; // -> VisitLineItem.service_uuid
    name: string; // resolved Service.name
    nameAr?: string; // resolved Service.name_ar — rendered under the AR locale (X10)
    employee: string; // resolved Employee.name ('' = unassigned)
    employeeId: string; // -> VisitLineItem.employee_uuid ('' = null / any available)
    employeeLevel: string;
    basePrice: number;
    price: number; // -> VisitLineItem.price
    priceSource: PriceSource;
    duration: string; // <- VisitLineItem.duration_minutes
    time: string; // <- VisitLineItem.start_time (HH:mm) — each line has its own slot
    itemStatus: ItemStatus;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const BOOKING_DATA = {
    id: '#BK-28492',
    date: 'Mar 17, 2026',
    time: '14:30',
    duration: '2h 15m',
    initialStatus: 'confirmed' as DisplayStatus,
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
        {
            id: 1,
            serviceId: '2',
            name: 'Hair Coloring - Full',
            nameAr: 'صبغ شعر - كامل',
            employee: 'Sarah Ahmed',
            employeeId: 'emp-2',
            employeeLevel: 'Senior',
            basePrice: 45000, // EGP minor units (PR-8): 450.00 EGP
            price: 52000, // 520.00 EGP
            priceSource: 'tier' as PriceSource,
            duration: '90m',
            time: '14:30',
            itemStatus: 'confirmed' as ItemStatus,
        },
        {
            id: 2,
            serviceId: '1',
            name: 'Hair Cut & Style',
            nameAr: 'قص وتصفيف الشعر',
            employee: 'Sarah Ahmed',
            employeeId: 'emp-2',
            employeeLevel: 'Senior',
            basePrice: 12000, // 120.00 EGP
            price: 15000, // 150.00 EGP
            priceSource: 'tier' as PriceSource,
            duration: '45m',
            time: '16:00',
            itemStatus: 'confirmed' as ItemStatus,
        },
        {
            id: 3,
            serviceId: '7',
            name: 'Deep Conditioning',
            nameAr: 'ترطيب عميق',
            employee: '',
            employeeId: '',
            employeeLevel: '',
            basePrice: 30000, // 300.00 EGP
            price: 30000, // 300.00 EGP
            priceSource: 'base' as PriceSource,
            duration: '30m',
            time: '16:45',
            itemStatus: 'pending_assignment' as ItemStatus,
        },
    ],
    // EGP minor units (PR-8) — integers, no floats.
    financials: {
        subtotal: 97000, // 970.00 (520 + 150 + 300)
        discount: 9700, // 97.00
        discountLabel: 'VIP 10%',
        tax: 12222, // 122.22
        total: 99522, // 995.22
        paid: 50000, // 500.00
        due: 49522, // 495.22
    },
    // Canonical Payment (PR-4): which of the three payment models this visit uses
    // and how it was paid. Drives the "deposit paid / balance due at shop" vs
    // "due at shop" (cash) vs "paid online" messaging.
    payment: {
        model: 'deposit_balance' as PaymentModel,
        method: 'card' as CanonicalPaymentMethod,
    },
    queue: {
        number: 3,
        totalToday: 8,
        scheduledStart: '14:30',
        expectedStart: '14:45',
        delayMins: 15,
    },
    activityLog: [
        { label: 'Created', detail: 'by Receptionist', time: 'Feb 15, 10:00 AM' },
        { label: 'Package Applied', detail: 'VIP Hair Care Bundle — 3 sessions remaining', time: 'Feb 15, 10:02 AM' },
        { label: 'Deposit Paid', detail: '500 EGP (Credit Card)', time: 'Feb 15, 10:05 AM' },
        { label: 'Confirmed', detail: 'SMS Reminder Sent', time: 'Feb 17, 09:00 AM' },
    ],
};

const BADGE_COLOR: Record<DisplayStatus, 'primary' | 'success' | 'warning' | 'error' | 'neutral'> = {
    draft: 'neutral',
    confirmed: 'primary',
    arrived: 'warning',
    inService: 'primary',
    completed: 'success',
    cancelled: 'error',
    no_show: 'error',
};

// Staff eligible to perform a line. Each option carries the canonical
// `employee_uuid` so assigning a line sets a real FK (not just a display name),
// which is what the Employee app keys its "assigned work" off.
// GAP: in production this comes from providerApi.getEmployees() filtered by the
// line's service via ServiceEmployeeMapping.
const ELIGIBLE_STAFF: { uuid: string; name: string }[] = [
    { uuid: 'emp-2', name: 'Sarah Ahmed' },
    { uuid: 'emp-3', name: 'Nora Ali' },
    { uuid: 'emp-4', name: 'Layla Hassan' },
];

// Human messaging for the three canonical payment models (PR-4).
function paymentModelLabel(
    model: PaymentModel,
    balanceDue: number,
    t: (key: string) => string
): { text: string; tone: 'info' | 'warning' | 'success' } {
    const balance = egp(balanceDue);
    switch (model) {
        case 'online_upfront':
            return { text: t('bk.payModelOnlineFull'), tone: 'success' };
        case 'deposit_balance':
            return balanceDue > 0
                ? { text: t('bk.payModelDepositBalance').replace('{balance}', balance), tone: 'warning' }
                : { text: t('bk.payModelDepositSettled'), tone: 'success' };
        case 'cash':
        default:
            return balanceDue > 0
                ? { text: t('bk.payModelCashDue').replace('{balance}', balance), tone: 'warning' }
                : { text: t('bk.payModelPaidCash'), tone: 'success' };
    }
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function CancelModal({ onConfirm, onClose }: { onConfirm: (reason: string) => void; onClose: () => void }) {
    const { t } = useTranslation();
    const [reason, setReason] = useState('');
    const overlay: React.CSSProperties = {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };
    const box: React.CSSProperties = {
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        width: 420,
        maxWidth: '90vw',
        border: '1px solid var(--border-color)',
    };
    return (
        <div style={overlay} onClick={onClose}>
            <div style={box} onClick={e => e.stopPropagation()}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        marginBottom: 'var(--space-4)',
                    }}
                >
                    <AlertTriangle size={20} color="var(--color-error)" />
                    <h3 style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-lg)' }}>
                        {t('bk.actionCancel')}
                    </h3>
                </div>
                <p
                    style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--space-4)',
                    }}
                >
                    {t('bk.cancelWarn')}
                </p>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label
                        style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            display: 'block',
                            marginBottom: 'var(--space-2)',
                        }}
                    >
                        {t('bk.lblCancelReason')}
                    </label>
                    <select
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        style={{
                            width: '100%',
                            height: 42,
                            padding: '0 var(--space-4)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--bg-primary)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="">{t('bk.optSelectReason')}</option>
                        <option value="client_request">{t('bk.reasonClientRequest')}</option>
                        <option value="staff_unavailable">{t('bk.reasonStaffUnavailable')}</option>
                        <option value="double_booking">{t('bk.reasonDoubleBooking')}</option>
                        <option value="other">{t('bk.reasonOther')}</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', direction: 'ltr' }}>
                    <Button variant="outline" onClick={onClose}>
                        {t('bk.btnKeepBooking')}
                    </Button>
                    <Button variant="destructive" onClick={() => reason && onConfirm(reason)}>
                        {t('bk.btnConfirmCancel')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function PaymentModal({
    due,
    onConfirm,
    onClose,
}: {
    due: number; // EGP minor units
    onConfirm: (amount: number, method: string) => void; // amount in minor units
    onClose: () => void;
}) {
    const { t } = useTranslation();
    // Input is in major units (what the cashier types); stored/confirmed in minor.
    const [amount, setAmount] = useState(String(fromMinor(due)));
    const [method, setMethod] = useState('card');
    const overlay: React.CSSProperties = {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };
    const box: React.CSSProperties = {
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        width: 440,
        maxWidth: '90vw',
        border: '1px solid var(--border-color)',
    };
    const methodBtn = (val: string, icon: React.ReactNode, label: string): React.CSSProperties => ({
        flex: 1,
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        border: method === val ? '2px solid var(--color-primary-500)' : '1px solid var(--border-color)',
        background: method === val ? 'var(--color-primary-50, #eff6ff)' : 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-1)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-medium)',
        color: method === val ? 'var(--color-primary-600)' : 'var(--text-secondary)',
    });

    return (
        <div style={overlay} onClick={onClose}>
            <div style={box} onClick={e => e.stopPropagation()}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        marginBottom: 'var(--space-5)',
                    }}
                >
                    <CreditCard size={20} color="var(--color-primary-500)" />
                    <h3 style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-lg)' }}>
                        {t('bk.btnProcessPayment')}
                    </h3>
                </div>

                <div
                    style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4)',
                        marginBottom: 'var(--space-4)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 'var(--text-sm)',
                            marginBottom: 'var(--space-1)',
                        }}
                    >
                        <span style={{ color: 'var(--text-tertiary)' }}>{t('bk.lblBalanceDue2')}</span>
                        <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>
                            {egp(due)}
                        </span>
                    </div>
                </div>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label
                        style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            display: 'block',
                            marginBottom: 'var(--space-2)',
                        }}
                    >
                        {t('bk.lblAmountToCollect')} ({DEFAULT_CURRENCY})
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        style={{
                            width: '100%',
                            height: 42,
                            padding: '0 var(--space-4)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--bg-primary)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-primary)',
                        }}
                    />
                </div>

                <div style={{ marginBottom: 'var(--space-5)' }}>
                    <label
                        style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            display: 'block',
                            marginBottom: 'var(--space-3)',
                        }}
                    >
                        {t('bk.lblPaymentMethod')}
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <button style={methodBtn('cash', null, 'Cash')} onClick={() => setMethod('cash')}>
                            <Banknote size={18} /> {t('bk.payCash')}
                        </button>
                        <button style={methodBtn('card', null, 'Card')} onClick={() => setMethod('card')}>
                            <CardIcon size={18} /> {t('bk.payCard')}
                        </button>
                        <button style={methodBtn('wallet', null, 'Wallet')} onClick={() => setMethod('wallet')}>
                            <Wallet size={18} /> {t('bk.payWallet')}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', direction: 'ltr' }}>
                    <Button variant="outline" onClick={onClose}>
                        {t('bk.btnCancel2')}
                    </Button>
                    <Button onClick={() => onConfirm(toMinor(Number(amount)), method)}>
                        {t('bk.btnCollect')} {egp(toMinor(Number(amount)))}
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
    const { t, tn, lang } = useTranslation();
    const router = useRouter();

    const [apiBooking, setApiBooking] = useState<Booking | null>(null);
    const [status, setStatus] = useState<DisplayStatus>(BOOKING_DATA.initialStatus);
    const [paid, setPaid] = useState(BOOKING_DATA.financials.paid);
    const [log, setLog] = useState(BOOKING_DATA.activityLog);
    const [showCancel, setShowCancel] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [bookingItems, setBookingItems] = useState<BookingItem[]>(BOOKING_DATA.items);
    const [assignTarget, setAssignTarget] = useState<number | null>(null);
    const [assignForm, setAssignForm] = useState({ employee: '', time: '', room: '' });
    const [codeInput, setCodeInput] = useState('');

    // Fetch booking from API if id looks like a UUID
    useEffect(() => {
        if (!id || id.startsWith('BK-') || id.startsWith('#')) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await providerApi.getBooking(id);
                if (!cancelled && res.success && res.data) {
                    setApiBooking(res.data);
                    // Map canonical persistent status -> display lifecycle (shared single source, G2).
                    setStatus(statusToDisplay(res.data.status));
                }
            } catch {
                // Keep fallback mock data
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [id]);

    // Derive display data from the live API. Services & specialists render from
    // the canonical multi-line `bookingItems` (the Visit line-items), so the old
    // single-service `apiBooking.service`/`.employee` render path is gone (PR′);
    // only the visit-level header (date/time) and client details come from here.
    const displayData = apiBooking
        ? {
              id: apiBooking.uuid,
              date: new Date(apiBooking.booking_date + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
              }),
              time: apiBooking.start_time?.slice(0, 5) || '—',
              client: {
                  name: apiBooking.user?.name || 'Walk-in', // GAP: no client details if user is null
                  phone: apiBooking.user?.phone || '—',
                  email: apiBooking.user?.email || '—',
                  avatar: (apiBooking.user?.name || 'W')
                      .split(' ')
                      .map(w => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase(),
                  vip: false, // GAP: API has no VIP flag
                  notes: '', // GAP: API has no client notes
                  id: apiBooking.user?.uuid || '',
              },
          }
        : null;

    const due = Math.max(0, BOOKING_DATA.financials.total - paid);
    const currentStep = STEP_INDEX[status] ?? 1;
    const isCancelled = status === 'cancelled';
    const isNoShow = status === 'no_show';
    const isTerminal = isCancelled || isNoShow || status === 'completed';
    const isCompleted = status === 'completed';
    const canCheckIn = status === 'confirmed';
    // F-B: a visit can only be completed once its balance is settled (due === 0).
    // For cash / deposit visits reception must Collect Balance (the payment action)
    // first; online-upfront visits already have due === 0. Mirrors the contract's
    // settlePayment / isFullyPaid invariant — a visit is billable only once paid.
    const canComplete = status === 'inService' && due <= 0;
    const canStartService = status === 'arrived';
    const canMarkNoShow = status === 'confirmed' || status === 'arrived';
    // Manual check-in code (no-scanner fallback). Derived from the SAME visit id
    // the customer's app uses, via the shared canonical helper, so the code the
    // customer reads matches what we compute here — no backend round-trip.
    const expectedCheckInCode = checkInCode(displayData?.id ?? id);
    const pendingItems = bookingItems.filter(i => i.itemStatus === 'pending_assignment');

    // Assign (or reassign) a line to an eligible specialist. `assignForm.employee`
    // holds the canonical employee_uuid; we resolve the display name from it and
    // set both employeeId (-> VisitLineItem.employee_uuid) and the line's own time.
    const handleAssign = () => {
        if (!assignTarget) return;
        const staff = ELIGIBLE_STAFF.find(s => s.uuid === assignForm.employee);
        if (!staff) return;
        const target = bookingItems.find(i => i.id === assignTarget);
        const wasUnassigned = !target?.employeeId;
        setBookingItems(prev =>
            prev.map(i =>
                i.id === assignTarget
                    ? {
                          ...i,
                          itemStatus: 'confirmed' as ItemStatus,
                          employee: staff.name,
                          employeeId: staff.uuid,
                          time: assignForm.time || i.time,
                      }
                    : i
            )
        );
        addLog(
            wasUnassigned ? t('bk.logServiceAssigned') : t('bk.logServiceReassigned'),
            (wasUnassigned ? t('bk.logAssignDetail') : t('bk.logReassignDetail'))
                .replace('{service}', target?.name ?? '')
                .replace('{staff}', staff.name)
                .replace('{time}', assignForm.time || target?.time || '') +
                (assignForm.room ? t('bk.logInRoom').replace('{room}', assignForm.room) : '')
        );
        addToast('success', wasUnassigned ? t('bk.toastServiceAssigned') : t('bk.toastSpecialistReassigned'));
        setAssignTarget(null);
        setAssignForm({ employee: '', time: '', room: '' });
    };

    // Open the assign modal for a line, prefilling current specialist/time when
    // reassigning an already-assigned line.
    const openAssign = (item: BookingItem) => {
        setAssignTarget(item.id);
        setAssignForm({ employee: item.employeeId || '', time: item.time || '', room: '' });
    };

    const addLog = (label: string, detail: string) => {
        const now = new Date();
        setLog(prev => [
            ...prev,
            {
                label,
                detail,
                time: now.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                }),
            },
        ]);
    };

    const updateApiStatus = async (apiStatus: BookingStatus) => {
        if (apiBooking) {
            try {
                await providerApi.updateBookingStatus(apiBooking.uuid, apiStatus);
            } catch {
                // Status updated locally even if API fails
            }
        }
    };

    const handleCheckIn = () => {
        // `arrived` is a DERIVED display state (see @/lib/displayStatus): the
        // persistent canonical status stays `confirmed`. Check-in is recorded as
        // `Visit.checked_in_at` on the canonical write — a cross-app-visible signal
        // that staff and the User app both read (matched via checkInCode), NOT a
        // phantom status. So we show `arrived` and persist canonical `confirmed`.
        setStatus('arrived');
        addLog(t('bk.logClientArrived'), t('bk.logCheckInCompleted'));
        addToast('success', t('bk.toastCheckedIn'));
        updateApiStatus('confirmed');
    };

    // No-scanner path: reception enters the code the customer reads from their
    // app; a match against the shared-derived code confirms arrival.
    const handleVerifyCode = () => {
        if (codeInput.trim() === expectedCheckInCode) {
            handleCheckIn();
            setCodeInput('');
        } else {
            addToast('error', t('bk.toastCodeMismatch'));
        }
    };

    const handleStartService = () => {
        setStatus('inService');
        addLog(t('bk.logServiceStarted'), t('bk.logInProgress'));
        addToast('success', t('bk.toastServiceStarted'));
        // Canonical `in_progress` persists the in-service display state.
        updateApiStatus('in_progress');
    };

    const handleComplete = () => {
        setStatus('completed');
        addLog(t('bk.logServiceCompleted'), t('bk.logAwaitingPayment'));
        addToast('success', t('bk.toastMarkedCompleted'));
        updateApiStatus('completed');
    };

    const handleCancel = (reason: string) => {
        setStatus('cancelled');
        setShowCancel(false);
        addLog(t('bk.logCancelled'), reason.replace(/_/g, ' '));
        addToast('error', t('bk.toastBookingCancelled'));
        updateApiStatus('cancelled');
    };

    const handleNoShow = () => {
        setStatus('no_show');
        addLog(t('bk.logNoShow'), t('bk.logMarkedByReception'));
        addToast('warning', t('bk.toastMarkedNoShow'));
        updateApiStatus('no_show');
    };

    const handlePayment = (amount: number, method: string) => {
        // `amount` is EGP minor units (from PaymentModal).
        setPaid(prev => prev + amount);
        setShowPayment(false);
        addLog(
            t('bk.logPaymentReceived'),
            t('bk.logPaymentVia').replace('{amount}', egp(amount)).replace('{method}', method)
        );
        addToast('success', t('bk.toastAmountCollected').replace('{amount}', egp(amount)));
    };

    const handlePrint = () => {
        window.print();
        addToast('info', t('bk.toastPrintingReceipt'));
    };

    return (
        <>
            {showCancel && <CancelModal onConfirm={handleCancel} onClose={() => setShowCancel(false)} />}
            {showPayment && <PaymentModal due={due} onConfirm={handlePayment} onClose={() => setShowPayment(false)} />}
            {assignTarget !== null && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.45)',
                        zIndex: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={() => setAssignTarget(null)}
                >
                    <div
                        style={{
                            background: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-6)',
                            width: 440,
                            maxWidth: '90vw',
                            border: '1px solid var(--border-color)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3
                            style={{
                                fontWeight: 'var(--font-semibold)',
                                fontSize: 'var(--text-lg)',
                                marginBottom: 'var(--space-4)',
                            }}
                        >
                            {t('bk.assignService')}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <div>
                                <label
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-medium)',
                                        display: 'block',
                                        marginBottom: 'var(--space-2)',
                                    }}
                                >
                                    {t('bk.thEmployee')}
                                </label>
                                <select
                                    value={assignForm.employee}
                                    onChange={e => setAssignForm(p => ({ ...p, employee: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        height: 42,
                                        padding: '0 var(--space-4)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--bg-primary)',
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    <option value="">{t('bk.optSelectEmployee')}</option>
                                    {ELIGIBLE_STAFF.map(s => (
                                        <option key={s.uuid} value={s.uuid}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-medium)',
                                        display: 'block',
                                        marginBottom: 'var(--space-2)',
                                    }}
                                >
                                    {t('bk.tbTime')}
                                </label>
                                <input
                                    type="time"
                                    value={assignForm.time}
                                    onChange={e => setAssignForm(p => ({ ...p, time: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        height: 42,
                                        padding: '0 var(--space-4)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--bg-primary)',
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text-primary)',
                                    }}
                                />
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-medium)',
                                        display: 'block',
                                        marginBottom: 'var(--space-2)',
                                    }}
                                >
                                    {t('bk.lblRoomOptional')}
                                </label>
                                <select
                                    value={assignForm.room}
                                    onChange={e => setAssignForm(p => ({ ...p, room: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        height: 42,
                                        padding: '0 var(--space-4)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--bg-primary)',
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    <option value="">{t('bk.optNoRoom')}</option>
                                    <option>Styling Station 1</option>
                                    <option>Spa Room A</option>
                                    <option>VIP Suite</option>
                                </select>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--space-3)',
                                justifyContent: 'flex-end',
                                marginTop: 'var(--space-5)',
                                direction: 'ltr', // primary stays on the right in RTL
                            }}
                        >
                            <Button variant="outline" onClick={() => setAssignTarget(null)}>
                                {t('bk.btnCancel2')}
                            </Button>
                            <Button onClick={handleAssign} disabled={!assignForm.employee || !assignForm.time}>
                                {t('bk.btnAssign')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.page} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                {/* Back + Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        marginBottom: 'var(--space-1)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-tertiary)',
                        cursor: 'pointer',
                    }}
                    onClick={() => router.push('/bookings/list')}
                >
                    <ChevronRight size={14} style={{ transform: lang === 'ar' ? 'none' : 'scaleX(-1)' }} />
                    {t('bookingDetail.backToBookings')}
                </div>

                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <div className={styles.subtitle}>
                            <Calendar size={14} /> {displayData?.date || BOOKING_DATA.date} •{' '}
                            {displayData?.time || BOOKING_DATA.time}
                        </div>
                        <h1>
                            {t('bk.lblBooking')} {id.startsWith('#') ? id : `#${id}`}
                            <Badge
                                color={BADGE_COLOR[status] ?? 'neutral'}
                                style={{ marginInlineStart: 'var(--space-2)' }}
                            >
                                {status === 'inService' ? t('bk.stepInService') : status}
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
                            <Button
                                variant="outline"
                                onClick={handleNoShow}
                                style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                            >
                                <AlertTriangle size={16} /> {t('bk.btnNoShow')}
                            </Button>
                        )}
                        {canCheckIn && (
                            <Button onClick={handleCheckIn}>
                                <CheckCircle size={16} /> {t('bk.btnCheckIn')}
                            </Button>
                        )}
                        {canStartService && (
                            <Button onClick={handleStartService}>
                                <Scissors size={16} /> {t('bk.btnStartService')}
                            </Button>
                        )}
                        {canComplete && (
                            <Button onClick={handleComplete}>
                                <CheckCircle size={16} /> {t('bk.btnMarkComplete')}
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
                                    t('bk.stepDraft'),
                                    t('bk.stepConfirmed'),
                                    t('bk.stepArrived'),
                                    t('bk.stepInService'),
                                    t('bk.stepCompleted'),
                                ]}
                                current={currentStep}
                            />
                        </div>
                    </div>
                ) : isCancelled ? (
                    <div
                        style={{
                            padding: 'var(--space-3) var(--space-4)',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            fontSize: 'var(--text-sm)',
                            color: '#dc2626',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        <AlertTriangle size={16} />
                        <strong>{t('bookingDetail.cancelledTitle')}</strong> {t('bookingDetail.noFurtherActions')}
                    </div>
                ) : (
                    <div
                        style={{
                            padding: 'var(--space-3) var(--space-4)',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            fontSize: 'var(--text-sm)',
                            color: '#dc2626',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        <AlertTriangle size={16} />
                        <strong>{t('bookingDetail.noShowTitle')}</strong> {t('bookingDetail.noFurtherActions')}
                    </div>
                )}

                {/* Check-in by code — no-scanner fallback. The customer reads the
                    code from their app ("I've arrived"); reception enters it to
                    confirm arrival. Same code is derived on both sides. */}
                {canCheckIn && (
                    <div
                        style={{
                            padding: 'var(--space-4)',
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                marginBottom: 'var(--space-2)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 600,
                                color: '#065f46',
                            }}
                        >
                            <CheckCircle size={16} /> {t('bookingDetail.checkInNoScanner')}
                        </div>
                        <div
                            style={{
                                fontSize: 'var(--text-sm)',
                                color: '#047857',
                                marginBottom: 'var(--space-3)',
                            }}
                        >
                            {t('bookingDetail.checkInCodeHint')}{' '}
                            <strong style={{ letterSpacing: 2 }}>{expectedCheckInCode}</strong>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                                flexWrap: 'wrap',
                            }}
                        >
                            <input
                                value={codeInput}
                                onChange={e => setCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder={t('bookingDetail.enterCode')}
                                inputMode="numeric"
                                maxLength={6}
                                style={{
                                    padding: 'var(--space-2) var(--space-3)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: 'var(--text-base)',
                                    letterSpacing: 3,
                                    width: 160,
                                }}
                            />
                            <Button onClick={handleVerifyCode}>
                                <CheckCircle size={16} /> {t('bookingDetail.confirmCheckIn')}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Task 08: Package Applied banner */}
                {BOOKING_DATA.packageId && (
                    <div
                        style={{
                            padding: 'var(--space-3) var(--space-4)',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            fontSize: 'var(--text-sm)',
                            color: '#1d4ed8',
                            marginBottom: 'var(--space-2)',
                        }}
                    >
                        <CheckCircle size={16} />
                        <span>
                            This visit is covered by <strong>{BOOKING_DATA.packageName}</strong> —{' '}
                            <strong>{BOOKING_DATA.packageSessionsRemaining} sessions</strong> remaining
                        </span>
                    </div>
                )}

                {/* Task 04: Pending assignment banner */}
                {pendingItems.length > 0 && !isTerminal && (
                    <div
                        style={{
                            padding: 'var(--space-3) var(--space-4)',
                            background: '#fffbeb',
                            border: '1px solid #fcd34d',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            fontSize: 'var(--text-sm)',
                            color: '#92400e',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        <AlertTriangle size={16} />
                        <span>
                            <strong>
                                {pendingItems.length} service{pendingItems.length > 1 ? 's' : ''} added by employee
                            </strong>{' '}
                            {pendingItems.length > 1 ? 'are' : 'is'} awaiting assignment.
                        </span>
                    </div>
                )}

                {/* Content grid */}
                <div className={styles.grid}>
                    {/* Main column */}
                    <div className={styles.mainCol}>
                        {/* Services */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}>
                                    <Scissors size={18} /> {t('bk.cardSvcItems')}
                                </span>
                            </div>
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>{t('bk.thItem2')}</th>
                                            <th>{t('bk.thStaffInfo')}</th>
                                            <th style={{ textAlign: 'end' }}>{t('bk.thPrice2')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookingItems.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--space-2)',
                                                        }}
                                                    >
                                                        <span style={{ fontWeight: 'var(--font-medium)' }}>
                                                            {tn(item.name, item.nameAr)}
                                                        </span>
                                                        {item.itemStatus === 'pending_assignment' && (
                                                            <span
                                                                style={{
                                                                    padding: '1px var(--space-2)',
                                                                    borderRadius: 'var(--radius-full)',
                                                                    fontSize: 11,
                                                                    fontWeight: 600,
                                                                    background: '#fef3c7',
                                                                    color: '#92400e',
                                                                }}
                                                            >
                                                                {t('bookingDetail.pendingAssignment')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {(item.time || item.duration) && (
                                                        <div
                                                            style={{
                                                                fontSize: 'var(--text-xs)',
                                                                color: 'var(--text-tertiary)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 'var(--space-1)',
                                                            }}
                                                        >
                                                            {item.time && (
                                                                <span
                                                                    style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: 2,
                                                                    }}
                                                                >
                                                                    <Clock size={11} /> {item.time}
                                                                </span>
                                                            )}
                                                            {item.time && item.duration && <span>·</span>}
                                                            {item.duration && <span>{item.duration}</span>}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    {item.employee || (
                                                        <span style={{ color: 'var(--text-tertiary)' }}>
                                                            {t('bookingDetail.unassigned')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td
                                                    style={{
                                                        textAlign: lang === 'ar' ? 'left' : 'right',
                                                        fontFamily: 'var(--font-mono)',
                                                    }}
                                                    dir="ltr"
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'flex-end',
                                                            gap: 'var(--space-2)',
                                                        }}
                                                    >
                                                        <span>
                                                            {item.priceSource !== 'base' && (
                                                                <span
                                                                    style={{
                                                                        textDecoration: 'line-through',
                                                                        color: 'var(--text-tertiary)',
                                                                        fontSize: 'var(--text-xs)',
                                                                        marginInlineEnd: 'var(--space-1)',
                                                                    }}
                                                                >
                                                                    {formatMoney(item.basePrice, {
                                                                        withCurrency: false,
                                                                    })}
                                                                </span>
                                                            )}
                                                            {egp(item.price)}
                                                            {item.priceSource !== 'base' && (
                                                                <span
                                                                    style={{
                                                                        marginInlineStart: 'var(--space-1)',
                                                                        padding: '1px var(--space-2)',
                                                                        borderRadius: 'var(--radius-full)',
                                                                        fontSize: 10,
                                                                        fontWeight: 600,
                                                                        background: 'var(--color-primary-50, #eff6ff)',
                                                                        color: 'var(--color-primary-600)',
                                                                    }}
                                                                >
                                                                    {item.priceSource}
                                                                </span>
                                                            )}
                                                        </span>
                                                        {!isTerminal &&
                                                            (item.itemStatus === 'pending_assignment' ? (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => openAssign(item)}
                                                                    style={{
                                                                        fontSize: 11,
                                                                        padding: '2px var(--space-2)',
                                                                    }}
                                                                >
                                                                    Assign
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => openAssign(item)}
                                                                    style={{
                                                                        fontSize: 11,
                                                                        padding: '2px var(--space-2)',
                                                                    }}
                                                                >
                                                                    Reassign
                                                                </Button>
                                                            ))}
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
                                <span className={styles.cardTitle}>
                                    <CreditCard size={18} /> {t('bk.cardPaySummary')}
                                </span>
                                <Badge color={due > 0 ? 'warning' : 'success'}>
                                    {due > 0 ? t('bk.lblPayDue') : t('bk.lblPaidInFull')}
                                </Badge>
                            </div>
                            <div className={styles.cardBody}>
                                {(() => {
                                    const label = paymentModelLabel(BOOKING_DATA.payment.model, due, t);
                                    const toneColor =
                                        label.tone === 'success'
                                            ? 'var(--color-success-600)'
                                            : label.tone === 'warning'
                                              ? 'var(--color-warning-700, #b45309)'
                                              : 'var(--color-primary-600)';
                                    const toneBg =
                                        label.tone === 'success'
                                            ? 'var(--color-success-50, #ecfdf5)'
                                            : label.tone === 'warning'
                                              ? 'var(--color-warning-50, #fffbeb)'
                                              : 'var(--color-primary-50, #eff6ff)';
                                    return (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)',
                                                padding: 'var(--space-2) var(--space-3)',
                                                borderRadius: 'var(--radius-lg)',
                                                background: toneBg,
                                                color: toneColor,
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 'var(--font-medium)',
                                                marginBottom: 'var(--space-3)',
                                            }}
                                        >
                                            <Banknote size={15} /> {label.text}
                                        </div>
                                    );
                                })()}
                                <div className={styles.summaryRow}>
                                    <span>{t('bk.lblSubtotal')}</span>
                                    <span dir="ltr">{egp(BOOKING_DATA.financials.subtotal)}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span style={{ color: 'var(--color-success-600)' }}>
                                        {t('bk.lblDiscount')} ({BOOKING_DATA.financials.discountLabel})
                                    </span>
                                    <span style={{ color: 'var(--color-success-600)' }} dir="ltr">
                                        -{egp(BOOKING_DATA.financials.discount)}
                                    </span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>{t('bk.lblTax')} (14%)</span>
                                    <span dir="ltr">{egp(BOOKING_DATA.financials.tax)}</span>
                                </div>
                                <div className={styles.summaryTotal}>
                                    <span>{t('bk.lblTotal')}</span>
                                    <span dir="ltr">{egp(BOOKING_DATA.financials.total)}</span>
                                </div>
                                {BOOKING_DATA.packageId && (
                                    <div
                                        className={styles.summaryRow}
                                        style={{ marginTop: 'var(--space-2)', color: '#1d4ed8' }}
                                    >
                                        <span>Package Credit ({BOOKING_DATA.packageName})</span>
                                        <span dir="ltr">-{egp(BOOKING_DATA.financials.subtotal)}</span>
                                    </div>
                                )}
                                <div className={styles.summaryRow} style={{ marginTop: 'var(--space-2)' }}>
                                    <span>{t('bk.lblPaidDeposit')}</span>
                                    <span dir="ltr">-{egp(paid)}</span>
                                </div>
                                <div
                                    className={styles.summaryTotal}
                                    style={{
                                        color: due > 0 ? 'var(--color-destructive-600)' : 'var(--color-success-600)',
                                    }}
                                >
                                    <span>{t('bk.lblBalanceDue')}</span>
                                    <span dir="ltr">{egp(due)}</span>
                                </div>

                                {due > 0 && !isCancelled && !isNoShow && (
                                    <div style={{ marginTop: 'var(--space-5)' }}>
                                        <Button fullWidth onClick={() => setShowPayment(true)}>
                                            {t('bk.btnProcessPayment')} ({egp(due)})
                                        </Button>
                                    </div>
                                )}
                                {due === 0 && (
                                    <div
                                        style={{
                                            marginTop: 'var(--space-4)',
                                            textAlign: 'center',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--color-success-600)',
                                            fontWeight: 'var(--font-medium)',
                                        }}
                                    >
                                        {t('bookingDetail.fullyPaid')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Side column */}
                    <div className={styles.sideCol}>
                        {/* Expected Service Time */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}>
                                    <Timer size={18} /> {t('bookingDetail.expectedServiceTime')}
                                </span>
                                <Badge color="neutral" size="sm">
                                    #{BOOKING_DATA.queue.number} of {BOOKING_DATA.queue.totalToday}
                                </Badge>
                            </div>
                            <div className={styles.cardBody}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        marginBottom: 'var(--space-3)',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 'var(--radius-lg)',
                                            background: 'var(--color-primary-50)',
                                            color: 'var(--color-primary-600)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 'var(--text-lg)',
                                            fontWeight: 'var(--font-bold)',
                                        }}
                                    >
                                        #{BOOKING_DATA.queue.number}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            {t('bookingDetail.queuePosition')}
                                        </div>
                                        <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>
                                            {t('bookingDetail.appointmentOfToday')
                                                .replace('{n}', String(BOOKING_DATA.queue.number))
                                                .replace('{total}', String(BOOKING_DATA.queue.totalToday))}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 'var(--space-2)',
                                        padding: 'var(--space-3)',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius-lg)',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                                            {t('bookingDetail.expectedStart')}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 'var(--text-lg)',
                                                fontWeight: 'var(--font-bold)',
                                                color: 'var(--color-primary-600)',
                                            }}
                                        >
                                            {BOOKING_DATA.queue.expectedStart}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                                            {t('bookingDetail.scheduled')}
                                        </span>
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                            {BOOKING_DATA.queue.scheduledStart}
                                        </span>
                                    </div>
                                    {BOOKING_DATA.queue.delayMins > 0 && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)',
                                                padding: 'var(--space-2)',
                                                marginTop: 'var(--space-1)',
                                                background: 'var(--color-warning-light)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: 'var(--text-xs)',
                                                color: 'var(--color-warning-dark, #92400e)',
                                                fontWeight: 'var(--font-medium)',
                                            }}
                                        >
                                            <AlertTriangle size={12} />
                                            {t('bookingDetail.delayFromSchedule').replace(
                                                '{n}',
                                                String(BOOKING_DATA.queue.delayMins)
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Client */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}>
                                    <User size={18} /> {t('bk.cardClientDetails')}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    iconOnly
                                    onClick={() =>
                                        router.push(`/customers/${(displayData?.client || BOOKING_DATA.client).id}`)
                                    }
                                >
                                    <Edit size={14} />
                                </Button>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.clientHeader}>
                                    <div className={styles.clientAvatar}>
                                        {(displayData?.client || BOOKING_DATA.client).avatar}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>
                                            {(displayData?.client || BOOKING_DATA.client).name}
                                        </div>
                                        <div
                                            style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}
                                            dir="ltr"
                                        >
                                            ID #{(displayData?.client || BOOKING_DATA.client).id}
                                        </div>
                                    </div>
                                </div>

                                {(displayData?.client || BOOKING_DATA.client).vip && (
                                    <div style={{ marginBottom: 'var(--space-4)' }}>
                                        <Badge color="amber">{t('bk.lblVipClient')}</Badge>
                                    </div>
                                )}

                                <div className={styles.infoRow}>
                                    <Phone size={14} className={styles.infoIcon} />
                                    <div className={styles.infoContent}>
                                        <a
                                            href={`tel:${(displayData?.client || BOOKING_DATA.client).phone}`}
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--color-primary-500)',
                                                textDecoration: 'none',
                                            }}
                                            dir="ltr"
                                        >
                                            {(displayData?.client || BOOKING_DATA.client).phone}
                                        </a>
                                    </div>
                                </div>
                                <div className={styles.infoRow}>
                                    <Mail size={14} className={styles.infoIcon} />
                                    <div className={styles.infoContent}>
                                        <a
                                            href={`mailto:${(displayData?.client || BOOKING_DATA.client).email}`}
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--color-primary-500)',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            {(displayData?.client || BOOKING_DATA.client).email}
                                        </a>
                                    </div>
                                </div>

                                {(displayData?.client || BOOKING_DATA.client).notes && (
                                    <div
                                        style={{
                                            marginTop: 'var(--space-4)',
                                            padding: 'var(--space-3)',
                                            background: 'var(--color-warning-light)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--text-sm)',
                                        }}
                                    >
                                        <strong style={{ color: 'var(--color-warning-dark)' }}>
                                            {t('bk.lblNote')}:
                                        </strong>{' '}
                                        {(displayData?.client || BOOKING_DATA.client).notes}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Activity log */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}>
                                    <Clock size={16} /> {t('bk.cardActivityLog')}
                                </span>
                            </div>
                            <div className={styles.cardBody}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {log.map((entry, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                gap: 'var(--space-3)',
                                                fontSize: 'var(--text-xs)',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    background: 'var(--color-primary-400)',
                                                    marginTop: 'var(--space-1)',
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: 'var(--font-semibold)',
                                                        color: 'var(--text-primary)',
                                                    }}
                                                >
                                                    {entry.label}
                                                </div>
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
