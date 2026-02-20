'use client';

import React, { useState } from 'react';
import { useAuth, MOCK_USERS } from '@/contexts/AuthContext';
import { Mail, Lock, LogIn, Store, Scissors, Syringe, User } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
    const { login } = useAuth();
    const [selectedEmail, setSelectedEmail] = useState('clinic@hagzy.com');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const user = MOCK_USERS[selectedEmail];
        if (user) {
            login(user);
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
                    <h1>Welcome Back</h1>
                    <p>Select a demo account to explore different business types and user roles.</p>
                </div>

                <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Select Demo Account</label>
                        <div className={styles.accountsGrid}>
                            {Object.values(MOCK_USERS).map((user) => (
                                <div
                                    key={user.email}
                                    className={`${styles.accountCard} ${selectedEmail === user.email ? styles.accountActive : ''}`}
                                    onClick={() => setSelectedEmail(user.email)}
                                >
                                    <div className={styles.accIcon}>
                                        {user.businessType === 'clinic' && <Syringe size={20} />}
                                        {user.businessType === 'salon' && <Store size={20} />}
                                        {user.businessType === 'barber' && <Scissors size={20} />}
                                    </div>
                                    <div className={styles.accDetails}>
                                        <div className={styles.accName}>{user.name}</div>
                                        <div className={styles.accMeta}>
                                            <span className={styles.accRole}>{user.role}</span>
                                            <span className={styles.accType}>{user.businessType}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className={styles.loginBtn}>
                        <LogIn size={18} /> Login to Dashboard
                    </button>

                    <div className={styles.tip}>
                        The mock password is <strong>"admin123"</strong> but isn't required for this demo. Just select an account and login.
                    </div>
                </form>
            </div>
        </div>
    );
}
