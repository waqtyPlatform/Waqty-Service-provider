'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Clock } from 'lucide-react';
import { useToast, Modal, Input, Select, Button } from '@/components/ui';
import SettingsTabs from '@/components/SettingsTabs';

const services = [
    { id: 1, name: 'Hair Cut', category: 'Hair', duration: 45, price: 120, tax: true, status: 'active' },
    { id: 2, name: 'Hair Coloring', category: 'Hair', duration: 90, price: 450, tax: true, status: 'active' },
    { id: 3, name: 'Keratin Treatment', category: 'Hair', duration: 120, price: 800, tax: true, status: 'active' },
    { id: 4, name: 'HydraFacial', category: 'Skin', duration: 60, price: 520, tax: true, status: 'active' },
    { id: 5, name: 'Classic Facial', category: 'Skin', duration: 45, price: 280, tax: true, status: 'active' },
    { id: 6, name: 'Swedish Massage', category: 'Body', duration: 60, price: 350, tax: true, status: 'active' },
    { id: 7, name: 'Deep Tissue', category: 'Body', duration: 60, price: 400, tax: true, status: 'active' },
    { id: 8, name: 'Gel Manicure', category: 'Nails', duration: 30, price: 150, tax: true, status: 'active' },
    { id: 9, name: 'Pedicure', category: 'Nails', duration: 45, price: 180, tax: true, status: 'active' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
};

export default function ServicesSettingsPage() {
    const [search, setSearch] = useState('');
    const { addToast } = useToast();

    // CRUD state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<any>(null);

    const filtered = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page}>
            <SettingsTabs />
            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}><Search size={16} style={s.searchIcon as React.CSSProperties} /><input style={s.searchInput} placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                <button style={s.addBtn} onClick={() => setIsAddOpen(true)}><Plus size={16} /> Add Service</button>
            </div>
            <table style={s.table}>
                <thead><tr>{['Service', 'Category', 'Duration', 'Price', 'Tax', 'Status', 'Actions'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {filtered.map(svc => (
                        <tr key={svc.id}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{svc.name}</td>
                            <td style={s.td}>{svc.category}</td>
                            <td style={s.td}><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {svc.duration} min</div></td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }}>{svc.price} EGP</td>
                            <td style={s.td}>{svc.tax ? '✓' : '—'}</td>
                            <td style={s.td}><span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>Active</span></td>
                            <td style={s.td}>
                                <div style={s.actions}>
                                    <button style={s.btnIcon} onClick={() => { setSelectedService(svc); setIsEditOpen(true); }}><Edit size={14} /></button>
                                    <button style={{ ...s.btnIcon, color: 'var(--color-error)' }} onClick={() => { setSelectedService(svc); setIsDeleteOpen(true); }}><Trash2 size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Service Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create New Service"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Service added successfully'); }}>Save Service</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Service Name" placeholder="e.g. Balayage" />
                    <Select label="Category" options={[
                        { label: 'Hair', value: 'Hair' },
                        { label: 'Skin', value: 'Skin' },
                        { label: 'Body', value: 'Body' },
                        { label: 'Nails', value: 'Nails' }
                    ]} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input label="Duration (mins)" type="number" defaultValue={60} />
                        <Input label="Price (EGP)" type="number" defaultValue={200} />
                    </div>
                </div>
            </Modal>

            {/* Edit Service Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedService(null); }}
                title="Edit Service"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Service updated successfully'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedService && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Service Name" defaultValue={selectedService.name} />
                        <Select label="Category" defaultValue={selectedService.category} options={[
                            { label: 'Hair', value: 'Hair' },
                            { label: 'Skin', value: 'Skin' },
                            { label: 'Body', value: 'Body' },
                            { label: 'Nails', value: 'Nails' }
                        ]} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <Input label="Duration (mins)" type="number" defaultValue={selectedService.duration} />
                            <Input label="Price (EGP)" type="number" defaultValue={selectedService.price} />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedService(null); }}
                title="Delete Service"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Service permanently removed'); }}>Confirm Delete</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to remove <strong>{selectedService?.name}</strong>? This action cannot be undone.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
