'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSidebar } from './SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
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
} from 'lucide-react';
import styles from './TopBar.module.css';

export default function TopBar() {
    const { setMobileOpen } = useSidebar();
    const { user, logout } = useAuth();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [branchMenuOpen, setBranchMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const branchMenuRef = useRef<HTMLDivElement>(null);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Close menus on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
            if (branchMenuRef.current && !branchMenuRef.current.contains(e.target as Node)) {
                setBranchMenuOpen(false);
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
            <button
                className={styles.mobileMenuBtn}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
            >
                <Menu size={22} />
            </button>

            {/* Branch Selector */}
            <div className={styles.branchSelector} ref={branchMenuRef}>
                <button
                    className={styles.branchBtn}
                    onClick={() => setBranchMenuOpen(!branchMenuOpen)}
                >
                    <Building2 size={16} />
                    <span>Main Branch</span>
                    <ChevronDown size={14} />
                </button>
                {branchMenuOpen && (
                    <div className={styles.branchDropdown}>
                        <div className={`${styles.branchItem} ${styles.branchActive}`}>
                            <Building2 size={16} />
                            <span>Main Branch</span>
                        </div>
                        <div className={styles.branchItem}>
                            <Building2 size={16} />
                            <span>Downtown Branch</span>
                        </div>
                        <div className={styles.branchItem}>
                            <Building2 size={16} />
                            <span>Mall Branch</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Search */}
            <div className={`${styles.searchWrapper} ${searchFocused ? styles.searchActive : ''}`}>
                <Search size={16} className={styles.searchIcon} />
                <input
                    className={styles.searchInput}
                    placeholder="Search anything..."
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                />
                <kbd className={styles.searchKbd}>Ctrl+K</kbd>
            </div>

            {/* Right Actions */}
            <div className={styles.actions}>
                {/* Theme toggle */}
                <button
                    className={styles.iconBtn}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Notifications */}
                <button className={styles.iconBtn} aria-label="Notifications">
                    <Bell size={20} />
                    <span className={styles.notifBadge}>3</span>
                </button>

                {/* User Menu */}
                <div className={styles.userMenu} ref={userMenuRef}>
                    <button
                        className={styles.userBtn}
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                    >
                        <div className={styles.userAvatar}>{user?.name?.charAt(0) || '?'}</div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{user?.name || 'Loading...'}</span>
                            <span className={styles.userRole} style={{ textTransform: 'capitalize' }}>{user?.role || 'Guest'}</span>
                        </div>
                        <ChevronDown size={14} />
                    </button>
                    {userMenuOpen && (
                        <div className={styles.userDropdown}>
                            <button className={styles.dropdownItem}>
                                <User size={16} />
                                <span>Profile</span>
                            </button>
                            <button className={styles.dropdownItem}>
                                <Settings size={16} />
                                <span>Settings</span>
                            </button>
                            <div className={styles.dropdownDivider} />
                            <button className={`${styles.dropdownItem} ${styles.dropdownDanger}`} onClick={logout}>
                                <LogOut size={16} />
                                <span>Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
