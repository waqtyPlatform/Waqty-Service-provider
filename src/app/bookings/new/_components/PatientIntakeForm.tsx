'use client';

import { useState } from 'react';
import { User, Stethoscope, Heart, Pill, Phone, Shield, Activity, AlertTriangle } from 'lucide-react';
import type { PatientForm } from '../types';
import { CHRONIC_CONDITIONS, BLOOD_TYPES } from '../data/bookingMocks';
import { s } from '../lib/bookingStyles';
import { SectionHeader } from './SectionHeader';

export function PatientIntakeForm({
    form,
    onChange,
    onConditionToggle,
    t,
}: {
    form: PatientForm;
    onChange: (field: keyof PatientForm, value: string | boolean | string[]) => void;
    onConditionToggle: (cond: string) => void;
    t: (key: string) => string;
}) {
    const [sections, setSections] = useState({
        personal: true,
        medical: true,
        visit: true,
        emergency: false,
        insurance: false,
    });
    const toggle = (k: keyof typeof sections) => setSections(prev => ({ ...prev, [k]: !prev[k] }));

    return (
        <div style={s.card}>
            <div style={{ ...s.cardTitle, marginBottom: 'var(--space-2)' }}>
                <Stethoscope size={18} />
                {t('bookings.patientForm') || 'Patient Intake Form'}
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
                {t('bookings.patientFormDesc') || 'Please fill in patient details before entering the doctor.'}
            </p>

            {/* Personal Information */}
            <SectionHeader
                icon={<User size={15} />}
                label={t('patient.personalInfo')}
                open={sections.personal}
                onToggle={() => toggle('personal')}
            />
            {sections.personal && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={s.row3}>
                        <div style={s.field}>
                            <label style={s.label}>{t('patient.age')}</label>
                            <input
                                style={s.input}
                                type="number"
                                min={0}
                                max={150}
                                placeholder={t('patient.years')}
                                value={form.age}
                                onChange={e => onChange('age', e.target.value)}
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>{t('newBooking.gender')}</label>
                            <select
                                style={s.select}
                                value={form.gender}
                                onChange={e => onChange('gender', e.target.value)}
                            >
                                <option value="">{t('newBooking.selectPlaceholder')}</option>
                                <option value="male">{t('newBooking.genderMale')}</option>
                                <option value="female">{t('newBooking.genderFemale')}</option>
                                <option value="other">{t('newBooking.genderOther')}</option>
                                <option value="prefer_not">{t('newBooking.genderPreferNot')}</option>
                            </select>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>{t('newBooking.bloodType')}</label>
                            <select
                                style={s.select}
                                value={form.bloodType}
                                onChange={e => onChange('bloodType', e.target.value)}
                            >
                                <option value="">{t('newBooking.bloodUnknown')}</option>
                                {BLOOD_TYPES.map(bt => (
                                    <option key={bt} value={bt}>
                                        {bt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div style={s.divider} />

            {/* Medical History */}
            <SectionHeader
                icon={<Heart size={15} />}
                label={t('patient.medicalHistory')}
                open={sections.medical}
                onToggle={() => toggle('medical')}
            />
            {sections.medical && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={s.field}>
                        <label style={s.checkRow}>
                            <input
                                type="checkbox"
                                checked={form.hasAllergies}
                                onChange={e => onChange('hasAllergies', e.target.checked)}
                            />
                            <span style={s.checkLabel}>{t('patient.hasAllergies')}</span>
                        </label>
                        {form.hasAllergies && (
                            <textarea
                                style={{ ...s.textarea, minHeight: 60 }}
                                placeholder={t('patient.allergiesList')}
                                value={form.allergies}
                                onChange={e => onChange('allergies', e.target.value)}
                            />
                        )}
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>{t('patient.chronicConditions')}</label>
                        <div style={s.condGrid}>
                            {CHRONIC_CONDITIONS.map(cond => (
                                <label key={cond.value} style={s.checkRow}>
                                    <input
                                        type="checkbox"
                                        checked={form.chronicConditions.includes(cond.value)}
                                        onChange={() => onConditionToggle(cond.value)}
                                    />
                                    <span style={s.checkLabel}>{t(cond.tKey)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div style={s.row2}>
                        <div style={s.field}>
                            <label style={s.label}>
                                <Pill size={13} style={{ display: 'inline', marginInlineEnd: 'var(--space-1)' }} />
                                {t('patient.currentMeds')}
                            </label>
                            <textarea
                                style={{ ...s.textarea, minHeight: 60 }}
                                placeholder={t('patient.medsPlaceholder')}
                                value={form.currentMedications}
                                onChange={e => onChange('currentMedications', e.target.value)}
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>{t('patient.previousProcedures')}</label>
                            <textarea
                                style={{ ...s.textarea, minHeight: 60 }}
                                placeholder={t('patient.prevProceduresPlaceholder')}
                                value={form.previousProcedures}
                                onChange={e => onChange('previousProcedures', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div style={s.divider} />

            {/* Current Visit */}
            <SectionHeader
                icon={<Activity size={15} />}
                label={t('patient.currentVisit')}
                open={sections.visit}
                onToggle={() => toggle('visit')}
                required
            />
            {sections.visit && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={s.field}>
                        <label style={s.label}>
                            {t('patient.chiefComplaint')} <span style={{ color: 'var(--color-error)' }}>*</span>
                        </label>
                        <input
                            style={form.chiefComplaint ? s.input : s.inputErr}
                            placeholder={t('patient.chiefComplaintPlaceholder')}
                            value={form.chiefComplaint}
                            onChange={e => onChange('chiefComplaint', e.target.value)}
                        />
                        {!form.chiefComplaint && (
                            <span style={s.hintErr}>
                                <AlertTriangle size={11} /> {t('patient.required')}
                            </span>
                        )}
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>{t('bookings.medicalNotes') || 'Symptoms Description'}</label>
                        <textarea
                            style={s.textarea}
                            placeholder={
                                t('bookings.medicalNotesPlaceholder') || "Describe the patient's symptoms in detail..."
                            }
                            value={form.symptoms}
                            onChange={e => onChange('symptoms', e.target.value)}
                        />
                    </div>
                    <div style={s.row3}>
                        <div style={s.field}>
                            <label style={s.label}>{t('patient.symptomsDuration')}</label>
                            <select
                                style={s.select}
                                value={form.symptomsDuration}
                                onChange={e => onChange('symptomsDuration', e.target.value)}
                            >
                                <option value="">{t('newBooking.selectPlaceholder')}</option>
                                <option value="today">{t('newBooking.durToday')}</option>
                                <option value="2-3days">{t('newBooking.dur23days')}</option>
                                <option value="1week">{t('newBooking.dur1week')}</option>
                                <option value="2weeks">{t('newBooking.dur2weeks')}</option>
                                <option value="1month">{t('newBooking.dur1month')}</option>
                                <option value="3months">{t('newBooking.dur3months')}</option>
                                <option value="6months+">{t('newBooking.dur6months')}</option>
                                <option value="chronic">{t('newBooking.durChronic')}</option>
                            </select>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>{t('patient.evaluatedBefore')}</label>
                            <select
                                style={s.select}
                                value={form.evaluatedBefore ? 'yes' : 'no'}
                                onChange={e => onChange('evaluatedBefore', e.target.value === 'yes')}
                            >
                                <option value="no">{t('newBooking.evalNoFirstTime')}</option>
                                <option value="yes">{t('newBooking.evalYesFollowUp')}</option>
                            </select>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>{t('patient.painLevel')}</label>
                            <div style={s.painTrack}>
                                {Array.from({ length: 11 }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onChange('painLevel', String(i))}
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            border:
                                                form.painLevel === String(i)
                                                    ? '2px solid var(--color-primary-500)'
                                                    : '1px solid var(--border-color)',
                                            background:
                                                form.painLevel === String(i)
                                                    ? i <= 3
                                                        ? '#dcfce7'
                                                        : i <= 6
                                                          ? '#fef3c7'
                                                          : '#fee2e2'
                                                    : 'var(--bg-secondary)',
                                            cursor: 'pointer',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-primary)',
                                        }}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={s.divider} />

            {/* Emergency Contact */}
            <SectionHeader
                icon={<Phone size={15} />}
                label={t('newBooking.emergencyContact')}
                open={sections.emergency}
                onToggle={() => toggle('emergency')}
            />
            {sections.emergency && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={s.row3}>
                        <div style={s.field}>
                            <label style={s.label}>{t('newBooking.contactName')}</label>
                            <input
                                style={s.input}
                                placeholder={t('newBooking.fullNamePlaceholder')}
                                value={form.emergencyName}
                                onChange={e => onChange('emergencyName', e.target.value)}
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>{t('newBooking.phone')}</label>
                            <input
                                style={s.input}
                                placeholder={t('newBooking.phonePlaceholder')}
                                value={form.emergencyPhone}
                                onChange={e => onChange('emergencyPhone', e.target.value)}
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>{t('newBooking.relationship')}</label>
                            <select
                                style={s.select}
                                value={form.emergencyRelation}
                                onChange={e => onChange('emergencyRelation', e.target.value)}
                            >
                                <option value="">{t('newBooking.selectPlaceholder')}</option>
                                <option value="spouse">{t('newBooking.relSpouse')}</option>
                                <option value="parent">{t('newBooking.relParent')}</option>
                                <option value="child">{t('newBooking.relChild')}</option>
                                <option value="sibling">{t('newBooking.relSibling')}</option>
                                <option value="friend">{t('newBooking.relFriend')}</option>
                                <option value="other">{t('newBooking.relOther')}</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div style={s.divider} />

            {/* Insurance */}
            <SectionHeader
                icon={<Shield size={15} />}
                label={t('patient.insurance')}
                open={sections.insurance}
                onToggle={() => toggle('insurance')}
            />
            {sections.insurance && (
                <div style={s.row2}>
                    <div style={s.field}>
                        <label style={s.label}>{t('patient.insuranceProvider')}</label>
                        <input
                            style={s.input}
                            placeholder={t('patient.insuranceProviderPlaceholder')}
                            value={form.insuranceProvider}
                            onChange={e => onChange('insuranceProvider', e.target.value)}
                        />
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>{t('patient.insurancePolicyNo')}</label>
                        <input
                            style={s.input}
                            placeholder={t('patient.policyNoPlaceholder')}
                            value={form.insurancePolicyNo}
                            onChange={e => onChange('insurancePolicyNo', e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
