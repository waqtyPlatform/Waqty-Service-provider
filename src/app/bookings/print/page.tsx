'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import BookingsTabs from '../BookingsTabs';
import { useTranslation } from '@/hooks/useTranslation';

const employees = [
    { id: 'E01', name: 'Sara Ahmed', role: 'Senior Stylist', color: '#F59E0B' },
    { id: 'E02', name: 'Nora Ali', role: 'Skin Specialist', color: '#8B5CF6' },
    { id: 'E03', name: 'Layla Hassan', role: 'Senior Therapist', color: '#10B981' },
    { id: 'E04', name: 'Reem Mohamed', role: 'Massage Therapist', color: '#EC4899' },
    { id: 'E05', name: 'Hana Youssef', role: 'Nail Technician', color: '#3B82F6' },
];

const scheduleData: Record<
    string,
    Array<{ time: string; service: string; client: string; duration: string; status: string }>
> = {
    E01: [
        { time: '09:00', service: 'Haircut & Styling', client: 'Fatima Ali', duration: '45 min', status: 'Confirmed' },
        { time: '10:00', service: 'Hair Coloring', client: 'Rania Khalil', duration: '90 min', status: 'Confirmed' },
        { time: '12:00', service: 'Keratin Treatment', client: 'Sama Latif', duration: '120 min', status: 'Confirmed' },
        { time: '14:30', service: 'Haircut & Styling', client: 'Noura Ahmed', duration: '45 min', status: 'Pending' },
        { time: '16:00', service: 'Bridal Styling', client: 'Aisha Mahmoud', duration: '120 min', status: 'Confirmed' },
    ],
    E02: [
        { time: '09:30', service: 'Classic Facial', client: 'Huda Saleh', duration: '60 min', status: 'Confirmed' },
        { time: '11:00', service: 'HydraFacial', client: 'Maryam Ibrahim', duration: '75 min', status: 'Confirmed' },
        { time: '13:00', service: 'Acne Treatment', client: 'Dana Faris', duration: '60 min', status: 'Confirmed' },
        { time: '15:00', service: 'Classic Facial', client: 'Walk-in', duration: '60 min', status: 'Pending' },
    ],
    E03: [
        { time: '10:00', service: 'Swedish Massage', client: 'Noura Ahmed', duration: '60 min', status: 'Confirmed' },
        {
            time: '11:30',
            service: 'Hot Stone Massage',
            client: 'Rania Khalil',
            duration: '90 min',
            status: 'Confirmed',
        },
        { time: '14:00', service: 'Body Wrap', client: 'Lina Qasim', duration: '60 min', status: 'Confirmed' },
    ],
    E04: [
        {
            time: '09:00',
            service: 'Deep Tissue Massage',
            client: 'Yara Hassan',
            duration: '60 min',
            status: 'Confirmed',
        },
        { time: '10:30', service: 'Swedish Massage', client: 'Joud Salem', duration: '60 min', status: 'Confirmed' },
        { time: '12:00', service: 'Aromatherapy', client: 'Huda Saleh', duration: '90 min', status: 'Pending' },
        { time: '14:30', service: 'Sports Massage', client: 'Walk-in', duration: '60 min', status: 'Pending' },
    ],
    E05: [
        { time: '09:00', service: 'Gel Manicure', client: 'Fatima Ali', duration: '45 min', status: 'Confirmed' },
        { time: '10:00', service: 'Pedicure', client: 'Sama Latif', duration: '45 min', status: 'Confirmed' },
        { time: '11:00', service: 'Nail Art', client: 'Dana Faris', duration: '60 min', status: 'Confirmed' },
        { time: '13:00', service: 'Gel Manicure', client: 'Maryam Ibrahim', duration: '45 min', status: 'Confirmed' },
        { time: '14:00', service: 'Pedicure', client: 'Noura Ahmed', duration: '45 min', status: 'Pending' },
        { time: '15:00', service: 'Manicure + Pedicure', client: 'Walk-in', duration: '90 min', status: 'Pending' },
    ],
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    h1: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    printBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-5)',
        background: 'var(--color-primary-500)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-semibold)',
        cursor: 'pointer',
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-5)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        breakInside: 'avoid' as const,
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-4) var(--space-5)',
        borderBottom: '1px solid var(--border-color)',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'var(--font-bold)',
        fontSize: 'var(--text-sm)',
        flexShrink: 0,
    },
    empName: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
    empRole: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    count: { marginInlineStart: 'auto', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    row: {
        display: 'flex',
        padding: 'var(--space-3) var(--space-5)',
        borderBottom: '1px solid var(--border-color)',
        fontSize: 'var(--text-sm)',
        gap: 'var(--space-3)',
        alignItems: 'center',
    },
    time: { width: 50, fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)', flexShrink: 0 },
    details: { flex: 1, overflow: 'hidden' },
    svc: { fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' },
    client: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    dur: { fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' as const },
    pending: {
        display: 'inline-flex',
        padding: '2px var(--space-2)',
        borderRadius: 'var(--radius-full)',
        fontSize: 10,
        fontWeight: 'var(--font-semibold)',
        background: 'var(--color-warning-light)',
        color: 'var(--color-warning)',
    },
};

export default function EmployeePrintPage() {
    const { t, lang } = useTranslation();
    // Real current date, RTL-aware (ar-EG vs en-US) — was a frozen hardcoded string.
    const todayLabel = new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <BookingsTabs />

            <div style={s.header}>
                <div>
                    <h1 style={s.h1}>
                        {t('bk.printTitle')} — {todayLabel}
                    </h1>
                    <p
                        style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-tertiary)',
                            marginTop: 'var(--space-1)',
                        }}
                    >
                        {t('bk.printSub')}
                    </p>
                </div>
                <button style={s.printBtn} onClick={() => window.print()}>
                    <Printer size={16} /> {t('bk.btnPrintAll')}
                </button>
            </div>

            <div style={s.grid}>
                {employees.map(emp => {
                    const bookings = scheduleData[emp.id] || [];
                    return (
                        <div key={emp.id} style={s.card}>
                            <div style={s.cardHeader}>
                                <div style={{ ...s.avatar, background: emp.color }}>{emp.name.charAt(0)}</div>
                                <div>
                                    <div style={s.empName}>{emp.name}</div>
                                    <div style={s.empRole}>{emp.role}</div>
                                </div>
                                <span style={s.count}>
                                    {bookings.length} {t('bk.lblBookingsCount')}
                                </span>
                            </div>
                            {bookings.map((b, i) => (
                                <div
                                    key={i}
                                    style={{ ...s.row, ...(i === bookings.length - 1 ? { borderBottom: 'none' } : {}) }}
                                >
                                    <span style={s.time}>{b.time}</span>
                                    <div style={{ ...s.details, textAlign: 'start' }}>
                                        <div style={s.svc}>{b.service}</div>
                                        <div style={s.client}>{b.client}</div>
                                    </div>
                                    <span style={s.dur}>{b.duration}</span>
                                    {b.status === 'Pending' && <span style={s.pending}>{t('bk.stUnconfirmed')}</span>}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
