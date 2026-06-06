'use client';

import React, { useState } from 'react';

interface SubTab {
    key: string;
    label: string;
    icon?: React.ReactNode;
}

interface SubTabsProps {
    tabs: SubTab[];
    defaultTab?: string;
    // A panel may be a ReactNode (eager) or a thunk `() => ReactNode` (lazy) — only the
    // active tab's thunk is invoked, so non-active panels aren't even constructed.
    children: Record<string, React.ReactNode | (() => React.ReactNode)>;
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        gap: 'var(--space-1)',
        padding: 'var(--space-1)',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-5)',
        width: 'fit-content',
    },
    tab: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-4)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        color: 'var(--text-secondary)',
        border: 'none',
        background: 'transparent',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
    },
    tabActive: {
        background: 'var(--bg-primary)',
        color: 'var(--color-primary-500)',
        fontWeight: 'var(--font-semibold)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    },
};

export default function SubTabs({ tabs, defaultTab, children }: SubTabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key || '');
    const activePanel = children[activeTab];

    return (
        <>
            <div style={styles.container}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            ...styles.tab,
                            ...(activeTab === tab.key ? styles.tabActive : {}),
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
            {typeof activePanel === 'function' ? activePanel() : activePanel}
        </>
    );
}
