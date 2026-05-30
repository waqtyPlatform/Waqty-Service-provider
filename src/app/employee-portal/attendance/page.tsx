'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { employeeApi, type AttendanceRecord } from '@/lib/api';

export default function EmployeeAttendancePage() {
    // Employee endpoints are called directly — the API client uses the employee
    // token on /employee-portal routes (X11), so no token swap is needed.
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthStr = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    useEffect(() => {
        setLoading(true);
        const dateFrom = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month + 1, 0).getDate();
        const dateTo = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        (async () => {
            try {
                const res = await employeeApi.getAttendance({ date_from: dateFrom, date_to: dateTo });
                if (res.success && res.data) {
                    setRecords(res.data);
                }
            } catch {
                // Keep empty
            } finally {
                setLoading(false);
            }
        })();
    }, [year, month]);

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

    // Stats
    const present = records.filter(r => r.check_in && r.check_out).length;
    const checkedInOnly = records.filter(r => r.check_in && !r.check_out).length;
    const totalHours = records.reduce((sum, r) => sum + (r.working_minutes || 0), 0) / 60;

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
                    Attendance History
                </h1>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                    Track your check-in and check-out times
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

            {/* Stats */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: 'var(--space-4)',
                }}
            >
                <div
                    style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                    }}
                >
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--color-success-light)',
                            color: 'var(--color-success)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>{present}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Days Present</div>
                    </div>
                </div>
                <div
                    style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                    }}
                >
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--color-warning-light)',
                            color: 'var(--color-warning)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>
                            {checkedInOnly}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>In Progress</div>
                    </div>
                </div>
                <div
                    style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                    }}
                >
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--color-primary-50)',
                            color: 'var(--color-primary-600)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Clock size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>
                            {totalHours.toFixed(1)}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Total Hours</div>
                    </div>
                </div>
            </div>

            {/* Records Table */}
            <div
                style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                }}
            >
                {loading ? (
                    <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                        Loading...
                    </div>
                ) : records.length === 0 ? (
                    <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                        <Clock size={32} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }} />
                        <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                            No attendance records for {monthStr}
                        </div>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-secondary)' }}>
                                    <th
                                        style={{
                                            padding: 'var(--space-3) var(--space-4)',
                                            textAlign: 'left',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-tertiary)',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Date
                                    </th>
                                    <th
                                        style={{
                                            padding: 'var(--space-3) var(--space-4)',
                                            textAlign: 'center',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-tertiary)',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Check In
                                    </th>
                                    <th
                                        style={{
                                            padding: 'var(--space-3) var(--space-4)',
                                            textAlign: 'center',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-tertiary)',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Check Out
                                    </th>
                                    <th
                                        style={{
                                            padding: 'var(--space-3) var(--space-4)',
                                            textAlign: 'center',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-tertiary)',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Hours
                                    </th>
                                    <th
                                        style={{
                                            padding: 'var(--space-3) var(--space-4)',
                                            textAlign: 'center',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-tertiary)',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {records
                                    .sort((a, b) => (b.check_in || '').localeCompare(a.check_in || ''))
                                    .map(record => {
                                        const hours = record.working_minutes
                                            ? (record.working_minutes / 60).toFixed(1)
                                            : '—';
                                        const isComplete = record.check_in && record.check_out;
                                        const dateStr = record.check_in
                                            ? new Date(record.check_in).toLocaleDateString('en-US', {
                                                  weekday: 'short',
                                                  month: 'short',
                                                  day: 'numeric',
                                              })
                                            : '—';

                                        return (
                                            <tr
                                                key={record.uuid}
                                                style={{ borderBottom: '1px solid var(--border-color)' }}
                                            >
                                                <td
                                                    style={{
                                                        padding: 'var(--space-3) var(--space-4)',
                                                        fontSize: 'var(--text-sm)',
                                                        fontWeight: 'var(--font-medium)',
                                                    }}
                                                >
                                                    {dateStr}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: 'var(--space-3) var(--space-4)',
                                                        textAlign: 'center',
                                                        fontSize: 'var(--text-sm)',
                                                        color: 'var(--color-success)',
                                                    }}
                                                >
                                                    {record.check_in?.slice(11, 16) || '—'}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: 'var(--space-3) var(--space-4)',
                                                        textAlign: 'center',
                                                        fontSize: 'var(--text-sm)',
                                                        color: record.check_out
                                                            ? 'var(--color-error)'
                                                            : 'var(--text-tertiary)',
                                                    }}
                                                >
                                                    {record.check_out?.slice(11, 16) || '—'}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: 'var(--space-3) var(--space-4)',
                                                        textAlign: 'center',
                                                        fontSize: 'var(--text-sm)',
                                                        fontWeight: 'var(--font-semibold)',
                                                    }}
                                                >
                                                    {hours}h
                                                </td>
                                                <td
                                                    style={{
                                                        padding: 'var(--space-3) var(--space-4)',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 4,
                                                            fontSize: 'var(--text-xs)',
                                                            fontWeight: 'var(--font-semibold)',
                                                            padding: '2px 8px',
                                                            borderRadius: 'var(--radius-full)',
                                                            background: isComplete
                                                                ? 'var(--color-success-light)'
                                                                : 'var(--color-warning-light)',
                                                            color: isComplete
                                                                ? 'var(--color-success)'
                                                                : 'var(--color-warning)',
                                                        }}
                                                    >
                                                        {isComplete ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                        {isComplete ? 'Complete' : 'In Progress'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
