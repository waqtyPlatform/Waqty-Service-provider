'use client';

import React, { useState, useMemo } from 'react';
import {
    MinusCircle,
    Search,
    Plus,
    Edit,
    Trash2,
    AlertCircle,
    Shirt,
    Wrench,
    Droplet,
    Paperclip,
    ExternalLink,
    Filter,
} from 'lucide-react';
import { Button, Modal, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

/* ─── Types ──────────────────────────────────────────────────────── */

interface DeductionDetail {
    id: string;
    empId: string;
    empName: string;
    dept: string;
    label: string;
    amount: number;
    type: 'attendance' | 'uniform' | 'equipment' | 'material' | 'custom';
    date: string;
    datetime: string;
    attachment: { name: string; url: string } | null;
}

/* ─── Mock Data ──────────────────────────────────────────────────── */

const employees = [
    { id: 'EMP-001', name: 'Sara Ahmed', dept: 'Hair Care' },
    { id: 'EMP-002', name: 'Nora Ali', dept: 'Skincare' },
    { id: 'EMP-003', name: 'Mona Zein', dept: 'Skincare' },
    { id: 'EMP-004', name: 'Layla Hassan', dept: 'Nails' },
    { id: 'EMP-005', name: 'Reem Mohamed', dept: 'Spa' },
    { id: 'EMP-006', name: 'Huda Farouk', dept: 'Hair Care' },
    { id: 'EMP-007', name: 'Dina Samir', dept: 'Reception' },
];

const initialDeductions: DeductionDetail[] = [
    {
        id: 'D-001',
        empId: 'EMP-001',
        empName: 'Sara Ahmed',
        dept: 'Hair Care',
        label: 'Late arrival penalty',
        amount: 120,
        type: 'attendance',
        date: '2026-03-03',
        datetime: '2026-03-03T09:15',
        attachment: null,
    },
    {
        id: 'D-002',
        empId: 'EMP-001',
        empName: 'Sara Ahmed',
        dept: 'Hair Care',
        label: 'Absence deduction',
        amount: 200,
        type: 'attendance',
        date: '2026-03-14',
        datetime: '2026-03-14T00:00',
        attachment: null,
    },
    {
        id: 'D-003',
        empId: 'EMP-001',
        empName: 'Sara Ahmed',
        dept: 'Hair Care',
        label: 'Material wastage',
        amount: 180,
        type: 'material',
        date: '2026-03-07',
        datetime: '2026-03-07T14:30',
        attachment: { name: 'waste-report.pdf', url: '#' },
    },
    {
        id: 'D-004',
        empId: 'EMP-002',
        empName: 'Nora Ali',
        dept: 'Skincare',
        label: 'Late arrival penalty',
        amount: 150,
        type: 'attendance',
        date: '2026-03-05',
        datetime: '2026-03-05T09:22',
        attachment: null,
    },
    {
        id: 'D-005',
        empId: 'EMP-002',
        empName: 'Nora Ali',
        dept: 'Skincare',
        label: 'Uniform replacement',
        amount: 300,
        type: 'uniform',
        date: '2026-03-02',
        datetime: '2026-03-02T11:00',
        attachment: { name: 'uniform-receipt.jpg', url: '#' },
    },
    {
        id: 'D-006',
        empId: 'EMP-003',
        empName: 'Mona Zein',
        dept: 'Skincare',
        label: 'Equipment damage',
        amount: 280,
        type: 'equipment',
        date: '2026-03-08',
        datetime: '2026-03-08T16:45',
        attachment: { name: 'damage-photo.jpg', url: '#' },
    },
    {
        id: 'D-007',
        empId: 'EMP-003',
        empName: 'Mona Zein',
        dept: 'Skincare',
        label: 'Late arrival penalty',
        amount: 200,
        type: 'attendance',
        date: '2026-03-04',
        datetime: '2026-03-04T09:35',
        attachment: null,
    },
    {
        id: 'D-008',
        empId: 'EMP-004',
        empName: 'Layla Hassan',
        dept: 'Nails',
        label: 'Late arrival penalty',
        amount: 100,
        type: 'attendance',
        date: '2026-03-06',
        datetime: '2026-03-06T09:10',
        attachment: null,
    },
    {
        id: 'D-009',
        empId: 'EMP-004',
        empName: 'Layla Hassan',
        dept: 'Nails',
        label: 'Material wastage',
        amount: 250,
        type: 'material',
        date: '2026-03-12',
        datetime: '2026-03-12T13:20',
        attachment: null,
    },
    {
        id: 'D-010',
        empId: 'EMP-005',
        empName: 'Reem Mohamed',
        dept: 'Spa',
        label: 'Absence deduction',
        amount: 200,
        type: 'attendance',
        date: '2026-03-07',
        datetime: '2026-03-07T00:00',
        attachment: null,
    },
    {
        id: 'D-011',
        empId: 'EMP-005',
        empName: 'Reem Mohamed',
        dept: 'Spa',
        label: 'Uniform replacement',
        amount: 180,
        type: 'uniform',
        date: '2026-03-01',
        datetime: '2026-03-01T10:00',
        attachment: null,
    },
    {
        id: 'D-012',
        empId: 'EMP-006',
        empName: 'Huda Farouk',
        dept: 'Hair Care',
        label: 'Late arrival penalty',
        amount: 120,
        type: 'attendance',
        date: '2026-03-02',
        datetime: '2026-03-02T09:20',
        attachment: null,
    },
    {
        id: 'D-013',
        empId: 'EMP-006',
        empName: 'Huda Farouk',
        dept: 'Hair Care',
        label: 'Equipment damage',
        amount: 300,
        type: 'equipment',
        date: '2026-03-11',
        datetime: '2026-03-11T15:00',
        attachment: { name: 'damage-report.pdf', url: '#' },
    },
    {
        id: 'D-014',
        empId: 'EMP-007',
        empName: 'Dina Samir',
        dept: 'Reception',
        label: 'Late arrival penalty',
        amount: 80,
        type: 'attendance',
        date: '2026-03-05',
        datetime: '2026-03-05T09:08',
        attachment: null,
    },
    {
        id: 'D-015',
        empId: 'EMP-007',
        empName: 'Dina Samir',
        dept: 'Reception',
        label: 'Material wastage',
        amount: 200,
        type: 'material',
        date: '2026-03-10',
        datetime: '2026-03-10T12:15',
        attachment: null,
    },
];

/* ─── Styles ─────────────────────────────────────────────────────── */

const st: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', paddingBottom: 'var(--space-8)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    subtitle: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' },
    kpiCard: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
    },
    kpiIcon: {
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    kpiVal: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
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
    table: { width: '100%', minWidth: 900, borderCollapse: 'collapse' },
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
    formLabel: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
        display: 'block',
        marginBottom: 'var(--space-1)',
    },
    formInput: {
        width: '100%',
        padding: 'var(--space-2) var(--space-3)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
    },
};

let nextId = 100;

/* ─── Component ──────────────────────────────────────────────────── */

export default function DeductionsPage() {
    const { t, lang } = useTranslation();
    const { addToast } = useToast();

    const [deductions, setDeductions] = useState<DeductionDetail[]>(initialDeductions);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterEmployee, setFilterEmployee] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const [form, setForm] = useState({
        empId: '',
        type: 'attendance' as DeductionDetail['type'],
        label: 'Late arrival penalty',
        amount: '',
        date: '',
        datetime: '',
        attachment: null as { name: string; url: string } | null,
    });

    const defaultLabelForType = (type: string) => {
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
            default:
                return '';
        }
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
            default:
                return { bg: 'var(--bg-secondary)', color: 'var(--text-secondary)' };
        }
    };

    const resetForm = () =>
        setForm({
            empId: '',
            type: 'attendance',
            label: 'Late arrival penalty',
            amount: '',
            date: '',
            datetime: '',
            attachment: null,
        });

    const handleAdd = () => {
        if (!form.empId || !form.label || !form.amount || !form.date) return;
        const emp = employees.find(e => e.id === form.empId);
        if (!emp) return;
        const newDeduction: DeductionDetail = {
            id: `D-${++nextId}`,
            empId: form.empId,
            empName: emp.name,
            dept: emp.dept,
            label: form.label,
            amount: Number(form.amount),
            type: form.type,
            date: form.date,
            datetime: form.datetime,
            attachment: form.attachment,
        };
        setDeductions(prev => [...prev, newDeduction]);
        setShowModal(false);
        resetForm();
        addToast('success', t('payroll.toastDeductionAdded'));
    };

    const handleEdit = () => {
        if (!editingId || !form.label || !form.amount || !form.date) return;
        const emp = employees.find(e => e.id === form.empId);
        setDeductions(prev =>
            prev.map(d =>
                d.id === editingId
                    ? {
                          ...d,
                          empId: form.empId,
                          empName: emp?.name || d.empName,
                          dept: emp?.dept || d.dept,
                          label: form.label,
                          amount: Number(form.amount),
                          type: form.type,
                          date: form.date,
                          datetime: form.datetime,
                          attachment: form.attachment,
                      }
                    : d
            )
        );
        setEditingId(null);
        setShowModal(false);
        resetForm();
        addToast('success', t('payroll.toastDeductionUpdated'));
    };

    const handleDelete = (id: string) => {
        setDeductions(prev => prev.filter(d => d.id !== id));
        setConfirmDelete(null);
        addToast('success', t('payroll.toastDeductionDeleted'));
    };

    const openEdit = (d: DeductionDetail) => {
        setEditingId(d.id);
        setForm({
            empId: d.empId,
            type: d.type,
            label: d.label,
            amount: String(d.amount),
            date: d.date,
            datetime: d.datetime,
            attachment: d.attachment,
        });
        setShowModal(true);
    };

    const filtered = useMemo(() => {
        let data = deductions;
        if (filterEmployee !== 'all') data = data.filter(d => d.empId === filterEmployee);
        if (filterType !== 'all') data = data.filter(d => d.type === filterType);
        if (searchQuery)
            data = data.filter(
                d =>
                    d.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    d.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
        return data.sort((a, b) => b.date.localeCompare(a.date));
    }, [deductions, filterEmployee, filterType, searchQuery]);

    const totals = useMemo(
        () => ({
            total: deductions.reduce((s, d) => s + d.amount, 0),
            attendance: deductions.filter(d => d.type === 'attendance').reduce((s, d) => s + d.amount, 0),
            uniform: deductions.filter(d => d.type === 'uniform').reduce((s, d) => s + d.amount, 0),
            equipment: deductions.filter(d => d.type === 'equipment').reduce((s, d) => s + d.amount, 0),
            material: deductions.filter(d => d.type === 'material').reduce((s, d) => s + d.amount, 0),
        }),
        [deductions]
    );

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDateTime = (dtStr: string) => {
        if (!dtStr) return '—';
        const d = new Date(dtStr);
        return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={st.page}>
            {/* Header */}
            <div style={{ ...st.header, flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                <div style={{ textAlign: 'start' }}>
                    <div style={st.title}>{t('payroll.allDeductions')}</div>
                    <div style={st.subtitle}>{t('payroll.deductionsSubtitle')}</div>
                </div>
                <Button
                    variant="primary"
                    onClick={() => {
                        resetForm();
                        setEditingId(null);
                        setShowModal(true);
                    }}
                >
                    <Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('payroll.addDeduction')}
                </Button>
            </div>

            {/* KPI Cards */}
            <div style={st.kpiGrid}>
                <div style={st.kpiCard}>
                    <div style={{ ...st.kpiIcon, background: '#FEE2E2', color: '#DC2626' }}>
                        <MinusCircle size={20} />
                    </div>
                    <div>
                        <div style={st.kpiVal}>
                            {totals.total.toLocaleString()} {t('payroll.egp')}
                        </div>
                        <div style={st.kpiLbl}>{t('payroll.totalDeductionsAll')}</div>
                    </div>
                </div>
                <div style={st.kpiCard}>
                    <div style={{ ...st.kpiIcon, background: '#FEF3C7', color: '#B45309' }}>
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <div style={st.kpiVal}>
                            {totals.attendance.toLocaleString()} {t('payroll.egp')}
                        </div>
                        <div style={st.kpiLbl}>{t('payroll.deductType.attendance')}</div>
                    </div>
                </div>
                <div style={st.kpiCard}>
                    <div style={{ ...st.kpiIcon, background: '#DBEAFE', color: '#2563EB' }}>
                        <Shirt size={20} />
                    </div>
                    <div>
                        <div style={st.kpiVal}>
                            {totals.uniform.toLocaleString()} {t('payroll.egp')}
                        </div>
                        <div style={st.kpiLbl}>{t('payroll.deductType.uniform')}</div>
                    </div>
                </div>
                <div style={st.kpiCard}>
                    <div style={{ ...st.kpiIcon, background: '#FEE2E2', color: '#DC2626' }}>
                        <Wrench size={20} />
                    </div>
                    <div>
                        <div style={st.kpiVal}>
                            {totals.equipment.toLocaleString()} {t('payroll.egp')}
                        </div>
                        <div style={st.kpiLbl}>{t('payroll.deductType.equipment')}</div>
                    </div>
                </div>
                <div style={st.kpiCard}>
                    <div style={{ ...st.kpiIcon, background: '#E0E7FF', color: '#4338CA' }}>
                        <Droplet size={20} />
                    </div>
                    <div>
                        <div style={st.kpiVal}>
                            {totals.material.toLocaleString()} {t('payroll.egp')}
                        </div>
                        <div style={st.kpiLbl}>{t('payroll.deductType.material')}</div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div
                style={{ ...(st.toolbar as React.CSSProperties), flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Filter size={16} color="var(--text-tertiary)" />
                    <select
                        value={filterEmployee}
                        onChange={e => setFilterEmployee(e.target.value)}
                        style={st.formInput as React.CSSProperties}
                    >
                        <option value="all">{t('payroll.filterByEmployee')}</option>
                        {employees.map(e => (
                            <option key={e.id} value={e.id}>
                                {e.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        style={st.formInput as React.CSSProperties}
                    >
                        <option value="all">{t('payroll.filterByType')}</option>
                        <option value="attendance">{t('payroll.deductType.attendance')}</option>
                        <option value="uniform">{t('payroll.deductType.uniform')}</option>
                        <option value="equipment">{t('payroll.deductType.equipment')}</option>
                        <option value="material">{t('payroll.deductType.material')}</option>
                        <option value="custom">{t('payroll.deductType.custom')}</option>
                    </select>
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
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
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

            {/* Table */}
            <div style={st.tableWrapper}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={st.table}>
                        <thead>
                            <tr style={{ textAlign: 'start' }}>
                                <th style={st.th as React.CSSProperties}>{t('payroll.colEmployee')}</th>
                                <th style={st.th as React.CSSProperties}>{t('payroll.colType')}</th>
                                <th style={st.th as React.CSSProperties}>{t('payroll.colDescription')}</th>
                                <th style={st.th as React.CSSProperties}>{t('payroll.colAmount')}</th>
                                <th style={st.th as React.CSSProperties}>{t('payroll.colDateTime')}</th>
                                <th style={st.th as React.CSSProperties}>{t('payroll.colAttachment')}</th>
                                <th style={st.th as React.CSSProperties}>{t('payroll.colActions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(d => {
                                const Icon = getDeductionIcon(d.type);
                                const colors = deductionTypeColor(d.type);
                                return (
                                    <tr
                                        key={d.id}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = '')}
                                    >
                                        <td style={st.td}>
                                            <div style={{ fontWeight: 'var(--font-medium)' }}>{d.empName}</div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                {d.dept} · {d.empId}
                                            </div>
                                        </td>
                                        <td style={st.td}>
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-2)',
                                                    padding: '3px var(--space-3)',
                                                    borderRadius: 'var(--radius-full)',
                                                    background: colors.bg,
                                                    color: colors.color,
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: 'var(--font-medium)',
                                                }}
                                            >
                                                <Icon size={12} />
                                                {t(`payroll.deductType.${d.type}`)}
                                            </span>
                                        </td>
                                        <td style={st.td}>
                                            {t(`payroll.deductLabel.${d.label.toLowerCase().replace(/\s+/g, '_')}`) !==
                                            `payroll.deductLabel.${d.label.toLowerCase().replace(/\s+/g, '_')}`
                                                ? t(`payroll.deductLabel.${d.label.toLowerCase().replace(/\s+/g, '_')}`)
                                                : d.label}
                                        </td>
                                        <td
                                            style={{
                                                ...st.td,
                                                fontWeight: 'var(--font-semibold)',
                                                color: 'var(--color-error)',
                                            }}
                                        >
                                            -{d.amount.toLocaleString()} {t('payroll.egp')}
                                        </td>
                                        <td style={st.td}>
                                            <div>{formatDate(d.date)}</div>
                                            {d.datetime && (
                                                <div
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-tertiary)',
                                                    }}
                                                >
                                                    {formatDateTime(d.datetime)}
                                                </div>
                                            )}
                                        </td>
                                        <td style={st.td}>
                                            {d.attachment ? (
                                                <a
                                                    href={d.attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 'var(--space-1)',
                                                        color: 'var(--color-primary-600)',
                                                        fontSize: 'var(--text-xs)',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <Paperclip size={12} />
                                                    {d.attachment.name}
                                                    <ExternalLink size={10} />
                                                </a>
                                            ) : (
                                                <span
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-tertiary)',
                                                    }}
                                                >
                                                    {t('payroll.noAttachment')}
                                                </span>
                                            )}
                                        </td>
                                        <td style={st.td}>
                                            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                <button
                                                    onClick={() => openEdit(d)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: 'var(--space-2)',
                                                        color: 'var(--text-tertiary)',
                                                        borderRadius: 'var(--radius-sm)',
                                                    }}
                                                    title={t('payroll.editDeduction')}
                                                >
                                                    <Edit size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(d.id)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: 'var(--space-2)',
                                                        color: 'var(--color-error)',
                                                        borderRadius: 'var(--radius-sm)',
                                                    }}
                                                    title={t('payroll.deleteDeduction')}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        style={{
                                            ...st.td,
                                            textAlign: 'center',
                                            padding: 'var(--space-8)',
                                            color: 'var(--text-tertiary)',
                                        }}
                                    >
                                        {t('payroll.noDeductions')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'var(--space-2) 0' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                    {filtered.length} {t('payroll.deductions').toLowerCase()} ·{' '}
                    <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-error)' }}>
                        -{filtered.reduce((s, d) => s + d.amount, 0).toLocaleString()} {t('payroll.egp')}
                    </span>
                </div>
            </div>

            {/* ═══ ADD/EDIT MODAL ═══ */}
            {showModal && (
                <Modal
                    open
                    onClose={() => {
                        setShowModal(false);
                        setEditingId(null);
                        resetForm();
                    }}
                    title={editingId ? t('payroll.editDeduction') : t('payroll.addDeductionTitle')}
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
                            <label style={st.formLabel}>{t('payroll.selectEmployee')}</label>
                            <select
                                value={form.empId}
                                onChange={e => setForm(p => ({ ...p, empId: e.target.value }))}
                                disabled={!!editingId}
                                style={{ ...(st.formInput as React.CSSProperties), opacity: editingId ? 0.6 : 1 }}
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
                            <label style={st.formLabel}>{t('payroll.colType')}</label>
                            <select
                                value={form.type}
                                onChange={e => {
                                    const type = e.target.value as DeductionDetail['type'];
                                    setForm(p => ({ ...p, type, label: defaultLabelForType(type) }));
                                }}
                                style={st.formInput as React.CSSProperties}
                            >
                                <option value="attendance">{t('payroll.deductType.attendance')}</option>
                                <option value="uniform">{t('payroll.deductType.uniform')}</option>
                                <option value="equipment">{t('payroll.deductType.equipment')}</option>
                                <option value="material">{t('payroll.deductType.material')}</option>
                                <option value="custom">{t('payroll.deductType.custom')}</option>
                            </select>
                        </div>
                        <div>
                            <label style={st.formLabel}>{t('payroll.deductLabel.label')}</label>
                            <input
                                value={form.label}
                                onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                                placeholder={form.type === 'custom' ? t('payroll.deductLabel.customPlaceholder') : ''}
                                style={st.formInput as React.CSSProperties}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                            <div>
                                <label style={st.formLabel}>{t('payroll.deductionAmount')}</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.amount}
                                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                                    placeholder="0"
                                    style={st.formInput as React.CSSProperties}
                                />
                            </div>
                            <div>
                                <label style={st.formLabel}>{t('payroll.deductionDate')}</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                                    style={st.formInput as React.CSSProperties}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={st.formLabel}>{t('payroll.deductionDateTime')}</label>
                            <input
                                type="datetime-local"
                                value={form.datetime}
                                onChange={e => setForm(p => ({ ...p, datetime: e.target.value }))}
                                style={st.formInput as React.CSSProperties}
                            />
                        </div>
                        <div>
                            <label style={st.formLabel}>{t('payroll.deductionAttachment')}</label>
                            <div
                                style={{
                                    border: '1px dashed var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 'var(--space-3)',
                                    textAlign: 'center',
                                    background: 'var(--bg-secondary)',
                                }}
                            >
                                {form.attachment ? (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: 'var(--space-2)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <Paperclip size={16} color="var(--color-primary-600)" />
                                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                                                {form.attachment.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setForm(p => ({ ...p, attachment: null }))}
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
                                            gap: 'var(--space-1)',
                                        }}
                                    >
                                        <Paperclip size={20} color="var(--text-tertiary)" />
                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            {t('payroll.uploadAttachment')}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf,.doc,.docx"
                                            style={{ display: 'none' }}
                                            onChange={e => {
                                                const file = e.target.files?.[0];
                                                if (file)
                                                    setForm(p => ({
                                                        ...p,
                                                        attachment: { name: file.name, url: URL.createObjectURL(file) },
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
                                    setShowModal(false);
                                    setEditingId(null);
                                    resetForm();
                                }}
                            >
                                {t('payroll.btnCancel')}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={editingId ? handleEdit : handleAdd}
                                disabled={!form.empId || !form.label || !form.amount || !form.date}
                            >
                                <MinusCircle size={16} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />
                                {editingId ? t('payroll.btnSaveChanges') : t('payroll.addDeduction')}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* ═══ DELETE CONFIRMATION ═══ */}
            {confirmDelete && (
                <Modal open onClose={() => setConfirmDelete(null)} title={t('payroll.deleteDeduction')}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                            {lang === 'ar'
                                ? 'هل أنت متأكد من حذف هذا الخصم؟ لا يمكن التراجع عن هذا الإجراء.'
                                : 'Are you sure you want to delete this deduction? This action cannot be undone.'}
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                                {t('payroll.btnCancel')}
                            </Button>
                            <Button variant="destructive" onClick={() => handleDelete(confirmDelete)}>
                                <Trash2 size={16} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />{' '}
                                {t('payroll.deleteDeduction')}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
