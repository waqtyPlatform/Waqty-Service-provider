'use client';

import React, { useState } from 'react';
import {
    ArrowRight,
    ArrowLeft,
    Check,
    Upload,
    DollarSign,
    Clock,
    Users,
    FileText,
    Image as ImageIcon
} from 'lucide-react';
import {
    Button,
    Input,
    Select,
    Checkbox,
    Stepper,
    Textarea
} from '@/components/ui';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

const steps = [
    'Basic Info',
    'Pricing',
    'Duration',
    'Resourcing',
    'Commission',
    'Media'
];

export default function NewServicePage() {
    const router = useRouter();
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
        gender: 'unisex'
    });

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
                        <h2 className={styles.stepTitle}>Basic Information</h2>
                        <Input label="Service Name" placeholder="e.g. Hair Cut & Style" />
                        <Select
                            label="Category"
                            options={[
                                { value: 'hair', label: 'Hair Styling' },
                                { value: 'nails', label: 'Nails' },
                                { value: 'spa', label: 'Spa & Massage' }
                            ]}
                        />
                        <Textarea label="Description" placeholder="Brief description for online booking..." />
                    </div>
                );
            case 1:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>Pricing & Tax</h2>
                        <div className={styles.grid2}>
                            <Input label="Price (EGP)" placeholder="0.00" type="number" />
                            <Input label="Cost Price (Optional)" placeholder="0.00" type="number" />
                        </div>
                        <Checkbox label="Taxable Service (14% VAT)" checked={formData.tax} />
                        <Checkbox label="Allow Online Booking" checked={formData.online} />
                    </div>
                );
            case 2:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>Duration & Timing</h2>
                        <div className={styles.grid2}>
                            <Input label="Duration (minutes)" defaultValue="45" type="number" />
                            <Input label="Buffer Time (after)" defaultValue="10" type="number" hint="Clean-up time" />
                        </div>
                        <div className={styles.grid2}>
                            <Input label="Processing Time (during)" defaultValue="0" type="number" hint="Gap for chemicals to set" />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>Resourcing</h2>
                        <p className={styles.stepDesc}>Which rooms or equipment are required?</p>
                        <Select
                            label="Required Resource"
                            options={[
                                { value: 'none', label: 'None' },
                                { value: 'chair', label: 'Styling Chair' },
                                { value: 'room', label: 'Private Room' }
                            ]}
                        />
                        <Select
                            label="Target Gender"
                            options={[
                                { value: 'unisex', label: 'Unisex' },
                                { value: 'female', label: 'Female Only' },
                                { value: 'male', label: 'Male Only' }
                            ]}
                        />
                    </div>
                );
            case 4:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>Staff Commission</h2>
                        <div className={styles.grid2}>
                            <Input label="Commission %" placeholder="e.g. 10" type="number" />
                            <Input label="Fixed Amount" placeholder="e.g. 50" type="number" />
                        </div>
                        <Checkbox label="Deduct Consumables Cost Before Commission" checked={true} />
                    </div>
                );
            case 5:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>Media & Preview</h2>
                        <div className={styles.uploadBox}>
                            <ImageIcon size={48} />
                            <div style={{ fontWeight: 'var(--font-medium)' }}>Click to upload image</div>
                            <div style={{ fontSize: 'var(--text-xs)' }}>Supports JPG, PNG (Max 5MB)</div>
                            <Button variant="outline" size="sm">Select File</Button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>New Service Setup</h1>
                    <div className={styles.subtitle}>Step {currentStep + 1} of {steps.length}: {steps[currentStep]}</div>
                </div>
                <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
            </div>

            <div className={styles.stepperContainer}>
                <Stepper steps={steps} current={currentStep} />
            </div>

            <div className={styles.formContainer}>
                {renderStepContent()}

                <div className={styles.footer}>
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                    >
                        <ArrowLeft size={16} /> Back
                    </Button>
                    <Button onClick={nextStep}>
                        {currentStep === steps.length - 1 ? (
                            <>Save Service <Check size={16} /></>
                        ) : (
                            <>Next Step <ArrowRight size={16} /></>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
