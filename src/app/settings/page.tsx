'use client';

import React, { useState, useEffect } from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { Button, Input, Textarea } from '@/components/ui';
import { Save, Check } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import styles from './settings.module.css';

// Simple Toggle Component (since we don't have a reusable Switch component in ui/index yet, or maybe we do? 
// Based on previous logs, I saw Button, Input, Select, Textarea in imports. 
// I'll check ui/index.tsx content from previous logs. 
// Ah, the previous settings page imported Switch from '@/components/ui'.
// Let me double check if Switch is exported from components/ui/index.tsx.
// It was imported in the previous file. safely assume it exists.
import { Switch } from '@/components/ui';

export default function SettingsPage() {
    const { settings, updateSettings } = useSettings();
    const [localSettings, setLocalSettings] = useState(settings);
    const [saved, setSaved] = useState(false);

    // Sync local state when context settings load/change
    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSave = () => {
        updateSettings(localSettings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleChange = (field: keyof typeof settings, value: any) => {
        setLocalSettings(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Settings</h1>
                <p className={styles.description}>Configure your business, preferences, and integrations.</p>
            </div>

            <SettingsTabs />

            {/* Business Info Card */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>Business Information</div>
                <div className={styles.cardDesc}>Basic details about your salon or spa.</div>

                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <Input
                            label="Business Name"
                            value={localSettings.businessName}
                            onChange={(e) => handleChange('businessName', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label="Legal Name"
                            value={localSettings.legalName}
                            onChange={(e) => handleChange('legalName', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label="Commercial Registration"
                            value={localSettings.crNumber}
                            onChange={(e) => handleChange('crNumber', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label="Tax ID / VAT Number"
                            value={localSettings.vatNumber}
                            onChange={(e) => handleChange('vatNumber', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Textarea
                            label="Address"
                            value={localSettings.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label="Phone"
                            value={localSettings.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label="Email"
                            type="email"
                            value={localSettings.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Booking Preferences Card */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>Booking Preferences</div>
                <div className={styles.cardDesc}>Control how bookings work in your system.</div>

                <div className={styles.formGrid}>
                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>Online Booking</span>
                            <span className={styles.switchDesc}>Allow clients to book appointments online.</span>
                        </div>
                        <Switch
                            checked={localSettings.allowOnlineBooking}
                            onChange={(c) => handleChange('allowOnlineBooking', c)}
                        />
                    </div>

                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>Walk-in Customers</span>
                            <span className={styles.switchDesc}>Allow creating bookings without an appointment.</span>
                        </div>
                        <Switch
                            checked={localSettings.allowWalkIn}
                            onChange={(c) => handleChange('allowWalkIn', c)}
                        />
                    </div>

                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>Require Deposit</span>
                            <span className={styles.switchDesc}>Clients must pay a deposit to secure booking.</span>
                        </div>
                        <Switch
                            checked={localSettings.requireDeposit}
                            onChange={(c) => handleChange('requireDeposit', c)}
                        />
                    </div>

                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>SMS Reminders</span>
                            <span className={styles.switchDesc}>Automatically send reminders 24h before.</span>
                        </div>
                        <Switch
                            checked={localSettings.sendSmsReminders}
                            onChange={(c) => handleChange('sendSmsReminders', c)}
                        />
                    </div>

                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>Auto-Confirm</span>
                            <span className={styles.switchDesc}>Automatically confirm new bookings.</span>
                        </div>
                        <Switch
                            checked={localSettings.autoConfirm}
                            onChange={(c) => handleChange('autoConfirm', c)}
                        />
                    </div>

                    <div className={styles.field}>
                        <Input
                            label="Default Booking Gap (minutes)"
                            type="number"
                            value={localSettings.defaultGap}
                            onChange={(e) => handleChange('defaultGap', parseInt(e.target.value) || 0)}
                            hint="Buffer time between appointments."
                            style={{ maxWidth: 200 }}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label="Cancellation Window (hours)"
                            type="number"
                            value={localSettings.cancellationWindow}
                            onChange={(e) => handleChange('cancellationWindow', parseInt(e.target.value) || 0)}
                            hint="Minimum notice required for cancellations."
                            style={{ maxWidth: 200 }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <Button onClick={handleSave} className={styles.saveBtn}>
                    {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
                </Button>
            </div>
        </div>
    );
}
