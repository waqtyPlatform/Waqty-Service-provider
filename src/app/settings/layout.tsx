'use client';

import React from 'react';
import SettingsTabs from '@/components/SettingsTabs';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './settingsLayout.module.css';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const { t, lang } = useTranslation();

    return (
        <div className={styles.wrapper} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('settings.title')}</h1>
                <p className={styles.description}>{t('settings.desc')}</p>
            </div>

            <div className={styles.body}>
                <SettingsTabs />
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}
