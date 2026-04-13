'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, CreditCard, Move } from 'lucide-react';
import { Button, Badge, Modal, Input, Select, useToast } from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi, type PaymentMethod } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

const fallbackMethods = [
    { uuid: '1', name: 'Cash', type: 'cash' as const, fee_percentage: 0, fee_fixed: 0, active: true, created_at: '' },
    {
        uuid: '2',
        name: 'Credit Card (Visa/Master)',
        type: 'card' as const,
        fee_percentage: 2.5,
        fee_fixed: 0,
        active: true,
        created_at: '',
    },
    {
        uuid: '3',
        name: 'Bank Transfer',
        type: 'bank_transfer' as const,
        fee_percentage: 0,
        fee_fixed: 0,
        active: true,
        created_at: '',
    },
    {
        uuid: '4',
        name: 'Vodafone Cash',
        type: 'wallet' as const,
        fee_percentage: 1,
        fee_fixed: 0,
        active: true,
        created_at: '',
    },
];

export default function PaymentMethodsPage() {
    const { addToast } = useToast();
    const { t } = useTranslation();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

    const {
        data: methods,
        loading,
        error,
        refetch,
    } = useApiQuery<PaymentMethod[]>(() => settingsApi.getPaymentMethods(), [], { fallbackData: fallbackMethods });

    const methodsList = (methods || []).map(m => ({
        id: m.uuid,
        name: m.name,
        type:
            m.type === 'cash'
                ? 'Cash'
                : m.type === 'card'
                  ? 'Card'
                  : m.type === 'bank_transfer'
                    ? 'Bank'
                    : 'Mobile Wallet',
        fee: `${m.fee_percentage}%`,
        status: m.active ? 'Active' : 'Inactive',
        _raw: m,
    }));

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>{t('settings.paymentMethods.title')}</h1>
                    <div className={styles.subtitle}>{t('settings.paymentMethods.desc')}</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => setIsAddOpen(true)}>
                        <Plus size={16} /> {t('settings.paymentMethods.addMethod')}
                    </Button>
                </div>
            </div>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>
                        <CreditCard size={18} /> {t('settings.paymentMethods.listTitle')}
                    </span>
                </div>
                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th style={{ width: 50 }}></th>
                                <th>{t('settings.paymentMethods.colName')}</th>
                                <th>{t('settings.paymentMethods.colType')}</th>
                                <th>{t('settings.paymentMethods.colFee')}</th>
                                <th>{t('settings.paymentMethods.colStatus')}</th>
                                <th>{t('settings.paymentMethods.colActions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <DataGuard
                                loading={loading}
                                error={error}
                                data={methodsList}
                                emptyIcon={<CreditCard size={48} />}
                                emptyTitle={t('settings.paymentMethods.noMethods') || 'No payment methods'}
                                emptyDescription={
                                    t('settings.paymentMethods.noMethodsDesc') ||
                                    'Add your first payment method to get started.'
                                }
                                onRetry={refetch}
                            >
                                {methodsList.map(method => (
                                    <tr key={method.id}>
                                        <td>
                                            <Move size={14} style={{ cursor: 'grab', color: 'var(--text-tertiary)' }} />
                                        </td>
                                        <td style={{ fontWeight: 'var(--font-medium)' }}>{method.name}</td>
                                        <td>{method.type}</td>
                                        <td>{method.fee}</td>
                                        <td>
                                            <Badge color={method.status === 'Active' ? 'success' : 'neutral'}>
                                                {method.status === 'Active'
                                                    ? t('settings.safes.active')
                                                    : t('settings.safes.inactive')}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    iconOnly
                                                    onClick={() => {
                                                        setSelectedMethod(method._raw);
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
                                                        setSelectedMethod(method._raw);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </DataGuard>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Payment Method Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('settings.paymentMethods.createTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('settings.paymentMethods.cancel')}
                        </Button>
                        <Button
                            onClick={async () => {
                                try {
                                    await settingsApi.createPaymentMethod({
                                        name: 'New Method',
                                        type: 'cash',
                                        fee_percentage: 0,
                                        fee_fixed: 0,
                                        active: true,
                                    });
                                    setIsAddOpen(false);
                                    addToast('success', 'Payment method added');
                                    refetch();
                                } catch {
                                    addToast('error', 'Failed to add payment method');
                                }
                            }}
                        >
                            {t('settings.paymentMethods.saveMethod')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('settings.paymentMethods.methodName')}
                        placeholder="e.g. Credit Card (Visa/Master)"
                    />
                    <Select
                        label={t('settings.paymentMethods.methodType')}
                        options={[
                            { label: t('settings.paymentMethods.types.cash'), value: 'Cash' },
                            { label: t('settings.paymentMethods.types.card'), value: 'Card' },
                            { label: t('settings.paymentMethods.types.bank'), value: 'Bank Transfer' },
                            { label: t('settings.paymentMethods.types.wallet'), value: 'Mobile Wallet' },
                        ]}
                    />
                    <Input label={t('settings.paymentMethods.transactionFee')} type="number" defaultValue={0} />
                    <Select
                        label={t('settings.paymentMethods.colStatus')}
                        options={[
                            { label: t('settings.safes.active'), value: 'Active' },
                            { label: t('settings.safes.inactive'), value: 'Inactive' },
                        ]}
                    />
                </div>
            </Modal>

            {/* Edit Payment Method Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedMethod(null);
                }}
                title={t('settings.paymentMethods.editTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('settings.paymentMethods.cancel')}
                        </Button>
                        <Button
                            onClick={async () => {
                                try {
                                    if (selectedMethod)
                                        await settingsApi.updatePaymentMethod(selectedMethod.uuid, {
                                            name: selectedMethod.name,
                                            type: selectedMethod.type,
                                            fee_percentage: selectedMethod.fee_percentage,
                                            active: selectedMethod.active,
                                        });
                                    setIsEditOpen(false);
                                    addToast('success', 'Payment method updated');
                                    refetch();
                                } catch {
                                    addToast('error', 'Failed to update payment method');
                                }
                            }}
                        >
                            {t('settings.paymentMethods.saveChanges')}
                        </Button>
                    </div>
                }
            >
                {selectedMethod && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label={t('settings.paymentMethods.methodName')} defaultValue={selectedMethod.name} />
                        <Select
                            label={t('settings.paymentMethods.methodType')}
                            defaultValue={selectedMethod.type}
                            options={[
                                { label: t('settings.paymentMethods.types.cash'), value: 'cash' },
                                { label: t('settings.paymentMethods.types.card'), value: 'card' },
                                { label: t('settings.paymentMethods.types.bank'), value: 'bank_transfer' },
                                { label: t('settings.paymentMethods.types.wallet'), value: 'wallet' },
                            ]}
                        />
                        <Input
                            label={t('settings.paymentMethods.transactionFee')}
                            type="number"
                            defaultValue={selectedMethod.fee_percentage}
                        />
                        <Select
                            label={t('settings.paymentMethods.colStatus')}
                            defaultValue={selectedMethod.active ? 'active' : 'inactive'}
                            options={[
                                { label: t('settings.safes.active'), value: 'active' },
                                { label: t('settings.safes.inactive'), value: 'inactive' },
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
                    setSelectedMethod(null);
                }}
                title={t('settings.paymentMethods.deleteTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('settings.paymentMethods.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                try {
                                    if (selectedMethod) await settingsApi.deletePaymentMethod(selectedMethod.uuid);
                                    setIsDeleteOpen(false);
                                    addToast('error', 'Payment method deleted');
                                    refetch();
                                } catch {
                                    addToast('error', 'Failed to delete payment method');
                                }
                            }}
                        >
                            {t('settings.paymentMethods.confirmDelete')}
                        </Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('settings.paymentMethods.deleteWarning')}</p>
                </div>
            </Modal>
        </div>
    );
}
