'use client';

import React from 'react';
import {
    Plus,
    Edit,
    Trash2,
    CreditCard,
    DollarSign,
    Move
} from 'lucide-react';
import {
    Button,
    Badge,
    EmptyState,
    Modal,
    Input,
    Select,
    useToast
} from '@/components/ui';
import SettingsTabs from '@/components/SettingsTabs';
import styles from './page.module.css';

// Mock Data
const methods = [
    { id: 1, name: 'Cash', type: 'Cash', fee: '0%', status: 'Active' },
    { id: 2, name: 'Credit Card (Visa/Master)', type: 'Card', fee: '2.5%', status: 'Active' },
    { id: 3, name: 'Bank Transfer', type: 'Bank', fee: '0%', status: 'Active' },
    { id: 4, name: 'Vodafone Cash', type: 'Mobile Wallet', fee: '1%', status: 'Active' },
];

export default function PaymentMethodsPage() {
    const { addToast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<any>(null);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Payment Methods</h1>
                    <div className={styles.subtitle}>Configure accepted payment types and fees.</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => setIsAddOpen(true)}><Plus size={16} /> Add Method</Button>
                </div>
            </div>

            <SettingsTabs />

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><CreditCard size={18} /> Methods List</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: 50 }}></th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Transaction Fee</th>
                                <th>Status</th>
                                <th>Actions</th>
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
                                        <Badge color={method.status === 'Active' ? 'success' : 'neutral'}>{method.status}</Badge>
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
                title="Add Payment Method"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Payment method added'); }}>Save Method</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Method Name" placeholder="e.g. Credit Card (Visa/Master)" />
                    <Select label="Type" options={[
                        { label: 'Cash', value: 'Cash' },
                        { label: 'Card', value: 'Card' },
                        { label: 'Bank Transfer', value: 'Bank' },
                        { label: 'Mobile Wallet', value: 'Mobile Wallet' }
                    ]} />
                    <Input label="Transaction Fee (%)" type="number" defaultValue={0} />
                    <Select label="Status" options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
                </div>
            </Modal>

            {/* Edit Payment Method Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedMethod(null); }}
                title="Edit Payment Method"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Payment method updated'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedMethod && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Method Name" defaultValue={selectedMethod.name} />
                        <Select label="Type" defaultValue={selectedMethod.type} options={[
                            { label: 'Cash', value: 'Cash' },
                            { label: 'Card', value: 'Card' },
                            { label: 'Bank Transfer', value: 'Bank' },
                            { label: 'Mobile Wallet', value: 'Mobile Wallet' }
                        ]} />
                        <Input label="Transaction Fee (%)" type="number" defaultValue={parseFloat(selectedMethod.fee)} />
                        <Select label="Status" defaultValue={selectedMethod.status} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedMethod(null); }}
                title="Delete Payment Method"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Payment method deleted'); }}>Confirm Delete</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to delete the <strong>{selectedMethod?.name}</strong> payment method?
                    </p>
                </div>
            </Modal>
        </div>
    );
}
