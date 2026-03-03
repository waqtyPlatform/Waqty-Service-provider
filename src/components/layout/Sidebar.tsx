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
    X,
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { useTranslation } from '@/hooks/useTranslation';

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

const getNavigation = (
    t: (key: string) => string,
    businessType: 'clinic' | 'salon' | 'barber' = 'salon',
    role: 'admin' | 'manager' | 'staff' = 'admin'
): NavItem[] => {
    const isClinic = businessType === 'clinic';
    const isBarber = businessType === 'barber';

    const bookingsLabel = isClinic || isBarber ? t('sidebar.appointments') : t('sidebar.bookings');
    const customersLabel = isClinic ? t('sidebar.patients') : t('sidebar.clients');
    const employeesLabel = isClinic ? t('sidebar.doctors') : isBarber ? t('sidebar.barbers') : t('sidebar.stylists');

    const fullNav: NavItem[] = [
        {
            label: t('sidebar.dashboard'),
            icon: <LayoutDashboard size={20} />,
            href: '/',
        },
        {
            label: t('sidebar.sales'),
            icon: <ShoppingBag size={20} />,
            children: [
                { label: t('sidebar.services'), href: '/sales' },
                { label: t('sidebar.packages'), href: '/sales/packages' },
            ],
        },
        {
            label: bookingsLabel,
            icon: <CalendarDays size={20} />,
            children: [
                { label: t('sidebar.calendar'), href: '/bookings' },
                { label: t('sidebar.bookingList'), href: '/bookings/list' },
                { label: t('sidebar.newBooking'), href: '/bookings/new' },
            ],
        },
        {
            label: t('sidebar.transactions'),
            icon: <Receipt size={20} />,
            children: [
                { label: t('sidebar.log'), href: '/transactions' },
                { label: t('sidebar.expenses'), href: '/expenses' },
            ],
        },
        {
            label: t('sidebar.returns'),
            icon: <RotateCcw size={20} />,
            children: [
                { label: t('sidebar.returns'), href: '/returns' },
            ],
        },
        {
            label: customersLabel,
            icon: <Users size={20} />,
            children: [
                { label: customersLabel, href: '/customers' },
                { label: t('sidebar.groups'), href: '/customers/groups' },
            ],
        },
        {
            label: employeesLabel,
            icon: <UserCog size={20} />,
            children: [
                { label: employeesLabel, href: '/employees' },
                { label: t('sidebar.departments'), href: '/employees/departments' },
                { label: t('sidebar.attendance'), href: '/employees/attendance' },
                { label: t('sidebar.payroll'), href: '/employees/payroll' },
            ],
        },
        {
            label: t('sidebar.marketing'),
            icon: <Megaphone size={20} />,
            children: [
                { label: t('sidebar.offers'), href: '/marketing/offers' },
                { label: t('sidebar.campaigns'), href: '/marketing/packages' },
            ],
        },
        {
            label: t('sidebar.reports'),
            icon: <BarChart3 size={20} />,
            href: '/reports',
        },
        {
            label: t('sidebar.settings'),
            icon: <Settings size={20} />,
            children: [
                { label: t('sidebar.general'), href: '/settings' },
                { label: t('sidebar.branches'), href: '/settings/branches' },
                { label: t('sidebar.roles'), href: '/settings/roles' },
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
    const { t } = useTranslation();

    const navigation = getNavigation(t, user?.businessType, user?.role);

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
