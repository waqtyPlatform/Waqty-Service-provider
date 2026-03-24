'use client';

import React, { useState } from 'react';
import { Coins, Save, Plus, Trash2, Edit, MapPin, Users, UserCog, Building2, Search } from 'lucide-react';
import { Button, Input, Select, Modal, Badge, useToast } from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import type { ServicePriceOverride } from '@/lib/priceResolver';

// ─── Mock Data ───────────────────────────────────────────────────────

const services = [
    { id: '1', name: 'Hair Cut & Style', category: 'Hair', price: 120 },
    { id: '2', name: 'Hair Coloring', category: 'Hair', price: 450 },
    { id: '3', name: 'Keratin Treatment', category: 'Hair', price: 800 },
    { id: '4', name: 'Manicure', category: 'Nails', price: 150 },
    { id: '5', name: 'Pedicure', category: 'Nails', price: 180 },
    { id: '6', name: 'HydraFacial', category: 'Skin', price: 600 },
];

const branches = [
    { id: '1', name: 'Downtown Branch' },
    { id: '2', name: 'Mall of Arabia' },
    { id: '3', name: 'New Cairo Branch' },
];

const tiers = ['Senior', 'Mid', 'Junior', 'Entry'];

const employees = [
    { id: 'E001', name: 'Sarah Ahmed', role: 'Senior Stylist', level: 'Senior', branch: '1' },
    { id: 'E002', name: 'Nora Ali', role: 'Junior Stylist', level: 'Junior', branch: '1' },
    { id: 'E003', name: 'Mona Zein', role: 'Nail Technician', level: 'Mid', branch: '2' },
    { id: 'E004', name: 'Layla Hassan', role: 'Skin Specialist', level: 'Senior', branch: '2' },
    { id: 'E005', name: 'Hana Youssef', role: 'Esthetician', level: 'Mid', branch: '3' },
];

const initialOverrides: ServicePriceOverride[] = [
    // Branch overrides
    { id: 'bo-1', serviceId: '1', branchId: '2', price: 140 },
    // Tier overrides
    { id: 'to-1', serviceId: '1', pricingTier: 'Senior', price: 150 },
    { id: 'to-2', serviceId: '1', pricingTier: 'Junior', price: 100 },
    { id: 'to-3', serviceId: '2', pricingTier: 'Senior', price: 500 },
    // Employee overrides
    { id: 'eo-1', serviceId: '2', employeeId: 'E001', price: 520 },
    // Branch + Tier
    { id: 'bt-1', serviceId: '1', branchId: '2', pricingTier: 'Senior', price: 170 },
];

// ─── Component ───────────────────────────────────────────────────────

export default function ServicePricingPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();

    const [activeTab, setActiveTab] = useState<'branch' | 'tier' | 'employee'>('branch');
    const [overrides, setOverrides] = useState<ServicePriceOverride[]>(initialOverrides);
    const [search, setSearch] = useState('');

    // ── Branch Tab State ──
    const [selectedBranchId, setSelectedBranchId] = useState(branches[0].id);

    // ── Tier Tab State ──
    const [tierBranchFilter, setTierBranchFilter] = useState('');

    // ── Employee Tab State ──
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOverrideId, setEditingOverrideId] = useState<string | null>(null);
    const [formOverride, setFormOverride] = useState({ serviceId: '', employeeId: '', branchId: '', price: '' });

    const tabs = [
        { key: 'branch' as const, label: t('servicePricing.tabBranch'), icon: <Building2 size={15} /> },
        { key: 'tier' as const, label: t('servicePricing.tabTier'), icon: <Users size={15} /> },
        { key: 'employee' as const, label: t('servicePricing.tabEmployee'), icon: <UserCog size={15} /> },
    ];

    const filteredServices = services.filter(
        s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.category.toLowerCase().includes(search.toLowerCase())
    );

    // ── Helpers ──

    const getOverridePrice = (
        serviceId: string,
        opts: { branchId?: string; pricingTier?: string; employeeId?: string }
    ): string => {
        const match = overrides.find(
            o =>
                o.serviceId === serviceId &&
                (o.branchId || undefined) === (opts.branchId || undefined) &&
                (o.pricingTier || undefined) === (opts.pricingTier || undefined) &&
                (o.employeeId || undefined) === (opts.employeeId || undefined)
        );
        return match ? String(match.price) : '';
    };

    const setOverridePrice = (
        serviceId: string,
        opts: { branchId?: string; pricingTier?: string; employeeId?: string },
        value: string
    ) => {
        const numVal = parseFloat(value);
        setOverrides(prev => {
            const idx = prev.findIndex(
                o =>
                    o.serviceId === serviceId &&
                    (o.branchId || undefined) === (opts.branchId || undefined) &&
                    (o.pricingTier || undefined) === (opts.pricingTier || undefined) &&
                    (o.employeeId || undefined) === (opts.employeeId || undefined)
            );

            if (!value || isNaN(numVal)) {
                // Remove override if empty
                if (idx >= 0) return prev.filter((_, i) => i !== idx);
                return prev;
            }

            if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], price: numVal };
                return updated;
            }

            // Add new override
            return [
                ...prev,
                {
                    id: `ovr-${Date.now()}`,
                    serviceId,
                    ...opts,
                    price: numVal,
                },
            ];
        });
    };

    const removeOverride = (id: string) => {
        setOverrides(prev => prev.filter(o => o.id !== id));
        addToast('success', t('servicePricing.deleted'));
    };

    const handleSave = () => {
        addToast('success', t('servicePricing.saved'));
    };

    const openAddModal = () => {
        setEditingOverrideId(null);
        setFormOverride({ serviceId: '', employeeId: '', branchId: '', price: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (o: ServicePriceOverride) => {
        setEditingOverrideId(o.id);
        setFormOverride({
            serviceId: o.serviceId,
            employeeId: o.employeeId ?? '',
            branchId: o.branchId ?? '',
            price: String(o.price),
        });
        setIsModalOpen(true);
    };

    const handleSaveOverride = () => {
        if (!formOverride.serviceId || !formOverride.employeeId || !formOverride.price) return;
        const numVal = parseFloat(formOverride.price);
        if (isNaN(numVal) || numVal < 0) return;

        if (editingOverrideId) {
            // Update existing
            setOverrides(prev =>
                prev.map(o =>
                    o.id === editingOverrideId
                        ? {
                              ...o,
                              serviceId: formOverride.serviceId,
                              employeeId: formOverride.employeeId,
                              branchId: formOverride.branchId || undefined,
                              price: numVal,
                          }
                        : o
                )
            );
        } else {
            // Add new
            setOverrides(prev => [
                ...prev,
                {
                    id: `eo-${Date.now()}`,
                    serviceId: formOverride.serviceId,
                    employeeId: formOverride.employeeId,
                    branchId: formOverride.branchId || undefined,
                    price: numVal,
                },
            ]);
        }
        setFormOverride({ serviceId: '', employeeId: '', branchId: '', price: '' });
        setEditingOverrideId(null);
        setIsModalOpen(false);
        addToast('success', t('servicePricing.saved'));
    };

    // ── Employee overrides list ──
    const employeeOverrides = overrides.filter(o => o.employeeId && !o.pricingTier);

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>
                        <Coins size={24} /> {t('servicePricing.title')}
                    </h1>
                    <div className={styles.subtitle}>{t('servicePricing.desc')}</div>
                </div>
                <div className={styles.actions}>
                    <div style={{ position: 'relative' }}>
                        <Search
                            size={16}
                            style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-tertiary)' }}
                        />
                        <Input
                            placeholder="Search services..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: 32, width: 200 }}
                        />
                    </div>
                    <Button onClick={handleSave}>
                        <Save size={16} /> Save
                    </Button>
                </div>
            </div>

            {/* Tab Bar */}
            <div className={styles.tabBar}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Branch Pricing Tab ── */}
            {activeTab === 'branch' && (
                <div className={styles.card}>
                    <div className={styles.filterBar}>
                        <MapPin size={16} style={{ color: 'var(--text-secondary)' }} />
                        <Select
                            options={branches.map(b => ({ label: b.name, value: b.id }))}
                            value={selectedBranchId}
                            onChange={e => setSelectedBranchId(e.target.value)}
                            style={{ width: 220 }}
                        />
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40%' }}>{t('servicePricing.service')}</th>
                                    <th style={{ textAlign: 'center' }}>{t('servicePricing.basePrice')}</th>
                                    <th style={{ textAlign: 'center' }}>
                                        {t('servicePricing.branch')} {t('servicePricing.override')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.map(service => (
                                    <tr key={service.id}>
                                        <td>
                                            <div style={{ fontWeight: 'var(--font-medium)' }}>{service.name}</div>
                                            <Badge color="neutral" size="sm" style={{ marginTop: 4 }}>
                                                {service.category}
                                            </Badge>
                                        </td>
                                        <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            {service.price} EGP
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input
                                                className={styles.priceInput}
                                                type="number"
                                                min="0"
                                                placeholder="—"
                                                value={getOverridePrice(service.id, { branchId: selectedBranchId })}
                                                onChange={e =>
                                                    setOverridePrice(
                                                        service.id,
                                                        { branchId: selectedBranchId },
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Tier Pricing Tab ── */}
            {activeTab === 'tier' && (
                <div className={styles.card}>
                    <div className={styles.filterBar}>
                        <MapPin size={16} style={{ color: 'var(--text-secondary)' }} />
                        <Select
                            options={[
                                { label: t('servicePricing.allBranches'), value: '' },
                                ...branches.map(b => ({ label: b.name, value: b.id })),
                            ]}
                            value={tierBranchFilter}
                            onChange={e => setTierBranchFilter(e.target.value)}
                            style={{ width: 220 }}
                        />
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '30%' }}>{t('servicePricing.service')}</th>
                                    <th style={{ textAlign: 'center' }}>{t('servicePricing.basePrice')}</th>
                                    {tiers.map(tier => (
                                        <th key={tier} style={{ textAlign: 'center' }}>
                                            {tier}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.map(service => (
                                    <tr key={service.id}>
                                        <td>
                                            <div style={{ fontWeight: 'var(--font-medium)' }}>{service.name}</div>
                                            <Badge color="neutral" size="sm" style={{ marginTop: 4 }}>
                                                {service.category}
                                            </Badge>
                                        </td>
                                        <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            {service.price} EGP
                                        </td>
                                        {tiers.map(tier => (
                                            <td key={tier} style={{ textAlign: 'center' }}>
                                                <input
                                                    className={styles.priceInput}
                                                    type="number"
                                                    min="0"
                                                    placeholder="—"
                                                    value={getOverridePrice(service.id, {
                                                        pricingTier: tier,
                                                        branchId: tierBranchFilter || undefined,
                                                    })}
                                                    onChange={e =>
                                                        setOverridePrice(
                                                            service.id,
                                                            {
                                                                pricingTier: tier,
                                                                branchId: tierBranchFilter || undefined,
                                                            },
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Employee Pricing Tab ── */}
            {activeTab === 'employee' && (
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>
                            <UserCog size={18} /> {t('servicePricing.tabEmployee')}
                        </span>
                        <Button size="sm" onClick={openAddModal}>
                            <Plus size={14} /> {t('servicePricing.addOverride')}
                        </Button>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('servicePricing.service')}</th>
                                    <th>{t('servicePricing.employee')}</th>
                                    <th>{t('servicePricing.branch')}</th>
                                    <th style={{ textAlign: 'center' }}>{t('servicePricing.basePrice')}</th>
                                    <th style={{ textAlign: 'center' }}>{t('servicePricing.override')}</th>
                                    <th style={{ width: 80 }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeOverrides.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className={styles.emptyRow}>
                                            No employee price overrides yet. Click &quot;Add Override&quot; to create
                                            one.
                                        </td>
                                    </tr>
                                ) : (
                                    employeeOverrides.map(o => {
                                        const service = services.find(s => s.id === o.serviceId);
                                        const emp = employees.find(e => e.id === o.employeeId);
                                        const branch = o.branchId ? branches.find(b => b.id === o.branchId) : null;
                                        return (
                                            <tr key={o.id}>
                                                <td>
                                                    <div style={{ fontWeight: 'var(--font-medium)' }}>
                                                        {service?.name ?? o.serviceId}
                                                    </div>
                                                    {service && (
                                                        <Badge color="neutral" size="sm" style={{ marginTop: 4 }}>
                                                            {service.category}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    <div>{emp?.name ?? o.employeeId}</div>
                                                    {emp && (
                                                        <span
                                                            style={{
                                                                fontSize: 'var(--text-xs)',
                                                                color: 'var(--text-secondary)',
                                                            }}
                                                        >
                                                            {emp.role}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {branch ? (
                                                        branch.name
                                                    ) : (
                                                        <span style={{ color: 'var(--text-tertiary)' }}>
                                                            {t('servicePricing.allBranches')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                    {service?.price ?? '—'} EGP
                                                </td>
                                                <td
                                                    style={{
                                                        textAlign: 'center',
                                                        fontWeight: 'var(--font-semibold)',
                                                        color: 'var(--color-primary-600)',
                                                    }}
                                                >
                                                    {o.price} EGP
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                        <button
                                                            className={styles.btnIcon}
                                                            onClick={() => openEditModal(o)}
                                                            title="Edit"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            className={styles.btnIcon}
                                                            onClick={() => removeOverride(o.id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Add/Edit Employee Override Modal ── */}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingOverrideId ? 'Edit Override' : t('servicePricing.addOverride')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveOverride}>Save</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div>
                        <Select
                            label={t('servicePricing.service')}
                            options={[
                                { label: '— Select Service —', value: '' },
                                ...services.map(s => ({ label: `${s.name} (${s.price} EGP)`, value: s.id })),
                            ]}
                            value={formOverride.serviceId}
                            onChange={e => setFormOverride(prev => ({ ...prev, serviceId: e.target.value }))}
                        />
                        {formOverride.serviceId &&
                            (() => {
                                const selectedService = services.find(s => s.id === formOverride.serviceId);
                                return selectedService ? (
                                    <div
                                        style={{
                                            marginTop: 'var(--space-2)',
                                            padding: 'var(--space-2) var(--space-3)',
                                            background: 'var(--color-primary-50)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-primary-600)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                        }}
                                    >
                                        <Coins size={12} />
                                        {t('servicePricing.basePrice')}: <strong>{selectedService.price} EGP</strong>
                                    </div>
                                ) : null;
                            })()}
                    </div>
                    <Select
                        label={t('servicePricing.employee')}
                        options={[
                            { label: '— Select Employee —', value: '' },
                            ...employees.map(e => ({ label: `${e.name} (${e.role})`, value: e.id })),
                        ]}
                        value={formOverride.employeeId}
                        onChange={e => setFormOverride(prev => ({ ...prev, employeeId: e.target.value }))}
                    />
                    <Select
                        label={`${t('servicePricing.branch')} (optional)`}
                        options={[
                            { label: t('servicePricing.allBranches'), value: '' },
                            ...branches.map(b => ({ label: b.name, value: b.id })),
                        ]}
                        value={formOverride.branchId}
                        onChange={e => setFormOverride(prev => ({ ...prev, branchId: e.target.value }))}
                    />
                    <div>
                        <Input
                            label={`${t('servicePricing.price')} (EGP)`}
                            type="number"
                            min="0"
                            value={formOverride.price}
                            onChange={e => setFormOverride(prev => ({ ...prev, price: e.target.value }))}
                        />
                        {formOverride.serviceId &&
                            formOverride.price &&
                            (() => {
                                const selectedService = services.find(s => s.id === formOverride.serviceId);
                                if (!selectedService) return null;
                                const diff = parseFloat(formOverride.price) - selectedService.price;
                                if (isNaN(diff) || diff === 0) return null;
                                return (
                                    <div
                                        style={{
                                            marginTop: 'var(--space-1)',
                                            fontSize: 'var(--text-xs)',
                                            color: diff > 0 ? 'var(--color-warning)' : '#10b981',
                                        }}
                                    >
                                        {diff > 0 ? '+' : ''}
                                        {diff} EGP vs base price
                                    </div>
                                );
                            })()}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
