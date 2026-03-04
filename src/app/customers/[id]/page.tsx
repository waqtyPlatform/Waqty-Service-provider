'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    Flag
} from 'lucide-react';
import {
    Tabs,
    Button,
    Badge,
    Timeline,
    EmptyState,
    useToast
} from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './page.module.css';

// Mock Data
const clientReviews = [
    { id: '1', author: 'Fatima Al-Rashid', target: 'Sara Ahmed', role: 'Employee', rating: 5, date: 'Feb 15, 2026', comment: 'Sara is amazing! Best hair coloring I ever had.', type: 'by_customer' },
    { id: '2', author: 'Nora Ali', target: 'Fatima Al-Rashid', role: 'Customer', rating: 4, date: 'Feb 10, 2026', comment: 'Client was slightly late, but otherwise very pleasant.', type: 'about_customer' }
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
    joined: 'Jan 15, 2024',
    dob: '1992-05-12',
    notes: 'Prefers quiet sessions. Latex allergy.',
    stats: {
        visits: 47,
        spend: '12,400',
        points: 850,
        lastVisit: '2 days ago'
    }
};

const timelineEvents = [
    { time: 'Feb 15, 2026', title: 'Completed Appointment', description: 'Hair Coloring with Sarah Ahmed. Paid 1,200 EGP.' },
    { time: 'Feb 10, 2026', title: 'Service Add-on', description: 'Added Deep Conditioning. Paid 450 EGP.' },
    { time: 'Jan 28, 2026', title: 'Missed Appointment', description: 'No-show for Manicure. Marked by Reception.' },
    { time: 'Jan 15, 2026', title: 'Membership Upgrade', description: 'Upgraded to Gold Tier.' },
];

const bookings = [
    { id: 1042, date: 'Feb 15, 2026', time: '10:00 AM', service: 'Hair Coloring', employee: 'Sarah Ahmed', status: 'completed', price: 1200 },
    { id: 1055, date: 'Feb 28, 2026', time: '02:00 PM', service: 'Keratin Treatment', employee: 'Nora Ali', status: 'confirmed', price: 2500 },
];

const sales = [
    { id: 'INV-001', date: 'Feb 15, 2026', items: 'Hair Coloring, Shampoo', total: 1450, status: 'paid' },
    { id: 'INV-002', date: 'Feb 10, 2026', items: 'Deep Conditioning Add-on', total: 450, status: 'paid' },
];

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { t, lang } = useTranslation();
    const router = useRouter();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [reviewsFilter, setReviewsFilter] = useState<'all' | 'by_customer' | 'about_customer'>('all');

    const handleReportReview = (reviewId: string) => {
        addToast('success', t('custProfile.reviewReportedMsg'));
    };

    const renderOverview = () => (
        <div className={styles.content}>
            <div className={styles.mainPanel}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}><Calendar size={18} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('custProfile.recentTimeline')}</span>
                    </div>
                    <div className={styles.cardBody}>
                        <Timeline events={timelineEvents} />
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}><AlertCircle size={18} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('custProfile.medicalNotes')}</span>
                        <Button variant="ghost" size="sm" iconOnly><Edit size={14} /></Button>
                    </div>
                    <div className={styles.cardBody}>
                        <div style={{ padding: 'var(--space-3)', background: 'var(--color-warning-light)', color: 'var(--color-warning-dark)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: 'var(--text-sm)' }}><strong>{t('custProfile.allergyAlert')}</strong> Latex sensitivity reported on Jan 20, 2024.</span>
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Client prefers evening appointments. Usually requests tea with no sugar.
                            Has sensitive scalp, avoid strong chemical shampoos.
                        </p>
                    </div>
                </div>
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
                                <span className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={14} /> {client.phone}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>{t('custProfile.lblEmail')}</span>
                                <span className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={14} /> {client.email}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>{t('custProfile.lblAddress')}</span>
                                <span className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {client.address}</span>
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
                        <Button variant="ghost" size="sm" iconOnly><Plus size={14} /></Button>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.tags}>
                            <span className={styles.tag}>VIP</span>
                            <span className={styles.tag}>Latex Allergy</span>
                            <span className={styles.tag}>Weekend</span>
                            <span className={styles.tag}>Big Spender</span>
                        </div>
                    </div>
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
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{b.time}</div>
                                    </td>
                                    <td>{b.service}</td>
                                    <td>{b.employee}</td>
                                    <td>{b.price} EGP</td>
                                    <td>
                                        <Badge color={b.status === 'completed' ? 'success' : b.status === 'confirmed' ? 'primary' : 'neutral'}>
                                            {b.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                    <td><Badge color="success">{s.status}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderReviews = () => {
        const filteredReviews = reviewsFilter === 'all'
            ? clientReviews
            : clientReviews.filter(r => r.type === reviewsFilter);

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
                                <div key={review.id} style={{ padding: 'var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                                        <div>
                                            <div style={{ fontWeight: 'var(--font-semibold)' }}>{review.author}</div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                {review.type === 'by_customer' ? `Reviwed ${review.role}: ${review.target}` : `Reviewed by ${review.role}`} • {review.date}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--color-warning)' }}>
                                                <Star size={14} fill="currentColor" />
                                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{review.rating}.0</span>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => handleReportReview(review.id)} style={{ color: 'var(--color-error)' }} iconOnly>
                                                <Flag size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{review.comment}</p>
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

    return (
        <div className={styles.page} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Header */}
            <div className={styles.header}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <Button variant="ghost" onClick={() => router.push('/customers')} size="sm">
                        {"← Back to Customers"}
                    </Button>
                </div>
                <div className={styles.headerTop}>
                    <div className={styles.profileInfo}>
                        <div className={styles.avatar}>{client.avatar}</div>
                        <div className={styles.details}>
                            <h1>
                                {client.name}
                                {client.vip && <Star size={20} fill="var(--color-warning)" color="var(--color-warning)" className={lang === 'ar' ? 'mr-2' : 'ml-2'} />}
                            </h1>
                            <div className={styles.meta}>
                                <span className={styles.metaItem}><User size={14} className={lang === 'ar' ? 'ml-1' : 'mr-1'} /> {t('custProfile.clientNum')}{client.id}</span>
                                <span className={styles.metaItem}><Calendar size={14} className={lang === 'ar' ? 'ml-1' : 'mr-1'} /> {t('custProfile.joined')} {client.joined}</span>
                                <Badge color="success">{t('custProfile.activeBadge')}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <Button variant="outline" iconOnly><MoreHorizontal size={20} /></Button>
                        <Button variant="outline"><Edit size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('custProfile.editProfile')}</Button>
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
                    { key: 'files', label: t('custProfile.tabFiles'), icon: <FileText size={16} /> },
                ]}
            />

            {/* Content */}
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'sales' && renderSales()}
            {activeTab === 'reviews' && renderReviews()}
            {activeTab === 'files' && (
                <EmptyState
                    icon={<Upload size={48} />}
                    title={t('custProfile.emptyFilesTitle')}
                    description={t('custProfile.emptyFilesDesc')}
                    action={<Button variant="outline">{t('custProfile.btnUpload')}</Button>}
                />
            )}
        </div>
    );
}
