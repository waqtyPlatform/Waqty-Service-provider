'use client';

import React from 'react';
import { User } from 'lucide-react';
import { useApiQuery } from '@/hooks/useApiQuery';
import { authApi } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';
import { useTranslation } from '@/hooks/useTranslation';

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
    },
    cardTitle: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-primary)',
        marginBottom: 'var(--space-1)',
    },
    cardDesc: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-tertiary)',
        marginBottom: 'var(--space-5)',
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: 'var(--color-primary, #16a34a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 28,
        fontWeight: 700,
        flexShrink: 0,
        overflow: 'hidden',
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-4)',
    },
    field: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 4,
    },
    label: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
        fontWeight: 500,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
    },
    value: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        fontWeight: 500,
    },
    divider: {
        height: 1,
        background: 'var(--border-color)',
        margin: 'var(--space-4) 0',
    },
};

export default function ProfileSettingsPage() {
    const { lang } = useTranslation();

    const { data: profile, loading, error } = useApiQuery(() => authApi.me(), []);

    const isActive = profile?.active && !profile?.blocked && !profile?.banned;

    const initials = profile?.name
        ? profile.name
              .trim()
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?';

    return (
        <div style={cs.page} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <DataGuard
                loading={loading}
                error={error}
                data={profile ? [profile] : []}
                emptyIcon={<User size={48} />}
                emptyTitle="Profile"
                emptyDescription="Could not load provider profile."
            >
                <div style={cs.card}>
                    <div style={cs.cardTitle}>الملف الشخصي</div>
                    <div style={cs.cardDesc}>بيانات الحساب المسترجعة من الخادم</div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-4)',
                            marginBottom: 'var(--space-5)',
                        }}
                    >
                        <div style={cs.avatar}>
                            {profile?.logo_url ? (
                                <img
                                    src={profile.logo_url}
                                    alt="logo"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <div>
                            <div
                                style={{
                                    fontWeight: 700,
                                    fontSize: 'var(--text-lg)',
                                    color: 'var(--text-primary)',
                                    marginBottom: 2,
                                }}
                            >
                                {profile?.name}
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 8 }}>
                                {profile?.email}
                            </div>
                            <span
                                style={{
                                    ...cs.badge,
                                    background: isActive ? '#dcfce7' : '#fee2e2',
                                    color: isActive ? '#16a34a' : '#dc2626',
                                }}
                            >
                                {isActive ? 'نشط' : 'غير نشط'}
                            </span>
                        </div>
                    </div>

                    <div style={cs.divider} />

                    <div style={cs.grid}>
                        <div style={cs.field}>
                            <span style={cs.label}>الاسم</span>
                            <span style={cs.value}>{profile?.name ?? '—'}</span>
                        </div>
                        <div style={cs.field}>
                            <span style={cs.label}>البريد الإلكتروني</span>
                            <span style={cs.value}>{profile?.email ?? '—'}</span>
                        </div>
                        <div style={cs.field}>
                            <span style={cs.label}>رقم الجوال</span>
                            <span style={cs.value}>{profile?.phone ?? '—'}</span>
                        </div>
                        <div style={cs.field}>
                            <span style={cs.label}>كود المزود</span>
                            <span style={cs.value}>{profile?.code ?? '—'}</span>
                        </div>
                        {profile?.category && (
                            <div style={cs.field}>
                                <span style={cs.label}>الفئة</span>
                                <span style={cs.value}>{profile.category.name}</span>
                            </div>
                        )}
                        {profile?.city && (
                            <div style={cs.field}>
                                <span style={cs.label}>المدينة</span>
                                <span style={cs.value}>{profile.city.name}</span>
                            </div>
                        )}
                        <div style={cs.field}>
                            <span style={cs.label}>تاريخ الانضمام</span>
                            <span style={cs.value}>
                                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ar-EG') : '—'}
                            </span>
                        </div>
                        <div style={cs.field}>
                            <span style={cs.label}>الحالة</span>
                            <span style={{ ...cs.value, color: isActive ? '#16a34a' : '#dc2626' }}>
                                {profile?.blocked ? 'محظور' : profile?.banned ? 'ممنوع' : isActive ? 'نشط' : 'غير نشط'}
                            </span>
                        </div>
                    </div>
                </div>
            </DataGuard>
        </div>
    );
}
