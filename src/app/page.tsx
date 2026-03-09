'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  DollarSign,
  CalendarDays,
  UserPlus,
  FileText,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  CalendarCheck,
  Wallet,
  Users,
  Crown,
} from 'lucide-react';
import { EmptyState } from '@/components/ui';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';

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
    sparkData: [
      { v: 40 }, { v: 55 }, { v: 45 }, { v: 60 }, { v: 50 }, { v: 70 }, { v: 65 },
    ],
  },
  {
    label: 'Bookings',
    value: '47',
    unit: '',
    trend: '+8.2%',
    trendUp: true,
    icon: <CalendarDays size={22} />,
    colorClass: 'kpiIconBlue',
    sparkData: [
      { v: 30 }, { v: 38 }, { v: 32 }, { v: 42 }, { v: 45 }, { v: 40 }, { v: 47 },
    ],
  },
  {
    label: 'New Clients',
    value: '12',
    unit: '',
    trend: '+25%',
    trendUp: true,
    icon: <UserPlus size={22} />,
    colorClass: 'kpiIconPurple',
    sparkData: [
      { v: 5 }, { v: 8 }, { v: 6 }, { v: 10 }, { v: 9 }, { v: 11 }, { v: 12 },
    ],
  },
  {
    label: 'Invoices',
    value: '38',
    unit: '',
    trend: '-3.1%',
    trendUp: false,
    icon: <FileText size={22} />,
    colorClass: 'kpiIconOrange',
    sparkData: [
      { v: 42 }, { v: 40 }, { v: 44 }, { v: 39 }, { v: 41 }, { v: 37 }, { v: 38 },
    ],
  },
  {
    label: 'Returns',
    value: '3',
    unit: '',
    trend: '-40%',
    trendUp: true,
    icon: <RotateCcw size={22} />,
    colorClass: 'kpiIconRed',
    sparkData: [
      { v: 7 }, { v: 5 }, { v: 6 }, { v: 4 }, { v: 5 }, { v: 4 }, { v: 3 },
    ],
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

function getRankClass(rank: number) {
  if (rank === 1) return styles.rankGold;
  if (rank === 2) return styles.rankSilver;
  if (rank === 3) return styles.rankBronze;
  return '';
}

function pseudoRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return (Math.abs(h) % 100) / 100;
}

export default function DashboardPage() {
  const [activeDate, setActiveDate] = useState('Today');
  const router = useRouter();
  const { user } = useAuth();
  const { t, lang } = useTranslation();

  const businessType = user?.businessType || 'salon';
  const isClinic = businessType === 'clinic';
  const isBarber = businessType === 'barber';

  const clientTerm = isClinic ? 'Patient' : 'Client';
  const clientsTerm = isClinic ? 'Patients' : 'Clients';
  const bookingTerm = isClinic || isBarber ? 'Appointment' : 'Booking';
  const bookingsTerm = isClinic || isBarber ? 'Appointments' : 'Bookings';
  const employeeTerm = isClinic ? 'Doctor/Staff' : isBarber ? 'Barber' : 'Stylist';
  const employeesTerm = isClinic ? 'Doctors & Staff' : isBarber ? 'Barbers' : 'Stylists';

  const formatNum = (num: number) => num.toLocaleString('en-US');

  const getMultiplier = (range: string) => {
    switch (range) {
      case 'Today': return 1;
      case 'This Week': return 5.5;
      case 'This Month': return 22.4;
      case 'This Quarter': return 65.2;
      case 'Custom': return 15.6;
      default: return 1;
    }
  };

  const currentKpiData = React.useMemo(() => {
    const m = getMultiplier(activeDate);
    return kpiData.map(kpi => ({
      ...kpi,
      value: formatNum(Math.round(parseInt(kpi.value.replace(/,/g, '')) * m)),
      sparkData: kpi.sparkData.map((d, i) => ({ v: Math.round(d.v * (1 + (pseudoRandom(kpi.label + activeDate + i) * 0.2 - 0.1))) }))
    }));
  }, [activeDate]);

  const currentOccupancyData = React.useMemo(() => {
    const days = Math.max(1, Math.round(getMultiplier(activeDate)));
    return occupancyData.map(d => {
      const total = 9 * days;
      const pct = Math.min(100, Math.max(0, d.pct + (pseudoRandom(d.employee + activeDate) * 10 - 5)));
      const booked = Math.round((pct / 100) * total);
      return { ...d, total, booked: Math.min(booked, total), pct: Math.round(pct) };
    });
  }, [activeDate]);

  const currentBookingStatusData = React.useMemo(() => {
    const m = getMultiplier(activeDate);
    return bookingStatusData.map(d => ({ ...d, value: Math.round(d.value * m) }));
  }, [activeDate]);

  const currentTopClients = React.useMemo(() => {
    const m = getMultiplier(activeDate);
    return topClients.map(c => ({
      ...c,
      visits: Math.max(1, Math.round(c.visits * m)),
      spend: formatNum(Math.round(parseInt(c.spend.replace(/,/g, '')) * m))
    }));
  }, [activeDate]);

  const currentTopEmployees = React.useMemo(() => {
    const m = getMultiplier(activeDate);
    return topEmployees.map(e => ({
      ...e,
      bookings: Math.round(e.bookings * m),
      revenue: formatNum(Math.round(parseInt(e.revenue.replace(/,/g, '')) * m))
    }));
  }, [activeDate]);

  const currentTopServices = React.useMemo(() => {
    const m = getMultiplier(activeDate);
    return topServices.map(s => ({
      ...s,
      count: Math.round(s.count * m),
      revenue: formatNum(Math.round(parseInt(s.revenue.replace(/,/g, '')) * m))
    }));
  }, [activeDate]);

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
            {dateRanges.map((range) => (
              <button
                key={range}
                className={`${styles.dateBtn} ${activeDate === range ? styles.dateBtnActive : ''
                  }`}
                onClick={() => setActiveDate(range)}
              >
                {t(range === 'Today' ? 'dash.dateToday' : range === 'This Week' ? 'dash.dateWeek' : range === 'This Month' ? 'dash.dateMonth' : range === 'This Quarter' ? 'dash.dateQuarter' : 'dash.dateCustom')}
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

      {user?.isNewWorkspace ? (
         <div style={{ padding: 'var(--space-12) 0', background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', marginTop: 'var(--space-6)' }}>
             <EmptyState
                icon={<CalendarCheck size={48} color="var(--color-primary-500)" />}
                title="Your workspace is empty"
                description="Business insights will appear here once you start taking bookings. Let's set up your calendar first!"
                action={<button className={styles.quickActionBtn} onClick={() => router.push('/bookings')} style={{ margin: '0 auto', display: 'flex', marginTop: '16px' }}>Go to Calendar</button>}
             />
         </div>
      ) : (
      <>
      {/* KPI Cards */}
      <motion.div
        className={styles.kpiGrid}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        {currentKpiData.map((kpi) => (
          <motion.div
            key={kpi.label}
            className={styles.kpiCard}
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
          >
            <div className={styles.kpiHeader}>
              <div className={`${styles.kpiIcon} ${styles[kpi.colorClass]}`}>
                {kpi.icon}
              </div>
              <span
                className={`${styles.kpiTrend} ${kpi.trendUp ? styles.kpiTrendUp : styles.kpiTrendDown
                  }`}
              >
                {kpi.trendUp ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                {kpi.trend}
              </span>
            </div>
            <div>
              <span className={styles.kpiValue}>
                {kpi.value}
                {kpi.unit && (
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', marginInlineStart: '4px', color: 'var(--text-tertiary)' }}>
                    {kpi.unit}
                  </span>
                )}
              </span>
              <div className={styles.kpiLabel}>
                {kpi.label === 'Bookings' ? bookingsTerm :
                  kpi.label === 'New Clients' ? `+ ${clientsTerm}` : t(kpi.label === 'Total Revenue' ? 'dash.kpiRev' : kpi.label === 'Invoices' ? 'dash.kpiInvoices' : 'dash.kpiReturns')}
              </div>
            </div>
            <div className={styles.kpiSparkline}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpi.sparkData}>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="var(--color-primary-500)"
                    fill="var(--color-primary-500)"
                    strokeWidth={2}
                  />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-sm)', fontSize: '12px', padding: '4px 8px' }}
                    formatter={(val: any) => [`${val}`, 'Value']}
                    labelFormatter={() => ''}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div
        className={styles.chartsRow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
      >
        {/* Occupancy Table */}
        <motion.div
          className={styles.card}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>{employeesTerm} {t('dash.occupancy')}</span>
            <Link href="/employees" className={styles.cardAction}>{t('dash.viewAll')}</Link>
          </div>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{employeeTerm}</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('dash.colBooked')}</th>
                <th style={{ width: '40%', textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('dash.occupancy')}</th>
                <th style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>{t('dash.colRate')}</th>
              </tr>
            </thead>
            <tbody>
              {currentOccupancyData.map((row) => (
                <tr key={row.employee}>
                  <td>
                    <span className={styles.rankName}>{row.employee}</span>
                  </td>
                  <td>{row.booked} / {row.total}</td>
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
                      style={{ color: getProgressColor(row.pct), textAlign: lang === 'ar' ? 'left' : 'right', display: 'block' }}
                    >
                      {row.pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Booking Status Donut */}
        <motion.div
          className={styles.card}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>{t('dash.bookingStatus')}</span>
            <Link href="/bookings" className={styles.cardAction}>{t('dash.details')}</Link>
          </div>
          <div style={{ height: 200, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentBookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {currentBookingStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}
                  formatter={(val: any, name: any) => [val, name]}
                />
              </PieChart>
            </ResponsiveContainer>
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
            {currentBookingStatusData.map((item) => (
              <div key={item.name} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ background: item.color }}
                />
                <span>{item.name === 'Confirmed' ? t('dash.statusConfirmed') : item.name === 'Completed' ? t('dash.statusCompleted') : item.name === 'Arrived' ? t('dash.statusArrived') : item.name === 'Unconfirmed' ? t('dash.statusUnconfirmed') : item.name === 'Cancelled' ? t('dash.statusCancelled') : t('dash.statusNoShow')}</span>
                <span className={styles.legendValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Tables */}
      <motion.div
        className={styles.tablesRow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
      >
        {/* Top Clients */}
        <motion.div
          className={styles.card}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>{t('dash.top')} {clientsTerm}</span>
            <Link href="/customers" className={styles.cardAction}>{t('dash.viewAll')}</Link>
          </div>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>#</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{clientTerm}</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('dash.colVisits')}</th>
                <th style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>{t('dash.colSpend')}</th>
              </tr>
            </thead>
            <tbody>
              {currentTopClients.map((c) => (
                <tr key={c.rank} onClick={() => router.push(`/customers/${c.id}`)} style={{ cursor: 'pointer' }}>
                  <td>
                    <span className={`${styles.rankNumber} ${getRankClass(c.rank)}`}>
                      {c.rank}
                    </span>
                  </td>
                  <td className={styles.rankName}>{c.name}</td>
                  <td>{c.visits}</td>
                  <td className={styles.rankValue} style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>{c.spend} EGP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Top Employees */}
        <motion.div
          className={styles.card}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>{t('dash.top')} {employeesTerm}</span>
            <Link href="/employees" className={styles.cardAction}>{t('dash.viewAll')}</Link>
          </div>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>#</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{employeeTerm}</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{bookingsTerm}</th>
                <th style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>{t('dash.colRevenue')}</th>
              </tr>
            </thead>
            <tbody>
              {currentTopEmployees.map((e) => (
                <tr key={e.rank} onClick={() => router.push(`/employees/${e.id}`)} style={{ cursor: 'pointer' }}>
                  <td>
                    <span className={`${styles.rankNumber} ${getRankClass(e.rank)}`}>
                      {e.rank}
                    </span>
                  </td>
                  <td className={styles.rankName}>{e.name}</td>
                  <td>{e.bookings}</td>
                  <td className={styles.rankValue} style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>{e.revenue} EGP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Top Services */}
        <motion.div
          className={styles.card}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>{t('dash.topServices')}</span>
            <Link href="/sales" className={styles.cardAction}>{t('dash.viewAll')}</Link>
          </div>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>#</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('sales.services')}</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('dash.colCount')}</th>
                <th style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>{t('dash.colRevenue')}</th>
              </tr>
            </thead>
            <tbody>
              {currentTopServices.map((s) => (
                <tr key={s.rank}>
                  <td>
                    <span className={`${styles.rankNumber} ${getRankClass(s.rank)}`}>
                      {s.rank}
                    </span>
                  </td>
                  <td className={styles.rankName}>{s.name}</td>
                  <td>{s.count}</td>
                  <td className={styles.rankValue} style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>{s.revenue} EGP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>

      {/* Summary Strip */}
      <div className={styles.summaryStrip}>
        <div className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}
          >
            <CalendarCheck size={24} />
          </div>
          <div className={styles.summaryContent}>
            <h3>{totalBookings}</h3>
            <p>{bookingsTerm} {t(activeDate === 'Today' ? 'dash.dateToday' : activeDate === 'This Week' ? 'dash.dateWeek' : activeDate === 'This Month' ? 'dash.dateMonth' : activeDate === 'This Quarter' ? 'dash.dateQuarter' : 'dash.dateCustom')}</p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}
          >
            <Users size={24} />
          </div>
          <div className={styles.summaryContent}>
            <h3>{Math.round(18 * getMultiplier(activeDate))}</h3>
            <p>+ {clientsTerm}</p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}
          >
            <Wallet size={24} />
          </div>
          <div className={styles.summaryContent}>
            <h3>{formatNum(Math.round(42500 * getMultiplier(activeDate)))}</h3>
            <p>{t('dash.cashDrawer')}</p>
          </div>
        </div>
        <div className={`${styles.summaryCard} ${styles.clientOfMonth}`}>
          <div
            className={styles.summaryIcon}
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            <Crown size={24} />
          </div>
          <div className={styles.summaryContent}>
            <h3>Fatima A.</h3>
            <p>🌟 {clientTerm} {t('dash.clientOfMonth')}</p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
