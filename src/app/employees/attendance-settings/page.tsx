'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Switch, Input, Select, Button, useToast } from '@/components/ui';

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

    const handleChange = (key: keyof typeof config, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            addToast('success', 'Attendance settings saved successfully.');
        }, 600);
    };

    return (
        <div style={s.page}>
            <div style={s.title}>Attendance Settings</div>

            <div style={s.card}>
                <div style={s.section}>
                    <div style={s.sectionTitle}>Work Hours</div>
                    <div style={s.row}>
                        <div style={s.rowContent}>
                            <div style={s.label}>Standard Work Hours</div>
                            <div style={s.hint}>Daily required working hours for employees.</div>
                        </div>
                        <div style={s.rowAction}>
                            <div style={s.inputGroup}>
                                <Input type="number" value={config.standardHours} onChange={(e) => handleChange('standardHours', e.target.value)} style={{ width: 80, textAlign: 'center', margin: 0 }} />
                                <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>hrs</span>
                            </div>
                        </div>
                    </div>

                    <div style={s.row}>
                        <div style={s.rowContent}>
                            <div style={s.label}>Shift Details</div>
                            <div style={s.hint}>Default start and end times for the standard shift.</div>
                        </div>
                        <div style={s.rowAction}>
                            <Input type="time" value={config.shiftStart} onChange={(e) => handleChange('shiftStart', e.target.value)} style={{ width: 110, margin: 0 }} />
                            <span style={{ color: 'var(--text-tertiary)' }}>to</span>
                            <Input type="time" value={config.shiftEnd} onChange={(e) => handleChange('shiftEnd', e.target.value)} style={{ width: 110, margin: 0 }} />
                        </div>
                    </div>
                </div>

                <div style={s.section}>
                    <div style={s.sectionTitle}>Grace Periods</div>
                    <div style={s.row}>
                        <div style={s.rowContent}>
                            <div style={s.label}>Late Arrival Grace</div>
                            <div style={s.hint}>Minutes after shift start before an employee is marked as 'Late'.</div>
                        </div>
                        <div style={s.rowAction}>
                            <div style={s.inputGroup}>
                                <Input type="number" value={config.lateGrace} onChange={(e) => handleChange('lateGrace', e.target.value)} style={{ width: 80, textAlign: 'center', margin: 0 }} />
                                <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>min</span>
                            </div>
                        </div>
                    </div>

                    <div style={s.row}>
                        <div style={s.rowContent}>
                            <div style={s.label}>Early Leave Grace</div>
                            <div style={s.hint}>Minutes allowed to leave before shift end without penalty.</div>
                        </div>
                        <div style={s.rowAction}>
                            <div style={s.inputGroup}>
                                <Input type="number" value={config.earlyGrace} onChange={(e) => handleChange('earlyGrace', e.target.value)} style={{ width: 80, textAlign: 'center', margin: 0 }} />
                                <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>min</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={s.section}>
                    <div style={s.sectionTitle}>Penalties & Deductions</div>

                    <div style={{ ...s.row, borderBottom: config.autoDeduct ? 'none' : '1px dashed var(--border-color)', paddingBottom: config.autoDeduct ? 0 : 'var(--space-4)' }}>
                        <div style={s.rowContent}>
                            <div style={s.label}>Auto-deduct Late Penalty</div>
                            <div style={s.hint}>Automatically apply a salary deduction when an employee triggers a late arrival.</div>
                        </div>
                        <div style={s.rowAction}>
                            <Switch checked={config.autoDeduct} onChange={(val) => handleChange('autoDeduct', val)} />
                        </div>
                    </div>

                    {config.autoDeduct && (
                        <div style={s.deductionBox}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                <Select
                                    label="Deduction Type"
                                    value={config.deductionType}
                                    onChange={(e) => handleChange('deductionType', e.target.value)}
                                    options={[
                                        { label: 'Percentage of Daily Wage', value: 'percentage' },
                                        { label: 'Fixed Amount', value: 'fixed' }
                                    ]}
                                />
                                <Input
                                    label={`Deduction Value (${config.deductionType === 'percentage' ? '%' : 'Currency'})`}
                                    type="number"
                                    value={config.deductionValue}
                                    onChange={(e) => handleChange('deductionValue', e.target.value)}
                                    hint={config.deductionType === 'percentage' ? "e.g. 5 means 5% of their daily wage is deducted." : "e.g. 50 means $50 fixed deduction."}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ ...s.row, borderBottom: 'none', paddingTop: config.autoDeduct ? 'var(--space-6)' : 'var(--space-4)' }}>
                        <div style={s.rowContent}>
                            <div style={s.label}>Notify Manager on Absence</div>
                            <div style={s.hint}>Send an instant push notification to branch managers when an absence occurs.</div>
                        </div>
                        <div style={s.rowAction}>
                            <Switch checked={config.notifyManager} onChange={(val) => handleChange('notifyManager', val)} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save size={16} style={{ marginRight: 8 }} />
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
