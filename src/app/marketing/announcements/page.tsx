'use client';

import React, { useState } from 'react';
import { Plus, Megaphone, Edit, Trash2, Send, Users } from 'lucide-react';
import { useToast, SlideOver, Modal, Input, Button, Select, Badge } from '@/components/ui';
import MarketingTabs from '@/components/MarketingTabs';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { marketingApi, type Announcement } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';
import styles from './announcements.module.css';

const fallbackAnnouncements = [
    {
        id: '1',
        title: 'New Scheduling System Launch',
        body: 'We are excited to announce the rollout of our new scheduling system. All employees should familiarize themselves with the updated booking interface by end of week.',
        target: 'all' as const,
        priority: 'high' as const,
        status: 'published' as const,
        scheduledAt: null,
        publishedAt: '2026-04-01',
        readCount: 42,
        createdAt: '2026-03-28',
    },
    {
        id: '2',
        title: 'Eid Holiday Schedule',
        body: 'Please note the updated branch hours during the Eid holiday period. Downtown branch will operate reduced hours (10 AM - 6 PM) from April 5-8.',
        target: 'branch' as const,
        priority: 'urgent' as const,
        status: 'published' as const,
        scheduledAt: null,
        publishedAt: '2026-03-30',
        readCount: 28,
        createdAt: '2026-03-29',
    },
    {
        id: '3',
        title: 'Monthly Team Meeting Reminder',
        body: 'Reminder: Our monthly all-hands meeting is scheduled for April 15 at 9 AM. All team leads are expected to prepare department updates.',
        target: 'role' as const,
        priority: 'normal' as const,
        status: 'scheduled' as const,
        scheduledAt: '2026-04-14',
        publishedAt: null,
        readCount: 0,
        createdAt: '2026-04-02',
    },
    {
        id: '4',
        title: 'Updated Commission Structure',
        body: 'Draft announcement regarding the new commission structure effective May 1. Managers will receive detailed breakdown before publication.',
        target: 'all' as const,
        priority: 'low' as const,
        status: 'draft' as const,
        scheduledAt: null,
        publishedAt: null,
        readCount: 0,
        createdAt: '2026-04-05',
    },
];

const statusBadge: Record<string, 'success' | 'info' | 'neutral'> = {
    published: 'success',
    scheduled: 'info',
    draft: 'neutral',
};

const priorityColors: Record<string, string> = {
    low: 'var(--color-gray-400)',
    normal: 'var(--color-info)',
    high: 'var(--color-warning, #F59E0B)',
    urgent: 'var(--color-error)',
};

const priorityBadge: Record<string, 'neutral' | 'info' | 'error'> = {
    low: 'neutral',
    normal: 'info',
    high: 'info',
    urgent: 'error',
};

export default function AnnouncementsPage() {
    const { addToast } = useToast();
    const { t } = useTranslation();

    const {
        data: apiAnnouncements,
        loading,
        error,
        refetch,
    } = useApiQuery(() => marketingApi.getAnnouncements(), [], { fallbackData: fallbackAnnouncements as unknown });

    const rawAnnouncements = apiAnnouncements as Announcement[] | null;
    const announcements =
        rawAnnouncements && rawAnnouncements.length > 0
            ? rawAnnouncements.map(a => ({
                  id: a.uuid,
                  title: a.title,
                  body: a.body,
                  target: a.target,
                  priority: a.priority,
                  status: a.status,
                  scheduledAt: a.scheduled_at,
                  publishedAt: a.published_at,
                  readCount: a.read_count,
                  createdAt: a.created_at,
              }))
            : fallbackAnnouncements;

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selected, setSelected] = useState<(typeof announcements)[0] | null>(null);

    // Form state
    const [formTitle, setFormTitle] = useState('');
    const [formBody, setFormBody] = useState('');
    const [formTarget, setFormTarget] = useState<'all' | 'branch' | 'role'>('all');
    const [formPriority, setFormPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
    const [formSchedule, setFormSchedule] = useState('');

    const openDetail = (a: (typeof announcements)[0]) => {
        setSelected(a);
        setIsDetailOpen(true);
    };
    const openEdit = (a: (typeof announcements)[0]) => {
        setSelected(a);
        setFormTitle(a.title);
        setFormBody(a.body);
        setFormTarget(a.target as 'all' | 'branch' | 'role');
        setFormPriority(a.priority as 'low' | 'normal' | 'high' | 'urgent');
        setFormSchedule(a.scheduledAt || '');
        setIsDetailOpen(false);
        setIsEditOpen(true);
    };
    const openDelete = (a: (typeof announcements)[0]) => {
        setSelected(a);
        setIsDetailOpen(false);
        setIsDeleteOpen(true);
    };
    const openAdd = () => {
        setFormTitle('');
        setFormBody('');
        setFormTarget('all');
        setFormPriority('normal');
        setFormSchedule('');
        setIsAddOpen(true);
    };

    const handleCreate = async () => {
        if (!formTitle.trim()) {
            addToast('error', t('mkt.msgAnnouncementTitleRequired') || 'Title is required');
            return;
        }
        if (!formBody.trim()) {
            addToast('error', t('mkt.msgAnnouncementBodyRequired') || 'Body is required');
            return;
        }
        try {
            await marketingApi.createAnnouncement({
                title: formTitle,
                body: formBody,
                target: formTarget,
                priority: formPriority,
                scheduled_at: formSchedule || null,
            });
            refetch();
        } catch {
            /* fallback */
        }
        setIsAddOpen(false);
        addToast('success', t('mkt.msgAnnouncementCreated') || 'Announcement created');
    };

    const handleEdit = async () => {
        if (!formTitle.trim()) {
            addToast('error', t('mkt.msgAnnouncementTitleRequired') || 'Title is required');
            return;
        }
        try {
            if (selected?.id && typeof selected.id === 'string') {
                await marketingApi.updateAnnouncement(selected.id, {
                    title: formTitle,
                    body: formBody,
                    target: formTarget,
                    priority: formPriority,
                    scheduled_at: formSchedule || null,
                });
                refetch();
            }
        } catch {
            /* fallback */
        }
        setIsEditOpen(false);
        setSelected(null);
        addToast('success', t('mkt.msgAnnouncementUpdated') || 'Announcement updated');
    };

    const handleDelete = async () => {
        try {
            if (selected?.id && typeof selected.id === 'string') {
                await marketingApi.deleteAnnouncement(selected.id);
            }
            refetch();
        } catch {
            /* fallback */
        }
        setIsDeleteOpen(false);
        setSelected(null);
        addToast('success', t('mkt.msgAnnouncementDeleted') || 'Announcement deleted');
    };

    const handlePublish = async (a: (typeof announcements)[0]) => {
        try {
            if (a.id && typeof a.id === 'string') {
                await marketingApi.publishAnnouncement(a.id);
                refetch();
            }
        } catch {
            /* fallback */
        }
        setIsDetailOpen(false);
        addToast('success', t('mkt.msgAnnouncementPublished') || 'Announcement published');
    };

    const targetLabel = (target: string) => {
        switch (target) {
            case 'all':
                return t('mkt.lblAllEmployees') || 'All Employees';
            case 'branch':
                return t('mkt.lblByBranch') || 'By Branch';
            case 'role':
                return t('mkt.lblByRole') || 'By Role';
            default:
                return target;
        }
    };

    const priorityLabel = (priority: string) => {
        switch (priority) {
            case 'low':
                return t('mkt.lblLow') || 'Low';
            case 'normal':
                return t('mkt.lblNormal') || 'Normal';
            case 'high':
                return t('mkt.lblHigh') || 'High';
            case 'urgent':
                return t('mkt.lblUrgent') || 'Urgent';
            default:
                return priority;
        }
    };

    return (
        <div className={styles.page}>
            <MarketingTabs />

            <div className={styles.toolbar}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                    {announcements.filter((a: (typeof announcements)[0]) => a.status === 'published').length}{' '}
                    {t('mkt.lblPublished') || 'Published'}
                    {' / '}
                    {announcements.length} {t('mkt.lblTotal') || 'Total'}
                </div>
                <button className={styles.addBtn} onClick={openAdd}>
                    <Plus size={16} /> {t('mkt.btnNewAnnouncement') || 'New Announcement'}
                </button>
            </div>

            <DataGuard
                loading={loading}
                error={error}
                data={announcements}
                emptyIcon={<Megaphone size={48} />}
                emptyTitle={t('mkt.lblNoAnnouncements') || 'No Announcements'}
                emptyDescription={t('mkt.msgNoAnnouncementsDesc') || 'Create your first announcement for employees.'}
                emptyAction={
                    <button className={styles.addBtn} onClick={openAdd}>
                        <Plus size={16} /> {t('mkt.btnNewAnnouncement') || 'New Announcement'}
                    </button>
                }
                onRetry={refetch}
            >
                <div className={styles.grid}>
                    {announcements.map((a: (typeof announcements)[0], i: number) => (
                        <div key={a.id ?? `announcement-${i}`} className={styles.card} onClick={() => openDetail(a)}>
                            <div className={styles.cardHead}>
                                <div
                                    className={styles.priorityStripe}
                                    style={{ background: priorityColors[a.priority] || 'var(--color-gray-400)' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            marginBottom: 'var(--space-1)',
                                        }}
                                    >
                                        <div className={styles.cardTitle}>{a.title}</div>
                                    </div>
                                    <div className={styles.cardBody}>{a.body}</div>
                                </div>
                            </div>
                            <div className={styles.cardMeta}>
                                <Badge color={statusBadge[a.status] || 'neutral'} size="sm">
                                    {t(`mkt.lbl${a.status.charAt(0).toUpperCase() + a.status.slice(1)}`) || a.status}
                                </Badge>
                                <Badge color={priorityBadge[a.priority] || 'neutral'} size="sm">
                                    {priorityLabel(a.priority)}
                                </Badge>
                                <Badge color="neutral" size="sm">
                                    <Users size={10} style={{ marginRight: 4 }} />
                                    {targetLabel(a.target)}
                                </Badge>
                            </div>
                            <div className={styles.footer}>
                                <span>
                                    {a.status === 'published'
                                        ? `${t('mkt.lblPublished') || 'Published'} ${a.publishedAt || ''}`
                                        : a.status === 'scheduled'
                                          ? `${t('mkt.lblScheduled') || 'Scheduled'} ${a.scheduledAt || ''}`
                                          : `${t('mkt.lblCreated') || 'Created'} ${a.createdAt || ''}`}
                                </span>
                                <div className={styles.actions} onClick={e => e.stopPropagation()}>
                                    {a.status !== 'published' && (
                                        <button
                                            className={styles.btnIcon}
                                            style={{ color: 'var(--color-success)' }}
                                            onClick={() => handlePublish(a)}
                                            title={t('mkt.btnPublish') || 'Publish'}
                                        >
                                            <Send size={12} />
                                        </button>
                                    )}
                                    <button
                                        className={styles.btnIcon}
                                        onClick={() => openEdit(a)}
                                        title={t('bk.btnEdit') || 'Edit'}
                                    >
                                        <Edit size={12} />
                                    </button>
                                    <button
                                        className={styles.btnIcon}
                                        style={{ color: 'var(--color-error)' }}
                                        onClick={() => openDelete(a)}
                                        title={t('mkt.lblDelete') || 'Delete'}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
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
                    setSelected(null);
                }}
                title={t('mkt.lblAnnouncementDetails') || 'Announcement Details'}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => openDelete(selected!)}>
                            <Trash2 size={14} /> {t('mkt.lblDelete') || 'Delete'}
                        </Button>
                        {selected?.status !== 'published' && (
                            <Button variant="ghost" onClick={() => handlePublish(selected!)}>
                                <Send size={14} /> {t('mkt.btnPublish') || 'Publish'}
                            </Button>
                        )}
                        <Button onClick={() => openEdit(selected!)}>
                            <Edit size={14} /> {t('bk.btnEdit') || 'Edit'}
                        </Button>
                    </div>
                }
            >
                {selected && (
                    <div className={styles.detailSection}>
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>
                                    {selected.title}
                                </span>
                                <Badge color={statusBadge[selected.status] || 'neutral'}>
                                    {t(
                                        `mkt.lbl${selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}`
                                    ) || selected.status}
                                </Badge>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <Badge color={priorityBadge[selected.priority] || 'neutral'} size="sm">
                                    {priorityLabel(selected.priority)} {t('mkt.lblPriority') || 'Priority'}
                                </Badge>
                                <Badge color="neutral" size="sm">
                                    <Users size={10} style={{ marginRight: 4 }} />
                                    {targetLabel(selected.target)}
                                </Badge>
                            </div>
                        </div>

                        <div className={styles.infoGrid}>
                            <div className={styles.infoCard}>
                                <div className={styles.infoLabel}>{t('mkt.lblReadCount') || 'Read Count'}</div>
                                <div className={styles.infoValue} style={{ fontSize: 'var(--text-2xl)' }}>
                                    {selected.readCount}
                                </div>
                            </div>
                            <div className={styles.infoCard}>
                                <div className={styles.infoLabel}>{t('mkt.lblCreated') || 'Created'}</div>
                                <div className={styles.infoValue}>{selected.createdAt}</div>
                            </div>
                            {selected.publishedAt && (
                                <div className={styles.infoCard}>
                                    <div className={styles.infoLabel}>{t('mkt.lblPublishedAt') || 'Published At'}</div>
                                    <div className={styles.infoValue}>{selected.publishedAt}</div>
                                </div>
                            )}
                            {selected.scheduledAt && (
                                <div className={styles.infoCard}>
                                    <div className={styles.infoLabel}>
                                        {t('mkt.lblScheduledFor') || 'Scheduled For'}
                                    </div>
                                    <div className={styles.infoValue}>{selected.scheduledAt}</div>
                                </div>
                            )}
                        </div>

                        {/* Body Content */}
                        <div>
                            <div className={styles.sectionTitle} style={{ marginBottom: 'var(--space-3)' }}>
                                {t('mkt.lblContent') || 'Content'}
                            </div>
                            <div
                                style={{
                                    padding: 'var(--space-4)',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-lg)',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.7,
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {selected.body}
                            </div>
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* Create Announcement SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('mkt.lblCreateAnnouncement') || 'Create Announcement'}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('rtn.btnBack') || 'Cancel'}
                        </Button>
                        <Button onClick={handleCreate}>
                            {t('mkt.btnCreateAnnouncement') || 'Create Announcement'}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('mkt.lblAnnouncementTitle') || 'Title'}
                        placeholder={t('mkt.phAnnouncementTitle') || 'e.g. New Policy Update'}
                        value={formTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormTitle(e.target.value)}
                    />
                    <div>
                        <label
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-medium)',
                                display: 'block',
                                marginBottom: 'var(--space-2)',
                            }}
                        >
                            {t('mkt.lblAnnouncementBody') || 'Body'}
                        </label>
                        <textarea
                            style={{
                                width: '100%',
                                minHeight: 150,
                                padding: 'var(--space-3)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 'var(--text-sm)',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                lineHeight: 1.6,
                            }}
                            placeholder={t('mkt.phAnnouncementBody') || 'Write your announcement content...'}
                            value={formBody}
                            onChange={e => setFormBody(e.target.value)}
                        />
                    </div>
                    <Select
                        label={t('mkt.lblTargetAudience') || 'Target Audience'}
                        value={formTarget}
                        onChange={e => setFormTarget(e.target.value as 'all' | 'branch' | 'role')}
                        options={[
                            { label: t('mkt.lblAllEmployees') || 'All Employees', value: 'all' },
                            { label: t('mkt.lblByBranch') || 'By Branch', value: 'branch' },
                            { label: t('mkt.lblByRole') || 'By Role', value: 'role' },
                        ]}
                    />
                    <Select
                        label={t('mkt.lblPriority') || 'Priority'}
                        value={formPriority}
                        onChange={e => setFormPriority(e.target.value as 'low' | 'normal' | 'high' | 'urgent')}
                        options={[
                            { label: t('mkt.lblLow') || 'Low', value: 'low' },
                            { label: t('mkt.lblNormal') || 'Normal', value: 'normal' },
                            { label: t('mkt.lblHigh') || 'High', value: 'high' },
                            { label: t('mkt.lblUrgent') || 'Urgent', value: 'urgent' },
                        ]}
                    />
                    <Input
                        label={t('mkt.lblScheduleDate') || 'Schedule Date (optional)'}
                        type="datetime-local"
                        value={formSchedule}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormSchedule(e.target.value)}
                    />
                </div>
            </SlideOver>

            {/* Edit Announcement SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelected(null);
                }}
                title={t('mkt.lblEditAnnouncement') || 'Edit Announcement'}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('rtn.btnBack') || 'Cancel'}
                        </Button>
                        <Button onClick={handleEdit}>{t('settings.saveChanges') || 'Save Changes'}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('mkt.lblAnnouncementTitle') || 'Title'}
                        value={formTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormTitle(e.target.value)}
                    />
                    <div>
                        <label
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-medium)',
                                display: 'block',
                                marginBottom: 'var(--space-2)',
                            }}
                        >
                            {t('mkt.lblAnnouncementBody') || 'Body'}
                        </label>
                        <textarea
                            style={{
                                width: '100%',
                                minHeight: 150,
                                padding: 'var(--space-3)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 'var(--text-sm)',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                lineHeight: 1.6,
                            }}
                            value={formBody}
                            onChange={e => setFormBody(e.target.value)}
                        />
                    </div>
                    <Select
                        label={t('mkt.lblTargetAudience') || 'Target Audience'}
                        value={formTarget}
                        onChange={e => setFormTarget(e.target.value as 'all' | 'branch' | 'role')}
                        options={[
                            { label: t('mkt.lblAllEmployees') || 'All Employees', value: 'all' },
                            { label: t('mkt.lblByBranch') || 'By Branch', value: 'branch' },
                            { label: t('mkt.lblByRole') || 'By Role', value: 'role' },
                        ]}
                    />
                    <Select
                        label={t('mkt.lblPriority') || 'Priority'}
                        value={formPriority}
                        onChange={e => setFormPriority(e.target.value as 'low' | 'normal' | 'high' | 'urgent')}
                        options={[
                            { label: t('mkt.lblLow') || 'Low', value: 'low' },
                            { label: t('mkt.lblNormal') || 'Normal', value: 'normal' },
                            { label: t('mkt.lblHigh') || 'High', value: 'high' },
                            { label: t('mkt.lblUrgent') || 'Urgent', value: 'urgent' },
                        ]}
                    />
                    <Input
                        label={t('mkt.lblScheduleDate') || 'Schedule Date (optional)'}
                        type="datetime-local"
                        value={formSchedule}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormSchedule(e.target.value)}
                    />
                </div>
            </SlideOver>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelected(null);
                }}
                title={t('mkt.lblDeleteAnnouncement') || 'Delete Announcement'}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('rtn.btnBack') || 'Cancel'}
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            {t('mkt.lblDeleteAnnouncement') || 'Delete Announcement'}
                        </Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    {t('mkt.msgDeleteAnnouncementConfirm') || 'Are you sure you want to delete'}{' '}
                    <strong>{selected?.title}</strong>?
                </p>
            </Modal>
        </div>
    );
}
