'use client';

import { Home, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function NotFound() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - var(--topbar-height, 64px) - 80px)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                gap: 'var(--space-5)',
                animation: 'fadeIn 250ms ease both',
            }}
        >
            <div
                style={{
                    fontSize: '80px',
                    fontWeight: 800,
                    color: 'var(--color-primary-500)',
                    lineHeight: 1,
                    letterSpacing: '-2px',
                }}
            >
                404
            </div>

            <div
                style={{
                    width: 64,
                    height: 64,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-primary-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-500)',
                }}
            >
                <Search size={28} />
            </div>

            <h2
                style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--text-primary)',
                }}
            >
                {t('notFound.title')}
            </h2>

            <p
                style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    maxWidth: 420,
                    lineHeight: 'var(--leading-relaxed)',
                }}
            >
                {t('notFound.description')}
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <button
                    onClick={() => router.back()}
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
                        transition: 'background var(--transition-fast)',
                    }}
                >
                    <ArrowLeft size={16} />
                    {t('common.goBack')}
                </button>

                <Link
                    href="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-5)',
                        background: 'var(--color-primary-500)',
                        color: 'var(--text-inverse)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        border: 'none',
                        textDecoration: 'none',
                        transition: 'background var(--transition-fast)',
                    }}
                >
                    <Home size={16} />
                    {t('sidebar.dashboard')}
                </Link>
            </div>
        </div>
    );
}
