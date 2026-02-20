'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    CalendarDays,
    List,
    DoorOpen,
    Plus,
    Printer,
    ChevronLeft,
    ChevronRight,
    Filter,
} from 'lucide-react';
import styles from '../bookings.module.css';
import BookingsTabs from '../BookingsTabs';

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

const roomBookings: Record<string, Array<{ start: number; span: number; title: string; client: string; status: string }>> = {
    R1: [
        { start: 0, span: 3, title: 'Hair Coloring', client: 'Fatima', status: 'confirmed' },
        { start: 6, span: 2, title: 'HydraFacial', client: 'Rania', status: 'arrived' },
        { start: 12, span: 4, title: 'Bridal Package', client: 'Aisha', status: 'confirmed' },
    ],
    R2: [
        { start: 1, span: 2, title: 'Classic Facial', client: 'Maryam', status: 'completed' },
        { start: 4, span: 2, title: 'Swedish Massage', client: 'Noura', status: 'confirmed' },
        { start: 10, span: 2, title: 'Keratin Treatment', client: 'Dana', status: 'workDone' },
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

const statusColors: Record<string, { bg: string; border: string }> = {
    confirmed: { bg: 'var(--color-info-light)', border: 'var(--color-info)' },
    completed: { bg: 'var(--color-success-light)', border: 'var(--color-success)' },
    arrived: { bg: '#EDE9FE', border: '#7C3AED' },
    workDone: { bg: 'var(--color-warning-light)', border: 'var(--color-warning)' },
};

export default function RoomCalendarPage() {
    return (
        <div className={styles.bookingsPage}>
            {/* Tabs */}
            <BookingsTabs />

            {/* Calendar Header */}
            <div className={styles.calendarHeader}>
                <div className={styles.calendarNav}>
                    <button className={styles.navBtn}><ChevronLeft size={16} /></button>
                    <h2 className={styles.calendarDate}>Tuesday, February 17, 2026</h2>
                    <button className={styles.navBtn}><ChevronRight size={16} /></button>
                    <button className={styles.todayBtn}>Today</button>
                </div>
                <div className={styles.calendarActions}>
                    <div className={styles.viewToggle}>
                        <button className={`${styles.viewBtn} ${styles.viewBtnActive}`}>Day</button>
                        <button className={styles.viewBtn}>Week</button>
                    </div>
                    <button className={styles.filterBtn}><Filter size={14} /> Filters</button>
                </div>
            </div>

            {/* Room Calendar Grid */}
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                {/* Room Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '80px repeat(4, 1fr)',
                    borderBottom: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                }}>
                    <div style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                        Time
                    </div>
                    {rooms.map((room) => (
                        <div key={room.id} style={{
                            padding: 'var(--space-3) var(--space-4)',
                            borderLeft: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                        }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: room.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                                {room.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Grid Body */}
                <div style={{ position: 'relative' }}>
                    {timeSlots.map((time, i) => (
                        <div key={time} style={{
                            display: 'grid',
                            gridTemplateColumns: '80px repeat(4, 1fr)',
                            minHeight: 48,
                            borderBottom: i < timeSlots.length - 1 ? '1px solid var(--border-color)' : 'none',
                        }}>
                            {/* Time label */}
                            <div style={{
                                padding: 'var(--space-2) var(--space-3)',
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-tertiary)',
                                fontWeight: 'var(--font-medium)',
                                borderRight: '1px solid var(--border-color)',
                            }}>
                                {time}
                            </div>
                            {/* Room cells */}
                            {rooms.map((room) => {
                                const booking = roomBookings[room.id]?.find(b => b.start === i);
                                return (
                                    <div key={room.id} style={{
                                        position: 'relative',
                                        borderLeft: '1px solid var(--border-color)',
                                        padding: '2px',
                                    }}>
                                        {booking && (() => {
                                            const sc = statusColors[booking.status] || statusColors.confirmed;
                                            return (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 2,
                                                    left: 2,
                                                    right: 2,
                                                    height: `calc(${booking.span * 48}px - 4px)`,
                                                    background: sc.bg,
                                                    borderLeft: `3px solid ${sc.border}`,
                                                    borderRadius: 'var(--radius-md)',
                                                    padding: 'var(--space-1) var(--space-2)',
                                                    fontSize: 'var(--text-xs)',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    transition: 'all var(--transition-fast)',
                                                    zIndex: 1,
                                                }}>
                                                    <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{booking.client}</div>
                                                    <div style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{booking.title}</div>
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
