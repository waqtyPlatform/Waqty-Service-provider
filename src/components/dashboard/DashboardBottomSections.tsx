'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarCheck, Users, Wallet, Crown } from 'lucide-react';
import styles from '@/app/page.module.css';
import type { DashboardSummary } from '@/lib/api';

/**
 * The "below the fold" portion of the dashboard: top-clients / top-employees /
 * top-services tables, followed by the summary strip. Extracted so it can be
 * lazy-loaded via `next/dynamic({ ssr: false })` from `src/app/page.tsx` and
 * kept off the dashboard's first-paint render tree (saves ~126 elements +
 * the styling/layout cost). All data is passed in as props — this component
 * holds no state of its own.
 */

export interface RankRow {
    rank: number;
    name: string;
    id?: string;
}

export interface ClientRow extends RankRow {
    visits: number;
    spend: number | string;
}

export interface EmployeeRow extends RankRow {
    bookings: number;
    revenue: number | string;
}

export interface ServiceRow extends RankRow {
    count: number;
    revenue: number | string;
}

interface Props {
    topClients: ClientRow[];
    topEmployees: EmployeeRow[];
    topServices: ServiceRow[];
    summary: DashboardSummary;
    totalBookings: number;
    activeDate: string;
    lang: 'en' | 'ar';
    t: (key: string) => string;
    clientTerm: string;
    clientsTerm: string;
    employeeTerm: string;
    employeesTerm: string;
    bookingsTerm: string;
    formatNum: (n: number) => string;
}

function getRankClass(rank: number): string {
    if (rank === 1) return styles.rankGold;
    if (rank === 2) return styles.rankSilver;
    if (rank === 3) return styles.rankBronze;
    return '';
}

function dateRangeKey(activeDate: string): string {
    if (activeDate === 'Today') return 'dash.dateToday';
    if (activeDate === 'This Week') return 'dash.dateWeek';
    if (activeDate === 'This Month') return 'dash.dateMonth';
    if (activeDate === 'This Quarter') return 'dash.dateQuarter';
    return 'dash.dateCustom';
}

function clientOfMonthName(summary: DashboardSummary): string {
    if (summary.top_clients.length === 0) return 'Fatima A.';
    return summary.top_clients[0].name
        .split(' ')
        .map((n, i) => (i === 0 ? n : n[0] + '.'))
        .join(' ');
}

function DashboardBottomSections({
    topClients,
    topEmployees,
    topServices,
    summary,
    totalBookings,
    activeDate,
    t,
    clientTerm,
    clientsTerm,
    employeeTerm,
    employeesTerm,
    bookingsTerm,
    formatNum,
}: Props) {
    const router = useRouter();
    const alignStart = 'start';
    const alignEnd = 'end';

    return (
        <>
            {/* Bottom Tables */}
            <div className={`${styles.tablesRow} ${styles.fadeStaggerRow}`}>
                {/* Top Clients */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>
                            {t('dash.top')} {clientsTerm}
                        </span>
                        <Link href="/customers" className={styles.cardAction}>
                            {t('dash.viewAll')}
                        </Link>
                    </div>
                    <div className={styles.tableScroll}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: alignStart }}>#</th>
                                    <th style={{ textAlign: alignStart }}>{clientTerm}</th>
                                    <th style={{ textAlign: alignStart }}>{t('dash.colVisits')}</th>
                                    <th style={{ textAlign: alignEnd }}>{t('dash.colSpend')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topClients.map(c => (
                                    <tr
                                        key={c.rank}
                                        onClick={() => c.id && router.push(`/customers/${c.id}`)}
                                        style={{ cursor: c.id ? 'pointer' : 'default' }}
                                    >
                                        <td>
                                            <span className={`${styles.rankNumber} ${getRankClass(c.rank)}`}>
                                                {c.rank}
                                            </span>
                                        </td>
                                        <td className={styles.rankName}>{c.name}</td>
                                        <td>{c.visits}</td>
                                        <td className={styles.rankValue} style={{ textAlign: alignEnd }}>
                                            {c.spend} EGP
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Employees */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>
                            {t('dash.top')} {employeesTerm}
                        </span>
                        <Link href="/employees" className={styles.cardAction}>
                            {t('dash.viewAll')}
                        </Link>
                    </div>
                    <div className={styles.tableScroll}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: alignStart }}>#</th>
                                    <th style={{ textAlign: alignStart }}>{employeeTerm}</th>
                                    <th style={{ textAlign: alignStart }}>{bookingsTerm}</th>
                                    <th style={{ textAlign: alignEnd }}>{t('dash.colRevenue')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topEmployees.map(e => (
                                    <tr
                                        key={e.rank}
                                        onClick={() => e.id && router.push(`/employees/${e.id}`)}
                                        style={{ cursor: e.id ? 'pointer' : 'default' }}
                                    >
                                        <td>
                                            <span className={`${styles.rankNumber} ${getRankClass(e.rank)}`}>
                                                {e.rank}
                                            </span>
                                        </td>
                                        <td className={styles.rankName}>{e.name}</td>
                                        <td>{e.bookings}</td>
                                        <td className={styles.rankValue} style={{ textAlign: alignEnd }}>
                                            {e.revenue} EGP
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Services */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>{t('dash.topServices')}</span>
                        <Link href="/sales" className={styles.cardAction}>
                            {t('dash.viewAll')}
                        </Link>
                    </div>
                    <div className={styles.tableScroll}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: alignStart }}>#</th>
                                    <th style={{ textAlign: alignStart }}>{t('sales.services')}</th>
                                    <th style={{ textAlign: alignStart }}>{t('dash.colCount')}</th>
                                    <th style={{ textAlign: alignEnd }}>{t('dash.colRevenue')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topServices.map(s => (
                                    <tr key={s.rank}>
                                        <td>
                                            <span className={`${styles.rankNumber} ${getRankClass(s.rank)}`}>
                                                {s.rank}
                                            </span>
                                        </td>
                                        <td className={styles.rankName}>{s.name}</td>
                                        <td>{s.count}</td>
                                        <td className={styles.rankValue} style={{ textAlign: alignEnd }}>
                                            {s.revenue} EGP
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                        <h3>{totalBookings}</h3>
                        <p>
                            {bookingsTerm} {t(dateRangeKey(activeDate))}
                        </p>
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
                        <h3>{formatNum(summary.new_clients)}</h3>
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
                        <h3>{formatNum(Math.round(summary.total_revenue))}</h3>
                        <p>{t('dash.cashDrawer')}</p>
                    </div>
                </div>
                <div className={`${styles.summaryCard} ${styles.clientOfMonth}`}>
                    <div className={styles.summaryIcon} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                        <Crown size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                        <h3>{clientOfMonthName(summary)}</h3>
                        <p>
                            🌟 {clientTerm} {t('dash.clientOfMonth')}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default React.memo(DashboardBottomSections);
