'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function SectionHeader({
    icon,
    label,
    open,
    onToggle,
    required,
}: {
    icon: React.ReactNode;
    label: string;
    open: boolean;
    onToggle: () => void;
    required?: boolean;
}) {
    return (
        <button
            onClick={onToggle}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 'var(--space-2) 0',
                marginBottom: open ? 'var(--space-3)' : 0,
                color: 'var(--text-primary)',
            }}
        >
            <span
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                }}
            >
                {icon}
                {label}
                {required && <span style={{ color: 'var(--color-error)', fontSize: 10 }}>*</span>}
            </span>
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
    );
}
