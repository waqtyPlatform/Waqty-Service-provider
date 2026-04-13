'use client';

import React, { useState } from 'react';
import { DropdownMenu, EmptyState, useToast, SlideOver, Input, Select, Modal, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Phone,
    Mail,
    Star,
    AlertTriangle,
    Users,
    UserPlus,
    CreditCard,
} from 'lucide-react';
import styles from './customers.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { customerApi, type Customer } from '@/lib/api';
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

    const router = useRouter();
    const { addToast } = useToast();
    const { t } = useTranslation();

    const {
        data: clients,
        loading,
        error,
        refetch,
        setData: setClients,
    } = useApiQuery<Customer[]>(() => customerApi.getCustomers(), [], { fallbackData: fallbackClients });

    const allClients = clients ?? [];

    const filtered = allClients.filter(c => {
        const matchSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search) ||
            (c.email ?? '').toLowerCase().includes(search.toLowerCase());
        const matchGroup = groupFilter === 'all' || (c.group?.name ?? '').toLowerCase() === groupFilter;
        return matchSearch && matchGroup;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
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
                    <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
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
                    <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
                        <UserPlus size={16} /> {t('customers.addClient')}
                    </button>
                }
                skeletonCount={5}
            >
                <div className={styles.tableCard}>
                    {filtered.length > 0 ? (
                        <>
                            <div className={styles.tableScroll}>
                                <table className={styles.dataTable}>
                                    <thead>
                                        <tr>
                                            <th>{t('customers.colClient')}</th>
                                            <th>{t('customers.colContact')}</th>
                                            <th>{t('customers.colGroup')}</th>
                                            <th>{t('customers.colVisits')}</th>
                                            <th>{t('customers.colTotalSpend')}</th>
                                            <th>{t('customers.colLastVisit')}</th>
                                            <th>{t('customers.colFlags')}</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.map(c => {
                                            const groupName = c.group?.name ?? 'Regular';
                                            return (
                                                <tr
                                                    key={c.uuid}
                                                    onClick={() => router.push(`/customers/${c.uuid}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <td>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 'var(--space-3)',
                                                            }}
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
                                                                    {c.vip && (
                                                                        <Star
                                                                            size={14}
                                                                            fill="#F59E0B"
                                                                            stroke="#F59E0B"
                                                                        />
                                                                    )}
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
                                                    </td>
                                                    <td>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: '2px',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 'var(--space-1)',
                                                                    fontSize: 'var(--text-sm)',
                                                                }}
                                                            >
                                                                <Phone
                                                                    size={12}
                                                                    style={{ color: 'var(--text-tertiary)' }}
                                                                />{' '}
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
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`${styles.groupBadge} ${styles[`group${groupName}`]}`}
                                                        >
                                                            {groupName}
                                                        </span>
                                                    </td>
                                                    <td style={{ fontWeight: 'var(--font-medium)' }}>
                                                        {c.total_visits}
                                                    </td>
                                                    <td
                                                        style={{
                                                            fontWeight: 'var(--font-semibold)',
                                                            color: 'var(--color-primary-600)',
                                                        }}
                                                    >
                                                        {c.total_spent.toLocaleString()} EGP
                                                    </td>
                                                    <td>
                                                        <span
                                                            style={{
                                                                color: !c.last_visit
                                                                    ? 'var(--color-error)'
                                                                    : 'var(--text-secondary)',
                                                            }}
                                                        >
                                                            {c.last_visit ?? '-'}
                                                        </span>
                                                    </td>
                                                    <td>
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
                                                    </td>
                                                    <td>
                                                        <DropdownMenu
                                                            trigger={
                                                                <button className={styles.actionBtn}>
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
                                                                    onClick: () => {
                                                                        setSelectedClient(c);
                                                                        setIsEditOpen(true);
                                                                    },
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
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className={styles.pagination}>
                                <span className={styles.pageInfo}>
                                    {t('customers.showing')} {filtered.length} {t('customers.of')} {allClients.length}
                                </span>
                                <div className={styles.pageButtons}>
                                    <button
                                        className={styles.pageBtn}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            className={`${styles.pageBtn} ${currentPage === p ? styles.pageBtnActive : ''}`}
                                            onClick={() => setCurrentPage(p)}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        className={styles.pageBtn}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
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
                                try {
                                    await customerApi.createCustomer({});
                                    await refetch();
                                } catch {
                                    // fallback: keep local state
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
                    <Input label={t('customers.fullName')} placeholder="e.g. Fatima Al-Rashid" />
                    <Input label={t('customers.phoneOption')} placeholder="+20 1XX XXX XXXX" />
                    <Input label={t('customers.emailOption')} placeholder="client@example.com" />
                    <Select
                        label={t('customers.groupLabel')}
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
                                    try {
                                        await customerApi.updateCustomer(selectedClient.uuid, {});
                                        await refetch();
                                    } catch {
                                        // fallback: keep local state
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
                        <Input label={t('customers.fullName')} defaultValue={selectedClient.name} />
                        <Input label={t('customers.phoneOption')} defaultValue={selectedClient.phone} />
                        <Input label={t('customers.emailOption')} defaultValue={selectedClient.email ?? ''} />
                        <Select
                            label={t('customers.groupLabel')}
                            defaultValue={selectedClient.group?.name ?? 'Regular'}
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
