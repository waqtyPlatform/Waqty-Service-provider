'use client';

import React, { useState } from 'react';
import { Button, useToast, Input } from '@/components/ui';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function WorkingHoursPage() {
    const { addToast } = useToast();
    const { t, lang } = useTranslation();

    const DAYS = [
        t('settings.hours.monday'),
        t('settings.hours.tuesday'),
        t('settings.hours.wednesday'),
        t('settings.hours.thursday'),
        t('settings.hours.friday'),
        t('settings.hours.saturday'),
        t('settings.hours.sunday')
    ];

    const [hours, setHours] = useState(
        DAYS.map((day, ix) => ({
            day,
            isOpen: ix !== 6, // Sunday is closed
            openTime: '09:00',
            closeTime: '21:00',
            breaks: [] as { start: string, end: string }[]
        }))
    );

    const handleSave = () => {
        addToast('success', 'Working hours updated successfully');
    };

    const toggleDay = (index: number) => {
        const newHours = [...hours];
        newHours[index].isOpen = !newHours[index].isOpen;
        setHours(newHours);
    };

    const addBreak = (dayIndex: number) => {
        const newHours = [...hours];
        newHours[dayIndex].breaks.push({ start: '13:00', end: '14:00' });
        setHours(newHours);
    };

    const updateBreak = (dayIndex: number, breakIndex: number, field: 'start' | 'end', value: string) => {
        const newHours = [...hours];
        newHours[dayIndex].breaks[breakIndex][field] = value;
        setHours(newHours);
    };

    const removeBreak = (dayIndex: number, breakIndex: number) => {
        const newHours = [...hours];
        newHours[dayIndex].breaks.splice(breakIndex, 1);
        setHours(newHours);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{t('settings.hours.title')}</h1>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{t('settings.hours.desc')}</div>
                </div>
                <Button onClick={handleSave}>{t('settings.saveChanges')}</Button>
            </div>
<div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)' }}>{t('settings.hours.standardHours')}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {hours.map((h, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ width: 120, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <input type="checkbox" checked={h.isOpen} onChange={() => toggleDay(i)} />
                                <span style={{ fontWeight: 'var(--font-medium)' }}>{h.day}</span>
                            </div>

                            {h.isOpen ? (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <Input type="time" defaultValue={h.openTime} dir="ltr" />
                                        <span style={{ color: 'var(--text-tertiary)' }}>{t('settings.hours.to')}</span>
                                        <Input type="time" defaultValue={h.closeTime} dir="ltr" />
                                        <div style={{ marginInlineStart: 'auto' }}>
                                            <Button variant="ghost" size="sm" onClick={() => addBreak(i)}>
                                                <Plus size={14} style={{ marginInlineEnd: 8 }} /> {t('settings.hours.addBreak')}
                                            </Button>
                                        </div>
                                    </div>

                                    {h.breaks.length > 0 && (
                                        <div style={{ paddingInlineStart: 'var(--space-6)', borderInlineStart: '2px dashed var(--border-color)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                            {h.breaks.map((b, bIdx) => (
                                                <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', width: 60 }}>{`${t('settings.hours.break')} ${bIdx + 1}`}</span>
                                                    <Input type="time" value={b.start} onChange={(e) => updateBreak(i, bIdx, 'start', e.target.value)} dir="ltr" />
                                                    <span style={{ color: 'var(--text-tertiary)' }}>{t('settings.hours.to')}</span>
                                                    <Input type="time" value={b.end} onChange={(e) => updateBreak(i, bIdx, 'end', e.target.value)} dir="ltr" />
                                                    <Button variant="ghost" size="sm" iconOnly onClick={() => removeBreak(i, bIdx)}>
                                                        <Trash2 size={14} color="var(--color-error)" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ flex: 1, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{t('settings.hours.closed')}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
