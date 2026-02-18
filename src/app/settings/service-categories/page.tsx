'use client';

import React from 'react';
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
    EmptyState
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
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Service Categories</h1>
                    <div className={styles.subtitle}>Manage categories to organize your service menu.</div>
                </div>
                <div className={styles.actions}>
                    <Button><Plus size={16} /> New Category</Button>
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
                                            <Button variant="ghost" size="sm" iconOnly><Edit size={14} /></Button>
                                            <Button variant="destructive" size="sm" iconOnly><Trash2 size={14} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
