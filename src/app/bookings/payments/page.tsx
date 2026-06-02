'use client';

import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
} from 'lucide-react';
import { SlideOver, Modal, Input, Select, Button, useToast } from '@/components/ui';
import { DataGuard } from '@/components/DataGuard';
import { useTranslation } from '@/hooks/useTranslation';
import { providerApi, type BookingPayment as Payment, type CreatePaymentData, ApiError } from '@/lib/api';

// ── Fallback mock data ──────────────────────────────────
const mockPayments: Payment[] = [
    {
        uuid: 'p-001',
        booking_uuid: 'b-001',
        booking: { uuid: 'b-001', booking_date: '2026-05-01', service: { name: 'Hair Coloring' } },
        payment_method: 'cash',
        amount: 350,
        status: 'completed',
        transaction_id: null,
        notes: null,
        created_at: '2026-05-01T10:00:00Z',
        updated_at: '2026-05-01T10:05:00Z',
    },
    {
        uuid: 'p-002',
        booking_uuid: 'b-002',
        booking: { uuid: 'b-002', booking_date: '2026-05-03', service: { name: 'Keratin Treatment' } },
        payment_method: 'paymob',
        amount: 600,
        status: 'pending',
        transaction_id: 'TXN-9128374',
        notes: null,
        created_at: '2026-05-03T11:30:00Z',
        updated_at: '2026-05-03T11:30:00Z',
    },
    {
        uuid: 'p-003',
        booking_uuid: 'b-003',
        booking: { uuid: 'b-003', booking_date: '2026-05-04', service: { name: 'Facial' } },
        payment_method: 'cash',
        amount: 200,
        status: 'refunded',
        transaction_id: null,
        notes: 'Customer cancelled',
        created_at: '2026-05-04T09:00:00Z',
        updated_at: '2026-05-04T14:00:00Z',
    },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    pending: {
        label: 'Pending',
        color: 'var(--color-warning)',
        bg: 'var(--color-warning-light)',
        icon: <Clock size={12} />,
    },
    completed: {
        label: 'Completed',
        color: 'var(--color-success)',
        bg: 'var(--color-success-light)',
        icon: <CheckCircle size={12} />,
    },
    failed: {
        label: 'Failed',
        color: 'var(--color-error)',
        bg: 'var(--color-error-light)',
        icon: <XCircle size={12} />,
    },
    refunded: {
        label: 'Refunded',
        color: 'var(--color-info)',
        bg: 'var(--color-info-light)',
        icon: <RefreshCw size={12} />,
    },
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
    },
    title: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    subtitle: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' },
    kpi: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    kpiVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
    },
    tableWrap: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: {
        padding: 'var(--space-3) var(--space-4)',
        textAlign: 'left' as const,
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        whiteSpace: 'nowrap' as const,
    },
    td: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-color)',
        verticalAlign: 'middle' as const,
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
    },
    paginationRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) var(--space-4)',
        borderTop: '1px solid var(--border-color)',
        flexWrap: 'wrap',
        gap: 'var(--space-2)',
    },
    pageInfo: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    pageBtns: { display: 'flex', gap: 'var(--space-1)' },
    pageBtn: {
        width: 32,
        height: 32,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        fontSize: 'var(--text-sm)',
    },
    pageBtnActive: {
        background: 'var(--color-primary)',
        color: '#fff',
        borderColor: 'var(--color-primary)',
    },
    formGroup: { display: 'flex', flexDirection: 'column' as const, gap: 'var(--space-1)' },
    label: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' },
};

const PER_PAGE = 15;

export default function PaymentsPage() {
    const { lang } = useTranslation();
    const { addToast } = useToast();
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    const [payments, setPayments] = useState<Payment[]>(mockPayments);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const [search, setSearch] = useState('');
    const [methodFilter, setMethodFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [page, setPage] = useState(1);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Payment | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
    const [formData, setFormData] = useState<CreatePaymentData>({
        booking_uuid: '',
        payment_method: 'cash',
        amount: 0,
        status: 'pending',
        transaction_id: '',
        notes: '',
    });

    // Fetch
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        (async () => {
            try {
                const res = await providerApi.getPayments({
                    payment_method: methodFilter !== 'all' ? (methodFilter as 'cash' | 'paymob') : undefined,
                    status: statusFilter !== 'all' ? (statusFilter as Payment['status']) : undefined,
                    from_date: fromDate || undefined,
                    to_date: toDate || undefined,
                    per_page: 100,
                });
                if (!cancelled && res.success && res.data) {
                    setPayments(res.data.length > 0 ? res.data : mockPayments);
                }
            } catch {
                if (!cancelled) setPayments(mockPayments);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [refreshKey, methodFilter, statusFilter, fromDate, toDate]);

    const filtered = payments.filter(p => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            p.uuid.toLowerCase().includes(q) ||
            p.booking_uuid.toLowerCase().includes(q) ||
            (p.booking?.service?.name ?? '').toLowerCase().includes(q) ||
            (p.transaction_id ?? '').toLowerCase().includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const totalRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
    const pendingCount = payments.filter(p => p.status === 'pending').length;
    const refundedTotal = payments.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);

    const openAdd = () => {
        setEditTarget(null);
        setFormData({
            booking_uuid: '',
            payment_method: 'cash',
            amount: 0,
            status: 'pending',
            transaction_id: '',
            notes: '',
        });
        setIsFormOpen(true);
    };

    const openEdit = (p: Payment) => {
        setEditTarget(p);
        setFormData({
            booking_uuid: p.booking_uuid,
            payment_method: p.payment_method,
            amount: p.amount,
            status: p.status,
            transaction_id: p.transaction_id ?? '',
            notes: p.notes ?? '',
        });
        setIsFormOpen(true);
    };

    const handleSave = async () => {
        if (!formData.booking_uuid.trim()) return addToast('error', 'Booking UUID is required');
        if (formData.amount < 0) return addToast('error', 'Amount must be ≥ 0');
        try {
            if (editTarget) {
                await providerApi.updatePayment(editTarget.uuid, formData);
                addToast('success', 'Payment updated');
            } else {
                await providerApi.createPayment(formData);
                addToast('success', 'Payment recorded');
            }
            setIsFormOpen(false);
            setRefreshKey(k => k + 1);
        } catch (err) {
            addToast('error', err instanceof ApiError ? err.message : 'Failed to save payment');
        }
    };

    const handleStatusUpdate = async (p: Payment, newStatus: Payment['status']) => {
        if (!p.uuid.includes('-') || p.uuid.length <= 10) {
            setPayments(prev => prev.map(x => (x.uuid === p.uuid ? { ...x, status: newStatus } : x)));
            return;
        }
        try {
            await providerApi.updatePayment(p.uuid, { status: newStatus });
            setRefreshKey(k => k + 1);
        } catch (err) {
            addToast('error', err instanceof ApiError ? err.message : 'Failed to update');
        }
    };

    return (
        <div style={{ ...s.page, direction: dir }}>
            {/* Header */}
            <div style={s.header}>
                <div>
                    <h1 style={s.title}>Payments</h1>
                    <p style={s.subtitle}>Track and manage booking payments</p>
                </div>
                <Button variant="primary" onClick={openAdd}>
                    <Plus size={16} style={{ marginInlineEnd: 6 }} /> Record Payment
                </Button>
            </div>

            {/* KPIs */}
            <div style={s.kpis}>
                {[
                    {
                        label: 'Collected',
                        value: `${totalRevenue.toLocaleString()} EGP`,
                        icon: <DollarSign size={20} />,
                        color: 'var(--color-success)',
                    },
                    {
                        label: 'Pending',
                        value: String(pendingCount),
                        icon: <Clock size={20} />,
                        color: 'var(--color-warning)',
                    },
                    {
                        label: 'Refunded',
                        value: `${refundedTotal.toLocaleString()} EGP`,
                        icon: <RefreshCw size={20} />,
                        color: 'var(--color-info)',
                    },
                    {
                        label: 'Total Records',
                        value: String(payments.length),
                        icon: <CreditCard size={20} />,
                        color: 'var(--color-primary)',
                    },
                ].map(k => (
                    <div key={k.label} style={s.kpi}>
                        <span style={{ color: k.color }}>{k.icon}</span>
                        <span style={s.kpiVal}>{k.value}</span>
                        <span style={s.kpiLbl}>{k.label}</span>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div style={s.toolbar}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
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
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search payments..."
                        style={{
                            width: '100%',
                            paddingInlineStart: 32,
                            paddingInlineEnd: 12,
                            height: 36,
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-primary)',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
                <Select
                    value={methodFilter}
                    onChange={e => {
                        setMethodFilter(e.target.value);
                        setPage(1);
                    }}
                    options={[
                        { value: 'all', label: 'All Methods' },
                        { value: 'cash', label: 'Cash' },
                        { value: 'paymob', label: 'Paymob' },
                    ]}
                />
                <Select
                    value={statusFilter}
                    onChange={e => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    options={[
                        { value: 'all', label: 'All Statuses' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'failed', label: 'Failed' },
                        { value: 'refunded', label: 'Refunded' },
                    ]}
                />
                <Input
                    type="date"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                    placeholder="From"
                    style={{ width: 140 }}
                />
                <Input
                    type="date"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                    placeholder="To"
                    style={{ width: 140 }}
                />
            </div>

            {/* Table */}
            <DataGuard
                loading={loading}
                error={error}
                data={paginated.length > 0 ? paginated : null}
                emptyIcon={<CreditCard size={40} />}
                emptyTitle="No payments found"
                emptyDescription="Record a payment for a booking to get started."
            >
                <div style={s.tableWrap}>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                {[
                                    'Booking',
                                    'Service',
                                    'Method',
                                    'Amount',
                                    'Status',
                                    'Transaction ID',
                                    'Date',
                                    'Actions',
                                ].map(h => (
                                    <th key={h} style={s.th}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(p => {
                                const cfg = statusConfig[p.status] ?? statusConfig.pending;
                                return (
                                    <tr
                                        key={p.uuid}
                                        style={{ transition: 'background 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = '')}
                                    >
                                        <td style={s.td}>
                                            <span
                                                style={{
                                                    fontFamily: 'monospace',
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-tertiary)',
                                                }}
                                            >
                                                {p.booking_uuid.slice(0, 8)}…
                                            </span>
                                        </td>
                                        <td style={s.td}>{p.booking?.service?.name ?? '—'}</td>
                                        <td style={s.td}>
                                            <span style={{ textTransform: 'capitalize' }}>{p.payment_method}</span>
                                        </td>
                                        <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }}>
                                            {p.amount.toLocaleString()} EGP
                                        </td>
                                        <td style={s.td}>
                                            <span style={{ ...s.badge, background: cfg.bg, color: cfg.color }}>
                                                {cfg.icon} {cfg.label}
                                            </span>
                                        </td>
                                        <td style={s.td}>
                                            <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)' }}>
                                                {p.transaction_id ?? '—'}
                                            </span>
                                        </td>
                                        <td style={s.td}>{new Date(p.created_at).toLocaleDateString()}</td>
                                        <td style={s.td}>
                                            <div
                                                style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}
                                            >
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--color-primary)',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '2px 6px',
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                {p.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(p, 'completed')}
                                                        style={{
                                                            fontSize: 'var(--text-xs)',
                                                            color: 'var(--color-success)',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '2px 6px',
                                                        }}
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                                {p.status === 'completed' && (
                                                    <button
                                                        onClick={() => setDeleteTarget(p)}
                                                        style={{
                                                            fontSize: 'var(--text-xs)',
                                                            color: 'var(--color-info)',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '2px 6px',
                                                        }}
                                                    >
                                                        Refund
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div style={s.paginationRow}>
                        <span style={s.pageInfo}>
                            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
                            {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                        </span>
                        <div style={s.pageBtns}>
                            <button
                                style={s.pageBtn}
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                <ChevronLeft size={14} />
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    style={{ ...s.pageBtn, ...(page === i + 1 ? s.pageBtnActive : {}) }}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                style={s.pageBtn}
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </DataGuard>

            {/* Create/Edit SlideOver */}
            <SlideOver
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editTarget ? 'Edit Payment' : 'Record Payment'}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            {editTarget ? 'Save Changes' : 'Record'}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={s.formGroup}>
                        <label style={s.label}>Booking UUID *</label>
                        <Input
                            value={formData.booking_uuid}
                            onChange={e => setFormData(d => ({ ...d, booking_uuid: e.target.value }))}
                            placeholder="Enter booking UUID"
                            disabled={!!editTarget}
                        />
                    </div>
                    <div style={s.formGroup}>
                        <label style={s.label}>Payment Method *</label>
                        <Select
                            value={formData.payment_method}
                            onChange={e =>
                                setFormData(d => ({ ...d, payment_method: e.target.value as 'cash' | 'paymob' }))
                            }
                            options={[
                                { value: 'cash', label: 'Cash' },
                                { value: 'paymob', label: 'Paymob' },
                            ]}
                        />
                    </div>
                    <div style={s.formGroup}>
                        <label style={s.label}>Amount (EGP) *</label>
                        <Input
                            type="number"
                            value={String(formData.amount)}
                            onChange={e => setFormData(d => ({ ...d, amount: Number(e.target.value) }))}
                            placeholder="0.00"
                        />
                    </div>
                    <div style={s.formGroup}>
                        <label style={s.label}>Status</label>
                        <Select
                            value={formData.status ?? 'pending'}
                            onChange={e => setFormData(d => ({ ...d, status: e.target.value as Payment['status'] }))}
                            options={[
                                { value: 'pending', label: 'Pending' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'failed', label: 'Failed' },
                                { value: 'refunded', label: 'Refunded' },
                            ]}
                        />
                    </div>
                    <div style={s.formGroup}>
                        <label style={s.label}>Transaction ID</label>
                        <Input
                            value={formData.transaction_id ?? ''}
                            onChange={e => setFormData(d => ({ ...d, transaction_id: e.target.value }))}
                            placeholder="External reference (optional)"
                        />
                    </div>
                    <div style={s.formGroup}>
                        <label style={s.label}>Notes</label>
                        <Input
                            value={formData.notes ?? ''}
                            onChange={e => setFormData(d => ({ ...d, notes: e.target.value }))}
                            placeholder="Optional notes"
                        />
                    </div>
                </div>
            </SlideOver>

            {/* Refund Confirm Modal */}
            <Modal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Refund Payment"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (!deleteTarget) return;
                                await handleStatusUpdate(deleteTarget, 'refunded');
                                setDeleteTarget(null);
                            }}
                        >
                            Confirm Refund
                        </Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    Are you sure you want to mark this payment of{' '}
                    <strong>{deleteTarget?.amount.toLocaleString()} EGP</strong> as refunded?
                </p>
            </Modal>
        </div>
    );
}
