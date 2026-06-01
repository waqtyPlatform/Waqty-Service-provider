'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    providerApi,
    dashboardApi,
    type Booking,
    type Employee as ApiEmployee,
    type DashboardSummary,
} from '@/lib/api';
import { useApiQuery } from '@/hooks/useApiQuery';
import { KPICardSkeleton } from '@/components/ui/Skeleton';
import {
    DollarSign,
    CalendarDays,
    UserPlus,
    FileText,
    RotateCcw,
    TrendingUp,
    TrendingDown,
    CalendarCheck,
    X,
    Image,
    Clock,
    UserCog,
    Globe,
    CreditCard,
    ChevronRight,
} from 'lucide-react';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';

// Lazy-load Recharts wrappers so the dashboard's initial paint isn't blocked
// by Recharts' `ResponsiveContainer` size-detector (forced reflow on mount).
const KpiSparkline = dynamic(() => import('@/components/dashboard/KpiSparkline'), {
    ssr: false,
    loading: () => null,
});
const BookingStatusDonut = dynamic(() => import('@/components/dashboard/BookingStatusDonut'), {
    ssr: false,
    loading: () => null,
});

// Lazy-load the below-the-fold sections (top-clients/employees/services tables
// + summary strip). They're outside the initial viewport, so paying their
// render cost during first paint is wasted work.
const DashboardBottomSections = dynamic(() => import('@/components/dashboard/DashboardBottomSections'), {
    ssr: false,
    loading: () => <div className={styles.cardSkeleton} />,
});

const dateRanges = ['Today', 'This Week', 'This Month', 'This Quarter', 'Custom'];

const kpiData = [
    {
        label: 'Total Revenue',
        value: '12,450',
        unit: 'EGP',
        trend: '+12.5%',
        trendUp: true,
        icon: <DollarSign size={22} />,
        colorClass: 'kpiIconGreen',
        sparkData: [{ v: 40 }, { v: 55 }, { v: 45 }, { v: 60 }, { v: 50 }, { v: 70 }, { v: 65 }],
    },
    {
        label: 'Bookings',
        value: '47',
        unit: '',
        trend: '+8.2%',
        trendUp: true,
        icon: <CalendarDays size={22} />,
        colorClass: 'kpiIconBlue',
        sparkData: [{ v: 30 }, { v: 38 }, { v: 32 }, { v: 42 }, { v: 45 }, { v: 40 }, { v: 47 }],
    },
    {
        label: 'New Clients',
        value: '12',
        unit: '',
        trend: '+25%',
        trendUp: true,
        icon: <UserPlus size={22} />,
        colorClass: 'kpiIconPurple',
        sparkData: [{ v: 5 }, { v: 8 }, { v: 6 }, { v: 10 }, { v: 9 }, { v: 11 }, { v: 12 }],
    },
    {
        label: 'Invoices',
        value: '38',
        unit: '',
        trend: '-3.1%',
        trendUp: false,
        icon: <FileText size={22} />,
        colorClass: 'kpiIconOrange',
        sparkData: [{ v: 42 }, { v: 40 }, { v: 44 }, { v: 39 }, { v: 41 }, { v: 37 }, { v: 38 }],
    },
    {
        label: 'Returns',
        value: '3',
        unit: '',
        trend: '-40%',
        trendUp: true,
        icon: <RotateCcw size={22} />,
        colorClass: 'kpiIconRed',
        sparkData: [{ v: 7 }, { v: 5 }, { v: 6 }, { v: 4 }, { v: 5 }, { v: 4 }, { v: 3 }],
    },
];

const occupancyData = [
    { employee: 'Sara Ahmed', booked: 7, total: 9, pct: 78 },
    { employee: 'Nora Ali', booked: 6, total: 9, pct: 67 },
    { employee: 'Layla Hassan', booked: 8, total: 9, pct: 89 },
    { employee: 'Reem Mohamed', booked: 5, total: 9, pct: 56 },
    { employee: 'Hana Youssef', booked: 4, total: 9, pct: 44 },
];

const bookingStatusData = [
    { name: 'Confirmed', value: 18, color: 'var(--status-confirmed)' },
    { name: 'Completed', value: 12, color: 'var(--status-completed)' },
    { name: 'Arrived', value: 7, color: 'var(--status-arrived)' },
    { name: 'Unconfirmed', value: 5, color: 'var(--status-unconfirmed)' },
    { name: 'Cancelled', value: 3, color: 'var(--status-cancelled)' },
    { name: 'No-Show', value: 2, color: 'var(--status-no-show)' },
];

const topClients = [
    { rank: 1, name: 'Fatima Al-Rashid', visits: 24, spend: '8,400', id: 'C001' },
    { rank: 2, name: 'Aisha Mohammed', visits: 19, spend: '6,250', id: 'C002' },
    { rank: 3, name: 'Maryam Ibrahim', visits: 17, spend: '5,800', id: 'C003' },
    { rank: 4, name: 'Huda Saleh', visits: 15, spend: '4,900', id: 'C004' },
    { rank: 5, name: 'Noura Ahmed', visits: 12, spend: '3,600', id: 'C005' },
];

const topEmployees = [
    { rank: 1, name: 'Layla Hassan', bookings: 42, revenue: '14,200', id: 'E003' },
    { rank: 2, name: 'Sara Ahmed', bookings: 38, revenue: '12,800', id: 'E001' },
    { rank: 3, name: 'Nora Ali', bookings: 35, revenue: '11,500', id: 'E002' },
    { rank: 4, name: 'Reem Mohamed', bookings: 30, revenue: '9,800', id: 'E004' },
    { rank: 5, name: 'Hana Youssef', bookings: 25, revenue: '8,100', id: 'E005' },
];

const topServices = [
    { rank: 1, name: 'Hair Coloring', count: 58, revenue: '23,200' },
    { rank: 2, name: 'Keratin Treatment', count: 42, revenue: '21,000' },
    { rank: 3, name: 'Facial Treatment', count: 55, revenue: '16,500' },
    { rank: 4, name: 'Manicure & Pedicure', count: 67, revenue: '13,400' },
    { rank: 5, name: 'Haircut & Styling', count: 72, revenue: '10,800' },
];

function getProgressColor(pct: number) {
    if (pct >= 80) return 'var(--color-success)';
    if (pct >= 60) return 'var(--color-primary-500)';
    if (pct >= 40) return 'var(--color-warning)';
    return 'var(--color-error)';
}

function pseudoRandom(seed: string) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    }
    return (Math.abs(h) % 100) / 100;
}

/** Compute from_date / to_date for the selected date range tab */
function getDateRangeFilters(range: string): { from_date: string; to_date: string } {
    const now = new Date();
    const toDate = now.toISOString().split('T')[0];
    let fromDate = toDate;

    switch (range) {
        case 'Today':
            fromDate = toDate;
            break;
        case 'This Week': {
            const day = now.getDay();
            const diff = day === 0 ? 6 : day - 1; // Monday-based week
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - diff);
            fromDate = weekStart.toISOString().split('T')[0];
            break;
        }
        case 'This Month':
            fromDate = toDate.slice(0, 8) + '01';
            break;
        case 'This Quarter': {
            const quarter = Math.floor(now.getMonth() / 3);
            const quarterStart = new Date(now.getFullYear(), quarter * 3, 1);
            fromDate = quarterStart.toISOString().split('T')[0];
            break;
        }
        default:
            fromDate = toDate.slice(0, 8) + '01'; // fallback to month
            break;
    }
    return { from_date: fromDate, to_date: toDate };
}

/** Fallback KPI mock data shaped like a DashboardSummary */
const FALLBACK_SUMMARY: DashboardSummary = {
    total_revenue: 12450,
    total_bookings: 47,
    new_clients: 12,
    total_invoices: 38,
    total_returns: 3,
    revenue_trend: 12.5,
    bookings_trend: 8.2,
    clients_trend: 25,
    top_services: [
        { name: 'Hair Coloring', revenue: 23200, count: 58 },
        { name: 'Keratin Treatment', revenue: 21000, count: 42 },
        { name: 'Facial Treatment', revenue: 16500, count: 55 },
        { name: 'Manicure & Pedicure', revenue: 13400, count: 67 },
        { name: 'Haircut & Styling', revenue: 10800, count: 72 },
    ],
    top_employees: [
        { name: 'Layla Hassan', revenue: 14200, bookings: 42 },
        { name: 'Sara Ahmed', revenue: 12800, bookings: 38 },
        { name: 'Nora Ali', revenue: 11500, bookings: 35 },
        { name: 'Reem Mohamed', revenue: 9800, bookings: 30 },
        { name: 'Hana Youssef', revenue: 8100, bookings: 25 },
    ],
    top_clients: [
        { name: 'Fatima Al-Rashid', visits: 24, spent: 8400 },
        { name: 'Aisha Mohammed', visits: 19, spent: 6250 },
        { name: 'Maryam Ibrahim', visits: 17, spent: 5800 },
        { name: 'Huda Saleh', visits: 15, spent: 4900 },
        { name: 'Noura Ahmed', visits: 12, spent: 3600 },
    ],
    booking_status_distribution: [
        { status: 'Confirmed', count: 18 },
        { status: 'Completed', count: 12 },
        { status: 'Arrived', count: 7 },
        { status: 'Unconfirmed', count: 5 },
        { status: 'Cancelled', count: 3 },
        { status: 'No-Show', count: 2 },
    ],
    revenue_by_day: [],
    occupancy_rate: 67,
};

export default function DashboardPage() {
    const [activeDate, setActiveDate] = useState('Today');
    const [showProfileBanner, setShowProfileBanner] = useState(true);
    const router = useRouter();
    const { user } = useAuth();
    const { t, lang } = useTranslation();

    // ── Dashboard Summary API ──
    const dateFilters = useMemo(() => getDateRangeFilters(activeDate), [activeDate]);
    const {
        data: summaryData,
        loading: summaryLoading,
        refetch: _refetchSummary,
    } = useApiQuery<DashboardSummary>(() => dashboardApi.getSummary(dateFilters), [dateFilters], {
        fallbackData: FALLBACK_SUMMARY,
    });

    // Check if banner was previously dismissed
    useEffect(() => {
        const dismissed = localStorage.getItem('hagzy_profile_banner_dismissed');
        if (dismissed) {
            // Use startTransition to avoid synchronous setState in effect warning
            React.startTransition(() => setShowProfileBanner(false));
        }
    }, []);

    const dismissProfileBanner = () => {
        setShowProfileBanner(false);
        localStorage.setItem('hagzy_profile_banner_dismissed', 'true');
    };

    const profileSetupItems = [
        { icon: <Image size={18} aria-hidden />, label: t('dash.profileAddLogo'), href: '/settings', color: '#7C3AED' },
        { icon: <Clock size={18} />, label: t('dash.profileWorkingHours'), href: '/settings/hours', color: '#0EA5E9' },
        { icon: <UserCog size={18} />, label: t('dash.profileTeam'), href: '/employees', color: '#F59E0B' },
        { icon: <Globe size={18} />, label: t('dash.profileServices'), href: '/settings/services', color: '#10B981' },
        {
            icon: <CreditCard size={18} />,
            label: t('dash.profilePayment'),
            href: '/settings/payment-methods',
            color: '#EF4444',
        },
    ];

    // ── Real API data ──
    const [apiBookings, setApiBookings] = useState<Booking[] | null>(null);
    const [apiEmployees, setApiEmployees] = useState<ApiEmployee[] | null>(null);
    const [_dashLoading, setDashLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const monthStart = today.slice(0, 8) + '01';
                const [bookingsRes, employeesRes] = await Promise.allSettled([
                    providerApi.getBookings({ from_date: monthStart, to_date: today, per_page: 100 }),
                    providerApi.getEmployees(),
                ]);
                if (cancelled) return;
                if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success && bookingsRes.value.data) {
                    setApiBookings(bookingsRes.value.data);
                }
                if (employeesRes.status === 'fulfilled' && employeesRes.value.success && employeesRes.value.data) {
                    setApiEmployees(employeesRes.value.data);
                }
            } catch {
                // Fall back to mock data
            } finally {
                if (!cancelled) setDashLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // ── Compute booking status from real data ──
    const liveBookingStatusData = React.useMemo(() => {
        if (!apiBookings) return null;
        const counts: Record<string, number> = {
            confirmed: 0,
            completed: 0,
            pending: 0,
            cancelled: 0,
            no_show: 0,
        };
        for (const b of apiBookings) {
            const status = b.status.toLowerCase();
            if (status in counts) counts[status]++;
        }
        return [
            { name: 'Confirmed', value: counts.confirmed, color: 'var(--status-confirmed)' },
            { name: 'Completed', value: counts.completed, color: 'var(--status-completed)' },
            { name: 'Pending', value: counts.pending, color: 'var(--status-unconfirmed)' },
            { name: 'Cancelled', value: counts.cancelled, color: 'var(--status-cancelled)' },
            { name: 'No-Show', value: counts.no_show, color: 'var(--status-no-show)' },
        ].filter(d => d.value > 0);
    }, [apiBookings]);

    // ── Compute employee occupancy from real data ──
    const liveOccupancyData = React.useMemo(() => {
        if (!apiBookings || !apiEmployees) return null;
        return apiEmployees.slice(0, 5).map(emp => {
            const empBookings = apiBookings.filter(b => b.employee_uuid === emp.uuid);
            const total = 9; // Approximate daily slots
            const booked = Math.min(empBookings.length, total);
            const pct = total > 0 ? Math.round((booked / total) * 100) : 0;
            return { employee: emp.name, booked, total, pct };
        });
    }, [apiBookings, apiEmployees]);

    const businessType = user?.businessType || 'salon';
    const isClinic = businessType === 'clinic';
    const isBarber = businessType === 'barber';

    const clientTerm = isClinic ? 'Patient' : 'Client';
    const clientsTerm = isClinic ? 'Patients' : 'Clients';
    const _bookingTerm = isClinic || isBarber ? 'Appointment' : 'Booking';
    const bookingsTerm = isClinic || isBarber ? 'Appointments' : 'Bookings';
    const employeeTerm = isClinic ? 'Doctor/Staff' : isBarber ? 'Barber' : 'Stylist';
    const employeesTerm = isClinic ? 'Doctors & Staff' : isBarber ? 'Barbers' : 'Stylists';

    // Business-type-aware KPI labels (uses translation keys so EN/AR both flip)
    const kpiBookingsLabel = isClinic || isBarber ? t('dash.kpiAppointments') : t('dash.kpiBookings');
    const kpiNewClientsLabel = isClinic ? t('dash.kpiNewPatients') : t('dash.kpiNewClients');

    const formatNum = (num: number) => num.toLocaleString('en-US');

    // ── Use API summary data (with fallback) for all KPI / top sections ──
    const summary = summaryData ?? FALLBACK_SUMMARY;

    const currentKpiData = useMemo(() => {
        return [
            {
                label: t('dash.kpiRev'),
                value: formatNum(Math.round(summary.total_revenue)),
                unit: 'EGP',
                trend: `${summary.revenue_trend >= 0 ? '+' : ''}${summary.revenue_trend}%`,
                trendUp: summary.revenue_trend >= 0,
                icon: <DollarSign size={22} />,
                colorClass: 'kpiIconGreen',
                sparkData: kpiData[0].sparkData.map((d, i) => ({
                    v: Math.round(d.v * (1 + (pseudoRandom('revenue' + activeDate + i) * 0.2 - 0.1))),
                })),
            },
            {
                label: kpiBookingsLabel,
                value: formatNum(summary.total_bookings),
                unit: '',
                trend: `${summary.bookings_trend >= 0 ? '+' : ''}${summary.bookings_trend}%`,
                trendUp: summary.bookings_trend >= 0,
                icon: <CalendarDays size={22} />,
                colorClass: 'kpiIconBlue',
                sparkData: kpiData[1].sparkData.map((d, i) => ({
                    v: Math.round(d.v * (1 + (pseudoRandom('bookings' + activeDate + i) * 0.2 - 0.1))),
                })),
            },
            {
                label: kpiNewClientsLabel,
                value: formatNum(summary.new_clients),
                unit: '',
                trend: `${summary.clients_trend >= 0 ? '+' : ''}${summary.clients_trend}%`,
                trendUp: summary.clients_trend >= 0,
                icon: <UserPlus size={22} />,
                colorClass: 'kpiIconPurple',
                sparkData: kpiData[2].sparkData.map((d, i) => ({
                    v: Math.round(d.v * (1 + (pseudoRandom('clients' + activeDate + i) * 0.2 - 0.1))),
                })),
            },
            {
                label: t('dash.kpiInvoices'),
                value: formatNum(summary.total_invoices),
                unit: '',
                trend:
                    summary.total_invoices > 0
                        ? '+' +
                          Math.round((summary.total_invoices / Math.max(summary.total_bookings, 1)) * 100 - 100) +
                          '%'
                        : '0%',
                trendUp: summary.total_invoices >= summary.total_bookings * 0.8,
                icon: <FileText size={22} />,
                colorClass: 'kpiIconOrange',
                sparkData: kpiData[3].sparkData.map((d, i) => ({
                    v: Math.round(d.v * (1 + (pseudoRandom('invoices' + activeDate + i) * 0.2 - 0.1))),
                })),
            },
            {
                label: t('dash.kpiReturns'),
                value: formatNum(summary.total_returns),
                unit: '',
                trend:
                    summary.total_returns <= 3
                        ? '-40%'
                        : `+${Math.round((summary.total_returns / Math.max(summary.total_bookings, 1)) * 100)}%`,
                trendUp: summary.total_returns <= 3,
                icon: <RotateCcw size={22} />,
                colorClass: 'kpiIconRed',
                sparkData: kpiData[4].sparkData.map((d, i) => ({
                    v: Math.round(d.v * (1 + (pseudoRandom('returns' + activeDate + i) * 0.2 - 0.1))),
                })),
            },
        ];
    }, [summary, activeDate, t, kpiBookingsLabel, kpiNewClientsLabel]);

    const currentOccupancyData = useMemo(() => {
        // Use real data from bookings/employees if available
        if (liveOccupancyData) {
            return liveOccupancyData;
        }
        return occupancyData.map(d => {
            const pct = Math.min(100, Math.max(0, d.pct + (pseudoRandom(d.employee + activeDate) * 10 - 5)));
            const booked = Math.round((pct / 100) * d.total);
            return { ...d, booked: Math.min(booked, d.total), pct: Math.round(pct) };
        });
    }, [activeDate, liveOccupancyData]);

    const currentBookingStatusData = useMemo(() => {
        // Use real data from bookings API if available
        if (liveBookingStatusData) {
            return liveBookingStatusData;
        }
        // Use summary distribution if available from dashboard API
        if (summary.booking_status_distribution.length > 0) {
            const colorMap: Record<string, string> = {
                Confirmed: 'var(--status-confirmed)',
                Completed: 'var(--status-completed)',
                Arrived: 'var(--status-arrived)',
                Unconfirmed: 'var(--status-unconfirmed)',
                Cancelled: 'var(--status-cancelled)',
                'No-Show': 'var(--status-no-show)',
            };
            return summary.booking_status_distribution.map(d => ({
                name: d.status,
                value: d.count,
                color: colorMap[d.status] || 'var(--color-primary-500)',
            }));
        }
        return bookingStatusData;
    }, [liveBookingStatusData, summary]);

    const currentTopClients = useMemo(() => {
        if (summary.top_clients.length > 0) {
            return summary.top_clients.map((c, i) => ({
                rank: i + 1,
                name: c.name,
                visits: c.visits,
                spend: formatNum(Math.round(c.spent)),
                id: `C${String(i + 1).padStart(3, '0')}`,
            }));
        }
        return topClients;
    }, [summary]);

    const currentTopEmployees = useMemo(() => {
        if (summary.top_employees.length > 0) {
            return summary.top_employees.map((e, i) => ({
                rank: i + 1,
                name: e.name,
                bookings: e.bookings,
                revenue: formatNum(Math.round(e.revenue)),
                id: `E${String(i + 1).padStart(3, '0')}`,
            }));
        }
        return topEmployees;
    }, [summary]);

    const currentTopServices = useMemo(() => {
        if (summary.top_services.length > 0) {
            return summary.top_services.map((s, i) => ({
                rank: i + 1,
                name: s.name,
                count: s.count,
                revenue: formatNum(Math.round(s.revenue)),
            }));
        }
        return topServices;
    }, [summary]);

    const totalBookings = currentBookingStatusData.reduce((s, d) => s + d.value, 0);

    return (
        <div className={`${styles.dashboard} stagger-children`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1>{t('dash.dashboard')}</h1>
                    <p>{t('dash.welcome')}</p>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.dateControls}>
                        {dateRanges.map(range => (
                            <button
                                key={range}
                                className={`${styles.dateBtn} ${activeDate === range ? styles.dateBtnActive : ''}`}
                                onClick={() => setActiveDate(range)}
                            >
                                {t(
                                    range === 'Today'
                                        ? 'dash.dateToday'
                                        : range === 'This Week'
                                          ? 'dash.dateWeek'
                                          : range === 'This Month'
                                            ? 'dash.dateMonth'
                                            : range === 'This Quarter'
                                              ? 'dash.dateQuarter'
                                              : 'dash.dateCustom'
                                )}
                            </button>
                        ))}
                    </div>
                    <button className={styles.quickActionBtn} onClick={() => router.push('/bookings/new')}>
                        <CalendarCheck size={16} /> {t('dash.newBooking')}
                    </button>
                    <button className={styles.quickActionBtnOutline} onClick={() => router.push('/sales?quick=true')}>
                        <DollarSign size={16} /> {t('dash.quickSale')}
                    </button>
                </div>
            </div>

            {/* Profile Completion Banner */}
            {user?.isNewWorkspace && showProfileBanner && (
                <div className={styles.profileBanner}>
                    <div className={styles.profileBannerHeader}>
                        <div>
                            <h3 className={styles.profileBannerTitle}>{t('dash.profileTitle')}</h3>
                            <p className={styles.profileBannerDesc}>{t('dash.profileDesc')}</p>
                        </div>
                        <button className={styles.profileBannerClose} onClick={dismissProfileBanner}>
                            <X size={18} />
                        </button>
                    </div>
                    <div className={styles.profileBannerItems}>
                        {profileSetupItems.map(item => (
                            <button
                                key={item.label}
                                className={styles.profileBannerItem}
                                onClick={() => router.push(item.href)}
                            >
                                <div
                                    className={styles.profileBannerItemIcon}
                                    style={{ background: `${item.color}14`, color: item.color }}
                                >
                                    {item.icon}
                                </div>
                                <span>{item.label}</span>
                                <ChevronRight size={14} className={styles.profileBannerItemArrow} />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <>
                {/* KPI Cards */}
                {summaryLoading ? (
                    <div className={styles.kpiGrid}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <KPICardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className={`${styles.kpiGrid} ${styles.fadeStaggerRow}`}>
                        {currentKpiData.map(kpi => (
                            <div key={kpi.label} className={styles.kpiCard}>
                                <div className={styles.kpiHeader}>
                                    <div className={`${styles.kpiIcon} ${styles[kpi.colorClass]}`}>{kpi.icon}</div>
                                    <span
                                        className={`${styles.kpiTrend} ${
                                            kpi.trendUp ? styles.kpiTrendUp : styles.kpiTrendDown
                                        }`}
                                    >
                                        {kpi.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {kpi.trend}
                                    </span>
                                </div>
                                <div>
                                    <span className={styles.kpiValue}>
                                        {kpi.value}
                                        {kpi.unit && (
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-lg)',
                                                    fontWeight: 'var(--font-medium)',
                                                    marginInlineStart: '4px',
                                                    color: 'var(--text-tertiary)',
                                                }}
                                            >
                                                {kpi.unit}
                                            </span>
                                        )}
                                    </span>
                                    <div className={styles.kpiLabel}>
                                        {kpi.label === 'Bookings'
                                            ? bookingsTerm
                                            : kpi.label === 'New Clients'
                                              ? `+ ${clientsTerm}`
                                              : t(
                                                    kpi.label === 'Total Revenue'
                                                        ? 'dash.kpiRev'
                                                        : kpi.label === 'Invoices'
                                                          ? 'dash.kpiInvoices'
                                                          : 'dash.kpiReturns'
                                                )}
                                    </div>
                                </div>
                                <div className={styles.kpiSparkline}>
                                    <KpiSparkline data={kpi.sparkData} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Charts Row */}
                <div className={`${styles.chartsRow} ${styles.fadeStaggerRow}`}>
                    {/* Occupancy Table */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>
                                {employeesTerm} {t('dash.occupancy')}
                            </span>
                            <Link href="/employees" className={styles.cardAction}>
                                {t('dash.viewAll')}
                            </Link>
                        </div>
                        <div className={styles.tableScroll}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{employeeTerm}</th>
                                        <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                            {t('dash.colBooked')}
                                        </th>
                                        <th style={{ width: '40%', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                            {t('dash.occupancy')}
                                        </th>
                                        <th style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
                                            {t('dash.colRate')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOccupancyData.map(row => (
                                        <tr key={row.employee}>
                                            <td>
                                                <span className={styles.rankName}>{row.employee}</span>
                                            </td>
                                            <td>
                                                {row.booked} / {row.total}
                                            </td>
                                            <td>
                                                <div className={styles.progressBarContainer}>
                                                    <div
                                                        className={styles.progressBar}
                                                        style={{
                                                            width: `${row.pct}%`,
                                                            background: getProgressColor(row.pct),
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={styles.occupancyValue}
                                                    style={{
                                                        color: getProgressColor(row.pct),
                                                        textAlign: lang === 'ar' ? 'left' : 'right',
                                                        display: 'block',
                                                    }}
                                                >
                                                    {row.pct}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Booking Status Donut */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>{t('dash.bookingStatus')}</span>
                            <Link href="/bookings" className={styles.cardAction}>
                                {t('dash.details')}
                            </Link>
                        </div>
                        <div style={{ height: 200, position: 'relative' }}>
                            <BookingStatusDonut data={currentBookingStatusData} />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                                className={styles.donutCenter}
                            >
                                <div className={styles.donutTotal}>{totalBookings}</div>
                                <div className={styles.donutLabel}>{t('dash.total')}</div>
                            </div>
                        </div>
                        <div className={styles.donutLegend}>
                            {currentBookingStatusData.map(item => (
                                <div key={item.name} className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ background: item.color }} />
                                    <span>
                                        {item.name === 'Confirmed'
                                            ? t('dash.statusConfirmed')
                                            : item.name === 'Completed'
                                              ? t('dash.statusCompleted')
                                              : item.name === 'Arrived'
                                                ? t('dash.statusArrived')
                                                : item.name === 'Unconfirmed'
                                                  ? t('dash.statusUnconfirmed')
                                                  : item.name === 'Cancelled'
                                                    ? t('dash.statusCancelled')
                                                    : t('dash.statusNoShow')}
                                    </span>
                                    <span className={styles.legendValue}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Below-the-fold sections — lazy-loaded so they don't block the dashboard's first paint. */}
                <DashboardBottomSections
                    topClients={currentTopClients}
                    topEmployees={currentTopEmployees}
                    topServices={currentTopServices}
                    summary={summary}
                    totalBookings={totalBookings}
                    activeDate={activeDate}
                    lang={lang}
                    t={t}
                    clientTerm={clientTerm}
                    clientsTerm={clientsTerm}
                    employeeTerm={employeeTerm}
                    employeesTerm={employeesTerm}
                    bookingsTerm={bookingsTerm}
                    formatNum={formatNum}
                />
            </>
        </div>
    );
}
