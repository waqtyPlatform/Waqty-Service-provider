'use client';

import React from 'react';
import {
    Plus,
    Calendar,
    Zap,
    Clock
} from 'lucide-react';
import {
    Button,
    Badge,
    Switch
} from '@/components/ui';
import styles from './page.module.css';

// Mock Data
const rules = [
    { id: 1, name: 'Auto-Confirm Online Bookings', desc: 'Automatically confirm bookings made online if slot is available.', active: true },
    { id: 2, name: 'Send Reminder SMS', desc: 'Send an SMS reminder 24 hours before the appointment.', active: true },
    { id: 3, name: 'Block Double Bookings', desc: 'Prevent booking multiple services for the same staff at the same time.', active: true },
    { id: 4, name: 'Buffer Time Enforcement', desc: 'Automatically add buffer time after each service.', active: false },
];

export default function DiaryAutomationsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Diary Automations</h1>
                    <div className={styles.subtitle}>Configure automatic rules for your booking calendar.</div>
                </div>
                <div className={styles.actions}>
                    <Button><Plus size={16} /> New Rule</Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><Zap size={18} /> Active Rules</span>
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
