'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, AlertTriangle } from 'lucide-react';
import { Button, Badge, Input, Select, Modal } from '@/components/ui';
import styles from '../customers.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { customerApi, providerApi, type CustomerReview } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

const mockReviews: CustomerReview[] = [
    {
        uuid: '1',
        customer_uuid: 'c1',
        customer: {
            uuid: 'c1',
            name: 'Sara Ahmed',
            email: 'sara@example.com',
            phone: '01012345678',
            branch_uuid: '',
            active: true,
            blocked: false,
            created_at: '',
            updated_at: '',
        } as never,
        employee_uuid: 'e1',
        employee: {
            uuid: 'e1',
            name: 'Nour Ali',
            email: '',
            phone: '',
            branch_uuid: '',
            active: true,
            blocked: false,
            created_at: '',
            updated_at: '',
        } as never,
        service_uuid: 's1',
        service: {
            uuid: 's1',
            name: 'Hair Coloring',
            description: null,
            sub_category_uuid: null,
            estimated_duration_minutes: null,
            image_url: null,
            active: true,
            created_at: '',
            updated_at: '',
        },
        booking_uuid: 'b1',
        rating: 5,
        comment: 'Amazing experience! Nour did a fantastic job with the coloring. Will definitely come back.',
        response: null,
        status: 'pending',
        direction: 'by_customer',
        created_at: '2026-04-08T14:30:00Z',
        updated_at: '2026-04-08T14:30:00Z',
    },
    {
        uuid: '2',
        customer_uuid: 'c2',
        customer: {
            uuid: 'c2',
            name: 'Mohamed Khalil',
            email: 'mk@example.com',
            phone: '01098765432',
            branch_uuid: '',
            active: true,
            blocked: false,
            created_at: '',
            updated_at: '',
        } as never,
        employee_uuid: 'e2',
        employee: {
            uuid: 'e2',
            name: 'Yasmin Hany',
            email: '',
            phone: '',
            branch_uuid: '',
            active: true,
            blocked: false,
            created_at: '',
            updated_at: '',
        } as never,
        service_uuid: 's2',
        service: {
            uuid: 's2',
            name: 'Facial Treatment',
            description: null,
            sub_category_uuid: null,
            estimated_duration_minutes: null,
            image_url: null,
            active: true,
            created_at: '',
            updated_at: '',
        },
        booking_uuid: 'b2',
        rating: 2,
        comment:
            'Was kept waiting for 30 minutes past my appointment time. The service itself was okay but the wait was frustrating.',
        response: null,
        status: 'pending',
        direction: 'by_customer',
        created_at: '2026-04-07T10:15:00Z',
        updated_at: '2026-04-07T10:15:00Z',
    },
    {
        uuid: '3',
        customer_uuid: 'c3',
        customer: {
            uuid: 'c3',
            name: 'Layla Mostafa',
            email: 'layla@example.com',
            phone: '01155555555',
            branch_uuid: '',
            active: true,
            blocked: false,
            created_at: '',
            updated_at: '',
        } as never,
        employee_uuid: 'e1',
        employee: {
            uuid: 'e1',
            name: 'Nour Ali',
            email: '',
            phone: '',
            branch_uuid: '',
            active: true,
            blocked: false,
            created_at: '',
            updated_at: '',
        } as never,
        service_uuid: 's3',
        service: {
            uuid: 's3',
            name: 'Manicure & Pedicure',
            description: null,
            sub_category_uuid: null,
            estimated_duration_minutes: null,
            image_url: null,
            active: true,
            created_at: '',
            updated_at: '',
        },
        booking_uuid: 'b3',
        rating: 4,
        comment: 'Great nails! Love the design. A bit pricey though.',
        response: null,
        status: 'published',
        direction: 'by_customer',
        created_at: '2026-04-05T16:00:00Z',
        updated_at: '2026-04-06T09:00:00Z',
    },
    {
        uuid: '4',
        customer_uuid: 'c4',
        customer: {
            uuid: 'c4',
            name: 'Tarek Farouk',
            email: 'tarek@example.com',
            phone: '01244444444',
            branch_uuid: '',
            active: true,
            blocked: false,
            created_at: '',
            updated_at: '',
        } as never,
        employee_uuid: 'e3',
        employee: {
            uuid: 'e3',
            name: 'Omar Sayed',
            email: '',
            phone: '',
            branch_uuid: '',
            active: true,
            blocked: false,
            created_at: '',
            updated_at: '',
        } as never,
        service_uuid: 's4',
        service: {
            uuid: 's4',
            name: 'Classic Haircut',
            description: null,
            sub_category_uuid: null,
            estimated_duration_minutes: null,
            image_url: null,
            active: true,
            created_at: '',
            updated_at: '',
        },
        booking_uuid: 'b4',
        rating: 1,
        comment: 'Terrible experience. The haircut was nothing like what I asked for. Very disappointed.',
        response: null,
        status: 'reported',
        direction: 'by_customer',
        created_at: '2026-04-04T11:00:00Z',
        updated_at: '2026-04-04T11:00:00Z',
    },
    {
        uuid: '5',
        customer_uuid: 'c5',
        customer: {
            uuid: 'c5',
            name: 'Dina Sameh',
            email: 'dina@example.com',
            phone: '01066666666',
            branch_uuid: '',
            active: true,
            blocked: false,
            created_at: '',
            updated_at: '',
        } as never,
        employee_uuid: 'e2',
        employee: {
            uuid: 'e2',
            name: 'Yasmin Hany',
            email: '',
            phone: '',
            branch_uuid: '',
            active: true,
            blocked: false,
            created_at: '',
            updated_at: '',
        } as never,
        service_uuid: 's5',
        service: {
            uuid: 's5',
            name: 'Keratin Treatment',
            description: null,
            sub_category_uuid: null,
            estimated_duration_minutes: null,
            image_url: null,
            active: true,
            created_at: '',
            updated_at: '',
        },
        booking_uuid: 'b5',
        rating: 5,
        comment: "Best keratin treatment I've ever had! My hair is so smooth and shiny.",
        response: null,
        status: 'pending',
        direction: 'by_customer',
        created_at: '2026-04-03T13:45:00Z',
        updated_at: '2026-04-03T13:45:00Z',
    },
];

const statusColors: Record<string, 'warning' | 'success' | 'error' | 'neutral'> = {
    pending: 'warning',
    published: 'success',
    reported: 'error',
};

export default function ReviewModerationPage() {
    const { t } = useTranslation();
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRating, setFilterRating] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [reportReason, setReportReason] = useState('');
    const [reportCategory, setReportCategory] = useState('inappropriate');
    const [showReportModal, setShowReportModal] = useState<string | null>(null);

    const {
        data: reviews,
        loading,
        error,
        refetch,
        setData: setReviews,
    } = useApiQuery<CustomerReview[]>(
        // The provider `/reviews` route doesn't exist; `/ratings` is the live source.
        () =>
            providerApi.getRatings().then(res => {
                const mapped = res.data?.map(
                    (r): CustomerReview => ({
                        uuid: r.uuid,
                        customer_uuid: r.user?.uuid ?? '',
                        customer: r.user ? ({ uuid: r.user.uuid, name: r.user.name } as never) : undefined,
                        employee_uuid: null,
                        service_uuid: null,
                        booking_uuid: null,
                        rating: r.rating,
                        comment: r.comment ?? null,
                        response: null,
                        status: r.active ? 'published' : 'hidden',
                        direction: 'by_customer',
                        created_at: (r as { rated_at?: string }).rated_at ?? r.created_at ?? '',
                        updated_at: (r as { rated_at?: string }).rated_at ?? r.created_at ?? '',
                    })
                );
                const data = filterStatus === 'all' ? mapped : mapped?.filter(r => r.status === filterStatus);
                return { ...res, data };
            }),
        [filterStatus],
        { fallbackData: mockReviews }
    );

    const filtered = (reviews || []).filter(r => {
        if (filterRating !== 'all' && r.rating !== Number(filterRating)) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const customerName = (r.customer as { name?: string })?.name?.toLowerCase() || '';
            const comment = r.comment?.toLowerCase() || '';
            if (!customerName.includes(q) && !comment.includes(q)) return false;
        }
        return true;
    });

    const handleReport = async (uuid: string) => {
        if (!reportReason.trim()) return;
        try {
            await customerApi.flagReview(uuid, reportReason);
        } catch {
            // API unavailable — apply locally
        }
        setReviews(prev => (prev || []).map(r => (r.uuid === uuid ? { ...r, status: 'reported' as const } : r)));
        setShowReportModal(null);
        setReportReason('');
        setReportCategory('inappropriate');
    };

    const renderStars = (rating: number) => (
        <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={14}
                    fill={i <= rating ? '#f59e0b' : 'none'}
                    stroke={i <= rating ? '#f59e0b' : 'var(--text-tertiary)'}
                />
            ))}
        </div>
    );

    const avgRating =
        filtered.length > 0 ? (filtered.reduce((sum, r) => sum + r.rating, 0) / filtered.length).toFixed(1) : '0.0';
    const pendingCount = (reviews || []).filter(r => r.status === 'pending').length;
    const reportedCount = (reviews || []).filter(r => r.status === 'reported').length;

    return (
        <div className={styles.customersPage}>
            <div className={styles.headerContent}>
                <div>
                    <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{t('reviews.title')}</h1>
                    <p
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: 'var(--text-sm)',
                            marginTop: 'var(--space-1)',
                        }}
                    >
                        {t('reviews.subtitle')}
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 'var(--space-4)',
                }}
            >
                <div
                    style={{
                        padding: 'var(--space-4) var(--space-5)',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                            marginBottom: 'var(--space-1)',
                        }}
                    >
                        {t('reviews.totalReviews')}
                    </div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{(reviews || []).length}</div>
                </div>
                <div
                    style={{
                        padding: 'var(--space-4) var(--space-5)',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                            marginBottom: 'var(--space-1)',
                        }}
                    >
                        {t('reviews.avgRating')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{avgRating}</span>
                        <Star size={18} fill="#f59e0b" stroke="#f59e0b" />
                    </div>
                </div>
                <div
                    style={{
                        padding: 'var(--space-4) var(--space-5)',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                            marginBottom: 'var(--space-1)',
                        }}
                    >
                        {t('reviews.pending')}
                    </div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-warning-500)' }}>
                        {pendingCount}
                    </div>
                </div>
                <div
                    style={{
                        padding: 'var(--space-4) var(--space-5)',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                            marginBottom: 'var(--space-1)',
                        }}
                    >
                        {t('reviews.reported')}
                    </div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-error-500)' }}>
                        {reportedCount}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <Input
                        placeholder={t('common.search')}
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select
                    options={[
                        { value: 'all', label: t('reviews.allStatuses') },
                        { value: 'pending', label: t('reviews.statusPending') },
                        { value: 'published', label: t('reviews.statusPublished') },
                        { value: 'reported', label: t('reviews.statusReported') },
                    ]}
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                />
                <Select
                    options={[
                        { value: 'all', label: t('reviews.allRatings') },
                        { value: '5', label: t('reviews.fiveStars') },
                        { value: '4', label: t('reviews.fourStars') },
                        { value: '3', label: t('reviews.threeStars') },
                        { value: '2', label: t('reviews.twoStars') },
                        { value: '1', label: t('reviews.oneStar') },
                    ]}
                    value={filterRating}
                    onChange={e => setFilterRating(e.target.value)}
                />
            </div>

            {/* Reviews List */}
            <DataGuard
                loading={loading}
                error={error}
                data={filtered}
                emptyIcon={<MessageSquare size={48} />}
                emptyTitle={t('reviews.empty.title')}
                emptyDescription={t('reviews.empty.desc')}
                onRetry={refetch}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filtered.map(review => {
                        const customer = review.customer as { name?: string } | undefined;
                        const employee = review.employee as { name?: string } | undefined;
                        return (
                            <div
                                key={review.uuid}
                                style={{
                                    padding: '1.25rem',
                                    background: 'var(--bg-surface)',
                                    borderRadius: '0.75rem',
                                    border: `1px solid ${review.status === 'reported' ? 'var(--color-error-200)' : 'var(--border)'}`,
                                }}
                            >
                                {/* Header */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '0.75rem',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                background: 'var(--color-primary-100)',
                                                color: 'var(--color-primary-600)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 600,
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            {(customer?.name || 'U')[0]}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                                {customer?.name || t('reviews.unknown')}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-tertiary)',
                                                    display: 'flex',
                                                    gap: 'var(--space-2)',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {renderStars(review.rating)}
                                                <span>&middot;</span>
                                                <span>{review.service?.name}</span>
                                                <span>&middot;</span>
                                                <span>
                                                    {t('reviews.staffPrefix')}
                                                    {employee?.name || '—'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <Badge color={statusColors[review.status] || 'neutral'} size="sm">
                                            {t(
                                                `reviews.status${review.status.charAt(0).toUpperCase() + review.status.slice(1)}`
                                            )}
                                        </Badge>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Comment */}
                                <p
                                    style={{
                                        fontSize: '0.875rem',
                                        lineHeight: 1.6,
                                        color: 'var(--text-secondary)',
                                        margin: '0 0 0.75rem',
                                    }}
                                >
                                    &ldquo;{review.comment}&rdquo;
                                </p>

                                {/* Reported Notice */}
                                {review.status === 'reported' && (
                                    <div
                                        style={{
                                            padding: '0.625rem 1rem',
                                            borderRadius: '0.5rem',
                                            background: 'var(--color-error-50)',
                                            border: '1px solid var(--color-error-100)',
                                            fontSize: '0.8125rem',
                                            color: 'var(--color-error-600)',
                                            marginBottom: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                        }}
                                    >
                                        <AlertTriangle size={14} />
                                        {t('reviews.reportedNotice')}
                                    </div>
                                )}

                                {/* Actions — Report only */}
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    {review.status !== 'reported' && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => setShowReportModal(review.uuid)}
                                        >
                                            <AlertTriangle size={14} /> {t('reviews.report')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DataGuard>

            {/* Report Modal */}
            {showReportModal && (
                <Modal
                    open={true}
                    onClose={() => {
                        setShowReportModal(null);
                        setReportReason('');
                        setReportCategory('inappropriate');
                    }}
                    title={t('reviews.reportReview')}
                >
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        {t('reviews.reportDesc')}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Select
                            label={t('reviews.reportCategory')}
                            options={[
                                { value: 'inappropriate', label: t('reviews.catInappropriate') },
                                { value: 'fake', label: t('reviews.catFake') },
                                { value: 'harassment', label: t('reviews.catHarassment') },
                                { value: 'wrong_business', label: t('reviews.catWrongBusiness') },
                                { value: 'other', label: t('reviews.catOther') },
                            ]}
                            value={reportCategory}
                            onChange={e => setReportCategory(e.target.value)}
                        />
                        <Input
                            label={t('reviews.reportReason')}
                            placeholder={t('reviews.reportReasonPlaceholder')}
                            value={reportReason}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReportReason(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: '1rem' }}>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowReportModal(null);
                                setReportReason('');
                                setReportCategory('inappropriate');
                            }}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleReport(showReportModal)}
                            disabled={!reportReason.trim()}
                        >
                            <AlertTriangle size={14} /> {t('reviews.submitReport')}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
