'use client';

import React from 'react';
import { Plus, Edit, Trash2, Fingerprint, Wifi, RefreshCw } from 'lucide-react';
import { Button, Badge, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';
import styles from './page.module.css';

interface FpDevice {
    id: number;
    name: string;
    ip: string;
    status: string;
    lastSync: string;
}

// Fallback Data
const fallbackDevices: FpDevice[] = [
    { id: 1, name: 'Recepiton Main', ip: '192.168.1.101', status: 'Online', lastSync: 'Just now' },
    { id: 2, name: 'Staff Entrance', ip: '192.168.1.102', status: 'Online', lastSync: '5 mins ago' },
    { id: 3, name: 'Back Office', ip: '192.168.1.103', status: 'Offline', lastSync: '2 hours ago' },
];

export default function FingerprintDevicesPage() {
    const { t, lang } = useTranslation();
    const { addToast } = useToast();

    const {
        data: apiDevices,
        loading,
        error,
        refetch,
    } = useApiQuery<FpDevice[]>(
        () =>
            (settingsApi.getFingerprintDevices?.() as
                | Promise<import('@/lib/api').ApiResponse<FpDevice[]>>
                | undefined) ?? Promise.resolve({ success: true, message: '', data: fallbackDevices }),
        [],
        { fallbackData: fallbackDevices }
    );

    const devices = apiDevices || fallbackDevices;

    const getTranslatedSync = (sync: string) => {
        switch (sync) {
            case 'Just now':
                return t('settings.fingerprint.justNow');
            case '5 mins ago':
                return t('settings.fingerprint.minsAgo');
            case '2 hours ago':
                return t('settings.fingerprint.hoursAgo');
            default:
                return sync;
        }
    };

    const handleDelete = async (id: number) => {
        try {
            if (settingsApi.deleteFingerprintDevice) {
                await settingsApi.deleteFingerprintDevice(String(id));
            }
            addToast('success', t('settings.fingerprint.deviceRemoved'));
            refetch();
        } catch {
            addToast('error', t('settings.fingerprint.removeFailed'));
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>{t('settings.fingerprint.title')}</h1>
                    <div className={styles.subtitle}>{t('settings.fingerprint.subtitle')}</div>
                </div>
                <div className={styles.actions}>
                    <Button variant="outline" onClick={() => refetch()}>
                        <RefreshCw size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                        {t('settings.fingerprint.scan')}
                    </Button>
                    <Button
                        onClick={async () => {
                            try {
                                if (settingsApi.createFingerprintDevice) {
                                    await settingsApi.createFingerprintDevice({ name: 'New Device', ip: '' });
                                }
                                addToast('success', t('settings.fingerprint.deviceAdded'));
                                refetch();
                            } catch {
                                addToast('error', t('settings.fingerprint.addFailed'));
                            }
                        }}
                    >
                        <Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                        {t('settings.fingerprint.addDevice')}
                    </Button>
                </div>
            </div>

            <DataGuard
                loading={loading}
                error={error}
                data={devices}
                emptyIcon={<Fingerprint size={48} />}
                emptyTitle={t('settings.fingerprint.connected')}
                emptyDescription={t('settings.fingerprint.emptyDesc')}
                onRetry={refetch}
                skeletonCount={3}
                skeletonVariant="card"
            >
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>
                            <Fingerprint size={18} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                            {t('settings.fingerprint.connected')}
                        </span>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'start' }}>{t('settings.fingerprint.colName')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('settings.fingerprint.colIp')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('settings.fingerprint.colStatus')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('settings.fingerprint.colLastSync')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('settings.fingerprint.colActions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {devices.map(device => (
                                    <tr key={device.id}>
                                        <td
                                            style={{
                                                fontWeight: 'var(--font-medium)',
                                                textAlign: 'start',
                                            }}
                                        >
                                            {device.name}
                                        </td>
                                        <td
                                            style={{
                                                fontFamily: 'var(--font-mono)',
                                                textAlign: 'start',
                                            }}
                                        >
                                            {device.ip}
                                        </td>
                                        <td style={{ textAlign: 'start' }}>
                                            <Badge color={device.status === 'Online' ? 'success' : 'destructive'}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 'var(--space-1)',
                                                    }}
                                                >
                                                    <Wifi size={12} />{' '}
                                                    {device.status === 'Online'
                                                        ? t('settings.fingerprint.online')
                                                        : t('settings.fingerprint.offline')}
                                                </div>
                                            </Badge>
                                        </td>
                                        <td
                                            style={{
                                                color: 'var(--text-secondary)',
                                                textAlign: 'start',
                                            }}
                                        >
                                            {getTranslatedSync(device.lastSync)}
                                        </td>
                                        <td style={{ textAlign: 'start' }}>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    iconOnly
                                                    aria-label={t('common.edit')}
                                                >
                                                    <Edit size={14} />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    iconOnly
                                                    aria-label={t('common.delete')}
                                                    onClick={() => handleDelete(device.id)}
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
            </DataGuard>
        </div>
    );
}
