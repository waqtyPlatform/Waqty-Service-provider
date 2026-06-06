'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useToast, Modal, Input, Button, Select } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { customerApi, type CustomerGroup } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

const fallbackGroups: {
    id: number;
    name: string;
    members: number;
    discount: number;
    color: string;
    description: string;
    status: string;
    uuid: string;
}[] = [
    {
        id: 1,
        uuid: 'g1',
        name: 'VIP Clients',
        members: 24,
        discount: 15,
        color: '#F59E0B',
        description: 'High-value repeat clients with priority booking',
        status: 'active',
    },
    {
        id: 2,
        uuid: 'g2',
        name: 'Regular Members',
        members: 86,
        discount: 5,
        color: '#3B82F6',
        description: 'Standard membership with basic benefits',
        status: 'active',
    },
    {
        id: 3,
        uuid: 'g3',
        name: 'New Clients',
        members: 32,
        discount: 10,
        color: '#10B981',
        description: 'First-time visitors with welcome offer',
        status: 'active',
    },
    {
        id: 4,
        uuid: 'g4',
        name: 'Corporate Partners',
        members: 15,
        discount: 20,
        color: '#8B5CF6',
        description: 'Company partnership program employees',
        status: 'active',
    },
    {
        id: 5,
        uuid: 'g5',
        name: 'Student Discount',
        members: 18,
        discount: 25,
        color: '#EC4899',
        description: 'Verified students with valid ID',
        status: 'active',
    },
    {
        id: 6,
        uuid: 'g6',
        name: 'Loyalty Platinum',
        members: 8,
        discount: 30,
        color: '#6B7280',
        description: 'Top-tier loyalty program members',
        status: 'draft',
    },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabs: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)' },
    tab: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        color: 'var(--text-tertiary)',
        borderBottom: '2px solid transparent',
        marginBottom: '-2px',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
    },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
    },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
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
        paddingInlineEnd: 'var(--space-3)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
    },
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
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    cardHead: { padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        flexShrink: 0,
    },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    cardBody: { padding: '0 var(--space-5) var(--space-4)', display: 'flex', gap: 'var(--space-5)' },
    stat: { textAlign: 'center' },
    statVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    statLbl: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    cardFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-5)',
        borderTop: '1px solid var(--border-color)',
    },
    btnIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
    },
};

export default function CustomerGroupsPage() {
    const { addToast } = useToast();
    const { t, lang } = useTranslation();
    const [search, setSearch] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<(typeof fallbackGroups)[0] | null>(null);

    // Controlled form for the Add/Edit modals. Previously the inputs were unbound
    // and Save sent an empty payload ({}), so the list never changed — silent data loss.
    const emptyForm = { name: '', description: '', discount: '0', status: 'active' };
    const [form, setForm] = useState(emptyForm);

    const {
        data: apiGroups,
        loading,
        error,
        refetch,
        setData: setGroups,
    } = useApiQuery<CustomerGroup[]>(() => customerApi.getGroups() as never, [], {
        fallbackData: fallbackGroups as never,
    });

    const openAdd = () => {
        setForm(emptyForm);
        setIsAddOpen(true);
    };

    const openEdit = (g: (typeof fallbackGroups)[0]) => {
        setSelectedGroup(g);
        setForm({
            name: g.name,
            description: g.description,
            discount: String(g.discount),
            status: g.status,
        });
        setIsEditOpen(true);
    };

    // Map API groups to local shape, or use fallback
    const groups =
        apiGroups && apiGroups.length > 0
            ? apiGroups.map((g, i) => ({
                  id: i + 1,
                  uuid: g.uuid,
                  name: g.name,
                  members: g.customers_count,
                  discount: g.discount_percentage,
                  color: g.color || '#3B82F6',
                  description: g.description ?? '',
                  status: 'active',
              }))
            : fallbackGroups;

    const filtered = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' } as React.CSSProperties}>
            <div style={s.tabs as React.CSSProperties}>
                <Link href="/customers" style={s.tab as React.CSSProperties}>
                    {t('custGroups.tabClients')}
                </Link>
                <Link href="/customers/groups" style={{ ...s.tab, ...s.tabActive } as React.CSSProperties}>
                    {t('custGroups.tabGroups')}
                </Link>
                <Link href="/customers/statements" style={s.tab as React.CSSProperties}>
                    {t('custGroups.tabStatements')}
                </Link>
                <Link href="/customers/last-visits" style={s.tab as React.CSSProperties}>
                    {t('custGroups.tabLastVisits')}
                </Link>
            </div>

            <div style={s.toolbar as React.CSSProperties}>
                <div style={s.searchBox as React.CSSProperties}>
                    <Search size={16} style={s.searchIcon as React.CSSProperties} />
                    <input
                        style={s.searchInput as React.CSSProperties}
                        placeholder={t('custGroups.searchPlaceholder')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button style={s.addBtn as React.CSSProperties} onClick={openAdd}>
                    <Plus size={16} /> {t('custGroups.newGroup')}
                </button>
            </div>

            <DataGuard
                loading={loading}
                error={error}
                data={groups}
                onRetry={refetch}
                emptyIcon={<Users size={48} />}
                emptyTitle={t('custGroups.noGroups') || t('custGroups.noGroupsFound')}
                emptyDescription={t('custGroups.noGroupsDesc') || t('custGroups.noGroupsFoundDesc')}
                emptyAction={
                    <button style={s.addBtn as React.CSSProperties} onClick={openAdd}>
                        <Plus size={16} /> {t('custGroups.newGroup')}
                    </button>
                }
                skeletonCount={4}
                skeletonVariant="card"
            >
                <div style={s.grid as React.CSSProperties}>
                    {filtered.map(g => (
                        <div key={g.id} style={s.card as React.CSSProperties}>
                            <div style={s.cardHead as React.CSSProperties}>
                                <div style={{ ...s.icon, background: g.color } as React.CSSProperties}>
                                    <Users size={20} />
                                </div>
                                <div>
                                    <div style={s.cardTitle as React.CSSProperties}>{g.name}</div>
                                    <div style={s.cardDesc as React.CSSProperties}>{g.description}</div>
                                </div>
                            </div>
                            <div style={s.cardBody as React.CSSProperties}>
                                <div style={s.stat as React.CSSProperties}>
                                    <div style={s.statVal as React.CSSProperties}>{g.members}</div>
                                    <div style={s.statLbl as React.CSSProperties}>{t('custGroups.members')}</div>
                                </div>
                                <div style={s.stat as React.CSSProperties}>
                                    <div
                                        style={
                                            { ...s.statVal, color: 'var(--color-primary-600)' } as React.CSSProperties
                                        }
                                    >
                                        {g.discount}%
                                    </div>
                                    <div style={s.statLbl as React.CSSProperties}>{t('custGroups.discount')}</div>
                                </div>
                            </div>
                            <div style={s.cardFooter as React.CSSProperties}>
                                <button style={s.btnIcon as React.CSSProperties} onClick={() => openEdit(g)}>
                                    <Edit size={14} />
                                </button>
                                <button
                                    style={{ ...s.btnIcon, color: 'var(--color-error)' } as React.CSSProperties}
                                    onClick={() => {
                                        setSelectedGroup(g);
                                        setIsDeleteOpen(true);
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </DataGuard>

            {/* Add Group Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('custGroups.createGroup')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('custGroups.cancel')}
                        </Button>
                        <Button
                            onClick={async () => {
                                if (!form.name.trim()) {
                                    addToast('error', t('custGroups.groupNameRequired'));
                                    return;
                                }
                                const discount = Number(form.discount) || 0;
                                const newGroup: CustomerGroup = {
                                    uuid: `g-${Date.now()}`,
                                    name: form.name.trim(),
                                    discount_percentage: discount,
                                    color: '#3B82F6',
                                    description: form.description.trim() || null,
                                    customers_count: 0,
                                    created_at: '',
                                    updated_at: '',
                                };
                                setGroups(prev => [newGroup, ...(prev ?? [])]);
                                try {
                                    await customerApi.createGroup({
                                        name: newGroup.name,
                                        description: newGroup.description,
                                        discount_percentage: discount,
                                        status: form.status,
                                    });
                                    await refetch();
                                } catch {
                                    // offline/demo: keep the optimistic local row
                                }
                                setIsAddOpen(false);
                                addToast('success', t('custGroups.msgCreated'));
                            }}
                        >
                            {t('custGroups.saveGroup')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('custGroups.groupName')}
                        placeholder={t('custGroups.groupNamePlaceholder')}
                        value={form.name}
                        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                        label={t('custGroups.description')}
                        placeholder={t('custGroups.descPlaceholder')}
                        value={form.description}
                        onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Input
                        label={t('custGroups.discountPercent')}
                        type="number"
                        value={form.discount}
                        onChange={e => setForm(prev => ({ ...prev, discount: e.target.value }))}
                    />
                    <Select
                        label={t('custGroups.status')}
                        value={form.status}
                        onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                        options={[
                            { label: t('custGroups.active'), value: 'active' },
                            { label: t('custGroups.draft'), value: 'draft' },
                        ]}
                    />
                </div>
            </Modal>

            {/* Edit Group Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedGroup(null);
                }}
                title={t('custGroups.editGroup')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('custGroups.cancel')}
                        </Button>
                        <Button
                            onClick={async () => {
                                if (selectedGroup) {
                                    if (!form.name.trim()) {
                                        addToast('error', t('custGroups.groupNameRequired'));
                                        return;
                                    }
                                    const discount = Number(form.discount) || 0;
                                    const name = form.name.trim();
                                    const description = form.description.trim();
                                    // Optimistically patch both the API shape (discount_percentage/
                                    // customers_count) and the fallback shape (discount/members) so the
                                    // edit is reflected regardless of which data source is live.
                                    setGroups(prev =>
                                        (prev ?? []).map(g =>
                                            g.uuid === selectedGroup.uuid
                                                ? ({
                                                      ...g,
                                                      name,
                                                      description: description || null,
                                                      discount,
                                                      discount_percentage: discount,
                                                      status: form.status,
                                                  } as never)
                                                : g
                                        )
                                    );
                                    try {
                                        await customerApi.updateGroup(selectedGroup.uuid, {
                                            name,
                                            description: description || null,
                                            discount_percentage: discount,
                                            status: form.status,
                                        });
                                        await refetch();
                                    } catch {
                                        // offline/demo: keep the optimistic local edit
                                    }
                                }
                                setIsEditOpen(false);
                                addToast('success', t('custGroups.msgUpdated'));
                            }}
                        >
                            {t('custGroups.saveChanges')}
                        </Button>
                    </div>
                }
            >
                {selectedGroup && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input
                            label={t('custGroups.groupName')}
                            value={form.name}
                            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Input
                            label={t('custGroups.description')}
                            value={form.description}
                            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                        <Input
                            label={t('custGroups.discountPercent')}
                            type="number"
                            value={form.discount}
                            onChange={e => setForm(prev => ({ ...prev, discount: e.target.value }))}
                        />
                        <Select
                            label={t('custGroups.status')}
                            value={form.status}
                            onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                            options={[
                                { label: t('custGroups.active'), value: 'active' },
                                { label: t('custGroups.draft'), value: 'draft' },
                            ]}
                        />
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedGroup(null);
                }}
                title={t('custGroups.deleteGroup')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('custGroups.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (selectedGroup) {
                                    try {
                                        await customerApi.deleteGroup(selectedGroup.uuid);
                                        await refetch();
                                    } catch {
                                        /* fallback */
                                    }
                                }
                                setIsDeleteOpen(false);
                                setSelectedGroup(null);
                                addToast('error', t('custGroups.msgDeleted'));
                            }}
                        >
                            {t('custGroups.confirmDelete')}
                        </Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {t('custGroups.deleteConfirm')} <strong>{selectedGroup?.name}</strong>{' '}
                        {t('custGroups.groupQuestion')}
                    </p>
                </div>
            </Modal>
        </div>
    );
}
