'use client';

import React, { useState } from 'react';
import { Send, Upload, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button, Select } from '@/components/ui';
import { useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { bugReportApi } from '@/lib/api';
import Link from 'next/link';

export default function BugReportPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [category, setCategory] = useState('');
    const [severity, setSeverity] = useState('medium');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category) return addToast('error', 'Please select a category');
        if (!description.trim()) return addToast('error', 'Please describe the issue');

        setIsSubmitting(true);
        try {
            let screenshotUrl: string | null = null;
            if (screenshot) {
                const formData = new FormData();
                formData.append('screenshot', screenshot);
                try {
                    const uploadRes = await bugReportApi.uploadScreenshot(formData);
                    screenshotUrl = uploadRes.data?.url || null;
                } catch {
                    addToast('warning', 'Screenshot upload failed — report will be submitted without it');
                }
            }

            await bugReportApi.submitBugReport({
                category,
                severity,
                description,
                steps_to_reproduce: steps,
                screenshot_url: screenshotUrl,
                page_url: typeof window !== 'undefined' ? window.location.href : '',
                browser_info: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                user_role: 'provider',
            });

            setSubmitted(true);
            addToast('success', 'Bug report submitted successfully');
        } catch {
            addToast('error', 'Failed to submit bug report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                }}
            >
                <CheckCircle size={64} color="var(--color-success-500)" />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('bugReport.submitted')}</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>
                    Thank you for reporting this issue. Our team will review it and work on a fix. You&apos;ll be
                    notified when it&apos;s resolved.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSubmitted(false);
                            setCategory('');
                            setDescription('');
                            setSteps('');
                            setScreenshot(null);
                        }}
                    >
                        Report Another Issue
                    </Button>
                    <Link href="/help">
                        <Button variant="secondary">Back to Help Center</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 640 }}>
            <div>
                <Link
                    href="/help"
                    style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-tertiary)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        marginBottom: 8,
                    }}
                >
                    <ArrowLeft size={14} /> Back to Help Center
                </Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('bugReport.title')}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
                    {t('bugReport.subtitle')}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Select
                        label={t('bugReport.category')}
                        options={[
                            { value: '', label: 'Select category...' },
                            { value: 'bookings', label: 'Bookings' },
                            { value: 'customers', label: 'Customers' },
                            { value: 'employees', label: 'Employees' },
                            { value: 'payments', label: 'Payments & Transactions' },
                            { value: 'marketing', label: 'Marketing' },
                            { value: 'reports', label: 'Reports' },
                            { value: 'settings', label: 'Settings' },
                            { value: 'login', label: 'Login & Authentication' },
                            { value: 'ui', label: 'UI / Display Issue' },
                            { value: 'performance', label: 'Performance / Speed' },
                            { value: 'other', label: 'Other' },
                        ]}
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    />
                    <Select
                        label={t('bugReport.severity')}
                        options={[
                            { value: 'low', label: 'Low — Minor inconvenience' },
                            { value: 'medium', label: 'Medium — Feature not working' },
                            { value: 'high', label: 'High — Blocking my work' },
                            { value: 'critical', label: 'Critical — Data loss / security' },
                        ]}
                        value={severity}
                        onChange={e => setSeverity(e.target.value)}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6 }}>
                        {t('bugReport.description')} *
                    </label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Describe the issue you encountered..."
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6 }}>
                        {t('bugReport.steps')}
                    </label>
                    <textarea
                        value={steps}
                        onChange={e => setSteps(e.target.value)}
                        placeholder={'1. Go to ...\n2. Click on ...\n3. See error ...'}
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6 }}>
                        {t('bugReport.screenshot')}
                    </label>
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            padding: '1.5rem',
                            borderRadius: '0.5rem',
                            border: '2px dashed var(--border)',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                            transition: 'border-color 0.2s',
                        }}
                    >
                        <Upload size={18} />
                        {screenshot ? screenshot.name : 'Click to upload a screenshot'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setScreenshot(e.target.files?.[0] || null)}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                <div
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        background: 'var(--bg-secondary)',
                        fontSize: '0.75rem',
                        color: 'var(--text-tertiary)',
                    }}
                >
                    System info is automatically captured: browser version, current page, and your account role.
                </div>

                <div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>Submitting...</>
                        ) : (
                            <>
                                <Send size={16} /> {t('bugReport.submit')}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
