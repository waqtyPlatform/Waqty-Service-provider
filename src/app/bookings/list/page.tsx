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
    { id: 'BK-1042', branch: 'Downtown', client: 'Fatima Al-Rashid', mobile: '+20 123 456 789', date: 'Feb 17, 2026', time: '09:00', service: 'Hair Coloring', employee: 'Sara Ahmed', value: 400, status: 'confirmed', payment: 'paid', payMethod: 'Card' },
    { id: 'BK-1041', branch: 'Downtown', client: 'Aisha Mohammed', mobile: '+20 111 222 333', date: 'Feb 17, 2026', time: '09:30', service: 'Keratin Treatment', employee: 'Nora Ali', value: 500, status: 'arrived', payment: 'paid', payMethod: 'Cash' },
    { id: 'BK-1040', branch: 'Downtown', client: 'Maryam Ibrahim', mobile: '+20 100 200 300', date: 'Feb 17, 2026', time: '10:00', service: 'Classic Facial', employee: 'Layla Hassan', value: 200, status: 'completed', payment: 'paid', payMethod: 'Card' },
    { id: 'BK-1039', branch: 'Downtown', client: 'Huda Saleh', mobile: '+20 155 666 777', date: 'Feb 17, 2026', time: '10:30', service: 'Gel Manicure', employee: 'Hana Youssef', value: 150, status: 'unconfirmed', payment: 'unpaid', payMethod: '—' },
    { id: 'BK-1038', branch: 'Downtown', client: 'Noura Ahmed', mobile: '+20 199 888 999', date: 'Feb 17, 2026', time: '11:00', service: 'Swedish Massage', employee: 'Reem Mohamed', value: 300, status: 'confirmed', payment: 'partial', payMethod: 'Cash' },
    { id: 'BK-1037', branch: 'Mall of Arabia', client: 'Rania Khalil', mobile: '+20 133 444 555', date: 'Feb 17, 2026', time: '12:00', service: 'HydraFacial', employee: 'Nora Ali', value: 450, status: 'waitingPay', payment: 'unpaid', payMethod: '—' },
    { id: 'BK-1036', branch: 'Downtown', client: 'Dana Faris', mobile: '+20 177 333 222', date: 'Feb 17, 2026', time: '14:00', service: 'Olaplex Treatment', employee: 'Sara Ahmed', value: 350, status: 'workDone', payment: 'paid', payMethod: 'Card' },
    { id: 'BK-1035', branch: 'Downtown', client: 'Joud Wahid', mobile: '+20 144 555 666', date: 'Feb 16, 2026', time: '16:00', service: 'Laser Hair Removal', employee: 'Layla Hassan', value: 250, status: 'cancelled', payment: 'unpaid', payMethod: '—' },
    { id: 'BK-1034', branch: 'New Cairo', client: 'Sama Latif', mobile: '+20 166 777 888', date: 'Feb 16, 2026', time: '09:00', service: 'Haircut & Styling', employee: 'Hana Youssef', value: 150, status: 'completed', payment: 'paid', payMethod: 'Cash' },
    { id: 'BK-1033', branch: 'Downtown', client: 'Yara Bassam', mobile: '+20 188 999 000', date: 'Feb 16, 2026', time: '10:00', service: 'Pedicure', employee: 'Reem Mohamed', value: 120, status: 'noShow', payment: 'unpaid', payMethod: '—' },
];

export default function BookingListPage() {
    const { t, lang } = useTranslation();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const { addToast } = useToast();

    const filtered = bookings.filter((b) => {
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
                            <tr key={b.id}>
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
                                <td>
                                    <DropdownMenu
                                        trigger={<button className={styles.actionBtn}><MoreVertical size={16} /></button>}
                                        items={[
                                            { label: t('bk.actionView'), icon: <Search size={14} />, onClick: () => router.push(`/bookings/${b.id}`) },
                                            { label: t('bk.actionEdit'), icon: <List size={14} />, onClick: () => addToast('info', `Edit mode for ${b.id}`) },
                                            { label: t('bk.actionCancel'), icon: <X size={14} />, onClick: () => addToast('error', `Booking ${b.id} cancelled`), destructive: true },
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
    );
}
