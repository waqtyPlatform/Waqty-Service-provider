'use client';

import React, { useState } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    ShoppingBag,
    Tag
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
import styles from './page.module.css';

// Mock Data
const items = [
    { id: 1, name: 'Office Supplies', category: 'Administrative', limit: '500 EGP', status: 'Active' },
    { id: 2, name: 'Coffee & Tea', category: 'Kitchen', limit: '300 EGP', status: 'Active' },
    { id: 3, name: 'Cleaning Materials', category: 'Maintenance', limit: '400 EGP', status: 'Active' },
    { id: 4, name: 'Cab Fare (Staff)', category: 'Transportation', limit: '200 EGP', status: 'Active' },
];

export default function PettyCashItemsPage() {
    const { addToast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Petty Cash Items</h1>
                    <div className={styles.subtitle}>Pre-defined items for quick expense logging.</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => setIsAddOpen(true)}><Plus size={16} /> Add Item</Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><ShoppingBag size={18} /> Expense Items</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Default Limit</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{item.name}</td>
                                    <td><Badge color="neutral">{item.category}</Badge></td>
                                    <td>{item.limit}</td>
                                    <td>
                                        <Badge color={item.status === 'Active' ? 'success' : 'neutral'}>{item.status}</Badge>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Button variant="ghost" size="sm" iconOnly onClick={() => { setSelectedItem(item); setIsEditOpen(true); }}><Edit size={14} /></Button>
                                            <Button variant="destructive" size="sm" iconOnly onClick={() => { setSelectedItem(item); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Item Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Add Petty Cash Item"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Petty cash item added'); }}>Save Item</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Item Name" placeholder="e.g. Office Supplies" />
                    <Select label="Category" options={[
                        { label: 'Administrative', value: 'Administrative' },
                        { label: 'Kitchen', value: 'Kitchen' },
                        { label: 'Maintenance', value: 'Maintenance' },
                        { label: 'Transportation', value: 'Transportation' }
                    ]} />
                    <Input label="Default Limit (EGP)" type="number" defaultValue={0} />
                    <Select label="Status" options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
                </div>
            </Modal>

            {/* Edit Item Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedItem(null); }}
                title="Edit Petty Cash Item"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Petty cash item updated'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedItem && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Item Name" defaultValue={selectedItem.name} />
                        <Select label="Category" defaultValue={selectedItem.category} options={[
                            { label: 'Administrative', value: 'Administrative' },
                            { label: 'Kitchen', value: 'Kitchen' },
                            { label: 'Maintenance', value: 'Maintenance' },
                            { label: 'Transportation', value: 'Transportation' }
                        ]} />
                        <Input label="Default Limit (EGP)" type="number" defaultValue={parseInt(selectedItem.limit)} />
                        <Select label="Status" defaultValue={selectedItem.status} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedItem(null); }}
                title="Delete Petty Cash Item"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Petty cash item deleted'); }}>Confirm Delete</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to delete the <strong>{selectedItem?.name}</strong> petty cash item?
                    </p>
                </div>
            </Modal>
        </div>
    );
}
