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
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import styles from './page.module.css';

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

export default function DashboardPage() {
  const [activeDate, setActiveDate] = useState('Today');
  const router = useRouter();
  const { user } = useAuth();

  const businessType = user?.businessType || 'salon';
  const isClinic = businessType === 'clinic';
  const isBarber = businessType === 'barber';

  const clientTerm = isClinic ? 'Patient' : 'Client';
  const clientsTerm = isClinic ? 'Patients' : 'Clients';
  const bookingTerm = isClinic || isBarber ? 'Appointment' : 'Booking';
  const bookingsTerm = isClinic || isBarber ? 'Appointments' : 'Bookings';
  const employeeTerm = isClinic ? 'Doctor/Staff' : isBarber ? 'Barber' : 'Stylist';
  const employeesTerm = isClinic ? 'Doctors & Staff' : isBarber ? 'Barbers' : 'Stylists';

  const totalBookings = bookingStatusData.reduce((s, d) => s + d.value, 0);

  return (
    <div className={`${styles.dashboard} stagger-children`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Dashboard</h1>
          <p>Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className={styles.dateControls}>
          {dateRanges.map((range) => (
            <button
              key={range}
              className={`${styles.dateBtn} ${activeDate === range ? styles.dateBtnActive : ''
                }`}
              onClick={() => setActiveDate(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {kpiData.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
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
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', marginLeft: '4px', color: 'var(--text-tertiary)' }}>
                    {kpi.unit}
                  </span>
                )}
              </span>
              <div className={styles.kpiLabel}>
                {kpi.label === 'Bookings' ? bookingsTerm :
                  kpi.label === 'New Clients' ? `New ${clientsTerm}` : kpi.label}
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
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* Occupancy Table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>{employeesTerm} Occupancy</span>
            <Link href="/employees" className={styles.cardAction}>View All</Link>
          </div>
          <table className={styles.occupancyTable}>
            <thead>
              <tr>
                <th>{employeeTerm}</th>
                <th>Booked</th>
                <th style={{ width: '40%' }}>Occupancy</th>
                <th style={{ textAlign: 'right' }}>Rate</th>
              </tr>
            </thead>
            <tbody>
              {occupancyData.map((row) => (
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
                      style={{ color: getProgressColor(row.pct) }}
                    >
                      {row.pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Booking Status Donut */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Booking Status</span>
            <Link href="/bookings" className={styles.cardAction}>Details</Link>
          </div>
          <div style={{ height: 200, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {bookingStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
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
              <div className={styles.donutLabel}>Total</div>
            </div>
          </div>
          <div className={styles.donutLegend}>
            {bookingStatusData.map((item) => (
              <div key={item.name} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ background: item.color }}
                />
                <span>{item.name}</span>
                <span className={styles.legendValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Tables */}
      <div className={styles.tablesRow}>
        {/* Top Clients */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Top {clientsTerm}</span>
            <Link href="/customers" className={styles.cardAction}>View All</Link>
          </div>
          <table className={styles.rankTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>{clientTerm}</th>
                <th>Visits</th>
                <th style={{ textAlign: 'right' }}>Spend</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((c) => (
                <tr key={c.rank} onClick={() => router.push(`/customers/${c.id}`)} style={{ cursor: 'pointer' }}>
                  <td>
                    <span className={`${styles.rankNumber} ${getRankClass(c.rank)}`}>
                      {c.rank}
                    </span>
                  </td>
                  <td className={styles.rankName}>{c.name}</td>
                  <td>{c.visits}</td>
                  <td className={styles.rankValue}>{c.spend} EGP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Employees */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Top {employeesTerm}</span>
            <Link href="/employees" className={styles.cardAction}>View All</Link>
          </div>
          <table className={styles.rankTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>{employeeTerm}</th>
                <th>{bookingsTerm}</th>
                <th style={{ textAlign: 'right' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topEmployees.map((e) => (
                <tr key={e.rank} onClick={() => router.push(`/employees/${e.id}`)} style={{ cursor: 'pointer' }}>
                  <td>
                    <span className={`${styles.rankNumber} ${getRankClass(e.rank)}`}>
                      {e.rank}
                    </span>
                  </td>
                  <td className={styles.rankName}>{e.name}</td>
                  <td>{e.bookings}</td>
                  <td className={styles.rankValue}>{e.revenue} EGP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Services */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Top Services</span>
            <Link href="/sales" className={styles.cardAction}>View All</Link>
          </div>
          <table className={styles.rankTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Service</th>
                <th>Count</th>
                <th style={{ textAlign: 'right' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topServices.map((s) => (
                <tr key={s.rank}>
                  <td>
                    <span className={`${styles.rankNumber} ${getRankClass(s.rank)}`}>
                      {s.rank}
                    </span>
                  </td>
                  <td className={styles.rankName}>{s.name}</td>
                  <td>{s.count}</td>
                  <td className={styles.rankValue}>{s.revenue} EGP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
            <h3>47</h3>
            <p>{bookingsTerm} Today</p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}
          >
            <Wallet size={24} />
          </div>
          <div className={styles.summaryContent}>
            <h3>12,450 EGP</h3>
            <p>Sales Today</p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div
            className={styles.summaryIcon}
            style={{ background: '#EDE9FE', color: '#7C3AED' }}
          >
            <Users size={24} />
          </div>
          <div className={styles.summaryContent}>
            <h3>389</h3>
            <p>Total {clientsTerm}</p>
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
            <p>🌟 {clientTerm} of the Month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
