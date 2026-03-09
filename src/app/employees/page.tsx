'use client';

import React, { useState } from 'react';
import { Search, Users, MoreVertical, Edit, Trash2, Mail, Copy } from 'lucide-react';
import { EmptyState, DropdownMenu, useToast, SlideOver, Modal, Input, Select, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import styles from './employees.module.css';
import { useTranslation } from '@/hooks/useTranslation';

const initialEmployees = [
    { id: 'E001', name: 'Sara Ahmed', role: 'Senior Stylist', phone: '+20 123 456 789', email: 'sara.a@hagzy.com', branch: 'Downtown', status: 'available', bookingsToday: 7, rating: 4.9, revenue: 14200, avatar: 'SA', color: '#8B5CF6', appAccess: true },
    { id: 'E002', name: 'Nora Ali', role: 'Skin Specialist', phone: '+20 111 222 333', email: 'nora.a@hagzy.com', branch: 'Downtown', status: 'in-session', bookingsToday: 6, rating: 4.8, revenue: 12800, avatar: 'NA', color: '#EC4899', appAccess: true },
    { id: 'E003', name: 'Layla Hassan', role: 'Senior Therapist', phone: '+20 100 200 300', email: 'layla.h@hagzy.com', branch: 'Downtown', status: 'available', bookingsToday: 8, rating: 4.9, revenue: 11500, avatar: 'LH', color: '#3B82F6', appAccess: false },
    { id: 'E004', name: 'Reem Mohamed', role: 'Massage Therapist', phone: '+20 155 666 777', email: 'reem.m@hagzy.com', branch: 'Downtown', status: 'break', bookingsToday: 5, rating: 4.7, revenue: 9800, avatar: 'RM', color: '#10B981', appAccess: true },
    { id: 'E005', name: 'Hana Youssef', role: 'Nail Technician', phone: '+20 199 888 999', email: 'hana.y@hagzy.com', branch: 'Downtown', status: 'available', bookingsToday: 4, rating: 4.6, revenue: 8100, avatar: 'HY', color: '#F59E0B', appAccess: false },
    { id: 'E006', name: 'Dina Kamal', role: 'Junior Stylist', phone: '+20 144 555 666', email: 'dina.k@hagzy.com', branch: 'Mall of Arabia', status: 'off', bookingsToday: 0, rating: 4.5, revenue: 5400, avatar: 'DK', color: '#6366F1', appAccess: false },
];

const statusMap: Record<string, { labelKey: string; bg: string; color: string }> = {
    available: { labelKey: 'employees.available', bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    'in-session': { labelKey: 'employees.inSession', bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    break: { labelKey: 'employees.onBreak', bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    off: { labelKey: 'employees.dayOff', bg: 'var(--color-gray-100)', color: 'var(--color-gray-500)' },
};

export default function EmployeesPage() {
    const [empList, setEmpList] = useState(initialEmployees);
    const [search, setSearch] = useState('');
    const router = useRouter();
    const { addToast } = useToast();
    const { t } = useTranslation();

    // CRUD state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState<typeof empList[0] | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ phoneOrEmail: '', role: 'staff' });
    const [magicLink, setMagicLink] = useState('');

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

        const added = {
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
            color: randomColor,
            appAccess: false
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

    const handleInvite = () => {
        if (!inviteData.phoneOrEmail) return addToast('error', 'Contact info required');
        const token = Math.random().toString(36).substring(7);
        const link = `${window.location.origin}/invite/${token}`;
        setMagicLink(link);
        addToast('success', 'Invitation link generated!');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(magicLink);
        addToast('success', 'Link copied to clipboard');
    };



    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative', maxWidth: '320px', width: '100%' }}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder={t('employees.search')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={() => { setIsInviteOpen(true); setMagicLink(''); setInviteData({ phoneOrEmail: '', role: 'staff' }); }}>
                    <Mail size={16} style={{ marginRight: '8px' }} />
                    Invite Staff
                </Button>
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
                                            {t(st.labelKey)}
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
                                <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-color)' }}>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                        padding: '2px 8px', borderRadius: 'var(--radius-full)',
                                        fontSize: 11, fontWeight: 600,
                                        background: emp.appAccess ? 'var(--color-success-light)' : 'var(--color-gray-100)',
                                        color: emp.appAccess ? 'var(--color-success)' : 'var(--color-gray-500)',
                                    }}>
                                        {emp.appAccess ? '● App Access: Active' : '○ App Access: Not Configured'}
                                    </span>
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
                title={t('employees.addEmployeeTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>{t('employees.cancel')}</Button>
                        <Button onClick={handleSaveAdd}>{t('employees.saveEmployee')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input label={t('employees.firstName')} placeholder="e.g. Sara" value={newEmp.fname} onChange={e => setNewEmp({ ...newEmp, fname: e.target.value })} />
                        <Input label={t('employees.lastName')} placeholder="e.g. Ahmed" value={newEmp.lname} onChange={e => setNewEmp({ ...newEmp, lname: e.target.value })} />
                    </div>
                    <Input label={t('employees.phoneOption')} placeholder="+20 1XX XXX XXXX" value={newEmp.phone} onChange={e => setNewEmp({ ...newEmp, phone: e.target.value })} />
                    <Input label={t('employees.emailOption')} type="email" placeholder="employee@hagzy.com" value={newEmp.email} onChange={e => setNewEmp({ ...newEmp, email: e.target.value })} />

                    <div style={{ borderTop: '1px solid var(--border-color)', margin: 'var(--space-2) 0' }} />
                    <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: '-4px' }}>{t('employees.jobDetailsTitle')}</h3>

                    <Select
                        label={t('employees.jobTitle')}
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
                        label={t('employees.branch')}
                        value={newEmp.branch}
                        onChange={e => setNewEmp({ ...newEmp, branch: e.target.value })}
                        options={[
                            { label: t('employees.downtown'), value: 'Downtown' },
                            { label: t('employees.mall'), value: 'Mall of Arabia' },
                            { label: t('employees.newCairo'), value: 'New Cairo' }
                        ]}
                    />
                    <Input label={t('employees.baseSalary')} type="number" placeholder="0" />
                </div>
            </SlideOver>
            {/* Edit Employee SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedEmp(null); }}
                title={t('employees.editEmployeeTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>{t('employees.cancel')}</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Employee details updated'); }}>{t('employees.saveChanges')}</Button>
                    </div>
                }
            >
                {selectedEmp && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label={t('employees.fullName')} defaultValue={selectedEmp.name} />
                        <Input label={t('employees.emailOption')} type="email" defaultValue={`${selectedEmp.name.split(' ')[0].toLowerCase()}@example.com`} />
                        <Input label={t('employees.phoneOption')} defaultValue={selectedEmp.phone} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <Select label={t('employees.systemRole')} defaultValue="employee" options={[
                                { label: t('employees.admin'), value: 'admin' },
                                { label: t('employees.manager'), value: 'manager' },
                                { label: t('employees.cashier'), value: 'cashier' },
                                { label: t('employees.baseEmployee'), value: 'employee' }
                            ]} />
                            <Select label={t('employees.jobTitle')} defaultValue={selectedEmp.role} options={[
                                { label: 'Senior Stylist', value: 'Senior Stylist' },
                                { label: 'Junior Stylist', value: 'Junior Stylist' },
                                { label: 'Skin Specialist', value: 'Skin Specialist' },
                                { label: 'Massage Therapist', value: 'Massage Therapist' },
                                { label: 'Nail Technician', value: 'Nail Technician' }
                            ]} />
                        </div>
                        <Select label={t('employees.branch')} defaultValue={selectedEmp.branch} options={[
                            { label: t('employees.downtown'), value: 'Downtown' },
                            { label: t('employees.mall'), value: 'Mall of Arabia' },
                            { label: t('employees.newCairo'), value: 'New Cairo' }
                        ]} />
                    </div>
                )}
            </SlideOver>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedEmp(null); }}
                title={t('employees.deleteEmployeeTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>{t('employees.cancel')}</Button>
                        <Button variant="destructive" onClick={handleDelete}>{t('employees.confirmRemoval')}</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        <strong>{selectedEmp?.name}</strong> - {t('employees.deleteWarning')}
                    </p>
                </div>
            </Modal>

            {/* Invite Staff Modal */}
            <Modal
                open={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                title="Invite New Staff Member"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsInviteOpen(false)}>{t('employees.cancel')}</Button>
                        {!magicLink && <Button onClick={handleInvite}>Generate Invite</Button>}
                        {magicLink && <Button onClick={() => setIsInviteOpen(false)}>Done</Button>}
                    </div>
                }
            >
                {!magicLink ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                            Send a magical login link to a staff member so they can securely set up their profile.
                        </p>
                        <Input
                            label="Phone or Email"
                            placeholder="e.g. +20 100..."
                            value={inviteData.phoneOrEmail}
                            onChange={(e) => setInviteData({ ...inviteData, phoneOrEmail: e.target.value })}
                        />
                        <Select
                            label="System Role"
                            value={inviteData.role}
                            onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                            options={[
                                { label: 'Service Provider / Staff', value: 'staff' },
                                { label: 'Manager / Receptionist', value: 'manager' },
                            ]}
                        />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center', textAlign: 'center', padding: 'var(--space-4) 0' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-success-100)', color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
                            <Mail size={24} />
                        </div>
                        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Invitation Ready!</h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                            Share this link with your staff member.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', width: '100%', marginTop: 'var(--space-2)' }}>
                            <Input
                                value={magicLink}
                                readOnly
                                style={{ flex: 1, backgroundColor: 'var(--bg-secondary)' }}
                            />
                            <Button variant="secondary" onClick={handleCopyLink} title="Copy Link" style={{ padding: '0 12px' }}>
                                <Copy size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
