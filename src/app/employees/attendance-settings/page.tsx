'use client';

import React from 'react';
import { Clock, Save } from 'lucide-react';

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', maxWidth: 700 },
    title: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    section: { marginBottom: 'var(--space-6)' },
    sectionTitle: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border-color)' },
    row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-color)' },
    label: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' },
    hint: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    input: { width: 80, height: 36, textAlign: 'center' as const, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)' },
    toggle: { width: 44, height: 24, borderRadius: 12, background: 'var(--color-primary-500)', position: 'relative' as const, cursor: 'pointer' },
    toggleDot: { width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute' as const, top: 2, right: 2 },
    toggleOff: { background: 'var(--bg-tertiary)' },
    toggleDotOff: { left: 2, right: 'auto' },
    saveBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-6)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' },
};

export default function AttendanceSettingsPage() {
    return (
        <div style={s.page}>
            <div style={s.title}>Attendance Settings</div>
            <div style={s.card}>
                <div style={s.section}>
                    <div style={s.sectionTitle}>Work Hours</div>
                    <div style={s.row}><div><div style={s.label}>Standard Work Hours</div><div style={s.hint}>Daily required working hours</div></div><input style={s.input} defaultValue="9" /> hrs</div>
                    <div style={s.row}><div><div style={s.label}>Shift Start Time</div><div style={s.hint}>Default shift start</div></div><input style={s.input} defaultValue="09:00" type="time" /></div>
                    <div style={s.row}><div><div style={s.label}>Shift End Time</div><div style={s.hint}>Default shift end</div></div><input style={s.input} defaultValue="18:00" type="time" /></div>
                </div>

                <div style={s.section}>
                    <div style={s.sectionTitle}>Grace Period</div>
                    <div style={s.row}><div><div style={s.label}>Late Grace Period</div><div style={s.hint}>Minutes after shift start before marking late</div></div><input style={s.input} defaultValue="5" /> min</div>
                    <div style={s.row}><div><div style={s.label}>Early Leave Grace</div><div style={s.hint}>Minutes before shift end allowed</div></div><input style={s.input} defaultValue="10" /> min</div>
                </div>

                <div style={s.section}>
                    <div style={s.sectionTitle}>Overtime</div>
                    <div style={s.row}><div><div style={s.label}>Overtime Threshold</div><div style={s.hint}>Minutes after shift end to count as overtime</div></div><input style={s.input} defaultValue="15" /> min</div>
                    <div style={s.row}><div><div style={s.label}>Max Overtime Per Day</div><div style={s.hint}>Maximum overtime hours allowed</div></div><input style={s.input} defaultValue="3" /> hrs</div>
                </div>

                <div style={s.section}>
                    <div style={s.sectionTitle}>Penalties</div>
                    <div style={s.row}><div><div style={s.label}>Auto-deduct Late Penalty</div><div style={s.hint}>Automatically deduct from salary</div></div><div style={s.toggle}><div style={s.toggleDot} /></div></div>
                    <div style={{ ...s.row, borderBottom: 'none' }}><div><div style={s.label}>Notify Manager on Absence</div><div style={s.hint}>Send push notification to manager</div></div><div style={s.toggle}><div style={s.toggleDot} /></div></div>
                </div>

                <button style={s.saveBtn}><Save size={16} /> Save Settings</button>
            </div>
        </div>
    );
}
