import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Shown when a list page is rendering mock fallback data because the live API
 * was unreachable (useApiQuery `isFallback`). Lets operators tell demo data
 * from real data instead of silently masking a failed fetch.
 */
export function SampleDataBanner() {
    const { t } = useTranslation();
    return (
        <div
            role="status"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-warning-light)',
                color: 'var(--color-warning)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                border: '1px solid var(--color-warning)',
            }}
        >
            <AlertCircle size={16} style={{ flexShrink: 0 }} /> {t('common.sampleData')}
        </div>
    );
}
