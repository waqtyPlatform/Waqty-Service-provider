'use client';

import React from 'react';
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
    EmptyState
} from '@/components/ui';
import styles from './page.module.css';

// Mock Data
const safes = [
    { id: 1, name: 'Main Reception Safe', branch: 'Downtown', balance: '12,450 EGP', status: 'Active' },
    { id: 2, name: 'Back Office Safe', branch: 'Downtown', balance: '50,000 EGP', status: 'Active' },
    { id: 3, name: 'Petty Cash Box', branch: 'Downtown', balance: '1,200 EGP', status: 'Active' },
];

export default function SafesPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Safes & Cash Drawers</h1>
                    <div className={styles.subtitle}>Manage physical cash storage locations.</div>
                </div>
                <div className={styles.actions}>
                    <Button><Plus size={16} /> New Safe</Button>
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
