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

// Mock Data
const resources = [
    { id: 1, name: 'Styling Station 1', type: 'Chair', icon: <Armchair size={16} />, capacity: 1, status: 'Active' },
    { id: 2, name: 'Styling Station 2', type: 'Chair', icon: <Armchair size={16} />, capacity: 1, status: 'Active' },
    { id: 3, name: 'Spa Room A', type: 'Room', icon: <DoorClosed size={16} />, capacity: 1, status: 'Maintenance' },
    { id: 4, name: 'Reception PC 1', type: 'Equipment', icon: <Monitor size={16} />, capacity: 0, status: 'Active' },
];

export default function ResourcesPage() {
    const { addToast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<any>(null);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Resources & Rooms</h1>
                    <div className={styles.subtitle}>Define physical spaces and equipment for booking.</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => setIsAddOpen(true)}><Plus size={16} /> Add Resource</Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><LayoutGrid size={18} /> Resource List</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map(res => (
                                <tr key={res.id}>
                                    <td style={{ fontWeight: 'var(--font-medium)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {res.icon} {res.name}
                                    </td>
                                    <td>{res.type}</td>
                                    <td>{res.capacity > 0 ? `${res.capacity} Person(s)` : '-'}</td>
                                    <td>
                                        <Badge color={res.status === 'Active' ? 'success' : 'warning'}>{res.status}</Badge>
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
                title="Create New Resource"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Resource created successfully'); }}>Save Resource</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Resource Name" placeholder="e.g. Styling Station 3" />
                    <Select label="Type" options={[{ label: 'Chair', value: 'chair' }, { label: 'Room', value: 'room' }, { label: 'Equipment', value: 'equipment' }]} />
                    <Input label="Capacity (Persons)" type="number" placeholder="1" />
                    <Select label="Status" options={[{ label: 'Active', value: 'active' }, { label: 'Maintenance', value: 'maintenance' }]} />
                </div>
            </Modal>

            {/* Edit Resource Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedResource(null); }}
                title="Edit Resource"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Resource updated successfully'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedResource && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Resource Name" defaultValue={selectedResource.name} />
                        <Select label="Type" defaultValue={selectedResource.type.toLowerCase()} options={[{ label: 'Chair', value: 'chair' }, { label: 'Room', value: 'room' }, { label: 'Equipment', value: 'equipment' }]} />
                        <Input label="Capacity (Persons)" type="number" defaultValue={selectedResource.capacity} />
                        <Select label="Status" defaultValue={selectedResource.status.toLowerCase()} options={[{ label: 'Active', value: 'active' }, { label: 'Maintenance', value: 'maintenance' }]} />
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedResource(null); }}
                title="Delete Resource"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Resource deleted permanently'); }}>Confirm Delete</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to delete <strong>{selectedResource?.name}</strong>?
                    </p>
                </div>
            </Modal>
        </div >
    );
}
