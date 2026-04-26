'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Briefcase } from 'lucide-react';
import { employeeApi, type Booking, type AttendanceRecord } from '@/lib/api';
import { safeLocalStorageGet } from '@/lib/storage';

function useEmployeeToken() {
    // Swap token temporarily for employee API calls
    return {
        withToken: async <T,>(fn: () => Promise<T>): Promise<T> => {
            const empToken = localStorage.getItem('hagzy_employee_token');
            const origToken = localStorage.getItem('hagzy_token');
            if (empToken) localStorage.setItem('hagzy_token', empToken);
            try {
                return await fn();
            } finally {
                if (origToken) localStorage.setItem('hagzy_token', origToken);
                else localStorage.removeItem('hagzy_token');
            }
        },
    };
}

export default function EmployeeDashboardPage() {
    const { withToken } = useEmployeeToken();
    const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkingIn, setCheckingIn] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const empUser = safeLocalStorageGet<{ name?: string; uuid?: string }>('hagzy_employee_user', {});

    useEffect(() => {
        (async () => {
            try {
                const [bookingsRes, attendanceRes] = await Promise.allSettled([
                    withToken(() => employeeApi.getBookings({ today: true })),
                    withToken(() => employeeApi.getAttendance({ date_from: today, date_to: today })),
                ]);

                if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success && bookingsRes.value.data) {
                    setTodayBookings(bookingsRes.value.data);
                }
                if (
                    attendanceRes.status === 'fulfilled' &&
                    attendanceRes.value.success &&
                    attendanceRes.value.data?.length
                ) {
                    setAttendance(attendanceRes.value.data[0]);
                }
            } catch {
                // Keep empty state
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCheckIn = async () => {
        setCheckingIn(true);
        try {
            const res = await withToken(() => employeeApi.checkIn({}));
            if (res.success && res.data) {
                setAttendance(res.data);
            }
        } catch {
            // ignore
        } finally {
            setCheckingIn(false);
        }
    };

    const handleCheckOut = async () => {
        setCheckingIn(true);
        try {
            const res = await withToken(() => employeeApi.checkOut({}));
            if (res.success && res.data) {
                setAttendance(res.data);
            }
        } catch {
            // ignore
        } finally {
            setCheckingIn(false);
        }
    };

    const isCheckedIn = attendance?.check_in && !attendance?.check_out;
    const isCheckedOut = attendance?.check_in && attendance?.check_out;

    const confirmed = todayBookings.filter(b => b.status === 'confirmed').length;
    const completed = todayBookings.filter(b => b.status === 'completed').length;
    const pending = todayBookings.filter(b => b.status === 'pending').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Welcome */}
            <div>
                <h1
                    style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 'var(--font-bold)',
                        marginBottom: 'var(--space-1)',
                    }}
                >
                    Welcome back, {empUser.name?.split(' ')[0] || 'Employee'}
                </h1>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </p>
            </div>

            {/* Quick Actions */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--space-4)',
                }}
            >
                {/* Attendance Card */}
                <div
                    style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-5)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        <Clock size={18} style={{ color: 'var(--color-primary-600)' }} />
                        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>Attendance</h3>
                    </div>

                    {loading ? (
                        <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>Loading...</div>
                    ) : isCheckedOut ? (
                        <div style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
                            <CheckCircle
                                size={32}
                                style={{ color: 'var(--color-success)', marginBottom: 'var(--space-2)' }}
                            />
                            <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-success)' }}>
                                Shift Complete
                            </div>
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-tertiary)',
                                    marginTop: 'var(--space-1)',
                                }}
                            >
                                {attendance?.check_in?.slice(0, 5)} - {attendance?.check_out?.slice(0, 5)}
                            </div>
                        </div>
                    ) : isCheckedIn ? (
                        <div style={{ textAlign: 'center' }}>
                            <div
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-secondary)',
                                    marginBottom: 'var(--space-3)',
                                }}
                            >
                                Checked in at <strong>{attendance?.check_in?.slice(0, 5)}</strong>
                            </div>
                            <button
                                onClick={handleCheckOut}
                                disabled={checkingIn}
                                style={{
                                    width: '100%',
                                    padding: 'var(--space-3)',
                                    background: 'var(--color-error)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-lg)',
                                    fontWeight: 'var(--font-semibold)',
                                    cursor: 'pointer',
                                    opacity: checkingIn ? 0.7 : 1,
                                }}
                            >
                                {checkingIn ? 'Processing...' : 'Check Out'}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleCheckIn}
                            disabled={checkingIn}
                            style={{
                                width: '100%',
                                padding: 'var(--space-4)',
                                background: 'var(--color-primary-500)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-lg)',
                                fontWeight: 'var(--font-semibold)',
                                fontSize: 'var(--text-base)',
                                cursor: 'pointer',
                                opacity: checkingIn ? 0.7 : 1,
                            }}
                        >
                            {checkingIn ? 'Processing...' : 'Check In'}
                        </button>
                    )}
                </div>

                {/* Today's Bookings Summary */}
                <div
                    style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-5)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        <Briefcase size={18} style={{ color: 'var(--color-primary-600)' }} />
                        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>
                            Today&apos;s Bookings
                        </h3>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: 'var(--space-3)',
                            textAlign: 'center',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 'var(--font-bold)',
                                    color: 'var(--color-primary-600)',
                                }}
                            >
                                {todayBookings.length}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Total</div>
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 'var(--font-bold)',
                                    color: 'var(--color-success)',
                                }}
                            >
                                {completed}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Done</div>
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 'var(--font-bold)',
                                    color: 'var(--color-warning)',
                                }}
                            >
                                {confirmed + pending}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Upcoming</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bookings List */}
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                    }}
                >
                    <Calendar size={18} style={{ color: 'var(--color-primary-600)' }} />
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>
                        Upcoming Appointments
                    </h3>
                </div>

                {loading ? (
                    <div
                        style={{
                            padding: 'var(--space-8)',
                            textAlign: 'center',
                            color: 'var(--text-tertiary)',
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        Loading bookings...
                    </div>
                ) : todayBookings.length === 0 ? (
                    <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                        <Calendar size={32} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }} />
                        <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                            No appointments today
                        </div>
                    </div>
                ) : (
                    <div>
                        {todayBookings
                            .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))
                            .map(booking => {
                                const statusColors: Record<string, string> = {
                                    confirmed: 'var(--color-primary-600)',
                                    completed: 'var(--color-success)',
                                    cancelled: 'var(--color-error)',
                                    pending: 'var(--color-warning)',
                                    no_show: 'var(--text-tertiary)',
                                };
                                return (
                                    <div
                                        key={booking.uuid}
                                        style={{
                                            padding: 'var(--space-4) var(--space-5)',
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
                                                    textAlign: 'center',
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 'var(--font-bold)',
                                                    color: 'var(--color-primary-600)',
                                                }}
                                            >
                                                {booking.start_time?.slice(0, 5)}
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: 'var(--font-medium)',
                                                        fontSize: 'var(--text-sm)',
                                                    }}
                                                >
                                                    {booking.user?.name || 'Walk-in'}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-tertiary)',
                                                    }}
                                                >
                                                    {booking.service?.name || 'Service'}
                                                    {booking.end_time &&
                                                        ` \u00B7 ${booking.start_time?.slice(0, 5)}-${booking.end_time?.slice(0, 5)}`}
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            style={{
                                                fontSize: 'var(--text-xs)',
                                                fontWeight: 'var(--font-semibold)',
                                                padding: '2px 8px',
                                                borderRadius: 'var(--radius-full)',
                                                color: statusColors[booking.status] || 'var(--text-tertiary)',
                                                background: 'var(--bg-secondary)',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {booking.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}
