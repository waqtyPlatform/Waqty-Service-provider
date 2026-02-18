'use client';

import React from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Fingerprint,
    Wifi,
    RefreshCw
} from 'lucide-react';
import {
    Button,
    Badge,
    EmptyState
} from '@/components/ui';
import styles from './page.module.css';

// Mock Data
const devices = [
    { id: 1, name: 'Recepiton Main', ip: '192.168.1.101', status: 'Online', lastSync: 'Just now' },
    { id: 2, name: 'Staff Entrance', ip: '192.168.1.102', status: 'Online', lastSync: '5 mins ago' },
    { id: 3, name: 'Back Office', ip: '192.168.1.103', status: 'Offline', lastSync: '2 hours ago' },
];

export default function FingerprintDevicesPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Fingerprint Devices</h1>
                    <div className={styles.subtitle}>Manage connected biometric attendance devices.</div>
                </div>
                <div className={styles.actions}>
                    <Button variant="outline"><RefreshCw size={16} /> Scan Network</Button>
                    <Button><Plus size={16} /> Add Device</Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><Fingerprint size={18} /> Connected Devices</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Device Name</th>
                                <th>IP Address</th>
                                <th>Status</th>
                                <th>Last Sync</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map(device => (
                                <tr key={device.id}>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{device.name}</td>
                                    <td style={{ fontFamily: 'var(--font-mono)' }}>{device.ip}</td>
                                    <td>
                                        <Badge color={device.status === 'Online' ? 'success' : 'destructive'}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Wifi size={12} /> {device.status}
                                            </div>
                                        </Badge>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{device.lastSync}</td>
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
