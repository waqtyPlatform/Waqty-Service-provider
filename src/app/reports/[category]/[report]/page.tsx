'use client';

import React, { useState } from 'react';
import {
    BarChart3,
    Calendar,
    Download,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Search
} from 'lucide-react';
import {
    Button,
    Select,
    Input,
    EmptyState,
    Badge
} from '@/components/ui';
import styles from './page.module.css';

// Mock Data Generators
const generateData = (category: string, report: string) => {
    // Basic mock logic based on report type
    if (category === 'sales') {
        return {
            title: 'Sales Performance',
            chartType: 'bar',
            columns: ['Date', 'Service Sales', 'Product Sales', 'Total Revenue', 'Growth'],
            rows: [
                { id: 1, col1: 'Feb 18', col2: '3,200', col3: '450', col4: '3,650', col5: '+12%' },
                { id: 2, col1: 'Feb 17', col2: '2,800', col3: '200', col4: '3,000', col5: '-5%' },
                { id: 3, col1: 'Feb 16', col2: '4,100', col3: '800', col4: '4,900', col5: '+22%' },
                { id: 4, col1: 'Feb 15', col2: '3,500', col3: '300', col4: '3,800', col5: '+8%' },
                { id: 5, col1: 'Feb 14', col2: '5,200', col3: '900', col4: '6,100', col5: '+30%' },
            ]
        };
    }
    if (category === 'employees') {
        return {
            title: 'Employee Performance',
            chartType: 'line',
            columns: ['Employee', 'Services', 'Revenue', 'Commission', 'Rating'],
            rows: [
                { id: 1, col1: 'Sarah Ahmed', col2: '24', col3: '12,400', col4: '1,860', col5: '4.9 ⭐' },
                { id: 2, col1: 'Nora Ali', col2: '18', col3: '8,200', col4: '1,230', col5: '4.7 ⭐' },
                { id: 3, col1: 'Mona Zein', col2: '31', col3: '15,600', col4: '2,340', col5: '5.0 ⭐' },
            ]
        };
    }
    // Default fallback
    return {
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Report`,
        chartType: 'none',
        columns: ['ID', 'Date', 'Description', 'Amount', 'Status'],
        rows: [
            { id: 1, col1: '#001', col2: 'Feb 18', col3: 'Sample Data', col4: '500', col5: 'Active' },
            { id: 2, col1: '#002', col2: 'Feb 17', col3: 'Sample Data', col4: '750', col5: 'Pending' },
        ]
    };
};

export default function DynamicReportPage({ params }: { params: { category: string; report: string } }) {
    const { category, report } = params;
    const data = generateData(category, report);

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <div className={styles.subtitle}>
                        Reports &gt; {category} &gt; {report.replace(/-/g, ' ')}
                    </div>
                    <h1>
                        {data.title}
                        <Badge color="primary">Generated Just Now</Badge>
                    </h1>
                </div>
                <div className={styles.actions}>
                    <Button variant="outline"><Filter size={16} /> Filters</Button>
                    <Button><Download size={16} /> Export PDF</Button>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filtersBar}>
                <div className={styles.filterItem}>
                    <Calendar size={16} color="var(--text-tertiary)" />
                    <Select
                        options={[{ value: '7d', label: 'Last 7 Days' }, { value: '30d', label: 'Last 30 Days' }]}
                        style={{ width: 140 }}
                    />
                </div>
                <div className={styles.filterItem}>
                    <Filter size={16} color="var(--text-tertiary)" />
                    <Select
                        options={[{ value: 'all', label: 'All Branches' }, { value: 'downtown', label: 'Downtown' }]}
                        style={{ width: 140 }}
                    />
                </div>
                <div className={styles.filterItem} style={{ marginLeft: 'auto' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: 8, top: 10, color: 'var(--text-tertiary)' }} />
                        <Input placeholder="Search..." style={{ paddingLeft: 28, width: 200 }} />
                    </div>
                </div>
            </div>

            {/* Chart */}
            {data.chartType !== 'none' && (
                <div className={styles.chartContainer}>
                    <div className={styles.chartPlaceholder}>
                        <BarChart3 size={48} color="var(--color-primary-300)" />
                        <div style={{ fontWeight: 'var(--font-medium)', color: 'var(--color-primary-600)' }}>
                            {data.chartType === 'bar' ? 'Bar Chart Visualization' : 'Line Chart Visualization'}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}>
                            Interactive charts will be implemented with Recharts library.
                        </div>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <span className={styles.tableTitle}>Detailed Data</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {data.columns.map((col, i) => (
                                    <th key={i}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.rows.map((row: any, i) => (
                                <tr key={i}>
                                    {Object.values(row).map((val: any, j) => (
                                        <td key={j} style={{ fontWeight: j === 0 || j === 3 ? 'var(--font-bold)' : 'normal' }}>
                                            {val}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
