'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, MoreVertical, Eye, Briefcase } from 'lucide-react';
import { SlideOver, Modal, Input, Select, Button, useToast, DropdownMenu, EmptyState } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

const initialDepartments = [
    { id: 1, name: 'Hair Styling', manager: 'Sara Ahmed', employees: 4, color: '#F59E0B', status: 'available' },
    { id: 2, name: 'Skin Care', manager: 'Nora Ali', employees: 3, color: '#EC4899', status: 'available' },
    { id: 3, name: 'Massage & Body', manager: 'Layla Hassan', employees: 2, color: '#10B981', status: 'available' },
    { id: 4, name: 'Nails', manager: 'Hana Youssef', employees: 2, color: '#3B82F6', status: 'available' },
    { id: 5, name: 'Reception', manager: 'Dina Nabil', employees: 2, color: '#8B5CF6', status: 'available' },
    { id: 6, name: 'Administration', manager: 'Sara Ahmed', employees: 1, color: '#6B7280', status: 'available' },
];

export default function DepartmentsPage() {
    const { t, lang } = useTranslation();
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
        if (!formData.name) return addToast('error', t('departments.toastReqName'));

        const newD = {
            id: departments.length + 1,
            name: formData.name,
            manager: formData.manager || t('departments.unassigned'),
            employees: newDeptStaff.length > 0 ? newDeptStaff.length : parseInt(formData.employees) || 0,
            color: formData.color,
            status: 'available'
        };

        setDepartments([...departments, newD]);
        setIsAddOpen(false);
        setFormData({ name: '', manager: '', employees: '', color: '#3B82F6' });
        setNewDeptStaff([]);
        addToast('success', t('departments.toastAddSuccess'));
    };

    const handleSaveEdit = () => {
        if (!formData.name) return addToast('error', t('departments.toastReqName'));

        setDepartments(departments.map(d => d.id === selectedDept.id ? {
            ...d,
            name: formData.name,
            manager: formData.manager,
            color: formData.color
        } : d));

        setIsEditOpen(false);
        setSelectedDept(null);
        addToast('success', t('departments.toastUpdateSuccess'));
    };

    const handleDelete = () => {
        setDepartments(departments.filter(d => d.id !== selectedDept.id));
        setIsDeleteOpen(false);
        setSelectedDept(null);
        addToast('success', t('departments.toastRemTitle'));
    };

    const handleRemoveStaff = (id: number) => {
        setStaffList(staffList.filter(s => s.id !== id));
        addToast('success', t('departments.toastStaffRem'));
    };

    const handleAddStaff = () => {
        if (!newStaffSelection) return addToast('error', t('departments.toastSelToAdd'));

        // Find existing to avoid duplicates in this mock
        if (staffList.find(s => s.name === newStaffSelection)) {
            return addToast('error', t('departments.toastAlreadyAssigned'));
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
        addToast('success', `${t('departments.toastAssignedPart1')}${newStaffSelection}${t('departments.toastAssignedPart2')}${selectedDept?.name}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{t('departments.title')}</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
                    <Search size={16} style={{ position: 'absolute', ...(lang === 'ar' ? { right: 12 } : { left: 12 }), top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        style={{ width: '100%', height: 40, ...(lang === 'ar' ? { paddingRight: 40, paddingLeft: 12 } : { paddingLeft: 40, paddingRight: 12 }), border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
                        placeholder={t('departments.search')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('departments.newDept')}
                </Button>
            </div>

            {filtered.length > 0 ? (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                {[{ label: t('departments.colDept'), key: 'dept' }, { label: t('departments.colManager'), key: 'manager' }, { label: t('departments.colStaffCount'), key: 'count' }, { label: t('departments.colStatus'), key: 'status' }, { label: t('departments.colActions'), key: 'actions' }].map(h =>
                                    <th key={h.key} style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', textAlign: lang === 'ar' ? 'right' : 'left' }}>{h.label}</th>
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} /> {d.employees} {t('departments.users')}</div>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-color)' }}>
                                        <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>{t('departments.active')}</span>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-color)' }}>
                                        <DropdownMenu
                                            trigger={
                                                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                                    <MoreVertical size={16} />
                                                </button>
                                            }
                                            items={[
                                                { label: t('departments.actionView'), icon: <Eye size={14} />, onClick: () => { setSelectedDept(d); setIsViewOpen(true); } },
                                                { label: t('departments.actionEdit'), icon: <Edit size={14} />, onClick: () => { setSelectedDept(d); setFormData({ name: d.name, manager: d.manager, employees: d.employees.toString(), color: d.color }); setIsEditOpen(true); } },
                                                { label: t('departments.actionDelete'), destructive: true, icon: <Trash2 size={14} />, onClick: () => { setSelectedDept(d); setIsDeleteOpen(true); } }
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
                <EmptyState icon={<Briefcase size={32} color="var(--text-tertiary)" />} title={t('departments.emptyTitle')} description={t('departments.emptyDesc')} />
            )}

            {/* Add SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('departments.addTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => { setIsAddOpen(false); setNewDeptStaff([]); }}>{t('departments.btnCancel')}</Button>
                        <Button onClick={handleSaveAdd}>{t('departments.btnCreate')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('departments.lblName')} placeholder={t('departments.phName')} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <Select
                        label={t('departments.lblManager')}
                        value={formData.manager}
                        onChange={e => setFormData({ ...formData, manager: e.target.value })}
                        options={[{ label: t('departments.unassigned'), value: '' }, ...availableStaffOptions]}
                    />
                    <Select label={t('departments.lblColor')} value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} options={[
                        { label: t('departments.colorAmber'), value: '#F59E0B' },
                        { label: t('departments.colorPink'), value: '#EC4899' },
                        { label: t('departments.colorEmerald'), value: '#10B981' },
                        { label: t('departments.colorBlue'), value: '#3B82F6' },
                        { label: t('departments.colorPurple'), value: '#8B5CF6' }
                    ]} />

                    <div style={{ borderTop: '1px solid var(--border-color)', margin: 'var(--space-2) 0' }} />

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{t('departments.assignStaff')}</h3>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <Select
                                    label=""
                                    value={newStaffSelection}
                                    onChange={e => setNewStaffSelection(e.target.value)}
                                    options={[{ label: t('departments.phEmployee'), value: '' }, ...availableStaffOptions]}
                                />
                            </div>
                            <Button variant="secondary" onClick={() => {
                                if (!newStaffSelection) return;
                                if (newDeptStaff.find(s => s.name === newStaffSelection)) return;
                                const roleExtracted = availableStaffOptions.find(o => o.value === newStaffSelection)?.label?.split('(')[1]?.replace(')', '') || 'Employee';
                                const initials = newStaffSelection.split(' ').map(n => n[0]).join('').toUpperCase();
                                setNewDeptStaff([...newDeptStaff, { id: Date.now(), name: newStaffSelection, role: roleExtracted, avatar: initials }]);
                                setNewStaffSelection('');
                            }}>{t('departments.btnAdd')}</Button>
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
                title={t('departments.editTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>{t('departments.btnCancel')}</Button>
                        <Button onClick={handleSaveEdit}>{t('departments.btnSave')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('departments.lblName')} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <Select
                        label={t('departments.lblManager')}
                        value={formData.manager}
                        onChange={e => setFormData({ ...formData, manager: e.target.value })}
                        options={[{ label: t('departments.unassigned'), value: '' }, ...availableStaffOptions]}
                    />
                    <Select label={t('departments.lblColor')} value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} options={[
                        { label: t('departments.colorAmber'), value: '#F59E0B' },
                        { label: t('departments.colorPink'), value: '#EC4899' },
                        { label: t('departments.colorEmerald'), value: '#10B981' },
                        { label: t('departments.colorBlue'), value: '#3B82F6' },
                        { label: t('departments.colorPurple'), value: '#8B5CF6' }
                    ]} />
                </div>
            </SlideOver>

            {/* View SlideOver */}
            <SlideOver
                open={isViewOpen}
                onClose={() => { setIsViewOpen(false); setSelectedDept(null); }}
                title={t('departments.viewTitle')}
            >
                {selectedDept && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: selectedDept.color, opacity: 0.1, position: 'relative' }}>
                                <Briefcase size={20} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: selectedDept.color }} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{selectedDept.name}</h2>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{selectedDept.employees} {t('departments.activeStaff')}</p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)' }} />

                        <div>
                            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>{t('departments.mgtInfo')}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{t('departments.colManager')}</span>
                                    <span style={{ fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }}>{selectedDept.manager}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{t('departments.colStatus')}</span>
                                    <span style={{ color: 'var(--color-success)', fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }}>{t('departments.active')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{t('departments.payrollTag')}</span>
                                    <span style={{ fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }}>{selectedDept.name.substring(0, 3).toUpperCase()}-XX</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)' }} />

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{t('departments.assignedStaff')} ({staffList.length})</h3>
                                <Button variant="secondary" onClick={() => setIsAddStaffOpen(true)}>
                                    <Plus size={14} style={{ ...(lang === 'ar' ? { marginLeft: 4 } : { marginRight: 4 }) }} /> {t('departments.btnAddStaff')}
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
                                                title={t('departments.removeStaffTitle')}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-error)' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={<Users size={24} color="var(--text-tertiary)" />} title={t('departments.emptyStaffTitle')} description={t('departments.emptyStaffDesc')} />
                            )}
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* Delete Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedDept(null); }}
                title={t('departments.delTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>{t('departments.btnCancel')}</Button>
                        <Button variant="destructive" onClick={handleDelete}>{t('departments.btnRemoveAnyway')}</Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    {t('departments.delConfirmMsg1')}<strong>{selectedDept?.name}</strong>{t('departments.delConfirmMsg2')}
                </p>
            </Modal>

            {/* Add Staff Modal */}
            <Modal
                open={isAddStaffOpen}
                onClose={() => { setIsAddStaffOpen(false); setNewStaffSelection(''); }}
                title={`${t('departments.addStaffModalTitle')} ${selectedDept?.name || 'Department'}`}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => { setIsAddStaffOpen(false); setNewStaffSelection(''); }}>{t('departments.btnCancel')}</Button>
                        <Button onClick={handleAddStaff}>{t('departments.btnAssignMember')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                        {t('departments.addStaffHint')}
                    </p>
                    <Select
                        label={t('departments.lblAvailableEmp')}
                        value={newStaffSelection}
                        onChange={e => setNewStaffSelection(e.target.value)}
                        options={[{ label: t('departments.phEmployee'), value: '' }, ...availableStaffOptions]}
                    />
                </div>
            </Modal>
        </div>
    );
}
