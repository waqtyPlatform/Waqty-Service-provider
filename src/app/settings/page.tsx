'use client';

import React, { useState, useEffect } from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { Button, Input, Textarea } from '@/components/ui';
import { Save, Check } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import styles from './settings.module.css';
import { useTranslation } from '@/hooks/useTranslation';

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
    const { t, lang } = useTranslation();

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
        <div className={styles.page} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('settings.title')}</h1>
                <p className={styles.description}>{t('settings.desc')}</p>
            </div>

            <SettingsTabs />

            {/* Business Info Card */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>{t('settings.bizInfo')}</div>
                <div className={styles.cardDesc}>{t('settings.bizDesc')}</div>

                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.bizName')}
                            value={localSettings.businessName}
                            onChange={(e) => handleChange('businessName', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.legalName')}
                            value={localSettings.legalName}
                            onChange={(e) => handleChange('legalName', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.crNumber')}
                            value={localSettings.crNumber}
                            onChange={(e) => handleChange('crNumber', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.vatNumber')}
                            value={localSettings.vatNumber}
                            onChange={(e) => handleChange('vatNumber', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Textarea
                            label={t('settings.address')}
                            value={localSettings.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.phone')}
                            value={localSettings.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.email')}
                            type="email"
                            value={localSettings.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Booking Preferences Card */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>{t('settings.bookPrefTitle')}</div>
                <div className={styles.cardDesc}>{t('settings.bookPrefDesc')}</div>

                <div className={styles.formGrid}>
                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>{t('settings.onlineBooking')}</span>
                            <span className={styles.switchDesc}>{t('settings.onlineBookingDesc')}</span>
                        </div>
                        <Switch
                            checked={localSettings.allowOnlineBooking}
                            onChange={(c) => handleChange('allowOnlineBooking', c)}
                        />
                    </div>

                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>{t('settings.walkIn')}</span>
                            <span className={styles.switchDesc}>{t('settings.walkInDesc')}</span>
                        </div>
                        <Switch
                            checked={localSettings.allowWalkIn}
                            onChange={(c) => handleChange('allowWalkIn', c)}
                        />
                    </div>

                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>{t('settings.reqDeposit')}</span>
                            <span className={styles.switchDesc}>{t('settings.reqDepositDesc')}</span>
                        </div>
                        <Switch
                            checked={localSettings.requireDeposit}
                            onChange={(c) => handleChange('requireDeposit', c)}
                        />
                    </div>

                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>{t('settings.smsReminders')}</span>
                            <span className={styles.switchDesc}>{t('settings.smsRemindersDesc')}</span>
                        </div>
                        <Switch
                            checked={localSettings.sendSmsReminders}
                            onChange={(c) => handleChange('sendSmsReminders', c)}
                        />
                    </div>

                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>{t('settings.autoConfirm')}</span>
                            <span className={styles.switchDesc}>{t('settings.autoConfirmDesc')}</span>
                        </div>
                        <Switch
                            checked={localSettings.autoConfirm}
                            onChange={(c) => handleChange('autoConfirm', c)}
                        />
                    </div>

                    <div className={styles.field}>
                        <Input
                            label={t('settings.defaultGap')}
                            type="number"
                            value={localSettings.defaultGap}
                            onChange={(e) => handleChange('defaultGap', parseInt(e.target.value) || 0)}
                            hint={t('settings.defaultGapHint')}
                            style={{ maxWidth: 200 }}
                            dir="ltr"
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.cancelWindow')}
                            type="number"
                            value={localSettings.cancellationWindow}
                            onChange={(e) => handleChange('cancellationWindow', parseInt(e.target.value) || 0)}
                            hint={t('settings.cancelWindowHint')}
                            style={{ maxWidth: 200 }}
                            dir="ltr"
                        />
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <Button onClick={handleSave} style={{ width: '100%', maxWidth: '200px' }}>
                    {saved ? <><Check size={16} /> {t('settings.saved')}</> : <><Save size={16} /> {t('settings.saveChanges')}</>}
                </Button>
            </div>
        </div>
    );
}
