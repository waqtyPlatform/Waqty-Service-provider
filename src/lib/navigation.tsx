import React from 'react';
import {
    LayoutDashboard,
    CalendarDays,
    ShoppingBag,
    Users,
    UserCog,
    Wallet,
    Megaphone,
    BarChart3,
    Settings,
    HelpCircle,
} from 'lucide-react';
import type { BusinessCategory } from '@/lib/contract';
import type { UserRole } from '@/contexts/AuthContext';
import { isRouteAllowedForRole } from '@/components/RoleGuard';

export interface NavChild {
    label: string;
    href: string;
    roles?: UserRole[];
}

export interface NavGroup {
    id: string;
    label: string;
    icon: React.ReactNode;
    href?: string;
    roles?: UserRole[];
    children?: NavChild[];
}

export interface Navigation {
    primary: NavGroup[];
    footer: NavGroup[];
}

type TFn = (key: string) => string;

// ─────────────────────────────────────────────────────────────────────
// Single source of truth for the Service Provider navigation, consumed by
// the Sidebar and the command palette so the two can't drift. The 12 legacy
// groups collapse to 7 primary destinations + a footer cluster (Reports /
// Settings / Help). "Money" absorbs Transactions, Expenses, Returns and
// Settlement. No routes move — sub-pages stay reachable via the group's
// children. Role visibility derives from RoleGuard's ROLE_RESTRICTED_ROUTES
// (via isRouteAllowedForRole) plus optional per-node `roles`. Labels adapt to
// business type (clinic → patients/doctors, barber → barbers, salon → clients/stylists).
// ─────────────────────────────────────────────────────────────────────
export function buildNavigation(
    t: TFn,
    businessType: BusinessCategory = 'salon',
    role: UserRole = 'admin'
): Navigation {
    const isClinic = businessType === 'clinic';
    const isBarber = businessType === 'barber';
    const bookingsLabel = isClinic || isBarber ? t('sidebar.appointments') : t('sidebar.bookings');
    const customersLabel = isClinic ? t('sidebar.patients') : t('sidebar.clients');
    const employeesLabel = isClinic ? t('sidebar.doctors') : isBarber ? t('sidebar.barbers') : t('sidebar.stylists');

    const primary: NavGroup[] = [
        { id: 'home', label: t('sidebar.dashboard'), icon: <LayoutDashboard size={20} />, href: '/' },
        {
            id: 'bookings',
            label: bookingsLabel,
            icon: <CalendarDays size={20} />,
            children: [
                { label: t('sidebar.calendar'), href: '/bookings' },
                { label: t('sidebar.bookingList'), href: '/bookings/list' },
                { label: t('sidebar.newBooking'), href: '/bookings/new' },
                { label: t('sidebar.rooms'), href: '/bookings/rooms' },
                { label: t('waitlist.title'), href: '/bookings/waitlist' },
                { label: t('sidebar.payments'), href: '/bookings/payments' },
            ],
        },
        {
            id: 'sales',
            label: t('sidebar.sales'),
            icon: <ShoppingBag size={20} />,
            children: [
                { label: t('sidebar.services'), href: '/sales' },
                { label: t('sidebar.packages'), href: '/sales/packages' },
            ],
        },
        {
            id: 'clients',
            label: customersLabel,
            icon: <Users size={20} />,
            children: [
                { label: customersLabel, href: '/customers' },
                { label: t('sidebar.clientAccounts'), href: '/customers/clients' },
                { label: t('sidebar.groups'), href: '/customers/groups' },
                { label: t('sidebar.statements'), href: '/customers/statements' },
                { label: t('sidebar.lastVisits'), href: '/customers/last-visits' },
                { label: t('reviews.title'), href: '/customers/reviews' },
            ],
        },
        {
            id: 'team',
            label: employeesLabel,
            icon: <UserCog size={20} />,
            roles: ['admin', 'manager'],
            children: [
                { label: employeesLabel, href: '/employees' },
                { label: t('sidebar.availability'), href: '/employees/availability' },
                { label: t('sidebar.departments'), href: '/employees/departments' },
                { label: t('sidebar.schedule'), href: '/employees/schedule' },
                { label: t('sidebar.attendance'), href: '/employees/attendance' },
                { label: t('empLayout.tabPerformance'), href: '/employees/performance' },
                { label: t('sidebar.payroll'), href: '/employees/payroll' },
                { label: t('sidebar.positions'), href: '/employees/positions' },
                { label: t('sidebar.branchMgmt'), href: '/employees/branch-management' },
                { label: t('sidebar.roles'), href: '/employees/roles' },
                { label: t('sidebar.transfers'), href: '/employees/transfers' },
            ],
        },
        {
            id: 'money',
            label: t('sidebar.money'),
            icon: <Wallet size={20} />,
            children: [
                { label: t('sidebar.log'), href: '/transactions' },
                { label: t('sidebar.expenses'), href: '/expenses' },
                { label: t('sidebar.returns'), href: '/returns', roles: ['admin', 'manager'] },
                { label: t('sidebar.settlement'), href: '/finance/settlement', roles: ['admin'] },
            ],
        },
        {
            id: 'marketing',
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
    ];

    const footer: NavGroup[] = [
        {
            id: 'reports',
            label: t('sidebar.reports'),
            icon: <BarChart3 size={20} />,
            roles: ['admin'],
            children: [
                { label: t('sidebar.reports'), href: '/reports' },
                { label: t('sidebar.revenue'), href: '/reports/revenue' },
            ],
        },
        {
            id: 'settings',
            label: t('sidebar.settings'),
            icon: <Settings size={20} />,
            roles: ['admin'],
            children: [
                { label: t('sidebar.general'), href: '/settings' },
                { label: t('sidebar.profile'), href: '/settings/profile' },
                { label: t('sidebar.branches'), href: '/settings/branches' },
                { label: t('sidebar.roles'), href: '/settings/roles' },
                { label: t('sidebar.services'), href: '/settings/services' },
                { label: t('sidebar.svcCategories'), href: '/settings/service-categories' },
                { label: t('sidebar.svcEmployees'), href: '/settings/service-employees' },
                { label: t('sidebar.svcPricing'), href: '/settings/service-pricing' },
                { label: t('sidebar.pricingGroups'), href: '/settings/pricing-groups' },
                { label: t('sidebar.hours'), href: '/settings/hours' },
                { label: t('sidebar.shifts'), href: '/settings/shifts' },
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
            id: 'help',
            label: t('help.title'),
            icon: <HelpCircle size={20} />,
            children: [
                { label: t('help.title'), href: '/help' },
                { label: t('help.bugReport'), href: '/help/bug-report' },
            ],
        },
    ];

    const allow = (roles: UserRole[] | undefined, href: string | undefined) =>
        (!roles || roles.includes(role)) && (!href || isRouteAllowedForRole(href, role));

    const filterGroups = (groups: NavGroup[]): NavGroup[] =>
        groups
            .map(g => ({ ...g, children: g.children?.filter(c => allow(c.roles, c.href)) }))
            .filter(g => allow(g.roles, g.href) && (!!g.href || (g.children?.length ?? 0) > 0));

    return { primary: filterGroups(primary), footer: filterGroups(footer) };
}
