'use client';

import React from 'react';
import {
    Plus,
    Clock,
    Zap,
    UserCheck
} from 'lucide-react';
import {
    Button,
    Badge,
    Switch
} from '@/components/ui';
import styles from './page.module.css';

// Mock Data
const rules = [
    { id: 1, name: 'Auto-Clock Out at Midnight', desc: 'Automatically clock out employees who forgot to sign out.', active: true },
    { id: 2, name: 'Late Arrival Grace Period', desc: 'Allow 15 minutes grace period before marking as late.', active: true },
    { id: 3, name: 'Overtime Calculation', desc: 'Automatically calculate overtime after 9 hours.', active: false },
    { id: 4, name: 'Shift Rotation', desc: 'Rotate shifts weekly for junior staff.', active: false },
];

export default function ShiftAutomationsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Shift Automations</h1>
                    <div className={styles.subtitle}>Manage rules for employee attendance and shifts.</div>
                </div>
                <div className={styles.actions}>
                    <Button><Plus size={16} /> New Rule</Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><Clock size={18} /> Attendance Rules</span>
                </div>
                <div className={styles.rulesList}>
                    {rules.map(rule => (
                        <div key={rule.id} className={styles.ruleItem}>
                            <div className={styles.ruleContent}>
                                <div className={styles.ruleTitle}>
                                    {rule.name}
                                    {rule.active && <Badge color="success" size="sm">Active</Badge>}
                                </div>
                                <div className={styles.ruleDesc}>{rule.desc}</div>
                            </div>
                            <div>
                                <Switch checked={rule.active} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
