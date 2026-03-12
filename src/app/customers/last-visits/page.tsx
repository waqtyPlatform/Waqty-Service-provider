'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, AlertCircle, Phone } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const data = [
    { id: 1, client: 'Fatima Ali', phone: '+20 123 456 789', lastService: 'Hair Coloring', lastEmployee: 'Sara Ahmed', lastDate: '2026-03-16', daysSince: 0, followUp: false },
    { id: 2, client: 'Rania Khalil', phone: '+20 111 222 333', lastService: 'Keratin Treatment', lastEmployee: 'Sara Ahmed', lastDate: '2026-03-23', daysSince: 1, followUp: false },
    { id: 3, client: 'Noura Ahmed', phone: '+20 100 200 300', lastService: 'Swedish Massage', lastEmployee: 'Layla Hassan', lastDate: '2026-03-24', daysSince: 7, followUp: false },
    { id: 4, client: 'Huda Saleh', phone: '+20 155 666 777', lastService: 'HydraFacial', lastEmployee: 'Nora Ali', lastDate: '2026-03-13', daysSince: 14, followUp: true },
    { id: 5, client: 'Maryam Ibrahim', phone: '+20 122 333 444', lastService: 'Classic Facial', lastEmployee: 'Nora Ali', lastDate: '2026-03-23', daysSince: 28, followUp: true },
    { id: 6, client: 'Sama Latif', phone: '+20 133 444 555', lastService: 'Gel Manicure', lastEmployee: 'Hana Youssef', lastDate: '2026-03-18', daysSince: 38, followUp: true },
    { id: 7, client: 'Dana Faris', phone: '+20 144 555 666', lastService: 'Deep Tissue', lastEmployee: 'Reem Mohamed', lastDate: '2026-03-26', daysSince: 54, followUp: true },
    { id: 8, client: 'Lina Qasim', phone: '+20 166 777 888', lastService: 'Pedicure', lastEmployee: 'Hana Youssef', lastDate: '2026-03-19', daysSince: 78, followUp: true },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabs: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    callBtn: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', fontSize: 12, color: 'var(--color-primary-600)' },
};

function getDaysBadge(days: number, t: (key: string) => string) {
    if (days <= 7) return { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: `${days} ${t('custVisits.daysAgo')}` };
    if (days <= 30) return { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: `${days} ${t('custVisits.daysAgo')}` };
    return { bg: 'var(--color-error-light)', color: 'var(--color-error)', label: `${days} ${t('custVisits.daysAgo')}` };
}

export default function LastVisitsPage() {
    const { t, lang } = useTranslation();
    const [search, setSearch] = useState('');
    const filtered = data.filter(d => d.client.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' } as React.CSSProperties}>
            <div style={s.tabs as React.CSSProperties}>
                <Link href="/customers" style={s.tab as React.CSSProperties}>{t('custGroups.tabClients')}</Link>
                <Link href="/customers/groups" style={s.tab as React.CSSProperties}>{t('custGroups.tabGroups')}</Link>
                <Link href="/customers/statements" style={s.tab as React.CSSProperties}>{t('custGroups.tabStatements')}</Link>
                <Link href="/customers/last-visits" style={{ ...s.tab, ...s.tabActive } as React.CSSProperties}>{t('custGroups.tabLastVisits')}</Link>
            </div>

            <div style={s.toolbar as React.CSSProperties}>
                <div style={s.searchBox as React.CSSProperties}><Search size={16} style={{ ...s.searchIcon, ...(lang === 'ar' ? { right: 12, left: 'auto' } : { left: 12, right: 'auto' }) } as React.CSSProperties} /><input style={{ ...s.searchInput, ...(lang === 'ar' ? { paddingRight: 40, paddingLeft: 12 } : { paddingLeft: 40, paddingRight: 12 }) } as React.CSSProperties} placeholder={t('custStmts.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} /></div>
            </div>

            <table style={s.table as React.CSSProperties}>
                <thead><tr>{[t('custStmts.colClient'), t('custProfile.lblPhone'), t('custVisits.colLastService'), t('custProfile.colEmp'), t('custVisits.colLastVisit'), t('custVisits.colDaysSince'), t('custVisits.colFollowUp'), ''].map((h, i) => <th key={i} style={{ ...s.th, textAlign: lang === 'ar' ? 'right' : 'left' } as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {filtered.map(row => {
                        const daysInfo = getDaysBadge(row.daysSince, t);
                        return (
                            <tr key={row.id}>
                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.client}</td>
                                <td style={s.td as React.CSSProperties} dir="ltr" className={lang === 'ar' ? 'text-right' : 'text-left'}>{row.phone}</td>
                                <td style={s.td as React.CSSProperties}>{row.lastService}</td>
                                <td style={s.td as React.CSSProperties}>{row.lastEmployee}</td>
                                <td style={s.td as React.CSSProperties}>{row.lastDate}</td>
                                <td style={s.td as React.CSSProperties}><span style={{ ...s.badge, background: daysInfo.bg, color: daysInfo.color } as React.CSSProperties}>{daysInfo.label}</span></td>
                                <td style={s.td as React.CSSProperties}>
                                    {row.followUp && <span style={{ ...s.badge, background: 'var(--color-warning-light)', color: 'var(--color-warning)' } as React.CSSProperties}><AlertCircle size={12} className={lang === 'ar' ? 'ml-1' : 'mr-1'} /> {t('custVisits.needsFollowUp')}</span>}
                                </td>
                                <td style={s.td as React.CSSProperties}><button style={s.callBtn as React.CSSProperties}><Phone size={12} className={lang === 'ar' ? 'ml-1' : 'mr-1'} /> {t('custVisits.callBtn')}</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
