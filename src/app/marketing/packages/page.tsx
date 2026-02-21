'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Package, Check, Users, Clock, Star, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useToast, SlideOver, Modal, Input, Button, DropdownMenu, Select } from '@/components/ui';

import MarketingTabs from '@/components/MarketingTabs';

const packages = [
    { id: 1, name: 'Summer Glow Campaign', price: 899, services: ['Body Scrub', 'Spray Tan', 'Gel Nails', 'Lash Lift'], target: 'New Clients', active: true, sold: 15, color: '#F59E0B' },
    { id: 2, name: 'Refer-a-Friend Bundle', price: 599, services: ['Any Facial', 'Classic Manicure', 'Blow Dry'], target: 'Referral Program', active: true, sold: 28, color: '#10B981' },
    { id: 3, name: 'Birthday Special', price: 750, services: ['Full Styling', 'Makeup', 'Nail Art', 'Photo Shoot'], target: 'Birthday Month', active: true, sold: 12, color: '#EC4899' },
    { id: 4, name: 'Corporate Wellness', price: 450, services: ['Chair Massage', 'Mini Facial', 'Express Mani'], target: 'Corporate Partners', active: false, sold: 0, color: '#3B82F6' },
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
    cardHead: { padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    icon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    name: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    price: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' },
    target: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    services: { padding: '0 var(--space-5) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 6 },
    svcItem: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' },
    footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
};

export default function MarketingPackagesPage() {
    const { addToast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);

    return (
        <div style={s.page}>
            <MarketingTabs />
            <div style={s.toolbar}><button style={s.addBtn} onClick={() => setIsAddOpen(true)}><Plus size={16} /> New Package</button></div>
            <div style={s.grid}>
                {packages.map(pkg => (
                    <div key={pkg.id} style={{ ...s.card, opacity: pkg.active ? 1 : 0.6 }}>
                        <div style={s.cardHead}>
                            <div style={{ ...s.icon, background: pkg.color }}><Package size={20} /></div>
                            <div>
                                <div style={s.name}>{pkg.name}</div>
                                <div style={s.price}>{pkg.price} EGP</div>
                                <div style={s.target}>Target: {pkg.target}</div>
                            </div>
                            <div style={{ marginLeft: 'auto' }}>
                                <DropdownMenu
                                    trigger={<button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><MoreVertical size={16} /></button>}
                                    items={[
                                        { label: 'Edit Package', icon: <Edit size={14} />, onClick: () => { setSelectedPackage(pkg); setIsEditOpen(true); } },
                                        { label: 'Delete Package', destructive: true, icon: <Trash2 size={14} />, onClick: () => { setSelectedPackage(pkg); setIsDeleteOpen(true); } }
                                    ]}
                                />
                            </div>
                        </div>
                        <div style={s.services as React.CSSProperties}>
                            {pkg.services.map((svc, i) => <div key={i} style={s.svcItem}><Check size={14} style={{ color: 'var(--color-success)' }} /> {svc}</div>)}
                        </div>
                        <div style={s.footer}>
                            <span><Users size={12} style={{ display: 'inline', marginRight: 4 }} /> {pkg.sold} sold</span>
                            <span>{pkg.active ? '🟢 Active' : '⚪ Inactive'}</span>
                        </div>
                    </div>
                ))}
            </div>
            {/* Add Package SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create New Package"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Package created successfully'); }}>Save Package</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Package Name" placeholder="e.g. Summer Glow" />
                    <Input label="Price (EGP)" type="number" placeholder="0.00" />
                    <Input label="Target Audience" placeholder="e.g. New Clients" />
                    <Select label="Status" options={[{ label: 'Active', value: 'active' }, { label: 'Draft', value: 'draft' }]} />
                </div>
            </SlideOver>

            {/* Edit Package SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedPackage(null); }}
                title="Edit Package"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Package updated successfully'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedPackage && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Package Name" defaultValue={selectedPackage.name} />
                        <Input label="Price (EGP)" type="number" defaultValue={selectedPackage.price} />
                        <Input label="Target Audience" defaultValue={selectedPackage.target} />
                        <Select label="Status" defaultValue={selectedPackage.active ? 'active' : 'draft'} options={[{ label: 'Active', value: 'active' }, { label: 'Draft', value: 'draft' }]} />
                    </div>
                )}
            </SlideOver>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedPackage(null); }}
                title="Delete Package"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Package deleted permanently'); }}>Confirm Delete</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to delete the <strong>{selectedPackage?.name}</strong> package?
                    </p>
                </div>
            </Modal>
        </div>
    );
}
