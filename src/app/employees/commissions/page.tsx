'use client';

import React, { useState, useMemo } from 'react';
import { Download, Calculator, Clock, PieChart, Target } from 'lucide-react';
import { Select, Input, Button, useToast, EmptyState, Badge } from '@/components/ui';

const subTabs = ['By Services', 'By Segments', 'By Target', 'Extraction'];

const allCommissionsData = [
    { id: '1', date: '2026-02-17', employee: 'Sara Ahmed', service: 'Hair Coloring', segment: 'Hair Care', count: 12, revenue: 4800, rate: 10, commission: 480 },
    { id: '2', date: '2026-02-17', employee: 'Sara Ahmed', service: 'Keratin Treatment', segment: 'Hair Care', count: 5, revenue: 4000, rate: 12, commission: 480 },
    { id: '3', date: '2026-02-16', employee: 'Nora Ali', service: 'HydraFacial', segment: 'Skincare', count: 8, revenue: 4160, rate: 10, commission: 416 },
    { id: '4', date: '2026-02-16', employee: 'Nora Ali', service: 'Classic Facial', segment: 'Skincare', count: 10, revenue: 2800, rate: 8, commission: 224 },
    { id: '5', date: '2026-02-15', employee: 'Layla Hassan', service: 'Swedish Massage', segment: 'Spa', count: 10, revenue: 3500, rate: 10, commission: 350 },
    { id: '6', date: '2026-02-14', employee: 'Hana Youssef', service: 'Gel Manicure', segment: 'Nail Care', count: 18, revenue: 2700, rate: 8, commission: 216 },
    { id: '7', date: '2026-02-10', employee: 'Reem Mohamed', service: 'Deep Tissue', segment: 'Spa', count: 8, revenue: 2400, rate: 12, commission: 288 },
];

const targetDefinitions: Record<string, { targetRev: number, targetBonus: number }> = {
    'Sara Ahmed': { targetRev: 10000, targetBonus: 1000 },
    'Nora Ali': { targetRev: 6000, targetBonus: 600 },
    'Layla Hassan': { targetRev: 4000, targetBonus: 400 },
    'Hana Youssef': { targetRev: 3000, targetBonus: 300 },
    'Reem Mohamed': { targetRev: 2000, targetBonus: 200 },
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-8)' },
    tabBar: { display: 'flex', gap: 'var(--space-2)', borderBottom: '2px solid var(--border-color)', paddingBottom: 'var(--space-1)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-5)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-3px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' },
    kpi: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' },
    kpiVal: { fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 'var(--font-medium)' },
    toolbar: { display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)', flexWrap: 'wrap', background: 'var(--bg-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' },
    tableWrapper: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    table: { width: '100%', minWidth: 600, borderCollapse: 'collapse' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' },
    td: { padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' },
};

export default function CommissionsPage() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState(0);

    const [employeeFilter, setEmployeeFilter] = useState('All');
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [displayedData, setDisplayedData] = useState(allCommissionsData);
    const [isCalculating, setIsCalculating] = useState(false);

    const employees = ['All', ...Array.from(new Set(allCommissionsData.map(d => d.employee)))];

    const handleCalculate = () => {
        setIsCalculating(true);
        setTimeout(() => {
            const filtered = allCommissionsData.filter(item => {
                const matchEmployee = employeeFilter === 'All' || item.employee === employeeFilter;
                const matchDate = (!startDate || item.date >= startDate) && (!endDate || item.date <= endDate);
                return matchEmployee && matchDate;
            });
            setDisplayedData(filtered);
            setIsCalculating(false);
            addToast('success', `Calculated commissions for ${filtered.length} records.`);
        }, 500);
    };

    const handleExport = () => {
        if (displayedData.length === 0) return addToast('error', 'No data to export.');
        addToast('info', 'Exporting commission report as CSV...');
    };

    const totalComm = displayedData.reduce((acc, row) => acc + row.commission, 0);
    const totalRev = displayedData.reduce((acc, row) => acc + row.revenue, 0);
    const avgRate = totalRev > 0 ? ((totalComm / totalRev) * 100).toFixed(1) : '0.0';

    const aggregatedSegments = useMemo(() => {
        const segMap: Record<string, any> = {};
        displayedData.forEach(curr => {
            const key = `${curr.employee}-${curr.segment}`;
            if (!segMap[key]) {
                segMap[key] = { id: key, employee: curr.employee, segment: curr.segment, count: 0, revenue: 0, commission: 0 };
            }
            segMap[key].count += curr.count;
            segMap[key].revenue += curr.revenue;
            segMap[key].commission += curr.commission;
        });
        
        return Object.values(segMap).map(seg => ({
            ...seg,
            rate: seg.revenue > 0 ? ((seg.commission / seg.revenue) * 100).toFixed(1) : 0
        }));
    }, [displayedData]);

    const aggregatedTargets = useMemo(() => {
        const empMap: Record<string, number> = {};
        displayedData.forEach(curr => {
            empMap[curr.employee] = (empMap[curr.employee] || 0) + curr.revenue;
        });
        
        return Object.entries(empMap).map(([employee, actualRevenue]) => {
            const def = targetDefinitions[employee] || { targetRev: 5000, targetBonus: 500 }; 
            const achievedPct = (actualRevenue / def.targetRev) * 100;
            
            let multiplier = 0;
            let status = 'Short';

            if (achievedPct >= 150) {
                multiplier = 2.0;
                status = 'Over Target (150%+)';
            } else if (achievedPct >= 120) {
                multiplier = 1.5;
                status = 'Over Target (120%+)';
            } else if (achievedPct >= 100) {
                multiplier = 1.0;
                status = 'Target Hit';
            }

            return {
                id: employee,
                employee,
                targetRev: def.targetRev,
                actualRevenue,
                achievedPct: achievedPct.toFixed(1),
                isEligible: multiplier > 0,
                status,
                bonusAmount: def.targetBonus * multiplier,
            };
        });
    }, [displayedData]);

    const totalTargetBonus = aggregatedTargets.reduce((acc, row) => acc + row.bonusAmount, 0);

    // Extraction Flow Logic (Deducting Material Cost before applying commission)
    const aggregatedExtraction = useMemo(() => {
        return displayedData.map(curr => {
            const extractionCost = curr.revenue * 0.15; // Simulate a 15% flat extraction for products/materials
            const netRevenue = curr.revenue - extractionCost;
            const newCommission = netRevenue * (curr.rate / 100);

            return {
                ...curr,
                extractionCost,
                netRevenue,
                newCommission
            };
        });
    }, [displayedData]);

    const totalExtGross = aggregatedExtraction.reduce((acc, row) => acc + row.revenue, 0);
    const totalExtCost = aggregatedExtraction.reduce((acc, row) => acc + row.extractionCost, 0);
    const totalExtNet = aggregatedExtraction.reduce((acc, row) => acc + row.netRevenue, 0);
    const totalExtCommission = aggregatedExtraction.reduce((acc, row) => acc + row.newCommission, 0);


    return (
        <div style={s.page}>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                Commission Calculator
            </div>

            <div style={s.tabBar}>
                {subTabs.map((t, i) => (
                    <div 
                        key={t} 
                        style={{ ...s.tab, ...(i === activeTab ? s.tabActive : {}) }} 
                        onClick={() => setActiveTab(i)}
                    >
                        {t}
                    </div>
                ))}
            </div>

            <div style={s.kpis}>
                {activeTab === 3 ? (
                    <>
                         <div style={s.kpi}>
                            <div style={s.kpiVal}>{totalExtNet.toLocaleString()} EGP</div>
                            <div style={s.kpiLbl}>Total Net Revenue</div>
                        </div>
                        <div style={s.kpi}>
                            <div style={{ ...s.kpiVal, color: 'var(--color-primary-600)' }}>{totalExtCommission.toLocaleString()} EGP</div>
                            <div style={s.kpiLbl}>Extracted Commissions</div>
                        </div>
                        <div style={s.kpi}>
                            <div style={{ ...s.kpiVal, color: '#ef4444' }}>{totalExtCost.toLocaleString()} EGP</div>
                            <div style={s.kpiLbl}>Total Material Cost (15%)</div>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={s.kpi}>
                            <div style={s.kpiVal}>{totalRev.toLocaleString()} EGP</div>
                            <div style={s.kpiLbl}>Total Revenue Generated</div>
                        </div>
                        {activeTab === 2 ? (
                            <div style={s.kpi}>
                                <div style={{ ...s.kpiVal, color: 'var(--color-primary-600)' }}>{totalTargetBonus.toLocaleString()} EGP</div>
                                <div style={s.kpiLbl}>Total Target Bonuses</div>
                            </div>
                        ) : (
                            <div style={s.kpi}>
                                <div style={{ ...s.kpiVal, color: 'var(--color-primary-600)' }}>{totalComm.toLocaleString()} EGP</div>
                                <div style={s.kpiLbl}>Total Commissions Payout</div>
                            </div>
                        )}
                        <div style={s.kpi}>
                            <div style={s.kpiVal}>{avgRate}%</div>
                            <div style={s.kpiLbl}>Average Commission Rate</div>
                        </div>
                    </>
                )}
            </div>

            <div style={s.toolbar}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: 180 }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>Employee Filter</span>
                    <Select 
                        value={employeeFilter} 
                        onChange={(e) => setEmployeeFilter(e.target.value)}
                        options={employees.map(e => ({ label: e === 'All' ? 'All Employees' : e, value: e }))}
                        style={{ margin: 0, height: 40 }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>Start Date</span>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ margin: 0, height: 40 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>End Date</span>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ margin: 0, height: 40 }} />
                </div>
                
                <Button onClick={handleCalculate} disabled={isCalculating} style={{ height: 40 }}>
                    <Calculator size={16} style={{ marginRight: 8 }} />
                    {isCalculating ? 'Calculating...' : 'Calculate'}
                </Button>
                
                <div style={{ flex: 1 }} />
                
                <Button variant="outline" onClick={handleExport} style={{ height: 40 }}>
                    <Download size={16} style={{ marginRight: 8 }} /> Export Report
                </Button>
            </div>

            <div style={s.tableWrapper}>
                {activeTab === 0 ? (
                    displayedData.length > 0 ? (
                        <table style={s.table as React.CSSProperties}>
                            <thead>
                                <tr>
                                    {['Date', 'Employee', 'Service', 'Count', 'Revenue', 'Rate', 'Commission'].map(h => (
                                        <th key={h} style={s.th as React.CSSProperties}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {displayedData.map((row) => (
                                    <tr key={row.id} className="hoverRow">
                                        <td style={s.td}>{row.date}</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.employee}</td>
                                        <td style={s.td}>{row.service}</td>
                                        <td style={s.td}>{row.count}</td>
                                        <td style={s.td}>{row.revenue.toLocaleString()} EGP</td>
                                        <td style={s.td}>{row.rate}%</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>
                                            {row.commission.toLocaleString()} EGP
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: 'var(--bg-secondary)' }}>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties} colSpan={4}>Total Aggregate</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties}>{totalRev.toLocaleString()} EGP</td>
                                    <td style={s.td}></td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>{totalComm.toLocaleString()} EGP</td>
                                </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <EmptyState 
                            icon={<Clock size={32} color="var(--text-tertiary)" />} 
                            title="No commissions found" 
                            description="Adjust your employee or date filters to see results." 
                        />
                    )
                ) : activeTab === 1 ? (
                    aggregatedSegments.length > 0 ? (
                        <table style={s.table as React.CSSProperties}>
                            <thead>
                                <tr>
                                    {['Employee', 'Business Segment', 'Total Services', 'Segment Revenue', 'Avg Rate', 'Segment Commission'].map(h => (
                                        <th key={h} style={s.th as React.CSSProperties}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {aggregatedSegments.map((row: any) => (
                                    <tr key={row.id} className="hoverRow">
                                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.employee}</td>
                                        <td style={{ ...s.td, color: 'var(--color-primary-600)', fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.segment}</td>
                                        <td style={s.td}>{row.count}</td>
                                        <td style={s.td}>{row.revenue.toLocaleString()} EGP</td>
                                        <td style={s.td}>{row.rate}%</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>
                                            {row.commission.toLocaleString()} EGP
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: 'var(--bg-secondary)' }}>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties} colSpan={3}>Total Sub-Segments</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties}>{totalRev.toLocaleString()} EGP</td>
                                    <td style={s.td}></td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>{totalComm.toLocaleString()} EGP</td>
                                </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <EmptyState 
                            icon={<PieChart size={32} color="var(--text-tertiary)" />} 
                            title="No segments found" 
                            description="Adjust your employee or date filters to see segment results." 
                        />
                    )
                ) : activeTab === 2 ? (
                     aggregatedTargets.length > 0 ? (
                        <table style={s.table as React.CSSProperties}>
                            <thead>
                                <tr>
                                    {['Employee', 'Target Revenue', 'Actual Revenue', 'Achieved', 'Status', 'Target Bonus'].map(h => (
                                        <th key={h} style={s.th as React.CSSProperties}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {aggregatedTargets.map((row: any) => (
                                    <tr key={row.id} className="hoverRow">
                                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.employee}</td>
                                        <td style={s.td}>{row.targetRev.toLocaleString()} EGP</td>
                                        <td style={s.td}>{row.actualRevenue.toLocaleString()} EGP</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties}>{row.achievedPct}%</td>
                                        <td style={s.td}>
                                            <Badge variant={row.isEligible ? 'success' : 'default'}>
                                                {row.status}
                                            </Badge>
                                        </td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: row.isEligible ? 'var(--color-primary-600)' : 'var(--text-tertiary)' } as React.CSSProperties}>
                                            {row.bonusAmount.toLocaleString()} EGP
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: 'var(--bg-secondary)' }}>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties} colSpan={2}>Aggregate Portfolio</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties}>{totalRev.toLocaleString()} EGP</td>
                                    <td style={s.td} colSpan={2}></td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>{totalTargetBonus.toLocaleString()} EGP</td>
                                </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <EmptyState 
                            icon={<Target size={32} color="var(--text-tertiary)" />} 
                            title="No target data found" 
                            description="Adjust your employee or date filters to visualize target progression." 
                        />
                    )
                ) : activeTab === 3 ? (
                    aggregatedExtraction.length > 0 ? (
                        <table style={s.table as React.CSSProperties}>
                            <thead>
                                <tr>
                                    {['Date', 'Employee', 'Service', 'Gross Revenue', 'Material Extraction', 'Net Revenue', 'Rate', 'Commission'].map(h => (
                                        <th key={h} style={s.th as React.CSSProperties}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {aggregatedExtraction.map((row: any) => (
                                    <tr key={row.id} className="hoverRow">
                                        <td style={s.td}>{row.date}</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.employee}</td>
                                        <td style={s.td}>{row.service}</td>
                                        <td style={s.td}>{row.revenue.toLocaleString()} EGP</td>
                                        <td style={{ ...s.td, color: '#ef4444' }}>- {row.extractionCost.toLocaleString()} EGP</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.netRevenue.toLocaleString()} EGP</td>
                                        <td style={s.td}>{row.rate}%</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>
                                            {row.newCommission.toLocaleString()} EGP
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: 'var(--bg-secondary)' }}>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties} colSpan={3}>Aggregate Net Portfolio</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties}>{totalExtGross.toLocaleString()} EGP</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: '#ef4444' } as React.CSSProperties}>- {totalExtCost.toLocaleString()} EGP</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties}>{totalExtNet.toLocaleString()} EGP</td>
                                    <td style={s.td}></td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>{totalExtCommission.toLocaleString()} EGP</td>
                                </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <EmptyState 
                            icon={<Calculator size={32} color="var(--text-tertiary)" />} 
                            title="No extraction data found" 
                            description="Adjust your employee or date filters to visualize extraction." 
                        />
                    )
                ) : (
                    <EmptyState 
                        icon={<Calculator size={32} color="var(--text-tertiary)" />} 
                        title={`${subTabs[activeTab]} calculations coming soon`} 
                        description="This analytic report is currently under development." 
                    />
                )}
            </div>

            <style>{`
                .hoverRow:hover { background-color: var(--bg-secondary); }
                .hoverRow:last-child td { border-bottom: none !important; }
            `}</style>
        </div>
    );
}
