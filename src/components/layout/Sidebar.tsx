'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import {
    LayoutDashboard,
    ShoppingBag,
    CalendarDays,
    Receipt,
    RotateCcw,
    Users,
    UserCog,
    Megaphone,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronDown,
    ChevronRight,
    X,
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface NavSubItem {
    label: string;
    href: string;
}

interface NavItem {
    label: string;
    icon: React.ReactNode;
    href?: string;
    children?: NavSubItem[];
}

const navigation: NavItem[] = [
    {
        label: 'Dashboard',
        icon: <LayoutDashboard size={20} />,
        href: '/',
    },
    {
        label: 'Sales',
        icon: <ShoppingBag size={20} />,
        children: [
            { label: 'Services', href: '/sales' },
            { label: 'Packages', href: '/sales/packages' },
        ],
    },
    {
        label: 'Bookings',
        icon: <CalendarDays size={20} />,
        children: [
            { label: 'Calendar', href: '/bookings' },
            { label: 'Booking List', href: '/bookings/list' },
            { label: 'Room Calendar', href: '/bookings/rooms' },
            { label: 'New Booking', href: '/bookings/new' },
            { label: 'Employee Print', href: '/bookings/print' },
        ],
    },
    {
        label: 'Transactions',
        icon: <Receipt size={20} />,
        children: [
            { label: 'Transaction Log', href: '/transactions' },
            { label: 'Cash Sales', href: '/transactions/cash-sales' },
            { label: 'Advance Payments', href: '/transactions/advance-payments' },
            { label: 'Petty Cash', href: '/transactions/petty-cash' },
            { label: 'Cashier Transfers', href: '/transactions/transfers' },
            { label: 'Safe Balances', href: '/transactions/safe-balances' },
            { label: 'Shifts', href: '/transactions/shifts' },
            { label: 'Dailies', href: '/transactions/dailies' },
            { label: 'Best Sales Report', href: '/transactions/best-sales' },
            { label: 'Client Sales Report', href: '/transactions/client-sales' },
            { label: 'Package Sales', href: '/transactions/package-sales' },
        ],
    },
    {
        label: 'Returns',
        icon: <RotateCcw size={20} />,
        children: [
            { label: 'Returns List', href: '/returns' },
            { label: 'Cash Refund', href: '/returns/cash-refund' },
            { label: 'Petty Cash Refund', href: '/returns/petty-cash-refund' },
            { label: 'Cancel Down Payment', href: '/returns/cancel-down-payment' },
        ],
    },
    {
        label: 'Customers',
        icon: <Users size={20} />,
        children: [
            { label: 'Clients', href: '/customers' },
            { label: 'Client Groups', href: '/customers/groups' },
            { label: 'Account Statements', href: '/customers/statements' },
            { label: 'Last Visits', href: '/customers/last-visits' },
        ],
    },
    {
        label: 'Employees',
        icon: <UserCog size={20} />,
        children: [
            { label: 'Employee List', href: '/employees' },
            { label: 'Departments', href: '/employees/departments' },
            { label: 'Positions', href: '/employees/positions' },
            { label: 'Branch Employees', href: '/employees/branch-management' },
            { label: 'Transfer Log', href: '/employees/transfers' },
            { label: 'Fingerprints', href: '/employees/fingerprints' },
            { label: 'Attend Methods', href: '/employees/attend-methods' },
            { label: 'Attendance Log', href: '/employees/attendance' },
            { label: 'Attendance Settings', href: '/employees/attendance-settings' },
            { label: 'Commissions', href: '/employees/commissions' },
            { label: 'Commission Settings', href: '/employees/commission-settings' },
        ],
    },
    {
        label: 'Marketing',
        icon: <Megaphone size={20} />,
        children: [
            { label: 'Offers', href: '/marketing/offers' },
            { label: 'Packages', href: '/marketing/packages' },
            { label: 'Notifications', href: '/marketing/notifications' },
            { label: 'Promo Codes', href: '/marketing/promo-codes' },
            { label: 'Message Settings', href: '/marketing/messages' },
            { label: 'Service Groups', href: '/marketing/service-groups' },
        ],
    },
    {
        label: 'Reports',
        icon: <BarChart3 size={20} />,
        href: '/reports',
    },
    {
        label: 'Settings',
        icon: <Settings size={20} />,
        children: [
            { label: 'General', href: '/settings' },
            { label: 'Branches', href: '/settings/branches' },
            { label: 'Services', href: '/settings/services' },
            { label: 'Invoice', href: '/settings/invoice' },
            { label: 'Devices', href: '/settings/devices' },
            { label: 'Integrations', href: '/settings/integrations' },
            { label: 'Roles & Permissions', href: '/settings/roles' },
            { label: 'Audit Log', href: '/settings/audit-log' },
            { label: 'Subscription', href: '/settings/subscription' },
        ],
    },
];

export default function Sidebar() {
    const { collapsed, toggleSidebar, mobileOpen, setMobileOpen } = useSidebar();
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>(() => {
        // Auto-expand the section that matches current path
        const matched = navigation.find(
            (item) =>
                item.href === pathname ||
                item.children?.some((child) => pathname.startsWith(child.href))
        );
        return matched ? [matched.label] : [];
    });

    const toggleExpand = (label: string) => {
        setExpandedItems((prev) =>
            prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
        );
    };

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''
                    }`}
            >
                {/* Header */}
                <div className={styles.header}>
                    {!collapsed && (
                        <Link href="/" className={styles.logo}>
                            <div className={styles.logoIcon}>H</div>
                            <span className={styles.logoText}>Hagzy</span>
                        </Link>
                    )}
                    {collapsed && (
                        <div className={styles.logoIcon}>H</div>
                    )}
                    <button
                        className={styles.collapseBtn}
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        className={styles.mobileCloseBtn}
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        {navigation.map((item) => {
                            const hasChildren = !!item.children;
                            const isExpanded = expandedItems.includes(item.label);
                            const itemActive = item.href
                                ? isActive(item.href)
                                : item.children?.some((child) => isActive(child.href));

                            return (
                                <li key={item.label} className={styles.navItem}>
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className={`${styles.navLink} ${itemActive ? styles.active : ''
                                                }`}
                                            title={collapsed ? item.label : undefined}
                                        >
                                            <span className={styles.navIcon}>{item.icon}</span>
                                            {!collapsed && (
                                                <span className={styles.navLabel}>{item.label}</span>
                                            )}
                                        </Link>
                                    ) : (
                                        <button
                                            className={`${styles.navLink} ${itemActive ? styles.active : ''
                                                }`}
                                            onClick={() => toggleExpand(item.label)}
                                            title={collapsed ? item.label : undefined}
                                        >
                                            <span className={styles.navIcon}>{item.icon}</span>
                                            {!collapsed && (
                                                <>
                                                    <span className={styles.navLabel}>{item.label}</span>
                                                    <span
                                                        className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''
                                                            }`}
                                                    >
                                                        <ChevronDown size={16} />
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {/* Sub-navigation */}
                                    {hasChildren && isExpanded && !collapsed && (
                                        <ul className={styles.subNav}>
                                            {item.children!.map((child) => (
                                                <li key={child.href}>
                                                    <Link
                                                        href={child.href}
                                                        className={`${styles.subNavLink} ${isActive(child.href) ? styles.subActive : ''
                                                            }`}
                                                    >
                                                        <span className={styles.subDot} />
                                                        {child.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Collapsed tooltip with children */}
                                    {hasChildren && collapsed && (
                                        <div className={styles.tooltip}>
                                            <span className={styles.tooltipTitle}>{item.label}</span>
                                            <ul className={styles.tooltipList}>
                                                {item.children!.map((child) => (
                                                    <li key={child.href}>
                                                        <Link
                                                            href={child.href}
                                                            className={`${styles.tooltipLink} ${isActive(child.href) ? styles.tooltipActive : ''
                                                                }`}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    );
}
