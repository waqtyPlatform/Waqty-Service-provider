'use client';

import { egpLabel } from '@/lib/money';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Phone,
    Mail,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Users,
    X,
    Clock,
    Building2,
    CheckCircle,
} from 'lucide-react';
import { providerApi, extractStr, type ProviderClient, type Booking } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';
import styles from '../customers.module.css';
import { useTranslation } from '@/hooks/useTranslation';

export default function ClientsPage() {
    const router = useRouter();
    const { lang } = useTranslation();

    const [clients, setClients] = useState<ProviderClient[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [branchFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 15;
    // Capture "now" once via lazy initializer to avoid an impure call during render.
    const [now] = useState(() => Date.now());

    // Client booking history slide-over
    const [selectedClient, setSelectedClient] = useState<ProviderClient | null>(null);
    const [clientBookings, setClientBookings] = useState<Booking[] | null>(null);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    // Load clients
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        (async () => {
            try {
                const res = await providerApi.getClients({
                    search: search || undefined,
                    branch_uuid: branchFilter || undefined,
                    per_page: perPage,
                    page: currentPage,
                });
                if (cancelled) return;
                if (res.success) setClients(res.data ?? []);
                else setError('Failed to load clients');
            } catch {
                if (!cancelled) setError('Failed to load clients');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [search, branchFilter, currentPage]);

    // Load booking history for selected client
    useEffect(() => {
        if (!selectedClient) return;
        let cancelled = false;
        setBookingsLoading(true);
        setClientBookings(null);
        (async () => {
            try {
                const res = await providerApi.getClientBookings(selectedClient.uuid, { per_page: 20 });
                if (!cancelled && res.success) setClientBookings(res.data ?? []);
            } catch {
                if (!cancelled) setClientBookings([]);
            } finally {
                if (!cancelled) setBookingsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [selectedClient]);

    const allClients = clients ?? [];

    const statusColors: Record<string, string> = {
        completed: 'var(--status-completed)',
        confirmed: 'var(--status-confirmed)',
        pending: 'var(--status-unconfirmed)',
        cancelled: 'var(--status-cancelled)',
        no_show: 'var(--status-no-show)',
    };

    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
            {/* KPI Row */}
            <div className={styles.kpiRow}>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIcon}
                        style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}
                    >
                        <Users size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{allClients.length}</div>
                        <div className={styles.kpiLabel}>Total Clients</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: '#ecfdf5', color: '#059669' }}>
                        <CalendarDays size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{allClients.reduce((s, c) => s + c.total_bookings, 0)}</div>
                        <div className={styles.kpiLabel}>Total Bookings</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                        <CheckCircle size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{allClients.filter(c => c.total_bookings >= 5).length}</div>
                        <div className={styles.kpiLabel}>Repeat Clients</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: '#fff7ed', color: '#f59e0b' }}>
                        <Clock size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>
                            {
                                allClients.filter(c => {
                                    const d = new Date(c.last_booking_date);
                                    const days = Math.floor((now - d.getTime()) / 86400000);
                                    return days <= 30;
                                }).length
                            }
                        </div>
                        <div className={styles.kpiLabel}>Active (last 30d)</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder="Search by name, email, or phone..."
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <DataGuard
                loading={loading}
                error={error}
                data={allClients}
                emptyIcon={<Users size={48} />}
                emptyTitle="No clients yet"
                emptyDescription="Clients who have made bookings with you will appear here."
            >
                <div className={styles.tableCard}>
                    <div className={styles.tableScroll}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'start' }}>Client</th>
                                    <th style={{ textAlign: 'start' }}>Contact</th>
                                    <th style={{ textAlign: 'start' }}>Bookings</th>
                                    <th style={{ textAlign: 'start' }}>Last Booking</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {allClients.map(c => {
                                    const initials = extractStr(c.name)
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase();
                                    const daysSince = Math.floor(
                                        (now - new Date(c.last_booking_date).getTime()) / 86400000
                                    );
                                    return (
                                        <tr
                                            key={c.uuid}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setSelectedClient(c)}
                                        >
                                            <td>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 'var(--space-3)',
                                                    }}
                                                >
                                                    <div className={styles.avatar}>{initials}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 'var(--font-semibold)' }}>
                                                            {extractStr(c.name)}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: 'var(--text-xs)',
                                                                color: 'var(--text-tertiary)',
                                                            }}
                                                        >
                                                            {c.uuid.slice(0, 8)}…
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    <span
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--space-1)',
                                                            fontSize: 'var(--text-sm)',
                                                        }}
                                                    >
                                                        <Phone size={12} style={{ color: 'var(--text-tertiary)' }} />{' '}
                                                        {c.phone}
                                                    </span>
                                                    <span
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--space-1)',
                                                            fontSize: 'var(--text-xs)',
                                                            color: 'var(--text-tertiary)',
                                                        }}
                                                    >
                                                        <Mail size={12} /> {c.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        fontWeight: 'var(--font-semibold)',
                                                        color: 'var(--color-primary-600)',
                                                    }}
                                                >
                                                    {c.total_bookings}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    <span style={{ fontSize: 'var(--text-sm)' }}>
                                                        {c.last_booking_date}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: 'var(--text-xs)',
                                                            color:
                                                                daysSince <= 30
                                                                    ? 'var(--color-success)'
                                                                    : daysSince <= 90
                                                                      ? 'var(--color-warning)'
                                                                      : 'var(--color-error)',
                                                        }}
                                                    >
                                                        {daysSince === 0
                                                            ? 'Today'
                                                            : daysSince === 1
                                                              ? 'Yesterday'
                                                              : `${daysSince}d ago`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className={styles.btnOutline}
                                                    style={{ fontSize: 'var(--text-xs)', padding: '4px 10px' }}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setSelectedClient(c);
                                                    }}
                                                >
                                                    History
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageBtn}
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className={styles.pageInfo}>Page {currentPage}</span>
                        <button
                            className={styles.pageBtn}
                            disabled={allClients.length < perPage}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </DataGuard>

            {/* Booking History Slide-over */}
            {selectedClient && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}
                    onClick={() => setSelectedClient(null)}
                >
                    {/* Backdrop */}
                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }} />
                    {/* Panel */}
                    <div
                        style={{
                            width: 480,
                            maxWidth: '100vw',
                            background: 'var(--bg-card)',
                            height: '100%',
                            overflowY: 'auto',
                            boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Panel Header */}
                        <div
                            style={{
                                padding: 'var(--space-5)',
                                borderBottom: '1px solid var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                position: 'sticky',
                                top: 0,
                                background: 'var(--bg-card)',
                                zIndex: 1,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <div className={styles.avatar}>
                                    {extractStr(selectedClient.name)
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>
                                        {extractStr(selectedClient.name)}
                                    </div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                                        {selectedClient.total_bookings} booking
                                        {selectedClient.total_bookings !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedClient(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-tertiary)',
                                    padding: 'var(--space-1)',
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Contact info */}
                        <div
                            style={{
                                padding: 'var(--space-4) var(--space-5)',
                                borderBottom: '1px solid var(--border-subtle)',
                                display: 'flex',
                                gap: 'var(--space-4)',
                            }}
                        >
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                <Phone size={14} /> {selectedClient.phone}
                            </span>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                <Mail size={14} /> {selectedClient.email}
                            </span>
                        </div>

                        {/* Booking History */}
                        <div style={{ padding: 'var(--space-5)', flex: 1 }}>
                            <div
                                style={{
                                    fontWeight: 'var(--font-semibold)',
                                    marginBottom: 'var(--space-4)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                Booking History
                            </div>
                            {bookingsLoading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    {[0, 1, 2].map(i => (
                                        <div
                                            key={i}
                                            style={{
                                                height: 72,
                                                borderRadius: 'var(--radius-lg)',
                                                background: 'var(--bg-secondary)',
                                                animation: 'pulse 1.5s infinite',
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : clientBookings && clientBookings.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {clientBookings.map(b => {
                                        const statusColor =
                                            statusColors[b.status?.toLowerCase() ?? ''] ?? 'var(--color-primary-500)';
                                        return (
                                            <div
                                                key={b.uuid}
                                                style={{
                                                    padding: 'var(--space-3) var(--space-4)',
                                                    borderRadius: 'var(--radius-lg)',
                                                    border: '1px solid var(--border-subtle)',
                                                    background: 'var(--bg-secondary)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 'var(--space-2)',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => router.push(`/bookings/${b.uuid}`)}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontWeight: 'var(--font-semibold)',
                                                            fontSize: 'var(--text-sm)',
                                                        }}
                                                    >
                                                        {extractStr(b.service?.name) || 'Service'}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: 'var(--text-xs)',
                                                            padding: '2px var(--space-2)',
                                                            borderRadius: 'var(--radius-full)',
                                                            background: statusColor + '20',
                                                            color: statusColor,
                                                            fontWeight: 'var(--font-semibold)',
                                                            textTransform: 'capitalize',
                                                        }}
                                                    >
                                                        {b.status}
                                                    </span>
                                                </div>
                                                <div
                                                    style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}
                                                >
                                                    <span
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--space-1)',
                                                            fontSize: 'var(--text-xs)',
                                                            color: 'var(--text-tertiary)',
                                                        }}
                                                    >
                                                        <CalendarDays size={11} />
                                                        {b.booking_date} {b.start_time?.slice(0, 5)}–
                                                        {b.end_time?.slice(0, 5)}
                                                    </span>
                                                    {extractStr(b.employee?.name) && (
                                                        <span
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 'var(--space-1)',
                                                                fontSize: 'var(--text-xs)',
                                                                color: 'var(--text-tertiary)',
                                                            }}
                                                        >
                                                            with {extractStr(b.employee?.name)}
                                                        </span>
                                                    )}
                                                    {extractStr(b.branch?.name) && (
                                                        <span
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 'var(--space-1)',
                                                                fontSize: 'var(--text-xs)',
                                                                color: 'var(--text-tertiary)',
                                                            }}
                                                        >
                                                            <Building2 size={11} /> {extractStr(b.branch?.name)}
                                                        </span>
                                                    )}
                                                </div>
                                                {b.price != null && (
                                                    <div
                                                        style={{
                                                            fontSize: 'var(--text-sm)',
                                                            fontWeight: 'var(--font-semibold)',
                                                            color: 'var(--color-success)',
                                                        }}
                                                    >
                                                        {Number(b.price).toLocaleString('en-US')} {egpLabel()}
                                                        {b.payment_status && (
                                                            <span
                                                                style={{
                                                                    marginInlineStart: 'var(--space-2)',
                                                                    fontSize: 'var(--text-xs)',
                                                                    color:
                                                                        b.payment_status === 'paid'
                                                                            ? 'var(--color-success)'
                                                                            : 'var(--color-warning)',
                                                                    fontWeight: 'var(--font-medium)',
                                                                }}
                                                            >
                                                                · {b.payment_status}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 'var(--space-8)',
                                        color: 'var(--text-tertiary)',
                                        gap: 'var(--space-2)',
                                        textAlign: 'center',
                                    }}
                                >
                                    <CalendarDays size={32} style={{ opacity: 0.3 }} />
                                    <span style={{ fontSize: 'var(--text-sm)' }}>No booking history found</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
