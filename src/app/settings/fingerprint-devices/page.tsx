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
    Badge
} from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './page.module.css';

// Mock Data
const devices = [
    { id: 1, name: 'Recepiton Main', ip: '192.168.1.101', status: 'Online', lastSync: 'Just now' },
    { id: 2, name: 'Staff Entrance', ip: '192.168.1.102', status: 'Online', lastSync: '5 mins ago' },
    { id: 3, name: 'Back Office', ip: '192.168.1.103', status: 'Offline', lastSync: '2 hours ago' },
];

export default function FingerprintDevicesPage() {
    const { t, lang } = useTranslation();

    const getTranslatedSync = (sync: string) => {
        switch (sync) {
            case 'Just now': return t('settings.fingerprint.justNow');
            case '5 mins ago': return t('settings.fingerprint.minsAgo');
            case '2 hours ago': return t('settings.fingerprint.hoursAgo');
            default: return sync;
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
                    <Button variant="outline"><RefreshCw size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('settings.fingerprint.scan')}</Button>
                    <Button><Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('settings.fingerprint.addDevice')}</Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><Fingerprint size={18} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('settings.fingerprint.connected')}</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('settings.fingerprint.colName')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('settings.fingerprint.colIp')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('settings.fingerprint.colStatus')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('settings.fingerprint.colLastSync')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('settings.fingerprint.colActions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map(device => (
                                <tr key={device.id}>
                                    <td style={{ fontWeight: 'var(--font-medium)', textAlign: lang === 'ar' ? 'right' : 'left' }}>{device.name}</td>
                                    <td style={{ fontFamily: 'var(--font-mono)', textAlign: lang === 'ar' ? 'right' : 'left' }}>{device.ip}</td>
                                    <td style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                        <Badge color={device.status === 'Online' ? 'success' : 'destructive'}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Wifi size={12} /> {device.status === 'Online' ? t('settings.fingerprint.online') : t('settings.fingerprint.offline')}
                                            </div>
                                        </Badge>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', textAlign: lang === 'ar' ? 'right' : 'left' }}>{getTranslatedSync(device.lastSync)}</td>
                                    <td style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
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
