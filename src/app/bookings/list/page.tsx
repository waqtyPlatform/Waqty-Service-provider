'use client';

import React, { useState } from 'react';
import { DropdownMenu, useToast } from '@/components/ui';
import { useRouter } from 'next/navigation';
import {
    List,
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

const statusConfig: Record<string, { class: string; labelKey: string }> = {
    confirmed: { class: styles.statusConfirmed, labelKey: 'bk.stConfirmed' },
    completed: { class: styles.statusCompleted, labelKey: 'bk.stCompleted' },
    arrived: { class: styles.statusArrived, labelKey: 'bk.stArrived' },
    unconfirmed: { class: styles.statusUnconfirmed, labelKey: 'bk.stUnconfirmed' },
    cancelled: { class: styles.statusCancelled, labelKey: 'bk.stCancelled' },
    workDone: { class: styles.statusWorkDone, labelKey: 'bk.stWorkDone' },
    waitingPay: { class: styles.statusWaitingPay, labelKey: 'bk.stWaitingPay' },
    noShow: { class: styles.statusNoShow, labelKey: 'bk.stNoShow' },
};

const paymentConfig: Record<string, { class: string; labelKey: string }> = {
    paid: { class: styles.paymentPaid, labelKey: 'bk.payPaid' },
    partial: { class: styles.paymentPartial, labelKey: 'bk.payPartial' },
    unpaid: { class: styles.paymentUnpaid, labelKey: 'bk.payUnpaid' },
};

const bookings = [
    { id: 'BK-1042', branch: 'Downtown', client: 'Fatima Al-Rashid', mobile: '+20 123 456 789', date: 'Mar 23, 2026', time: '09:00', service: 'Hair Coloring', employee: 'Sara Ahmed', value: 400, status: 'confirmed', payment: 'paid', payMethod: 'Card' },
    { id: 'BK-1041', branch: 'Downtown', client: 'Aisha Mohammed', mobile: '+20 111 222 333', date: 'Mar 13, 2026', time: '09:30', service: 'Keratin Treatment', employee: 'Nora Ali', value: 500, status: 'arrived', payment: 'paid', payMethod: 'Cash' },
    { id: 'BK-1040', branch: 'Downtown', client: 'Maryam Ibrahim', mobile: '+20 100 200 300', date: 'Mar 23, 2026', time: '10:00', service: 'Classic Facial', employee: 'Layla Hassan', value: 200, status: 'completed', payment: 'paid', payMethod: 'Card' },
    { id: 'BK-1039', branch: 'Downtown', client: 'Huda Saleh', mobile: '+20 155 666 777', date: 'Mar 19, 2026', time: '10:30', service: 'Gel Manicure', employee: 'Hana Youssef', value: 150, status: 'unconfirmed', payment: 'unpaid', payMethod: '—' },
    { id: 'BK-1038', branch: 'Downtown', client: 'Noura Ahmed', mobile: '+20 199 888 999', date: 'Mar 19, 2026', time: '11:00', service: 'Swedish Massage', employee: 'Reem Mohamed', value: 300, status: 'confirmed', payment: 'partial', payMethod: 'Cash' },
    { id: 'BK-1037', branch: 'Mall of Arabia', client: 'Rania Khalil', mobile: '+20 133 444 555', date: 'Mar 25, 2026', time: '12:00', service: 'HydraFacial', employee: 'Nora Ali', value: 450, status: 'waitingPay', payment: 'unpaid', payMethod: '—' },
    { id: 'BK-1036', branch: 'Downtown', client: 'Dana Faris', mobile: '+20 177 333 222', date: 'Mar 12, 2026', time: '14:00', service: 'Olaplex Treatment', employee: 'Sara Ahmed', value: 350, status: 'workDone', payment: 'paid', payMethod: 'Card' },
    { id: 'BK-1035', branch: 'Downtown', client: 'Joud Wahid', mobile: '+20 144 555 666', date: 'Mar 17, 2026', time: '16:00', service: 'Laser Hair Removal', employee: 'Layla Hassan', value: 250, status: 'cancelled', payment: 'unpaid', payMethod: '—' },
    { id: 'BK-1034', branch: 'New Cairo', client: 'Sama Latif', mobile: '+20 166 777 888', date: 'Mar 19, 2026', time: '09:00', service: 'Haircut & Styling', employee: 'Hana Youssef', value: 150, status: 'completed', payment: 'paid', payMethod: 'Cash' },
    { id: 'BK-1033', branch: 'Downtown', client: 'Yara Bassam', mobile: '+20 188 999 000', date: 'Mar 17, 2026', time: '10:00', service: 'Pedicure', employee: 'Reem Mohamed', value: 120, status: 'noShow', payment: 'unpaid', payMethod: '—' },
];

function CancelConfirmModal({ bookingId, onConfirm, onClose }: {
    bookingId: string;
    onConfirm: () => void;
    onClose: () => void;
}) {
    const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' };
    const box: React.CSSProperties = { background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', width: 400, maxWidth: '90vw', border: '1px solid var(--border-color)' };
    return (
        <div style={overlay} onClick={onClose}>
            <div style={box} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                    <AlertTriangle size={20} color="#ef4444" />
                    <h3 style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-lg)' }}>Cancel Booking {bookingId}?</h3>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
                    This booking will be marked as cancelled. The client will be notified.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                        Keep Booking
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{ padding: 'var(--space-2) var(--space-4)', border: 'none', borderRadius: 'var(--radius-lg)', background: '#ef4444', color: 'white', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                        Confirm Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BookingListPage() {
    const { t, lang } = useTranslation();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [rows, setRows] = useState(bookings);
    const [cancelTarget, setCancelTarget] = useState<string | null>(null);
    const router = useRouter();
    const { addToast } = useToast();

    const confirmCancel = () => {
        if (!cancelTarget) return;
        setRows(prev => prev.map(b => b.id === cancelTarget ? { ...b, status: 'cancelled', payment: 'unpaid' } : b));
        addToast('error', `Booking ${cancelTarget} cancelled`);
        setCancelTarget(null);
    };

    const filtered = rows.filter((b) => {
        const matchSearch =
            b.client.toLowerCase().includes(search.toLowerCase()) ||
            b.id.toLowerCase().includes(search.toLowerCase()) ||
            b.service.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || b.status === statusFilter;
        const matchPayment = paymentFilter === 'all' || b.payment === paymentFilter;
        return matchSearch && matchStatus && matchPayment;
    });

    const itemsPerPage = 5;
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination if search/filters change
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
                    <Search size={16} className={styles.searchIcon} style={{ left: lang === 'ar' ? 'auto' : 12, right: lang === 'ar' ? 12 : 'auto' }} />
                    <input
                        className={styles.searchInput}
                        style={{ paddingLeft: lang === 'ar' ? 12 : 36, paddingRight: lang === 'ar' ? 36 : 12 }}
                        placeholder={t('bk.searchPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className={styles.selectFilter}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">{t('bk.allStatuses')}</option>
                    <option value="confirmed">{t('bk.stConfirmed')}</option>
                    <option value="completed">{t('bk.stCompleted')}</option>
                    <option value="arrived">{t('bk.stArrived')}</option>
                    <option value="unconfirmed">{t('bk.stUnconfirmed')}</option>
                    <option value="cancelled">{t('bk.stCancelled')}</option>
                    <option value="workDone">{t('bk.stWorkDone')}</option>
                    <option value="waitingPay">{t('bk.stWaitingPay')}</option>
                    <option value="noShow">{t('bk.stNoShow')}</option>
                </select>
                <select
                    className={styles.selectFilter}
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                >
                    <option value="all">{t('bk.allPayments')}</option>
                    <option value="paid">{t('bk.payPaid')}</option>
                    <option value="partial">{t('bk.payPartial')}</option>
                    <option value="unpaid">{t('bk.payUnpaid')}</option>
                </select>
                <button className={styles.filterBtn}>
                    <Download size={16} /> {t('bk.btnExport')}
                </button>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
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
                        {currentItems.map((b) => (
                            <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/bookings/${b.id}`)}>
                                <td className={styles.bookingId}>{b.id}</td>
                                <td>{b.branch}</td>
                                <td style={{ fontWeight: 'var(--font-medium)' }}>{b.client}</td>
                                <td style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>{b.mobile}</td>
                                <td>
                                    <div style={{ fontWeight: 'var(--font-medium)' }}>{b.date}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{b.time}</div>
                                </td>
                                <td>{b.service}</td>
                                <td>{b.employee}</td>
                                <td style={{ fontWeight: 'var(--font-semibold)' }}>{b.value} EGP</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${statusConfig[b.status]?.class}`}>
                                        {statusConfig[b.status] ? t(statusConfig[b.status].labelKey) : b.status}
                                    </span>
                                </td>
                                <td>
                                    <span className={`${styles.paymentBadge} ${paymentConfig[b.payment]?.class}`}>
                                        {b.payment === 'paid' && <Check size={12} />}
                                        {b.payment === 'unpaid' && <X size={12} />}
                                        {paymentConfig[b.payment] ? t(paymentConfig[b.payment].labelKey) : b.payment}
                                    </span>
                                </td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu
                                        trigger={<button className={styles.actionBtn}><MoreVertical size={16} /></button>}
                                        items={[
                                            { label: t('bk.actionView'), icon: <Eye size={14} />, onClick: () => router.push(`/bookings/${b.id}`) },
                                            { label: t('bk.actionEdit'), icon: <Edit size={14} />, onClick: () => router.push(`/bookings/new?edit=${b.id}`) },
                                            ...(b.status !== 'cancelled' && b.status !== 'completed' ? [
                                                { label: t('bk.actionCancel'), icon: <X size={14} />, onClick: () => setCancelTarget(b.id), destructive: true },
                                            ] : []),
                                        ]}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageBtnActive : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

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
