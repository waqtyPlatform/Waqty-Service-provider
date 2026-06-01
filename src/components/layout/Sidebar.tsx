'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import type { BusinessCategory } from '@/lib/contract';
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
    Wallet,
    Settings,
    ChevronLeft,
    ChevronDown,
    X,
    HelpCircle,
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
    businessType: BusinessCategory = 'salon',
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
                { label: t('sidebar.rooms'), href: '/bookings/rooms' },
                { label: t('waitlist.title'), href: '/bookings/waitlist' },
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
            children: [{ label: t('sidebar.returns'), href: '/returns' }],
        },
        {
            label: customersLabel,
            icon: <Users size={20} />,
            children: [
                { label: customersLabel, href: '/customers' },
                { label: t('sidebar.groups'), href: '/customers/groups' },
                { label: t('sidebar.statements'), href: '/customers/statements' },
                { label: t('sidebar.lastVisits'), href: '/customers/last-visits' },
                { label: t('reviews.title'), href: '/customers/reviews' },
            ],
        },
        {
            label: employeesLabel,
            icon: <UserCog size={20} />,
            children: [
                { label: employeesLabel, href: '/employees' },
                { label: t('sidebar.departments'), href: '/employees/departments' },
                { label: t('sidebar.schedule'), href: '/employees/schedule' },
                { label: t('sidebar.attendance'), href: '/employees/attendance' },
                { label: t('empLayout.tabPerformance'), href: '/employees/performance' },
                { label: t('sidebar.payroll'), href: '/employees/payroll' },
                { label: t('sidebar.roles'), href: '/employees/roles' },
                { label: t('sidebar.transfers'), href: '/employees/transfers' },
            ],
        },
        {
            label: t('sidebar.marketing'),
            icon: <Megaphone size={20} />,
            children: [
                { label: t('sidebar.offers'), href: '/marketing/offers' },
                { label: t('mktAds.title'), href: '/marketing/ads' },
                { label: t('sidebar.campaigns'), href: '/marketing/packages' },
                { label: t('sidebar.notifications'), href: '/marketing/notifications' },
                { label: t('sidebar.promoCodes'), href: '/marketing/promo-codes' },
                { label: t('sidebar.messages'), href: '/marketing/messages' },
                { label: t('sidebar.serviceGroups'), href: '/marketing/service-groups' },
                { label: t('announcements.title'), href: '/marketing/announcements' },
            ],
        },
        {
            label: t('sidebar.reports'),
            icon: <BarChart3 size={20} />,
            href: '/reports',
        },
        {
            label: t('sidebar.finance'),
            icon: <Wallet size={20} />,
            children: [{ label: t('sidebar.settlement'), href: '/finance/settlement' }],
        },
        {
            label: t('sidebar.settings'),
            icon: <Settings size={20} />,
            children: [
                { label: t('sidebar.general'), href: '/settings' },
                { label: t('sidebar.branches'), href: '/settings/branches' },
                { label: t('sidebar.roles'), href: '/settings/roles' },
                { label: t('sidebar.services'), href: '/settings/services' },
                { label: t('sidebar.svcCategories'), href: '/settings/service-categories' },
                { label: t('sidebar.svcEmployees'), href: '/settings/service-employees' },
                { label: t('sidebar.svcPricing'), href: '/settings/service-pricing' },
                { label: t('sidebar.hours'), href: '/settings/hours' },
                { label: t('sidebar.resources'), href: '/settings/resources' },
                { label: t('sidebar.paymentMethods'), href: '/settings/payment-methods' },
                { label: t('sidebar.invoiceSettings'), href: '/settings/invoice' },
                { label: t('sidebar.devices'), href: '/settings/devices' },
                { label: t('sidebar.safes'), href: '/settings/safes' },
                { label: t('sidebar.appearance'), href: '/settings/appearance' },
                { label: t('sidebar.localization'), href: '/settings/localization' },
                { label: t('sidebar.settingsNotifications'), href: '/settings/notifications' },
                { label: t('sidebar.security'), href: '/settings/security' },
                { label: t('sidebar.integrations'), href: '/settings/integrations' },
                { label: t('sidebar.subscription'), href: '/settings/subscription' },
                { label: t('sidebar.dataManagement'), href: '/settings/data' },
                { label: t('sidebar.auditLog'), href: '/settings/audit-log' },
                { label: t('sidebar.diaryAutomations'), href: '/settings/diary-automations' },
                { label: t('sidebar.shiftAutomations'), href: '/settings/shift-automations' },
                { label: t('sidebar.fpDevices'), href: '/settings/fingerprint-devices' },
                { label: t('sidebar.fpAreas'), href: '/settings/fingerprint-areas' },
                { label: t('sidebar.pettyCash'), href: '/settings/petty-cash-items' },
                { label: t('tipping.title'), href: '/settings/tipping' },
                { label: t('loyalty.title'), href: '/settings/loyalty' },
            ],
        },
        {
            label: t('help.title'),
            icon: <HelpCircle size={20} />,
            children: [
                { label: t('help.title'), href: '/help' },
                { label: t('help.bugReport'), href: '/help/bug-report' },
            ],
        },
    ];

    if (role === 'manager') {
        return fullNav.filter(
            n =>
                n.label !== t('sidebar.reports') &&
                n.label !== t('sidebar.settings') &&
                n.label !== t('sidebar.finance')
        );
    }
    if (role === 'staff') {
        const excluded = [
            t('sidebar.returns'),
            employeesLabel,
            t('sidebar.reports'),
            t('sidebar.settings'),
            t('sidebar.finance'),
        ];
        return fullNav.filter(n => !excluded.includes(n.label));
    }

    return fullNav;
};

function SidebarInner() {
    const { collapsed, toggleSidebar, mobileOpen, setMobileOpen } = useSidebar();
    const { user } = useAuth();
    const pathname = usePathname();
    const { t } = useTranslation();

    // Memoize the nav array so the 70-item allocation + translation lookups don't
    // run on every render (Sidebar re-renders on every route/user change).
    const navigation = useMemo(
        () => getNavigation(t, user?.businessType, user?.role),
        [t, user?.businessType, user?.role]
    );

    const [expandedItems, setExpandedItems] = useState<string[]>(() => {
        // Auto-expand the section that matches current path
        const matched = navigation.find(
            item => item.href === pathname || item.children?.some(child => pathname.startsWith(child.href))
        );
        return matched ? [matched.label] : [];
    });

    const toggleExpand = (label: string) => {
        setExpandedItems(prev => (prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]));
    };

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        if (pathname === href) return true;

        const pathSegments = pathname.split('/').filter(Boolean);
        const hrefSegments = href.split('/').filter(Boolean);

        if (hrefSegments.length > pathSegments.length) return false;

        // Ensure we don't partially match, e.g., '/employees/commissions' shouldn't match '/employees'
        // unless there is NO sub-item defined for '/employees/commissions'.
        const isMatchedByAnotherSpecificLink = navigation.some(item => {
            if (item.href === pathname && item.href !== href) return true;
            if (item.children?.some(child => child.href === pathname && child.href !== href)) return true;
            return false;
        });

        if (isMatchedByAnotherSpecificLink) {
            return false;
        }

        // Only consider it a prefix match if there are no exact matches elsewhere
        // But also, if the user is on /employees (exact), the prefix match for /employees
        // works. If they are on /employees/E001, it also works because no specific link matched.
        return pathname.startsWith(href + '/');
    };

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

            <aside
                className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${
                    mobileOpen ? styles.mobileOpen : ''
                }`}
            >
                {/* Header */}
                <div className={styles.header}>
                    {!collapsed ? (
                        <Link href="/" className={styles.logo}>
                            <div className={styles.logoIcon}>H</div>
                            <span className={styles.logoText}>Hagzy</span>
                        </Link>
                    ) : (
                        <button
                            className={styles.logoIconBtn}
                            onClick={toggleSidebar}
                            aria-label={t('nav.expandSidebar')}
                        >
                            <div className={styles.logoIcon}>H</div>
                        </button>
                    )}
                    {!collapsed && (
                        <button
                            className={styles.collapseBtn}
                            onClick={toggleSidebar}
                            aria-label={t('nav.collapseSidebar')}
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}
                    <button
                        className={styles.mobileCloseBtn}
                        onClick={() => setMobileOpen(false)}
                        aria-label={t('nav.closeMenu')}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        {navigation.map(item => {
                            const hasChildren = !!item.children;
                            const isExpanded = expandedItems.includes(item.label);
                            const itemActive = item.href
                                ? isActive(item.href)
                                : item.children?.some(child => isActive(child.href));

                            return (
                                <li key={item.label} className={styles.navItem}>
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className={`${styles.navLink} ${itemActive ? styles.active : ''}`}
                                            title={collapsed ? item.label : undefined}
                                        >
                                            <span className={styles.navIcon}>{item.icon}</span>
                                            {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                                        </Link>
                                    ) : (
                                        <button
                                            className={`${styles.navLink} ${itemActive ? styles.active : ''}`}
                                            onClick={() => {
                                                if (collapsed) {
                                                    toggleSidebar();
                                                    setExpandedItems(prev =>
                                                        prev.includes(item.label) ? prev : [...prev, item.label]
                                                    );
                                                } else {
                                                    toggleExpand(item.label);
                                                }
                                            }}
                                            title={collapsed ? item.label : undefined}
                                        >
                                            <span className={styles.navIcon}>{item.icon}</span>
                                            {!collapsed && (
                                                <>
                                                    <span className={styles.navLabel}>{item.label}</span>
                                                    <span
                                                        className={`${styles.chevron} ${
                                                            isExpanded ? styles.chevronOpen : ''
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
                                            {item.children!.map(child => (
                                                <li key={child.href}>
                                                    <Link
                                                        href={child.href}
                                                        className={`${styles.subNavLink} ${
                                                            isActive(child.href) ? styles.subActive : ''
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
                                                {item.children!.map(child => (
                                                    <li key={child.href}>
                                                        <Link
                                                            href={child.href}
                                                            className={`${styles.tooltipLink} ${
                                                                isActive(child.href) ? styles.tooltipActive : ''
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

const Sidebar = React.memo(SidebarInner);
export default Sidebar;
