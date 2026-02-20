'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Calendar, BarChart3, Clock, Award, Target, Briefcase, UserCog } from 'lucide-react';

const tabs = [
    { label: 'Staff List', href: '/employees', icon: <Users size={16} /> },
    { label: 'Schedule', href: '/employees/schedule', icon: <Calendar size={16} /> },
    { label: 'Performance', href: '/employees/performance', icon: <BarChart3 size={16} /> },
    { label: 'Time Tracking', href: '/employees/time-tracking', icon: <Clock size={16} /> },
    { label: 'Commissions', href: '/employees/commissions', icon: <Award size={16} /> },
    { label: 'Targets', href: '/employees/targets', icon: <Target size={16} /> },
    { label: 'Roles', href: '/employees/roles', icon: <Briefcase size={16} /> },
    { label: 'Permissions', href: '/employees/permissions', icon: <UserCog size={16} /> },
];

export default function EmployeesTabs() {
    const pathname = usePathname();

    return (
        <div style={{ display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto', marginBottom: 'var(--space-6)' }}>
            {tabs.map((t) => {
                const isActive = pathname === t.href;
                return (
                    <Link
                        key={t.href}
                        href={t.href}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                            padding: 'var(--space-3) var(--space-4)',
                            fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)',
                            color: isActive ? 'var(--color-primary-500)' : 'var(--text-tertiary)',
                            borderBottom: isActive ? '2px solid var(--color-primary-500)' : '2px solid transparent',
                            marginBottom: '-2px', textDecoration: 'none', whiteSpace: 'nowrap'
                        }}
                    >
                        {t.icon} {t.label}
                    </Link>
                );
            })}
        </div>
    );
}
