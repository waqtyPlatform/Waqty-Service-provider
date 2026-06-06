'use client';

import { egpLabel } from '@/lib/money';
import { FileText, Check, AlertTriangle, MapPin, UserCog, Calendar } from 'lucide-react';
import { resolveServicePrice } from '@/lib/priceResolver';
import type { ServicePriceOverride } from '@/lib/priceResolver';
import type { BookingItem } from '../types';
import { ROOMS } from '../data/bookingMocks';
import { s } from '../lib/bookingStyles';

export function BookingSummary({
    items,
    clientName,
    discount,
    conflicts,
    onConfirm,
    t,
    tn,
    priceOverrides,
    branchId,
    submitLabel,
    submitting,
    hideConfirm,
}: {
    items: BookingItem[];
    clientName: string;
    discount: number;
    conflicts: Set<string>;
    onConfirm: () => void;
    t: (key: string) => string;
    tn: (base: string, ar?: string | null) => string;
    priceOverrides: ServicePriceOverride[];
    branchId: string;
    submitLabel?: string;
    submitting?: boolean;
    hideConfirm?: boolean;
}) {
    const subtotal = items.reduce((sum, i) => {
        const resolved = resolveServicePrice(i.service, i.employee, branchId, priceOverrides);
        return sum + resolved.price;
    }, 0);
    const discountAmt = (subtotal * discount) / 100;
    const total = subtotal - discountAmt;
    const hasConflict = conflicts.size > 0;

    const uniqueStaff = Array.from(new Map(items.map(i => [i.employee.id, i.employee])).values());

    return (
        <div style={s.summarySticky}>
            {/* Totals card */}
            <div style={s.card}>
                <div style={s.cardTitle}>
                    <FileText size={18} /> {t('bookings.summary')}
                </div>

                <div style={s.summaryRow}>
                    <span style={s.summaryLabel}>{t('bookings.client')}</span>
                    <span style={s.summaryValue}>{clientName || t('bookings.walkIn')}</span>
                </div>

                {items.map(item => {
                    const resolved = resolveServicePrice(item.service, item.employee, branchId, priceOverrides);
                    return (
                        <div
                            key={item.id}
                            style={{ padding: 'var(--space-2) 0', borderBottom: '1px dashed var(--border-color)' }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: 4,
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-medium)',
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    {conflicts.has(item.id) && <AlertTriangle size={12} color="var(--color-error)" />}
                                    {tn(item.service.name, item.service.nameAr)}
                                </span>
                                <span>
                                    {resolved.source !== 'base' && (
                                        <span
                                            style={{
                                                textDecoration: 'line-through',
                                                color: 'var(--text-tertiary)',
                                                marginInlineEnd: 'var(--space-2)',
                                                fontSize: 'var(--text-xs)',
                                            }}
                                        >
                                            {item.service.price}
                                        </span>
                                    )}
                                    {resolved.price} {egpLabel()}
                                </span>
                            </div>
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-1)',
                                }}
                            >
                                <span style={{ ...s.dot, background: item.employee.color }} />
                                {item.employee.name}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                                <Calendar size={10} style={{ display: 'inline', marginInlineEnd: 3 }} />
                                {item.date} {item.time} · {item.service.duration}
                            </div>
                            {item.room && (
                                <div
                                    style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}
                                >
                                    <MapPin size={10} style={{ display: 'inline', marginInlineEnd: 3 }} />
                                    {ROOMS.find(r => r.id === item.room)?.name ?? item.room}
                                </div>
                            )}
                        </div>
                    );
                })}

                <div style={{ ...s.summaryRow, marginTop: 'var(--space-2)' }}>
                    <span style={s.summaryLabel}>{t('newBooking.subtotal')}</span>
                    <span style={s.summaryValue}>
                        {subtotal} {egpLabel()}
                    </span>
                </div>
                {discount > 0 && (
                    <div style={s.summaryRow}>
                        <span style={s.summaryLabel}>
                            {t('newBooking.discountWithPct').replace('{pct}', String(discount))}
                        </span>
                        <span style={{ ...s.summaryValue, color: 'var(--color-error)' }}>
                            -{discountAmt.toFixed(0)} {egpLabel()}
                        </span>
                    </div>
                )}
                <div style={s.totalRow}>
                    <span>{t('bookings.total')}</span>
                    <span style={{ color: 'var(--color-primary-600)' }}>
                        {total.toFixed(0)} {egpLabel()}
                    </span>
                </div>

                {hasConflict && (
                    <div style={{ ...s.bannerWarn, margin: '0 0 var(--space-3)' }}>
                        <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>
                            {t('newBooking.resolveConflictsBefore').replace('{count}', String(conflicts.size / 2))}
                        </span>
                    </div>
                )}

                {!hideConfirm && (
                    <button
                        style={{ ...s.btnPrimary, opacity: hasConflict || submitting ? 0.6 : 1 }}
                        onClick={onConfirm}
                        disabled={submitting}
                    >
                        <Check size={16} /> {submitting ? '...' : (submitLabel ?? t('bookings.confirmBooking'))}
                    </button>
                )}
            </div>

            {/* Assigned staff card */}
            <div style={{ ...s.card, marginTop: 'var(--space-4)' }}>
                <div
                    style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        marginBottom: 'var(--space-3)',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                    }}
                >
                    <UserCog size={15} /> {t('newBooking.assignedStaff')}
                </div>
                {uniqueStaff.map(emp => (
                    <div
                        key={emp.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            marginBottom: 'var(--space-2)',
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 'var(--radius-full)',
                                background: emp.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: 11,
                                fontWeight: 'bold',
                                flexShrink: 0,
                            }}
                        >
                            {emp.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')
                                .slice(0, 2)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                {emp.name}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{emp.role}</div>
                        </div>
                        <span
                            style={{
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-medium)',
                                color: 'var(--color-primary-500)',
                            }}
                        >
                            {items.filter(i => i.employee.id === emp.id).length}×
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
