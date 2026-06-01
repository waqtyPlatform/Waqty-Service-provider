'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Image as ImageIcon } from 'lucide-react';
import { Button, Input, Select, Checkbox, Stepper, Textarea } from '@/components/ui';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function NewServicePage() {
    const router = useRouter();
    const { t, lang } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        tax: true,
        duration: '45',
        buffer: '10',
        online: true,
        gender: 'unisex',
    });

    const steps = [
        t('settings.services.new.step1'),
        t('settings.services.new.step2'),
        t('settings.services.new.step3'),
        t('settings.services.new.step4'),
        t('settings.services.new.step5'),
        t('settings.services.new.step6'),
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit
            router.push('/settings/services');
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
                        />
                        <Select
                            label={t('settings.services.new.category')}
                            options={[
                                { value: 'hair', label: t('settings.services.new.catHair') },
                                { value: 'nails', label: t('settings.services.new.catNails') },
                                { value: 'spa', label: t('settings.services.new.catSpa') },
                            ]}
                        />
                        <Textarea
                            label={t('settings.services.new.desc')}
                            placeholder={t('settings.services.new.descHint')}
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
                            />
                            <Input
                                label={t('settings.services.new.costPrice')}
                                placeholder="0.00"
                                type="number"
                                dir="ltr"
                            />
                        </div>
                        <Checkbox label={t('settings.services.new.taxable')} checked={formData.tax} />
                        <Checkbox label={t('settings.services.new.allowOnline')} checked={formData.online} />
                    </div>
                );
            case 2:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>{t('settings.services.new.durationTitle')}</h2>
                        <div className={styles.grid2}>
                            <Input
                                label={t('settings.services.new.durationMin')}
                                defaultValue="45"
                                type="number"
                                dir="ltr"
                            />
                            <Input
                                label={t('settings.services.new.bufferAfter')}
                                defaultValue="10"
                                type="number"
                                hint={t('settings.services.new.bufferHint')}
                                dir="ltr"
                            />
                        </div>
                        <div className={styles.grid2}>
                            <Input
                                label={t('settings.services.new.processDuring')}
                                defaultValue="0"
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
                            options={[
                                { value: 'none', label: t('settings.services.new.resNone') },
                                { value: 'chair', label: t('settings.services.new.resChair') },
                                { value: 'room', label: t('settings.services.new.resRoom') },
                            ]}
                        />
                        <Select
                            label={t('settings.services.new.targetGender')}
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
                            />
                            <Input
                                label={t('settings.services.new.commFixed')}
                                placeholder="e.g. 50"
                                type="number"
                                dir="ltr"
                            />
                        </div>
                        <Checkbox label={t('settings.services.new.deductCost')} checked={true} />
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
                    <Button onClick={nextStep}>
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
