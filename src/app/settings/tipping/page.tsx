'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ToggleLeft, ToggleRight, Users, Percent } from 'lucide-react';
import { Button, Input, Select, Badge } from '@/components/ui';
import { useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi, type TipConfig } from '@/lib/api';

const defaultConfig: TipConfig = {
    enabled: false,
    percentages: [10, 15, 20],
    allow_custom: true,
    distribution_method: 'individual',
};

export default function TippingSettingsPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const { data: config } = useApiQuery(() => settingsApi.getTipConfig(), [], { fallbackData: defaultConfig });

    const [enabled, setEnabled] = useState(defaultConfig.enabled);
    const [percentages, setPercentages] = useState<number[]>(defaultConfig.percentages);
    const [allowCustom, setAllowCustom] = useState(defaultConfig.allow_custom);
    const [distribution, setDistribution] = useState(defaultConfig.distribution_method);
    const [newPercentage, setNewPercentage] = useState('');

    useEffect(() => {
        if (config) {
            setEnabled(config.enabled);
            setPercentages(config.percentages);
            setAllowCustom(config.allow_custom);
            setDistribution(config.distribution_method);
        }
    }, [config]);

    const addPercentage = () => {
        const val = Number(newPercentage);
        if (val > 0 && val <= 100 && !percentages.includes(val)) {
            setPercentages(prev => [...prev, val].sort((a, b) => a - b));
            setNewPercentage('');
        }
    };

    const removePercentage = (val: number) => {
        setPercentages(prev => prev.filter(p => p !== val));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await settingsApi.updateTipConfig({
                enabled,
                percentages,
                allow_custom: allowCustom,
                distribution_method: distribution,
            });
            addToast('success', 'Tipping settings saved');
        } catch {
            addToast('error', 'Failed to save tipping settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 720 }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('tipping.title')}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
                    {t('tipping.subtitle') || 'Configure tipping options for your customers'}
                </p>
            </div>

            {/* Enable Toggle */}
            <div
                style={{
                    padding: '1.25rem',
                    background: 'var(--bg-surface)',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{t('tipping.enable')}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        {t('tipping.enableDesc')}
                    </div>
                </div>
                <button
                    onClick={() => setEnabled(!enabled)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: enabled ? 'var(--color-primary-500)' : 'var(--text-tertiary)',
                    }}
                >
                    {enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
            </div>

            {enabled && (
                <>
                    {/* Tip Percentages */}
                    <div
                        style={{
                            padding: '1.25rem',
                            background: 'var(--bg-surface)',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '1rem' }}>
                            <Percent size={16} style={{ display: 'inline', marginRight: 8 }} />
                            {t('tipping.percentages')}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
                            {percentages.map(p => (
                                <Badge key={p} color="primary" size="md">
                                    {p}%
                                    <button
                                        onClick={() => removePercentage(p)}
                                        style={{
                                            marginLeft: 6,
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'inherit',
                                            padding: 0,
                                        }}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                            <Input
                                type="number"
                                placeholder="e.g., 25"
                                value={newPercentage}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPercentage(e.target.value)}
                                label="Add percentage"
                            />
                            <Button size="sm" variant="outline" onClick={addPercentage}>
                                <Plus size={14} /> Add
                            </Button>
                        </div>
                    </div>

                    {/* Custom Amount */}
                    <div
                        style={{
                            padding: '1.25rem',
                            background: 'var(--bg-surface)',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{t('tipping.customAmount')}</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                Customers can enter any tip amount in EGP
                            </div>
                        </div>
                        <button
                            onClick={() => setAllowCustom(!allowCustom)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: allowCustom ? 'var(--color-primary-500)' : 'var(--text-tertiary)',
                            }}
                        >
                            {allowCustom ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                        </button>
                    </div>

                    {/* Distribution Method */}
                    <div
                        style={{
                            padding: '1.25rem',
                            background: 'var(--bg-surface)',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '1rem' }}>
                            <Users size={16} style={{ display: 'inline', marginRight: 8 }} />
                            {t('tipping.distribution')}
                        </div>
                        <Select
                            label="How should tips be distributed?"
                            options={[
                                { value: 'individual', label: 'Individual — Goes to the assigned employee' },
                                { value: 'pool', label: 'Pool — Split equally among all staff' },
                                { value: 'split', label: 'Split — Custom split by role/position' },
                            ]}
                            value={distribution}
                            onChange={e => setDistribution(e.target.value as TipConfig['distribution_method'])}
                        />
                    </div>
                </>
            )}

            <div>
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save size={16} /> {isSaving ? 'Saving...' : t('common.save')}
                </Button>
            </div>
        </div>
    );
}
