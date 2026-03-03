'use client';

import React, { useState } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    CreditCard,
    Move
} from 'lucide-react';
import {
    Button,
    Badge,
    Modal,
    Input,
    Select,
    useToast
} from '@/components/ui';
import SettingsTabs from '@/components/SettingsTabs';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';

// Mock Data
const methods = [
    { id: 1, name: 'Cash', type: 'Cash', fee: '0%', status: 'Active' },
    { id: 2, name: 'Credit Card (Visa/Master)', type: 'Card', fee: '2.5%', status: 'Active' },
    { id: 3, name: 'Bank Transfer', type: 'Bank', fee: '0%', status: 'Active' },
    { id: 4, name: 'Vodafone Cash', type: 'Mobile Wallet', fee: '1%', status: 'Active' },
];

export default function PaymentMethodsPage() {
    const { addToast } = useToast();
    const { t } = useTranslation();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<any>(null);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>{t('settings.paymentMethods.title')}</h1>
                    <div className={styles.subtitle}>{t('settings.paymentMethods.desc')}</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => setIsAddOpen(true)}><Plus size={16} /> {t('settings.paymentMethods.addMethod')}</Button>
                </div>
            </div>

            <SettingsTabs />

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><CreditCard size={18} /> {t('settings.paymentMethods.listTitle')}</span>
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
                            {methods.map(method => (
                                <tr key={method.id}>
                                    <td><Move size={14} style={{ cursor: 'grab', color: 'var(--text-tertiary)' }} /></td>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{method.name}</td>
                                    <td>{method.type}</td>
                                    <td>{method.fee}</td>
                                    <td>
                                        <Badge color={method.status === 'Active' ? 'success' : 'neutral'}>{method.status === 'Active' ? t('settings.safes.active') : t('settings.safes.inactive')}</Badge>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Button variant="ghost" size="sm" iconOnly onClick={() => { setSelectedMethod(method); setIsEditOpen(true); }}><Edit size={14} /></Button>
                                            <Button variant="destructive" size="sm" iconOnly onClick={() => { setSelectedMethod(method); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>{t('settings.paymentMethods.cancel')}</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Payment method added'); }}>{t('settings.paymentMethods.saveMethod')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('settings.paymentMethods.methodName')} placeholder="e.g. Credit Card (Visa/Master)" />
                    <Select label={t('settings.paymentMethods.methodType')} options={[
                        { label: t('settings.paymentMethods.types.cash'), value: 'Cash' },
                        { label: t('settings.paymentMethods.types.card'), value: 'Card' },
                        { label: t('settings.paymentMethods.types.bank'), value: 'Bank Transfer' },
                        { label: t('settings.paymentMethods.types.wallet'), value: 'Mobile Wallet' }
                    ]} />
                    <Input label={t('settings.paymentMethods.transactionFee')} type="number" defaultValue={0} />
                    <Select label={t('settings.paymentMethods.colStatus')} options={[{ label: t('settings.safes.active'), value: 'Active' }, { label: t('settings.safes.inactive'), value: 'Inactive' }]} />
                </div>
            </Modal>

            {/* Edit Payment Method Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedMethod(null); }}
                title={t('settings.paymentMethods.editTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>{t('settings.paymentMethods.cancel')}</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Payment method updated'); }}>{t('settings.paymentMethods.saveChanges')}</Button>
                    </div>
                }
            >
                {selectedMethod && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label={t('settings.paymentMethods.methodName')} defaultValue={selectedMethod.name} />
                        <Select label={t('settings.paymentMethods.methodType')} defaultValue={selectedMethod.type} options={[
                            { label: t('settings.paymentMethods.types.cash'), value: 'Cash' },
                            { label: t('settings.paymentMethods.types.card'), value: 'Card' },
                            { label: t('settings.paymentMethods.types.bank'), value: 'Bank' },
                            { label: t('settings.paymentMethods.types.wallet'), value: 'Mobile Wallet' }
                        ]} />
                        <Input label={t('settings.paymentMethods.transactionFee')} type="number" defaultValue={parseFloat(selectedMethod.fee)} />
                        <Select label={t('settings.paymentMethods.colStatus')} defaultValue={selectedMethod.status} options={[{ label: t('settings.safes.active'), value: 'Active' }, { label: t('settings.safes.inactive'), value: 'Inactive' }]} />
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedMethod(null); }}
                title={t('settings.paymentMethods.deleteTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>{t('settings.paymentMethods.cancel')}</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Payment method deleted'); }}>{t('settings.paymentMethods.confirmDelete')}</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {t('settings.paymentMethods.deleteWarning')}
                    </p>
                </div>
            </Modal>
        </div>
    );
}
