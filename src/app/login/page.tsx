'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Smartphone, ArrowRight, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { isEgyptianPhone } from '@/lib/validations';
import styles from './login.module.css';

export default function LoginPage() {
    const { login } = useAuth();
    const { addToast } = useToast();
    const { t } = useTranslation();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier.trim()) return addToast('error', t('auth.errorEmpty'));
        // Validate Egyptian phone if not email
        if (!identifier.includes('@')) {
            if (!isEgyptianPhone(identifier)) {
                return addToast('error', 'Enter a valid Egyptian phone number (01XXXXXXXXX)');
            }
        } else {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
                return addToast('error', 'Enter a valid email address');
            }
        }
        if (!password.trim()) return addToast('error', t('auth.errorPasswordEmpty'));

        setIsLoading(true);
        try {
            const res = await login(identifier, password);
            if (!res.success) {
                addToast('error', res.error || t('auth.errorLogin'));
            } else {
                addToast('success', t('auth.successLogin'));
            }
        } catch {
            addToast('error', t('auth.errorLogin'));
        } finally {
            setIsLoading(false);
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
                    <h1>{t('auth.welcomeBack')}</h1>
                    <p>{t('auth.enterCredentials')}</p>
                </div>

                <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>{t('auth.lblIdentifier')}</label>
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
                                {identifier.includes('@') ? <Mail size={18} /> : <Smartphone size={18} />}
                            </div>
                            <input
                                type="text"
                                className={styles.loginInput}
                                style={{
                                    width: '100%',
                                    height: 48,
                                    paddingInlineStart: 44,
                                    paddingInlineEnd: 'var(--space-4)',
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

                    <div className={styles.inputGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className={styles.label}>{t('auth.lblPassword')}</label>
                            <Link
                                href="/forgot-password"
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-primary-600)',
                                    textDecoration: 'none',
                                    fontWeight: 'var(--font-medium)',
                                }}
                            >
                                {t('auth.forgotPassword')}
                            </Link>
                        </div>
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
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={styles.loginInput}
                                style={{
                                    width: '100%',
                                    height: 48,
                                    paddingInlineStart: 44,
                                    paddingInlineEnd: 48,
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--border-color)',
                                    fontSize: 'var(--text-base)',
                                }}
                                placeholder={t('auth.phPassword')}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    insetInlineEnd: 12,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-tertiary)',
                                    cursor: 'pointer',
                                    padding: 'var(--space-1)',
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                        {isLoading ? <RefreshCw size={18} className="spin" /> : <ArrowRight size={18} />}
                        {isLoading ? t('auth.btnLoggingIn') : t('auth.btnLogin')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t('auth.noWorkspace')}</span>{' '}
                    <Link
                        href="/onboarding"
                        style={{
                            color: 'var(--color-primary-600)',
                            fontWeight: 'var(--font-medium)',
                            textDecoration: 'none',
                        }}
                    >
                        {t('auth.signUpHere')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
