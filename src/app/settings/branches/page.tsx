'use client';

import React, { useState } from 'react';
import { Building2, Plus, MoreVertical, Edit, Trash2, MapPin, ExternalLink } from 'lucide-react';
import { useToast, SlideOver, Modal, Input, Select, Button, DropdownMenu } from '@/components/ui';
import SettingsTabs from '@/components/SettingsTabs';

const GOVERNORATES = [
    'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Dakahlia', 'Sharqia', 'Gharbia',
    'Monufia', 'Beheira', 'Kafr El Sheikh', 'Damietta', 'Port Said', 'Ismailia',
    'Suez', 'North Sinai', 'South Sinai', 'Red Sea', 'Matrouh', 'Fayoum',
    'Beni Suef', 'Minya', 'Assiut', 'Sohag', 'Qena', 'Luxor', 'Aswan', 'New Valley',
];

const CITIES: Record<string, string[]> = {
    Cairo: ['Nasr City', 'Heliopolis', 'Maadi', 'Downtown', 'Zamalek', 'New Cairo', '6th of October', 'Shubra', 'Ain Shams'],
    Giza: ['Dokki', 'Mohandessin', 'Haram', 'Faisal', '6th of October', 'Sheikh Zayed', 'Smart Village'],
    Alexandria: ['Montaza', 'Smouha', 'Sidi Gaber', 'Stanley', 'Mandara', 'Agami', 'Miami'],
};

const branches = [
    {
        id: 1, name: 'Downtown Branch', governorate: 'Cairo', city: 'Downtown',
        address: '15 Tahrir Street', mapLink: 'https://maps.app.goo.gl/abc123',
        phone: '+20 2 2345 6789', manager: 'Sara Ahmed', employees: 6, status: 'active',
    },
    {
        id: 2, name: 'Mall of Arabia', governorate: 'Giza', city: '6th of October',
        address: 'Mall of Arabia, Gate 4', mapLink: 'https://maps.app.goo.gl/def456',
        phone: '+20 2 3456 7890', manager: 'Fatma Hosny', employees: 3, status: 'active',
    },
    {
        id: 3, name: 'New Cairo Branch', governorate: 'Cairo', city: 'New Cairo',
        address: '5th Settlement, Street 90', mapLink: 'https://maps.app.goo.gl/ghi789',
        phone: '+20 2 4567 8901', manager: 'Amira Sayed', employees: 4, status: 'active',
    },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-2)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', transition: 'box-shadow 0.2s, border-color 0.2s' },
    cardHead: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' },
    icon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' },
    name: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)', background: 'var(--color-success-light)', color: 'var(--color-success)' },
    row: { display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-color)' },
    rowLast: { borderBottom: 'none' },
    label: { color: 'var(--text-tertiary)' },
    val: { fontWeight: 'var(--font-medium)', textAlign: 'right' as const, maxWidth: '60%' },
    mapLink: { display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-primary-600)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', textDecoration: 'none' },
    sectionLabel: { fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 'var(--space-2)', marginTop: 'var(--space-3)' },
};

function BranchForm({ defaultValues }: { defaultValues?: any }) {
    const [governorate, setGovernorate] = useState(defaultValues?.governorate || '');
    const cities = CITIES[governorate] || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input label="Branch Name" placeholder="e.g. Downtown Branch" defaultValue={defaultValues?.name} />
            <Input label="Contact Phone" placeholder="+20 1XX XXX XXXX" defaultValue={defaultValues?.phone} />
            <Input label="Manager Name" placeholder="e.g. Sara Ahmed" defaultValue={defaultValues?.manager} />

            <div style={s.sectionLabel}>📍 Location Details</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <Select
                    label="Governorate"
                    defaultValue={defaultValues?.governorate || ''}
                    options={[{ label: '— Select governorate —', value: '' }, ...GOVERNORATES.map(g => ({ label: g, value: g }))]}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGovernorate(e.target.value)}
                />
                <Select
                    label="City"
                    defaultValue={defaultValues?.city || ''}
                    options={cities.length > 0
                        ? [{ label: '— Select city —', value: '' }, ...cities.map(c => ({ label: c, value: c }))]
                        : [{ label: 'Select governorate first', value: '' }]
                    }
                />
            </div>

            <Input label="Full Address" placeholder="e.g. 15 Tahrir Street, Building 3, Floor 1" defaultValue={defaultValues?.address} />
            <Input label="Google Maps Link" placeholder="https://maps.app.goo.gl/..." defaultValue={defaultValues?.mapLink} />
        </div>
    );
}

export default function BranchesPage() {
    const { addToast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<any>(null);

    return (
        <div style={s.page}>
            <SettingsTabs />
            <div style={s.toolbar}>
                <Button onClick={() => setIsAddOpen(true)}><Plus size={16} style={{ marginRight: 8 }} /> Add Branch</Button>
            </div>
            <div style={s.grid}>
                {branches.map(b => (
                    <div key={b.id} style={s.card}>
                        <div style={{ ...s.cardHead as React.CSSProperties, justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <div style={s.icon}><Building2 size={20} /></div>
                                <div><div style={s.name}>{b.name}</div><span style={s.badge}>{b.status}</span></div>
                            </div>
                            <DropdownMenu
                                trigger={<button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><MoreVertical size={16} /></button>}
                                items={[
                                    { label: 'Edit Branch', icon: <Edit size={14} />, onClick: () => { setSelectedBranch(b); setIsEditOpen(true); } },
                                    { label: 'Delete Branch', destructive: true, icon: <Trash2 size={14} />, onClick: () => { setSelectedBranch(b); setIsDeleteOpen(true); } }
                                ]}
                            />
                        </div>
                        <div style={s.row}><span style={s.label}>Governorate</span><span style={s.val}>{b.governorate}</span></div>
                        <div style={s.row}><span style={s.label}>City</span><span style={s.val}>{b.city}</span></div>
                        <div style={s.row}><span style={s.label}>Address</span><span style={s.val}>{b.address}</span></div>
                        <div style={s.row}><span style={s.label}>Phone</span><span style={s.val}>{b.phone}</span></div>
                        <div style={s.row}><span style={s.label}>Manager</span><span style={s.val}>{b.manager}</span></div>
                        <div style={s.row}><span style={s.label}>Employees</span><span style={s.val}>{b.employees}</span></div>
                        <div style={{ ...s.row, ...s.rowLast }}>
                            <span style={s.label}>Location</span>
                            <a href={b.mapLink} target="_blank" rel="noopener noreferrer" style={s.mapLink}>
                                <MapPin size={14} /> View on Map <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Branch SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Add New Branch"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Branch created successfully'); }}>Save Branch</Button>
                    </div>
                }
            >
                <BranchForm />
            </SlideOver>

            {/* Edit Branch SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedBranch(null); }}
                title="Edit Branch"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Branch updated successfully'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedBranch && <BranchForm defaultValues={selectedBranch} />}
            </SlideOver>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedBranch(null); }}
                title="Delete Branch"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Branch deleted'); }}>Confirm Delete</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to delete the <strong>{selectedBranch?.name}</strong> branch? All employees and bookings currently tied to this branch will need to be reassigned.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
