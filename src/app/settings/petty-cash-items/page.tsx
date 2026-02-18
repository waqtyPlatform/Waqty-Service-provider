'use client';

import React from 'react';
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
    EmptyState
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
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Petty Cash Items</h1>
                    <div className={styles.subtitle}>Pre-defined items for quick expense logging.</div>
                </div>
                <div className={styles.actions}>
                    <Button><Plus size={16} /> Add Item</Button>
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
