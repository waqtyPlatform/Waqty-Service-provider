'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    UserCog,
    ShoppingBag,
    Receipt,
    Megaphone,
    BarChart3,
    Settings,
    RotateCcw,
    Search,
    Plus,
    FileText,
    CreditCard,
    Clock,
    Target,
    Shield,
    Building2,
    Palette,
    Bell,
    Globe,
    Database,
    Lock,
    Wallet,
} from 'lucide-react';

interface CommandItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    group: string;
    keywords?: string[];
}

const COMMANDS: CommandItem[] = [
    // ── Navigation ──
    { id: 'dashboard', label: 'Dashboard', href: '/', icon: <LayoutDashboard size={16} />, group: 'Navigation' },
    {
        id: 'bookings-calendar',
        label: 'Bookings Calendar',
        href: '/bookings',
        icon: <CalendarDays size={16} />,
        group: 'Navigation',
        keywords: ['appointments', 'schedule'],
    },
    {
        id: 'bookings-list',
        label: 'Bookings List',
        href: '/bookings/list',
        icon: <CalendarDays size={16} />,
        group: 'Navigation',
    },
    {
        id: 'customers',
        label: 'Customers',
        href: '/customers',
        icon: <Users size={16} />,
        group: 'Navigation',
        keywords: ['clients', 'patients'],
    },
    {
        id: 'employees',
        label: 'Employees',
        href: '/employees',
        icon: <UserCog size={16} />,
        group: 'Navigation',
        keywords: ['staff', 'team'],
    },
    { id: 'sales', label: 'Sales / POS', href: '/sales', icon: <ShoppingBag size={16} />, group: 'Navigation' },
    {
        id: 'transactions',
        label: 'Transactions',
        href: '/transactions',
        icon: <Receipt size={16} />,
        group: 'Navigation',
    },
    { id: 'expenses', label: 'Expenses', href: '/expenses', icon: <Wallet size={16} />, group: 'Navigation' },
    { id: 'returns', label: 'Returns', href: '/returns', icon: <RotateCcw size={16} />, group: 'Navigation' },
    { id: 'marketing', label: 'Marketing', href: '/marketing', icon: <Megaphone size={16} />, group: 'Navigation' },
    { id: 'reports', label: 'Reports', href: '/reports', icon: <BarChart3 size={16} />, group: 'Navigation' },

    // ── Quick Actions ──
    {
        id: 'new-booking',
        label: 'New Booking',
        href: '/bookings/new',
        icon: <Plus size={16} />,
        group: 'Quick Actions',
        keywords: ['create appointment'],
    },
    {
        id: 'new-service',
        label: 'Add New Service',
        href: '/settings/services/new',
        icon: <Plus size={16} />,
        group: 'Quick Actions',
    },
    {
        id: 'print-bookings',
        label: 'Print Bookings',
        href: '/bookings/print',
        icon: <FileText size={16} />,
        group: 'Quick Actions',
    },

    // ── Employee Management ──
    {
        id: 'payroll',
        label: 'Payroll',
        href: '/employees/payroll',
        icon: <CreditCard size={16} />,
        group: 'Employees',
        keywords: ['salary', 'wages'],
    },
    {
        id: 'attendance',
        label: 'Attendance',
        href: '/employees/attendance',
        icon: <Clock size={16} />,
        group: 'Employees',
    },
    {
        id: 'schedule',
        label: 'Employee Schedule',
        href: '/employees/schedule',
        icon: <CalendarDays size={16} />,
        group: 'Employees',
        keywords: ['shifts', 'roster'],
    },
    {
        id: 'performance',
        label: 'Performance',
        href: '/employees/performance',
        icon: <Target size={16} />,
        group: 'Employees',
    },
    {
        id: 'commissions',
        label: 'Commissions',
        href: '/employees/commissions',
        icon: <CreditCard size={16} />,
        group: 'Employees',
    },
    {
        id: 'deductions',
        label: 'Deductions',
        href: '/employees/deductions',
        icon: <CreditCard size={16} />,
        group: 'Employees',
    },
    {
        id: 'permissions',
        label: 'Permissions',
        href: '/employees/permissions',
        icon: <Shield size={16} />,
        group: 'Employees',
    },

    // ── Transactions ──
    {
        id: 'cash-sales',
        label: 'Cash Sales',
        href: '/transactions/cash-sales',
        icon: <Receipt size={16} />,
        group: 'Transactions',
    },
    {
        id: 'daily-settlements',
        label: 'Daily Settlements',
        href: '/transactions/dailies',
        icon: <Receipt size={16} />,
        group: 'Transactions',
    },
    {
        id: 'petty-cash',
        label: 'Petty Cash',
        href: '/transactions/petty-cash',
        icon: <Wallet size={16} />,
        group: 'Transactions',
    },

    // ── Settings ──
    { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings size={16} />, group: 'Settings' },
    {
        id: 'settings-branches',
        label: 'Branch Settings',
        href: '/settings/branches',
        icon: <Building2 size={16} />,
        group: 'Settings',
    },
    {
        id: 'settings-appearance',
        label: 'Appearance',
        href: '/settings/appearance',
        icon: <Palette size={16} />,
        group: 'Settings',
        keywords: ['theme', 'branding'],
    },
    {
        id: 'settings-services',
        label: 'Service Catalog',
        href: '/settings/services',
        icon: <ShoppingBag size={16} />,
        group: 'Settings',
    },
    {
        id: 'settings-notifications',
        label: 'Notifications',
        href: '/settings/notifications',
        icon: <Bell size={16} />,
        group: 'Settings',
    },
    {
        id: 'settings-localization',
        label: 'Localization',
        href: '/settings/localization',
        icon: <Globe size={16} />,
        group: 'Settings',
        keywords: ['language', 'arabic'],
    },
    {
        id: 'settings-data',
        label: 'Data Management',
        href: '/settings/data',
        icon: <Database size={16} />,
        group: 'Settings',
        keywords: ['import', 'export'],
    },
    {
        id: 'settings-security',
        label: 'Security',
        href: '/settings/security',
        icon: <Lock size={16} />,
        group: 'Settings',
    },
];

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Toggle with Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSelect = useCallback(
        (href: string) => {
            setOpen(false);
            router.push(href);
        },
        [router]
    );

    if (!open) return null;

    // Group commands
    const groups = COMMANDS.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
        if (!acc[cmd.group]) acc[cmd.group] = [];
        acc[cmd.group].push(cmd);
        return acc;
    }, {});

    return (
        <>
            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'var(--bg-overlay)',
                    zIndex: 9998,
                    animation: 'fadeIn 150ms ease',
                }}
                onClick={() => setOpen(false)}
            />

            {/* Command Dialog */}
            <div
                style={{
                    position: 'fixed',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: 560,
                    zIndex: 9999,
                    animation: 'scaleIn 150ms ease both',
                }}
            >
                <Command
                    style={{
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-xl)',
                        overflow: 'hidden',
                    }}
                    label="Global Search"
                >
                    {/* Search Input */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-4) var(--space-5)',
                            borderBottom: '1px solid var(--border-color)',
                        }}
                    >
                        <Search size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                        <Command.Input
                            placeholder="Search pages, actions, settings..."
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                background: 'transparent',
                                fontSize: 'var(--text-base)',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-sans)',
                            }}
                        />
                        <kbd
                            style={{
                                padding: '2px 8px',
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-tertiary)',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)',
                            }}
                        >
                            ESC
                        </kbd>
                    </div>

                    {/* Results */}
                    <Command.List
                        style={{
                            maxHeight: 400,
                            overflowY: 'auto',
                            padding: 'var(--space-2)',
                        }}
                    >
                        <Command.Empty
                            style={{
                                padding: 'var(--space-8)',
                                textAlign: 'center',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-tertiary)',
                            }}
                        >
                            No results found
                        </Command.Empty>

                        {Object.entries(groups).map(([group, items]) => (
                            <Command.Group
                                key={group}
                                heading={group}
                                style={{
                                    padding: 'var(--space-2) 0',
                                }}
                            >
                                {items.map(item => (
                                    <Command.Item
                                        key={item.id}
                                        value={`${item.label} ${item.keywords?.join(' ') || ''}`}
                                        onSelect={() => handleSelect(item.href)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-3)',
                                            padding: 'var(--space-2) var(--space-3)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--text-primary)',
                                            cursor: 'pointer',
                                            transition: 'background var(--transition-fast)',
                                        }}
                                    >
                                        <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        ))}
                    </Command.List>

                    {/* Footer */}
                    <div
                        style={{
                            padding: 'var(--space-2) var(--space-4)',
                            borderTop: '1px solid var(--border-color)',
                            display: 'flex',
                            gap: 'var(--space-4)',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                        }}
                    >
                        <span>↑↓ Navigate</span>
                        <span>↵ Open</span>
                        <span>ESC Close</span>
                    </div>
                </Command>
            </div>
        </>
    );
}
