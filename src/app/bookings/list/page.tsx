'use client';

import React, { useState, useEffect } from 'react';
import { DropdownMenu, useToast } from '@/components/ui';
import { useRouter } from 'next/navigation';
import {
    Search,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Download,
    Check,
    X,
    AlertTriangle,
    Eye,
    Edit,
} from 'lucide-react';
import styles from '../bookings.module.css';
import BookingsTabs from '../BookingsTabs';
import { useTranslation } from '@/hooks/useTranslation';
import { providerApi } from '@/lib/api';
import type { BookingStatus } from '@/lib/contract';
import { egp, fromMinor } from '@/lib/money';
import {
    type VisitView,
    STATUS_LABEL_KEY,
    STATUS_ORDER,
    paymentBucket,
    type PaymentBucket,
    visitViewFromBooking,
    mockVisitViews,
    hhmm,
} from '../_visits';
import { loadLocalVisits, updateLocalVisitStatus } from '../_localBookings';

// Canonical 6-state status -> badge CSS (reuses the existing module classes).
const statusClass: Record<BookingStatus, string> = {
    pending: styles.statusUnconfirmed,
    confirmed: styles.statusConfirmed,
    in_progress: styles.statusArrived,
    completed: styles.statusCompleted,
    cancelled: styles.statusCancelled,
    no_show: styles.statusNoShow,
};

const paymentConfig: Record<PaymentBucket, { class: string; labelKey: string }> = {
    paid: { class: styles.paymentPaid, labelKey: 'bk.payPaid' },
    partial: { class: styles.paymentPartial, labelKey: 'bk.payPartial' },
    unpaid: { class: styles.paymentUnpaid, labelKey: 'bk.payUnpaid' },
};

const isoDate = (iso: string) => iso.split('T')[0];
const displayDate = (iso: string) =>
    new Date(`${isoDate(iso)}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

/** Daily queue number per visit (grouped by date, sorted by start time). */
function computeQueueNumbers(views: VisitView[]): Map<string, number> {
    const map = new Map<string, number>();
    const byDate = new Map<string, VisitView[]>();
    for (const v of views) {
        if (v.visit.status === 'cancelled') continue;
        const key = isoDate(v.visit.scheduled_start);
        const list = byDate.get(key) || [];
        list.push(v);
        byDate.set(key, list);
    }
    for (const [, list] of byDate) {
        list.sort((a, b) => a.visit.scheduled_start.localeCompare(b.visit.scheduled_start));
        list.forEach((v, i) => map.set(v.visit.uuid, i + 1));
    }
    return map;
}

function CancelConfirmModal({
    bookingId,
    onConfirm,
    onClose,
}: {
    bookingId: string;
    onConfirm: () => void;
    onClose: () => void;
}) {
    const { t } = useTranslation();
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
        width: 400,
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
                        marginBottom: 'var(--space-3)',
                    }}
                >
                    <AlertTriangle size={20} color="var(--color-error)" />
                    <h3 style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-lg)' }}>
                        {t('bk.cancelBookingNumTitle').replace('{id}', bookingId)}
                    </h3>
                </div>
                <p
                    style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--space-5)',
                    }}
                >
                    {t('bk.cancelBookingBody')}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', direction: 'ltr' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: 'var(--space-2) var(--space-4)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--bg-primary)',
                            cursor: 'pointer',
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        {t('bk.btnKeepBooking')}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: 'var(--space-2) var(--space-4)',
                            border: 'none',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--color-error)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                        }}
                    >
                        {t('bk.btnConfirmCancel')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BookingListPage() {
    const { t, lang } = useTranslation();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
    const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentBucket>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [rows, setRows] = useState<VisitView[]>(mockVisitViews);
    const [apiLoaded, setApiLoaded] = useState(false);
    const [localVisits, setLocalVisits] = useState<VisitView[]>([]);
    const [cancelTarget, setCancelTarget] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const router = useRouter();
    const { addToast } = useToast();

    // Locally-created bookings (offline/demo). Read on the client after mount so
    // SSR markup matches; merged into the list only while on mock data (below).
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is unavailable during SSR; locally-created bookings are loaded once on the client after mount
        setLocalVisits(loadLocalVisits());
    }, [refreshKey]);

    // Fetch bookings from the API (single-service rows) and lift each into a
    // canonical VisitView; fall back to mock visits on error/empty.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await providerApi.getBookings({ per_page: 100 });
                if (!cancelled && res.success && res.data && res.data.length > 0) {
                    setRows(res.data.map(visitViewFromBooking));
                    setApiLoaded(true);
                }
            } catch {
                // Keep fallback mock data
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [refreshKey]);

    const confirmCancel = async () => {
        if (!cancelTarget) return;
        // Locally-created booking -> update the local store (and this view).
        if (localVisits.some(v => v.visit.uuid === cancelTarget)) {
            updateLocalVisitStatus(cancelTarget, 'cancelled');
            setLocalVisits(prev =>
                prev.map(v =>
                    v.visit.uuid === cancelTarget
                        ? { ...v, visit: { ...v.visit, status: 'cancelled' as BookingStatus } }
                        : v
                )
            );
            addToast('error', t('bk.toastBookingNumCancelled').replace('{id}', cancelTarget));
            setCancelTarget(null);
            return;
        }
        // UUID format (API booking) -> persist via API; otherwise mock update.
        if (cancelTarget.includes('-') && cancelTarget.length > 10) {
            try {
                await providerApi.updateBookingStatus(cancelTarget, 'cancelled');
                addToast('error', t('bk.toastBookingCancelled'));
                setRefreshKey(k => k + 1);
            } catch {
                addToast('error', t('bk.toastFailedCancel'));
            }
        } else {
            setRows(prev =>
                prev.map(v =>
                    v.visit.uuid === cancelTarget
                        ? { ...v, visit: { ...v.visit, status: 'cancelled' as BookingStatus } }
                        : v
                )
            );
            addToast('error', t('bk.toastBookingNumCancelled').replace('{id}', cancelTarget));
        }
        setCancelTarget(null);
    };

    // Locally-created bookings ride on top of the mock rows; once the API takes
    // over, its rows are authoritative and the local copies are dropped (the
    // booking is already on the server) — so there are never duplicates.
    const displayRows = React.useMemo(
        () => (apiLoaded ? rows : [...localVisits, ...rows]),
        [apiLoaded, localVisits, rows]
    );

    const queueNumbers = React.useMemo(() => computeQueueNumbers(displayRows), [displayRows]);

    const filtered = React.useMemo(
        () =>
            displayRows.filter(v => {
                const services = v.lines.map(l => l.serviceName).join(' ');
                const matchSearch =
                    v.clientName.toLowerCase().includes(search.toLowerCase()) ||
                    v.visit.uuid.toLowerCase().includes(search.toLowerCase()) ||
                    services.toLowerCase().includes(search.toLowerCase());
                const matchStatus = statusFilter === 'all' || v.visit.status === statusFilter;
                const matchPayment = paymentFilter === 'all' || paymentBucket(v.visit.payment.status) === paymentFilter;
                return matchSearch && matchStatus && matchPayment;
            }),
        [displayRows, search, statusFilter, paymentFilter]
    );

    const itemsPerPage = 5;
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, paymentFilter]);

    return (
        <>
            {cancelTarget && (
                <CancelConfirmModal
                    bookingId={cancelTarget}
                    onConfirm={confirmCancel}
                    onClose={() => setCancelTarget(null)}
                />
            )}
            <div className={styles.bookingsPage} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                {/* Tabs */}
                <BookingsTabs />

                {/* Controls */}
                <div className={styles.listControls}>
                    <div className={styles.searchWrapper}>
                        <Search
                            size={16}
                            className={styles.searchIcon}
                            style={{ insetInlineStart: 'var(--space-3)' }}
                        />
                        <input
                            className={styles.searchInput}
                            style={{ paddingInlineStart: 36, paddingInlineEnd: 'var(--space-3)' }}
                            placeholder={t('bk.searchPlaceholder')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className={styles.selectFilter}
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as 'all' | BookingStatus)}
                    >
                        <option value="all">{t('bk.allStatuses')}</option>
                        {STATUS_ORDER.map(s => (
                            <option key={s} value={s}>
                                {t(STATUS_LABEL_KEY[s])}
                            </option>
                        ))}
                    </select>
                    <select
                        className={styles.selectFilter}
                        value={paymentFilter}
                        onChange={e => setPaymentFilter(e.target.value as 'all' | PaymentBucket)}
                    >
                        <option value="all">{t('bk.allPayments')}</option>
                        <option value="paid">{t('bk.payPaid')}</option>
                        <option value="partial">{t('bk.payPartial')}</option>
                        <option value="unpaid">{t('bk.payUnpaid')}</option>
                    </select>
                    <button
                        className={styles.filterBtn}
                        onClick={() => {
                            const csv = [
                                'ID,Date,Time,Client,Service,Employee,Status,Payment,Value',
                                ...filtered.map(v => {
                                    const services = v.lines.map(l => l.serviceName).join(' | ');
                                    const employees = v.lines.map(l => l.employeeName).join(' | ');
                                    return `${v.visit.uuid},${displayDate(v.visit.scheduled_start)},${hhmm(
                                        v.visit.scheduled_start
                                    )},${v.clientName},"${services}","${employees}",${v.visit.status},${paymentBucket(
                                        v.visit.payment.status
                                    )},${fromMinor(v.visit.total)}`;
                                }),
                            ].join('\n');
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = 'bookings.csv';
                            a.click();
                        }}
                    >
                        <Download size={16} /> {t('bk.btnExport')}
                    </button>
                </div>

                {/* Table */}
                <div className={styles.tableCard}>
                    <div className={styles.tableScroll}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>{t('bk.thBkNum')}</th>
                                    <th>{t('bk.thBranch')}</th>
                                    <th>{t('bk.thClient')}</th>
                                    <th>{t('bk.thMobile')}</th>
                                    <th>{t('bk.thDateTime')}</th>
                                    <th>{t('bk.thService')}</th>
                                    <th>{t('bk.thEmployee')}</th>
                                    <th>{t('bk.thValue')}</th>
                                    <th>{t('bk.thStatus')}</th>
                                    <th>{t('bk.thPayment')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map(v => {
                                    const { visit } = v;
                                    const payBucket = paymentBucket(visit.payment.status);
                                    const multiLine = v.lines.length > 1;
                                    return (
                                        <tr
                                            key={visit.uuid}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => router.push(`/bookings/${visit.uuid}`)}
                                        >
                                            <td className={styles.bookingId}>
                                                {queueNumbers.has(visit.uuid) && (
                                                    <span
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            minWidth: 20,
                                                            height: 18,
                                                            borderRadius: 'var(--radius-full)',
                                                            background: 'var(--color-primary-50, #eff6ff)',
                                                            color: 'var(--color-primary-600)',
                                                            fontSize: 10,
                                                            fontWeight: 700,
                                                            marginInlineEnd: 'var(--space-1)',
                                                            padding: '0 var(--space-1)',
                                                        }}
                                                    >
                                                        #{queueNumbers.get(visit.uuid)}
                                                    </span>
                                                )}
                                                {visit.uuid}
                                            </td>
                                            <td>{v.branchName}</td>
                                            <td style={{ fontWeight: 'var(--font-medium)' }}>{v.clientName}</td>
                                            <td style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
                                                {v.clientPhone}
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 'var(--font-medium)' }}>
                                                    {displayDate(visit.scheduled_start)}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-tertiary)',
                                                    }}
                                                >
                                                    {hhmm(visit.scheduled_start)}
                                                </div>
                                            </td>
                                            <td>
                                                {v.lines.map((l, i) => (
                                                    <div key={i}>
                                                        {l.serviceName}
                                                        {multiLine && (
                                                            <span
                                                                style={{
                                                                    color: 'var(--text-tertiary)',
                                                                    fontSize: 'var(--text-xs)',
                                                                    marginInlineStart: 'var(--space-1)',
                                                                }}
                                                            >
                                                                {hhmm(l.line.start_time)}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {v.lines.map((l, i) => (
                                                    <div key={i}>{l.employeeName}</div>
                                                ))}
                                            </td>
                                            <td style={{ fontWeight: 'var(--font-semibold)' }}>
                                                {multiLine ? (
                                                    <>
                                                        {v.lines.map((l, i) => (
                                                            <div
                                                                key={i}
                                                                style={{
                                                                    color: 'var(--text-tertiary)',
                                                                    fontSize: 'var(--text-xs)',
                                                                    fontWeight: 'var(--font-normal)',
                                                                }}
                                                            >
                                                                {egp(l.line.price)}
                                                            </div>
                                                        ))}
                                                        <div>{egp(visit.total)}</div>
                                                    </>
                                                ) : (
                                                    egp(visit.total)
                                                )}
                                            </td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${statusClass[visit.status]}`}>
                                                    {t(STATUS_LABEL_KEY[visit.status])}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`${styles.paymentBadge} ${paymentConfig[payBucket].class}`}
                                                >
                                                    {payBucket === 'paid' && <Check size={12} />}
                                                    {payBucket === 'unpaid' && <X size={12} />}
                                                    {t(paymentConfig[payBucket].labelKey)}
                                                </span>
                                            </td>
                                            <td onClick={e => e.stopPropagation()}>
                                                <DropdownMenu
                                                    trigger={
                                                        <button
                                                            className={styles.actionBtn}
                                                            aria-label={t('common.moreOptions')}
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    }
                                                    items={[
                                                        {
                                                            label: t('bk.actionView'),
                                                            icon: <Eye size={14} />,
                                                            onClick: () => router.push(`/bookings/${visit.uuid}`),
                                                        },
                                                        {
                                                            label: t('bk.actionEdit'),
                                                            icon: <Edit size={14} />,
                                                            onClick: () =>
                                                                router.push(`/bookings/new?edit=${visit.uuid}`),
                                                        },
                                                        ...(visit.status !== 'cancelled' && visit.status !== 'completed'
                                                            ? [
                                                                  {
                                                                      label: t('bk.actionCancel'),
                                                                      icon: <X size={14} />,
                                                                      onClick: () => setCancelTarget(visit.uuid),
                                                                      destructive: true,
                                                                  },
                                                              ]
                                                            : []),
                                                    ]}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.pagination}>
                        <span className={styles.pageInfo}>
                            {t('bk.showingInfo')
                                .replace('{start}', String((currentPage - 1) * itemsPerPage + 1))
                                .replace('{end}', String(Math.min(currentPage * itemsPerPage, filtered.length)))
                                .replace('{total}', String(filtered.length))}
                        </span>
                        <div className={styles.pageButtons}>
                            <button
                                className={styles.pageBtn}
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={16} style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }} />
                            </button>
                            <span className={styles.pageCurrent}>
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                className={styles.pageBtn}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight size={16} style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
