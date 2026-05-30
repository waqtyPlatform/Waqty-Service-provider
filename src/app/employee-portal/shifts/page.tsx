'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { employeeApi, type ShiftDate } from '@/lib/api';

export default function EmployeeShiftsPage() {
    // Employee endpoints are called directly — the API client uses the employee
    // token on /employee-portal routes (X11), so no token swap is needed.
    const [shifts, setShifts] = useState<ShiftDate[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        (async () => {
            try {
                const res = await employeeApi.getShifts();
                if (res.success && res.data) {
                    setShifts(res.data);
                }
            } catch {
                // Keep empty
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const monthStr = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const prevMonth = () =>
        setCurrentMonth(d => {
            const n = new Date(d);
            n.setMonth(n.getMonth() - 1);
            return n;
        });
    const nextMonth = () =>
        setCurrentMonth(d => {
            const n = new Date(d);
            n.setMonth(n.getMonth() + 1);
            return n;
        });

    // Filter shifts for current month
    const monthShifts = shifts
        .filter(s => {
            const d = new Date(s.date);
            return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
        })
        .sort((a, b) => a.date.localeCompare(b.date));

    // Build calendar grid
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().toISOString().split('T')[0];

    const shiftsByDate = new Map<string, ShiftDate>();
    for (const s of monthShifts) {
        shiftsByDate.set(s.date, s);
    }

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
                <h1
                    style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 'var(--font-bold)',
                        marginBottom: 'var(--space-1)',
                    }}
                >
                    My Shifts
                </h1>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                    View your assigned shifts and schedule
                </p>
            </div>

            {/* Month Navigation */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-3) var(--space-5)',
                }}
            >
                <button
                    onClick={prevMonth}
                    style={{
                        background: 'none',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-2)',
                        cursor: 'pointer',
                        display: 'flex',
                        color: 'var(--text-primary)',
                    }}
                >
                    <ChevronLeft size={18} />
                </button>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>{monthStr}</h2>
                <button
                    onClick={nextMonth}
                    style={{
                        background: 'none',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-2)',
                        cursor: 'pointer',
                        display: 'flex',
                        color: 'var(--text-primary)',
                    }}
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {loading ? (
                <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    Loading shifts...
                </div>
            ) : (
                <>
                    {/* Calendar Grid */}
                    <div
                        style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Day headers */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                borderBottom: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)',
                            }}
                        >
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div
                                    key={d}
                                    style={{
                                        padding: 'var(--space-2)',
                                        textAlign: 'center',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 'var(--font-semibold)',
                                        color: 'var(--text-tertiary)',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar cells */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                            {calendarDays.map((day, i) => {
                                if (day === null)
                                    return (
                                        <div
                                            key={`empty-${i}`}
                                            style={{
                                                minHeight: 80,
                                                borderBottom: '1px solid var(--border-color)',
                                                borderRight: '1px solid var(--border-color)',
                                            }}
                                        />
                                    );
                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const shift = shiftsByDate.get(dateStr);
                                const isToday = dateStr === today;

                                return (
                                    <div
                                        key={day}
                                        style={{
                                            minHeight: 80,
                                            padding: 'var(--space-2)',
                                            borderBottom: '1px solid var(--border-color)',
                                            borderRight: '1px solid var(--border-color)',
                                            background: isToday ? 'var(--color-primary-50)' : 'transparent',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 'var(--text-xs)',
                                                fontWeight: isToday ? 'var(--font-bold)' : 'var(--font-normal)',
                                                color: isToday ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                                                marginBottom: 'var(--space-1)',
                                            }}
                                        >
                                            {day}
                                        </div>
                                        {shift && (
                                            <div
                                                style={{
                                                    fontSize: 10,
                                                    padding: '2px 4px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    background: 'var(--color-primary-100)',
                                                    color: 'var(--color-primary-700)',
                                                    fontWeight: 'var(--font-medium)',
                                                }}
                                            >
                                                <Clock size={10} style={{ display: 'inline', marginRight: 2 }} />
                                                Shift
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Shift List */}
                    {monthShifts.length > 0 && (
                        <div
                            style={{
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-xl)',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    padding: 'var(--space-4) var(--space-5)',
                                    borderBottom: '1px solid var(--border-color)',
                                    fontWeight: 'var(--font-semibold)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                }}
                            >
                                <Calendar size={16} style={{ color: 'var(--color-primary-600)' }} />
                                Shifts This Month ({monthShifts.length})
                            </div>
                            {monthShifts.map(shift => {
                                const d = new Date(shift.date + 'T00:00:00');
                                return (
                                    <div
                                        key={shift.uuid}
                                        style={{
                                            padding: 'var(--space-3) var(--space-5)',
                                            borderBottom: '1px solid var(--border-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <div
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 'var(--radius-lg)',
                                                    background:
                                                        shift.date === today
                                                            ? 'var(--color-primary-500)'
                                                            : 'var(--bg-secondary)',
                                                    color: shift.date === today ? 'white' : 'var(--text-primary)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 11,
                                                    lineHeight: 1.2,
                                                    fontWeight: 'var(--font-bold)',
                                                }}
                                            >
                                                <span style={{ fontSize: 9, textTransform: 'uppercase' }}>
                                                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                                {d.getDate()}
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: 'var(--text-sm)',
                                                        fontWeight: 'var(--font-medium)',
                                                    }}
                                                >
                                                    {d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-tertiary)',
                                                    }}
                                                >
                                                    Shift #{shift.uuid.slice(0, 8)}
                                                </div>
                                            </div>
                                        </div>
                                        {shift.date === today && (
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: 'var(--font-semibold)',
                                                    padding: '2px 8px',
                                                    borderRadius: 'var(--radius-full)',
                                                    background: 'var(--color-primary-100)',
                                                    color: 'var(--color-primary-700)',
                                                }}
                                            >
                                                Today
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {monthShifts.length === 0 && (
                        <div
                            style={{
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-xl)',
                                padding: 'var(--space-8)',
                                textAlign: 'center',
                            }}
                        >
                            <Calendar
                                size={32}
                                style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}
                            />
                            <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                                No shifts assigned for {monthStr}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
