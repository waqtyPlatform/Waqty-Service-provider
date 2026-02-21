'use client';

import React, { useState } from 'react';
import { ArrowRightLeft, Search, Edit, Trash2, Plus, Filter } from 'lucide-react';
import { SlideOver, Modal, Input, Select, Button, useToast, DropdownMenu, EmptyState } from '@/components/ui';

const initialData = [
    { id: 'TR-001', date: '2026-02-15', employee: 'Maya Adel', from: 'Mall of Arabia', to: 'Downtown Branch', type: 'Permanent', status: 'completed', until: '' },
    { id: 'TR-002', date: '2026-02-10', employee: 'Rana Fawzy', from: 'Downtown Branch', to: 'New Cairo Branch', type: 'Temporary', status: 'active', until: '2026-03-10' },
    { id: 'TR-003', date: '2026-01-28', employee: 'Salma Karim', from: 'New Cairo Branch', to: 'Mall of Arabia', type: 'Permanent', status: 'completed', until: '' },
    { id: 'TR-004', date: '2026-01-15', employee: 'Nadia Omar', from: 'Downtown Branch', to: 'New Cairo Branch', type: 'Permanent', status: 'completed', until: '' },
    { id: 'TR-005', date: '2026-02-17', employee: 'Yara Emad', from: 'New Cairo Branch', to: 'Downtown Branch', type: 'Temporary', status: 'pending', until: '2026-02-24' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
    completed: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    active: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    pending: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
};

const employeesByBranch: Record<string, string[]> = {
    'Downtown Branch': ['Maya Adel', 'Rana Fawzy', 'Nadia Omar'],
    'Mall of Arabia': ['Khaled Mostafa', 'Salma Karim', 'Tarek Ziad'],
    'New Cairo Branch': ['Yara Emad', 'Ahmed Hassan', 'Dina Nabil'],
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' },
    filterGroup: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 },
    searchBox: { position: 'relative', width: '100%', maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)', textTransform: 'capitalize' },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
};

export default function TransfersPage() {
    const [transfers, setTransfers] = useState(initialData);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const { addToast } = useToast();

    // Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState<any>(null);

    // Form
    const [formData, setFormData] = useState({
        employee: '', date: '', from: 'Downtown Branch', to: 'Mall of Arabia', type: 'Permanent', status: 'pending', until: ''
    });

    const filtered = transfers.filter(t => {
        const matchesSearch = t.employee.toLowerCase().includes(search.toLowerCase()) ||
            t.id.toLowerCase().includes(search.toLowerCase()) ||
            t.from.toLowerCase().includes(search.toLowerCase()) ||
            t.to.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || t.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleSaveAdd = () => {
        if (!formData.employee) return addToast('error', 'Employee name is required.');
        if (!formData.date) return addToast('error', 'Transfer date is required.');

        const newTransfer = {
            id: `TR-${Date.now().toString().slice(-4)}`,
            employee: formData.employee,
            date: formData.date,
            from: formData.from,
            to: formData.to,
            type: formData.type,
            status: formData.status,
            until: formData.type === 'Temporary' ? formData.until : ''
        };
        setTransfers([newTransfer, ...transfers]);
        setIsAddOpen(false);
        setFormData({ employee: '', date: '', from: 'Downtown Branch', to: 'Mall of Arabia', type: 'Permanent', status: 'pending', until: '' });
        addToast('success', 'Transfer request created successfully');
    };

    const handleSaveEdit = () => {
        if (!formData.employee) return addToast('error', 'Employee name is required.');
        setTransfers(transfers.map(t => t.id === selectedTransfer.id ? {
            ...t,
            employee: formData.employee,
            date: formData.date,
            from: formData.from,
            to: formData.to,
            type: formData.type,
            status: formData.status,
            until: formData.type === 'Temporary' ? formData.until : ''
        } : t));
        setIsEditOpen(false);
        setSelectedTransfer(null);
        addToast('success', 'Transfer updated successfully');
    };

    const handleDelete = () => {
        setTransfers(transfers.filter(t => t.id !== selectedTransfer.id));
        setIsDeleteOpen(false);
        setSelectedTransfer(null);
        addToast('success', 'Transfer log deleted successfully');
    };

    const openEdit = (t: any) => {
        setSelectedTransfer(t);
        setFormData({
            employee: t.employee,
            date: t.date,
            from: t.from,
            to: t.to,
            type: t.type,
            status: t.status,
            until: t.until || ''
        });
        setIsEditOpen(true);
    };

    return (
        <div style={s.page}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Employee Transfers</div>

            <div style={s.toolbar}>
                <div style={s.filterGroup as React.CSSProperties}>
                    <div style={s.searchBox as React.CSSProperties}>
                        <Search size={16} style={s.searchIcon as React.CSSProperties} />
                        <input style={s.searchInput} placeholder="Search transfers..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <Select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        options={[
                            { label: 'All Statuses', value: 'All' },
                            { label: 'Pending', value: 'pending' },
                            { label: 'Active', value: 'active' },
                            { label: 'Completed', value: 'completed' },
                        ]}
                        style={{ width: 160 }}
                    />
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus size={16} style={{ marginRight: 8 }} /> New Transfer
                </Button>
            </div>

            {filtered.length > 0 ? (
                <table style={s.table}>
                    <thead>
                        <tr>
                            {['ID', 'Date', 'Employee', 'From Branch', '', 'To Branch', 'Type', 'Status', 'Actions'].map((h, i) =>
                                <th key={i} style={s.th as React.CSSProperties}>{h}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(row => (
                            <tr key={row.id} className="hoverRow">
                                <td style={s.td}>{row.id}</td>
                                <td style={s.td}>{row.date}</td>
                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>{row.employee}</td>
                                <td style={s.td}>{row.from}</td>
                                <td style={s.td}><ArrowRightLeft size={14} style={{ color: 'var(--text-tertiary)' }} /></td>
                                <td style={s.td}>{row.to}</td>
                                <td style={s.td}>
                                    <span style={{ ...s.badge, background: row.type === 'Permanent' ? 'var(--color-primary-50)' : 'var(--color-warning-light)', color: row.type === 'Permanent' ? 'var(--color-primary-600)' : 'var(--color-warning)' }}>
                                        {row.type} {row.type === 'Temporary' && row.until && ` (Until ${row.until})`}
                                    </span>
                                </td>
                                <td style={s.td}><span style={{ ...s.badge, ...statusColors[row.status] }}>{row.status}</span></td>
                                <td style={s.td}>
                                    <div style={s.actions}>
                                        <button style={s.btnIcon} onClick={() => openEdit(row)} title="Edit Transfer">
                                            <Edit size={14} />
                                        </button>
                                        <button style={{ ...s.btnIcon, color: 'var(--color-error)' }} onClick={() => { setSelectedTransfer(row); setIsDeleteOpen(true); }} title="Delete Transfer">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <EmptyState icon={<ArrowRightLeft size={32} color="var(--text-tertiary)" />} title="No transfers found" description="Adjust your filters or search query to find what you're looking for." />
            )}

            <style>{`
                .hoverRow:hover { background-color: var(--bg-secondary); }
                .hoverRow:last-child td { border-bottom: none !important; }
            `}</style>

            {/* Add SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="New Employee Transfer"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveAdd}>Submit Transfer</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <Select label="Origin Branch" value={formData.from} onChange={e => setFormData({ ...formData, from: e.target.value, employee: '' })} options={[
                            { label: 'Downtown Branch', value: 'Downtown Branch' },
                            { label: 'Mall of Arabia', value: 'Mall of Arabia' },
                            { label: 'New Cairo Branch', value: 'New Cairo Branch' },
                        ]} />
                        <Select label="Destination Branch" value={formData.to} onChange={e => setFormData({ ...formData, to: e.target.value })} options={[
                            { label: 'Downtown Branch', value: 'Downtown Branch' },
                            { label: 'Mall of Arabia', value: 'Mall of Arabia' },
                            { label: 'New Cairo Branch', value: 'New Cairo Branch' },
                        ]} />
                    </div>
                    <Select
                        label="Employee Name"
                        value={formData.employee}
                        onChange={e => setFormData({ ...formData, employee: e.target.value })}
                        options={formData.from && employeesByBranch[formData.from]
                            ? [{ label: 'Select employee...', value: '' }, ...employeesByBranch[formData.from].map(emp => ({ label: emp, value: emp }))]
                            : [{ label: 'Select Origin Branch first', value: '' }]
                        }
                    />
                    <Input type="date" label="Transfer Date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                    <Select label="Transfer Type" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} options={[
                        { label: 'Permanent', value: 'Permanent' },
                        { label: 'Temporary', value: 'Temporary' }
                    ]} />
                    {formData.type === 'Temporary' && (
                        <Input type="date" label="Return Date (Until)" value={formData.until} onChange={e => setFormData({ ...formData, until: e.target.value })} />
                    )}
                    <Select label="Status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} options={[
                        { label: 'Pending', value: 'pending' },
                        { label: 'Active', value: 'active' },
                        { label: 'Completed', value: 'completed' },
                    ]} />
                </div>
            </SlideOver>

            {/* Edit SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedTransfer(null); }}
                title="Edit Transfer Request"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <Select label="Origin Branch" value={formData.from} onChange={e => setFormData({ ...formData, from: e.target.value, employee: '' })} options={[
                            { label: 'Downtown Branch', value: 'Downtown Branch' },
                            { label: 'Mall of Arabia', value: 'Mall of Arabia' },
                            { label: 'New Cairo Branch', value: 'New Cairo Branch' },
                        ]} />
                        <Select label="Destination Branch" value={formData.to} onChange={e => setFormData({ ...formData, to: e.target.value })} options={[
                            { label: 'Downtown Branch', value: 'Downtown Branch' },
                            { label: 'Mall of Arabia', value: 'Mall of Arabia' },
                            { label: 'New Cairo Branch', value: 'New Cairo Branch' },
                        ]} />
                    </div>
                    <Select
                        label="Employee Name"
                        value={formData.employee}
                        onChange={e => setFormData({ ...formData, employee: e.target.value })}
                        options={formData.from && employeesByBranch[formData.from]
                            ? [{ label: 'Select employee...', value: '' }, ...employeesByBranch[formData.from].map(emp => ({ label: emp, value: emp }))]
                            : [{ label: 'Select Origin Branch first', value: '' }]
                        }
                    />
                    <Input type="date" label="Transfer Date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                    <Select label="Transfer Type" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} options={[
                        { label: 'Permanent', value: 'Permanent' },
                        { label: 'Temporary', value: 'Temporary' }
                    ]} />
                    {formData.type === 'Temporary' && (
                        <Input type="date" label="Return Date (Until)" value={formData.until} onChange={e => setFormData({ ...formData, until: e.target.value })} />
                    )}
                    <Select label="Status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} options={[
                        { label: 'Pending', value: 'pending' },
                        { label: 'Active', value: 'active' },
                        { label: 'Completed', value: 'completed' },
                    ]} />
                </div>
            </SlideOver>

            {/* Delete Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedTransfer(null); }}
                title="Delete Transfer Record"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete Permanently</Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    Are you sure you want to delete the transfer record for <strong>{selectedTransfer?.employee}</strong> ({selectedTransfer?.id})? This action cannot be undone.
                </p>
            </Modal>
        </div>
    );
}
