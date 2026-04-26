'use client';

import React, { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    BookOpen,
    Calendar,
    Users,
    CreditCard,
    Settings,
    BarChart3,
    MessageSquare,
    Mail,
    Bug,
} from 'lucide-react';
import { Input } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@hagzy.com';
const SUPPORT_WHATSAPP_DISPLAY = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_DISPLAY || '+20 100 000 0000';
const SUPPORT_WHATSAPP_DIGITS =
    process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_DIGITS || SUPPORT_WHATSAPP_DISPLAY.replace(/\D/g, '');

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqCategory {
    title: string;
    icon: React.ReactNode;
    items: FaqItem[];
}

const faqCategories: FaqCategory[] = [
    {
        title: 'Getting Started',
        icon: <BookOpen size={20} />,
        items: [
            {
                question: 'How do I set up my business on Hagzy?',
                answer: 'Complete the 3-step onboarding process: create your account, enter your business details (name, type, location), and add the services you offer. You can always edit these later from Settings.',
            },
            {
                question: 'How do I add employees?',
                answer: 'Go to Employees > click "Add Employee" > fill in their details (name, email, phone, branch). They will receive an invite to set up their account on the SP App.',
            },
            {
                question: 'How do I configure my business hours?',
                answer: 'Navigate to Settings > Business Hours. Set open/close times and break periods for each day of the week per branch.',
            },
        ],
    },
    {
        title: 'Bookings',
        icon: <Calendar size={20} />,
        items: [
            {
                question: 'How do I create a new booking?',
                answer: 'Go to Bookings > click "New Booking" > select the service, employee, date, and time. The system will show available slots based on employee schedules and existing bookings.',
            },
            {
                question: 'How do I cancel or reschedule a booking?',
                answer: 'Open the booking detail page, click "Cancel" with a reason, or click "Edit" to change the date/time. Customers will be notified of the change.',
            },
            {
                question: 'What do the booking statuses mean?',
                answer: "Confirmed = accepted, Arrived = customer is here, In Service = appointment in progress, Completed = service done, Cancelled = cancelled, No-Show = customer didn't show up.",
            },
        ],
    },
    {
        title: 'Customers',
        icon: <Users size={20} />,
        items: [
            {
                question: 'How do I manage customer groups?',
                answer: 'Go to Customers > Groups. Create groups like VIP, Regular, Corporate with different discount percentages. Assign customers to groups from their profile.',
            },
            {
                question: 'Can I add notes about a customer?',
                answer: 'Yes, open the customer detail page and use the Staff Notes tab. Notes are visible to employees but not to customers.',
            },
        ],
    },
    {
        title: 'Payments & Financial',
        icon: <CreditCard size={20} />,
        items: [
            {
                question: 'What payment methods are supported?',
                answer: 'Cash, Card, and Wallet payments are supported. Configure payment methods in Settings > Payment Methods.',
            },
            {
                question: 'How do I process a refund?',
                answer: 'Go to Returns > select the return type (Cash Refund, Cancel Down Payment, or Petty Cash Refund) > enter details > submit for approval.',
            },
            {
                question: 'How does the commission system work?',
                answer: 'Set up commission rules in Employees > Commission Settings. Define rates per service, target-based bonuses, and extraction rules. Commissions are automatically calculated in payroll.',
            },
        ],
    },
    {
        title: 'Reports',
        icon: <BarChart3 size={20} />,
        items: [
            {
                question: 'What reports are available?',
                answer: 'Revenue, Bookings, Customers, Services, Employees, and Financial reports. Filter by date range and branch. Export as CSV or PDF.',
            },
            {
                question: 'How often are reports updated?',
                answer: 'Reports reflect real-time data. Dashboard KPIs update as transactions and bookings are recorded.',
            },
        ],
    },
    {
        title: 'Settings',
        icon: <Settings size={20} />,
        items: [
            {
                question: 'How do I change my subscription plan?',
                answer: 'Go to Settings > Subscription to view plans (499/999/1999 EGP per month). You can upgrade or downgrade at any time.',
            },
            {
                question: 'How do I enable dark mode?',
                answer: 'Go to Settings > Appearance and toggle the theme. Your preference is saved and applied across all sessions.',
            },
            {
                question: 'Can I use the dashboard in Arabic?',
                answer: 'Yes! Click the language toggle in the top bar to switch between English and Arabic. The entire dashboard supports RTL layout.',
            },
        ],
    },
];

export default function HelpPage() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const filteredCategories = faqCategories
        .map(cat => ({
            ...cat,
            items: cat.items.filter(item => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
            }),
        }))
        .filter(cat => cat.items.length > 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 800 }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('help.title')}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
                    {t('help.subtitle')}
                </p>
            </div>

            {/* Search */}
            <Input
                placeholder={t('help.search')}
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />

            {/* Quick Actions */}
            <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}
            >
                <Link href="/help/bug-report" style={{ textDecoration: 'none' }}>
                    <div
                        style={{
                            padding: '1rem',
                            background: 'var(--bg-surface)',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'border-color 0.2s',
                        }}
                    >
                        <Bug size={20} color="var(--color-error-500)" />
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                {t('help.bugReport')}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                Found an issue? Let us know
                            </div>
                        </div>
                    </div>
                </Link>
                <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        padding: '1rem',
                        background: 'var(--bg-surface)',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    <Mail size={20} color="var(--color-primary-500)" />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('help.contactSupport')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{SUPPORT_EMAIL}</div>
                    </div>
                </a>
                <a
                    href={`https://wa.me/${SUPPORT_WHATSAPP_DIGITS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        padding: '1rem',
                        background: 'var(--bg-surface)',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    <MessageSquare size={20} color="var(--color-success-500)" />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>WhatsApp</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            {SUPPORT_WHATSAPP_DISPLAY}
                        </div>
                    </div>
                </a>
            </div>

            {/* FAQ Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredCategories.map((cat, catIndex) => (
                    <div
                        key={catIndex}
                        style={{
                            background: 'var(--bg-surface)',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border)',
                            overflow: 'hidden',
                        }}
                    >
                        <button
                            onClick={() => setExpandedCategory(expandedCategory === catIndex ? null : catIndex)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem 1.25rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-primary)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ color: 'var(--color-primary-500)' }}>{cat.icon}</span>
                                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{cat.title}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                    ({cat.items.length})
                                </span>
                            </div>
                            {expandedCategory === catIndex ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        {expandedCategory === catIndex && (
                            <div style={{ borderTop: '1px solid var(--border)' }}>
                                {cat.items.map((item, itemIndex) => {
                                    const key = `${catIndex}-${itemIndex}`;
                                    return (
                                        <div key={key}>
                                            <button
                                                onClick={() => setExpandedItem(expandedItem === key ? null : key)}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '0.875rem 1.25rem',
                                                    background: 'none',
                                                    border: 'none',
                                                    borderTop: itemIndex > 0 ? '1px solid var(--border)' : 'none',
                                                    cursor: 'pointer',
                                                    color: 'var(--text-primary)',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                                    {item.question}
                                                </span>
                                                {expandedItem === key ? (
                                                    <ChevronDown size={16} />
                                                ) : (
                                                    <ChevronRight size={16} />
                                                )}
                                            </button>
                                            {expandedItem === key && (
                                                <div
                                                    style={{
                                                        padding: '0 1.25rem 1rem',
                                                        fontSize: '0.8125rem',
                                                        color: 'var(--text-secondary)',
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    {item.answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
