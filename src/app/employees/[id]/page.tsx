'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Calendar,
    Briefcase,
    Award,
    Clock,
    TrendingUp,
    DollarSign,
    MoreHorizontal,
    Edit,
    UserCheck,
    Lock,
    Shield,
    Activity,
    Trash2,
    Plus,
    MessageSquare,
    Star,
    Flag,
    Smartphone,
    Copy,
    Bell,
    Target,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import {
    Tabs,
    Button,
    Badge,
    KPICard,
    Timeline,
    EmptyState,
    useToast,
    Modal,
    Input,
    Select,
    DropdownMenu,
} from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from 'recharts';
import styles from './page.module.css';
import { egpLabel } from '@/lib/money';
import { providerApi, getImageUrl } from '@/lib/api';

// Mock Data (fallback)
const defaultEmployee = {
    id: 'EMP-001',
    name: 'Sarah Ahmed',
    position: 'Senior Stylist',
    level: 'Senior',
    department: 'Hair Styling',
    email: 'sarah.ahmed@hagzy.app',
    phone: '+20 100 123 4567',
    avatar: 'SA',
    status: 'active',
    joined: 'Mar 10, 2023',
    performance: 92,
    stats: {
        revenue: '45,200',
        appointments: 124,
        retention: '85%',
        rating: 4.8,
    },
};

const schedule = [
    { dayKey: 'monday', start: '10:00 AM', end: '08:00 PM', off: false, breakStart: '02:00 PM', breakEnd: '03:00 PM' },
    { dayKey: 'tuesday', start: '10:00 AM', end: '08:00 PM', off: false, breakStart: '02:00 PM', breakEnd: '03:00 PM' },
    {
        dayKey: 'wednesday',
        start: '10:00 AM',
        end: '08:00 PM',
        off: false,
        breakStart: '01:00 PM',
        breakEnd: '02:00 PM',
    },
    {
        dayKey: 'thursday',
        start: '10:00 AM',
        end: '09:00 PM',
        off: false,
        breakStart: '03:00 PM',
        breakEnd: '04:00 PM',
    },
    { dayKey: 'friday', start: '01:00 PM', end: '10:00 PM', off: false, breakStart: '', breakEnd: '' },
    { dayKey: 'saturday', start: '-', end: '-', off: true, breakStart: '', breakEnd: '' },
    { dayKey: 'sunday', start: '10:00 AM', end: '06:00 PM', off: false, breakStart: '01:00 PM', breakEnd: '01:30 PM' },
];

const revenueData = [
    { month: 'Jan', revenue: 32000, appointments: 95 },
    { month: 'Feb', revenue: 38000, appointments: 110 },
    { month: 'Mar', revenue: 45200, appointments: 124 },
    { month: 'Apr', revenue: 42000, appointments: 115 },
    { month: 'May', revenue: 49000, appointments: 135 },
    { month: 'Jun', revenue: 52000, appointments: 142 },
];

const recentActivity = [
    { time: '10:30 AM', title: 'Clocked In', description: 'Fingerprint Device #1' },
    { time: 'Feb 17', title: 'Commission Payout', description: 'Received 3,450 EGP for Jan.' },
    { time: 'Feb 15', title: 'Performance Review', description: 'Rated 4.9/5 by Manager.' },
];

const modules = [
    'dashboard',
    'sales',
    'transactions',
    'returns',
    'customers',
    'employees',
    'marketing',
    'reports',
    'settings',
];

const employeeReviews = [
    {
        id: '1',
        customer: 'Fatima Al-Rashid',
        rating: 5,
        date: 'Mar 20, 2026',
        comment: "Sara is an amazing stylist! The best hair coloring I've ever had.",
    },
    {
        id: '2',
        customer: 'Aisha Mohammed',
        rating: 4,
        date: 'Mar 26, 2026',
        comment: 'Very professional. Took a bit longer than expected, but great results.',
    },
    {
        id: '3',
        customer: 'Huda Saleh',
        rating: 5,
        date: 'Mar 25, 2026',
        comment: 'Always a pleasure getting my hair done here.',
    },
];

export default function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { t, lang } = useTranslation();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('performance');
    const { addToast } = useToast();
    const [employee, setEmployee] = useState(defaultEmployee);
    const [employeePhotoUrl, setEmployeePhotoUrl] = useState<string | null>(null);

    // Fetch real employee data from API
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await providerApi.getEmployee(id);
                if (cancelled) return;
                if (res.success && res.data) {
                    const e = res.data;
                    setEmployee({
                        id: e.uuid,
                        name: e.name,
                        position: e.branch?.name || 'Staff',
                        level: 'Staff',
                        department: e.branch?.name || 'General',
                        email: e.email || defaultEmployee.email,
                        phone: e.phone || defaultEmployee.phone,
                        avatar: e.name
                            .split(' ')
                            .map(w => w[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase(),
                        status: e.active ? 'active' : 'inactive',
                        joined: e.created_at
                            ? new Date(e.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                              })
                            : defaultEmployee.joined,
                        performance: defaultEmployee.performance,
                        stats: defaultEmployee.stats,
                    });
                    setEmployeePhotoUrl(getImageUrl('employees', e.uuid));
                }
            } catch {
                // API unavailable — keep mock data
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [isSuspendOpen, setIsSuspendOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditServicesOpen, setIsEditServicesOpen] = useState(false);
    const [newServiceSelection, setNewServiceSelection] = useState('none');
    const [isScheduleEditOpen, setIsScheduleEditOpen] = useState(false);
    const [editableSchedule, setEditableSchedule] = useState(schedule.map(d => ({ ...d })));

    // Task 02: Mobile App Access
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [pinSet, setPinSet] = useState(false);
    const [pinValue, setPinValue] = useState('');
    const [pinConfirm, setPinConfirm] = useState('');

    // Task 09: Notification Preferences (read-only mirror of employee app settings)
    const [notifPrefs] = useState({
        newBookings: true,
        cancellations: true,
        reminders: true,
        shiftReminders: false,
        newReviews: true,
        payslipAvailable: true,
        announcements: false,
    });

    const [empServices, setEmpServices] = useState([
        { name: 'Hair Cut & Style', commission: '15%' },
        { name: 'Hair Coloring', commission: '20%' },
        { name: 'Keratin Treatment', commission: '25%' },
        { name: 'Blow Dry', commission: '10%' },
    ]);

    const availableServices = [
        { value: 'none', label: t('empProfile.selectService') },
        { value: 'Beard Trim', label: 'Beard Trim' },
        { value: 'Root Touch Up', label: 'Root Touch Up' },
        { value: 'Balayage', label: 'Balayage' },
        { value: 'Scalp Massage', label: 'Scalp Massage' },
    ];

    const [editEmp, setEditEmp] = useState({
        fname: 'Sarah',
        lname: 'Ahmed',
        phone: '+20 100 123 4567',
        email: 'sarah.ahmed@hagzy.app',
        role: 'employee',
        jobTitle: 'Senior Stylist',
        branch: 'Downtown',
    });

    const handleActionClick = (action: string) => {
        if (action === 'Edit Profile') setIsEditOpen(true);
        else if (action === 'Manage Permissions') setIsPermissionsOpen(true);
        else if (action === 'View Activity Log') setIsActivityOpen(true);
        else if (action === 'Reset Password') setIsResetPasswordOpen(true);
        else if (action === 'Suspend Account') setIsSuspendOpen(true);
        else if (action === 'Delete Employee') setIsDeleteOpen(true);
        else addToast('info', `${action} ${t('empProfile.actionDev')}`);
    };

    const handleReportReview = (_reviewId: string) => {
        addToast('success', t('empProfile.reviewReportedMsg'));
    };

    const handleSaveEdit = () => {
        setIsEditOpen(false);
        addToast('success', t('empProfile.profileUpd'));
    };

    const renderPerformance = () => (
        <div className={styles.content}>
            <div className={styles.mainPanel}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
                    <KPICard
                        icon={<DollarSign size={20} />}
                        iconBg="var(--color-success-100)"
                        iconColor="var(--color-success-600)"
                        value={employee.stats.revenue}
                        label={t('empProfile.kpiRev')}
                        trend={{ value: '12%', up: true }}
                    />
                    <KPICard
                        icon={<UserCheck size={20} />}
                        iconBg="var(--color-primary-100)"
                        iconColor="var(--color-primary-600)"
                        value={employee.stats.retention}
                        label={t('empProfile.kpiRet')}
                        trend={{ value: '5%', up: true }}
                    />
                    <KPICard
                        icon={<Calendar size={20} />}
                        iconBg="var(--color-purple-100)"
                        iconColor="var(--color-purple-600)"
                        value={employee.stats.appointments}
                        label={t('empProfile.kpiAppts')}
                        trend={{ value: '2', up: false }}
                    />
                    <KPICard
                        icon={<Award size={20} />}
                        iconBg="var(--color-amber-100)"
                        iconColor="var(--color-amber-600)"
                        value={employee.stats.rating}
                        label={t('empProfile.kpiRating')}
                    />
                </div>

                {/* Task 06: Target Progress Card */}
                {(() => {
                    const revTarget = 10000;
                    const revAchieved = 7420;
                    const bkTarget = 120;
                    const bkAchieved = 84;
                    const revPct = Math.min(200, Math.round((revAchieved / revTarget) * 100));
                    const bkPct = Math.min(200, Math.round((bkAchieved / bkTarget) * 100));
                    const tierMultiplier = revPct >= 150 ? 2.0 : revPct >= 120 ? 1.5 : 1.0;
                    const baseBonus = 1000;
                    const projBonus = Math.round(baseBonus * tierMultiplier * (revPct / 100));
                    const barColor = (pct: number) =>
                        pct >= 150
                            ? 'var(--color-primary-500)'
                            : pct >= 120
                              ? '#f59e0b'
                              : pct >= 100
                                ? '#22c55e'
                                : 'var(--color-gray-300)';
                    return (
                        <div className={styles.card} style={{ marginTop: 'var(--space-4)' }}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}>
                                    <Target size={18} style={{ marginInlineEnd: 'var(--space-2)' }} />{' '}
                                    {t('empProfile.targetProgress')}
                                </span>
                            </div>
                            <div
                                className={styles.cardBody}
                                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
                            >
                                {[
                                    {
                                        label: t('empProfile.revenueTarget'),
                                        achieved: revAchieved.toLocaleString() + ' ' + egpLabel(),
                                        target: revTarget.toLocaleString() + ' ' + egpLabel(),
                                        pct: revPct,
                                    },
                                    {
                                        label: t('empProfile.bookingsTarget'),
                                        achieved: bkAchieved + ' ' + t('empProfile.appts'),
                                        target: bkTarget + ' ' + t('empProfile.appts'),
                                        pct: bkPct,
                                    },
                                ].map(bar => (
                                    <div key={bar.label}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: 'var(--text-sm)',
                                                marginBottom: 6,
                                            }}
                                        >
                                            <span style={{ fontWeight: 'var(--font-medium)' }}>{bar.label}</span>
                                            <span style={{ color: 'var(--text-secondary)' }}>
                                                {bar.achieved} / {bar.target} ({bar.pct}%)
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                height: 8,
                                                borderRadius: 4,
                                                background: 'var(--bg-secondary)',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: '100%',
                                                    width: `${Math.min(100, bar.pct)}%`,
                                                    background: barColor(bar.pct),
                                                    borderRadius: 4,
                                                    transition: 'width 0.4s',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div
                                    style={{
                                        padding: 'var(--space-3)',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius-lg)',
                                        fontSize: 'var(--text-sm)',
                                    }}
                                >
                                    <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
                                        {t('empProfile.bonusTiers').replace('{pct}', String(revPct))}
                                    </div>
                                    <div
                                        style={{
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--color-primary-600)',
                                        }}
                                    >
                                        {t('empProfile.estimatedBonus').replace('{amount}', projBonus.toLocaleString())}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                <div className={styles.card} style={{ marginTop: 'var(--space-6)' }}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>
                            <TrendingUp size={18} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                            {t('empProfile.perfAnalytics')}
                        </span>
                    </div>
                    <div className={styles.cardBody} style={{ height: '300px', paddingTop: 'var(--space-4)' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                                />
                                <YAxis
                                    orientation={lang === 'ar' ? 'right' : 'left'}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                                    tickFormatter={val => `${val / 1000}k`}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <RechartsTooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)',
                                        boxShadow: 'var(--shadow-md)',
                                    }}
                                    formatter={value => [`${value || 0} ${egpLabel()}`, t('empProfile.revenueTooltip')]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--color-primary-500)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>
                            <Clock size={18} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                            {t('empProfile.recentActivity')}
                        </span>
                    </div>
                    <div className={styles.cardBody}>
                        <Timeline events={recentActivity} />
                    </div>
                </div>
            </div>

            <div className={styles.sidePanel}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>{t('empProfile.assignedServ')}</span>
                        <Button variant="ghost" size="sm" iconOnly onClick={() => setIsEditServicesOpen(true)}>
                            <Edit size={14} />
                        </Button>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.serviceList}>
                            {empServices.map((s, i) => (
                                <div key={i} className={styles.serviceItem}>
                                    <span className={styles.serviceName}>{s.name}</span>
                                    <span className={styles.serviceComm}>{s.commission}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Task 02: Mobile App Access Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>
                            <Smartphone size={16} style={{ marginInlineEnd: 'var(--space-2)' }} />
                            {t('empProfile.mobileAppAccess')}
                        </span>
                    </div>
                    <div className={styles.cardBody}>
                        <div style={{ marginBottom: 'var(--space-3)' }}>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: 12,
                                    fontWeight: 'var(--font-semibold)',
                                    background: pinSet ? 'var(--color-success-light)' : 'var(--color-gray-100)',
                                    color: pinSet ? 'var(--color-success)' : 'var(--color-gray-500)',
                                }}
                            >
                                {pinSet ? (
                                    <>
                                        <CheckCircle size={11} /> {t('empProfile.appAccessActive')}
                                    </>
                                ) : (
                                    t('empProfile.appAccessNotConfigured')
                                )}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <Button
                                size="sm"
                                variant="outline"
                                fullWidth
                                onClick={() => {
                                    setPinValue('');
                                    setPinConfirm('');
                                    setIsPinModalOpen(true);
                                }}
                            >
                                <Lock size={14} style={{ marginInlineEnd: 'var(--space-2)' }} />{' '}
                                {t('empProfile.setPin')}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                fullWidth
                                onClick={() => {
                                    const token = Math.random().toString(36).substring(7);
                                    const link = `${window.location.origin}/invite/${token}?phone=${encodeURIComponent(employee.phone)}&role=staff`;
                                    navigator.clipboard.writeText(link);
                                    addToast('success', t('empProfile.toastAppInviteCopied'));
                                }}
                            >
                                <Copy size={14} style={{ marginInlineEnd: 'var(--space-2)' }} />{' '}
                                {t('empProfile.sendAppInvite')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSchedule = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{t('empProfile.weeklySchedule')}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setEditableSchedule(schedule.map(d => ({ ...d })));
                            setIsScheduleEditOpen(true);
                        }}
                    >
                        {t('empProfile.editSchedule')}
                    </Button>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.scheduleGrid}>
                        {schedule.map(day => (
                            <div key={day.dayKey} className={styles.scheduleDay}>
                                <div className={styles.dayName}>{t(`settings.hours.${day.dayKey}`)}</div>
                                {day.off ? (
                                    <div className={styles.dayOff}>{t('empProfile.dayOff')}</div>
                                ) : (
                                    <div className={styles.dayTime}>
                                        {day.start}
                                        <br />
                                        {t('empProfile.to')}
                                        <br />
                                        {day.end}
                                        {day.breakStart && (
                                            <div
                                                style={{
                                                    fontSize: '10px',
                                                    color: 'var(--color-warning)',
                                                    marginTop: '4px',
                                                }}
                                            >
                                                {t('empProfile.break')} {day.breakStart} – {day.breakEnd}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderReviews = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{t('empProfile.reviews')}</span>
                </div>
                {employeeReviews.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {employeeReviews.map(review => (
                            <div
                                key={review.id}
                                style={{
                                    padding: 'var(--space-4)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--bg-secondary)',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: 'var(--space-2)',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 'var(--font-semibold)' }}>{review.customer}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            {review.date}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '2px',
                                                color: 'var(--color-warning)',
                                            }}
                                        >
                                            <Star size={14} fill="currentColor" />
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 'var(--font-bold)',
                                                    color: 'var(--text-primary)',
                                                }}
                                            >
                                                {review.rating}.0
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleReportReview(review.id)}
                                            style={{ color: 'var(--color-error)' }}
                                            iconOnly
                                        >
                                            <Flag size={14} />
                                        </Button>
                                    </div>
                                </div>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: 'var(--space-8) 0' }}>
                        <EmptyState
                            icon={<MessageSquare size={32} color="var(--text-tertiary)" />}
                            title={t('empProfile.noReviewsTitle')}
                            description={t('empProfile.noReviewsDesc')}
                        />
                    </div>
                )}
            </div>
        </div>
    );

    const renderNotifications = () => {
        const notifItems = [
            { key: 'newBookings', label: t('empProfile.notifNewBookings') },
            { key: 'cancellations', label: t('empProfile.notifCancellations') },
            { key: 'reminders', label: t('empProfile.notifReminders') },
            { key: 'shiftReminders', label: t('empProfile.notifShiftReminders') },
            { key: 'newReviews', label: t('empProfile.notifNewReviews') },
            { key: 'payslipAvailable', label: t('empProfile.notifPayslipAvailable') },
            { key: 'announcements', label: t('empProfile.notifAnnouncements') },
        ] as const;
        const enabledCount = notifItems.filter(i => notifPrefs[i.key]).length;
        return (
            <div className={styles.mainPanel}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>
                            <Bell size={18} style={{ marginInlineEnd: 'var(--space-2)' }} />{' '}
                            {t('empProfile.notifPrefsTitle')}
                        </span>
                        <Badge color="neutral">
                            {t('empProfile.notifEnabled')
                                .replace('{count}', String(enabledCount))
                                .replace('{total}', String(notifItems.length))}
                        </Badge>
                    </div>
                    <div
                        className={styles.cardBody}
                        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
                    >
                        {notifItems.map(item => (
                            <div
                                key={item.key}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 'var(--space-3)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--bg-secondary)',
                                }}
                            >
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                    {item.label}
                                </span>
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        padding: '2px 10px',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: 12,
                                        fontWeight: 'var(--font-semibold)',
                                        background: notifPrefs[item.key]
                                            ? 'var(--color-success-light)'
                                            : 'var(--color-gray-100)',
                                        color: notifPrefs[item.key] ? 'var(--color-success)' : 'var(--color-gray-500)',
                                    }}
                                >
                                    {notifPrefs[item.key] ? (
                                        <>
                                            <CheckCircle size={11} /> {t('empProfile.notifOn')}
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={11} /> {t('empProfile.notifOff')}
                                        </>
                                    )}
                                </span>
                            </div>
                        ))}
                        <p
                            style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-tertiary)',
                                marginTop: 'var(--space-2)',
                            }}
                        >
                            {t('empProfile.notifFootnote')}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.page} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Header */}
            <div className={styles.header}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <Button variant="ghost" onClick={() => router.push('/employees')} size="sm">
                        {t('empProfile.backToList')}
                    </Button>
                </div>
                <div className={styles.headerTop}>
                    <div className={styles.profileInfo}>
                        <div className={styles.avatar} style={{ overflow: 'hidden', position: 'relative' }}>
                            {}
                            {employeePhotoUrl && (
                                <img
                                    src={employeePhotoUrl}
                                    alt={employee.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        position: 'absolute',
                                        inset: 0,
                                    }}
                                    onError={e => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            )}
                            <span>{employee.avatar}</span>
                        </div>
                        <div className={styles.details}>
                            <h1>
                                {employee.name}
                                <Badge color="primary">{employee.position}</Badge>
                                <Badge color="neutral">{employee.level}</Badge>
                            </h1>
                            <div className={styles.meta}>
                                <span className={styles.metaItem}>
                                    <Briefcase size={14} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />{' '}
                                    {employee.department}
                                </span>
                                <span className={styles.metaItem}>
                                    <User size={14} className={lang === 'ar' ? 'ml-1' : 'mr-1'} /> ID:{' '}
                                    <span dir="ltr">{employee.id}</span>
                                </span>
                                <Badge color="success">{t('empProfile.activeBadge')}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <DropdownMenu
                            trigger={
                                <Button variant="outline" iconOnly>
                                    <MoreHorizontal size={20} />
                                </Button>
                            }
                            align={lang === 'ar' ? 'left' : 'right'}
                            items={[
                                {
                                    label: t('empProfile.managePermBtn'),
                                    icon: <Shield size={16} />,
                                    onClick: () => handleActionClick('Manage Permissions'),
                                },
                                {
                                    label: t('empProfile.viewLogBtn'),
                                    icon: <Activity size={16} />,
                                    onClick: () => handleActionClick('View Activity Log'),
                                },
                                {
                                    label: t('empProfile.resetPwdBtn'),
                                    icon: <Lock size={16} />,
                                    onClick: () => handleActionClick('Reset Password'),
                                },
                                {
                                    label: t('empProfile.suspendBtn'),
                                    icon: <Clock size={16} />,
                                    onClick: () => handleActionClick('Suspend Account'),
                                },
                                {
                                    label: t('empProfile.deleteBtn'),
                                    icon: <Trash2 size={16} />,
                                    onClick: () => handleActionClick('Delete Employee'),
                                    destructive: true,
                                },
                            ]}
                        />
                        <Button variant="outline" onClick={() => handleActionClick('Edit Profile')}>
                            <Edit size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('empProfile.editAction')}
                        </Button>
                    </div>
                </div>

                <div className={styles.headerStats}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{employee.performance}%</span>
                        <span className={styles.statLabel}>{t('empProfile.tabPerformance')}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{employee.joined}</span>
                        <span className={styles.statLabel}>{t('empProfile.joinedLabel')}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue} dir="ltr">
                            {employee.phone}
                        </span>
                        <span className={styles.statLabel}>{t('empProfile.phoneLabel')}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs
                active={activeTab}
                onChange={setActiveTab}
                items={[
                    { key: 'performance', label: t('empProfile.tabPerformance'), icon: <TrendingUp size={16} /> },
                    { key: 'schedule', label: t('empProfile.tabSchedule'), icon: <Calendar size={16} /> },
                    { key: 'attendance', label: t('empProfile.tabAttendance'), icon: <Clock size={16} /> },
                    { key: 'reviews', label: t('empProfile.tabReviews'), icon: <MessageSquare size={16} /> },
                    { key: 'notifications', label: t('empProfile.tabNotifications'), icon: <Bell size={16} /> },
                ]}
            />

            {/* Content */}
            {activeTab === 'performance' && renderPerformance()}
            {activeTab === 'schedule' && renderSchedule()}
            {activeTab === 'reviews' && renderReviews()}
            {activeTab === 'notifications' && renderNotifications()}
            {activeTab === 'attendance' && (
                <EmptyState
                    icon={<Clock size={48} />}
                    title={t('empProfile.emptyAttTitle')}
                    description={t('empProfile.emptyAttDesc')}
                />
            )}

            <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title={t('empProfile.editTitle')}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input
                            label={t('empProfile.lblFName')}
                            placeholder="Sarah"
                            value={editEmp.fname}
                            onChange={e => setEditEmp({ ...editEmp, fname: e.target.value })}
                        />
                        <Input
                            label={t('empProfile.lblLName')}
                            placeholder="Ahmed"
                            value={editEmp.lname}
                            onChange={e => setEditEmp({ ...editEmp, lname: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input
                            label={t('empProfile.lblPhone')}
                            placeholder="+20 100 123 4567"
                            value={editEmp.phone}
                            onChange={e => setEditEmp({ ...editEmp, phone: e.target.value })}
                        />
                        <Input
                            label={t('empProfile.lblEmail')}
                            type="email"
                            placeholder="sarah.ahmed@hagzy.app"
                            value={editEmp.email}
                            onChange={e => setEditEmp({ ...editEmp, email: e.target.value })}
                        />
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', margin: 'var(--space-2) 0' }}></div>

                    <Select
                        label={t('empProfile.lblRole')}
                        value={editEmp.role}
                        onChange={e => setEditEmp({ ...editEmp, role: e.target.value })}
                        options={[
                            { value: 'admin', label: t('empProfile.roleAdminFull') },
                            { value: 'manager', label: t('empProfile.roleManagerBranch') },
                            { value: 'employee', label: t('empProfile.roleEmployeeLimited') },
                        ]}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Select
                            label={t('empProfile.lblJobTitle')}
                            value={editEmp.jobTitle}
                            onChange={e => setEditEmp({ ...editEmp, jobTitle: e.target.value })}
                            options={[
                                { value: 'Senior Stylist', label: 'Senior Stylist' },
                                { value: 'Junior Stylist', label: 'Junior Stylist' },
                                { value: 'Hair Colorist', label: 'Hair Colorist' },
                            ]}
                        />
                        <Select
                            label={t('empProfile.lblBranch')}
                            value={editEmp.branch}
                            onChange={e => setEditEmp({ ...editEmp, branch: e.target.value })}
                            options={[
                                { value: 'Downtown', label: 'Downtown' },
                                { value: 'Mall of Arabia', label: 'Mall of Arabia' },
                                { value: 'New Cairo', label: 'New Cairo' },
                            ]}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--space-3)',
                            marginTop: 'var(--space-4)',
                        }}
                    >
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            {t('empProfile.btnCancel')}
                        </Button>
                        <Button onClick={handleSaveEdit}>{t('empProfile.btnSave')}</Button>
                    </div>
                </div>
            </Modal>

            {/* Manage Permissions Modal */}
            <Modal
                open={isPermissionsOpen}
                onClose={() => setIsPermissionsOpen(false)}
                title={t('empProfile.permTitle')}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        {t('empProfile.permDesc1')}
                        <strong>{employee.name}</strong>
                        {t('empProfile.permDesc2')}
                    </p>
                    <div
                        style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                        }}
                    >
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'var(--bg-secondary)' }}>
                                <tr>
                                    <th
                                        style={{
                                            padding: 'var(--space-2) var(--space-3)',
                                            textAlign: 'start',
                                            fontSize: 12,
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-tertiary)',
                                            borderBottom: '1px solid var(--border-color)',
                                        }}
                                    >
                                        {t('empProfile.colMod')}
                                    </th>
                                    <th
                                        style={{
                                            padding: 'var(--space-2) var(--space-3)',
                                            textAlign: 'center',
                                            fontSize: 12,
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-tertiary)',
                                            borderBottom: '1px solid var(--border-color)',
                                        }}
                                    >
                                        {t('empProfile.colView')}
                                    </th>
                                    <th
                                        style={{
                                            padding: 'var(--space-2) var(--space-3)',
                                            textAlign: 'center',
                                            fontSize: 12,
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-tertiary)',
                                            borderBottom: '1px solid var(--border-color)',
                                        }}
                                    >
                                        {t('empProfile.colCreate')}
                                    </th>
                                    <th
                                        style={{
                                            padding: 'var(--space-2) var(--space-3)',
                                            textAlign: 'center',
                                            fontSize: 12,
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-tertiary)',
                                            borderBottom: '1px solid var(--border-color)',
                                        }}
                                    >
                                        {t('empProfile.colEdit')}
                                    </th>
                                    <th
                                        style={{
                                            padding: 'var(--space-2) var(--space-3)',
                                            textAlign: 'center',
                                            fontSize: 12,
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-tertiary)',
                                            borderBottom: '1px solid var(--border-color)',
                                        }}
                                    >
                                        {t('empProfile.colDel')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {modules.map(m => (
                                    <tr key={m}>
                                        <td
                                            style={{
                                                padding: 'var(--space-2) var(--space-3)',
                                                fontSize: 13,
                                                borderBottom: '1px solid var(--border-color)',
                                            }}
                                        >
                                            {t(`modules.${m}`)}
                                        </td>
                                        <td
                                            style={{
                                                padding: 'var(--space-2) var(--space-3)',
                                                textAlign: 'center',
                                                borderBottom: '1px solid var(--border-color)',
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                defaultChecked={m === 'dashboard' || m === 'sales'}
                                            />
                                        </td>
                                        <td
                                            style={{
                                                padding: 'var(--space-2) var(--space-3)',
                                                textAlign: 'center',
                                                borderBottom: '1px solid var(--border-color)',
                                            }}
                                        >
                                            <input type="checkbox" defaultChecked={m === 'sales'} />
                                        </td>
                                        <td
                                            style={{
                                                padding: 'var(--space-2) var(--space-3)',
                                                textAlign: 'center',
                                                borderBottom: '1px solid var(--border-color)',
                                            }}
                                        >
                                            <input type="checkbox" defaultChecked={false} />
                                        </td>
                                        <td
                                            style={{
                                                padding: 'var(--space-2) var(--space-3)',
                                                textAlign: 'center',
                                                borderBottom: '1px solid var(--border-color)',
                                            }}
                                        >
                                            <input type="checkbox" defaultChecked={false} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--space-3)',
                            marginTop: 'var(--space-4)',
                        }}
                    >
                        <Button variant="outline" onClick={() => setIsPermissionsOpen(false)}>
                            {t('empProfile.btnCancel')}
                        </Button>
                        <Button
                            onClick={() => {
                                setIsPermissionsOpen(false);
                                addToast('success', t('empProfile.toastPermSec'));
                            }}
                        >
                            {t('empProfile.btnSavePerm')}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* View Activity Log Modal */}
            <Modal open={isActivityOpen} onClose={() => setIsActivityOpen(false)} title={t('empProfile.actModalTitle')}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-4)',
                        maxHeight: '60vh',
                        overflowY: 'auto',
                    }}
                >
                    <Timeline events={recentActivity} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                        <Button variant="outline" onClick={() => setIsActivityOpen(false)}>
                            {t('empProfile.btnClose')}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Reset Password Modal */}
            <Modal
                open={isResetPasswordOpen}
                onClose={() => setIsResetPasswordOpen(false)}
                title={t('empProfile.resPwdTitle')}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        {t('empProfile.resPwdDesc1')}
                        <strong>{employee.name}</strong>
                        {t('empProfile.resPwdDesc2')}
                        <strong>{employee.email}</strong>.
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--space-3)',
                            marginTop: 'var(--space-4)',
                        }}
                    >
                        <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>
                            {t('empProfile.btnCancel')}
                        </Button>
                        <Button
                            onClick={() => {
                                setIsResetPasswordOpen(false);
                                addToast('success', t('empProfile.toastPwdSec'));
                            }}
                        >
                            {t('empProfile.btnConfirmReset')}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Suspend Account Modal */}
            <Modal open={isSuspendOpen} onClose={() => setIsSuspendOpen(false)} title={t('empProfile.suspTitle')}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        {t('empProfile.suspDesc1')}
                        <strong>{employee.name}</strong>
                        {t('empProfile.suspDesc2')}
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--space-3)',
                            marginTop: 'var(--space-4)',
                        }}
                    >
                        <Button variant="outline" onClick={() => setIsSuspendOpen(false)}>
                            {t('empProfile.btnCancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setIsSuspendOpen(false);
                                addToast('error', t('empProfile.toastSuspSec'));
                            }}
                        >
                            {t('empProfile.suspendBtn')}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Employee Modal */}
            <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title={t('empProfile.delTitleModal')}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        {t('empProfile.delDesc1')}
                        <strong>{employee.name}</strong>
                        {t('empProfile.delDesc2')}
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--space-3)',
                            marginTop: 'var(--space-4)',
                        }}
                    >
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            {t('empProfile.btnCancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setIsDeleteOpen(false);
                                addToast('error', t('empProfile.toastDelSec'));
                            }}
                        >
                            {t('empProfile.btnDelPerm')}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Assigned Services Modal */}
            <Modal
                open={isEditServicesOpen}
                onClose={() => setIsEditServicesOpen(false)}
                title={t('empProfile.editServTitle')}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        {t('empProfile.servDesc')}
                    </p>

                    {/* Add New Service Row */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 'var(--space-2)',
                            alignItems: 'center',
                            background: 'var(--bg-secondary)',
                            padding: 'var(--space-3)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <Select
                                options={availableServices}
                                value={newServiceSelection}
                                onChange={e => setNewServiceSelection(e.target.value)}
                            />
                        </div>
                        <Button
                            disabled={newServiceSelection === 'none'}
                            onClick={() => {
                                if (newServiceSelection !== 'none') {
                                    setEmpServices([...empServices, { name: newServiceSelection, commission: '10%' }]);
                                    setNewServiceSelection('none');
                                    addToast('success', `${newServiceSelection}${t('empProfile.toastAssignedPart')}`);
                                }
                            }}
                        >
                            <Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('empProfile.btnAdd')}
                        </Button>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-3)',
                            maxHeight: '50vh',
                            overflowY: 'auto',
                            paddingInlineEnd: 'var(--space-1)',
                            marginInlineEnd: '-var(--space-1)',
                        }}
                    >
                        {empServices.map((s, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-3)',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                }}
                            >
                                <div style={{ flex: 1, fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }}>
                                    {s.name}
                                </div>
                                <div style={{ position: 'relative', width: '80px' }}>
                                    <Input
                                        defaultValue={s.commission.replace('%', '')}
                                        style={{ textAlign: 'end', paddingInlineEnd: '22px' }}
                                    />
                                    <span
                                        style={{
                                            position: 'absolute',
                                            insetInlineEnd: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--text-tertiary)',
                                            fontSize: 'var(--text-sm)',
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        %
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    iconOnly
                                    style={{ color: 'var(--color-error)' }}
                                    onClick={() => setEmpServices(empServices.filter((_, i) => i !== idx))}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--space-3)',
                            marginTop: 'var(--space-4)',
                        }}
                    >
                        <Button variant="outline" onClick={() => setIsEditServicesOpen(false)}>
                            {t('empProfile.btnCancel')}
                        </Button>
                        <Button
                            onClick={() => {
                                setIsEditServicesOpen(false);
                                addToast('success', t('empProfile.toastServSec'));
                            }}
                        >
                            {t('empProfile.btnSaveServ')}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Task 02: Set PIN Modal */}
            <Modal open={isPinModalOpen} onClose={() => setIsPinModalOpen(false)} title={t('empProfile.setPinTitle')}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        {t('empProfile.setPinDesc1')}
                        <strong>{employee.name}</strong>
                        {t('empProfile.setPinDesc2')}
                    </p>
                    <Input
                        label={t('empProfile.newPinLabel')}
                        type="password"
                        maxLength={6}
                        placeholder="••••••"
                        value={pinValue}
                        onChange={e => setPinValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                    <Input
                        label={t('empProfile.confirmPinLabel')}
                        type="password"
                        maxLength={6}
                        placeholder="••••••"
                        value={pinConfirm}
                        onChange={e => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--space-3)',
                            marginTop: 'var(--space-2)',
                        }}
                    >
                        <Button variant="outline" onClick={() => setIsPinModalOpen(false)}>
                            {t('empProfile.btnCancel')}
                        </Button>
                        <Button
                            disabled={pinValue.length < 6 || pinValue !== pinConfirm}
                            onClick={() => {
                                if (pinValue.length < 6) return addToast('error', t('empProfile.toastPinReq'));
                                if (pinValue !== pinConfirm) return addToast('error', t('empProfile.toastPinMismatch'));
                                setPinSet(true);
                                setIsPinModalOpen(false);
                                addToast('success', t('empProfile.toastPinSet'));
                            }}
                        >
                            {t('empProfile.savePin')}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Schedule Modal */}
            <Modal
                open={isScheduleEditOpen}
                onClose={() => setIsScheduleEditOpen(false)}
                title={t('empProfile.editSchedTitle')}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        {t('empProfile.schedDesc')}
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-3)',
                            maxHeight: '50vh',
                            overflowY: 'auto',
                        }}
                    >
                        {editableSchedule.map((day, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-3)',
                                    background: day.off ? 'var(--color-gray-50)' : 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--border-color)',
                                }}
                            >
                                <div
                                    style={{
                                        width: 90,
                                        fontWeight: 'var(--font-semibold)',
                                        fontSize: 'var(--text-sm)',
                                        color: day.off ? 'var(--text-tertiary)' : 'var(--text-primary)',
                                    }}
                                >
                                    {t(`settings.hours.${day.dayKey}`)}
                                </div>
                                <div
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 'var(--space-2)',
                                        opacity: day.off ? 0.4 : 1,
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <span
                                            style={{
                                                fontSize: 'var(--text-xs)',
                                                color: 'var(--text-tertiary)',
                                                width: 40,
                                            }}
                                        >
                                            {t('empProfile.lblShift')}
                                        </span>
                                        <Input
                                            type="time"
                                            value={day.off ? '' : day.start.replace(/ AM| PM/g, '')}
                                            disabled={day.off}
                                            onChange={e => {
                                                const updated = [...editableSchedule];
                                                updated[i] = { ...updated[i], start: e.target.value };
                                                setEditableSchedule(updated);
                                            }}
                                            style={{ flex: 1 }}
                                        />
                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            {t('empProfile.to')}
                                        </span>
                                        <Input
                                            type="time"
                                            value={day.off ? '' : day.end.replace(/ AM| PM/g, '')}
                                            disabled={day.off}
                                            onChange={e => {
                                                const updated = [...editableSchedule];
                                                updated[i] = { ...updated[i], end: e.target.value };
                                                setEditableSchedule(updated);
                                            }}
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                    {!day.off && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--color-warning)',
                                                    width: 40,
                                                    fontWeight: 'var(--font-medium)',
                                                }}
                                            >
                                                {t('empProfile.break').replace(':', '')}
                                            </span>
                                            <Input
                                                type="time"
                                                value={day.breakStart?.replace(/ AM| PM/g, '') || ''}
                                                placeholder="—"
                                                onChange={e => {
                                                    const updated = [...editableSchedule];
                                                    updated[i] = { ...updated[i], breakStart: e.target.value };
                                                    setEditableSchedule(updated);
                                                }}
                                                style={{ flex: 1 }}
                                            />
                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                {t('empProfile.to')}
                                            </span>
                                            <Input
                                                type="time"
                                                value={day.breakEnd?.replace(/ AM| PM/g, '') || ''}
                                                placeholder="—"
                                                onChange={e => {
                                                    const updated = [...editableSchedule];
                                                    updated[i] = { ...updated[i], breakEnd: e.target.value };
                                                    setEditableSchedule(updated);
                                                }}
                                                style={{ flex: 1 }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-1)',
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--text-tertiary)',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={day.off}
                                        onChange={e => {
                                            const updated = [...editableSchedule];
                                            updated[i] = {
                                                ...updated[i],
                                                off: e.target.checked,
                                                start: e.target.checked ? '-' : '10:00 AM',
                                                end: e.target.checked ? '-' : '08:00 PM',
                                                breakStart: '',
                                                breakEnd: '',
                                            };
                                            setEditableSchedule(updated);
                                        }}
                                    />
                                    {t('empProfile.lblDayOff')}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--space-3)',
                            marginTop: 'var(--space-4)',
                        }}
                    >
                        <Button variant="outline" onClick={() => setIsScheduleEditOpen(false)}>
                            {t('empProfile.btnCancel')}
                        </Button>
                        <Button
                            onClick={() => {
                                setIsScheduleEditOpen(false);
                                addToast('success', t('empProfile.toastSchedSec'));
                            }}
                        >
                            {t('empProfile.btnSaveSched')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
