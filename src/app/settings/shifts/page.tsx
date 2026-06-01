'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, Coffee, Layers } from 'lucide-react';
import { Button, Badge, Modal, Input, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { SHIFT_TEMPLATES, SHIFT_ASSIGNMENTS, type ShiftTemplate, generateId } from '@/lib/shiftData';
import { providerApi, type ShiftTemplate as ApiShiftTemplate } from '@/lib/api';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
    page: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        animation: 'fadeIn var(--transition-normal) ease-out',
        maxWidth: 1000,
        margin: '0 auto',
        width: '100%',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
    },
    title: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    subtitle: { color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 4 },
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
    },
    tableWrapper: { width: '100%', overflow: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
        padding: 'var(--space-3) var(--space-5)',
        textAlign: 'left',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
    },
    td: {
        padding: 'var(--space-3) var(--space-5)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-color)',
    },
    swatch: {
        width: 24,
        height: 24,
        borderRadius: 'var(--radius-md)',
        display: 'inline-block',
        border: '2px solid var(--border-color)',
    },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    formGrid: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
    timeRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' },
    breakBox: {
        padding: 'var(--space-3)',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
    },
    breakLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--color-warning-600)',
    },
    colorRow: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
    colorOption: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        cursor: 'pointer',
        border: '3px solid transparent',
        transition: 'border-color 0.15s',
    },
    asnRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) var(--space-5)',
        borderBottom: '1px solid var(--border-color)',
    },
    asnInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
    asnLabel: { fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    asnSub: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    asnDays: { display: 'flex', gap: 'var(--space-1)', marginTop: 4 },
    empty: {
        padding: 'var(--space-6)',
        textAlign: 'center',
        color: 'var(--text-tertiary)',
        fontSize: 'var(--text-sm)',
    },
};

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#6366f1', '#14b8a6'];

function mapApiShiftTemplate(t: ApiShiftTemplate, index: number): ShiftTemplate {
    return {
        id: t.uuid,
        name: t.name,
        color: COLORS[index % COLORS.length], // GAP: API has no color field
        start: t.start_time?.slice(0, 5) || '09:00',
        end: t.end_time?.slice(0, 5) || '17:00',
        breakStart: t.break_start?.slice(0, 5) || '13:00',
        breakEnd: t.break_end?.slice(0, 5) || '13:30',
    };
}

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function ShiftTemplatesPage() {
    const { t, lang } = useTranslation();
    const { addToast } = useToast();

    const [templates, setTemplates] = useState<ShiftTemplate[]>(SHIFT_TEMPLATES);
    const [apiLoaded, setApiLoaded] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ShiftTemplate | null>(null);
    const [form, setForm] = useState({
        name: '',
        color: COLORS[0],
        start: '09:00',
        end: '17:00',
        breakStart: '13:00',
        breakEnd: '13:30',
    });

    const [assignments, setAssignments] = useState([...SHIFT_ASSIGNMENTS]);

    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await providerApi.getShiftTemplates();
                if (!cancelled && res.success && res.data) {
                    const mapped = res.data.map((st, i) => mapApiShiftTemplate(st, i));
                    setTemplates(mapped);
                    SHIFT_TEMPLATES.length = 0;
                    SHIFT_TEMPLATES.push(...mapped);
                    setApiLoaded(true);
                }
            } catch {
                // Keep fallback data
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [refreshKey]);

    const openAdd = () => {
        setEditingId(null);
        setForm({ name: '', color: COLORS[0], start: '09:00', end: '17:00', breakStart: '13:00', breakEnd: '13:30' });
        setIsFormOpen(true);
    };

    const openEdit = (tpl: ShiftTemplate) => {
        setEditingId(tpl.id);
        setForm({
            name: tpl.name,
            color: tpl.color,
            start: tpl.start,
            end: tpl.end,
            breakStart: tpl.breakStart,
            breakEnd: tpl.breakEnd,
        });
        setIsFormOpen(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) return;

        if (apiLoaded) {
            const payload: Record<string, unknown> = {
                name: form.name,
                start_time: form.start,
                end_time: form.end,
                break_start: form.breakStart,
                break_end: form.breakEnd,
            };
            try {
                if (editingId) {
                    await providerApi.updateShiftTemplate(editingId, payload);
                    addToast('success', t('shifts.templateUpdated'));
                } else {
                    await providerApi.createShiftTemplate(payload);
                    addToast('success', t('shifts.templateAdded'));
                }
                setIsFormOpen(false);
                setRefreshKey(k => k + 1);
                return;
            } catch (err: unknown) {
                const error = err as { message?: string };
                addToast('error', error.message || t('shifts.saveFailed'));
                return;
            }
        }

        if (editingId) {
            const updated = templates.map(t => (t.id === editingId ? { ...t, ...form } : t));
            setTemplates(updated);
            SHIFT_TEMPLATES.length = 0;
            SHIFT_TEMPLATES.push(...updated);
            addToast('success', t('shifts.templateUpdated'));
        } else {
            const newTpl: ShiftTemplate = { id: generateId('TPL'), ...form };
            const updated = [...templates, newTpl];
            setTemplates(updated);
            SHIFT_TEMPLATES.length = 0;
            SHIFT_TEMPLATES.push(...updated);
            addToast('success', t('shifts.templateAdded'));
        }
        setIsFormOpen(false);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        if (apiLoaded) {
            try {
                await providerApi.deleteShiftTemplate(deleteTarget.id);
                addToast('success', t('shifts.templateDeleted'));
                setIsDeleteOpen(false);
                setDeleteTarget(null);
                setRefreshKey(k => k + 1);
                return;
            } catch (err: unknown) {
                const error = err as { message?: string };
                addToast('error', error.message || t('shifts.deleteFailed'));
                setIsDeleteOpen(false);
                setDeleteTarget(null);
                return;
            }
        }

        const updated = templates.filter(t => t.id !== deleteTarget.id);
        setTemplates(updated);
        SHIFT_TEMPLATES.length = 0;
        SHIFT_TEMPLATES.push(...updated);
        const remaining = SHIFT_ASSIGNMENTS.filter(a => a.templateId !== deleteTarget.id);
        SHIFT_ASSIGNMENTS.length = 0;
        SHIFT_ASSIGNMENTS.push(...remaining);
        setAssignments([...remaining]);
        setIsDeleteOpen(false);
        setDeleteTarget(null);
        addToast('success', t('shifts.templateDeleted'));
    };

    const getTemplateName = (id: string) => templates.find(t => t.id === id)?.name ?? '—';
    const getTemplateColor = (id: string) => templates.find(t => t.id === id)?.color ?? '#888';

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Header */}
            <div style={s.header}>
                <div>
                    <div style={s.title}>{t('shifts.title')}</div>
                    <div style={s.subtitle}>{t('shifts.subtitle')}</div>
                </div>
                <Button onClick={openAdd}>
                    <Plus size={16} /> {t('shifts.addTemplate')}
                </Button>
            </div>

            {/* Templates Table */}
            <div style={s.card}>
                <div style={s.cardHeader}>
                    <span style={s.cardTitle}>
                        <Clock size={18} /> {t('shifts.title')}
                    </span>
                    <Badge color="neutral" size="sm">
                        {templates.length}
                    </Badge>
                </div>
                <div style={s.tableWrapper}>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>{t('shifts.colColor')}</th>
                                <th style={s.th}>{t('shifts.colName')}</th>
                                <th style={s.th}>{t('shifts.colHours')}</th>
                                <th style={s.th}>{t('shifts.colBreak')}</th>
                                <th style={{ ...s.th, textAlign: 'right' } as React.CSSProperties}>
                                    {t('shifts.colActions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {templates.map(tpl => (
                                <tr
                                    key={tpl.id}
                                    style={{ transition: 'background 0.15s' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                                >
                                    <td style={s.td}>
                                        <div style={{ ...s.swatch, background: tpl.color }} />
                                    </td>
                                    <td style={s.td}>
                                        <span style={{ fontWeight: 'var(--font-medium)' }}>{tpl.name}</span>
                                    </td>
                                    <td style={s.td}>
                                        {tpl.start} → {tpl.end}
                                    </td>
                                    <td style={s.td}>
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 4,
                                                color: 'var(--color-warning-600)',
                                            }}
                                        >
                                            <Coffee size={12} /> {tpl.breakStart}–{tpl.breakEnd}
                                        </span>
                                    </td>
                                    <td style={{ ...s.td, textAlign: 'right' }}>
                                        <div style={{ ...s.actions, justifyContent: 'flex-end' }}>
                                            <Button variant="ghost" size="sm" onClick={() => openEdit(tpl)}>
                                                <Edit size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setDeleteTarget(tpl);
                                                    setIsDeleteOpen(true);
                                                }}
                                            >
                                                <Trash2 size={14} style={{ color: 'var(--color-error-500)' }} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Current Assignments (read-only overview) */}
            <div style={s.card}>
                <div style={s.cardHeader}>
                    <span style={s.cardTitle}>
                        <Layers size={18} /> {t('shifts.assignments')}
                    </span>
                    <Badge color="neutral" size="sm">
                        {assignments.length}
                    </Badge>
                </div>
                {assignments.length === 0 ? (
                    <div style={s.empty}>{t('shifts.noAssignments')}</div>
                ) : (
                    assignments.map(asn => (
                        <div key={asn.id} style={s.asnRow}>
                            <div style={s.asnInfo}>
                                <div style={s.asnLabel}>
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            background: getTemplateColor(asn.templateId),
                                            marginInlineEnd: 6,
                                        }}
                                    />
                                    {getTemplateName(asn.templateId)}
                                </div>
                                <div style={s.asnSub}>
                                    {asn.targetType === 'employee'
                                        ? t('shifts.employeeTarget')
                                        : t('shifts.roleTarget')}
                                    : {asn.targetId}
                                </div>
                                <div style={s.asnDays}>
                                    {asn.days.map(d => (
                                        <Badge key={d} color="neutral" size="sm">
                                            {d}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add / Edit Template Modal */}
            <Modal
                title={editingId ? t('shifts.editTemplate') : t('shifts.addTemplate')}
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsFormOpen(false)}>
                            {t('shifts.cancel')}
                        </Button>
                        <Button onClick={handleSave}>{t('shifts.save')}</Button>
                    </div>
                }
            >
                <div style={s.formGrid}>
                    <Input
                        label={t('shifts.templateName')}
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder={t('shifts.templateNamePh')}
                    />

                    {/* Color Picker */}
                    <div>
                        <div
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-medium)',
                                marginBottom: 'var(--space-2)',
                                color: 'var(--text-primary)',
                            }}
                        >
                            {t('shifts.color')}
                        </div>
                        <div style={s.colorRow}>
                            {COLORS.map(c => (
                                <div
                                    key={c}
                                    onClick={() => setForm({ ...form, color: c })}
                                    style={{
                                        ...s.colorOption,
                                        background: c,
                                        borderColor: form.color === c ? c : 'transparent',
                                        boxShadow:
                                            form.color === c ? `0 0 0 2px var(--bg-primary), 0 0 0 4px ${c}` : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Shift Times */}
                    <div style={s.timeRow}>
                        <Input
                            label={t('shifts.startTime')}
                            type="time"
                            value={form.start}
                            onChange={e => setForm({ ...form, start: e.target.value })}
                        />
                        <Input
                            label={t('shifts.endTime')}
                            type="time"
                            value={form.end}
                            onChange={e => setForm({ ...form, end: e.target.value })}
                        />
                    </div>

                    {/* Break Times */}
                    <div style={s.breakBox}>
                        <div style={s.breakLabel}>
                            <Coffee size={16} /> {t('schedule.breakTime')}
                        </div>
                        <div style={s.timeRow}>
                            <Input
                                label={t('shifts.breakStart')}
                                type="time"
                                value={form.breakStart}
                                onChange={e => setForm({ ...form, breakStart: e.target.value })}
                            />
                            <Input
                                label={t('shifts.breakEnd')}
                                type="time"
                                value={form.breakEnd}
                                onChange={e => setForm({ ...form, breakEnd: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal
                title={t('shifts.delete')}
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setDeleteTarget(null);
                }}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsDeleteOpen(false);
                                setDeleteTarget(null);
                            }}
                        >
                            {t('shifts.cancel')}
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            {t('shifts.delete')}
                        </Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    {t('shifts.deleteConfirm')}
                </p>
                {deleteTarget && (
                    <div
                        style={{
                            marginTop: 'var(--space-3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                        }}
                    >
                        <div style={{ ...s.swatch, background: deleteTarget.color }} />
                        <strong>{deleteTarget.name}</strong>
                        <span style={{ color: 'var(--text-tertiary)' }}>
                            ({deleteTarget.start} → {deleteTarget.end})
                        </span>
                    </div>
                )}
            </Modal>
        </div>
    );
}
