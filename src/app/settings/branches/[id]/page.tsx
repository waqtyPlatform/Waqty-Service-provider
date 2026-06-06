'use client';

import React, { useState, useEffect } from 'react';
import { Save, Clock, LayoutGrid, Plus, Trash2, Settings, Building2, MapPin } from 'lucide-react';
import { Tabs, Button, Input, Select, Checkbox, Badge } from '@/components/ui';
import { useToast } from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { providerApi } from '@/lib/api';

// Mock Data
const branch = {
    id: 'BR-001',
    name: 'Downtown Branch',
    address: '15 Tahrir Square, Cairo',
    phone: '+20 2 2575 1234',
    manager: 'Ahmed Hassan',
    taxId: 'EG-123456789',
    currency: 'EGP',
    status: 'active',
    rooms: [
        { id: 1, name: 'Styling Station 1', type: 'Chair', capacity: 1 },
        { id: 2, name: 'Styling Station 2', type: 'Chair', capacity: 1 },
        { id: 3, name: 'Spa Room A', type: 'Room', capacity: 1 },
        { id: 4, name: 'VIP Suite', type: 'Suite', capacity: 2 },
    ],
    hours: [
        { day: 'Monday', open: '10:00', close: '22:00', closed: false },
        { day: 'Tuesday', open: '10:00', close: '22:00', closed: false },
        { day: 'Wednesday', open: '10:00', close: '22:00', closed: false },
        { day: 'Thursday', open: '10:00', close: '23:00', closed: false },
        { day: 'Friday', open: '13:00', close: '23:00', closed: false },
        { day: 'Saturday', open: '', close: '', closed: true },
        { day: 'Sunday', open: '10:00', close: '18:00', closed: false },
    ],
};

export default function BranchSettingsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [activeTab, setActiveTab] = useState('general');
    const { t, lang } = useTranslation();
    const { addToast } = useToast();

    // Fetch branch from API with fallback to mock
    const { data: apiBranch } = useApiQuery(() => providerApi.getBranch(id), [id], { fallbackData: branch as never });

    // Geofence state - initialized from API data or defaults
    const [geoLat, setGeoLat] = useState('30.0444');
    const [geoLng, setGeoLng] = useState('31.2357');
    const [geoRadius, setGeoRadius] = useState(200);
    const [requireGps, setRequireGps] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Sync geofence state from API branch data
    useEffect(() => {
        if (apiBranch) {
            if (apiBranch.latitude) setGeoLat(String(apiBranch.latitude));
            if (apiBranch.longitude) setGeoLng(String(apiBranch.longitude));
        }
    }, [apiBranch]);

    const handleSaveGeofence = async () => {
        setIsSaving(true);
        try {
            await providerApi.updateBranch(id, {
                latitude: parseFloat(geoLat) || null,
                longitude: parseFloat(geoLng) || null,
                geofence_radius: geoRadius,
                require_gps: requireGps,
            });
            addToast('success', t('branchSettings.geofenceSaved'));
        } catch {
            addToast('error', t('branchSettings.geofenceSaveFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    const renderGeneral = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{t('branchSettings.tabGeneral')}</span>
                </div>
                <div className={styles.cardBody}>
                    <Input label={t('branchSettings.branchName')} defaultValue={branch.name} />
                    <Input label={t('branchSettings.address')} defaultValue={branch.address} />
                    <div className={styles.row}>
                        <div className={styles.col}>
                            <Input label={t('branchSettings.phone')} defaultValue={branch.phone} />
                        </div>
                        <div className={styles.col}>
                            <Input label={t('branchSettings.manager')} defaultValue={branch.manager} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{t('branchSettings.financialSettings')}</span>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.row}>
                        <div className={styles.col}>
                            <Input label={t('branchSettings.taxId')} defaultValue={branch.taxId} />
                        </div>
                        <div className={styles.col}>
                            <Select
                                label={t('branchSettings.currency')}
                                options={[
                                    { value: 'EGP', label: t('branchSettings.currencyEgp') },
                                    { value: 'USD', label: t('branchSettings.currencyUsd') },
                                ]}
                                defaultValue={branch.currency}
                            />
                        </div>
                    </div>
                    <Checkbox label={t('branchSettings.enableTax')} checked={true} />
                    <Checkbox label={t('branchSettings.printTaxId')} checked={true} />
                </div>
            </div>

            {/* Task 10: Location & Geofencing */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>
                        <MapPin size={16} style={{ marginInlineEnd: 'var(--space-2)' }} />{' '}
                        {t('branchSettings.locationGeofencing')}
                    </span>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.row}>
                        <div className={styles.col}>
                            <Input
                                label={t('branchSettings.latitude')}
                                type="number"
                                value={geoLat}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGeoLat(e.target.value)}
                                placeholder="e.g. 30.0444"
                            />
                        </div>
                        <div className={styles.col}>
                            <Input
                                label={t('branchSettings.longitude')}
                                type="number"
                                value={geoLng}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGeoLng(e.target.value)}
                                placeholder="e.g. 31.2357"
                            />
                        </div>
                    </div>
                    <p
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                            marginBottom: 'var(--space-3)',
                        }}
                    >
                        {t('branchSettings.coordsHint')}
                    </p>
                    <div style={{ marginBottom: 'var(--space-3)' }}>
                        <label
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-medium)',
                                display: 'block',
                                marginBottom: 'var(--space-2)',
                            }}
                        >
                            {t('branchSettings.geofenceRadius')}: <strong>{geoRadius}m</strong>
                        </label>
                        <input
                            type="range"
                            min={50}
                            max={1000}
                            step={50}
                            value={geoRadius}
                            onChange={e => setGeoRadius(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary-500)' }}
                        />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-tertiary)',
                            }}
                        >
                            <span>50m</span>
                            <span>1000m</span>
                        </div>
                    </div>
                    <div
                        style={{
                            padding: 'var(--space-3)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-secondary)',
                            marginBottom: 'var(--space-3)',
                        }}
                    >
                        {t('branchSettings.geofenceMustBe1')} <strong>{geoRadius}m</strong> of{' '}
                        <strong>
                            [{geoLat || '—'}, {geoLng || '—'}]
                        </strong>{' '}
                        {t('branchSettings.geofenceMustBe2')}
                    </div>
                    <Checkbox
                        label={t('branchSettings.requireGps')}
                        checked={requireGps}
                        onChange={(val: boolean) => setRequireGps(val)}
                    />
                    <p
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                            marginTop: 'var(--space-2)',
                        }}
                    >
                        If disabled, employees can clock in from anywhere (useful for remote or delivery roles).
                    </p>
                    <div style={{ marginTop: 'var(--space-4)' }}>
                        <Button onClick={handleSaveGeofence} disabled={isSaving}>
                            <Save size={16} /> {isSaving ? t('common.saving') : t('branchSettings.saveGeofence')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderHours = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{t('branchSettings.tabHours')}</span>
                    <Button size="sm" variant="outline">
                        {t('branchSettings.tabHours')}
                    </Button>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.hoursGrid}>
                        {branch.hours.map((day, i) => (
                            <div key={i} className={styles.dayRow}>
                                <div className={styles.dayName}>{day.day}</div>
                                <div className={styles.dayHours}>
                                    <Checkbox
                                        label={day.closed ? t('branchSettings.closed') : t('branchSettings.openStatus')}
                                        checked={!day.closed}
                                    />
                                    {!day.closed && (
                                        <>
                                            <Input type="time" defaultValue={day.open} style={{ width: 120 }} />
                                            <span>{t('branchSettings.to')}</span>
                                            <Input type="time" defaultValue={day.close} style={{ width: 120 }} />
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRooms = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{t('branchSettings.tabRooms')}</span>
                    <Button size="sm">
                        <Plus size={16} /> {t('branchSettings.addRoom')}
                    </Button>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>{t('branchSettings.roomName')}</th>
                                <th>{t('branchSettings.type')}</th>
                                <th>{t('branchSettings.capacity')}</th>
                                <th>{t('fpAreas.colActions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branch.rooms.map(room => (
                                <tr key={room.id}>
                                    <td>{room.name}</td>
                                    <td>
                                        <Badge color="neutral">{room.type}</Badge>
                                    </td>
                                    <td>
                                        {room.capacity} {t('branchSettings.persons')}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                iconOnly
                                                aria-label={t('branchSettings.configureRoom')}
                                            >
                                                <Settings size={14} />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                iconOnly
                                                aria-label={t('branchSettings.deleteRoom')}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
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

    return (
        <div className={styles.page} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <div className={styles.subtitle}>
                        <Building2 size={14} /> {t('branchSettings.title')}
                    </div>
                    <h1>
                        {branch.name}
                        <Badge color={branch.status === 'active' ? 'success' : 'neutral'}>
                            {branch.status === 'active'
                                ? t('branchSettings.statusActive')
                                : t('branchSettings.statusInactive')}
                        </Badge>
                    </h1>
                </div>
                <div className={styles.actions}>
                    <Button variant="outline">{t('branchSettings.backToBranches')}</Button>
                    <Button>
                        <Save size={16} /> {t('branchSettings.saveChanges')}
                    </Button>
                </div>
            </div>

            <Tabs
                active={activeTab}
                onChange={setActiveTab}
                items={[
                    { key: 'general', label: t('branchSettings.tabGeneral'), icon: <Settings size={16} /> },
                    { key: 'hours', label: t('branchSettings.tabHours'), icon: <Clock size={16} /> },
                    { key: 'rooms', label: t('branchSettings.tabRooms'), icon: <LayoutGrid size={16} /> },
                ]}
            />

            <div className={styles.content}>
                {activeTab === 'general' && renderGeneral()}
                {activeTab === 'hours' && renderHours()}
                {activeTab === 'rooms' && renderRooms()}

                {/* Side Panel (Contextual Help) */}
                <div className={styles.sidePanel}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>{t('branchSettings.branchStats')}</span>
                        </div>
                        <div className={styles.cardBody}>
                            <div style={{ marginBottom: 'var(--space-3)' }}>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                                    {t('branchSettings.totalEmployees')}
                                </div>
                                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>12</div>
                            </div>
                            <div style={{ marginBottom: 'var(--space-3)' }}>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                                    {t('branchSettings.activeBookings')}
                                </div>
                                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>8</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                                    {t('branchSettings.lastSync')}
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)' }}>{t('branchSettings.justNow')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
