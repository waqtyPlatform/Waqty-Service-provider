'use client';

import React, { useState, useMemo } from 'react';
import {
    Wallet, DollarSign, Award, Gift, MinusCircle, CheckCircle, Clock,
    Search, Filter, Calendar, Download, CreditCard, Banknote,
    FileText, Eye, X, User, Building, Hash, ChevronRight,
    Plus, Edit, Trash2, Star, Smartphone,
} from 'lucide-react';
import { Button, Select, Input, Badge, Modal, useToast, SlideOver } from '@/components/ui';

/* ─── Mock Data ──────────────────────────────────────────────────── */

interface PaymentMethod {
    id: string;
    type: 'Bank Transfer' | 'Cash' | 'Mobile Wallet' | 'Check';
    label: string;
    details: string;
    isDefault: boolean;
}

const employees = [
    { id: 'EMP-001', name: 'Sara Ahmed', dept: 'Hair Care', position: 'Senior Stylist', baseSalary: 8000, commission: 2600, bonus: 1000, deductions: 500 },
    { id: 'EMP-002', name: 'Nora Ali', dept: 'Skincare', position: 'Aesthetician', baseSalary: 7000, commission: 1880, bonus: 600, deductions: 450 },
    { id: 'EMP-003', name: 'Mona Zein', dept: 'Skincare', position: 'Laser Tech', baseSalary: 7500, commission: 1650, bonus: 0, deductions: 480 },
    { id: 'EMP-004', name: 'Layla Hassan', dept: 'Nails', position: 'Nail Artist', baseSalary: 5500, commission: 920, bonus: 0, deductions: 350 },
    { id: 'EMP-005', name: 'Reem Mohamed', dept: 'Spa', position: 'Therapist', baseSalary: 6000, commission: 720, bonus: 300, deductions: 380 },
    { id: 'EMP-006', name: 'Huda Farouk', dept: 'Hair Care', position: 'Colorist', baseSalary: 6500, commission: 1100, bonus: 0, deductions: 420 },
    { id: 'EMP-007', name: 'Dina Samir', dept: 'Reception', position: 'Front Desk', baseSalary: 4500, commission: 0, bonus: 200, deductions: 280 },
];

const initialPaymentMethods: Record<string, PaymentMethod[]> = {
    'EMP-001': [{ id: 'pm-1', type: 'Bank Transfer', label: 'CIB Savings', details: '****4521', isDefault: true }],
    'EMP-002': [{ id: 'pm-2', type: 'Bank Transfer', label: 'QNB Current', details: '****7832', isDefault: true }],
    'EMP-003': [{ id: 'pm-3', type: 'Bank Transfer', label: 'Banque Misr', details: '****1290', isDefault: true }],
    'EMP-004': [{ id: 'pm-4', type: 'Bank Transfer', label: 'NBE Account', details: '****6743', isDefault: true }],
    'EMP-005': [{ id: 'pm-5', type: 'Bank Transfer', label: 'CIB Account', details: '****9102', isDefault: true }],
    'EMP-006': [{ id: 'pm-6', type: 'Bank Transfer', label: 'QNB Account', details: '****3456', isDefault: true }],
    'EMP-007': [{ id: 'pm-7', type: 'Cash', label: 'Cash', details: 'In-branch pickup', isDefault: true }],
};

const initialPayrollStatus: Record<string, 'Pending' | 'Paid'> = {};
employees.forEach(e => { initialPayrollStatus[e.id] = 'Pending'; });

const initialPayoutHistory = [
    { id: 'PO-1001', date: '2026-01-28', employee: 'Sara Ahmed', type: 'Salary', amount: 8000, method: 'Bank Transfer', ref: 'TRX-JAN-001', status: 'Completed' },
    { id: 'PO-1002', date: '2026-01-28', employee: 'Sara Ahmed', type: 'Commission', amount: 2100, method: 'Bank Transfer', ref: 'TRX-JAN-002', status: 'Completed' },
    { id: 'PO-1003', date: '2026-01-28', employee: 'Nora Ali', type: 'Salary', amount: 7000, method: 'Bank Transfer', ref: 'TRX-JAN-003', status: 'Completed' },
    { id: 'PO-1004', date: '2026-01-28', employee: 'Nora Ali', type: 'Commission', amount: 1500, method: 'Bank Transfer', ref: 'TRX-JAN-004', status: 'Completed' },
    { id: 'PO-1005', date: '2026-01-28', employee: 'Mona Zein', type: 'Salary', amount: 7500, method: 'Bank Transfer', ref: 'TRX-JAN-005', status: 'Completed' },
    { id: 'PO-1006', date: '2026-01-28', employee: 'Layla Hassan', type: 'Salary', amount: 5500, method: 'Cash', ref: 'TRX-JAN-006', status: 'Completed' },
    { id: 'PO-1007', date: '2025-12-28', employee: 'Sara Ahmed', type: 'Bonus', amount: 500, method: 'Bank Transfer', ref: 'TRX-DEC-001', status: 'Completed' },
    { id: 'PO-1008', date: '2025-12-28', employee: 'Reem Mohamed', type: 'Salary', amount: 6000, method: 'Bank Transfer', ref: 'TRX-DEC-002', status: 'Completed' },
];

/* ─── Styles ─────────────────────────────────────────────────────── */

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-8)' },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpiCard: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' },
    kpiIcon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    kpiVal: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 },
    toolbar: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', background: 'var(--bg-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' },
    tableWrapper: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    table: { width: '100%', minWidth: 800, borderCollapse: 'collapse' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', background: 'var(--bg-secondary)', padding: 4, borderRadius: 'var(--radius-lg)', width: 'fit-content' },
    tab: { padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', cursor: 'pointer', border: 'none', transition: 'all 0.2s' },
    slipSection: { marginBottom: 'var(--space-5)' },
    slipLabel: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' },
    slipRow: { display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-color)' },
    slipTotal: { display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', borderTop: '2px solid var(--text-primary)', marginTop: 'var(--space-3)' },
};

/* ─── Component ──────────────────────────────────────────────────── */

export default function PayrollPage() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'summary' | 'history' | 'slips'>('summary');

    // Summary state
    const [month, setMonth] = useState('2026-02');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchSummary, setSearchSummary] = useState('');
    const [payrollStatus, setPayrollStatus] = useState<Record<string, 'Pending' | 'Paid'>>(initialPayrollStatus);
    const [confirmPay, setConfirmPay] = useState<string | null>(null);

    // History state
    const [historySearch, setHistorySearch] = useState('');
    const [historyType, setHistoryType] = useState('all');
    const [payoutHistory, setPayoutHistory] = useState(initialPayoutHistory);

    // Slips state
    const [selectedSlip, setSelectedSlip] = useState<typeof employees[0] | null>(null);

    // Payment Methods state
    const [paymentMethods, setPaymentMethods] = useState<Record<string, PaymentMethod[]>>(initialPaymentMethods);
    const [pmEmpId, setPmEmpId] = useState<string | null>(null);
    const [pmEditing, setPmEditing] = useState<PaymentMethod | null>(null);
    const [pmForm, setPmForm] = useState({ type: 'Bank Transfer' as PaymentMethod['type'], label: '', details: '' });
    const [pmShowForm, setPmShowForm] = useState(false);

    const getDefaultPm = (empId: string) => {
        const methods = paymentMethods[empId] || [];
        return methods.find(m => m.isDefault) || methods[0] || null;
    };

    const handleAddPm = (empId: string) => {
        const newPm: PaymentMethod = { id: `pm-${Date.now()}`, type: pmForm.type, label: pmForm.label || pmForm.type, details: pmForm.details, isDefault: !(paymentMethods[empId]?.length) };
        setPaymentMethods(prev => ({ ...prev, [empId]: [...(prev[empId] || []), newPm] }));
        setPmForm({ type: 'Bank Transfer', label: '', details: '' });
        setPmShowForm(false);
        addToast('success', 'Payment method added');
    };

    const handleEditPm = (empId: string) => {
        if (!pmEditing) return;
        setPaymentMethods(prev => ({ ...prev, [empId]: (prev[empId] || []).map(m => m.id === pmEditing.id ? { ...m, type: pmForm.type, label: pmForm.label || pmForm.type, details: pmForm.details } : m) }));
        setPmEditing(null);
        setPmShowForm(false);
        setPmForm({ type: 'Bank Transfer', label: '', details: '' });
        addToast('success', 'Payment method updated');
    };

    const handleDeletePm = (empId: string, pmId: string) => {
        setPaymentMethods(prev => {
            const remaining = (prev[empId] || []).filter(m => m.id !== pmId);
            if (remaining.length > 0 && !remaining.some(m => m.isDefault)) remaining[0].isDefault = true;
            return { ...prev, [empId]: remaining };
        });
        addToast('success', 'Payment method removed');
    };

    const handleSetDefaultPm = (empId: string, pmId: string) => {
        setPaymentMethods(prev => ({ ...prev, [empId]: (prev[empId] || []).map(m => ({ ...m, isDefault: m.id === pmId })) }));
        addToast('success', 'Default payment method updated');
    };

    const pmTypeIcon = (type: string) => {
        if (type === 'Bank Transfer') return <Banknote size={14} />;
        if (type === 'Mobile Wallet') return <Smartphone size={14} />;
        if (type === 'Check') return <FileText size={14} />;
        return <DollarSign size={14} />;
    };

    /* ─── Summary Logic ──────────────────────────────────────── */

    const summaryData = useMemo(() => {
        let data = employees.map(e => ({
            ...e,
            netPay: e.baseSalary + e.commission + e.bonus - e.deductions,
            status: payrollStatus[e.id] || 'Pending',
        }));
        if (statusFilter !== 'all') data = data.filter(d => d.status.toLowerCase() === statusFilter);
        if (searchSummary) data = data.filter(d => d.name.toLowerCase().includes(searchSummary.toLowerCase()));
        return data;
    }, [payrollStatus, statusFilter, searchSummary]);

    const totals = useMemo(() => {
        const all = employees.map(e => ({ ...e, netPay: e.baseSalary + e.commission + e.bonus - e.deductions }));
        return {
            payroll: all.reduce((s, e) => s + e.netPay, 0),
            commissions: all.reduce((s, e) => s + e.commission, 0),
            bonuses: all.reduce((s, e) => s + e.bonus, 0),
            deductions: all.reduce((s, e) => s + e.deductions, 0),
        };
    }, []);

    const handlePay = (empId: string) => {
        const emp = employees.find(e => e.id === empId)!;
        const net = emp.baseSalary + emp.commission + emp.bonus - emp.deductions;
        const pm = getDefaultPm(empId);
        setPayrollStatus(prev => ({ ...prev, [empId]: 'Paid' }));
        const newPayout = {
            id: `PO-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            employee: emp.name,
            type: 'Salary + Commission',
            amount: net,
            method: pm?.type || 'Cash',
            ref: `TRX-FEB-${empId.slice(-3)}`,
            status: 'Completed',
        };
        setPayoutHistory(prev => [newPayout, ...prev]);
        setConfirmPay(null);
        addToast('success', `${emp.name} paid ${net.toLocaleString()} EGP`);
    };

    const handleProcessAll = () => {
        const pending = employees.filter(e => payrollStatus[e.id] === 'Pending');
        if (pending.length === 0) { addToast('info', 'All employees already paid'); return; }
        const updates: Record<string, 'Paid'> = {};
        const newPayouts: typeof initialPayoutHistory = [];
        pending.forEach(emp => {
            updates[emp.id] = 'Paid';
            const net = emp.baseSalary + emp.commission + emp.bonus - emp.deductions;
            newPayouts.push({
                id: `PO-${Date.now()}-${emp.id}`,
                date: new Date().toISOString().slice(0, 10),
                employee: emp.name,
                type: 'Salary + Commission',
                amount: net,
                method: getDefaultPm(emp.id)?.type || 'Cash',
                ref: `TRX-FEB-${emp.id.slice(-3)}`,
                status: 'Completed',
            });
        });
        setPayrollStatus(prev => ({ ...prev, ...updates }));
        setPayoutHistory(prev => [...newPayouts, ...prev]);
        addToast('success', `Processed payroll for ${pending.length} employees`);
    };

    /* ─── History Logic ──────────────────────────────────────── */

    const filteredHistory = useMemo(() => {
        let data = payoutHistory;
        if (historyType !== 'all') data = data.filter(d => d.type.toLowerCase().includes(historyType));
        if (historySearch) data = data.filter(d =>
            d.employee.toLowerCase().includes(historySearch.toLowerCase()) ||
            d.ref.toLowerCase().includes(historySearch.toLowerCase())
        );
        return data;
    }, [payoutHistory, historyType, historySearch]);

    /* ─── Month label ────────────────────────────────────────── */
    const monthLabel = (() => {
        const [y, m] = month.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[parseInt(m) - 1]} ${y}`;
    })();

    /* ─── Render ─────────────────────────────────────────────── */

    return (
        <div style={s.page}>
            {/* Tab Switcher */}
            <div style={s.tabBar}>
                {(['summary', 'history', 'slips'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            ...s.tab,
                            background: activeTab === tab ? 'var(--bg-primary)' : 'transparent',
                            color: activeTab === tab ? 'var(--color-primary-600)' : 'var(--text-tertiary)',
                            boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
                        }}
                    >
                        {tab === 'summary' && <><Wallet size={14} style={{ marginRight: 6, verticalAlign: -2 }} />Payroll Summary</>}
                        {tab === 'history' && <><Clock size={14} style={{ marginRight: 6, verticalAlign: -2 }} />Payout History</>}
                        {tab === 'slips' && <><FileText size={14} style={{ marginRight: 6, verticalAlign: -2 }} />Pay Slips</>}
                    </button>
                ))}
            </div>

            {/* ═══ TAB 1: PAYROLL SUMMARY ═══ */}
            {activeTab === 'summary' && (
                <>
                    {/* KPIs */}
                    <div style={s.kpiGrid}>
                        <div style={s.kpiCard}><div style={{ ...s.kpiIcon, background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}><DollarSign size={22} /></div><div><div style={s.kpiVal}>{totals.payroll.toLocaleString()} EGP</div><div style={s.kpiLbl}>Total Payroll</div></div></div>
                        <div style={s.kpiCard}><div style={{ ...s.kpiIcon, background: '#DBEAFE', color: '#2563EB' }}><Award size={22} /></div><div><div style={s.kpiVal}>{totals.commissions.toLocaleString()} EGP</div><div style={s.kpiLbl}>Commissions</div></div></div>
                        <div style={s.kpiCard}><div style={{ ...s.kpiIcon, background: '#FEF3C7', color: '#B45309' }}><Gift size={22} /></div><div><div style={s.kpiVal}>{totals.bonuses.toLocaleString()} EGP</div><div style={s.kpiLbl}>Bonuses</div></div></div>
                        <div style={s.kpiCard}><div style={{ ...s.kpiIcon, background: '#FEE2E2', color: '#DC2626' }}><MinusCircle size={22} /></div><div><div style={s.kpiVal}>{totals.deductions.toLocaleString()} EGP</div><div style={s.kpiLbl}>Deductions</div></div></div>
                    </div>

                    {/* Toolbar */}
                    <div style={s.toolbar}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Calendar size={16} color="var(--text-tertiary)" />
                            <Select value={month} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMonth(e.target.value)} options={[{ value: '2026-02', label: 'February 2026' }, { value: '2026-01', label: 'January 2026' }, { value: '2025-12', label: 'December 2025' }]} style={{ width: 170 }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Filter size={16} color="var(--text-tertiary)" />
                            <Select value={statusFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)} options={[{ value: 'all', label: 'All Status' }, { value: 'pending', label: 'Pending' }, { value: 'paid', label: 'Paid' }]} style={{ width: 140 }} />
                        </div>
                        <div style={{ position: 'relative', marginLeft: 'auto' }}>
                            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                            <input placeholder="Search employee..." value={searchSummary} onChange={e => setSearchSummary(e.target.value)}
                                style={{ paddingLeft: 32, height: 38, width: 200, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }} />
                        </div>
                        <Button variant="primary" onClick={handleProcessAll} style={{ marginLeft: 'var(--space-2)' }}><CheckCircle size={16} /> Process All</Button>
                    </div>

                    {/* Table */}
                    <div style={s.tableWrapper}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={s.table}>
                                <thead><tr>
                                    <th style={s.th as React.CSSProperties}>Employee</th>
                                    <th style={s.th as React.CSSProperties}>Base Salary</th>
                                    <th style={s.th as React.CSSProperties}>Commission</th>
                                    <th style={s.th as React.CSSProperties}>Bonus</th>
                                    <th style={s.th as React.CSSProperties}>Deductions</th>
                                    <th style={s.th as React.CSSProperties}>Net Pay</th>
                                    <th style={s.th as React.CSSProperties}>Payment Method</th>
                                    <th style={s.th as React.CSSProperties}>Status</th>
                                    <th style={s.th as React.CSSProperties}>Action</th>
                                </tr></thead>
                                <tbody>
                                    {summaryData.map(emp => (
                                        <tr key={emp.id} style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>
                                                <div>{emp.name}</div>
                                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{emp.dept} · {emp.id}</div>
                                            </td>
                                            <td style={s.td}>{emp.baseSalary.toLocaleString()} EGP</td>
                                            <td style={s.td}>{emp.commission > 0 ? `${emp.commission.toLocaleString()} EGP` : '—'}</td>
                                            <td style={s.td}>{emp.bonus > 0 ? `${emp.bonus.toLocaleString()} EGP` : '—'}</td>
                                            <td style={{ ...s.td, color: 'var(--color-error)' }}>-{emp.deductions.toLocaleString()} EGP</td>
                                            <td style={{ ...s.td, fontWeight: 'var(--font-bold)' }}>{emp.netPay.toLocaleString()} EGP</td>
                                            <td style={s.td}>
                                                {(() => {
                                                    const pm = getDefaultPm(emp.id); return pm ? (
                                                        <button onClick={() => { setPmEmpId(emp.id); setPmShowForm(false); setPmEditing(null); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '4px 10px', fontSize: 'var(--text-xs)', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                                            {pmTypeIcon(pm.type)} {pm.label} <Edit size={10} style={{ marginLeft: 4, color: 'var(--text-tertiary)' }} />
                                                        </button>
                                                    ) : (
                                                        <Button variant="ghost" size="sm" onClick={() => { setPmEmpId(emp.id); setPmShowForm(true); setPmEditing(null); setPmForm({ type: 'Bank Transfer', label: '', details: '' }); }}><Plus size={14} /> Add</Button>
                                                    );
                                                })()}
                                            </td>
                                            <td style={s.td}><Badge color={emp.status === 'Paid' ? 'success' : 'warning'} size="sm">{emp.status}</Badge></td>
                                            <td style={s.td}>
                                                {emp.status === 'Pending' ? (
                                                    <Button variant="primary" size="sm" onClick={() => setConfirmPay(emp.id)}><CreditCard size={14} /> Pay</Button>
                                                ) : (
                                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>✓ Processed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {summaryData.length === 0 && (
                                        <tr><td colSpan={9} style={{ ...s.td, textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>No employees match filters</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ═══ TAB 2: PAYOUT HISTORY ═══ */}
            {activeTab === 'history' && (
                <>
                    <div style={s.toolbar}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Filter size={16} color="var(--text-tertiary)" />
                            <Select value={historyType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHistoryType(e.target.value)} options={[{ value: 'all', label: 'All Types' }, { value: 'salary', label: 'Salary' }, { value: 'commission', label: 'Commission' }, { value: 'bonus', label: 'Bonus' }]} style={{ width: 150 }} />
                        </div>
                        <div style={{ position: 'relative', marginLeft: 'auto' }}>
                            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                            <input placeholder="Search by name or ref..." value={historySearch} onChange={e => setHistorySearch(e.target.value)}
                                style={{ paddingLeft: 32, height: 38, width: 220, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }} />
                        </div>
                    </div>

                    <div style={s.tableWrapper}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={s.table}>
                                <thead><tr>
                                    <th style={s.th as React.CSSProperties}>Date</th>
                                    <th style={s.th as React.CSSProperties}>Employee</th>
                                    <th style={s.th as React.CSSProperties}>Type</th>
                                    <th style={s.th as React.CSSProperties}>Amount</th>
                                    <th style={s.th as React.CSSProperties}>Method</th>
                                    <th style={s.th as React.CSSProperties}>Reference</th>
                                    <th style={s.th as React.CSSProperties}>Status</th>
                                </tr></thead>
                                <tbody>
                                    {filteredHistory.map(row => (
                                        <tr key={row.id} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                                            <td style={s.td}>{row.date}</td>
                                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{row.employee}</td>
                                            <td style={s.td}><Badge color={row.type.includes('Salary') ? 'primary' : row.type.includes('Commission') ? 'info' : 'warning'} size="sm">{row.type}</Badge></td>
                                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }}>{row.amount.toLocaleString()} EGP</td>
                                            <td style={s.td}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    {row.method === 'Bank Transfer' ? <Banknote size={14} /> : <CreditCard size={14} />}
                                                    {row.method}
                                                </span>
                                            </td>
                                            <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 'var(--text-xs)' }}>{row.ref}</td>
                                            <td style={s.td}><Badge color="success" size="sm">{row.status}</Badge></td>
                                        </tr>
                                    ))}
                                    {filteredHistory.length === 0 && (
                                        <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>No payouts match filters</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ═══ TAB 3: PAY SLIPS ═══ */}
            {activeTab === 'slips' && (
                <>
                    <div style={s.toolbar}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Calendar size={16} color="var(--text-tertiary)" />
                            <Select options={[{ value: '2026-02', label: 'February 2026' }, { value: '2026-01', label: 'January 2026' }]} style={{ width: 170 }} />
                        </div>
                    </div>

                    <div style={s.tableWrapper}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={s.table}>
                                <thead><tr>
                                    <th style={s.th as React.CSSProperties}>Employee</th>
                                    <th style={s.th as React.CSSProperties}>Month</th>
                                    <th style={s.th as React.CSSProperties}>Base</th>
                                    <th style={s.th as React.CSSProperties}>Commission</th>
                                    <th style={s.th as React.CSSProperties}>Bonus</th>
                                    <th style={s.th as React.CSSProperties}>Deductions</th>
                                    <th style={s.th as React.CSSProperties}>Net Pay</th>
                                    <th style={s.th as React.CSSProperties}>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {employees.map(emp => {
                                        const net = emp.baseSalary + emp.commission + emp.bonus - emp.deductions;
                                        return (
                                            <tr key={emp.id} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>
                                                    <div>{emp.name}</div>
                                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{emp.id}</div>
                                                </td>
                                                <td style={s.td}>{monthLabel}</td>
                                                <td style={s.td}>{emp.baseSalary.toLocaleString()}</td>
                                                <td style={s.td}>{emp.commission > 0 ? emp.commission.toLocaleString() : '—'}</td>
                                                <td style={s.td}>{emp.bonus > 0 ? emp.bonus.toLocaleString() : '—'}</td>
                                                <td style={{ ...s.td, color: 'var(--color-error)' }}>-{emp.deductions.toLocaleString()}</td>
                                                <td style={{ ...s.td, fontWeight: 'var(--font-bold)' }}>{net.toLocaleString()} EGP</td>
                                                <td style={s.td}>
                                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                        <Button variant="ghost" size="sm" onClick={() => setSelectedSlip(emp)}><Eye size={14} /> View</Button>
                                                        <Button variant="ghost" size="sm"><Download size={14} /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ═══ PAY CONFIRMATION MODAL ═══ */}
            {confirmPay && (() => {
                const emp = employees.find(e => e.id === confirmPay)!;
                const net = emp.baseSalary + emp.commission + emp.bonus - emp.deductions;
                return (
                    <Modal open onClose={() => setConfirmPay(null)} title="Confirm Payout">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                                <div style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>{emp.name}</div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{emp.dept} · {emp.position}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Base Salary</span><span>{emp.baseSalary.toLocaleString()} EGP</span></div>
                                {emp.commission > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Commission</span><span>{emp.commission.toLocaleString()} EGP</span></div>}
                                {emp.bonus > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Bonus</span><span>{emp.bonus.toLocaleString()} EGP</span></div>}
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-error)' }}><span>Deductions</span><span>-{emp.deductions.toLocaleString()} EGP</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'var(--font-bold)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-2)', marginTop: 'var(--space-1)' }}><span>Net Pay</span><span>{net.toLocaleString()} EGP</span></div>
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Payment to: {(() => { const pm = getDefaultPm(confirmPay); return pm ? `${pm.type} — ${pm.label} ${pm.details}` : 'No payment method set'; })()}</div>
                            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                                <Button variant="outline" onClick={() => setConfirmPay(null)}>Cancel</Button>
                                <Button variant="primary" onClick={() => handlePay(confirmPay)}><CheckCircle size={16} /> Confirm & Pay</Button>
                            </div>
                        </div>
                    </Modal>
                );
            })()}

            {/* ═══ PAY SLIP SLIDEOVER ═══ */}
            {selectedSlip && (() => {
                const emp = selectedSlip;
                const net = emp.baseSalary + emp.commission + emp.bonus - emp.deductions;
                return (
                    <SlideOver open onClose={() => setSelectedSlip(null)} title="Pay Slip">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                            {/* Header */}
                            <div style={{ textAlign: 'center', paddingBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-primary-500)' }}>
                                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>HAGZY</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>Pay Slip — {monthLabel}</div>
                            </div>

                            {/* Employee Info */}
                            <div style={s.slipSection}>
                                <div style={s.slipLabel}>Employee Details</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                                    <div><span style={{ color: 'var(--text-tertiary)' }}>Name:</span> {emp.name}</div>
                                    <div><span style={{ color: 'var(--text-tertiary)' }}>ID:</span> {emp.id}</div>
                                    <div><span style={{ color: 'var(--text-tertiary)' }}>Department:</span> {emp.dept}</div>
                                    <div><span style={{ color: 'var(--text-tertiary)' }}>Position:</span> {emp.position}</div>
                                </div>
                            </div>

                            {/* Earnings */}
                            <div style={s.slipSection}>
                                <div style={s.slipLabel}>Earnings</div>
                                <div style={s.slipRow}><span>Basic Salary</span><span style={{ fontWeight: 'var(--font-semibold)' }}>{emp.baseSalary.toLocaleString()} EGP</span></div>
                                {emp.commission > 0 && <div style={s.slipRow}><span>Commission (Feb 2026)</span><span style={{ fontWeight: 'var(--font-semibold)' }}>{emp.commission.toLocaleString()} EGP</span></div>}
                                {emp.bonus > 0 && <div style={s.slipRow}><span>Performance Bonus</span><span style={{ fontWeight: 'var(--font-semibold)' }}>{emp.bonus.toLocaleString()} EGP</span></div>}
                                <div style={{ ...s.slipRow, fontWeight: 'var(--font-semibold)', color: 'var(--color-success)' }}>
                                    <span>Total Earnings</span><span>{(emp.baseSalary + emp.commission + emp.bonus).toLocaleString()} EGP</span>
                                </div>
                            </div>

                            {/* Deductions */}
                            <div style={s.slipSection}>
                                <div style={s.slipLabel}>Deductions</div>
                                <div style={s.slipRow}><span>Social Insurance</span><span style={{ color: 'var(--color-error)' }}>-{Math.round(emp.deductions * 0.6).toLocaleString()} EGP</span></div>
                                <div style={s.slipRow}><span>Tax</span><span style={{ color: 'var(--color-error)' }}>-{Math.round(emp.deductions * 0.3).toLocaleString()} EGP</span></div>
                                <div style={s.slipRow}><span>Other</span><span style={{ color: 'var(--color-error)' }}>-{Math.round(emp.deductions * 0.1).toLocaleString()} EGP</span></div>
                                <div style={{ ...s.slipRow, fontWeight: 'var(--font-semibold)', color: 'var(--color-error)' }}>
                                    <span>Total Deductions</span><span>-{emp.deductions.toLocaleString()} EGP</span>
                                </div>
                            </div>

                            {/* Net Pay */}
                            <div style={s.slipTotal}>
                                <span>NET PAY</span>
                                <span style={{ color: 'var(--color-primary-600)' }}>{net.toLocaleString()} EGP</span>
                            </div>

                            {/* Bank */}
                            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                                <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-1)' }}>Payment Method</div>
                                <div style={{ fontWeight: 'var(--font-medium)' }}>{(() => { const pm = getDefaultPm(emp.id); return pm ? `${pm.type} — ${pm.label} ${pm.details}` : 'No method set'; })()}</div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <Button variant="outline" style={{ flex: 1 }}><Download size={16} /> Download PDF</Button>
                                <Button variant="outline" style={{ flex: 1 }} onClick={() => setSelectedSlip(null)}>Close</Button>
                            </div>
                        </div>
                    </SlideOver>
                );
            })()}

            {/* ═══ PAYMENT METHODS SLIDEOVER ═══ */}
            {pmEmpId && (() => {
                const emp = employees.find(e => e.id === pmEmpId)!;
                const methods = paymentMethods[pmEmpId] || [];
                return (
                    <SlideOver open onClose={() => { setPmEmpId(null); setPmShowForm(false); setPmEditing(null); }} title={`Payment Methods — ${emp.name}`}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {/* Existing Methods */}
                            {methods.length === 0 && <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>No payment methods yet</div>}
                            {methods.map(m => (
                                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: m.isDefault ? 'var(--color-primary-50)' : 'var(--bg-secondary)', border: `1px solid ${m.isDefault ? 'var(--color-primary-200)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-lg)' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>{pmTypeIcon(m.type)}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            {m.label}
                                            {m.isDefault && <Badge color="primary" size="sm">Default</Badge>}
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{m.type} · {m.details}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                        {!m.isDefault && <button onClick={() => handleSetDefaultPm(pmEmpId, m.id)} title="Set as default" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-tertiary)' }}><Star size={14} /></button>}
                                        <button onClick={() => { setPmEditing(m); setPmForm({ type: m.type, label: m.label, details: m.details }); setPmShowForm(true); }} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-tertiary)' }}><Edit size={14} /></button>
                                        <button onClick={() => handleDeletePm(pmEmpId, m.id)} title="Remove" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-error)' }}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}

                            {/* Add / Edit Form */}
                            {pmShowForm ? (
                                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{pmEditing ? 'Edit Payment Method' : 'Add Payment Method'}</div>
                                    <div>
                                        <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>Type</label>
                                        <select value={pmForm.type} onChange={e => setPmForm(p => ({ ...p, type: e.target.value as PaymentMethod['type'] }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Mobile Wallet">Mobile Wallet</option>
                                            <option value="Check">Check</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>Label</label>
                                        <input value={pmForm.label} onChange={e => setPmForm(p => ({ ...p, label: e.target.value }))} placeholder={pmForm.type === 'Bank Transfer' ? 'e.g. CIB Savings' : pmForm.type === 'Mobile Wallet' ? 'e.g. Vodafone Cash' : 'Name'} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>Details</label>
                                        <input value={pmForm.details} onChange={e => setPmForm(p => ({ ...p, details: e.target.value }))} placeholder={pmForm.type === 'Bank Transfer' ? 'Account number' : pmForm.type === 'Mobile Wallet' ? 'Phone number' : 'Details'} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                        <Button variant="outline" size="sm" onClick={() => { setPmShowForm(false); setPmEditing(null); setPmForm({ type: 'Bank Transfer', label: '', details: '' }); }}>Cancel</Button>
                                        <Button variant="primary" size="sm" onClick={() => pmEditing ? handleEditPm(pmEmpId) : handleAddPm(pmEmpId)}>{pmEditing ? 'Save Changes' : 'Add Method'}</Button>
                                    </div>
                                </div>
                            ) : (
                                <Button variant="outline" onClick={() => { setPmShowForm(true); setPmEditing(null); setPmForm({ type: 'Bank Transfer', label: '', details: '' }); }} style={{ width: '100%' }}><Plus size={16} /> Add Payment Method</Button>
                            )}
                        </div>
                    </SlideOver>
                );
            })()}
        </div>
    );
}
