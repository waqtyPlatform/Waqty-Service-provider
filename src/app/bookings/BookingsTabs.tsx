'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    CalendarDays,
    List,
    DoorOpen,
    Plus,
    Printer,
} from 'lucide-react';
import styles from './bookings.module.css';

export default function BookingsTabs() {
    const pathname = usePathname();

    return (
        <div className={styles.tabs}>
            <Link
                href="/bookings"
                className={`${styles.tab} ${pathname === '/bookings' ? styles.tabActive : ''}`}
            >
                <CalendarDays size={16} /> Calendar
            </Link>
            <Link
                href="/bookings/list"
                className={`${styles.tab} ${pathname === '/bookings/list' ? styles.tabActive : ''}`}
            >
                <List size={16} /> Booking List
            </Link>
            <Link
                href="/bookings/rooms"
                className={`${styles.tab} ${pathname === '/bookings/rooms' ? styles.tabActive : ''}`}
            >
                <DoorOpen size={16} /> Room Calendar
            </Link>
            <Link
                href="/bookings/new"
                className={`${styles.tab} ${pathname === '/bookings/new' ? styles.tabActive : ''}`}
            >
                <Plus size={16} /> New Booking
            </Link>
            <Link
                href="/bookings/print"
                className={`${styles.tab} ${pathname === '/bookings/print' ? styles.tabActive : ''}`}
            >
                <Printer size={16} /> Employee Print
            </Link>
        </div>
    );
}
