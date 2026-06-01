'use client';

import React, { useState } from 'react';
import { Plus, Package, Check, Users, Edit, Trash2, MoreVertical, Eye } from 'lucide-react';
import { useToast, SlideOver, Modal, Input, Button, DropdownMenu, Select, Badge } from '@/components/ui';

import MarketingTabs from '@/components/MarketingTabs';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { marketingApi } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

const fallbackPackages = [
    {
        id: 1,
        name: 'Summer Glow Campaign',
        price: 899,
        originalPrice: 1200,
        services: ['Body Scrub', 'Spray Tan', 'Gel Nails', 'Lash Lift'],
        target: 'New Clients',
        active: true,
        sold: 15,
        color: '#F59E0B',
        description:
            'A complete glow-up package for the summer season. Perfect for new clients looking to try multiple services.',
    },
    {
        id: 2,
        name: 'Refer-a-Friend Bundle',
        price: 599,
        originalPrice: 800,
        services: ['Any Facial', 'Classic Manicure', 'Blow Dry'],
        target: 'Referral Program',
        active: true,
        sold: 28,
        color: '#10B981',
        description: 'Reward your referrals with this curated bundle of our most popular services.',
    },
    {
        id: 3,
        name: 'Birthday Special',
        price: 750,
        originalPrice: 1050,
        services: ['Full Styling', 'Makeup', 'Nail Art', 'Photo Shoot'],
        target: 'Birthday Month',
        active: true,
        sold: 12,
        color: '#EC4899',
        description: 'Make their birthday extra special with styling, makeup, and a professional photo shoot.',
    },
    {
        id: 4,
        name: 'Corporate Wellness',
        price: 450,
        originalPrice: 600,
        services: ['Chair Massage', 'Mini Facial', 'Express Mani'],
        target: 'Corporate Partners',
        active: false,
        sold: 0,
        color: '#3B82F6',
        description: 'Quick wellness sessions designed for busy professionals. Ideal for corporate partner programs.',
    },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    addBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-5)',
        background: 'var(--color-primary-500)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-semibold)',
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    cardHead: { padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        flexShrink: 0,
    },
    name: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    price: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' },
    target: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    services: { padding: '0 var(--space-5) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 6 },
    svcItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) var(--space-5)',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
    },
    // Detail styles
    detailSection: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    detailHeader: { display: 'flex', alignItems: 'center', gap: 'var(--space-4)' },
    detailIcon: {
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        flexShrink: 0,
    },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' },
    infoCard: { background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' },
    infoLabel: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 'var(--space-1)',
    },
    infoValue: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
    sectionTitle: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
};

export default function MarketingPackagesPage() {
    const { addToast } = useToast();
    const { t } = useTranslation();
    const { loading, error, refetch } = useApiQuery(() => marketingApi.getPackages() as never, [], {
        fallbackData: fallbackPackages,
    });
    // Use mock data until backend API is available
    const packages = fallbackPackages;
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<(typeof packages)[0] | null>(null);

    const openDetail = (pkg: (typeof packages)[0]) => {
        setSelectedPackage(pkg);
        setIsDetailOpen(true);
    };
    const openEdit = (pkg: (typeof packages)[0]) => {
        setSelectedPackage(pkg);
        setIsDetailOpen(false);
        setIsEditOpen(true);
    };
    const openDelete = (pkg: (typeof packages)[0]) => {
        setSelectedPackage(pkg);
        setIsDetailOpen(false);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        try {
            if (selectedPackage?.id && typeof selectedPackage.id === 'string') {
                await marketingApi.deletePackage(selectedPackage.id);
            }
            refetch();
        } catch {
            /* fallback */
        }
        setIsDeleteOpen(false);
        setSelectedPackage(null);
        addToast('success', t('mkt.lblDeletePackage'));
    };

    return (
        <div style={s.page}>
            <MarketingTabs />
            <div style={s.toolbar}>
                <button style={s.addBtn} onClick={() => setIsAddOpen(true)}>
                    <Plus size={16} /> {t('mkt.btnNewPackage')}
                </button>
            </div>
            <DataGuard
                loading={loading}
                error={error}
                data={packages}
                emptyIcon={<Package size={48} />}
                emptyTitle={t('mkt.lblNoPackages') || 'No Packages'}
                emptyDescription={t('mkt.msgNoPackagesDesc') || 'Create your first promotional package.'}
                emptyAction={
                    <button style={s.addBtn} onClick={() => setIsAddOpen(true)}>
                        <Plus size={16} /> {t('mkt.btnNewPackage')}
                    </button>
                }
                onRetry={refetch}
            >
                <div style={s.grid}>
                    {packages.map(pkg => (
                        <div
                            key={pkg.id}
                            style={{ ...s.card, opacity: pkg.active ? 1 : 0.6 }}
                            onClick={() => openDetail(pkg)}
                        >
                            <div style={s.cardHead}>
                                <div style={{ ...s.icon, background: pkg.color }}>
                                    <Package size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={s.name}>{pkg.name}</div>
                                    <div style={s.price}>
                                        {pkg.price} {t('mkt.lblEGP')}
                                    </div>
                                    <div style={s.target}>
                                        {t('mkt.lblTarget')} {pkg.target}
                                    </div>
                                </div>
                                <div style={{ marginLeft: 'auto' }} onClick={e => e.stopPropagation()}>
                                    <DropdownMenu
                                        trigger={
                                            <button
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: 'var(--text-tertiary)',
                                                }}
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        }
                                        items={[
                                            {
                                                label: t('bk.actionView'),
                                                icon: <Eye size={14} />,
                                                onClick: () => openDetail(pkg),
                                            },
                                            {
                                                label: t('mkt.lblEditPackage'),
                                                icon: <Edit size={14} />,
                                                onClick: () => openEdit(pkg),
                                            },
                                            {
                                                label: t('mkt.lblDeletePackage'),
                                                destructive: true,
                                                icon: <Trash2 size={14} />,
                                                onClick: () => openDelete(pkg),
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                            <div style={s.services as React.CSSProperties}>
                                {pkg.services.map((svc, i) => (
                                    <div key={i} style={s.svcItem}>
                                        <Check size={14} style={{ color: 'var(--color-success)' }} /> {svc}
                                    </div>
                                ))}
                            </div>
                            <div style={s.footer}>
                                <span>
                                    <Users size={12} style={{ display: 'inline', marginRight: 4 }} /> {pkg.sold}{' '}
                                    {t('mkt.lblSold')}
                                </span>
                                <span>{pkg.active ? `🟢 ${t('mkt.lblActive')}` : `⚪ ${t('mkt.lblInactive')}`}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </DataGuard>

            {/* Detail SlideOver */}
            <SlideOver
                open={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedPackage(null);
                }}
                title={t('mkt.lblPackageDetails')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => openDelete(selectedPackage!)}>
                            <Trash2 size={14} /> {t('mkt.btnDeletePackage')}
                        </Button>
                        <Button onClick={() => openEdit(selectedPackage!)}>
                            <Edit size={14} /> {t('bk.btnEdit')}
                        </Button>
                    </div>
                }
            >
                {selectedPackage && (
                    <div style={s.detailSection as React.CSSProperties}>
                        <div style={s.detailHeader as React.CSSProperties}>
                            <div style={{ ...s.detailIcon, background: selectedPackage.color }}>
                                <Package size={24} />
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: 'var(--text-xl)',
                                        fontWeight: 'var(--font-bold)',
                                        marginBottom: 'var(--space-1)',
                                    }}
                                >
                                    {selectedPackage.name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <span
                                        style={{
                                            fontSize: 'var(--text-2xl)',
                                            fontWeight: 'var(--font-bold)',
                                            color: 'var(--color-primary-600)',
                                        }}
                                    >
                                        {selectedPackage.price} {t('mkt.lblEGP')}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--text-tertiary)',
                                            textDecoration: 'line-through',
                                        }}
                                    >
                                        {selectedPackage.originalPrice} {t('mkt.lblEGP')}
                                    </span>
                                    <Badge color={selectedPackage.active ? 'success' : 'neutral'} size="sm">
                                        {selectedPackage.active ? t('mkt.lblActive') : t('mkt.lblInactive')}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {selectedPackage.description}
                        </div>

                        <div style={s.infoGrid as React.CSSProperties}>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblTargetAudience')}</div>
                                <div style={s.infoValue}>{selectedPackage.target}</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblTotalSold')}</div>
                                <div style={s.infoValue}>
                                    {selectedPackage.sold} {t('mkt.lblPackages')}
                                </div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblRevenueGenerated')}</div>
                                <div style={s.infoValue}>
                                    {(selectedPackage.sold * selectedPackage.price).toLocaleString()} {t('mkt.lblEGP')}
                                </div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblSavingsPerPackage')}</div>
                                <div style={s.infoValue}>
                                    {selectedPackage.originalPrice - selectedPackage.price} {t('mkt.lblEGP')} (
                                    {Math.round((1 - selectedPackage.price / selectedPackage.originalPrice) * 100)}%{' '}
                                    {t('mkt.lblOFF').toLowerCase()})
                                </div>
                            </div>
                        </div>

                        <div>
                            <div style={{ ...(s.sectionTitle as React.CSSProperties), marginBottom: 'var(--space-3)' }}>
                                {t('mkt.lblIncludedServices')} ({selectedPackage.services.length})
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {selectedPackage.services.map((svc: string, i: number) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-3)',
                                            padding: 'var(--space-3)',
                                            background: 'var(--bg-secondary)',
                                            borderRadius: 'var(--radius-lg)',
                                        }}
                                    >
                                        <Check size={16} style={{ color: 'var(--color-success)' }} />
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                            {svc}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* Add Package SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('mkt.lblCreateNewPackage')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('rtn.btnBack')}
                        </Button>
                        <Button
                            onClick={() => {
                                setIsAddOpen(false);
                                addToast('success', t('mkt.btnSavePackage'));
                            }}
                        >
                            {t('mkt.btnSavePackage')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('mkt.lblPackageName')} placeholder={t('mkt.phPackageName')} />
                    <Input label={t('mkt.lblDescription')} placeholder={t('mkt.phBriefDescription')} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <Input label={t('mkt.lblPrice')} type="number" placeholder="0.00" />
                        <Input label={t('mkt.lblOriginalPrice')} type="number" placeholder="0.00" />
                    </div>
                    <Input label={t('mkt.lblTargetAudience')} placeholder={t('mkt.phTargetAudience')} />
                    <Select
                        label={t('mkt.lblStatus')}
                        options={[
                            { label: t('mkt.lblActive'), value: 'active' },
                            { label: t('mkt.lblDraft'), value: 'draft' },
                        ]}
                    />
                </div>
            </SlideOver>

            {/* Edit Package SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedPackage(null);
                }}
                title={t('mkt.lblEditPackage')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('rtn.btnBack')}
                        </Button>
                        <Button
                            onClick={() => {
                                setIsEditOpen(false);
                                addToast('success', t('settings.saveChanges'));
                            }}
                        >
                            {t('settings.saveChanges')}
                        </Button>
                    </div>
                }
            >
                {selectedPackage && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label={t('mkt.lblPackageName')} defaultValue={selectedPackage.name} />
                        <Input label={t('mkt.lblDescription')} defaultValue={selectedPackage.description} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                            <Input label={t('mkt.lblPrice')} type="number" defaultValue={selectedPackage.price} />
                            <Input
                                label={t('mkt.lblOriginalPrice')}
                                type="number"
                                defaultValue={selectedPackage.originalPrice}
                            />
                        </div>
                        <Input label={t('mkt.lblTargetAudience')} defaultValue={selectedPackage.target} />
                        <Select
                            label={t('mkt.lblStatus')}
                            defaultValue={selectedPackage.active ? 'active' : 'draft'}
                            options={[
                                { label: t('mkt.lblActive'), value: 'active' },
                                { label: t('mkt.lblDraft'), value: 'draft' },
                            ]}
                        />
                    </div>
                )}
            </SlideOver>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedPackage(null);
                }}
                title={t('mkt.lblDeletePackage')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('rtn.btnBack')}
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            {t('mkt.lblDeletePackage')}
                        </Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    {t('mkt.msgDeletePackageConfirm')} <strong>{selectedPackage?.name}</strong>
                </p>
            </Modal>
        </div>
    );
}
