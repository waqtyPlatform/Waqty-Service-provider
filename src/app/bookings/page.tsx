'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus, Filter, CalendarDays, Clock, Building2, AlertTriangle } from 'lucide-react';
import { EmptyState } from '@/components/ui';
import styles from './bookings.module.css';
import BookingsTabs from './BookingsTabs';
import { useTranslation } from '@/hooks/useTranslation';
import { isEmployeeOnShift } from '@/lib/shiftData';
import { providerApi, type Booking } from '@/lib/api';

const employees = [
    { name: 'Sara A.', initials: 'SA', color: '#8B5CF6', status: 'Available', empId: 'E001', role: 'Senior Stylist' },
    { name: 'Nora A.', initials: 'NA', color: '#EC4899', status: 'In Session', empId: 'E002', role: 'Skin Specialist' },
    {
        name: 'Layla H.',
        initials: 'LH',
        color: '#3B82F6',
        status: 'Available',
        empId: 'E003',
        role: 'Senior Therapist',
    },
    { name: 'Reem M.', initials: 'RM', color: '#10B981', status: 'Break', empId: 'E005', role: 'Massage Therapist' },
    { name: 'Hana Y.', initials: 'HY', color: '#F59E0B', status: 'Available', empId: 'E004', role: 'Nail Technician' },
];

const timeSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
];

interface BookingBlock {
    empIndex: number;
    startSlot: number;
    span: number;
    client: string;
    service: string;
    status: string;
    id?: string;
}

const bookingBlocks: BookingBlock[] = [
    {
        empIndex: 0,
        startSlot: 0,
        span: 3,
        client: 'Fatima R.',
        service: 'Hair Coloring',
        status: 'confirmed',
        id: 'BK-1042',
    },
    { empIndex: 0, startSlot: 6, span: 2, client: 'Aisha M.', service: 'Haircut', status: 'completed', id: 'BK-1041' },
    { empIndex: 0, startSlot: 10, span: 2, client: 'Maryam I.', service: 'Olaplex', status: 'arrived', id: 'BK-1040' },
    { empIndex: 1, startSlot: 1, span: 4, client: 'Huda S.', service: 'Keratin', status: 'arrived', id: 'BK-1039' },
    { empIndex: 1, startSlot: 8, span: 2, client: 'Noura A.', service: 'Facial', status: 'confirmed', id: 'BK-1038' },
    {
        empIndex: 1,
        startSlot: 14,
        span: 2,
        client: 'Rania K.',
        service: 'HydraFacial',
        status: 'unconfirmed',
        id: 'BK-1037',
    },
    { empIndex: 2, startSlot: 0, span: 2, client: 'Dana F.', service: 'Manicure', status: 'completed', id: 'BK-1036' },
    {
        empIndex: 2,
        startSlot: 4,
        span: 6,
        client: 'Lina T.',
        service: 'Keratin + Color',
        status: 'confirmed',
        id: 'BK-1035',
    },
    { empIndex: 2, startSlot: 12, span: 2, client: 'Sara Q.', service: 'Facial', status: 'workDone', id: 'BK-1034' },
    { empIndex: 3, startSlot: 2, span: 4, client: 'Yara B.', service: 'Massage', status: 'confirmed', id: 'BK-1033' },
    { empIndex: 3, startSlot: 8, span: 2, client: 'Nada H.', service: 'Pedicure', status: 'confirmed', id: 'BK-1032' },
    { empIndex: 4, startSlot: 0, span: 2, client: 'Rana Z.', service: 'Laser', status: 'completed', id: 'BK-1031' },
    { empIndex: 4, startSlot: 4, span: 2, client: 'Joud W.', service: 'Gel Nails', status: 'cancelled', id: 'BK-1030' },
    {
        empIndex: 4,
        startSlot: 10,
        span: 4,
        client: 'Sama L.',
        service: 'Full Package',
        status: 'confirmed',
        id: 'BK-1029',
    },
];

const statusBlockClass: Record<string, string> = {
    confirmed: styles.blockConfirmed,
    completed: styles.blockCompleted,
    arrived: styles.blockArrived,
    unconfirmed: styles.blockUnconfirmed,
    cancelled: styles.blockCancelled,
    workDone: styles.blockWorkDone,
};

function formatDate(d: Date): string {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BookingsCalendarPage() {
    const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [apiBookings, setApiBookings] = useState<Booking[]>([]);
    const router = useRouter();
    const { t } = useTranslation();

    // Fetch bookings from API for summary stats
    // GAP: API returns flat list, no calendar-grid structure — calendar grid stays mock
    // GAP: API has no date filter param, returns all bookings
    // GAP: API has no create-booking endpoint for provider
    // GAP: API has no revenue/payment data on bookings
    useEffect(() => {
        providerApi
            .getBookings()
            .then(res => {
                if (res.success && res.data) {
                    setApiBookings(res.data);
                }
            })
            .catch(() => {});
    }, []);

    const goToday = () => setCurrentDate(new Date());
    const goPrev = () =>
        setCurrentDate(d => {
            const n = new Date(d);
            n.setDate(n.getDate() - 1);
            return n;
        });
    const goNext = () =>
        setCurrentDate(d => {
            const n = new Date(d);
            n.setDate(n.getDate() + 1);
            return n;
        });

    const handleEmptyCellClick = (empIndex: number, slotIndex: number) => {
        const time = timeSlots[slotIndex];
        const emp = employees[empIndex];
        const dateStr = currentDate.toISOString().split('T')[0];
        router.push(`/bookings/new?emp=${emp.initials}&date=${dateStr}&time=${time}`);
    };

    return (
        <div className={styles.bookingsPage}>
            {/* Tabs */}
            <BookingsTabs />

            {/* Calendar Header */}
            <div className={styles.calendarHeader}>
                <div className={styles.calendarNav}>
                    <button className={styles.navBtn} onClick={goPrev}>
                        <ChevronLeft size={18} />
                    </button>
                    <span className={styles.calendarTitle}>{formatDate(currentDate)}</span>
                    <button className={styles.navBtn} onClick={goNext}>
                        <ChevronRight size={18} />
                    </button>
                    <button className={styles.todayBtn} onClick={goToday}>
                        {t('bookings.today')}
                    </button>
                </div>

                <div className={styles.viewToggle}>
                    {(['day', 'week', 'month'] as const).map(v => (
                        <button
                            key={v}
                            className={`${styles.viewBtn} ${calendarView === v ? styles.viewBtnActive : ''}`}
                            onClick={() => setCalendarView(v)}
                        >
                            {t(`bookings.${v}`)}
                        </button>
                    ))}
                </div>

                <div className={styles.calendarActions}>
                    <button className={styles.filterBtn}>
                        <Filter size={16} /> {t('bookings.filters')}
                    </button>
                    <Link href="/bookings/new" className={styles.btnPrimary}>
                        <Plus size={16} /> {t('bookings.newBooking')}
                    </Link>
                </div>
            </div>

            {/* Calendar Grid + Side Panel */}
            <div className={styles.calendarWrapper}>
                {calendarView === 'day' ? (
                    <div
                        className={styles.calendarGrid}
                        style={{ '--emp-count': employees.length } as React.CSSProperties}
                    >
                        {/* Header row */}
                        <div className={styles.calendarGridHeader}>
                            <div className={styles.timeColHeader}>
                                <Clock size={14} style={{ margin: '0 auto', color: 'var(--text-tertiary)' }} />
                            </div>
                            {employees.map(emp => (
                                <div key={emp.name} className={styles.empColHeader}>
                                    <div className={styles.empAvatar} style={{ background: emp.color }}>
                                        {emp.initials}
                                    </div>
                                    <div className={styles.empName}>{emp.name}</div>
                                    <div className={styles.empStatus}>{emp.status}</div>
                                    {!isEmployeeOnShift(
                                        emp.empId,
                                        emp.role,
                                        currentDate.toISOString().split('T')[0]
                                    ) && (
                                        <div
                                            style={{
                                                color: 'var(--color-warning-600)',
                                                fontSize: 10,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                marginTop: 2,
                                            }}
                                        >
                                            <AlertTriangle size={10} /> Off-shift
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Time rows */}
                        <div className={styles.calendarBody}>
                            {timeSlots.map((time, slotIndex) => (
                                <div key={time} className={styles.timeRow}>
                                    <div className={styles.timeLabel}>{time}</div>
                                    {employees.map((_, empIndex) => {
                                        const block = bookingBlocks.find(
                                            b => b.empIndex === empIndex && b.startSlot === slotIndex
                                        );

                                        return (
                                            <div
                                                key={empIndex}
                                                className={styles.timeCell}
                                                onClick={() => !block && handleEmptyCellClick(empIndex, slotIndex)}
                                                style={{ cursor: block ? 'default' : 'pointer' }}
                                                title={!block ? `Book slot — ${timeSlots[slotIndex]}` : undefined}
                                            >
                                                {block && (
                                                    <div
                                                        className={`${styles.bookingBlock} ${statusBlockClass[block.status] || ''}`}
                                                        style={{ height: `${block.span * 64 - 4}px` }}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            if (block.id) router.push(`/bookings/${block.id}`);
                                                        }}
                                                    >
                                                        <div className={styles.bookingBlockName}>{block.client}</div>
                                                        <div className={styles.bookingBlockService}>
                                                            {block.service}
                                                        </div>
                                                        <div className={styles.bookingBlockTime}>
                                                            {timeSlots[block.startSlot]} –{' '}
                                                            {timeSlots[block.startSlot + block.span] || '21:00'}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--border-color)',
                        }}
                    >
                        <EmptyState
                            icon={<CalendarDays size={48} />}
                            title={t('bookings.advancedViewTitle')}
                            description={t('bookings.advancedViewDesc')}
                        />
                    </div>
                )}

                {/* Side Panel */}
                <div className={styles.sidePanel}>
                    {/* Next Appointment */}
                    <div className={styles.sidePanelCard}>
                        <div className={styles.sidePanelTitle}>
                            <Clock size={16} /> {t('bookings.nextAppt')}
                        </div>
                        <div
                            className={styles.nextApptCard}
                            style={{ cursor: 'pointer' }}
                            onClick={() => router.push('/bookings/BK-1040')}
                        >
                            <div className={styles.nextApptName}>Maryam Ibrahim</div>
                            <div className={styles.nextApptService}>Olaplex Treatment</div>
                            <div className={styles.nextApptTime}>
                                <Clock size={12} /> 14:00 – 15:00
                            </div>
                            <div className={styles.countdown}>{t('bookings.inMins').replace('%mins%', '23')}</div>
                        </div>
                    </div>

                    {/* Today's Summary */}
                    <div className={styles.sidePanelCard}>
                        <div className={styles.sidePanelTitle}>
                            <CalendarDays size={16} /> {t('bookings.todaySummary')}
                        </div>
                        <div className={styles.summaryGrid}>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue}>
                                    {apiBookings.length > 0 ? apiBookings.length : 14}
                                </div>
                                <div className={styles.summaryLabel}>{t('bookings.total')}</div>
                            </div>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue} style={{ color: 'var(--status-confirmed)' }}>
                                    {apiBookings.length > 0
                                        ? apiBookings.filter(b => b.status === 'confirmed').length
                                        : 8}
                                </div>
                                <div className={styles.summaryLabel}>{t('bookings.confirmed')}</div>
                            </div>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue} style={{ color: 'var(--status-completed)' }}>
                                    {apiBookings.length > 0
                                        ? apiBookings.filter(b => b.status === 'completed').length
                                        : 3}
                                </div>
                                <div className={styles.summaryLabel}>{t('bookings.completed')}</div>
                            </div>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue} style={{ color: 'var(--status-cancelled)' }}>
                                    {apiBookings.length > 0
                                        ? apiBookings.filter(b => b.status === 'cancelled').length
                                        : 1}
                                </div>
                                <div className={styles.summaryLabel}>{t('bookings.cancelled')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className={styles.sidePanelCard}>
                        <div className={styles.sidePanelTitle}>
                            <Building2 size={16} /> {t('bookings.revenueToday')}
                        </div>
                        <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
                            <div
                                style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 'var(--font-bold)',
                                    color: 'var(--color-primary-600)',
                                }}
                            >
                                4,280 EGP
                            </div>
                            <div
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-tertiary)',
                                    marginTop: 'var(--space-1)',
                                }}
                            >
                                {t('bookings.fromBookings').replace('%count%', '14')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
