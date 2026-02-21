'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, MoreVertical, Eye, Briefcase } from 'lucide-react';
import { SlideOver, Modal, Input, Select, Button, useToast, DropdownMenu, EmptyState } from '@/components/ui';

const initialDepartments = [
    { id: 1, name: 'Hair Styling', manager: 'Sara Ahmed', employees: 4, color: '#F59E0B', status: 'available' },
    { id: 2, name: 'Skin Care', manager: 'Nora Ali', employees: 3, color: '#EC4899', status: 'available' },
    { id: 3, name: 'Massage & Body', manager: 'Layla Hassan', employees: 2, color: '#10B981', status: 'available' },
    { id: 4, name: 'Nails', manager: 'Hana Youssef', employees: 2, color: '#3B82F6', status: 'available' },
    { id: 5, name: 'Reception', manager: 'Dina Nabil', employees: 2, color: '#8B5CF6', status: 'available' },
    { id: 6, name: 'Administration', manager: 'Sara Ahmed', employees: 1, color: '#6B7280', status: 'available' },
];

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState(initialDepartments);
    const [search, setSearch] = useState('');
    const { addToast } = useToast();

    // Modals state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState<any>(null);

    // Mock staff data for details view
    const [staffList, setStaffList] = useState([
        { id: 1, name: 'Sara Ahmed', role: 'Senior Stylist', avatar: 'SA' },
        { id: 2, name: 'Nora Ali', role: 'Stylist', avatar: 'NA' },
        { id: 3, name: 'Layla Hassan', role: 'Junior Stylist', avatar: 'LH' }
    ]);

    // Form state
    const [formData, setFormData] = useState({ name: '', manager: '', employees: '', color: '#3B82F6' });
    const [newStaffSelection, setNewStaffSelection] = useState<string>('');
    const [newDeptStaff, setNewDeptStaff] = useState<any[]>([]);

    const availableStaffOptions = [
        { label: 'Farida Sayed (Stylist)', value: 'Farida Sayed' },
        { label: 'Kareem Tarek (Barber)', value: 'Kareem Tarek' },
        { label: 'Yasmin Omar (Therapist)', value: 'Yasmin Omar' },
        { label: 'Omar Khaled (Junior Stylist)', value: 'Omar Khaled' }
    ];

    const filtered = departments.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

    const handleSaveAdd = () => {
        if (!formData.name) return addToast('error', 'Department name is required');

        const newD = {
            id: departments.length + 1,
            name: formData.name,
            manager: formData.manager || 'Unassigned',
            employees: newDeptStaff.length > 0 ? newDeptStaff.length : parseInt(formData.employees) || 0,
            color: formData.color,
            status: 'available'
        };

        setDepartments([...departments, newD]);
        setIsAddOpen(false);
        setFormData({ name: '', manager: '', employees: '', color: '#3B82F6' });
        setNewDeptStaff([]);
        addToast('success', 'Department added successfully');
    };

    const handleSaveEdit = () => {
        if (!formData.name) return addToast('error', 'Department name is required');

        setDepartments(departments.map(d => d.id === selectedDept.id ? {
            ...d,
            name: formData.name,
            manager: formData.manager,
            color: formData.color
        } : d));

        setIsEditOpen(false);
        setSelectedDept(null);
        addToast('success', 'Department updated successfully');
    };

    const handleDelete = () => {
        setDepartments(departments.filter(d => d.id !== selectedDept.id));
        setIsDeleteOpen(false);
        setSelectedDept(null);
        addToast('success', 'Department removed successfully');
    };

    const handleRemoveStaff = (id: number) => {
        setStaffList(staffList.filter(s => s.id !== id));
        addToast('success', 'Staff member removed from department');
    };

    const handleAddStaff = () => {
        if (!newStaffSelection) return addToast('error', 'Please select a staff member to assign.');

        // Find existing to avoid duplicates in this mock
        if (staffList.find(s => s.name === newStaffSelection)) {
            return addToast('error', 'This staff member is already assigned to the department.');
        }

        const roleExtracted = availableStaffOptions.find(o => o.value === newStaffSelection)?.label.split('(')[1].replace(')', '') || 'Employee';
        const initials = newStaffSelection.split(' ').map(n => n[0]).join('').toUpperCase();

        const newStaffMember = {
            id: Date.now(), // timestamp mock ID
            name: newStaffSelection,
            role: roleExtracted,
            avatar: initials
        };

        setStaffList([...staffList, newStaffMember]);
        setNewStaffSelection('');
        setIsAddStaffOpen(false);
        addToast('success', `${newStaffSelection} successfully assigned to ${selectedDept?.name}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Departments</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        style={{ width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
                        placeholder="Search departments..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus size={16} style={{ marginRight: 8 }} /> New Department
                </Button>
            </div>

            {filtered.length > 0 ? (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                {['Department', 'Manager', 'Staff Count', 'Status', 'Actions'].map(h =>
                                    <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(d => (
                                <tr key={d.id} className="hoverRow">
                                    <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', fontWeight: 'var(--font-medium)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <span style={{ width: 10, height: 10, borderRadius: '50%', display: 'inline-block', background: d.color }} />
                                            {d.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>{d.manager}</td>
                                    <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} /> {d.employees} Users</div>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-color)' }}>
                                        <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>Active</span>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-color)' }}>
                                        <DropdownMenu
                                            trigger={
                                                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                                    <MoreVertical size={16} />
                                                </button>
                                            }
                                            items={[
                                                { label: 'View Details', icon: <Eye size={14} />, onClick: () => { setSelectedDept(d); setIsViewOpen(true); } },
                                                { label: 'Edit Department', icon: <Edit size={14} />, onClick: () => { setSelectedDept(d); setFormData({ name: d.name, manager: d.manager, employees: d.employees.toString(), color: d.color }); setIsEditOpen(true); } },
                                                { label: 'Delete', destructive: true, icon: <Trash2 size={14} />, onClick: () => { setSelectedDept(d); setIsDeleteOpen(true); } }
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <style>{`
                        .hoverRow:hover { background-color: var(--bg-secondary); }
                        .hoverRow:last-child td { border-bottom: none !important; }
                    `}</style>
                </div>
            ) : (
                <EmptyState icon={<Briefcase size={32} color="var(--text-tertiary)" />} title="No departments found" description="We couldn't find any departments matching your search." />
            )}

            {/* Add SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create Department"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => { setIsAddOpen(false); setNewDeptStaff([]); }}>Cancel</Button>
                        <Button onClick={handleSaveAdd}>Create Department</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Department Name" placeholder="e.g. Laser Therapy" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <Select
                        label="Head Manager"
                        value={formData.manager}
                        onChange={e => setFormData({ ...formData, manager: e.target.value })}
                        options={[{ label: 'Unassigned', value: '' }, ...availableStaffOptions]}
                    />
                    <Select label="Label Color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} options={[
                        { label: 'Amber', value: '#F59E0B' },
                        { label: 'Pink', value: '#EC4899' },
                        { label: 'Emerald', value: '#10B981' },
                        { label: 'Blue', value: '#3B82F6' },
                        { label: 'Purple', value: '#8B5CF6' }
                    ]} />

                    <div style={{ borderTop: '1px solid var(--border-color)', margin: 'var(--space-2) 0' }} />

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>Assign Staff</h3>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <Select
                                    label=""
                                    value={newStaffSelection}
                                    onChange={e => setNewStaffSelection(e.target.value)}
                                    options={[{ label: 'Select employee...', value: '' }, ...availableStaffOptions]}
                                />
                            </div>
                            <Button variant="secondary" onClick={() => {
                                if (!newStaffSelection) return;
                                if (newDeptStaff.find(s => s.name === newStaffSelection)) return;
                                const roleExtracted = availableStaffOptions.find(o => o.value === newStaffSelection)?.label?.split('(')[1]?.replace(')', '') || 'Employee';
                                const initials = newStaffSelection.split(' ').map(n => n[0]).join('').toUpperCase();
                                setNewDeptStaff([...newDeptStaff, { id: Date.now(), name: newStaffSelection, role: roleExtracted, avatar: initials }]);
                                setNewStaffSelection('');
                            }}>Add</Button>
                        </div>

                        {newDeptStaff.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                                {newDeptStaff.map(staff => (
                                    <div key={staff.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'var(--font-bold)' }}>
                                                {staff.avatar}
                                            </div>
                                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{staff.name}</div>
                                        </div>
                                        <Trash2 size={14} style={{ cursor: 'pointer', color: 'var(--color-error)' }} onClick={() => setNewDeptStaff(newDeptStaff.filter(s => s.id !== staff.id))} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SlideOver>

            {/* Edit SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedDept(null); }}
                title="Edit Department"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Department Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <Select
                        label="Head Manager"
                        value={formData.manager}
                        onChange={e => setFormData({ ...formData, manager: e.target.value })}
                        options={[{ label: 'Unassigned', value: '' }, ...availableStaffOptions]}
                    />
                    <Select label="Label Color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} options={[
                        { label: 'Amber', value: '#F59E0B' },
                        { label: 'Pink', value: '#EC4899' },
                        { label: 'Emerald', value: '#10B981' },
                        { label: 'Blue', value: '#3B82F6' },
                        { label: 'Purple', value: '#8B5CF6' }
                    ]} />
                </div>
            </SlideOver>

            {/* View SlideOver */}
            <SlideOver
                open={isViewOpen}
                onClose={() => { setIsViewOpen(false); setSelectedDept(null); }}
                title="Department Details"
            >
                {selectedDept && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: selectedDept.color, opacity: 0.1, position: 'relative' }}>
                                <Briefcase size={20} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: selectedDept.color }} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{selectedDept.name}</h2>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{selectedDept.employees} Active Staff Members</p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)' }} />

                        <div>
                            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>Management Information</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>Manager</span>
                                    <span style={{ fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }}>{selectedDept.manager}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>Status</span>
                                    <span style={{ color: 'var(--color-success)', fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }}>Active</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>Payroll Tag</span>
                                    <span style={{ fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }}>{selectedDept.name.substring(0, 3).toUpperCase()}-XX</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)' }} />

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>Assigned Staff ({staffList.length})</h3>
                                <Button variant="secondary" onClick={() => setIsAddStaffOpen(true)}>
                                    <Plus size={14} style={{ marginRight: 4 }} /> Add Staff
                                </Button>
                            </div>

                            {staffList.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    {staffList.map(staff => (
                                        <div key={staff.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)' }}>
                                                    {staff.avatar}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>{staff.name}</div>
                                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{staff.role}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveStaff(staff.id)}
                                                title="Remove from Department"
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-error)' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={<Users size={24} color="var(--text-tertiary)" />} title="No staff assigned" description="There are currently no employees in this department." />
                            )}
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* Delete Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedDept(null); }}
                title="Remove Department"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Remove Anyway</Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    Are you sure you want to remove the <strong>{selectedDept?.name}</strong> department? This will not delete the employees assigned to this group, but it will un-categorize them.
                </p>
            </Modal>

            {/* Add Staff Modal */}
            <Modal
                open={isAddStaffOpen}
                onClose={() => { setIsAddStaffOpen(false); setNewStaffSelection(''); }}
                title={`Assign Staff to ${selectedDept?.name || 'Department'}`}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => { setIsAddStaffOpen(false); setNewStaffSelection(''); }}>Cancel</Button>
                        <Button onClick={handleAddStaff}>Assign Member</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                        Select an existing unassigned employee to move them into this department.
                    </p>
                    <Select
                        label="Available Employees"
                        value={newStaffSelection}
                        onChange={e => setNewStaffSelection(e.target.value)}
                        options={[{ label: 'Select down...', value: '' }, ...availableStaffOptions]}
                    />
                </div>
            </Modal>
        </div>
    );
}
