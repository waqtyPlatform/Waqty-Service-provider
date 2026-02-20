'use client';

import React, { useState } from 'react';
import {
    Save,
    MapPin,
    Phone,
    Clock,
    CreditCard,
    LayoutGrid,
    Plus,
    Trash2,
    Settings,
    Building2,
    CheckCircle
} from 'lucide-react';
import {
    Tabs,
    Button,
    Input,
    Select,
    Checkbox,
    Badge,
    EmptyState
} from '@/components/ui';
import styles from './page.module.css';

// Mock Data
const branch = {
    id: 'BR-001',
    name: 'Downtown Branch',
    address: '15 Tahrir Square, Cairo',
    phone: '+20 2 2575 1234',
    manager: 'Ahmed Hassan',
    taxId: 'EG-123456789',
    currency: 'EGP',
    status: 'active',
    rooms: [
        { id: 1, name: 'Styling Station 1', type: 'Chair', capacity: 1 },
        { id: 2, name: 'Styling Station 2', type: 'Chair', capacity: 1 },
        { id: 3, name: 'Spa Room A', type: 'Room', capacity: 1 },
        { id: 4, name: 'VIP Suite', type: 'Suite', capacity: 2 },
    ],
    hours: [
        { day: 'Monday', open: '10:00', close: '22:00', closed: false },
        { day: 'Tuesday', open: '10:00', close: '22:00', closed: false },
        { day: 'Wednesday', open: '10:00', close: '22:00', closed: false },
        { day: 'Thursday', open: '10:00', close: '23:00', closed: false },
        { day: 'Friday', open: '13:00', close: '23:00', closed: false },
        { day: 'Saturday', open: '', close: '', closed: true },
        { day: 'Sunday', open: '10:00', close: '18:00', closed: false },
    ]
};

export default function BranchSettingsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [activeTab, setActiveTab] = useState('general');

    const renderGeneral = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>Basic Information</span>
                </div>
                <div className={styles.cardBody}>
                    <Input label="Branch Name" defaultValue={branch.name} />
                    <Input label="Address" defaultValue={branch.address} />
                    <div className={styles.row}>
                        <div className={styles.col}>
                            <Input label="Phone Number" defaultValue={branch.phone} />
                        </div>
                        <div className={styles.col}>
                            <Input label="Manager Name" defaultValue={branch.manager} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>Financial Settings</span>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.row}>
                        <div className={styles.col}>
                            <Input label="Tax ID / VAT Number" defaultValue={branch.taxId} />
                        </div>
                        <div className={styles.col}>
                            <Select
                                label="Currency"
                                options={[{ value: 'EGP', label: 'EGP - Egyptian Pound' }, { value: 'USD', label: 'USD - US Dollar' }]}
                                defaultValue={branch.currency}
                            />
                        </div>
                    </div>
                    <Checkbox label="Enable Tax Calculation" checked={true} />
                    <Checkbox label="Print Tax ID on Receipts" checked={true} />
                </div>
            </div>
        </div>
    );

    const renderHours = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>Opening Hours</span>
                    <Button size="sm" variant="outline">Copy from other branch</Button>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.hoursGrid}>
                        {branch.hours.map((day, i) => (
                            <div key={i} className={styles.dayRow}>
                                <div className={styles.dayName}>{day.day}</div>
                                <div className={styles.dayHours}>
                                    <Checkbox label={day.closed ? "Closed" : "Open"} checked={!day.closed} />
                                    {!day.closed && (
                                        <>
                                            <Input type="time" defaultValue={day.open} style={{ width: 120 }} />
                                            <span>to</span>
                                            <Input type="time" defaultValue={day.close} style={{ width: 120 }} />
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRooms = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>Rooms & Resources</span>
                    <Button size="sm"><Plus size={16} /> Add Room</Button>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branch.rooms.map(room => (
                                <tr key={room.id}>
                                    <td>{room.name}</td>
                                    <td><Badge color="neutral">{room.type}</Badge></td>
                                    <td>{room.capacity} Person(s)</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Button variant="ghost" size="sm" iconOnly><Settings size={14} /></Button>
                                            <Button variant="destructive" size="sm" iconOnly><Trash2 size={14} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <div className={styles.subtitle}>
                        <Building2 size={14} /> Branch Settings
                    </div>
                    <h1>
                        {branch.name}
                        <Badge color={branch.status === 'active' ? 'success' : 'neutral'}>{branch.status}</Badge>
                    </h1>
                </div>
                <div className={styles.actions}>
                    <Button variant="outline">Back to List</Button>
                    <Button><Save size={16} /> Save Changes</Button>
                </div>
            </div>

            <Tabs
                active={activeTab}
                onChange={setActiveTab}
                items={[
                    { key: 'general', label: 'General', icon: <Settings size={16} /> },
                    { key: 'hours', label: 'Opening Hours', icon: <Clock size={16} /> },
                    { key: 'rooms', label: 'Rooms & Resources', icon: <LayoutGrid size={16} /> },
                ]}
            />

            <div className={styles.content}>
                {activeTab === 'general' && renderGeneral()}
                {activeTab === 'hours' && renderHours()}
                {activeTab === 'rooms' && renderRooms()}

                {/* Side Panel (Contextual Help) */}
                <div className={styles.sidePanel}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Branch Stats</span>
                        </div>
                        <div className={styles.cardBody}>
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Total Employees</div>
                                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>12</div>
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Active Bookings</div>
                                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>8</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Last Sync</div>
                                <div style={{ fontSize: 'var(--text-sm)' }}>Just now</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
