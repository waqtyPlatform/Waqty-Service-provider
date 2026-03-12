'use client';

import React, { useState } from 'react';
import { Plus, Calendar, Tag, Edit, Trash2, Eye } from 'lucide-react';
import { useToast, SlideOver, Modal, Input, Button, Select, Badge } from '@/components/ui';
import MarketingTabs from '@/components/MarketingTabs';
import { useTranslation } from '@/hooks/useTranslation';

const initialOffers = [
    { id: 1, name: 'Spring Beauty Festival', discount: 30, type: 'percentage', services: ['Hair Coloring', 'HydraFacial', 'Manicure'], startDate: '2026-03-14', endDate: '2026-03-12', status: 'scheduled', color: '#EC4899', uses: 0, limit: 100, description: 'Celebrate spring with our biggest beauty festival! Get 30% off on select services.' },
    { id: 2, name: 'Eid Special Bundle', discount: 25, type: 'percentage', services: ['Full Body Massage', 'Facial', 'Pedicure'], startDate: '2026-03-24', endDate: '2026-03-25', status: 'active', color: '#F59E0B', uses: 34, limit: 50, description: 'Exclusive Eid bundle for our valued clients. Limited availability!' },
    { id: 3, name: 'Valentines Day Offer', discount: 200, type: 'fixed', services: ['Couples Massage', 'Facial x2'], startDate: '2026-03-14', endDate: '2026-03-23', status: 'active', color: '#EF4444', uses: 8, limit: 20, description: 'A romantic spa experience for two. Book now before it sells out.' },
    { id: 4, name: 'New Client Welcome', discount: 50, type: 'fixed', services: ['Any single service'], startDate: '2026-03-26', endDate: '2026-03-26', status: 'active', color: '#10B981', uses: 67, limit: 500, description: 'Welcome offer for first-time clients. Valid on any single service.' },
    { id: 5, name: 'Flash Friday', discount: 40, type: 'percentage', services: ['All Services'], startDate: '2026-03-12', endDate: '2026-03-26', status: 'expired', color: '#8B5CF6', uses: 22, limit: 30, description: 'One-day flash sale every Friday. Up to 40% off on all services.' },
];

const statusBadge: Record<string, 'success' | 'info' | 'neutral'> = { active: 'success', scheduled: 'info', expired: 'neutral' };

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' },
    cardHead: { padding: 'var(--space-5)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' },
    icon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    name: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    discount: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' },
    services: { padding: '0 var(--space-5) var(--space-4)', display: 'flex', flexWrap: 'wrap', gap: 6 },
    svcChip: { padding: '2px 10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' },
    footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' },
    stat: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
    // Detail SlideOver styles
    detailSection: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    detailHeader: { display: 'flex', alignItems: 'center', gap: 'var(--space-4)' },
    detailIcon: { width: 56, height: 56, borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    detailName: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' },
    detailDiscount: { fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' },
    infoCard: { background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' },
    infoLabel: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' },
    infoValue: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
    progressContainer: { height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
    sectionTitle: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' },
};

export default function OffersPage() {
    const { addToast } = useToast();
    const [offers, setOffers] = useState(initialOffers);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<typeof initialOffers[0] | null>(null);

    const openDetail = (offer: typeof initialOffers[0]) => { setSelectedOffer(offer); setIsDetailOpen(true); };
    const openEdit = (offer: typeof initialOffers[0]) => { setSelectedOffer(offer); setIsDetailOpen(false); setIsEditOpen(true); };
    const openDelete = (offer: typeof initialOffers[0]) => { setSelectedOffer(offer); setIsDetailOpen(false); setIsDeleteOpen(true); };

    const { t } = useTranslation();

    const handleDelete = () => {
        setOffers(prev => prev.filter(o => o.id !== selectedOffer?.id));
        setIsDeleteOpen(false);
        setSelectedOffer(null);
        addToast('success', t('mkt.lblDeleteOffer'));
    };

    return (
        <div style={s.page}>
            <MarketingTabs />

            <div style={s.toolbar}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{offers.filter(o => o.status === 'active').length} {t('mkt.lblActiveOffers')}</div>
                <button style={s.addBtn} onClick={() => setIsAddOpen(true)}><Plus size={16} /> {t('mkt.btnNewOffer')}</button>
            </div>

            <div style={s.grid}>
                {offers.map(offer => (
                    <div key={offer.id} style={{ ...s.card, opacity: offer.status === 'expired' ? 0.6 : 1 }} onClick={() => openDetail(offer)}>
                        <div style={s.cardHead}>
                            <div style={{ ...s.icon, background: offer.color }}><Tag size={20} /></div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <div style={s.name}>{offer.name}</div>
                                    <Badge color={statusBadge[offer.status]} size="sm">{t(`mkt.lbl${offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}`)}</Badge>
                                </div>
                                <div style={s.discount}>
                                    {offer.type === 'percentage' ? `${offer.discount}% ${t('mkt.lblOFF')}` : `-${offer.discount} ${t('mkt.lblEGP')}`}
                                </div>
                            </div>
                        </div>
                        <div style={s.services as React.CSSProperties}>
                            {offer.services.map(svc => <span key={svc} style={s.svcChip}>{svc}</span>)}
                        </div>
                        <div style={s.footer}>
                            <div style={s.stat}><Calendar size={12} /> {offer.startDate} → {offer.endDate}</div>
                            <div style={s.stat}>{offer.uses}/{offer.limit} {t('mkt.lblUsed')}</div>
                            <div style={s.actions} onClick={e => e.stopPropagation()}>
                                <button style={{ ...s.btnIcon, color: 'var(--color-primary-500)' }} onClick={() => openDetail(offer)} title={t('mkt.lblOfferDetails')}><Eye size={12} /></button>
                                <button style={s.btnIcon} onClick={() => openEdit(offer)} title={t('mkt.lblEditOffer')}><Edit size={12} /></button>
                                <button style={{ ...s.btnIcon, color: 'var(--color-error)' }} onClick={() => openDelete(offer)} title={t('mkt.lblDeleteOffer')}><Trash2 size={12} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail SlideOver */}
            <SlideOver
                open={isDetailOpen}
                onClose={() => { setIsDetailOpen(false); setSelectedOffer(null); }}
                title={t('mkt.lblOfferDetails')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => openDelete(selectedOffer!)}><Trash2 size={14} /> {t('mkt.btnDeleteOffer')}</Button>
                        <Button onClick={() => openEdit(selectedOffer!)}><Edit size={14} /> {t('bk.btnEdit')}</Button>
                    </div>
                }
            >
                {selectedOffer && (
                    <div style={s.detailSection as React.CSSProperties}>
                        <div style={s.detailHeader as React.CSSProperties}>
                            <div style={{ ...s.detailIcon, background: selectedOffer.color }}><Tag size={24} /></div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                                    <div style={s.detailName}>{selectedOffer.name}</div>
                                    <Badge color={statusBadge[selectedOffer.status]}>{t(`mkt.lbl${selectedOffer.status.charAt(0).toUpperCase() + selectedOffer.status.slice(1)}`)}</Badge>
                                </div>
                                <div style={s.detailDiscount}>
                                    {selectedOffer.type === 'percentage' ? `${selectedOffer.discount}% ${t('mkt.lblOFF')}` : `-${selectedOffer.discount} ${t('mkt.lblEGP')}`}
                                </div>
                            </div>
                        </div>

                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {selectedOffer.description}
                        </div>

                        <div style={s.infoGrid as React.CSSProperties}>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblStartDate')}</div>
                                <div style={s.infoValue}>{selectedOffer.startDate}</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblEndDate')}</div>
                                <div style={s.infoValue}>{selectedOffer.endDate}</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblDiscountType')}</div>
                                <div style={s.infoValue}>{selectedOffer.type === 'percentage' ? t('mkt.lblPercentage') : t('mkt.lblFixedAmount')}</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblUsageLimit')}</div>
                                <div style={s.infoValue}>{selectedOffer.limit} {t('mkt.lblRedemptions')}</div>
                            </div>
                        </div>

                        {/* Usage Progress */}
                        <div>
                            <div style={{ ...s.sectionTitle as React.CSSProperties, marginBottom: 'var(--space-3)' }}>{t('mkt.lblUsage')}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{selectedOffer.uses} / {selectedOffer.limit}</span>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{Math.round(selectedOffer.uses / selectedOffer.limit * 100)}%</span>
                            </div>
                            <div style={s.progressContainer}>
                                <div style={{ ...s.progressFill, width: `${Math.min(selectedOffer.uses / selectedOffer.limit * 100, 100)}%`, background: selectedOffer.uses >= selectedOffer.limit ? 'var(--color-error)' : 'var(--color-primary-500)' }} />
                            </div>
                        </div>

                        {/* Services */}
                        <div>
                            <div style={{ ...s.sectionTitle as React.CSSProperties, marginBottom: 'var(--space-3)' }}>{t('mkt.lblIncludedServices')}</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {selectedOffer.services.map((svc: string) => (
                                    <span key={svc} style={{ padding: '6px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{svc}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* Add Offer SlideOver */}
            <SlideOver
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={t('mkt.lblCreateNewOffer')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>{t('rtn.btnBack')}</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', t('mkt.btnNewOffer')); }}>{t('mkt.btnNewOffer')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('mkt.lblOfferName')} placeholder="e.g. Summer Special" />
                    <Input label={t('mkt.lblDescription')} placeholder="Brief description of the offer" />
                    <Select label={t('mkt.lblDiscountType')} options={[{ label: t('mkt.lblPercentage'), value: 'percentage' }, { label: t('mkt.lblFixedAmount'), value: 'fixed' }]} />
                    <Input label={t('mkt.lblDiscountValue')} type="number" placeholder="0" />
                    <Input label={t('mkt.lblUsageLimit')} type="number" placeholder="e.g. 100" />
                    <Input label={t('mkt.lblStartDate')} type="date" />
                    <Input label={t('mkt.lblEndDate')} type="date" />
                    <Select label={t('mkt.lblStatus')} options={[{ label: t('mkt.lblActive'), value: 'active' }, { label: t('mkt.lblScheduled'), value: 'scheduled' }]} />
                </div>
            </SlideOver>

            {/* Edit Offer SlideOver */}
            <SlideOver
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedOffer(null); }}
                title={t('mkt.lblEditOffer')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>{t('rtn.btnBack')}</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', t('mkt.lblEditOffer')); }}>{t('mkt.lblEditOffer')}</Button>
                    </div>
                }
            >
                {selectedOffer && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label={t('mkt.lblOfferName')} defaultValue={selectedOffer.name} />
                        <Input label={t('mkt.lblDescription')} defaultValue={selectedOffer.description} />
                        <Select label={t('mkt.lblDiscountType')} defaultValue={selectedOffer.type} options={[{ label: t('mkt.lblPercentage'), value: 'percentage' }, { label: t('mkt.lblFixedAmount'), value: 'fixed' }]} />
                        <Input label={t('mkt.lblDiscountValue')} type="number" defaultValue={selectedOffer.discount} />
                        <Input label={t('mkt.lblUsageLimit')} type="number" defaultValue={selectedOffer.limit} />
                        <Input label={t('mkt.lblStartDate')} type="date" defaultValue={selectedOffer.startDate} />
                        <Input label={t('mkt.lblEndDate')} type="date" defaultValue={selectedOffer.endDate} />
                        <Select label={t('mkt.lblStatus')} defaultValue={selectedOffer.status} options={[{ label: t('mkt.lblActive'), value: 'active' }, { label: t('mkt.lblScheduled'), value: 'scheduled' }, { label: t('mkt.lblExpired'), value: 'expired' }]} />
                    </div>
                )}
            </SlideOver>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedOffer(null); }}
                title={t('mkt.lblDeleteOffer')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>{t('rtn.btnBack')}</Button>
                        <Button variant="destructive" onClick={handleDelete}>{t('mkt.lblDeleteOffer')}</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {t('mkt.msgDeleteOfferConfirm')} <strong>{selectedOffer?.name}</strong>
                    </p>
                </div>
            </Modal>

            <style>{`.hoverRow:hover { background-color: var(--bg-secondary); }`}</style>
        </div>
    );
}
