'use client';

import React from 'react';
import EmployeesTabs from '@/components/EmployeesTabs';
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

const shifts = [
    { id: 1, employee: 'Nora Ali', role: 'Senior Stylist', date: '2026-02-18', start: '09:00', end: '17:00', type: 'Work' },
    { id: 2, employee: 'Sara Ahmed', role: 'Nail Technician', date: '2026-02-18', start: '10:00', end: '18:00', type: 'Work' },
    { id: 3, employee: 'Laila Mahmoud', role: 'Receptionist', date: '2026-02-18', start: '08:30', end: '16:30', type: 'Work' },
    { id: 4, employee: 'Hoda Hassan', role: 'Therapist', date: '2026-02-18', type: 'Off' },
    { id: 5, employee: 'Nora Ali', role: 'Senior Stylist', date: '2026-02-19', start: '09:00', end: '17:00', type: 'Work' },
    { id: 6, employee: 'Sara Ahmed', role: 'Nail Technician', date: '2026-02-19', start: '12:00', end: '20:00', type: 'Late' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    titleGroup: {},
    controls: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    dateNav: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2)', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' },
    cardHead: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' },
    avatar: { width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    empInfo: { flex: 1 },
    name: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    role: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    timeRow: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' },
};

export default function EmployeeSchedulePage() {
    return (
        <div style={s.page}>
            <div style={s.header}>
                <div style={s.titleGroup}>
                    <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Schedule</h1>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>Manage shifts for Feb 18 - Feb 24</p>
                </div>
                <div style={s.controls}>
                    <div style={s.dateNav}>
                        <Button variant="ghost" size="sm" iconOnly><ChevronLeft size={16} /></Button>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>Today</span>
                        <Button variant="ghost" size="sm" iconOnly><ChevronRight size={16} /></Button>
                    </div>
                    <Button><Plus size={16} /> Add Shift</Button>
                </div>
            </div>

            <EmployeesTabs />

            <div style={s.grid}>
                {shifts.map(shift => (
                    <div key={shift.id} style={s.card}>
                        <div style={s.cardHead}>
                            <div style={s.avatar}><User size={20} /></div>
                            <div style={s.empInfo}>
                                <div style={s.name}>{shift.employee}</div>
                                <div style={s.role}>{shift.role}</div>
                            </div>
                            <Badge color={shift.type === 'Off' ? 'neutral' : shift.type === 'Late' ? 'warning' : 'success'}>
                                {shift.type}
                            </Badge>
                        </div>
                        {shift.type !== 'Off' && (
                            <div style={{ padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                                <div style={s.timeRow}><Clock size={14} style={{ color: 'var(--text-tertiary)' }} /> {shift.start} - {shift.end}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>8 hours · Regular Shift</div>
                            </div>
                        )}
                        {shift.type === 'Off' && (
                            <div style={{ padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                                Weekly Day Off
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
