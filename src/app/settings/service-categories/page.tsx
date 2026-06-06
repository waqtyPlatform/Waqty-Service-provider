'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Move, FolderKanban } from 'lucide-react';
import { Button, Badge, Modal, Input, Select, useToast } from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi, type ServiceCategory } from '@/lib/api';

const fallbackCategories: ServiceCategory[] = [
    {
        uuid: '1',
        name: 'Hair Styling',
        sort_order: 1,
        services_count: 12,
        active: true,
        created_at: '',
        updated_at: '',
    },
    {
        uuid: '2',
        name: 'Nails & Manicure',
        sort_order: 2,
        services_count: 8,
        active: true,
        created_at: '',
        updated_at: '',
    },
    {
        uuid: '3',
        name: 'Spa & Massage',
        sort_order: 3,
        services_count: 5,
        active: true,
        created_at: '',
        updated_at: '',
    },
    { uuid: '4', name: 'Makeup', sort_order: 4, services_count: 4, active: true, created_at: '', updated_at: '' },
];

const colorMap: Record<number, string> = { 0: '#8b5cf6', 1: '#ec4899', 2: '#10b981', 3: '#f59e0b', 4: '#3b82f6' };
const DEFAULT_COLOR = '#8b5cf6';

export default function ServiceCategoriesPage() {
    const { addToast } = useToast();
    const { t } = useTranslation();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCat, setSelectedCat] = useState<ServiceCategory | null>(null);

    // Controlled form for the Add/Edit modals. Previously the Add modal saved a
    // hardcoded "New Category" and the Edit modal re-sent the unchanged row name
    // (defaultValue-only inputs) — both silently dropped what the user typed.
    type CategoryForm = { name: string; color: string };
    const emptyForm: CategoryForm = { name: '', color: DEFAULT_COLOR };
    const [form, setForm] = useState<CategoryForm>(emptyForm);

    // `color` is a display-only concept (the ServiceCategory type has no color
    // field). Track per-uuid overrides so a chosen color survives the optimistic
    // update and shows immediately, falling back to the index-based palette.
    const [colorOverrides, setColorOverrides] = useState<Record<string, string>>({});

    const {
        data: apiCategories,
        loading,
        error,
        refetch,
        setData: setCategories,
    } = useApiQuery<ServiceCategory[]>(() => settingsApi.getServiceCategories(), [], {
        fallbackData: fallbackCategories,
    });

    const categories = (apiCategories || []).map((c, i) => ({
        id: c.uuid,
        name: c.name,
        color: colorOverrides[c.uuid] || colorMap[i % 5] || DEFAULT_COLOR,
        services: c.services_count,
        order: c.sort_order,
        _raw: c,
    }));

    const openAdd = () => {
        setForm(emptyForm);
        setIsAddOpen(true);
    };

    const openEdit = (cat: ServiceCategory, color: string) => {
        setSelectedCat(cat);
        setForm({ name: cat.name, color });
        setIsEditOpen(true);
    };

    const saveAdd = async () => {
        if (!form.name.trim()) {
            addToast('error', t('settings.serviceCategories.nameRequired'));
            return;
        }
        const name = form.name.trim();
        const newCat: ServiceCategory = {
            uuid: `cat-${Date.now()}`,
            name,
            sort_order: (apiCategories || []).length + 1,
            services_count: 0,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setColorOverrides(prev => ({ ...prev, [newCat.uuid]: form.color }));
        setCategories(prev => [...(prev || []), newCat]);
        setIsAddOpen(false);
        try {
            await settingsApi.createServiceCategory({ name, color: form.color, active: true });
            addToast('success', t('settings.serviceCategories.created'));
        } catch {
            addToast('error', t('settings.serviceCategories.createFailed'));
        }
    };

    const saveEdit = async () => {
        if (!selectedCat) return;
        if (!form.name.trim()) {
            addToast('error', t('settings.serviceCategories.nameRequired'));
            return;
        }
        const uuid = selectedCat.uuid;
        const name = form.name.trim();
        setColorOverrides(prev => ({ ...prev, [uuid]: form.color }));
        setCategories(prev => (prev || []).map(c => (c.uuid === uuid ? { ...c, name } : c)));
        setIsEditOpen(false);
        try {
            await settingsApi.updateServiceCategory(uuid, { name, color: form.color });
            addToast('success', t('settings.serviceCategories.updated'));
        } catch {
            addToast('error', t('settings.serviceCategories.updateFailed'));
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>{t('settings.serviceCategories.title')}</h1>
                    <div className={styles.subtitle}>{t('settings.serviceCategories.desc')}</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={openAdd}>
                        <Plus size={16} /> {t('settings.serviceCategories.newCategory')}
                    </Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>
                        <FolderKanban size={18} /> {t('settings.serviceCategories.categories')}
                    </span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: 50 }}></th>
                                <th>{t('settings.serviceCategories.colName')}</th>
                                <th>{t('settings.serviceCategories.colColorTag')}</th>
                                <th>{t('settings.serviceCategories.colServicesCount')}</th>
                                <th>{t('settings.serviceCategories.colActions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat.id}>
                                    <td>
                                        <Move size={14} style={{ cursor: 'grab', color: 'var(--text-tertiary)' }} />
                                    </td>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{cat.name}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div className={styles.colorCircle} style={{ background: cat.color }} />
                                            <span
                                                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
                                            >
                                                {cat.color}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <Badge color="neutral">
                                            {cat.services} {t('settings.serviceCategories.services')}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEdit(cat._raw, cat.color)}
                                            >
                                                <Edit size={14} />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedCat(cat._raw);
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

            {/* Add Category Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('settings.serviceCategories.createTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('settings.serviceCategories.cancel')}
                        </Button>
                        <Button onClick={saveAdd}>{t('settings.serviceCategories.saveCategory')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('settings.serviceCategories.categoryName')}
                        placeholder={t('settings.serviceCategories.namePh')}
                        value={form.name}
                        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Select
                        label={t('settings.serviceCategories.colorTag')}
                        value={form.color}
                        onChange={e => setForm(prev => ({ ...prev, color: e.target.value }))}
                        options={[
                            { label: t('settings.serviceCategories.colors.purple'), value: '#8b5cf6' },
                            { label: t('settings.serviceCategories.colors.pink'), value: '#ec4899' },
                            { label: t('settings.serviceCategories.colors.green'), value: '#10b981' },
                            { label: t('settings.serviceCategories.colors.orange'), value: '#f59e0b' },
                            { label: t('settings.serviceCategories.colors.blue'), value: '#3b82f6' },
                        ]}
                    />
                </div>
            </Modal>

            {/* Edit Category Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedCat(null);
                }}
                title={t('settings.serviceCategories.editTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('settings.serviceCategories.cancel')}
                        </Button>
                        <Button onClick={saveEdit}>{t('settings.serviceCategories.saveChanges')}</Button>
                    </div>
                }
            >
                {selectedCat && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input
                            label={t('settings.serviceCategories.categoryName')}
                            value={form.name}
                            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Select
                            label={t('settings.serviceCategories.colorTag')}
                            value={form.color}
                            onChange={e => setForm(prev => ({ ...prev, color: e.target.value }))}
                            options={[
                                { label: t('settings.serviceCategories.colors.purple'), value: '#8b5cf6' },
                                { label: t('settings.serviceCategories.colors.pink'), value: '#ec4899' },
                                { label: t('settings.serviceCategories.colors.green'), value: '#10b981' },
                                { label: t('settings.serviceCategories.colors.orange'), value: '#f59e0b' },
                                { label: t('settings.serviceCategories.colors.blue'), value: '#3b82f6' },
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
                    setSelectedCat(null);
                }}
                title={t('settings.serviceCategories.deleteTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('settings.serviceCategories.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                try {
                                    if (selectedCat) await settingsApi.deleteServiceCategory(selectedCat.uuid);
                                    setIsDeleteOpen(false);
                                    addToast('error', t('settings.serviceCategories.deleted'));
                                    refetch();
                                } catch {
                                    addToast('error', t('settings.serviceCategories.deleteFailed'));
                                }
                            }}
                        >
                            {t('settings.serviceCategories.confirmDelete')}
                        </Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('settings.serviceCategories.deleteWarning')}</p>
                </div>
            </Modal>
        </div>
    );
}
