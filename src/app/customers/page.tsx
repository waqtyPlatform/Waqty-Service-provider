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

const clients = [
    { id: 'C001', name: 'Fatima Al-Rashid', phone: '+20 123 456 789', email: 'fatima@email.com', visits: 24, spend: 8400, lastVisit: 'Feb 15, 2026', vip: true, hasAllergy: true, group: 'VIP', status: 'active' },
    { id: 'C002', name: 'Aisha Mohammed', phone: '+20 111 222 333', email: 'aisha@email.com', visits: 19, spend: 6250, lastVisit: 'Feb 12, 2026', vip: true, hasAllergy: false, group: 'VIP', status: 'active' },
    { id: 'C003', name: 'Maryam Ibrahim', phone: '+20 100 200 300', email: 'maryam@email.com', visits: 17, spend: 5800, lastVisit: 'Feb 10, 2026', vip: false, hasAllergy: false, group: 'Regular', status: 'active' },
    { id: 'C004', name: 'Huda Saleh', phone: '+20 155 666 777', email: 'huda@email.com', visits: 15, spend: 4900, lastVisit: 'Feb 8, 2026', vip: false, hasAllergy: true, group: 'Regular', status: 'active' },
    { id: 'C005', name: 'Noura Ahmed', phone: '+20 199 888 999', email: 'noura@email.com', visits: 12, spend: 3600, lastVisit: 'Feb 5, 2026', vip: false, hasAllergy: false, group: 'Regular', status: 'active' },
    { id: 'C006', name: 'Rania Khalil', phone: '+20 133 444 555', email: 'rania@email.com', visits: 8, spend: 2400, lastVisit: 'Jan 28, 2026', vip: false, hasAllergy: false, group: 'New', status: 'active' },
    { id: 'C007', name: 'Dana Faris', phone: '+20 177 333 222', email: 'dana@email.com', visits: 6, spend: 1800, lastVisit: 'Jan 20, 2026', vip: false, hasAllergy: false, group: 'New', status: 'inactive' },
    { id: 'C008', name: 'Lina Tariq', phone: '+20 122 555 666', email: 'lina@email.com', visits: 3, spend: 750, lastVisit: 'Jan 10, 2026', vip: false, hasAllergy: false, group: 'New', status: 'inactive' },
];

export default function CustomersPage() {
    const [search, setSearch] = useState('');
    const [groupFilter, setGroupFilter] = useState('all');

    // CRUD State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);

    const router = useRouter();
    const { addToast } = useToast();
    const { t } = useTranslation();

    const filtered = clients.filter((c) => {
        const matchSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search) ||
            c.email.toLowerCase().includes(search.toLowerCase());
        const matchGroup = groupFilter === 'all' || c.group.toLowerCase() === groupFilter;
        return matchSearch && matchGroup;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* KPI Row */}
            <div className={styles.kpiRow}>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                        <Users size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{clients.length}</div>
                        <div className={styles.kpiLabel}>{t('customers.totalClients')}</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: '#FEF3C7', color: '#B45309' }}>
                        <Star size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{clients.filter((c) => c.vip).length}</div>
                        <div className={styles.kpiLabel}>{t('customers.vipClients')}</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>
                        <UserPlus size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{clients.filter((c) => c.group === 'New').length}</div>
                        <div className={styles.kpiLabel}>{t('customers.newThisMonth')}</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: 'var(--color-error-light)', color: 'var(--color-error)' }}>
                        <AlertTriangle size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{clients.filter((c) => c.status === 'inactive').length}</div>
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
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <select
                        className={styles.selectFilter}
                        value={groupFilter}
                        onChange={(e) => setGroupFilter(e.target.value)}
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

            <div className={styles.tableCard}>
                {filtered.length > 0 ? (
                    <>
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
                                {filtered.map((c) => (
                                    <tr key={c.id} onClick={() => router.push(`/customers/${c.id}`)} style={{ cursor: 'pointer' }}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <div className={styles.avatar}>
                                                    {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 'var(--font-semibold)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                                        {c.name}
                                                        {c.vip && <Star size={14} fill="#F59E0B" stroke="#F59E0B" />}
                                                    </div>
                                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{c.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
                                                    <Phone size={12} style={{ color: 'var(--text-tertiary)' }} /> {c.phone}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                    <Mail size={12} /> {c.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.groupBadge} ${styles[`group${c.group}`]}`}>
                                                {c.group}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 'var(--font-medium)' }}>{c.visits}</td>
                                        <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)' }}>
                                            {c.spend.toLocaleString()} EGP
                                        </td>
                                        <td>
                                            <span style={{ color: c.status === 'inactive' ? 'var(--color-error)' : 'var(--text-secondary)' }}>
                                                {c.lastVisit}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                {c.hasAllergy && (
                                                    <span className={styles.flagBadge} title={t('customers.hasAllergies')}>
                                                        <AlertTriangle size={12} /> {t('customers.allergy')}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <DropdownMenu
                                                trigger={
                                                    <button
                                                        className={styles.actionBtn}
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                }
                                                items={[
                                                    { label: t('customers.viewProfile'), icon: <Users size={14} />, onClick: () => router.push(`/customers/${c.id}`) },
                                                    { label: t('customers.edit'), icon: <CreditCard size={14} />, onClick: () => { setSelectedClient(c); setIsEditOpen(true); } },
                                                    { label: t('customers.delete'), destructive: true, icon: <AlertTriangle size={14} />, onClick: () => { setSelectedClient(c); setIsDeleteOpen(true); } },
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.pagination}>
                            <span className={styles.pageInfo}>{t('customers.showing')} {filtered.length} {t('customers.of')} {clients.length}</span>
                            <div className={styles.pageButtons}>
                                <button className={styles.pageBtn}><ChevronLeft size={16} /></button>
                                <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                                <button className={styles.pageBtn}><ChevronRight size={16} /></button>
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

            {/* Add Client SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('customers.addClientTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>{t('customers.cancel')}</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', t('customers.toastCreated')); }}>{t('customers.saveClient')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('customers.fullName')} placeholder="e.g. Fatima Al-Rashid" />
                    <Input label={t('customers.phoneOption')} placeholder="+20 1XX XXX XXXX" />
                    <Input label={t('customers.emailOption')} placeholder="client@example.com" />
                    <Select label={t('customers.groupLabel')} options={[
                        { label: t('customers.regular'), value: 'Regular' },
                        { label: t('customers.vip'), value: 'VIP' },
                        { label: t('customers.new'), value: 'New' }
                    ]} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{t('customers.notesLabel')}</label>
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
                onClose={() => { setIsEditOpen(false); setSelectedClient(null); }}
                title={t('customers.editClientTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>{t('customers.cancel')}</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', t('customers.toastUpdated')); }}>{t('customers.saveChanges')}</Button>
                    </div>
                }
            >
                {selectedClient && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label={t('customers.fullName')} defaultValue={selectedClient.name} />
                        <Input label={t('customers.phoneOption')} defaultValue={selectedClient.phone} />
                        <Input label={t('customers.emailOption')} defaultValue={selectedClient.email} />
                        <Select label={t('customers.groupLabel')} defaultValue={selectedClient.group} options={[
                            { label: t('customers.regular'), value: 'Regular' },
                            { label: t('customers.vip'), value: 'VIP' },
                            { label: t('customers.new'), value: 'New' }
                        ]} />
                    </div>
                )}
            </SlideOver>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedClient(null); }}
                title={t('customers.deleteClientTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>{t('customers.cancel')}</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', t('customers.toastDeleted')); }}>{t('customers.deleteConfirm')}</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {t('customers.deleteWarning')}
                    </p>
                </div>
            </Modal>
        </div>
    );
}
