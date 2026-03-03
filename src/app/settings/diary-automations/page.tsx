'use client';

import React from 'react';
import {
    Plus,
    Zap
} from 'lucide-react';
import {
    Button,
    Badge,
    Switch
} from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './page.module.css';

// Removed mock rules, moved inside component for translation

export default function DiaryAutomationsPage() {
    const { t, lang } = useTranslation();

    const rules = [
        { id: 1, name: t('settings.diary.rule1.name'), desc: t('settings.diary.rule1.desc'), active: true },
        { id: 2, name: t('settings.diary.rule2.name'), desc: t('settings.diary.rule2.desc'), active: true },
        { id: 3, name: t('settings.diary.rule3.name'), desc: t('settings.diary.rule3.desc'), active: true },
        { id: 4, name: t('settings.diary.rule4.name'), desc: t('settings.diary.rule4.desc'), active: false },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>{t('settings.diary.title')}</h1>
                    <div className={styles.subtitle}>{t('settings.diary.subtitle')}</div>
                </div>
                <div className={styles.actions}>
                    <Button><Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('settings.diary.newRule')}</Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}><Zap size={18} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('settings.diary.activeRules')}</span>
                </div>
                <div className={styles.rulesList}>
                    {rules.map(rule => (
                        <div key={rule.id} className={styles.ruleItem}>
                            <div className={styles.ruleContent}>
                                <div className={styles.ruleTitle}>
                                    {rule.name}
                                    {rule.active && <Badge color="success" size="sm">{t('settings.diary.badgeActive')}</Badge>}
                                </div>
                                <div className={styles.ruleDesc}>{rule.desc}</div>
                            </div>
                            <div>
                                <Switch checked={rule.active} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
