'use client';

import React, { useState } from 'react';
import { Fingerprint, Smartphone, Monitor } from 'lucide-react';
import { Switch, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

const initialMethods = [
    { id: 1, name: 'Fingerprint Scanner', type: 'Biometric', device: 'BioStation A2', schedule: 'All Shifts', active: true, icon: 'fingerprint' },
    { id: 2, name: 'Face Recognition', type: 'Biometric', device: 'FaceStation F2', schedule: 'All Shifts', active: true, icon: 'monitor' },
    { id: 3, name: 'Mobile App Check-in', type: 'GPS', device: 'Employee App', schedule: 'Morning Shift', active: true, icon: 'smartphone' },
    { id: 4, name: 'PIN Code Entry', type: 'Manual', device: 'BioStation A2', schedule: 'Emergency Only', active: false, icon: 'monitor' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' },
    cardHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' },
    icon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' },
    name: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    toggle: { cursor: 'pointer', color: 'var(--color-primary-500)' },
    row: { display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', fontSize: 'var(--text-sm)' },
    label: { color: 'var(--text-tertiary)' },
    val: { fontWeight: 'var(--font-medium)' },
};

export default function AttendMethodsPage() {
    const [methodsList, setMethodsList] = useState(initialMethods);
    const { addToast } = useToast();
    const { t, lang } = useTranslation();

    const handleToggle = (id: number, currentStatus: boolean, name: string) => {
        setMethodsList(methodsList.map(m => m.id === id ? { ...m, active: !currentStatus } : m));
        addToast(
            !currentStatus ? 'success' : 'warning',
            `${name} ${!currentStatus ? t('attendMethods.hasBeenEnabled') : t('attendMethods.hasBeenDisabled')}`
        );
    };

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{t('attendMethods.title')}</div>
            <div style={s.grid}>
                {methodsList.map(m => (
                    <div key={m.id} style={{ ...s.card, opacity: m.active ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                        <div style={s.cardHead}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <div style={{ ...s.icon, filter: m.active ? 'none' : 'grayscale(100%)' }}>
                                    {m.icon === 'fingerprint' ? <Fingerprint size={20} /> : m.icon === 'smartphone' ? <Smartphone size={20} /> : <Monitor size={20} />}
                                </div>
                                <div>
                                    <div style={s.name}>{m.name}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{m.type}</div>
                                </div>
                            </div>
                            <Switch
                                checked={m.active}
                                onChange={() => handleToggle(m.id, m.active, m.name)}
                            />
                        </div>
                        <div style={s.row}><span style={s.label}>{t('attendMethods.device')}</span><span style={s.val}>{m.device}</span></div>
                        <div style={s.row}><span style={s.label}>{t('attendMethods.schedule')}</span><span style={s.val}>{m.schedule}</span></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
