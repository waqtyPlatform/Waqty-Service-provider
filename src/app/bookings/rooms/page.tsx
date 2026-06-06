'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import styles from '../bookings.module.css';
import BookingsTabs from '../BookingsTabs';
import { useTranslation } from '@/hooks/useTranslation';
import type { DisplayStatus } from '@/lib/displayStatus';

const rooms = [
    { id: 'R1', name: 'Room 1 – VIP', color: '#8B5CF6' },
    { id: 'R2', name: 'Room 2 – Standard', color: '#3B82F6' },
    { id: 'R3', name: 'Room 3 – Treatment', color: '#10B981' },
    { id: 'R4', name: 'Room 4 – Laser', color: '#EC4899' },
];

const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const h = Math.floor(i / 2) + 9;
    const m = i % 2 === 0 ? '00' : '30';
    return `${h.toString().padStart(2, '0')}:${m}`;
});

// Demo room board. `status` uses the shared DisplayStatus vocabulary (G2); the
// legacy ad-hoc 'workDone' is gone (it collapses to canonical-derived 'completed').
const roomBookings: Record<
    string,
    Array<{ start: number; span: number; title: string; client: string; status: DisplayStatus }>
> = {
    R1: [
        { start: 0, span: 3, title: 'Hair Coloring', client: 'Fatima', status: 'confirmed' },
        { start: 6, span: 2, title: 'HydraFacial', client: 'Rania', status: 'arrived' },
        { start: 12, span: 4, title: 'Bridal Package', client: 'Aisha', status: 'confirmed' },
    ],
    R2: [
        { start: 1, span: 2, title: 'Classic Facial', client: 'Maryam', status: 'completed' },
        { start: 4, span: 2, title: 'Swedish Massage', client: 'Noura', status: 'confirmed' },
        { start: 10, span: 2, title: 'Keratin Treatment', client: 'Dana', status: 'completed' },
    ],
    R3: [
        { start: 2, span: 2, title: 'Deep Tissue Massage', client: 'Huda', status: 'confirmed' },
        { start: 8, span: 3, title: 'Body Wrap', client: 'Sama', status: 'arrived' },
    ],
    R4: [
        { start: 0, span: 1, title: 'Laser – Upper Lip', client: 'Joud', status: 'completed' },
        { start: 2, span: 1, title: 'Laser – Underarm', client: 'Lina', status: 'confirmed' },
        { start: 5, span: 1, title: 'Laser – Full Leg', client: 'Yara', status: 'confirmed' },
        { start: 8, span: 1, title: 'Laser – Bikini', client: 'Noura', status: 'arrived' },
    ],
};

const statusColors: Record<DisplayStatus, { bg: string; border: string }> = {
    draft: { bg: '#F3F4F6', border: '#9CA3AF' },
    confirmed: { bg: 'var(--color-info-light)', border: 'var(--color-info)' },
    arrived: { bg: '#EDE9FE', border: '#7C3AED' },
    inService: { bg: 'var(--color-warning-light)', border: 'var(--color-warning)' },
    completed: { bg: 'var(--color-success-light)', border: 'var(--color-success)' },
    cancelled: { bg: '#FEE2E2', border: '#EF4444' },
    no_show: { bg: '#FEE2E2', border: '#EF4444' },
};

export default function RoomCalendarPage() {
    const { t, lang } = useTranslation();
    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [onlyBusy, setOnlyBusy] = useState(false);

    const shiftDay = (delta: number) =>
        setCurrentDate(d => {
            const n = new Date(d);
            n.setDate(n.getDate() + delta);
            return n;
        });
    const dateLabel = currentDate.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const visibleRooms = onlyBusy ? rooms.filter(r => (roomBookings[r.id]?.length ?? 0) > 0) : rooms;
    const gridCols = `80px repeat(${visibleRooms.length}, 1fr)`;

    return (
        <div className={styles.bookingsPage} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Tabs */}
            <BookingsTabs />

            {/* Calendar Header */}
            <div className={styles.calendarHeader}>
                <div className={styles.calendarNav}>
                    <button
                        className={styles.navBtn}
                        onClick={() => shiftDay(lang === 'ar' ? 1 : -1)}
                        aria-label={t('bk.tbPrev')}
                    >
                        <ChevronLeft size={16} style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }} />
                    </button>
                    <h2 className={styles.calendarDate}>{dateLabel}</h2>
                    <button
                        className={styles.navBtn}
                        onClick={() => shiftDay(lang === 'ar' ? -1 : 1)}
                        aria-label={t('bk.tbNext')}
                    >
                        <ChevronRight size={16} style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }} />
                    </button>
                    <button className={styles.todayBtn} onClick={() => setCurrentDate(new Date())}>
                        {t('bk.tbToday')}
                    </button>
                </div>
                <div className={styles.calendarActions}>
                    <button
                        className={styles.filterBtn}
                        onClick={() => setOnlyBusy(v => !v)}
                        aria-pressed={onlyBusy}
                        style={
                            onlyBusy
                                ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }
                                : undefined
                        }
                    >
                        <Filter size={14} /> {t('bk.tbFilters')}
                        {onlyBusy ? ' (1)' : ''}
                    </button>
                </div>
            </div>

            {/* Room Calendar Grid */}
            <div
                style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                }}
            >
                {/* Room Header */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: gridCols,
                        borderBottom: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                    }}
                >
                    <div
                        style={{
                            padding: 'var(--space-3) var(--space-4)',
                            fontWeight: 'var(--font-semibold)',
                            fontSize: 'var(--text-xs)',
                            textTransform: 'uppercase',
                            color: 'var(--text-tertiary)',
                        }}
                    >
                        {t('bk.tbTime')}
                    </div>
                    {visibleRooms.map(room => (
                        <div
                            key={room.id}
                            style={{
                                padding: 'var(--space-3) var(--space-4)',
                                borderInlineStart: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                            }}
                        >
                            <span
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    background: room.color,
                                    flexShrink: 0,
                                }}
                            />
                            <span
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-semibold)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                {room.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Grid Body */}
                <div style={{ position: 'relative' }}>
                    {timeSlots.map((time, i) => (
                        <div
                            key={time}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: gridCols,
                                minHeight: 48,
                                borderBottom: i < timeSlots.length - 1 ? '1px solid var(--border-color)' : 'none',
                            }}
                        >
                            {/* Time label */}
                            <div
                                style={{
                                    padding: 'var(--space-2) var(--space-3)',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-tertiary)',
                                    fontWeight: 'var(--font-medium)',
                                    borderInlineEnd: '1px solid var(--border-color)',
                                }}
                            >
                                {time}
                            </div>
                            {/* Room cells */}
                            {rooms.map(room => {
                                const booking = roomBookings[room.id]?.find(b => b.start === i);
                                return (
                                    <div
                                        key={room.id}
                                        style={{
                                            position: 'relative',
                                            borderInlineStart: '1px solid var(--border-color)',
                                            padding: '2px',
                                        }}
                                    >
                                        {booking &&
                                            (() => {
                                                const sc = statusColors[booking.status] || statusColors.confirmed;
                                                return (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 2,
                                                            left: 2,
                                                            right: 2,
                                                            height: `calc(${booking.span * 48}px - 4px)`,
                                                            background: sc.bg,
                                                            borderInlineStart: `3px solid ${sc.border}`,
                                                            borderRadius: 'var(--radius-md)',
                                                            padding: 'var(--space-1) var(--space-2)',
                                                            fontSize: 'var(--text-xs)',
                                                            overflow: 'hidden',
                                                            cursor: 'pointer',
                                                            transition: 'all var(--transition-fast)',
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontWeight: 'var(--font-semibold)',
                                                                color: 'var(--text-primary)',
                                                            }}
                                                        >
                                                            {booking.client}
                                                        </div>
                                                        <div
                                                            style={{
                                                                color: 'var(--text-secondary)',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}
                                                        >
                                                            {booking.title}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
