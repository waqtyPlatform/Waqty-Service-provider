'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Textarea, useToast } from '@/components/ui';
import { Save, Check, Upload, X, ImageIcon } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import styles from './settings.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { Switch } from '@/components/ui';

export default function SettingsPage() {
    const { settings, updateSettings } = useSettings();
    const [localSettings, setLocalSettings] = useState(settings);
    const [saved, setSaved] = useState(false);
    const { t, lang } = useTranslation();
    const { addToast } = useToast();

    // Logo & Banner state (stored in localStorage separately)
    const [logo, setLogo] = useState<string | null>(null);
    const [banner, setBanner] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    // Sync local state when context settings load/change
    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    // Load saved logo & banner
    useEffect(() => {
        const savedLogo = localStorage.getItem('hagzy_logo');
        const savedBanner = localStorage.getItem('hagzy_banner');
        if (savedLogo) setLogo(savedLogo);
        if (savedBanner) setBanner(savedBanner);
    }, []);

    const handleSave = () => {
        updateSettings(localSettings);
        // Also persist logo & banner
        if (logo) localStorage.setItem('hagzy_logo', logo);
        else localStorage.removeItem('hagzy_logo');
        if (banner) localStorage.setItem('hagzy_banner', banner);
        else localStorage.removeItem('hagzy_banner');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleChange = (field: keyof typeof settings, value: string | number | boolean) => {
        setLocalSettings(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            addToast('error', t('settings.branding.imageTooLarge'));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            if (type === 'logo') setLogo(result);
            else setBanner(result);
            setSaved(false);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent, type: 'logo' | 'banner') => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        if (file.size > 2 * 1024 * 1024) {
            addToast('error', t('settings.branding.imageTooLarge'));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            if (type === 'logo') setLogo(result);
            else setBanner(result);
            setSaved(false);
        };
        reader.readAsDataURL(file);
    };

    const preventDefault = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className={styles.page} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* Branding Card */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>{t('settings.branding.title')}</div>
                <div className={styles.cardDesc}>{t('settings.branding.desc')}</div>

                <div className={styles.brandingRow}>
                    {/* Logo Upload */}
                    <div className={styles.brandingCol}>
                        <label className={styles.brandingLabel}>{t('settings.branding.logo')}</label>
                        <div
                            className={`${styles.uploadZone} ${styles.uploadZoneLogo}`}
                            onClick={() => logoInputRef.current?.click()}
                            onDrop={e => handleDrop(e, 'logo')}
                            onDragOver={preventDefault}
                            onDragEnter={preventDefault}
                        >
                            {logo ? (
                                <>
                                    <img
                                        src={logo}
                                        alt={t('settings.branding.logo')}
                                        className={styles.uploadPreviewLogo}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <button
                                        className={styles.uploadRemove}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setLogo(null);
                                            setSaved(false);
                                        }}
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <ImageIcon size={28} />
                                    <span>{t('settings.branding.uploadLogo')}</span>
                                    <span className={styles.uploadHint}>{t('settings.branding.logoHint')}</span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            style={{ display: 'none' }}
                            onChange={e => handleImageUpload(e, 'logo')}
                        />
                    </div>

                    {/* Banner Upload */}
                    <div className={styles.brandingCol} style={{ flex: 2 }}>
                        <label className={styles.brandingLabel}>{t('settings.branding.banner')}</label>
                        <div
                            className={`${styles.uploadZone} ${styles.uploadZoneBanner}`}
                            onClick={() => bannerInputRef.current?.click()}
                            onDrop={e => handleDrop(e, 'banner')}
                            onDragOver={preventDefault}
                            onDragEnter={preventDefault}
                        >
                            {banner ? (
                                <>
                                    <img
                                        src={banner}
                                        alt={t('settings.branding.banner')}
                                        className={styles.uploadPreviewBanner}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <button
                                        className={styles.uploadRemove}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setBanner(null);
                                            setSaved(false);
                                        }}
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <Upload size={28} />
                                    <span>{t('settings.branding.uploadBanner')}</span>
                                    <span className={styles.uploadHint}>{t('settings.branding.bannerHint')}</span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={bannerInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            style={{ display: 'none' }}
                            onChange={e => handleImageUpload(e, 'banner')}
                        />
                    </div>
                </div>
            </div>

            {/* Business Info Card */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>{t('settings.bizInfo')}</div>
                <div className={styles.cardDesc}>{t('settings.bizDesc')}</div>

                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.bizName')}
                            value={localSettings.businessName}
                            onChange={e => handleChange('businessName', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.legalName')}
                            value={localSettings.legalName}
                            onChange={e => handleChange('legalName', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.crNumber')}
                            value={localSettings.crNumber}
                            onChange={e => handleChange('crNumber', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.vatNumber')}
                            value={localSettings.vatNumber}
                            onChange={e => handleChange('vatNumber', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Textarea
                            label={t('settings.address')}
                            value={localSettings.address}
                            onChange={e => handleChange('address', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.phone')}
                            value={localSettings.phone}
                            onChange={e => handleChange('phone', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label={t('settings.email')}
                            type="email"
                            value={localSettings.email}
                            onChange={e => handleChange('email', e.target.value)}
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
                            onChange={c => handleChange('allowOnlineBooking', c)}
                        />
                    </div>

                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>{t('settings.walkIn')}</span>
                            <span className={styles.switchDesc}>{t('settings.walkInDesc')}</span>
                        </div>
                        <Switch checked={localSettings.allowWalkIn} onChange={c => handleChange('allowWalkIn', c)} />
                    </div>

                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>{t('settings.reqDeposit')}</span>
                            <span className={styles.switchDesc}>{t('settings.reqDepositDesc')}</span>
                        </div>
                        <Switch
                            checked={localSettings.requireDeposit}
                            onChange={c => handleChange('requireDeposit', c)}
                        />
                    </div>

                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>{t('settings.smsReminders')}</span>
                            <span className={styles.switchDesc}>{t('settings.smsRemindersDesc')}</span>
                        </div>
                        <Switch
                            checked={localSettings.sendSmsReminders}
                            onChange={c => handleChange('sendSmsReminders', c)}
                        />
                    </div>

                    <div className={styles.switchRow}>
                        <div className={styles.switchLabel}>
                            <span className={styles.switchTitle}>{t('settings.autoConfirm')}</span>
                            <span className={styles.switchDesc}>{t('settings.autoConfirmDesc')}</span>
                        </div>
                        <Switch checked={localSettings.autoConfirm} onChange={c => handleChange('autoConfirm', c)} />
                    </div>

                    <div className={styles.field}>
                        <Input
                            label={t('settings.defaultGap')}
                            type="number"
                            value={localSettings.defaultGap}
                            onChange={e => handleChange('defaultGap', parseInt(e.target.value) || 0)}
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
                            onChange={e => handleChange('cancellationWindow', parseInt(e.target.value) || 0)}
                            hint={t('settings.cancelWindowHint')}
                            style={{ maxWidth: 200 }}
                            dir="ltr"
                        />
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <Button onClick={handleSave} style={{ width: '100%', maxWidth: '200px' }}>
                    {saved ? (
                        <>
                            <Check size={16} /> {t('settings.saved')}
                        </>
                    ) : (
                        <>
                            <Save size={16} /> {t('settings.saveChanges')}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
