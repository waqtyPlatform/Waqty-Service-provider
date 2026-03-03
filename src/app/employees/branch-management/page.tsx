'use client';

import React from 'react';
import { Building2, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    title: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    cardHead: { padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderBottom: '1px solid var(--border-color)' },
    icon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    branchName: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    meta: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 },
    employeeList: { padding: 'var(--space-4) var(--space-5)' },
    emp: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-color)' },
    avatar: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'var(--font-bold)', color: 'white', flexShrink: 0 },
    empName: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' },
    mgr: { fontSize: 10, padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'var(--color-warning-light)', color: 'var(--color-warning)', fontWeight: 'var(--font-semibold)' },
};

const avatarColors = ['#F59E0B', '#EC4899', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444'];

export default function BranchManagementPage() {
    const { t, lang } = useTranslation();

    const branches = [
        { name: t('branchMgt.downtown'), manager: 'Sara Ahmed', employees: ['Sara Ahmed', 'Nora Ali', 'Layla Hassan', 'Hana Youssef', 'Reem Mohamed', 'Dina Nabil'], color: '#10B981' },
        { name: t('branchMgt.mallOfArabia'), manager: 'Fatma Hosny', employees: ['Fatma Hosny', 'Maya Adel', 'Rana Fawzy'], color: '#3B82F6' },
        { name: t('branchMgt.newCairo'), manager: 'Amira Sayed', employees: ['Amira Sayed', 'Salma Karim', 'Nadia Omar', 'Yara Emad'], color: '#8B5CF6' },
    ];

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={s.title}>{t('branchMgt.title')}</div>
            <div style={s.grid}>
                {branches.map(branch => (
                    <div key={branch.name} style={s.card}>
                        <div style={s.cardHead}>
                            <div style={{ ...s.icon, background: branch.color }}><Building2 size={20} /></div>
                            <div>
                                <div style={s.branchName}>{branch.name}</div>
                                <div style={s.meta}>
                                    <Users size={12} style={{ ...(lang === 'ar' ? { marginLeft: 4 } : { marginRight: 4 }) }} />
                                    {branch.employees.length} {t('branchMgt.employees')}
                                </div>
                            </div>
                        </div>
                        <div style={s.employeeList}>
                            {branch.employees.map((emp, i) => (
                                <div key={emp} style={{ ...s.emp, borderBottom: i === branch.employees.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                                    <div style={{ ...s.avatar, background: avatarColors[i % avatarColors.length] }}>{emp.charAt(0)}</div>
                                    <div style={s.empName}>{emp}</div>
                                    {emp === branch.manager && <span style={s.mgr}>{t('branchMgt.manager')}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
