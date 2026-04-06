'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui';
import {
    User,
    Search,
    Scissors,
    MapPin,
    FileText,
    Check,
    Plus,
    Trash2,
    AlertTriangle,
    CheckCircle,
    Stethoscope,
    Heart,
    Pill,
    Phone,
    Shield,
    Activity,
    ChevronDown,
    ChevronUp,
    UserCog,
    Calendar,
} from 'lucide-react';
import BookingsTabs from '../BookingsTabs';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { isEmployeeOnShift, isEmployeeDuringBreak } from '@/lib/shiftData';
import { resolveServicePrice } from '@/lib/priceResolver';
import type { ServicePriceOverride } from '@/lib/priceResolver';
import { providerApi, publicApi, type Branch } from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Service {
    id: string;
    name: string;
    duration: string;
    durationMins: number;
    price: number;
    category: string;
}

interface Employee {
    id: string;
    name: string;
    role: string;
    color: string;
    level?: string;
}

interface Room {
    id: string;
    name: string;
}

interface BookingItem {
    id: string;
    service: Service;
    employee: Employee;
    date: string;
    time: string;
    room: string;
}

interface PatientForm {
    age: string;
    gender: string;
    bloodType: string;
    hasAllergies: boolean;
    allergies: string;
    chronicConditions: string[];
    currentMedications: string;
    previousProcedures: string;
    chiefComplaint: string;
    symptoms: string;
    symptomsDuration: string;
    painLevel: string;
    evaluatedBefore: boolean;
    emergencyName: string;
    emergencyPhone: string;
    emergencyRelation: string;
    insuranceProvider: string;
    insurancePolicyNo: string;
}

// ─── Static data ─────────────────────────────────────────────────────────────

const SERVICES: Record<string, Service[]> = {
    barber: [
        { id: 'B01', name: 'Classic Haircut', duration: '30 min', durationMins: 30, price: 80, category: 'Cut' },
        { id: 'B02', name: 'Skin Fade', duration: '45 min', durationMins: 45, price: 120, category: 'Cut' },
        { id: 'B03', name: 'Beard Trim & Shape', duration: '20 min', durationMins: 20, price: 60, category: 'Beard' },
        { id: 'B04', name: 'Hair & Beard Combo', duration: '60 min', durationMins: 60, price: 160, category: 'Combo' },
        { id: 'B05', name: 'Hot Towel Shave', duration: '30 min', durationMins: 30, price: 90, category: 'Shave' },
        {
            id: 'B06',
            name: 'Keratin Smoothing',
            duration: '90 min',
            durationMins: 90,
            price: 350,
            category: 'Treatment',
        },
        { id: 'B07', name: 'Kids Haircut', duration: '20 min', durationMins: 20, price: 50, category: 'Cut' },
    ],
    salon: [
        { id: 'S01', name: 'Haircut & Styling', duration: '45 min', durationMins: 45, price: 150, category: 'Hair' },
        { id: 'S02', name: 'Hair Coloring', duration: '90 min', durationMins: 90, price: 400, category: 'Hair' },
        { id: 'S03', name: 'Keratin Treatment', duration: '120 min', durationMins: 120, price: 500, category: 'Hair' },
        { id: 'S04', name: 'Classic Facial', duration: '60 min', durationMins: 60, price: 200, category: 'Skin' },
        { id: 'S05', name: 'HydraFacial', duration: '75 min', durationMins: 75, price: 450, category: 'Skin' },
        { id: 'S06', name: 'Gel Manicure', duration: '45 min', durationMins: 45, price: 150, category: 'Nails' },
        { id: 'S07', name: 'Swedish Massage', duration: '60 min', durationMins: 60, price: 300, category: 'Body' },
        { id: 'S08', name: 'Laser Hair Removal', duration: '30 min', durationMins: 30, price: 250, category: 'Laser' },
        { id: 'S09', name: 'Bridal Makeup', duration: '120 min', durationMins: 120, price: 800, category: 'Makeup' },
        { id: 'S10', name: 'Eyelash Extensions', duration: '90 min', durationMins: 90, price: 350, category: 'Lash' },
    ],
    clinic: [
        {
            id: 'C01',
            name: 'General Consultation',
            duration: '30 min',
            durationMins: 30,
            price: 200,
            category: 'Consultation',
        },
        {
            id: 'C02',
            name: 'Follow-up Visit',
            duration: '20 min',
            durationMins: 20,
            price: 120,
            category: 'Consultation',
        },
        { id: 'C03', name: 'Dental Checkup', duration: '45 min', durationMins: 45, price: 250, category: 'Dental' },
        { id: 'C04', name: 'Laser Session', duration: '30 min', durationMins: 30, price: 400, category: 'Laser' },
        { id: 'C05', name: 'Botox Treatment', duration: '45 min', durationMins: 45, price: 800, category: 'Aesthetic' },
        {
            id: 'C06',
            name: 'Dermatology Exam',
            duration: '30 min',
            durationMins: 30,
            price: 300,
            category: 'Dermatology',
        },
        {
            id: 'C07',
            name: 'Physiotherapy Session',
            duration: '60 min',
            durationMins: 60,
            price: 350,
            category: 'Physio',
        },
        { id: 'C08', name: 'Lab Tests', duration: '20 min', durationMins: 20, price: 150, category: 'Lab' },
    ],
};

const EMPLOYEES: Record<string, Employee[]> = {
    barber: [
        { id: 'E01', name: 'Ahmed Fathy', role: 'Master Barber', color: '#3b82f6', level: 'Senior' },
        { id: 'E02', name: 'Karim Saad', role: 'Senior Barber', color: '#8b5cf6', level: 'Senior' },
        { id: 'E03', name: 'Omar Nasser', role: 'Barber', color: '#10b981', level: 'Mid' },
        { id: 'E04', name: 'Hassan Ali', role: 'Junior Barber', color: '#f59e0b', level: 'Junior' },
    ],
    salon: [
        { id: 'E01', name: 'Sara Ahmed', role: 'Senior Stylist', color: '#ec4899', level: 'Senior' },
        { id: 'E02', name: 'Nora Ali', role: 'Skin Specialist', color: '#8b5cf6', level: 'Senior' },
        { id: 'E03', name: 'Layla Hassan', role: 'Senior Therapist', color: '#10b981', level: 'Senior' },
        { id: 'E04', name: 'Reem Mohamed', role: 'Massage Therapist', color: '#3b82f6', level: 'Mid' },
        { id: 'E05', name: 'Hana Youssef', role: 'Nail Technician', color: '#f59e0b', level: 'Junior' },
    ],
    clinic: [
        { id: 'E01', name: 'Dr. Ahmed Kamal', role: 'General Physician', color: '#3b82f6', level: 'Senior' },
        { id: 'E02', name: 'Dr. Mona Taher', role: 'Dermatologist', color: '#8b5cf6', level: 'Senior' },
        { id: 'E03', name: 'Dr. Yasser Nour', role: 'Dentist', color: '#10b981', level: 'Mid' },
        { id: 'E04', name: 'Dr. Rana Farid', role: 'Physiotherapist', color: '#f59e0b', level: 'Mid' },
        { id: 'E05', name: 'Dr. Omar Sayed', role: 'Aesthetic Specialist', color: '#ec4899', level: 'Senior' },
    ],
};

const ROOMS: Room[] = [
    { id: 'R1', name: 'Room 1 – VIP' },
    { id: 'R2', name: 'Room 2 – Standard' },
    { id: 'R3', name: 'Room 3 – Treatment' },
    { id: 'R4', name: 'Room 4 – Laser' },
];

const CHRONIC_CONDITIONS = [
    'Diabetes',
    'Hypertension',
    'Heart Disease',
    'Asthma',
    'Thyroid Disorder',
    'Kidney Disease',
    'Liver Disease',
    'Cancer',
    'Autoimmune Disease',
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const TODAY = new Date().toISOString().split('T')[0];

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
    const h = Math.floor(i / 2) + 9;
    const m = i % 2 === 0 ? '00' : '30';
    return `${h.toString().padStart(2, '0')}:${m}`;
});

// Mock schedule data — replace with API calls
const EMP_BUSY: Record<string, Record<string, string[]>> = {
    E01: { [TODAY]: ['09:00', '09:30', '10:30', '11:00', '14:00', '14:30'] },
    E02: { [TODAY]: ['10:00', '10:30', '11:00', '15:00', '15:30'] },
    E03: { [TODAY]: ['09:30', '12:00', '12:30', '16:00', '16:30'] },
    E04: { [TODAY]: ['11:30', '13:00', '13:30', '17:00'] },
    E05: { [TODAY]: ['09:00', '09:30', '10:00', '14:30', '15:00'] },
};

const ROOM_BUSY: Record<string, Record<string, string[]>> = {
    R1: { [TODAY]: ['09:00', '09:30', '10:00', '14:00', '14:30'] },
    R2: { [TODAY]: ['10:30', '11:00', '11:30', '15:00'] },
    R3: { [TODAY]: ['09:00', '12:00', '12:30', '13:00'] },
    R4: { [TODAY]: ['11:00', '16:00', '16:30'] },
};

// Fallback branch ID — overridden by API data when available
const CURRENT_BRANCH_ID = '1';

// Mock price overrides — used as fallback when API data unavailable
const MOCK_PRICE_OVERRIDES: ServicePriceOverride[] = [
    // Tier overrides (salon)
    { id: 'to-1', serviceId: 'S01', pricingTier: 'Senior', price: 180 },
    { id: 'to-2', serviceId: 'S01', pricingTier: 'Junior', price: 100 },
    { id: 'to-3', serviceId: 'S02', pricingTier: 'Senior', price: 550 },
    { id: 'to-4', serviceId: 'S03', pricingTier: 'Senior', price: 900 },
    // Employee override
    { id: 'eo-1', serviceId: 'S02', employeeId: 'E01', price: 520 },
    // Tier overrides (barber)
    { id: 'to-5', serviceId: 'B01', pricingTier: 'Senior', price: 80 },
    { id: 'to-6', serviceId: 'B01', pricingTier: 'Junior', price: 40 },
    // Tier overrides (clinic)
    { id: 'to-7', serviceId: 'C01', pricingTier: 'Senior', price: 300 },
    { id: 'to-8', serviceId: 'C05', pricingTier: 'Senior', price: 1000 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function busySlotsInRange(
    map: Record<string, Record<string, string[]>>,
    id: string,
    date: string,
    startTime: string,
    durationMins: number
): string[] {
    const busy = map[id]?.[date] ?? [];
    const [sh, sm] = startTime.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = start + durationMins;
    return busy.filter(t => {
        const [th, tm] = t.split(':').map(Number);
        const tMin = th * 60 + tm;
        return tMin >= start && tMin < end;
    });
}

function initItem(services: Service[], employees: Employee[], prev?: BookingItem): BookingItem {
    return {
        id: Date.now().toString(),
        service: services[0],
        employee: employees[0],
        date: prev?.date ?? TODAY,
        time: prev?.time ?? '10:00',
        room: '',
    };
}

// ─── Design tokens ───────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
    // Layout
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    header: { display: 'flex', alignItems: 'center', gap: 'var(--space-4)' },
    h1: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-6)', alignItems: 'start' },
    col: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' },
    row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' },
    // Cards
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
    },
    cardConflict: {
        background: 'var(--bg-primary)',
        border: '1px solid #f59e0b',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
    },
    cardTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-semibold)',
        marginBottom: 'var(--space-5)',
        color: 'var(--text-primary)',
    },
    summarySticky: { position: 'sticky' as const, top: 'var(--space-5)' },
    // Fields
    field: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' },
    label: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' },
    input: {
        height: 42,
        padding: '0 var(--space-4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        width: '100%',
    },
    inputErr: {
        height: 42,
        padding: '0 var(--space-4)',
        border: '1px solid #ef4444',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        width: '100%',
    },
    select: {
        height: 42,
        padding: '0 var(--space-4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        width: '100%',
        cursor: 'pointer',
    },
    selectErr: {
        height: 42,
        padding: '0 var(--space-4)',
        border: '1px solid #ef4444',
        borderRadius: 'var(--radius-lg)',
        background: '#fef2f2',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        width: '100%',
        cursor: 'pointer',
    },
    textarea: {
        padding: 'var(--space-3) var(--space-4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        width: '100%',
        minHeight: 80,
        resize: 'vertical' as const,
    },
    // Hints
    hint: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 },
    hintOk: {
        fontSize: 'var(--text-xs)',
        color: '#10b981',
        marginTop: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
    },
    hintErr: {
        fontSize: 'var(--text-xs)',
        color: '#ef4444',
        marginTop: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
    },
    // Banners
    bannerErr: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: '#dc2626',
    },
    bannerWarn: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: '#92400e',
    },
    // Summary rows
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: 'var(--space-3) 0',
        borderBottom: '1px solid var(--border-color)',
        fontSize: 'var(--text-sm)',
    },
    summaryLabel: { color: 'var(--text-tertiary)' },
    summaryValue: { fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: 'var(--space-4) 0',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-bold)',
        marginTop: 'var(--space-2)',
    },
    // Buttons
    btnPrimary: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-3)',
        background: 'var(--color-primary-500)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-semibold)',
        width: '100%',
        marginTop: 'var(--space-4)',
        cursor: 'pointer',
        border: 'none',
    },
    btnOutline: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-3)',
        background: 'transparent',
        border: '1px dashed var(--color-primary-500)',
        color: 'var(--color-primary-500)',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-semibold)',
        width: '100%',
        cursor: 'pointer',
    },
    btnGhost: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        fontSize: 'var(--text-sm)',
    },
    btnCollapse: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        color: 'var(--color-primary-500)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-medium)',
        marginTop: 'var(--space-2)',
        padding: 0,
    },
    // Misc
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-medium)',
    },
    dot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 2 },
    divider: { borderTop: '1px dashed var(--border-color)', margin: 'var(--space-4) 0', paddingTop: 'var(--space-4)' },
    availRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-2) 0',
        borderBottom: '1px dashed var(--border-color)',
        fontSize: 'var(--text-xs)',
    },
    condGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 'var(--space-2)',
        marginTop: 'var(--space-2)',
    },
    painTrack: { display: 'flex', gap: 4, marginTop: 'var(--space-2)', flexWrap: 'wrap' as const },
    searchWrap: { position: 'relative' as const, marginBottom: 'var(--space-4)' },
    searchIcon: {
        position: 'absolute' as const,
        left: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-tertiary)',
    },
    checkRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-2)',
        cursor: 'pointer',
    },
    checkLabel: { fontSize: 'var(--text-sm)', color: 'var(--text-primary)', cursor: 'pointer' },
};

// ─── Small shared components ──────────────────────────────────────────────────

function SlotHint({ empId, date, time, dur }: { empId: string; date: string; time: string; dur: number }) {
    const busy = busySlotsInRange(EMP_BUSY, empId, date, time, dur);
    return busy.length > 0 ? (
        <div style={s.hintErr}>
            <AlertTriangle size={11} />
            Staff busy at: {busy.join(', ')}
        </div>
    ) : (
        <div style={s.hintOk}>
            <CheckCircle size={11} />
            Staff available
        </div>
    );
}

function RoomHint({ roomId, date, time, dur }: { roomId: string; date: string; time: string; dur: number }) {
    if (!roomId) return <div style={s.hint}>Room will be auto-assigned</div>;
    const busy = busySlotsInRange(ROOM_BUSY, roomId, date, time, dur);
    return busy.length > 0 ? (
        <div style={s.hintErr}>
            <AlertTriangle size={11} />
            Room occupied at: {busy.join(', ')}
        </div>
    ) : (
        <div style={s.hintOk}>
            <CheckCircle size={11} />
            Room available
        </div>
    );
}

function SectionHeader({
    icon,
    label,
    open,
    onToggle,
    required,
}: {
    icon: React.ReactNode;
    label: string;
    open: boolean;
    onToggle: () => void;
    required?: boolean;
}) {
    return (
        <button
            onClick={onToggle}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 'var(--space-2) 0',
                marginBottom: open ? 'var(--space-3)' : 0,
                color: 'var(--text-primary)',
            }}
        >
            <span
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                }}
            >
                {icon}
                {label}
                {required && <span style={{ color: '#ef4444', fontSize: 10 }}>*</span>}
            </span>
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
    );
}

// ─── ServiceBookingCard ───────────────────────────────────────────────────────

function ServiceBookingCard({
    item,
    index,
    services,
    employees,
    isClinic,
    hasInternalConflict,
    onUpdate,
    onRemove,
    canRemove,
    priceOverrides,
    branchId,
}: {
    item: BookingItem;
    index: number;
    services: Service[];
    employees: Employee[];
    isClinic: boolean;
    hasInternalConflict: boolean;
    onUpdate: (id: string, field: keyof BookingItem, value: string | Service | Employee) => void;
    onRemove: (id: string) => void;
    canRemove: boolean;
    priceOverrides: ServicePriceOverride[];
    branchId: string;
}) {
    const [showAvail, setShowAvail] = useState(false);

    const empBusy = busySlotsInRange(EMP_BUSY, item.employee.id, item.date, item.time, item.service.durationMins);
    const roomBusy = item.room
        ? busySlotsInRange(ROOM_BUSY, item.room, item.date, item.time, item.service.durationMins)
        : [];
    const hasIssue = hasInternalConflict || empBusy.length > 0 || roomBusy.length > 0;

    const label = isClinic ? 'Appointment' : 'Service';

    return (
        <div style={hasIssue ? s.cardConflict : s.card}>
            {/* Header row */}
            <div style={{ ...s.cardTitle, justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Scissors size={18} />
                    {label} {index + 1}
                    {hasIssue && (
                        <span style={{ ...s.badge, background: '#fef2f2', color: '#dc2626' }}>
                            <AlertTriangle size={10} /> Conflict
                        </span>
                    )}
                </span>
                {canRemove && (
                    <button
                        onClick={() => onRemove(item.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        <Trash2 size={15} /> Remove
                    </button>
                )}
            </div>

            {hasInternalConflict && (
                <div style={s.bannerErr}>
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                    <span>This staff member is already assigned to another service at an overlapping time.</span>
                </div>
            )}

            {/* Service + Employee */}
            <div style={s.row2}>
                <div style={s.field}>
                    <label style={s.label}>{isClinic ? 'Service / Procedure' : 'Service'}</label>
                    <select
                        style={s.select}
                        value={item.service.id}
                        onChange={e =>
                            onUpdate(item.id, 'service', services.find(sv => sv.id === e.target.value) ?? services[0])
                        }
                    >
                        {services.map(sv => (
                            <option key={sv.id} value={sv.id}>
                                {sv.name} — {sv.price} EGP ({sv.duration})
                            </option>
                        ))}
                    </select>
                    {(() => {
                        const resolved = resolveServicePrice(item.service, item.employee, branchId, priceOverrides);
                        return (
                            <span style={s.hint}>
                                {item.service.category} · {item.service.duration}
                                {resolved.source !== 'base' && (
                                    <span
                                        style={{
                                            marginLeft: 8,
                                            color: 'var(--color-primary-500)',
                                            fontWeight: 'var(--font-semibold)',
                                        }}
                                    >
                                        → {resolved.price} EGP ({resolved.source})
                                    </span>
                                )}
                            </span>
                        );
                    })()}
                </div>

                <div style={s.field}>
                    <label style={s.label}>{isClinic ? 'Doctor / Specialist' : 'Employee'}</label>
                    <select
                        style={hasInternalConflict ? s.selectErr : s.select}
                        value={item.employee.id}
                        onChange={e =>
                            onUpdate(
                                item.id,
                                'employee',
                                employees.find(em => em.id === e.target.value) ?? employees[0]
                            )
                        }
                    >
                        {employees.map(em => {
                            const busy = EMP_BUSY[em.id]?.[item.date]?.includes(item.time);
                            const offShift = !isEmployeeOnShift(em.id, em.role, item.date);
                            const onBreak = isEmployeeDuringBreak(em.id, em.role, item.date, item.time);
                            const prefix = offShift ? '⛔ ' : onBreak ? '☕ ' : busy ? '⚠ ' : '✓ ';
                            return (
                                <option key={em.id} value={em.id}>
                                    {prefix}
                                    {em.name} — {em.role}
                                </option>
                            );
                        })}
                    </select>
                    <span style={{ ...s.hint, display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span style={{ ...s.dot, background: item.employee.color }} />
                        {item.employee.role}
                        {!isEmployeeOnShift(item.employee.id, item.employee.role, item.date) && (
                            <span style={{ color: 'var(--color-warning-600)', fontWeight: 600 }}> — Off-shift</span>
                        )}
                        {isEmployeeDuringBreak(item.employee.id, item.employee.role, item.date, item.time) && (
                            <span style={{ color: 'var(--color-warning-600)', fontWeight: 600 }}> — On break</span>
                        )}
                    </span>
                </div>
            </div>

            {/* Date + Time */}
            <div style={s.row2}>
                <div style={s.field}>
                    <label style={s.label}>Date</label>
                    <input
                        style={s.input}
                        type="date"
                        value={item.date}
                        onChange={e => onUpdate(item.id, 'date', e.target.value)}
                    />
                </div>

                <div style={s.field}>
                    <label style={s.label}>Time</label>
                    <select
                        style={empBusy.length > 0 ? s.selectErr : s.select}
                        value={item.time}
                        onChange={e => onUpdate(item.id, 'time', e.target.value)}
                    >
                        {TIME_SLOTS.map(ts => {
                            const busy = EMP_BUSY[item.employee.id]?.[item.date]?.includes(ts);
                            return (
                                <option key={ts} value={ts}>
                                    {busy ? `⚠ ${ts} (busy)` : ts}
                                </option>
                            );
                        })}
                    </select>
                    <SlotHint
                        empId={item.employee.id}
                        date={item.date}
                        time={item.time}
                        dur={item.service.durationMins}
                    />
                </div>
            </div>

            {/* Staff availability panel */}
            <div style={{ marginTop: 'var(--space-2)' }}>
                <button style={s.btnCollapse} onClick={() => setShowAvail(v => !v)}>
                    <Activity size={13} />
                    {showAvail ? 'Hide' : 'Show'} staff availability at {item.time}
                    {showAvail ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {showAvail && (
                    <div
                        style={{
                            marginTop: 'var(--space-3)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-3)',
                        }}
                    >
                        {employees.map(em => {
                            const busy = EMP_BUSY[em.id]?.[item.date]?.includes(item.time) ?? false;
                            return (
                                <div key={em.id} style={s.availRow}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <span style={{ ...s.dot, background: em.color }} />
                                        <strong>{em.name}</strong>
                                        <span style={{ color: 'var(--text-tertiary)' }}>— {em.role}</span>
                                    </span>
                                    <span
                                        style={{
                                            ...s.badge,
                                            background: busy ? '#fef2f2' : '#f0fdf4',
                                            color: busy ? '#dc2626' : '#16a34a',
                                        }}
                                    >
                                        {busy ? '● Busy' : '● Available'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Room */}
            <div style={{ ...s.field, marginTop: 'var(--space-4)' }}>
                <label style={s.label}>
                    <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
                    Room
                </label>
                <select
                    style={roomBusy.length > 0 ? s.selectErr : s.select}
                    value={item.room}
                    onChange={e => onUpdate(item.id, 'room', e.target.value)}
                >
                    <option value="">Auto-assign</option>
                    {ROOMS.map(r => {
                        const occ = ROOM_BUSY[r.id]?.[item.date]?.includes(item.time);
                        return (
                            <option key={r.id} value={r.id}>
                                {occ ? `⚠ ${r.name} (occupied)` : `✓ ${r.name}`}
                            </option>
                        );
                    })}
                </select>
                <RoomHint roomId={item.room} date={item.date} time={item.time} dur={item.service.durationMins} />
            </div>
        </div>
    );
}

// ─── PatientIntakeForm ────────────────────────────────────────────────────────

function PatientIntakeForm({
    form,
    onChange,
    onConditionToggle,
    t,
}: {
    form: PatientForm;
    onChange: (field: keyof PatientForm, value: string | boolean | string[]) => void;
    onConditionToggle: (cond: string) => void;
    t: (key: string) => string;
}) {
    const [sections, setSections] = useState({
        personal: true,
        medical: true,
        visit: true,
        emergency: false,
        insurance: false,
    });
    const toggle = (k: keyof typeof sections) => setSections(prev => ({ ...prev, [k]: !prev[k] }));

    return (
        <div style={s.card}>
            <div style={{ ...s.cardTitle, marginBottom: 'var(--space-2)' }}>
                <Stethoscope size={18} />
                {t('bookings.patientForm') || 'Patient Intake Form'}
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
                {t('bookings.patientFormDesc') || 'Please fill in patient details before entering the doctor.'}
            </p>

            {/* Personal Information */}
            <SectionHeader
                icon={<User size={15} />}
                label="Personal Information"
                open={sections.personal}
                onToggle={() => toggle('personal')}
            />
            {sections.personal && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={s.row3}>
                        <div style={s.field}>
                            <label style={s.label}>Age</label>
                            <input
                                style={s.input}
                                type="number"
                                min={0}
                                max={150}
                                placeholder="Years"
                                value={form.age}
                                onChange={e => onChange('age', e.target.value)}
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Gender</label>
                            <select
                                style={s.select}
                                value={form.gender}
                                onChange={e => onChange('gender', e.target.value)}
                            >
                                <option value="">Select…</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not">Prefer not to say</option>
                            </select>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Blood Type</label>
                            <select
                                style={s.select}
                                value={form.bloodType}
                                onChange={e => onChange('bloodType', e.target.value)}
                            >
                                <option value="">Unknown</option>
                                {BLOOD_TYPES.map(bt => (
                                    <option key={bt} value={bt}>
                                        {bt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div style={s.divider} />

            {/* Medical History */}
            <SectionHeader
                icon={<Heart size={15} />}
                label="Medical History"
                open={sections.medical}
                onToggle={() => toggle('medical')}
            />
            {sections.medical && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={s.field}>
                        <label style={s.checkRow}>
                            <input
                                type="checkbox"
                                checked={form.hasAllergies}
                                onChange={e => onChange('hasAllergies', e.target.checked)}
                            />
                            <span style={s.checkLabel}>Patient has known allergies</span>
                        </label>
                        {form.hasAllergies && (
                            <textarea
                                style={{ ...s.textarea, minHeight: 60 }}
                                placeholder="List allergies (e.g. Penicillin, Latex, Ibuprofen)..."
                                value={form.allergies}
                                onChange={e => onChange('allergies', e.target.value)}
                            />
                        )}
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>Chronic Conditions</label>
                        <div style={s.condGrid}>
                            {CHRONIC_CONDITIONS.map(cond => (
                                <label key={cond} style={s.checkRow}>
                                    <input
                                        type="checkbox"
                                        checked={form.chronicConditions.includes(cond)}
                                        onChange={() => onConditionToggle(cond)}
                                    />
                                    <span style={s.checkLabel}>{cond}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div style={s.row2}>
                        <div style={s.field}>
                            <label style={s.label}>
                                <Pill size={13} style={{ display: 'inline', marginRight: 4 }} />
                                Current Medications
                            </label>
                            <textarea
                                style={{ ...s.textarea, minHeight: 60 }}
                                placeholder="Medications and dosages..."
                                value={form.currentMedications}
                                onChange={e => onChange('currentMedications', e.target.value)}
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Previous Surgeries / Procedures</label>
                            <textarea
                                style={{ ...s.textarea, minHeight: 60 }}
                                placeholder="Previous surgeries, major procedures..."
                                value={form.previousProcedures}
                                onChange={e => onChange('previousProcedures', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div style={s.divider} />

            {/* Current Visit */}
            <SectionHeader
                icon={<Activity size={15} />}
                label="Current Visit"
                open={sections.visit}
                onToggle={() => toggle('visit')}
                required
            />
            {sections.visit && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={s.field}>
                        <label style={s.label}>
                            Chief Complaint / Reason for Visit <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            style={form.chiefComplaint ? s.input : s.inputErr}
                            placeholder="Main reason for today's visit..."
                            value={form.chiefComplaint}
                            onChange={e => onChange('chiefComplaint', e.target.value)}
                        />
                        {!form.chiefComplaint && (
                            <span style={s.hintErr}>
                                <AlertTriangle size={11} /> Required
                            </span>
                        )}
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>{t('bookings.medicalNotes') || 'Symptoms Description'}</label>
                        <textarea
                            style={s.textarea}
                            placeholder={
                                t('bookings.medicalNotesPlaceholder') || "Describe the patient's symptoms in detail..."
                            }
                            value={form.symptoms}
                            onChange={e => onChange('symptoms', e.target.value)}
                        />
                    </div>
                    <div style={s.row3}>
                        <div style={s.field}>
                            <label style={s.label}>Duration of Symptoms</label>
                            <select
                                style={s.select}
                                value={form.symptomsDuration}
                                onChange={e => onChange('symptomsDuration', e.target.value)}
                            >
                                <option value="">Select…</option>
                                <option value="today">Today</option>
                                <option value="2-3days">2–3 days</option>
                                <option value="1week">About a week</option>
                                <option value="2weeks">2 weeks</option>
                                <option value="1month">1 month</option>
                                <option value="3months">2–3 months</option>
                                <option value="6months+">6+ months</option>
                                <option value="chronic">Chronic / ongoing</option>
                            </select>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Evaluated Before?</label>
                            <select
                                style={s.select}
                                value={form.evaluatedBefore ? 'yes' : 'no'}
                                onChange={e => onChange('evaluatedBefore', e.target.value === 'yes')}
                            >
                                <option value="no">No — first time</option>
                                <option value="yes">Yes — follow-up</option>
                            </select>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Pain Level (0–10)</label>
                            <div style={s.painTrack}>
                                {Array.from({ length: 11 }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onChange('painLevel', String(i))}
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            border:
                                                form.painLevel === String(i)
                                                    ? '2px solid var(--color-primary-500)'
                                                    : '1px solid var(--border-color)',
                                            background:
                                                form.painLevel === String(i)
                                                    ? i <= 3
                                                        ? '#dcfce7'
                                                        : i <= 6
                                                          ? '#fef3c7'
                                                          : '#fee2e2'
                                                    : 'var(--bg-secondary)',
                                            cursor: 'pointer',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-primary)',
                                        }}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={s.divider} />

            {/* Emergency Contact */}
            <SectionHeader
                icon={<Phone size={15} />}
                label="Emergency Contact"
                open={sections.emergency}
                onToggle={() => toggle('emergency')}
            />
            {sections.emergency && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={s.row3}>
                        <div style={s.field}>
                            <label style={s.label}>Contact Name</label>
                            <input
                                style={s.input}
                                placeholder="Full name"
                                value={form.emergencyName}
                                onChange={e => onChange('emergencyName', e.target.value)}
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Phone</label>
                            <input
                                style={s.input}
                                placeholder="+20 1XX XXX XXXX"
                                value={form.emergencyPhone}
                                onChange={e => onChange('emergencyPhone', e.target.value)}
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Relationship</label>
                            <select
                                style={s.select}
                                value={form.emergencyRelation}
                                onChange={e => onChange('emergencyRelation', e.target.value)}
                            >
                                <option value="">Select…</option>
                                <option value="spouse">Spouse</option>
                                <option value="parent">Parent</option>
                                <option value="child">Child</option>
                                <option value="sibling">Sibling</option>
                                <option value="friend">Friend</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div style={s.divider} />

            {/* Insurance */}
            <SectionHeader
                icon={<Shield size={15} />}
                label="Insurance (Optional)"
                open={sections.insurance}
                onToggle={() => toggle('insurance')}
            />
            {sections.insurance && (
                <div style={s.row2}>
                    <div style={s.field}>
                        <label style={s.label}>Insurance Provider</label>
                        <input
                            style={s.input}
                            placeholder="e.g. Allianz, AXA..."
                            value={form.insuranceProvider}
                            onChange={e => onChange('insuranceProvider', e.target.value)}
                        />
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>Policy Number</label>
                        <input
                            style={s.input}
                            placeholder="Policy / card number"
                            value={form.insurancePolicyNo}
                            onChange={e => onChange('insurancePolicyNo', e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── BookingSummary ───────────────────────────────────────────────────────────

function BookingSummary({
    items,
    clientName,
    discount,
    conflicts,
    onConfirm,
    t,
    priceOverrides,
    branchId,
}: {
    items: BookingItem[];
    clientName: string;
    discount: number;
    conflicts: Set<string>;
    onConfirm: () => void;
    t: (key: string) => string;
    priceOverrides: ServicePriceOverride[];
    branchId: string;
}) {
    const subtotal = items.reduce((sum, i) => {
        const resolved = resolveServicePrice(i.service, i.employee, branchId, priceOverrides);
        return sum + resolved.price;
    }, 0);
    const discountAmt = (subtotal * discount) / 100;
    const total = subtotal - discountAmt;
    const hasConflict = conflicts.size > 0;

    const uniqueStaff = Array.from(new Map(items.map(i => [i.employee.id, i.employee])).values());

    return (
        <div style={s.summarySticky}>
            {/* Totals card */}
            <div style={s.card}>
                <div style={s.cardTitle}>
                    <FileText size={18} /> {t('bookings.summary')}
                </div>

                <div style={s.summaryRow}>
                    <span style={s.summaryLabel}>{t('bookings.client')}</span>
                    <span style={s.summaryValue}>{clientName || t('bookings.walkIn')}</span>
                </div>

                {items.map(item => {
                    const resolved = resolveServicePrice(item.service, item.employee, branchId, priceOverrides);
                    return (
                        <div
                            key={item.id}
                            style={{ padding: 'var(--space-2) 0', borderBottom: '1px dashed var(--border-color)' }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: 4,
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-medium)',
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {conflicts.has(item.id) && <AlertTriangle size={12} color="#ef4444" />}
                                    {item.service.name}
                                </span>
                                <span>
                                    {resolved.source !== 'base' && (
                                        <span
                                            style={{
                                                textDecoration: 'line-through',
                                                color: 'var(--text-tertiary)',
                                                marginRight: 6,
                                                fontSize: 'var(--text-xs)',
                                            }}
                                        >
                                            {item.service.price}
                                        </span>
                                    )}
                                    {resolved.price} EGP
                                </span>
                            </div>
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                }}
                            >
                                <span style={{ ...s.dot, background: item.employee.color }} />
                                {item.employee.name}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                                <Calendar size={10} style={{ display: 'inline', marginRight: 3 }} />
                                {item.date} {item.time} · {item.service.duration}
                            </div>
                            {item.room && (
                                <div
                                    style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}
                                >
                                    <MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />
                                    {ROOMS.find(r => r.id === item.room)?.name ?? item.room}
                                </div>
                            )}
                        </div>
                    );
                })}

                <div style={{ ...s.summaryRow, marginTop: 'var(--space-2)' }}>
                    <span style={s.summaryLabel}>Subtotal</span>
                    <span style={s.summaryValue}>{subtotal} EGP</span>
                </div>
                {discount > 0 && (
                    <div style={s.summaryRow}>
                        <span style={s.summaryLabel}>Discount ({discount}%)</span>
                        <span style={{ ...s.summaryValue, color: '#ef4444' }}>-{discountAmt.toFixed(0)} EGP</span>
                    </div>
                )}
                <div style={s.totalRow}>
                    <span>{t('bookings.total')}</span>
                    <span style={{ color: 'var(--color-primary-600)' }}>{total.toFixed(0)} EGP</span>
                </div>

                {hasConflict && (
                    <div style={{ ...s.bannerWarn, margin: '0 0 var(--space-3)' }}>
                        <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>
                            Resolve {conflicts.size / 2} conflict{conflicts.size / 2 > 1 ? 's' : ''} before confirming.
                        </span>
                    </div>
                )}

                <button style={{ ...s.btnPrimary, opacity: hasConflict ? 0.6 : 1 }} onClick={onConfirm}>
                    <Check size={16} /> {t('bookings.confirmBooking')}
                </button>
            </div>

            {/* Assigned staff card */}
            <div style={{ ...s.card, marginTop: 'var(--space-4)' }}>
                <div
                    style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        marginBottom: 'var(--space-3)',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                    }}
                >
                    <UserCog size={15} /> Assigned Staff
                </div>
                {uniqueStaff.map(emp => (
                    <div
                        key={emp.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            marginBottom: 'var(--space-2)',
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 'var(--radius-full)',
                                background: emp.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: 11,
                                fontWeight: 'bold',
                                flexShrink: 0,
                            }}
                        >
                            {emp.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')
                                .slice(0, 2)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                {emp.name}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{emp.role}</div>
                        </div>
                        <span
                            style={{
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-medium)',
                                color: 'var(--color-primary-500)',
                            }}
                        >
                            {items.filter(i => i.employee.id === emp.id).length}×
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewBookingPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const { t } = useTranslation();
    const { user } = useAuth();

    const businessType = (user?.businessType ?? 'salon') as 'barber' | 'salon' | 'clinic';
    const isClinic = businessType === 'clinic';

    // ── API-fetched data (falls back to mock) ──
    const [apiServices, setApiServices] = useState<Service[] | null>(null);
    const [apiEmployees, setApiEmployees] = useState<Employee[] | null>(null);
    const [apiBranches, setApiBranches] = useState<Branch[]>([]);
    const [apiPriceOverrides, setApiPriceOverrides] = useState<ServicePriceOverride[]>(MOCK_PRICE_OVERRIDES);
    const [_availableDates, setAvailableDates] = useState<string[]>([]);
    const [_availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [svcRes, empRes, brRes, priceRes] = await Promise.allSettled([
                    providerApi.getServices(),
                    providerApi.getEmployees(),
                    providerApi.getBranches(),
                    providerApi.getServicePrices(),
                ]);

                if (cancelled) return;

                if (svcRes.status === 'fulfilled' && svcRes.value.success && svcRes.value.data) {
                    const mapped: Service[] = svcRes.value.data.map(s => ({
                        id: s.uuid,
                        name: s.name,
                        duration: s.estimated_duration_minutes ? `${s.estimated_duration_minutes} min` : '30 min',
                        durationMins: s.estimated_duration_minutes ?? 30,
                        price: 0, // resolved via pricing API
                        category: s.sub_category?.name ?? 'General',
                    }));
                    if (mapped.length > 0) setApiServices(mapped);
                }

                if (empRes.status === 'fulfilled' && empRes.value.success && empRes.value.data) {
                    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
                    const mapped: Employee[] = empRes.value.data.map((e, i) => ({
                        id: e.uuid,
                        name: e.name,
                        role: e.branch?.name ?? 'Staff',
                        color: colors[i % colors.length],
                    }));
                    if (mapped.length > 0) setApiEmployees(mapped);
                }

                if (brRes.status === 'fulfilled' && brRes.value.success && brRes.value.data) {
                    setApiBranches(brRes.value.data);
                }

                if (priceRes.status === 'fulfilled' && priceRes.value.success && priceRes.value.data) {
                    const mapped: ServicePriceOverride[] = priceRes.value.data.map(p => ({
                        id: p.uuid,
                        serviceId: p.service_uuid,
                        employeeId: p.employee_uuid ?? undefined,
                        branchId: p.branch_uuid ?? undefined,
                        pricingTier: p.pricing_group?.name ?? undefined,
                        price: p.price,
                    }));
                    if (mapped.length > 0) setApiPriceOverrides(mapped);
                }
            } catch {
                // Silently fall back to mock data
            } finally {
                if (!cancelled) setDataLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const services = apiServices ?? SERVICES[businessType] ?? SERVICES.salon;
    const employees = apiEmployees ?? EMPLOYEES[businessType] ?? EMPLOYEES.salon;

    // ── Fetch available dates when branch/service/employee changes ──
    const _fetchAvailability = useCallback(
        async (branchUuid: string, serviceUuid: string, employeeUuid: string, date: string) => {
            if (!branchUuid || !serviceUuid || !employeeUuid) return;
            try {
                const month = date.slice(0, 7); // YYYY-MM
                const [datesRes, slotsRes] = await Promise.allSettled([
                    publicApi.getAvailableDates({
                        branch_uuid: branchUuid,
                        service_uuid: serviceUuid,
                        employee_uuid: employeeUuid,
                        month,
                    }),
                    publicApi.getAvailableSlots({
                        branch_uuid: branchUuid,
                        service_uuid: serviceUuid,
                        employee_uuid: employeeUuid,
                        date,
                    }),
                ]);
                if (datesRes.status === 'fulfilled' && datesRes.value.success && datesRes.value.data) {
                    setAvailableDates(datesRes.value.data);
                }
                if (slotsRes.status === 'fulfilled' && slotsRes.value.success && slotsRes.value.data) {
                    setAvailableSlots(slotsRes.value.data);
                }
            } catch {
                // Keep existing slots
            }
        },
        []
    );

    // ── State ──
    const [items, setItems] = useState<BookingItem[]>([initItem(services, employees)]);

    // Re-initialize items when API data loads
    useEffect(() => {
        if (!dataLoading && services.length > 0 && employees.length > 0) {
            setItems(prev => {
                if (prev.length === 1 && prev[0].service.id === (SERVICES[businessType] ?? SERVICES.salon)[0]?.id) {
                    return [initItem(services, employees)];
                }
                return prev;
            });
        }
    }, [dataLoading, services, employees, businessType]);
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState('');
    const [patient, setPatient] = useState<PatientForm>({
        age: '',
        gender: '',
        bloodType: '',
        hasAllergies: false,
        allergies: '',
        chronicConditions: [],
        currentMedications: '',
        previousProcedures: '',
        chiefComplaint: '',
        symptoms: '',
        symptomsDuration: '',
        painLevel: '0',
        evaluatedBefore: false,
        emergencyName: '',
        emergencyPhone: '',
        emergencyRelation: '',
        insuranceProvider: '',
        insurancePolicyNo: '',
    });

    // ── Conflict detection ──
    const conflicts = useMemo(() => {
        const set = new Set<string>();
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const a = items[i],
                    b = items[j];
                if (a.employee.id !== b.employee.id || a.date !== b.date) continue;
                const [ah, am] = a.time.split(':').map(Number);
                const [bh, bm] = b.time.split(':').map(Number);
                const aS = ah * 60 + am,
                    aE = aS + a.service.durationMins;
                const bS = bh * 60 + bm,
                    bE = bS + b.service.durationMins;
                if (aS < bE && bS < aE) {
                    set.add(a.id);
                    set.add(b.id);
                }
            }
        }
        return set;
    }, [items]);

    // ── Handlers ──
    const addItem = () => setItems(prev => [...prev, initItem(services, employees, prev[prev.length - 1])]);
    const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
    const updateItem = (id: string, field: keyof BookingItem, value: string | Service | Employee) =>
        setItems(prev => prev.map(i => (i.id === id ? { ...i, [field]: value } : i)));
    const updatePatient = (field: keyof PatientForm, value: string | boolean | string[]) =>
        setPatient(prev => ({ ...prev, [field]: value }));
    const toggleCondition = (cond: string) =>
        setPatient(prev => ({
            ...prev,
            chronicConditions: prev.chronicConditions.includes(cond)
                ? prev.chronicConditions.filter(c => c !== cond)
                : [...prev.chronicConditions, cond],
        }));

    const handleConfirm = async () => {
        if (!clientName.trim() || !clientPhone.trim()) {
            addToast('error', t('bookings.reqFields'));
            return;
        }
        if (conflicts.size > 0) {
            addToast('error', 'Resolve scheduling conflicts before confirming.');
            return;
        }
        if (isClinic && !patient.chiefComplaint.trim()) {
            addToast('error', 'Reason for visit is required for clinic appointments.');
            return;
        }

        // If using real API data, update booking status via API
        if (apiServices && items.length > 0) {
            try {
                for (const item of items) {
                    const mainBranch = apiBranches.find(b => b.is_main) ?? apiBranches[0];
                    if (mainBranch) {
                        // Fetch availability one more time to validate
                        const slotsRes = await publicApi.getAvailableSlots({
                            branch_uuid: mainBranch.uuid,
                            service_uuid: item.service.id,
                            employee_uuid: item.employee.id,
                            date: item.date,
                        });
                        if (slotsRes.success && slotsRes.data && !slotsRes.data.includes(item.time)) {
                            addToast('error', `Time ${item.time} is no longer available for ${item.service.name}`);
                            return;
                        }
                    }
                }
            } catch {
                // Proceed with booking even if validation fails
            }
        }

        addToast('success', `${t('bookings.confirmSuccess')} ${clientName}`);
        router.push('/bookings');
    };

    const businessLabel = { barber: 'Barber', salon: 'Salon', clinic: 'Clinic' }[businessType];

    return (
        <div style={s.page}>
            <BookingsTabs />

            {/* Header */}
            <div style={s.header}>
                <button style={s.btnGhost} onClick={() => router.push('/bookings')}>
                    ← Back
                </button>
                <h1 style={s.h1}>{t('bookings.newBooking')}</h1>
                <span
                    style={{
                        ...s.badge,
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        marginLeft: 8,
                        border: '1px solid var(--border-color)',
                    }}
                >
                    {businessLabel}
                </span>
            </div>

            {/* Global conflict banner */}
            {conflicts.size > 0 && (
                <div style={s.bannerErr}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                        <strong>Scheduling conflict detected.</strong> One or more services are assigned to the same
                        staff member at overlapping times. Please adjust the times or assign different staff.
                    </div>
                </div>
            )}

            <div style={s.formGrid}>
                {/* Left column */}
                <div style={s.col}>
                    {/* Client */}
                    <div style={s.card}>
                        <div style={s.cardTitle}>
                            <User size={18} /> {t('bookings.client')}
                        </div>
                        <div style={s.searchWrap}>
                            <Search size={16} style={s.searchIcon} />
                            <input
                                style={{ ...s.input, paddingInlineStart: 36 }}
                                placeholder={t('bookings.searchClient')}
                                value={clientName}
                                onChange={e => setClientName(e.target.value)}
                            />
                        </div>
                        <div style={s.row2}>
                            <div style={s.field}>
                                <label style={s.label}>
                                    {t('bookings.phone')} <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    style={s.input}
                                    placeholder="+20 1XX XXX XXXX"
                                    value={clientPhone}
                                    onChange={e => setClientPhone(e.target.value)}
                                />
                            </div>
                            <div style={s.field}>
                                <label style={s.label}>{t('bookings.email')}</label>
                                <input style={s.input} type="email" placeholder="client@email.com" />
                            </div>
                        </div>
                    </div>

                    {/* Service / appointment cards */}
                    {items.map((item, index) => (
                        <ServiceBookingCard
                            key={item.id}
                            item={item}
                            index={index}
                            services={services}
                            employees={employees}
                            isClinic={isClinic}
                            hasInternalConflict={conflicts.has(item.id)}
                            onUpdate={updateItem}
                            onRemove={removeItem}
                            canRemove={items.length > 1}
                            priceOverrides={apiPriceOverrides}
                            branchId={apiBranches.find(b => b.is_main)?.uuid ?? CURRENT_BRANCH_ID}
                        />
                    ))}

                    <button style={s.btnOutline} onClick={addItem}>
                        <Plus size={16} />
                        {isClinic
                            ? 'Add Another Appointment'
                            : t('bookings.addAnotherService') || 'Add Another Service'}
                    </button>

                    {/* Notes & discount */}
                    <div style={s.card}>
                        <div style={s.cardTitle}>
                            <FileText size={18} /> {t('bookings.additionalDetails')}
                        </div>
                        <div style={s.row2}>
                            <div style={s.field}>
                                <label style={s.label}>{t('bookings.discount')}</label>
                                <input
                                    style={s.input}
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={discount}
                                    onChange={e => setDiscount(Number(e.target.value))}
                                />
                            </div>
                            <div style={s.field}>
                                <label style={s.label}>{t('bookings.notes')}</label>
                                <textarea
                                    style={{ ...s.textarea, minHeight: 42 }}
                                    placeholder={t('bookings.notesPlaceholder')}
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Patient intake form (clinic only) */}
                    {isClinic && (
                        <PatientIntakeForm
                            form={patient}
                            onChange={updatePatient}
                            onConditionToggle={toggleCondition}
                            t={t}
                        />
                    )}
                </div>

                {/* Right column */}
                <BookingSummary
                    items={items}
                    clientName={clientName}
                    discount={discount}
                    conflicts={conflicts}
                    onConfirm={handleConfirm}
                    t={t}
                    priceOverrides={apiPriceOverrides}
                    branchId={apiBranches.find(b => b.is_main)?.uuid ?? CURRENT_BRANCH_ID}
                />
            </div>
        </div>
    );
}
