'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Edit, Plus, Check, X, MoreVertical, Trash2 } from 'lucide-react';
import { useToast, Modal, Input, Button, DropdownMenu } from '@/components/ui';

const tabs = [
    { label: 'General', href: '/settings' },
    { label: 'Branches', href: '/settings/branches' },
    { label: 'Services', href: '/settings/services' },
    { label: 'Invoice', href: '/settings/invoice' },
    { label: 'Devices', href: '/settings/devices' },
    { label: 'Integrations', href: '/settings/integrations' },
    { label: 'Roles', href: '/settings/roles' },
    { label: 'Audit Log', href: '/settings/audit-log' },
    { label: 'Subscription', href: '/settings/subscription' },
];

const roles = [
    { name: 'Owner', members: 1, color: '#EF4444', permissions: { dashboard: true, sales: true, transactions: true, returns: true, customers: true, employees: true, marketing: true, reports: true, settings: true } },
    { name: 'Branch Manager', members: 3, color: '#F59E0B', permissions: { dashboard: true, sales: true, transactions: true, returns: true, customers: true, employees: true, marketing: false, reports: true, settings: false } },
    { name: 'Cashier', members: 2, color: '#3B82F6', permissions: { dashboard: true, sales: true, transactions: true, returns: true, customers: false, employees: false, marketing: false, reports: false, settings: false } },
    { name: 'Employee', members: 8, color: '#10B981', permissions: { dashboard: true, sales: false, transactions: false, returns: false, customers: false, employees: false, marketing: false, reports: false, settings: false } },
];

const modules = ['dashboard', 'sales', 'transactions', 'returns', 'customers', 'employees', 'marketing', 'reports', 'settings'];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: { display: 'flex', justifyContent: 'flex-end' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'center' as const, fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', textAlign: 'center' as const },
    roleCell: { textAlign: 'left' as const, fontWeight: 'var(--font-medium)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
    dot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
};

export default function RolesPage() {
    const { addToast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>(null);

    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/settings/roles' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>
            <div style={s.toolbar}><Button onClick={() => setIsAddOpen(true)}><Plus size={16} style={{ marginRight: 8 }} /> New Role</Button></div>
            <table style={s.table}>
                <thead>
                    <tr>
                        <th style={{ ...s.th, textAlign: 'left' }}>Role</th>
                        <th style={s.th}>Members</th>
                        {modules.map(m => <th key={m} style={s.th}>{m.charAt(0).toUpperCase() + m.slice(1)}</th>)}
                        <th style={{ ...s.th, width: 60 }}></th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map(role => (
                        <tr key={role.name}>
                            <td style={{ ...s.td, textAlign: 'left' }}><div style={s.roleCell as React.CSSProperties}><div style={{ ...s.dot, background: role.color }} />{role.name}</div></td>
                            <td style={s.td}>{role.members}</td>
                            {modules.map(m => (
                                <td key={m} style={s.td}>
                                    {(role.permissions as Record<string, boolean>)[m]
                                        ? <Check size={16} style={{ color: 'var(--color-success)' }} />
                                        : <X size={16} style={{ color: 'var(--color-gray-300)' }} />}
                                </td>
                            ))}
                            <td style={s.td}>
                                <DropdownMenu
                                    trigger={<button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><MoreVertical size={16} /></button>}
                                    items={[
                                        { label: 'Edit Permissions', icon: <Edit size={14} />, onClick: () => { setSelectedRole(role); setIsEditOpen(true); } },
                                        { label: 'Delete Role', destructive: true, icon: <Trash2 size={14} />, onClick: () => { setSelectedRole(role); setIsDeleteOpen(true); } }
                                    ]}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Role Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create New Role"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Role created successfully'); }}>Save Role</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Role Name" placeholder="e.g. Assistant Manager" />
                    <div>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Toggle Module Access</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                            {modules.map(m => (
                                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <input type="checkbox" id={`add-${m}`} defaultChecked={false} />
                                    <label htmlFor={`add-${m}`} style={{ fontSize: 'var(--text-sm)' }}>{m.charAt(0).toUpperCase() + m.slice(1)}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Edit Role Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedRole(null); }}
                title="Edit Role Permissions"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Role permissions updated'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedRole && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Role Name" defaultValue={selectedRole.name} />
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Toggle Module Access</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                                {modules.map(m => (
                                    <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <input type="checkbox" id={`edit-${m}`} defaultChecked={(selectedRole.permissions as Record<string, boolean>)[m]} />
                                        <label htmlFor={`edit-${m}`} style={{ fontSize: 'var(--text-sm)' }}>{m.charAt(0).toUpperCase() + m.slice(1)}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedRole(null); }}
                title="Delete Role"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Role deleted successfully'); }}>Confirm Delete</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to delete the <strong>{selectedRole?.name}</strong> role? Expanding members need to be reassigned to a different role first.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
