'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    Search,
    Bell,
    Moon,
    Sun,
    Menu,
    ChevronDown,
    User,
    LogOut,
    Settings,
    Building2,
    Languages,
    Calendar,
    UserPlus,
    CreditCard,
    AlertCircle,
    CheckCircle,
    Clock,
} from 'lucide-react';
import styles from './TopBar.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/contexts/ThemeContext';

function TopBarInner() {
    const router = useRouter();
    const { setMobileOpen } = useSidebar();
    const { user, logout } = useAuth();
    const { language, toggleLanguage } = useLanguage();
    const { resolvedTheme, toggleTheme } = useTheme();
    const [activeBranch, setActiveBranch] = useState('main');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [branchMenuOpen, setBranchMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const branchMenuRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const notifications = [
        {
            id: 1,
            icon: <Calendar size={16} />,
            color: 'var(--color-primary-500)',
            title: t('notifications.newBooking') || 'New booking',
            desc: t('notifications.newBookingDesc') || 'Ahmed M. booked a haircut for today at 3:00 PM',
            time: t('notifications.minutesAgo')?.replace('{n}', '5') || '5 min ago',
            unread: true,
            href: '/bookings',
        },
        {
            id: 2,
            icon: <AlertCircle size={16} />,
            color: 'var(--color-error)',
            title: t('notifications.cancellation') || 'Booking cancelled',
            desc: t('notifications.cancellationDesc') || 'Sara K. cancelled her appointment for tomorrow',
            time: t('notifications.minutesAgo')?.replace('{n}', '18') || '18 min ago',
            unread: true,
            href: '/bookings',
        },
        {
            id: 3,
            icon: <CreditCard size={16} />,
            color: 'var(--color-success)',
            title: t('notifications.payment') || 'Payment received',
            desc: t('notifications.paymentDesc') || 'EGP 350 payment confirmed from Omar H.',
            time: t('notifications.hoursAgo')?.replace('{n}', '1') || '1 hour ago',
            unread: true,
            href: '/transactions',
        },
        {
            id: 4,
            icon: <UserPlus size={16} />,
            color: 'var(--color-info, #3b82f6)',
            title: t('notifications.newClient') || 'New client registered',
            desc: t('notifications.newClientDesc') || 'Fatma A. signed up via the booking page',
            time: t('notifications.hoursAgo')?.replace('{n}', '3') || '3 hours ago',
            unread: false,
            href: '/customers',
        },
        {
            id: 5,
            icon: <CheckCircle size={16} />,
            color: 'var(--color-success)',
            title: t('notifications.completed') || 'Service completed',
            desc: t('notifications.completedDesc') || 'Youssef E. completed haircut + beard trim',
            time: t('notifications.hoursAgo')?.replace('{n}', '5') || '5 hours ago',
            unread: false,
            href: '/bookings',
        },
    ];
    const unreadCount = notifications.filter(n => n.unread).length;

    const navigateTo = useCallback(
        (path: string) => {
            router.push(path);
            setUserMenuOpen(false);
            setNotifOpen(false);
            setBranchMenuOpen(false);
        },
        [router],
    );

    const branches = [
        { key: 'main', label: t('branch.main') },
        { key: 'downtown', label: t('branch.downtown') },
        { key: 'mall', label: t('branch.mall') },
    ];

    const handleBranchSelect = useCallback(
        (key: string) => {
            setActiveBranch(key);
            setBranchMenuOpen(false);
        },
        [],
    );

    // Close menus on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
            if (branchMenuRef.current && !branchMenuRef.current.contains(e.target as Node)) {
                setBranchMenuOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Ctrl+K keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchFocused(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <header className={styles.topbar}>
            {/* Mobile menu button */}
            <button className={styles.mobileMenuBtn} onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu size={22} />
            </button>

            {/* Branch Selector */}
            <div className={styles.branchSelector} ref={branchMenuRef}>
                <button className={styles.branchBtn} onClick={() => setBranchMenuOpen(!branchMenuOpen)}>
                    <Building2 size={16} />
                    <span>{branches.find(b => b.key === activeBranch)?.label || t('branch.main')}</span>
                    <ChevronDown size={14} />
                </button>
                {branchMenuOpen && (
                    <div className={styles.branchDropdown}>
                        {branches.map(b => (
                            <button
                                key={b.key}
                                className={`${styles.branchItem} ${activeBranch === b.key ? styles.branchActive : ''}`}
                                onClick={() => handleBranchSelect(b.key)}
                            >
                                <Building2 size={16} />
                                <span>{b.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Search */}
            <div className={`${styles.searchWrapper} ${searchFocused ? styles.searchActive : ''}`}>
                <Search size={16} className={styles.searchIcon} />
                <input
                    className={styles.searchInput}
                    placeholder={t('search.placeholder')}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                />
                <kbd className={styles.searchKbd}>Ctrl+K</kbd>
            </div>

            {/* Right Actions */}
            <div className={styles.actions}>
                {/* Theme toggle */}
                <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle theme">
                    {resolvedTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Language Toggle */}
                <button
                    className={styles.iconBtn}
                    onClick={toggleLanguage}
                    aria-label="Toggle language"
                    title={language === 'en' ? t('user.switchAr') : t('user.switchEn')}
                >
                    <Languages size={20} />
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{language === 'en' ? 'ع' : 'EN'}</span>
                </button>

                {/* Notifications */}
                <div className={styles.notifWrapper} ref={notifRef}>
                    <button
                        className={styles.iconBtn}
                        aria-label="Notifications"
                        onClick={() => setNotifOpen(!notifOpen)}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount}</span>}
                    </button>
                    {notifOpen && (
                        <div className={styles.notifDropdown}>
                            <div className={styles.notifHeader}>
                                <span className={styles.notifTitle}>{t('notifications.title') || 'Notifications'}</span>
                                <button className={styles.notifMarkAll}>
                                    {t('notifications.markAllRead') || 'Mark all read'}
                                </button>
                            </div>
                            <div className={styles.notifList}>
                                {notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className={`${styles.notifItem} ${n.unread ? styles.notifUnread : ''}`}
                                        onClick={() => navigateTo(n.href)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={e => e.key === 'Enter' && navigateTo(n.href)}
                                    >
                                        <div
                                            className={styles.notifIcon}
                                            style={{ background: n.color + '18', color: n.color }}
                                        >
                                            {n.icon}
                                        </div>
                                        <div className={styles.notifContent}>
                                            <span className={styles.notifItemTitle}>{n.title}</span>
                                            <span className={styles.notifDesc}>{n.desc}</span>
                                            <span className={styles.notifTime}>
                                                <Clock size={12} /> {n.time}
                                            </span>
                                        </div>
                                        {n.unread && <div className={styles.notifDot} />}
                                    </div>
                                ))}
                            </div>
                            <div className={styles.notifFooter}>
                                <button className={styles.notifViewAll} onClick={() => navigateTo('/marketing/notifications')}>
                                    {t('notifications.viewAll') || 'View all notifications'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className={styles.userMenu} ref={userMenuRef}>
                    <button className={styles.userBtn} onClick={() => setUserMenuOpen(!userMenuOpen)}>
                        <div className={styles.userAvatar}>{user?.name?.charAt(0) || '?'}</div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{user?.name || t('user.loading')}</span>
                            <span className={styles.userRole} style={{ textTransform: 'capitalize' }}>
                                {user?.role || t('user.guest')}
                            </span>
                        </div>
                        <ChevronDown size={14} />
                    </button>
                    {userMenuOpen && (
                        <div className={styles.userDropdown}>
                            <button className={styles.dropdownItem} onClick={() => navigateTo('/settings/profile')}>
                                <User size={16} />
                                <span>{t('user.profile')}</span>
                            </button>
                            <button className={styles.dropdownItem} onClick={() => navigateTo('/settings')}>
                                <Settings size={16} />
                                <span>{t('user.settings')}</span>
                            </button>
                            <div className={styles.dropdownDivider} />
                            <button className={`${styles.dropdownItem} ${styles.dropdownDanger}`} onClick={logout}>
                                <LogOut size={16} />
                                <span>{t('user.logout')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

const TopBar = React.memo(TopBarInner);
export default TopBar;
