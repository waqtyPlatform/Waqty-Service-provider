'use client';

import React from 'react';
import { Monitor, Smartphone, Printer, Wifi, WifiOff } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

interface Device {
    id: number;
    name: string;
    type: string;
    model: string;
    branch: string;
    lastSeen: string;
    online: boolean;
}

const fallbackDevices: Device[] = [
    {
        id: 1,
        name: 'Reception POS',
        type: 'POS Terminal',
        model: 'Sunmi V2 Pro',
        branch: 'Downtown',
        lastSeen: '2026-03-13 10:05',
        online: true,
    },
    {
        id: 2,
        name: 'BioStation A2',
        type: 'Fingerprint Scanner',
        model: 'Suprema BioStation A2',
        branch: 'Downtown',
        lastSeen: '2026-03-19 10:00',
        online: true,
    },
    {
        id: 3,
        name: 'FaceStation F2',
        type: 'Face Recognition',
        model: 'Suprema FaceStation F2',
        branch: 'Downtown',
        lastSeen: '2026-03-25 09:58',
        online: true,
    },
    {
        id: 4,
        name: 'Receipt Printer',
        type: 'Printer',
        model: 'Epson TM-T88VI',
        branch: 'Downtown',
        lastSeen: '2026-03-15 09:45',
        online: true,
    },
    {
        id: 5,
        name: 'Mall POS',
        type: 'POS Terminal',
        model: 'Sunmi V2 Pro',
        branch: 'Mall of Arabia',
        lastSeen: '2026-03-13 08:30',
        online: true,
    },
    {
        id: 6,
        name: 'New Cairo POS',
        type: 'POS Terminal',
        model: 'Sunmi V2 Pro',
        branch: 'New Cairo',
        lastSeen: '2026-03-13 18:00',
        online: false,
    },
];

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'POS Terminal':
            return <Monitor size={20} />;
        case 'Fingerprint Scanner':
        case 'Face Recognition':
            return <Smartphone size={20} />;
        case 'Printer':
            return <Printer size={20} />;
        default:
            return <Monitor size={20} />;
    }
};

const getTranslatedType = (type: string, t: (key: string) => string) => {
    switch (type) {
        case 'POS Terminal':
            return t('settings.devices.types.pos');
        case 'Fingerprint Scanner':
            return t('settings.devices.types.fingerprint');
        case 'Face Recognition':
            return t('settings.devices.types.face');
        case 'Printer':
            return t('settings.devices.types.printer');
        default:
            return type;
    }
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    table: {
        width: '100%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    th: {
        padding: 'var(--space-3) var(--space-4)',
        textAlign: 'left',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: 'var(--bg-secondary)',
    },
    td: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        borderTop: '1px solid var(--border-color)',
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        fontSize: 11,
        fontWeight: 'var(--font-semibold)',
    },
};

export default function DevicesPage() {
    const { t, lang } = useTranslation();

    const {
        data: devices,
        loading,
        error,
        refetch,
    } = useApiQuery<Device[]>(
        () =>
            (settingsApi.getDevices?.() as Promise<import('@/lib/api').ApiResponse<Device[]>> | undefined) ??
            Promise.resolve({ success: true, message: '', data: fallbackDevices }),
        [],
        { fallbackData: fallbackDevices }
    );

    const deviceList = devices || fallbackDevices;

    return (
        <div style={s.page}>
            <DataGuard
                loading={loading}
                error={error}
                data={deviceList}
                emptyIcon={<Monitor size={48} />}
                emptyTitle={t('settings.devices.colDevice')}
                emptyDescription={t('settings.devices.emptyDesc')}
                onRetry={refetch}
                skeletonCount={4}
                skeletonVariant="card"
            >
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th
                                style={{
                                    ...(s.th as React.CSSProperties),
                                    textAlign: lang === 'ar' ? 'right' : 'left',
                                }}
                            >
                                {t('settings.devices.colDevice')}
                            </th>
                            <th
                                style={{
                                    ...(s.th as React.CSSProperties),
                                    textAlign: lang === 'ar' ? 'right' : 'left',
                                }}
                            >
                                {t('settings.devices.colType')}
                            </th>
                            <th
                                style={{
                                    ...(s.th as React.CSSProperties),
                                    textAlign: lang === 'ar' ? 'right' : 'left',
                                }}
                            >
                                {t('settings.devices.colModel')}
                            </th>
                            <th
                                style={{
                                    ...(s.th as React.CSSProperties),
                                    textAlign: lang === 'ar' ? 'right' : 'left',
                                }}
                            >
                                {t('settings.devices.colBranch')}
                            </th>
                            <th
                                style={{
                                    ...(s.th as React.CSSProperties),
                                    textAlign: lang === 'ar' ? 'right' : 'left',
                                }}
                            >
                                {t('settings.devices.colLastSeen')}
                            </th>
                            <th
                                style={{
                                    ...(s.th as React.CSSProperties),
                                    textAlign: lang === 'ar' ? 'right' : 'left',
                                }}
                            >
                                {t('settings.devices.colStatus')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {deviceList.map(d => (
                            <tr key={d.id}>
                                <td
                                    style={{
                                        ...s.td,
                                        fontWeight: 'var(--font-medium)',
                                        textAlign: lang === 'ar' ? 'right' : 'left',
                                    }}
                                >
                                    {d.name}
                                </td>
                                <td style={{ ...s.td, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {getTypeIcon(d.type)} {getTranslatedType(d.type, t)}
                                    </div>
                                </td>
                                <td style={{ ...s.td, textAlign: lang === 'ar' ? 'right' : 'left' }}>{d.model}</td>
                                <td style={{ ...s.td, textAlign: lang === 'ar' ? 'right' : 'left' }}>{d.branch}</td>
                                <td style={{ ...s.td, textAlign: lang === 'ar' ? 'right' : 'left' }}>{d.lastSeen}</td>
                                <td style={{ ...s.td, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                    <span
                                        style={{
                                            ...s.badge,
                                            background: d.online
                                                ? 'var(--color-success-light)'
                                                : 'var(--color-error-light)',
                                            color: d.online ? 'var(--color-success)' : 'var(--color-error)',
                                        }}
                                    >
                                        {d.online ? (
                                            <>
                                                <Wifi size={12} /> {t('settings.devices.online')}
                                            </>
                                        ) : (
                                            <>
                                                <WifiOff size={12} /> {t('settings.devices.offline')}
                                            </>
                                        )}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataGuard>
        </div>
    );
}
