'use client';

import React, { useState } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui';
import { useRouter, useParams } from 'next/navigation';
import { Smartphone, ArrowRight, ShieldCheck, RefreshCw, User as UserIcon } from 'lucide-react';
// Reuse the onboarding styles to keep visual consistency perfectly aligned
import styles from '@/app/onboarding/onboarding.module.css';

export default function InviteClaimPage() {
    const { requestOTP, verifyOTP } = useAuth();
    const { t } = useTranslation();
    const { addToast } = useToast();
    const router = useRouter();
    const params = useParams();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Step 1: Verify Phone
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);

    // Step 2: Complete Profile
    const [fullName, setFullName] = useState('');

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim()) return addToast('error', t('invite.toastPhoneReq'));

        setIsLoading(true);
        try {
            const res = await requestOTP(phone);
            if (res.success) {
                setOtpSent(true);
                addToast('success', t('invite.toastCodeSent'));
            }
        } catch (err) {
            addToast('error', t('auth.errorRequest'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyIdentity = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otpCode.join('');
        if (code.length < 6) return addToast('error', t('auth.error6Digits'));

        setIsLoading(true);
        try {
            // Wait! Pass `false` so AuthContext doesn't redirect immediately.
            const res = await verifyOTP(phone, code, false);
            if (!res.success) {
                addToast('error', res.error || t('auth.errorVerify'));
                setOtpCode(['', '', '', '', '', '']);
            } else {
                addToast('success', t('invite.toastIdentityVerified'));
                setStep(2); // Move to profile setup
            }
        } catch (err) {
            addToast('error', t('auth.errorVerify'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinishSetup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) return addToast('error', t('invite.toastNameReq'));

        // Mock saving name and role to the session
        const staffUser: User = {
            id: 'S001',
            name: fullName,
            email: phone.includes('@') ? phone : `${fullName.replace(/\s/g, '').toLowerCase()}@hagzy.com`,
            role: 'staff',
            businessType: 'clinic',
        };
        localStorage.setItem('hagzy_user', JSON.stringify(staffUser));

        addToast('success', t('invite.toastSetupComplete'));
        router.push('/');
    };

    // --- Inputs Handlers ---
    const handleOtpChange = (index: number, val: string) => {
        const numericVal = val.replace(/\D/g, '').slice(0, 1);
        const newCode = [...otpCode];
        newCode[index] = numericVal;
        setOtpCode(newCode);
        if (numericVal && index < 5) {
            const nextInput = document.getElementById(`invite-otp-${index + 1}`);
            nextInput?.focus();
        }
    };
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
            const prevInput = document.getElementById(`invite-otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <div className={styles.logoMark}></div>
                        <span>{t('invite.brand')}</span>
                    </div>
                    <h1>{step === 1 ? t('invite.acceptTitle') : t('invite.completeTitle')}</h1>
                    <p>{step === 1 ? t('invite.acceptSubtitle') : t('invite.completeSubtitle')}</p>
                </div>

                <div className={styles.stepIndicator}>
                    <div
                        className={`${styles.stepDot} ${step >= 1 ? styles.stepDotCompleted : ''} ${step === 1 ? styles.stepDotActive : ''}`}
                    />
                    <div
                        className={`${styles.stepDot} ${step >= 2 ? styles.stepDotCompleted : ''} ${step === 2 ? styles.stepDotActive : ''}`}
                    />
                </div>

                {/* Step 1: Verify Phone/Email */}
                {step === 1 &&
                    (!otpSent ? (
                        <form className={styles.form} onSubmit={handleRequestOTP}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>{t('invite.invitedPhone')}</label>
                                <div style={{ position: 'relative' }}>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            insetInlineStart: 16,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--text-tertiary)',
                                        }}
                                    >
                                        <Smartphone size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        className={styles.loginInput}
                                        style={{ paddingInlineStart: 44 }}
                                        placeholder="+20 100 123 4567"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                                {isLoading ? <RefreshCw size={18} className="spin" /> : <ArrowRight size={18} />}
                                {t('invite.sendCode')}
                            </button>
                        </form>
                    ) : (
                        <form className={styles.form} onSubmit={handleVerifyIdentity}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} style={{ textAlign: 'center' }}>
                                    {t('invite.enterCode')}
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
                                            id={`invite-otp-${idx}`}
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
                                {t('invite.verifyDevice')}
                            </button>
                        </form>
                    ))}

                {/* Step 2: Complete Profile */}
                {step === 2 && (
                    <form className={styles.form} onSubmit={handleFinishSetup}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t('invite.fullName')}</label>
                            <div style={{ position: 'relative' }}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        insetInlineStart: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-tertiary)',
                                    }}
                                >
                                    <UserIcon size={18} />
                                </div>
                                <input
                                    type="text"
                                    className={styles.loginInput}
                                    style={{ paddingInlineStart: 44 }}
                                    placeholder="e.g., Layla Hassan"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.loginBtn} style={{ marginTop: 'var(--space-4)' }}>
                            <ArrowRight size={18} />
                            {t('invite.joinWorkspace')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
