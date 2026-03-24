'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, ArrowRight, ArrowLeft, ShieldCheck, Lock, Eye, EyeOff, RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import styles from '../login/login.module.css';

export default function ForgotPasswordPage() {
    const { forgotPassword, verifyOtpCode, resetPassword } = useAuth();
    const { addToast } = useToast();
    const { t } = useTranslation();
    const router = useRouter();

    // Steps: 'identifier' -> 'verify' -> 'reset' -> 'success'
    const [step, setStep] = useState<'identifier' | 'verify' | 'reset' | 'success'>('identifier');
    const [identifier, setIdentifier] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // OTP
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(60);

    // New password
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 'verify' && countdown > 0) {
            timer = setInterval(() => setCountdown(c => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    const handleSendCode = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!identifier.trim()) return addToast('error', t('auth.errorEmpty'));
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
            return addToast('error', 'Enter a valid email address');
        }

        setIsLoading(true);
        try {
            const res = await forgotPassword(identifier);
            if (res.success) {
                setStep('verify');
                setCountdown(60);
                addToast('success', t('auth.otpSentEmail'));
            } else {
                addToast('error', res.error || t('auth.errorRequest'));
            }
        } catch {
            addToast('error', t('auth.errorRequest'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otpCode.join('');
        if (code.length < 6) return addToast('error', t('auth.error6Digits'));

        setIsLoading(true);
        try {
            const res = await verifyOtpCode(identifier, code);
            if (res.success && res.valid) {
                setStep('reset');
            } else {
                addToast('error', res.error || 'Invalid or expired code');
                setOtpCode(['', '', '', '', '', '']);
            }
        } catch {
            addToast('error', 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 8) return addToast('error', t('auth.errorPasswordMin'));
        if (newPassword !== confirmPassword) return addToast('error', t('auth.errorPasswordMatch'));

        setIsLoading(true);
        try {
            const code = otpCode.join('');
            const res = await resetPassword(identifier, code, newPassword);
            if (res.success) {
                setStep('success');
            } else {
                addToast('error', res.error || t('auth.errorReset'));
            }
        } catch {
            addToast('error', t('auth.errorReset'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, val: string) => {
        const numericVal = val.replace(/\D/g, '').slice(0, 1);
        const newCode = [...otpCode];
        newCode[index] = numericVal;
        setOtpCode(newCode);

        if (numericVal && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const getTitle = () => {
        switch (step) {
            case 'identifier':
                return t('auth.forgotPasswordTitle');
            case 'verify':
                return t('auth.verifyIdentity');
            case 'reset':
                return t('auth.resetPasswordTitle');
            case 'success':
                return t('auth.passwordResetSuccess');
        }
    };

    const getSubtitle = () => {
        switch (step) {
            case 'identifier':
                return t('auth.forgotPasswordDesc');
            case 'verify':
                return (
                    <>
                        {t('auth.codeSentTo')} <bdi>{identifier}</bdi>
                    </>
                );
            case 'reset':
                return t('auth.resetPasswordDesc');
            case 'success':
                return t('auth.passwordResetSuccessDesc');
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
                    <h1>{getTitle()}</h1>
                    <p>{getSubtitle()}</p>
                </div>

                {step === 'identifier' && (
                    <form className={styles.form} onSubmit={handleSendCode}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t('auth.lblIdentifier')}</label>
                            <div style={{ position: 'relative' }}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-tertiary)',
                                    }}
                                >
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="text"
                                    className={styles.loginInput}
                                    style={{
                                        width: '100%',
                                        height: 48,
                                        paddingLeft: 44,
                                        paddingRight: 16,
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--border-color)',
                                        fontSize: 'var(--text-base)',
                                    }}
                                    placeholder={t('auth.phIdentifier')}
                                    value={identifier}
                                    onChange={e => setIdentifier(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                            {isLoading ? <RefreshCw size={18} className="spin" /> : <ArrowRight size={18} />}
                            {isLoading ? t('auth.btnSending') : t('auth.btnSendCode')}
                        </button>
                    </form>
                )}

                {step === 'verify' && (
                    <form className={styles.form} onSubmit={handleVerifyCode}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} style={{ textAlign: 'center' }}>
                                {t('auth.lblOtp')}
                            </label>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 'var(--space-2)',
                                    justifyContent: 'center',
                                    marginTop: 'var(--space-2)',
                                }}
                            >
                                {otpCode.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        id={`otp-${idx}`}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={e => handleOtpKeyDown(idx, e)}
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
                            {isLoading ? t('auth.btnVerifying') : t('auth.btnVerifyCode')}
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
                            <button
                                type="button"
                                disabled={countdown > 0}
                                onClick={() => handleSendCode()}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: countdown > 0 ? 'var(--text-tertiary)' : 'var(--color-primary-600)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-medium)',
                                    cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {countdown > 0
                                    ? `${t('auth.resendIn')} 0:${countdown.toString().padStart(2, '0')}`
                                    : t('auth.resendCode')}
                            </button>
                        </div>
                    </form>
                )}

                {step === 'reset' && (
                    <form className={styles.form} onSubmit={handleResetPassword}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t('auth.lblNewPassword')}</label>
                            <div style={{ position: 'relative' }}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-tertiary)',
                                    }}
                                >
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    className={styles.loginInput}
                                    style={{
                                        width: '100%',
                                        height: 48,
                                        paddingLeft: 44,
                                        paddingRight: 48,
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--border-color)',
                                        fontSize: 'var(--text-base)',
                                    }}
                                    placeholder={t('auth.phNewPassword')}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: 12,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-tertiary)',
                                        cursor: 'pointer',
                                        padding: 4,
                                    }}
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t('auth.lblConfirmPassword')}</label>
                            <div style={{ position: 'relative' }}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-tertiary)',
                                    }}
                                >
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={styles.loginInput}
                                    style={{
                                        width: '100%',
                                        height: 48,
                                        paddingLeft: 44,
                                        paddingRight: 48,
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--border-color)',
                                        fontSize: 'var(--text-base)',
                                    }}
                                    placeholder={t('auth.phConfirmPassword')}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: 12,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-tertiary)',
                                        cursor: 'pointer',
                                        padding: 4,
                                    }}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                            {isLoading ? <RefreshCw size={18} className="spin" /> : <ArrowRight size={18} />}
                            {isLoading ? t('auth.btnResetting') : t('auth.btnResetPassword')}
                        </button>
                    </form>
                )}

                {step === 'success' && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 'var(--space-6)',
                        }}
                    >
                        <CheckCircle size={56} style={{ color: 'var(--color-success-500)' }} />
                        <Link href="/login" style={{ width: '100%', textDecoration: 'none' }}>
                            <button type="button" className={styles.loginBtn}>
                                <ArrowRight size={18} />
                                {t('auth.btnBackToLogin')}
                            </button>
                        </Link>
                    </div>
                )}

                {step !== 'success' && (
                    <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                        <Link
                            href="/login"
                            style={{
                                color: 'var(--color-primary-600)',
                                fontWeight: 'var(--font-medium)',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--space-1)',
                            }}
                        >
                            <ArrowLeft size={14} />
                            {t('auth.backToLogin')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
