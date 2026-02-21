'use client';

import React from 'react';

import { Clock, LogIn, LogOut, Coffee } from 'lucide-react';
import { Badge } from '@/components/ui';

const logs = [
    { id: 1, employee: 'Nora Ali', date: '2026-02-18', checkIn: '08:55', checkOut: '17:05', break: '45m', total: '8h 10m', status: 'On Time' },
    { id: 2, employee: 'Sara Ahmed', date: '2026-02-18', checkIn: '10:15', checkOut: '18:00', break: '30m', total: '7h 45m', status: 'Late' },
    { id: 3, employee: 'Laila Mahmoud', date: '2026-02-18', checkIn: '08:30', checkOut: '-', break: '-', total: 'Running', status: 'On Time' },
    { id: 4, employee: 'Hoda Hassan', date: '2026-02-18', checkIn: '-', checkOut: '-', break: '-', total: '-', status: 'Absent' },
    { id: 5, employee: 'Nora Ali', date: '2026-02-17', checkIn: '09:00', checkOut: '17:00', break: '1h', total: '8h 00m', status: 'On Time' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: 'var(--space-3)', borderBottom: '1px solid var(--border-color)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' },
    td: { padding: 'var(--space-3)', borderBottom: '1px solid var(--border-color)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    row: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
};

export default function EmployeeTimeTrackingPage() {
    return (
        <div style={s.page}>
            <div>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Time Tracking</h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>Monitor employee attendance and working hours.</p>
            </div>



            <div style={s.card}>
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th style={s.th as React.CSSProperties}>Employee</th>
                            <th style={s.th as React.CSSProperties}>Date</th>
                            <th style={s.th as React.CSSProperties}>Check In</th>
                            <th style={s.th as React.CSSProperties}>Check Out</th>
                            <th style={s.th as React.CSSProperties}>Break</th>
                            <th style={s.th as React.CSSProperties}>Total Hours</th>
                            <th style={s.th as React.CSSProperties}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{log.employee}</td>
                                <td style={s.td}>{log.date}</td>
                                <td style={{ ...s.td, color: 'var(--color-success)' }}><div style={s.row}><LogIn size={14} /> {log.checkIn}</div></td>
                                <td style={{ ...s.td, color: 'var(--color-error)' }}><div style={s.row}><LogOut size={14} /> {log.checkOut}</div></td>
                                <td style={s.td}><div style={s.row}><Coffee size={14} /> {log.break}</div></td>
                                <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }}>{log.total}</td>
                                <td style={s.td}>
                                    <Badge color={log.status === 'Late' ? 'warning' : log.status === 'Absent' ? 'error' : 'success'}>
                                        {log.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
