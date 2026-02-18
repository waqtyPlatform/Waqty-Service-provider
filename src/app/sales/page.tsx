'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Plus,
    Grid3X3,
    List,
    Clock,
    Check,
    Sparkles,
    Scissors,
    Palette,
    Heart,
    Droplets,
    Star,
} from 'lucide-react';
import styles from './sales.module.css';

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    active: boolean;
    icon: string;
    categoryColor: string;
}

interface Category {
    name: string;
    icon: React.ReactNode;
    color: string;
    services: Service[];
}

const categories: Category[] = [
    {
        name: 'Hair Services',
        icon: <Scissors size={18} />,
        color: '#8B5CF6',
        services: [
            { id: 'h1', name: 'Haircut & Styling', description: 'Professional haircut with wash, blow-dry and styling.', price: 150, duration: 45, active: true, icon: '✂️', categoryColor: '#EDE9FE' },
            { id: 'h2', name: 'Hair Coloring', description: 'Full color treatment with premium products and aftercare.', price: 400, duration: 120, active: true, icon: '🎨', categoryColor: '#EDE9FE' },
            { id: 'h3', name: 'Keratin Treatment', description: 'Smoothing keratin treatment for frizz-free hair up to 3 months.', price: 500, duration: 180, active: true, icon: '✨', categoryColor: '#EDE9FE' },
            { id: 'h4', name: 'Hair Extensions', description: 'Premium clip-in or tape-in hair extensions installation.', price: 800, duration: 150, active: true, icon: '💇', categoryColor: '#EDE9FE' },
            { id: 'h5', name: 'Olaplex Treatment', description: 'Bond repair treatment for damaged or chemically treated hair.', price: 350, duration: 60, active: true, icon: '💎', categoryColor: '#EDE9FE' },
        ],
    },
    {
        name: 'Skin & Facial',
        icon: <Sparkles size={18} />,
        color: '#EC4899',
        services: [
            { id: 's1', name: 'Classic Facial', description: 'Deep cleansing facial with extraction, mask, and moisturizer.', price: 200, duration: 60, active: true, icon: '🧖', categoryColor: '#FCE7F3' },
            { id: 's2', name: 'HydraFacial', description: 'Multi-step treatment for cleansing, exfoliation and hydration.', price: 450, duration: 75, active: true, icon: '💧', categoryColor: '#FCE7F3' },
            { id: 's3', name: 'Chemical Peel', description: 'Professional chemical peel for skin rejuvenation and tone.', price: 350, duration: 45, active: true, icon: '🌟', categoryColor: '#FCE7F3' },
            { id: 's4', name: 'Microneedling', description: 'Collagen induction therapy for acne scars and fine lines.', price: 550, duration: 90, active: false, icon: '🔬', categoryColor: '#FCE7F3' },
        ],
    },
    {
        name: 'Nails',
        icon: <Palette size={18} />,
        color: '#F59E0B',
        services: [
            { id: 'n1', name: 'Classic Manicure', description: 'Nail shaping, cuticle care, hand massage and polish.', price: 80, duration: 30, active: true, icon: '💅', categoryColor: '#FEF3C7' },
            { id: 'n2', name: 'Gel Manicure', description: 'Long-lasting gel polish application with nail care.', price: 150, duration: 45, active: true, icon: '✨', categoryColor: '#FEF3C7' },
            { id: 'n3', name: 'Pedicure', description: 'Complete foot care with callus removal, massage and polish.', price: 120, duration: 45, active: true, icon: '🦶', categoryColor: '#FEF3C7' },
            { id: 'n4', name: 'Nail Art', description: 'Custom nail art designs with embellishments and details.', price: 200, duration: 60, active: true, icon: '🎨', categoryColor: '#FEF3C7' },
        ],
    },
    {
        name: 'Body & Spa',
        icon: <Heart size={18} />,
        color: '#10B981',
        services: [
            { id: 'b1', name: 'Swedish Massage', description: 'Full body relaxation massage with aromatherapy oils.', price: 300, duration: 60, active: true, icon: '🌿', categoryColor: '#D1FAE5' },
            { id: 'b2', name: 'Deep Tissue Massage', description: 'Targeted massage for muscle tension and chronic pain relief.', price: 350, duration: 60, active: true, icon: '💪', categoryColor: '#D1FAE5' },
            { id: 'b3', name: 'Hot Stone Therapy', description: 'Heated basalt stones combined with massage techniques.', price: 400, duration: 75, active: true, icon: '🪨', categoryColor: '#D1FAE5' },
            { id: 'b4', name: 'Body Scrub & Wrap', description: 'Exfoliating body scrub followed by nourishing body wrap.', price: 380, duration: 90, active: true, icon: '🧴', categoryColor: '#D1FAE5' },
        ],
    },
    {
        name: 'Laser & Advanced',
        icon: <Droplets size={18} />,
        color: '#3B82F6',
        services: [
            { id: 'l1', name: 'Laser Hair Removal', description: 'Permanent hair reduction with latest diode laser technology.', price: 250, duration: 30, active: true, icon: '⚡', categoryColor: '#DBEAFE' },
            { id: 'l2', name: 'IPL Skin Rejuvenation', description: 'Intense Pulsed Light treatment for pigmentation and vessels.', price: 400, duration: 45, active: true, icon: '💡', categoryColor: '#DBEAFE' },
            { id: 'l3', name: 'Teeth Whitening', description: 'Professional LED teeth whitening up to 8 shades lighter.', price: 500, duration: 60, active: true, icon: '😁', categoryColor: '#DBEAFE' },
        ],
    },
];

const packages = [
    {
        id: 'p1',
        name: 'Bridal Glow Package',
        price: 2500,
        originalPrice: 3200,
        validity: '30 days',
        sold: 24,
        services: ['Classic Facial', 'Hair Coloring', 'Gel Manicure', 'Pedicure', 'Swedish Massage', 'Teeth Whitening'],
    },
    {
        id: 'p2',
        name: 'Monthly Maintenance',
        price: 600,
        originalPrice: 850,
        validity: '30 days',
        sold: 67,
        services: ['Haircut & Styling', 'Classic Manicure', 'Pedicure', 'Classic Facial'],
    },
    {
        id: 'p3',
        name: 'Relaxation Retreat',
        price: 900,
        originalPrice: 1150,
        validity: '14 days',
        sold: 18,
        services: ['Swedish Massage', 'Hot Stone Therapy', 'HydraFacial', 'Body Scrub & Wrap'],
    },
    {
        id: 'p4',
        name: 'Hair Transformation',
        price: 1200,
        originalPrice: 1650,
        validity: '7 days',
        sold: 31,
        services: ['Keratin Treatment', 'Hair Coloring', 'Olaplex Treatment', 'Haircut & Styling'],
    },
];

export default function SalesPage() {
    const [activeTab, setActiveTab] = useState<'services' | 'packages'>('services');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredCategories = categories
        .map((cat) => ({
            ...cat,
            services: cat.services.filter(
                (s) =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.description.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((cat) => cat.services.length > 0);

    return (
        <div className={styles.salesPage}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1>Sales</h1>
                    <p>Browse services and packages to start a booking or quick sale.</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.btnSecondary}>
                        <Star size={16} /> Quick Sale
                    </button>
                    <Link href="/bookings/new" className={styles.btnPrimary}>
                        <Plus size={16} /> New Booking
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'services' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('services')}
                >
                    Services
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'packages' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('packages')}
                >
                    Packages
                </button>
            </div>

            {/* Search + View Toggle */}
            <div className={styles.searchRow}>
                <div className={styles.searchWrapper}>
                    <Search size={16} className={styles.searchIconInline} />
                    <input
                        className={styles.searchInput}
                        placeholder={activeTab === 'services' ? 'Search services...' : 'Search packages...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {activeTab === 'services' && (
                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid3X3 size={16} />
                        </button>
                        <button
                            className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Services Tab */}
            {activeTab === 'services' && (
                <div className="stagger-children">
                    {filteredCategories.map((category) => (
                        <div key={category.name} className={styles.categorySection}>
                            <div className={styles.categoryHeader}>
                                <span className={styles.categoryTitle}>
                                    {category.icon}
                                    {category.name}
                                    <span className={styles.categoryCount}>{category.services.length}</span>
                                </span>
                            </div>
                            <div className={styles.serviceGrid}>
                                {category.services.map((service) => (
                                    <div key={service.id} className={styles.serviceCard}>
                                        <div className={styles.serviceTop}>
                                            <div
                                                className={styles.serviceIcon}
                                                style={{ background: service.categoryColor }}
                                            >
                                                {service.icon}
                                            </div>
                                            <span
                                                className={`${styles.serviceBadge} ${service.active ? styles.badgeActive : styles.badgeInactive
                                                    }`}
                                            >
                                                {service.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className={styles.serviceName}>{service.name}</div>
                                        <div className={styles.serviceDesc}>{service.description}</div>
                                        <div className={styles.serviceMeta}>
                                            <span className={styles.servicePrice}>
                                                {service.price}
                                                <span className={styles.servicePriceCurrency}>EGP</span>
                                            </span>
                                            <span className={styles.serviceDuration}>
                                                <Clock size={14} />
                                                {service.duration} min
                                            </span>
                                        </div>
                                        <div className={styles.serviceActions}>
                                            <button className={`${styles.serviceActionBtn} ${styles.bookBtn}`}>
                                                Book Now
                                            </button>
                                            <button className={`${styles.serviceActionBtn} ${styles.detailBtn}`}>
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Packages Tab */}
            {activeTab === 'packages' && (
                <div className={styles.serviceGrid}>
                    {packages
                        .filter(
                            (pkg) =>
                                pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                pkg.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
                        )
                        .map((pkg) => (
                            <div key={pkg.id} className={styles.packageCard}>
                                <div className={styles.packageHeader}>
                                    <div className={styles.packageName}>{pkg.name}</div>
                                    <div className={styles.packagePrice}>
                                        {pkg.price} EGP
                                        <span className={styles.packageOriginal}>{pkg.originalPrice} EGP</span>
                                    </div>
                                </div>
                                <div className={styles.packageBody}>
                                    <div className={styles.packageServices}>
                                        {pkg.services.map((s, i) => (
                                            <div key={i} className={styles.packageServiceItem}>
                                                <Check size={14} className={styles.packageCheck} />
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.packageFooter}>
                                    <span className={styles.packageValidity}>Valid for {pkg.validity}</span>
                                    <span className={styles.packageSold}>
                                        <Star size={12} /> {pkg.sold} sold
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
