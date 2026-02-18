'use client';

import React, { useState } from 'react';
import { Search, Download, Clock, AlertTriangle } from 'lucide-react';

const data = [
    { id: 1, employee: 'Sara Ahmed', date: '2026-02-17', checkIn: '08:55', checkOut: '18:05', hours: '9h 10m', late: false, overtime: '10m', status: 'present' },
    { id: 2, employee: 'Nora Ali', date: '2026-02-17', checkIn: '09:10', checkOut: '18:00', hours: '8h 50m', late: true, overtime: '0m', status: 'late' },
    { id: 3, employee: 'Layla Hassan', date: '2026-02-17', checkIn: '08:50', checkOut: '18:30', hours: '9h 40m', late: false, overtime: '40m', status: 'present' },
    { id: 4, employee: 'Hana Youssef', date: '2026-02-17', checkIn: '09:00', checkOut: '18:00', hours: '9h 0m', late: false, overtime: '0m', status: 'present' },
    { id: 5, employee: 'Reem Mohamed', date: '2026-02-17', checkIn: '-', checkOut: '-', hours: '-', late: false, overtime: '-', status: 'absent' },
    { id: 6, employee: 'Dina Nabil', date: '2026-02-17', checkIn: '08:45', checkOut: '17:00', hours: '8h 15m', late: false, overtime: '0m', status: 'early_leave' },
    { id: 7, employee: 'Sara Ahmed', date: '2026-02-16', checkIn: '09:00', checkOut: '18:00', hours: '9h 0m', late: false, overtime: '0m', status: 'present' },
    { id: 8, employee: 'Nora Ali', date: '2026-02-16', checkIn: '08:58', checkOut: '18:15', hours: '9h 17m', late: false, overtime: '17m', status: 'present' },
];

const statusMap: Record<string, { label: string; bg: string; color: string }> = {
    present: { label: '✓ Present', bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    late: { label: '⏰ Late', bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    absent: { label: '✗ Absent', bg: 'var(--color-error-light)', color: 'var(--color-error)' },
    early_leave: { label: '↩ Early Leave', bg: 'var(--color-info-light)', color: 'var(--color-info)' },
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' },
    kpi: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' },
    kpiVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    exportBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' },
};

export default function AttendancePage() {
    const [search, setSearch] = useState('');
    const todayData = data.filter(d => d.date === '2026-02-17');
    const filtered = data.filter(d => d.employee.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Attendance Log</div>

            <div style={s.kpis}>
                <div style={s.kpi}><div style={{ ...s.kpiVal, color: 'var(--color-success)' }}>{todayData.filter(d => d.status === 'present').length}</div><div style={s.kpiLbl}>Present Today</div></div>
                <div style={s.kpi}><div style={{ ...s.kpiVal, color: 'var(--color-warning)' }}>{todayData.filter(d => d.status === 'late').length}</div><div style={s.kpiLbl}>Late</div></div>
                <div style={s.kpi}><div style={{ ...s.kpiVal, color: 'var(--color-error)' }}>{todayData.filter(d => d.status === 'absent').length}</div><div style={s.kpiLbl}>Absent</div></div>
                <div style={s.kpi}><div style={{ ...s.kpiVal, color: 'var(--color-info)' }}>{todayData.filter(d => d.status === 'early_leave').length}</div><div style={s.kpiLbl}>Early Leave</div></div>
            </div>

            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}><Search size={16} style={s.searchIcon as React.CSSProperties} /><input style={s.searchInput} placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                <button style={s.exportBtn}><Download size={16} /> Export</button>
            </div>

            <table style={s.table}>
                <thead><tr>{['Employee', 'Date', 'Check In', 'Check Out', 'Hours', 'Overtime', 'Status'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {filtered.map((row, i) => {
                        const st = statusMap[row.status];
                        return (
                            <tr key={i}>
                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{row.employee}</td>
                                <td style={s.td}>{row.date}</td>
                                <td style={s.td}>{row.checkIn}</td><td style={s.td}>{row.checkOut}</td>
                                <td style={s.td}>{row.hours}</td>
                                <td style={{ ...s.td, color: row.overtime !== '0m' && row.overtime !== '-' ? 'var(--color-primary-600)' : 'var(--text-tertiary)' }}>{row.overtime}</td>
                                <td style={s.td}><span style={{ ...s.badge, background: st.bg, color: st.color }}>{st.label}</span></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
