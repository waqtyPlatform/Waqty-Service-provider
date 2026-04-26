'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Calendar, BarChart3, Clock, Award, Target, Briefcase, UserCog } from 'lucide-react';

const tabItems = [
    { label: 'Staff List', href: '/employees', icon: <Users size={16} /> },
    { label: 'Schedule', href: '/employees/schedule', icon: <Calendar size={16} /> },
    { label: 'Performance', href: '/employees/performance', icon: <BarChart3 size={16} /> },
    { label: 'Time Tracking', href: '/employees/time-tracking', icon: <Clock size={16} /> },
    { label: 'Commissions', href: '/employees/commissions', icon: <Award size={16} /> },
    { label: 'Targets', href: '/employees/targets', icon: <Target size={16} /> },
    { label: 'Roles', href: '/employees/roles', icon: <Briefcase size={16} /> },
    { label: 'Permissions', href: '/employees/permissions', icon: <UserCog size={16} /> },
];

interface PageProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}

export default function EmployeeSubPage({ title, description, children }: PageProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{title}</h1>
                    <p
                        style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-tertiary)',
                            marginTop: 'var(--space-1)',
                        }}
                    >
                        {description}
                    </p>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: 'var(--space-1)',
                    borderBottom: '2px solid var(--border-color)',
                    overflowX: 'auto',
                }}
            >
                {tabItems.map(tab => {
                    // Check if active based on title matches loosely or just manually set active prop if needed?
                    // Simple check: strict href match would require usePathname, but here we can just pass specific active state or check href against title logic
                    // For simplicity, we assume we are on the page that corresponds to the tab.
                    // But this component is generic.
                    // Let's just use the current path logic in the specific page implementation or usePathname here.
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                padding: 'var(--space-3) var(--space-4)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-medium)',
                                color: 'var(--text-tertiary)',
                                borderBottom: '2px solid transparent',
                                marginBottom: '-2px',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                            }}
                            // We will handle active styling properly in the specific instances or via hook
                        >
                            {tab.icon} {tab.label}
                        </Link>
                    );
                })}
            </div>

            <div
                style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-8)',
                    textAlign: 'center',
                }}
            >
                {children || (
                    <>
                        <div
                            style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-semibold)',
                                marginBottom: 'var(--space-2)',
                            }}
                        >
                            {title}
                        </div>
                        <p style={{ color: 'var(--text-tertiary)' }}>This module is currently under development.</p>
                    </>
                )}
            </div>
        </div>
    );
}
