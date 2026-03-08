'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Layers, Check, X } from 'lucide-react';
import { useToast, Modal, Input, Button } from '@/components/ui';

import MarketingTabs from '@/components/MarketingTabs';
import { useTranslation } from '@/hooks/useTranslation';

const allServices = [
    'Hair Cut', 'Hair Coloring', 'Keratin Treatment', 'Blow Dry', 'Hair Mask', 'Highlights',
    'Classic Facial', 'HydraFacial', 'Chemical Peel', 'Microdermabrasion', 'Acne Treatment',
    'Swedish Massage', 'Deep Tissue', 'Hot Stone', 'Full Body Scrub', 'Aromatherapy',
    'Gel Manicure', 'Pedicure', 'Nail Art', 'Paraffin Wax', 'French Tips',
    'Bridal Makeup', 'Up Style', 'Henna', 'Full Body Treatment', 'Trial Session',
    'Lash Lift', 'Lash Extensions', 'Brow Lamination', 'Threading', 'Waxing',
];

const colorOptions = ['#F59E0B', '#EC4899', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#06B6D4', '#F97316'];

const initialGroups = [
    { id: 1, name: 'Hair Services', services: ['Hair Cut', 'Hair Coloring', 'Keratin Treatment', 'Blow Dry', 'Hair Mask', 'Highlights'], color: '#F59E0B', active: true },
    { id: 2, name: 'Skin & Facial', services: ['Classic Facial', 'HydraFacial', 'Chemical Peel', 'Microdermabrasion', 'Acne Treatment'], color: '#EC4899', active: true },
    { id: 3, name: 'Body & Massage', services: ['Swedish Massage', 'Deep Tissue', 'Hot Stone', 'Full Body Scrub', 'Aromatherapy'], color: '#10B981', active: true },
    { id: 4, name: 'Nail Care', services: ['Gel Manicure', 'Pedicure', 'Nail Art', 'Paraffin Wax', 'French Tips'], color: '#3B82F6', active: true },
    { id: 5, name: 'Bridal Services', services: ['Bridal Makeup', 'Up Style', 'Henna', 'Full Body Treatment', 'Trial Session'], color: '#8B5CF6', active: false },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', transition: 'all 0.2s' },
    cardHead: { padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' },
    nameArea: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    icon: { width: 36, height: 36, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    name: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' },
    count: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    actions: { display: 'flex', gap: 'var(--space-2)', alignItems: 'center' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
    serviceList: { padding: 'var(--space-4) var(--space-5)', display: 'flex', flexWrap: 'wrap', gap: 6 },
    svcChip: { padding: '4px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' },
    // Modal styles
    colorPicker: { display: 'flex', gap: 8, flexWrap: 'wrap' },
    colorDot: { width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid transparent' },
    searchBox: { position: 'relative', marginBottom: 'var(--space-3)' },
    searchIcon: { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    serviceItem: { display: 'flex', alignItems: 'center', padding: '8px 12px', cursor: 'pointer', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', transition: 'background 0.15s' },
    toggleSwitch: { width: 36, height: 20, borderRadius: 10, padding: 2, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center' },
    toggleKnob: { width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' },
};

export default function ServiceGroupsPage() {
    const { addToast } = useToast();
    const { t } = useTranslation();
    const [groups, setGroups] = useState(initialGroups);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<typeof initialGroups[0] | null>(null);

    // Form state
    const [formName, setFormName] = useState('');
    const [formColor, setFormColor] = useState('#F59E0B');
    const [formServices, setFormServices] = useState<string[]>([]);
    const [serviceSearch, setServiceSearch] = useState('');

    const openAdd = () => {
        setFormName('');
        setFormColor('#F59E0B');
        setFormServices([]);
        setServiceSearch('');
        setIsAddOpen(true);
    };

    const openEdit = (g: typeof initialGroups[0]) => {
        setSelectedGroup(g);
        setFormName(g.name);
        setFormColor(g.color);
        setFormServices([...g.services]);
        setServiceSearch('');
        setIsEditOpen(true);
    };

    const openDelete = (g: typeof initialGroups[0]) => {
        setSelectedGroup(g);
        setIsDeleteOpen(true);
    };

    const toggleService = (svc: string) => {
        setFormServices(prev => prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]);
    };

    const toggleActive = (id: number) => {
        setGroups(prev => prev.map(g => g.id === id ? { ...g, active: !g.active } : g));
    };

    const handleAdd = () => {
        if (!formName.trim()) { addToast('error', t('mkt.msgGroupNameRequired')); return; }
        if (formServices.length === 0) { addToast('error', t('mkt.msgSelectOneService')); return; }
        const newGroup = { id: Date.now(), name: formName, services: formServices, color: formColor, active: true };
        setGroups(prev => [...prev, newGroup]);
        setIsAddOpen(false);
        addToast('success', t('mkt.msgGroupCreated'));
    };

    const handleEdit = () => {
        if (!formName.trim()) { addToast('error', t('mkt.msgGroupNameRequired')); return; }
        if (formServices.length === 0) { addToast('error', t('mkt.msgSelectOneService')); return; }
        setGroups(prev => prev.map(g => g.id === selectedGroup!.id ? { ...g, name: formName, color: formColor, services: formServices } : g));
        setIsEditOpen(false);
        setSelectedGroup(null);
        addToast('success', t('mkt.msgGroupUpdated'));
    };

    const handleDelete = () => {
        setGroups(prev => prev.filter(g => g.id !== selectedGroup?.id));
        setIsDeleteOpen(false);
        setSelectedGroup(null);
        addToast('success', t('mkt.msgGroupDeleted'));
    };

    const filteredServices = allServices.filter(svc => svc.toLowerCase().includes(serviceSearch.toLowerCase()));

    const renderServiceSelector = () => (
        <div>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>
                {t('mkt.lblAssignServices')} <span style={{ color: 'var(--text-tertiary)', fontWeight: 'normal' }}>({formServices.length} {t('mkt.lblSelected')})</span>
            </label>

            {/* Selected chips */}
            {formServices.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--space-3)' }}>
                    {formServices.map(svc => (
                        <span key={svc} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: formColor + '20', color: formColor, borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', cursor: 'pointer' }} onClick={() => toggleService(svc)}>
                            {svc} <X size={12} />
                        </span>
                    ))}
                </div>
            )}

            {/* Search */}
            <div style={s.searchBox as React.CSSProperties}>
                <Search size={14} style={s.searchIcon as React.CSSProperties} />
                <input
                    style={{ width: '100%', height: 36, paddingLeft: 32, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
                    placeholder={t('mkt.phSearchServices')}
                    value={serviceSearch}
                    onChange={e => setServiceSearch(e.target.value)}
                />
            </div>

            {/* Service list */}
            <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                {filteredServices.map(svc => {
                    const isSelected = formServices.includes(svc);
                    return (
                        <div key={svc} style={{ ...s.serviceItem, background: isSelected ? formColor + '10' : 'transparent' }} onClick={() => toggleService(svc)}>
                            <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${isSelected ? formColor : 'var(--border-color)'}`, background: isSelected ? formColor : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginRight: 'var(--space-3)', flexShrink: 0, transition: 'all 0.15s' }}>
                                {isSelected && <Check size={12} />}
                            </div>
                            <span style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{svc}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div style={s.page}>
            <MarketingTabs />
            <div style={s.toolbar}><button style={s.addBtn} onClick={openAdd}><Plus size={16} /> {t('mkt.btnNewGroup')}</button></div>
            <div style={s.grid}>
                {groups.map(g => (
                    <div key={g.id} style={{ ...s.card, opacity: g.active ? 1 : 0.6 }}>
                        <div style={s.cardHead}>
                            <div style={s.nameArea as React.CSSProperties}>
                                <div style={{ ...s.icon, background: g.color }}><Layers size={16} /></div>
                                <div>
                                    <div style={s.name}>{g.name}</div>
                                    <div style={s.count}>{g.services.length} {t('mkt.lblServices')}</div>
                                </div>
                            </div>
                            <div style={s.actions}>
                                {/* Active toggle */}
                                <div
                                    style={{ ...s.toggleSwitch, background: g.active ? 'var(--color-primary-500)' : 'var(--bg-tertiary)' }}
                                    onClick={() => toggleActive(g.id)}
                                    title={g.active ? 'Deactivate' : 'Activate'}
                                >
                                    <div style={{ ...s.toggleKnob, transform: g.active ? 'translateX(16px)' : 'translateX(0)' }} />
                                </div>
                                <button style={s.btnIcon} onClick={() => openEdit(g)}><Edit size={12} /></button>
                                <button style={{ ...s.btnIcon, color: 'var(--color-error)' }} onClick={() => openDelete(g)}><Trash2 size={12} /></button>
                            </div>
                        </div>
                        <div style={s.serviceList as React.CSSProperties}>
                            {g.services.map(svc => <span key={svc} style={s.svcChip}>{svc}</span>)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Group Modal */}
            <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title={t('mkt.lblCreateNewGroup')}
                footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}><Button variant="ghost" onClick={() => setIsAddOpen(false)}>{t('rtn.btnBack')}</Button><Button onClick={handleAdd}>{t('mkt.btnSaveGroup')}</Button></div>}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('mkt.lblGroupName')} placeholder="e.g. Hair Care" value={formName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)} />
                    <div>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>{t('mkt.lblColor')}</label>
                        <div style={s.colorPicker as React.CSSProperties}>
                            {colorOptions.map(c => (
                                <div key={c} style={{ ...s.colorDot, background: c, borderColor: c === formColor ? 'var(--text-primary)' : 'transparent' }} onClick={() => setFormColor(c)}>
                                    {c === formColor && <Check size={14} color="white" />}
                                </div>
                            ))}
                        </div>
                    </div>
                    {renderServiceSelector()}
                </div>
            </Modal>

            {/* Edit Group Modal */}
            <Modal open={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedGroup(null); }} title={t('mkt.lblEditGroup')}
                footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}><Button variant="ghost" onClick={() => setIsEditOpen(false)}>{t('rtn.btnBack')}</Button><Button onClick={handleEdit}>{t('settings.saveChanges')}</Button></div>}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('mkt.lblGroupName')} value={formName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)} />
                    <div>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>{t('mkt.lblColor')}</label>
                        <div style={s.colorPicker as React.CSSProperties}>
                            {colorOptions.map(c => (
                                <div key={c} style={{ ...s.colorDot, background: c, borderColor: c === formColor ? 'var(--text-primary)' : 'transparent' }} onClick={() => setFormColor(c)}>
                                    {c === formColor && <Check size={14} color="white" />}
                                </div>
                            ))}
                        </div>
                    </div>
                    {renderServiceSelector()}
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal open={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelectedGroup(null); }} title={t('mkt.lblDeleteGroup')}
                footer={<div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}><Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>{t('rtn.btnBack')}</Button><Button variant="destructive" onClick={handleDelete}>{t('mkt.lblDeleteGroup')}</Button></div>}
            >
                <p style={{ color: 'var(--text-secondary)' }}>{t('mkt.msgDeleteGroupConfirm')} <strong>{selectedGroup?.name}</strong></p>
            </Modal>
        </div>
    );
}
