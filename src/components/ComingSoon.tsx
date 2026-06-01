'use client';

import React from 'react';
import { Clock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

interface ComingSoonProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    expectedDate?: string;
    backHref?: string;
}

export function ComingSoon({ title, description, icon, expectedDate, backHref }: ComingSoonProps) {
    const router = useRouter();
    const { t } = useTranslation();
    const resolvedDescription = description ?? t('comingSoon.defaultDesc');

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - var(--topbar-height, 64px) - 160px)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                gap: 'var(--space-5)',
                animation: 'fadeIn 250ms ease both',
            }}
        >
            {/* Icon */}
            <div
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-primary-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-500)',
                }}
            >
                {icon || <Clock size={36} />}
            </div>

            {/* Title */}
            <h1
                style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--text-primary)',
                }}
            >
                {title}
            </h1>

            {/* Description */}
            <p
                style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    maxWidth: 460,
                    lineHeight: 'var(--leading-relaxed)',
                }}
            >
                {resolvedDescription}
            </p>

            {/* Expected date badge */}
            {expectedDate && (
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-1) var(--space-4)',
                        background: 'var(--color-info-light)',
                        color: 'var(--color-info)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-semibold)',
                    }}
                >
                    <Clock size={12} />
                    {t('comingSoon.expected').replace('{date}', expectedDate)}
                </span>
            )}

            {/* Progress dots */}
            <div
                style={{
                    display: 'flex',
                    gap: 'var(--space-2)',
                    marginTop: 'var(--space-2)',
                }}
            >
                <div
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--color-primary-500)',
                    }}
                />
                <div
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--color-primary-300)',
                        animation: 'pulse 1.5s ease infinite',
                    }}
                />
                <div
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--color-primary-100)',
                        animation: 'pulse 1.5s ease infinite 0.3s',
                    }}
                />
            </div>

            {/* Back button */}
            {backHref && (
                <button
                    onClick={() => router.push(backHref)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-5)',
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-medium)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        marginTop: 'var(--space-2)',
                    }}
                >
                    <ArrowLeft size={16} />
                    {t('common.goBack')}
                </button>
            )}
        </div>
    );
}
