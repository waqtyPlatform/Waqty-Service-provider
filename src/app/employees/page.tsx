'use client';

import React, { useState } from 'react';
import { Search, Users, UserPlus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { EmptyState, DropdownMenu, useToast, SlideOver, Modal, Input, Select, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import styles from './employees.module.css';

const initialEmployees = [
    { id: 'E001', name: 'Sara Ahmed', role: 'Senior Stylist', phone: '+20 123 456 789', email: 'sara.a@hagzy.com', branch: 'Downtown', status: 'available', bookingsToday: 7, rating: 4.9, revenue: 14200, avatar: 'SA', color: '#8B5CF6' },
    { id: 'E002', name: 'Nora Ali', role: 'Skin Specialist', phone: '+20 111 222 333', email: 'nora.a@hagzy.com', branch: 'Downtown', status: 'in-session', bookingsToday: 6, rating: 4.8, revenue: 12800, avatar: 'NA', color: '#EC4899' },
    { id: 'E003', name: 'Layla Hassan', role: 'Senior Therapist', phone: '+20 100 200 300', email: 'layla.h@hagzy.com', branch: 'Downtown', status: 'available', bookingsToday: 8, rating: 4.9, revenue: 11500, avatar: 'LH', color: '#3B82F6' },
    { id: 'E004', name: 'Reem Mohamed', role: 'Massage Therapist', phone: '+20 155 666 777', email: 'reem.m@hagzy.com', branch: 'Downtown', status: 'break', bookingsToday: 5, rating: 4.7, revenue: 9800, avatar: 'RM', color: '#10B981' },
    { id: 'E005', name: 'Hana Youssef', role: 'Nail Technician', phone: '+20 199 888 999', email: 'hana.y@hagzy.com', branch: 'Downtown', status: 'available', bookingsToday: 4, rating: 4.6, revenue: 8100, avatar: 'HY', color: '#F59E0B' },
    { id: 'E006', name: 'Dina Kamal', role: 'Junior Stylist', phone: '+20 144 555 666', email: 'dina.k@hagzy.com', branch: 'Mall of Arabia', status: 'off', bookingsToday: 0, rating: 4.5, revenue: 5400, avatar: 'DK', color: '#6366F1' },
];

const statusMap: Record<string, { label: string; bg: string; color: string }> = {
    available: { label: 'Available', bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    'in-session': { label: 'In Session', bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    break: { label: 'On Break', bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    off: { label: 'Day Off', bg: 'var(--color-gray-100)', color: 'var(--color-gray-500)' },
};

export default function EmployeesPage() {
    const [empList, setEmpList] = useState(initialEmployees);
    const [search, setSearch] = useState('');
    const router = useRouter();
    const { addToast } = useToast();

    // CRUD state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Form state for add
    const [newEmp, setNewEmp] = useState({ fname: '', lname: '', phone: '', email: '', role: 'employee', jobTitle: 'Junior Stylist', branch: 'Downtown' });

    const filtered = empList.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.role.toLowerCase().includes(search.toLowerCase())
    );

    React.useEffect(() => {
        const handleOpenAdd = () => setIsAddOpen(true);
        window.addEventListener('openAddEmployee', handleOpenAdd);
        return () => window.removeEventListener('openAddEmployee', handleOpenAdd);
    }, []);

    const handleSaveAdd = () => {
        if (!newEmp.fname || !newEmp.lname) return addToast('error', 'First and Last name are required');

        const generatedAvatar = `${newEmp.fname.charAt(0)}${newEmp.lname.charAt(0)}`.toUpperCase();
        const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const added: any = {
            id: `E00${empList.length + 1}`,
            name: `${newEmp.fname} ${newEmp.lname}`,
            role: newEmp.jobTitle,
            phone: newEmp.phone,
            email: newEmp.email,
            branch: newEmp.branch,
            status: 'off',
            bookingsToday: 0,
            rating: 5.0,
            revenue: 0,
            avatar: generatedAvatar,
            color: randomColor
        };

        setEmpList([...empList, added]);
        setIsAddOpen(false);
        setNewEmp({ fname: '', lname: '', phone: '', email: '', role: 'employee', jobTitle: 'Junior Stylist', branch: 'Downtown' });
        addToast('success', 'User credentials generated and employee added');
    };

    const handleDelete = () => {
        setEmpList(empList.filter(e => e.id !== selectedEmp?.id));
        setIsDeleteOpen(false);
        addToast('success', 'Employee removed securely');
    };



    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div className={styles.searchContainer}>
                <div style={{ position: 'relative', maxWidth: '320px', width: '100%' }}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {filtered.length > 0 ? (
                <div className={styles.grid}>
                    {filtered.map((emp) => {
                        const st = statusMap[emp.status];
                        return (
                            <div
                                key={emp.id}
                                className={styles.card}
                                onClick={() => router.push(`/employees/${emp.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={styles.cardTop}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar} style={{ background: emp.color }}>{emp.avatar}</div>
                                        <div>
                                            <div className={styles.name}>{emp.name}</div>
                                            <div className={styles.role}>{emp.role}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <span className={styles.statusBadge} style={{ background: st.bg, color: st.color }}>
                                            {st.label}
                                        </span>
                                        <DropdownMenu
                                            trigger={
                                                <button
                                                    className={styles.actionBtn}
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                            }
                                            items={[
                                                { label: 'View Schedule', icon: <Users size={14} />, onClick: () => router.push(`/employees/${emp.id}`) },
                                                { label: 'Edit', icon: <Edit size={14} />, onClick: () => { setSelectedEmp(emp); setIsEditOpen(true); } },
                                                { label: 'Delete', destructive: true, icon: <Trash2 size={14} />, onClick: () => { setSelectedEmp(emp); setIsDeleteOpen(true); } }
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className={styles.contactInfo}>
                                    {emp.branch} Branch • {emp.phone}
                                </div>
                                <div className={styles.statsRow}>
                                    <div className={styles.statItem}>
                                        <div className={styles.statVal}>{emp.bookingsToday}</div>
                                        <div className={styles.statLabel}>Today</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statVal} style={{ color: '#F59E0B' }}>★ {emp.rating}</div>
                                        <div className={styles.statLabel}>Rating</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statVal} style={{ color: 'var(--color-primary-600)' }}>{(emp.revenue / 1000).toFixed(1)}K</div>
                                        <div className={styles.statLabel}>Revenue</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ padding: 'var(--space-12) 0' }}>
                    <EmptyState
                        icon={<Users size={32} color="var(--text-tertiary)" />}
                        title="No employees found"
                        description="We couldn't find any employees matching your search criteria."
                    />
                </div>
            )}

            {/* Add Employee SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Add New Employee"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveAdd}>Save Employee</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input label="First Name" placeholder="e.g. Sara" value={newEmp.fname} onChange={e => setNewEmp({ ...newEmp, fname: e.target.value })} />
                        <Input label="Last Name" placeholder="e.g. Ahmed" value={newEmp.lname} onChange={e => setNewEmp({ ...newEmp, lname: e.target.value })} />
                    </div>
                    <Input label="Phone Number" placeholder="+20 1XX XXX XXXX" value={newEmp.phone} onChange={e => setNewEmp({ ...newEmp, phone: e.target.value })} />
                    <Input label="Email Address" type="email" placeholder="employee@hagzy.com" value={newEmp.email} onChange={e => setNewEmp({ ...newEmp, email: e.target.value })} />

                    <div style={{ borderTop: '1px solid var(--border-color)', margin: 'var(--space-2) 0' }} />
                    <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: '-4px' }}>Job Details</h3>

                    <Select
                        label="Job Title"
                        value={newEmp.jobTitle}
                        onChange={e => setNewEmp({ ...newEmp, jobTitle: e.target.value })}
                        options={[
                            { label: 'Senior Stylist', value: 'Senior Stylist' },
                            { label: 'Junior Stylist', value: 'Junior Stylist' },
                            { label: 'Skin Specialist', value: 'Skin Specialist' },
                            { label: 'Massage Therapist', value: 'Massage Therapist' },
                            { label: 'Nail Technician', value: 'Nail Technician' }
                        ]}
                    />
                    <Select
                        label="Branch"
                        value={newEmp.branch}
                        onChange={e => setNewEmp({ ...newEmp, branch: e.target.value })}
                        options={[
                            { label: 'Downtown', value: 'Downtown' },
                            { label: 'Mall of Arabia', value: 'Mall of Arabia' },
                            { label: 'New Cairo', value: 'New Cairo' }
                        ]}
                    />
                    <Input label="Base Salary (EGP)" type="number" placeholder="0" />
                </div>
            </SlideOver>
            {/* Edit Employee SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedEmp(null); }}
                title="Edit Employee Detail"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Employee details updated'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedEmp && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Full Name" defaultValue={selectedEmp.name} />
                        <Input label="Email Address" type="email" defaultValue={`${selectedEmp.name.split(' ')[0].toLowerCase()}@example.com`} />
                        <Input label="Phone Number" defaultValue={selectedEmp.phone} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <Select label="System Role" defaultValue="employee" options={[
                                { label: 'Admin', value: 'admin' },
                                { label: 'Branch Manager', value: 'manager' },
                                { label: 'Cashier', value: 'cashier' },
                                { label: 'Base Employee', value: 'employee' }
                            ]} />
                            <Select label="Job Title" defaultValue={selectedEmp.role} options={[
                                { label: 'Senior Stylist', value: 'Senior Stylist' },
                                { label: 'Junior Stylist', value: 'Junior Stylist' },
                                { label: 'Skin Specialist', value: 'Skin Specialist' },
                                { label: 'Massage Therapist', value: 'Massage Therapist' },
                                { label: 'Nail Technician', value: 'Nail Technician' }
                            ]} />
                        </div>
                        <Select label="Branch" defaultValue={selectedEmp.branch} options={[
                            { label: 'Downtown', value: 'Downtown' },
                            { label: 'Mall of Arabia', value: 'Mall of Arabia' },
                            { label: 'New Cairo', value: 'New Cairo' }
                        ]} />
                    </div>
                )}
            </SlideOver>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedEmp(null); }}
                title="Remove Employee"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Confirm Removal</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to remove <strong>{selectedEmp?.name}</strong>? This will revoke their platform access immediately and detach them from future active bookings.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
