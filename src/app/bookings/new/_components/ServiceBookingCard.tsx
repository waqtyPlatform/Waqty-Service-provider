'use client';

import { egpLabel } from '@/lib/money';
import { useState } from 'react';
import { Scissors, MapPin, AlertTriangle, Trash2, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { isEmployeeOnShift, isEmployeeDuringBreak } from '@/lib/shiftData';
import { resolveServicePrice } from '@/lib/priceResolver';
import type { ServicePriceOverride } from '@/lib/priceResolver';
import type { Service, Employee, BookingItem } from '../types';
import { busySlotsInRange } from '../lib/bookingHelpers';
import { EMP_BUSY, ROOM_BUSY, ROOMS, TIME_SLOTS } from '../data/bookingMocks';
import { s } from '../lib/bookingStyles';
import { SlotHint } from './SlotHint';
import { RoomHint } from './RoomHint';

export function ServiceBookingCard({
    item,
    index,
    services,
    employees,
    isClinic,
    hasInternalConflict,
    onUpdate,
    onRemove,
    canRemove,
    priceOverrides,
    branchId,
}: {
    item: BookingItem;
    index: number;
    services: Service[];
    employees: Employee[];
    isClinic: boolean;
    hasInternalConflict: boolean;
    onUpdate: (id: string, field: keyof BookingItem, value: string | Service | Employee) => void;
    onRemove: (id: string) => void;
    canRemove: boolean;
    priceOverrides: ServicePriceOverride[];
    branchId: string;
}) {
    const { t, tn } = useTranslation();
    const [showAvail, setShowAvail] = useState(false);

    const empBusy = busySlotsInRange(EMP_BUSY, item.employee.id, item.date, item.time, item.service.durationMins);
    const roomBusy = item.room
        ? busySlotsInRange(ROOM_BUSY, item.room, item.date, item.time, item.service.durationMins)
        : [];
    const hasIssue = hasInternalConflict || empBusy.length > 0 || roomBusy.length > 0;

    const label = isClinic ? t('bookings.appointment') : t('bookings.service');

    return (
        <div style={hasIssue ? s.cardConflict : s.card}>
            {/* Header row */}
            <div style={{ ...s.cardTitle, justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Scissors size={18} />
                    {label} {index + 1}
                    {hasIssue && (
                        <span style={{ ...s.badge, background: '#fef2f2', color: '#dc2626' }}>
                            <AlertTriangle size={10} /> {t('newBooking.conflict')}
                        </span>
                    )}
                </span>
                {canRemove && (
                    <button
                        onClick={() => onRemove(item.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-error)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-1)',
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        <Trash2 size={15} /> {t('newBooking.remove')}
                    </button>
                )}
            </div>

            {hasInternalConflict && (
                <div style={s.bannerErr}>
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                    <span>{t('bookings.internalConflict')}</span>
                </div>
            )}

            {/* Service + Employee */}
            <div style={s.row2}>
                <div style={s.field}>
                    <label style={s.label}>{isClinic ? t('bookings.serviceProcedure') : t('bookings.service')}</label>
                    <select
                        style={s.select}
                        value={item.service.id}
                        onChange={e =>
                            onUpdate(item.id, 'service', services.find(sv => sv.id === e.target.value) ?? services[0])
                        }
                    >
                        {services.map(sv => (
                            <option key={sv.id} value={sv.id}>
                                {tn(sv.name, sv.nameAr)} — {sv.price} {egpLabel()} ({sv.duration})
                            </option>
                        ))}
                    </select>
                    {(() => {
                        const resolved = resolveServicePrice(item.service, item.employee, branchId, priceOverrides);
                        return (
                            <span style={s.hint}>
                                {item.service.category} · {item.service.duration}
                                {resolved.source !== 'base' && (
                                    <span
                                        style={{
                                            marginInlineStart: 'var(--space-2)',
                                            color: 'var(--color-primary-500)',
                                            fontWeight: 'var(--font-semibold)',
                                        }}
                                    >
                                        → {resolved.price} {egpLabel()} ({resolved.source})
                                    </span>
                                )}
                            </span>
                        );
                    })()}
                </div>

                <div style={s.field}>
                    <label style={s.label}>{isClinic ? t('bookings.doctorSpecialist') : t('bookings.employee')}</label>
                    <select
                        style={hasInternalConflict ? s.selectErr : s.select}
                        value={item.employee.id}
                        onChange={e =>
                            onUpdate(
                                item.id,
                                'employee',
                                employees.find(em => em.id === e.target.value) ?? employees[0]
                            )
                        }
                    >
                        {employees.map(em => {
                            const busy = EMP_BUSY[em.id]?.[item.date]?.includes(item.time);
                            const offShift = !isEmployeeOnShift(em.id, em.role, item.date);
                            const onBreak = isEmployeeDuringBreak(em.id, em.role, item.date, item.time);
                            const prefix = offShift ? '⛔ ' : onBreak ? '☕ ' : busy ? '⚠ ' : '✓ ';
                            return (
                                <option key={em.id} value={em.id}>
                                    {prefix}
                                    {em.name} — {em.role}
                                </option>
                            );
                        })}
                    </select>
                    <span
                        style={{
                            ...s.hint,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            marginTop: 'var(--space-1)',
                        }}
                    >
                        <span style={{ ...s.dot, background: item.employee.color }} />
                        {item.employee.role}
                        {!isEmployeeOnShift(item.employee.id, item.employee.role, item.date) && (
                            <span style={{ color: 'var(--color-warning-600)', fontWeight: 600 }}>
                                {' '}
                                — {t('newBooking.offShift')}
                            </span>
                        )}
                        {isEmployeeDuringBreak(item.employee.id, item.employee.role, item.date, item.time) && (
                            <span style={{ color: 'var(--color-warning-600)', fontWeight: 600 }}>
                                {' '}
                                — {t('newBooking.onBreak')}
                            </span>
                        )}
                    </span>
                </div>
            </div>

            {/* Date + Time */}
            <div style={s.row2}>
                <div style={s.field}>
                    <label style={s.label}>{t('bookings.date')}</label>
                    <input
                        style={s.input}
                        type="date"
                        value={item.date}
                        onChange={e => onUpdate(item.id, 'date', e.target.value)}
                    />
                </div>

                <div style={s.field}>
                    <label style={s.label}>{t('bookings.time')}</label>
                    <select
                        style={empBusy.length > 0 ? s.selectErr : s.select}
                        value={item.time}
                        onChange={e => onUpdate(item.id, 'time', e.target.value)}
                    >
                        {TIME_SLOTS.map(ts => {
                            const busy = EMP_BUSY[item.employee.id]?.[item.date]?.includes(ts);
                            return (
                                <option key={ts} value={ts}>
                                    {busy ? `⚠ ${ts} (${t('newBooking.busyShort')})` : ts}
                                </option>
                            );
                        })}
                    </select>
                    <SlotHint
                        empId={item.employee.id}
                        date={item.date}
                        time={item.time}
                        dur={item.service.durationMins}
                    />
                </div>
            </div>

            {/* Staff availability panel */}
            <div style={{ marginTop: 'var(--space-2)' }}>
                <button style={s.btnCollapse} onClick={() => setShowAvail(v => !v)}>
                    <Activity size={13} />
                    {showAvail ? t('bookings.hideAvailability') : t('bookings.showAvailability')}{' '}
                    {t('newBooking.availabilityAt').replace('{time}', item.time)}
                    {showAvail ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {showAvail && (
                    <div
                        style={{
                            marginTop: 'var(--space-3)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-3)',
                        }}
                    >
                        {employees.map(em => {
                            const busy = EMP_BUSY[em.id]?.[item.date]?.includes(item.time) ?? false;
                            return (
                                <div key={em.id} style={s.availRow}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <span style={{ ...s.dot, background: em.color }} />
                                        <strong>{em.name}</strong>
                                        <span style={{ color: 'var(--text-tertiary)' }}>— {em.role}</span>
                                    </span>
                                    <span
                                        style={{
                                            ...s.badge,
                                            background: busy ? '#fef2f2' : '#f0fdf4',
                                            color: busy ? '#dc2626' : '#16a34a',
                                        }}
                                    >
                                        {busy
                                            ? `● ${t('newBooking.statusBusy')}`
                                            : `● ${t('newBooking.statusAvailable')}`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Room */}
            <div style={{ ...s.field, marginTop: 'var(--space-4)' }}>
                <label style={s.label}>
                    <MapPin size={14} style={{ display: 'inline', marginInlineEnd: 'var(--space-1)' }} />
                    {t('bookings.room')}
                </label>
                <select
                    style={roomBusy.length > 0 ? s.selectErr : s.select}
                    value={item.room}
                    onChange={e => onUpdate(item.id, 'room', e.target.value)}
                >
                    <option value="">{t('bookings.autoAssign')}</option>
                    {ROOMS.map(r => {
                        const occ = ROOM_BUSY[r.id]?.[item.date]?.includes(item.time);
                        return (
                            <option key={r.id} value={r.id}>
                                {occ ? `⚠ ${r.name} (${t('newBooking.occupiedShort')})` : `✓ ${r.name}`}
                            </option>
                        );
                    })}
                </select>
                <RoomHint roomId={item.room} date={item.date} time={item.time} dur={item.service.durationMins} />
            </div>
        </div>
    );
}
