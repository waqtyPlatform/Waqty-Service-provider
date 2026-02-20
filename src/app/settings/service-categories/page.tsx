'use client';

import React, { useState } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Move,
    FolderKanban
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
const categories = [
    { id: 1, name: 'Hair Styling', color: '#8b5cf6', services: 12, order: 1 },
    { id: 2, name: 'Nails & Manicure', color: '#ec4899', services: 8, order: 2 },
    { id: 3, name: 'Spa & Massage', color: '#10b981', services: 5, order: 3 },
    { id: 4, name: 'Makeup', color: '#f59e0b', services: 4, order: 4 },
];

export default function ServiceCategoriesPage() {
    const { addToast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCat, setSelectedCat] = useState<any>(null);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Service Categories</h1>
                    <div className={styles.subtitle}>Manage categories to organize your service menu.</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => setIsAddOpen(true)}><Plus size={16} /> New Category</Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><FolderKanban size={18} /> Categories</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: 50 }}></th>
                                <th>Name</th>
                                <th>Color Tag</th>
                                <th>Services Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat.id}>
                                    <td><Move size={14} style={{ cursor: 'grab', color: 'var(--text-tertiary)' }} /></td>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{cat.name}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div className={styles.colorCircle} style={{ background: cat.color }} />
                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{cat.color}</span>
                                        </div>
                                    </td>
                                    <td><Badge color="neutral">{cat.services} Services</Badge></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Button variant="ghost" size="sm" onClick={() => { setSelectedCat(cat); setIsEditOpen(true); }}><Edit size={14} /></Button>
                                            <Button variant="destructive" size="sm" onClick={() => { setSelectedCat(cat); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Category Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create New Category"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Category created successfully'); }}>Save Category</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Category Name" placeholder="e.g. Hair Styling" />
                    <Select label="Color Tag" options={[
                        { label: 'Purple', value: '#8b5cf6' },
                        { label: 'Pink', value: '#ec4899' },
                        { label: 'Green', value: '#10b981' },
                        { label: 'Orange', value: '#f59e0b' },
                        { label: 'Blue', value: '#3b82f6' }
                    ]} />
                </div>
            </Modal>

            {/* Edit Category Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedCat(null); }}
                title="Edit Category"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Category updated successfully'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedCat && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Category Name" defaultValue={selectedCat.name} />
                        <Select label="Color Tag" defaultValue={selectedCat.color} options={[
                            { label: 'Purple', value: '#8b5cf6' },
                            { label: 'Pink', value: '#ec4899' },
                            { label: 'Green', value: '#10b981' },
                            { label: 'Orange', value: '#f59e0b' },
                            { label: 'Blue', value: '#3b82f6' }
                        ]} />
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedCat(null); }}
                title="Delete Category"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Category deleted'); }}>Confirm Delete</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to delete the <strong>{selectedCat?.name}</strong> category? Services inside this category will become uncategorized.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
