'use client';

import React, { useState } from 'react';
import { Check, Crown, Zap, Star, Calendar, CreditCard, Users, Building2, ArrowRight, Shield } from 'lucide-react';
import SettingsTabs from '@/components/SettingsTabs';
import { Button } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

// Removed hardcoded plans/stats from here as they need translation and have been moved into the component

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' },
    currentPlan: {
        background: 'linear-gradient(135deg, var(--color-primary-50), rgba(99,102,241,0.05))',
        border: '1px solid var(--color-primary-200, var(--border-color))',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
    },
    currentPlanHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-5)',
    },
    planBadge: {
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 12px', borderRadius: 'var(--radius-full)',
        fontSize: 12, fontWeight: 'var(--font-semibold)',
        background: 'var(--color-primary-500)', color: 'white',
    },
    usageGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' },
    usageCard: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
    },
    progressBar: { height: 6, borderRadius: 3, background: 'var(--color-gray-100)', overflow: 'hidden', marginTop: 6 },
    progressFill: { height: '100%', borderRadius: 3, background: 'var(--color-primary-500)', transition: 'width 0.6s ease' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)' },
    card: {
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        display: 'flex', flexDirection: 'column' as const,
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative' as const,
    },
    cardHeader: {
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        marginBottom: 'var(--space-4)',
    },
    iconCircle: {
        width: 48, height: 48, borderRadius: 'var(--radius-lg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    planName: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' },
    planDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)', lineHeight: 1.5 },
    priceRow: { display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 'var(--space-5)' },
    price: { fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    period: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    divider: { height: 1, background: 'var(--border-color)', margin: '0 0 var(--space-4)' },
    features: { display: 'flex', flexDirection: 'column' as const, gap: 'var(--space-3)', flex: 1 },
    feature: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' },
    currentBadge: {
        position: 'absolute' as const, top: -12, right: 16,
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 14px', borderRadius: 'var(--radius-full)',
        fontSize: 11, fontWeight: 'var(--font-bold)',
        background: 'var(--color-primary-500)', color: 'white',
        boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
    },
    billingInfo: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-5)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
};

export default function SubscriptionPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const { t, lang } = useTranslation();

    const plans = [
        {
            name: t('settings.subscription.plans.starter'),
            price: 499,
            period: t('settings.subscription.mo'),
            current: false,
            color: 'var(--color-gray-500)',
            gradient: 'linear-gradient(135deg, var(--color-gray-50), var(--color-gray-100))',
            borderColor: 'var(--border-color)',
            icon: <Zap size={24} />,
            desc: t('settings.subscription.starterDesc'),
            features: [t('settings.subscription.feat.1branch'), t('settings.subscription.feat.5emp'), t('settings.subscription.feat.basicRep'), t('settings.subscription.feat.sms'), t('settings.subscription.feat.emailSup')],
        },
        {
            name: t('settings.subscription.plans.pro'),
            price: 999,
            period: t('settings.subscription.mo'),
            current: true,
            color: 'var(--color-primary-500)',
            gradient: 'linear-gradient(135deg, var(--color-primary-50), rgba(99,102,241,0.08))',
            borderColor: 'var(--color-primary-500)',
            icon: <Star size={24} />,
            desc: t('settings.subscription.proDesc'),
            features: [t('settings.subscription.feat.3branches'), t('settings.subscription.feat.15emp'), t('settings.subscription.feat.advRep'), t('settings.subscription.feat.smsWa'), t('settings.subscription.feat.prioSup'), t('settings.subscription.feat.marketing'), t('settings.subscription.feat.integrations')],
        },
        {
            name: t('settings.subscription.plans.enterprise'),
            price: 1999,
            period: t('settings.subscription.mo'),
            current: false,
            color: '#F59E0B',
            gradient: 'linear-gradient(135deg, #FFFBEB, rgba(245,158,11,0.06))',
            borderColor: '#F59E0B',
            icon: <Crown size={24} />,
            desc: t('settings.subscription.enterpriseDesc'),
            features: [t('settings.subscription.feat.unlBranches'), t('settings.subscription.feat.unlEmp'), t('settings.subscription.feat.customRep'), t('settings.subscription.feat.allChan'), t('settings.subscription.feat.support247'), t('settings.subscription.feat.fullMarketing'), t('settings.subscription.feat.allIntegrations'), t('settings.subscription.feat.api'), t('settings.subscription.feat.accManager')],
        },
    ];

    const usageStats = [
        { label: t('settings.subscription.teamMembers'), value: '8 / 15', icon: <Users size={18} />, percent: 53 },
        { label: t('settings.subscription.activeBranches'), value: '2 / 3', icon: <Building2 size={18} />, percent: 67 },
    ];

    return (
        <div style={s.page}>
            <SettingsTabs />

            {/* Current Plan Summary */}
            <div style={s.currentPlan}>
                <div style={s.currentPlanHeader}>
                    <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{t('settings.subscription.currentPlanLabel')}</div>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Star size={20} style={{ color: 'var(--color-primary-500)' }} /> {t('settings.subscription.plans.pro')}
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Calendar size={14} /> {t('settings.subscription.renewsOn')}
                        </div>
                    </div>
                    <div style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>999 <span style={{ fontSize: 'var(--text-sm)' }}>EGP</span><span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 'var(--font-normal)' }}>{t('settings.subscription.mo')}</span></div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{t('settings.subscription.billedMonthly')}</div>
                    </div>
                </div>

                {/* Usage Stats */}
                <div style={s.usageGrid}>
                    {usageStats.map(stat => (
                        <div key={stat.label} style={s.usageCard}>
                            <div style={{ color: 'var(--color-primary-500)' }}>{stat.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
                                    <span style={{ fontWeight: 'var(--font-semibold)' }}>{stat.value}</span>
                                </div>
                                <div style={s.progressBar}>
                                    <div style={{ ...s.progressFill, width: `${stat.percent}%` }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    display: 'inline-flex', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
                    padding: 3, gap: 2, border: '1px solid var(--border-color)',
                }}>
                    {(['monthly', 'annual'] as const).map(cycle => (
                        <button
                            key={cycle}
                            onClick={() => setBillingCycle(cycle)}
                            style={{
                                padding: '8px 20px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-medium)', border: 'none', cursor: 'pointer',
                                background: billingCycle === cycle ? 'var(--bg-primary)' : 'transparent',
                                color: billingCycle === cycle ? 'var(--text-primary)' : 'var(--text-tertiary)',
                                boxShadow: billingCycle === cycle ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.2s',
                            }}
                        >
                            {cycle === 'monthly' ? t('settings.subscription.monthly') : t('settings.subscription.annual')} {cycle === 'annual' && <span style={{ color: 'var(--color-success)', fontSize: 11, fontWeight: 'var(--font-bold)' }}>{t('settings.subscription.save20')}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plans Grid */}
            <div style={s.grid}>
                {plans.map(plan => {
                    const displayPrice = billingCycle === 'annual' ? Math.round(plan.price * 0.8) : plan.price;
                    return (
                        <div
                            key={plan.name}
                            style={{
                                ...s.card,
                                border: plan.current ? `2px solid ${plan.borderColor}` : '1px solid var(--border-color)',
                                background: plan.gradient,
                            }}
                        >
                            {plan.current && <div style={s.currentBadge}><Star size={12} /> {t('settings.subscription.yourPlan')}</div>}

                            <div style={s.cardHeader}>
                                <div style={{ ...s.iconCircle, background: `${plan.color}15`, color: plan.color }}>
                                    {plan.icon}
                                </div>
                                <div style={{ ...s.planName, color: plan.color }}>{plan.name}</div>
                            </div>

                            <div style={s.planDesc}>{plan.desc}</div>

                            <div style={s.priceRow}>
                                <span style={s.price}>{displayPrice}</span>
                                <span style={s.period}>EGP{plan.period}</span>
                            </div>

                            <div style={s.divider} />

                            <div style={s.features}>
                                {plan.features.map(f => (
                                    <div key={f} style={s.feature}>
                                        <Check size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} /> {f}
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.current ? 'ghost' : 'primary'}
                                style={{
                                    marginTop: 'var(--space-5)', width: '100%',
                                    ...(plan.current ? {} : { background: plan.color }),
                                }}
                                disabled={plan.current}
                            >
                                {plan.current ? t('settings.subscription.currentPlanBtn') : <>{t('settings.subscription.upgrade')} <ArrowRight size={16} className={lang === 'ar' ? 'mr-2' : 'ml-2'} /></>}
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* Billing Info */}
            <div style={s.billingInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ color: 'var(--text-tertiary)' }}><CreditCard size={20} /></div>
                    <div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{t('settings.subscription.paymentMethod')}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t('settings.subscription.visaEnding')}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
                        <Shield size={14} /> {t('settings.subscription.securedBy')}
                    </div>
                    <Button variant="ghost" size="sm">{t('settings.subscription.update')}</Button>
                </div>
            </div>
        </div>
    );
}
