'use client';

import { egpLabel } from '@/lib/money';
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi, type InvoiceSettings } from '@/lib/api';
import { useToast } from '@/components/ui';

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', maxWidth: 700 },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
    },
    section: { marginBottom: 'var(--space-6)' },
    sectionTitle: {
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--font-semibold)',
        marginBottom: 'var(--space-4)',
        paddingBottom: 'var(--space-2)',
        borderBottom: '1px solid var(--border-color)',
    },
    row: { display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' },
    label: { flex: '0 0 160px', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' },
    input: {
        flex: 1,
        height: 40,
        padding: '0 var(--space-4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
    },
    select: {
        flex: 1,
        height: 40,
        padding: '0 var(--space-4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
    },
    textarea: {
        flex: 1,
        minHeight: 60,
        padding: 'var(--space-3) var(--space-4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        resize: 'vertical' as const,
    },
    saveBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-6)',
        background: 'var(--color-primary-500)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        fontWeight: 'var(--font-semibold)',
        fontSize: 'var(--text-sm)',
    },
};

const fallbackInvoice: InvoiceSettings = {
    business_name: 'Waqty Beauty Center',
    business_address: '15 Tahrir Street, Cairo',
    tax_number: '123-456-789',
    invoice_prefix: 'INV-',
    next_number: 2043,
    tax_rate: 14,
    notes: 'Thank you for choosing Waqty Beauty Center! We look forward to seeing you again.',
    logo_url: null,
};

export default function InvoiceSettingsPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();

    const {
        data: invoiceSettings,
        loading,
        refetch,
    } = useApiQuery<InvoiceSettings>(() => settingsApi.getInvoiceSettings(), [], { fallbackData: fallbackInvoice });

    const [formOverride, setFormOverride] = useState<InvoiceSettings | null>(null);
    const form = formOverride ?? invoiceSettings ?? fallbackInvoice;
    const setForm = setFormOverride;
    // Phone + currency aren't part of the InvoiceSettings contract type, so they live
    // in local state (were previously uncontrolled inputs whose values were dropped).
    const [phone, setPhone] = useState('+20 2 2345 6789');
    const [currency, setCurrency] = useState('EGP');

    const handleSave = async () => {
        try {
            await settingsApi.updateInvoiceSettings({
                ...(form as unknown as Record<string, unknown>),
                phone,
                currency,
            });
            addToast('success', t('settings.invoice.saved'));
            refetch();
        } catch {
            addToast('error', t('settings.invoice.saveFailed'));
        }
    };

    return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={s.section}>
                    <div style={s.sectionTitle}>{t('settings.invoice.businessInfo')}</div>
                    <div style={s.row}>
                        <div style={s.label}>{t('settings.invoice.businessName')}</div>
                        <input
                            style={s.input}
                            value={form.business_name}
                            onChange={e => setForm({ ...form, business_name: e.target.value })}
                        />
                    </div>
                    <div style={s.row}>
                        <div style={s.label}>{t('settings.invoice.taxNumber')}</div>
                        <input
                            style={s.input}
                            value={form.tax_number || ''}
                            onChange={e => setForm({ ...form, tax_number: e.target.value })}
                        />
                    </div>
                    <div style={s.row}>
                        <div style={s.label}>{t('settings.invoice.address')}</div>
                        <input
                            style={s.input}
                            value={form.business_address}
                            onChange={e => setForm({ ...form, business_address: e.target.value })}
                        />
                    </div>
                    <div style={s.row}>
                        <div style={s.label}>{t('settings.invoice.phone')}</div>
                        <input style={s.input} value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                </div>

                <div style={s.section}>
                    <div style={s.sectionTitle}>{t('settings.invoice.formatTitle')}</div>
                    <div style={s.row}>
                        <div style={s.label}>{t('settings.invoice.prefix')}</div>
                        <input
                            style={s.input}
                            value={form.invoice_prefix}
                            onChange={e => setForm({ ...form, invoice_prefix: e.target.value })}
                        />
                    </div>
                    <div style={s.row}>
                        <div style={s.label}>{t('settings.invoice.nextNumber')}</div>
                        <input
                            style={s.input}
                            value={form.next_number}
                            onChange={e => setForm({ ...form, next_number: parseInt(e.target.value) || 0 })}
                            type="number"
                        />
                    </div>
                    <div style={s.row}>
                        <div style={s.label}>{t('settings.invoice.taxRate')}</div>
                        <input
                            style={s.input}
                            value={form.tax_rate}
                            onChange={e => setForm({ ...form, tax_rate: parseFloat(e.target.value) || 0 })}
                            type="number"
                        />
                    </div>
                    <div style={s.row}>
                        <div style={s.label}>{t('settings.invoice.currency')}</div>
                        <select style={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                            <option value="EGP">{egpLabel()}</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="SAR">SAR</option>
                        </select>
                    </div>
                </div>

                <div style={s.section}>
                    <div style={s.sectionTitle}>{t('settings.invoice.footerTitle')}</div>
                    <div style={s.row}>
                        <textarea
                            style={s.textarea}
                            value={form.notes || ''}
                            onChange={e => setForm({ ...form, notes: e.target.value })}
                        />
                    </div>
                </div>

                <button style={s.saveBtn} onClick={handleSave}>
                    <Save size={16} /> {t('settings.invoice.saveSettings')}
                </button>
            </div>
        </div>
    );
}
