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
    Percent
} from 'lucide-react';
import {
    Tabs,
    Button,
    Badge,
    KPICard,
    Timeline,
    EmptyState
} from '@/components/ui';
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

const services = [
    { name: 'Hair Cut & Style', commission: '15%' },
    { name: 'Hair Coloring', commission: '20%' },
    { name: 'Keratin Treatment', commission: '25%' },
    { name: 'Blow Dry', commission: '10%' },
];

const recentActivity = [
    { time: '10:30 AM', title: 'Clocked In', description: 'Fingerprint Device #1' },
    { time: 'Feb 17', title: 'Commission Payout', description: 'Received 3,450 EGP for Jan.' },
    { time: 'Feb 15', title: 'Performance Review', description: 'Rated 4.9/5 by Manager.' },
];

export default function EmployeeProfilePage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState('performance');

    const renderPerformance = () => (
        <div className={styles.content}>
            <div className={styles.mainPanel}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
                    <KPICard
                        icon={<DollarSign size={20} />}
                        iconBg="var(--color-success-100)"
                        iconColor="var(--color-success-600)"
                        value={employee.stats.revenue + ' EGP'}
                        label="Monthly Revenue"
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
                        <Button variant="ghost" size="sm" iconOnly><Edit size={14} /></Button>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.serviceList}>
                            {services.map((s, i) => (
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
                        <Button variant="outline" iconOnly><MoreHorizontal size={20} /></Button>
                        <Button variant="outline"><Edit size={16} /> Edit Profile</Button>
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
        </div>
    );
}
