'use client';

import { egpLabel } from '@/lib/money';
import React, { useState, useEffect } from 'react';
import { Coins, Save, Plus, Trash2, Edit, MapPin, Users, UserCog, Building2, Search } from 'lucide-react';
import { Button, Input, Select, Modal, Badge, useToast } from '@/components/ui';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import type { ServicePriceOverride } from '@/lib/priceResolver';
import { providerApi } from '@/lib/api';

// ─── Data types ───────────────────────────────────────────────────────

interface ServiceItem {
    id: string;
    name: string;
    category: string;
    price: number;
}
interface BranchItem {
    id: string;
    name: string;
}
interface EmployeeItem {
    id: string;
    name: string;
    role: string;
    level: string;
    branch: string;
}

// ─── Fallback Mock Data ───────────────────────────────────────────────

const fallbackServices: ServiceItem[] = [
    { id: '1', name: 'Hair Cut & Style', category: 'Hair', price: 120 },
    { id: '2', name: 'Hair Coloring', category: 'Hair', price: 450 },
    { id: '3', name: 'Keratin Treatment', category: 'Hair', price: 800 },
    { id: '4', name: 'Manicure', category: 'Nails', price: 150 },
    { id: '5', name: 'Pedicure', category: 'Nails', price: 180 },
    { id: '6', name: 'HydraFacial', category: 'Skin', price: 600 },
];

const fallbackBranches: BranchItem[] = [
    { id: '1', name: 'Downtown Branch' },
    { id: '2', name: 'Mall of Arabia' },
    { id: '3', name: 'New Cairo Branch' },
];

const fallbackEmployees: EmployeeItem[] = [
    { id: 'E001', name: 'Sarah Ahmed', role: 'Senior Stylist', level: 'Senior', branch: '1' },
    { id: 'E002', name: 'Nora Ali', role: 'Junior Stylist', level: 'Junior', branch: '1' },
    { id: 'E003', name: 'Mona Zein', role: 'Nail Technician', level: 'Mid', branch: '2' },
    { id: 'E004', name: 'Layla Hassan', role: 'Skin Specialist', level: 'Senior', branch: '2' },
    { id: 'E005', name: 'Hana Youssef', role: 'Esthetician', level: 'Mid', branch: '3' },
];

const tiers = ['Senior', 'Mid', 'Junior', 'Entry']; // GAP: tiers map to pricing_groups in API, but API groups have free-form names

const fallbackOverrides: ServicePriceOverride[] = [
    { id: 'bo-1', serviceId: '1', branchId: '2', price: 140 },
    { id: 'to-1', serviceId: '1', pricingTier: 'Senior', price: 150 },
    { id: 'to-2', serviceId: '1', pricingTier: 'Junior', price: 100 },
    { id: 'to-3', serviceId: '2', pricingTier: 'Senior', price: 500 },
    { id: 'eo-1', serviceId: '2', employeeId: 'E001', price: 520 },
    { id: 'bt-1', serviceId: '1', branchId: '2', pricingTier: 'Senior', price: 170 },
];

// ─── Component ───────────────────────────────────────────────────────

export default function ServicePricingPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();

    const [services, setServices] = useState<ServiceItem[]>(fallbackServices);
    const [branches, setBranches] = useState<BranchItem[]>(fallbackBranches);
    const [employees, setEmployees] = useState<EmployeeItem[]>(fallbackEmployees);
    const [activeTab, setActiveTab] = useState<'branch' | 'tier' | 'employee'>('branch');
    const [overrides, setOverrides] = useState<ServicePriceOverride[]>(fallbackOverrides);
    const [search, setSearch] = useState('');
    // True once the live API has supplied real data — gates write-back so we never
    // POST against fallback (mock) uuids.
    const [apiAvailable, setApiAvailable] = useState(false);

    // ── Branch Tab State ──
    const [selectedBranchId, setSelectedBranchId] = useState('');

    // Fetch real data from API
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [svcRes, brRes, empRes, spRes] = await Promise.allSettled([
                    providerApi.getServices(),
                    providerApi.getBranches(),
                    providerApi.getEmployees(),
                    providerApi.getServicePrices(),
                ]);
                if (cancelled) return;

                if (svcRes.status === 'fulfilled' && svcRes.value.success && svcRes.value.data?.length) {
                    setServices(
                        svcRes.value.data.map(s => ({
                            id: s.uuid,
                            name: s.name,
                            category: s.sub_category?.name || 'Uncategorized',
                            price: 0,
                        }))
                    );
                }
                if (brRes.status === 'fulfilled' && brRes.value.success && brRes.value.data?.length) {
                    const br = brRes.value.data.map(b => ({ id: b.uuid, name: b.name }));
                    setBranches(br);
                    setSelectedBranchId(prev => prev || br[0].id);
                }
                if (empRes.status === 'fulfilled' && empRes.value.success && empRes.value.data?.length) {
                    setEmployees(
                        empRes.value.data.map(e => ({
                            id: e.uuid,
                            name: e.name,
                            role: 'Staff',
                            level: 'Mid',
                            branch: e.branch_uuid,
                        }))
                    );
                }
                if (spRes.status === 'fulfilled' && spRes.value.success && spRes.value.data?.length) {
                    setOverrides(
                        spRes.value.data.map(sp => ({
                            id: sp.uuid,
                            serviceId: sp.service_uuid,
                            branchId: sp.branch_uuid || undefined,
                            employeeId: sp.employee_uuid || undefined,
                            pricingTier: sp.pricing_group?.name || undefined,
                            price: sp.price,
                        }))
                    );
                }
                // Any successful fetch means we're online with real data — enable write-back.
                if ([svcRes, brRes, empRes, spRes].some(r => r.status === 'fulfilled' && r.value.success)) {
                    setApiAvailable(true);
                }
            } catch {
                /* keep fallback */
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

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

    // ── Write-back (best-effort; optimistic local state is always applied first) ──
    // Server records carry ULID uuids (26 chars, no hyphen); local-only rows use ids
    // like `ovr-…`/`eo-…`, so this tells a persisted override from an unsaved one.
    const isApiId = (id: string) => /^[0-9A-Za-z]{20,}$/.test(id);

    const persistCreate = async (tempId: string, payload: Record<string, unknown>) => {
        if (!apiAvailable) return;
        try {
            const res = await providerApi.createServicePrice(payload);
            const uuid = res.data?.uuid;
            // Swap the temp id for the server uuid so later edits/deletes target the record.
            if (uuid) setOverrides(prev => prev.map(o => (o.id === tempId ? { ...o, id: uuid } : o)));
        } catch {
            /* API unreachable / rejected — optimistic local override stands */
        }
    };
    const persistUpdate = async (id: string, price: number) => {
        if (!apiAvailable || !isApiId(id)) return;
        try {
            await providerApi.updateServicePrice(id, { price });
        } catch {
            /* keep optimistic local */
        }
    };
    const persistDelete = async (id: string) => {
        if (!apiAvailable || !isApiId(id)) return;
        try {
            await providerApi.deleteServicePrice(id);
        } catch {
            /* keep optimistic local */
        }
    };

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
        // eslint-disable-next-line react-hooks/purity -- runs in an event handler, not during render
        const newId = `ovr-${Date.now()}`;

        // Persistence side-effect derived from current state (optimistic update follows).
        const existing = overrides.find(
            o =>
                o.serviceId === serviceId &&
                (o.branchId || undefined) === (opts.branchId || undefined) &&
                (o.pricingTier || undefined) === (opts.pricingTier || undefined) &&
                (o.employeeId || undefined) === (opts.employeeId || undefined)
        );
        if (!value || isNaN(numVal)) {
            if (existing) persistDelete(existing.id);
        } else if (existing) {
            persistUpdate(existing.id, numVal);
        } else if (!opts.pricingTier && (opts.branchId || opts.employeeId)) {
            // Pure branch/employee scope maps cleanly to a service-price record. Tier
            // overrides map to pricing groups (free-form) and stay local — see `tiers`.
            const scope = opts.branchId ? { branch_uuid: opts.branchId } : { employee_uuid: opts.employeeId };
            persistCreate(newId, { service_uuid: serviceId, price: numVal, ...scope });
        }

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
                    id: newId,
                    serviceId,
                    ...opts,
                    price: numVal,
                },
            ];
        });
    };

    const removeOverride = (id: string) => {
        persistDelete(id);
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
            persistUpdate(editingOverrideId, numVal);
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
            const newId = `eo-${Date.now()}`;
            persistCreate(newId, {
                service_uuid: formOverride.serviceId,
                price: numVal,
                employee_uuid: formOverride.employeeId,
                ...(formOverride.branchId && { branch_uuid: formOverride.branchId }),
            });
            setOverrides(prev => [
                ...prev,
                {
                    id: newId,
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
                            style={{
                                position: 'absolute',
                                insetInlineStart: 10,
                                top: 10,
                                color: 'var(--text-tertiary)',
                            }}
                        />
                        <Input
                            placeholder={t('servicePricing.searchPh')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingInlineStart: 32, width: 200 }}
                        />
                    </div>
                    <Button onClick={handleSave}>
                        <Save size={16} /> {t('servicePricing.save')}
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
                                            {service.price} {egpLabel()}
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
                                            {service.price} {egpLabel()}
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
                                            {t('servicePricing.emptyOverrides')}
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
                                                    {service?.price ?? '—'} {egpLabel()}
                                                </td>
                                                <td
                                                    style={{
                                                        textAlign: 'center',
                                                        fontWeight: 'var(--font-semibold)',
                                                        color: 'var(--color-primary-600)',
                                                    }}
                                                >
                                                    {o.price} {egpLabel()}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                        <button
                                                            className={styles.btnIcon}
                                                            onClick={() => openEditModal(o)}
                                                            title={t('servicePricing.editTooltip')}
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            className={styles.btnIcon}
                                                            onClick={() => removeOverride(o.id)}
                                                            title={t('servicePricing.deleteTooltip')}
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
                title={editingOverrideId ? t('servicePricing.editOverride') : t('servicePricing.addOverride')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                            {t('servicePricing.cancel')}
                        </Button>
                        <Button onClick={handleSaveOverride}>{t('servicePricing.save')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div>
                        <Select
                            label={t('servicePricing.service')}
                            options={[
                                { label: t('servicePricing.selectService'), value: '' },
                                ...services.map(s => ({ label: `${s.name} (${s.price} ${egpLabel()})`, value: s.id })),
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
                                        {t('servicePricing.basePrice')}:{' '}
                                        <strong>
                                            {selectedService.price} {egpLabel()}
                                        </strong>
                                    </div>
                                ) : null;
                            })()}
                    </div>
                    <Select
                        label={t('servicePricing.employee')}
                        options={[
                            { label: t('servicePricing.selectEmployee'), value: '' },
                            ...employees.map(e => ({ label: `${e.name} (${e.role})`, value: e.id })),
                        ]}
                        value={formOverride.employeeId}
                        onChange={e => setFormOverride(prev => ({ ...prev, employeeId: e.target.value }))}
                    />
                    <Select
                        label={`${t('servicePricing.branch')} (${t('servicePricing.optional')})`}
                        options={[
                            { label: t('servicePricing.allBranches'), value: '' },
                            ...branches.map(b => ({ label: b.name, value: b.id })),
                        ]}
                        value={formOverride.branchId}
                        onChange={e => setFormOverride(prev => ({ ...prev, branchId: e.target.value }))}
                    />
                    <div>
                        <Input
                            label={`${t('servicePricing.price')} (${egpLabel()})`}
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
                                        {diff} {egpLabel()} {t('servicePricing.vsBasePrice')}
                                    </div>
                                );
                            })()}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
