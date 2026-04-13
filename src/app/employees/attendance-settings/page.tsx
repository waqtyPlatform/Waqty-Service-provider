'use client';

import React, { useState } from 'react';
import { Save, Clock, ShieldAlert, Timer, CalendarClock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Switch, Input, Select, Button, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { employeeExtApi } from '@/lib/api';
import { SHIFT_TEMPLATES } from '@/lib/shiftData';

/* ─── Styles ───────────────────────────── */
const s: Record<string, React.CSSProperties> = {
    page: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        maxWidth: 900,
        margin: '0 auto',
        width: '100%',
        paddingBottom: 'var(--space-8)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
    },
    title: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    subtitle: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4 },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 'var(--space-4) var(--space-5)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-primary)',
    },
    cardBody: { padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' },
    row: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-4) 0',
        borderBottom: '1px dashed var(--border-color)',
    },
    rowLast: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4) 0' },
    rowLabel: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1 },
    label: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' },
    hint: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', lineHeight: 1.4 },
    rowAction: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 },
    inputGroup: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
    unit: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    deductionBox: {
        background: 'var(--bg-secondary)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-4)',
    },
    shiftLink: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        background: 'var(--color-primary-50)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-primary-200)',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'var(--text-primary)',
        transition: 'background 0.15s',
    },
    tplPill: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 'var(--text-xs)',
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        borderTop: '1px solid var(--border-color)',
        padding: 'var(--space-5)',
        gap: 'var(--space-3)',
    },
};

/* ─── Component ─────────────────────────── */
export default function AttendanceSettingsPage() {
    const { t, lang } = useTranslation();
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    // API: fetch attendance methods (ready for backend)
    const { loading, error, refetch } = useApiQuery(() => employeeExtApi.getAttendanceMethods() as never, [], {
        fallbackData: [],
    });

    const [config, setConfig] = useState({
        lateGrace: '5',
        earlyGrace: '10',
        overtimeThreshold: '15',
        maxOvertimeDaily: '3',
        autoDeduct: true,
        deductionType: 'percentage',
        deductionValue: '5',
        notifyManager: false,
        enforceBreaks: true,
        autoClockOut: false,
        autoClockOutBuffer: '30',
    });

    const set = (key: keyof typeof config, value: string | boolean) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            addToast('success', t('attendanceSettings.toastSaved'));
        }, 600);
    };

    return (
        <div style={{ ...s.page, direction: dir }}>
            {/* Header */}
            <div style={s.header}>
                <div>
                    <div style={s.title}>{t('attendanceSettings.title')}</div>
                    <div style={s.subtitle}>{t('attendanceSettings.subtitle')}</div>
                </div>
            </div>

            {/* Shift Reference Card */}
            <Link href="/employees/schedule" style={s.shiftLink}>
                <CalendarClock size={20} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>
                        {t('attendanceSettings.shiftSource')}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                        {t('attendanceSettings.shiftSourceHint')}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 'var(--space-2)',
                            marginTop: 'var(--space-2)',
                        }}
                    >
                        {SHIFT_TEMPLATES.map(tpl => (
                            <span key={tpl.id} style={s.tplPill}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: tpl.color }} />
                                {tpl.name}
                            </span>
                        ))}
                    </div>
                </div>
                <ExternalLink size={16} style={{ color: 'var(--color-primary-500)', flexShrink: 0 }} />
            </Link>

            {/* Grace Periods */}
            <div style={s.card}>
                <div style={s.cardHeader}>
                    <Clock size={18} /> {t('attendanceSettings.secGrace')}
                </div>
                <div style={s.cardBody}>
                    <div style={s.row}>
                        <div style={s.rowLabel}>
                            <div style={s.label}>{t('attendanceSettings.lateGrace')}</div>
                            <div style={s.hint}>{t('attendanceSettings.lateGraceHint')}</div>
                        </div>
                        <div style={s.rowAction}>
                            <Input
                                type="number"
                                value={config.lateGrace}
                                onChange={e => set('lateGrace', e.target.value)}
                                style={{ width: 70, textAlign: 'center', margin: 0 }}
                            />
                            <span style={s.unit}>{t('attendanceSettings.min')}</span>
                        </div>
                    </div>
                    <div style={s.rowLast}>
                        <div style={s.rowLabel}>
                            <div style={s.label}>{t('attendanceSettings.earlyGrace')}</div>
                            <div style={s.hint}>{t('attendanceSettings.earlyGraceHint')}</div>
                        </div>
                        <div style={s.rowAction}>
                            <Input
                                type="number"
                                value={config.earlyGrace}
                                onChange={e => set('earlyGrace', e.target.value)}
                                style={{ width: 70, textAlign: 'center', margin: 0 }}
                            />
                            <span style={s.unit}>{t('attendanceSettings.min')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overtime */}
            <div style={s.card}>
                <div style={s.cardHeader}>
                    <Timer size={18} /> {t('attendanceSettings.secOvertime')}
                </div>
                <div style={s.cardBody}>
                    <div style={s.row}>
                        <div style={s.rowLabel}>
                            <div style={s.label}>{t('attendanceSettings.overtimeThreshold')}</div>
                            <div style={s.hint}>{t('attendanceSettings.overtimeThresholdHint')}</div>
                        </div>
                        <div style={s.rowAction}>
                            <Input
                                type="number"
                                value={config.overtimeThreshold}
                                onChange={e => set('overtimeThreshold', e.target.value)}
                                style={{ width: 70, textAlign: 'center', margin: 0 }}
                            />
                            <span style={s.unit}>{t('attendanceSettings.min')}</span>
                        </div>
                    </div>
                    <div style={s.row}>
                        <div style={s.rowLabel}>
                            <div style={s.label}>{t('attendanceSettings.maxOvertimeDaily')}</div>
                            <div style={s.hint}>{t('attendanceSettings.maxOvertimeDailyHint')}</div>
                        </div>
                        <div style={s.rowAction}>
                            <Input
                                type="number"
                                value={config.maxOvertimeDaily}
                                onChange={e => set('maxOvertimeDaily', e.target.value)}
                                style={{ width: 70, textAlign: 'center', margin: 0 }}
                            />
                            <span style={s.unit}>{t('attendanceSettings.hrs')}</span>
                        </div>
                    </div>
                    <div style={s.row}>
                        <div style={s.rowLabel}>
                            <div style={s.label}>{t('attendanceSettings.enforceBreaks')}</div>
                            <div style={s.hint}>{t('attendanceSettings.enforceBreaksHint')}</div>
                        </div>
                        <div style={s.rowAction}>
                            <Switch checked={config.enforceBreaks} onChange={val => set('enforceBreaks', val)} />
                        </div>
                    </div>
                    <div style={s.rowLast}>
                        <div style={s.rowLabel}>
                            <div style={s.label}>{t('attendanceSettings.autoClockOut')}</div>
                            <div style={s.hint}>{t('attendanceSettings.autoClockOutHint')}</div>
                        </div>
                        <div style={s.rowAction}>
                            {config.autoClockOut && (
                                <>
                                    <Input
                                        type="number"
                                        value={config.autoClockOutBuffer}
                                        onChange={e => set('autoClockOutBuffer', e.target.value)}
                                        style={{ width: 70, textAlign: 'center', margin: 0 }}
                                    />
                                    <span style={s.unit}>{t('attendanceSettings.min')}</span>
                                </>
                            )}
                            <Switch checked={config.autoClockOut} onChange={val => set('autoClockOut', val)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Penalties & Notifications */}
            <div style={s.card}>
                <div style={s.cardHeader}>
                    <ShieldAlert size={18} /> {t('attendanceSettings.secPenalties')}
                </div>
                <div style={s.cardBody}>
                    <div style={config.autoDeduct ? { ...s.row, borderBottom: 'none', paddingBottom: 0 } : s.row}>
                        <div style={s.rowLabel}>
                            <div style={s.label}>{t('attendanceSettings.autoDeduct')}</div>
                            <div style={s.hint}>{t('attendanceSettings.autoDeductHint')}</div>
                        </div>
                        <div style={s.rowAction}>
                            <Switch checked={config.autoDeduct} onChange={val => set('autoDeduct', val)} />
                        </div>
                    </div>

                    {config.autoDeduct && (
                        <div style={{ ...s.deductionBox, marginBottom: 'var(--space-2)' }}>
                            <Select
                                label={t('attendanceSettings.deductType')}
                                value={config.deductionType}
                                onChange={e => set('deductionType', e.target.value)}
                                options={[
                                    { label: t('attendanceSettings.typePercentage'), value: 'percentage' },
                                    { label: t('attendanceSettings.typeFixed'), value: 'fixed' },
                                ]}
                            />
                            <Input
                                label={t('attendanceSettings.deductValue')}
                                type="number"
                                value={config.deductionValue}
                                onChange={e => set('deductionValue', e.target.value)}
                                hint={
                                    config.deductionType === 'percentage'
                                        ? t('attendanceSettings.valueHintPct')
                                        : t('attendanceSettings.valueHintFixed')
                                }
                            />
                        </div>
                    )}

                    <div style={s.rowLast}>
                        <div style={s.rowLabel}>
                            <div style={s.label}>{t('attendanceSettings.notifyAbsence')}</div>
                            <div style={s.hint}>{t('attendanceSettings.notifyAbsenceHint')}</div>
                        </div>
                        <div style={s.rowAction}>
                            <Switch checked={config.notifyManager} onChange={val => set('notifyManager', val)} />
                        </div>
                    </div>
                </div>

                {/* Save */}
                <div style={s.footer}>
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save size={16} />
                        {isSaving ? t('attendanceSettings.saving') : t('attendanceSettings.saveSettings')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
