'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast, Stepper } from '@/components/ui';
import { User, Search, FileText, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import BookingsTabs from '../../BookingsTabs';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { providerApi, publicApi, bookingApi, type Branch, type Booking } from '@/lib/api';
import { BUSINESS_TERMINOLOGY } from '@/lib/contract';
import type { ServicePriceOverride } from '@/lib/priceResolver';
import type { Service, Employee, BookingItem, PatientForm } from '../types';
import { SERVICES, EMPLOYEES, TODAY, MOCK_PRICE_OVERRIDES, CURRENT_BRANCH_ID } from '../data/bookingMocks';
import { initItem } from '../lib/bookingHelpers';
import { s } from '../lib/bookingStyles';
import { ServiceBookingCard } from './ServiceBookingCard';
import { PatientIntakeForm } from './PatientIntakeForm';
import { BookingSummary } from './BookingSummary';

export function NewBookingFlow() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = Boolean(editId);
    const { addToast } = useToast();
    const { t, tn } = useTranslation();
    const { user } = useAuth();

    // PR-10: canonical category drives terminology + clinic intake deterministically.
    const businessType = user?.businessType ?? 'salon';
    const isClinic = BUSINESS_TERMINOLOGY[businessType].requiresIntake;
    // The local mock catalogue only has barber/salon/clinic variants; map any
    // other canonical category (spa/nails/other) onto the salon catalogue.
    const catalogKey: keyof typeof SERVICES =
        businessType === 'barber' || businessType === 'clinic' ? businessType : 'salon';

    // ── Edit mode: fetch existing booking ──
    const [editBooking, setEditBooking] = useState<Booking | null>(null);
    const [editLoading, setEditLoading] = useState(isEditMode);
    const [rescheduleReason, setRescheduleReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!editId) return;
        let cancelled = false;
        (async () => {
            setEditLoading(true);
            try {
                const res = await providerApi.getBooking(editId);
                if (!cancelled && res.success && res.data) {
                    setEditBooking(res.data);
                }
            } catch {
                if (!cancelled) {
                    addToast('error', t('bookings.bookingNotFound'));
                }
            } finally {
                if (!cancelled) setEditLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editId]);

    // ── API-fetched data (falls back to mock) ──
    const [apiServices, setApiServices] = useState<Service[] | null>(null);
    const [apiEmployees, setApiEmployees] = useState<Employee[] | null>(null);
    const [apiBranches, setApiBranches] = useState<Branch[]>([]);
    const [apiPriceOverrides, setApiPriceOverrides] = useState<ServicePriceOverride[]>(MOCK_PRICE_OVERRIDES);
    const [_availableDates, setAvailableDates] = useState<string[]>([]);
    const [_availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [svcRes, empRes, brRes, priceRes] = await Promise.allSettled([
                    providerApi.getServices(),
                    providerApi.getEmployees(),
                    providerApi.getBranches(),
                    providerApi.getServicePrices(),
                ]);

                if (cancelled) return;

                if (svcRes.status === 'fulfilled' && svcRes.value.success && svcRes.value.data) {
                    const mapped: Service[] = svcRes.value.data.map(s => ({
                        id: s.uuid,
                        name: s.name,
                        nameAr: s.name_ar ?? undefined, // real bilingual name when the API supplies it (FU/name_ar)
                        duration: s.estimated_duration_minutes ? `${s.estimated_duration_minutes} min` : '30 min',
                        durationMins: s.estimated_duration_minutes ?? 30,
                        price: 0, // resolved via pricing API
                        category: s.sub_category?.name ?? 'General',
                    }));
                    if (mapped.length > 0) setApiServices(mapped);
                }

                if (empRes.status === 'fulfilled' && empRes.value.success && empRes.value.data) {
                    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
                    const mapped: Employee[] = empRes.value.data.map((e, i) => ({
                        id: e.uuid,
                        name: e.name,
                        role: e.branch?.name ?? 'Staff',
                        color: colors[i % colors.length],
                    }));
                    if (mapped.length > 0) setApiEmployees(mapped);
                }

                if (brRes.status === 'fulfilled' && brRes.value.success && brRes.value.data) {
                    setApiBranches(brRes.value.data);
                }

                if (priceRes.status === 'fulfilled' && priceRes.value.success && priceRes.value.data) {
                    const mapped: ServicePriceOverride[] = priceRes.value.data.map(p => ({
                        id: p.uuid,
                        serviceId: p.service_uuid,
                        employeeId: p.employee_uuid ?? undefined,
                        branchId: p.branch_uuid ?? undefined,
                        pricingTier: p.pricing_group?.name ?? undefined,
                        price: p.price,
                    }));
                    if (mapped.length > 0) setApiPriceOverrides(mapped);
                }
            } catch {
                // Silently fall back to mock data
            } finally {
                if (!cancelled) setDataLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const services = apiServices ?? SERVICES[catalogKey] ?? SERVICES.salon;
    const employees = apiEmployees ?? EMPLOYEES[catalogKey] ?? EMPLOYEES.salon;

    // ── Fetch available dates when branch/service/employee changes ──
    const _fetchAvailability = useCallback(
        async (branchUuid: string, serviceUuid: string, employeeUuid: string, date: string) => {
            if (!branchUuid || !serviceUuid || !employeeUuid) return;
            try {
                const month = date.slice(0, 7); // YYYY-MM
                const [datesRes, slotsRes] = await Promise.allSettled([
                    publicApi.getAvailableDates({
                        branch_uuid: branchUuid,
                        service_uuid: serviceUuid,
                        employee_uuid: employeeUuid,
                        month,
                    }),
                    publicApi.getAvailableSlots({
                        branch_uuid: branchUuid,
                        service_uuid: serviceUuid,
                        employee_uuid: employeeUuid,
                        date,
                    }),
                ]);
                if (datesRes.status === 'fulfilled' && datesRes.value.success && datesRes.value.data) {
                    setAvailableDates(datesRes.value.data);
                }
                if (slotsRes.status === 'fulfilled' && slotsRes.value.success && slotsRes.value.data) {
                    setAvailableSlots(slotsRes.value.data);
                }
            } catch {
                // Keep existing slots
            }
        },
        []
    );

    // ── State ──
    const [items, setItems] = useState<BookingItem[]>([initItem(services, employees)]);

    // Re-initialize items when API data loads
    useEffect(() => {
        if (!dataLoading && services.length > 0 && employees.length > 0) {
            setItems(prev => {
                if (prev.length === 1 && prev[0].service.id === (SERVICES[catalogKey] ?? SERVICES.salon)[0]?.id) {
                    return [initItem(services, employees)];
                }
                return prev;
            });
        }
    }, [dataLoading, services, employees, catalogKey]);
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState('');
    const [step, setStep] = useState(0);
    const [patient, setPatient] = useState<PatientForm>({
        age: '',
        gender: '',
        bloodType: '',
        hasAllergies: false,
        allergies: '',
        chronicConditions: [],
        currentMedications: '',
        previousProcedures: '',
        chiefComplaint: '',
        symptoms: '',
        symptomsDuration: '',
        painLevel: '0',
        evaluatedBefore: false,
        emergencyName: '',
        emergencyPhone: '',
        emergencyRelation: '',
        insuranceProvider: '',
        insurancePolicyNo: '',
    });

    // ── Pre-fill form when editing an existing booking ──
    const [editPrefilled, setEditPrefilled] = useState(false);
    useEffect(() => {
        if (!editBooking || editPrefilled) return;
        if (services.length === 0 || employees.length === 0) return;

        // Pre-fill client info
        if (editBooking.user) {
            setClientName(editBooking.user.name ?? '');
            setClientPhone(editBooking.user.phone ?? '');
        }

        // Pre-fill notes
        if (editBooking.notes) {
            setNotes(editBooking.notes);
        }

        // Pre-fill the service/employee/date/time from the booking
        const matchedService = services.find(sv => sv.id === editBooking.service_uuid) ?? services[0];
        const matchedEmployee = editBooking.employee_uuid
            ? (employees.find(em => em.id === editBooking.employee_uuid) ?? employees[0])
            : employees[0];

        setItems([
            {
                id: Date.now().toString(),
                service: matchedService,
                employee: matchedEmployee,
                date: editBooking.booking_date ?? TODAY,
                time: editBooking.start_time?.slice(0, 5) ?? '10:00',
                room: '',
            },
        ]);

        setEditPrefilled(true);
    }, [editBooking, services, employees, editPrefilled]);

    // ── Conflict detection ──
    const conflicts = useMemo(() => {
        const set = new Set<string>();
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const a = items[i],
                    b = items[j];
                if (a.employee.id !== b.employee.id || a.date !== b.date) continue;
                const [ah, am] = a.time.split(':').map(Number);
                const [bh, bm] = b.time.split(':').map(Number);
                const aS = ah * 60 + am,
                    aE = aS + a.service.durationMins;
                const bS = bh * 60 + bm,
                    bE = bS + b.service.durationMins;
                if (aS < bE && bS < aE) {
                    set.add(a.id);
                    set.add(b.id);
                }
            }
        }
        return set;
    }, [items]);

    // ── Handlers ──
    const addItem = () => setItems(prev => [...prev, initItem(services, employees, prev[prev.length - 1])]);
    const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
    const updateItem = (id: string, field: keyof BookingItem, value: string | Service | Employee) =>
        setItems(prev => prev.map(i => (i.id === id ? { ...i, [field]: value } : i)));
    const updatePatient = (field: keyof PatientForm, value: string | boolean | string[]) =>
        setPatient(prev => ({ ...prev, [field]: value }));
    const toggleCondition = (cond: string) =>
        setPatient(prev => ({
            ...prev,
            chronicConditions: prev.chronicConditions.includes(cond)
                ? prev.chronicConditions.filter(c => c !== cond)
                : [...prev.chronicConditions, cond],
        }));

    const handleConfirm = async () => {
        if (!clientName.trim() || !clientPhone.trim()) {
            addToast('error', t('bookings.reqFields'));
            return;
        }
        if (conflicts.size > 0) {
            addToast('error', t('bookings.resolveConflicts'));
            return;
        }
        if (isClinic && !patient.chiefComplaint.trim()) {
            addToast('error', t('newBooking.clinicReasonRequired'));
            return;
        }

        // If using real API data, validate availability
        if (apiServices && items.length > 0) {
            try {
                for (const item of items) {
                    const mainBranch = apiBranches.find(b => b.is_main) ?? apiBranches[0];
                    if (mainBranch) {
                        const slotsRes = await publicApi.getAvailableSlots({
                            branch_uuid: mainBranch.uuid,
                            service_uuid: item.service.id,
                            employee_uuid: item.employee.id,
                            date: item.date,
                        });
                        if (slotsRes.success && slotsRes.data && !slotsRes.data.includes(item.time)) {
                            addToast(
                                'error',
                                t('newBooking.timeNoLongerAvailable')
                                    .replace('{time}', item.time)
                                    .replace('{service}', tn(item.service.name, item.service.nameAr))
                            );
                            return;
                        }
                    }
                }
            } catch {
                // Proceed with booking even if validation fails
            }
        }

        // ── Edit mode: update via API ──
        if (isEditMode && editId) {
            setSubmitting(true);
            try {
                const item = items[0];
                const mainBranch = apiBranches.find(b => b.is_main) ?? apiBranches[0];
                const payload: Record<string, unknown> = {
                    service_uuid: item.service.id,
                    employee_uuid: item.employee.id,
                    booking_date: item.date,
                    start_time: item.time,
                    notes: [notes, rescheduleReason ? `Reschedule reason: ${rescheduleReason}` : '']
                        .filter(Boolean)
                        .join('\n'),
                };
                if (mainBranch) payload.branch_uuid = mainBranch.uuid;

                await bookingApi.updateBooking(editId, payload);
                addToast('success', t('bookings.updateSuccess'));
                router.push(`/bookings/${editId}`);
            } catch {
                addToast('error', t('newBooking.updateFailed'));
            } finally {
                setSubmitting(false);
            }
            return;
        }

        addToast('success', `${t('bookings.confirmSuccess')} ${clientName}`);
        router.push('/bookings');
    };

    const businessLabel = BUSINESS_TERMINOLOGY[businessType].label;

    // ── Guided stepper ──
    const stepKeys: ('client' | 'services' | 'intake' | 'review')[] = isClinic
        ? ['client', 'services', 'intake', 'review']
        : ['client', 'services', 'review'];
    const stepLabels = stepKeys.map(k =>
        k === 'client'
            ? t('newBooking.stepClient')
            : k === 'services'
              ? t('newBooking.stepServices')
              : k === 'intake'
                ? t('newBooking.stepIntake')
                : t('newBooking.stepReview')
    );
    const lastStep = stepKeys.length - 1;
    const safeStep = Math.min(step, lastStep);
    const currentKey = stepKeys[safeStep];

    const goBack = () => setStep(sx => Math.max(0, sx - 1));
    const goNext = () => {
        if (currentKey === 'client' && !clientPhone.trim()) {
            addToast('error', t('newBooking.phoneRequired'));
            return;
        }
        setStep(sx => Math.min(lastStep, sx + 1));
    };
    const reviewRow: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        fontSize: 'var(--text-sm)',
        padding: 'var(--space-2) 0',
        borderBottom: '1px solid var(--border-color)',
    };

    // ── Loading state for edit mode ──
    if (editLoading) {
        return (
            <div style={s.page}>
                <BookingsTabs />
                <div style={{ ...s.card, textAlign: 'center' as const, padding: 'var(--space-8)' }}>
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
                        {t('bookings.loadingBooking')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={s.page}>
            <BookingsTabs />

            {/* Header */}
            <div style={s.header}>
                <button
                    style={s.btnGhost}
                    onClick={() => (isEditMode ? router.push(`/bookings/${editId}`) : router.push('/bookings'))}
                >
                    {t('newBooking.back')}
                </button>
                <h1 style={s.h1}>{isEditMode ? t('bookings.editBooking') : t('bookings.newBooking')}</h1>
                <span
                    style={{
                        ...s.badge,
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        marginInlineStart: 'var(--space-2)',
                        border: '1px solid var(--border-color)',
                    }}
                >
                    {businessLabel}
                </span>
            </div>

            {/* Global conflict banner */}
            {conflicts.size > 0 && (
                <div style={s.bannerErr}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                        <strong>{t('bookings.conflictDetected')}</strong> {t('bookings.conflictDesc')}{' '}
                        {t('newBooking.conflictDescAdjust')}
                    </div>
                </div>
            )}

            <div style={s.formGrid}>
                {/* Left column — guided steps */}
                <div style={s.col}>
                    <div style={s.card}>
                        <Stepper steps={stepLabels} current={safeStep} />
                    </div>

                    {/* Step: Client */}
                    {currentKey === 'client' && (
                        <div style={s.card}>
                            <div style={s.cardTitle}>
                                <User size={18} /> {t('bookings.client')}
                            </div>
                            <div style={s.searchWrap}>
                                <Search size={16} style={s.searchIcon} />
                                <input
                                    style={{ ...s.input, paddingInlineStart: 36 }}
                                    placeholder={t('bookings.searchClient')}
                                    value={clientName}
                                    onChange={e => setClientName(e.target.value)}
                                />
                            </div>
                            <div style={s.row2}>
                                <div style={s.field}>
                                    <label style={s.label}>
                                        {t('bookings.phone')} <span style={{ color: 'var(--color-error)' }}>*</span>
                                    </label>
                                    <input
                                        style={s.input}
                                        placeholder="+20 1XX XXX XXXX"
                                        value={clientPhone}
                                        onChange={e => setClientPhone(e.target.value)}
                                    />
                                </div>
                                <div style={s.field}>
                                    <label style={s.label}>{t('bookings.email')}</label>
                                    <input style={s.input} type="email" placeholder="client@email.com" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step: Services */}
                    {currentKey === 'services' && (
                        <>
                            {items.map((item, index) => (
                                <ServiceBookingCard
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    services={services}
                                    employees={employees}
                                    isClinic={isClinic}
                                    hasInternalConflict={conflicts.has(item.id)}
                                    onUpdate={updateItem}
                                    onRemove={removeItem}
                                    canRemove={items.length > 1}
                                    priceOverrides={apiPriceOverrides}
                                    branchId={apiBranches.find(b => b.is_main)?.uuid ?? CURRENT_BRANCH_ID}
                                />
                            ))}

                            <button style={s.btnOutline} onClick={addItem}>
                                <Plus size={16} />
                                {isClinic
                                    ? t('newBooking.addAnotherAppointment')
                                    : t('bookings.addAnotherService') || 'Add Another Service'}
                            </button>

                            <div style={s.card}>
                                <div style={s.cardTitle}>
                                    <FileText size={18} /> {t('bookings.additionalDetails')}
                                </div>
                                <div style={s.row2}>
                                    <div style={s.field}>
                                        <label style={s.label}>{t('bookings.discount')}</label>
                                        <input
                                            style={s.input}
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={discount}
                                            onChange={e => setDiscount(Number(e.target.value))}
                                        />
                                    </div>
                                    <div style={s.field}>
                                        <label style={s.label}>{t('bookings.notes')}</label>
                                        <textarea
                                            style={{ ...s.textarea, minHeight: 42 }}
                                            placeholder={t('bookings.notesPlaceholder')}
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Reschedule Reason (edit mode only) */}
                                {isEditMode && (
                                    <div style={{ ...s.field, marginTop: 'var(--space-4)' }}>
                                        <label style={s.label}>{t('bookings.rescheduleReason')}</label>
                                        <textarea
                                            style={s.textarea}
                                            placeholder={t('bookings.rescheduleReasonPlaceholder')}
                                            value={rescheduleReason}
                                            onChange={e => setRescheduleReason(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Step: Patient intake (clinic only) */}
                    {currentKey === 'intake' && isClinic && (
                        <PatientIntakeForm
                            form={patient}
                            onChange={updatePatient}
                            onConditionToggle={toggleCondition}
                            t={t}
                        />
                    )}

                    {/* Step: Review */}
                    {currentKey === 'review' && (
                        <div style={s.card}>
                            <div style={s.cardTitle}>
                                <CheckCircle size={18} /> {t('newBooking.stepReview')}
                            </div>
                            <p
                                style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: 'var(--text-sm)',
                                    margin: '0 0 var(--space-3)',
                                }}
                            >
                                {t('newBooking.reviewHint')}
                            </p>
                            <div style={reviewRow}>
                                <span style={s.label}>{t('bookings.client')}</span>
                                <strong>{clientName || '—'}</strong>
                            </div>
                            <div style={reviewRow}>
                                <span style={s.label}>{t('bookings.phone')}</span>
                                <strong>{clientPhone || '—'}</strong>
                            </div>
                            {items.map(it => (
                                <div key={it.id} style={reviewRow}>
                                    <span style={s.label}>{it.service.name}</span>
                                    <span>
                                        {it.employee.name}
                                        {it.date ? ` · ${it.date}` : ''}
                                        {it.time ? ` ${it.time}` : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                        <button style={{ ...s.btnGhost, visibility: step > 0 ? 'visible' : 'hidden' }} onClick={goBack}>
                            {t('newBooking.back')}
                        </button>
                        {safeStep < lastStep && (
                            <button style={s.btnPrimary} onClick={goNext}>
                                {t('newBooking.next')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Right column — persistent summary; confirm only on the review step */}
                <BookingSummary
                    items={items}
                    clientName={clientName}
                    discount={discount}
                    conflicts={conflicts}
                    onConfirm={handleConfirm}
                    t={t}
                    tn={tn}
                    priceOverrides={apiPriceOverrides}
                    branchId={apiBranches.find(b => b.is_main)?.uuid ?? CURRENT_BRANCH_ID}
                    submitLabel={isEditMode ? t('bookings.saveChanges') : undefined}
                    submitting={submitting}
                    hideConfirm={safeStep !== lastStep}
                />
            </div>
        </div>
    );
}
