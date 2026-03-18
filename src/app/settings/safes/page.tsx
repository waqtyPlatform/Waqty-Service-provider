'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Lock, DollarSign, Vault, MapPin } from 'lucide-react';
import { Button, Badge, useToast, Modal, Input, Select, SlideOver } from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';

const initialSafes = [
    {
        id: 1,
        name: 'Main Reception Safe',
        branch: 'Downtown',
        balance: 12450,
        lastActivity: 'Today, 3:20 PM',
        status: 'Active',
        color: '#3B82F6',
    },
    {
        id: 2,
        name: 'Back Office Safe',
        branch: 'Downtown',
        balance: 50000,
        lastActivity: 'Today, 11:00 AM',
        status: 'Active',
        color: '#10B981',
    },
    {
        id: 3,
        name: 'Petty Cash Box',
        branch: 'Downtown',
        balance: 1200,
        lastActivity: 'Yesterday',
        status: 'Active',
        color: '#F59E0B',
    },
    {
        id: 4,
        name: 'Mall Branch Safe',
        branch: 'Mall of Arabia',
        balance: 8750,
        lastActivity: 'Today, 1:45 PM',
        status: 'Active',
        color: '#8B5CF6',
    },
    {
        id: 5,
        name: 'New Cairo Drawer',
        branch: 'New Cairo',
        balance: 3200,
        lastActivity: 'Feb 20',
        status: 'Inactive',
        color: '#6B7280',
    },
];

export default function SafesPage() {
    const { addToast } = useToast();
    const { t } = useTranslation();
    const [safesList, setSafesList] = useState(initialSafes);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedSafe, setSelectedSafe] = useState<{
        id: number;
        name: string;
        branch: string;
        balance: number;
        status: string;
        color: string;
        lastActivity: string;
    } | null>(null);
    const [newSafe, setNewSafe] = useState({ name: '', branch: 'downtown', balance: '', status: 'active' });

    const totalBalance = safesList.reduce((s, safe) => s + safe.balance, 0);
    const activeSafes = safesList.filter(s => s.status === 'Active').length;

    const handleAddSafe = () => {
        if (!newSafe.name) return addToast('error', 'Safe name is required');
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
        const branchMap: Record<string, string> = {
            downtown: 'Downtown',
            mall: 'Mall of Arabia',
            newcairo: 'New Cairo',
        };
        const added = {
            id: Date.now(),
            name: newSafe.name,
            branch: branchMap[newSafe.branch] || 'Downtown',
            balance: parseFloat(newSafe.balance) || 0,
            lastActivity: 'Just now',
            status: newSafe.status === 'active' ? 'Active' : 'Inactive',
            color: colors[Math.floor(Math.random() * colors.length)],
        };
        setSafesList([...safesList, added]);
        setIsAddOpen(false);
        setNewSafe({ name: '', branch: 'downtown', balance: '', status: 'active' });
        addToast('success', `"${added.name}" created successfully`);
    };

    const handleDeleteSafe = () => {
        setSafesList(safesList.filter(s => s.id !== selectedSafe?.id));
        setIsDeleteOpen(false);
        setSelectedSafe(null);
        addToast('success', 'Safe deleted permanently');
    };

    const fmt = (n: number) => n.toLocaleString('en-US');

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>
                        <Lock size={24} /> {t('settings.safes.title')}
                    </h1>
                    <div className={styles.subtitle}>{t('settings.safes.desc')}</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => setIsAddOpen(true)}>
                        <Plus size={16} /> {t('settings.safes.newSafe')}
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className={styles.kpiRow}>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIcon}
                        style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}
                    >
                        <DollarSign size={22} />
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{fmt(totalBalance)} EGP</span>
                        <span className={styles.kpiLabel}>{t('settings.safes.totalBalance')}</span>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIcon}
                        style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}
                    >
                        <Vault size={22} />
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>
                            {activeSafes} / {safesList.length}
                        </span>
                        <span className={styles.kpiLabel}>{t('settings.safes.activeSafes')}</span>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIcon}
                        style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}
                    >
                        <MapPin size={22} />
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{new Set(safesList.map(s => s.branch)).size}</span>
                        <span className={styles.kpiLabel}>{t('settings.safes.branchesCovered')}</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>
                        <Lock size={16} /> {t('settings.safes.allSafes')}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                        {safesList.length} {t('settings.safes.safesTotal')}
                    </span>
                </div>
                <div className={styles.tableScroll}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>{t('settings.safes.colSafe')}</th>
                                <th>{t('settings.safes.colBalance')}</th>
                                <th>{t('settings.safes.colLastActivity')}</th>
                                <th>{t('settings.safes.colStatus')}</th>
                                <th style={{ textAlign: 'right' }}>{t('settings.safes.colActions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {safesList.map(safe => (
                                <tr key={safe.id}>
                                    <td>
                                        <div className={styles.safeName}>
                                            <div
                                                className={styles.safeIcon}
                                                style={{ background: `${safe.color}18`, color: safe.color }}
                                            >
                                                <Vault size={18} />
                                            </div>
                                            <div className={styles.safeInfo}>
                                                <span className={styles.safeLabel}>{safe.name}</span>
                                                <span className={styles.safeBranch}>
                                                    <MapPin size={10} /> {safe.branch}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.balance}>{fmt(safe.balance)} EGP</span>
                                    </td>
                                    <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                        {safe.lastActivity}
                                    </td>
                                    <td>
                                        <Badge color={safe.status === 'Active' ? 'success' : 'neutral'}>
                                            {safe.status === 'Active'
                                                ? t('settings.safes.active')
                                                : t('settings.safes.inactive')}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                iconOnly
                                                onClick={() => {
                                                    setSelectedSafe(safe);
                                                    setIsEditOpen(true);
                                                }}
                                            >
                                                <Edit size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                iconOnly
                                                style={{ color: 'var(--color-error)' }}
                                                onClick={() => {
                                                    setSelectedSafe(safe);
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

            {/* Add Safe SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('settings.safes.createTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('settings.safes.cancel')}
                        </Button>
                        <Button onClick={handleAddSafe}>{t('settings.safes.createSafe')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('settings.safes.safeName')}
                        placeholder="e.g. Front Desk Safe"
                        value={newSafe.name}
                        onChange={e => setNewSafe({ ...newSafe, name: e.target.value })}
                    />
                    <Select
                        label={t('settings.safes.branch')}
                        value={newSafe.branch}
                        onChange={e => setNewSafe({ ...newSafe, branch: e.target.value })}
                        options={[
                            { label: 'Downtown', value: 'downtown' },
                            { label: 'Mall of Arabia', value: 'mall' },
                            { label: 'New Cairo', value: 'newcairo' },
                        ]}
                    />
                    <Input
                        label={t('settings.safes.initialBalance')}
                        type="number"
                        placeholder="0.00"
                        value={newSafe.balance}
                        onChange={e => setNewSafe({ ...newSafe, balance: e.target.value })}
                    />
                    <Select
                        label={t('settings.safes.status')}
                        value={newSafe.status}
                        onChange={e => setNewSafe({ ...newSafe, status: e.target.value })}
                        options={[
                            { label: t('settings.safes.active'), value: 'active' },
                            { label: t('settings.safes.inactive'), value: 'inactive' },
                        ]}
                    />
                </div>
            </SlideOver>

            {/* Edit Safe SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedSafe(null);
                }}
                title={t('settings.safes.editTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('settings.safes.cancel')}
                        </Button>
                        <Button
                            onClick={() => {
                                setIsEditOpen(false);
                                addToast('success', 'Safe updated successfully');
                            }}
                        >
                            {t('settings.safes.saveChanges')}
                        </Button>
                    </div>
                }
            >
                {selectedSafe && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label={t('settings.safes.safeName')} defaultValue={selectedSafe.name} />
                        <Select
                            label={t('settings.safes.branch')}
                            defaultValue="downtown"
                            options={[
                                { label: 'Downtown', value: 'downtown' },
                                { label: 'Mall of Arabia', value: 'mall' },
                                { label: 'New Cairo', value: 'newcairo' },
                            ]}
                        />
                        <Input
                            label={t('settings.safes.currentBalance')}
                            type="number"
                            defaultValue={selectedSafe.balance}
                        />
                        <Select
                            label={t('settings.safes.status')}
                            defaultValue={selectedSafe.status.toLowerCase()}
                            options={[
                                { label: t('settings.safes.active'), value: 'active' },
                                { label: t('settings.safes.inactive'), value: 'inactive' },
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
                    setSelectedSafe(null);
                }}
                title={t('settings.safes.deleteTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('settings.safes.cancel')}
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteSafe}>
                            {t('settings.safes.confirmDelete')}
                        </Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('settings.safes.deleteWarning')}</p>
                </div>
            </Modal>
        </div>
    );
}
