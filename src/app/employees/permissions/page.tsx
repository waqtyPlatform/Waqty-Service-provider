'use client';

import React from 'react';
import Link from 'next/link';

import { UserCog } from 'lucide-react';

export default function EmployeePermissionsPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Access Permissions</h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>Manage system access and privileges.</p>
            </div>



            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)', textAlign: 'center' }}>
                <UserCog size={64} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)', opacity: 0.5 }} />
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>Access Control</h2>
                <p style={{ color: 'var(--text-tertiary)', maxWidth: 400, margin: '0 auto' }}>
                    Configure what modules and actions employees can access.
                </p>
                <Link href="/settings/roles" style={{ display: 'inline-block', marginTop: 'var(--space-4)', color: 'var(--color-primary-600)', fontWeight: 'var(--font-medium)' }}>
                    Manage Roles & Permissions in Settings →
                </Link>
            </div>
        </div>
    );
}
