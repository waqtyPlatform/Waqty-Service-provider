'use client';

import React, { useState } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Lock,
    DollarSign
} from 'lucide-react';
import {
    Button,
    Badge,
    EmptyState,
    useToast,
    Modal,
    Input,
    Select
} from '@/components/ui';
import styles from './page.module.css';

// Mock Data
const safes = [
    { id: 1, name: 'Main Reception Safe', branch: 'Downtown', balance: '12,450 EGP', status: 'Active' },
    { id: 2, name: 'Back Office Safe', branch: 'Downtown', balance: '50,000 EGP', status: 'Active' },
    { id: 3, name: 'Petty Cash Box', branch: 'Downtown', balance: '1,200 EGP', status: 'Active' },
];

export default function SafesPage() {
    const { addToast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedSafe, setSelectedSafe] = useState<any>(null);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Safes & Cash Drawers</h1>
                    <div className={styles.subtitle}>Manage physical cash storage locations.</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => setIsAddOpen(true)}><Plus size={16} /> New Safe</Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><Lock size={18} /> Safes List</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Safe Name</th>
                                <th>Branch</th>
                                <th>Current Balance</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {safes.map(safe => (
                                <tr key={safe.id}>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{safe.name}</td>
                                    <td>{safe.branch}</td>
                                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>{safe.balance}</td>
                                    <td>
                                        <Badge color={safe.status === 'Active' ? 'success' : 'neutral'}>{safe.status}</Badge>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Button variant="ghost" size="sm" iconOnly onClick={() => { setSelectedSafe(safe); setIsEditOpen(true); }}><Edit size={14} /></Button>
                                            <Button variant="destructive" size="sm" iconOnly onClick={() => { setSelectedSafe(safe); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Safe Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create New Safe"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Safe created successfully'); }}>Save Safe</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Safe Name" placeholder="e.g. Front Desk Safe" />
                    <Select label="Branch" options={[{ label: 'Main Downtown', value: 'main' }, { label: 'North Plaza', value: 'north' }]} />
                    <Input label="Initial Balance (EGP)" type="number" placeholder="0.00" />
                    <Select label="Status" options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} />
                </div>
            </Modal>

            {/* Edit Safe Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedSafe(null); }}
                title="Edit Safe"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Safe updated successfully'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedSafe && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Safe Name" defaultValue={selectedSafe.name} />
                        <Select label="Branch" defaultValue="main" options={[{ label: 'Main Downtown', value: 'main' }, { label: 'North Plaza', value: 'north' }]} />
                        <Input label="Current Balance (EGP)" type="number" defaultValue={parseInt(selectedSafe.balance.replace(/[^0-9]/g, ''))} />
                        <Select label="Status" defaultValue={selectedSafe.status.toLowerCase()} options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} />
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedSafe(null); }}
                title="Delete Safe"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Safe deleted permanently'); }}>Confirm Delete</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to delete the <strong>{selectedSafe?.name}</strong> safe? This action cannot be undone and will require re-allocation of any existing balances.
                    </p>
                </div>
            </Modal>
        </div >
    );
}
