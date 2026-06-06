'use client';

import React, { useState, useMemo } from 'react';
import {
    Wallet,
    DollarSign,
    Award,
    Gift,
    MinusCircle,
    CheckCircle,
    Clock,
    Search,
    Filter,
    Calendar,
    Download,
    CreditCard,
    Banknote,
    FileText,
    Eye,
    Plus,
    Edit,
    Trash2,
    Star,
    Smartphone,
    AlertCircle,
    Shirt,
    Wrench,
    Droplet,
} from 'lucide-react';
import { Button, Select, Badge, Modal, useToast, SlideOver } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { payrollApi } from '@/lib/api';
import SubTabs from '@/components/SubTabs';
import CommissionsPage from '@/app/employees/commissions/page';
import CommissionSettingsPage from '@/app/employees/commission-settings/page';
import DeductionsPage from '@/app/employees/deductions/page';

/* ─── Mock Data ──────────────────────────────────────────────────── */

interface DeductionDetail {
    label: string;
    amount: number;
    type: 'attendance' | 'uniform' | 'equipment' | 'material' | 'custom';
    date: string;
    datetime?: string;
    attachment?: { name: string; url: string } | null;
}

interface PaymentMethod {
    id: string;
    type: 'Bank Transfer' | 'Cash' | 'Mobile Wallet' | 'Check';
    label: string;
    details: string;
    isDefault: boolean;
}

const employees = [
    {
        id: 'EMP-001',
        name: 'Sara Ahmed',
        dept: 'Hair Care',
        position: 'Senior Stylist',
        level: 'Senior',
        baseSalary: 8000,
        commission: 2693.2, // Reflects resolved pricing: Hair Coloring 520×12 @10% + Keratin 900×5 @12%
        tips: 650, // PR-6: canonical Tips per visit, surfaced in the payslip
        bonus: 1000,
        deductions: 500,
        deductionDetails: [
            { label: 'Late arrival penalty', amount: 120, type: 'attendance' as const, date: 'Mar 3, Mar 9' },
            { label: 'Absence deduction', amount: 200, type: 'attendance' as const, date: 'Mar 14' },
            { label: 'Material wastage', amount: 180, type: 'material' as const, date: 'Mar 7' },
        ],
    },
    {
        id: 'EMP-002',
        name: 'Nora Ali',
        dept: 'Skincare',
        position: 'Aesthetician',
        level: 'Mid',
        baseSalary: 7000,
        commission: 1880,
        tips: 420,
        bonus: 600,
        deductions: 450,
        deductionDetails: [
            { label: 'Late arrival penalty', amount: 150, type: 'attendance' as const, date: 'Mar 5, Mar 11' },
            { label: 'Uniform replacement', amount: 300, type: 'uniform' as const, date: 'Mar 2' },
        ],
    },
    {
        id: 'EMP-003',
        name: 'Mona Zein',
        dept: 'Skincare',
        position: 'Laser Tech',
        level: 'Mid',
        baseSalary: 7500,
        commission: 1650,
        tips: 380,
        bonus: 0,
        deductions: 480,
        deductionDetails: [
            { label: 'Equipment damage', amount: 280, type: 'equipment' as const, date: 'Mar 8' },
            { label: 'Late arrival penalty', amount: 200, type: 'attendance' as const, date: 'Mar 4, Mar 10, Mar 13' },
        ],
    },
    {
        id: 'EMP-004',
        name: 'Layla Hassan',
        dept: 'Nails',
        position: 'Nail Artist',
        level: 'Junior',
        baseSalary: 5500,
        commission: 920,
        tips: 510,
        bonus: 0,
        deductions: 350,
        deductionDetails: [
            { label: 'Late arrival penalty', amount: 100, type: 'attendance' as const, date: 'Mar 6' },
            { label: 'Material wastage', amount: 250, type: 'material' as const, date: 'Mar 12' },
        ],
    },
    {
        id: 'EMP-005',
        name: 'Reem Mohamed',
        dept: 'Spa',
        position: 'Therapist',
        level: 'Senior',
        baseSalary: 6000,
        commission: 720,
        tips: 290,
        bonus: 300,
        deductions: 380,
        deductionDetails: [
            { label: 'Absence deduction', amount: 200, type: 'attendance' as const, date: 'Mar 7' },
            { label: 'Uniform replacement', amount: 180, type: 'uniform' as const, date: 'Mar 1' },
        ],
    },
    {
        id: 'EMP-006',
        name: 'Huda Farouk',
        dept: 'Hair Care',
        position: 'Colorist',
        baseSalary: 6500,
        commission: 1100,
        tips: 340,
        bonus: 0,
        deductions: 420,
        deductionDetails: [
            { label: 'Late arrival penalty', amount: 120, type: 'attendance' as const, date: 'Mar 2, Mar 9' },
            { label: 'Equipment damage', amount: 300, type: 'equipment' as const, date: 'Mar 11' },
        ],
    },
    {
        id: 'EMP-007',
        name: 'Dina Samir',
        dept: 'Reception',
        position: 'Front Desk',
        baseSalary: 4500,
        commission: 0,
        tips: 0,
        bonus: 200,
        deductions: 280,
        deductionDetails: [
            { label: 'Late arrival penalty', amount: 80, type: 'attendance' as const, date: 'Mar 5' },
            { label: 'Material wastage', amount: 200, type: 'material' as const, date: 'Mar 10' },
        ],
    },
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
employees.forEach(e => {
    initialPayrollStatus[e.id] = 'Pending';
});

// PR-6: canonical payslip net = base + commission + tips + bonus − deductions.
// Used everywhere net pay is computed so tips are never silently dropped.
const empNetPay = (e: { baseSalary: number; commission: number; bonus: number; tips?: number }, totalDed: number) =>
    e.baseSalary + e.commission + e.bonus + (e.tips ?? 0) - totalDed;

const initialPayoutHistory = [
    {
        id: 'PO-1001',
        date: '2026-03-19',
        employee: 'Sara Ahmed',
        type: 'Salary',
        amount: 8000,
        method: 'Bank Transfer',
        ref: 'TRX-JAN-001',
        status: 'Completed',
    },
    {
        id: 'PO-1002',
        date: '2026-03-18',
        employee: 'Sara Ahmed',
        type: 'Commission',
        amount: 2100,
        method: 'Bank Transfer',
        ref: 'TRX-JAN-002',
        status: 'Completed',
    },
    {
        id: 'PO-1003',
        date: '2026-03-20',
        employee: 'Nora Ali',
        type: 'Salary',
        amount: 7000,
        method: 'Bank Transfer',
        ref: 'TRX-JAN-003',
        status: 'Completed',
    },
    {
        id: 'PO-1004',
        date: '2026-03-20',
        employee: 'Nora Ali',
        type: 'Commission',
        amount: 1500,
        method: 'Bank Transfer',
        ref: 'TRX-JAN-004',
        status: 'Completed',
    },
    {
        id: 'PO-1005',
        date: '2026-03-16',
        employee: 'Mona Zein',
        type: 'Salary',
        amount: 7500,
        method: 'Bank Transfer',
        ref: 'TRX-JAN-005',
        status: 'Completed',
    },
    {
        id: 'PO-1006',
        date: '2026-03-14',
        employee: 'Layla Hassan',
        type: 'Salary',
        amount: 5500,
        method: 'Cash',
        ref: 'TRX-JAN-006',
        status: 'Completed',
    },
    {
        id: 'PO-1007',
        date: '2026-03-12',
        employee: 'Sara Ahmed',
        type: 'Bonus',
        amount: 500,
        method: 'Bank Transfer',
        ref: 'TRX-DEC-001',
        status: 'Completed',
    },
    {
        id: 'PO-1008',
        date: '2026-03-23',
        employee: 'Reem Mohamed',
        type: 'Salary',
        amount: 6000,
        method: 'Bank Transfer',
        ref: 'TRX-DEC-002',
        status: 'Completed',
    },
];

/* ─── Styles ─────────────────────────────────────────────────────── */

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-8)' },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpiCard: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-5)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
    },
    kpiIcon: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    kpiVal: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
        background: 'var(--bg-primary)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
    },
    tableWrapper: {
        width: '100%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    table: { width: '100%', minWidth: 800, borderCollapse: 'collapse' },
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
    },
    td: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-color)',
    },
    tabBar: {
        display: 'flex',
        gap: 'var(--space-1)',
        background: 'var(--bg-secondary)',
        padding: 4,
        borderRadius: 'var(--radius-lg)',
        width: 'fit-content',
    },
    tab: {
        padding: 'var(--space-2) var(--space-4)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.2s',
    },
    slipSection: { marginBottom: 'var(--space-5)' },
    slipLabel: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 'var(--space-2)',
    },
    slipRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: 'var(--space-2) 0',
        fontSize: 'var(--text-sm)',
        borderBottom: '1px solid var(--border-color)',
    },
    slipTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: 'var(--space-3) 0',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-bold)',
        borderTop: '2px solid var(--text-primary)',
        marginTop: 'var(--space-3)',
    },
};

let nextIdCounter = 1;
const generateId = () => {
    return `${Date.now()}-${nextIdCounter++}`;
};

/* ─── Component ──────────────────────────────────────────────────── */

export default function PayrollPage() {
    const { t, lang } = useTranslation();
    const { addToast } = useToast();

    // API: fetch payroll records (ready for backend)
    const {
        loading: payrollLoading,
        error: payrollError,
        refetch: refetchPayroll,
    } = useApiQuery(() => payrollApi.getPayroll() as never, [], { fallbackData: employees });

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
    const [selectedSlip, setSelectedSlip] = useState<(typeof employees)[0] | null>(null);

    // Deductions state — all deductions (mock + added) in one state
    const [allDeductions, setAllDeductions] = useState<Record<string, DeductionDetail[]>>(() => {
        const initial: Record<string, DeductionDetail[]> = {};
        employees.forEach(e => {
            initial[e.id] = [...e.deductionDetails];
        });
        return initial;
    });
    const [showAddDeduction, setShowAddDeduction] = useState(false);
    const [deductionForm, setDeductionForm] = useState({
        empId: '',
        type: 'attendance' as DeductionDetail['type'],
        label: 'Late arrival penalty',
        amount: '',
        date: '',
        datetime: '',
        attachment: null as { name: string; url: string } | null,
    });
    const [expandedDeductions, setExpandedDeductions] = useState<string | null>(null);
    const [editingDeduction, setEditingDeduction] = useState<{ empId: string; index: number } | null>(null);

    const getEmpDeductions = (empId: string): DeductionDetail[] => allDeductions[empId] || [];
    const getEmpTotalDeductions = (empId: string) => getEmpDeductions(empId).reduce((sum, d) => sum + d.amount, 0);

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
        const newPm: PaymentMethod = {
            id: `pm-${generateId()}`,
            type: pmForm.type,
            label: pmForm.label || pmForm.type,
            details: pmForm.details,
            isDefault: !paymentMethods[empId]?.length,
        };
        setPaymentMethods(prev => ({ ...prev, [empId]: [...(prev[empId] || []), newPm] }));
        setPmForm({ type: 'Bank Transfer', label: '', details: '' });
        setPmShowForm(false);
        addToast('success', t('payroll.toastPmAdded'));
    };

    const handleEditPm = (empId: string) => {
        if (!pmEditing) return;
        setPaymentMethods(prev => ({
            ...prev,
            [empId]: (prev[empId] || []).map(m =>
                m.id === pmEditing.id
                    ? { ...m, type: pmForm.type, label: pmForm.label || pmForm.type, details: pmForm.details }
                    : m
            ),
        }));
        setPmEditing(null);
        setPmShowForm(false);
        setPmForm({ type: 'Bank Transfer', label: '', details: '' });
        addToast('success', t('payroll.toastPmUpdated'));
    };

    const handleDeletePm = (empId: string, pmId: string) => {
        setPaymentMethods(prev => {
            const remaining = (prev[empId] || []).filter(m => m.id !== pmId);
            if (remaining.length > 0 && !remaining.some(m => m.isDefault)) remaining[0].isDefault = true;
            return { ...prev, [empId]: remaining };
        });
        addToast('success', t('payroll.toastPmRemoved'));
    };

    const handleSetDefaultPm = (empId: string, pmId: string) => {
        setPaymentMethods(prev => ({
            ...prev,
            [empId]: (prev[empId] || []).map(m => ({ ...m, isDefault: m.id === pmId })),
        }));
        addToast('success', t('payroll.toastPmDefault'));
    };

    const pmTypeIcon = (type: string) => {
        const translatedType =
            type === t('payroll.typeBankTrans')
                ? 'Bank Transfer'
                : type === t('payroll.typeCashVal')
                  ? 'Cash'
                  : type === t('payroll.typeWalletVal')
                    ? 'Mobile Wallet'
                    : type === t('payroll.typeCheckVal')
                      ? 'Check'
                      : type;
        if (translatedType === 'Bank Transfer' || type === 'Bank Transfer') return <Banknote size={14} />;
        if (translatedType === 'Mobile Wallet' || type === 'Mobile Wallet') return <Smartphone size={14} />;
        if (translatedType === 'Check' || type === 'Check') return <FileText size={14} />;
        return <DollarSign size={14} />;
    };

    const getDeductionIcon = (type: string) => {
        switch (type) {
            case 'attendance':
                return AlertCircle;
            case 'uniform':
                return Shirt;
            case 'equipment':
                return Wrench;
            case 'material':
                return Droplet;
            case 'custom':
                return AlertCircle;
            default:
                return AlertCircle;
        }
    };

    const deductionTypeColor = (type: string) => {
        switch (type) {
            case 'attendance':
                return { bg: '#FEF3C7', color: '#B45309' };
            case 'uniform':
                return { bg: '#DBEAFE', color: '#2563EB' };
            case 'equipment':
                return { bg: '#FEE2E2', color: '#DC2626' };
            case 'material':
                return { bg: '#E0E7FF', color: '#4338CA' };
            case 'custom':
                return { bg: 'var(--bg-secondary)', color: 'var(--text-secondary)' };
            default:
                return { bg: '#FEE2E2', color: '#DC2626' };
        }
    };

    /* ─── Summary Logic ──────────────────────────────────────── */

    const summaryData = useMemo(() => {
        let data = employees.map(e => {
            const totalDed = getEmpTotalDeductions(e.id);
            return {
                ...e,
                deductions: totalDed,
                deductionDetails: getEmpDeductions(e.id),
                netPay: empNetPay(e, totalDed),
                status: payrollStatus[e.id] || 'Pending',
            };
        });
        if (statusFilter !== 'all') data = data.filter(d => d.status.toLowerCase() === statusFilter);
        if (searchSummary) data = data.filter(d => d.name.toLowerCase().includes(searchSummary.toLowerCase()));
        return data;
    }, [payrollStatus, statusFilter, searchSummary, allDeductions, employees, getEmpTotalDeductions, getEmpDeductions]);

    const totals = useMemo(() => {
        const all = employees.map(e => {
            const totalDed = getEmpTotalDeductions(e.id);
            return { ...e, netPay: empNetPay(e, totalDed), deductions: totalDed };
        });
        return {
            payroll: all.reduce((s, e) => s + e.netPay, 0),
            commissions: all.reduce((s, e) => s + e.commission, 0),
            tips: all.reduce((s, e) => s + (e.tips ?? 0), 0),
            bonuses: all.reduce((s, e) => s + e.bonus, 0),
            deductions: all.reduce((s, e) => s + e.deductions, 0),
        };
    }, [allDeductions, employees, getEmpTotalDeductions]);

    const handlePay = (empId: string) => {
        const emp = employees.find(e => e.id === empId)!;
        const net = empNetPay(emp, getEmpTotalDeductions(empId));
        const pm = getDefaultPm(empId);
        setPayrollStatus(prev => ({ ...prev, [empId]: 'Paid' }));
        const newPayout = {
            id: `PO-${generateId()}`,
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
        addToast('success', `${emp.name}${t('payroll.toastPaid')}${net.toLocaleString()}${t('payroll.egp')}`);
    };

    const [confirmProcessAll, setConfirmProcessAll] = useState(false);
    const [confirmDeleteDed, setConfirmDeleteDed] = useState<{ empId: string; index: number } | null>(null);

    const handleProcessAll = () => {
        const pending = employees.filter(e => payrollStatus[e.id] === 'Pending');
        if (pending.length === 0) {
            addToast('info', t('payroll.toastAllPaid'));
            return;
        }
        const updates: Record<string, 'Paid'> = {};
        const newPayouts: typeof initialPayoutHistory = [];
        pending.forEach(emp => {
            updates[emp.id] = 'Paid';
            const net = empNetPay(emp, getEmpTotalDeductions(emp.id));
            newPayouts.push({
                id: `PO-${generateId()}-${emp.id}`,
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
        setConfirmProcessAll(false);
        addToast('success', `${t('payroll.toastProcessed')}${pending.length}${t('payroll.toastProcessedSuffix')}`);
    };

    const defaultLabelForType = (type: DeductionDetail['type']) => {
        switch (type) {
            case 'attendance':
                return 'Late arrival penalty';
            case 'uniform':
                return 'Uniform replacement';
            case 'equipment':
                return 'Equipment damage';
            case 'material':
                return 'Material wastage';
            case 'custom':
                return '';
        }
    };

    const resetDeductionForm = () =>
        setDeductionForm({
            empId: '',
            type: 'attendance',
            label: 'Late arrival penalty',
            amount: '',
            date: '',
            datetime: '',
            attachment: null,
        });

    const handleAddDeduction = () => {
        if (!deductionForm.empId || !deductionForm.label || !deductionForm.amount || !deductionForm.date) {
            addToast('error', t('payroll.toastDeductionFields'));
            return;
        }
        const detail: DeductionDetail = {
            label: deductionForm.label,
            amount: Number(deductionForm.amount),
            type: deductionForm.type,
            date: deductionForm.date,
            datetime: deductionForm.datetime || undefined,
            attachment: deductionForm.attachment,
        };
        setAllDeductions(prev => ({
            ...prev,
            [deductionForm.empId]: [...(prev[deductionForm.empId] || []), detail],
        }));
        setShowAddDeduction(false);
        resetDeductionForm();
        addToast('success', t('payroll.toastDeductionAdded'));
    };

    const handleEditDeduction = () => {
        if (!editingDeduction || !deductionForm.label || !deductionForm.amount || !deductionForm.date) {
            addToast('error', t('payroll.toastDeductionFields'));
            return;
        }
        const { empId, index } = editingDeduction;
        setAllDeductions(prev => {
            const updated = [...(prev[empId] || [])];
            updated[index] = {
                label: deductionForm.label,
                amount: Number(deductionForm.amount),
                type: deductionForm.type,
                date: deductionForm.date,
                datetime: deductionForm.datetime || undefined,
                attachment: deductionForm.attachment,
            };
            return { ...prev, [empId]: updated };
        });
        setEditingDeduction(null);
        setShowAddDeduction(false);
        resetDeductionForm();
        addToast('success', t('payroll.toastDeductionUpdated'));
    };

    const handleDeleteDeduction = (empId: string, index: number) => {
        setAllDeductions(prev => {
            const updated = [...(prev[empId] || [])];
            updated.splice(index, 1);
            return { ...prev, [empId]: updated };
        });
        addToast('success', t('payroll.toastDeductionDeleted'));
    };

    const openEditDeduction = (empId: string, index: number, deduction: DeductionDetail) => {
        setEditingDeduction({ empId, index });
        setDeductionForm({
            empId,
            type: deduction.type,
            label: deduction.label,
            amount: String(deduction.amount),
            date: deduction.date,
            datetime: deduction.datetime || '',
            attachment: deduction.attachment || null,
        });
        setShowAddDeduction(true);
    };

    /* ─── History Logic ──────────────────────────────────────── */

    const filteredHistory = useMemo(() => {
        let data = payoutHistory;
        if (historyType !== 'all') data = data.filter(d => d.type.toLowerCase().includes(historyType));
        if (historySearch)
            data = data.filter(
                d =>
                    d.employee.toLowerCase().includes(historySearch.toLowerCase()) ||
                    d.ref.toLowerCase().includes(historySearch.toLowerCase())
            );
        return data;
    }, [payoutHistory, historyType, historySearch]);

    /* ─── Month label ────────────────────────────────────────── */
    const monthLabel = (() => {
        const [y, m] = month.split('-');
        const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const translatedMonth = t(`payroll.months.${monthKeys[parseInt(m) - 1]}`);
        return lang === 'ar' ? `${translatedMonth} ${y}` : `${translatedMonth} ${y}`;
    })();

    /* ─── Render ─────────────────────────────────────────────── */

    const outerTabs = [
        { key: 'payroll', label: t('empLayout.tabPayroll'), icon: <Wallet size={14} /> },
        { key: 'deductions', label: t('empLayout.tabDeductions'), icon: <MinusCircle size={14} /> },
        { key: 'commissions', label: t('empLayout.tabCommissions'), icon: <Award size={14} /> },
        { key: 'commSettings', label: t('empLayout.tabCommSettings'), icon: <CreditCard size={14} /> },
    ];

    return (
        <div style={s.page}>
            <SubTabs tabs={outerTabs} defaultTab="payroll">
                {{
                    payroll: (
                        <>
                            {/* Tab Switcher */}
                            <div style={s.tabBar}>
                                {(['summary', 'history', 'slips'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            ...s.tab,
                                            background: activeTab === tab ? 'var(--bg-primary)' : 'transparent',
                                            color:
                                                activeTab === tab ? 'var(--color-primary-600)' : 'var(--text-tertiary)',
                                            boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
                                        }}
                                    >
                                        {tab === 'summary' && (
                                            <>
                                                <Wallet
                                                    size={14}
                                                    className={
                                                        lang === 'ar' ? 'ml-1.5 align-middle' : 'mr-1.5 align-middle'
                                                    }
                                                />
                                                {t('payroll.tabSummary')}
                                            </>
                                        )}
                                        {tab === 'history' && (
                                            <>
                                                <Clock
                                                    size={14}
                                                    className={
                                                        lang === 'ar' ? 'ml-1.5 align-middle' : 'mr-1.5 align-middle'
                                                    }
                                                />
                                                {t('payroll.tabHistory')}
                                            </>
                                        )}
                                        {tab === 'slips' && (
                                            <>
                                                <FileText
                                                    size={14}
                                                    className={
                                                        lang === 'ar' ? 'ml-1.5 align-middle' : 'mr-1.5 align-middle'
                                                    }
                                                />
                                                {t('payroll.tabSlips')}
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* ═══ TAB 1: PAYROLL SUMMARY ═══ */}
                            {activeTab === 'summary' && (
                                <>
                                    {/* KPIs */}
                                    <div style={s.kpiGrid}>
                                        <div
                                            style={{
                                                ...(s.kpiCard as React.CSSProperties),
                                                flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    ...s.kpiIcon,
                                                    background: 'var(--color-primary-50)',
                                                    color: 'var(--color-primary-600)',
                                                }}
                                            >
                                                <DollarSign size={22} />
                                            </div>
                                            <div style={{ textAlign: 'start' }}>
                                                <div style={s.kpiVal}>
                                                    {totals.payroll.toLocaleString()} {t('payroll.egp')}
                                                </div>
                                                <div style={s.kpiLbl}>{t('payroll.totalPayroll')}</div>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                ...(s.kpiCard as React.CSSProperties),
                                                flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                            }}
                                        >
                                            <div style={{ ...s.kpiIcon, background: '#DBEAFE', color: '#2563EB' }}>
                                                <Award size={22} />
                                            </div>
                                            <div style={{ textAlign: 'start' }}>
                                                <div style={s.kpiVal}>
                                                    {totals.commissions.toLocaleString()} {t('payroll.egp')}
                                                </div>
                                                <div style={s.kpiLbl}>{t('payroll.commissions')}</div>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                ...(s.kpiCard as React.CSSProperties),
                                                flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                            }}
                                        >
                                            <div style={{ ...s.kpiIcon, background: '#DCFCE7', color: '#15803D' }}>
                                                <Banknote size={22} />
                                            </div>
                                            <div style={{ textAlign: 'start' }}>
                                                <div style={s.kpiVal}>
                                                    {totals.tips.toLocaleString()} {t('payroll.egp')}
                                                </div>
                                                <div style={s.kpiLbl}>{lang === 'ar' ? 'البقشيش' : 'Tips'}</div>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                ...(s.kpiCard as React.CSSProperties),
                                                flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                            }}
                                        >
                                            <div style={{ ...s.kpiIcon, background: '#FEF3C7', color: '#B45309' }}>
                                                <Gift size={22} />
                                            </div>
                                            <div style={{ textAlign: 'start' }}>
                                                <div style={s.kpiVal}>
                                                    {totals.bonuses.toLocaleString()} {t('payroll.egp')}
                                                </div>
                                                <div style={s.kpiLbl}>{t('payroll.bonuses')}</div>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                ...(s.kpiCard as React.CSSProperties),
                                                flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                            }}
                                        >
                                            <div style={{ ...s.kpiIcon, background: '#FEE2E2', color: '#DC2626' }}>
                                                <MinusCircle size={22} />
                                            </div>
                                            <div style={{ textAlign: 'start' }}>
                                                <div style={s.kpiVal}>
                                                    {totals.deductions.toLocaleString()} {t('payroll.egp')}
                                                </div>
                                                <div style={s.kpiLbl}>{t('payroll.deductions')}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Toolbar */}
                                    <div
                                        style={{
                                            ...(s.toolbar as React.CSSProperties),
                                            flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <Calendar size={16} color="var(--text-tertiary)" />
                                            <Select
                                                value={month}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                    setMonth(e.target.value)
                                                }
                                                options={[
                                                    { value: '2026-02', label: `${t('payroll.months.feb')} 2026` },
                                                    { value: '2026-01', label: `${t('payroll.months.jan')} 2026` },
                                                    { value: '2025-12', label: `${t('payroll.months.dec')} 2025` },
                                                ]}
                                                style={{ width: 170 }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <Filter size={16} color="var(--text-tertiary)" />
                                            <Select
                                                value={statusFilter}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                    setStatusFilter(e.target.value)
                                                }
                                                options={[
                                                    { value: 'all', label: t('payroll.filterAllStatus') },
                                                    { value: 'pending', label: t('payroll.filterPending') },
                                                    { value: 'paid', label: t('payroll.filterPaid') },
                                                ]}
                                                style={{ width: 140 }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                position: 'relative',
                                                marginInlineStart: 'auto',
                                            }}
                                        >
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
                                                placeholder={t('payroll.searchEmp')}
                                                value={searchSummary}
                                                onChange={e => setSearchSummary(e.target.value)}
                                                style={{
                                                    paddingInlineStart: 32,
                                                    height: 38,
                                                    width: 200,
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 'var(--radius-lg)',
                                                    background: 'var(--bg-primary)',
                                                    fontSize: 'var(--text-sm)',
                                                    color: 'var(--text-primary)',
                                                    textAlign: 'start',
                                                }}
                                            />
                                        </div>
                                        <Button variant="outline" onClick={() => setShowAddDeduction(true)}>
                                            <MinusCircle size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                                            {t('payroll.addDeduction')}
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => setConfirmProcessAll(true)}
                                            className={lang === 'ar' ? 'mr-2' : 'ml-2'}
                                        >
                                            <CheckCircle size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                                            {t('payroll.processAll')}
                                        </Button>
                                    </div>

                                    {/* Table */}
                                    <div style={s.tableWrapper}>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={s.table}>
                                                <thead>
                                                    <tr style={{ textAlign: 'start' }}>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colEmp')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colBase')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colCommission')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colBonus')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colDeductions')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colNetPay')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colMethod')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colStatus')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colAction')}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {summaryData.map(emp => (
                                                        <React.Fragment key={emp.id}>
                                                            <tr
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    textAlign: 'start',
                                                                }}
                                                                onMouseEnter={e =>
                                                                    (e.currentTarget.style.background =
                                                                        'var(--bg-secondary)')
                                                                }
                                                                onMouseLeave={e =>
                                                                    (e.currentTarget.style.background = '')
                                                                }
                                                            >
                                                                <td
                                                                    style={{
                                                                        ...s.td,
                                                                        fontWeight: 'var(--font-medium)',
                                                                    }}
                                                                >
                                                                    <div>{emp.name}</div>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 'var(--text-xs)',
                                                                            color: 'var(--text-tertiary)',
                                                                        }}
                                                                    >
                                                                        {emp.dept} · {emp.id}
                                                                    </div>
                                                                </td>
                                                                <td style={s.td}>
                                                                    {emp.baseSalary.toLocaleString()} {t('payroll.egp')}
                                                                </td>
                                                                <td style={s.td}>
                                                                    {emp.commission > 0
                                                                        ? `${emp.commission.toLocaleString()} ${t('payroll.egp')}`
                                                                        : '—'}
                                                                </td>
                                                                <td style={s.td}>
                                                                    {emp.bonus > 0
                                                                        ? `${emp.bonus.toLocaleString()} ${t('payroll.egp')}`
                                                                        : '—'}
                                                                </td>
                                                                <td style={{ ...s.td, color: 'var(--color-error)' }}>
                                                                    <button
                                                                        onClick={e => {
                                                                            e.stopPropagation();
                                                                            setExpandedDeductions(
                                                                                expandedDeductions === emp.id
                                                                                    ? null
                                                                                    : emp.id
                                                                            );
                                                                        }}
                                                                        style={{
                                                                            background: 'none',
                                                                            border: 'none',
                                                                            cursor: 'pointer',
                                                                            color: 'var(--color-error)',
                                                                            fontWeight: 'var(--font-medium)',
                                                                            fontSize: 'var(--text-sm)',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 4,
                                                                            padding: 0,
                                                                        }}
                                                                        title={t('payroll.viewBreakdown')}
                                                                    >
                                                                        -{emp.deductions.toLocaleString()}{' '}
                                                                        {t('payroll.egp')}
                                                                        <svg
                                                                            width="12"
                                                                            height="12"
                                                                            viewBox="0 0 12 12"
                                                                            style={{
                                                                                transform:
                                                                                    expandedDeductions === emp.id
                                                                                        ? 'rotate(180deg)'
                                                                                        : 'rotate(0deg)',
                                                                                transition: 'transform 0.2s',
                                                                            }}
                                                                        >
                                                                            <path
                                                                                d="M3 4.5L6 7.5L9 4.5"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"
                                                                                fill="none"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </td>
                                                                <td style={{ ...s.td, fontWeight: 'var(--font-bold)' }}>
                                                                    {emp.netPay.toLocaleString()} {t('payroll.egp')}
                                                                </td>
                                                                <td style={s.td}>
                                                                    {(() => {
                                                                        const pm = getDefaultPm(emp.id);
                                                                        return pm ? (
                                                                            <button
                                                                                onClick={() => {
                                                                                    setPmEmpId(emp.id);
                                                                                    setPmShowForm(false);
                                                                                    setPmEditing(null);
                                                                                }}
                                                                                style={{
                                                                                    display: 'inline-flex',
                                                                                    alignItems: 'center',
                                                                                    gap: 4,
                                                                                    background: 'var(--bg-secondary)',
                                                                                    border: '1px solid var(--border-color)',
                                                                                    borderRadius: 'var(--radius-md)',
                                                                                    padding: '4px 10px',
                                                                                    fontSize: 'var(--text-xs)',
                                                                                    cursor: 'pointer',
                                                                                    color: 'var(--text-primary)',
                                                                                    flexDirection:
                                                                                        lang === 'ar'
                                                                                            ? 'row-reverse'
                                                                                            : 'row',
                                                                                }}
                                                                            >
                                                                                {pmTypeIcon(pm.type)} {pm.label}{' '}
                                                                                <Edit
                                                                                    size={10}
                                                                                    className={
                                                                                        lang === 'ar'
                                                                                            ? 'mr-1 text-tertiary'
                                                                                            : 'ml-1 text-tertiary'
                                                                                    }
                                                                                    style={{
                                                                                        color: 'var(--text-tertiary)',
                                                                                    }}
                                                                                />
                                                                            </button>
                                                                        ) : (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    setPmEmpId(emp.id);
                                                                                    setPmShowForm(true);
                                                                                    setPmEditing(null);
                                                                                    setPmForm({
                                                                                        type: 'Bank Transfer',
                                                                                        label: '',
                                                                                        details: '',
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <Plus
                                                                                    size={14}
                                                                                    className={
                                                                                        lang === 'ar' ? 'ml-1' : 'mr-1'
                                                                                    }
                                                                                />{' '}
                                                                                {t('payroll.btnAdd')}
                                                                            </Button>
                                                                        );
                                                                    })()}
                                                                </td>
                                                                <td style={s.td}>
                                                                    <Badge
                                                                        color={
                                                                            emp.status === 'Paid'
                                                                                ? 'success'
                                                                                : 'warning'
                                                                        }
                                                                        size="sm"
                                                                    >
                                                                        {emp.status === 'Paid'
                                                                            ? t('payroll.filterPaid')
                                                                            : t('payroll.filterPending')}
                                                                    </Badge>
                                                                </td>
                                                                <td style={s.td}>
                                                                    {emp.status === 'Pending' ? (
                                                                        <Button
                                                                            variant="primary"
                                                                            size="sm"
                                                                            onClick={() => setConfirmPay(emp.id)}
                                                                        >
                                                                            <CreditCard
                                                                                size={14}
                                                                                className={
                                                                                    lang === 'ar' ? 'ml-1' : 'mr-1'
                                                                                }
                                                                            />{' '}
                                                                            {t('payroll.btnPay')}
                                                                        </Button>
                                                                    ) : (
                                                                        <span
                                                                            style={{
                                                                                fontSize: 'var(--text-xs)',
                                                                                color: 'var(--text-tertiary)',
                                                                            }}
                                                                        >
                                                                            ✓ {t('payroll.processed')}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            {expandedDeductions === emp.id && (
                                                                <tr>
                                                                    <td
                                                                        colSpan={9}
                                                                        style={{
                                                                            padding: 0,
                                                                            background: 'var(--bg-secondary)',
                                                                            borderBottom:
                                                                                '1px solid var(--border-color)',
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                padding:
                                                                                    'var(--space-4) var(--space-6)',
                                                                                direction:
                                                                                    lang === 'ar' ? 'rtl' : 'ltr',
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    fontSize: 'var(--text-xs)',
                                                                                    fontWeight: 'var(--font-semibold)',
                                                                                    color: 'var(--text-tertiary)',
                                                                                    textTransform: 'uppercase',
                                                                                    letterSpacing: '0.05em',
                                                                                    marginBottom: 'var(--space-3)',
                                                                                    textAlign: 'start',
                                                                                }}
                                                                            >
                                                                                {t('payroll.deductionBreakdown')} —{' '}
                                                                                {emp.name}
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    flexDirection: 'column',
                                                                                    gap: 'var(--space-2)',
                                                                                }}
                                                                            >
                                                                                {emp.deductionDetails.map((d, i) => {
                                                                                    const Icon = getDeductionIcon(
                                                                                        d.type
                                                                                    );
                                                                                    const colors = deductionTypeColor(
                                                                                        d.type
                                                                                    );
                                                                                    return (
                                                                                        <div
                                                                                            key={i}
                                                                                            style={{
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                justifyContent:
                                                                                                    'space-between',
                                                                                                padding:
                                                                                                    'var(--space-2) var(--space-3)',
                                                                                                background:
                                                                                                    'var(--bg-primary)',
                                                                                                borderRadius:
                                                                                                    'var(--radius-lg)',
                                                                                                border: '1px solid var(--border-color)',
                                                                                                flexDirection:
                                                                                                    lang === 'ar'
                                                                                                        ? 'row-reverse'
                                                                                                        : 'row',
                                                                                            }}
                                                                                        >
                                                                                            <div
                                                                                                style={{
                                                                                                    display: 'flex',
                                                                                                    alignItems:
                                                                                                        'center',
                                                                                                    gap: 'var(--space-3)',
                                                                                                    flexDirection:
                                                                                                        lang === 'ar'
                                                                                                            ? 'row-reverse'
                                                                                                            : 'row',
                                                                                                }}
                                                                                            >
                                                                                                <span
                                                                                                    style={{
                                                                                                        width: 28,
                                                                                                        height: 28,
                                                                                                        borderRadius:
                                                                                                            'var(--radius-md)',
                                                                                                        background:
                                                                                                            colors.bg,
                                                                                                        color: colors.color,
                                                                                                        display:
                                                                                                            'inline-flex',
                                                                                                        alignItems:
                                                                                                            'center',
                                                                                                        justifyContent:
                                                                                                            'center',
                                                                                                        flexShrink: 0,
                                                                                                    }}
                                                                                                >
                                                                                                    <Icon size={14} />
                                                                                                </span>
                                                                                                <div
                                                                                                    style={{
                                                                                                        textAlign:
                                                                                                            'start',
                                                                                                    }}
                                                                                                >
                                                                                                    <div
                                                                                                        style={{
                                                                                                            fontSize:
                                                                                                                'var(--text-sm)',
                                                                                                            fontWeight:
                                                                                                                'var(--font-medium)',
                                                                                                            color: 'var(--text-primary)',
                                                                                                        }}
                                                                                                    >
                                                                                                        {t(
                                                                                                            `payroll.deductLabel.${d.label.toLowerCase().replace(/\s+/g, '_')}`
                                                                                                        ) !==
                                                                                                        `payroll.deductLabel.${d.label.toLowerCase().replace(/\s+/g, '_')}`
                                                                                                            ? t(
                                                                                                                  `payroll.deductLabel.${d.label.toLowerCase().replace(/\s+/g, '_')}`
                                                                                                              )
                                                                                                            : d.label}
                                                                                                    </div>
                                                                                                    <div
                                                                                                        style={{
                                                                                                            fontSize:
                                                                                                                'var(--text-xs)',
                                                                                                            color: 'var(--text-tertiary)',
                                                                                                            display:
                                                                                                                'flex',
                                                                                                            alignItems:
                                                                                                                'center',
                                                                                                            gap: 'var(--space-2)',
                                                                                                            flexDirection:
                                                                                                                lang ===
                                                                                                                'ar'
                                                                                                                    ? 'row-reverse'
                                                                                                                    : 'row',
                                                                                                        }}
                                                                                                    >
                                                                                                        <span>
                                                                                                            {t(
                                                                                                                `payroll.deductType.${d.type}`
                                                                                                            )}
                                                                                                        </span>
                                                                                                        <span>·</span>
                                                                                                        <span>
                                                                                                            {d.date}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div
                                                                                                style={{
                                                                                                    display: 'flex',
                                                                                                    alignItems:
                                                                                                        'center',
                                                                                                    gap: 'var(--space-2)',
                                                                                                    flexDirection:
                                                                                                        lang === 'ar'
                                                                                                            ? 'row-reverse'
                                                                                                            : 'row',
                                                                                                }}
                                                                                            >
                                                                                                <span
                                                                                                    style={{
                                                                                                        fontSize:
                                                                                                            'var(--text-sm)',
                                                                                                        fontWeight:
                                                                                                            'var(--font-semibold)',
                                                                                                        color: 'var(--color-error)',
                                                                                                    }}
                                                                                                >
                                                                                                    -
                                                                                                    {d.amount.toLocaleString()}{' '}
                                                                                                    {t('payroll.egp')}
                                                                                                </span>
                                                                                                <div
                                                                                                    style={{
                                                                                                        display: 'flex',
                                                                                                        gap: 2,
                                                                                                    }}
                                                                                                >
                                                                                                    <button
                                                                                                        onClick={() =>
                                                                                                            openEditDeduction(
                                                                                                                emp.id,
                                                                                                                i,
                                                                                                                d
                                                                                                            )
                                                                                                        }
                                                                                                        style={{
                                                                                                            background:
                                                                                                                'none',
                                                                                                            border: 'none',
                                                                                                            cursor: 'pointer',
                                                                                                            padding: 4,
                                                                                                            color: 'var(--text-tertiary)',
                                                                                                            borderRadius:
                                                                                                                'var(--radius-sm)',
                                                                                                        }}
                                                                                                        title={t(
                                                                                                            'payroll.editDeduction'
                                                                                                        )}
                                                                                                    >
                                                                                                        <Edit
                                                                                                            size={13}
                                                                                                        />
                                                                                                    </button>
                                                                                                    <button
                                                                                                        onClick={() =>
                                                                                                            handleDeleteDeduction(
                                                                                                                emp.id,
                                                                                                                i
                                                                                                            )
                                                                                                        }
                                                                                                        style={{
                                                                                                            background:
                                                                                                                'none',
                                                                                                            border: 'none',
                                                                                                            cursor: 'pointer',
                                                                                                            padding: 4,
                                                                                                            color: 'var(--color-error)',
                                                                                                            borderRadius:
                                                                                                                'var(--radius-sm)',
                                                                                                        }}
                                                                                                        title={t(
                                                                                                            'payroll.deleteDeduction'
                                                                                                        )}
                                                                                                    >
                                                                                                        <Trash2
                                                                                                            size={13}
                                                                                                        />
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                                {emp.deductionDetails.length === 0 && (
                                                                                    <div
                                                                                        style={{
                                                                                            textAlign: 'center',
                                                                                            padding: 'var(--space-3)',
                                                                                            color: 'var(--text-tertiary)',
                                                                                            fontSize: 'var(--text-sm)',
                                                                                        }}
                                                                                    >
                                                                                        {t('payroll.noDeductions')}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    justifyContent: 'space-between',
                                                                                    marginTop: 'var(--space-3)',
                                                                                    paddingTop: 'var(--space-3)',
                                                                                    borderTop:
                                                                                        '1px solid var(--border-color)',
                                                                                    fontWeight: 'var(--font-semibold)',
                                                                                    fontSize: 'var(--text-sm)',
                                                                                    flexDirection:
                                                                                        lang === 'ar'
                                                                                            ? 'row-reverse'
                                                                                            : 'row',
                                                                                }}
                                                                            >
                                                                                <span>
                                                                                    {t('payroll.slipTotalDeduct')}
                                                                                </span>
                                                                                <span
                                                                                    style={{
                                                                                        color: 'var(--color-error)',
                                                                                    }}
                                                                                >
                                                                                    -{emp.deductions.toLocaleString()}{' '}
                                                                                    {t('payroll.egp')}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                    {summaryData.length === 0 && (
                                                        <tr>
                                                            <td
                                                                colSpan={9}
                                                                style={{
                                                                    ...s.td,
                                                                    textAlign: 'center',
                                                                    padding: 'var(--space-8)',
                                                                    color: 'var(--text-tertiary)',
                                                                }}
                                                            >
                                                                {t('payroll.emptySummary')}
                                                            </td>
                                                        </tr>
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
                                    <div
                                        style={{
                                            ...(s.toolbar as React.CSSProperties),
                                            flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <Filter size={16} color="var(--text-tertiary)" />
                                            <Select
                                                value={historyType}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                    setHistoryType(e.target.value)
                                                }
                                                options={[
                                                    { value: 'all', label: t('payroll.typeAll') },
                                                    { value: 'salary', label: t('payroll.typeSalary') },
                                                    { value: 'commission', label: t('payroll.typeCommission') },
                                                    { value: 'bonus', label: t('payroll.typeBonus') },
                                                ]}
                                                style={{ width: 150 }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                position: 'relative',
                                                marginInlineStart: 'auto',
                                            }}
                                        >
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
                                                placeholder={t('payroll.searchHistory')}
                                                value={historySearch}
                                                onChange={e => setHistorySearch(e.target.value)}
                                                style={{
                                                    paddingInlineStart: 32,
                                                    height: 38,
                                                    width: 220,
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 'var(--radius-lg)',
                                                    background: 'var(--bg-primary)',
                                                    fontSize: 'var(--text-sm)',
                                                    color: 'var(--text-primary)',
                                                    textAlign: 'start',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={s.tableWrapper}>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={s.table}>
                                                <thead>
                                                    <tr style={{ textAlign: 'start' }}>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colDate')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colEmp')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colType')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colAmount')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colMethod')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colRef')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colStatus')}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredHistory.map(row => (
                                                        <tr
                                                            key={row.id}
                                                            onMouseEnter={e =>
                                                                (e.currentTarget.style.background =
                                                                    'var(--bg-secondary)')
                                                            }
                                                            onMouseLeave={e => (e.currentTarget.style.background = '')}
                                                            style={{ textAlign: 'start' }}
                                                        >
                                                            <td style={s.td}>{row.date}</td>
                                                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>
                                                                {row.employee}
                                                            </td>
                                                            <td style={s.td}>
                                                                <Badge
                                                                    color={
                                                                        row.type.includes('Salary')
                                                                            ? 'primary'
                                                                            : row.type.includes('Commission')
                                                                              ? 'info'
                                                                              : 'warning'
                                                                    }
                                                                    size="sm"
                                                                >
                                                                    {row.type.includes('Salary')
                                                                        ? t('payroll.typeSalary')
                                                                        : row.type.includes('Commission')
                                                                          ? t('payroll.typeCommission')
                                                                          : t('payroll.typeBonus')}
                                                                </Badge>
                                                            </td>
                                                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }}>
                                                                {row.amount.toLocaleString()} {t('payroll.egp')}
                                                            </td>
                                                            <td style={s.td}>
                                                                <span
                                                                    style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: 4,
                                                                        flexDirection:
                                                                            lang === 'ar' ? 'row-reverse' : 'row',
                                                                    }}
                                                                >
                                                                    {row.method === 'Bank Transfer' ? (
                                                                        <Banknote
                                                                            size={14}
                                                                            className={lang === 'ar' ? 'ml-1' : 'mr-1'}
                                                                        />
                                                                    ) : (
                                                                        <CreditCard
                                                                            size={14}
                                                                            className={lang === 'ar' ? 'ml-1' : 'mr-1'}
                                                                        />
                                                                    )}
                                                                    {row.method === 'Bank Transfer'
                                                                        ? t('payroll.typeBankTrans')
                                                                        : row.method === 'Cash'
                                                                          ? t('payroll.typeCashVal')
                                                                          : row.method === 'Mobile Wallet'
                                                                            ? t('payroll.typeWalletVal')
                                                                            : row.method === 'Check'
                                                                              ? t('payroll.typeCheckVal')
                                                                              : row.method}
                                                                </span>
                                                            </td>
                                                            <td
                                                                style={{
                                                                    ...s.td,
                                                                    fontFamily: 'monospace',
                                                                    fontSize: 'var(--text-xs)',
                                                                }}
                                                            >
                                                                {row.ref}
                                                            </td>
                                                            <td style={s.td}>
                                                                <Badge color="success" size="sm">
                                                                    {t('payroll.processed')}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {filteredHistory.length === 0 && (
                                                        <tr>
                                                            <td
                                                                colSpan={7}
                                                                style={{
                                                                    ...s.td,
                                                                    textAlign: 'center',
                                                                    padding: 'var(--space-8)',
                                                                    color: 'var(--text-tertiary)',
                                                                }}
                                                            >
                                                                {t('payroll.emptyHistory')}
                                                            </td>
                                                        </tr>
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
                                    <div
                                        style={{
                                            ...(s.toolbar as React.CSSProperties),
                                            flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <Calendar size={16} color="var(--text-tertiary)" />
                                            <Select
                                                options={[
                                                    { value: '2026-02', label: `${t('payroll.months.feb')} 2026` },
                                                    { value: '2026-01', label: `${t('payroll.months.jan')} 2026` },
                                                ]}
                                                style={{ width: 170 }}
                                            />
                                        </div>
                                    </div>

                                    <div style={s.tableWrapper}>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={s.table}>
                                                <thead>
                                                    <tr style={{ textAlign: 'start' }}>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colEmp')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colMonth')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colBase')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colCommission')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colBonus')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colDeductions')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colNetPay')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                ...(s.th as React.CSSProperties),
                                                                textAlign: 'start',
                                                            }}
                                                        >
                                                            {t('payroll.colAction')}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {employees.map(emp => {
                                                        const slipDed = getEmpTotalDeductions(emp.id);
                                                        const net = empNetPay(emp, slipDed);
                                                        return (
                                                            <tr
                                                                key={emp.id}
                                                                onMouseEnter={e =>
                                                                    (e.currentTarget.style.background =
                                                                        'var(--bg-secondary)')
                                                                }
                                                                onMouseLeave={e =>
                                                                    (e.currentTarget.style.background = '')
                                                                }
                                                                style={{ textAlign: 'start' }}
                                                            >
                                                                <td
                                                                    style={{
                                                                        ...s.td,
                                                                        fontWeight: 'var(--font-medium)',
                                                                    }}
                                                                >
                                                                    <div>{emp.name}</div>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 'var(--text-xs)',
                                                                            color: 'var(--text-tertiary)',
                                                                        }}
                                                                    >
                                                                        {emp.id}
                                                                    </div>
                                                                </td>
                                                                <td style={s.td}>{monthLabel}</td>
                                                                <td style={s.td}>{emp.baseSalary.toLocaleString()}</td>
                                                                <td style={s.td}>
                                                                    {emp.commission > 0
                                                                        ? emp.commission.toLocaleString()
                                                                        : '—'}
                                                                </td>
                                                                <td style={s.td}>
                                                                    {emp.bonus > 0 ? emp.bonus.toLocaleString() : '—'}
                                                                </td>
                                                                <td style={{ ...s.td, color: 'var(--color-error)' }}>
                                                                    -{slipDed.toLocaleString()}
                                                                </td>
                                                                <td style={{ ...s.td, fontWeight: 'var(--font-bold)' }}>
                                                                    {net.toLocaleString()} {t('payroll.egp')}
                                                                </td>
                                                                <td style={s.td}>
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            gap: 'var(--space-2)',
                                                                            flexDirection:
                                                                                lang === 'ar' ? 'row-reverse' : 'row',
                                                                            justifyContent:
                                                                                lang === 'ar'
                                                                                    ? 'flex-end'
                                                                                    : 'flex-start',
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => setSelectedSlip(emp)}
                                                                        >
                                                                            <Eye
                                                                                size={14}
                                                                                className={
                                                                                    lang === 'ar' ? 'ml-1' : 'mr-1'
                                                                                }
                                                                            />{' '}
                                                                            {t('payroll.btnView')}
                                                                        </Button>
                                                                        <Button variant="ghost" size="sm">
                                                                            <Download size={14} />
                                                                        </Button>
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
                            {confirmPay &&
                                (() => {
                                    const emp = employees.find(e => e.id === confirmPay)!;
                                    const empDeductions = getEmpDeductions(confirmPay);
                                    const empTotalDed = getEmpTotalDeductions(confirmPay);
                                    const net = empNetPay(emp, empTotalDed);
                                    return (
                                        <Modal
                                            open
                                            onClose={() => setConfirmPay(null)}
                                            title={t('payroll.confirmPayout')}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 'var(--space-4)',
                                                    direction: lang === 'ar' ? 'rtl' : 'ltr',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        background: 'var(--bg-secondary)',
                                                        borderRadius: 'var(--radius-lg)',
                                                        padding: 'var(--space-4)',
                                                        textAlign: 'start',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontWeight: 'var(--font-semibold)',
                                                            marginBottom: 'var(--space-2)',
                                                        }}
                                                    >
                                                        {emp.name}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: 'var(--text-sm)',
                                                            color: 'var(--text-secondary)',
                                                        }}
                                                    >
                                                        {emp.dept} · {emp.position} ·{' '}
                                                        {(emp as typeof emp & { level?: string }).level || 'Entry'}
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 'var(--space-2)',
                                                        fontSize: 'var(--text-sm)',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>{t('payroll.colBase')}</span>
                                                        <span>
                                                            {emp.baseSalary.toLocaleString()} {t('payroll.egp')}
                                                        </span>
                                                    </div>
                                                    {emp.commission > 0 && (
                                                        <div
                                                            style={{ display: 'flex', justifyContent: 'space-between' }}
                                                        >
                                                            <span>{t('payroll.colCommission')}</span>
                                                            <span>
                                                                {emp.commission.toLocaleString()} {t('payroll.egp')}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {emp.bonus > 0 && (
                                                        <div
                                                            style={{ display: 'flex', justifyContent: 'space-between' }}
                                                        >
                                                            <span>{t('payroll.colBonus')}</span>
                                                            <span>
                                                                {emp.bonus.toLocaleString()} {t('payroll.egp')}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div
                                                        style={{
                                                            borderTop: '1px solid var(--border-color)',
                                                            paddingTop: 'var(--space-2)',
                                                            marginTop: 'var(--space-1)',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                color: 'var(--color-error)',
                                                                marginBottom: 'var(--space-2)',
                                                            }}
                                                        >
                                                            <span>{t('payroll.colDeductions')}</span>
                                                            <span>
                                                                -{empTotalDed.toLocaleString()} {t('payroll.egp')}
                                                            </span>
                                                        </div>
                                                        {empDeductions.map((d, i) => {
                                                            const Icon = getDeductionIcon(d.type);
                                                            const colors = deductionTypeColor(d.type);
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        padding: 'var(--space-1) 0',
                                                                        paddingInlineStart: 'var(--space-3)',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 'var(--space-2)',
                                                                            flexDirection:
                                                                                lang === 'ar' ? 'row-reverse' : 'row',
                                                                        }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                width: 20,
                                                                                height: 20,
                                                                                borderRadius: 'var(--radius-sm)',
                                                                                background: colors.bg,
                                                                                color: colors.color,
                                                                                display: 'inline-flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                flexShrink: 0,
                                                                            }}
                                                                        >
                                                                            <Icon size={11} />
                                                                        </span>
                                                                        <span
                                                                            style={{
                                                                                fontSize: 'var(--text-xs)',
                                                                                color: 'var(--text-secondary)',
                                                                            }}
                                                                        >
                                                                            {t(
                                                                                `payroll.deductLabel.${d.label.toLowerCase().replace(/\s+/g, '_')}`
                                                                            ) !==
                                                                            `payroll.deductLabel.${d.label.toLowerCase().replace(/\s+/g, '_')}`
                                                                                ? t(
                                                                                      `payroll.deductLabel.${d.label.toLowerCase().replace(/\s+/g, '_')}`
                                                                                  )
                                                                                : d.label}
                                                                        </span>
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            fontSize: 'var(--text-xs)',
                                                                            color: 'var(--color-error)',
                                                                        }}
                                                                    >
                                                                        -{d.amount.toLocaleString()} {t('payroll.egp')}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            fontWeight: 'var(--font-bold)',
                                                            borderTop: '1px solid var(--border-color)',
                                                            paddingTop: 'var(--space-2)',
                                                            marginTop: 'var(--space-1)',
                                                        }}
                                                    >
                                                        <span>{t('payroll.colNetPay')}</span>
                                                        <span>
                                                            {net.toLocaleString()} {t('payroll.egp')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-tertiary)',
                                                        textAlign: 'start',
                                                    }}
                                                >
                                                    {t('payroll.paymentTo')}{' '}
                                                    {(() => {
                                                        const pm = getDefaultPm(confirmPay);
                                                        return pm
                                                            ? `${pm.type === 'Bank Transfer' ? t('payroll.typeBankTrans') : pm.type === 'Cash' ? t('payroll.typeCashVal') : pm.type === 'Mobile Wallet' ? t('payroll.typeWalletVal') : pm.type === 'Check' ? t('payroll.typeCheckVal') : pm.type} — ${pm.label} ${pm.details}`
                                                            : t('payroll.noMethodSet');
                                                    })()}
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        gap: 'var(--space-3)',
                                                        justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end',
                                                        flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                                    }}
                                                >
                                                    <Button variant="outline" onClick={() => setConfirmPay(null)}>
                                                        {t('payroll.btnCancel')}
                                                    </Button>
                                                    <Button variant="primary" onClick={() => handlePay(confirmPay)}>
                                                        <CheckCircle
                                                            size={16}
                                                            className={lang === 'ar' ? 'ml-1' : 'mr-1'}
                                                        />{' '}
                                                        {t('payroll.btnConfirmPay')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Modal>
                                    );
                                })()}

                            {/* ═══ ADD DEDUCTION MODAL ═══ */}
                            {showAddDeduction && (
                                <Modal
                                    open
                                    onClose={() => {
                                        setShowAddDeduction(false);
                                        setEditingDeduction(null);
                                        resetDeductionForm();
                                    }}
                                    title={
                                        editingDeduction ? t('payroll.editDeduction') : t('payroll.addDeductionTitle')
                                    }
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 'var(--space-4)',
                                            direction: lang === 'ar' ? 'rtl' : 'ltr',
                                        }}
                                    >
                                        <div>
                                            <label
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-tertiary)',
                                                    display: 'block',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {t('payroll.selectEmployee')}
                                            </label>
                                            <select
                                                value={deductionForm.empId}
                                                onChange={e => setDeductionForm(p => ({ ...p, empId: e.target.value }))}
                                                disabled={!!editingDeduction}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'var(--bg-primary)',
                                                    fontSize: 'var(--text-sm)',
                                                    color: 'var(--text-primary)',
                                                    opacity: editingDeduction ? 0.6 : 1,
                                                }}
                                            >
                                                <option value="">{t('payroll.selectEmployee')}</option>
                                                {employees.map(e => (
                                                    <option key={e.id} value={e.id}>
                                                        {e.name} ({e.id})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-tertiary)',
                                                    display: 'block',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {t('payroll.colType')}
                                            </label>
                                            <select
                                                value={deductionForm.type}
                                                onChange={e => {
                                                    const type = e.target.value as DeductionDetail['type'];
                                                    setDeductionForm(p => ({
                                                        ...p,
                                                        type,
                                                        label: defaultLabelForType(type),
                                                    }));
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'var(--bg-primary)',
                                                    fontSize: 'var(--text-sm)',
                                                    color: 'var(--text-primary)',
                                                }}
                                            >
                                                <option value="attendance">{t('payroll.deductType.attendance')}</option>
                                                <option value="uniform">{t('payroll.deductType.uniform')}</option>
                                                <option value="equipment">{t('payroll.deductType.equipment')}</option>
                                                <option value="material">{t('payroll.deductType.material')}</option>
                                                <option value="custom">{t('payroll.deductType.custom')}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-tertiary)',
                                                    display: 'block',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {t('payroll.deductLabel.label')}
                                            </label>
                                            <input
                                                value={deductionForm.label}
                                                onChange={e => setDeductionForm(p => ({ ...p, label: e.target.value }))}
                                                placeholder={
                                                    deductionForm.type === 'custom'
                                                        ? t('payroll.deductLabel.customPlaceholder')
                                                        : ''
                                                }
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'var(--bg-primary)',
                                                    fontSize: 'var(--text-sm)',
                                                    color: 'var(--text-primary)',
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: 'var(--space-3)',
                                            }}
                                        >
                                            <div>
                                                <label
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-tertiary)',
                                                        display: 'block',
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {t('payroll.deductionAmount')}
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={deductionForm.amount}
                                                    onChange={e =>
                                                        setDeductionForm(p => ({ ...p, amount: e.target.value }))
                                                    }
                                                    placeholder="0"
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px 12px',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: 'var(--radius-md)',
                                                        background: 'var(--bg-primary)',
                                                        fontSize: 'var(--text-sm)',
                                                        color: 'var(--text-primary)',
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-tertiary)',
                                                        display: 'block',
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {t('payroll.deductionDate')}
                                                </label>
                                                <input
                                                    type="date"
                                                    value={deductionForm.date}
                                                    onChange={e =>
                                                        setDeductionForm(p => ({ ...p, date: e.target.value }))
                                                    }
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px 12px',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: 'var(--radius-md)',
                                                        background: 'var(--bg-primary)',
                                                        fontSize: 'var(--text-sm)',
                                                        color: 'var(--text-primary)',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-tertiary)',
                                                    display: 'block',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {t('payroll.deductionDateTime')}
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={deductionForm.datetime}
                                                onChange={e =>
                                                    setDeductionForm(p => ({ ...p, datetime: e.target.value }))
                                                }
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'var(--bg-primary)',
                                                    fontSize: 'var(--text-sm)',
                                                    color: 'var(--text-primary)',
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-tertiary)',
                                                    display: 'block',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {t('payroll.deductionAttachment')}
                                            </label>
                                            <div
                                                style={{
                                                    border: '1px dashed var(--border-color)',
                                                    borderRadius: 'var(--radius-md)',
                                                    padding: 'var(--space-3)',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    background: 'var(--bg-secondary)',
                                                    position: 'relative',
                                                }}
                                            >
                                                {deductionForm.attachment ? (
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            gap: 'var(--space-2)',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 'var(--space-2)',
                                                            }}
                                                        >
                                                            <FileText size={16} color="var(--color-primary-600)" />
                                                            <span
                                                                style={{
                                                                    fontSize: 'var(--text-sm)',
                                                                    color: 'var(--text-primary)',
                                                                }}
                                                            >
                                                                {deductionForm.attachment.name}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                setDeductionForm(p => ({ ...p, attachment: null }))
                                                            }
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                color: 'var(--color-error)',
                                                                padding: 2,
                                                            }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label
                                                        style={{
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            gap: 4,
                                                        }}
                                                    >
                                                        <Plus size={20} color="var(--text-tertiary)" />
                                                        <span
                                                            style={{
                                                                fontSize: 'var(--text-xs)',
                                                                color: 'var(--text-tertiary)',
                                                            }}
                                                        >
                                                            {t('payroll.uploadAttachment')}
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept="image/*,.pdf,.doc,.docx"
                                                            style={{ display: 'none' }}
                                                            onChange={e => {
                                                                const file = e.target.files?.[0];
                                                                if (file)
                                                                    setDeductionForm(p => ({
                                                                        ...p,
                                                                        attachment: {
                                                                            name: file.name,
                                                                            url: URL.createObjectURL(file),
                                                                        },
                                                                    }));
                                                            }}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: 'var(--space-3)',
                                                justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end',
                                                flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                            }}
                                        >
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setShowAddDeduction(false);
                                                    setEditingDeduction(null);
                                                    resetDeductionForm();
                                                }}
                                            >
                                                {t('payroll.btnCancel')}
                                            </Button>
                                            <Button
                                                variant="primary"
                                                onClick={editingDeduction ? handleEditDeduction : handleAddDeduction}
                                            >
                                                <MinusCircle size={16} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />{' '}
                                                {editingDeduction
                                                    ? t('payroll.btnSaveChanges')
                                                    : t('payroll.addDeduction')}
                                            </Button>
                                        </div>
                                    </div>
                                </Modal>
                            )}

                            {/* ═══ PAY SLIP SLIDEOVER ═══ */}
                            {selectedSlip &&
                                (() => {
                                    const emp = selectedSlip;
                                    const slipDeductions = getEmpDeductions(emp.id);
                                    const slipTotalDed = getEmpTotalDeductions(emp.id);
                                    const net = empNetPay(emp, slipTotalDed);
                                    return (
                                        <SlideOver
                                            open
                                            onClose={() => setSelectedSlip(null)}
                                            title={t('payroll.slipTitle')}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 'var(--space-6)',
                                                    direction: lang === 'ar' ? 'rtl' : 'ltr',
                                                }}
                                            >
                                                {/* Header */}
                                                <div
                                                    style={{
                                                        textAlign: 'center',
                                                        paddingBottom: 'var(--space-4)',
                                                        borderBottom: '2px solid var(--color-primary-500)',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: 'var(--text-xl)',
                                                            fontWeight: 'var(--font-bold)',
                                                            color: 'var(--color-primary-600)',
                                                        }}
                                                    >
                                                        HAGZY
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: 'var(--text-xs)',
                                                            color: 'var(--text-tertiary)',
                                                            marginTop: 'var(--space-1)',
                                                        }}
                                                    >
                                                        {t('payroll.slipHeader')}
                                                        {monthLabel}
                                                    </div>
                                                </div>

                                                {/* Employee Info */}
                                                <div style={s.slipSection}>
                                                    <div
                                                        style={{
                                                            ...(s.slipLabel as React.CSSProperties),
                                                            textAlign: 'start',
                                                        }}
                                                    >
                                                        {t('payroll.slipEmpDetails')}
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: '1fr 1fr',
                                                            gap: 'var(--space-3)',
                                                            fontSize: 'var(--text-sm)',
                                                            textAlign: 'start',
                                                        }}
                                                    >
                                                        <div>
                                                            <span style={{ color: 'var(--text-tertiary)' }}>
                                                                {t('payroll.slipName')}
                                                            </span>{' '}
                                                            {emp.name}
                                                        </div>
                                                        <div>
                                                            <span style={{ color: 'var(--text-tertiary)' }}>
                                                                {t('payroll.slipId')}
                                                            </span>{' '}
                                                            {emp.id}
                                                        </div>
                                                        <div>
                                                            <span style={{ color: 'var(--text-tertiary)' }}>
                                                                {t('payroll.slipDept')}
                                                            </span>{' '}
                                                            {emp.dept}
                                                        </div>
                                                        <div>
                                                            <span style={{ color: 'var(--text-tertiary)' }}>
                                                                {t('payroll.slipPos')}
                                                            </span>{' '}
                                                            {emp.position}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Earnings */}
                                                <div style={s.slipSection}>
                                                    <div
                                                        style={{
                                                            ...(s.slipLabel as React.CSSProperties),
                                                            textAlign: 'start',
                                                        }}
                                                    >
                                                        {t('payroll.slipEarnings')}
                                                    </div>
                                                    <div
                                                        style={{
                                                            ...(s.slipRow as React.CSSProperties),
                                                            flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                                        }}
                                                    >
                                                        <span>{t('payroll.slipBasic')}</span>
                                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>
                                                            {emp.baseSalary.toLocaleString()} {t('payroll.egp')}
                                                        </span>
                                                    </div>
                                                    {emp.commission > 0 && (
                                                        <div
                                                            style={{
                                                                ...(s.slipRow as React.CSSProperties),
                                                                flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                                            }}
                                                        >
                                                            <span>{t('payroll.slipCommFeb')}</span>
                                                            <span style={{ fontWeight: 'var(--font-semibold)' }}>
                                                                {emp.commission.toLocaleString()} {t('payroll.egp')}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {emp.bonus > 0 && (
                                                        <div
                                                            style={{
                                                                ...(s.slipRow as React.CSSProperties),
                                                                flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                                            }}
                                                        >
                                                            <span>{t('payroll.slipPerfBonus')}</span>
                                                            <span style={{ fontWeight: 'var(--font-semibold)' }}>
                                                                {emp.bonus.toLocaleString()} {t('payroll.egp')}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {emp.tips > 0 && (
                                                        <div
                                                            style={{
                                                                ...(s.slipRow as React.CSSProperties),
                                                                flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                                            }}
                                                        >
                                                            <span>{lang === 'ar' ? 'البقشيش' : 'Tips'}</span>
                                                            <span style={{ fontWeight: 'var(--font-semibold)' }}>
                                                                {emp.tips.toLocaleString()} {t('payroll.egp')}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div
                                                        style={{
                                                            ...s.slipRow,
                                                            fontWeight: 'var(--font-semibold)',
                                                            color: 'var(--color-success)',
                                                            flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                                        }}
                                                    >
                                                        <span>{t('payroll.slipTotalEarnings')}</span>
                                                        <span>
                                                            {(
                                                                emp.baseSalary +
                                                                emp.commission +
                                                                emp.bonus +
                                                                emp.tips
                                                            ).toLocaleString()}{' '}
                                                            {t('payroll.egp')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Deductions */}
                                                <div style={s.slipSection}>
                                                    <div
                                                        style={{
                                                            ...(s.slipLabel as React.CSSProperties),
                                                            textAlign: 'start',
                                                        }}
                                                    >
                                                        {t('payroll.slipDeductions')}
                                                    </div>
                                                    {slipDeductions.map((d, i) => {
                                                        const Icon = getDeductionIcon(d.type);
                                                        const colors = deductionTypeColor(d.type);
                                                        return (
                                                            <div
                                                                key={i}
                                                                style={{
                                                                    ...(s.slipRow as React.CSSProperties),
                                                                    flexDirection:
                                                                        lang === 'ar' ? 'row-reverse' : 'row',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 'var(--space-2)',
                                                                        flexDirection:
                                                                            lang === 'ar' ? 'row-reverse' : 'row',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            width: 24,
                                                                            height: 24,
                                                                            borderRadius: 'var(--radius-md)',
                                                                            background: colors.bg,
                                                                            color: colors.color,
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            flexShrink: 0,
                                                                        }}
                                                                    >
                                                                        <Icon size={13} />
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            {t(
                                                                                `payroll.deductLabel.${d.label.toLowerCase().replace(/\s+/g, '_')}`
                                                                            ) !==
                                                                            `payroll.deductLabel.${d.label.toLowerCase().replace(/\s+/g, '_')}`
                                                                                ? t(
                                                                                      `payroll.deductLabel.${d.label.toLowerCase().replace(/\s+/g, '_')}`
                                                                                  )
                                                                                : d.label}
                                                                        </span>
                                                                        <span
                                                                            style={{
                                                                                fontSize: 'var(--text-xs)',
                                                                                color: 'var(--text-tertiary)',
                                                                            }}
                                                                        >
                                                                            {d.date}
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                                <span style={{ color: 'var(--color-error)' }}>
                                                                    -{d.amount.toLocaleString()} {t('payroll.egp')}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                    <div
                                                        style={{
                                                            ...s.slipRow,
                                                            fontWeight: 'var(--font-semibold)',
                                                            color: 'var(--color-error)',
                                                            flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                                        }}
                                                    >
                                                        <span>{t('payroll.slipTotalDeduct')}</span>
                                                        <span>
                                                            -{slipTotalDed.toLocaleString()} {t('payroll.egp')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Net Pay */}
                                                <div
                                                    style={{
                                                        ...(s.slipTotal as React.CSSProperties),
                                                        flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                                    }}
                                                >
                                                    <span>{t('payroll.slipNetPay')}</span>
                                                    <span style={{ color: 'var(--color-primary-600)' }}>
                                                        {net.toLocaleString()} {t('payroll.egp')}
                                                    </span>
                                                </div>

                                                {/* Bank */}
                                                <div
                                                    style={{
                                                        background: 'var(--bg-secondary)',
                                                        borderRadius: 'var(--radius-lg)',
                                                        padding: 'var(--space-4)',
                                                        fontSize: 'var(--text-sm)',
                                                        textAlign: 'start',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            color: 'var(--text-tertiary)',
                                                            fontSize: 'var(--text-xs)',
                                                            marginBottom: 'var(--space-1)',
                                                        }}
                                                    >
                                                        {t('payroll.slipMethod')}
                                                    </div>
                                                    <div style={{ fontWeight: 'var(--font-medium)' }}>
                                                        {(() => {
                                                            const pm = getDefaultPm(emp.id);
                                                            return pm
                                                                ? `${pm.type === 'Bank Transfer' ? t('payroll.typeBankTrans') : pm.type === 'Cash' ? t('payroll.typeCashVal') : pm.type === 'Mobile Wallet' ? t('payroll.typeWalletVal') : pm.type === 'Check' ? t('payroll.typeCheckVal') : pm.type} — ${pm.label} ${pm.details}`
                                                                : t('payroll.noMethodSet');
                                                        })()}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        gap: 'var(--space-3)',
                                                        flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                                    }}
                                                >
                                                    <Button variant="outline" style={{ flex: 1 }}>
                                                        <Download
                                                            size={16}
                                                            className={lang === 'ar' ? 'ml-2' : 'mr-2'}
                                                        />{' '}
                                                        {t('payroll.btnDownload')}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        style={{ flex: 1 }}
                                                        onClick={() => setSelectedSlip(null)}
                                                    >
                                                        {t('payroll.btnClose')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </SlideOver>
                                    );
                                })()}

                            {pmEmpId &&
                                (() => {
                                    const emp = employees.find(e => e.id === pmEmpId)!;
                                    const methods = paymentMethods[pmEmpId] || [];
                                    return (
                                        <SlideOver
                                            open
                                            onClose={() => {
                                                setPmEmpId(null);
                                                setPmShowForm(false);
                                                setPmEditing(null);
                                            }}
                                            title={`${t('payroll.pmTitle')}${emp.name}`}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 'var(--space-4)',
                                                    direction: lang === 'ar' ? 'rtl' : 'ltr',
                                                }}
                                            >
                                                {methods.length === 0 && (
                                                    <div
                                                        style={{
                                                            padding: 'var(--space-6)',
                                                            textAlign: 'center',
                                                            color: 'var(--text-tertiary)',
                                                            fontSize: 'var(--text-sm)',
                                                        }}
                                                    >
                                                        {t('payroll.pmEmpty')}
                                                    </div>
                                                )}
                                                {methods.map(m => (
                                                    <div
                                                        key={m.id}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--space-3)',
                                                            padding: 'var(--space-3)',
                                                            background: m.isDefault
                                                                ? 'var(--color-primary-50)'
                                                                : 'var(--bg-secondary)',
                                                            border: `1px solid ${m.isDefault ? 'var(--color-primary-200)' : 'var(--border-color)'}`,
                                                            borderRadius: 'var(--radius-lg)',
                                                            textAlign: 'start',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: 'var(--radius-md)',
                                                                background: 'var(--bg-primary)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'var(--text-secondary)',
                                                            }}
                                                        >
                                                            {pmTypeIcon(m.type)}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div
                                                                style={{
                                                                    fontSize: 'var(--text-sm)',
                                                                    fontWeight: 'var(--font-medium)',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 'var(--space-2)',
                                                                }}
                                                            >
                                                                {m.label}
                                                                {m.isDefault && (
                                                                    <Badge color="primary" size="sm">
                                                                        {t('payroll.pmDefault')}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontSize: 'var(--text-xs)',
                                                                    color: 'var(--text-tertiary)',
                                                                }}
                                                            >
                                                                {m.type === 'Bank Transfer'
                                                                    ? t('payroll.typeBankTrans')
                                                                    : m.type === 'Cash'
                                                                      ? t('payroll.typeCashVal')
                                                                      : m.type === 'Mobile Wallet'
                                                                        ? t('payroll.typeWalletVal')
                                                                        : m.type === 'Check'
                                                                          ? t('payroll.typeCheckVal')
                                                                          : m.type}{' '}
                                                                · {m.details}
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                            {!m.isDefault && (
                                                                <button
                                                                    onClick={() => handleSetDefaultPm(pmEmpId, m.id)}
                                                                    title={t('payroll.pmDefault')}
                                                                    style={{
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        padding: 4,
                                                                        color: 'var(--text-tertiary)',
                                                                    }}
                                                                >
                                                                    <Star size={14} />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => {
                                                                    setPmEditing(m);
                                                                    setPmForm({
                                                                        type: m.type,
                                                                        label: m.label,
                                                                        details: m.details,
                                                                    });
                                                                    setPmShowForm(true);
                                                                }}
                                                                title={t('payroll.pmEdit')}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    padding: 4,
                                                                    color: 'var(--text-tertiary)',
                                                                }}
                                                            >
                                                                <Edit size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePm(pmEmpId, m.id)}
                                                                title={t('payroll.toastPmRemoved')}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    padding: 4,
                                                                    color: 'var(--color-error)',
                                                                }}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                {pmShowForm ? (
                                                    <div
                                                        style={{
                                                            border: '1px solid var(--border-color)',
                                                            borderRadius: 'var(--radius-lg)',
                                                            padding: 'var(--space-4)',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 'var(--space-3)',
                                                            textAlign: 'start',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: 'var(--text-sm)',
                                                                fontWeight: 'var(--font-semibold)',
                                                            }}
                                                        >
                                                            {pmEditing ? t('payroll.pmEdit') : t('payroll.pmAdd')}
                                                        </div>
                                                        <div>
                                                            <label
                                                                style={{
                                                                    fontSize: 'var(--text-xs)',
                                                                    color: 'var(--text-tertiary)',
                                                                    display: 'block',
                                                                    marginBottom: 4,
                                                                }}
                                                            >
                                                                {t('payroll.pmType')}
                                                            </label>
                                                            <select
                                                                value={pmForm.type}
                                                                onChange={e =>
                                                                    setPmForm(p => ({
                                                                        ...p,
                                                                        type: e.target.value as PaymentMethod['type'],
                                                                    }))
                                                                }
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '8px 12px',
                                                                    border: '1px solid var(--border-color)',
                                                                    borderRadius: 'var(--radius-md)',
                                                                    background: 'var(--bg-primary)',
                                                                    fontSize: 'var(--text-sm)',
                                                                    color: 'var(--text-primary)',
                                                                }}
                                                            >
                                                                <option value="Bank Transfer">
                                                                    {t('payroll.typeBankTrans')}
                                                                </option>
                                                                <option value="Cash">{t('payroll.typeCashVal')}</option>
                                                                <option value="Mobile Wallet">
                                                                    {t('payroll.typeWalletVal')}
                                                                </option>
                                                                <option value="Check">
                                                                    {t('payroll.typeCheckVal')}
                                                                </option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label
                                                                style={{
                                                                    fontSize: 'var(--text-xs)',
                                                                    color: 'var(--text-tertiary)',
                                                                    display: 'block',
                                                                    marginBottom: 4,
                                                                }}
                                                            >
                                                                {t('payroll.pmLabel')}
                                                            </label>
                                                            <input
                                                                value={pmForm.label}
                                                                onChange={e =>
                                                                    setPmForm(p => ({ ...p, label: e.target.value }))
                                                                }
                                                                placeholder={
                                                                    pmForm.type === 'Bank Transfer'
                                                                        ? t('payroll.pmPlaceholderBank')
                                                                        : t('payroll.pmPlaceholderName')
                                                                }
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '8px 12px',
                                                                    border: '1px solid var(--border-color)',
                                                                    borderRadius: 'var(--radius-md)',
                                                                    background: 'var(--bg-primary)',
                                                                    fontSize: 'var(--text-sm)',
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                style={{
                                                                    fontSize: 'var(--text-xs)',
                                                                    color: 'var(--text-tertiary)',
                                                                    display: 'block',
                                                                    marginBottom: 4,
                                                                }}
                                                            >
                                                                {t('payroll.pmDetails')}
                                                            </label>
                                                            <input
                                                                value={pmForm.details}
                                                                onChange={e =>
                                                                    setPmForm(p => ({ ...p, details: e.target.value }))
                                                                }
                                                                placeholder={
                                                                    pmForm.type === 'Bank Transfer'
                                                                        ? t('payroll.pmPlaceholderAcc')
                                                                        : t('payroll.pmPlaceholderDetails')
                                                                }
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '8px 12px',
                                                                    border: '1px solid var(--border-color)',
                                                                    borderRadius: 'var(--radius-md)',
                                                                    background: 'var(--bg-primary)',
                                                                    fontSize: 'var(--text-sm)',
                                                                }}
                                                            />
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                gap: 'var(--space-2)',
                                                                justifyContent: 'flex-end',
                                                            }}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setPmShowForm(false);
                                                                    setPmEditing(null);
                                                                }}
                                                            >
                                                                {t('payroll.btnCancel')}
                                                            </Button>
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() =>
                                                                    pmEditing
                                                                        ? handleEditPm(pmEmpId)
                                                                        : handleAddPm(pmEmpId)
                                                                }
                                                            >
                                                                {pmEditing
                                                                    ? t('payroll.btnSaveChanges')
                                                                    : t('payroll.btnAddMethod')}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setPmShowForm(true);
                                                            setPmEditing(null);
                                                            setPmForm({
                                                                type: 'Bank Transfer',
                                                                label: '',
                                                                details: '',
                                                            });
                                                        }}
                                                        style={{ width: '100%' }}
                                                    >
                                                        <Plus size={16} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />{' '}
                                                        {t('payroll.pmAdd')}
                                                    </Button>
                                                )}
                                            </div>
                                        </SlideOver>
                                    );
                                })()}
                        </>
                    ),
                    deductions: <DeductionsPage />,
                    commissions: <CommissionsPage />,
                    commSettings: <CommissionSettingsPage />,
                }}
            </SubTabs>
        </div>
    );
}
