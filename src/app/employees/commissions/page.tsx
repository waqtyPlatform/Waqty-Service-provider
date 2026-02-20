'use client';

import React, { useState } from 'react';
import { Download, Calculator } from 'lucide-react';
import EmployeesTabs from '@/components/EmployeesTabs';

const subTabs = ['By Services', 'By Segments', 'By Target', 'Extraction'];

const byServicesData = [
    { employee: 'Sara Ahmed', service: 'Hair Coloring', count: 12, revenue: 4800, rate: 10, commission: 480 },
    { employee: 'Sara Ahmed', service: 'Keratin Treatment', count: 5, revenue: 4000, rate: 12, commission: 480 },
    { employee: 'Nora Ali', service: 'HydraFacial', count: 8, revenue: 4160, rate: 10, commission: 416 },
    { employee: 'Nora Ali', service: 'Classic Facial', count: 10, revenue: 2800, rate: 8, commission: 224 },
    { employee: 'Layla Hassan', service: 'Swedish Massage', count: 10, revenue: 3500, rate: 10, commission: 350 },
    { employee: 'Hana Youssef', service: 'Gel Manicure', count: 18, revenue: 2700, rate: 8, commission: 216 },
    { employee: 'Reem Mohamed', service: 'Deep Tissue', count: 8, revenue: 2400, rate: 12, commission: 288 },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', cursor: 'pointer', whiteSpace: 'nowrap' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpi: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' },
    kpiVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    toolbar: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' },
    select: { height: 40, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    calcBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    exportBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' },
};

export default function CommissionsPage() {
    const [activeTab, setActiveTab] = useState(0);
    const totalComm = byServicesData.reduce((a, d) => a + d.commission, 0);
    const totalRev = byServicesData.reduce((a, d) => a + d.revenue, 0);

    return (
        <div style={s.page}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Commission Calculator</div>

            <EmployeesTabs />

            <div style={s.tabBar}>
                {subTabs.map((t, i) => <div key={t} style={{ ...s.tab, ...(i === activeTab ? s.tabActive : {}) }} onClick={() => setActiveTab(i)}>{t}</div>)}
            </div>

            <div style={s.kpis}>
                <div style={s.kpi}><div style={s.kpiVal}>{totalRev.toLocaleString()} EGP</div><div style={s.kpiLbl}>Total Revenue</div></div>
                <div style={s.kpi}><div style={{ ...s.kpiVal, color: 'var(--color-primary-600)' }}>{totalComm.toLocaleString()} EGP</div><div style={s.kpiLbl}>Total Commissions</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{(totalComm / totalRev * 100).toFixed(1)}%</div><div style={s.kpiLbl}>Avg Rate</div></div>
            </div>

            <div style={s.toolbar}>
                <select style={s.select}><option>All Employees</option><option>Sara Ahmed</option><option>Nora Ali</option><option>Layla Hassan</option></select>
                <input type="date" style={s.select} defaultValue="2026-02-01" />
                <input type="date" style={s.select} defaultValue="2026-02-17" />
                <button style={s.calcBtn}><Calculator size={16} /> Calculate</button>
                <div style={{ flex: 1 }} />
                <button style={s.exportBtn}><Download size={16} /> Export</button>
            </div>

            <table style={s.table}>
                <thead><tr>{['Employee', 'Service', 'Count', 'Revenue', 'Rate', 'Commission'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {byServicesData.map((row, i) => (
                        <tr key={i}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{row.employee}</td>
                            <td style={s.td}>{row.service}</td>
                            <td style={s.td}>{row.count}</td>
                            <td style={s.td}>{row.revenue.toLocaleString()} EGP</td>
                            <td style={s.td}>{row.rate}%</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>{row.commission.toLocaleString()} EGP</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{ background: 'var(--bg-secondary)' }}>
                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)' }} colSpan={3}>Total</td>
                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)' }}>{totalRev.toLocaleString()} EGP</td>
                        <td style={s.td}></td>
                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>{totalComm.toLocaleString()} EGP</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
