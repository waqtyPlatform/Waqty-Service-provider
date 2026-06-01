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
import { useTranslation } from '@/hooks/useTranslation';

interface CommandItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    group: string;
    keywords?: string[];
}

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();

    const COMMANDS: CommandItem[] = [
        // ── Navigation ──
        {
            id: 'dashboard',
            label: t('cmd.dashboard'),
            href: '/',
            icon: <LayoutDashboard size={16} />,
            group: t('cmd.groupNavigation'),
        },
        {
            id: 'bookings-calendar',
            label: t('cmd.bookingsCalendar'),
            href: '/bookings',
            icon: <CalendarDays size={16} />,
            group: t('cmd.groupNavigation'),
            keywords: ['appointments', 'schedule'],
        },
        {
            id: 'bookings-list',
            label: t('cmd.bookingsList'),
            href: '/bookings/list',
            icon: <CalendarDays size={16} />,
            group: t('cmd.groupNavigation'),
        },
        {
            id: 'customers',
            label: t('cmd.customers'),
            href: '/customers',
            icon: <Users size={16} />,
            group: t('cmd.groupNavigation'),
            keywords: ['clients', 'patients'],
        },
        {
            id: 'employees',
            label: t('cmd.employees'),
            href: '/employees',
            icon: <UserCog size={16} />,
            group: t('cmd.groupNavigation'),
            keywords: ['staff', 'team'],
        },
        {
            id: 'sales',
            label: t('cmd.salesPos'),
            href: '/sales',
            icon: <ShoppingBag size={16} />,
            group: t('cmd.groupNavigation'),
        },
        {
            id: 'transactions',
            label: t('cmd.transactions'),
            href: '/transactions',
            icon: <Receipt size={16} />,
            group: t('cmd.groupNavigation'),
        },
        {
            id: 'expenses',
            label: t('cmd.expenses'),
            href: '/expenses',
            icon: <Wallet size={16} />,
            group: t('cmd.groupNavigation'),
        },
        {
            id: 'returns',
            label: t('cmd.returns'),
            href: '/returns',
            icon: <RotateCcw size={16} />,
            group: t('cmd.groupNavigation'),
        },
        {
            id: 'marketing',
            label: t('cmd.marketing'),
            href: '/marketing',
            icon: <Megaphone size={16} />,
            group: t('cmd.groupNavigation'),
        },
        {
            id: 'reports',
            label: t('cmd.reports'),
            href: '/reports',
            icon: <BarChart3 size={16} />,
            group: t('cmd.groupNavigation'),
        },

        // ── Quick Actions ──
        {
            id: 'new-booking',
            label: t('cmd.newBooking'),
            href: '/bookings/new',
            icon: <Plus size={16} />,
            group: t('cmd.groupQuickActions'),
            keywords: ['create appointment'],
        },
        {
            id: 'new-service',
            label: t('cmd.addNewService'),
            href: '/settings/services/new',
            icon: <Plus size={16} />,
            group: t('cmd.groupQuickActions'),
        },
        {
            id: 'print-bookings',
            label: t('cmd.printBookings'),
            href: '/bookings/print',
            icon: <FileText size={16} />,
            group: t('cmd.groupQuickActions'),
        },

        // ── Employee Management ──
        {
            id: 'payroll',
            label: t('cmd.payroll'),
            href: '/employees/payroll',
            icon: <CreditCard size={16} />,
            group: t('cmd.groupEmployees'),
            keywords: ['salary', 'wages'],
        },
        {
            id: 'attendance',
            label: t('cmd.attendance'),
            href: '/employees/attendance',
            icon: <Clock size={16} />,
            group: t('cmd.groupEmployees'),
        },
        {
            id: 'schedule',
            label: t('cmd.employeeSchedule'),
            href: '/employees/schedule',
            icon: <CalendarDays size={16} />,
            group: t('cmd.groupEmployees'),
            keywords: ['shifts', 'roster'],
        },
        {
            id: 'performance',
            label: t('cmd.performance'),
            href: '/employees/performance',
            icon: <Target size={16} />,
            group: t('cmd.groupEmployees'),
        },
        {
            id: 'commissions',
            label: t('cmd.commissions'),
            href: '/employees/commissions',
            icon: <CreditCard size={16} />,
            group: t('cmd.groupEmployees'),
        },
        {
            id: 'deductions',
            label: t('cmd.deductions'),
            href: '/employees/deductions',
            icon: <CreditCard size={16} />,
            group: t('cmd.groupEmployees'),
        },
        {
            id: 'permissions',
            label: t('cmd.permissions'),
            href: '/employees/permissions',
            icon: <Shield size={16} />,
            group: t('cmd.groupEmployees'),
        },

        // ── Transactions ──
        {
            id: 'cash-sales',
            label: t('cmd.cashSales'),
            href: '/transactions/cash-sales',
            icon: <Receipt size={16} />,
            group: t('cmd.groupTransactions'),
        },
        {
            id: 'daily-settlements',
            label: t('cmd.dailySettlements'),
            href: '/transactions/dailies',
            icon: <Receipt size={16} />,
            group: t('cmd.groupTransactions'),
        },
        {
            id: 'petty-cash',
            label: t('cmd.pettyCash'),
            href: '/transactions/petty-cash',
            icon: <Wallet size={16} />,
            group: t('cmd.groupTransactions'),
        },

        // ── Settings ──
        {
            id: 'settings',
            label: t('cmd.settings'),
            href: '/settings',
            icon: <Settings size={16} />,
            group: t('cmd.groupSettings'),
        },
        {
            id: 'settings-branches',
            label: t('cmd.branchSettings'),
            href: '/settings/branches',
            icon: <Building2 size={16} />,
            group: t('cmd.groupSettings'),
        },
        {
            id: 'settings-appearance',
            label: t('cmd.appearance'),
            href: '/settings/appearance',
            icon: <Palette size={16} />,
            group: t('cmd.groupSettings'),
            keywords: ['theme', 'branding'],
        },
        {
            id: 'settings-services',
            label: t('cmd.serviceCatalog'),
            href: '/settings/services',
            icon: <ShoppingBag size={16} />,
            group: t('cmd.groupSettings'),
        },
        {
            id: 'settings-notifications',
            label: t('cmd.notifications'),
            href: '/settings/notifications',
            icon: <Bell size={16} />,
            group: t('cmd.groupSettings'),
        },
        {
            id: 'settings-localization',
            label: t('cmd.localization'),
            href: '/settings/localization',
            icon: <Globe size={16} />,
            group: t('cmd.groupSettings'),
            keywords: ['language', 'arabic'],
        },
        {
            id: 'settings-data',
            label: t('cmd.dataManagement'),
            href: '/settings/data',
            icon: <Database size={16} />,
            group: t('cmd.groupSettings'),
            keywords: ['import', 'export'],
        },
        {
            id: 'settings-security',
            label: t('cmd.security'),
            href: '/settings/security',
            icon: <Lock size={16} />,
            group: t('cmd.groupSettings'),
        },
    ];

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
                    label={t('cmd.label')}
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
                            placeholder={t('cmd.searchPlaceholder')}
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
                            {t('cmd.noResults')}
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
                        <span>↑↓ {t('cmd.footerNavigate')}</span>
                        <span>↵ {t('cmd.footerOpen')}</span>
                        <span>ESC {t('cmd.footerClose')}</span>
                    </div>
                </Command>
            </div>
        </>
    );
}
