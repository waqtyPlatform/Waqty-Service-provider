'use client';

import { Suspense } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { NewBookingFlow } from './_components/NewBookingFlow';

// ─── Suspense wrapper (required for useSearchParams) ─────────────────────────

function NewBookingFallback() {
    const { t } = useTranslation();
    return (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' as const, color: 'var(--text-secondary)' }}>
            {t('common.loading')}
        </div>
    );
}

export default function NewBookingPage() {
    return (
        <Suspense fallback={<NewBookingFallback />}>
            <NewBookingFlow />
        </Suspense>
    );
}
