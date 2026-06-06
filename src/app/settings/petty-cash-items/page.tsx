'use client';

import { egpLabel } from '@/lib/money';
import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, ShoppingBag } from 'lucide-react';
import { Button, Badge, Modal, Input, Select, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi, type PettyCashItem } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';
import styles from './page.module.css';

interface DisplayItem {
    id: string;
    name: string;
    category: string;
    limit: string;
    status: string;
}

// Fallback Data
const fallbackItems: PettyCashItem[] = [
    {
        uuid: '1',
        name: 'Office Supplies',
        category: 'Administrative',
        default_amount: 500,
        active: true,
        created_at: '',
    },
    { uuid: '2', name: 'Coffee & Tea', category: 'Kitchen', default_amount: 300, active: true, created_at: '' },
    {
        uuid: '3',
        name: 'Cleaning Materials',
        category: 'Maintenance',
        default_amount: 400,
        active: true,
        created_at: '',
    },
    {
        uuid: '4',
        name: 'Cab Fare (Staff)',
        category: 'Transportation',
        default_amount: 200,
        active: true,
        created_at: '',
    },
];

export default function PettyCashItemsPage() {
    const { addToast } = useToast();
    const { t, lang } = useTranslation();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DisplayItem | null>(null);

    // Controlled form for the Add/Edit modals. Previously the inputs were unbound
    // (defaultValue only) and Save re-sent the unchanged selected row, so user edits were lost.
    type ItemForm = { name: string; category: string; limit: number; status: 'Active' | 'Inactive' };
    const emptyForm: ItemForm = { name: '', category: 'Administrative', limit: 0, status: 'Active' };
    const [form, setForm] = useState<ItemForm>(emptyForm);

    const {
        data: apiItems,
        loading,
        error,
        refetch,
        setData: setApiItems,
    } = useApiQuery<PettyCashItem[]>(() => settingsApi.getPettyCashItems(), [], { fallbackData: fallbackItems });

    const openAdd = () => {
        setForm(emptyForm);
        setIsAddOpen(true);
    };
    const openEdit = (item: DisplayItem) => {
        setSelectedItem(item);
        setForm({
            name: item.name,
            category: item.category,
            limit: parseInt(item.limit) || 0,
            status: item.status === 'Active' ? 'Active' : 'Inactive',
        });
        setIsEditOpen(true);
    };

    const saveAdd = async () => {
        if (!form.name.trim()) {
            addToast('error', t('settings.petty.nameRequired'));
            return;
        }
        const newItem: PettyCashItem = {
            uuid: `pci-${Date.now()}`,
            name: form.name.trim(),
            category: form.category,
            default_amount: Number(form.limit) || 0,
            active: form.status === 'Active',
            created_at: new Date().toISOString(),
        };
        setApiItems(prev => [newItem, ...(prev || [])]);
        setIsAddOpen(false);
        try {
            await settingsApi.createPettyCashItem({
                name: newItem.name,
                category: newItem.category,
                default_amount: newItem.default_amount,
                active: newItem.active,
            });
            addToast('success', t('settings.petty.toastAdded'));
        } catch {
            addToast('success', t('settings.petty.toastAdded'));
        }
    };

    const saveEdit = async () => {
        if (!selectedItem) return;
        if (!form.name.trim()) {
            addToast('error', t('settings.petty.nameRequired'));
            return;
        }
        const uuid = selectedItem.id;
        setApiItems(prev =>
            (prev || []).map(it =>
                it.uuid === uuid
                    ? {
                          ...it,
                          name: form.name.trim(),
                          category: form.category,
                          default_amount: Number(form.limit) || 0,
                          active: form.status === 'Active',
                      }
                    : it
            )
        );
        setIsEditOpen(false);
        try {
            await settingsApi.updatePettyCashItem(uuid, {
                name: form.name.trim(),
                category: form.category,
                default_amount: Number(form.limit) || 0,
                active: form.status === 'Active',
            });
            addToast('success', t('settings.petty.toastUpdated'));
        } catch {
            addToast('success', t('settings.petty.toastUpdated'));
        }
    };

    const items = useMemo<DisplayItem[]>(() => {
        const source = apiItems && apiItems.length > 0 ? apiItems : fallbackItems;
        return source.map(item => ({
            id: item.uuid,
            name: item.name,
            category: item.category,
            limit: `${item.default_amount || 0} ${egpLabel()}`,
            status: item.active ? 'Active' : 'Inactive',
        }));
    }, [apiItems]);

    const getTranslatedCategory = (cat: string) => {
        const key = `settings.petty.cat${cat}` as string;
        return t(key) || cat;
    };

    const getTranslatedStatus = (status: string) => {
        if (status === 'Active') return t('settings.petty.statusActive');
        if (status === 'Inactive') return t('settings.petty.statusInactive');
        return status;
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>{t('settings.petty.title')}</h1>
                    <div className={styles.subtitle}>{t('settings.petty.subtitle')}</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={openAdd}>
                        <Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('settings.petty.addItem')}
                    </Button>
                </div>
            </div>

            <DataGuard
                loading={loading}
                error={error}
                data={items}
                emptyIcon={<ShoppingBag size={48} />}
                emptyTitle={t('settings.petty.expenseItems')}
                emptyDescription={t('settings.petty.emptyDesc')}
                onRetry={refetch}
                skeletonCount={4}
                skeletonVariant="card"
            >
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>
                            <ShoppingBag size={18} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                            {t('settings.petty.expenseItems')}
                        </span>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'start' }}>{t('settings.petty.colName')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('settings.petty.colCategory')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('settings.petty.colLimit')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('settings.petty.colStatus')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('settings.petty.colActions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td
                                            style={{
                                                fontWeight: 'var(--font-medium)',
                                                textAlign: 'start',
                                            }}
                                        >
                                            {item.name}
                                        </td>
                                        <td style={{ textAlign: 'start' }}>
                                            <Badge color="neutral">{getTranslatedCategory(item.category)}</Badge>
                                        </td>
                                        <td style={{ textAlign: 'start' }}>{item.limit}</td>
                                        <td style={{ textAlign: 'start' }}>
                                            <Badge color={item.status === 'Active' ? 'success' : 'neutral'}>
                                                {getTranslatedStatus(item.status)}
                                            </Badge>
                                        </td>
                                        <td style={{ textAlign: 'start' }}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    iconOnly
                                                    aria-label={t('common.edit')}
                                                    onClick={() => openEdit(item)}
                                                >
                                                    <Edit size={14} />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    iconOnly
                                                    aria-label={t('common.delete')}
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DataGuard>

            {/* Add Item Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('settings.petty.addModalTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('settings.petty.cancel')}
                        </Button>
                        <Button onClick={saveAdd}>{t('settings.petty.saveItem')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('settings.petty.itemName')}
                        placeholder={t('settings.petty.itemNamePh')}
                        value={form.name}
                        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Select
                        label={t('settings.petty.colCategory')}
                        value={form.category}
                        onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                        options={[
                            { label: t('settings.petty.catAdministrative'), value: 'Administrative' },
                            { label: t('settings.petty.catKitchen'), value: 'Kitchen' },
                            { label: t('settings.petty.catMaintenance'), value: 'Maintenance' },
                            { label: t('settings.petty.catTransportation'), value: 'Transportation' },
                        ]}
                    />
                    <Input
                        label={t('settings.petty.limitEgp')}
                        type="number"
                        value={form.limit}
                        onChange={e => setForm(prev => ({ ...prev, limit: Number(e.target.value) }))}
                    />
                    <Select
                        label={t('settings.petty.colStatus')}
                        value={form.status}
                        onChange={e => setForm(prev => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' }))}
                        options={[
                            { label: t('settings.petty.statusActive'), value: 'Active' },
                            { label: t('settings.petty.statusInactive'), value: 'Inactive' },
                        ]}
                    />
                </div>
            </Modal>

            {/* Edit Item Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedItem(null);
                }}
                title={t('settings.petty.editModalTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('settings.petty.cancel')}
                        </Button>
                        <Button onClick={saveEdit}>{t('settings.petty.saveChanges')}</Button>
                    </div>
                }
            >
                {selectedItem && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input
                            label={t('settings.petty.itemName')}
                            value={form.name}
                            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Select
                            label={t('settings.petty.colCategory')}
                            value={form.category}
                            onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                            options={[
                                { label: t('settings.petty.catAdministrative'), value: 'Administrative' },
                                { label: t('settings.petty.catKitchen'), value: 'Kitchen' },
                                { label: t('settings.petty.catMaintenance'), value: 'Maintenance' },
                                { label: t('settings.petty.catTransportation'), value: 'Transportation' },
                            ]}
                        />
                        <Input
                            label={t('settings.petty.limitEgp')}
                            type="number"
                            value={form.limit}
                            onChange={e => setForm(prev => ({ ...prev, limit: Number(e.target.value) }))}
                        />
                        <Select
                            label={t('settings.petty.colStatus')}
                            value={form.status}
                            onChange={e =>
                                setForm(prev => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' }))
                            }
                            options={[
                                { label: t('settings.petty.statusActive'), value: 'Active' },
                                { label: t('settings.petty.statusInactive'), value: 'Inactive' },
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
                    setSelectedItem(null);
                }}
                title={t('settings.petty.deleteModalTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('settings.petty.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                try {
                                    if (selectedItem) {
                                        await settingsApi.deletePettyCashItem(selectedItem.id);
                                    }
                                    setIsDeleteOpen(false);
                                    setSelectedItem(null);
                                    addToast('error', t('settings.petty.toastDeleted'));
                                    refetch();
                                } catch {
                                    setIsDeleteOpen(false);
                                    setSelectedItem(null);
                                    addToast('error', t('settings.petty.toastDeleted'));
                                }
                            }}
                        >
                            {t('settings.petty.confirmDelete')}
                        </Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {t('settings.petty.deleteConfirmMsg1')}
                        <strong>{selectedItem?.name}</strong>
                        {t('settings.petty.deleteConfirmMsg2')}
                    </p>
                </div>
            </Modal>
        </div>
    );
}
