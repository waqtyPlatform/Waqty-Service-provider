'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, MoreVertical, UserPlus, RefreshCw } from 'lucide-react';
import { useToast, SlideOver, Modal, Input, Button, DropdownMenu, Switch } from '@/components/ui';
import { DataGuard } from '@/components/DataGuard';
import { useTranslation } from '@/hooks/useTranslation';
import { providerApi, ApiError, type PricingGroup, type Employee } from '@/lib/api';

const AVATAR_COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EF4444', '#14B8A6'];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        flexWrap: 'wrap' as const,
    },
    searchWrap: { position: 'relative' as const, flex: 1, maxWidth: 320 },
    searchIcon: {
        position: 'absolute' as const,
        left: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-tertiary)',
        pointerEvents: 'none' as const,
    },
    searchInput: {
        width: '100%',
        height: 40,
        paddingLeft: 40,
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        outline: 'none',
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 'var(--space-5)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-5)',
    },
    cardHead: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-4)',
    },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-tertiary)',
        flexShrink: 0,
    },
    name: { fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-primary)', marginBottom: 4 },
    count: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
    },
    memberRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 0',
        borderTop: '1px solid var(--border-color)',
    },
    memberAvatar: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: 11,
        flexShrink: 0,
    },
    memberName: { fontSize: 'var(--text-sm)', color: 'var(--text-primary)', flex: 1 },
    toggleRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 'var(--space-3)',
        marginTop: 'var(--space-2)',
        borderTop: '1px solid var(--border-color)',
    },
    menuBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4 },
    formGrid: { display: 'flex', flexDirection: 'column' as const, gap: 'var(--space-4)' },
    sectionTitle: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 },
    empPickRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'background 0.15s',
    },
    empPickAvatar: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: 12,
        flexShrink: 0,
    },
    empPickName: { flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    checkBox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        border: '2px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
};

const initials = (name: string) =>
    name
        .trim()
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

interface GrpForm {
    name: string;
    active: boolean;
    employee_uuids: string[];
}
const emptyForm = (): GrpForm => ({ name: '', active: true, employee_uuids: [] });
function grpToForm(g: PricingGroup): GrpForm {
    return { name: g.name, active: g.active, employee_uuids: (g.employees || []).map(e => e.uuid) };
}

interface FormProps {
    form: GrpForm;
    onChange: (f: GrpForm) => void;
    employees: Employee[];
}
function GroupForm({ form, onChange, employees }: FormProps) {
    const set = (p: Partial<GrpForm>) => onChange({ ...form, ...p });
    const toggle = (uuid: string) => {
        const sel = form.employee_uuids.includes(uuid)
            ? form.employee_uuids.filter(u => u !== uuid)
            : [...form.employee_uuids, uuid];
        set({ employee_uuids: sel });
    };
    return (
        <div style={s.formGrid}>
            <Input
                label="Group Name *"
                value={form.name}
                onChange={e => set({ name: e.target.value })}
                placeholder="e.g. Senior Therapists"
            />
            <div>
                <div style={s.sectionTitle}>Assign Employees</div>
                <div
                    style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        maxHeight: 280,
                        overflowY: 'auto' as const,
                    }}
                >
                    {employees.length === 0 ? (
                        <div
                            style={{
                                padding: '16px',
                                textAlign: 'center' as const,
                                color: 'var(--text-tertiary)',
                                fontSize: 'var(--text-sm)',
                            }}
                        >
                            No employees found
                        </div>
                    ) : (
                        employees.map((emp, i) => {
                            const selected = form.employee_uuids.includes(emp.uuid);
                            return (
                                <div
                                    key={emp.uuid}
                                    style={{ ...s.empPickRow, background: selected ? 'var(--color-primary-50)' : '' }}
                                    onClick={() => toggle(emp.uuid)}
                                    onMouseEnter={e => {
                                        if (!selected)
                                            (e.currentTarget as HTMLDivElement).style.background =
                                                'var(--bg-secondary)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLDivElement).style.background = selected
                                            ? 'var(--color-primary-50)'
                                            : '';
                                    }}
                                >
                                    <div
                                        style={{
                                            ...s.empPickAvatar,
                                            background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                                        }}
                                    >
                                        {initials(emp.name)}
                                    </div>
                                    <span style={s.empPickName}>{emp.name}</span>
                                    <div
                                        style={{
                                            ...s.checkBox,
                                            background: selected ? 'var(--color-primary-600)' : '',
                                            borderColor: selected ? 'var(--color-primary-600)' : 'var(--border-color)',
                                        }}
                                    >
                                        {selected && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                <path
                                                    d="M1 4L3.5 6.5L9 1"
                                                    stroke="white"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PricingGroupsPage() {
    const { addToast } = useToast();
    const { lang } = useTranslation();
    const [groups, setGroups] = useState<PricingGroup[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<PricingGroup | null>(null);
    const [addForm, setAddForm] = useState<GrpForm>(emptyForm());
    const [editForm, setEditForm] = useState<GrpForm>(emptyForm());
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await providerApi.getPricingGroups();
            if (res.data) setGroups(res.data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to load pricing groups');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        providerApi
            .getEmployees()
            .then(r => {
                if (r.data) setEmployees(r.data);
            })
            .catch(() => {});
    }, []);

    const handleAdd = async () => {
        if (!addForm.name.trim()) {
            addToast('error', 'Group name is required.');
            return;
        }
        setSaving(true);
        try {
            await providerApi.createPricingGroup({
                name: addForm.name,
                active: addForm.active,
                employee_uuids: addForm.employee_uuids,
            });
            addToast('success', 'Pricing group created.');
            setIsAddOpen(false);
            setAddForm(emptyForm());
            await load();
        } catch (err) {
            const msg =
                err instanceof ApiError && err.validationErrors
                    ? Object.values(err.validationErrors)[0]?.[0]
                    : err instanceof ApiError
                      ? err.message
                      : 'Failed';
            addToast('error', msg || 'Failed to create group');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = async () => {
        if (!selected) return;
        if (!editForm.name.trim()) {
            addToast('error', 'Group name is required.');
            return;
        }
        setSaving(true);
        try {
            await providerApi.updatePricingGroup(selected.uuid, { name: editForm.name, active: editForm.active });
            await providerApi.syncPricingGroupEmployees(selected.uuid, editForm.employee_uuids);
            addToast('success', 'Pricing group updated.');
            setIsEditOpen(false);
            setSelected(null);
            await load();
        } catch (err) {
            const msg =
                err instanceof ApiError && err.validationErrors
                    ? Object.values(err.validationErrors)[0]?.[0]
                    : err instanceof ApiError
                      ? err.message
                      : 'Failed';
            addToast('error', msg || 'Failed to update group');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setDeleting(true);
        try {
            await providerApi.deletePricingGroup(selected.uuid);
            addToast('success', 'Pricing group deleted.');
            setIsDeleteOpen(false);
            setSelected(null);
            await load();
        } catch (err) {
            addToast('error', err instanceof ApiError ? err.message : 'Failed to delete');
        } finally {
            setDeleting(false);
        }
    };

    const handleToggleActive = async (grp: PricingGroup) => {
        setGroups(prev => prev.map(g => (g.uuid === grp.uuid ? { ...g, active: !g.active } : g)));
        try {
            await providerApi.togglePricingGroupActive(grp.uuid);
        } catch (err) {
            setGroups(prev => prev.map(g => (g.uuid === grp.uuid ? { ...g, active: grp.active } : g)));
            addToast('error', err instanceof ApiError ? err.message : 'Failed');
        }
    };

    const filtered = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div style={s.toolbar}>
                <div style={s.searchWrap}>
                    <Search size={16} style={s.searchIcon} />
                    <input
                        style={s.searchInput}
                        placeholder="Search groups..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <Button
                    onClick={() => {
                        setAddForm(emptyForm());
                        setIsAddOpen(true);
                    }}
                >
                    <Plus size={16} style={{ marginInlineEnd: 8 }} /> Add Pricing Group
                </Button>
            </div>

            <DataGuard
                loading={loading}
                error={error}
                data={groups}
                emptyIcon={<Users size={48} />}
                emptyTitle="No pricing groups"
                emptyDescription="Create pricing groups to apply shared prices across employees."
            >
                <div style={s.grid}>
                    {filtered.map(grp => (
                        <div key={grp.uuid} style={s.card}>
                            <div style={s.cardHead}>
                                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                    <div style={s.icon}>
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <div style={s.name}>{grp.name}</div>
                                        <div style={s.count}>{grp.employees?.length ?? 0} employees</div>
                                    </div>
                                </div>
                                <DropdownMenu
                                    trigger={
                                        <button style={s.menuBtn}>
                                            <MoreVertical size={16} />
                                        </button>
                                    }
                                    items={[
                                        {
                                            label: 'Edit',
                                            icon: <Edit size={14} />,
                                            onClick: () => {
                                                setSelected(grp);
                                                setEditForm(grpToForm(grp));
                                                setIsEditOpen(true);
                                            },
                                        },
                                        {
                                            label: 'Delete',
                                            destructive: true,
                                            icon: <Trash2 size={14} />,
                                            onClick: () => {
                                                setSelected(grp);
                                                setIsDeleteOpen(true);
                                            },
                                        },
                                    ]}
                                />
                            </div>

                            {(grp.employees || []).slice(0, 3).map((emp, i) => (
                                <div key={emp.uuid} style={s.memberRow}>
                                    <div
                                        style={{
                                            ...s.memberAvatar,
                                            background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                                        }}
                                    >
                                        {initials(emp.name)}
                                    </div>
                                    <span style={s.memberName}>{emp.name}</span>
                                </div>
                            ))}
                            {(grp.employees?.length ?? 0) > 3 && (
                                <div
                                    style={{
                                        ...s.memberRow,
                                        color: 'var(--text-tertiary)',
                                        fontSize: 'var(--text-xs)',
                                    }}
                                >
                                    <UserPlus size={12} style={{ marginInlineEnd: 6 }} />+
                                    {(grp.employees?.length ?? 0) - 3} more
                                </div>
                            )}

                            <div style={s.toggleRow}>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                    <span
                                        style={{
                                            ...s.badge,
                                            background: grp.active ? '#dcfce7' : '#f3f4f6',
                                            color: grp.active ? '#16a34a' : '#6b7280',
                                        }}
                                    >
                                        {grp.active ? 'Active' : 'Inactive'}
                                    </span>
                                </span>
                                <Switch checked={grp.active} onChange={() => handleToggleActive(grp)} />
                            </div>
                        </div>
                    ))}
                </div>
            </DataGuard>

            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Add Pricing Group"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button onClick={handleAdd} disabled={saving}>
                            {saving ? 'Saving…' : 'Save Group'}
                        </Button>
                    </div>
                }
            >
                <GroupForm form={addForm} onChange={setAddForm} employees={employees} />
            </SlideOver>

            <SlideOver
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelected(null);
                }}
                title="Edit Pricing Group"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button onClick={handleEdit} disabled={saving}>
                            {saving ? (
                                'Saving…'
                            ) : (
                                <>
                                    <RefreshCw size={14} style={{ marginInlineEnd: 6 }} />
                                    Save & Sync
                                </>
                            )}
                        </Button>
                    </div>
                }
            >
                <GroupForm form={editForm} onChange={setEditForm} employees={employees} />
            </SlideOver>

            <Modal
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelected(null);
                }}
                title="Delete Pricing Group"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting…' : 'Delete'}
                        </Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    Delete group <strong>{selected?.name}</strong>? This cannot be undone.
                </p>
            </Modal>
        </div>
    );
}
