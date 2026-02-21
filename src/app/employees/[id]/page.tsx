'use client';

import React, { useState } from 'react';
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Briefcase,
    Award,
    Clock,
    Scissors,
    TrendingUp,
    DollarSign,
    MoreHorizontal,
    Edit,
    CheckCircle,
    UserCheck,
    Percent,
    Lock,
    Shield,
    Activity,
    Trash2,
    Plus
} from 'lucide-react';
import {
    Tabs,
    Button,
    Badge,
    KPICard,
    Timeline,
    EmptyState,
    useToast,
    Modal,
    Input,
    Select,
    DropdownMenu,
    Switch
} from '@/components/ui';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import styles from './page.module.css';

// Mock Data
const employee = {
    id: 'EMP-001',
    name: 'Sarah Ahmed',
    position: 'Senior Stylist',
    department: 'Hair Styling',
    email: 'sarah.ahmed@hagzy.app',
    phone: '+20 100 123 4567',
    avatar: 'SA',
    status: 'active',
    joined: 'Mar 10, 2023',
    performance: 92,
    stats: {
        revenue: '45,200',
        appointments: 124,
        retention: '85%',
        rating: 4.8
    }
};

const schedule = [
    { day: 'Monday', start: '10:00 AM', end: '08:00 PM', off: false },
    { day: 'Tuesday', start: '10:00 AM', end: '08:00 PM', off: false },
    { day: 'Wednesday', start: '10:00 AM', end: '08:00 PM', off: false },
    { day: 'Thursday', start: '10:00 AM', end: '09:00 PM', off: false },
    { day: 'Friday', start: '01:00 PM', end: '10:00 PM', off: false },
    { day: 'Saturday', start: '-', end: '-', off: true },
    { day: 'Sunday', start: '10:00 AM', end: '06:00 PM', off: false },
];

const revenueData = [
    { month: 'Jan', revenue: 32000, appointments: 95 },
    { month: 'Feb', revenue: 38000, appointments: 110 },
    { month: 'Mar', revenue: 45200, appointments: 124 },
    { month: 'Apr', revenue: 42000, appointments: 115 },
    { month: 'May', revenue: 49000, appointments: 135 },
    { month: 'Jun', revenue: 52000, appointments: 142 },
];

const recentActivity = [
    { time: '10:30 AM', title: 'Clocked In', description: 'Fingerprint Device #1' },
    { time: 'Feb 17', title: 'Commission Payout', description: 'Received 3,450 EGP for Jan.' },
    { time: 'Feb 15', title: 'Performance Review', description: 'Rated 4.9/5 by Manager.' },
];

const modules = ['dashboard', 'sales', 'transactions', 'returns', 'customers', 'employees', 'marketing', 'reports', 'settings'];

export default function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [activeTab, setActiveTab] = useState('performance');
    const { addToast } = useToast();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [isSuspendOpen, setIsSuspendOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditServicesOpen, setIsEditServicesOpen] = useState(false);
    const [newServiceSelection, setNewServiceSelection] = useState('none');

    const [empServices, setEmpServices] = useState([
        { name: 'Hair Cut & Style', commission: '15%' },
        { name: 'Hair Coloring', commission: '20%' },
        { name: 'Keratin Treatment', commission: '25%' },
        { name: 'Blow Dry', commission: '10%' },
    ]);

    const availableServices = [
        { value: 'none', label: 'Select a service...' },
        { value: 'Beard Trim', label: 'Beard Trim' },
        { value: 'Root Touch Up', label: 'Root Touch Up' },
        { value: 'Balayage', label: 'Balayage' },
        { value: 'Scalp Massage', label: 'Scalp Massage' },
    ];

    const [editEmp, setEditEmp] = useState({
        fname: 'Sarah',
        lname: 'Ahmed',
        phone: '+20 100 123 4567',
        email: 'sarah.ahmed@hagzy.app',
        role: 'employee',
        jobTitle: 'Senior Stylist',
        branch: 'Main'
    });

    const handleActionClick = (action: string) => {
        if (action === 'Edit Profile') setIsEditOpen(true);
        else if (action === 'Manage Permissions') setIsPermissionsOpen(true);
        else if (action === 'View Activity Log') setIsActivityOpen(true);
        else if (action === 'Reset Password') setIsResetPasswordOpen(true);
        else if (action === 'Suspend Account') setIsSuspendOpen(true);
        else if (action === 'Delete Employee') setIsDeleteOpen(true);
        else addToast('info', `${action} action is developing. Will be available soon.`);
    };

    const handleSaveEdit = () => {
        setIsEditOpen(false);
        addToast('success', 'Profile updated successfully');
    };

    const renderPerformance = () => (
        <div className={styles.content}>
            <div className={styles.mainPanel}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
                    <KPICard
                        icon={<DollarSign size={20} />}
                        iconBg="var(--color-success-100)"
                        iconColor="var(--color-success-600)"
                        value={employee.stats.revenue}
                        label="Monthly Revenue (EGP)"
                        trend={{ value: '12%', up: true }}
                    />
                    <KPICard
                        icon={<UserCheck size={20} />}
                        iconBg="var(--color-primary-100)"
                        iconColor="var(--color-primary-600)"
                        value={employee.stats.retention}
                        label="Client Retention"
                        trend={{ value: '5%', up: true }}
                    />
                    <KPICard
                        icon={<Calendar size={20} />}
                        iconBg="var(--color-purple-100)"
                        iconColor="var(--color-purple-600)"
                        value={employee.stats.appointments}
                        label="Appointments"
                        trend={{ value: '2', up: false }}
                    />
                    <KPICard
                        icon={<Award size={20} />}
                        iconBg="var(--color-amber-100)"
                        iconColor="var(--color-amber-600)"
                        value={employee.stats.rating}
                        label="Avg Rating"
                    />
                </div>

                <div className={styles.card} style={{ marginTop: 'var(--space-6)' }}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}><TrendingUp size={18} /> Performance Analytics</span>
                    </div>
                    <div className={styles.cardBody} style={{ height: '300px', paddingTop: 'var(--space-4)' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}
                                    formatter={(value: any) => [`${value} EGP`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary-500)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}><Clock size={18} /> Recent Activity</span>
                    </div>
                    <div className={styles.cardBody}>
                        <Timeline events={recentActivity} />
                    </div>
                </div>
            </div>

            <div className={styles.sidePanel}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Assigned Services</span>
                        <Button variant="ghost" size="sm" iconOnly onClick={() => setIsEditServicesOpen(true)}><Edit size={14} /></Button>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.serviceList}>
                            {empServices.map((s, i) => (
                                <div key={i} className={styles.serviceItem}>
                                    <span className={styles.serviceName}>{s.name}</span>
                                    <span className={styles.serviceComm}>{s.commission}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSchedule = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>Weekly Schedule (Standard)</span>
                    <Button variant="outline" size="sm">Edit Schedule</Button>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.scheduleGrid}>
                        {schedule.map((day, i) => (
                            <div key={i} className={styles.scheduleDay}>
                                <div className={styles.dayName}>{day.day}</div>
                                {day.off ? (
                                    <div className={styles.dayOff}>OFF</div>
                                ) : (
                                    <div className={styles.dayTime}>
                                        {day.start}<br />
                                        to<br />
                                        {day.end}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.profileInfo}>
                        <div className={styles.avatar}>{employee.avatar}</div>
                        <div className={styles.details}>
                            <h1>
                                {employee.name}
                                <Badge color="primary">{employee.position}</Badge>
                            </h1>
                            <div className={styles.meta}>
                                <span className={styles.metaItem}><Briefcase size={14} /> {employee.department}</span>
                                <span className={styles.metaItem}><User size={14} /> ID: {employee.id}</span>
                                <Badge color="success">Active</Badge>
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <DropdownMenu
                            trigger={<Button variant="outline" iconOnly><MoreHorizontal size={20} /></Button>}
                            align="right"
                            items={[
                                { label: 'Manage Permissions', icon: <Shield size={16} />, onClick: () => handleActionClick('Manage Permissions') },
                                { label: 'View Activity Log', icon: <Activity size={16} />, onClick: () => handleActionClick('View Activity Log') },
                                { label: 'Reset Password', icon: <Lock size={16} />, onClick: () => handleActionClick('Reset Password') },
                                { label: 'Suspend Account', icon: <Clock size={16} />, onClick: () => handleActionClick('Suspend Account') },
                                { label: 'Delete Employee', icon: <Trash2 size={16} />, onClick: () => handleActionClick('Delete Employee'), destructive: true },
                            ]}
                        />
                        <Button variant="outline" onClick={() => handleActionClick('Edit Profile')}><Edit size={16} /> Edit Profile</Button>
                    </div>
                </div>

                <div className={styles.headerStats}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{employee.performance}%</span>
                        <span className={styles.statLabel}>Performance</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{employee.joined}</span>
                        <span className={styles.statLabel}>Joined Date</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{employee.phone}</span>
                        <span className={styles.statLabel}>Phone</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs
                active={activeTab}
                onChange={setActiveTab}
                items={[
                    { key: 'performance', label: 'Performance', icon: <TrendingUp size={16} /> },
                    { key: 'schedule', label: 'Schedule', icon: <Calendar size={16} /> },
                    { key: 'attendance', label: 'Attendance', icon: <Clock size={16} /> },
                ]}
            />

            {/* Content */}
            {activeTab === 'performance' && renderPerformance()}
            {activeTab === 'schedule' && renderSchedule()}
            {activeTab === 'attendance' && (
                <EmptyState
                    icon={<Clock size={48} />}
                    title="No attendance records"
                    description="Attendance logs will appear here once the employee clocks in."
                />
            )}

            <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Employee Profile">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input
                            label="First Name"
                            placeholder="Sarah"
                            value={editEmp.fname}
                            onChange={(e) => setEditEmp({ ...editEmp, fname: e.target.value })}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Ahmed"
                            value={editEmp.lname}
                            onChange={(e) => setEditEmp({ ...editEmp, lname: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input
                            label="Phone Number"
                            placeholder="+20 100 123 4567"
                            value={editEmp.phone}
                            onChange={(e) => setEditEmp({ ...editEmp, phone: e.target.value })}
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="sarah.ahmed@hagzy.app"
                            value={editEmp.email}
                            onChange={(e) => setEditEmp({ ...editEmp, email: e.target.value })}
                        />
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', margin: 'var(--space-2) 0' }}></div>

                    <Select
                        label="System Role"
                        value={editEmp.role}
                        onChange={(e) => setEditEmp({ ...editEmp, role: e.target.value })}
                        options={[
                            { value: 'admin', label: 'Admin (Full Access)' },
                            { value: 'manager', label: 'Manager (Branch Access)' },
                            { value: 'employee', label: 'Employee (Limited Access)' },
                        ]}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Select
                            label="Job Title"
                            value={editEmp.jobTitle}
                            onChange={(e) => setEditEmp({ ...editEmp, jobTitle: e.target.value })}
                            options={[
                                { value: 'Senior Stylist', label: 'Senior Stylist' },
                                { value: 'Junior Stylist', label: 'Junior Stylist' },
                                { value: 'Hair Colorist', label: 'Hair Colorist' },
                            ]}
                        />
                        <Select
                            label="Primary Branch"
                            value={editEmp.branch}
                            onChange={(e) => setEditEmp({ ...editEmp, branch: e.target.value })}
                            options={[
                                { value: 'Main', label: 'Main Branch' },
                                { value: 'Downtown', label: 'Downtown Studio' },
                            ]}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </div>
                </div>
            </Modal>

            {/* Manage Permissions Modal */}
            <Modal open={isPermissionsOpen} onClose={() => setIsPermissionsOpen(false)} title="Manage Permissions">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        Configure granular access rights and module visibility for {employee.name}. This will override their default Job Role permissions.
                    </p>
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'var(--bg-secondary)' }}>
                                <tr>
                                    <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'left', fontSize: 12, fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-color)' }}>Module</th>
                                    <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'center', fontSize: 12, fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-color)' }}>View</th>
                                    <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'center', fontSize: 12, fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-color)' }}>Create</th>
                                    <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'center', fontSize: 12, fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-color)' }}>Edit</th>
                                    <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'center', fontSize: 12, fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-color)' }}>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modules.map(m => (
                                    <tr key={m}>
                                        <td style={{ padding: 'var(--space-2) var(--space-3)', fontSize: 13, borderBottom: '1px solid var(--border-color)' }}>{m.charAt(0).toUpperCase() + m.slice(1)}</td>
                                        <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}><input type="checkbox" defaultChecked={m === 'dashboard' || m === 'sales'} /></td>
                                        <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}><input type="checkbox" defaultChecked={m === 'sales'} /></td>
                                        <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}><input type="checkbox" defaultChecked={false} /></td>
                                        <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}><input type="checkbox" defaultChecked={false} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                        <Button variant="outline" onClick={() => setIsPermissionsOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsPermissionsOpen(false); addToast('success', 'Permissions updated properly.'); }}>Save Permissions</Button>
                    </div>
                </div>
            </Modal>

            {/* View Activity Log Modal */}
            <Modal open={isActivityOpen} onClose={() => setIsActivityOpen(false)} title="Recent Activity">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxHeight: '60vh', overflowY: 'auto' }}>
                    <Timeline events={recentActivity} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                        <Button variant="outline" onClick={() => setIsActivityOpen(false)}>Close</Button>
                    </div>
                </div>
            </Modal>

            {/* Reset Password Modal */}
            <Modal open={isResetPasswordOpen} onClose={() => setIsResetPasswordOpen(false)} title="Reset Password">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        Are you sure you want to forcibly reset the password for <strong>{employee.name}</strong>? They will be signed out from all active sessions and an automated email with a temporary password link will be dispatched to <strong>{employee.email}</strong>.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                        <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsResetPasswordOpen(false); addToast('success', 'Password reset email dispatched.'); }}>Confirm Reset</Button>
                    </div>
                </div>
            </Modal>

            {/* Suspend Account Modal */}
            <Modal open={isSuspendOpen} onClose={() => setIsSuspendOpen(false)} title="Suspend Account">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        Are you sure you want to temporarily suspend <strong>{employee.name}'s</strong> account? They will lose access to the system immediately until the account is reinstated. This action does not delete data.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                        <Button variant="outline" onClick={() => setIsSuspendOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsSuspendOpen(false); addToast('error', 'Account has been suspended.'); }}>Suspend Account</Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Employee Modal */}
            <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Employee">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        Are you sure you want to permanently delete <strong>{employee.name}'s</strong> profile? This action is irreversible and all historic schedule and metric assignments will be orphaned.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Employee deleted successfully.'); }}>Delete Permanently</Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Assigned Services Modal */}
            <Modal open={isEditServicesOpen} onClose={() => setIsEditServicesOpen(false)} title="Edit Assigned Services">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        Adjust commission rates per service, unassign existing services, or assign new ones to this employee. Custom rates override the global service settings.
                    </p>

                    {/* Add New Service Row */}
                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', background: 'var(--bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)' }}>
                        <div style={{ flex: 1 }}>
                            <Select
                                options={availableServices}
                                value={newServiceSelection}
                                onChange={(e) => setNewServiceSelection(e.target.value)}
                            />
                        </div>
                        <Button
                            disabled={newServiceSelection === 'none'}
                            onClick={() => {
                                if (newServiceSelection !== 'none') {
                                    setEmpServices([...empServices, { name: newServiceSelection, commission: '10%' }]);
                                    setNewServiceSelection('none');
                                    addToast('success', `${newServiceSelection} assigned with default 10% commission.`);
                                }
                            }}
                        >
                            <Plus size={16} /> Add
                        </Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: '50vh', overflowY: 'auto', paddingRight: 'var(--space-1)', marginRight: '-var(--space-1)' }}>
                        {empServices.map((s, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ flex: 1, fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }}>
                                    {s.name}
                                </div>
                                <div style={{ position: 'relative', width: '80px' }}>
                                    <Input
                                        defaultValue={s.commission.replace('%', '')}
                                        style={{ textAlign: 'right', paddingRight: '22px' }}
                                    />
                                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', pointerEvents: 'none' }}>%</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    iconOnly
                                    style={{ color: 'var(--color-error)' }}
                                    onClick={() => setEmpServices(empServices.filter((_, i) => i !== idx))}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                        <Button variant="outline" onClick={() => setIsEditServicesOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditServicesOpen(false); addToast('success', 'Assigned services updated.'); }}>Save Services</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
