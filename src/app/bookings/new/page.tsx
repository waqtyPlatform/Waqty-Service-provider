'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui';
import {
    CalendarDays,
    List,
    DoorOpen,
    Plus,
    Printer,
    User,
    Search,
    Clock,
    Scissors,
    CreditCard,
    MapPin,
    FileText,
    ChevronRight,
    Check,
} from 'lucide-react';
import styles from '../bookings.module.css';
import BookingsTabs from '../BookingsTabs';

const services = [
    { id: 'S01', name: 'Haircut & Styling', duration: '45 min', price: 150, category: 'Hair' },
    { id: 'S02', name: 'Hair Coloring', duration: '90 min', price: 400, category: 'Hair' },
    { id: 'S03', name: 'Keratin Treatment', duration: '120 min', price: 500, category: 'Hair' },
    { id: 'S04', name: 'Classic Facial', duration: '60 min', price: 200, category: 'Skin' },
    { id: 'S05', name: 'HydraFacial', duration: '75 min', price: 450, category: 'Skin' },
    { id: 'S06', name: 'Gel Manicure', duration: '45 min', price: 150, category: 'Nails' },
    { id: 'S07', name: 'Swedish Massage', duration: '60 min', price: 300, category: 'Body' },
    { id: 'S08', name: 'Laser Hair Removal', duration: '30 min', price: 250, category: 'Laser' },
];

const employees = [
    { id: 'E01', name: 'Sara Ahmed', role: 'Senior Stylist' },
    { id: 'E02', name: 'Nora Ali', role: 'Skin Specialist' },
    { id: 'E03', name: 'Layla Hassan', role: 'Senior Therapist' },
    { id: 'E04', name: 'Reem Mohamed', role: 'Massage Therapist' },
    { id: 'E05', name: 'Hana Youssef', role: 'Nail Technician' },
];

const rooms = ['Room 1 – VIP', 'Room 2 – Standard', 'Room 3 – Treatment', 'Room 4 – Laser'];

const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const h = Math.floor(i / 2) + 9;
    const m = i % 2 === 0 ? '00' : '30';
    return `${h.toString().padStart(2, '0')}:${m}`;
});

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    h1: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-6)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    cardTitle: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-5)', color: 'var(--text-primary)' },
    field: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' },
    label: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' },
    input: { height: 42, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', width: '100%' },
    select: { height: 42, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', width: '100%', cursor: 'pointer' },
    textarea: { padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', width: '100%', minHeight: 80, resize: 'vertical' as const },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' },
    summaryCard: { position: 'sticky' as const, top: 'var(--space-5)' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-color)', fontSize: 'var(--text-sm)' },
    summaryLabel: { color: 'var(--text-tertiary)' },
    summaryValue: { fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' },
    totalRow: { display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginTop: 'var(--space-2)' },
    btnPrimary: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', width: '100%', marginTop: 'var(--space-4)', cursor: 'pointer' },
    hint: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    searchWrap: { position: 'relative' as const, marginBottom: 'var(--space-4)' },
    searchIcon: { position: 'absolute' as const, left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
};

export default function NewBookingPage() {
    const [selectedService, setSelectedService] = useState(services[0]);
    const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);
    const [selectedDate, setSelectedDate] = useState('2026-02-18');
    const [selectedTime, setSelectedTime] = useState('10:00');
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [discount, setDiscount] = useState(0);

    const router = useRouter();
    const { addToast } = useToast();

    const total = selectedService.price - (selectedService.price * discount / 100);

    const handleSubmit = () => {
        if (!clientName.trim() || !clientPhone.trim()) {
            addToast('error', 'Client Name and Phone are required fields');
            return;
        }
        addToast('success', `Booking confirmed for ${clientName}`);
        router.push('/bookings');
    };

    return (
        <div style={cs.page}>
            {/* Tabs */}
            <BookingsTabs />

            <div style={cs.header}>
                <h1 style={cs.h1}>New Booking</h1>
            </div>

            <div style={cs.formGrid}>
                {/* Left – Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    {/* Client */}
                    <div style={cs.card}>
                        <div style={cs.cardTitle}><User size={18} /> Client</div>
                        <div style={cs.searchWrap}>
                            <Search size={16} style={cs.searchIcon} />
                            <input
                                style={{ ...cs.input, paddingLeft: 36 }}
                                placeholder="Search existing client or add walk-in..."
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                            />
                        </div>
                        <div style={cs.row}>
                            <div style={cs.field}>
                                <label style={cs.label}>Phone <span style={{ color: 'var(--color-error)' }}>*</span></label>
                                <input
                                    style={cs.input}
                                    placeholder="+20 1XX XXX XXXX"
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                />
                            </div>
                            <div style={cs.field}>
                                <label style={cs.label}>Email</label>
                                <input style={cs.input} type="email" placeholder="client@email.com" />
                            </div>
                        </div>
                    </div>

                    {/* Service */}
                    <div style={cs.card}>
                        <div style={cs.cardTitle}><Scissors size={18} /> Service</div>
                        <div style={cs.field}>
                            <label style={cs.label}>Service</label>
                            <select style={cs.select} value={selectedService.id} onChange={(e) => setSelectedService(services.find(s => s.id === e.target.value) || services[0])}>
                                {services.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name} — {s.price} EGP ({s.duration})</option>
                                ))}
                            </select>
                        </div>
                        <div style={cs.field}>
                            <label style={cs.label}>Employee</label>
                            <select style={cs.select} value={selectedEmployee.id} onChange={(e) => setSelectedEmployee(employees.find(em => em.id === e.target.value) || employees[0])}>
                                {employees.map((em) => (
                                    <option key={em.id} value={em.id}>{em.name} — {em.role}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div style={cs.card}>
                        <div style={cs.cardTitle}><Clock size={18} /> Date & Time</div>
                        <div style={cs.row}>
                            <div style={cs.field}>
                                <label style={cs.label}>Date</label>
                                <input style={cs.input} type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                            </div>
                            <div style={cs.field}>
                                <label style={cs.label}>Time</label>
                                <select style={cs.select} value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                                    {timeSlots.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Room & Notes */}
                    <div style={cs.card}>
                        <div style={cs.cardTitle}><MapPin size={18} /> Additional Details</div>
                        <div style={cs.row}>
                            <div style={cs.field}>
                                <label style={cs.label}>Room</label>
                                <select style={cs.select}>
                                    <option value="">Auto-assign</option>
                                    {rooms.map((r) => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div style={cs.field}>
                                <label style={cs.label}>Discount (%)</label>
                                <input style={cs.input} type="number" min={0} max={100} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
                            </div>
                        </div>
                        <div style={cs.field}>
                            <label style={cs.label}>Notes</label>
                            <textarea style={cs.textarea} placeholder="Internal notes for this booking..." />
                        </div>
                    </div>
                </div>

                {/* Right – Summary */}
                <div style={cs.summaryCard}>
                    <div style={cs.card}>
                        <div style={cs.cardTitle}><FileText size={18} /> Booking Summary</div>
                        <div style={cs.summaryRow}>
                            <span style={cs.summaryLabel}>Client</span>
                            <span style={cs.summaryValue}>{clientName || 'Walk-in'}</span>
                        </div>
                        <div style={cs.summaryRow}>
                            <span style={cs.summaryLabel}>Service</span>
                            <span style={cs.summaryValue}>{selectedService.name}</span>
                        </div>
                        <div style={cs.summaryRow}>
                            <span style={cs.summaryLabel}>Duration</span>
                            <span style={cs.summaryValue}>{selectedService.duration}</span>
                        </div>
                        <div style={cs.summaryRow}>
                            <span style={cs.summaryLabel}>Employee</span>
                            <span style={cs.summaryValue}>{selectedEmployee.name}</span>
                        </div>
                        <div style={cs.summaryRow}>
                            <span style={cs.summaryLabel}>Date & Time</span>
                            <span style={cs.summaryValue}>{selectedDate} at {selectedTime}</span>
                        </div>
                        <div style={cs.summaryRow}>
                            <span style={cs.summaryLabel}>Service Price</span>
                            <span style={cs.summaryValue}>{selectedService.price} EGP</span>
                        </div>
                        {discount > 0 && (
                            <div style={cs.summaryRow}>
                                <span style={cs.summaryLabel}>Discount ({discount}%)</span>
                                <span style={{ ...cs.summaryValue, color: 'var(--color-error)' }}>-{(selectedService.price * discount / 100).toFixed(0)} EGP</span>
                            </div>
                        )}
                        <div style={cs.totalRow}>
                            <span>Total</span>
                            <span style={{ color: 'var(--color-primary-600)' }}>{total.toFixed(0)} EGP</span>
                        </div>
                        <button style={cs.btnPrimary} onClick={handleSubmit}>
                            <Check size={16} /> Confirm Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
