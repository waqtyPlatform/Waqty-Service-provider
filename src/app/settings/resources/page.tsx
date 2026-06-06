'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, LayoutGrid, Armchair, DoorClosed, Monitor } from 'lucide-react';
import { Button, Badge, useToast, Modal, Input, Select } from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi, type Resource } from '@/lib/api';

const fallbackResources: Resource[] = [
    {
        uuid: '1',
        name: 'Styling Station 1',
        type: 'chair',
        branch_uuid: '',
        capacity: 1,
        active: true,
        created_at: '',
        updated_at: '',
    },
    {
        uuid: '2',
        name: 'Styling Station 2',
        type: 'chair',
        branch_uuid: '',
        capacity: 1,
        active: true,
        created_at: '',
        updated_at: '',
    },
    {
        uuid: '3',
        name: 'Spa Room A',
        type: 'room',
        branch_uuid: '',
        capacity: 1,
        active: false,
        created_at: '',
        updated_at: '',
    },
    {
        uuid: '4',
        name: 'Reception PC 1',
        type: 'equipment',
        branch_uuid: '',
        capacity: 0,
        active: true,
        created_at: '',
        updated_at: '',
    },
];

const getIcon = (type: string) => {
    switch (type) {
        case 'chair':
            return <Armchair size={16} />;
        case 'room':
            return <DoorClosed size={16} />;
        default:
            return <Monitor size={16} />;
    }
};

export default function ResourcesPage() {
    const { addToast } = useToast();
    const { t, lang } = useTranslation();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

    // Controlled form for the Add/Edit modals. Previously the inputs were unbound
    // (defaultValue only) and Save re-sent the unchanged selected row, so user edits
    // were silently lost.
    type ResourceForm = { name: string; type: Resource['type']; capacity: number; active: boolean };
    const emptyForm: ResourceForm = { name: '', type: 'chair', capacity: 1, active: true };
    const [form, setForm] = useState<ResourceForm>(emptyForm);

    const {
        data: apiResources,
        loading,
        error,
        refetch,
        setData: setApiResources,
    } = useApiQuery<Resource[]>(() => settingsApi.getResources(), [], { fallbackData: fallbackResources });

    const openAdd = () => {
        setForm(emptyForm);
        setIsAddOpen(true);
    };
    const openEdit = (r: Resource) => {
        setSelectedResource(r);
        setForm({ name: r.name, type: r.type, capacity: r.capacity, active: r.active });
        setIsEditOpen(true);
    };

    const saveAdd = async () => {
        if (!form.name.trim()) {
            addToast('error', t('settings.resources.nameRequired'));
            return;
        }
        const newResource: Resource = {
            uuid: `res-${Date.now()}`,
            name: form.name.trim(),
            type: form.type,
            branch_uuid: '',
            capacity: Number(form.capacity) || 0,
            active: form.active,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setApiResources(prev => [...(prev || []), newResource]);
        setIsAddOpen(false);
        try {
            await settingsApi.createResource({
                name: newResource.name,
                type: newResource.type,
                capacity: newResource.capacity,
                active: newResource.active,
                branch_uuid: '',
            });
            addToast('success', t('settings.resources.created'));
        } catch {
            addToast('error', t('settings.resources.createFailed'));
        }
    };

    const saveEdit = async () => {
        if (!selectedResource) return;
        if (!form.name.trim()) {
            addToast('error', t('settings.resources.nameRequired'));
            return;
        }
        const uuid = selectedResource.uuid;
        setApiResources(prev =>
            (prev || []).map(r =>
                r.uuid === uuid
                    ? {
                          ...r,
                          name: form.name.trim(),
                          type: form.type,
                          capacity: Number(form.capacity) || 0,
                          active: form.active,
                      }
                    : r
            )
        );
        setIsEditOpen(false);
        try {
            await settingsApi.updateResource(uuid, {
                name: form.name.trim(),
                type: form.type,
                capacity: Number(form.capacity) || 0,
                active: form.active,
            });
            addToast('success', t('settings.resources.updated'));
        } catch {
            addToast('error', t('settings.resources.updateFailed'));
        }
    };

    const resources = (apiResources || []).map(r => ({
        id: r.uuid,
        name: r.name,
        type: r.type === 'chair' ? 'Chair' : r.type === 'room' ? 'Room' : 'Equipment',
        icon: getIcon(r.type),
        capacity: r.capacity,
        status: r.active ? 'Active' : 'Maintenance',
        _raw: r,
    }));

    return (
        <div className={styles.page} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>{t('settings.resources.title')}</h1>
                    <div className={styles.subtitle}>{t('settings.resources.desc')}</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={openAdd}>
                        <Plus size={16} style={{ marginInlineEnd: 8 }} /> {t('settings.resources.add')}
                    </Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>
                        <LayoutGrid size={18} /> {t('settings.resources.listTitle')}
                    </span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'start' }}>{t('settings.resources.colName')}</th>
                                <th style={{ textAlign: 'start' }}>{t('settings.resources.colType')}</th>
                                <th style={{ textAlign: 'start' }}>{t('settings.resources.colCapacity')}</th>
                                <th style={{ textAlign: 'start' }}>{t('settings.resources.colStatus')}</th>
                                <th style={{ textAlign: 'start' }}>{t('settings.resources.colActions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map(res => (
                                <tr key={res.id}>
                                    <td
                                        style={{
                                            fontWeight: 'var(--font-medium)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                                        {res.icon} {res.name}
                                    </td>
                                    <td>
                                        {res.type === 'Chair'
                                            ? t('settings.resources.typeChair')
                                            : res.type === 'Room'
                                              ? t('settings.resources.typeRoom')
                                              : t('settings.resources.typeEquip')}
                                    </td>
                                    <td>
                                        {res.capacity > 0 ? `${res.capacity} ${t('settings.resources.persons')}` : '-'}
                                    </td>
                                    <td>
                                        <Badge color={res.status === 'Active' ? 'success' : 'warning'}>
                                            {res.status === 'Active'
                                                ? t('settings.resources.statusActive')
                                                : t('settings.resources.statusMaint')}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                iconOnly
                                                aria-label={t('common.edit')}
                                                onClick={() => openEdit(res._raw)}
                                            >
                                                <Edit size={14} />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                iconOnly
                                                aria-label={t('common.delete')}
                                                onClick={() => {
                                                    setSelectedResource(res._raw);
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

            {/* Add Resource Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('settings.resources.createTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('settings.resources.cancel')}
                        </Button>
                        <Button onClick={saveAdd}>{t('settings.resources.saveResource')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('settings.resources.resName')}
                        placeholder={t('settings.resources.namePh')}
                        value={form.name}
                        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Select
                        label={t('settings.resources.resType')}
                        value={form.type}
                        onChange={e => setForm(prev => ({ ...prev, type: e.target.value as Resource['type'] }))}
                        options={[
                            { label: t('settings.resources.typeChair'), value: 'chair' },
                            { label: t('settings.resources.typeRoom'), value: 'room' },
                            { label: t('settings.resources.typeEquip'), value: 'equipment' },
                        ]}
                    />
                    <Input
                        label={t('settings.resources.capPersons')}
                        type="number"
                        placeholder="1"
                        dir="ltr"
                        value={form.capacity}
                        onChange={e => setForm(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                    />
                    <Select
                        label={t('settings.resources.colStatus')}
                        value={form.active ? 'active' : 'maintenance'}
                        onChange={e => setForm(prev => ({ ...prev, active: e.target.value === 'active' }))}
                        options={[
                            { label: t('settings.resources.statusActive'), value: 'active' },
                            { label: t('settings.resources.statusMaint'), value: 'maintenance' },
                        ]}
                    />
                </div>
            </Modal>

            {/* Edit Resource Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedResource(null);
                }}
                title={t('settings.resources.editTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('settings.resources.cancel')}
                        </Button>
                        <Button onClick={saveEdit}>{t('settings.resources.saveChanges')}</Button>
                    </div>
                }
            >
                {selectedResource && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input
                            label={t('settings.resources.resName')}
                            value={form.name}
                            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Select
                            label={t('settings.resources.resType')}
                            value={form.type}
                            onChange={e => setForm(prev => ({ ...prev, type: e.target.value as Resource['type'] }))}
                            options={[
                                { label: t('settings.resources.typeChair'), value: 'chair' },
                                { label: t('settings.resources.typeRoom'), value: 'room' },
                                { label: t('settings.resources.typeEquip'), value: 'equipment' },
                            ]}
                        />
                        <Input
                            label={t('settings.resources.capPersons')}
                            type="number"
                            dir="ltr"
                            value={form.capacity}
                            onChange={e => setForm(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                        />
                        <Select
                            label={t('settings.resources.colStatus')}
                            value={form.active ? 'active' : 'maintenance'}
                            onChange={e => setForm(prev => ({ ...prev, active: e.target.value === 'active' }))}
                            options={[
                                { label: t('settings.resources.statusActive'), value: 'active' },
                                { label: t('settings.resources.statusMaint'), value: 'maintenance' },
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
                    setSelectedResource(null);
                }}
                title={t('settings.resources.deleteTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('settings.resources.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                try {
                                    if (selectedResource) await settingsApi.deleteResource(selectedResource.uuid);
                                    setIsDeleteOpen(false);
                                    addToast('error', t('settings.resources.deletedPermanently'));
                                    refetch();
                                } catch {
                                    addToast('error', t('settings.resources.deleteFailed'));
                                }
                            }}
                        >
                            {t('settings.resources.confirmDelete')}
                        </Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {t('settings.resources.deleteWarning1')}
                        <strong>{selectedResource?.name}</strong>
                        {t('settings.resources.deleteWarning2')}
                    </p>
                </div>
            </Modal>
        </div>
    );
}
