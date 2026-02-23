'use client';

import React, { useState } from 'react';
import { Plus, Package, Check, Users, Edit, Trash2, MoreVertical, Eye } from 'lucide-react';
import { useToast, SlideOver, Modal, Input, Button, DropdownMenu, Select, Badge } from '@/components/ui';

import MarketingTabs from '@/components/MarketingTabs';

const initialPackages = [
    { id: 1, name: 'Summer Glow Campaign', price: 899, originalPrice: 1200, services: ['Body Scrub', 'Spray Tan', 'Gel Nails', 'Lash Lift'], target: 'New Clients', active: true, sold: 15, color: '#F59E0B', description: 'A complete glow-up package for the summer season. Perfect for new clients looking to try multiple services.' },
    { id: 2, name: 'Refer-a-Friend Bundle', price: 599, originalPrice: 800, services: ['Any Facial', 'Classic Manicure', 'Blow Dry'], target: 'Referral Program', active: true, sold: 28, color: '#10B981', description: 'Reward your referrals with this curated bundle of our most popular services.' },
    { id: 3, name: 'Birthday Special', price: 750, originalPrice: 1050, services: ['Full Styling', 'Makeup', 'Nail Art', 'Photo Shoot'], target: 'Birthday Month', active: true, sold: 12, color: '#EC4899', description: 'Make their birthday extra special with styling, makeup, and a professional photo shoot.' },
    { id: 4, name: 'Corporate Wellness', price: 450, originalPrice: 600, services: ['Chair Massage', 'Mini Facial', 'Express Mani'], target: 'Corporate Partners', active: false, sold: 0, color: '#3B82F6', description: 'Quick wellness sessions designed for busy professionals. Ideal for corporate partner programs.' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' },
    cardHead: { padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    icon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    name: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    price: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' },
    target: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    services: { padding: '0 var(--space-5) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 6 },
    svcItem: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' },
    footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    // Detail styles
    detailSection: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    detailHeader: { display: 'flex', alignItems: 'center', gap: 'var(--space-4)' },
    detailIcon: { width: 56, height: 56, borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' },
    infoCard: { background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' },
    infoLabel: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' },
    infoValue: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
    sectionTitle: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' },
};

export default function MarketingPackagesPage() {
    const { addToast } = useToast();
    const [packages, setPackages] = useState(initialPackages);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);

    const openDetail = (pkg: any) => { setSelectedPackage(pkg); setIsDetailOpen(true); };
    const openEdit = (pkg: any) => { setSelectedPackage(pkg); setIsDetailOpen(false); setIsEditOpen(true); };
    const openDelete = (pkg: any) => { setSelectedPackage(pkg); setIsDetailOpen(false); setIsDeleteOpen(true); };

    const handleDelete = () => {
        setPackages(prev => prev.filter(p => p.id !== selectedPackage?.id));
        setIsDeleteOpen(false);
        setSelectedPackage(null);
        addToast('success', 'Package deleted successfully');
    };

    return (
        <div style={s.page}>
            <MarketingTabs />
            <div style={s.toolbar}><button style={s.addBtn} onClick={() => setIsAddOpen(true)}><Plus size={16} /> New Package</button></div>
            <div style={s.grid}>
                {packages.map(pkg => (
                    <div key={pkg.id} style={{ ...s.card, opacity: pkg.active ? 1 : 0.6 }} onClick={() => openDetail(pkg)}>
                        <div style={s.cardHead}>
                            <div style={{ ...s.icon, background: pkg.color }}><Package size={20} /></div>
                            <div style={{ flex: 1 }}>
                                <div style={s.name}>{pkg.name}</div>
                                <div style={s.price}>{pkg.price} EGP</div>
                                <div style={s.target}>Target: {pkg.target}</div>
                            </div>
                            <div style={{ marginLeft: 'auto' }} onClick={e => e.stopPropagation()}>
                                <DropdownMenu
                                    trigger={<button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><MoreVertical size={16} /></button>}
                                    items={[
                                        { label: 'View Details', icon: <Eye size={14} />, onClick: () => openDetail(pkg) },
                                        { label: 'Edit Package', icon: <Edit size={14} />, onClick: () => openEdit(pkg) },
                                        { label: 'Delete Package', destructive: true, icon: <Trash2 size={14} />, onClick: () => openDelete(pkg) }
                                    ]}
                                />
                            </div>
                        </div>
                        <div style={s.services as React.CSSProperties}>
                            {pkg.services.map((svc, i) => <div key={i} style={s.svcItem}><Check size={14} style={{ color: 'var(--color-success)' }} /> {svc}</div>)}
                        </div>
                        <div style={s.footer}>
                            <span><Users size={12} style={{ display: 'inline', marginRight: 4 }} /> {pkg.sold} sold</span>
                            <span>{pkg.active ? '🟢 Active' : '⚪ Inactive'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail SlideOver */}
            <SlideOver
                open={isDetailOpen}
                onClose={() => { setIsDetailOpen(false); setSelectedPackage(null); }}
                title="Package Details"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => openDelete(selectedPackage)}><Trash2 size={14} /> Delete</Button>
                        <Button onClick={() => openEdit(selectedPackage)}><Edit size={14} /> Edit Package</Button>
                    </div>
                }
            >
                {selectedPackage && (
                    <div style={s.detailSection as React.CSSProperties}>
                        <div style={s.detailHeader as React.CSSProperties}>
                            <div style={{ ...s.detailIcon, background: selectedPackage.color }}><Package size={24} /></div>
                            <div>
                                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>{selectedPackage.name}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>{selectedPackage.price} EGP</span>
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>{selectedPackage.originalPrice} EGP</span>
                                    <Badge color={selectedPackage.active ? 'success' : 'neutral'} size="sm">{selectedPackage.active ? 'Active' : 'Inactive'}</Badge>
                                </div>
                            </div>
                        </div>

                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {selectedPackage.description}
                        </div>

                        <div style={s.infoGrid as React.CSSProperties}>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>Target Audience</div>
                                <div style={s.infoValue}>{selectedPackage.target}</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>Total Sold</div>
                                <div style={s.infoValue}>{selectedPackage.sold} packages</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>Revenue Generated</div>
                                <div style={s.infoValue}>{(selectedPackage.sold * selectedPackage.price).toLocaleString()} EGP</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>Savings Per Package</div>
                                <div style={s.infoValue}>{selectedPackage.originalPrice - selectedPackage.price} EGP ({Math.round((1 - selectedPackage.price / selectedPackage.originalPrice) * 100)}% off)</div>
                            </div>
                        </div>

                        <div>
                            <div style={{ ...s.sectionTitle as React.CSSProperties, marginBottom: 'var(--space-3)' }}>Included Services ({selectedPackage.services.length})</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {selectedPackage.services.map((svc: string, i: number) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                                        <Check size={16} style={{ color: 'var(--color-success)' }} />
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{svc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* Add Package SlideOver */}
            <SlideOver open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Package"
                footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}><Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button onClick={() => { setIsAddOpen(false); addToast('success', 'Package created successfully'); }}>Save Package</Button></div>}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Package Name" placeholder="e.g. Summer Glow" />
                    <Input label="Description" placeholder="Brief description" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <Input label="Price (EGP)" type="number" placeholder="0.00" />
                        <Input label="Original Price (EGP)" type="number" placeholder="0.00" />
                    </div>
                    <Input label="Target Audience" placeholder="e.g. New Clients" />
                    <Select label="Status" options={[{ label: 'Active', value: 'active' }, { label: 'Draft', value: 'draft' }]} />
                </div>
            </SlideOver>

            {/* Edit Package SlideOver */}
            <SlideOver open={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedPackage(null); }} title="Edit Package"
                footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}><Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={() => { setIsEditOpen(false); addToast('success', 'Package updated successfully'); }}>Save Changes</Button></div>}
            >
                {selectedPackage && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Package Name" defaultValue={selectedPackage.name} />
                        <Input label="Description" defaultValue={selectedPackage.description} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                            <Input label="Price (EGP)" type="number" defaultValue={selectedPackage.price} />
                            <Input label="Original Price (EGP)" type="number" defaultValue={selectedPackage.originalPrice} />
                        </div>
                        <Input label="Target Audience" defaultValue={selectedPackage.target} />
                        <Select label="Status" defaultValue={selectedPackage.active ? 'active' : 'draft'} options={[{ label: 'Active', value: 'active' }, { label: 'Draft', value: 'draft' }]} />
                    </div>
                )}
            </SlideOver>

            {/* Delete Confirmation Modal */}
            <Modal open={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelectedPackage(null); }} title="Delete Package"
                footer={<div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}><Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Confirm Delete</Button></div>}
            >
                <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete the <strong>{selectedPackage?.name}</strong> package?</p>
            </Modal>
        </div>
    );
}
