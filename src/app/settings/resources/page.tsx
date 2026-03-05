'use client';

import React, { useState } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    LayoutGrid,
    Armchair,
    DoorClosed,
    Monitor
} from 'lucide-react';
import {
    Button,
    Badge,
    useToast,
    Modal,
    Input,
    Select
} from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';

// Mock Data
const resources = [
    { id: 1, name: 'Styling Station 1', type: 'Chair', icon: <Armchair size={16} />, capacity: 1, status: 'Active' },
    { id: 2, name: 'Styling Station 2', type: 'Chair', icon: <Armchair size={16} />, capacity: 1, status: 'Active' },
    { id: 3, name: 'Spa Room A', type: 'Room', icon: <DoorClosed size={16} />, capacity: 1, status: 'Maintenance' },
    { id: 4, name: 'Reception PC 1', type: 'Equipment', icon: <Monitor size={16} />, capacity: 0, status: 'Active' },
];

export default function ResourcesPage() {
    const { addToast } = useToast();
    const { t, lang } = useTranslation();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<any>(null);

    return (
        <div className={styles.page} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>{t('settings.resources.title')}</h1>
                    <div className={styles.subtitle}>{t('settings.resources.desc')}</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => setIsAddOpen(true)}><Plus size={16} style={{ marginInlineEnd: 8 }} /> {t('settings.resources.add')}</Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><LayoutGrid size={18} /> {t('settings.resources.listTitle')}</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('settings.resources.colName')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('settings.resources.colType')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('settings.resources.colCapacity')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('settings.resources.colStatus')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('settings.resources.colActions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map(res => (
                                <tr key={res.id}>
                                    <td style={{ fontWeight: 'var(--font-medium)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {res.icon} {res.name}
                                    </td>
                                    <td>{res.type === 'Chair' ? t('settings.resources.typeChair') : res.type === 'Room' ? t('settings.resources.typeRoom') : t('settings.resources.typeEquip')}</td>
                                    <td>{res.capacity > 0 ? `${res.capacity} ${t('settings.resources.persons')}` : '-'}</td>
                                    <td>
                                        <Badge color={res.status === 'Active' ? 'success' : 'warning'}>{res.status === 'Active' ? t('settings.resources.statusActive') : t('settings.resources.statusMaint')}</Badge>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Button variant="ghost" size="sm" iconOnly onClick={() => { setSelectedResource(res); setIsEditOpen(true); }}><Edit size={14} /></Button>
                                            <Button variant="destructive" size="sm" iconOnly onClick={() => { setSelectedResource(res); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
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
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>{t('settings.resources.cancel')}</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Resource created successfully'); }}>{t('settings.resources.saveResource')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('settings.resources.resName')} placeholder="e.g. Styling Station 3" />
                    <Select label={t('settings.resources.resType')} options={[{ label: t('settings.resources.typeChair'), value: 'chair' }, { label: t('settings.resources.typeRoom'), value: 'room' }, { label: t('settings.resources.typeEquip'), value: 'equipment' }]} />
                    <Input label={t('settings.resources.capPersons')} type="number" placeholder="1" dir="ltr" />
                    <Select label={t('settings.resources.colStatus')} options={[{ label: t('settings.resources.statusActive'), value: 'active' }, { label: t('settings.resources.statusMaint'), value: 'maintenance' }]} />
                </div>
            </Modal>

            {/* Edit Resource Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedResource(null); }}
                title={t('settings.resources.editTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>{t('settings.resources.cancel')}</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Resource updated successfully'); }}>{t('settings.resources.saveChanges')}</Button>
                    </div>
                }
            >
                {selectedResource && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label={t('settings.resources.resName')} defaultValue={selectedResource.name} />
                        <Select label={t('settings.resources.resType')} defaultValue={selectedResource.type.toLowerCase()} options={[{ label: t('settings.resources.typeChair'), value: 'chair' }, { label: t('settings.resources.typeRoom'), value: 'room' }, { label: t('settings.resources.typeEquip'), value: 'equipment' }]} />
                        <Input label={t('settings.resources.capPersons')} type="number" defaultValue={selectedResource.capacity} dir="ltr" />
                        <Select label={t('settings.resources.colStatus')} defaultValue={selectedResource.status.toLowerCase()} options={[{ label: t('settings.resources.statusActive'), value: 'active' }, { label: t('settings.resources.statusMaint'), value: 'maintenance' }]} />
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedResource(null); }}
                title={t('settings.resources.deleteTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>{t('settings.resources.cancel')}</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Resource deleted permanently'); }}>{t('settings.resources.confirmDelete')}</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {t('settings.resources.deleteWarning1')}<strong>{selectedResource?.name}</strong>{t('settings.resources.deleteWarning2')}
                    </p>
                </div>
            </Modal>
        </div >
    );
}
