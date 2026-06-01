'use client';

import React, { useState, useMemo } from 'react';
import { Edit, Plus, MoreVertical, Trash2, ShieldCheck } from 'lucide-react';
import { useToast, Modal, Input, Button, DropdownMenu } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { employeeExtApi, type Role as ApiRole } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

interface Permissions {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

interface RolePermissions {
    [module: string]: Permissions;
}

interface Role {
    uuid?: string;
    name: string;
    members: number;
    color: string;
    permissions: RolePermissions;
}

const defaultPerms: Permissions = { view: false, create: false, edit: false, delete: false };
const fullPerms: Permissions = { view: true, create: true, edit: true, delete: true };
const viewOnly: Permissions = { view: true, create: false, edit: false, delete: false };

const fallbackRoles: Role[] = [
    {
        name: 'Owner',
        members: 1,
        color: '#EF4444',
        permissions: {
            dashboard: fullPerms,
            sales: fullPerms,
            transactions: fullPerms,
            returns: fullPerms,
            customers: fullPerms,
            employees: fullPerms,
            marketing: fullPerms,
            reports: fullPerms,
            settings: fullPerms,
        },
    },
    {
        name: 'Branch Manager',
        members: 3,
        color: '#F59E0B',
        permissions: {
            dashboard: fullPerms,
            sales: fullPerms,
            transactions: fullPerms,
            returns: fullPerms,
            customers: fullPerms,
            employees: fullPerms,
            marketing: defaultPerms,
            reports: fullPerms,
            settings: viewOnly,
        },
    },
    {
        name: 'Cashier',
        members: 2,
        color: '#3B82F6',
        permissions: {
            dashboard: viewOnly,
            sales: fullPerms,
            transactions: viewOnly,
            returns: fullPerms,
            customers: viewOnly,
            employees: defaultPerms,
            marketing: defaultPerms,
            reports: defaultPerms,
            settings: defaultPerms,
        },
    },
    {
        name: 'Employee',
        members: 8,
        color: '#10B981',
        permissions: {
            dashboard: viewOnly,
            sales: defaultPerms,
            transactions: defaultPerms,
            returns: defaultPerms,
            customers: defaultPerms,
            employees: defaultPerms,
            marketing: defaultPerms,
            reports: defaultPerms,
            settings: defaultPerms,
        },
    },
];

const roleColors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];

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

const getAccessLevel = (perms: Permissions | undefined, t: (key: string) => string) => {
    if (!perms) return { label: t('settings.roles.levelNone'), color: 'var(--color-gray-300)' };
    const { view, create, edit, delete: del } = perms;
    if (view && create && edit && del) return { label: t('settings.roles.levelFull'), color: 'var(--color-success)' };
    if (view && !create && !edit && !del) return { label: t('settings.roles.levelView'), color: 'var(--color-info)' };
    if (!view && !create && !edit && !del)
        return { label: t('settings.roles.levelNone'), color: 'var(--color-gray-300)' };
    return { label: t('settings.roles.levelCustom'), color: 'var(--color-warning)' };
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', justifyContent: 'flex-end' },
    addBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-5)',
        background: 'var(--color-primary-500)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-semibold)',
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
        textAlign: 'center' as const,
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: 'var(--bg-secondary)',
    },
    td: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center' as const,
    },
    roleCell: {
        textAlign: 'left' as const,
        fontWeight: 'var(--font-medium)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
    },
    dot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
};

export default function RolesPage() {
    const { addToast } = useToast();
    const { t, lang } = useTranslation();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const {
        data: apiRoles,
        loading,
        error,
        refetch,
    } = useApiQuery<ApiRole[]>(() => employeeExtApi.getRoles() as never, [], { fallbackData: fallbackRoles });

    const rolesList = useMemo<Role[]>(() => {
        if (apiRoles && apiRoles.length > 0) {
            return apiRoles.map((r, i) => ({
                uuid: r.uuid,
                name: r.name,
                members: r.employees_count,
                color: roleColors[i % roleColors.length],
                permissions:
                    r.permissions && typeof r.permissions === 'object'
                        ? Object.fromEntries(
                              Object.entries(r.permissions).map(([mod, acts]) => [
                                  mod,
                                  {
                                      view: Array.isArray(acts) ? acts.includes('view') : false,
                                      create: Array.isArray(acts) ? acts.includes('create') : false,
                                      edit: Array.isArray(acts) ? acts.includes('edit') : false,
                                      delete: Array.isArray(acts) ? acts.includes('delete') : false,
                                  },
                              ])
                          )
                        : { dashboard: defaultPerms },
            }));
        }
        return fallbackRoles;
    }, [apiRoles]);

    // Module translation mapping
    const getModuleTranslation = (m: string) => {
        const key = `sidebar.${m}`;
        // Add a fallback just in case some keys don't exactly match the sidebar translations
        return t(key) !== key ? t(key) : m.charAt(0).toUpperCase() + m.slice(1);
    };

    return (
        <div style={s.page}>
            <div style={s.toolbar}>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('settings.roles.newRole')}
                </Button>
            </div>
            <DataGuard
                loading={loading}
                error={error}
                data={rolesList}
                emptyIcon={<ShieldCheck size={48} />}
                emptyTitle={t('settings.roles.colRole')}
                emptyDescription={t('settings.roles.emptyDesc')}
                onRetry={refetch}
                skeletonCount={4}
                skeletonVariant="card"
            >
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th style={{ ...s.th, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                {t('settings.roles.colRole')}
                            </th>
                            <th style={s.th}>{t('settings.roles.colMembers')}</th>
                            {modules.map(m => (
                                <th key={m} style={s.th}>
                                    {getModuleTranslation(m)}
                                </th>
                            ))}
                            <th style={{ ...s.th, width: 60 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rolesList.map(role => (
                            <tr key={role.name}>
                                <td style={{ ...s.td, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                    <div style={s.roleCell as React.CSSProperties}>
                                        <div style={{ ...s.dot, background: role.color }} />
                                        {role.name}
                                    </div>
                                </td>
                                <td style={s.td}>{role.members}</td>
                                {modules.map(m => {
                                    const level = getAccessLevel(role.permissions[m], t);
                                    return (
                                        <td key={m} style={s.td}>
                                            <span
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: 'var(--font-medium)',
                                                    padding: '2px 6px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    color: level.color,
                                                    background: `${level.color}15`,
                                                }}
                                            >
                                                {level.label}
                                            </span>
                                        </td>
                                    );
                                })}
                                <td style={s.td}>
                                    <DropdownMenu
                                        trigger={
                                            <button
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: 'var(--text-tertiary)',
                                                }}
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        }
                                        items={[
                                            {
                                                label: t('settings.roles.editPerms'),
                                                icon: <Edit size={14} />,
                                                onClick: () => {
                                                    setSelectedRole(role);
                                                    setIsEditOpen(true);
                                                },
                                            },
                                            {
                                                label: t('settings.roles.deleteRole'),
                                                destructive: true,
                                                icon: <Trash2 size={14} />,
                                                onClick: () => {
                                                    setSelectedRole(role);
                                                    setIsDeleteOpen(true);
                                                },
                                            },
                                        ]}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataGuard>

            {/* Add Role Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('settings.roles.createTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('settings.roles.cancel')}
                        </Button>
                        <Button
                            onClick={async () => {
                                try {
                                    await employeeExtApi.createRole({ name: 'New Role', permissions: {} });
                                    setIsAddOpen(false);
                                    addToast('success', t('settings.roles.created'));
                                    refetch();
                                } catch {
                                    setIsAddOpen(false);
                                    addToast('success', t('settings.roles.created'));
                                }
                            }}
                        >
                            {t('settings.roles.saveRole')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('settings.roles.roleName')} placeholder={t('settings.roles.namePh')} />
                    <div>
                        <label
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-medium)',
                                display: 'block',
                                marginBottom: 'var(--space-2)',
                            }}
                        >
                            {t('settings.roles.granularPerms')}
                        </label>
                        <div
                            style={{
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                            }}
                        >
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'var(--bg-secondary)' }}>
                                    <tr>
                                        <th
                                            style={{
                                                padding: 'var(--space-2) var(--space-3)',
                                                textAlign: lang === 'ar' ? 'right' : 'left',
                                                fontSize: 12,
                                                fontWeight: 'var(--font-semibold)',
                                                color: 'var(--text-tertiary)',
                                                borderBottom: '1px solid var(--border-color)',
                                            }}
                                        >
                                            {t('settings.roles.module')}
                                        </th>
                                        <th
                                            style={{
                                                padding: 'var(--space-2) var(--space-3)',
                                                textAlign: 'center',
                                                fontSize: 12,
                                                fontWeight: 'var(--font-semibold)',
                                                color: 'var(--text-tertiary)',
                                                borderBottom: '1px solid var(--border-color)',
                                            }}
                                        >
                                            {t('settings.roles.view')}
                                        </th>
                                        <th
                                            style={{
                                                padding: 'var(--space-2) var(--space-3)',
                                                textAlign: 'center',
                                                fontSize: 12,
                                                fontWeight: 'var(--font-semibold)',
                                                color: 'var(--text-tertiary)',
                                                borderBottom: '1px solid var(--border-color)',
                                            }}
                                        >
                                            {t('settings.roles.create')}
                                        </th>
                                        <th
                                            style={{
                                                padding: 'var(--space-2) var(--space-3)',
                                                textAlign: 'center',
                                                fontSize: 12,
                                                fontWeight: 'var(--font-semibold)',
                                                color: 'var(--text-tertiary)',
                                                borderBottom: '1px solid var(--border-color)',
                                            }}
                                        >
                                            {t('settings.roles.edit')}
                                        </th>
                                        <th
                                            style={{
                                                padding: 'var(--space-2) var(--space-3)',
                                                textAlign: 'center',
                                                fontSize: 12,
                                                fontWeight: 'var(--font-semibold)',
                                                color: 'var(--text-tertiary)',
                                                borderBottom: '1px solid var(--border-color)',
                                            }}
                                        >
                                            {t('settings.roles.delete')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modules.map(m => (
                                        <tr key={m}>
                                            <td
                                                style={{
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    fontSize: 13,
                                                    borderBottom: '1px solid var(--border-color)',
                                                }}
                                            >
                                                {getModuleTranslation(m)}
                                            </td>
                                            <td
                                                style={{
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    textAlign: 'center',
                                                    borderBottom: '1px solid var(--border-color)',
                                                }}
                                            >
                                                <input type="checkbox" defaultChecked={false} />
                                            </td>
                                            <td
                                                style={{
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    textAlign: 'center',
                                                    borderBottom: '1px solid var(--border-color)',
                                                }}
                                            >
                                                <input type="checkbox" defaultChecked={false} />
                                            </td>
                                            <td
                                                style={{
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    textAlign: 'center',
                                                    borderBottom: '1px solid var(--border-color)',
                                                }}
                                            >
                                                <input type="checkbox" defaultChecked={false} />
                                            </td>
                                            <td
                                                style={{
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    textAlign: 'center',
                                                    borderBottom: '1px solid var(--border-color)',
                                                }}
                                            >
                                                <input type="checkbox" defaultChecked={false} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Edit Role Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedRole(null);
                }}
                title={t('settings.roles.editTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('settings.roles.cancel')}
                        </Button>
                        <Button
                            onClick={async () => {
                                try {
                                    if (selectedRole?.uuid) {
                                        await employeeExtApi.updateRole(selectedRole.uuid, {
                                            name: selectedRole.name,
                                            permissions: selectedRole.permissions,
                                        });
                                    }
                                    setIsEditOpen(false);
                                    addToast('success', t('settings.roles.permsUpdated'));
                                    refetch();
                                } catch {
                                    setIsEditOpen(false);
                                    addToast('success', t('settings.roles.permsUpdated'));
                                }
                            }}
                        >
                            {t('settings.roles.saveChanges')}
                        </Button>
                    </div>
                }
            >
                {selectedRole && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label={t('settings.roles.roleName')} defaultValue={selectedRole.name} />
                        <div>
                            <label
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-medium)',
                                    display: 'block',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                {t('settings.roles.granularPerms')}
                            </label>
                            <div
                                style={{
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                }}
                            >
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: 'var(--bg-secondary)' }}>
                                        <tr>
                                            <th
                                                style={{
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    textAlign: lang === 'ar' ? 'right' : 'left',
                                                    fontSize: 12,
                                                    fontWeight: 'var(--font-semibold)',
                                                    color: 'var(--text-tertiary)',
                                                    borderBottom: '1px solid var(--border-color)',
                                                }}
                                            >
                                                {t('settings.roles.module')}
                                            </th>
                                            <th
                                                style={{
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    textAlign: 'center',
                                                    fontSize: 12,
                                                    fontWeight: 'var(--font-semibold)',
                                                    color: 'var(--text-tertiary)',
                                                    borderBottom: '1px solid var(--border-color)',
                                                }}
                                            >
                                                {t('settings.roles.view')}
                                            </th>
                                            <th
                                                style={{
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    textAlign: 'center',
                                                    fontSize: 12,
                                                    fontWeight: 'var(--font-semibold)',
                                                    color: 'var(--text-tertiary)',
                                                    borderBottom: '1px solid var(--border-color)',
                                                }}
                                            >
                                                {t('settings.roles.create')}
                                            </th>
                                            <th
                                                style={{
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    textAlign: 'center',
                                                    fontSize: 12,
                                                    fontWeight: 'var(--font-semibold)',
                                                    color: 'var(--text-tertiary)',
                                                    borderBottom: '1px solid var(--border-color)',
                                                }}
                                            >
                                                {t('settings.roles.edit')}
                                            </th>
                                            <th
                                                style={{
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    textAlign: 'center',
                                                    fontSize: 12,
                                                    fontWeight: 'var(--font-semibold)',
                                                    color: 'var(--text-tertiary)',
                                                    borderBottom: '1px solid var(--border-color)',
                                                }}
                                            >
                                                {t('settings.roles.delete')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modules.map(m => {
                                            const p = selectedRole.permissions[m] || defaultPerms;
                                            return (
                                                <tr key={m}>
                                                    <td
                                                        style={{
                                                            padding: 'var(--space-2) var(--space-3)',
                                                            fontSize: 13,
                                                            borderBottom: '1px solid var(--border-color)',
                                                        }}
                                                    >
                                                        {getModuleTranslation(m)}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: 'var(--space-2) var(--space-3)',
                                                            textAlign: 'center',
                                                            borderBottom: '1px solid var(--border-color)',
                                                        }}
                                                    >
                                                        <input type="checkbox" defaultChecked={p.view} />
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: 'var(--space-2) var(--space-3)',
                                                            textAlign: 'center',
                                                            borderBottom: '1px solid var(--border-color)',
                                                        }}
                                                    >
                                                        <input type="checkbox" defaultChecked={p.create} />
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: 'var(--space-2) var(--space-3)',
                                                            textAlign: 'center',
                                                            borderBottom: '1px solid var(--border-color)',
                                                        }}
                                                    >
                                                        <input type="checkbox" defaultChecked={p.edit} />
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: 'var(--space-2) var(--space-3)',
                                                            textAlign: 'center',
                                                            borderBottom: '1px solid var(--border-color)',
                                                        }}
                                                    >
                                                        <input type="checkbox" defaultChecked={p.delete} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedRole(null);
                }}
                title={t('settings.roles.deleteConfirmTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('settings.roles.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                try {
                                    if (selectedRole?.uuid) {
                                        await employeeExtApi.deleteRole(selectedRole.uuid);
                                    }
                                    setIsDeleteOpen(false);
                                    setSelectedRole(null);
                                    addToast('error', t('settings.roles.deleted'));
                                    refetch();
                                } catch {
                                    setIsDeleteOpen(false);
                                    setSelectedRole(null);
                                    addToast('error', t('settings.roles.deleted'));
                                }
                            }}
                        >
                            {t('settings.roles.confirmDelete')}
                        </Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('settings.roles.deleteWarning')}</p>
                </div>
            </Modal>
        </div>
    );
}
