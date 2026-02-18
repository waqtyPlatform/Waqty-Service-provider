'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    CalendarDays,
    List,
    DoorOpen,
    Plus,
    Printer,
    Search,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Download,
    Check,
    X,
} from 'lucide-react';
import styles from '../bookings.module.css';

const statusConfig: Record<string, { class: string; label: string }> = {
    confirmed: { class: styles.statusConfirmed, label: 'Confirmed' },
    completed: { class: styles.statusCompleted, label: 'Completed' },
    arrived: { class: styles.statusArrived, label: 'Arrived' },
    unconfirmed: { class: styles.statusUnconfirmed, label: 'Unconfirmed' },
    cancelled: { class: styles.statusCancelled, label: 'Cancelled' },
    workDone: { class: styles.statusWorkDone, label: 'Work Done' },
    waitingPay: { class: styles.statusWaitingPay, label: 'Waiting Pay' },
    noShow: { class: styles.statusNoShow, label: 'No Show' },
};

const paymentConfig: Record<string, { class: string; label: string }> = {
    paid: { class: styles.paymentPaid, label: 'Paid' },
    partial: { class: styles.paymentPartial, label: 'Partial' },
    unpaid: { class: styles.paymentUnpaid, label: 'Unpaid' },
};

const bookings = [
    { id: 'BK-1042', branch: 'Main', client: 'Fatima Al-Rashid', mobile: '+20 123 456 789', date: 'Feb 17, 2026', time: '09:00', service: 'Hair Coloring', employee: 'Sara Ahmed', value: 400, status: 'confirmed', payment: 'paid', payMethod: 'Card' },
    { id: 'BK-1041', branch: 'Main', client: 'Aisha Mohammed', mobile: '+20 111 222 333', date: 'Feb 17, 2026', time: '09:30', service: 'Keratin Treatment', employee: 'Nora Ali', value: 500, status: 'arrived', payment: 'paid', payMethod: 'Cash' },
    { id: 'BK-1040', branch: 'Main', client: 'Maryam Ibrahim', mobile: '+20 100 200 300', date: 'Feb 17, 2026', time: '10:00', service: 'Classic Facial', employee: 'Layla Hassan', value: 200, status: 'completed', payment: 'paid', payMethod: 'Card' },
    { id: 'BK-1039', branch: 'Main', client: 'Huda Saleh', mobile: '+20 155 666 777', date: 'Feb 17, 2026', time: '10:30', service: 'Gel Manicure', employee: 'Hana Youssef', value: 150, status: 'unconfirmed', payment: 'unpaid', payMethod: '—' },
    { id: 'BK-1038', branch: 'Main', client: 'Noura Ahmed', mobile: '+20 199 888 999', date: 'Feb 17, 2026', time: '11:00', service: 'Swedish Massage', employee: 'Reem Mohamed', value: 300, status: 'confirmed', payment: 'partial', payMethod: 'Cash' },
    { id: 'BK-1037', branch: 'Downtown', client: 'Rania Khalil', mobile: '+20 133 444 555', date: 'Feb 17, 2026', time: '12:00', service: 'HydraFacial', employee: 'Nora Ali', value: 450, status: 'waitingPay', payment: 'unpaid', payMethod: '—' },
    { id: 'BK-1036', branch: 'Main', client: 'Dana Faris', mobile: '+20 177 333 222', date: 'Feb 17, 2026', time: '14:00', service: 'Olaplex Treatment', employee: 'Sara Ahmed', value: 350, status: 'workDone', payment: 'paid', payMethod: 'Card' },
    { id: 'BK-1035', branch: 'Main', client: 'Joud Wahid', mobile: '+20 144 555 666', date: 'Feb 16, 2026', time: '16:00', service: 'Laser Hair Removal', employee: 'Layla Hassan', value: 250, status: 'cancelled', payment: 'unpaid', payMethod: '—' },
    { id: 'BK-1034', branch: 'Mall', client: 'Sama Latif', mobile: '+20 166 777 888', date: 'Feb 16, 2026', time: '09:00', service: 'Haircut & Styling', employee: 'Hana Youssef', value: 150, status: 'completed', payment: 'paid', payMethod: 'Cash' },
    { id: 'BK-1033', branch: 'Main', client: 'Yara Bassam', mobile: '+20 188 999 000', date: 'Feb 16, 2026', time: '10:00', service: 'Pedicure', employee: 'Reem Mohamed', value: 120, status: 'noShow', payment: 'unpaid', payMethod: '—' },
];

export default function BookingListPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');

    const filtered = bookings.filter((b) => {
        const matchSearch =
            b.client.toLowerCase().includes(search.toLowerCase()) ||
            b.id.toLowerCase().includes(search.toLowerCase()) ||
            b.service.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || b.status === statusFilter;
        const matchPayment = paymentFilter === 'all' || b.payment === paymentFilter;
        return matchSearch && matchStatus && matchPayment;
    });

    return (
        <div className={styles.bookingsPage}>
            {/* Tabs */}
            <div className={styles.tabs}>
                <Link href="/bookings" className={styles.tab}>
                    <CalendarDays size={16} /> Calendar
                </Link>
                <Link href="/bookings/list" className={`${styles.tab} ${styles.tabActive}`}>
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

            {/* Controls */}
            <div className={styles.listControls}>
                <div className={styles.searchWrapper}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder="Search booking #, client, service..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className={styles.selectFilter}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="arrived">Arrived</option>
                    <option value="unconfirmed">Unconfirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="workDone">Work Done</option>
                    <option value="waitingPay">Waiting Pay</option>
                    <option value="noShow">No Show</option>
                </select>
                <select
                    className={styles.selectFilter}
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                >
                    <option value="all">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="unpaid">Unpaid</option>
                </select>
                <button className={styles.filterBtn}>
                    <Download size={16} /> Export
                </button>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Booking #</th>
                            <th>Branch</th>
                            <th>Client</th>
                            <th>Mobile</th>
                            <th>Date & Time</th>
                            <th>Service</th>
                            <th>Employee</th>
                            <th>Value</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((b) => (
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
                                        {statusConfig[b.status]?.label}
                                    </span>
                                </td>
                                <td>
                                    <span className={`${styles.paymentBadge} ${paymentConfig[b.payment]?.class}`}>
                                        {b.payment === 'paid' && <Check size={12} />}
                                        {b.payment === 'unpaid' && <X size={12} />}
                                        {paymentConfig[b.payment]?.label}
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.actionBtn}>
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>
                        Showing {filtered.length} of {bookings.length} bookings
                    </span>
                    <div className={styles.pageButtons}>
                        <button className={styles.pageBtn}><ChevronLeft size={16} /></button>
                        <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                        <button className={styles.pageBtn}>2</button>
                        <button className={styles.pageBtn}>3</button>
                        <button className={styles.pageBtn}><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
