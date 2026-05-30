'use client';

import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import translations from '../i18n/translations';

export function useTranslation() {
    const { language: lang } = useLanguage();

    const t = useMemo(
        () =>
            (key: string): string => {
                if (!translations[key]) {
                    if (process.env.NODE_ENV === 'development') {
                        console.warn(`Translation key not found: ${key}`);
                    }
                    return key;
                }
                return translations[key][lang] || translations[key].en;
            },
        [lang]
    );

    // Localize a piece of dynamic, data-driven bilingual value (e.g. a service's
    // name): returns the Arabic variant under the AR locale when present, else the
    // base/English value — so provider-supplied Arabic data renders under `ar` (X10).
    const tn = useMemo(
        () =>
            (base: string, ar?: string | null): string =>
                lang === 'ar' && ar ? ar : base,
        [lang]
    );

    return { t, tn, lang };
}
