'use client';

import React, { useState } from 'react';
import { Shield, Search, Edit } from 'lucide-react';
import { Button, Modal, Select, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { employeeExtApi, type Role } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

/* ─── Types & Data ──────────────────────── */
interface EmpPerm {
    id: string;
    employee: string;
    avatar: string;
    color: string;
    role: string;
    roleAr: string;
    overrides: number;
    modules: Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean }>;
}

const moduleList = [
    'dashboard',
    'sales',
    'transactions',
    'returns',
    'customers',
    'employees',
    'marketing',
    'reports',
    'settings',
];
const modulesAr: Record<string, string> = {
    dashboard: 'لوحة القيادة',
    sales: 'المبيعات',
    transactions: 'المعاملات',
    returns: 'المسترجعات',
    customers: 'العملاء',
    employees: 'الموظفون',
    marketing: 'التسويق',
    reports: 'التقارير',
    settings: 'الإعدادات',
};

const fallbackPerms: EmpPerm[] = [
    {
        id: 'E001',
        employee: 'Sara Ahmed',
        avatar: 'SA',
        color: '#10b981',
        role: 'Manager',
        roleAr: 'مشرف',
        overrides: 2,
        modules: Object.fromEntries(
            moduleList.map(m => [
                m,
                { view: true, create: m !== 'settings', edit: m !== 'settings', delete: m === 'sales' },
            ])
        ),
    },
    {
        id: 'E002',
        employee: 'Nora Ali',
        avatar: 'NA',
        color: '#f59e0b',
        role: 'Stylist',
        roleAr: 'مصمم',
        overrides: 0,
        modules: Object.fromEntries(
            moduleList.map(m => [
                m,
                { view: ['dashboard', 'sales', 'customers'].includes(m), create: false, edit: false, delete: false },
            ])
        ),
    },
    {
        id: 'E003',
        employee: 'Layla Hassan',
        avatar: 'LH',
        color: '#3b82f6',
        role: 'Stylist',
        roleAr: 'مصمم',
        overrides: 1,
        modules: Object.fromEntries(
            moduleList.map(m => [
                m,
                {
                    view: ['dashboard', 'sales', 'customers'].includes(m),
                    create: m === 'customers',
                    edit: false,
                    delete: false,
                },
            ])
        ),
    },
    {
        id: 'E004',
        employee: 'Hana Youssef',
        avatar: 'HY',
        color: '#8b5cf6',
        role: 'Receptionist',
        roleAr: 'موظف استقبال',
        overrides: 0,
        modules: Object.fromEntries(
            moduleList.map(m => [
                m,
                {
                    view: ['dashboard', 'sales', 'customers', 'transactions'].includes(m),
                    create: m === 'sales' || m === 'customers',
                    edit: false,
                    delete: false,
                },
            ])
        ),
    },
    {
        id: 'E005',
        employee: 'Reem Mohamed',
        avatar: 'RM',
        color: '#ec4899',
        role: 'Stylist',
        roleAr: 'مصمم',
        overrides: 0,
        modules: Object.fromEntries(
            moduleList.map(m => [
                m,
                { view: ['dashboard', 'sales', 'customers'].includes(m), create: false, edit: false, delete: false },
            ])
        ),
    },
    {
        id: 'E006',
        employee: 'Dina Kamal',
        avatar: 'DK',
        color: '#6366f1',
        role: 'Stylist',
        roleAr: 'مصمم',
        overrides: 3,
        modules: Object.fromEntries(
            moduleList.map(m => [
                m,
                {
                    view: ['dashboard', 'sales', 'customers', 'marketing'].includes(m),
                    create: m === 'marketing',
                    edit: m === 'marketing',
                    delete: false,
                },
            ])
        ),
    },
];

const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Stylist', label: 'Stylist' },
    { value: 'Receptionist', label: 'Receptionist' },
];

/* ─── Styles ────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
    },
    searchBox: { position: 'relative', width: '100%', maxWidth: 280 },
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
    tableWrapper: {
        width: '100%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'auto',
    },
    table: { width: '100%', minWidth: 600, borderCollapse: 'collapse' },
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
    avatar: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 'var(--font-bold)',
        color: '#fff',
        flexShrink: 0,
    },
    empCell: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
    badge: {
        display: 'inline-flex',
        padding: '2px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: 11,
        fontWeight: 'var(--font-semibold)',
    },
    modalTableWrapper: {
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
    },
    modalTh: {
        padding: 'var(--space-2) var(--space-3)',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
    },
    modalTd: {
        padding: 'var(--space-2) var(--space-3)',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)',
    },
};

/* ─── Component ─────────────────────────── */
export default function PermissionsPage() {
    const { t, lang } = useTranslation();
    const { addToast } = useToast();

    // ─── API Integration ────────────────────────────────────────────
    const {
        data: apiRoles,
        loading,
        error,
        refetch,
    } = useApiQuery<Role[]>(() => employeeExtApi.getRoles() as never, [], { fallbackData: fallbackPerms });

    const [perms, setPerms] = useState(fallbackPerms);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [editingEmp, setEditingEmp] = useState<EmpPerm | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const filtered = perms.filter(emp => {
        const matchSearch = emp.employee.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || emp.role === roleFilter;
        return matchSearch && matchRole;
    });

    const openEdit = (emp: EmpPerm) => {
        setEditingEmp(JSON.parse(JSON.stringify(emp)));
        setIsEditOpen(true);
    };

    const togglePerm = (module: string, perm: 'view' | 'create' | 'edit' | 'delete') => {
        if (!editingEmp) return;
        setEditingEmp({
            ...editingEmp,
            modules: {
                ...editingEmp.modules,
                [module]: { ...editingEmp.modules[module], [perm]: !editingEmp.modules[module][perm] },
            },
        });
    };

    const savePerm = () => {
        if (!editingEmp) return;
        setPerms(perms.map(p => (p.id === editingEmp.id ? editingEmp : p)));
        setIsEditOpen(false);
        addToast('success', t('perms.permsSaved'));
    };

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Toolbar */}
            <div style={s.toolbar}>
                <div
                    style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}
                >
                    <div style={s.searchBox as React.CSSProperties}>
                        <Search size={16} style={s.searchIcon as React.CSSProperties} />
                        <input
                            style={s.searchInput}
                            placeholder={t('perms.searchPlaceholder')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                        options={[{ value: 'all', label: t('perms.allRoles') }, ...roleOptions]}
                        style={{ width: 160 }}
                    />
                </div>
            </div>

            {/* Permissions Table */}
            <DataGuard
                loading={loading}
                error={error}
                data={filtered}
                onRetry={refetch}
                emptyIcon={<Shield size={48} />}
                emptyTitle={t('perms.emptyTitle') || 'No permissions configured'}
                emptyDescription={t('perms.emptyDesc') || 'Employee permissions will appear here.'}
            >
                <div style={s.tableWrapper}>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th as React.CSSProperties}>{t('perms.colEmployee')}</th>
                                <th style={s.th as React.CSSProperties}>{t('perms.colRole')}</th>
                                <th style={s.th as React.CSSProperties}>{t('perms.colOverrides')}</th>
                                <th style={s.th as React.CSSProperties}>{t('perms.colAccessLevel')}</th>
                                <th style={s.th as React.CSSProperties}>{t('perms.colActions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(emp => {
                                const accessCount = Object.values(emp.modules).filter(
                                    m => m.view || m.create || m.edit || m.delete
                                ).length;
                                return (
                                    <tr
                                        key={emp.id}
                                        style={{ transition: 'background 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = '')}
                                    >
                                        <td style={s.td}>
                                            <div style={s.empCell}>
                                                <div style={{ ...s.avatar, background: emp.color }}>{emp.avatar}</div>
                                                <span style={{ fontWeight: 'var(--font-medium)' }}>{emp.employee}</span>
                                            </div>
                                        </td>
                                        <td style={s.td}>
                                            <span
                                                style={{
                                                    ...s.badge,
                                                    background: 'var(--color-primary-100)',
                                                    color: 'var(--color-primary-600)',
                                                }}
                                            >
                                                {lang === 'ar' ? emp.roleAr : emp.role}
                                            </span>
                                        </td>
                                        <td style={s.td}>
                                            {emp.overrides > 0 ? (
                                                <span
                                                    style={{
                                                        ...s.badge,
                                                        background: 'var(--color-warning-light)',
                                                        color: 'var(--color-warning)',
                                                    }}
                                                >
                                                    {emp.overrides} {t('perms.overrides')}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                                            )}
                                        </td>
                                        <td style={s.td}>
                                            <span
                                                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
                                            >
                                                {accessCount}/{moduleList.length} {t('perms.modules')}
                                            </span>
                                        </td>
                                        <td style={s.td}>
                                            <Button variant="outline" size="sm" onClick={() => openEdit(emp)}>
                                                <Edit size={14} /> {t('perms.editPerms')}
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </DataGuard>

            {/* Edit Permissions Modal */}
            <Modal
                title={`${t('perms.editPermsFor')} ${editingEmp?.employee || ''}`}
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('perms.cancel')}
                        </Button>
                        <Button onClick={savePerm}>{t('perms.save')}</Button>
                    </div>
                }
            >
                {editingEmp && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Select
                            label={t('perms.assignRole')}
                            value={editingEmp.role}
                            onChange={e => setEditingEmp({ ...editingEmp, role: e.target.value })}
                            options={roleOptions}
                        />
                        <div style={s.modalTableWrapper}>
                            <table style={{ ...s.table, minWidth: 'auto' }}>
                                <thead>
                                    <tr>
                                        <th
                                            style={
                                                {
                                                    ...s.modalTh,
                                                    textAlign: 'start',
                                                } as React.CSSProperties
                                            }
                                        >
                                            {t('perms.module')}
                                        </th>
                                        <th style={s.modalTh as React.CSSProperties}>{t('perms.view')}</th>
                                        <th style={s.modalTh as React.CSSProperties}>{t('perms.create')}</th>
                                        <th style={s.modalTh as React.CSSProperties}>{t('perms.edit')}</th>
                                        <th style={s.modalTh as React.CSSProperties}>{t('perms.delete')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {moduleList.map(m => (
                                        <tr key={m}>
                                            <td
                                                style={{
                                                    ...s.modalTd,
                                                    textAlign: 'start',
                                                    fontWeight: 'var(--font-medium)',
                                                    fontSize: 13,
                                                }}
                                            >
                                                {lang === 'ar' ? modulesAr[m] : m.charAt(0).toUpperCase() + m.slice(1)}
                                            </td>
                                            {(['view', 'create', 'edit', 'delete'] as const).map(perm => (
                                                <td key={perm} style={s.modalTd}>
                                                    <input
                                                        type="checkbox"
                                                        checked={editingEmp.modules[m]?.[perm] ?? false}
                                                        onChange={() => togglePerm(m, perm)}
                                                        style={{ width: 18, height: 18, cursor: 'pointer' }}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
