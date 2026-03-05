'use client';

import React, { useState } from 'react';
import { Target, TrendingUp, Users, AlertCircle, CheckCircle, Plus, Edit } from 'lucide-react';
import { Button, Modal, Input, Select, useToast, Badge } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

/* ─── Mock Data ───────────────────────── */
interface TargetRow {
    id: string;
    employee: string;
    avatar: string;
    color: string;
    targetRevenue: number;
    achievedRevenue: number;
    targetBookings: number;
    achievedBookings: number;
    bonus: number;
}

const initialTargets: TargetRow[] = [
    { id: 'E001', employee: 'Sara Ahmed', avatar: 'SA', color: '#10b981', targetRevenue: 50000, achievedRevenue: 45200, targetBookings: 130, achievedBookings: 124, bonus: 2000 },
    { id: 'E002', employee: 'Nora Ali', avatar: 'NA', color: '#f59e0b', targetRevenue: 40000, achievedRevenue: 38400, targetBookings: 110, achievedBookings: 102, bonus: 1500 },
    { id: 'E003', employee: 'Layla Hassan', avatar: 'LH', color: '#3b82f6', targetRevenue: 35000, achievedRevenue: 32100, targetBookings: 90, achievedBookings: 88, bonus: 1200 },
    { id: 'E004', employee: 'Hana Youssef', avatar: 'HY', color: '#8b5cf6', targetRevenue: 30000, achievedRevenue: 28500, targetBookings: 80, achievedBookings: 76, bonus: 1000 },
    { id: 'E005', employee: 'Reem Mohamed', avatar: 'RM', color: '#ec4899', targetRevenue: 25000, achievedRevenue: 24800, targetBookings: 70, achievedBookings: 65, bonus: 800 },
    { id: 'E006', employee: 'Dina Kamal', avatar: 'DK', color: '#6366f1', targetRevenue: 20000, achievedRevenue: 18200, targetBookings: 50, achievedBookings: 48, bonus: 500 },
];

/* ─── Styles ───────────────────────────── */
const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpiCard: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    kpiIcon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    kpiVal: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' },
    kpiLabel: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' },
    tableWrapper: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'auto' },
    table: { width: '100%', minWidth: 900, borderCollapse: 'collapse' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' },
    avatar: { width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'var(--font-bold)', color: '#fff', flexShrink: 0 },
    empCell: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
    progressBg: { width: '100%', height: 8, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' },
    progressBar: { height: '100%', borderRadius: 4, transition: 'width 0.4s ease' },
    badge: { display: 'inline-flex', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
};

/* ─── Component ─────────────────────────── */
export default function TargetsPage() {
    const { t, lang } = useTranslation();
    const { addToast } = useToast();
    const [targets, setTargets] = useState(initialTargets);
    const [isSetOpen, setIsSetOpen] = useState(false);
    const [editForm, setEditForm] = useState({ employee: '', targetRevenue: '', targetBookings: '', bonus: '' });

    const avgAchievement = Math.round(targets.reduce((sum, row) => sum + (row.achievedRevenue / row.targetRevenue) * 100, 0) / targets.length);
    const onTrack = targets.filter(r => (r.achievedRevenue / r.targetRevenue) >= 0.9).length;
    const behind = targets.filter(r => (r.achievedRevenue / r.targetRevenue) < 0.75).length;
    const totalTarget = targets.reduce((s, r) => s + r.targetRevenue, 0);

    const getProgress = (achieved: number, target: number) => Math.min(Math.round((achieved / target) * 100), 100);
    const getProgressColor = (pct: number) => {
        if (pct >= 90) return 'var(--color-success)';
        if (pct >= 75) return 'var(--color-primary-500)';
        if (pct >= 50) return 'var(--color-warning)';
        return 'var(--color-error)';
    };
    const getStatusBadge = (pct: number) => {
        if (pct >= 100) return { label: t('targets.achieved'), bg: 'var(--color-success-light)', color: 'var(--color-success)' };
        if (pct >= 90) return { label: t('targets.onTrack'), bg: 'var(--color-primary-100)', color: 'var(--color-primary-600)' };
        if (pct >= 75) return { label: t('targets.nearTarget'), bg: 'var(--color-warning-light)', color: 'var(--color-warning)' };
        return { label: t('targets.behind'), bg: 'var(--color-error-light)', color: 'var(--color-error)' };
    };

    const handleSetTarget = () => {
        if (!editForm.employee) return;
        setTargets(prev => prev.map(row => {
            if (row.employee === editForm.employee) {
                return {
                    ...row,
                    targetRevenue: Number(editForm.targetRevenue) || row.targetRevenue,
                    targetBookings: Number(editForm.targetBookings) || row.targetBookings,
                    bonus: Number(editForm.bonus) || row.bonus,
                };
            }
            return row;
        }));
        setIsSetOpen(false);
        addToast('success', t('targets.targetUpdated'));
        setEditForm({ employee: '', targetRevenue: '', targetBookings: '', bonus: '' });
    };

    const kpis = [
        { icon: <TrendingUp size={20} />, bg: 'var(--color-primary-50)', color: 'var(--color-primary-600)', value: `${avgAchievement}%`, label: t('targets.kpiAvgAchievement') },
        { icon: <CheckCircle size={20} />, bg: 'var(--color-success-100)', color: 'var(--color-success-600)', value: onTrack, label: t('targets.kpiOnTrack') },
        { icon: <AlertCircle size={20} />, bg: 'var(--color-error-100)', color: 'var(--color-error-600)', value: behind, label: t('targets.kpiBehind') },
        { icon: <Target size={20} />, bg: 'var(--color-purple-100)', color: 'var(--color-purple-600)', value: `${(totalTarget / 1000).toFixed(0)}K`, label: t('targets.kpiTotalTarget') },
    ];

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* KPIs */}
            <div style={s.kpis}>
                {kpis.map((kpi, i) => (
                    <div key={i} style={s.kpiCard}>
                        <div style={{ ...s.kpiIcon, background: kpi.bg, color: kpi.color }}>{kpi.icon}</div>
                        <div>
                            <div style={s.kpiVal}>{kpi.value}</div>
                            <div style={s.kpiLabel}>{kpi.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div style={s.toolbar}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                    {t('targets.title')}
                </div>
                <Button onClick={() => setIsSetOpen(true)}><Edit size={16} /> {t('targets.setTarget')}</Button>
            </div>

            {/* Targets Table */}
            <div style={s.tableWrapper}>
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th style={s.th as React.CSSProperties}>{t('targets.colEmployee')}</th>
                            <th style={s.th as React.CSSProperties}>{t('targets.colTarget')}</th>
                            <th style={s.th as React.CSSProperties}>{t('targets.colAchieved')}</th>
                            <th style={{ ...s.th, minWidth: 180 } as React.CSSProperties}>{t('targets.colProgress')}</th>
                            <th style={s.th as React.CSSProperties}>{t('targets.colBookings')}</th>
                            <th style={s.th as React.CSSProperties}>{t('targets.colStatus')}</th>
                            <th style={s.th as React.CSSProperties}>{t('targets.colBonus')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {targets.map(row => {
                            const pct = getProgress(row.achievedRevenue, row.targetRevenue);
                            const statusBadge = getStatusBadge(pct);
                            return (
                                <tr key={row.id} style={{ transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                                    <td style={s.td}>
                                        <div style={s.empCell}>
                                            <div style={{ ...s.avatar, background: row.color }}>{row.avatar}</div>
                                            <span style={{ fontWeight: 'var(--font-medium)' }}>{row.employee}</span>
                                        </div>
                                    </td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }} dir="ltr">{(row.targetRevenue / 1000).toFixed(0)}K EGP</td>
                                    <td style={{ ...s.td, color: 'var(--color-success)', fontWeight: 'var(--font-semibold)' }} dir="ltr">{(row.achievedRevenue / 1000).toFixed(1)}K EGP</td>
                                    <td style={s.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <div style={s.progressBg}>
                                                <div style={{ ...s.progressBar, width: `${pct}%`, background: getProgressColor(pct) }} />
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 'var(--font-bold)', color: getProgressColor(pct), minWidth: 36 }}>{pct}%</span>
                                        </div>
                                    </td>
                                    <td style={s.td}>{row.achievedBookings}/{row.targetBookings}</td>
                                    <td style={s.td}>
                                        <span style={{ ...s.badge, background: statusBadge.bg, color: statusBadge.color }}>{statusBadge.label}</span>
                                    </td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-semibold)', color: pct >= 90 ? 'var(--color-success)' : 'var(--text-tertiary)' }}>
                                        <span dir="ltr">{pct >= 90 ? `${row.bonus.toLocaleString()} EGP` : '—'}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Set Target Modal */}
            <Modal
                title={t('targets.setTargetTitle')}
                open={isSetOpen}
                onClose={() => setIsSetOpen(false)}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsSetOpen(false)}>{t('targets.cancel')}</Button>
                        <Button onClick={handleSetTarget}>{t('targets.save')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Select
                        label={t('targets.colEmployee')}
                        value={editForm.employee}
                        onChange={e => {
                            const emp = targets.find(r => r.employee === e.target.value);
                            setEditForm({
                                employee: e.target.value,
                                targetRevenue: emp ? String(emp.targetRevenue) : '',
                                targetBookings: emp ? String(emp.targetBookings) : '',
                                bonus: emp ? String(emp.bonus) : '',
                            });
                        }}
                        options={[{ value: '', label: t('targets.selectEmployee') }, ...targets.map(r => ({ value: r.employee, label: r.employee }))]}
                    />
                    <Input label={t('targets.targetRevLabel')} type="number" value={editForm.targetRevenue} onChange={e => setEditForm({ ...editForm, targetRevenue: e.target.value })} />
                    <Input label={t('targets.targetBookLabel')} type="number" value={editForm.targetBookings} onChange={e => setEditForm({ ...editForm, targetBookings: e.target.value })} />
                    <Input label={t('targets.bonusLabel')} type="number" value={editForm.bonus} onChange={e => setEditForm({ ...editForm, bonus: e.target.value })} />
                </div>
            </Modal>
        </div>
    );
}
