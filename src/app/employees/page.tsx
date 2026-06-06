'use client';

import React, { useState, useEffect } from 'react';
import { Search, Users, MoreVertical, Edit, Trash2, Mail, Copy, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import type { UseFormReturn } from 'react-hook-form';
import {
    EmptyState,
    DropdownMenu,
    useToast,
    SlideOver,
    Modal,
    Input,
    Select,
    Button,
    ConfirmDialog,
    Skeleton,
} from '@/components/ui';
import { useRouter } from 'next/navigation';
import styles from './employees.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { useApiQuery } from '@/hooks/useApiQuery';
import { providerApi, toInternationalPhone, getImageUrl, type Employee } from '@/lib/api';

const AVATAR_COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EF4444', '#14B8A6'];

interface EmpRow {
    id: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    branch: string;
    status: string;
    bookingsToday: number;
    rating: number;
    revenue: number;
    avatar: string;
    color: string;
    appAccess: boolean;
}

function mapApiEmployee(emp: Employee, index: number): EmpRow {
    const avatar = emp.name
        .split(' ')
        .map(p => p.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    return {
        id: emp.uuid,
        name: emp.name,
        role: 'Staff', // GAP: API has no role/jobTitle field
        phone: emp.phone,
        email: emp.email,
        branch: emp.branch?.name || 'Unassigned',
        status: emp.active ? 'available' : 'off',
        bookingsToday: 0, // GAP: API has no bookings count
        rating: 0, // GAP: API has no rating
        revenue: 0, // GAP: API has no revenue
        avatar,
        color: AVATAR_COLORS[index % AVATAR_COLORS.length],
        appAccess: !emp.blocked,
    };
}

const fallbackEmployees: EmpRow[] = [
    {
        id: 'E001',
        name: 'Sara Ahmed',
        role: 'Senior Stylist',
        phone: '+20 123 456 789',
        email: 'sara.a@waqty.com',
        branch: 'Downtown',
        status: 'available',
        bookingsToday: 7,
        rating: 4.9,
        revenue: 14200,
        avatar: 'SA',
        color: '#8B5CF6',
        appAccess: true,
    },
    {
        id: 'E002',
        name: 'Nora Ali',
        role: 'Skin Specialist',
        phone: '+20 111 222 333',
        email: 'nora.a@waqty.com',
        branch: 'Downtown',
        status: 'in-session',
        bookingsToday: 6,
        rating: 4.8,
        revenue: 12800,
        avatar: 'NA',
        color: '#EC4899',
        appAccess: true,
    },
    {
        id: 'E003',
        name: 'Layla Hassan',
        role: 'Senior Therapist',
        phone: '+20 100 200 300',
        email: 'layla.h@waqty.com',
        branch: 'Downtown',
        status: 'available',
        bookingsToday: 8,
        rating: 4.9,
        revenue: 11500,
        avatar: 'LH',
        color: '#3B82F6',
        appAccess: false,
    },
    {
        id: 'E004',
        name: 'Reem Mohamed',
        role: 'Massage Therapist',
        phone: '+20 155 666 777',
        email: 'reem.m@waqty.com',
        branch: 'Downtown',
        status: 'break',
        bookingsToday: 5,
        rating: 4.7,
        revenue: 9800,
        avatar: 'RM',
        color: '#10B981',
        appAccess: true,
    },
    {
        id: 'E005',
        name: 'Hana Youssef',
        role: 'Nail Technician',
        phone: '+20 199 888 999',
        email: 'hana.y@waqty.com',
        branch: 'Downtown',
        status: 'available',
        bookingsToday: 4,
        rating: 4.6,
        revenue: 8100,
        avatar: 'HY',
        color: '#F59E0B',
        appAccess: false,
    },
    {
        id: 'E006',
        name: 'Dina Kamal',
        role: 'Junior Stylist',
        phone: '+20 144 555 666',
        email: 'dina.k@waqty.com',
        branch: 'Mall of Arabia',
        status: 'off',
        bookingsToday: 0,
        rating: 4.5,
        revenue: 5400,
        avatar: 'DK',
        color: '#6366F1',
        appAccess: false,
    },
];

const statusMap: Record<string, { labelKey: string; bg: string; color: string }> = {
    available: { labelKey: 'employees.available', bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    'in-session': { labelKey: 'employees.inSession', bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    break: { labelKey: 'employees.onBreak', bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    off: { labelKey: 'employees.dayOff', bg: 'var(--color-gray-100)', color: 'var(--color-gray-500)' },
};

const JOB_TITLES = ['Senior Stylist', 'Junior Stylist', 'Skin Specialist', 'Massage Therapist', 'Nail Technician'];

// ── Validation ──
const employeeSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.union([z.string().email('Enter a valid email'), z.literal('')]).optional(),
    phone: z.string().optional(),
    jobTitle: z.string().optional(),
    branch: z.string().optional(),
    password: z
        .string()
        .optional()
        .refine(v => !v || v.length >= 6, { message: 'At least 6 characters' }),
});
type EmployeeFormValues = z.infer<typeof employeeSchema>;

const EMPTY_EMP: EmployeeFormValues = {
    name: '',
    email: '',
    phone: '',
    jobTitle: 'Junior Stylist',
    branch: '',
    password: '',
};

function EmployeeForm({
    form,
    mode,
    branches,
}: {
    form: UseFormReturn<EmployeeFormValues>;
    mode: 'create' | 'edit';
    branches: { uuid: string; name: string }[];
}) {
    const {
        register,
        formState: { errors },
    } = form;
    const { t } = useTranslation();

    const branchOptions =
        branches.length > 0
            ? [
                  { label: t('employees.selectBranch'), value: '' },
                  ...branches.map(b => ({ label: b.name, value: b.uuid })),
              ]
            : [
                  { label: t('employees.selectBranch'), value: '' },
                  { label: t('employees.downtown'), value: 'Downtown' },
                  { label: t('employees.mall'), value: 'Mall of Arabia' },
                  { label: t('employees.newCairo'), value: 'New Cairo' },
              ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
                label={t('employees.fullName')}
                placeholder="e.g. Sara Ahmed"
                {...register('name')}
                error={errors.name?.message}
            />
            <Input
                label={t('employees.emailOption')}
                type="email"
                placeholder="employee@waqty.com"
                {...register('email')}
                error={errors.email?.message}
            />
            <Input label={t('employees.phoneOption')} placeholder="+20 1XX XXX XXXX" {...register('phone')} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <Select
                    label={t('employees.jobTitle')}
                    {...register('jobTitle')}
                    options={JOB_TITLES.map(j => ({ label: j, value: j }))}
                />
                <Select label={t('employees.branch')} {...register('branch')} options={branchOptions} />
            </div>
            {mode === 'create' && (
                <Input
                    label={t('employees.password')}
                    type="password"
                    placeholder={t('employees.passwordPh')}
                    {...register('password')}
                    error={errors.password?.message}
                />
            )}
        </div>
    );
}

export default function EmployeesPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const { t } = useTranslation();

    const {
        data: apiEmployees,
        loading,
        error,
        refetch,
    } = useApiQuery<Employee[]>(() => providerApi.getEmployees(), []);
    const [empList, setEmpList] = useState<EmpRow[]>(fallbackEmployees);
    useEffect(() => {
        if (apiEmployees) setEmpList(apiEmployees.map(mapApiEmployee));
    }, [apiEmployees]);
    const apiAvailable = !!apiEmployees && !error;
    const usingSample = !loading && !apiAvailable;

    const [branches, setBranches] = useState<{ uuid: string; name: string }[]>([]);
    useEffect(() => {
        providerApi
            .getBranches()
            .then(res => {
                if (res.success && res.data) setBranches(res.data.map(b => ({ uuid: b.uuid, name: b.name })));
            })
            .catch(() => {});
    }, []);

    const [search, setSearch] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState<EmpRow | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [inviteData, setInviteData] = useState({ phoneOrEmail: '', role: 'staff' });
    const [magicLink, setMagicLink] = useState('');

    const form = useValidatedForm<EmployeeFormValues>({ schema: employeeSchema, defaultValues: EMPTY_EMP });

    const openAdd = () => {
        form.reset(EMPTY_EMP);
        setIsAddOpen(true);
    };
    const openEdit = (e: EmpRow) => {
        setSelectedEmp(e);
        form.reset({ name: e.name, email: e.email, phone: e.phone, jobTitle: e.role, branch: e.branch, password: '' });
        setIsEditOpen(true);
    };

    useEffect(() => {
        const handleOpenAdd = () => openAdd();
        window.addEventListener('openAddEmployee', handleOpenAdd);
        return () => window.removeEventListener('openAddEmployee', handleOpenAdd);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = empList.filter(
        e => e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase())
    );

    // Derive top metrics from the actual employees list (was hardcoded 0).
    const metrics = {
        total: empList.length,
        available: empList.filter(e => e.status === 'available').length,
        onShift: empList.filter(e => e.status !== 'off').length,
    };

    const onCreate = form.handleSubmit(async v => {
        if (!v.password) {
            form.setError('password', { message: t('employees.passwordRequired') });
            return;
        }
        if (apiAvailable) {
            try {
                const payload: Record<string, unknown> = {
                    name: v.name,
                    email: v.email || undefined,
                    phone: v.phone ? toInternationalPhone(v.phone) : undefined,
                    password: v.password,
                    password_confirmation: v.password,
                };
                if (v.branch) payload.branch_uuid = v.branch;
                await providerApi.createEmployee(payload);
                addToast('success', t('employees.toastAddSuccess'));
                setIsAddOpen(false);
                refetch();
            } catch (err: unknown) {
                addToast('error', (err as { message?: string })?.message || t('employees.toastAddFail'));
            }
        } else {
            const avatar = v.name
                .split(' ')
                .map(p => p.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2);
            setEmpList(prev => [
                ...prev,
                {
                    id: `E${Date.now()}`,
                    name: v.name,
                    role: v.jobTitle || 'Staff',
                    phone: v.phone || '',
                    email: v.email || '',
                    branch: v.branch || '',
                    status: 'off',
                    bookingsToday: 0,
                    rating: 0,
                    revenue: 0,
                    avatar,
                    color: AVATAR_COLORS[prev.length % AVATAR_COLORS.length],
                    appAccess: false,
                },
            ]);
            addToast('success', t('employees.toastAddSuccess'));
            setIsAddOpen(false);
        }
    });

    const onUpdate = form.handleSubmit(async v => {
        if (apiAvailable && selectedEmp) {
            try {
                const payload: Record<string, unknown> = {
                    name: v.name,
                    email: v.email || undefined,
                    phone: v.phone ? toInternationalPhone(v.phone) : undefined,
                };
                if (v.branch) payload.branch_uuid = v.branch;
                await providerApi.updateEmployee(selectedEmp.id, payload);
                addToast('success', t('employees.toastUpdated'));
                setIsEditOpen(false);
                refetch();
            } catch (err: unknown) {
                addToast('error', (err as { message?: string })?.message || t('employees.toastUpdateFail'));
            }
        } else {
            setEmpList(prev =>
                prev.map(e =>
                    e.id === selectedEmp?.id
                        ? {
                              ...e,
                              name: v.name,
                              email: v.email || '',
                              phone: v.phone || '',
                              role: v.jobTitle || e.role,
                              branch: v.branch || e.branch,
                          }
                        : e
                )
            );
            addToast('success', t('employees.toastUpdated'));
            setIsEditOpen(false);
        }
    });

    const onDelete = async () => {
        if (!selectedEmp) return;
        setDeleting(true);
        if (apiAvailable) {
            try {
                await providerApi.deleteEmployee(selectedEmp.id);
                addToast('success', t('employees.toastRemoveSuccess'));
                refetch();
            } catch (err: unknown) {
                addToast('error', (err as { message?: string })?.message || t('employees.toastRemoveFail'));
            }
        } else {
            setEmpList(prev => prev.filter(e => e.id !== selectedEmp.id));
            addToast('success', t('employees.toastRemoveSecure'));
        }
        setDeleting(false);
        setIsDeleteOpen(false);
        setSelectedEmp(null);
    };

    const handleInvite = () => {
        if (!inviteData.phoneOrEmail) return addToast('error', t('employees.toastContactReq'));
        const token = Math.random().toString(36).substring(7);
        setMagicLink(`${window.location.origin}/invite/${token}`);
        addToast('success', t('employees.toastInviteGenerated'));
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(magicLink);
        addToast('success', t('employees.toastLinkCopied'));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {usingSample && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--color-warning-light)',
                        color: 'var(--color-warning)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                    }}
                >
                    <AlertCircle size={16} /> {t('common.sampleData')}
                </div>
            )}

            {/* Top metric cards — derived from the actual employees list */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-4)',
                }}
            >
                {[
                    { label: t('employees.totalTeam'), value: metrics.total, color: 'var(--color-primary-600)' },
                    { label: t('employees.available'), value: metrics.available, color: 'var(--color-success)' },
                    { label: t('employees.onShift'), value: metrics.onShift, color: 'var(--color-info)' },
                ].map(card => (
                    <div
                        key={card.label}
                        style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-5)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-4)',
                        }}
                    >
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--bg-secondary)',
                                color: card.color,
                            }}
                        >
                            <Users size={22} />
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: 'var(--font-bold)',
                                    color: card.color,
                                }}
                            >
                                {card.value}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                                {card.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                }}
            >
                <div style={{ position: 'relative', maxWidth: '320px', width: '100%' }}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder={t('employees.search')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsInviteOpen(true);
                            setMagicLink('');
                            setInviteData({ phoneOrEmail: '', role: 'staff' });
                        }}
                    >
                        <Mail size={16} style={{ marginInlineEnd: 'var(--space-2)' }} />
                        {t('employees.inviteStaff')}
                    </Button>
                    <Button onClick={openAdd}>{t('employees.addEmployeeTitle')}</Button>
                </div>
            </div>

            {loading ? (
                <div className={styles.grid}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} variant="card" height={220} />
                    ))}
                </div>
            ) : filtered.length > 0 ? (
                <div className={styles.grid}>
                    {filtered.map(emp => {
                        const st = statusMap[emp.status] ?? statusMap.off;
                        return (
                            <div
                                key={emp.id}
                                className={styles.card}
                                onClick={() => router.push(`/employees/${emp.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={styles.cardTop}>
                                    <div className={styles.userInfo}>
                                        <div
                                            className={styles.avatar}
                                            style={{ background: emp.color, overflow: 'hidden', position: 'relative' }}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={getImageUrl('employees', emp.id)}
                                                alt={emp.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    position: 'absolute',
                                                    inset: 0,
                                                }}
                                                onError={e => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                            <span>{emp.avatar}</span>
                                        </div>
                                        <div>
                                            <div className={styles.name}>{emp.name}</div>
                                            <div className={styles.role}>{emp.role}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <span
                                            className={styles.statusBadge}
                                            style={{ background: st.bg, color: st.color }}
                                        >
                                            {t(st.labelKey)}
                                        </span>
                                        <div onClick={e => e.stopPropagation()}>
                                            <DropdownMenu
                                                trigger={
                                                    <button className={styles.actionBtn}>
                                                        <MoreVertical size={16} />
                                                    </button>
                                                }
                                                items={[
                                                    {
                                                        label: t('employees.viewSchedule'),
                                                        icon: <Users size={14} />,
                                                        onClick: () => router.push(`/employees/${emp.id}`),
                                                    },
                                                    {
                                                        label: t('employees.edit'),
                                                        icon: <Edit size={14} />,
                                                        onClick: () => openEdit(emp),
                                                    },
                                                    {
                                                        label: t('employees.delete'),
                                                        destructive: true,
                                                        icon: <Trash2 size={14} />,
                                                        onClick: () => {
                                                            setSelectedEmp(emp);
                                                            setIsDeleteOpen(true);
                                                        },
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.contactInfo}>
                                    {emp.branch} Branch • {emp.phone}
                                </div>
                                <div className={styles.statsRow}>
                                    <div className={styles.statItem}>
                                        <div className={styles.statVal}>{emp.bookingsToday}</div>
                                        <div className={styles.statLabel}>{t('employees.today')}</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statVal} style={{ color: '#F59E0B' }}>
                                            ★ {emp.rating}
                                        </div>
                                        <div className={styles.statLabel}>{t('employees.rating')}</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statVal} style={{ color: 'var(--color-primary-600)' }}>
                                            {(emp.revenue / 1000).toFixed(1)}K
                                        </div>
                                        <div className={styles.statLabel}>{t('employees.revenue')}</div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        marginTop: 'var(--space-3)',
                                        paddingTop: 'var(--space-3)',
                                        borderTop: '1px solid var(--border-color)',
                                    }}
                                >
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            padding: '2px 8px',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: 11,
                                            fontWeight: 600,
                                            background: emp.appAccess
                                                ? 'var(--color-success-light)'
                                                : 'var(--color-gray-100)',
                                            color: emp.appAccess ? 'var(--color-success)' : 'var(--color-gray-500)',
                                        }}
                                    >
                                        {emp.appAccess
                                            ? `● ${t('employees.appAccessActive')}`
                                            : `○ ${t('employees.appAccessNotConfigured')}`}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ padding: 'var(--space-12) 0' }}>
                    <EmptyState
                        icon={<Users size={32} color="var(--text-tertiary)" />}
                        title={t('employees.noEmployeesFound')}
                        description={t('employees.noEmployeesDesc')}
                        action={<Button onClick={openAdd}>{t('employees.addEmployeeTitle')}</Button>}
                    />
                </div>
            )}

            {/* Add Employee */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('employees.addEmployeeTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('employees.cancel')}
                        </Button>
                        <Button onClick={onCreate} loading={form.formState.isSubmitting}>
                            {t('employees.saveEmployee')}
                        </Button>
                    </div>
                }
            >
                <EmployeeForm form={form} mode="create" branches={branches} />
            </SlideOver>

            {/* Edit Employee */}
            <SlideOver
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedEmp(null);
                }}
                title={t('employees.editEmployeeTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('employees.cancel')}
                        </Button>
                        <Button onClick={onUpdate} loading={form.formState.isSubmitting}>
                            {t('employees.saveChanges')}
                        </Button>
                    </div>
                }
            >
                <EmployeeForm form={form} mode="edit" branches={branches} />
            </SlideOver>

            {/* Delete confirmation */}
            <ConfirmDialog
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedEmp(null);
                }}
                onConfirm={onDelete}
                title={t('employees.deleteEmployeeTitle')}
                message={
                    <>
                        <strong>{selectedEmp?.name}</strong> — {t('employees.deleteWarning')}
                    </>
                }
                confirmLabel={t('employees.confirmRemoval')}
                variant="danger"
                loading={deleting}
            />

            {/* Invite Staff Modal */}
            <Modal
                open={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                title={t('employees.inviteModalTitle')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsInviteOpen(false)}>
                            {t('employees.cancel')}
                        </Button>
                        {!magicLink && <Button onClick={handleInvite}>{t('employees.generateInvite')}</Button>}
                        {magicLink && <Button onClick={() => setIsInviteOpen(false)}>{t('employees.done')}</Button>}
                    </div>
                }
            >
                {!magicLink ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <p
                            style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-secondary)',
                                marginBottom: 'var(--space-2)',
                            }}
                        >
                            {t('employees.inviteIntro')}
                        </p>
                        <Input
                            label={t('employees.phoneOrEmail')}
                            placeholder="e.g. +20 100..."
                            value={inviteData.phoneOrEmail}
                            onChange={e => setInviteData({ ...inviteData, phoneOrEmail: e.target.value })}
                        />
                        <Select
                            label={t('employees.inviteSystemRole')}
                            value={inviteData.role}
                            onChange={e => setInviteData({ ...inviteData, role: e.target.value })}
                            options={[
                                { label: t('employees.roleStaff'), value: 'staff' },
                                { label: t('employees.roleManager'), value: 'manager' },
                            ]}
                        />
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-4)',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: 'var(--space-4) 0',
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                background: 'var(--color-success-light)',
                                color: 'var(--color-success)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 'var(--space-2)',
                            }}
                        >
                            <Mail size={24} />
                        </div>
                        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{t('employees.inviteReady')}</h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                            {t('employees.inviteShare')}
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--space-2)',
                                width: '100%',
                                marginTop: 'var(--space-2)',
                            }}
                        >
                            <Input
                                value={magicLink}
                                readOnly
                                style={{ flex: 1, backgroundColor: 'var(--bg-secondary)' }}
                            />
                            <Button
                                variant="secondary"
                                onClick={handleCopyLink}
                                title={t('employees.copyLink')}
                                style={{ padding: '0 12px' }}
                            >
                                <Copy size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
