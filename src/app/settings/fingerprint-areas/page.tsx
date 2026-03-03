'use client';

import React from 'react';
import {
    Plus,
    Edit,
    Trash2,
    MapPin
} from 'lucide-react';
import {
    Button,
    Badge
} from '@/components/ui';
import styles from './page.module.css';

// Mock Data
const areas = [
    { id: 1, name: 'Cairo Branch (Downtown)', devices: 2, employees: 8 },
    { id: 2, name: 'Alexandria Branch', devices: 1, employees: 5 },
    { id: 3, name: 'HQ Office', devices: 1, employees: 12 },
];

export default function FingerprintAreasPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Fingerprint Areas</h1>
                    <div className={styles.subtitle}>Group devices into physical locations/areas.</div>
                </div>
                <div className={styles.actions}>
                    <Button><Plus size={16} /> New Area</Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><MapPin size={18} /> Defined Areas</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Area Name</th>
                                <th>Linked Devices</th>
                                <th>Assigned Employees</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {areas.map(area => (
                                <tr key={area.id}>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{area.name}</td>
                                    <td>{area.devices} Device(s)</td>
                                    <td><Badge color="neutral">{area.employees} Staff</Badge></td>
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
