'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Smartphone, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui';
import styles from './login.module.css';

export default function LoginPage() {
    const { requestOTP, verifyOTP } = useAuth();
    const { addToast } = useToast();

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
        if (!identifier.trim()) return addToast('error', 'Please enter an Email or Phone number');

        setIsLoading(true);
        try {
            const res = await requestOTP(identifier);
            if (res.success) {
                setOtpMethod(res.type);
                setStep('verify');
                setCountdown(60);
                addToast('success', `Verification code sent via ${res.type === 'email' ? 'Email' : 'WhatsApp'}`);
            }
        } catch (err) {
            addToast('error', 'Failed to request OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otpCode.join('');
        if (code.length < 6) return addToast('error', 'Please enter the 6-digit code');

        setIsLoading(true);
        try {
            const res = await verifyOTP(identifier, code);
            if (!res.success) {
                addToast('error', res.error || 'Invalid code');
                setOtpCode(['', '', '', '', '', '']); // clear on fail
            } else {
                addToast('success', 'Authentication successful!');
            }
        } catch (err) {
            addToast('error', 'Verification failed');
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
                    <h1>{step === 'request' ? 'Welcome Back' : 'Verify Identity'}</h1>
                    <p>
                        {step === 'request'
                            ? 'Enter your email or phone number to sign in securely.'
                            : `We sent a 6-digit code to ${identifier}.`}
                    </p>
                </div>

                {step === 'request' ? (
                    <form className={styles.form} onSubmit={handleRequestOTP}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Email or Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                                    {identifier.includes('@') ? <Mail size={18} /> : <Smartphone size={18} />}
                                </div>
                                <input
                                    type="text"
                                    className={styles.loginInput}
                                    style={{ width: '100%', height: 48, paddingLeft: 44, paddingRight: 16, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: 'var(--text-base)' }}
                                    placeholder="user@example.com or +20..."
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
                            {isLoading ? 'Sending Code...' : 'Continue'}
                        </button>
                    </form>
                ) : (
                    <form className={styles.form} onSubmit={handleVerifyOTP}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} style={{ textAlign: 'center' }}>Secure OTP Code</label>
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
                            {isLoading ? 'Verifying...' : 'Verify & Login'}
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
                                {countdown > 0 ? `Resend code in 0:${countdown.toString().padStart(2, '0')}` : 'Resend Code'}
                            </button>
                        </div>
                    </form>
                )}

                <div className={styles.tip} style={{ marginTop: 'var(--space-6)' }}>
                    {step === 'request'
                        ? 'For this demo, enter any email (e.g. clinic@hagzy.com) to simulate sending an OTP.'
                        : <span>The mock Verification Code is <strong>123456</strong>.</span>}
                </div>
            </div>
        </div>
    );
}
