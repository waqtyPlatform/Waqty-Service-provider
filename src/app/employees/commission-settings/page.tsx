'use client';

import React, { useState } from 'react';
import { Save, Plus, Edit, Trash2, Check, X, Settings2, Target, PieChart, FlaskConical } from 'lucide-react';
import { Button, Input, Select, Modal, useToast, Badge } from '@/components/ui';

// ─── Tab Definitions ────────────────────────────────────────────────
const tabs = [
    { key: 'service', label: 'By Service', icon: <Settings2 size={15} /> },
    { key: 'target', label: 'By Target', icon: <Target size={15} /> },
    { key: 'segment', label: 'By Segment', icon: <PieChart size={15} /> },
    { key: 'extraction', label: 'Extraction', icon: <FlaskConical size={15} /> },
];

// ─── Mock Data ──────────────────────────────────────────────────────
const initialServiceRates = [
    { id: 1, service: 'Hair Coloring', category: 'Hair Care', rate: 10 },
    { id: 2, service: 'Keratin Treatment', category: 'Hair Care', rate: 12 },
    { id: 3, service: 'HydraFacial', category: 'Skincare', rate: 10 },
    { id: 4, service: 'Classic Facial', category: 'Skincare', rate: 8 },
    { id: 5, service: 'Swedish Massage', category: 'Spa', rate: 10 },
    { id: 6, service: 'Deep Tissue Massage', category: 'Spa', rate: 12 },
    { id: 7, service: 'Gel Manicure', category: 'Nail Care', rate: 8 },
    { id: 8, service: 'Pedicure', category: 'Nail Care', rate: 8 },
];

const initialTargetRules = [
    { id: 1, employee: 'Sara Ahmed', targetRev: 10000, baseBonus: 1000, mult120: 1.5, mult150: 2.0 },
    { id: 2, employee: 'Nora Ali', targetRev: 6000, baseBonus: 600, mult120: 1.5, mult150: 2.0 },
    { id: 3, employee: 'Layla Hassan', targetRev: 4000, baseBonus: 400, mult120: 1.5, mult150: 2.0 },
    { id: 4, employee: 'Hana Youssef', targetRev: 3000, baseBonus: 300, mult120: 1.5, mult150: 2.0 },
    { id: 5, employee: 'Reem Mohamed', targetRev: 2000, baseBonus: 200, mult120: 1.5, mult150: 2.0 },
];

const initialSegmentRates = [
    { id: 1, segment: 'Hair Care', rate: 10, description: 'All hair-related services' },
    { id: 2, segment: 'Skincare', rate: 9, description: 'Facials, peels, and skin treatments' },
    { id: 3, segment: 'Spa', rate: 11, description: 'Massage and body treatments' },
    { id: 4, segment: 'Nail Care', rate: 8, description: 'Manicure, pedicure, nail art' },
];

const initialExtractionRules = [
    { id: 1, service: 'Hair Coloring', extractionRate: 15, applyTo: 'All Employees' },
    { id: 2, service: 'Keratin Treatment', extractionRate: 20, applyTo: 'All Employees' },
    { id: 3, service: 'HydraFacial', extractionRate: 12, applyTo: 'All Employees' },
    { id: 4, service: 'Deep Tissue Massage', extractionRate: 10, applyTo: 'All Employees' },
    { id: 5, service: 'Gel Manicure', extractionRate: 18, applyTo: 'All Employees' },
];

// ─── Styles ─────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-8)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', paddingBottom: 'var(--space-1)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-5)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-3px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', borderRadius: 0, background: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    cardHeader: { padding: 'var(--space-4) var(--space-5)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.15s' },
    footer: { display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' },
    emptyRow: { textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' },
};

// ─── Component ──────────────────────────────────────────────────────
export default function CommissionSettingsPage() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('service');

    // State for each tab
    const [serviceRates, setServiceRates] = useState(initialServiceRates);
    const [targetRules, setTargetRules] = useState(initialTargetRules);
    const [segmentRates, setSegmentRates] = useState(initialSegmentRates);
    const [extractionRules, setExtractionRules] = useState(initialExtractionRules);

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

    const openEdit = (id: number, data: Record<string, any>) => {
        setModalMode('edit');
        setEditId(id);
        const strData: Record<string, string> = {};
        Object.entries(data).forEach(([k, v]) => { strData[k] = String(v); });
        setForm(strData);
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (activeTab === 'service') setServiceRates(prev => prev.filter(r => r.id !== id));
        if (activeTab === 'target') setTargetRules(prev => prev.filter(r => r.id !== id));
        if (activeTab === 'segment') setSegmentRates(prev => prev.filter(r => r.id !== id));
        if (activeTab === 'extraction') setExtractionRules(prev => prev.filter(r => r.id !== id));
        addToast('success', 'Rule deleted successfully.');
    };

    const handleSaveModal = () => {
        const newId = Date.now();

        if (activeTab === 'service') {
            const entry = { id: editId ?? newId, service: form.service || '', category: form.category || '', rate: parseFloat(form.rate) || 0 };
            if (modalMode === 'add') setServiceRates(prev => [...prev, entry]);
            else setServiceRates(prev => prev.map(r => r.id === editId ? entry : r));
        }
        if (activeTab === 'target') {
            const entry = { id: editId ?? newId, employee: form.employee || '', targetRev: parseFloat(form.targetRev) || 0, baseBonus: parseFloat(form.baseBonus) || 0, mult120: parseFloat(form.mult120) || 1.5, mult150: parseFloat(form.mult150) || 2.0 };
            if (modalMode === 'add') setTargetRules(prev => [...prev, entry]);
            else setTargetRules(prev => prev.map(r => r.id === editId ? entry : r));
        }
        if (activeTab === 'segment') {
            const entry = { id: editId ?? newId, segment: form.segment || '', rate: parseFloat(form.rate) || 0, description: form.description || '' };
            if (modalMode === 'add') setSegmentRates(prev => [...prev, entry]);
            else setSegmentRates(prev => prev.map(r => r.id === editId ? entry : r));
        }
        if (activeTab === 'extraction') {
            const entry = { id: editId ?? newId, service: form.service || '', extractionRate: parseFloat(form.extractionRate) || 0, applyTo: form.applyTo || 'All Employees' };
            if (modalMode === 'add') setExtractionRules(prev => [...prev, entry]);
            else setExtractionRules(prev => prev.map(r => r.id === editId ? entry : r));
        }

        setModalOpen(false);
        addToast('success', `Rule ${modalMode === 'add' ? 'added' : 'updated'} successfully.`);
    };

    const handleSaveAll = () => {
        addToast('success', 'All commission settings saved.');
    };

    const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

    // ─── Tab Labels ─────────────────
    const tabLabels: Record<string, string> = {
        service: 'Commission Rates by Service',
        target: 'Target-Based Bonus Rules',
        segment: 'Commission Rates by Segment',
        extraction: 'Material Extraction Costs',
    };

    // ─── Modal Fields per Tab ───────
    const renderModalFields = () => {
        if (activeTab === 'service') return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Input label="Service Name" value={form.service || ''} onChange={e => updateForm('service', e.target.value)} placeholder="e.g. Hair Coloring" />
                <Select label="Category" value={form.category || ''} onChange={e => updateForm('category', e.target.value)} options={[
                    { label: 'Select category', value: '' },
                    { label: 'Hair Care', value: 'Hair Care' },
                    { label: 'Skincare', value: 'Skincare' },
                    { label: 'Spa', value: 'Spa' },
                    { label: 'Nail Care', value: 'Nail Care' },
                ]} />
                <Input label="Commission Rate %" type="number" value={form.rate || ''} onChange={e => updateForm('rate', e.target.value)} placeholder="e.g. 10" />
            </div>
        );
        if (activeTab === 'target') return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Select label="Employee" value={form.employee || ''} onChange={e => updateForm('employee', e.target.value)} options={[
                    { label: 'Select employee', value: '' },
                    { label: 'Sara Ahmed', value: 'Sara Ahmed' },
                    { label: 'Nora Ali', value: 'Nora Ali' },
                    { label: 'Layla Hassan', value: 'Layla Hassan' },
                    { label: 'Hana Youssef', value: 'Hana Youssef' },
                    { label: 'Reem Mohamed', value: 'Reem Mohamed' },
                ]} />
                <Input label="Target Revenue (EGP)" type="number" value={form.targetRev || ''} onChange={e => updateForm('targetRev', e.target.value)} placeholder="e.g. 10000" />
                <Input label="Base Bonus (EGP)" type="number" value={form.baseBonus || ''} onChange={e => updateForm('baseBonus', e.target.value)} placeholder="e.g. 1000" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <Input label="120%+ Multiplier" type="number" value={form.mult120 || ''} onChange={e => updateForm('mult120', e.target.value)} placeholder="1.5" hint="Bonus × this when ≥120%" />
                    <Input label="150%+ Multiplier" type="number" value={form.mult150 || ''} onChange={e => updateForm('mult150', e.target.value)} placeholder="2.0" hint="Bonus × this when ≥150%" />
                </div>
            </div>
        );
        if (activeTab === 'segment') return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Input label="Segment Name" value={form.segment || ''} onChange={e => updateForm('segment', e.target.value)} placeholder="e.g. Hair Care" />
                <Input label="Commission Rate %" type="number" value={form.rate || ''} onChange={e => updateForm('rate', e.target.value)} placeholder="e.g. 10" />
                <Input label="Description" value={form.description || ''} onChange={e => updateForm('description', e.target.value)} placeholder="Optional notes about this segment" />
            </div>
        );
        if (activeTab === 'extraction') return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Input label="Service Name" value={form.service || ''} onChange={e => updateForm('service', e.target.value)} placeholder="e.g. Hair Coloring" />
                <Input label="Extraction Rate %" type="number" value={form.extractionRate || ''} onChange={e => updateForm('extractionRate', e.target.value)} placeholder="e.g. 15" hint="Material cost deducted before commission" />
                <Select label="Apply To" value={form.applyTo || 'All Employees'} onChange={e => updateForm('applyTo', e.target.value)} options={[
                    { label: 'All Employees', value: 'All Employees' },
                    { label: 'Sara Ahmed', value: 'Sara Ahmed' },
                    { label: 'Nora Ali', value: 'Nora Ali' },
                    { label: 'Layla Hassan', value: 'Layla Hassan' },
                    { label: 'Hana Youssef', value: 'Hana Youssef' },
                    { label: 'Reem Mohamed', value: 'Reem Mohamed' },
                ]} />
            </div>
        );
        return null;
    };

    // ─── Table Renderers ────────────
    const renderServiceTable = () => (
        <table style={s.table}>
            <thead><tr>{['Service', 'Category', 'Rate %', 'Actions'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
            <tbody>
                {serviceRates.length === 0 ? (
                    <tr><td colSpan={4} style={s.emptyRow as React.CSSProperties}>No service rates configured. Click &quot;Add Rule&quot; to get started.</td></tr>
                ) : serviceRates.map(r => (
                    <tr key={r.id} className="hoverRow">
                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{r.service}</td>
                        <td style={s.td}><Badge color="neutral" size="sm">{r.category}</Badge></td>
                        <td style={{ ...s.td, fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)' }}>{r.rate}%</td>
                        <td style={s.td}>
                            <div style={s.actions}>
                                <button style={s.btnIcon} onClick={() => openEdit(r.id, r)}><Edit size={14} /></button>
                                <button style={{ ...s.btnIcon, color: 'var(--color-error)' }} onClick={() => handleDelete(r.id)}><Trash2 size={14} /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderTargetTable = () => (
        <table style={s.table}>
            <thead><tr>{['Employee', 'Target Revenue', 'Base Bonus', '120%+ Mult.', '150%+ Mult.', 'Actions'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
            <tbody>
                {targetRules.length === 0 ? (
                    <tr><td colSpan={6} style={s.emptyRow as React.CSSProperties}>No target rules configured. Click &quot;Add Rule&quot; to get started.</td></tr>
                ) : targetRules.map(r => (
                    <tr key={r.id} className="hoverRow">
                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{r.employee}</td>
                        <td style={s.td}>{r.targetRev.toLocaleString()} EGP</td>
                        <td style={{ ...s.td, fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)' }}>{r.baseBonus.toLocaleString()} EGP</td>
                        <td style={s.td}><Badge color="info" size="sm">×{r.mult120}</Badge></td>
                        <td style={s.td}><Badge color="success" size="sm">×{r.mult150}</Badge></td>
                        <td style={s.td}>
                            <div style={s.actions}>
                                <button style={s.btnIcon} onClick={() => openEdit(r.id, r)}><Edit size={14} /></button>
                                <button style={{ ...s.btnIcon, color: 'var(--color-error)' }} onClick={() => handleDelete(r.id)}><Trash2 size={14} /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderSegmentTable = () => (
        <table style={s.table}>
            <thead><tr>{['Segment', 'Rate %', 'Description', 'Actions'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
            <tbody>
                {segmentRates.length === 0 ? (
                    <tr><td colSpan={4} style={s.emptyRow as React.CSSProperties}>No segment rates configured. Click &quot;Add Rule&quot; to get started.</td></tr>
                ) : segmentRates.map(r => (
                    <tr key={r.id} className="hoverRow">
                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{r.segment}</td>
                        <td style={{ ...s.td, fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)' }}>{r.rate}%</td>
                        <td style={{ ...s.td, color: 'var(--text-secondary)' }}>{r.description}</td>
                        <td style={s.td}>
                            <div style={s.actions}>
                                <button style={s.btnIcon} onClick={() => openEdit(r.id, r)}><Edit size={14} /></button>
                                <button style={{ ...s.btnIcon, color: 'var(--color-error)' }} onClick={() => handleDelete(r.id)}><Trash2 size={14} /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderExtractionTable = () => (
        <table style={s.table}>
            <thead><tr>{['Service', 'Extraction Rate %', 'Apply To', 'Actions'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
            <tbody>
                {extractionRules.length === 0 ? (
                    <tr><td colSpan={4} style={s.emptyRow as React.CSSProperties}>No extraction rules configured. Click &quot;Add Rule&quot; to get started.</td></tr>
                ) : extractionRules.map(r => (
                    <tr key={r.id} className="hoverRow">
                        <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{r.service}</td>
                        <td style={{ ...s.td, fontWeight: 'var(--font-semibold)', color: '#ef4444' }}>{r.extractionRate}%</td>
                        <td style={s.td}><Badge color="neutral" size="sm">{r.applyTo}</Badge></td>
                        <td style={s.td}>
                            <div style={s.actions}>
                                <button style={s.btnIcon} onClick={() => openEdit(r.id, r)}><Edit size={14} /></button>
                                <button style={{ ...s.btnIcon, color: 'var(--color-error)' }} onClick={() => handleDelete(r.id)}><Trash2 size={14} /></button>
                            </div>
                        </td>
                    </tr>
                ))}
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

    return (
        <div style={s.page}>
            <div style={s.header}>
                <div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Commission Settings</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>Configure commission rules for each calculation type.</div>
                </div>
                <Button onClick={handleSaveAll}><Save size={16} /> Save All Settings</Button>
            </div>

            <div style={s.tabBar}>
                {tabs.map(t => (
                    <button
                        key={t.key}
                        style={{ ...s.tab, ...(t.key === activeTab ? s.tabActive : {}) }}
                        onClick={() => setActiveTab(t.key)}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            <div style={s.card}>
                <div style={s.cardHeader}>
                    <span>{tabLabels[activeTab]}</span>
                    <Button size="sm" onClick={openAdd}><Plus size={14} /> Add Rule</Button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    {renderActiveTable()}
                </div>
            </div>

            <div style={s.footer}>
                <Button onClick={handleSaveAll}><Save size={16} /> Save All Settings</Button>
            </div>

            {/* Add / Edit Modal */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`${modalMode === 'add' ? 'Add' : 'Edit'} ${tabLabels[activeTab]} Rule`}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}><X size={14} /> Cancel</Button>
                        <Button onClick={handleSaveModal}><Check size={14} /> {modalMode === 'add' ? 'Add Rule' : 'Save Changes'}</Button>
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
