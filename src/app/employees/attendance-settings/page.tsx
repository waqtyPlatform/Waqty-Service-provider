'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Switch, Input, Select, Button, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-8)' },
    title: { fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    section: { marginBottom: 'var(--space-8)' },
    sectionTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' },
    row: { display: 'flex', alignItems: 'flex-start', padding: 'var(--space-4) 0', borderBottom: '1px dashed var(--border-color)' },
    rowContent: { flex: '0 0 320px', paddingRight: 'var(--space-6)' },
    rowAction: { display: 'flex', flex: 1, alignItems: 'center', gap: 'var(--space-3)', justifyContent: 'flex-start' },
    label: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)', marginBottom: 4 },
    hint: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', lineHeight: 1.4 },
    inputGroup: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
    deductionBox: { background: 'var(--bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', border: '1px solid var(--border-color)' }
};

export default function AttendanceSettingsPage() {
    const { t, lang } = useTranslation();
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [config, setConfig] = useState({
        standardHours: '9',
        shiftStart: '09:00',
        shiftEnd: '18:00',
        lateGrace: '5',
        earlyGrace: '10',
        overtimeThreshold: '15',
        maxOvertime: '3',
        autoDeduct: true,
        deductionType: 'percentage', // 'percentage' | 'fixed'
        deductionValue: '5',
        notifyManager: false
    });

    const handleChange = (key: keyof typeof config, value: boolean | string | number) => {
        setConfig({ ...config, [key]: value });
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            addToast('success', t('attendanceSettings.toastSaved'));
        }, 600);
    };

    return (
        <div style={s.page}>
            <div style={s.title}>{t('attendanceSettings.title')}</div>

            <div style={s.card}>
                <div style={s.section}>
                    <div style={s.sectionTitle}>{t('attendanceSettings.secWorkHours')}</div>
                    <div style={{ ...s.row, flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                        <div style={{ ...s.rowContent as React.CSSProperties, paddingRight: lang === 'ar' ? 0 : 'var(--space-6)', paddingLeft: lang === 'ar' ? 'var(--space-6)' : 0, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <div style={s.label}>{t('attendanceSettings.stdHours')}</div>
                            <div style={s.hint}>{t('attendanceSettings.stdHoursHint')}</div>
                        </div>
                        <div style={{ ...s.rowAction as React.CSSProperties, justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
                            <div style={{ ...s.inputGroup as React.CSSProperties, flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                                <Input type="number" value={config.standardHours} onChange={(e) => handleChange('standardHours', e.target.value)} style={{ width: 80, textAlign: 'center', margin: 0 }} />
                                <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{t('attendanceSettings.hrs')}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ ...s.row, flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                        <div style={{ ...s.rowContent as React.CSSProperties, paddingRight: lang === 'ar' ? 0 : 'var(--space-6)', paddingLeft: lang === 'ar' ? 'var(--space-6)' : 0, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <div style={s.label}>{t('attendanceSettings.shiftDetails')}</div>
                            <div style={s.hint}>{t('attendanceSettings.shiftDetailsHint')}</div>
                        </div>
                        <div style={{ ...s.rowAction as React.CSSProperties, flexDirection: lang === 'ar' ? 'row-reverse' : 'row', justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
                            <Input type="time" value={config.shiftStart} onChange={(e) => handleChange('shiftStart', e.target.value)} style={{ width: 110, margin: 0 }} />
                            <span style={{ color: 'var(--text-tertiary)' }}>{t('attendanceSettings.to')}</span>
                            <Input type="time" value={config.shiftEnd} onChange={(e) => handleChange('shiftEnd', e.target.value)} style={{ width: 110, margin: 0 }} />
                        </div>
                    </div>
                </div>

                <div style={s.section}>
                    <div style={s.sectionTitle}>{t('attendanceSettings.secGrace')}</div>
                    <div style={{ ...s.row, flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                        <div style={{ ...s.rowContent as React.CSSProperties, paddingRight: lang === 'ar' ? 0 : 'var(--space-6)', paddingLeft: lang === 'ar' ? 'var(--space-6)' : 0, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <div style={s.label}>{t('attendanceSettings.lateGrace')}</div>
                            <div style={s.hint}>{t('attendanceSettings.lateGraceHint')}</div>
                        </div>
                        <div style={{ ...s.rowAction as React.CSSProperties, justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
                            <div style={{ ...s.inputGroup as React.CSSProperties, flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                                <Input type="number" value={config.lateGrace} onChange={(e) => handleChange('lateGrace', e.target.value)} style={{ width: 80, textAlign: 'center', margin: 0 }} />
                                <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{t('attendanceSettings.min')}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ ...s.row, flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                        <div style={{ ...s.rowContent as React.CSSProperties, paddingRight: lang === 'ar' ? 0 : 'var(--space-6)', paddingLeft: lang === 'ar' ? 'var(--space-6)' : 0, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <div style={s.label}>{t('attendanceSettings.earlyGrace')}</div>
                            <div style={s.hint}>{t('attendanceSettings.earlyGraceHint')}</div>
                        </div>
                        <div style={{ ...s.rowAction as React.CSSProperties, justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
                            <div style={{ ...s.inputGroup as React.CSSProperties, flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                                <Input type="number" value={config.earlyGrace} onChange={(e) => handleChange('earlyGrace', e.target.value)} style={{ width: 80, textAlign: 'center', margin: 0 }} />
                                <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{t('attendanceSettings.min')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={s.section}>
                    <div style={{ ...s.sectionTitle as React.CSSProperties, textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('attendanceSettings.secPenalties')}</div>

                    <div style={{ ...s.row, borderBottom: config.autoDeduct ? 'none' : '1px dashed var(--border-color)', paddingBottom: config.autoDeduct ? 0 : 'var(--space-4)', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                        <div style={{ ...s.rowContent as React.CSSProperties, paddingRight: lang === 'ar' ? 0 : 'var(--space-6)', paddingLeft: lang === 'ar' ? 'var(--space-6)' : 0, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <div style={s.label}>{t('attendanceSettings.autoDeduct')}</div>
                            <div style={s.hint}>{t('attendanceSettings.autoDeductHint')}</div>
                        </div>
                        <div style={{ ...s.rowAction as React.CSSProperties, justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
                            <Switch checked={config.autoDeduct} onChange={(val) => handleChange('autoDeduct', val)} />
                        </div>
                    </div>

                    {config.autoDeduct && (
                        <div style={{ ...s.deductionBox as React.CSSProperties, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                                <Select
                                    label={t('attendanceSettings.deductType')}
                                    value={config.deductionType}
                                    onChange={(e) => handleChange('deductionType', e.target.value)}
                                    options={[
                                        { label: t('attendanceSettings.typePercentage'), value: 'percentage' },
                                        { label: t('attendanceSettings.typeFixed'), value: 'fixed' }
                                    ]}
                                />
                                <Input
                                    label={t('attendanceSettings.deductValue')}
                                    type="number"
                                    value={config.deductionValue}
                                    onChange={(e) => handleChange('deductionValue', e.target.value)}
                                    hint={config.deductionType === 'percentage' ? t('attendanceSettings.valueHintPct') : t('attendanceSettings.valueHintFixed')}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ ...s.row, borderBottom: 'none', paddingTop: config.autoDeduct ? 'var(--space-6)' : 'var(--space-4)', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                        <div style={{ ...s.rowContent as React.CSSProperties, paddingRight: lang === 'ar' ? 0 : 'var(--space-6)', paddingLeft: lang === 'ar' ? 'var(--space-6)' : 0, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <div style={s.label}>{t('attendanceSettings.notifyAbsence')}</div>
                            <div style={s.hint}>{t('attendanceSettings.notifyAbsenceHint')}</div>
                        </div>
                        <div style={{ ...s.rowAction as React.CSSProperties, justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
                            <Switch checked={config.notifyManager} onChange={(val) => handleChange('notifyManager', val)} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />
                        {isSaving ? t('attendanceSettings.saving') : t('attendanceSettings.saveSettings')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
