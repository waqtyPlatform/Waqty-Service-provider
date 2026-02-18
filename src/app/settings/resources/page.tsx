'use client';

import React from 'react';
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
    EmptyState
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
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Resources & Rooms</h1>
                    <div className={styles.subtitle}>Define physical spaces and equipment for booking.</div>
                </div>
                <div className={styles.actions}>
                    <Button><Plus size={16} /> Add Resource</Button>
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
