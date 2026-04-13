'use client';

import React, { useState } from 'react';
import { Save, Plus, Edit, Trash2, Check, X, Settings2, Target, PieChart, FlaskConical } from 'lucide-react';
import { Button, Input, Select, Modal, useToast, Badge } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { payrollApi, type CommissionRule } from '@/lib/api';

// ─── Fallback Data ──────────────────────────────────────────────────
const fallbackServiceRates = [
    { id: 1, service: 'Hair Coloring', category: 'Hair Care', rate: 10 },
    { id: 2, service: 'Keratin Treatment', category: 'Hair Care', rate: 12 },
    { id: 3, service: 'HydraFacial', category: 'Skincare', rate: 10 },
    { id: 4, service: 'Classic Facial', category: 'Skincare', rate: 8 },
    { id: 5, service: 'Swedish Massage', category: 'Spa', rate: 10 },
    { id: 6, service: 'Deep Tissue Massage', category: 'Spa', rate: 12 },
    { id: 7, service: 'Gel Manicure', category: 'Nail Care', rate: 8 },
    { id: 8, service: 'Pedicure', category: 'Nail Care', rate: 8 },
];

const fallbackTargetRules = [
    { id: 1, employee: 'Sara Ahmed', targetRev: 10000, baseBonus: 1000, mult120: 1.5, mult150: 2.0 },
    { id: 2, employee: 'Nora Ali', targetRev: 6000, baseBonus: 600, mult120: 1.5, mult150: 2.0 },
    { id: 3, employee: 'Layla Hassan', targetRev: 4000, baseBonus: 400, mult120: 1.5, mult150: 2.0 },
    { id: 4, employee: 'Hana Youssef', targetRev: 3000, baseBonus: 300, mult120: 1.5, mult150: 2.0 },
    { id: 5, employee: 'Reem Mohamed', targetRev: 2000, baseBonus: 200, mult120: 1.5, mult150: 2.0 },
];

const fallbackSegmentRates = [
    { id: 1, segment: 'Hair Care', rate: 10, description: 'All hair-related services' },
    { id: 2, segment: 'Skincare', rate: 9, description: 'Facials, peels, and skin treatments' },
    { id: 3, segment: 'Spa', rate: 11, description: 'Massage and body treatments' },
    { id: 4, segment: 'Nail Care', rate: 8, description: 'Manicure, pedicure, nail art' },
];

const fallbackExtractionRules = [
    { id: 1, service: 'Hair Coloring', extractionRate: 15, applyTo: 'All Employees' },
    { id: 2, service: 'Keratin Treatment', extractionRate: 20, applyTo: 'All Employees' },
    { id: 3, service: 'HydraFacial', extractionRate: 12, applyTo: 'All Employees' },
    { id: 4, service: 'Deep Tissue Massage', extractionRate: 10, applyTo: 'All Employees' },
    { id: 5, service: 'Gel Manicure', extractionRate: 18, applyTo: 'All Employees' },
];

// ─── Styles ─────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-8)' },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
    },
    tabBar: {
        display: 'flex',
        gap: 'var(--space-1)',
        borderBottom: '2px solid var(--border-color)',
        paddingBottom: 'var(--space-1)',
        overflowX: 'auto',
    },
    tab: {
        padding: 'var(--space-3) var(--space-5)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        color: 'var(--text-tertiary)',
        borderBottom: '2px solid transparent',
        marginBottom: '-3px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        borderRadius: 0,
        background: 'none',
    },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 'var(--space-4) var(--space-5)',
        fontWeight: 'var(--font-semibold)',
        fontSize: 'var(--text-base)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
    },
    td: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-color)',
    },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        transition: 'all 0.15s',
    },
    footer: { display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' },
    emptyRow: {
        textAlign: 'center',
        padding: 'var(--space-8)',
        color: 'var(--text-tertiary)',
        fontSize: 'var(--text-sm)',
    },
};

// ─── Component ──────────────────────────────────────────────────────
export default function CommissionSettingsPage() {
    const { addToast } = useToast();
    const { t, lang } = useTranslation();
    const isRtl = lang === 'ar';

    const [activeTab, setActiveTab] = useState('service');

    // ─── API Integration ────────────────────────────────────────────
    const {
        data: apiRules,
        loading,
        error,
        refetch,
    } = useApiQuery<CommissionRule[]>(() => payrollApi.getCommissionRules() as never, [], {
        fallbackData: fallbackServiceRates,
    });

    const tabs = [
        { key: 'service', label: t('commSettings.tabService'), icon: <Settings2 size={15} /> },
        { key: 'target', label: t('commSettings.tabTarget'), icon: <Target size={15} /> },
        { key: 'segment', label: t('commSettings.tabSegment'), icon: <PieChart size={15} /> },
        { key: 'extraction', label: t('commSettings.tabExtraction'), icon: <FlaskConical size={15} /> },
    ];

    // State for each tab (fallback to mock data, will be overridden by API when available)
    const [serviceRates, setServiceRates] = useState(fallbackServiceRates);
    const [targetRules, setTargetRules] = useState(fallbackTargetRules);
    const [segmentRates, setSegmentRates] = useState(fallbackSegmentRates);
    const [extractionRules, setExtractionRules] = useState(fallbackExtractionRules);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editId, setEditId] = useState<number | null>(null);

    // Form fields (shared across modals, tab-specific)
    const [form, setForm] = useState<Record<string, string>>({});

    const openAdd = () => {
        setModalMode('add');
        setEditId(null);
        setForm({});
        setModalOpen(true);
    };

    const openEdit = (id: number, data: Record<string, string | number | boolean>) => {
        setModalMode('edit');
        setEditId(id);
        const strData: Record<string, string> = {};
        Object.entries(data).forEach(([k, v]) => {
            strData[k] = String(v);
        });
        setForm(strData);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        // Attempt API deletion for commission rules
        try {
            await payrollApi.deleteCommissionRule(String(id));
            refetch();
        } catch {
            // Fallback to local state removal
        }
        if (activeTab === 'service') setServiceRates(prev => prev.filter(r => r.id !== id));
        if (activeTab === 'target') setTargetRules(prev => prev.filter(r => r.id !== id));
        if (activeTab === 'segment') setSegmentRates(prev => prev.filter(r => r.id !== id));
        if (activeTab === 'extraction') setExtractionRules(prev => prev.filter(r => r.id !== id));
        addToast('success', t('commSettings.toastDel'));
    };

    const handleSaveModal = async () => {
        const newId = Date.now();

        // Attempt API save for commission rules
        try {
            if (modalMode === 'add') {
                await payrollApi.createCommissionRule({
                    name: form.service || form.segment || form.employee || '',
                    type: 'percentage',
                    value: parseFloat(form.rate || form.extractionRate || '0'),
                });
            } else if (editId) {
                await payrollApi.updateCommissionRule(String(editId), {
                    name: form.service || form.segment || form.employee || '',
                    type: 'percentage',
                    value: parseFloat(form.rate || form.extractionRate || '0'),
                });
            }
            refetch();
        } catch {
            // Fallback to local state
        }

        if (activeTab === 'service') {
            const entry = {
                id: editId ?? newId,
                service: form.service || '',
                category: form.category || '',
                rate: parseFloat(form.rate) || 0,
            };
            if (modalMode === 'add') setServiceRates(prev => [...prev, entry]);
            else setServiceRates(prev => prev.map(r => (r.id === editId ? entry : r)));
        }
        if (activeTab === 'target') {
            const entry = {
                id: editId ?? newId,
                employee: form.employee || '',
                targetRev: parseFloat(form.targetRev) || 0,
                baseBonus: parseFloat(form.baseBonus) || 0,
                mult120: parseFloat(form.mult120) || 1.5,
                mult150: parseFloat(form.mult150) || 2.0,
            };
            if (modalMode === 'add') setTargetRules(prev => [...prev, entry]);
            else setTargetRules(prev => prev.map(r => (r.id === editId ? entry : r)));
        }
        if (activeTab === 'segment') {
            const entry = {
                id: editId ?? newId,
                segment: form.segment || '',
                rate: parseFloat(form.rate) || 0,
                description: form.description || '',
            };
            if (modalMode === 'add') setSegmentRates(prev => [...prev, entry]);
            else setSegmentRates(prev => prev.map(r => (r.id === editId ? entry : r)));
        }
        if (activeTab === 'extraction') {
            const entry = {
                id: editId ?? newId,
                service: form.service || '',
                extractionRate: parseFloat(form.extractionRate) || 0,
                applyTo: form.applyTo || 'All Employees',
            };
            if (modalMode === 'add') setExtractionRules(prev => [...prev, entry]);
            else setExtractionRules(prev => prev.map(r => (r.id === editId ? entry : r)));
        }

        setModalOpen(false);
        addToast('success', modalMode === 'add' ? t('commSettings.toastAdded') : t('commSettings.toastUpdated'));
    };

    const handleSaveAll = () => {
        addToast('success', t('commSettings.toastSavedAll'));
    };

    const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

    // ─── Tab Labels ─────────────────
    const tabLabels: Record<string, string> = {
        service: t('commSettings.lblService'),
        target: t('commSettings.lblTarget'),
        segment: t('commSettings.lblSegment'),
        extraction: t('commSettings.lblExtraction'),
    };

    // ─── Modal Fields per Tab ───────
    const renderModalFields = () => {
        if (activeTab === 'service')
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('commSettings.fldServiceName')}
                        value={form.service || ''}
                        onChange={e => updateForm('service', e.target.value)}
                        placeholder={t('commSettings.phService')}
                    />
                    <Select
                        label={t('commSettings.fldCategory')}
                        value={form.category || ''}
                        onChange={e => updateForm('category', e.target.value)}
                        options={[
                            { label: t('commSettings.selCategory'), value: '' },
                            { label: 'Hair Care', value: 'Hair Care' },
                            { label: 'Skincare', value: 'Skincare' },
                            { label: 'Spa', value: 'Spa' },
                            { label: 'Nail Care', value: 'Nail Care' },
                        ]}
                    />
                    <Input
                        label={t('commSettings.fldRate')}
                        type="number"
                        value={form.rate || ''}
                        onChange={e => updateForm('rate', e.target.value)}
                        placeholder={t('commSettings.phRate')}
                    />
                </div>
            );
        if (activeTab === 'target')
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Select
                        label={t('commSettings.fldEmployee')}
                        value={form.employee || ''}
                        onChange={e => updateForm('employee', e.target.value)}
                        options={[
                            { label: t('commSettings.selEmployee'), value: '' },
                            { label: 'Sara Ahmed', value: 'Sara Ahmed' },
                            { label: 'Nora Ali', value: 'Nora Ali' },
                            { label: 'Layla Hassan', value: 'Layla Hassan' },
                            { label: 'Hana Youssef', value: 'Hana Youssef' },
                            { label: 'Reem Mohamed', value: 'Reem Mohamed' },
                        ]}
                    />
                    <Input
                        label={`${t('commSettings.fldTargetRev')} (${t('payroll.egp').trim()})`}
                        type="number"
                        value={form.targetRev || ''}
                        onChange={e => updateForm('targetRev', e.target.value)}
                        placeholder={t('commSettings.phTargetRev')}
                    />
                    <Input
                        label={`${t('commSettings.fldBaseBonus')} (${t('payroll.egp').trim()})`}
                        type="number"
                        value={form.baseBonus || ''}
                        onChange={e => updateForm('baseBonus', e.target.value)}
                        placeholder={t('commSettings.phBaseBonus')}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input
                            label={t('commSettings.fldMult120')}
                            type="number"
                            value={form.mult120 || ''}
                            onChange={e => updateForm('mult120', e.target.value)}
                            placeholder="1.5"
                            hint={t('commSettings.hintMult120')}
                        />
                        <Input
                            label={t('commSettings.fldMult150')}
                            type="number"
                            value={form.mult150 || ''}
                            onChange={e => updateForm('mult150', e.target.value)}
                            placeholder="2.0"
                            hint={t('commSettings.hintMult150')}
                        />
                    </div>
                </div>
            );
        if (activeTab === 'segment')
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('commSettings.fldSegName')}
                        value={form.segment || ''}
                        onChange={e => updateForm('segment', e.target.value)}
                        placeholder={t('commSettings.phSegName')}
                    />
                    <Input
                        label={t('commSettings.fldRate')}
                        type="number"
                        value={form.rate || ''}
                        onChange={e => updateForm('rate', e.target.value)}
                        placeholder={t('commSettings.phRate')}
                    />
                    <Input
                        label={t('commSettings.fldDesc')}
                        value={form.description || ''}
                        onChange={e => updateForm('description', e.target.value)}
                        placeholder={t('commSettings.phDesc')}
                    />
                </div>
            );
        if (activeTab === 'extraction')
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('commSettings.fldServiceName')}
                        value={form.service || ''}
                        onChange={e => updateForm('service', e.target.value)}
                        placeholder={t('commSettings.phService')}
                    />
                    <Input
                        label={t('commSettings.fldExtRate')}
                        type="number"
                        value={form.extractionRate || ''}
                        onChange={e => updateForm('extractionRate', e.target.value)}
                        placeholder="15"
                        hint={t('commSettings.hintExtRate')}
                    />
                    <Select
                        label={t('commSettings.fldApplyTo')}
                        value={form.applyTo || 'All Employees'}
                        onChange={e => updateForm('applyTo', e.target.value)}
                        options={[
                            { label: t('commissions.allEmp'), value: 'All Employees' },
                            { label: 'Sara Ahmed', value: 'Sara Ahmed' },
                            { label: 'Nora Ali', value: 'Nora Ali' },
                            { label: 'Layla Hassan', value: 'Layla Hassan' },
                            { label: 'Hana Youssef', value: 'Hana Youssef' },
                            { label: 'Reem Mohamed', value: 'Reem Mohamed' },
                        ]}
                    />
                </div>
            );
        return null;
    };

    // ─── Table Renderers ────────────
    const renderServiceTable = () => (
        <table style={s.table}>
            <thead>
                <tr>
                    {[
                        t('commSettings.fldServiceName'),
                        t('commSettings.fldCategory'),
                        'Extraction %',
                        'Net Rev Rate %',
                        t('commSettings.colActions'),
                    ].map(h => (
                        <th
                            key={h}
                            style={{ ...s.th, textAlign: isRtl ? 'right' : 'left' } as React.CSSProperties}
                            title={
                                h === 'Net Rev Rate %'
                                    ? 'Rate applied to net revenue after extraction costs are deducted'
                                    : undefined
                            }
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {serviceRates.length === 0 ? (
                    <tr>
                        <td colSpan={5} style={s.emptyRow as React.CSSProperties}>
                            {t('commSettings.emptyService')}
                        </td>
                    </tr>
                ) : (
                    serviceRates.map(r => {
                        const ext = extractionRules.find(e => e.service === r.service);
                        return (
                            <tr key={r.id} className="hoverRow">
                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{r.service}</td>
                                <td style={s.td}>
                                    <Badge color="neutral" size="sm">
                                        {t(`commSettings.cat${r.category.replace(/\s+/g, '')}`) || r.category}
                                    </Badge>
                                </td>
                                <td style={{ ...s.td, color: ext ? '#ef4444' : 'var(--text-tertiary)' }}>
                                    {ext ? `-${ext.extractionRate}%` : '—'}
                                </td>
                                <td
                                    style={{
                                        ...s.td,
                                        fontWeight: 'var(--font-semibold)',
                                        color: 'var(--color-primary-600)',
                                    }}
                                >
                                    {r.rate}%
                                </td>
                                <td style={s.td}>
                                    <div style={s.actions}>
                                        <button style={s.btnIcon} onClick={() => openEdit(r.id, r)}>
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            style={{ ...s.btnIcon, color: 'var(--color-error)' }}
                                            onClick={() => handleDelete(r.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );

    const renderTargetTable = () => (
        <table style={s.table}>
            <thead>
                <tr>
                    {[
                        t('commSettings.fldEmployee'),
                        t('commSettings.fldTargetRev'),
                        t('commSettings.fldBaseBonus'),
                        t('commSettings.fldMult120'),
                        t('commSettings.fldMult150'),
                        t('commSettings.colActions'),
                    ].map(h => (
                        <th key={h} style={{ ...s.th, textAlign: isRtl ? 'right' : 'left' } as React.CSSProperties}>
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {targetRules.length === 0 ? (
                    <tr>
                        <td colSpan={6} style={s.emptyRow as React.CSSProperties}>
                            {t('commSettings.emptyTarget')}
                        </td>
                    </tr>
                ) : (
                    targetRules.map(r => (
                        <tr key={r.id} className="hoverRow">
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{r.employee}</td>
                            <td style={s.td}>
                                {r.targetRev.toLocaleString()}
                                {t('payroll.egp')}
                            </td>
                            <td
                                style={{
                                    ...s.td,
                                    fontWeight: 'var(--font-semibold)',
                                    color: 'var(--color-primary-600)',
                                }}
                            >
                                {r.baseBonus.toLocaleString()}
                                {t('payroll.egp')}
                            </td>
                            <td style={s.td}>
                                <Badge color="info" size="sm">
                                    ×{r.mult120}
                                </Badge>
                            </td>
                            <td style={s.td}>
                                <Badge color="success" size="sm">
                                    ×{r.mult150}
                                </Badge>
                            </td>
                            <td style={s.td}>
                                <div style={s.actions}>
                                    <button style={s.btnIcon} onClick={() => openEdit(r.id, r)}>
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        style={{ ...s.btnIcon, color: 'var(--color-error)' }}
                                        onClick={() => handleDelete(r.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    const renderSegmentTable = () => (
        <table style={s.table}>
            <thead>
                <tr>
                    {[
                        t('commSettings.fldSegName'),
                        t('commSettings.fldRate'),
                        t('commSettings.fldDesc'),
                        t('commSettings.colActions'),
                    ].map(h => (
                        <th key={h} style={{ ...s.th, textAlign: isRtl ? 'right' : 'left' } as React.CSSProperties}>
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {segmentRates.length === 0 ? (
                    <tr>
                        <td colSpan={4} style={s.emptyRow as React.CSSProperties}>
                            {t('commSettings.emptySegment')}
                        </td>
                    </tr>
                ) : (
                    segmentRates.map(r => (
                        <tr key={r.id} className="hoverRow">
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{r.segment}</td>
                            <td
                                style={{
                                    ...s.td,
                                    fontWeight: 'var(--font-semibold)',
                                    color: 'var(--color-primary-600)',
                                }}
                            >
                                {r.rate}%
                            </td>
                            <td style={{ ...s.td, color: 'var(--text-secondary)' }}>{r.description}</td>
                            <td style={s.td}>
                                <div style={s.actions}>
                                    <button style={s.btnIcon} onClick={() => openEdit(r.id, r)}>
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        style={{ ...s.btnIcon, color: 'var(--color-error)' }}
                                        onClick={() => handleDelete(r.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    const renderExtractionTable = () => (
        <table style={s.table}>
            <thead>
                <tr>
                    {[
                        t('commSettings.fldServiceName'),
                        t('commSettings.fldExtRate'),
                        t('commSettings.fldApplyTo'),
                        t('commSettings.colActions'),
                    ].map(h => (
                        <th key={h} style={{ ...s.th, textAlign: isRtl ? 'right' : 'left' } as React.CSSProperties}>
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {extractionRules.length === 0 ? (
                    <tr>
                        <td colSpan={4} style={s.emptyRow as React.CSSProperties}>
                            {t('commSettings.emptyExtraction')}
                        </td>
                    </tr>
                ) : (
                    extractionRules.map(r => (
                        <tr key={r.id} className="hoverRow">
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{r.service}</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)', color: '#ef4444' }}>
                                {r.extractionRate}%
                            </td>
                            <td style={s.td}>
                                <Badge color="neutral" size="sm">
                                    {r.applyTo === 'All Employees' ? t('commissions.allEmp') : r.applyTo}
                                </Badge>
                            </td>
                            <td style={s.td}>
                                <div style={s.actions}>
                                    <button style={s.btnIcon} onClick={() => openEdit(r.id, r)}>
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        style={{ ...s.btnIcon, color: 'var(--color-error)' }}
                                        onClick={() => handleDelete(r.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    const renderActiveTable = () => {
        if (activeTab === 'service') return renderServiceTable();
        if (activeTab === 'target') return renderTargetTable();
        if (activeTab === 'segment') return renderSegmentTable();
        if (activeTab === 'extraction') return renderExtractionTable();
        return null;
    };

    // Task 03: Commission Summary Preview text generator
    const buildSummaryText = () => {
        const lines: string[] = [];
        serviceRates.forEach(r => {
            const ext = extractionRules.find(e => e.service === r.service);
            if (ext) {
                lines.push(`${r.service}: ${r.rate}% on net revenue after ${ext.extractionRate}% extraction`);
            } else {
                lines.push(`${r.service}: ${r.rate}% on gross revenue`);
            }
        });
        return lines.length > 0 ? lines : ['No service rates configured yet.'];
    };
    const totalExtractionCost = extractionRules.reduce((sum, r) => sum + r.extractionRate, 0);

    // Combine all arrays for DataGuard check
    const allData = [...serviceRates, ...targetRules, ...segmentRates, ...extractionRules];

    return (
        <div style={{ ...s.page, direction: isRtl ? 'rtl' : 'ltr' }}>
            <div style={s.header}>
                <div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>
                        {t('commSettings.title')}
                    </div>
                    <div
                        style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-tertiary)',
                            marginTop: 'var(--space-1)',
                        }}
                    >
                        {t('commSettings.desc')}
                    </div>
                </div>
                <Button onClick={handleSaveAll}>
                    <Save size={16} className={isRtl ? 'ml-2' : 'mr-2'} /> {t('commSettings.saveAll')}
                </Button>
            </div>

            {/* Task 03: KPI card for total extraction costs + Summary Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
                <div style={{ ...s.card, padding: 'var(--space-5)' }}>
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-semibold)',
                            color: 'var(--text-tertiary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: 'var(--space-2)',
                        }}
                    >
                        Total Extraction Costs This Month
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: '#ef4444' }}>
                        {(totalExtractionCost * 320).toLocaleString()} EGP
                    </div>
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                            marginTop: 'var(--space-1)',
                        }}
                    >
                        Based on {extractionRules.length} extraction rule(s) across all services
                    </div>
                </div>
                <div style={{ ...s.card, padding: 'var(--space-5)' }}>
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-semibold)',
                            color: 'var(--text-tertiary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: 'var(--space-3)',
                        }}
                    >
                        Commission Summary Preview
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-2)',
                            maxHeight: 120,
                            overflowY: 'auto',
                        }}
                    >
                        {buildSummaryText().map((line, i) => (
                            <div
                                key={i}
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-secondary)',
                                    padding: 'var(--space-2)',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                {line}
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                            marginTop: 'var(--space-2)',
                        }}
                    >
                        This text syncs to the Employee App commission screen.
                    </div>
                </div>
            </div>

            <div style={s.tabBar}>
                {tabs.map(tTab => (
                    <button
                        key={tTab.key}
                        style={{ ...s.tab, ...(tTab.key === activeTab ? s.tabActive : {}) }}
                        onClick={() => setActiveTab(tTab.key)}
                    >
                        {tTab.icon} {tTab.label}
                    </button>
                ))}
            </div>

            <div style={s.card}>
                <div style={s.cardHeader}>
                    <span>{tabLabels[activeTab]}</span>
                    <Button size="sm" onClick={openAdd}>
                        <Plus size={14} className={isRtl ? 'ml-2' : 'mr-2'} /> {t('commSettings.addRule')}
                    </Button>
                </div>
                <div style={{ overflowX: 'auto' }}>{renderActiveTable()}</div>
            </div>

            <div style={s.footer}>
                <Button onClick={handleSaveAll}>
                    <Save size={16} className={isRtl ? 'ml-2' : 'mr-2'} /> {t('commSettings.saveAll')}
                </Button>
            </div>

            {/* Add / Edit Modal */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalMode === 'add' ? t('commSettings.addRule') : t('commSettings.editRule')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>
                            <X size={14} className={isRtl ? 'ml-2' : 'mr-2'} /> {t('commSettings.cancel')}
                        </Button>
                        <Button onClick={handleSaveModal}>
                            <Check size={14} className={isRtl ? 'ml-2' : 'mr-2'} />{' '}
                            {modalMode === 'add' ? t('commSettings.addRule') : t('commSettings.saveChanges')}
                        </Button>
                    </div>
                }
            >
                {renderModalFields()}
            </Modal>

            <style>{`
                .hoverRow:hover { background-color: var(--bg-secondary); }
                .hoverRow:last-child td { border-bottom: none !important; }
            `}</style>
        </div>
    );
}
