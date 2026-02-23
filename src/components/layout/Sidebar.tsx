'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
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

const getNavigation = (businessType: 'clinic' | 'salon' | 'barber' = 'salon', role: 'admin' | 'manager' | 'staff' = 'admin'): NavItem[] => {
    const isClinic = businessType === 'clinic';
    const isBarber = businessType === 'barber';

    const bookingsLabel = isClinic || isBarber ? 'Appointments' : 'Bookings';
    const customersLabel = isClinic ? 'Patients' : 'Clients';
    const employeesLabel = isClinic ? 'Doctors & Staff' : isBarber ? 'Barbers' : 'Stylists';

    const fullNav: NavItem[] = [
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
            label: bookingsLabel,
            icon: <CalendarDays size={20} />,
            children: [
                { label: 'Calendar', href: '/bookings' },
                { label: 'Booking List', href: '/bookings/list' },
                { label: 'Room Calendar', href: '/bookings/rooms' },
                { label: 'New Booking', href: '/bookings/new' },
                { label: 'Print Schedule', href: '/bookings/print' },
            ],
        },
        {
            label: 'Transactions',
            icon: <Receipt size={20} />,
            children: [
                { label: 'Log', href: '/transactions' },
                { label: 'Cash Sales', href: '/transactions/cash-sales' },
                { label: 'Advance Payments', href: '/transactions/advance-payments' },
                { label: 'Petty Cash', href: '/transactions/petty-cash' },
                { label: 'Cashier Transfers', href: '/transactions/transfers' },
                { label: 'Safe Balances', href: '/transactions/safe-balances' },
                { label: 'Shifts', href: '/transactions/shifts' },
                { label: 'Dailies', href: '/transactions/dailies' },
                { label: 'Best Sales', href: '/transactions/best-sales' },
                { label: 'Client Sales', href: '/transactions/client-sales' },
                { label: 'Package Sales', href: '/transactions/package-sales' },
                { label: 'Expenses', href: '/expenses' },
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
            label: customersLabel,
            icon: <Users size={20} />,
            children: [
                { label: customersLabel, href: '/customers' },
                { label: 'Groups', href: '/customers/groups' },
                { label: 'Statements', href: '/customers/statements' },
                { label: 'Last Visits', href: '/customers/last-visits' },
            ],
        },
        {
            label: employeesLabel,
            icon: <UserCog size={20} />,
            children: [
                { label: `${employeesLabel} List`, href: '/employees' },
                { label: 'Departments', href: '/employees/departments' },
                { label: 'Positions', href: '/employees/positions' },
                { label: 'Branch Management', href: '/employees/branch-management' },
                { label: 'Transfer Log', href: '/employees/transfers' },
                { label: 'Fingerprints', href: '/employees/fingerprints' },
                { label: 'Attend Methods', href: '/employees/attend-methods' },
                { label: 'Attendance Log', href: '/employees/attendance' },
                { label: 'Attendance Settings', href: '/employees/attendance-settings' },
                { label: 'Commissions', href: '/employees/commissions' },
                { label: 'Commission Settings', href: '/employees/commission-settings' },
                { label: 'Payroll', href: '/employees/payroll' },
            ],
        },
        {
            label: 'Marketing',
            icon: <Megaphone size={20} />,
            children: [
                { label: 'Offers', href: '/marketing/offers' },
                { label: 'Campaigns', href: '/marketing/packages' },
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
                { label: 'Working Hours', href: '/settings/hours' },
                { label: 'Services', href: '/settings/services' },
                { label: 'Invoice', href: '/settings/invoice' },
                { label: 'Payment Methods', href: '/settings/payment-methods' },
                { label: 'Safes', href: '/settings/safes' },
                { label: 'Roles & Permissions', href: '/settings/roles' },
                { label: 'Appearance', href: '/settings/appearance' },
                { label: 'Devices', href: '/settings/devices' },
                { label: 'Integrations', href: '/settings/integrations' },
                { label: 'Audit Log', href: '/settings/audit-log' },
                { label: 'Subscription', href: '/settings/subscription' },
            ],
        },
    ];

    if (role === 'manager') {
        return fullNav.filter(n => n.label !== 'Reports' && n.label !== 'Settings');
    }
    if (role === 'staff') {
        return fullNav.filter(n => !['Returns', employeesLabel, 'Reports', 'Settings'].includes(n.label));
    }

    return fullNav;
};

export default function Sidebar() {
    const { collapsed, toggleSidebar, mobileOpen, setMobileOpen } = useSidebar();
    const { user } = useAuth();
    const pathname = usePathname();

    const navigation = getNavigation(user?.businessType, user?.role);

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
        // Check if the current pathname is EXACTLY the href
        if (pathname === href) return true;
        // Check if the current pathname is a deeper nested route of this href
        // But ONLY if the href isn't a top-level matching trap like '/employees' when we are on '/employees/departments'
        // A simple way to handle this in our specific route structure:
        const pathSegments = pathname.split('/').filter(Boolean);
        const hrefSegments = href.split('/').filter(Boolean);

        // If href has more segments than current path, it can't be active
        if (hrefSegments.length > pathSegments.length) return false;

        // If they have the exact same number of segments, they must match exactly to be true (handled above by pathname === href)
        if (hrefSegments.length === pathSegments.length) return false;

        // For cases where we are deeper (e.g. /employees/E001) we want the parent to be active ONLY if that deeper route ISN'T mapped as its own distinct sub-item.
        // E.g., /employees/departments has its own sub-item. /employees/E001 does not.

        // Find if any OTHER navigation item explicitly matches the CURRENT pathname exactly.
        const isMatchedByAnotherSpecificLink = navigation.some(item => {
            if (item.href === pathname) return true;
            if (item.children?.some(child => child.href === pathname)) return true;
            return false;
        });

        // If another sublink explicitly matches (like /employees/departments), don't light up the generic parent (/employees).
        if (isMatchedByAnotherSpecificLink) {
            return false;
        }

        // Lastly, if no specific link matched, safely fall back to checking if this href is the prefix (e.g., highlighting /employees for /employees/E001)
        return pathname.startsWith(href + '/');
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
