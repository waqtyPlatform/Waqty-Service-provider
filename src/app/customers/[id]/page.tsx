'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    CreditCard,
    FileText,
    AlertCircle,
    Star,
    Upload,
    MoreHorizontal,
    Edit,
    Plus,
    MessageSquare,
    Flag,
    File as FileIcon,
    Image as ImageIcon,
    Download,
    Eye,
    Send,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import { Tabs, Button, Badge, Timeline, EmptyState, useToast, Modal, Input, Textarea } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './page.module.css';

// Mock Data
const clientReviews = [
    {
        id: '1',
        author: 'Fatima Al-Rashid',
        target: 'Sara Ahmed',
        role: 'Employee',
        rating: 5,
        date: 'Mar 16, 2026',
        comment: 'Sara is amazing! Best hair coloring I ever had.',
        type: 'by_customer',
    },
    {
        id: '2',
        author: 'Nora Ali',
        target: 'Fatima Al-Rashid',
        role: 'Customer',
        rating: 4,
        date: 'Mar 25, 2026',
        comment: 'Client was slightly late, but otherwise very pleasant.',
        type: 'about_customer',
    },
];

// Task 05: Staff Notes (internal employee notes about client)
const initialStaffNotes = [
    {
        id: '1',
        employee: 'Sara Ahmed',
        employeeAvatar: 'SA',
        service: 'Hair Coloring',
        date: 'Mar 21, 2026',
        rating: 5,
        note: 'Client has sensitive scalp — used sulfate-free products. Very cooperative and communicates well. Great client to work with.',
    },
    {
        id: '2',
        employee: 'Nora Ali',
        employeeAvatar: 'NA',
        service: 'Facial',
        date: 'Mar 14, 2026',
        rating: 3,
        note: 'Client arrived 15 minutes late which compressed the session. Requested lower pressure throughout. Should allocate extra buffer time.',
    },
];

const client = {
    id: '1',
    name: 'Fatima Al-Rashid',
    email: 'fatima.rashid@example.com',
    phone: '+20 123 456 7890',
    address: '15 Tahrir St, Downtown Cairo',
    avatar: 'FA',
    status: 'active',
    vip: true,
    joined: 'Mar 17, 2026',
    dob: '1992-05-12',
    medical: {
        allergies: ['Latex'],
        conditions: ['Mild Asthma'],
        medications: ['Albuterol (as needed)'],
        generalNotes: 'Prefers quiet sessions. Very sensitive scalp.',
    },
    stats: {
        visits: 47,
        spend: '12,400',
        points: 850,
        lastVisit: '2 days ago',
    },
};

// Task 07: Customer preference tags
const PRESET_PREFERENCES = [
    { label: 'Prefers morning slots', category: 'scheduling' },
    { label: 'Prefers female staff', category: 'scheduling' },
    { label: 'Sensitive scalp', category: 'service' },
    { label: 'Quiet service preferred', category: 'service' },
    { label: 'Latex allergy', category: 'health' },
    { label: 'Requires wheelchair access', category: 'health' },
];
const PREF_COLORS: Record<string, { bg: string; color: string }> = {
    health: { bg: '#fee2e2', color: '#b91c1c' },
    scheduling: { bg: '#dbeafe', color: '#1d4ed8' },
    service: { bg: '#fef3c7', color: '#92400e' },
};

const timelineEvents = [
    {
        time: 'Mar 19, 2026',
        title: 'Completed Appointment',
        description: 'Hair Coloring with Sarah Ahmed. Paid 1,200 EGP.',
    },
    { time: 'Mar 17, 2026', title: 'Service Add-on', description: 'Added Deep Conditioning. Paid 450 EGP.' },
    { time: 'Mar 22, 2026', title: 'Missed Appointment', description: 'No-show for Manicure. Marked by Reception.' },
];

const bookings = [
    {
        id: 1042,
        date: 'Mar 14, 2026',
        time: '10:00 AM',
        service: 'Hair Coloring',
        employee: 'Sarah Ahmed',
        employeeLevel: 'Senior',
        status: 'completed',
        price: 520,
        basePrice: 450,
        priceSource: 'tier',
    },
    {
        id: 1055,
        date: 'Mar 18, 2026',
        time: '02:00 PM',
        service: 'Keratin Treatment',
        employee: 'Nora Ali',
        employeeLevel: 'Mid',
        status: 'confirmed',
        price: 800,
        basePrice: 800,
        priceSource: 'base',
    },
];

const sales = [
    { id: 'INV-001', date: 'Mar 16, 2026', items: 'Hair Coloring, Shampoo', total: 1450, status: 'paid' },
    { id: 'INV-002', date: 'Mar 14, 2026', items: 'Deep Conditioning Add-on', total: 450, status: 'paid' },
];

const medicalFiles = [
    {
        id: '1',
        name: 'Dermatology_Consult_Notes.pdf',
        type: 'PDF',
        size: '2.4 MB',
        date: 'Mar 16, 2026',
        uploader: 'Dr. Sarah Ahmed',
    },
    {
        id: '2',
        name: 'Before_Treatment_Skin.jpg',
        type: 'Image',
        size: '4.1 MB',
        date: 'Mar 23, 2026',
        uploader: 'Fatima Al-Rashid',
    },
];

const intakeForms = [
    {
        id: '1',
        name: 'Initial Health Intake Questionnaire',
        status: 'Completed',
        dateCompleted: 'Mar 16, 2026',
        relatedBooking: null,
    },
    {
        id: '2',
        name: 'Laser Hair Removal Consent Form',
        status: 'Pending',
        dateCompleted: null,
        relatedBooking: '#1055',
    },
];

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { t, lang } = useTranslation();
    const router = useRouter();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [reviewsFilter, setReviewsFilter] = useState<'all' | 'by_customer' | 'about_customer'>('all');
    const [staffNotes, setStaffNotes] = useState(initialStaffNotes);
    const [preferences, setPreferences] = useState<string[]>([
        'Sensitive scalp',
        'Latex allergy',
        'Prefers morning slots',
    ]);
    const [showPrefPopover, setShowPrefPopover] = useState(false);
    const [customPref, setCustomPref] = useState('');

    // Medical Notes State
    const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
    const [editedMedical, setEditedMedical] = useState({ ...client.medical });
    const [currentMedical, setCurrentMedical] = useState({ ...client.medical });

    const handleSaveMedical = () => {
        setCurrentMedical({ ...editedMedical });
        setIsMedicalModalOpen(false);
        addToast('success', t('custProfile.medicalUpdated') || 'Medical notes updated successfully');
    };

    const handleReportReview = (reviewId: string) => {
        addToast('success', t('custProfile.reviewReportedMsg'));
    };

    const handleUploadFile = () => {
        addToast('success', t('custProfile.fileUploaded') || 'File uploaded successfully');
    };

    const handleSendForm = () => {
        addToast('success', t('custProfile.formSent') || 'Intake form sent successfully');
    };

    const renderOverview = () => (
        <div className={styles.content}>
            <div className={styles.mainPanel}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>
                            <Calendar size={18} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                            {t('custProfile.recentTimeline')}
                        </span>
                    </div>
                    <div className={styles.cardBody}>
                        <Timeline events={timelineEvents} />
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>
                            <AlertCircle size={18} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                            {t('custProfile.medicalNotes') || 'Medical & Notes'}
                        </span>
                        <Button variant="ghost" size="sm" iconOnly onClick={() => setIsMedicalModalOpen(true)}>
                            <Edit size={14} />
                        </Button>
                    </div>
                    <div className={styles.cardBody}>
                        {currentMedical.allergies.length > 0 && (
                            <div
                                style={{
                                    padding: 'var(--space-3)',
                                    background: 'var(--color-warning-light)',
                                    color: 'var(--color-warning-dark)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    gap: 'var(--space-2)',
                                    marginBottom: 'var(--space-4)',
                                }}
                            >
                                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                                <span style={{ fontSize: 'var(--text-sm)' }}>
                                    <strong>{t('custProfile.allergyAlert') || 'Allergies:'}</strong>{' '}
                                    {currentMedical.allergies.join(', ')}
                                </span>
                            </div>
                        )}

                        {(currentMedical.conditions.length > 0 || currentMedical.medications.length > 0) && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--space-2)',
                                    marginBottom: 'var(--space-4)',
                                }}
                            >
                                {currentMedical.conditions.length > 0 && (
                                    <div style={{ fontSize: 'var(--text-sm)' }}>
                                        <strong style={{ color: 'var(--text-secondary)' }}>Conditions:</strong>{' '}
                                        {currentMedical.conditions.join(', ')}
                                    </div>
                                )}
                                {currentMedical.medications.length > 0 && (
                                    <div style={{ fontSize: 'var(--text-sm)' }}>
                                        <strong style={{ color: 'var(--text-secondary)' }}>Medications:</strong>{' '}
                                        {currentMedical.medications.join(', ')}
                                    </div>
                                )}
                            </div>
                        )}

                        <p
                            style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.5,
                                borderTop: '1px solid var(--border-color)',
                                paddingTop: 'var(--space-3)',
                            }}
                        >
                            {currentMedical.generalNotes || 'No general notes available.'}
                        </p>
                    </div>
                </div>

                <Modal
                    open={isMedicalModalOpen}
                    onClose={() => setIsMedicalModalOpen(false)}
                    title="Edit Medical & Notes"
                    footer={
                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--space-2)',
                                justifyContent: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Button variant="outline" onClick={() => setIsMedicalModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveMedical}>Save Changes</Button>
                        </div>
                    }
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div className={styles.inputGroup}>
                            <Input
                                label="Allergies (comma separated)"
                                value={editedMedical.allergies.join(', ')}
                                onChange={e =>
                                    setEditedMedical({
                                        ...editedMedical,
                                        allergies: e.target.value
                                            .split(',')
                                            .map(s => s.trim())
                                            .filter(Boolean),
                                    })
                                }
                                placeholder="e.g., Latex, Penicillin"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input
                                label="Chronic Conditions"
                                value={editedMedical.conditions.join(', ')}
                                onChange={e =>
                                    setEditedMedical({
                                        ...editedMedical,
                                        conditions: e.target.value
                                            .split(',')
                                            .map(s => s.trim())
                                            .filter(Boolean),
                                    })
                                }
                                placeholder="e.g., Asthma, Diabetes"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input
                                label="Current Medications"
                                value={editedMedical.medications.join(', ')}
                                onChange={e =>
                                    setEditedMedical({
                                        ...editedMedical,
                                        medications: e.target.value
                                            .split(',')
                                            .map(s => s.trim())
                                            .filter(Boolean),
                                    })
                                }
                                placeholder="e.g., Albuterol"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Textarea
                                label="General Notes"
                                value={editedMedical.generalNotes}
                                onChange={e => setEditedMedical({ ...editedMedical, generalNotes: e.target.value })}
                                placeholder="Add any operational or behavioral notes here..."
                                rows={4}
                            />
                        </div>
                    </div>
                </Modal>
            </div>

            <div className={styles.sidePanel}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>{t('custProfile.contactInfo')}</span>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.infoGrid} style={{ gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>{t('custProfile.lblPhone')}</span>
                                <span
                                    className={styles.infoValue}
                                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    <Phone size={14} /> {client.phone}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>{t('custProfile.lblEmail')}</span>
                                <span
                                    className={styles.infoValue}
                                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    <Mail size={14} /> {client.email}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>{t('custProfile.lblAddress')}</span>
                                <span
                                    className={styles.infoValue}
                                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    <MapPin size={14} /> {client.address}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>{t('custProfile.lblDob')}</span>
                                <span className={styles.infoValue}>{client.dob}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>{t('custProfile.tags')}</span>
                        <Button variant="ghost" size="sm" iconOnly>
                            <Plus size={14} />
                        </Button>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.tags}>
                            <span className={styles.tag}>{t('custProfile.tagVIP')}</span>
                            <span className={styles.tag}>{t('custProfile.tagLatex')}</span>
                            <span className={styles.tag}>{t('custProfile.tagWeekend')}</span>
                            <span className={styles.tag}>{t('custProfile.tagBigSpender')}</span>
                        </div>
                    </div>
                </div>

                {/* Task 07: Structured Preference Tags */}
                <div className={styles.card} style={{ position: 'relative' }}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Preferences</span>
                        <Button variant="ghost" size="sm" onClick={() => setShowPrefPopover(!showPrefPopover)}>
                            <Plus size={14} /> Add
                        </Button>
                    </div>
                    <div className={styles.cardBody}>
                        {preferences.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                {preferences.map(pref => {
                                    const preset = PRESET_PREFERENCES.find(p => p.label === pref);
                                    const colors = preset ? PREF_COLORS[preset.category] : PREF_COLORS.service;
                                    return (
                                        <span
                                            key={pref}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 4,
                                                padding: '3px 10px',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: 12,
                                                fontWeight: 500,
                                                background: colors.bg,
                                                color: colors.color,
                                                cursor: 'default',
                                            }}
                                        >
                                            {pref}
                                            <span
                                                style={{ cursor: 'pointer', fontWeight: 700, marginLeft: 2 }}
                                                onClick={() => setPreferences(p => p.filter(x => x !== pref))}
                                            >
                                                ×
                                            </span>
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                                No preferences added yet.
                            </p>
                        )}
                    </div>
                    {showPrefPopover && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-lg)',
                                padding: 'var(--space-3)',
                                zIndex: 20,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--space-2)',
                                    marginBottom: 'var(--space-3)',
                                }}
                            >
                                {PRESET_PREFERENCES.filter(p => !preferences.includes(p.label)).map(p => (
                                    <button
                                        key={p.label}
                                        style={{
                                            textAlign: 'left',
                                            padding: 'var(--space-2) var(--space-3)',
                                            borderRadius: 'var(--radius-md)',
                                            border: 'none',
                                            background: 'var(--bg-secondary)',
                                            cursor: 'pointer',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--text-primary)',
                                        }}
                                        onClick={() => {
                                            setPreferences(prev => [...prev, p.label]);
                                            setShowPrefPopover(false);
                                        }}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <input
                                    value={customPref}
                                    onChange={e => setCustomPref(e.target.value)}
                                    placeholder="Custom preference…"
                                    style={{
                                        flex: 1,
                                        height: 34,
                                        padding: '0 var(--space-3)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--bg-primary)',
                                        fontSize: 'var(--text-sm)',
                                    }}
                                />
                                <button
                                    style={{
                                        padding: '0 var(--space-3)',
                                        borderRadius: 'var(--radius-md)',
                                        border: 'none',
                                        background: 'var(--color-primary-500)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: 'var(--text-sm)',
                                    }}
                                    onClick={() => {
                                        if (customPref.trim()) {
                                            setPreferences(p => [...p, customPref.trim()]);
                                            setCustomPref('');
                                            setShowPrefPopover(false);
                                        }
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderBookings = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{t('custProfile.bookingHist')}</span>
                    <Button size="sm" onClick={() => router.push('/bookings/new')}>
                        <Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('custProfile.newBooking')}
                    </Button>
                </div>
                <div className="table-wrapper">
                    {bookings.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('custProfile.colId')}</th>
                                    <th>{t('custProfile.colDate')}</th>
                                    <th>{t('custProfile.colService')}</th>
                                    <th>{t('custProfile.colEmp')}</th>
                                    <th>{t('custProfile.colPrice')}</th>
                                    <th>{t('custProfile.colStatus')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b.id}>
                                        <td>#{b.id}</td>
                                        <td>
                                            <div style={{ fontWeight: 'var(--font-medium)' }}>{b.date}</div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                {b.time}
                                            </div>
                                        </td>
                                        <td>{b.service}</td>
                                        <td>{b.employee}</td>
                                        <td>
                                            {b.priceSource !== 'base' && (
                                                <span
                                                    style={{
                                                        textDecoration: 'line-through',
                                                        color: 'var(--text-tertiary)',
                                                        fontSize: 'var(--text-xs)',
                                                        marginRight: 4,
                                                    }}
                                                >
                                                    {b.basePrice}
                                                </span>
                                            )}
                                            {b.price} EGP
                                            {b.priceSource !== 'base' && (
                                                <span
                                                    style={{
                                                        marginLeft: 4,
                                                        padding: '1px 5px',
                                                        borderRadius: 'var(--radius-full)',
                                                        fontSize: 10,
                                                        fontWeight: 600,
                                                        background: 'var(--color-primary-50, #eff6ff)',
                                                        color: 'var(--color-primary-600)',
                                                    }}
                                                >
                                                    {b.priceSource}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <Badge
                                                color={
                                                    b.status === 'completed'
                                                        ? 'success'
                                                        : b.status === 'confirmed'
                                                          ? 'primary'
                                                          : 'neutral'
                                                }
                                            >
                                                {b.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: 'var(--space-8) 0' }}>
                            <EmptyState
                                icon={<Calendar size={32} color="var(--text-tertiary)" />}
                                title={t('custProfile.noBookingsTitle') || 'No bookings found'}
                                description={
                                    t('custProfile.noBookingsDesc') || 'This client has not made any bookings yet.'
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderSales = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{t('custProfile.purchaseHist')}</span>
                </div>
                <div className="table-wrapper">
                    {sales.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('custProfile.colInvoice')}</th>
                                    <th>{t('custProfile.colDate')}</th>
                                    <th>{t('custProfile.colItems')}</th>
                                    <th>{t('custProfile.colTotal')}</th>
                                    <th>{t('custProfile.colStatus')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map(s => (
                                    <tr key={s.id}>
                                        <td style={{ fontFamily: 'var(--font-mono)' }}>{s.id}</td>
                                        <td>{s.date}</td>
                                        <td>{s.items}</td>
                                        <td style={{ fontWeight: 'var(--font-bold)' }}>{s.total} EGP</td>
                                        <td>
                                            <Badge color="success">{s.status}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: 'var(--space-8) 0' }}>
                            <EmptyState
                                icon={<CreditCard size={32} color="var(--text-tertiary)" />}
                                title={t('custProfile.noSalesTitle') || 'No purchase history'}
                                description={
                                    t('custProfile.noSalesDesc') || 'This client has not made any purchases yet.'
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderReviews = () => {
        const filteredReviews =
            reviewsFilter === 'all' ? clientReviews : clientReviews.filter(r => r.type === reviewsFilter);

        return (
            <div className={styles.mainPanel}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>{t('custProfile.reviews')}</span>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <Button
                                variant={reviewsFilter === 'all' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setReviewsFilter('all')}
                            >
                                {t('custProfile.allReviews')}
                            </Button>
                            <Button
                                variant={reviewsFilter === 'by_customer' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setReviewsFilter('by_customer')}
                            >
                                {t('custProfile.reviewsByCustomer')}
                            </Button>
                            <Button
                                variant={reviewsFilter === 'about_customer' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setReviewsFilter('about_customer')}
                            >
                                {t('custProfile.reviewsAboutCustomer')}
                            </Button>
                        </div>
                    </div>
                    {filteredReviews.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {filteredReviews.map(review => (
                                <div
                                    key={review.id}
                                    style={{
                                        padding: 'var(--space-4)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--bg-secondary)',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: 'var(--space-2)',
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 'var(--font-semibold)' }}>{review.author}</div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                {review.type === 'by_customer'
                                                    ? `${t('custProfile.reviewed')} ${review.role}: ${review.target}`
                                                    : `${t('custProfile.reviewedBy')} ${review.role}`}{' '}
                                                • {review.date}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '2px',
                                                    color: 'var(--color-warning)',
                                                }}
                                            >
                                                <Star size={14} fill="currentColor" />
                                                <span
                                                    style={{
                                                        fontSize: 'var(--text-sm)',
                                                        fontWeight: 'var(--font-bold)',
                                                        color: 'var(--text-primary)',
                                                    }}
                                                >
                                                    {review.rating}.0
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleReportReview(review.id)}
                                                style={{ color: 'var(--color-error)' }}
                                                iconOnly
                                            >
                                                <Flag size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: 'var(--space-8) 0' }}>
                            <EmptyState
                                icon={<MessageSquare size={32} color="var(--text-tertiary)" />}
                                title={t('custProfile.noReviewsTitle')}
                                description={t('custProfile.noReviewsDesc')}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderFilesAndForms = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card} style={{ marginBottom: 'var(--space-6)' }}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>
                        {t('custProfile.filesAttachments') || 'Medical File Attachments'}
                    </span>
                    <Button size="sm" onClick={handleUploadFile}>
                        <Upload size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                        {t('custProfile.btnUpload') || 'Upload File'}
                    </Button>
                </div>
                <div className="table-wrapper">
                    {medicalFiles.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('custProfile.colFileName')}</th>
                                    <th>{t('custProfile.colDateAdded')}</th>
                                    <th>{t('custProfile.colAddedBy')}</th>
                                    <th>{t('custProfile.colSize')}</th>
                                    <th>{t('custProfile.colActions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicalFiles.map(file => (
                                    <tr key={file.id}>
                                        <td>
                                            <div
                                                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                                            >
                                                {file.type === 'PDF' ? (
                                                    <FileIcon size={16} color="var(--color-primary-500)" />
                                                ) : (
                                                    <ImageIcon size={16} color="var(--color-primary-500)" />
                                                )}
                                                <span style={{ fontWeight: 'var(--font-medium)' }}>{file.name}</span>
                                            </div>
                                        </td>
                                        <td>{file.date}</td>
                                        <td>{file.uploader}</td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>{file.size}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                <Button variant="ghost" size="sm" iconOnly>
                                                    <Eye size={14} />
                                                </Button>
                                                <Button variant="ghost" size="sm" iconOnly>
                                                    <Download size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: 'var(--space-8) 0' }}>
                            <EmptyState
                                icon={<FileIcon size={32} color="var(--text-tertiary)" />}
                                title={t('custProfile.emptyFilesTitle')}
                                description={t('custProfile.emptyFilesDesc')}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>
                        {t('custProfile.intakeForms') || 'Pre-Appointment Intake Forms & Consents'}
                    </span>
                    <Button size="sm" variant="outline" onClick={handleSendForm}>
                        <Send size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                        {t('custProfile.btnSendForm') || 'Send New Form'}
                    </Button>
                </div>{' '}
                <div className="table-wrapper">
                    {intakeForms.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('custProfile.colFormName')}</th>
                                    <th>{t('custProfile.colStatus')}</th>
                                    <th>{t('custProfile.colDateCompleted')}</th>
                                    <th>{t('custProfile.colRelatedBooking')}</th>
                                    <th>{t('custProfile.colActions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {intakeForms.map(form => (
                                    <tr key={form.id}>
                                        <td style={{ fontWeight: 'var(--font-medium)' }}>{form.name}</td>
                                        <td>
                                            {form.status === 'Completed' ? (
                                                <Badge color="success">
                                                    <CheckCircle2 size={12} className="mr-1 inline-block" /> Completed
                                                </Badge>
                                            ) : (
                                                <Badge color="warning">
                                                    <Clock size={12} className="mr-1 inline-block" /> Pending
                                                </Badge>
                                            )}
                                        </td>
                                        <td style={{ color: form.dateCompleted ? 'inherit' : 'var(--text-tertiary)' }}>
                                            {form.dateCompleted || 'N/A'}
                                        </td>
                                        <td>
                                            {form.relatedBooking ? (
                                                <span
                                                    style={{
                                                        color: 'var(--color-primary-600)',
                                                        fontWeight: 'var(--font-medium)',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {form.relatedBooking}
                                                </span>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                {form.status === 'Completed' ? (
                                                    <Button variant="ghost" size="sm" iconOnly>
                                                        <Eye size={14} />
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="sm" iconOnly>
                                                        <Send size={14} />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" iconOnly>
                                                    <MoreHorizontal size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: 'var(--space-8) 0' }}>
                            <EmptyState
                                icon={<FileText size={32} color="var(--text-tertiary)" />}
                                title={t('custProfile.emptyFormsTitle') || 'No intake forms'}
                                description={
                                    t('custProfile.emptyFormsDesc') ||
                                    'Send an intake form to this client before their appointment.'
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStaffNotes = () => (
        <div className={styles.mainPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>
                        <MessageSquare size={18} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> Staff Notes
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                        Internal — not visible to client
                    </span>
                </div>
                {staffNotes.length > 0 ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-4)',
                            padding: 'var(--space-4)',
                        }}
                    >
                        {staffNotes.map(note => (
                            <div
                                key={note.id}
                                style={{
                                    padding: 'var(--space-4)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--bg-secondary)',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: 'var(--space-3)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                background: 'var(--color-primary-100)',
                                                color: 'var(--color-primary-600)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 13,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {note.employeeAvatar}
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontWeight: 'var(--font-semibold)',
                                                    fontSize: 'var(--text-sm)',
                                                }}
                                            >
                                                Note from {note.employee}
                                            </div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                After {note.service} • {note.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '2px',
                                                color: 'var(--color-warning)',
                                            }}
                                        >
                                            <Star size={13} fill="currentColor" />
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 'var(--font-bold)',
                                                    color: 'var(--text-primary)',
                                                }}
                                            >
                                                {note.rating}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            iconOnly
                                            style={{ color: 'var(--color-error)' }}
                                            onClick={() => {
                                                setStaffNotes(prev => prev.filter(n => n.id !== note.id));
                                                addToast('success', 'Note removed');
                                            }}
                                        >
                                            <Flag size={13} />
                                        </Button>
                                    </div>
                                </div>
                                <p
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {note.note}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: 'var(--space-8) 0' }}>
                        <EmptyState
                            icon={<MessageSquare size={32} color="var(--text-tertiary)" />}
                            title="No staff notes"
                            description="Employees can write post-service notes about this client from the mobile app."
                        />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className={styles.page} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Header */}
            <div className={styles.header}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <Button variant="ghost" onClick={() => router.push('/customers')} size="sm">
                        {t('custProfile.backToCustomers')}
                    </Button>
                </div>
                <div className={styles.headerTop}>
                    <div className={styles.profileInfo}>
                        <div className={styles.avatar}>{client.avatar}</div>
                        <div className={styles.details}>
                            <h1>
                                {client.name}
                                {client.vip && (
                                    <Star
                                        size={20}
                                        fill="var(--color-warning)"
                                        color="var(--color-warning)"
                                        className={lang === 'ar' ? 'mr-2' : 'ml-2'}
                                    />
                                )}
                            </h1>
                            <div className={styles.meta}>
                                <span className={styles.metaItem}>
                                    <User size={14} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />{' '}
                                    {t('custProfile.clientNum')}
                                    {client.id}
                                </span>
                                <span className={styles.metaItem}>
                                    <Calendar size={14} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />{' '}
                                    {t('custProfile.joined')} {client.joined}
                                </span>
                                <Badge color="success">{t('custProfile.activeBadge')}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <Button variant="outline" iconOnly>
                            <MoreHorizontal size={20} />
                        </Button>
                        <Button variant="outline">
                            <Edit size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                            {t('custProfile.editProfile')}
                        </Button>
                        <Button onClick={() => router.push('/bookings/new')}>
                            <Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('custProfile.newBooking')}
                        </Button>
                    </div>
                </div>

                <div className={styles.headerStats}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{client.stats.visits}</span>
                        <span className={styles.statLabel}>{t('custProfile.statVisits')}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{client.stats.spend} EGP</span>
                        <span className={styles.statLabel}>{t('custProfile.statSpend')}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{client.stats.points}</span>
                        <span className={styles.statLabel}>{t('custProfile.statPoints')}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{client.stats.lastVisit}</span>
                        <span className={styles.statLabel}>{t('custProfile.statLastVisit')}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs
                active={activeTab}
                onChange={setActiveTab}
                items={[
                    { key: 'overview', label: t('custProfile.tabOverview'), icon: <User size={16} /> },
                    { key: 'bookings', label: t('custProfile.tabBookings'), icon: <Calendar size={16} /> },
                    { key: 'sales', label: t('custProfile.tabSales'), icon: <CreditCard size={16} /> },
                    { key: 'reviews', label: t('custProfile.tabReviews'), icon: <MessageSquare size={16} /> },
                    {
                        key: 'staffNotes',
                        label: `Staff Notes${staffNotes.length > 0 ? ` (${staffNotes.length})` : ''}`,
                        icon: <MessageSquare size={16} />,
                    },
                    { key: 'files', label: t('custProfile.tabFiles') || 'Files & Forms', icon: <FileText size={16} /> },
                ]}
            />

            {/* Content */}
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'sales' && renderSales()}
            {activeTab === 'reviews' && renderReviews()}
            {activeTab === 'staffNotes' && renderStaffNotes()}
            {activeTab === 'files' && renderFilesAndForms()}
        </div>
    );
}
