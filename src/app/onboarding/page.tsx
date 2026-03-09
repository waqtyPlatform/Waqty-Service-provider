'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, BusinessType } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Smartphone, ArrowRight, ShieldCheck, RefreshCw, Briefcase, MapPin, Tag } from 'lucide-react';
import styles from './onboarding.module.css';

const egyptLocations: Record<string, string[]> = {
    "Cairo": ["Nasr City", "Heliopolis", "Maadi", "New Cairo", "Downtown Cairo", "Zamalek", "Shoubra", "Mokattam", "Rehab", "Madinaty", "Badr City", "Shorouk City", "15th of May", "Obour"],
    "Giza": ["Dokki", "Mohandeseen", "6th of October", "Sheikh Zayed", "Haram", "Faisal", "Agouza", "Imbaba", "Hadayek Al Ahram", "Bulaq Al Dakrour", "Abu Rawash"],
    "Alexandria": ["Smouha", "Sidi Gaber", "Miami", "Mandara", "Gleem", "San Stefano", "Agami", "Roushdy", "Borg El Arab", "Montaza", "Sidi Bishr", "Kafr Abdou", "Louran", "Kampa"],
    "Dakahlia": ["Mansoura", "Mit Ghamr", "Talkha", "Dekernes", "Aga", "Minyet El Nasr", "Belqas", "Sherbin"],
    "Red Sea": ["Hurghada", "Safaga", "El Qusiar", "Marsa Alam", "Ras Gharib", "Shalateen", "El Gouna"],
    "Beheira": ["Damanhour", "Kafr El Dawwar", "Rashid", "Edku", "Abu Hummus", "Itay El Barud", "Kom Hamada"],
    "Fayoum": ["Fayoum City", "Ibsheway", "Tamiya", "Senoress", "Etsa", "Yousef Sadek"],
    "Gharbia": ["Tanta", "El Mahalla El Kubra", "Kafr El Zayat", "Zifta", "Samanoud", "Qutour", "Basyoun", "Santa"],
    "Ismailia": ["Ismailia City", "Fayed", "Qantara Sharq", "Qantara Gharb", "Abu Suwir", "Kassassin"],
    "Menofia": ["Shibin El Kom", "Menouf", "Ashmoun", "Quesna", "Sadat City", "Tala", "Birket El Sab", "Shohada"],
    "Minya": ["Minya City", "Maghagha", "Mallawi", "Beni Mazar", "Samalut", "Abu Qurqas", "Mataiy", "Deir Mawas"],
    "Qalyubia": ["Banha", "Shubra El Kheima", "Qalyub", "Khanka", "Qanater", "Toukh", "Kafr Shukr", "Shibin El Qanater"],
    "New Valley": ["Kharga", "Dakhla", "Farafra", "Baris", "Balat"],
    "Suez": ["Suez City", "Arabeen", "Attaka", "Faisal", "Ganayen"],
    "Aswan": ["Aswan City", "Kom Ombo", "Edfu", "Daraw", "Nasr Al Nuba"],
    "Assiut": ["Assiut City", "Dairut", "Manfalut", "Abnub", "Badari", "Abu Tig", "El Fateh", "El Ghanayem"],
    "Beni Suef": ["Beni Suef City", "Biba", "Al Wasta", "Nasser", "Ihnasiya", "Smasta", "El Fashn"],
    "Port Said": ["Port Said City", "Port Fouad"],
    "Damietta": ["Damietta City", "New Damietta", "Ras El Bar", "Faraskour", "Kafr El Battikh", "Zarkaa", "Ezbet El Borg"],
    "Sharkia": ["Zagazig", "10th of Ramadan", "Minya Al Qamh", "Belbeis", "Faqous", "Husseiniya", "Abu Kebir", "Hehia", "Awlad Saqr", "Mashtool El Souk", "Derb Negm"],
    "South Sinai": ["Sharm El Sheikh", "Dahab", "Nuweiba", "Saint Catherine", "El Tor", "Taba"],
    "Kafr El Sheikh": ["Kafr El Sheikh City", "Desouk", "Baltim", "Metoubes", "Riyadh", "Qallin", "Biyala", "Moutobas"],
    "Matrouh": ["Marsa Matrouh", "El Alamein", "Sidi Abdel Rahman", "Dabaa", "Siwa", "Sallum", "Sidi Barrani", "Al Negaila", "El Hamam"],
    "Luxor": ["Luxor City", "Karnak", "Armant", "Esna", "El Bayadeya", "El Toud", "El Zaynia"],
    "Qena": ["Qena City", "Nagaa Hammadi", "Qus", "Qift", "Farshout", "Dishna", "Abou Tesht", "El Waqf"],
    "North Sinai": ["Arish", "Sheikh Zuweid", "Rafah", "Bir al-Abed", "Nekhel", "Hassana"],
    "Sohag": ["Sohag City", "Akhmim", "Girga", "Tahta", "Tama", "Dar El Salam", "Sakulta", "Balyana", "Maragha", "Juhayna", "El Manshaoa"],
};

const suggestedServices: Record<string, string[]> = {
    clinic: ['General Consultation', 'Dental Checkup', 'Follow-up Visit', 'Laser Session', 'Botox Treatment'],
    salon: ['Hair Coloring', 'Keratin Treatment', 'Manicure & Pedicure', 'Facial Treatment', 'Bridal Makeup'],
    barber: ['Classic Haircut', 'Beard Trim & Shave', 'Hair & Beard Combo', 'Keratin Smoothing', 'Skin Fade'],
};

export default function OnboardingPage() {
    const { requestOTP, verifyOTP, user } = useAuth();
    const { t } = useTranslation();
    const { addToast } = useToast();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Step 1: Identity
    const [identifier, setIdentifier] = useState('newadmin@hagzy.com');
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);

    // Step 2: Business Profile
    const [businessName, setBusinessName] = useState('');
    const [businessCategory, setBusinessCategory] = useState('clinic');
    const [governorate, setGovernorate] = useState('');
    const [city, setCity] = useState('');
    const [addressDetails, setAddressDetails] = useState('');

    // Step 3: Quick Setup
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [customService, setCustomService] = useState('');

    // --- Handlers ---
    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier.trim()) return addToast('error', t('auth.errorEmpty'));
        
        setIsLoading(true);
        try {
            const res = await requestOTP(identifier);
            if (res.success) {
                setOtpSent(true);
                addToast('success', 'Authentication code sent');
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
            const res = await verifyOTP(identifier, code, false);
            if (!res.success) {
                addToast('error', res.error || t('auth.errorVerify'));
                setOtpCode(['', '', '', '', '', '']); 
            } else {
                addToast('success', 'Identity Verified!');
                setStep(2); // Move to business profile
            }
        } catch (err) {
            addToast('error', t('auth.errorVerify'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleBusinessSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessName.trim() || !governorate || !city || !addressDetails.trim()) {
            return addToast('error', 'Please fill all fields');
        }
        // In a real app, save to backend here
        setStep(3);
    };

    const handleFinishSetup = (e: React.FormEvent) => {
        e.preventDefault();
        const finalServices = [...selectedServices];
        if (customService.trim() && !finalServices.includes(customService.trim())) {
            finalServices.push(customService.trim());
        }

        if (finalServices.length === 0) {
            return addToast('error', 'Add at least one service to start');
        }
        // Save service & finish onboarding
        addToast('success', 'Workspace Created successfully!');
        
        // Mocking user profile update
        if (user) {
            const updatedUser = { ...user, businessType: businessCategory as BusinessType, isNewWorkspace: true };
            localStorage.setItem('hagzy_user', JSON.stringify(updatedUser));
        }

        router.push('/');
    };

    // --- Inputs Handlers ---
    const handleOtpChange = (index: number, val: string) => {
        const numericVal = val.replace(/\D/g, '').slice(0, 1);
        const newCode = [...otpCode];
        newCode[index] = numericVal;
        setOtpCode(newCode);
        if (numericVal && index < 5) {
            const nextInput = document.getElementById(`onboarding-otp-${index + 1}`);
            nextInput?.focus();
        }
    };
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
            const prevInput = document.getElementById(`onboarding-otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <div className={styles.logoMark}></div>
                        <span>Hagzy Workspace</span>
                    </div>
                    <h1>{step === 1 ? 'Verify Identity' : step === 2 ? 'Business Profile' : 'Quick Setup'}</h1>
                    <p>{step === 1 ? 'Let\'s secure your account before creating your workspace.' : step === 2 ? 'Tell us about your business to customize your experience.' : 'Add your first service to power up the dashboard.'}</p>
                </div>

                <div className={styles.stepIndicator}>
                    <div className={`${styles.stepDot} ${step >= 1 ? styles.stepDotCompleted : ''} ${step === 1 ? styles.stepDotActive : ''}`} />
                    <div className={`${styles.stepDot} ${step >= 2 ? styles.stepDotCompleted : ''} ${step === 2 ? styles.stepDotActive : ''}`} />
                    <div className={`${styles.stepDot} ${step >= 3 ? styles.stepDotCompleted : ''} ${step === 3 ? styles.stepDotActive : ''}`} />
                </div>

                {/* Step 1: Identity */}
                {step === 1 && (
                    !otpSent ? (
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
                                        style={{ paddingLeft: 44 }}
                                        placeholder="admin@example.com"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                                {isLoading ? <RefreshCw size={18} className="spin" /> : <ArrowRight size={18} />}
                                Continue
                            </button>
                            <div className={styles.tip}>
                                <h4>Why do we need this?</h4>
                                <p>We verify your identity to ensure your customer data remains secure and accessible only by you.</p>
                            </div>
                        </form>
                    ) : (
                        <form className={styles.form} onSubmit={handleVerifyIdentity}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} style={{ textAlign: 'center' }}>Enter 6-digit Code</label>
                                <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
                                    {otpCode.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            id={`onboarding-otp-${idx}`}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                            style={{
                                                width: 44, height: 52, textAlign: 'center', fontSize: 'var(--text-xl)',
                                                fontWeight: 'var(--font-bold)', borderRadius: 'var(--radius-lg)',
                                                border: `1px solid ${digit ? 'var(--color-primary-500)' : 'var(--border-color)'}`,
                                                background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none'
                                            }}
                                            autoFocus={idx === 0}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className={styles.loginBtn} disabled={isLoading || otpCode.join('').length < 6}>
                                {isLoading ? <RefreshCw size={18} className="spin" /> : <ShieldCheck size={18} />}
                                Verify & Continue
                            </button>
                            <div className={styles.tip} style={{ textAlign: 'center' }}>
                                <p>Demo Tip: Enter <strong>123456</strong></p>
                            </div>
                        </form>
                    )
                )}

                {/* Step 2: Business Profile */}
                {step === 2 && (
                    <form className={styles.form} onSubmit={handleBusinessSubmit}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Business Name</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                                    <Briefcase size={18} />
                                </div>
                                <input
                                    type="text"
                                    className={styles.loginInput}
                                    style={{ paddingLeft: 44 }}
                                    placeholder="e.g., Elite Wellness Clinic"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Category</label>
                            <select 
                                className={styles.roleSelect}
                                value={businessCategory}
                                onChange={(e) => setBusinessCategory(e.target.value)}
                            >
                                <option value="clinic">Clinic / Medical</option>
                                <option value="salon">Salon / Spa</option>
                                <option value="barber">Barbershop</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Governorate</label>
                            <select 
                                className={styles.roleSelect}
                                value={governorate}
                                onChange={(e) => { setGovernorate(e.target.value); setCity(''); }}
                            >
                                <option value="" disabled>Select Governorate...</option>
                                {Object.keys(egyptLocations).sort().map((gov) => (
                                    <option key={gov} value={gov}>{gov}</option>
                                ))}
                                <option value="Other">Other Governorate</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>City / Area</label>
                            {governorate === 'Other' ? (
                                <input
                                    type="text"
                                    className={styles.loginInput}
                                    placeholder="Enter your city/area"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            ) : (
                                <select 
                                    className={styles.roleSelect}
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    disabled={!governorate}
                                >
                                    <option value="" disabled>Select City / Area...</option>
                                    {governorate && egyptLocations[governorate] && egyptLocations[governorate].sort().map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                    <option value="Other">Other City/Area</option>
                                </select>
                            )}
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Full Address Details</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                                    <MapPin size={18} />
                                </div>
                                <input
                                    type="text"
                                    className={styles.loginInput}
                                    style={{ paddingLeft: 44 }}
                                    placeholder="Street name, Building number, Floor..."
                                    value={addressDetails}
                                    onChange={(e) => setAddressDetails(e.target.value)}
                                />
                            </div>
                        </div>
                        <button type="submit" className={styles.loginBtn}>
                            <ArrowRight size={18} />
                            Save Profile
                        </button>
                    </form>
                )}

                {/* Step 3: Quick Setup */}
                {step === 3 && (
                    <form className={styles.form} onSubmit={handleFinishSetup}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Add Primary Services</label>
                            
                            {selectedServices.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                                    {selectedServices.map(service => (
                                        <div key={service} style={{
                                            display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
                                            padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)',
                                            background: 'var(--color-primary-50)', color: 'var(--color-primary-600)',
                                            border: '1px solid var(--color-primary-200)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)'
                                        }}>
                                            {service}
                                            <button 
                                                type="button" 
                                                onClick={() => setSelectedServices(prev => prev.filter(s => s !== service))}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', fontSize: 'var(--text-lg)' }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                                    <Tag size={18} />
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <input
                                        type="text"
                                        className={styles.loginInput}
                                        style={{ paddingLeft: 44, flex: 1 }}
                                        placeholder={businessCategory === 'clinic' ? 'e.g., General Consultation' : businessCategory === 'salon' ? 'e.g., Keratin Treatment' : 'e.g., Classic Haircut'}
                                        value={customService}
                                        onChange={(e) => setCustomService(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (customService.trim() && !selectedServices.includes(customService.trim())) {
                                                    setSelectedServices([...selectedServices, customService.trim()]);
                                                    setCustomService('');
                                                }
                                            }
                                        }}
                                    />
                                    <button 
                                        type="button" 
                                        className={styles.btnOutline} 
                                        onClick={() => {
                                            if (customService.trim() && !selectedServices.includes(customService.trim())) {
                                                setSelectedServices([...selectedServices, customService.trim()]);
                                                setCustomService('');
                                            }
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginTop: 'var(--space-4)' }}>
                                <label style={{ fontSize: 'var(--text-md)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>Suggestions for your {businessCategory === 'clinic' ? 'Clinic/Medical Center' : businessCategory === 'salon' ? 'Salon/Spa' : 'Barbershop'}:</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                    {suggestedServices[businessCategory]?.map(suggestion => {
                                        const isSelected = selectedServices.includes(suggestion);
                                        return (
                                            <button
                                                key={suggestion}
                                                type="button"
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setSelectedServices(prev => prev.filter(s => s !== suggestion));
                                                    } else {
                                                        setSelectedServices(prev => [...prev, suggestion]);
                                                    }
                                                }}
                                                style={{
                                                    padding: 'var(--space-2) var(--space-4)',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 'var(--font-medium)',
                                                    background: isSelected ? 'var(--color-primary-50)' : 'var(--bg-secondary)',
                                                    color: isSelected ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                                                    border: `1px solid ${isSelected ? 'var(--color-primary-200)' : 'var(--border-color)'}`,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {suggestion}
                                                {isSelected && <span style={{ marginInlineStart: 4 }}>&times;</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-4)' }}>
                                You can add prices, durations, and more detailed services later in the settings.
                            </p>
                        </div>
                        
                        <button type="submit" className={styles.loginBtn} style={{ marginTop: 'var(--space-4)' }}>
                            Go to Dashboard
                        </button>
                    </form>
                )}

                {step === 1 && !otpSent && (
                    <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Already have an account?</span>{' '}
                        <Link href="/login" style={{ color: 'var(--color-primary-600)', fontWeight: 'var(--font-medium)', textDecoration: 'none' }}>
                            Log in
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
