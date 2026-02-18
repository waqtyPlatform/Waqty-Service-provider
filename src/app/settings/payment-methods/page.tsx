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
    EmptyState
} from '@/components/ui';
import styles from './page.module.css';

// Mock Data
const methods = [
    { id: 1, name: 'Cash', type: 'Cash', fee: '0%', status: 'Active' },
    { id: 2, name: 'Credit Card (Visa/Master)', type: 'Card', fee: '2.5%', status: 'Active' },
    { id: 3, name: 'Bank Transfer', type: 'Bank', fee: '0%', status: 'Active' },
    { id: 4, name: 'Vodafone Cash', type: 'Mobile Wallet', fee: '1%', status: 'Active' },
];

export default function PaymentMethodsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Payment Methods</h1>
                    <div className={styles.subtitle}>Configure accepted payment types and fees.</div>
                </div>
                <div className={styles.actions}>
                    <Button><Plus size={16} /> Add Method</Button>
                </div>
            </div>

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
