'use client';

import { egpLabel } from '@/lib/money';
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Clock } from 'lucide-react';
import { useToast, Modal, Input, Select, Button } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { providerApi, publicApi, type Service } from '@/lib/api';

interface ServiceItem {
    id: string | number;
    uuid?: string;
    name: string;
    category: string;
    duration: number;
    price: number;
    tax: boolean;
    status: string;
}

function mapApiService(svc: Service): ServiceItem {
    return {
        id: svc.uuid,
        uuid: svc.uuid,
        name: svc.name,
        category: svc.sub_category?.name || 'Uncategorized', // GAP: API uses sub_category UUID, not a plain category string
        duration: svc.estimated_duration_minutes || 0,
        price: 0, // GAP: price is separate (service-prices API), not on the service itself
        tax: false, // GAP: API has no tax field
        status: svc.active ? 'active' : 'inactive',
    };
}

const fallbackServices: ServiceItem[] = [
    { id: 1, name: 'Hair Cut', category: 'Hair', duration: 45, price: 120, tax: true, status: 'active' },
    { id: 2, name: 'Hair Coloring', category: 'Hair', duration: 90, price: 450, tax: true, status: 'active' },
    { id: 3, name: 'Keratin Treatment', category: 'Hair', duration: 120, price: 800, tax: true, status: 'active' },
    { id: 4, name: 'HydraFacial', category: 'Skin', duration: 60, price: 520, tax: true, status: 'active' },
    { id: 5, name: 'Classic Facial', category: 'Skin', duration: 45, price: 280, tax: true, status: 'active' },
    { id: 6, name: 'Swedish Massage', category: 'Body', duration: 60, price: 350, tax: true, status: 'active' },
    { id: 7, name: 'Deep Tissue', category: 'Body', duration: 60, price: 400, tax: true, status: 'active' },
    { id: 8, name: 'Gel Manicure', category: 'Nails', duration: 30, price: 150, tax: true, status: 'active' },
    { id: 9, name: 'Pedicure', category: 'Nails', duration: 45, price: 180, tax: true, status: 'active' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' },
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
    table: {
        width: '100%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    th: {
        padding: 'var(--space-3) var(--space-4)',
        textAlign: 'start',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: 'var(--bg-secondary)',
    },
    td: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        borderTop: '1px solid var(--border-color)',
    },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
    },
};

export default function ServicesSettingsPage() {
    const [search, setSearch] = useState('');
    const [services, setServices] = useState<ServiceItem[]>(fallbackServices);
    const [apiLoaded, setApiLoaded] = useState(false);
    const { addToast } = useToast();
    const { t, lang } = useTranslation();

    // CRUD state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

    const [refreshKey, setRefreshKey] = useState(0);

    // Controlled Add-form fields
    const [addName, setAddName] = useState('');
    const [addCategory, setAddCategory] = useState('Hair');
    const [addDuration, setAddDuration] = useState('60');
    const [addPrice, setAddPrice] = useState('200');

    // Controlled Edit-form fields (synced from the selected service)
    const [editName, setEditName] = useState('');
    const [editCategory, setEditCategory] = useState('Hair');
    const [editDuration, setEditDuration] = useState('0');
    const [editPrice, setEditPrice] = useState('0');

    // Real service taxonomy from the public/global API. The provider "service
    // categories" endpoint does not exist, so the platform subcategories are the
    // source of truth: they populate the category dropdown and let create/update
    // persist the correct sub_category_uuid. Falls back to the hardcoded options
    // when the public API is unreachable, so the form never breaks offline.
    const [subcats, setSubcats] = useState<{ uuid: string; name: string }[]>([]);
    const categoryOptions = subcats.length
        ? subcats.map(sc => ({ label: sc.name, value: sc.uuid }))
        : [
              { label: t('settings.services.hair'), value: 'Hair' },
              { label: t('settings.services.skin'), value: 'Skin' },
              { label: t('settings.services.body'), value: 'Body' },
              { label: t('settings.services.nails'), value: 'Nails' },
          ];
    const catDisplayName = (value: string) => subcats.find(c => c.uuid === value)?.name ?? value;

    const resetAddForm = () => {
        setAddName('');
        setAddCategory('Hair');
        setAddDuration('60');
        setAddPrice('200');
    };

    // When the edit modal opens for a service, seed the controlled fields
    useEffect(() => {
        if (selectedService) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill controlled edit fields when modal opens
            setEditName(selectedService.name);
            // Resolve the stored category NAME back to a real subcategory uuid so the
            // dropdown preselects correctly; fall back to the raw value offline.
            setEditCategory(subcats.find(c => c.name === selectedService.category)?.uuid ?? selectedService.category);
            setEditDuration(String(selectedService.duration));
            setEditPrice(String(selectedService.price));
        }
    }, [selectedService, subcats]);

    const handleAddService = async () => {
        if (!addName.trim()) {
            addToast('error', t('settings.services.nameRequired'));
            return;
        }
        const duration = Number(addDuration) || 0;
        const price = Number(addPrice) || 0;
        const newService: ServiceItem = {
            id: `local-${Date.now()}`,
            name: addName.trim(),
            category: catDisplayName(addCategory),
            duration,
            price,
            tax: true,
            status: 'active',
        };
        // Optimistically add to the local list so the change is visible
        setServices(prev => [newService, ...prev]);

        // Best-effort persistence to the API (mock fallback otherwise)
        try {
            const formData = new FormData();
            formData.append('name', newService.name);
            formData.append('estimated_duration_minutes', String(duration));
            // Persist the real category when a public subcategory is selected.
            if (subcats.some(c => c.uuid === addCategory)) formData.append('sub_category_uuid', addCategory);
            const res = await providerApi.createService(formData);
            if (res.success && res.data) {
                const created = mapApiService(res.data);
                setServices(prev => prev.map(item => (item.id === newService.id ? created : item)));
            }
        } catch {
            // Keep the optimistic local entry
        }

        setIsAddOpen(false);
        resetAddForm();
        addToast('success', t('settings.services.added'));
    };

    const handleUpdateService = async () => {
        if (!selectedService) return;
        if (!editName.trim()) {
            addToast('error', t('settings.services.nameRequired'));
            return;
        }
        const duration = Number(editDuration) || 0;
        const price = Number(editPrice) || 0;
        const updated: ServiceItem = {
            ...selectedService,
            name: editName.trim(),
            category: catDisplayName(editCategory),
            duration,
            price,
        };
        // Optimistically update the local list so the change is visible
        setServices(prev => prev.map(item => (item.id === selectedService.id ? updated : item)));

        // Best-effort persistence to the API (mock fallback otherwise)
        if (selectedService.uuid) {
            try {
                const formData = new FormData();
                formData.append('name', updated.name);
                formData.append('estimated_duration_minutes', String(duration));
                if (subcats.some(c => c.uuid === editCategory)) formData.append('sub_category_uuid', editCategory);
                await providerApi.updateService(selectedService.uuid, formData);
            } catch {
                // Keep the optimistic local update
            }
        }

        setIsEditOpen(false);
        setSelectedService(null);
        addToast('success', t('settings.services.updated'));
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await providerApi.getServices();
                if (!cancelled && res.success && res.data) {
                    setServices(res.data.map(svc => mapApiService(svc)));
                    setApiLoaded(true);
                }
            } catch {
                // Keep fallback data
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [refreshKey]);

    // Load the real category taxonomy from the public/global API (best-effort).
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await publicApi.getAllSubcategories();
                if (!cancelled && res.success && res.data?.length) {
                    const mapped = res.data.map(sc => ({ uuid: sc.uuid, name: sc.name }));
                    setSubcats(mapped);
                    // Default the Add picker to a real subcategory once loaded.
                    setAddCategory(prev => (mapped.some(m => m.uuid === prev) ? prev : mapped[0].uuid));
                }
            } catch {
                // Public API unreachable — keep the hardcoded fallback options.
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}>
                    <Search size={16} style={s.searchIcon as React.CSSProperties} />
                    <input
                        style={s.searchInput}
                        placeholder={t('settings.services.search')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button style={s.addBtn} onClick={() => setIsAddOpen(true)}>
                    <Plus size={16} /> {t('settings.services.addService')}
                </button>
            </div>
            <table style={s.table}>
                <thead>
                    <tr>
                        {[
                            t('settings.services.colService'),
                            t('settings.services.colCategory'),
                            t('settings.services.colDuration'),
                            t('settings.services.colPrice'),
                            t('settings.services.colTax'),
                            t('settings.services.colStatus'),
                            t('settings.services.colActions'),
                        ].map(h => (
                            <th
                                key={h}
                                style={{
                                    ...(s.th as React.CSSProperties),
                                    textAlign: 'start',
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(svc => (
                        <tr key={svc.id}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{svc.name}</td>
                            <td style={s.td}>{svc.category}</td>
                            <td style={s.td}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={12} /> {svc.duration} {t('settings.services.min')}
                                </div>
                            </td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }}>
                                {svc.price} {egpLabel()}
                            </td>
                            <td style={s.td}>{svc.tax ? '✓' : '—'}</td>
                            <td style={s.td}>
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        padding: '2px 8px',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: 11,
                                        fontWeight: 'var(--font-semibold)',
                                        background: 'var(--color-success-light)',
                                        color: 'var(--color-success)',
                                    }}
                                >
                                    {t('settings.services.active')}
                                </span>
                            </td>
                            <td style={s.td}>
                                <div style={s.actions}>
                                    <button
                                        style={s.btnIcon}
                                        onClick={() => {
                                            setSelectedService(svc);
                                            setIsEditOpen(true);
                                        }}
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        style={{ ...s.btnIcon, color: 'var(--color-error)' }}
                                        onClick={() => {
                                            setSelectedService(svc);
                                            setIsDeleteOpen(true);
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Service Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => {
                    setIsAddOpen(false);
                    resetAddForm();
                }}
                title={t('settings.services.createTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsAddOpen(false);
                                resetAddForm();
                            }}
                        >
                            {t('settings.services.cancel')}
                        </Button>
                        <Button onClick={handleAddService}>{t('settings.services.saveService')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('settings.services.serviceName')}
                        placeholder={t('settings.services.namePh')}
                        value={addName}
                        onChange={e => setAddName(e.target.value)}
                    />
                    <Select
                        label={t('settings.services.category')}
                        value={addCategory}
                        onChange={e => setAddCategory(e.target.value)}
                        options={categoryOptions}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input
                            label={t('settings.services.duration')}
                            type="number"
                            value={addDuration}
                            onChange={e => setAddDuration(e.target.value)}
                        />
                        <Input
                            label={t('settings.services.price')}
                            type="number"
                            value={addPrice}
                            onChange={e => setAddPrice(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>

            {/* Edit Service Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedService(null);
                }}
                title={t('settings.services.edit')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('settings.services.cancel')}
                        </Button>
                        <Button onClick={handleUpdateService}>{t('settings.services.saveChanges')}</Button>
                    </div>
                }
            >
                {selectedService && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input
                            label={t('settings.services.serviceName')}
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                        />
                        <Select
                            label={t('settings.services.category')}
                            value={editCategory}
                            onChange={e => setEditCategory(e.target.value)}
                            options={categoryOptions}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <Input
                                label={t('settings.services.duration')}
                                type="number"
                                value={editDuration}
                                onChange={e => setEditDuration(e.target.value)}
                            />
                            <Input
                                label={t('settings.services.price')}
                                type="number"
                                value={editPrice}
                                onChange={e => setEditPrice(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedService(null);
                }}
                title={t('settings.services.delete')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('settings.services.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (apiLoaded && selectedService?.uuid) {
                                    try {
                                        await providerApi.deleteService(selectedService.uuid);
                                        addToast('error', t('settings.services.removed'));
                                        setRefreshKey(k => k + 1);
                                    } catch (err: unknown) {
                                        const error = err as { message?: string };
                                        addToast('error', error.message || t('settings.services.deleteFailed'));
                                    }
                                } else {
                                    addToast('error', t('settings.services.removed'));
                                }
                                setIsDeleteOpen(false);
                            }}
                        >
                            {t('settings.services.confirmDelete')}
                        </Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('settings.services.deleteWarning')}</p>
                </div>
            </Modal>
        </div>
    );
}
