'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth, BusinessType } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Mail,
    Phone,
    ArrowRight,
    ArrowLeft,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    RefreshCw,
    User,
    Stethoscope,
    Sparkles,
    Scissors,
    MapPin,
    Tag,
    Check,
    Navigation,
    Briefcase,
} from 'lucide-react';
import styles from './onboarding.module.css';

const egyptLocations: Record<string, string[]> = {
    Cairo: [
        'Nasr City',
        'Heliopolis',
        'Maadi',
        'New Cairo',
        'Downtown Cairo',
        'Zamalek',
        'Shoubra',
        'Mokattam',
        'Rehab',
        'Madinaty',
        'Badr City',
        'Shorouk City',
        '15th of May',
        'Obour',
    ],
    Giza: [
        'Dokki',
        'Mohandeseen',
        '6th of October',
        'Sheikh Zayed',
        'Haram',
        'Faisal',
        'Agouza',
        'Imbaba',
        'Hadayek Al Ahram',
        'Bulaq Al Dakrour',
        'Abu Rawash',
    ],
    Alexandria: [
        'Smouha',
        'Sidi Gaber',
        'Miami',
        'Mandara',
        'Gleem',
        'San Stefano',
        'Agami',
        'Roushdy',
        'Borg El Arab',
        'Montaza',
        'Sidi Bishr',
        'Kafr Abdou',
        'Louran',
        'Kampa',
    ],
    Dakahlia: ['Mansoura', 'Mit Ghamr', 'Talkha', 'Dekernes', 'Aga', 'Minyet El Nasr', 'Belqas', 'Sherbin'],
    'Red Sea': ['Hurghada', 'Safaga', 'El Qusiar', 'Marsa Alam', 'Ras Gharib', 'Shalateen', 'El Gouna'],
    Beheira: ['Damanhour', 'Kafr El Dawwar', 'Rashid', 'Edku', 'Abu Hummus', 'Itay El Barud', 'Kom Hamada'],
    Fayoum: ['Fayoum City', 'Ibsheway', 'Tamiya', 'Senoress', 'Etsa', 'Yousef Sadek'],
    Gharbia: ['Tanta', 'El Mahalla El Kubra', 'Kafr El Zayat', 'Zifta', 'Samanoud', 'Qutour', 'Basyoun', 'Santa'],
    Ismailia: ['Ismailia City', 'Fayed', 'Qantara Sharq', 'Qantara Gharb', 'Abu Suwir', 'Kassassin'],
    Menofia: ['Shibin El Kom', 'Menouf', 'Ashmoun', 'Quesna', 'Sadat City', 'Tala', 'Birket El Sab', 'Shohada'],
    Minya: ['Minya City', 'Maghagha', 'Mallawi', 'Beni Mazar', 'Samalut', 'Abu Qurqas', 'Mataiy', 'Deir Mawas'],
    Qalyubia: ['Banha', 'Shubra El Kheima', 'Qalyub', 'Khanka', 'Qanater', 'Toukh', 'Kafr Shukr', 'Shibin El Qanater'],
    'New Valley': ['Kharga', 'Dakhla', 'Farafra', 'Baris', 'Balat'],
    Suez: ['Suez City', 'Arabeen', 'Attaka', 'Faisal', 'Ganayen'],
    Aswan: ['Aswan City', 'Kom Ombo', 'Edfu', 'Daraw', 'Nasr Al Nuba'],
    Assiut: ['Assiut City', 'Dairut', 'Manfalut', 'Abnub', 'Badari', 'Abu Tig', 'El Fateh', 'El Ghanayem'],
    'Beni Suef': ['Beni Suef City', 'Biba', 'Al Wasta', 'Nasser', 'Ihnasiya', 'Smasta', 'El Fashn'],
    'Port Said': ['Port Said City', 'Port Fouad'],
    Damietta: [
        'Damietta City',
        'New Damietta',
        'Ras El Bar',
        'Faraskour',
        'Kafr El Battikh',
        'Zarkaa',
        'Ezbet El Borg',
    ],
    Sharkia: [
        'Zagazig',
        '10th of Ramadan',
        'Minya Al Qamh',
        'Belbeis',
        'Faqous',
        'Husseiniya',
        'Abu Kebir',
        'Hehia',
        'Awlad Saqr',
        'Mashtool El Souk',
        'Derb Negm',
    ],
    'South Sinai': ['Sharm El Sheikh', 'Dahab', 'Nuweiba', 'Saint Catherine', 'El Tor', 'Taba'],
    'Kafr El Sheikh': ['Kafr El Sheikh City', 'Desouk', 'Baltim', 'Metoubes', 'Riyadh', 'Qallin', 'Biyala', 'Moutobas'],
    Matrouh: [
        'Marsa Matrouh',
        'El Alamein',
        'Sidi Abdel Rahman',
        'Dabaa',
        'Siwa',
        'Sallum',
        'Sidi Barrani',
        'Al Negaila',
        'El Hamam',
    ],
    Luxor: ['Luxor City', 'Karnak', 'Armant', 'Esna', 'El Bayadeya', 'El Toud', 'El Zaynia'],
    Qena: ['Qena City', 'Nagaa Hammadi', 'Qus', 'Qift', 'Farshout', 'Dishna', 'Abou Tesht', 'El Waqf'],
    'North Sinai': ['Arish', 'Sheikh Zuweid', 'Rafah', 'Bir al-Abed', 'Nekhel', 'Hassana'],
    Sohag: [
        'Sohag City',
        'Akhmim',
        'Girga',
        'Tahta',
        'Tama',
        'Dar El Salam',
        'Sakulta',
        'Balyana',
        'Maragha',
        'Juhayna',
        'El Manshaoa',
    ],
};

const suggestedServices: Record<string, string[]> = {
    clinic: ['General Consultation', 'Dental Checkup', 'Follow-up Visit', 'Laser Session', 'Botox Treatment'],
    salon: ['Hair Coloring', 'Keratin Treatment', 'Manicure & Pedicure', 'Facial Treatment', 'Bridal Makeup'],
    barber: ['Classic Haircut', 'Beard Trim & Shave', 'Hair & Beard Combo', 'Keratin Smoothing', 'Skin Fade'],
};

const businessTypes = [
    {
        value: 'clinic' as BusinessType,
        label: 'Clinic / Medical',
        description: 'Medical center, dental, dermatology, or healthcare',
        icon: Stethoscope,
    },
    {
        value: 'salon' as BusinessType,
        label: 'Salon / Spa',
        description: 'Beauty salon, spa, nails, skincare, or wellness',
        icon: Sparkles,
    },
    {
        value: 'barber' as BusinessType,
        label: 'Barbershop',
        description: "Men's grooming, barbershop, or styling studio",
        icon: Scissors,
    },
];

export default function OnboardingPage() {
    const { requestOTP, verifyOTP, updateUser, user } = useAuth();
    const { addToast } = useToast();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [substep, setSubstep] = useState<'details' | 'otp'>('details');
    const [isLoading, setIsLoading] = useState(false);
    const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward');
    const [animKey, setAnimKey] = useState(0);

    // Step 1: Account
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(60);

    // Step 2: Business
    const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | ''>('');
    const [businessName, setBusinessName] = useState('');
    const [governorate, setGovernorate] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [building, setBuilding] = useState('');
    const [floor, setFloor] = useState('');
    const [mapPinned, setMapPinned] = useState(false);

    // Step 3: Services
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [customService, setCustomService] = useState('');

    // Refs for auto-focus
    const nameRef = useRef<HTMLInputElement>(null);

    // Auto-focus on step 1 details substep
    useEffect(() => {
        if (step === 1 && substep === 'details') {
            const timer = setTimeout(() => nameRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        }
    }, [step, substep]);

    // Countdown timer for OTP resend
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (substep === 'otp' && countdown > 0) {
            timer = setInterval(() => setCountdown(c => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [substep, countdown]);

    // Animate transitions
    const goForward = useCallback((nextStep: number) => {
        setAnimDir('forward');
        setAnimKey(k => k + 1);
        setStep(nextStep);
    }, []);

    const goBack = useCallback((prevStep: number) => {
        setAnimDir('back');
        setAnimKey(k => k + 1);
        setStep(prevStep);
    }, []);

    // ── Step 1 Handlers ──
    const handleAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) return addToast('error', 'Please enter your full name');
        if (!email.trim()) return addToast('error', 'Please enter your email');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return addToast('error', 'Please enter a valid email address');
        if (!phoneNumber.trim()) return addToast('error', 'Please enter your phone number');
        if (password.length < 6) return addToast('error', 'Password must be at least 6 characters');
        setIsLoading(true);
        try {
            const res = await requestOTP(email);
            if (res.success) {
                setAnimDir('forward');
                setAnimKey(k => k + 1);
                setSubstep('otp');
                setCountdown(60);
                addToast('success', 'Verification code sent to your email');
            }
        } catch {
            addToast('error', 'Failed to send verification code');
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
            const res = await verifyOTP(email, code, false);
            if (!res.success) {
                addToast('error', res.error || 'Invalid verification code');
                setOtpCode(['', '', '', '', '', '']);
            } else {
                addToast('success', 'Identity verified!');
                goForward(2);
            }
        } catch {
            addToast('error', 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    // ── OTP Input Handlers ──
    const handleOtpChange = (index: number, val: string) => {
        const numericVal = val.replace(/\D/g, '').slice(0, 1);
        const newCode = [...otpCode];
        newCode[index] = numericVal;
        setOtpCode(newCode);
        if (numericVal && index < 5) {
            document.getElementById(`signup-otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
            document.getElementById(`signup-otp-${index - 1}`)?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length > 0) {
            const newCode = [...otpCode];
            for (let i = 0; i < pasted.length && i < 6; i++) {
                newCode[i] = pasted[i];
            }
            setOtpCode(newCode);
            const focusIdx = Math.min(pasted.length, 5);
            document.getElementById(`signup-otp-${focusIdx}`)?.focus();
        }
    };

    // ── Step 2 Handlers ──
    const handleBusinessSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBusinessType) return addToast('error', 'Please select your business type');
        if (!businessName.trim()) return addToast('error', 'Please enter your business name');
        if (!governorate) return addToast('error', 'Please select your governorate');
        if (!city) return addToast('error', 'Please select your city');
        if (!street.trim()) return addToast('error', 'Please enter your street address');

        // Pre-select all suggested services
        setSelectedServices([...(suggestedServices[selectedBusinessType] || [])]);
        goForward(3);
    };

    const handlePinLocation = () => {
        setMapPinned(true);
        addToast('success', 'Location pinned successfully');
    };

    // ── Step 3 Handlers ──
    const handleFinishSetup = (e: React.FormEvent) => {
        e.preventDefault();
        const finalServices = [...selectedServices];
        if (customService.trim() && !finalServices.includes(customService.trim())) {
            finalServices.push(customService.trim());
        }
        if (finalServices.length === 0) return addToast('error', 'Please select at least one service');

        // Save user with workspace data + auto-start free trial
        updateUser({
            name: fullName || user?.name || '',
            businessType: selectedBusinessType as BusinessType,
            isNewWorkspace: true,
        });

        // Save onboarding data
        localStorage.setItem(
            'hagzy_onboarding',
            JSON.stringify({
                businessName,
                governorate,
                city,
                address: { street, building, floor },
                mapPinned,
                services: finalServices,
                plan: 'trial',
                trialStartDate: new Date().toISOString(),
                completedAt: new Date().toISOString(),
            })
        );

        addToast('success', 'Welcome to Hagzy! Your 14-day free trial has started.');
        router.push('/');
    };

    const toggleService = (service: string) => {
        setSelectedServices(prev => (prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]));
    };

    const addCustomService = () => {
        if (customService.trim() && !selectedServices.includes(customService.trim())) {
            setSelectedServices(prev => [...prev, customService.trim()]);
            setCustomService('');
        }
    };

    // ── Step Config ──
    const stepLabels = ['Account', 'Business', 'Services'];
    const stepTitles: Record<number, string> = {
        1: substep === 'details' ? 'Create Your Account' : 'Verify Your Identity',
        2: 'About Your Business',
        3: 'Add Your Services',
    };
    const stepDescriptions: Record<number, string> = {
        1: substep === 'details' ? 'Fill in your details to get started' : `We sent a code to ${email}`,
        2: 'Help us customize your workspace',
        3: 'Select the services you offer — you can edit these anytime',
    };

    const formAnimClass = animDir === 'forward' ? styles.formAnimateForward : styles.formAnimateBack;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <div className={styles.logoMark}></div>
                        <span>Hagzy</span>
                    </div>
                    <h1>{stepTitles[step]}</h1>
                    <p>{stepDescriptions[step]}</p>
                </div>

                {/* Stepper */}
                <div className={styles.stepper}>
                    {stepLabels.map((label, i) => (
                        <React.Fragment key={label}>
                            {i > 0 && <div className={`${styles.stepLine} ${step > i ? styles.stepLineDone : ''}`} />}
                            <div className={styles.stepItem}>
                                <div
                                    className={`${styles.stepCircle} ${step > i + 1 ? styles.stepDone : step === i + 1 ? styles.stepActive : ''}`}
                                >
                                    {step > i + 1 ? <Check size={14} /> : i + 1}
                                </div>
                                <span className={step === i + 1 ? styles.stepLabelActive : styles.stepLabel}>
                                    {label}
                                </span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                {/* ════════ STEP 1: ACCOUNT ════════ */}

                {/* 1a: Details — Full Name, Email, Phone, Password */}
                {step === 1 && substep === 'details' && (
                    <form
                        key={`s1a-${animKey}`}
                        className={`${styles.form} ${formAnimClass}`}
                        onSubmit={handleAccountSubmit}
                    >
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Full Name</label>
                            <div className={styles.inputWithIcon}>
                                <div className={styles.inputIcon}>
                                    <User size={18} />
                                </div>
                                <input
                                    ref={nameRef}
                                    type="text"
                                    className={styles.loginInput}
                                    style={{ paddingInlineStart: 44 }}
                                    placeholder="e.g., Ahmed Mohamed"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Email</label>
                            <div className={styles.inputWithIcon}>
                                <div className={styles.inputIcon}>
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    className={styles.loginInput}
                                    style={{ paddingInlineStart: 44 }}
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <div className={styles.inputWithIcon}>
                                <div className={styles.inputIcon}>
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="tel"
                                    className={styles.loginInput}
                                    style={{ paddingInlineStart: 44 }}
                                    placeholder="01xxxxxxxxx"
                                    value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Password</label>
                            <div className={styles.inputWithIcon}>
                                <div className={styles.inputIcon}>
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={styles.loginInput}
                                    style={{ paddingInlineStart: 44, paddingInlineEnd: 44 }}
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
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
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                            {isLoading ? <RefreshCw size={18} className="spin" /> : <ArrowRight size={18} />}
                            {isLoading ? 'Sending...' : 'Continue'}
                        </button>
                        <div className={styles.loginLink}>
                            <span>Already have an account?</span> <Link href="/login">Log in</Link>
                        </div>
                    </form>
                )}

                {/* 1b: OTP Verification */}
                {step === 1 && substep === 'otp' && (
                    <form
                        key={`s1b-${animKey}`}
                        className={`${styles.form} ${formAnimClass}`}
                        onSubmit={handleVerifyOTP}
                    >
                        <div className={styles.inputGroup}>
                            <label className={styles.label} style={{ textAlign: 'center', justifyContent: 'center' }}>
                                Enter 6-digit Code
                            </label>
                            <div className={styles.otpRow}>
                                {otpCode.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        id={`signup-otp-${idx}`}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={e => handleOtpKeyDown(idx, e)}
                                        onPaste={idx === 0 ? handleOtpPaste : undefined}
                                        className={`${styles.otpInput} ${digit ? styles.otpInputFilled : ''}`}
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
                            {isLoading ? 'Verifying...' : 'Verify & Continue'}
                        </button>
                        <div style={{ textAlign: 'center' }}>
                            <button
                                type="button"
                                disabled={countdown > 0}
                                onClick={handleAccountSubmit as React.MouseEventHandler}
                                className={styles.resendBtn}
                                style={{
                                    opacity: countdown > 0 ? 0.5 : 1,
                                    cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {countdown > 0 ? `Resend in 0:${countdown.toString().padStart(2, '0')}` : 'Resend Code'}
                            </button>
                        </div>
                        <div className={styles.tip}>
                            <p>
                                Demo tip: Enter <strong>123456</strong>
                            </p>
                        </div>
                    </form>
                )}

                {/* ════════ STEP 2: BUSINESS ════════ */}
                {step === 2 && (
                    <form
                        key={`s2-${animKey}`}
                        className={`${styles.form} ${formAnimClass}`}
                        onSubmit={handleBusinessSubmit}
                    >
                        {/* Business Type Cards */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Business Type</label>
                            <div className={styles.businessCards}>
                                {businessTypes.map(bt => {
                                    const Icon = bt.icon;
                                    const isActive = selectedBusinessType === bt.value;
                                    return (
                                        <button
                                            key={bt.value}
                                            type="button"
                                            className={`${styles.businessCard} ${isActive ? styles.businessCardActive : ''}`}
                                            onClick={() => setSelectedBusinessType(bt.value)}
                                        >
                                            {isActive && (
                                                <div className={styles.businessCardCheck}>
                                                    <Check size={12} />
                                                </div>
                                            )}
                                            <div
                                                className={`${styles.businessCardIcon} ${isActive ? styles.businessCardIconActive : ''}`}
                                            >
                                                <Icon size={22} />
                                            </div>
                                            <div className={styles.businessCardLabel}>{bt.label}</div>
                                            <div className={styles.businessCardDesc}>{bt.description}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Business Name */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Business Name</label>
                            <div className={styles.inputWithIcon}>
                                <div className={styles.inputIcon}>
                                    <Briefcase size={18} />
                                </div>
                                <input
                                    type="text"
                                    className={styles.loginInput}
                                    style={{ paddingInlineStart: 44 }}
                                    placeholder="e.g., Elite Beauty Salon"
                                    value={businessName}
                                    onChange={e => setBusinessName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Governorate */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Governorate</label>
                            <select
                                className={styles.roleSelect}
                                value={governorate}
                                onChange={e => {
                                    setGovernorate(e.target.value);
                                    setCity('');
                                }}
                            >
                                <option value="" disabled>
                                    Select Governorate...
                                </option>
                                {Object.keys(egyptLocations)
                                    .sort()
                                    .map(gov => (
                                        <option key={gov} value={gov}>
                                            {gov}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* City */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>City / Area</label>
                            <select
                                className={styles.roleSelect}
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                disabled={!governorate}
                            >
                                <option value="" disabled>
                                    Select City / Area...
                                </option>
                                {governorate &&
                                    egyptLocations[governorate]?.sort().map(c => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Full Address */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Full Address</label>
                            <div className={styles.addressGrid}>
                                <input
                                    type="text"
                                    className={styles.loginInput}
                                    placeholder="Street name"
                                    value={street}
                                    onChange={e => setStreet(e.target.value)}
                                />
                                <div className={styles.addressRow}>
                                    <input
                                        type="text"
                                        className={styles.loginInput}
                                        placeholder="Building No."
                                        value={building}
                                        onChange={e => setBuilding(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className={styles.loginInput}
                                        placeholder="Floor / Apt"
                                        value={floor}
                                        onChange={e => setFloor(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Pin */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                Pin on Map
                                <span className={styles.optionalBadge}>Optional</span>
                            </label>
                            <div className={`${styles.mapSection} ${mapPinned ? styles.mapSectionPinned : ''}`}>
                                {mapPinned ? (
                                    <div className={styles.mapPinnedContent}>
                                        <div className={styles.mapPinnedIcon}>
                                            <Check size={20} />
                                        </div>
                                        <span className={styles.mapPinnedText}>Location pinned</span>
                                        <button
                                            type="button"
                                            className={styles.mapChangeBtn}
                                            onClick={() => setMapPinned(false)}
                                        >
                                            Change
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.mapContent}>
                                        <MapPin size={28} className={styles.mapIcon} />
                                        <p className={styles.mapText}>
                                            Pin your business on the map so customers can find you
                                        </p>
                                        <button type="button" className={styles.btnOutline} onClick={handlePinLocation}>
                                            <Navigation size={16} />
                                            Use My Location
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className={styles.navRow}>
                            <button
                                type="button"
                                className={styles.backBtn}
                                onClick={() => {
                                    setSubstep('details');
                                    goBack(1);
                                }}
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                            <button type="submit" className={styles.loginBtn} style={{ flex: 1 }}>
                                <ArrowRight size={18} /> Continue
                            </button>
                        </div>
                    </form>
                )}

                {/* ════════ STEP 3: SERVICES ════════ */}
                {step === 3 && (
                    <form
                        key={`s3-${animKey}`}
                        className={`${styles.form} ${formAnimClass}`}
                        onSubmit={handleFinishSetup}
                    >
                        {/* Suggested services (pre-checked) */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                Suggested for your{' '}
                                {selectedBusinessType === 'clinic'
                                    ? 'clinic'
                                    : selectedBusinessType === 'salon'
                                      ? 'salon'
                                      : 'barbershop'}
                                {selectedServices.length > 0 && (
                                    <span className={styles.serviceCount}>{selectedServices.length}</span>
                                )}
                            </label>
                            <div className={styles.serviceChips}>
                                {(suggestedServices[selectedBusinessType as string] || []).map(service => {
                                    const isSelected = selectedServices.includes(service);
                                    return (
                                        <button
                                            key={service}
                                            type="button"
                                            className={`${styles.serviceChip} ${isSelected ? styles.serviceChipActive : ''}`}
                                            onClick={() => toggleService(service)}
                                        >
                                            {isSelected && <Check size={14} />}
                                            {service}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Custom services display */}
                        {selectedServices.filter(
                            s => !(suggestedServices[selectedBusinessType as string] || []).includes(s)
                        ).length > 0 && (
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Your custom services</label>
                                <div className={styles.serviceChips}>
                                    {selectedServices
                                        .filter(
                                            s => !(suggestedServices[selectedBusinessType as string] || []).includes(s)
                                        )
                                        .map(service => (
                                            <button
                                                key={service}
                                                type="button"
                                                className={`${styles.serviceChip} ${styles.serviceChipActive}`}
                                                onClick={() => toggleService(service)}
                                            >
                                                <Check size={14} />
                                                {service}
                                                <span style={{ marginInlineStart: 4 }}>&times;</span>
                                            </button>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Add custom service */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Add your own</label>
                            <div className={styles.customServiceRow}>
                                <div className={styles.inputWithIcon} style={{ flex: 1 }}>
                                    <div className={styles.inputIcon}>
                                        <Tag size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        className={styles.loginInput}
                                        style={{ paddingInlineStart: 44 }}
                                        placeholder="e.g., Deep Conditioning"
                                        value={customService}
                                        onChange={e => setCustomService(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addCustomService();
                                            }
                                        }}
                                    />
                                </div>
                                <button type="button" className={styles.btnOutline} onClick={addCustomService}>
                                    Add
                                </button>
                            </div>
                            <p className={styles.hint}>
                                You can add prices, durations, and more details later in Settings.
                            </p>
                        </div>

                        {/* Navigation */}
                        <div className={styles.navRow}>
                            <button type="button" className={styles.backBtn} onClick={() => goBack(2)}>
                                <ArrowLeft size={16} /> Back
                            </button>
                            <button type="submit" className={styles.loginBtn} style={{ flex: 1 }}>
                                Go to Dashboard
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
