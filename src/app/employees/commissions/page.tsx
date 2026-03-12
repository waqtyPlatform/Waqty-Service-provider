'use client';

import React, { useState, useMemo } from 'react';
import { Download, Calculator, Clock, PieChart, Target, Send } from 'lucide-react';
import Link from 'next/link';
import { Select, Input, Button, useToast, EmptyState, Badge } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

interface CommissionData {
    id: string;
    date: string;
    employee: string;
    service: string;
    segment: string;
    count: number;
    revenue: number;
    rate: number;
    commission: number;
}

interface AggregatedSegment {
    id: string;
    employee: string;
    segment: string;
    count: number;
    revenue: number;
    commission: number;
    rate: number | string;
}

interface AggregatedTarget {
    id: string;
    employee: string;
    targetRev: number;
    actualRevenue: number;
    achievedPct: string;
    isEligible: boolean;
    status: string;
    bonusAmount: number;
}

interface AggregatedExtraction extends CommissionData {
    extractionCost: number;
    netRevenue: number;
    newCommission: number;
}

const allCommissionsData: CommissionData[] = [
    { id: '1', date: '2026-03-16', employee: 'Sara Ahmed', service: 'Hair Coloring', segment: 'Hair Care', count: 12, revenue: 4800, rate: 10, commission: 480 },
    { id: '2', date: '2026-03-23', employee: 'Sara Ahmed', service: 'Keratin Treatment', segment: 'Hair Care', count: 5, revenue: 4000, rate: 12, commission: 480 },
    { id: '3', date: '2026-03-14', employee: 'Nora Ali', service: 'HydraFacial', segment: 'Skincare', count: 8, revenue: 4160, rate: 10, commission: 416 },
    { id: '4', date: '2026-03-24', employee: 'Nora Ali', service: 'Classic Facial', segment: 'Skincare', count: 10, revenue: 2800, rate: 8, commission: 224 },
    { id: '5', date: '2026-03-25', employee: 'Layla Hassan', service: 'Swedish Massage', segment: 'Spa', count: 10, revenue: 3500, rate: 10, commission: 350 },
    { id: '6', date: '2026-03-22', employee: 'Hana Youssef', service: 'Gel Manicure', segment: 'Nail Care', count: 18, revenue: 2700, rate: 8, commission: 216 },
    { id: '7', date: '2026-03-14', employee: 'Reem Mohamed', service: 'Deep Tissue', segment: 'Spa', count: 8, revenue: 2400, rate: 12, commission: 288 },
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
    th: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' },
    td: { padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' },
};

export default function CommissionsPage() {
    const { addToast } = useToast();
    const { t, lang } = useTranslation();
    const isRtl = lang === 'ar';

    const [activeTab, setActiveTab] = useState(0);

    const subTabs = [t('commissions.tabServices'), t('commissions.tabSegments'), t('commissions.tabTarget'), t('commissions.tabExtraction')];

    const [employeeFilter, setEmployeeFilter] = useState('All');
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [serviceFilter, setServiceFilter] = useState('All');
    const [segmentFilter, setSegmentFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const [displayedData, setDisplayedData] = useState(allCommissionsData);
    const [isCalculating, setIsCalculating] = useState(false);

    const employees = ['All', ...Array.from(new Set(allCommissionsData.map(d => d.employee)))];
    const services = ['All', ...Array.from(new Set(allCommissionsData.map(d => d.service)))];
    const segments = ['All', ...Array.from(new Set(allCommissionsData.map(d => d.segment)))];
    const statuses = ['All', 'Target Hit', 'Over Target (120%+)', 'Over Target (150%+)', 'Short'];

    const translateStatus = (s: string) => {
        if (s === 'Target Hit') return t('commissions.statusTargetHit');
        if (s === 'Over Target (120%+)') return t('commissions.statusOver120');
        if (s === 'Over Target (150%+)') return t('commissions.statusOver150');
        if (s === 'Short') return t('commissions.statusShort');
        return s;
    };

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
            addToast('success', `${t('commissions.toastCalcPrefix')}${filtered.length}${t('commissions.toastCalcSuffix')}`);
        }, 500);
    };

    const handleExport = () => {
        if (displayedData.length === 0) return addToast('error', t('commissions.toastNoExport'));
        addToast('info', t('commissions.toastExporting'));
    };

    // TAB 0: By Services
    const tab0Data = useMemo(() => {
        return displayedData.filter(item => serviceFilter === 'All' || item.service === serviceFilter);
    }, [displayedData, serviceFilter]);

    const totalRev0 = tab0Data.reduce((acc, row) => acc + row.revenue, 0);
    const totalComm0 = tab0Data.reduce((acc, row) => acc + row.commission, 0);
    const avgRate0 = totalRev0 > 0 ? ((totalComm0 / totalRev0) * 100).toFixed(1) : '0.0';

    // TAB 1: By Segments
    const aggregatedSegments = useMemo(() => {
        const segMap: Record<string, Omit<AggregatedSegment, 'rate'>> = {};
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

    const tab1Data = useMemo(() => {
        return aggregatedSegments.filter((item: AggregatedSegment) => segmentFilter === 'All' || item.segment === segmentFilter);
    }, [aggregatedSegments, segmentFilter]);

    const totalRev1 = tab1Data.reduce((acc: number, row: AggregatedSegment) => acc + row.revenue, 0);
    const totalComm1 = tab1Data.reduce((acc: number, row: AggregatedSegment) => acc + row.commission, 0);
    const avgRate1 = totalRev1 > 0 ? ((totalComm1 / totalRev1) * 100).toFixed(1) : '0.0';

    // TAB 2: By Target
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

    const tab2Data = useMemo(() => {
        return aggregatedTargets.filter((item: AggregatedTarget) => statusFilter === 'All' || item.status === statusFilter);
    }, [aggregatedTargets, statusFilter]);

    const totalRev2 = tab2Data.reduce((acc: number, row: AggregatedTarget) => acc + row.actualRevenue, 0);
    const totalTargetBonus2 = tab2Data.reduce((acc: number, row: AggregatedTarget) => acc + row.bonusAmount, 0);

    // TAB 3: Extraction
    const aggregatedExtraction = useMemo(() => {
        return displayedData.map(curr => {
            const extractionCost = curr.revenue * 0.15;
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

    const tab3Data = useMemo(() => {
        return aggregatedExtraction.filter((item: AggregatedExtraction) => serviceFilter === 'All' || item.service === serviceFilter);
    }, [aggregatedExtraction, serviceFilter]);

    const totalExtGross3 = tab3Data.reduce((acc: number, row: AggregatedExtraction) => acc + row.revenue, 0);
    const totalExtCost3 = tab3Data.reduce((acc: number, row: AggregatedExtraction) => acc + row.extractionCost, 0);
    const totalExtNet3 = tab3Data.reduce((acc: number, row: AggregatedExtraction) => acc + row.netRevenue, 0);
    const totalExtCommission3 = tab3Data.reduce((acc: number, row: AggregatedExtraction) => acc + row.newCommission, 0);

    return (
        <div style={{ ...s.page, direction: isRtl ? 'rtl' : 'ltr' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {t('commissions.title')}
                </div>
                <Link href="/employees/payroll">
                    <Button variant="primary">
                        <Send size={16} className={isRtl ? 'ml-2' : 'mr-2'} />
                        {t('commissions.sendToPayroll')}
                    </Button>
                </Link>
            </div>

            <div style={s.tabBar}>
                {subTabs.map((tSub, i) => (
                    <div
                        key={tSub}
                        style={{ ...s.tab, ...(i === activeTab ? s.tabActive : {}) }}
                        onClick={() => setActiveTab(i)}
                    >
                        {tSub}
                    </div>
                ))}
            </div>

            <div style={s.kpis}>
                {activeTab === 3 ? (
                    <>
                        <div style={s.kpi}>
                            <div style={s.kpiVal}>{totalExtNet3.toLocaleString()}{t('payroll.egp')}</div>
                            <div style={s.kpiLbl}>{t('commissions.kpiNetRev')}</div>
                        </div>
                        <div style={s.kpi}>
                            <div style={{ ...s.kpiVal, color: 'var(--color-primary-600)' }}>{totalExtCommission3.toLocaleString()}{t('payroll.egp')}</div>
                            <div style={s.kpiLbl}>{t('commissions.kpiExtComm')}</div>
                        </div>
                        <div style={s.kpi}>
                            <div style={{ ...s.kpiVal, color: '#ef4444' }}>{totalExtCost3.toLocaleString()}{t('payroll.egp')}</div>
                            <div style={s.kpiLbl}>{t('commissions.kpiMatCost')}</div>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={s.kpi}>
                            <div style={s.kpiVal}>{(activeTab === 0 ? totalRev0 : activeTab === 1 ? totalRev1 : totalRev2).toLocaleString()}{t('payroll.egp')}</div>
                            <div style={s.kpiLbl}>{t('commissions.kpiRevGen')}</div>
                        </div>
                        {activeTab === 2 ? (
                            <div style={s.kpi}>
                                <div style={{ ...s.kpiVal, color: 'var(--color-primary-600)' }}>{totalTargetBonus2.toLocaleString()}{t('payroll.egp')}</div>
                                <div style={s.kpiLbl}>{t('commissions.kpiTargetBonus')}</div>
                            </div>
                        ) : (
                            <div style={s.kpi}>
                                <div style={{ ...s.kpiVal, color: 'var(--color-primary-600)' }}>{(activeTab === 0 ? totalComm0 : totalComm1).toLocaleString()}{t('payroll.egp')}</div>
                                <div style={s.kpiLbl}>{t('commissions.kpiCommPayout')}</div>
                            </div>
                        )}
                        <div style={s.kpi}>
                            <div style={s.kpiVal}>{activeTab === 0 ? avgRate0 : activeTab === 1 ? avgRate1 : '0.0'}%</div>
                            <div style={s.kpiLbl}>{t('commissions.kpiAvgRate')}</div>
                        </div>
                    </>
                )}
            </div>

            <div style={s.toolbar}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: 180 }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>{t('commissions.filterEmp')}</span>
                    <Select
                        value={employeeFilter}
                        onChange={(e) => setEmployeeFilter(e.target.value)}
                        options={employees.map(e => ({ label: e === 'All' ? t('commissions.allEmp') : e, value: e }))}
                        style={{ margin: 0, height: 40 }}
                    />
                </div>

                {(activeTab === 0 || activeTab === 3) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: 180 }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>{t('commissions.filterService')}</span>
                        <Select
                            value={serviceFilter}
                            onChange={(e) => setServiceFilter(e.target.value)}
                            options={services.map(s => ({ label: s === 'All' ? t('commissions.allServices') : s, value: s }))}
                            style={{ margin: 0, height: 40 }}
                        />
                    </div>
                )}
                {activeTab === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: 180 }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>{t('commissions.filterSegment')}</span>
                        <Select
                            value={segmentFilter}
                            onChange={(e) => setSegmentFilter(e.target.value)}
                            options={segments.map(s => ({ label: s === 'All' ? t('commissions.allSegments') : s, value: s }))}
                            style={{ margin: 0, height: 40 }}
                        />
                    </div>
                )}
                {activeTab === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: 180 }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>{t('commissions.filterStatus')}</span>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={statuses.map(s => ({ label: s === 'All' ? t('commissions.allStatuses') : translateStatus(s), value: s }))}
                            style={{ margin: 0, height: 40 }}
                        />
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>{t('commissions.startDate')}</span>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ margin: 0, height: 40, paddingRight: isRtl ? 'var(--space-3)' : undefined }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>{t('commissions.endDate')}</span>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ margin: 0, height: 40, paddingRight: isRtl ? 'var(--space-3)' : undefined }} />
                </div>

                <Button onClick={handleCalculate} disabled={isCalculating} style={{ height: 40 }}>
                    <Calculator size={16} className={isRtl ? 'ml-2' : 'mr-2'} />
                    {isCalculating ? t('commissions.calculating') : t('commissions.calculate')}
                </Button>

                <div style={{ flex: 1 }} />

                <Button variant="outline" onClick={handleExport} style={{ height: 40 }}>
                    <Download size={16} className={isRtl ? 'ml-2' : 'mr-2'} /> {t('commissions.exportReport')}
                </Button>
            </div>

            <div style={s.tableWrapper}>
                {activeTab === 0 ? (
                    tab0Data.length > 0 ? (
                        <table style={s.table as React.CSSProperties}>
                            <thead>
                                <tr>
                                    {[t('commissions.colDate'), t('commissions.colEmp'), t('commissions.colService'), t('commissions.colCount'), t('commissions.colRev'), t('commissions.colRate'), t('commissions.colComm')].map(h => (
                                        <th key={h} style={{ ...s.th, textAlign: isRtl ? 'right' : 'left' } as React.CSSProperties}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tab0Data.map((row) => (
                                    <tr key={row.id} className="hoverRow">
                                        <td style={s.td}>{row.date}</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.employee}</td>
                                        <td style={s.td}>{row.service}</td>
                                        <td style={s.td}>{row.count}</td>
                                        <td style={s.td}>{row.revenue.toLocaleString()}{t('payroll.egp')}</td>
                                        <td style={s.td}>{row.rate}%</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>
                                            {row.commission.toLocaleString()}{t('payroll.egp')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: 'var(--bg-secondary)' }}>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties} colSpan={4}>{t('commissions.aggFiltered')}</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties}>{totalRev0.toLocaleString()}{t('payroll.egp')}</td>
                                    <td style={s.td}></td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>{totalComm0.toLocaleString()}{t('payroll.egp')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <EmptyState
                            icon={<Clock size={32} color="var(--text-tertiary)" />}
                            title={t('commissions.emptyCommTitle')}
                            description={t('commissions.emptyCommDesc')}
                        />
                    )
                ) : activeTab === 1 ? (
                    tab1Data.length > 0 ? (
                        <table style={s.table as React.CSSProperties}>
                            <thead>
                                <tr>
                                    {[t('commissions.colEmp'), t('commissions.colBizSeg'), t('commissions.colTotalServ'), t('commissions.colSegRev'), t('commissions.colAvgRate'), t('commissions.colSegComm')].map(h => (
                                        <th key={h} style={{ ...s.th, textAlign: isRtl ? 'right' : 'left' } as React.CSSProperties}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tab1Data.map((row: AggregatedSegment) => (
                                    <tr key={row.id} className="hoverRow">
                                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.employee}</td>
                                        <td style={{ ...s.td, color: 'var(--color-primary-600)', fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.segment}</td>
                                        <td style={s.td}>{row.count}</td>
                                        <td style={s.td}>{row.revenue.toLocaleString()}{t('payroll.egp')}</td>
                                        <td style={s.td}>{row.rate}%</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>
                                            {row.commission.toLocaleString()}{t('payroll.egp')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: 'var(--bg-secondary)' }}>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties} colSpan={3}>{t('commissions.aggSubSeg')}</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties}>{totalRev1.toLocaleString()}{t('payroll.egp')}</td>
                                    <td style={s.td}></td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>{totalComm1.toLocaleString()}{t('payroll.egp')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <EmptyState
                            icon={<PieChart size={32} color="var(--text-tertiary)" />}
                            title={t('commissions.emptySegTitle')}
                            description={t('commissions.emptySegDesc')}
                        />
                    )
                ) : activeTab === 2 ? (
                    tab2Data.length > 0 ? (
                        <table style={s.table as React.CSSProperties}>
                            <thead>
                                <tr>
                                    {[t('commissions.colEmp'), t('commissions.colTargetRev'), t('commissions.colActualRev'), t('commissions.colAchieved'), t('commissions.colStatus'), t('commissions.colTargetBonus')].map(h => (
                                        <th key={h} style={{ ...s.th, textAlign: isRtl ? 'right' : 'left' } as React.CSSProperties}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tab2Data.map((row: AggregatedTarget) => (
                                    <tr key={row.id} className="hoverRow">
                                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.employee}</td>
                                        <td style={s.td}>{row.targetRev.toLocaleString()}{t('payroll.egp')}</td>
                                        <td style={s.td}>{row.actualRevenue.toLocaleString()}{t('payroll.egp')}</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties}>{row.achievedPct}%</td>
                                        <td style={s.td}>
                                            <Badge color={row.isEligible ? 'success' : 'neutral'}>
                                                {translateStatus(row.status)}
                                            </Badge>
                                        </td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: row.isEligible ? 'var(--color-primary-600)' : 'var(--text-tertiary)' } as React.CSSProperties}>
                                            {row.bonusAmount.toLocaleString()}{t('payroll.egp')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: 'var(--bg-secondary)' }}>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties} colSpan={2}>{t('commissions.aggPortfolio')}</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties}>{totalRev2.toLocaleString()}{t('payroll.egp')}</td>
                                    <td style={s.td} colSpan={2}></td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>{totalTargetBonus2.toLocaleString()}{t('payroll.egp')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <EmptyState
                            icon={<Target size={32} color="var(--text-tertiary)" />}
                            title={t('commissions.emptyTargetTitle')}
                            description={t('commissions.emptyTargetDesc')}
                        />
                    )
                ) : activeTab === 3 ? (
                    tab3Data.length > 0 ? (
                        <table style={s.table as React.CSSProperties}>
                            <thead>
                                <tr>
                                    {[t('commissions.colDate'), t('commissions.colEmp'), t('commissions.colService'), t('commissions.colGrossRev'), t('commissions.colMatExt'), t('commissions.colNetRev'), t('commissions.colRate'), t('commissions.colComm')].map(h => (
                                        <th key={h} style={{ ...s.th, textAlign: isRtl ? 'right' : 'left' } as React.CSSProperties}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tab3Data.map((row: AggregatedExtraction) => (
                                    <tr key={row.id} className="hoverRow">
                                        <td style={s.td}>{row.date}</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.employee}</td>
                                        <td style={s.td}>{row.service}</td>
                                        <td style={s.td}>{row.revenue.toLocaleString()}{t('payroll.egp')}</td>
                                        <td style={{ ...s.td, color: '#ef4444' }}>- {row.extractionCost.toLocaleString()}{t('payroll.egp')}</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.netRevenue.toLocaleString()}{t('payroll.egp')}</td>
                                        <td style={s.td}>{row.rate}%</td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>
                                            {row.newCommission.toLocaleString()}{t('payroll.egp')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: 'var(--bg-secondary)' }}>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties} colSpan={3}>{t('commissions.aggNetPortfolio')}</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties}>{totalExtGross3.toLocaleString()}{t('payroll.egp')}</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: '#ef4444' } as React.CSSProperties}>- {totalExtCost3.toLocaleString()}{t('payroll.egp')}</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)' } as React.CSSProperties}>{totalExtNet3.toLocaleString()}{t('payroll.egp')}</td>
                                    <td style={s.td}></td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' } as React.CSSProperties}>{totalExtCommission3.toLocaleString()}{t('payroll.egp')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <EmptyState
                            icon={<Calculator size={32} color="var(--text-tertiary)" />}
                            title={t('commissions.emptyExtTitle')}
                            description={t('commissions.emptyExtDesc')}
                        />
                    )
                ) : null}
            </div>

            <style>{`
                .hoverRow:hover { background-color: var(--bg-secondary); }
                .hoverRow:last-child td { border-bottom: none !important; }
            `}</style>
        </div>
    );
}
