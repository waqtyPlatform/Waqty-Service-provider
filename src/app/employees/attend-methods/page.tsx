'use client';

import React, { useState, useMemo } from 'react';
import { Fingerprint, Smartphone, Monitor } from 'lucide-react';
import { Switch, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { employeeExtApi, type AttendanceMethod } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

const fallbackMethods = [
    {
        id: 1,
        name: 'Fingerprint Scanner',
        type: 'Biometric',
        device: 'BioStation A2',
        schedule: 'All Shifts',
        active: true,
        icon: 'fingerprint',
    },
    {
        id: 2,
        name: 'Face Recognition',
        type: 'Biometric',
        device: 'FaceStation F2',
        schedule: 'All Shifts',
        active: true,
        icon: 'monitor',
    },
    {
        id: 3,
        name: 'Mobile App Check-in',
        type: 'GPS',
        device: 'Employee App',
        schedule: 'Morning Shift',
        active: true,
        icon: 'smartphone',
    },
    {
        id: 4,
        name: 'PIN Code Entry',
        type: 'Manual',
        device: 'BioStation A2',
        schedule: 'Emergency Only',
        active: false,
        icon: 'monitor',
    },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-5)',
    },
    cardHead: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-4)',
    },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-primary-50)',
        color: 'var(--color-primary-600)',
    },
    name: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    toggle: { cursor: 'pointer', color: 'var(--color-primary-500)' },
    row: { display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', fontSize: 'var(--text-sm)' },
    label: { color: 'var(--text-tertiary)' },
    val: { fontWeight: 'var(--font-medium)' },
};

export default function AttendMethodsPage() {
    const { addToast } = useToast();
    const { t, lang } = useTranslation();

    // ─── API Integration ────────────────────────────────────────────
    const {
        data: apiMethods,
        loading,
        error,
        refetch,
    } = useApiQuery<AttendanceMethod[]>(() => employeeExtApi.getAttendanceMethods() as never, [], {
        fallbackData: fallbackMethods,
    });

    // Map API data to local format
    const mappedMethods = useMemo(() => {
        if (apiMethods && apiMethods.length > 0) {
            const iconMap: Record<string, string> = {
                fingerprint: 'fingerprint',
                face_recognition: 'monitor',
                mobile_gps: 'smartphone',
                pin: 'monitor',
            };
            return apiMethods.map((m, i) => ({
                id: i + 1,
                uuid: m.uuid,
                name: m.name,
                type: m.type,
                device: (m.config?.device as string) || 'Unknown',
                schedule: (m.config?.schedule as string) || 'All Shifts',
                active: m.enabled,
                icon: iconMap[m.type] || 'monitor',
            }));
        }
        return fallbackMethods;
    }, [apiMethods]);

    const [localOverrides, setLocalOverrides] = useState<Record<number, boolean>>({});
    const methodsList = mappedMethods.map(m => ({
        ...m,
        active: localOverrides[m.id] !== undefined ? localOverrides[m.id] : m.active,
    }));

    const handleToggle = async (id: number, currentStatus: boolean, name: string) => {
        setLocalOverrides(prev => ({ ...prev, [id]: !currentStatus }));
        // Attempt API update
        try {
            const method = apiMethods?.find((_m, i) => i + 1 === id);
            if (method) {
                await employeeExtApi.updateAttendanceMethod(method.uuid, { enabled: !currentStatus });
                refetch();
            }
        } catch {
            // Fallback to local state only
        }
        addToast(
            !currentStatus ? 'success' : 'warning',
            `${name} ${!currentStatus ? t('attendMethods.hasBeenEnabled') : t('attendMethods.hasBeenDisabled')}`
        );
    };

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>
                {t('attendMethods.title')}
            </div>
            <DataGuard
                loading={loading}
                error={error}
                data={methodsList}
                onRetry={refetch}
                emptyIcon={<Fingerprint size={48} />}
                emptyTitle={t('attendMethods.emptyTitle') || 'No attendance methods'}
                emptyDescription={t('attendMethods.emptyDesc') || 'Configure attendance methods for your employees.'}
            >
                <div style={s.grid}>
                    {methodsList.map(m => (
                        <div key={m.id} style={{ ...s.card, opacity: m.active ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                            <div style={s.cardHead}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <div style={{ ...s.icon, filter: m.active ? 'none' : 'grayscale(100%)' }}>
                                        {m.icon === 'fingerprint' ? (
                                            <Fingerprint size={20} />
                                        ) : m.icon === 'smartphone' ? (
                                            <Smartphone size={20} />
                                        ) : (
                                            <Monitor size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <div style={s.name}>{m.name}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            {m.type}
                                        </div>
                                    </div>
                                </div>
                                <Switch checked={m.active} onChange={() => handleToggle(m.id, m.active, m.name)} />
                            </div>
                            <div style={s.row}>
                                <span style={s.label}>{t('attendMethods.device')}</span>
                                <span style={s.val}>{m.device}</span>
                            </div>
                            <div style={s.row}>
                                <span style={s.label}>{t('attendMethods.schedule')}</span>
                                <span style={s.val}>{m.schedule}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </DataGuard>
        </div>
    );
}
