'use client';

import React, { useEffect, useState } from 'react';
import {
    Building2,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    MapPin,
    ExternalLink,
    Eye,
    EyeOff,
    KeyRound,
    Mail,
    Crown,
    AlertCircle,
} from 'lucide-react';
import { z } from 'zod';
import type { UseFormReturn } from 'react-hook-form';
import {
    useToast,
    SlideOver,
    Modal,
    Input,
    Select,
    Button,
    DropdownMenu,
    Switch,
    ConfirmDialog,
    Skeleton,
    EmptyState,
} from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { useApiQuery } from '@/hooks/useApiQuery';
import { providerApi, type Branch } from '@/lib/api';

const GOVERNORATES = [
    'Cairo',
    'Giza',
    'Alexandria',
    'Qalyubia',
    'Dakahlia',
    'Sharqia',
    'Gharbia',
    'Monufia',
    'Beheira',
    'Kafr El Sheikh',
    'Damietta',
    'Port Said',
    'Ismailia',
    'Suez',
    'North Sinai',
    'South Sinai',
    'Red Sea',
    'Matrouh',
    'Fayoum',
    'Beni Suef',
    'Minya',
    'Assiut',
    'Sohag',
    'Qena',
    'Luxor',
    'Aswan',
    'New Valley',
];

const CITIES: Record<string, string[]> = {
    Cairo: [
        'Nasr City',
        'Heliopolis',
        'Maadi',
        'Downtown',
        'Zamalek',
        'New Cairo',
        '6th of October',
        'Shubra',
        'Ain Shams',
    ],
    Giza: ['Dokki', 'Mohandessin', 'Haram', 'Faisal', '6th of October', 'Sheikh Zayed', 'Smart Village'],
    Alexandria: ['Montaza', 'Smouha', 'Sidi Gaber', 'Stanley', 'Mandara', 'Agami', 'Miami'],
};

interface BranchData {
    id: number;
    uuid?: string;
    name: string;
    governorate: string;
    city: string;
    address: string;
    mapLink: string;
    phone: string;
    manager: string;
    employees: number;
    status: 'active' | 'disabled';
    email: string;
    isMain: boolean;
}

function mapApiBranch(b: Branch, index: number): BranchData {
    return {
        id: index + 1,
        uuid: b.uuid,
        name: b.name,
        governorate: b.city?.name || '', // GAP: API has city_uuid/city object, no governorate
        city: b.city?.name || '', // GAP: API city is a UUID reference, not a string
        address: '', // GAP: API has no address field
        mapLink: b.latitude && b.longitude ? `https://maps.google.com/?q=${b.latitude},${b.longitude}` : '',
        phone: b.phone,
        manager: '', // GAP: API has no manager field
        employees: 0, // GAP: API has no employees count
        status: b.active ? 'active' : 'disabled',
        email: '', // GAP: API has no email field
        isMain: b.is_main,
    };
}

const fallbackBranches: BranchData[] = [
    {
        id: 1,
        name: 'Downtown Branch',
        governorate: 'Cairo',
        city: 'Downtown',
        address: '15 Tahrir Street',
        mapLink: 'https://maps.app.goo.gl/abc123',
        phone: '+20 2 2345 6789',
        manager: 'Sara Ahmed',
        employees: 6,
        status: 'active',
        email: 'downtown@business.com',
        isMain: true,
    },
    {
        id: 2,
        name: 'Mall of Arabia',
        governorate: 'Giza',
        city: '6th of October',
        address: 'Mall of Arabia, Gate 4',
        mapLink: 'https://maps.app.goo.gl/def456',
        phone: '+20 2 3456 7890',
        manager: 'Fatma Hosny',
        employees: 3,
        status: 'active',
        email: 'mallofarabia@business.com',
        isMain: false,
    },
    {
        id: 3,
        name: 'New Cairo Branch',
        governorate: 'Cairo',
        city: 'New Cairo',
        address: '5th Settlement, Street 90',
        mapLink: 'https://maps.app.goo.gl/ghi789',
        phone: '+20 2 4567 8901',
        manager: 'Amira Sayed',
        employees: 4,
        status: 'active',
        email: 'newcairo@business.com',
        isMain: false,
    },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    sampleBanner: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-warning-light)',
        color: 'var(--color-warning)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
    },
    toolbar: { display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-2)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--space-5)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-5)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
    },
    cardHead: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-primary-50)',
        color: 'var(--color-primary-600)',
    },
    name: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    badge: {
        display: 'inline-flex',
        padding: '2px var(--space-2)',
        borderRadius: 'var(--radius-full)',
        fontSize: 11,
        fontWeight: 'var(--font-semibold)',
        background: 'var(--color-success-light)',
        color: 'var(--color-success)',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: 'var(--space-2) 0',
        fontSize: 'var(--text-sm)',
        borderBottom: '1px solid var(--border-color)',
    },
    rowLast: { borderBottom: 'none' },
    label: { color: 'var(--text-tertiary)' },
    val: { fontWeight: 'var(--font-medium)', textAlign: 'end' as const, maxWidth: '60%' },
    mapLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        color: 'var(--color-primary-600)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        textDecoration: 'none',
    },
    sectionLabel: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        marginBottom: 'var(--space-2)',
        marginTop: 'var(--space-3)',
    },
    passwordWrapper: { position: 'relative' as const },
    passwordToggle: {
        position: 'absolute' as const,
        insetInlineEnd: 12,
        top: 34,
        background: 'none',
        border: 'none',
        color: 'var(--text-tertiary)',
        cursor: 'pointer',
        padding: 'var(--space-1)',
    },
    mainCard: { borderColor: 'var(--color-primary-300)', boxShadow: '0 0 0 1px var(--color-primary-200)' },
    disabledCard: { opacity: 0.6 },
    mainBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: '2px var(--space-2)',
        borderRadius: 'var(--radius-full)',
        fontSize: 11,
        fontWeight: 'var(--font-semibold)' as const,
        background: 'var(--color-primary-50)',
        color: 'var(--color-primary-600)',
    },
    disabledBadge: { background: 'var(--bg-tertiary, #f3f4f6)', color: 'var(--text-tertiary)' },
    toggleRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) 0',
        marginTop: 'var(--space-2)',
        borderTop: '1px solid var(--border-color)',
    },
};

// ── Validation schema ──
const branchSchema = z.object({
    name: z.string().trim().min(2, 'Branch name must be at least 2 characters'),
    phone: z.string().trim().min(7, 'Enter a valid phone number'),
    manager: z.string().optional(),
    governorate: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    mapLink: z.union([z.string().url('Enter a valid link'), z.literal('')]).optional(),
    email: z.union([z.string().email('Enter a valid email'), z.literal('')]).optional(),
});
type BranchFormValues = z.infer<typeof branchSchema>;

const EMPTY_BRANCH: BranchFormValues = {
    name: '',
    phone: '',
    manager: '',
    governorate: '',
    city: '',
    address: '',
    mapLink: '',
    email: '',
};

function BranchForm({ form }: { form: UseFormReturn<BranchFormValues> }) {
    const {
        register,
        watch,
        formState: { errors },
    } = form;
    const governorate = watch('governorate') || '';
    const cities = CITIES[governorate] || [];
    const { t } = useTranslation();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
                label={t('settings.branches.branchName')}
                placeholder={t('settings.branches.namePh')}
                {...register('name')}
                error={errors.name?.message}
            />
            <Input
                label={t('settings.branches.contactPhone')}
                placeholder="+20 1XX XXX XXXX"
                {...register('phone')}
                error={errors.phone?.message}
            />
            <Input
                label={t('settings.branches.managerName')}
                placeholder={t('settings.branches.managerPh')}
                {...register('manager')}
            />

            <div style={s.sectionLabel}>📍 {t('settings.branches.locDetails')}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <Select
                    label={t('settings.branches.governorate')}
                    {...register('governorate')}
                    options={[
                        { label: t('settings.branches.selGov'), value: '' },
                        ...GOVERNORATES.map(g => ({ label: g, value: g })),
                    ]}
                />
                <Select
                    label={t('settings.branches.city')}
                    {...register('city')}
                    options={
                        cities.length > 0
                            ? [
                                  { label: t('settings.branches.selCity'), value: '' },
                                  ...cities.map(c => ({ label: c, value: c })),
                              ]
                            : [{ label: t('settings.branches.selCityFirst'), value: '' }]
                    }
                />
            </div>

            <Input
                label={t('settings.branches.fullAddress')}
                placeholder={t('settings.branches.addressPh')}
                {...register('address')}
            />
            <Input
                label={t('settings.branches.mapsLink')}
                placeholder="https://maps.app.goo.gl/..."
                {...register('mapLink')}
                error={errors.mapLink?.message}
            />
            <Input
                label={t('settings.branches.branchEmail')}
                type="email"
                placeholder="branch@business.com"
                {...register('email')}
                error={errors.email?.message}
            />
        </div>
    );
}

export default function BranchesPage() {
    const { addToast } = useToast();
    const { t } = useTranslation();

    const { data: apiBranches, loading, error, refetch } = useApiQuery<Branch[]>(() => providerApi.getBranches(), []);
    const [branches, setBranches] = useState<BranchData[]>(fallbackBranches);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sync API data into local state on arrival
        if (apiBranches) setBranches(apiBranches.map(mapApiBranch));
    }, [apiBranches]);
    const apiAvailable = !!apiBranches && !error;
    const usingSample = !loading && !apiAvailable;

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);
    const [deleting, setDeleting] = useState(false);

    const form = useValidatedForm<BranchFormValues>({ schema: branchSchema, defaultValues: EMPTY_BRANCH });

    const openAdd = () => {
        form.reset(EMPTY_BRANCH);
        setIsAddOpen(true);
    };
    const openEdit = (b: BranchData) => {
        setSelectedBranch(b);
        form.reset({
            name: b.name,
            phone: b.phone,
            manager: b.manager,
            governorate: b.governorate,
            city: b.city,
            address: b.address,
            mapLink: b.mapLink,
            email: b.email,
        });
        setIsEditOpen(true);
    };

    const buildPayload = (v: BranchFormValues) => ({
        name: v.name,
        phone: v.phone,
        manager: v.manager,
        governorate: v.governorate,
        city: v.city,
        address: v.address,
        map_link: v.mapLink,
        email: v.email,
    });

    const onCreate = form.handleSubmit(async v => {
        if (apiAvailable) {
            try {
                await providerApi.createBranch(buildPayload(v));
                addToast('success', t('settings.branches.created'));
                setIsAddOpen(false);
                refetch();
            } catch (err: unknown) {
                addToast('error', (err as { message?: string })?.message || t('settings.branches.createFailed'));
            }
        } else {
            setBranches(prev => [
                ...prev,
                {
                    id: Math.max(0, ...prev.map(b => b.id)) + 1,
                    name: v.name,
                    governorate: v.governorate || '',
                    city: v.city || '',
                    address: v.address || '',
                    mapLink: v.mapLink || '',
                    phone: v.phone,
                    manager: v.manager || '',
                    employees: 0,
                    status: 'active',
                    email: v.email || '',
                    isMain: false,
                },
            ]);
            addToast('success', t('settings.branches.created'));
            setIsAddOpen(false);
        }
    });

    const onUpdate = form.handleSubmit(async v => {
        if (apiAvailable && selectedBranch?.uuid) {
            try {
                await providerApi.updateBranch(selectedBranch.uuid, buildPayload(v));
                addToast('success', t('settings.branches.updated'));
                setIsEditOpen(false);
                refetch();
            } catch (err: unknown) {
                addToast('error', (err as { message?: string })?.message || t('settings.branches.createFailed'));
            }
        } else {
            setBranches(prev =>
                prev.map(b =>
                    b.id === selectedBranch?.id
                        ? {
                              ...b,
                              name: v.name,
                              phone: v.phone,
                              manager: v.manager || '',
                              governorate: v.governorate || '',
                              city: v.city || '',
                              address: v.address || '',
                              mapLink: v.mapLink || '',
                              email: v.email || '',
                          }
                        : b
                )
            );
            addToast('success', t('settings.branches.updated'));
            setIsEditOpen(false);
        }
    });

    const handleToggleBranch = async (id: number) => {
        const branch = branches.find(b => b.id === id);
        if (!branch) return;
        const newStatus: 'active' | 'disabled' = branch.status === 'active' ? 'disabled' : 'active';
        setBranches(prev => prev.map(b => (b.id === id ? { ...b, status: newStatus } : b)));
        addToast(
            'success',
            t(newStatus === 'active' ? 'settings.branches.branchEnabled' : 'settings.branches.branchDisabled')
        );
        if (apiAvailable && branch.uuid) {
            try {
                await providerApi.updateBranch(branch.uuid, { active: newStatus === 'active' });
            } catch {
                setBranches(prev => prev.map(b => (b.id === id ? { ...b, status: branch.status } : b)));
                addToast('error', t('settings.branches.statusUpdateFailed'));
            }
        }
    };

    const onDelete = async () => {
        if (!selectedBranch) return;
        setDeleting(true);
        if (apiAvailable && selectedBranch.uuid) {
            try {
                await providerApi.deleteBranch(selectedBranch.uuid);
                addToast('success', t('settings.branches.deleted'));
                refetch();
            } catch (err: unknown) {
                addToast('error', (err as { message?: string })?.message || t('settings.branches.deleteFailed'));
            }
        } else {
            setBranches(prev => prev.filter(b => b.id !== selectedBranch.id));
            addToast('success', t('settings.branches.deleted'));
        }
        setDeleting(false);
        setIsDeleteOpen(false);
        setSelectedBranch(null);
    };

    // Reset-password flow (separate, already controlled)
    const [resetNewPassword, setResetNewPassword] = useState('');
    const [resetConfirmPassword, setResetConfirmPassword] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleResetPassword = () => {
        if (resetNewPassword.length < 6) {
            addToast('error', t('settings.branches.passwordTooShort'));
            return;
        }
        if (resetNewPassword !== resetConfirmPassword) {
            addToast('error', t('settings.branches.passwordsDoNotMatch'));
            return;
        }
        setIsResetPasswordOpen(false);
        setResetNewPassword('');
        setResetConfirmPassword('');
        setShowResetPassword(false);
        setShowResetConfirm(false);
        addToast('success', t('settings.branches.passwordResetSuccess'));
    };

    const closeResetModal = () => {
        setIsResetPasswordOpen(false);
        setSelectedBranch(null);
        setResetNewPassword('');
        setResetConfirmPassword('');
        setShowResetPassword(false);
        setShowResetConfirm(false);
    };

    return (
        <div style={s.page}>
            {usingSample && (
                <div style={s.sampleBanner}>
                    <AlertCircle size={16} /> {t('common.sampleData')}
                </div>
            )}

            <div style={s.toolbar}>
                <Button onClick={openAdd}>
                    <Plus size={16} style={{ marginInlineEnd: 'var(--space-2)' }} /> {t('settings.branches.addBranch')}
                </Button>
            </div>

            {loading ? (
                <div style={s.grid}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} variant="card" height={300} />
                    ))}
                </div>
            ) : branches.length === 0 ? (
                <EmptyState
                    icon={<Building2 size={40} />}
                    title={t('settings.branches.emptyTitle')}
                    description={t('settings.branches.emptyDesc')}
                    action={
                        <Button onClick={openAdd}>
                            <Plus size={16} style={{ marginInlineEnd: 'var(--space-2)' }} />{' '}
                            {t('settings.branches.addBranch')}
                        </Button>
                    }
                />
            ) : (
                <div style={s.grid}>
                    {branches.map(b => (
                        <div
                            key={b.id}
                            style={{
                                ...s.card,
                                ...(b.isMain ? s.mainCard : {}),
                                ...(b.status === 'disabled' ? s.disabledCard : {}),
                            }}
                        >
                            <div style={{ ...(s.cardHead as React.CSSProperties), justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                    <div
                                        style={{
                                            ...s.icon,
                                            ...(b.isMain
                                                ? {
                                                      background: 'var(--color-primary-100)',
                                                      color: 'var(--color-primary-700)',
                                                  }
                                                : {}),
                                        }}
                                    >
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <div style={s.name}>{b.name}</div>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 2 }}>
                                            {b.isMain && (
                                                <span style={s.mainBadge}>
                                                    <Crown size={10} /> {t('settings.branches.mainBranch')}
                                                </span>
                                            )}
                                            <span
                                                style={{
                                                    ...s.badge,
                                                    ...(b.status === 'disabled' ? s.disabledBadge : {}),
                                                }}
                                            >
                                                {t(
                                                    b.status === 'active'
                                                        ? 'settings.branches.active'
                                                        : 'settings.branches.disabled'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu
                                    trigger={
                                        <button
                                            aria-label={t('common.moreOptions')}
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
                                            label: t('settings.branches.editBranch'),
                                            icon: <Edit size={14} />,
                                            onClick: () => openEdit(b),
                                        },
                                        {
                                            label: t('settings.branches.resetPassword'),
                                            icon: <KeyRound size={14} />,
                                            onClick: () => {
                                                setSelectedBranch(b);
                                                setIsResetPasswordOpen(true);
                                            },
                                        },
                                        ...(!b.isMain
                                            ? [
                                                  {
                                                      label: t('settings.branches.deleteBranch'),
                                                      destructive: true,
                                                      icon: <Trash2 size={14} />,
                                                      onClick: () => {
                                                          setSelectedBranch(b);
                                                          setIsDeleteOpen(true);
                                                      },
                                                  },
                                              ]
                                            : []),
                                    ]}
                                />
                            </div>
                            <div style={s.row}>
                                <span style={s.label}>{t('settings.branches.governorate')}</span>
                                <span style={s.val}>{b.governorate}</span>
                            </div>
                            <div style={s.row}>
                                <span style={s.label}>{t('settings.branches.city')}</span>
                                <span style={s.val}>{b.city}</span>
                            </div>
                            <div style={s.row}>
                                <span style={s.label}>{t('settings.branches.address')}</span>
                                <span style={s.val}>{b.address}</span>
                            </div>
                            <div style={s.row}>
                                <span style={s.label}>{t('settings.branches.phone')}</span>
                                <span style={s.val}>{b.phone}</span>
                            </div>
                            <div style={s.row}>
                                <span style={s.label}>{t('settings.branches.email')}</span>
                                <span
                                    style={{
                                        ...s.val,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-1)',
                                    }}
                                >
                                    <Mail size={13} style={{ color: 'var(--text-tertiary)' }} /> {b.email}
                                </span>
                            </div>
                            <div style={s.row}>
                                <span style={s.label}>{t('settings.branches.manager')}</span>
                                <span style={s.val}>{b.manager}</span>
                            </div>
                            <div style={s.row}>
                                <span style={s.label}>{t('settings.branches.employees')}</span>
                                <span style={s.val}>{b.employees}</span>
                            </div>
                            <div style={{ ...s.row, ...s.rowLast }}>
                                <span style={s.label}>{t('settings.branches.location')}</span>
                                <a href={b.mapLink} target="_blank" rel="noopener noreferrer" style={s.mapLink}>
                                    <MapPin size={14} /> {t('settings.branches.viewMap')} <ExternalLink size={12} />
                                </a>
                            </div>
                            {!b.isMain && (
                                <div style={s.toggleRow}>
                                    <Switch
                                        checked={b.status === 'active'}
                                        onChange={() => handleToggleBranch(b.id)}
                                        label={t(
                                            b.status === 'active'
                                                ? 'settings.branches.active'
                                                : 'settings.branches.disabled'
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Branch */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('settings.branches.addNewBranch')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('settings.branches.cancel')}
                        </Button>
                        <Button onClick={onCreate} loading={form.formState.isSubmitting}>
                            {t('settings.branches.saveBranch')}
                        </Button>
                    </div>
                }
            >
                <BranchForm form={form} />
            </SlideOver>

            {/* Edit Branch */}
            <SlideOver
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedBranch(null);
                }}
                title={t('settings.branches.editBranch')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('settings.branches.cancel')}
                        </Button>
                        <Button onClick={onUpdate} loading={form.formState.isSubmitting}>
                            {t('settings.saveChanges')}
                        </Button>
                    </div>
                }
            >
                <BranchForm form={form} />
            </SlideOver>

            {/* Delete confirmation */}
            <ConfirmDialog
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedBranch(null);
                }}
                onConfirm={onDelete}
                title={t('settings.branches.deleteBranch')}
                message={t('settings.branches.deleteWarning')}
                confirmLabel={t('settings.branches.confirmDelete')}
                variant="danger"
                loading={deleting}
            />

            {/* Reset Password Modal */}
            <Modal
                open={isResetPasswordOpen}
                onClose={closeResetModal}
                title={t('settings.branches.resetPassword')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={closeResetModal}>
                            {t('settings.branches.cancel')}
                        </Button>
                        <Button onClick={handleResetPassword}>{t('settings.branches.resetPassword')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                        {t('settings.branches.resetPasswordFor')} <strong>{selectedBranch?.name}</strong>
                    </p>

                    <div style={s.passwordWrapper}>
                        <Input
                            label={t('settings.branches.newPassword')}
                            type={showResetPassword ? 'text' : 'password'}
                            placeholder={t('settings.branches.passwordMinPh')}
                            value={resetNewPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResetNewPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            style={s.passwordToggle}
                            onClick={() => setShowResetPassword(!showResetPassword)}
                            tabIndex={-1}
                        >
                            {showResetPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div style={s.passwordWrapper}>
                        <Input
                            label={t('settings.branches.confirmPassword')}
                            type={showResetConfirm ? 'text' : 'password'}
                            placeholder={t('settings.branches.confirmPasswordPh')}
                            value={resetConfirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setResetConfirmPassword(e.target.value)
                            }
                        />
                        <button
                            type="button"
                            style={s.passwordToggle}
                            onClick={() => setShowResetConfirm(!showResetConfirm)}
                            tabIndex={-1}
                        >
                            {showResetConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
