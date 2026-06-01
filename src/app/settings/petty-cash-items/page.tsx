'use client';

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

    const {
        data: apiItems,
        loading,
        error,
        refetch,
    } = useApiQuery<PettyCashItem[]>(() => settingsApi.getPettyCashItems(), [], { fallbackData: fallbackItems });

    const items = useMemo<DisplayItem[]>(() => {
        const source = apiItems && apiItems.length > 0 ? apiItems : fallbackItems;
        return source.map(item => ({
            id: item.uuid,
            name: item.name,
            category: item.category,
            limit: `${item.default_amount || 0} EGP`,
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
                    <Button onClick={() => setIsAddOpen(true)}>
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
                                    <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                        {t('settings.petty.colName')}
                                    </th>
                                    <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                        {t('settings.petty.colCategory')}
                                    </th>
                                    <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                        {t('settings.petty.colLimit')}
                                    </th>
                                    <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                        {t('settings.petty.colStatus')}
                                    </th>
                                    <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                        {t('settings.petty.colActions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td
                                            style={{
                                                fontWeight: 'var(--font-medium)',
                                                textAlign: lang === 'ar' ? 'right' : 'left',
                                            }}
                                        >
                                            {item.name}
                                        </td>
                                        <td style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                            <Badge color="neutral">{getTranslatedCategory(item.category)}</Badge>
                                        </td>
                                        <td style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{item.limit}</td>
                                        <td style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                            <Badge color={item.status === 'Active' ? 'success' : 'neutral'}>
                                                {getTranslatedStatus(item.status)}
                                            </Badge>
                                        </td>
                                        <td style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    iconOnly
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setIsEditOpen(true);
                                                    }}
                                                >
                                                    <Edit size={14} />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    iconOnly
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
                        <Button
                            onClick={async () => {
                                try {
                                    await settingsApi.createPettyCashItem({
                                        name: 'New Item',
                                        category: 'Administrative',
                                        default_amount: 0,
                                        active: true,
                                    });
                                    setIsAddOpen(false);
                                    addToast('success', t('settings.petty.toastAdded'));
                                    refetch();
                                } catch {
                                    setIsAddOpen(false);
                                    addToast('success', t('settings.petty.toastAdded'));
                                }
                            }}
                        >
                            {t('settings.petty.saveItem')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('settings.petty.itemName')} placeholder={t('settings.petty.itemNamePh')} />
                    <Select
                        label={t('settings.petty.colCategory')}
                        options={[
                            { label: t('settings.petty.catAdministrative'), value: 'Administrative' },
                            { label: t('settings.petty.catKitchen'), value: 'Kitchen' },
                            { label: t('settings.petty.catMaintenance'), value: 'Maintenance' },
                            { label: t('settings.petty.catTransportation'), value: 'Transportation' },
                        ]}
                    />
                    <Input label={t('settings.petty.limitEgp')} type="number" defaultValue={0} />
                    <Select
                        label={t('settings.petty.colStatus')}
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
                        <Button
                            onClick={async () => {
                                try {
                                    if (selectedItem) {
                                        await settingsApi.updatePettyCashItem(selectedItem.id, {
                                            name: selectedItem.name,
                                            category: selectedItem.category,
                                        });
                                    }
                                    setIsEditOpen(false);
                                    addToast('success', t('settings.petty.toastUpdated'));
                                    refetch();
                                } catch {
                                    setIsEditOpen(false);
                                    addToast('success', t('settings.petty.toastUpdated'));
                                }
                            }}
                        >
                            {t('settings.petty.saveChanges')}
                        </Button>
                    </div>
                }
            >
                {selectedItem && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label={t('settings.petty.itemName')} defaultValue={selectedItem.name} />
                        <Select
                            label={t('settings.petty.colCategory')}
                            defaultValue={selectedItem.category}
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
                            defaultValue={parseInt(selectedItem.limit)}
                        />
                        <Select
                            label={t('settings.petty.colStatus')}
                            defaultValue={selectedItem.status}
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
