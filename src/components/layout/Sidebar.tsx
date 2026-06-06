'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronDown, X } from 'lucide-react';
import styles from './Sidebar.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { buildNavigation, type NavGroup } from '@/lib/navigation';
import { Logo, LogoMark } from '@/components/Logo';

function SidebarInner() {
    const { collapsed, toggleSidebar, mobileOpen, setMobileOpen } = useSidebar();
    const { user } = useAuth();
    const pathname = usePathname();
    const { t } = useTranslation();

    // Single source of truth (src/lib/navigation.tsx): 7 primary groups + a
    // footer cluster, role- and business-type-aware. Memoized so the lookups +
    // allocation don't run on every render (Sidebar re-renders on route change).
    const { primary, footer } = useMemo(
        () => buildNavigation(t, user?.businessType, user?.role),
        [t, user?.businessType, user?.role]
    );

    const allGroups = useMemo(() => [...primary, ...footer], [primary, footer]);

    const [expandedItems, setExpandedItems] = useState<string[]>(() => {
        const matched = allGroups.find(
            item => item.href === pathname || item.children?.some(child => pathname.startsWith(child.href))
        );
        return matched ? [matched.id] : [];
    });

    const toggleExpand = (id: string) => {
        setExpandedItems(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    };

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        if (pathname === href) return true;

        const pathSegments = pathname.split('/').filter(Boolean);
        const hrefSegments = href.split('/').filter(Boolean);
        if (hrefSegments.length > pathSegments.length) return false;

        // Avoid partial matches: '/employees/commissions' shouldn't light up
        // '/employees' if another, more specific link matches the current path.
        const isMatchedByAnotherSpecificLink = allGroups.some(item => {
            if (item.href === pathname && item.href !== href) return true;
            if (item.children?.some(child => child.href === pathname && child.href !== href)) return true;
            return false;
        });
        if (isMatchedByAnotherSpecificLink) return false;

        return pathname.startsWith(href + '/');
    };

    const renderGroup = (item: NavGroup) => {
        const hasChildren = !!item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.id);
        const itemActive = item.href ? isActive(item.href) : item.children?.some(child => isActive(child.href));

        return (
            <li key={item.id} className={styles.navItem}>
                {item.href ? (
                    <Link
                        href={item.href}
                        className={`${styles.navLink} ${itemActive ? styles.active : ''}`}
                        title={collapsed ? item.label : undefined}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                    </Link>
                ) : (
                    <button
                        className={`${styles.navLink} ${itemActive ? styles.active : ''}`}
                        onClick={() => {
                            if (collapsed) {
                                toggleSidebar();
                                setExpandedItems(prev => (prev.includes(item.id) ? prev : [...prev, item.id]));
                            } else {
                                toggleExpand(item.id);
                            }
                        }}
                        title={collapsed ? item.label : undefined}
                        aria-label={item.label}
                        aria-expanded={!collapsed ? isExpanded : undefined}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        {!collapsed && (
                            <>
                                <span className={styles.navLabel}>{item.label}</span>
                                <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}>
                                    <ChevronDown size={16} />
                                </span>
                            </>
                        )}
                    </button>
                )}

                {hasChildren && isExpanded && !collapsed && (
                    <ul className={styles.subNav}>
                        {item.children!.map(child => (
                            <li key={child.href}>
                                <Link
                                    href={child.href}
                                    className={`${styles.subNavLink} ${isActive(child.href) ? styles.subActive : ''}`}
                                >
                                    <span className={styles.subDot} />
                                    {child.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {hasChildren && collapsed && (
                    <div className={styles.tooltip}>
                        <span className={styles.tooltipTitle}>{item.label}</span>
                        <ul className={styles.tooltipList}>
                            {item.children!.map(child => (
                                <li key={child.href}>
                                    <Link
                                        href={child.href}
                                        className={`${styles.tooltipLink} ${isActive(child.href) ? styles.tooltipActive : ''}`}
                                    >
                                        {child.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </li>
        );
    };

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

            <aside
                className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${
                    mobileOpen ? styles.mobileOpen : ''
                }`}
            >
                {/* Header */}
                <div className={styles.header}>
                    {!collapsed ? (
                        <Link href="/" className={styles.logo}>
                            <Logo height={26} color="white" />
                        </Link>
                    ) : (
                        <button
                            className={styles.logoIconBtn}
                            onClick={toggleSidebar}
                            aria-label={t('nav.expandSidebar')}
                        >
                            <div className={styles.logoIcon}>
                                <LogoMark color="#fff" size={20} />
                            </div>
                        </button>
                    )}
                    {!collapsed && (
                        <button
                            className={styles.collapseBtn}
                            onClick={toggleSidebar}
                            aria-label={t('nav.collapseSidebar')}
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}
                    <button
                        className={styles.mobileCloseBtn}
                        onClick={() => setMobileOpen(false)}
                        aria-label={t('nav.closeMenu')}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <ul className={styles.navList}>{primary.map(renderGroup)}</ul>
                    {footer.length > 0 && (
                        <ul className={`${styles.navList} ${styles.navFooter}`}>{footer.map(renderGroup)}</ul>
                    )}
                </nav>
            </aside>
        </>
    );
}

const Sidebar = React.memo(SidebarInner);
export default Sidebar;
