'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { employeeApi } from '@/lib/api';

export default function EmployeeLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) return setError('Email is required');
        if (!password.trim()) return setError('Password is required');

        setIsLoading(true);
        try {
            // The API client reads the employee token automatically on
            // /employee-portal routes (X11), so no provider-token swap is needed.
            const res = await employeeApi.login(email, password);

            if (res.success && res.data) {
                const { token, employee } = res.data;
                localStorage.setItem('hagzy_employee_token', token);
                localStorage.setItem(
                    'hagzy_employee_user',
                    JSON.stringify({
                        uuid: employee.uuid,
                        name: employee.name,
                        email: employee.email,
                        branch: employee.branch?.name,
                    })
                );

                router.push('/employee-portal/dashboard');
            } else {
                setError(res.message || 'Invalid credentials');
            }
        } catch (err: unknown) {
            const apiErr = err as { message?: string };
            setError(apiErr.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-secondary)',
                padding: 'var(--space-4)',
            }}
        >
            <div
                style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-2xl)',
                    width: '100%',
                    maxWidth: 460,
                    padding: 'var(--space-10)',
                    boxShadow: 'var(--shadow-xl)',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-3)',
                            marginBottom: 'var(--space-6)',
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                background:
                                    'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                            }}
                        />
                        Hagzy
                    </div>
                    <h1
                        style={{
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 'var(--font-bold)',
                            marginBottom: 'var(--space-2)',
                        }}
                    >
                        Employee Portal
                    </h1>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                        Sign in with your employee credentials
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div
                        style={{
                            padding: 'var(--space-3)',
                            marginBottom: 'var(--space-4)',
                            background: 'var(--color-error-light)',
                            color: 'var(--color-error)',
                            borderRadius: 'var(--radius-lg)',
                            fontSize: 'var(--text-sm)',
                            textAlign: 'center',
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleLogin}
                    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <label
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-semibold)',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            Email
                        </label>
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
                                type="email"
                                placeholder="your.email@company.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    height: 48,
                                    paddingLeft: 44,
                                    paddingRight: 16,
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--border-color)',
                                    fontSize: 'var(--text-base)',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <label
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-semibold)',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            Password
                        </label>
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
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: 48,
                                    paddingLeft: 44,
                                    paddingRight: 48,
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--border-color)',
                                    fontSize: 'var(--text-base)',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
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
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-2)',
                            padding: 'var(--space-3) var(--space-4)',
                            background: 'var(--color-primary-500)',
                            color: 'white',
                            fontWeight: 'var(--font-semibold)',
                            fontSize: 'var(--text-sm)',
                            borderRadius: 'var(--radius-lg)',
                            border: 'none',
                            cursor: 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                        }}
                    >
                        {isLoading ? <RefreshCw size={18} className="spin" /> : <ArrowRight size={18} />}
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div
                    style={{
                        textAlign: 'center',
                        marginTop: 'var(--space-6)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-tertiary)',
                    }}
                >
                    This portal is for employees only. Providers should use the{' '}
                    <a
                        href="/login"
                        style={{
                            color: 'var(--color-primary-600)',
                            textDecoration: 'none',
                            fontWeight: 'var(--font-medium)',
                        }}
                    >
                        main login
                    </a>
                    .
                </div>
            </div>
        </div>
    );
}
