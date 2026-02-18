'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Filter,
    CalendarDays,
    List,
    Clock,
    Building2,
    DoorOpen,
    Printer,
} from 'lucide-react';
import styles from './bookings.module.css';

const employees = [
    { name: 'Sara A.', initials: 'SA', color: '#8B5CF6', status: 'Available' },
    { name: 'Nora A.', initials: 'NA', color: '#EC4899', status: 'In Session' },
    { name: 'Layla H.', initials: 'LH', color: '#3B82F6', status: 'Available' },
    { name: 'Reem M.', initials: 'RM', color: '#10B981', status: 'Break' },
    { name: 'Hana Y.', initials: 'HY', color: '#F59E0B', status: 'Available' },
];

const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
];

interface BookingBlock {
    empIndex: number;
    startSlot: number;
    span: number;
    client: string;
    service: string;
    status: string;
}

const bookingBlocks: BookingBlock[] = [
    { empIndex: 0, startSlot: 0, span: 3, client: 'Fatima R.', service: 'Hair Coloring', status: 'confirmed' },
    { empIndex: 0, startSlot: 6, span: 2, client: 'Aisha M.', service: 'Haircut', status: 'completed' },
    { empIndex: 0, startSlot: 10, span: 2, client: 'Maryam I.', service: 'Olaplex', status: 'arrived' },
    { empIndex: 1, startSlot: 1, span: 4, client: 'Huda S.', service: 'Keratin', status: 'arrived' },
    { empIndex: 1, startSlot: 8, span: 2, client: 'Noura A.', service: 'Facial', status: 'confirmed' },
    { empIndex: 1, startSlot: 14, span: 2, client: 'Rania K.', service: 'HydraFacial', status: 'unconfirmed' },
    { empIndex: 2, startSlot: 0, span: 2, client: 'Dana F.', service: 'Manicure', status: 'completed' },
    { empIndex: 2, startSlot: 4, span: 6, client: 'Lina T.', service: 'Keratin + Color', status: 'confirmed' },
    { empIndex: 2, startSlot: 12, span: 2, client: 'Sara Q.', service: 'Facial', status: 'workDone' },
    { empIndex: 3, startSlot: 2, span: 4, client: 'Yara B.', service: 'Massage', status: 'confirmed' },
    { empIndex: 3, startSlot: 8, span: 2, client: 'Nada H.', service: 'Pedicure', status: 'confirmed' },
    { empIndex: 4, startSlot: 0, span: 2, client: 'Rana Z.', service: 'Laser', status: 'completed' },
    { empIndex: 4, startSlot: 4, span: 2, client: 'Joud W.', service: 'Gel Nails', status: 'cancelled' },
    { empIndex: 4, startSlot: 10, span: 4, client: 'Sama L.', service: 'Full Package', status: 'confirmed' },
];

const statusBlockClass: Record<string, string> = {
    confirmed: styles.blockConfirmed,
    completed: styles.blockCompleted,
    arrived: styles.blockArrived,
    unconfirmed: styles.blockUnconfirmed,
    cancelled: styles.blockCancelled,
    workDone: styles.blockWorkDone,
};

export default function BookingsCalendarPage() {
    const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day');

    return (
        <div className={styles.bookingsPage}>
            {/* Tabs */}
            <div className={styles.tabs}>
                <Link href="/bookings" className={`${styles.tab} ${styles.tabActive}`}>
                    <CalendarDays size={16} /> Calendar
                </Link>
                <Link href="/bookings/list" className={styles.tab}>
                    <List size={16} /> Booking List
                </Link>
                <Link href="/bookings/rooms" className={styles.tab}>
                    <DoorOpen size={16} /> Room Calendar
                </Link>
                <Link href="/bookings/new" className={styles.tab}>
                    <Plus size={16} /> New Booking
                </Link>
                <Link href="/bookings/print" className={styles.tab}>
                    <Printer size={16} /> Employee Print
                </Link>
            </div>

            {/* Calendar Header */}
            <div className={styles.calendarHeader}>
                <div className={styles.calendarNav}>
                    <button className={styles.navBtn}><ChevronLeft size={18} /></button>
                    <span className={styles.calendarTitle}>Monday, Feb 17, 2026</span>
                    <button className={styles.navBtn}><ChevronRight size={18} /></button>
                    <button className={styles.todayBtn}>Today</button>
                </div>

                <div className={styles.viewToggle}>
                    {(['day', 'week', 'month'] as const).map((v) => (
                        <button
                            key={v}
                            className={`${styles.viewBtn} ${calendarView === v ? styles.viewBtnActive : ''}`}
                            onClick={() => setCalendarView(v)}
                        >
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                    ))}
                </div>

                <div className={styles.calendarActions}>
                    <button className={styles.filterBtn}>
                        <Filter size={16} /> Filters
                    </button>
                    <Link href="/bookings/new" className={styles.btnPrimary}>
                        <Plus size={16} /> New Booking
                    </Link>
                </div>
            </div>

            {/* Calendar Grid + Side Panel */}
            <div className={styles.calendarWrapper}>
                <div className={styles.calendarGrid} style={{ '--emp-count': employees.length } as React.CSSProperties}>
                    {/* Header row */}
                    <div className={styles.calendarGridHeader}>
                        <div className={styles.timeColHeader}>
                            <Clock size={14} style={{ margin: '0 auto', color: 'var(--text-tertiary)' }} />
                        </div>
                        {employees.map((emp) => (
                            <div key={emp.name} className={styles.empColHeader}>
                                <div
                                    className={styles.empAvatar}
                                    style={{ background: emp.color }}
                                >
                                    {emp.initials}
                                </div>
                                <div className={styles.empName}>{emp.name}</div>
                                <div className={styles.empStatus}>{emp.status}</div>
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
                                        (b) => b.empIndex === empIndex && b.startSlot === slotIndex
                                    );

                                    return (
                                        <div key={empIndex} className={styles.timeCell}>
                                            {block && (
                                                <div
                                                    className={`${styles.bookingBlock} ${statusBlockClass[block.status] || ''}`}
                                                    style={{ height: `${block.span * 64 - 4}px` }}
                                                >
                                                    <div className={styles.bookingBlockName}>{block.client}</div>
                                                    <div className={styles.bookingBlockService}>{block.service}</div>
                                                    <div className={styles.bookingBlockTime}>
                                                        {timeSlots[block.startSlot]} – {timeSlots[block.startSlot + block.span] || '21:00'}
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

                {/* Side Panel */}
                <div className={styles.sidePanel}>
                    {/* Next Appointment */}
                    <div className={styles.sidePanelCard}>
                        <div className={styles.sidePanelTitle}>
                            <Clock size={16} /> Next Appointment
                        </div>
                        <div className={styles.nextApptCard}>
                            <div className={styles.nextApptName}>Maryam Ibrahim</div>
                            <div className={styles.nextApptService}>Olaplex Treatment</div>
                            <div className={styles.nextApptTime}>
                                <Clock size={12} /> 14:00 – 15:00
                            </div>
                            <div className={styles.countdown}>in 23 min</div>
                        </div>
                    </div>

                    {/* Today's Summary */}
                    <div className={styles.sidePanelCard}>
                        <div className={styles.sidePanelTitle}>
                            <CalendarDays size={16} /> Today&apos;s Summary
                        </div>
                        <div className={styles.summaryGrid}>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue}>14</div>
                                <div className={styles.summaryLabel}>Total</div>
                            </div>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue} style={{ color: 'var(--status-confirmed)' }}>8</div>
                                <div className={styles.summaryLabel}>Confirmed</div>
                            </div>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue} style={{ color: 'var(--status-completed)' }}>3</div>
                                <div className={styles.summaryLabel}>Completed</div>
                            </div>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue} style={{ color: 'var(--status-cancelled)' }}>1</div>
                                <div className={styles.summaryLabel}>Cancelled</div>
                            </div>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className={styles.sidePanelCard}>
                        <div className={styles.sidePanelTitle}>
                            <Building2 size={16} /> Revenue Today
                        </div>
                        <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>
                                4,280 EGP
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
                                from 14 bookings
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
