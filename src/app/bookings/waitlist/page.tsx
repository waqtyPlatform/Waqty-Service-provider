'use client';

import React, { useState } from 'react';
import { Clock, Bell, Trash2 } from 'lucide-react';
import { Button, Input, Select, Badge } from '@/components/ui';
import { useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { waitlistApi, type WaitlistEntry } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';
import BookingsTabs from '../BookingsTabs';

const mockWaitlist: WaitlistEntry[] = [
    {
        uuid: '1',
        customer_uuid: 'c1',
        customer: {
            uuid: 'c1',
            name: 'Fatma Ali',
            email: null,
            phone: '01012345678',
            group_uuid: null,
            vip: false,
            notes: null,
            allergies: null,
            medical_conditions: null,
            medications: null,
            total_visits: 5,
            total_spent: 1200,
            last_visit: '2026-04-08',
            created_at: '',
            updated_at: '',
        } as never,
        service_uuid: 's1',
        service: {
            uuid: 's1',
            name: 'Hair Coloring',
            description: null,
            sub_category_uuid: null,
            estimated_duration_minutes: 60,
            image_url: null,
            active: true,
            created_at: '',
            updated_at: '',
        },
        branch_uuid: 'b1',
        preferred_date: '2026-04-12',
        preferred_time: '14:00',
        employee_uuid: null,
        status: 'waiting',
        position: 1,
        created_at: '2026-04-10T09:00:00Z',
        updated_at: '2026-04-10T09:00:00Z',
    },
    {
        uuid: '2',
        customer_uuid: 'c2',
        customer: {
            uuid: 'c2',
            name: 'Ahmed Samy',
            email: null,
            phone: '01098765432',
            group_uuid: null,
            vip: true,
            notes: null,
            allergies: null,
            medical_conditions: null,
            medications: null,
            total_visits: 15,
            total_spent: 4500,
            last_visit: '2026-04-09',
            created_at: '',
            updated_at: '',
        } as never,
        service_uuid: 's2',
        service: {
            uuid: 's2',
            name: 'Keratin Treatment',
            description: null,
            sub_category_uuid: null,
            estimated_duration_minutes: 120,
            image_url: null,
            active: true,
            created_at: '',
            updated_at: '',
        },
        branch_uuid: 'b1',
        preferred_date: '2026-04-12',
        preferred_time: '10:00',
        employee_uuid: 'e1',
        status: 'waiting',
        position: 2,
        created_at: '2026-04-10T10:30:00Z',
        updated_at: '2026-04-10T10:30:00Z',
    },
    {
        uuid: '3',
        customer_uuid: 'c3',
        customer: {
            uuid: 'c3',
            name: 'Mona Hassan',
            email: null,
            phone: '01155555555',
            group_uuid: null,
            vip: false,
            notes: null,
            allergies: null,
            medical_conditions: null,
            medications: null,
            total_visits: 2,
            total_spent: 300,
            last_visit: '2026-04-05',
            created_at: '',
            updated_at: '',
        } as never,
        service_uuid: 's3',
        service: {
            uuid: 's3',
            name: 'Facial Treatment',
            description: null,
            sub_category_uuid: null,
            estimated_duration_minutes: 45,
            image_url: null,
            active: true,
            created_at: '',
            updated_at: '',
        },
        branch_uuid: 'b1',
        preferred_date: '2026-04-13',
        preferred_time: null,
        employee_uuid: null,
        status: 'notified',
        position: 3,
        created_at: '2026-04-09T14:00:00Z',
        updated_at: '2026-04-10T08:00:00Z',
    },
];

const statusColors: Record<string, 'warning' | 'info' | 'success' | 'neutral'> = {
    waiting: 'warning',
    notified: 'info',
    booked: 'success',
    cancelled: 'neutral',
};

export default function WaitlistPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const {
        data: waitlist,
        loading,
        error,
        refetch,
        setData: setWaitlist,
    } = useApiQuery(
        () => waitlistApi.getWaitlist({ status: filterStatus === 'all' ? undefined : filterStatus }),
        [filterStatus],
        { fallbackData: mockWaitlist }
    );

    const filtered = (waitlist || []).filter(entry => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const name = (entry.customer as { name?: string })?.name?.toLowerCase() || '';
            const service = entry.service?.name?.toLowerCase() || '';
            if (!name.includes(q) && !service.includes(q)) return false;
        }
        return true;
    });

    const handleNotify = async (uuid: string) => {
        try {
            await waitlistApi.notifyWaitlistEntry(uuid);
        } catch {
            addToast('warning', t('waitlist.toastOffline'));
        }
        setWaitlist(prev => (prev || []).map(e => (e.uuid === uuid ? { ...e, status: 'notified' as const } : e)));
        addToast('success', t('waitlist.toastNotified'));
    };

    const handleRemove = async (uuid: string) => {
        try {
            await waitlistApi.removeFromWaitlist(uuid);
        } catch {
            addToast('warning', t('waitlist.toastOffline'));
        }
        setWaitlist(prev => (prev || []).filter(e => e.uuid !== uuid));
        addToast('success', t('waitlist.toastRemoved'));
    };

    const waitingCount = (waitlist || []).filter(e => e.status === 'waiting').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <BookingsTabs />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('waitlist.title')}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 'var(--space-1)' }}>
                        {t('waitlist.subtitle')}
                    </p>
                </div>
                <Badge color="warning" size="md">
                    {t('waitlist.waitingCount').replace('{count}', String(waitingCount))}
                </Badge>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <Input
                        placeholder={t('common.search')}
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select
                    options={[
                        { value: 'all', label: t('waitlist.allStatuses') },
                        { value: 'waiting', label: t('waitlist.waiting') },
                        { value: 'notified', label: t('waitlist.notified') },
                        { value: 'booked', label: t('waitlist.booked') },
                        { value: 'cancelled', label: t('waitlist.cancelled') },
                    ]}
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                />
            </div>

            {/* Waitlist */}
            <DataGuard
                loading={loading}
                error={error}
                data={filtered}
                emptyIcon={<Clock size={48} />}
                emptyTitle={t('waitlist.empty.title')}
                emptyDescription={t('waitlist.empty.desc')}
                onRetry={refetch}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filtered.map(entry => {
                        const customer = entry.customer as { name?: string; vip?: boolean } | undefined;
                        return (
                            <div
                                key={entry.uuid}
                                style={{
                                    padding: '1rem 1.25rem',
                                    background: 'var(--bg-surface)',
                                    borderRadius: '0.75rem',
                                    border: '1px solid var(--border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '1rem',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                    <div
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            fontWeight: 600,
                                            background: 'var(--color-primary-100)',
                                            color: 'var(--color-primary-600)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        #{entry.position}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                                {customer?.name || t('waitlist.unknown')}
                                            </span>
                                            {customer?.vip && (
                                                <Badge color="amber" size="sm">
                                                    VIP
                                                </Badge>
                                            )}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.8125rem',
                                                color: 'var(--text-secondary)',
                                                marginTop: 2,
                                            }}
                                        >
                                            {entry.service?.name}
                                            {entry.preferred_date && (
                                                <span>
                                                    {' '}
                                                    &middot;{' '}
                                                    {t('waitlist.preferred').replace('{date}', entry.preferred_date)}
                                                    {entry.preferred_time
                                                        ? t('waitlist.preferredAt').replace(
                                                              '{time}',
                                                              entry.preferred_time
                                                          )
                                                        : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <Badge color={statusColors[entry.status] || 'neutral'} size="sm">
                                        {t(`waitlist.${entry.status}`)}
                                    </Badge>
                                    {entry.status === 'waiting' && (
                                        <Button size="sm" variant="outline" onClick={() => handleNotify(entry.uuid)}>
                                            <Bell size={14} /> {t('waitlist.notify')}
                                        </Button>
                                    )}
                                    <Button size="sm" variant="ghost" onClick={() => handleRemove(entry.uuid)}>
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DataGuard>
        </div>
    );
}
