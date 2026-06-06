'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    DropdownMenu,
    EmptyState,
    useToast,
    SlideOver,
    Input,
    Select,
    Modal,
    Button,
    Pagination,
    DataTable,
} from '@/components/ui';
import { useRouter } from 'next/navigation';
import { Search, MoreVertical, Phone, Mail, Star, AlertTriangle, Users, UserPlus, CreditCard } from 'lucide-react';
import styles from './customers.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { SampleDataBanner } from '@/components/SampleDataBanner';
import { egpLabel } from '@/lib/money';
import { customerApi, providerApi, type Customer } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

const fallbackClients: Customer[] = [
    {
        uuid: 'C001',
        name: 'Fatima Al-Rashid',
        phone: '+20 123 456 789',
        email: 'fatima@email.com',
        total_visits: 24,
        total_spent: 8400,
        last_visit: 'Mar 23, 2026',
        vip: true,
        allergies: 'Latex',
        group_uuid: null,
        group: {
            uuid: 'g1',
            name: 'VIP',
            discount_percentage: 15,
            color: '#F59E0B',
            description: null,
            customers_count: 2,
            created_at: '',
            updated_at: '',
        },
        notes: null,
        medical_conditions: null,
        medications: null,
        created_at: '',
        updated_at: '',
    },
    {
        uuid: 'C002',
        name: 'Aisha Mohammed',
        phone: '+20 111 222 333',
        email: 'aisha@email.com',
        total_visits: 19,
        total_spent: 6250,
        last_visit: 'Mar 25, 2026',
        vip: true,
        allergies: null,
        group_uuid: null,
        group: {
            uuid: 'g1',
            name: 'VIP',
            discount_percentage: 15,
            color: '#F59E0B',
            description: null,
            customers_count: 2,
            created_at: '',
            updated_at: '',
        },
        notes: null,
        medical_conditions: null,
        medications: null,
        created_at: '',
        updated_at: '',
    },
    {
        uuid: 'C003',
        name: 'Maryam Ibrahim',
        phone: '+20 100 200 300',
        email: 'maryam@email.com',
        total_visits: 17,
        total_spent: 5800,
        last_visit: 'Mar 18, 2026',
        vip: false,
        allergies: null,
        group_uuid: null,
        group: {
            uuid: 'g2',
            name: 'Regular',
            discount_percentage: 5,
            color: '#3B82F6',
            description: null,
            customers_count: 3,
            created_at: '',
            updated_at: '',
        },
        notes: null,
        medical_conditions: null,
        medications: null,
        created_at: '',
        updated_at: '',
    },
    {
        uuid: 'C004',
        name: 'Huda Saleh',
        phone: '+20 155 666 777',
        email: 'huda@email.com',
        total_visits: 15,
        total_spent: 4900,
        last_visit: 'Mar 22, 2026',
        vip: false,
        allergies: 'Sulfates',
        group_uuid: null,
        group: {
            uuid: 'g2',
            name: 'Regular',
            discount_percentage: 5,
            color: '#3B82F6',
            description: null,
            customers_count: 3,
            created_at: '',
            updated_at: '',
        },
        notes: null,
        medical_conditions: null,
        medications: null,
        created_at: '',
        updated_at: '',
    },
    {
        uuid: 'C005',
        name: 'Noura Ahmed',
        phone: '+20 199 888 999',
        email: 'noura@email.com',
        total_visits: 12,
        total_spent: 3600,
        last_visit: 'Mar 26, 2026',
        vip: false,
        allergies: null,
        group_uuid: null,
        group: {
            uuid: 'g2',
            name: 'Regular',
            discount_percentage: 5,
            color: '#3B82F6',
            description: null,
            customers_count: 3,
            created_at: '',
            updated_at: '',
        },
        notes: null,
        medical_conditions: null,
        medications: null,
        created_at: '',
        updated_at: '',
    },
    {
        uuid: 'C006',
        name: 'Rania Khalil',
        phone: '+20 133 444 555',
        email: 'rania@email.com',
        total_visits: 8,
        total_spent: 2400,
        last_visit: 'Mar 19, 2026',
        vip: false,
        allergies: null,
        group_uuid: null,
        group: {
            uuid: 'g3',
            name: 'New',
            discount_percentage: 10,
            color: '#10B981',
            description: null,
            customers_count: 3,
            created_at: '',
            updated_at: '',
        },
        notes: null,
        medical_conditions: null,
        medications: null,
        created_at: '',
        updated_at: '',
    },
    {
        uuid: 'C007',
        name: 'Dana Faris',
        phone: '+20 177 333 222',
        email: 'dana@email.com',
        total_visits: 6,
        total_spent: 1800,
        last_visit: 'Mar 14, 2026',
        vip: false,
        allergies: null,
        group_uuid: null,
        group: {
            uuid: 'g3',
            name: 'New',
            discount_percentage: 10,
            color: '#10B981',
            description: null,
            customers_count: 3,
            created_at: '',
            updated_at: '',
        },
        notes: null,
        medical_conditions: null,
        medications: null,
        created_at: '',
        updated_at: '',
    },
    {
        uuid: 'C008',
        name: 'Lina Tariq',
        phone: '+20 122 555 666',
        email: 'lina@email.com',
        total_visits: 3,
        total_spent: 750,
        last_visit: 'Mar 16, 2026',
        vip: false,
        allergies: null,
        group_uuid: null,
        group: {
            uuid: 'g3',
            name: 'New',
            discount_percentage: 10,
            color: '#10B981',
            description: null,
            customers_count: 3,
            created_at: '',
            updated_at: '',
        },
        notes: null,
        medical_conditions: null,
        medications: null,
        created_at: '',
        updated_at: '',
    },
];

export default function CustomersPage() {
    const [search, setSearch] = useState('');
    const [groupFilter, setGroupFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // CRUD State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Customer | null>(null);

    // Controlled form for the Add/Edit slide-overs. Previously the inputs were unbound
    // and Save sent an empty payload, so the list never changed — silent data loss.
    const emptyForm = { name: '', phone: '', email: '', group: 'Regular', notes: '' };
    const [form, setForm] = useState(emptyForm);
    const openAdd = () => {
        setForm(emptyForm);
        setIsAddOpen(true);
    };
    const openEdit = (c: Customer) => {
        setSelectedClient(c);
        setForm({
            name: c.name,
            phone: c.phone,
            email: c.email ?? '',
            group: c.group?.name ?? 'Regular',
            notes: c.notes ?? '',
        });
        setIsEditOpen(true);
    };

    const router = useRouter();
    const { addToast } = useToast();
    const { t } = useTranslation();

    const {
        data: clients,
        loading,
        error,
        refetch,
        setData: setClients,
        isFallback,
    } = useApiQuery<Customer[]>(
        // The provider `/customers` route doesn't exist; `/clients/statements` is the
        // live source (per-client visits + spend), mapped to the Customer view-model.
        () =>
            providerApi.getClientStatements().then(res => ({
                ...res,
                data: res.data?.map(
                    (s): Customer => ({
                        uuid: s.uuid,
                        name: s.name,
                        email: s.email,
                        phone: s.phone ?? '',
                        group_uuid: null,
                        vip: false,
                        notes: null,
                        allergies: null,
                        medical_conditions: null,
                        medications: null,
                        total_visits: s.total_bookings,
                        total_spent: s.total_paid,
                        last_visit: s.last_booking_date,
                        created_at: '',
                        updated_at: '',
                    })
                ),
            })),
        [],
        { fallbackData: fallbackClients }
    );

    const allClients = clients ?? [];

    // Header actions (Add / Export / Import) live in customers/layout.tsx, which only
    // dispatches window events; the data + add modal live here, so we handle them here.
    const fileInputRef = useRef<HTMLInputElement>(null);

    const exportClients = () => {
        const header = 'Name,Phone,Email,Group,VIP,Visits,TotalSpent';
        const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const rows = allClients.map(c =>
            [c.name, c.phone, c.email ?? '', c.group?.name ?? '', c.vip ? 'Yes' : 'No', c.total_visits, c.total_spent]
                .map(esc)
                .join(',')
        );
        const csv = [header, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'clients.csv';
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const parseCsvRow = (line: string): string[] => {
        const out: string[] = [];
        let cur = '';
        let q = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (q) {
                if (ch === '"' && line[i + 1] === '"') {
                    cur += '"';
                    i++;
                } else if (ch === '"') q = false;
                else cur += ch;
            } else if (ch === '"') q = true;
            else if (ch === ',') {
                out.push(cur);
                cur = '';
            } else cur += ch;
        }
        out.push(cur);
        return out;
    };

    const importClients = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = String(reader.result || '');
            const lines = text
                .split(/\r?\n/)
                .map(l => l.trim())
                .filter(Boolean);
            if (lines.length < 2) {
                addToast('error', t('customers.importEmpty'));
                return;
            }
            const head = parseCsvRow(lines[0]).map(h => h.toLowerCase());
            const idx = (m: string) => head.findIndex(h => h.includes(m));
            const nameIdx = idx('name');
            const phoneIdx = idx('phone');
            const emailIdx = idx('email');
            const groupIdx = idx('group');
            const imported: Customer[] = [];
            for (let i = 1; i < lines.length; i++) {
                const cols = parseCsvRow(lines[i]);
                const name = (nameIdx >= 0 ? cols[nameIdx] : cols[0])?.trim();
                if (!name) continue;
                const groupName = (groupIdx >= 0 ? cols[groupIdx]?.trim() : '') || 'Regular';
                const isVip = groupName.toLowerCase() === 'vip';
                imported.push({
                    uuid: `C-imp-${Date.now()}-${i}`,
                    name,
                    email: (emailIdx >= 0 ? cols[emailIdx]?.trim() : '') || null,
                    phone: (phoneIdx >= 0 ? cols[phoneIdx]?.trim() : '') || '',
                    group_uuid: null,
                    group: {
                        uuid: 'g-imp',
                        name: groupName,
                        discount_percentage: isVip ? 15 : 0,
                        color: isVip ? '#F59E0B' : '#9CA3AF',
                        description: null,
                        customers_count: 0,
                        created_at: '',
                        updated_at: '',
                    },
                    vip: isVip,
                    notes: null,
                    allergies: null,
                    medical_conditions: null,
                    medications: null,
                    total_visits: 0,
                    total_spent: 0,
                    last_visit: null,
                    created_at: '',
                    updated_at: '',
                });
            }
            if (!imported.length) {
                addToast('error', t('customers.importEmpty'));
                return;
            }
            setClients(prev => [...imported, ...(prev ?? [])]);
            addToast('success', t('customers.importSuccess').replace('{n}', String(imported.length)));
        };
        reader.readAsText(file);
    };

    useEffect(() => {
        const onAdd = () => openAdd();
        const onExport = () => exportClients();
        const onImport = () => fileInputRef.current?.click();
        window.addEventListener('openAddClient', onAdd);
        window.addEventListener('exportClients', onExport);
        window.addEventListener('importClients', onImport);
        return () => {
            window.removeEventListener('openAddClient', onAdd);
            window.removeEventListener('exportClients', onExport);
            window.removeEventListener('importClients', onImport);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allClients]);

    const filtered = allClients.filter(c => {
        const matchSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search) ||
            (c.email ?? '').toLowerCase().includes(search.toLowerCase());
        const matchGroup = groupFilter === 'all' || (c.group?.name ?? '').toLowerCase() === groupFilter;
        return matchSearch && matchGroup;
    });

    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {isFallback && <SampleDataBanner />}
            {/* Hidden file input for CSV import (triggered from the header Import button) */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                style={{ display: 'none' }}
                onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) importClients(f);
                    e.target.value = '';
                }}
            />
            {/* KPI Row */}
            <div className={styles.kpiRow}>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIcon}
                        style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}
                    >
                        <Users size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{allClients.length}</div>
                        <div className={styles.kpiLabel}>{t('customers.totalClients')}</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: '#FEF3C7', color: '#B45309' }}>
                        <Star size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{allClients.filter(c => c.vip).length}</div>
                        <div className={styles.kpiLabel}>{t('customers.vipClients')}</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIcon}
                        style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}
                    >
                        <UserPlus size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>
                            {allClients.filter(c => (c.group?.name ?? '') === 'New').length}
                        </div>
                        <div className={styles.kpiLabel}>{t('customers.newThisMonth')}</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIcon}
                        style={{ background: 'var(--color-error-light)', color: 'var(--color-error)' }}
                    >
                        <AlertTriangle size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{allClients.filter(c => !c.last_visit).length}</div>
                        <div className={styles.kpiLabel}>{t('customers.inactive')}</div>
                    </div>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder={t('customers.search')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <select
                        className={styles.selectFilter}
                        value={groupFilter}
                        onChange={e => setGroupFilter(e.target.value)}
                    >
                        <option value="all">{t('customers.allGroups')}</option>
                        <option value="vip">{t('customers.vip')}</option>
                        <option value="regular">{t('customers.regular')}</option>
                        <option value="new">{t('customers.new')}</option>
                    </select>
                    <button className={styles.btnPrimary} onClick={openAdd}>
                        <UserPlus size={16} /> {t('customers.addClient')}
                    </button>
                </div>
            </div>

            <DataGuard
                loading={loading}
                error={error}
                data={allClients}
                onRetry={refetch}
                emptyIcon={<Users size={48} />}
                emptyTitle={t('customers.noClients')}
                emptyDescription={t('customers.noClientsDesc')}
                emptyAction={
                    <button className={styles.btnPrimary} onClick={openAdd}>
                        <UserPlus size={16} /> {t('customers.addClient')}
                    </button>
                }
                skeletonCount={5}
            >
                <div className={styles.tableCard}>
                    {filtered.length > 0 ? (
                        <>
                            <DataTable
                                rows={paginated}
                                rowKey={c => c.uuid}
                                onRowClick={c => router.push(`/customers/${c.uuid}`)}
                                columns={[
                                    {
                                        key: 'client',
                                        header: t('customers.colClient'),
                                        render: c => (
                                            <div
                                                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
                                            >
                                                <div className={styles.avatar}>
                                                    {c.name
                                                        .split(' ')
                                                        .map(n => n[0])
                                                        .join('')
                                                        .slice(0, 2)}
                                                </div>
                                                <div>
                                                    <div
                                                        style={{
                                                            fontWeight: 'var(--font-semibold)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--space-1)',
                                                        }}
                                                    >
                                                        {c.name}
                                                        {c.vip && <Star size={14} fill="#F59E0B" stroke="#F59E0B" />}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: 'var(--text-xs)',
                                                            color: 'var(--text-tertiary)',
                                                        }}
                                                    >
                                                        {c.uuid}
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    },
                                    {
                                        key: 'contact',
                                        header: t('customers.colContact'),
                                        render: c => (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 'var(--space-1)',
                                                        fontSize: 'var(--text-sm)',
                                                    }}
                                                >
                                                    <Phone size={12} style={{ color: 'var(--text-tertiary)' }} />{' '}
                                                    {c.phone}
                                                </span>
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 'var(--space-1)',
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-tertiary)',
                                                    }}
                                                >
                                                    <Mail size={12} /> {c.email ?? '-'}
                                                </span>
                                            </div>
                                        ),
                                    },
                                    {
                                        key: 'group',
                                        header: t('customers.colGroup'),
                                        render: c => {
                                            const groupName = c.group?.name ?? 'Regular';
                                            return (
                                                <span className={`${styles.groupBadge} ${styles[`group${groupName}`]}`}>
                                                    {groupName}
                                                </span>
                                            );
                                        },
                                    },
                                    {
                                        key: 'visits',
                                        header: t('customers.colVisits'),
                                        render: c => (
                                            <span style={{ fontWeight: 'var(--font-medium)' }}>{c.total_visits}</span>
                                        ),
                                    },
                                    {
                                        key: 'spend',
                                        header: t('customers.colTotalSpend'),
                                        render: c => (
                                            <span
                                                style={{
                                                    fontWeight: 'var(--font-semibold)',
                                                    color: 'var(--color-primary-600)',
                                                }}
                                            >
                                                {c.total_spent.toLocaleString()} {egpLabel()}
                                            </span>
                                        ),
                                    },
                                    {
                                        key: 'lastVisit',
                                        header: t('customers.colLastVisit'),
                                        render: c => (
                                            <span
                                                style={{
                                                    color: !c.last_visit
                                                        ? 'var(--color-error)'
                                                        : 'var(--text-secondary)',
                                                }}
                                            >
                                                {c.last_visit ?? '-'}
                                            </span>
                                        ),
                                    },
                                    {
                                        key: 'flags',
                                        header: t('customers.colFlags'),
                                        render: c => (
                                            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                {c.allergies && (
                                                    <span
                                                        className={styles.flagBadge}
                                                        title={t('customers.hasAllergies')}
                                                    >
                                                        <AlertTriangle size={12} /> {t('customers.allergy')}
                                                    </span>
                                                )}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: 'actions',
                                        header: '',
                                        align: 'end',
                                        // Stop row-click navigation when interacting with the menu.
                                        render: c => (
                                            <div onClick={e => e.stopPropagation()}>
                                                <DropdownMenu
                                                    trigger={
                                                        <button
                                                            className={styles.actionBtn}
                                                            aria-label={t('common.moreOptions')}
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    }
                                                    items={[
                                                        {
                                                            label: t('customers.viewProfile'),
                                                            icon: <Users size={14} />,
                                                            onClick: () => router.push(`/customers/${c.uuid}`),
                                                        },
                                                        {
                                                            label: t('customers.edit'),
                                                            icon: <CreditCard size={14} />,
                                                            onClick: () => openEdit(c),
                                                        },
                                                        {
                                                            label: t('customers.delete'),
                                                            destructive: true,
                                                            icon: <AlertTriangle size={14} />,
                                                            onClick: () => {
                                                                setSelectedClient(c);
                                                                setIsDeleteOpen(true);
                                                            },
                                                        },
                                                    ]}
                                                />
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                            {/* Shared compact Pagination (prev/next + range) — replaces the
                                bespoke one-button-per-page strip that overflowed at scale. */}
                            <Pagination
                                page={currentPage}
                                pageSize={itemsPerPage}
                                total={filtered.length}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    ) : (
                        <div style={{ padding: 'var(--space-12) 0' }}>
                            <EmptyState
                                icon={<Users size={32} color="var(--text-tertiary)" />}
                                title={t('customers.noClients')}
                                description={t('customers.noClientsDesc')}
                            />
                        </div>
                    )}
                </div>
            </DataGuard>

            {/* Add Client SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('customers.addClientTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('customers.cancel')}
                        </Button>
                        <Button
                            onClick={async () => {
                                if (!form.name.trim()) {
                                    addToast('error', t('customers.toastNameRequired'));
                                    return;
                                }
                                const newClient: Customer = {
                                    uuid: `C-${Date.now()}`,
                                    name: form.name.trim(),
                                    email: form.email.trim() || null,
                                    phone: form.phone.trim(),
                                    group_uuid: null,
                                    group: {
                                        uuid: 'g-new',
                                        name: form.group,
                                        discount_percentage: form.group === 'VIP' ? 15 : 0,
                                        color: form.group === 'VIP' ? '#F59E0B' : '#9CA3AF',
                                        description: null,
                                        customers_count: 0,
                                        created_at: '',
                                        updated_at: '',
                                    },
                                    vip: form.group === 'VIP',
                                    notes: form.notes.trim() || null,
                                    allergies: null,
                                    medical_conditions: null,
                                    medications: null,
                                    total_visits: 0,
                                    total_spent: 0,
                                    last_visit: null,
                                    created_at: '',
                                    updated_at: '',
                                };
                                setClients(prev => [newClient, ...(prev ?? [])]);
                                try {
                                    await customerApi.createCustomer({
                                        name: newClient.name,
                                        phone: newClient.phone,
                                        email: newClient.email,
                                        group: form.group,
                                        notes: newClient.notes,
                                    });
                                    await refetch();
                                } catch {
                                    // offline/demo: keep the optimistic local row
                                }
                                setIsAddOpen(false);
                                addToast('success', t('customers.toastCreated'));
                            }}
                        >
                            {t('customers.saveClient')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('customers.fullName')}
                        placeholder="e.g. Fatima Al-Rashid"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                    <Input
                        label={t('customers.phoneOption')}
                        placeholder="+20 1XX XXX XXXX"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                    <Input
                        label={t('customers.emailOption')}
                        placeholder="client@example.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                    <Select
                        label={t('customers.groupLabel')}
                        value={form.group}
                        onChange={e => setForm(f => ({ ...f, group: e.target.value }))}
                        options={[
                            { label: t('customers.regular'), value: 'Regular' },
                            { label: t('customers.vip'), value: 'VIP' },
                            { label: t('customers.new'), value: 'New' },
                        ]}
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-2)',
                            marginTop: 'var(--space-2)',
                        }}
                    >
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                            {t('customers.notesLabel')}
                        </label>
                        <textarea
                            className={styles.searchInput}
                            style={{ height: '80px', padding: 'var(--space-3)' }}
                            placeholder={t('customers.notesPlaceholder')}
                            value={form.notes}
                            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        />
                    </div>
                </div>
            </SlideOver>

            {/* Edit Client SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedClient(null);
                }}
                title={t('customers.editClientTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('customers.cancel')}
                        </Button>
                        <Button
                            onClick={async () => {
                                if (selectedClient) {
                                    if (!form.name.trim()) {
                                        addToast('error', t('customers.toastNameRequired'));
                                        return;
                                    }
                                    const updated: Customer = {
                                        ...selectedClient,
                                        name: form.name.trim(),
                                        phone: form.phone.trim(),
                                        email: form.email.trim() || null,
                                        notes: form.notes.trim() || null,
                                        vip: form.group === 'VIP',
                                        group: selectedClient.group
                                            ? { ...selectedClient.group, name: form.group }
                                            : undefined,
                                    };
                                    setClients(prev =>
                                        (prev ?? []).map(c => (c.uuid === selectedClient.uuid ? updated : c))
                                    );
                                    try {
                                        await customerApi.updateCustomer(selectedClient.uuid, {
                                            name: updated.name,
                                            phone: updated.phone,
                                            email: updated.email,
                                            group: form.group,
                                            notes: updated.notes,
                                        });
                                        await refetch();
                                    } catch {
                                        // offline/demo: keep the optimistic local edit
                                    }
                                }
                                setIsEditOpen(false);
                                addToast('success', t('customers.toastUpdated'));
                            }}
                        >
                            {t('customers.saveChanges')}
                        </Button>
                    </div>
                }
            >
                {selectedClient && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input
                            label={t('customers.fullName')}
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        />
                        <Input
                            label={t('customers.phoneOption')}
                            value={form.phone}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        />
                        <Input
                            label={t('customers.emailOption')}
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        />
                        <Select
                            label={t('customers.groupLabel')}
                            value={form.group}
                            onChange={e => setForm(f => ({ ...f, group: e.target.value }))}
                            options={[
                                { label: t('customers.regular'), value: 'Regular' },
                                { label: t('customers.vip'), value: 'VIP' },
                                { label: t('customers.new'), value: 'New' },
                            ]}
                        />
                    </div>
                )}
            </SlideOver>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedClient(null);
                }}
                title={t('customers.deleteClientTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('customers.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (selectedClient) {
                                    try {
                                        await customerApi.deleteCustomer(selectedClient.uuid);
                                        setClients(prev => (prev ?? []).filter(c => c.uuid !== selectedClient.uuid));
                                    } catch {
                                        // fallback: remove from local state
                                        setClients(prev => (prev ?? []).filter(c => c.uuid !== selectedClient.uuid));
                                    }
                                }
                                setIsDeleteOpen(false);
                                setSelectedClient(null);
                                addToast('error', t('customers.toastDeleted'));
                            }}
                        >
                            {t('customers.deleteConfirm')}
                        </Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('customers.deleteWarning')}</p>
                </div>
            </Modal>
        </div>
    );
}
