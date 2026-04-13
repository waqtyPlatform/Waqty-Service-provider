'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ToggleLeft, ToggleRight, Coins, Award } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi, type LoyaltyConfig, type LoyaltyTier } from '@/lib/api';

const defaultConfig: LoyaltyConfig = {
    enabled: false,
    points_per_egp: 1,
    points_per_booking: 50,
    referral_bonus: 200,
    tiers: [
        { name: 'Bronze', min_points: 0, discount_percentage: 0, color: '#CD7F32' },
        { name: 'Silver', min_points: 500, discount_percentage: 5, color: '#C0C0C0' },
        { name: 'Gold', min_points: 2000, discount_percentage: 10, color: '#FFD700' },
        { name: 'Platinum', min_points: 5000, discount_percentage: 15, color: '#E5E4E2' },
    ],
    redemption_rate: 100,
};

export default function LoyaltySettingsPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const { data: config } = useApiQuery(() => settingsApi.getLoyaltyConfig(), [], { fallbackData: defaultConfig });

    const [enabled, setEnabled] = useState(defaultConfig.enabled);
    const [pointsPerEgp, setPointsPerEgp] = useState(defaultConfig.points_per_egp);
    const [pointsPerBooking, setPointsPerBooking] = useState(defaultConfig.points_per_booking);
    const [referralBonus, setReferralBonus] = useState(defaultConfig.referral_bonus);
    const [tiers, setTiers] = useState<LoyaltyTier[]>(defaultConfig.tiers);
    const [redemptionRate, setRedemptionRate] = useState(defaultConfig.redemption_rate);

    useEffect(() => {
        if (config) {
            setEnabled(config.enabled);
            setPointsPerEgp(config.points_per_egp);
            setPointsPerBooking(config.points_per_booking);
            setReferralBonus(config.referral_bonus);
            setTiers(config.tiers);
            setRedemptionRate(config.redemption_rate);
        }
    }, [config]);

    const updateTier = (index: number, field: keyof LoyaltyTier, value: string | number) => {
        setTiers(prev => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
    };

    const addTier = () => {
        setTiers(prev => [...prev, { name: 'New Tier', min_points: 0, discount_percentage: 0, color: '#888888' }]);
    };

    const removeTier = (index: number) => {
        setTiers(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await settingsApi.updateLoyaltyConfig({
                enabled,
                points_per_egp: pointsPerEgp,
                points_per_booking: pointsPerBooking,
                referral_bonus: referralBonus,
                tiers,
                redemption_rate: redemptionRate,
            });
            addToast('success', 'Loyalty settings saved');
        } catch {
            addToast('error', 'Failed to save loyalty settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 720 }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('loyalty.title')}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
                    {t('loyalty.subtitle') || 'Configure points, tiers, and rewards for your customers'}
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
                    <div style={{ fontWeight: 600 }}>{t('loyalty.enable')}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        Customers earn points and unlock rewards
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
                    {/* Earning Rules */}
                    <div
                        style={{
                            padding: '1.25rem',
                            background: 'var(--bg-surface)',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <div style={{ fontWeight: 600, marginBottom: '1rem' }}>
                            <Coins size={16} style={{ display: 'inline', marginRight: 8 }} />
                            {t('loyalty.earningRules')}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input
                                type="number"
                                label={t('loyalty.pointsPerEgp')}
                                value={String(pointsPerEgp)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setPointsPerEgp(Number(e.target.value))
                                }
                            />
                            <Input
                                type="number"
                                label={t('loyalty.pointsPerBooking')}
                                value={String(pointsPerBooking)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setPointsPerBooking(Number(e.target.value))
                                }
                            />
                            <Input
                                type="number"
                                label={t('loyalty.referralBonus')}
                                value={String(referralBonus)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setReferralBonus(Number(e.target.value))
                                }
                            />
                            <Input
                                type="number"
                                label={t('loyalty.redemptionRate')}
                                value={String(redemptionRate)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setRedemptionRate(Number(e.target.value))
                                }
                            />
                        </div>
                    </div>

                    {/* Tiers */}
                    <div
                        style={{
                            padding: '1.25rem',
                            background: 'var(--bg-surface)',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem',
                            }}
                        >
                            <div style={{ fontWeight: 600 }}>
                                <Award size={16} style={{ display: 'inline', marginRight: 8 }} />
                                {t('loyalty.tiers')}
                            </div>
                            <Button size="sm" variant="outline" onClick={addTier}>
                                <Plus size={14} /> {t('loyalty.addTier')}
                            </Button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {tiers.map((tier, i) => (
                                <div
                                    key={`${tier.name}-${tier.min_points}-${i}`}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '8px 1fr 100px 100px auto',
                                        gap: '0.75rem',
                                        alignItems: 'end',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        background: 'var(--bg-secondary)',
                                    }}
                                >
                                    <input
                                        type="color"
                                        value={tier.color}
                                        onChange={e => updateTier(i, 'color', e.target.value)}
                                        style={{
                                            width: 8,
                                            height: 32,
                                            border: 'none',
                                            padding: 0,
                                            cursor: 'pointer',
                                            borderRadius: 4,
                                        }}
                                    />
                                    <Input
                                        label="Name"
                                        value={tier.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            updateTier(i, 'name', e.target.value)
                                        }
                                    />
                                    <Input
                                        type="number"
                                        label="Min Points"
                                        value={String(tier.min_points)}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            updateTier(i, 'min_points', Number(e.target.value))
                                        }
                                    />
                                    <Input
                                        type="number"
                                        label="Discount %"
                                        value={String(tier.discount_percentage)}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            updateTier(i, 'discount_percentage', Number(e.target.value))
                                        }
                                    />
                                    <Button size="sm" variant="ghost" onClick={() => removeTier(i)}>
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
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
