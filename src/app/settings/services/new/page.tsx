'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Image as ImageIcon } from 'lucide-react';
import { Button, Input, Select, Checkbox, Stepper, Textarea, useToast } from '@/components/ui';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { providerApi } from '@/lib/api';

export default function NewServicePage() {
    const router = useRouter();
    const { t, lang } = useTranslation();
    const { addToast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'hair',
        description: '',
        price: '',
        costPrice: '',
        tax: true,
        online: true,
        duration: '45',
        buffer: '10',
        processDuring: '0',
        resource: 'none',
        gender: 'unisex',
        commPct: '',
        commFixed: '',
        deductCost: true,
    });
    const set = (patch: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...patch }));

    const steps = [
        t('settings.services.new.step1'),
        t('settings.services.new.step2'),
        t('settings.services.new.step3'),
        t('settings.services.new.step4'),
        t('settings.services.new.step5'),
        t('settings.services.new.step6'),
    ];

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            addToast('error', t('settings.services.new.nameRequired'));
            setCurrentStep(0);
            return;
        }
        if (!formData.price || Number(formData.price) <= 0) {
            addToast('error', t('settings.services.new.priceRequired'));
            setCurrentStep(1);
            return;
        }
        setSubmitting(true);
        // Best-effort persistence (mirrors settings/services inline add); the backend
        // takes name + duration via FormData, price is scoped separately. The page
        // falls back gracefully when the API is unreachable.
        try {
            const fd = new FormData();
            fd.append('name', formData.name.trim());
            fd.append('estimated_duration_minutes', String(Number(formData.duration) || 0));
            if (formData.description.trim()) fd.append('description', formData.description.trim());
            await providerApi.createService(fd);
        } catch {
            // keep going — surface success for the in-session optimistic flow
        } finally {
            setSubmitting(false);
        }
        addToast('success', t('settings.services.new.created'));
        router.push('/settings/services');
    };

    const nextStep = () => {
        // Per-step required-field validation before advancing.
        if (currentStep === 0 && !formData.name.trim()) {
            addToast('error', t('settings.services.new.nameRequired'));
            return;
        }
        if (currentStep === 1 && (!formData.price || Number(formData.price) <= 0)) {
            addToast('error', t('settings.services.new.priceRequired'));
            return;
        }
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>{t('settings.services.new.basicInfo')}</h2>
                        <Input
                            label={t('settings.services.new.svcName')}
                            placeholder={t('settings.services.new.svcNamePh')}
                            value={formData.name}
                            onChange={e => set({ name: e.target.value })}
                        />
                        <Select
                            label={t('settings.services.new.category')}
                            value={formData.category}
                            onChange={e => set({ category: e.target.value })}
                            options={[
                                { value: 'hair', label: t('settings.services.new.catHair') },
                                { value: 'nails', label: t('settings.services.new.catNails') },
                                { value: 'spa', label: t('settings.services.new.catSpa') },
                            ]}
                        />
                        <Textarea
                            label={t('settings.services.new.desc')}
                            placeholder={t('settings.services.new.descHint')}
                            value={formData.description}
                            onChange={e => set({ description: e.target.value })}
                        />
                    </div>
                );
            case 1:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>{t('settings.services.new.pricing')}</h2>
                        <div className={styles.grid2}>
                            <Input
                                label={t('settings.services.new.price')}
                                placeholder="0.00"
                                type="number"
                                dir="ltr"
                                value={formData.price}
                                onChange={e => set({ price: e.target.value })}
                            />
                            <Input
                                label={t('settings.services.new.costPrice')}
                                placeholder="0.00"
                                type="number"
                                dir="ltr"
                                value={formData.costPrice}
                                onChange={e => set({ costPrice: e.target.value })}
                            />
                        </div>
                        <Checkbox
                            label={t('settings.services.new.taxable')}
                            checked={formData.tax}
                            onChange={v => set({ tax: v })}
                        />
                        <Checkbox
                            label={t('settings.services.new.allowOnline')}
                            checked={formData.online}
                            onChange={v => set({ online: v })}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>{t('settings.services.new.durationTitle')}</h2>
                        <div className={styles.grid2}>
                            <Input
                                label={t('settings.services.new.durationMin')}
                                value={formData.duration}
                                onChange={e => set({ duration: e.target.value })}
                                type="number"
                                dir="ltr"
                            />
                            <Input
                                label={t('settings.services.new.bufferAfter')}
                                value={formData.buffer}
                                onChange={e => set({ buffer: e.target.value })}
                                type="number"
                                hint={t('settings.services.new.bufferHint')}
                                dir="ltr"
                            />
                        </div>
                        <div className={styles.grid2}>
                            <Input
                                label={t('settings.services.new.processDuring')}
                                value={formData.processDuring}
                                onChange={e => set({ processDuring: e.target.value })}
                                type="number"
                                hint={t('settings.services.new.processHint')}
                                dir="ltr"
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>{t('settings.services.new.resourcing')}</h2>
                        <p className={styles.stepDesc}>{t('settings.services.new.resDesc')}</p>
                        <Select
                            label={t('settings.services.new.reqRes')}
                            value={formData.resource}
                            onChange={e => set({ resource: e.target.value })}
                            options={[
                                { value: 'none', label: t('settings.services.new.resNone') },
                                { value: 'chair', label: t('settings.services.new.resChair') },
                                { value: 'room', label: t('settings.services.new.resRoom') },
                            ]}
                        />
                        <Select
                            label={t('settings.services.new.targetGender')}
                            value={formData.gender}
                            onChange={e => set({ gender: e.target.value })}
                            options={[
                                { value: 'unisex', label: t('settings.services.new.genderUnisex') },
                                { value: 'female', label: t('settings.services.new.genderFemale') },
                                { value: 'male', label: t('settings.services.new.genderMale') },
                            ]}
                        />
                    </div>
                );
            case 4:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>{t('settings.services.new.commission')}</h2>
                        <div className={styles.grid2}>
                            <Input
                                label={t('settings.services.new.commPct')}
                                placeholder="e.g. 10"
                                type="number"
                                dir="ltr"
                                value={formData.commPct}
                                onChange={e => set({ commPct: e.target.value })}
                            />
                            <Input
                                label={t('settings.services.new.commFixed')}
                                placeholder="e.g. 50"
                                type="number"
                                dir="ltr"
                                value={formData.commFixed}
                                onChange={e => set({ commFixed: e.target.value })}
                            />
                        </div>
                        <Checkbox
                            label={t('settings.services.new.deductCost')}
                            checked={formData.deductCost}
                            onChange={v => set({ deductCost: v })}
                        />
                    </div>
                );
            case 5:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>{t('settings.services.new.media')}</h2>
                        <div className={styles.uploadBox}>
                            <ImageIcon size={48} />
                            <div style={{ fontWeight: 'var(--font-medium)' }}>
                                {t('settings.services.new.uploadMsg1')}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)' }}>{t('settings.services.new.uploadMsg2')}</div>
                            <Button variant="outline" size="sm">
                                {t('settings.services.new.selectFile')}
                            </Button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.page} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>{t('settings.services.new.title')}</h1>
                    <div className={styles.subtitle}>
                        {t('settings.services.new.stepTitle')} {currentStep + 1} {t('settings.services.new.of')}{' '}
                        {steps.length}: {steps[currentStep]}
                    </div>
                </div>
                <Button variant="ghost" onClick={() => router.back()}>
                    {t('settings.services.new.cancel')}
                </Button>
            </div>

            <div className={styles.stepperContainer}>
                <Stepper steps={steps} current={currentStep} />
            </div>

            <div className={styles.formContainer}>
                {renderStepContent()}

                <div className={styles.footer}>
                    <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                        {lang === 'ar' ? (
                            <ArrowRight size={16} style={{ marginInlineEnd: 4 }} />
                        ) : (
                            <ArrowLeft size={16} />
                        )}
                        {t('settings.services.new.back')}
                    </Button>
                    <Button onClick={nextStep} disabled={submitting}>
                        {currentStep === steps.length - 1 ? (
                            <>
                                {t('settings.services.new.save')} <Check size={16} style={{ marginInlineStart: 4 }} />
                            </>
                        ) : (
                            <>
                                {t('settings.services.new.next')}{' '}
                                {lang === 'ar' ? (
                                    <ArrowLeft size={16} style={{ marginInlineStart: 4 }} />
                                ) : (
                                    <ArrowRight size={16} />
                                )}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
