'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { SlideOver, Modal, Input, Select, Button, useToast, EmptyState } from '@/components/ui';

const initialPositions = [
    { id: 1, title: 'Senior Stylist', level: 'Senior', department: 'Hair Styling', employees: 2, minSalary: 6000, maxSalary: 10000 },
    { id: 2, title: 'Junior Stylist', level: 'Junior', department: 'Hair Styling', employees: 2, minSalary: 3000, maxSalary: 5000 },
    { id: 3, title: 'Skin Specialist', level: 'Senior', department: 'Skin Care', employees: 2, minSalary: 5500, maxSalary: 9000 },
    { id: 4, title: 'Esthetician', level: 'Mid', department: 'Skin Care', employees: 1, minSalary: 4000, maxSalary: 6500 },
    { id: 5, title: 'Senior Therapist', level: 'Senior', department: 'Massage & Body', employees: 1, minSalary: 5000, maxSalary: 8000 },
    { id: 6, title: 'Massage Therapist', level: 'Mid', department: 'Massage & Body', employees: 1, minSalary: 3500, maxSalary: 5500 },
    { id: 7, title: 'Nail Technician', level: 'Mid', department: 'Nails', employees: 2, minSalary: 3000, maxSalary: 5000 },
    { id: 8, title: 'Receptionist', level: 'Entry', department: 'Reception', employees: 2, minSalary: 2500, maxSalary: 4000 },
    { id: 9, title: 'Branch Manager', level: 'Management', department: 'Administration', employees: 1, minSalary: 8000, maxSalary: 15000 },
];

const levelColors: Record<string, { bg: string; color: string }> = {
    Senior: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    Mid: { bg: 'var(--color-primary-50)', color: 'var(--color-primary-600)' },
    Junior: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    Entry: { bg: 'var(--color-gray-100)', color: 'var(--color-gray-500)' },
    Management: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
};

export default function PositionsPage() {
    const [positions, setPositions] = useState(initialPositions);
    const [search, setSearch] = useState('');
    const { addToast } = useToast();

    // Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedPos, setSelectedPos] = useState<any>(null);

    // Form
    const [formData, setFormData] = useState({ title: '', level: 'Mid', department: 'Hair Styling', minSalary: '', maxSalary: '' });

    const filtered = positions.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

    const handleSaveAdd = () => {
        if (!formData.title) return addToast('error', 'Position title is required.');
        const newPos = {
            id: positions.length + 1,
            title: formData.title,
            level: formData.level,
            department: formData.department,
            employees: 0,
            minSalary: parseInt(formData.minSalary) || 0,
            maxSalary: parseInt(formData.maxSalary) || 0,
        };
        setPositions([...positions, newPos]);
        setIsAddOpen(false);
        setFormData({ title: '', level: 'Mid', department: 'Hair Styling', minSalary: '', maxSalary: '' });
        addToast('success', 'Position added successfully');
    };

    const handleSaveEdit = () => {
        if (!formData.title) return addToast('error', 'Position title is required.');
        setPositions(positions.map(p => p.id === selectedPos.id ? {
            ...p,
            title: formData.title,
            level: formData.level,
            department: formData.department,
            minSalary: parseInt(formData.minSalary) || 0,
            maxSalary: parseInt(formData.maxSalary) || 0,
        } : p));
        setIsEditOpen(false);
        setSelectedPos(null);
        addToast('success', 'Position updated successfully');
    };

    const handleDelete = () => {
        setPositions(positions.filter(p => p.id !== selectedPos.id));
        setIsDeleteOpen(false);
        setSelectedPos(null);
        addToast('success', 'Position removed successfully');
    };

    return (
        <div style={s.page}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Positions</div>

            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}>
                    <Search size={16} style={s.searchIcon as React.CSSProperties} />
                    <input style={s.searchInput} placeholder="Search positions..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus size={16} style={{ marginRight: 8 }} /> New Position
                </Button>
            </div>

            {filtered.length > 0 ? (
                <table style={s.table}>
                    <thead>
                        <tr>
                            {['Title', 'Level', 'Department', 'Employees', 'Salary Range', 'Actions'].map(h =>
                                <th key={h} style={s.th as React.CSSProperties}>{h}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p.id} className="hoverRow">
                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{p.title}</td>
                                <td style={s.td}><span style={{ ...s.badge, ...levelColors[p.level] }}>{p.level}</span></td>
                                <td style={s.td}>{p.department}</td>
                                <td style={s.td}>{p.employees}</td>
                                <td style={s.td}>{p.minSalary.toLocaleString()}  {p.maxSalary.toLocaleString()} EGP</td>
                                <td style={s.td}>
                                    <div style={s.actions}>
                                        <button style={s.btnIcon} onClick={() => {
                                            setSelectedPos(p);
                                            setFormData({ title: p.title, level: p.level, department: p.department, minSalary: p.minSalary.toString(), maxSalary: p.maxSalary.toString() });
                                            setIsEditOpen(true);
                                        }}>
                                            <Edit size={14} />
                                        </button>
                                        <button style={{ ...s.btnIcon, color: 'var(--color-error)' }} onClick={() => {
                                            setSelectedPos(p);
                                            setIsDeleteOpen(true);
                                        }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <EmptyState icon={<Edit size={32} color="var(--text-tertiary)" />} title="No positions found" description="We couldn't find any positions matching your search." />
            )}
            <style>{`
                .hoverRow:hover { background-color: var(--bg-secondary); }
                .hoverRow:last-child td { border-bottom: none !important; }
            `}</style>
            {/* Add SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create Position"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveAdd}>Create Position</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Position Title" placeholder="e.g. Master Barber" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    <Select label="Level" value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} options={[
                        { label: 'Entry', value: 'Entry' },
                        { label: 'Junior', value: 'Junior' },
                        { label: 'Mid', value: 'Mid' },
                        { label: 'Senior', value: 'Senior' },
                        { label: 'Management', value: 'Management' },
                    ]} />
                    <Select label="Department" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} options={[
                        { label: 'Hair Styling', value: 'Hair Styling' },
                        { label: 'Skin Care', value: 'Skin Care' },
                        { label: 'Massage & Body', value: 'Massage & Body' },
                        { label: 'Nails', value: 'Nails' },
                        { label: 'Reception', value: 'Reception' },
                        { label: 'Administration', value: 'Administration' },
                    ]} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <Input type="number" label="Min Salary (EGP)" placeholder="0" value={formData.minSalary} onChange={e => setFormData({ ...formData, minSalary: e.target.value })} />
                        <Input type="number" label="Max Salary (EGP)" placeholder="0" value={formData.maxSalary} onChange={e => setFormData({ ...formData, maxSalary: e.target.value })} />
                    </div>
                </div>
            </SlideOver>

            {/* Edit SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedPos(null); }}
                title="Edit Position"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Position Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    <Select label="Level" value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} options={[
                        { label: 'Entry', value: 'Entry' },
                        { label: 'Junior', value: 'Junior' },
                        { label: 'Mid', value: 'Mid' },
                        { label: 'Senior', value: 'Senior' },
                        { label: 'Management', value: 'Management' },
                    ]} />
                    <Select label="Department" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} options={[
                        { label: 'Hair Styling', value: 'Hair Styling' },
                        { label: 'Skin Care', value: 'Skin Care' },
                        { label: 'Massage & Body', value: 'Massage & Body' },
                        { label: 'Nails', value: 'Nails' },
                        { label: 'Reception', value: 'Reception' },
                        { label: 'Administration', value: 'Administration' },
                    ]} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <Input type="number" label="Min Salary (EGP)" value={formData.minSalary} onChange={e => setFormData({ ...formData, minSalary: e.target.value })} />
                        <Input type="number" label="Max Salary (EGP)" value={formData.maxSalary} onChange={e => setFormData({ ...formData, maxSalary: e.target.value })} />
                    </div>
                </div>
            </SlideOver>

            {/* Delete Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedPos(null); }}
                title="Remove Position"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Remove Anyway</Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    Are you sure you want to remove the <strong>{selectedPos?.title}</strong> position? You cannot undo this action.
                </p>
            </Modal>
        </div>
    );
}
