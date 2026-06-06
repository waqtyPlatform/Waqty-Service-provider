'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { Search, Plus, UserPlus, ShoppingBag, Wallet, CalendarPlus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { buildNavigation } from '@/lib/navigation';

interface CommandEntry {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    keywords?: string[];
}

// Other surfaces (e.g. the TopBar search box) dispatch this event to summon the palette.
export const PALETTE_EVENT = 'waqty:command-palette';

const sized = (icon: React.ReactNode) =>
    React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 16 }) : icon;

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();
    const { user } = useAuth();

    // Open via Ctrl/Cmd+K or the custom event; Escape closes.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                setOpen(p => !p);
            } else if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        const onOpen = () => setOpen(true);
        document.addEventListener('keydown', onKey);
        window.addEventListener(PALETTE_EVENT, onOpen);
        return () => {
            document.removeEventListener('keydown', onKey);
            window.removeEventListener(PALETTE_EVENT, onOpen);
        };
    }, []);

    const handleSelect = useCallback(
        (href: string) => {
            setOpen(false);
            router.push(href);
        },
        [router]
    );

    // Actions — the fast path to *do*, not just navigate.
    const actions: CommandEntry[] = useMemo(
        () => [
            {
                id: 'act-new-booking',
                label: t('cmd.newBooking'),
                href: '/bookings/new',
                icon: <CalendarPlus size={16} />,
                keywords: ['create', 'appointment', 'new'],
            },
            {
                id: 'act-add-client',
                label: t('cmd.addClient'),
                href: '/customers',
                icon: <UserPlus size={16} />,
                keywords: ['customer', 'patient', 'new'],
            },
            {
                id: 'act-new-sale',
                label: t('cmd.newSale'),
                href: '/sales',
                icon: <ShoppingBag size={16} />,
                keywords: ['checkout', 'pos', 'sell'],
            },
            {
                id: 'act-record-expense',
                label: t('cmd.recordExpense'),
                href: '/expenses',
                icon: <Wallet size={16} />,
                keywords: ['cost', 'spend'],
            },
            {
                id: 'act-add-service',
                label: t('cmd.addNewService'),
                href: '/settings/services/new',
                icon: <Plus size={16} />,
                keywords: ['catalog'],
            },
        ],
        [t]
    );

    // Navigation commands generated from the single nav manifest (role/business aware,
    // always in sync with the sidebar — no hand-maintained list to drift).
    const navSections = useMemo(() => {
        const { primary, footer } = buildNavigation(t, user?.businessType, user?.role);
        const groups = [...primary, ...footer];
        const sections: { heading: string; items: CommandEntry[] }[] = [];
        const direct: CommandEntry[] = [];
        for (const g of groups) {
            if (g.href && (!g.children || g.children.length === 0)) {
                direct.push({ id: g.id, label: g.label, href: g.href, icon: g.icon });
            } else if (g.children && g.children.length) {
                sections.push({
                    heading: g.label,
                    items: g.children.map(c => ({
                        id: c.href,
                        label: c.label,
                        href: c.href,
                        icon: g.icon,
                        keywords: [g.label],
                    })),
                });
            }
        }
        if (direct.length) sections.unshift({ heading: t('cmd.groupNavigation'), items: direct });
        return sections;
    }, [t, user?.businessType, user?.role]);

    if (!open) return null;

    const renderItem = (item: CommandEntry) => (
        <Command.Item
            key={item.id}
            value={`${item.label} ${item.keywords?.join(' ') ?? ''}`}
            onSelect={() => handleSelect(item.href)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
            }}
        >
            <span style={{ color: 'var(--text-tertiary)', flexShrink: 0, display: 'inline-flex' }}>
                {sized(item.icon)}
            </span>
            <span>{item.label}</span>
        </Command.Item>
    );

    return (
        <>
            {/* Keyboard-selected + hover highlight (cmdk sets data-selected on the active item). */}
            <style>{`
                [cmdk-group-heading] {
                    font-size: var(--text-xs);
                    font-weight: var(--font-semibold);
                    text-transform: uppercase;
                    letter-spacing: var(--tracking-wide);
                    color: var(--text-tertiary);
                    padding: var(--space-2) var(--space-3);
                }
                [cmdk-item][data-selected='true'],
                [cmdk-item]:hover { background: var(--bg-secondary); }
                [cmdk-item][data-selected='true'] { box-shadow: inset 2px 0 0 var(--color-primary-500); }
            `}</style>

            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'var(--bg-overlay)',
                    backdropFilter: 'blur(2px)',
                    zIndex: 'var(--z-overlay)' as React.CSSProperties['zIndex'],
                    animation: 'fadeIn 150ms ease',
                }}
                onClick={() => setOpen(false)}
            />

            {/* Command Dialog */}
            <div
                style={{
                    position: 'fixed',
                    top: '16%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: 580,
                    zIndex: 'var(--z-modal)' as React.CSSProperties['zIndex'],
                    animation: 'scaleIn 150ms ease both',
                    padding: '0 var(--space-4)',
                }}
            >
                <Command
                    style={{
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-xl)',
                        overflow: 'hidden',
                    }}
                    label={t('cmd.label')}
                >
                    {/* Search Input */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-4) var(--space-5)',
                            borderBottom: '1px solid var(--border-color)',
                        }}
                    >
                        <Search size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                        <Command.Input
                            autoFocus
                            placeholder={t('cmd.searchPlaceholder')}
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                background: 'transparent',
                                fontSize: 'var(--text-base)',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-sans)',
                            }}
                        />
                        <kbd
                            style={{
                                padding: '2px var(--space-2)',
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-tertiary)',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)',
                            }}
                        >
                            ESC
                        </kbd>
                    </div>

                    {/* Results */}
                    <Command.List style={{ maxHeight: 420, overflowY: 'auto', padding: 'var(--space-2)' }}>
                        <Command.Empty
                            style={{
                                padding: 'var(--space-8)',
                                textAlign: 'center',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-tertiary)',
                            }}
                        >
                            {t('cmd.noResults')}
                        </Command.Empty>

                        <Command.Group heading={t('cmd.groupQuickActions')}>{actions.map(renderItem)}</Command.Group>

                        {navSections.map(section => (
                            <Command.Group key={section.heading} heading={section.heading}>
                                {section.items.map(renderItem)}
                            </Command.Group>
                        ))}
                    </Command.List>

                    {/* Footer */}
                    <div
                        style={{
                            padding: 'var(--space-2) var(--space-4)',
                            borderTop: '1px solid var(--border-color)',
                            display: 'flex',
                            gap: 'var(--space-4)',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                        }}
                    >
                        <span>↑↓ {t('cmd.footerNavigate')}</span>
                        <span>↵ {t('cmd.footerOpen')}</span>
                        <span>ESC {t('cmd.footerClose')}</span>
                    </div>
                </Command>
            </div>
        </>
    );
}
