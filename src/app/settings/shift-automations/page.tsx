'use client';

import React from 'react';
import { Plus, Clock } from 'lucide-react';
import { Button, Badge, Switch } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './page.module.css';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi, type ShiftAutomation } from '@/lib/api';

export default function ShiftAutomationsPage() {
    const { t, lang } = useTranslation();

    const fallbackRules = [
        {
            uuid: '1',
            name: t('settings.shift.rule1.name'),
            trigger: '',
            action: '',
            conditions: { desc: t('settings.shift.rule1.desc') },
            active: true,
            created_at: '',
            updated_at: '',
        },
        {
            uuid: '2',
            name: t('settings.shift.rule2.name'),
            trigger: '',
            action: '',
            conditions: { desc: t('settings.shift.rule2.desc') },
            active: true,
            created_at: '',
            updated_at: '',
        },
        {
            uuid: '3',
            name: t('settings.shift.rule3.name'),
            trigger: '',
            action: '',
            conditions: { desc: t('settings.shift.rule3.desc') },
            active: false,
            created_at: '',
            updated_at: '',
        },
        {
            uuid: '4',
            name: t('settings.shift.rule4.name'),
            trigger: '',
            action: '',
            conditions: { desc: t('settings.shift.rule4.desc') },
            active: false,
            created_at: '',
            updated_at: '',
        },
    ];

    const {
        data: apiRules,
        loading,
        refetch,
    } = useApiQuery<ShiftAutomation[]>(() => settingsApi.getShiftAutomations(), [], {
        fallbackData: fallbackRules as ShiftAutomation[],
    });

    const rules = (apiRules || []).map((r, i) => ({
        id: r.uuid || String(i + 1),
        name: r.name || t(`settings.shift.rule${i + 1}.name`),
        desc: (r.conditions as Record<string, string>)?.desc || t(`settings.shift.rule${i + 1}.desc`),
        active: r.active,
    }));

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>{t('settings.shift.title')}</h1>
                    <div className={styles.subtitle}>{t('settings.shift.subtitle')}</div>
                </div>
                <div className={styles.actions}>
                    <Button>
                        <Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('settings.shift.newRule')}
                    </Button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>
                        <Clock size={18} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                        {t('settings.shift.attendanceRules')}
                    </span>
                </div>
                <div className={styles.rulesList}>
                    {rules.map(rule => (
                        <div key={rule.id} className={styles.ruleItem}>
                            <div className={styles.ruleContent}>
                                <div className={styles.ruleTitle}>
                                    {rule.name}
                                    {rule.active && (
                                        <Badge color="success" size="sm">
                                            {t('settings.shift.badgeActive')}
                                        </Badge>
                                    )}
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
