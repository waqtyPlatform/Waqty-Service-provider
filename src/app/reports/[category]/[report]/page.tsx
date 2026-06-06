'use client';

import { egpLabel } from '@/lib/money';
import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Calendar, Download, Filter, Search, ArrowRight, ArrowUpDown, ChevronLeft, Loader2 } from 'lucide-react';
import { Button, Select, Badge, Skeleton } from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import translations from '@/i18n/translations';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { reportApi, type ReportData as ApiReportData, type ReportFilters } from '@/lib/api';

/* ── Chart lazy-loaded so Recharts stays off the initial route chunk ── */
const ReportChart = dynamic(() => import('./_components/ReportChart'), {
    ssr: false,
    loading: () => <div style={{ width: '100%', height: '100%' }} />,
});

// --- Data Types ---
export interface ReportAction {
    label: string;
    href: string;
}

export interface ReportRow {
    id: number | string;
    col1?: string;
    col2?: string;
    col3?: string;
    col4?: string;
    col5?: string;
    action?: ReportAction;
    [key: string]: string | number | boolean | ReportAction | undefined;
}

export interface ReportData {
    title: string;
    chartType: 'bar' | 'line' | 'none';
    columns: string[];
    rows: ReportRow[];
    chartData: Array<{ name: string; value: number }>;
}

// --- Fallback Data Generators ---

const getSalesData = (report: string) => {
    const common = {
        chartType: 'bar' as const,
        rows: [
            {
                id: 1,
                date: '2026-03-15',
                amount: 3200,
                count: 12,
                status: 'Completed',
                link: '/transactions/dailies?date=2026-03-26',
            },
            {
                id: 2,
                date: '2026-03-14',
                amount: 2800,
                count: 10,
                status: 'Completed',
                link: '/transactions/dailies?date=2026-03-21',
            },
            {
                id: 3,
                date: '2026-03-15',
                amount: 4100,
                count: 15,
                status: 'Completed',
                link: '/transactions/dailies?date=2026-03-14',
            },
            {
                id: 4,
                date: '2026-03-26',
                amount: 3500,
                count: 14,
                status: 'Completed',
                link: '/transactions/dailies?date=2026-03-12',
            },
            {
                id: 5,
                date: '2026-03-12',
                amount: 5200,
                count: 20,
                status: 'Completed',
                link: '/transactions/dailies?date=2026-03-17',
            },
        ],
        chartData: [
            { name: 'Feb 14', value: 5200 },
            { name: 'Feb 15', value: 3500 },
            { name: 'Feb 16', value: 4100 },
            { name: 'Feb 17', value: 2800 },
            { name: 'Feb 18', value: 3200 },
        ],
    };

    if (report === 'daily-revenue') {
        return {
            title: 'rptDynamic.t.dailyRevenue',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.date',
                'rptDynamic.col.transactions',
                'rptDynamic.col.revenue',
                'rptDynamic.col.avgTicket',
                'rptDynamic.col.status',
            ],
            rows: common.rows.map(r => ({
                ...r,
                col1: r.date,
                col2: String(r.count),
                col3: `${r.amount} ${egpLabel()}`,
                col4: `${Math.round(r.amount / r.count)} ${egpLabel()}`,
                col5: r.status,
                action: { label: 'rptDynamic.act.viewDay', href: r.link },
            })),
            chartData: common.chartData,
        };
    }
    if (report === 'payment-methods') {
        return {
            title: 'rptDynamic.t.paymentMethods',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.method',
                'rptDynamic.col.transactions',
                'rptDynamic.col.totalAmount',
                'rptDynamic.col.pctOfTotal',
            ],
            rows: [
                { id: 1, col1: 'Cash', col2: '145', col3: `45,200 ${egpLabel()}`, col4: '45%' },
                { id: 2, col1: 'Credit Card', col2: '110', col3: `38,500 ${egpLabel()}`, col4: '38%' },
                { id: 3, col1: 'Bank Transfer', col2: '25', col3: `12,000 ${egpLabel()}`, col4: '12%' },
                { id: 4, col1: 'Gift Card', col2: '15', col3: `5,300 ${egpLabel()}`, col4: '5%' },
            ],
            chartData: [
                { name: 'Cash', value: 45200 },
                { name: 'Card', value: 38500 },
                { name: 'Transfer', value: 12000 },
                { name: 'Gift', value: 5300 },
            ],
        };
    }
    if (report === 'service-revenue') {
        return {
            title: 'rptDynamic.t.serviceRevenue',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.serviceName',
                'rptDynamic.col.category',
                'rptDynamic.col.qtySold',
                'rptDynamic.col.revenue',
            ],
            rows: [
                { id: 1, col1: 'Hair Cut & Style', col2: 'Hair', col3: '85', col4: `12,750 ${egpLabel()}` },
                { id: 2, col1: 'Gel Manicure', col2: 'Nails', col3: '65', col4: `9,750 ${egpLabel()}` },
                { id: 3, col1: 'Classic Facial', col2: 'Skin', col3: '40', col4: `14,000 ${egpLabel()}` },
                { id: 4, col1: 'Full Body Massage', col2: 'Body', col3: '30', col4: `15,000 ${egpLabel()}` },
                { id: 5, col1: 'Laser Hair Removal', col2: 'Laser', col3: '25', col4: `18,750 ${egpLabel()}` },
            ],
            chartData: [
                { name: 'Hair Cut', value: 12750 },
                { name: 'Manicure', value: 9750 },
                { name: 'Facial', value: 14000 },
                { name: 'Massage', value: 15000 },
                { name: 'Laser', value: 18750 },
            ],
        };
    }
    if (report === 'tax-report') {
        return {
            title: 'rptDynamic.t.taxReport',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.period',
                'rptDynamic.col.grossRevenue',
                'rptDynamic.col.tax14',
                'rptDynamic.col.netRevenue',
            ],
            rows: [
                {
                    id: 1,
                    col1: 'February 2026',
                    col2: `58,000 ${egpLabel()}`,
                    col3: `8,120 ${egpLabel()}`,
                    col4: `49,880 ${egpLabel()}`,
                },
                {
                    id: 2,
                    col1: 'January 2026',
                    col2: `55,000 ${egpLabel()}`,
                    col3: `7,700 ${egpLabel()}`,
                    col4: `47,300 ${egpLabel()}`,
                },
                {
                    id: 3,
                    col1: 'December 2025',
                    col2: `61,000 ${egpLabel()}`,
                    col3: `8,540 ${egpLabel()}`,
                    col4: `52,460 ${egpLabel()}`,
                },
            ],
            chartData: [
                { name: 'Dec', value: 8540 },
                { name: 'Jan', value: 7700 },
                { name: 'Feb', value: 8120 },
            ],
        };
    }
    return {
        title: 'rptDynamic.t.salesReport',
        chartType: 'bar' as const,
        columns: [
            'rptDynamic.col.date',
            'rptDynamic.col.count',
            'rptDynamic.col.amount',
            'rptDynamic.col.avg',
            'rptDynamic.col.status',
        ],
        rows: common.rows.map(r => ({
            ...r,
            col1: r.date,
            col2: String(r.count),
            col3: String(r.amount),
            col4: String(Math.round(r.amount / r.count)),
            col5: r.status,
        })),
        chartData: common.chartData,
    };
};

const getBookingsData = (report: string) => {
    if (report === 'cancellations') {
        return {
            title: 'rptDynamic.t.cancellations',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.date',
                'rptDynamic.col.cancelledBy',
                'rptDynamic.col.reason',
                'rptDynamic.col.lostRevenue',
            ],
            rows: [
                {
                    id: 1,
                    col1: '2026-03-21',
                    col2: 'Client',
                    col3: 'Sick',
                    col4: `450 ${egpLabel()}`,
                    action: { label: 'rptDynamic.act.viewBooking', href: '/bookings/BK-28492' },
                },
                {
                    id: 2,
                    col1: '2026-03-13',
                    col2: 'Client',
                    col3: 'Schedule Conflict',
                    col4: `300 ${egpLabel()}`,
                    action: { label: 'rptDynamic.act.viewBooking', href: '/bookings/BK-28491' },
                },
                {
                    id: 3,
                    col1: '2026-03-16',
                    col2: 'System',
                    col3: 'No Show',
                    col4: `600 ${egpLabel()}`,
                    action: { label: 'rptDynamic.act.viewBooking', href: '/bookings/BK-28490' },
                },
                {
                    id: 4,
                    col1: '2026-03-18',
                    col2: 'Client',
                    col3: 'Changed Mind',
                    col4: `250 ${egpLabel()}`,
                    action: { label: 'rptDynamic.act.viewBooking', href: '/bookings/BK-28489' },
                },
                {
                    id: 5,
                    col1: '2026-03-20',
                    col2: 'Staff',
                    col3: 'Employee Absent',
                    col4: `500 ${egpLabel()}`,
                    action: { label: 'rptDynamic.act.viewBooking', href: '/bookings/BK-28488' },
                },
            ],
            chartData: [
                { name: 'Feb 13', value: 1 },
                { name: 'Feb 14', value: 1 },
                { name: 'Feb 15', value: 1 },
                { name: 'Feb 16', value: 0 },
                { name: 'Feb 17', value: 1 },
                { name: 'Feb 18', value: 1 },
            ],
        };
    }
    if (report === 'history') {
        return {
            title: 'rptDynamic.t.bookingHistory',
            chartType: 'none' as const,
            columns: [
                'rptDynamic.col.id',
                'rptDynamic.col.date',
                'rptDynamic.col.client',
                'rptDynamic.col.service',
                'rptDynamic.col.status',
            ],
            rows: [
                {
                    id: 1,
                    col1: '#BK-1001',
                    col2: 'Feb 18',
                    col3: 'Fatima Al-Rashid',
                    col4: 'Hair Cut',
                    col5: 'Completed',
                    action: { label: 'rptDynamic.act.view', href: '/bookings/BK-1001' },
                },
                {
                    id: 2,
                    col1: '#BK-1002',
                    col2: 'Feb 18',
                    col3: 'Maha Mahmoud',
                    col4: 'Manicure',
                    col5: 'Confirmed',
                    action: { label: 'rptDynamic.act.view', href: '/bookings/BK-1002' },
                },
                {
                    id: 3,
                    col1: '#BK-1003',
                    col2: 'Feb 17',
                    col3: 'Layla Ahmed',
                    col4: 'Facial',
                    col5: 'Cancelled',
                    action: { label: 'rptDynamic.act.view', href: '/bookings/BK-1003' },
                },
                {
                    id: 4,
                    col1: '#BK-1004',
                    col2: 'Feb 17',
                    col3: 'Nora Salem',
                    col4: 'Massage',
                    col5: 'Completed',
                    action: { label: 'rptDynamic.act.view', href: '/bookings/BK-1004' },
                },
                {
                    id: 5,
                    col1: '#BK-1005',
                    col2: 'Feb 16',
                    col3: 'Sara Khalil',
                    col4: 'Laser',
                    col5: 'Completed',
                    action: { label: 'rptDynamic.act.view', href: '/bookings/BK-1005' },
                },
                {
                    id: 6,
                    col1: '#BK-1006',
                    col2: 'Feb 16',
                    col3: 'Reem Adel',
                    col4: 'Hair Color',
                    col5: 'Completed',
                    action: { label: 'rptDynamic.act.view', href: '/bookings/BK-1006' },
                },
                {
                    id: 7,
                    col1: '#BK-1007',
                    col2: 'Feb 15',
                    col3: 'Huda Farouk',
                    col4: 'Pedicure',
                    col5: 'Completed',
                    action: { label: 'rptDynamic.act.view', href: '/bookings/BK-1007' },
                },
            ],
            chartData: [],
        };
    }
    if (report === 'utilization') {
        return {
            title: 'rptDynamic.t.utilization',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.resource',
                'rptDynamic.col.type',
                'rptDynamic.col.totalHours',
                'rptDynamic.col.usedHours',
                'rptDynamic.col.utilization',
            ],
            rows: [
                { id: 1, col1: 'Room A — VIP Suite', col2: 'Treatment Room', col3: '176', col4: '152', col5: '86%' },
                { id: 2, col1: 'Room B — Standard', col2: 'Treatment Room', col3: '176', col4: '141', col5: '80%' },
                { id: 3, col1: 'Room C — Laser', col2: 'Specialized', col3: '176', col4: '95', col5: '54%' },
                { id: 4, col1: 'Hair Station 1', col2: 'Workstation', col3: '176', col4: '168', col5: '95%' },
                { id: 5, col1: 'Hair Station 2', col2: 'Workstation', col3: '176', col4: '145', col5: '82%' },
                { id: 6, col1: 'Nail Station', col2: 'Workstation', col3: '176', col4: '130', col5: '74%' },
            ],
            chartData: [
                { name: 'VIP Suite', value: 86 },
                { name: 'Standard', value: 80 },
                { name: 'Laser', value: 54 },
                { name: 'Hair 1', value: 95 },
                { name: 'Hair 2', value: 82 },
                { name: 'Nail', value: 74 },
            ],
        };
    }
    if (report === 'sources') {
        return {
            title: 'rptDynamic.t.sources',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.source',
                'rptDynamic.col.bookings',
                'rptDynamic.col.revenue',
                'rptDynamic.col.pctOfTotal',
                'rptDynamic.col.avgTicket',
            ],
            rows: [
                {
                    id: 1,
                    col1: 'Online — Website',
                    col2: '320',
                    col3: `68,000 ${egpLabel()}`,
                    col4: '38%',
                    col5: `213 ${egpLabel()}`,
                },
                {
                    id: 2,
                    col1: 'Online — App',
                    col2: '185',
                    col3: `42,500 ${egpLabel()}`,
                    col4: '22%',
                    col5: `230 ${egpLabel()}`,
                },
                {
                    id: 3,
                    col1: 'Phone Call',
                    col2: '145',
                    col3: `32,000 ${egpLabel()}`,
                    col4: '17%',
                    col5: `221 ${egpLabel()}`,
                },
                {
                    id: 4,
                    col1: 'Walk-in',
                    col2: '120',
                    col3: `22,800 ${egpLabel()}`,
                    col4: '14%',
                    col5: `190 ${egpLabel()}`,
                },
                {
                    id: 5,
                    col1: 'Social Media',
                    col2: '72',
                    col3: `15,200 ${egpLabel()}`,
                    col4: '9%',
                    col5: `211 ${egpLabel()}`,
                },
            ],
            chartData: [
                { name: 'Website', value: 320 },
                { name: 'App', value: 185 },
                { name: 'Phone', value: 145 },
                { name: 'Walk-in', value: 120 },
                { name: 'Social', value: 72 },
            ],
        };
    }
    return {
        title: 'rptDynamic.t.bookingReport',
        chartType: 'bar' as const,
        columns: [
            'rptDynamic.col.date',
            'rptDynamic.col.totalBookings',
            'rptDynamic.col.completed',
            'rptDynamic.col.cancelled',
            'rptDynamic.col.utilization',
        ],
        rows: [
            { id: 1, col1: 'Feb 18', col2: '45', col3: '40', col4: '2', col5: '88%' },
            { id: 2, col1: 'Feb 17', col2: '42', col3: '38', col4: '1', col5: '85%' },
            { id: 3, col1: 'Feb 16', col2: '50', col3: '46', col4: '3', col5: '92%' },
            { id: 4, col1: 'Feb 15', col2: '38', col3: '35', col4: '2', col5: '82%' },
        ],
        chartData: [
            { name: 'Feb 15', value: 38 },
            { name: 'Feb 16', value: 50 },
            { name: 'Feb 17', value: 42 },
            { name: 'Feb 18', value: 45 },
        ],
    };
};

const getEmployeesData = (report: string) => {
    if (report === 'commissions') {
        return {
            title: 'rptDynamic.t.commissions',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.employee',
                'rptDynamic.col.serviceRevenue',
                'rptDynamic.col.totalCommission',
                'rptDynamic.col.payoutStatus',
            ],
            rows: [
                {
                    id: 1,
                    col1: 'Sara Ahmed',
                    col2: `24,000 ${egpLabel()}`,
                    col3: `2,600 ${egpLabel()}`,
                    col4: 'Pending',
                    action: { label: 'rptDynamic.act.viewProfile', href: '/employees/EMP-001' },
                },
                {
                    id: 2,
                    col1: 'Nora Ali',
                    col2: `18,000 ${egpLabel()}`,
                    col3: `1,880 ${egpLabel()}`,
                    col4: 'Paid',
                    action: { label: 'rptDynamic.act.viewProfile', href: '/employees/EMP-002' },
                },
                {
                    id: 3,
                    col1: 'Mona Zein',
                    col2: `15,000 ${egpLabel()}`,
                    col3: `1,650 ${egpLabel()}`,
                    col4: 'Pending',
                    action: { label: 'rptDynamic.act.viewProfile', href: '/employees/EMP-003' },
                },
            ],
            chartData: [
                { name: 'Sara', value: 2600 },
                { name: 'Nora', value: 1880 },
                { name: 'Mona', value: 1650 },
            ],
        };
    }
    if (report === 'sales') {
        return {
            title: 'rptDynamic.t.employeeSales',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.employee',
                'rptDynamic.col.bookings',
                'rptDynamic.col.revenue',
                'rptDynamic.col.avgPerBooking',
            ],
            rows: [
                { id: 1, col1: 'Sara Ahmed', col2: '58', col3: `24,000 ${egpLabel()}`, col4: `414 ${egpLabel()}` },
                { id: 2, col1: 'Nora Ali', col2: '44', col3: `18,000 ${egpLabel()}`, col4: `409 ${egpLabel()}` },
                { id: 3, col1: 'Mona Zein', col2: '38', col3: `15,000 ${egpLabel()}`, col4: `395 ${egpLabel()}` },
                { id: 4, col1: 'Layla Hassan', col2: '30', col3: `12,000 ${egpLabel()}`, col4: `400 ${egpLabel()}` },
            ],
            chartData: [
                { name: 'Sara', value: 24000 },
                { name: 'Nora', value: 18000 },
                { name: 'Mona', value: 15000 },
                { name: 'Layla', value: 12000 },
            ],
        };
    }
    if (report === 'attendance') {
        return {
            title: 'rptDynamic.t.attendance',
            chartType: 'none' as const,
            columns: [
                'rptDynamic.col.employee',
                'rptDynamic.col.daysPresent',
                'rptDynamic.col.daysAbsent',
                'rptDynamic.col.lateArrivals',
                'rptDynamic.col.utilization',
            ],
            rows: [
                { id: 1, col1: 'Sara Ahmed', col2: '22', col3: '1', col4: '2', col5: '92%' },
                { id: 2, col1: 'Nora Ali', col2: '20', col3: '3', col4: '1', col5: '85%' },
                { id: 3, col1: 'Mona Zein', col2: '23', col3: '0', col4: '0', col5: '95%' },
            ],
            chartData: [] as Array<{ name: string; value: number }>,
        };
    }
    return {
        title: 'rptDynamic.t.employeeReport',
        chartType: 'bar' as const,
        columns: [
            'rptDynamic.col.employee',
            'rptDynamic.col.rating',
            'rptDynamic.col.reviews',
            'rptDynamic.col.satisfaction',
        ],
        rows: [
            { id: 1, col1: 'Sara Ahmed', col2: '4.9', col3: '45', col4: '98%' },
            { id: 2, col1: 'Nora Ali', col2: '4.7', col3: '38', col4: '95%' },
            { id: 3, col1: 'Mona Zein', col2: '4.8', col3: '42', col4: '96%' },
        ],
        chartData: [
            { name: 'Sara', value: 49 },
            { name: 'Nora', value: 47 },
            { name: 'Mona', value: 48 },
        ],
    };
};

const getClientsData = (report: string) => {
    if (report === 'top-spenders') {
        return {
            title: 'rptDynamic.t.topSpenders',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.client',
                'rptDynamic.col.totalSpent',
                'rptDynamic.col.visits',
                'rptDynamic.col.avgPerVisit',
                'rptDynamic.col.lastVisit',
            ],
            rows: [
                {
                    id: 1,
                    col1: 'Fatima Al-Rashid',
                    col2: `12,500 ${egpLabel()}`,
                    col3: '28',
                    col4: `446 ${egpLabel()}`,
                    col5: 'Feb 18',
                },
                {
                    id: 2,
                    col1: 'Maha Mahmoud',
                    col2: `9,800 ${egpLabel()}`,
                    col3: '22',
                    col4: `445 ${egpLabel()}`,
                    col5: 'Feb 16',
                },
                {
                    id: 3,
                    col1: 'Layla Ahmed',
                    col2: `8,200 ${egpLabel()}`,
                    col3: '18',
                    col4: `456 ${egpLabel()}`,
                    col5: 'Feb 17',
                },
                {
                    id: 4,
                    col1: 'Nora Salem',
                    col2: `7,500 ${egpLabel()}`,
                    col3: '15',
                    col4: `500 ${egpLabel()}`,
                    col5: 'Feb 14',
                },
                {
                    id: 5,
                    col1: 'Sara Khalil',
                    col2: `6,800 ${egpLabel()}`,
                    col3: '20',
                    col4: `340 ${egpLabel()}`,
                    col5: 'Feb 18',
                },
                {
                    id: 6,
                    col1: 'Reem Adel',
                    col2: `5,900 ${egpLabel()}`,
                    col3: '14',
                    col4: `421 ${egpLabel()}`,
                    col5: 'Feb 15',
                },
            ],
            chartData: [
                { name: 'Fatima', value: 12500 },
                { name: 'Maha', value: 9800 },
                { name: 'Layla', value: 8200 },
                { name: 'Nora', value: 7500 },
                { name: 'Sara', value: 6800 },
                { name: 'Reem', value: 5900 },
            ],
        };
    }
    if (report === 'retention') {
        return {
            title: 'rptDynamic.t.retention',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.segment',
                'rptDynamic.col.totalClients',
                'rptDynamic.col.returned',
                'rptDynamic.col.retentionRate',
                'rptDynamic.col.avgVisits',
            ],
            rows: [
                { id: 1, col1: 'VIP (10+ visits)', col2: '45', col3: '42', col4: '93%', col5: '18.5' },
                { id: 2, col1: 'Regular (5-9 visits)', col2: '120', col3: '98', col4: '82%', col5: '6.8' },
                { id: 3, col1: 'Occasional (2-4 visits)', col2: '280', col3: '185', col4: '66%', col5: '2.9' },
                { id: 4, col1: 'First-time', col2: '85', col3: '52', col4: '61%', col5: '1.6' },
                { id: 5, col1: 'Lapsed (90+ days)', col2: '65', col3: '12', col4: '18%', col5: '3.2' },
            ],
            chartData: [
                { name: 'VIP', value: 93 },
                { name: 'Regular', value: 82 },
                { name: 'Occasional', value: 66 },
                { name: 'First-time', value: 61 },
                { name: 'Lapsed', value: 18 },
            ],
        };
    }
    if (report === 'feedback') {
        return {
            title: 'rptDynamic.t.feedback',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.service',
                'rptDynamic.col.avgRating',
                'rptDynamic.col.reviews',
                'rptDynamic.col.fiveStarPct',
                'rptDynamic.col.commonPraise',
            ],
            rows: [
                { id: 1, col1: 'Full Body Massage', col2: '4.9', col3: '52', col4: '88%', col5: 'Relaxing atmosphere' },
                { id: 2, col1: 'HydraFacial', col2: '4.8', col3: '85', col4: '82%', col5: 'Visible results' },
                { id: 3, col1: 'Hair Cut & Style', col2: '4.7', col3: '78', col4: '76%', col5: 'Creative styling' },
                { id: 4, col1: 'Gel Manicure', col2: '4.6', col3: '65', col4: '72%', col5: 'Long lasting' },
                {
                    id: 5,
                    col1: 'Laser Hair Removal',
                    col2: '4.5',
                    col3: '25',
                    col4: '68%',
                    col5: 'Effective treatment',
                },
            ],
            chartData: [
                { name: 'Massage', value: 49 },
                { name: 'HydraFacial', value: 48 },
                { name: 'Hair Cut', value: 47 },
                { name: 'Manicure', value: 46 },
                { name: 'Laser', value: 45 },
            ],
        };
    }
    if (report === 'demographics') {
        return {
            title: 'rptDynamic.t.demographics',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.segment',
                'rptDynamic.col.clients',
                'rptDynamic.col.pctOfTotal',
                'rptDynamic.col.avgSpend',
                'rptDynamic.col.topService',
            ],
            rows: [
                { id: 1, col1: 'Age 18-25', col2: '185', col3: '15%', col4: `280 ${egpLabel()}`, col5: 'Gel Manicure' },
                { id: 2, col1: 'Age 26-35', col2: '420', col3: '34%', col4: `450 ${egpLabel()}`, col5: 'HydraFacial' },
                {
                    id: 3,
                    col1: 'Age 36-45',
                    col2: '350',
                    col3: '28%',
                    col4: `520 ${egpLabel()}`,
                    col5: 'Hair Cut & Style',
                },
                {
                    id: 4,
                    col1: 'Age 46-55',
                    col2: '180',
                    col3: '15%',
                    col4: `480 ${egpLabel()}`,
                    col5: 'Full Body Massage',
                },
                { id: 5, col1: 'Age 55+', col2: '105', col3: '8%', col4: `350 ${egpLabel()}`, col5: 'Classic Facial' },
            ],
            chartData: [
                { name: '18-25', value: 185 },
                { name: '26-35', value: 420 },
                { name: '36-45', value: 350 },
                { name: '46-55', value: 180 },
                { name: '55+', value: 105 },
            ],
        };
    }
    return {
        title: 'rptDynamic.t.clientReport',
        chartType: 'none' as const,
        columns: ['rptDynamic.col.metric', 'rptDynamic.col.value', 'rptDynamic.col.change'],
        rows: [
            { id: 1, col1: 'Overall Retention', col2: '78%', col3: '+2%' },
            { id: 2, col1: 'First Visit Return', col2: '62%', col3: '+5%' },
            { id: 3, col1: 'VIP Retention', col2: '92%', col3: '+1%' },
        ],
        chartData: [],
    };
};

const getServicesData = (report: string) => {
    if (report === 'popularity') {
        return {
            title: 'rptDynamic.t.popularity',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.service',
                'rptDynamic.col.category',
                'rptDynamic.col.bookings',
                'rptDynamic.col.revenue',
                'rptDynamic.col.rating',
            ],
            rows: [
                { id: 1, col1: 'HydraFacial', col2: 'Skin', col3: '85', col4: `14,000 ${egpLabel()}`, col5: '4.9' },
                {
                    id: 2,
                    col1: 'Hair Cut & Style',
                    col2: 'Hair',
                    col3: '78',
                    col4: `12,750 ${egpLabel()}`,
                    col5: '4.8',
                },
                { id: 3, col1: 'Gel Manicure', col2: 'Nails', col3: '65', col4: `9,750 ${egpLabel()}`, col5: '4.7' },
                {
                    id: 4,
                    col1: 'Full Body Massage',
                    col2: 'Body',
                    col3: '52',
                    col4: `15,000 ${egpLabel()}`,
                    col5: '4.9',
                },
                {
                    id: 5,
                    col1: 'Laser Hair Removal',
                    col2: 'Laser',
                    col3: '25',
                    col4: `18,750 ${egpLabel()}`,
                    col5: '4.6',
                },
                {
                    id: 6,
                    col1: 'Classic Pedicure',
                    col2: 'Nails',
                    col3: '48',
                    col4: `4,800 ${egpLabel()}`,
                    col5: '4.5',
                },
            ],
            chartData: [
                { name: 'HydraFacial', value: 85 },
                { name: 'Hair Cut', value: 78 },
                { name: 'Manicure', value: 65 },
                { name: 'Massage', value: 52 },
                { name: 'Pedicure', value: 48 },
                { name: 'Laser', value: 25 },
            ],
        };
    }
    if (report === 'revenue') {
        return {
            title: 'rptDynamic.t.serviceRevenuePer',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.service',
                'rptDynamic.col.category',
                'rptDynamic.col.qtySold',
                'rptDynamic.col.revenue',
                'rptDynamic.col.pctOfTotal',
            ],
            rows: [
                {
                    id: 1,
                    col1: 'Laser Hair Removal',
                    col2: 'Laser',
                    col3: '25',
                    col4: `18,750 ${egpLabel()}`,
                    col5: '24%',
                },
                {
                    id: 2,
                    col1: 'Full Body Massage',
                    col2: 'Body',
                    col3: '52',
                    col4: `15,000 ${egpLabel()}`,
                    col5: '19%',
                },
                { id: 3, col1: 'HydraFacial', col2: 'Skin', col3: '85', col4: `14,000 ${egpLabel()}`, col5: '18%' },
                {
                    id: 4,
                    col1: 'Hair Cut & Style',
                    col2: 'Hair',
                    col3: '78',
                    col4: `12,750 ${egpLabel()}`,
                    col5: '16%',
                },
                { id: 5, col1: 'Gel Manicure', col2: 'Nails', col3: '65', col4: `9,750 ${egpLabel()}`, col5: '13%' },
                { id: 6, col1: 'Classic Pedicure', col2: 'Nails', col3: '48', col4: `4,800 ${egpLabel()}`, col5: '6%' },
                { id: 7, col1: 'Hair Color', col2: 'Hair', col3: '22', col4: `3,300 ${egpLabel()}`, col5: '4%' },
            ],
            chartData: [
                { name: 'Laser', value: 18750 },
                { name: 'Massage', value: 15000 },
                { name: 'HydraFacial', value: 14000 },
                { name: 'Hair Cut', value: 12750 },
                { name: 'Manicure', value: 9750 },
                { name: 'Pedicure', value: 4800 },
            ],
        };
    }
    if (report === 'duration') {
        return {
            title: 'rptDynamic.t.duration',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.service',
                'rptDynamic.col.scheduledDuration',
                'rptDynamic.col.actualAvg',
                'rptDynamic.col.variance',
                'rptDynamic.col.onTimePct',
            ],
            rows: [
                { id: 1, col1: 'Hair Cut & Style', col2: '45 min', col3: '42 min', col4: '-3 min', col5: '92%' },
                { id: 2, col1: 'HydraFacial', col2: '60 min', col3: '58 min', col4: '-2 min', col5: '88%' },
                { id: 3, col1: 'Full Body Massage', col2: '90 min', col3: '95 min', col4: '+5 min', col5: '78%' },
                { id: 4, col1: 'Gel Manicure', col2: '30 min', col3: '28 min', col4: '-2 min', col5: '95%' },
                { id: 5, col1: 'Laser Hair Removal', col2: '45 min', col3: '50 min', col4: '+5 min', col5: '82%' },
                { id: 6, col1: 'Hair Color', col2: '120 min', col3: '130 min', col4: '+10 min', col5: '72%' },
            ],
            chartData: [
                { name: 'Hair Cut', value: 42 },
                { name: 'HydraFacial', value: 58 },
                { name: 'Massage', value: 95 },
                { name: 'Manicure', value: 28 },
                { name: 'Laser', value: 50 },
                { name: 'Hair Color', value: 130 },
            ],
        };
    }
    if (report === 'categories') {
        return {
            title: 'rptDynamic.t.categories',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.category',
                'rptDynamic.col.services',
                'rptDynamic.col.bookings',
                'rptDynamic.col.revenue',
                'rptDynamic.col.avgRating',
            ],
            rows: [
                { id: 1, col1: 'Hair', col2: '8', col3: '142', col4: `28,500 ${egpLabel()}`, col5: '4.8' },
                { id: 2, col1: 'Skin', col2: '6', col3: '125', col4: `22,000 ${egpLabel()}`, col5: '4.8' },
                { id: 3, col1: 'Nails', col2: '5', col3: '113', col4: `14,550 ${egpLabel()}`, col5: '4.6' },
                { id: 4, col1: 'Body', col2: '4', col3: '82', col4: `18,000 ${egpLabel()}`, col5: '4.9' },
                { id: 5, col1: 'Laser', col2: '3', col3: '25', col4: `18,750 ${egpLabel()}`, col5: '4.5' },
            ],
            chartData: [
                { name: 'Hair', value: 28500 },
                { name: 'Skin', value: 22000 },
                { name: 'Body', value: 18000 },
                { name: 'Laser', value: 18750 },
                { name: 'Nails', value: 14550 },
            ],
        };
    }
    return {
        title: 'rptDynamic.t.serviceReport',
        chartType: 'bar' as const,
        columns: ['rptDynamic.col.service', 'rptDynamic.col.value', 'rptDynamic.col.change'],
        rows: [
            { id: 1, col1: 'HydraFacial', col2: `14,000 ${egpLabel()}`, col3: '+8%' },
            { id: 2, col1: 'Hair Cut & Style', col2: `12,750 ${egpLabel()}`, col3: '+5%' },
            { id: 3, col1: 'Full Body Massage', col2: `15,000 ${egpLabel()}`, col3: '+12%' },
        ],
        chartData: [
            { name: 'HydraFacial', value: 14000 },
            { name: 'Hair Cut', value: 12750 },
            { name: 'Massage', value: 15000 },
        ],
    };
};

const getCustomData = (report: string) => {
    if (report === 'revenue-bookings') {
        return {
            title: 'rptDynamic.t.revenueBookings',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.period',
                'rptDynamic.col.bookings',
                'rptDynamic.col.revenue',
                'rptDynamic.col.revenuePerBooking',
                'rptDynamic.col.change',
            ],
            rows: [
                {
                    id: 1,
                    col1: 'February 2026',
                    col2: '270',
                    col3: `58,000 ${egpLabel()}`,
                    col4: `215 ${egpLabel()}`,
                    col5: '+12%',
                },
                {
                    id: 2,
                    col1: 'January 2026',
                    col2: '235',
                    col3: `55,000 ${egpLabel()}`,
                    col4: `234 ${egpLabel()}`,
                    col5: '+8%',
                },
                {
                    id: 3,
                    col1: 'December 2025',
                    col2: '310',
                    col3: `61,000 ${egpLabel()}`,
                    col4: `197 ${egpLabel()}`,
                    col5: '+15%',
                },
                {
                    id: 4,
                    col1: 'November 2025',
                    col2: '220',
                    col3: `52,000 ${egpLabel()}`,
                    col4: `236 ${egpLabel()}`,
                    col5: '+5%',
                },
                {
                    id: 5,
                    col1: 'October 2025',
                    col2: '198',
                    col3: `48,000 ${egpLabel()}`,
                    col4: `242 ${egpLabel()}`,
                    col5: '+3%',
                },
            ],
            chartData: [
                { name: 'Oct', value: 48000 },
                { name: 'Nov', value: 52000 },
                { name: 'Dec', value: 61000 },
                { name: 'Jan', value: 55000 },
                { name: 'Feb', value: 58000 },
            ],
        };
    }
    if (report === 'employee-efficiency') {
        return {
            title: 'rptDynamic.t.employeeEfficiency',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.employee',
                'rptDynamic.col.hoursWorked',
                'rptDynamic.col.revenueGenerated',
                'rptDynamic.col.revenuePerHour',
                'rptDynamic.col.clientsServed',
            ],
            rows: [
                {
                    id: 1,
                    col1: 'Sara Ahmed',
                    col2: '168',
                    col3: `24,000 ${egpLabel()}`,
                    col4: `143 ${egpLabel()}`,
                    col5: '58',
                },
                {
                    id: 2,
                    col1: 'Nora Ali',
                    col2: '160',
                    col3: `18,000 ${egpLabel()}`,
                    col4: `113 ${egpLabel()}`,
                    col5: '44',
                },
                {
                    id: 3,
                    col1: 'Mona Zein',
                    col2: '172',
                    col3: `15,000 ${egpLabel()}`,
                    col4: `87 ${egpLabel()}`,
                    col5: '38',
                },
                {
                    id: 4,
                    col1: 'Layla Hassan',
                    col2: '152',
                    col3: `12,000 ${egpLabel()}`,
                    col4: `79 ${egpLabel()}`,
                    col5: '30',
                },
                {
                    id: 5,
                    col1: 'Reem Adel',
                    col2: '164',
                    col3: `9,000 ${egpLabel()}`,
                    col4: `55 ${egpLabel()}`,
                    col5: '25',
                },
            ],
            chartData: [
                { name: 'Sara', value: 143 },
                { name: 'Nora', value: 113 },
                { name: 'Mona', value: 87 },
                { name: 'Layla', value: 79 },
                { name: 'Reem', value: 55 },
            ],
        };
    }
    if (report === 'client-ltv') {
        return {
            title: 'rptDynamic.t.clientLtv',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.segment',
                'rptDynamic.col.clients',
                'rptDynamic.col.avgLtv',
                'rptDynamic.col.totalValue',
                'rptDynamic.col.avgVisits',
            ],
            rows: [
                {
                    id: 1,
                    col1: 'Platinum (>10K)',
                    col2: '25',
                    col3: `14,200 ${egpLabel()}`,
                    col4: `355,000 ${egpLabel()}`,
                    col5: '32',
                },
                {
                    id: 2,
                    col1: 'Gold (5K-10K)',
                    col2: '68',
                    col3: `7,500 ${egpLabel()}`,
                    col4: `510,000 ${egpLabel()}`,
                    col5: '18',
                },
                {
                    id: 3,
                    col1: 'Silver (2K-5K)',
                    col2: '185',
                    col3: `3,200 ${egpLabel()}`,
                    col4: `592,000 ${egpLabel()}`,
                    col5: '8',
                },
                {
                    id: 4,
                    col1: 'Bronze (500-2K)',
                    col2: '420',
                    col3: `1,100 ${egpLabel()}`,
                    col4: `462,000 ${egpLabel()}`,
                    col5: '3',
                },
                {
                    id: 5,
                    col1: 'New (<500)',
                    col2: '542',
                    col3: `280 ${egpLabel()}`,
                    col4: `151,760 ${egpLabel()}`,
                    col5: '1',
                },
            ],
            chartData: [
                { name: 'Platinum', value: 14200 },
                { name: 'Gold', value: 7500 },
                { name: 'Silver', value: 3200 },
                { name: 'Bronze', value: 1100 },
                { name: 'New', value: 280 },
            ],
        };
    }
    if (report === 'monthly-summary') {
        return {
            title: 'rptDynamic.t.monthlySummary',
            chartType: 'bar' as const,
            columns: [
                'rptDynamic.col.metric',
                'rptDynamic.col.thisMonth',
                'rptDynamic.col.lastMonth',
                'rptDynamic.col.change',
                'rptDynamic.col.target',
            ],
            rows: [
                {
                    id: 1,
                    col1: 'Total Revenue',
                    col2: `58,000 ${egpLabel()}`,
                    col3: `55,000 ${egpLabel()}`,
                    col4: '+5.5%',
                    col5: `60,000 ${egpLabel()}`,
                },
                {
                    id: 2,
                    col1: 'Net Profit',
                    col2: `27,000 ${egpLabel()}`,
                    col3: `22,000 ${egpLabel()}`,
                    col4: '+22.7%',
                    col5: `25,000 ${egpLabel()}`,
                },
                { id: 3, col1: 'Total Bookings', col2: '270', col3: '235', col4: '+14.9%', col5: '280' },
                { id: 4, col1: 'New Clients', col2: '85', col3: '72', col4: '+18.1%', col5: '80' },
                { id: 5, col1: 'Client Retention', col2: '78%', col3: '76%', col4: '+2.6%', col5: '80%' },
                { id: 6, col1: 'Avg Client Rating', col2: '4.8', col3: '4.7', col4: '+2.1%', col5: '4.8' },
                { id: 7, col1: 'Staff Utilization', col2: '85%', col3: '82%', col4: '+3.7%', col5: '88%' },
            ],
            chartData: [
                { name: 'Revenue', value: 58000 },
                { name: 'Profit', value: 27000 },
                { name: 'Bookings', value: 270 },
                { name: 'New Clients', value: 85 },
            ],
        };
    }
    return {
        title: report.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        chartType: 'bar' as const,
        columns: [
            'rptDynamic.col.metric',
            'rptDynamic.col.current',
            'rptDynamic.col.previous',
            'rptDynamic.col.change',
        ],
        rows: [
            { id: 1, col1: 'Revenue', col2: `58,000 ${egpLabel()}`, col3: `51,500 ${egpLabel()}`, col4: '+12.6%' },
            { id: 2, col1: 'Bookings', col2: '270', col3: '235', col4: '+14.9%' },
            { id: 3, col1: 'Avg Ticket', col2: `420 ${egpLabel()}`, col3: `395 ${egpLabel()}`, col4: '+6.3%' },
        ],
        chartData: [
            { name: 'Revenue', value: 58000 },
            { name: 'Bookings', value: 270 },
            { name: 'Avg Ticket', value: 420 },
        ],
    };
};

const generateData = (category: string, report: string): ReportData => {
    if (category === 'sales' || category === 'revenue') return getSalesData(report);
    if (category === 'bookings') return getBookingsData(report);
    if (category === 'employees') return getEmployeesData(report);
    if (category === 'clients') return getClientsData(report);
    if (category === 'services') return getServicesData(report);
    if (category === 'custom') return getCustomData(report);

    // Fallback
    return {
        title: `${report.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        chartType: 'bar',
        columns: [
            'rptDynamic.col.metric',
            'rptDynamic.col.current',
            'rptDynamic.col.previous',
            'rptDynamic.col.change',
        ],
        rows: [
            { id: 1, col1: 'Revenue', col2: `58,000 ${egpLabel()}`, col3: `51,500 ${egpLabel()}`, col4: '+12.6%' },
            { id: 2, col1: 'Bookings', col2: '270', col3: '235', col4: '+14.9%' },
        ],
        chartData: [
            { name: 'Revenue', value: 58000 },
            { name: 'Bookings', value: 270 },
        ],
    };
};

/* ── Map category to the correct API fetcher ── */
const categoryFetcherMap: Record<string, (filters?: ReportFilters) => ReturnType<typeof reportApi.getRevenueReport>> = {
    revenue: f => reportApi.getRevenueReport(f),
    sales: f => reportApi.getRevenueReport(f),
    bookings: f => reportApi.getBookingsReport(f),
    clients: f => reportApi.getCustomersReport(f),
    employees: f => reportApi.getEmployeesReport(f),
    services: f => reportApi.getServicesReport(f),
    custom: f => reportApi.getFinancialReport(f),
};

// --- Styles ---
const tableStyles: Record<string, React.CSSProperties> = {
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
        padding: 'var(--space-3) var(--space-4)',
        textAlign: 'start',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        cursor: 'pointer',
        userSelect: 'none',
    },
    td: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-color)',
    },
};

/* ── Chart loading skeleton ── */
function ChartSkeleton() {
    return (
        <div style={{ height: 260, display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
            <Skeleton variant="text" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
        </div>
    );
}

/* ── Table loading skeleton ── */
function TableSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="text" />
            ))}
        </div>
    );
}

export default function DynamicReportPage({ params }: { params: Promise<{ category: string; report: string }> }) {
    const { category, report } = React.use(params);
    const fallbackData = generateData(category, report);
    const { t, lang } = useTranslation();

    const [search, setSearch] = useState('');
    const [sortCol, setSortCol] = useState<number | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [dateRange, setDateRange] = useState('30d');
    const [branch, setBranch] = useState('all');

    /* ── Build API filters ── */
    const filters: ReportFilters = {
        branch_uuid: branch !== 'all' ? branch : undefined,
        group_by: dateRange === '7d' ? 'day' : dateRange === '90d' ? 'month' : 'week',
    };

    /* ── Fetch report data from API ── */
    const apiFetcher = categoryFetcherMap[category] ?? categoryFetcherMap.services;
    const fetchReport = useCallback(
        () => apiFetcher(filters),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [category, report, dateRange, branch]
    );

    const fallbackApiData: ApiReportData = {
        labels: fallbackData.chartData.map(d => d.name),
        datasets: [
            {
                label: fallbackData.title.startsWith('rptDynamic.t.') ? t(fallbackData.title) : fallbackData.title,
                data: fallbackData.chartData.map(d => d.value),
            },
        ],
        summary: {},
    };

    const { data: apiData, loading } = useApiQuery<ApiReportData>(fetchReport, [category, report, dateRange, branch], {
        fallbackData: fallbackApiData,
    });

    /* ── Export mutation ── */
    const { mutate: triggerExport, loading: exporting } = useApiMutation<
        { url: string },
        { type: string; format: 'csv' | 'pdf'; filters?: ReportFilters }
    >(({ type, format, filters: f }) => reportApi.exportReport(type, format, f));

    const handleExportCsv = async () => {
        const result = await triggerExport({ type: `${category}/${report}`, format: 'csv', filters });
        if (result?.url) {
            window.open(result.url, '_blank');
        }
    };

    /* ── Use fallback data structure, overlay API chart data when available ── */
    const data = fallbackData;

    const chartData =
        apiData?.labels && apiData.labels.length > 0
            ? apiData.labels.map((label, i) => ({
                  name: label,
                  value: apiData.datasets?.[0]?.data?.[i] ?? 0,
              }))
            : data.chartData;

    const handleSort = (colIndex: number) => {
        if (sortCol === colIndex) {
            setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortCol(colIndex);
            setSortDir('asc');
        }
    };

    const filteredRows = useMemo(() => {
        let rows = data.rows;

        // Search
        if (search) {
            rows = rows.filter((row: ReportRow) => {
                return (['col1', 'col2', 'col3', 'col4', 'col5'] as const).some(
                    key => row[key] && String(row[key]).toLowerCase().includes(search.toLowerCase())
                );
            });
        }

        // Sort
        if (sortCol !== null) {
            const key = `col${sortCol + 1}` as keyof ReportRow;
            // Pre-compute each row's string + numeric sort value once, so the
            // per-comparison regex doesn't run O(n log n) times during the sort.
            const decorated = rows.map(row => {
                const str = String(row[key] || '');
                return { row, str, numeric: parseFloat(str.replace(/[^0-9.-]/g, '')) };
            });
            decorated.sort((a, b) => {
                // Try numeric sort
                if (!isNaN(a.numeric) && !isNaN(b.numeric)) {
                    return sortDir === 'asc' ? a.numeric - b.numeric : b.numeric - a.numeric;
                }
                return sortDir === 'asc' ? a.str.localeCompare(b.str) : b.str.localeCompare(a.str);
            });
            rows = decorated.map(d => d.row);
        }

        return rows;
    }, [data.rows, search, sortCol, sortDir]);

    // Hoisted once so it isn't re-evaluated inside the per-row render loop.
    const hasActionRows = useMemo(() => data.rows.some(r => r.action), [data.rows]);

    /* Translate a title that may be an i18n key (rptDynamic.t.*) or a slug-derived
       fallback string; pass-through when it is not a known key. */
    const titleText = data.title.startsWith('rptDynamic.t.') ? t(data.title) : data.title;

    /* Map a status DATA identifier to its localized display label (logic keeps the
       raw identifier; only the badge text is localized). */
    const statusLabelMap: Record<string, string> = {
        Completed: 'bk.stCompleted',
        Confirmed: 'bk.stConfirmed',
        Cancelled: 'bk.stCancelled',
        Pending: 'bk.stPending',
        Paid: 'bk.payPaid',
        OK: 'rptDynamic.statusOk',
    };
    const statusLabel = (val: string) => (statusLabelMap[val] ? t(statusLabelMap[val]) : val);

    /* Localized breadcrumb: localized category name › localized (or slug-derived) report title */
    const catKey = `rptDynamic.cat.${category}`;
    const catLabel = translations[catKey] ? t(catKey) : category.charAt(0).toUpperCase() + category.slice(1);
    const breadcrumb = `${catLabel} › ${titleText}`;

    return (
        <div className={styles.page} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Header -- NO duplicate tabs */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <Link
                        href={`/reports/${category}`}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            color: 'var(--color-primary-600)',
                            fontSize: 'var(--text-sm)',
                            textDecoration: 'none',
                            marginBottom: 'var(--space-1)',
                        }}
                    >
                        <ChevronLeft size={16} /> {t('rptDynamic.backToReports')}
                    </Link>
                    <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{titleText}</h1>
                    <div className={styles.subtitle}>{breadcrumb}</div>
                </div>
                <div className={styles.actions}>
                    <Button variant="outline" onClick={handleExportCsv} disabled={exporting}>
                        {exporting ? (
                            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <Download size={16} />
                        )}{' '}
                        {t('rptDynamic.exportCsv')}
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filtersBar}>
                <div className={styles.filterItem}>
                    <Calendar size={16} color="var(--text-tertiary)" />
                    <Select
                        value={dateRange}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value)}
                        options={[
                            { value: '7d', label: t('rptDynamic.last7Days') },
                            { value: '30d', label: t('rptDynamic.last30Days') },
                            { value: 'tm', label: t('rptDynamic.thisMonth') },
                            { value: '90d', label: t('rptDynamic.lastQuarter') },
                        ]}
                        style={{ width: 150 }}
                    />
                </div>
                <div className={styles.filterItem}>
                    <Filter size={16} color="var(--text-tertiary)" />
                    <Select
                        value={branch}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBranch(e.target.value)}
                        options={[
                            { value: 'all', label: t('rptDynamic.allBranches') },
                            { value: 'downtown', label: t('rptDynamic.downtown') },
                            { value: 'mall', label: t('rptDynamic.mall') },
                            { value: 'newcairo', label: t('rptDynamic.newCairo') },
                        ]}
                        style={{ width: 150 }}
                    />
                </div>
                <div className={styles.filterItem} style={{ marginInlineStart: 'auto' }}>
                    <div style={{ position: 'relative' }}>
                        <Search
                            size={14}
                            style={{
                                position: 'absolute',
                                insetInlineStart: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-tertiary)',
                            }}
                        />
                        <input
                            placeholder={t('rptDynamic.searchPlaceholder')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                paddingInlineStart: 'var(--space-8)',
                                height: 38,
                                width: 200,
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--bg-primary)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-primary)',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Chart */}
            {data.chartType !== 'none' && data.chartData && data.chartData.length > 0 && (
                <div className={styles.chartContainer}>
                    {loading ? <ChartSkeleton /> : <ReportChart chartType={data.chartType} chartData={chartData} />}
                </div>
            )}

            {/* Data Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <span className={styles.tableTitle}>{t('rptDynamic.detailedData')}</span>
                    <Badge color="neutral" size="sm">
                        {filteredRows.length} {filteredRows.length === 1 ? t('rptDynamic.row') : t('rptDynamic.rows')}
                    </Badge>
                </div>
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyles.table}>
                            <thead>
                                <tr>
                                    {data.columns.map((col, i) => (
                                        <th
                                            key={i}
                                            style={tableStyles.th as React.CSSProperties}
                                            onClick={() => handleSort(i)}
                                        >
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-1)',
                                                }}
                                            >
                                                {col.startsWith('rptDynamic.col.') ? t(col) : col}
                                                <ArrowUpDown size={12} style={{ opacity: sortCol === i ? 1 : 0.3 }} />
                                            </span>
                                        </th>
                                    ))}
                                    {hasActionRows && (
                                        <th style={tableStyles.th as React.CSSProperties}>
                                            {t('rptDynamic.colAction')}
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={data.columns.length + 1}
                                            style={{
                                                ...tableStyles.td,
                                                textAlign: 'center',
                                                color: 'var(--text-tertiary)',
                                                padding: 'var(--space-6)',
                                            }}
                                        >
                                            {t('rptDynamic.noResults')}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRows.map((row: ReportRow) => (
                                        <tr
                                            key={row.id}
                                            style={{ cursor: row.action ? 'pointer' : 'default' }}
                                            onMouseEnter={e =>
                                                (e.currentTarget.style.background = 'var(--bg-secondary)')
                                            }
                                            onMouseLeave={e => (e.currentTarget.style.background = '')}
                                        >
                                            {data.columns.map((_, ci) => {
                                                const key = `col${ci + 1}` as keyof ReportRow;
                                                const val = row[key] as string | number | boolean | undefined;
                                                const isStatus =
                                                    typeof val === 'string' &&
                                                    [
                                                        'Completed',
                                                        'Confirmed',
                                                        'Cancelled',
                                                        'Pending',
                                                        'Paid',
                                                        'OK',
                                                    ].includes(val);
                                                return (
                                                    <td
                                                        key={ci}
                                                        style={{
                                                            ...tableStyles.td,
                                                            fontWeight: ci === 0 ? 'var(--font-medium)' : 'normal',
                                                        }}
                                                    >
                                                        {isStatus ? (
                                                            <Badge
                                                                color={
                                                                    val === 'Completed' ||
                                                                    val === 'Paid' ||
                                                                    val === 'Confirmed' ||
                                                                    val === 'OK'
                                                                        ? 'success'
                                                                        : val === 'Pending'
                                                                          ? 'info'
                                                                          : 'error'
                                                                }
                                                                size="sm"
                                                            >
                                                                {statusLabel(val as string)}
                                                            </Badge>
                                                        ) : (
                                                            (val ?? '—')
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            {hasActionRows && (
                                                <td style={tableStyles.td}>
                                                    {row.action && (
                                                        <Link
                                                            href={row.action.href}
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: 'var(--space-1)',
                                                                fontSize: 'var(--text-sm)',
                                                                color: 'var(--color-primary-600)',
                                                                fontWeight: 'var(--font-medium)',
                                                                textDecoration: 'none',
                                                            }}
                                                        >
                                                            {row.action.label.startsWith('rptDynamic.act.')
                                                                ? t(row.action.label)
                                                                : row.action.label}{' '}
                                                            <ArrowRight size={14} />
                                                        </Link>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
