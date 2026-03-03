'use client';

import React, { useState } from 'react';
import {
    Save,
    Users,
    Search,
    Check
} from 'lucide-react';
import {
    Button,
    Input,
    Badge
} from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';

// Mock Data
const services = [
    { id: 1, name: 'Hair Cut & Style', category: 'Hair' },
    { id: 2, name: 'Hair Coloring', category: 'Hair' },
    { id: 3, name: 'Manicure', category: 'Nails' },
    { id: 4, name: 'Pedicure', category: 'Nails' },
];

const employees = [
    { id: 1, name: 'Sarah Ahmed', role: 'Senior Stylist' },
    { id: 2, name: 'Nora Ali', role: 'Junior Stylist' },
    { id: 3, name: 'Mona Zein', role: 'Nail Technician' },
];

// Initial Mapping (Mock)
// Sarah does Hair, Nora does Hair, Mona does Nails
const initialMapping: Record<string, boolean> = {
    '1-1': true, '1-2': true, '1-3': false,
    '2-1': true, '2-2': false, '2-3': false,
    '3-1': false, '3-2': false, '3-3': true,
    '4-1': false, '4-2': false, '4-3': true,
};

export default function ServiceEmployeesPage() {
    const { t } = useTranslation();
    const [mapping, setMapping] = useState(initialMapping);

    const toggleMapping = (serviceId: number, empId: number) => {
        const key = `${serviceId}-${empId}`;
        setMapping(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>{t('settings.serviceEmployees.title')}</h1>
                    <div className={styles.subtitle}>{t('settings.serviceEmployees.desc')}</div>
                </div>
                <div className={styles.actions}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-tertiary)' }} />
                        <Input placeholder={t('settings.serviceEmployees.search')} style={{ paddingLeft: 32, width: 200 }} />
                    </div>
                    <Button><Save size={16} /> {t('settings.serviceEmployees.saveChanges')}</Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><Users size={18} /> {t('settings.serviceEmployees.matrix')}</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>{t('settings.serviceEmployees.serviceName')}</th>
                                {employees.map(emp => (
                                    <th key={emp.id} style={{ textAlign: 'center' }}>
                                        <div>{emp.name}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{emp.role}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {services.map(service => (
                                <tr key={service.id}>
                                    <td>
                                        <div style={{ fontWeight: 'var(--font-medium)' }}>{service.name}</div>
                                        <Badge color="neutral" size="sm" style={{ marginTop: 4 }}>{service.category}</Badge>
                                    </td>
                                    {employees.map(emp => {
                                        const isChecked = mapping[`${service.id}-${emp.id}`];
                                        return (
                                            <td key={emp.id} style={{ textAlign: 'center' }}>
                                                <div
                                                    onClick={() => toggleMapping(service.id, emp.id)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: 4,
                                                        border: `1px solid ${isChecked ? 'var(--color-primary-600)' : 'var(--border-color)'}`,
                                                        background: isChecked ? 'var(--color-primary-600)' : 'transparent',
                                                        color: 'white'
                                                    }}
                                                >
                                                    {isChecked && <Check size={16} />}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
