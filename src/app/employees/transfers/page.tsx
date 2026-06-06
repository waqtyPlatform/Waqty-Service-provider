'use client';

import React, { useState, useMemo } from 'react';
import { ArrowRightLeft, Search, Edit, Trash2, Plus } from 'lucide-react';
import { SlideOver, Modal, Input, Select, Button, useToast, EmptyState } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { employeeExtApi, type EmployeeTransfer } from '@/lib/api';

const fallbackData = [
    {
        id: 'TR-001',
        date: '2026-03-16',
        employee: 'Maya Adel',
        from: 'Mall of Arabia',
        to: 'Downtown Branch',
        type: 'Permanent',
        status: 'completed',
        until: '',
    },
    {
        id: 'TR-002',
        date: '2026-03-25',
        employee: 'Rana Fawzy',
        from: 'Downtown Branch',
        to: 'New Cairo Branch',
        type: 'Temporary',
        status: 'active',
        until: '2026-03-12',
    },
    {
        id: 'TR-003',
        date: '2026-03-12',
        employee: 'Salma Karim',
        from: 'New Cairo Branch',
        to: 'Mall of Arabia',
        type: 'Permanent',
        status: 'completed',
        until: '',
    },
    {
        id: 'TR-004',
        date: '2026-03-15',
        employee: 'Nadia Omar',
        from: 'Downtown Branch',
        to: 'New Cairo Branch',
        type: 'Permanent',
        status: 'completed',
        until: '',
    },
    {
        id: 'TR-005',
        date: '2026-03-21',
        employee: 'Yara Emad',
        from: 'New Cairo Branch',
        to: 'Downtown Branch',
        type: 'Temporary',
        status: 'pending',
        until: '2026-03-21',
    },
];

const statusColors: Record<string, { bg: string; color: string }> = {
    completed: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    active: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    pending: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
};

const employeesByBranch: Record<string, string[]> = {
    'Downtown Branch': ['Maya Adel', 'Rana Fawzy', 'Nadia Omar'],
    'Mall of Arabia': ['Khaled Mostafa', 'Salma Karim', 'Tarek Ziad'],
    'New Cairo Branch': ['Yara Emad', 'Ahmed Hassan', 'Dina Nabil'],
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
    },
    filterGroup: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 },
    searchBox: { position: 'relative', width: '100%', maxWidth: 320 },
    searchIcon: {
        position: 'absolute',
        insetInlineStart: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-tertiary)',
    },
    searchInput: {
        width: '100%',
        height: 40,
        paddingInlineStart: 40,
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
    },
    table: {
        width: '100%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
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
    badge: {
        display: 'inline-flex',
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        fontSize: 11,
        fontWeight: 'var(--font-semibold)',
        textTransform: 'capitalize',
    },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
    },
};

export default function TransfersPage() {
    const { t, lang } = useTranslation();

    // ─── API Integration ────────────────────────────────────────────
    const {
        data: apiTransfers,
        loading,
        error,
        refetch,
    } = useApiQuery<EmployeeTransfer[]>(() => employeeExtApi.getTransfers() as never, [], {
        fallbackData: fallbackData,
    });

    const mappedTransfers = useMemo(() => {
        if (apiTransfers && apiTransfers.length > 0) {
            return apiTransfers.map(tr => ({
                id: tr.uuid,
                date: tr.effective_date,
                employee: tr.employee?.name || 'Unknown',
                from: tr.from_branch?.name || 'Unknown',
                to: tr.to_branch?.name || 'Unknown',
                type: tr.type === 'permanent' ? 'Permanent' : 'Temporary',
                status: tr.status === 'completed' ? 'completed' : tr.status === 'approved' ? 'active' : 'pending',
                until: '',
            }));
        }
        return fallbackData;
    }, [apiTransfers]);

    const [localTransfers, setLocalTransfers] = useState<typeof fallbackData | null>(null);
    const transfers = localTransfers ?? mappedTransfers;
    const setTransfers = setLocalTransfers;
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const { addToast } = useToast();

    // Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState<(typeof transfers)[0] | null>(null);

    // Form
    const [formData, setFormData] = useState({
        employee: '',
        date: '',
        from: 'Downtown Branch',
        to: 'Mall of Arabia',
        type: 'Permanent',
        status: 'pending',
        until: '',
    });

    const filtered = transfers.filter(t => {
        const matchesSearch =
            t.employee.toLowerCase().includes(search.toLowerCase()) ||
            t.id.toLowerCase().includes(search.toLowerCase()) ||
            t.from.toLowerCase().includes(search.toLowerCase()) ||
            t.to.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || t.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleSaveAdd = async () => {
        if (!formData.employee) return addToast('error', t('transfers.toastReqEmp'));
        if (!formData.date) return addToast('error', t('transfers.toastReqDate'));
        try {
            await employeeExtApi.createTransfer({
                employee_name: formData.employee,
                from_branch_name: formData.from,
                to_branch_name: formData.to,
                type: formData.type.toLowerCase(),
                effective_date: formData.date,
                reason: null,
            });
            refetch();
        } catch {
            /* fallback */
        }

        const newTransfer = {
            id: `TR-${Date.now().toString().slice(-4)}`,
            employee: formData.employee,
            date: formData.date,
            from: formData.from,
            to: formData.to,
            type: formData.type,
            status: formData.status,
            until: formData.type === 'Temporary' ? formData.until : '',
        };
        setTransfers([newTransfer, ...transfers]);
        setIsAddOpen(false);
        setFormData({
            employee: '',
            date: '',
            from: 'Downtown Branch',
            to: 'Mall of Arabia',
            type: 'Permanent',
            status: 'pending',
            until: '',
        });
        addToast('success', t('transfers.toastAddSec'));
    };

    const handleSaveEdit = () => {
        if (!formData.employee) return addToast('error', t('transfers.toastReqEmp'));
        setTransfers(
            transfers.map(tr =>
                tr.id === selectedTransfer?.id
                    ? {
                          ...tr,
                          employee: formData.employee,
                          date: formData.date,
                          from: formData.from,
                          to: formData.to,
                          type: formData.type,
                          status: formData.status,
                          until: formData.type === 'Temporary' ? formData.until : '',
                      }
                    : tr
            )
        );
        setIsEditOpen(false);
        setSelectedTransfer(null);
        addToast('success', t('transfers.toastUpdSec'));
    };

    const handleDelete = () => {
        setTransfers(transfers.filter(tr => tr.id !== selectedTransfer?.id));
        setIsDeleteOpen(false);
        setSelectedTransfer(null);
        addToast('success', t('transfers.toastDelSec'));
    };

    const openEdit = (t_item: (typeof transfers)[0]) => {
        setSelectedTransfer(t_item);
        setFormData({
            employee: t_item.employee,
            date: t_item.date,
            from: t_item.from,
            to: t_item.to,
            type: t_item.type,
            status: t_item.status,
            until: t_item.until || '',
        });
        setIsEditOpen(true);
    };

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{t('transfers.title')}</div>

            <div style={s.toolbar}>
                <div style={s.filterGroup as React.CSSProperties}>
                    <div style={s.searchBox as React.CSSProperties}>
                        <Search size={16} style={s.searchIcon as React.CSSProperties} />
                        <input
                            style={{
                                ...s.searchInput,
                                paddingInlineEnd: 12,
                            }}
                            placeholder={t('transfers.search')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        options={[
                            { label: t('transfers.filterAll'), value: 'All' },
                            { label: t('transfers.filterPending'), value: 'pending' },
                            { label: t('transfers.filterActive'), value: 'active' },
                            { label: t('transfers.filterCompleted'), value: 'completed' },
                        ]}
                        style={{ width: 160 }}
                    />
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('transfers.newBtn')}
                </Button>
            </div>

            {filtered.length > 0 ? (
                <table style={s.table}>
                    <thead>
                        <tr>
                            {[
                                { label: t('transfers.colId'), key: 'id' },
                                { label: t('transfers.colDate'), key: 'date' },
                                { label: t('transfers.colEmployee'), key: 'employee' },
                                { label: t('transfers.colFrom'), key: 'from' },
                                { label: '', key: 'arrow' },
                                { label: t('transfers.colTo'), key: 'to' },
                                { label: t('transfers.colType'), key: 'type' },
                                { label: t('transfers.colStatus'), key: 'status' },
                                { label: t('transfers.colActions'), key: 'actions' },
                            ].map((h, i) => (
                                <th
                                    key={i}
                                    style={{
                                        ...(s.th as React.CSSProperties),
                                        textAlign: 'start',
                                    }}
                                >
                                    {h.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(row => (
                            <tr key={row.id} className="hoverRow">
                                <td style={s.td}>{row.id}</td>
                                <td style={s.td}>{row.date}</td>
                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>
                                    {row.employee}
                                </td>
                                <td style={s.td}>
                                    {t(
                                        `branchMgt.${({ 'Downtown Branch': 'downtown', 'Mall of Arabia': 'mallOfArabia', 'New Cairo Branch': 'newCairo' } as Record<string, string>)[row.from] || 'downtown'}`
                                    )}
                                </td>
                                <td style={s.td}>
                                    <ArrowRightLeft
                                        size={14}
                                        style={{
                                            color: 'var(--text-tertiary)',
                                            ...(lang === 'ar' ? { transform: 'scaleX(-1)' } : {}),
                                        }}
                                    />
                                </td>
                                <td style={s.td}>
                                    {t(
                                        `branchMgt.${({ 'Downtown Branch': 'downtown', 'Mall of Arabia': 'mallOfArabia', 'New Cairo Branch': 'newCairo' } as Record<string, string>)[row.to] || 'downtown'}`
                                    )}
                                </td>
                                <td style={s.td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {t(`transfers.type${row.type}`)}{' '}
                                        {row.type === 'Temporary' &&
                                            row.until &&
                                            ` (${t('transfers.lblUntil')} ${row.until})`}
                                    </div>
                                </td>
                                <td style={s.td}>
                                    <span style={{ ...s.badge, ...statusColors[row.status] }}>
                                        {t(
                                            `transfers.filter${row.status.charAt(0).toUpperCase() + row.status.slice(1)}`
                                        )}
                                    </span>
                                </td>
                                <td style={s.td}>
                                    <div style={s.actions}>
                                        <button
                                            style={s.btnIcon}
                                            onClick={() => openEdit(row)}
                                            title={t('transfers.btnEdit')}
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            style={{ ...s.btnIcon, color: 'var(--color-error)' }}
                                            onClick={() => {
                                                setSelectedTransfer(row);
                                                setIsDeleteOpen(true);
                                            }}
                                            title={t('transfers.btnDelete')}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <EmptyState
                    icon={<ArrowRightLeft size={32} color="var(--text-tertiary)" />}
                    title={t('transfers.emptyTitle')}
                    description={t('transfers.emptyDesc')}
                />
            )}

            <style>{`
                .hoverRow:hover { background-color: var(--bg-secondary); }
                .hoverRow:last-child td { border-bottom: none !important; }
            `}</style>

            {/* Add SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('transfers.addTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('transfers.btnCancel')}
                        </Button>
                        <Button onClick={handleSaveAdd}>{t('transfers.btnSubmit')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <Select
                            label={t('transfers.lblOrigin')}
                            value={formData.from}
                            onChange={e => setFormData({ ...formData, from: e.target.value, employee: '' })}
                            options={[
                                { label: t('branchMgt.downtown'), value: 'Downtown Branch' },
                                { label: t('branchMgt.mallOfArabia'), value: 'Mall of Arabia' },
                                { label: t('branchMgt.newCairo'), value: 'New Cairo Branch' },
                            ]}
                        />
                        <Select
                            label={t('transfers.lblDest')}
                            value={formData.to}
                            onChange={e => setFormData({ ...formData, to: e.target.value })}
                            options={[
                                { label: t('branchMgt.downtown'), value: 'Downtown Branch' },
                                { label: t('branchMgt.mallOfArabia'), value: 'Mall of Arabia' },
                                { label: t('branchMgt.newCairo'), value: 'New Cairo Branch' },
                            ]}
                        />
                    </div>
                    <Select
                        label={t('transfers.lblEmpName')}
                        value={formData.employee}
                        onChange={e => setFormData({ ...formData, employee: e.target.value })}
                        options={
                            formData.from && employeesByBranch[formData.from]
                                ? [
                                      { label: t('transfers.optSelEmp'), value: '' },
                                      ...employeesByBranch[formData.from].map(emp => ({ label: emp, value: emp })),
                                  ]
                                : [{ label: t('transfers.optSelOrigin'), value: '' }]
                        }
                    />
                    <Input
                        type="date"
                        label={t('transfers.lblDate')}
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                    <Select
                        label={t('transfers.lblType')}
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                        options={[
                            { label: t('transfers.typePermanent'), value: 'Permanent' },
                            { label: t('transfers.typeTemporary'), value: 'Temporary' },
                        ]}
                    />
                    {formData.type === 'Temporary' && (
                        <Input
                            type="date"
                            label={t('transfers.lblRetDate')}
                            value={formData.until}
                            onChange={e => setFormData({ ...formData, until: e.target.value })}
                        />
                    )}
                    <Select
                        label={t('transfers.lblStatus')}
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        options={[
                            { label: t('transfers.filterPending'), value: 'pending' },
                            { label: t('transfers.filterActive'), value: 'active' },
                            { label: t('transfers.filterCompleted'), value: 'completed' },
                        ]}
                    />
                </div>
            </SlideOver>

            {/* Edit SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedTransfer(null);
                }}
                title={t('transfers.editTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('transfers.btnCancel')}
                        </Button>
                        <Button onClick={handleSaveEdit}>{t('transfers.btnSave')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <Select
                            label={t('transfers.lblOrigin')}
                            value={formData.from}
                            onChange={e => setFormData({ ...formData, from: e.target.value, employee: '' })}
                            options={[
                                { label: t('branchMgt.downtown'), value: 'Downtown Branch' },
                                { label: t('branchMgt.mallOfArabia'), value: 'Mall of Arabia' },
                                { label: t('branchMgt.newCairo'), value: 'New Cairo Branch' },
                            ]}
                        />
                        <Select
                            label={t('transfers.lblDest')}
                            value={formData.to}
                            onChange={e => setFormData({ ...formData, to: e.target.value })}
                            options={[
                                { label: t('branchMgt.downtown'), value: 'Downtown Branch' },
                                { label: t('branchMgt.mallOfArabia'), value: 'Mall of Arabia' },
                                { label: t('branchMgt.newCairo'), value: 'New Cairo Branch' },
                            ]}
                        />
                    </div>
                    <Select
                        label={t('transfers.lblEmpName')}
                        value={formData.employee}
                        onChange={e => setFormData({ ...formData, employee: e.target.value })}
                        options={
                            formData.from && employeesByBranch[formData.from]
                                ? [
                                      { label: t('transfers.optSelEmp'), value: '' },
                                      ...employeesByBranch[formData.from].map(emp => ({ label: emp, value: emp })),
                                  ]
                                : [{ label: t('transfers.optSelOrigin'), value: '' }]
                        }
                    />
                    <Input
                        type="date"
                        label={t('transfers.lblDate')}
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                    <Select
                        label={t('transfers.lblType')}
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                        options={[
                            { label: t('transfers.typePermanent'), value: 'Permanent' },
                            { label: t('transfers.typeTemporary'), value: 'Temporary' },
                        ]}
                    />
                    {formData.type === 'Temporary' && (
                        <Input
                            type="date"
                            label={t('transfers.lblRetDate')}
                            value={formData.until}
                            onChange={e => setFormData({ ...formData, until: e.target.value })}
                        />
                    )}
                    <Select
                        label={t('transfers.lblStatus')}
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        options={[
                            { label: t('transfers.filterPending'), value: 'pending' },
                            { label: t('transfers.filterActive'), value: 'active' },
                            { label: t('transfers.filterCompleted'), value: 'completed' },
                        ]}
                    />
                </div>
            </SlideOver>

            {/* Delete Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedTransfer(null);
                }}
                title={t('transfers.delTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('transfers.btnCancel')}
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            {t('transfers.btnDelPerm')}
                        </Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    {t('transfers.delConfirm1')}
                    <strong>{selectedTransfer?.employee}</strong> ({selectedTransfer?.id}){t('transfers.delConfirm2')}
                </p>
            </Modal>
        </div>
    );
}
