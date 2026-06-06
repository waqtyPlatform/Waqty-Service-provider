'use client';

import React, { useState, useMemo } from 'react';
import { Shield, Plus, Edit, Trash2, Users, MoreVertical, Lock } from 'lucide-react';
import { Button, Modal, Input, useToast, DropdownMenu } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import SubTabs from '@/components/SubTabs';
import PermissionsPage from '@/app/employees/permissions/page';
import { useApiQuery } from '@/hooks/useApiQuery';
import { employeeExtApi, type Role as ApiRole } from '@/lib/api';

/* ─── Types ───────────────────────── */
interface Permissions {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}
type RolePermissions = Record<string, Permissions>;

interface Role {
    id: string;
    name: string;
    nameAr: string;
    members: number;
    color: string;
    permissions: RolePermissions;
}

const defaultPerms: Permissions = { view: false, create: false, edit: false, delete: false };
const fullPerms: Permissions = { view: true, create: true, edit: true, delete: true };
const viewOnly: Permissions = { view: true, create: false, edit: false, delete: false };

const modules = [
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

/* ─── Mock Data ───────────────────────── */
const fallbackRoles: Role[] = [
    {
        id: 'R1',
        name: 'Admin',
        nameAr: 'مدير',
        members: 2,
        color: '#ef4444',
        permissions: Object.fromEntries(modules.map(m => [m, fullPerms])),
    },
    {
        id: 'R2',
        name: 'Manager',
        nameAr: 'مشرف',
        members: 3,
        color: '#3b82f6',
        permissions: Object.fromEntries(modules.map(m => [m, m === 'settings' ? viewOnly : fullPerms])),
    },
    {
        id: 'R3',
        name: 'Stylist',
        nameAr: 'مصمم',
        members: 8,
        color: '#10b981',
        permissions: Object.fromEntries(
            modules.map(m => [m, ['dashboard', 'sales', 'customers'].includes(m) ? viewOnly : defaultPerms])
        ),
    },
    {
        id: 'R4',
        name: 'Receptionist',
        nameAr: 'موظف استقبال',
        members: 2,
        color: '#f59e0b',
        permissions: Object.fromEntries(
            modules.map(m => [
                m,
                ['dashboard', 'sales', 'customers', 'transactions'].includes(m)
                    ? { ...viewOnly, create: m === 'sales' || m === 'customers' }
                    : defaultPerms,
            ])
        ),
    },
];

/* ─── Styles ────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' },
    roleCard: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer',
    },
    roleHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    roleColor: { width: 12, height: 12, borderRadius: '50%', flexShrink: 0, marginTop: 4 },
    roleName: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' },
    roleMembers: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
    },
    permSummary: { fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 },
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
        textAlign: 'center',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
    },
    td: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'center',
    },
};

/* ─── Component ─────────────────────────── */
export default function RolesPage() {
    const { t, lang } = useTranslation();
    const { addToast } = useToast();

    // ─── API Integration ────────────────────────────────────────────
    const {
        data: apiRoles,
        loading,
        error,
        isFallback,
        refetch,
    } = useApiQuery<ApiRole[]>(() => employeeExtApi.getRoles() as never, [], { fallbackData: fallbackRoles });

    const mappedRoles: Role[] = useMemo(() => {
        // useApiQuery seeds `data` with the local-shaped `fallbackRoles` and keeps
        // isFallback=false until the request resolves, so detect the API shape by its
        // own field (`employees_count`) rather than relying on isFallback — otherwise
        // the API-shape map runs on local rows on first render (blank members / all
        // permissions false).
        const firstRole = apiRoles?.[0] as { employees_count?: unknown } | undefined;
        const isApiShaped = typeof firstRole?.employees_count === 'number';
        if (apiRoles && apiRoles.length > 0 && isApiShaped && !isFallback) {
            const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6366f1'];
            return apiRoles.map((r, i) => ({
                id: r.uuid,
                name: r.name,
                nameAr: r.description || r.name,
                members: r.employees_count,
                color: colors[i % colors.length],
                permissions: r.permissions
                    ? Object.fromEntries(
                          Object.entries(r.permissions).map(([mod, perms]) => {
                              // API perms are string[]; guard against local-shaped
                              // boolean objects so `.includes` never throws.
                              const list = Array.isArray(perms) ? (perms as string[]) : [];
                              return [
                                  mod,
                                  {
                                      view: list.includes('view'),
                                      create: list.includes('create'),
                                      edit: list.includes('edit'),
                                      delete: list.includes('delete'),
                                  },
                              ];
                          })
                      )
                    : Object.fromEntries(modules.map(m => [m, defaultPerms])),
            }));
        }
        return fallbackRoles;
    }, [apiRoles, isFallback]);

    const [localRoles, setLocalRoles] = useState<Role[] | null>(null);
    const roles = localRoles ?? mappedRoles;
    const setRoles = setLocalRoles;
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleNameAr, setNewRoleNameAr] = useState('');
    const [newRoleColor, setNewRoleColor] = useState('#6366f1');

    const getAccessCount = (perms: RolePermissions) => {
        return Object.values(perms).filter(p => p.view || p.create || p.edit || p.delete).length;
    };

    const handleAddRole = async () => {
        if (!newRoleName) return;
        try {
            await employeeExtApi.createRole({ name: newRoleName, description: newRoleNameAr || newRoleName });
            refetch();
        } catch {
            // Fallback to local state
        }
        const newRole: Role = {
            id: `R${Date.now()}`,
            name: newRoleName,
            nameAr: newRoleNameAr || newRoleName,
            members: 0,
            color: newRoleColor,
            permissions: Object.fromEntries(modules.map(m => [m, defaultPerms])),
        };
        setRoles([...roles, newRole]);
        setIsAddOpen(false);
        setNewRoleName('');
        setNewRoleNameAr('');
        addToast('success', t('roles.roleAdded'));
    };

    const handleDeleteRole = async (id: string) => {
        try {
            await employeeExtApi.deleteRole(id);
            refetch();
        } catch {
            // Fallback to local state
        }
        setRoles(roles.filter(r => r.id !== id));
        addToast('warning', t('roles.roleDeleted'));
    };

    const togglePermission = (module: string, perm: keyof Permissions) => {
        if (!selectedRole) return;
        setSelectedRole({
            ...selectedRole,
            permissions: {
                ...selectedRole.permissions,
                [module]: { ...selectedRole.permissions[module], [perm]: !selectedRole.permissions[module][perm] },
            },
        });
    };

    const savePermissions = async () => {
        if (!selectedRole) return;
        try {
            const permsPayload = Object.fromEntries(
                Object.entries(selectedRole.permissions).map(([mod, p]) => [
                    mod,
                    Object.entries(p)
                        .filter(([, v]) => v)
                        .map(([k]) => k),
                ])
            );
            await employeeExtApi.updateRole(selectedRole.id, { permissions: permsPayload });
            refetch();
        } catch {
            // Fallback to local state
        }
        setRoles(roles.map(r => (r.id === selectedRole.id ? selectedRole : r)));
        setIsEditOpen(false);
        addToast('success', t('roles.permsSaved'));
    };

    const subTabs = [
        { key: 'roles', label: t('empLayout.tabRoles'), icon: <Shield size={14} /> },
        { key: 'permissions', label: t('empLayout.tabPermissions'), icon: <Lock size={14} /> },
    ];

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <SubTabs tabs={subTabs} defaultTab="roles">
                {{
                    roles: (
                        <>
                            <div style={s.toolbar}>
                                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                    {t('roles.title')}
                                </div>
                                <Button onClick={() => setIsAddOpen(true)}>
                                    <Plus size={16} /> {t('roles.addRole')}
                                </Button>
                            </div>

                            {/* Role Cards */}
                            <div style={s.grid}>
                                {roles.map(role => (
                                    <div
                                        key={role.id}
                                        style={s.roleCard}
                                        onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
                                        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                                    >
                                        <div style={s.roleHeader}>
                                            <div
                                                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                                            >
                                                <div style={{ ...s.roleColor, background: role.color }} />
                                                <div style={s.roleName}>{lang === 'ar' ? role.nameAr : role.name}</div>
                                            </div>
                                            <DropdownMenu
                                                trigger={
                                                    <Button variant="ghost" size="sm" iconOnly>
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                }
                                                align={lang === 'ar' ? 'left' : 'right'}
                                                items={[
                                                    {
                                                        label: t('roles.editPerms'),
                                                        icon: <Shield size={14} />,
                                                        onClick: () => {
                                                            setSelectedRole(role);
                                                            setIsEditOpen(true);
                                                        },
                                                    },
                                                    {
                                                        label: t('roles.deleteRole'),
                                                        icon: <Trash2 size={14} />,
                                                        onClick: () => handleDeleteRole(role.id),
                                                        destructive: true,
                                                    },
                                                ]}
                                            />
                                        </div>
                                        <div style={s.roleMembers}>
                                            <Users size={14} /> {role.members} {t('roles.members')}
                                        </div>
                                        <div style={s.permSummary}>
                                            {t('roles.accessTo')} {getAccessCount(role.permissions)}/{modules.length}{' '}
                                            {t('roles.modules')}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedRole(role);
                                                setIsEditOpen(true);
                                            }}
                                        >
                                            <Edit size={14} /> {t('roles.managePerms')}
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Role Modal */}
                            <Modal
                                title={t('roles.addRoleTitle')}
                                open={isAddOpen}
                                onClose={() => setIsAddOpen(false)}
                                footer={
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                                            {t('roles.cancel')}
                                        </Button>
                                        <Button onClick={handleAddRole}>{t('roles.save')}</Button>
                                    </div>
                                }
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <Input
                                        label={t('roles.roleName')}
                                        value={newRoleName}
                                        onChange={e => setNewRoleName(e.target.value)}
                                        placeholder="e.g. Technician"
                                    />
                                    <Input
                                        label={t('roles.roleNameAr')}
                                        value={newRoleNameAr}
                                        onChange={e => setNewRoleNameAr(e.target.value)}
                                        placeholder="مثال: فني"
                                    />
                                    <div>
                                        <label
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 'var(--font-medium)',
                                                marginBottom: 4,
                                                display: 'block',
                                            }}
                                        >
                                            {t('roles.color')}
                                        </label>
                                        <input
                                            type="color"
                                            value={newRoleColor}
                                            onChange={e => setNewRoleColor(e.target.value)}
                                            style={{
                                                width: 48,
                                                height: 36,
                                                border: 'none',
                                                cursor: 'pointer',
                                                borderRadius: 'var(--radius-md)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </Modal>

                            {/* Edit Permissions Modal */}
                            <Modal
                                title={`${t('roles.editPermsFor')} ${selectedRole ? (lang === 'ar' ? selectedRole.nameAr : selectedRole.name) : ''}`}
                                open={isEditOpen}
                                onClose={() => setIsEditOpen(false)}
                                footer={
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                                            {t('roles.cancel')}
                                        </Button>
                                        <Button onClick={savePermissions}>{t('roles.savePerms')}</Button>
                                    </div>
                                }
                            >
                                {selectedRole && (
                                    <div style={s.tableWrapper}>
                                        <table style={s.table}>
                                            <thead>
                                                <tr>
                                                    <th
                                                        style={
                                                            {
                                                                ...s.th,
                                                                textAlign: 'start',
                                                            } as React.CSSProperties
                                                        }
                                                    >
                                                        {t('roles.module')}
                                                    </th>
                                                    <th style={s.th as React.CSSProperties}>{t('roles.view')}</th>
                                                    <th style={s.th as React.CSSProperties}>{t('roles.create')}</th>
                                                    <th style={s.th as React.CSSProperties}>{t('roles.edit')}</th>
                                                    <th style={s.th as React.CSSProperties}>{t('roles.delete')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {modules.map(m => (
                                                    <tr key={m}>
                                                        <td
                                                            style={{
                                                                ...s.td,
                                                                textAlign: 'start',
                                                                fontWeight: 'var(--font-medium)',
                                                            }}
                                                        >
                                                            {lang === 'ar'
                                                                ? modulesAr[m]
                                                                : m.charAt(0).toUpperCase() + m.slice(1)}
                                                        </td>
                                                        {(['view', 'create', 'edit', 'delete'] as const).map(perm => (
                                                            <td key={perm} style={s.td}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        selectedRole.permissions[m]?.[perm] ?? false
                                                                    }
                                                                    onChange={() => togglePermission(m, perm)}
                                                                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Modal>
                        </>
                    ),
                    permissions: <PermissionsPage />,
                }}
            </SubTabs>
        </div>
    );
}
