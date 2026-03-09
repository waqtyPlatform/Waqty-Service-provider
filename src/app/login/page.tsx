'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Smartphone, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './login.module.css';

export default function LoginPage() {
    const { requestOTP, verifyOTP } = useAuth();
    const { addToast } = useToast();
    const { t } = useTranslation();

    // State Machine: 'request' -> 'verify'
    const [step, setStep] = useState<'request' | 'verify'>('request');
    const [identifier, setIdentifier] = useState('clinic@hagzy.com'); // Defaulting for ease of demo
    const [otpMethod, setOtpMethod] = useState<'email' | 'phone' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // OTP Input State (6 digits)
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(60);

    // Timer effect for resend
    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 'verify' && countdown > 0) {
            timer = setInterval(() => setCountdown(c => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier.trim()) return addToast('error', t('auth.errorEmpty'));

        setIsLoading(true);
        try {
            const res = await requestOTP(identifier);
            if (res.success) {
                setOtpMethod(res.type);
                setStep('verify');
                setCountdown(60);
                addToast('success', res.type === 'email' ? t('auth.otpSentEmail') : t('auth.otpSentWhatsApp'));
            }
        } catch (err) {
            addToast('error', t('auth.errorRequest'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otpCode.join('');
        if (code.length < 6) return addToast('error', t('auth.error6Digits'));

        setIsLoading(true);
        try {
            const res = await verifyOTP(identifier, code);
            if (!res.success) {
                addToast('error', res.error || t('auth.errorVerify'));
                setOtpCode(['', '', '', '', '', '']); // clear on fail
            } else {
                addToast('success', t('auth.successLogin'));
            }
        } catch (err) {
            addToast('error', t('auth.errorVerify'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, val: string) => {
        const numericVal = val.replace(/\D/g, '').slice(0, 1);
        const newCode = [...otpCode];
        newCode[index] = numericVal;
        setOtpCode(newCode);

        // Auto focus next
        if (numericVal && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Handle backspace auto-focus
        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <div className={styles.logoMark}></div>
                        <span>Hagzy</span>
                    </div>
                    <h1>{step === 'request' ? t('auth.welcomeBack') : t('auth.verifyIdentity')}</h1>
                    <p>
                        {step === 'request'
                            ? t('auth.enterIdentifier')
                            : <>{t('auth.codeSentTo')} <bdi>{identifier}</bdi></>}
                    </p>
                </div>

                {step === 'request' ? (
                    <form className={styles.form} onSubmit={handleRequestOTP}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t('auth.lblIdentifier')}</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                                    {identifier.includes('@') ? <Mail size={18} /> : <Smartphone size={18} />}
                                </div>
                                <input
                                    type="text"
                                    className={styles.loginInput}
                                    style={{ width: '100%', height: 48, paddingLeft: 44, paddingRight: 16, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: 'var(--text-base)' }}
                                    placeholder={t('auth.phIdentifier')}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={styles.loginBtn}
                            disabled={isLoading}
                        >
                            {isLoading ? <RefreshCw size={18} className="spin" /> : <ArrowRight size={18} />}
                            {isLoading ? t('auth.btnSending') : t('auth.btnContinue')}
                        </button>
                    </form>
                ) : (
                    <form className={styles.form} onSubmit={handleVerifyOTP}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} style={{ textAlign: 'center' }}>{t('auth.lblOtp')}</label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
                                {otpCode.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        id={`otp-${idx}`}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                        style={{
                                            width: 44,
                                            height: 52,
                                            textAlign: 'center',
                                            fontSize: 'var(--text-xl)',
                                            fontWeight: 'var(--font-bold)',
                                            borderRadius: 'var(--radius-lg)',
                                            border: `1px solid ${digit ? 'var(--color-primary-500)' : 'var(--border-color)'}`,
                                            background: 'var(--bg-primary)',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                        }}
                                        autoFocus={idx === 0}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={styles.loginBtn}
                            disabled={isLoading || otpCode.join('').length < 6}
                        >
                            {isLoading ? <RefreshCw size={18} className="spin" /> : <ShieldCheck size={18} />}
                            {isLoading ? t('auth.btnVerifying') : t('auth.btnVerifyLogin')}
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
                            <button
                                type="button"
                                disabled={countdown > 0}
                                onClick={handleRequestOTP}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: countdown > 0 ? 'var(--text-tertiary)' : 'var(--color-primary-600)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-medium)',
                                    cursor: countdown > 0 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {countdown > 0 ? `${t('auth.resendIn')} 0:${countdown.toString().padStart(2, '0')}` : t('auth.resendCode')}
                            </button>
                        </div>
                    </form>
                )}

                <div className={styles.tip} style={{ marginTop: 'var(--space-6)' }}>
                    {step === 'request'
                        ? t('auth.demoTipRequest')
                        : <span>{t('auth.demoTipVerify')} <bdi><strong>123456</strong></bdi>.</span>}
                </div>

                {step === 'request' && (
                    <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Don't have a workspace?</span>{' '}
                        <Link href="/onboarding" style={{ color: 'var(--color-primary-600)', fontWeight: 'var(--font-medium)', textDecoration: 'none' }}>
                            Sign up here
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
