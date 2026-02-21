'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Layers } from 'lucide-react';
import { useToast, Modal, Input, Button } from '@/components/ui';

import MarketingTabs from '@/components/MarketingTabs';

const groups = [
    { id: 1, name: 'Hair Services', services: ['Hair Cut', 'Hair Coloring', 'Keratin Treatment', 'Blow Dry', 'Hair Mask', 'Highlights'], color: '#F59E0B', active: true },
    { id: 2, name: 'Skin & Facial', services: ['Classic Facial', 'HydraFacial', 'Chemical Peel', 'Microdermabrasion', 'Acne Treatment'], color: '#EC4899', active: true },
    { id: 3, name: 'Body & Massage', services: ['Swedish Massage', 'Deep Tissue', 'Hot Stone', 'Full Body Scrub', 'Aromatherapy'], color: '#10B981', active: true },
    { id: 4, name: 'Nail Care', services: ['Gel Manicure', 'Pedicure', 'Nail Art', 'Paraffin Wax', 'French Tips'], color: '#3B82F6', active: true },
    { id: 5, name: 'Bridal Services', services: ['Bridal Makeup', 'Up Style', 'Henna', 'Full Body Treatment', 'Trial Session'], color: '#8B5CF6', active: false },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    cardHead: { padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' },
    nameArea: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    icon: { width: 36, height: 36, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    name: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' },
    count: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
    serviceList: { padding: 'var(--space-4) var(--space-5)', display: 'flex', flexWrap: 'wrap', gap: 6 },
    svcChip: { padding: '4px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' },
};

export default function ServiceGroupsPage() {
    const { addToast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);

    return (
        <div style={s.page}>
            <MarketingTabs />
            <div style={s.toolbar}><button style={s.addBtn} onClick={() => setIsAddOpen(true)}><Plus size={16} /> New Group</button></div>
            <div style={s.grid}>
                {groups.map(g => (
                    <div key={g.id} style={{ ...s.card, opacity: g.active ? 1 : 0.6 }}>
                        <div style={s.cardHead}>
                            <div style={s.nameArea as React.CSSProperties}>
                                <div style={{ ...s.icon, background: g.color }}><Layers size={16} /></div>
                                <div>
                                    <div style={s.name}>{g.name}</div>
                                    <div style={s.count}>{g.services.length} services</div>
                                </div>
                            </div>
                            <div style={s.actions}>
                                <button style={s.btnIcon} onClick={() => { setSelectedGroup(g); setIsEditOpen(true); }}><Edit size={12} /></button>
                                <button style={{ ...s.btnIcon, color: 'var(--color-error)' }} onClick={() => { setSelectedGroup(g); setIsDeleteOpen(true); }}><Trash2 size={12} /></button>
                            </div>
                        </div>
                        <div style={s.serviceList as React.CSSProperties}>
                            {g.services.map(svc => <span key={svc} style={s.svcChip}>{svc}</span>)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Group Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create New Group"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Group created successfully'); }}>Save Group</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Group Name" placeholder="e.g. Hair Care" />
                    <div>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Assign Services</label>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', padding: 'var(--space-3)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            Search and select services to add to this group.
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Edit Group Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedGroup(null); }}
                title="Edit Group"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Group updated successfully'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedGroup && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Group Name" defaultValue={selectedGroup.name} />
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Assigned Services</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                {selectedGroup.services.map((svc: string) => (
                                    <span key={svc} style={{ padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>{svc}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedGroup(null); }}
                title="Delete Group"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Group deleted permanently'); }}>Confirm Delete</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to delete the <strong>{selectedGroup?.name}</strong> group?
                    </p>
                </div>
            </Modal>
        </div>
    );
}
