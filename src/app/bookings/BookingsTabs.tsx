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
import { useTranslation } from '@/hooks/useTranslation';

export default function BookingsTabs() {
    const pathname = usePathname();
    const { t } = useTranslation();

    return (
        <div className={styles.tabs}>
            <Link
                href="/bookings"
                className={`${styles.tab} ${pathname === '/bookings' ? styles.tabActive : ''}`}
            >
                <CalendarDays size={16} /> {t('bk.calendarTab')}
            </Link>
            <Link
                href="/bookings/list"
                className={`${styles.tab} ${pathname === '/bookings/list' ? styles.tabActive : ''}`}
            >
                <List size={16} /> {t('bk.listTab')}
            </Link>
            <Link
                href="/bookings/rooms"
                className={`${styles.tab} ${pathname === '/bookings/rooms' ? styles.tabActive : ''}`}
            >
                <DoorOpen size={16} /> {t('bk.roomTab')}
            </Link>
            <Link
                href="/bookings/new"
                className={`${styles.tab} ${pathname === '/bookings/new' ? styles.tabActive : ''}`}
            >
                <Plus size={16} /> {t('bk.newBooking')}
            </Link>
            <Link
                href="/bookings/print"
                className={`${styles.tab} ${pathname === '/bookings/print' ? styles.tabActive : ''}`}
            >
                <Printer size={16} /> {t('bk.printTab')}
            </Link>
        </div>
    );
}
