'use client';

import React, { useState } from 'react';
import { DropdownMenu, useToast } from '@/components/ui';
import {
    Search,
    Plus,
    MoreVertical,
    RotateCcw,
    Receipt,
    Wallet,
    CreditCard,
    CheckCircle2,
    XCircle,
    Clock,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './returns.module.css';

const returns = [
    { id: 'RTN-301', date: 'Mar 21, 2026', time: '10:30', type: 'service', originalTxn: 'TXN-2045', client: 'Huda Saleh', item: 'Gel Manicure', reason: 'Client dissatisfied with result', amount: 150, method: 'Cash', status: 'approved', employee: 'Hana Youssef' },
    { id: 'RTN-299', date: 'Mar 25, 2026', time: '11:45', type: 'service', originalTxn: 'TXN-2028', client: 'Noura Ahmed', item: 'Swedish Massage', reason: 'Service not completed – emergency', amount: 300, method: 'Cash', status: 'pending', employee: 'Reem Mohamed' },
    { id: 'RTN-298', date: 'Mar 13, 2026', time: '13:00', type: 'advance', originalTxn: 'TXN-2025', client: 'Rania Khalil', item: 'Bridal Package Down Payment', reason: 'Wedding postponed', amount: 1000, method: 'Card', status: 'approved', employee: 'Nora Ali' },
    { id: 'RTN-296', date: 'Mar 19, 2026', time: '16:30', type: 'petty', originalTxn: 'TXN-2015', client: '—', item: 'Petty Cash Refund – Supplier Overcharge', reason: 'Vendor corrected invoice', amount: 120, method: 'Internal', status: 'approved', employee: 'Admin' },
    { id: 'RTN-295', date: 'Mar 12, 2026', time: '12:00', type: 'service', originalTxn: 'TXN-2010', client: 'Maryam Ibrahim', item: 'HydraFacial', reason: 'Double booking – service cancelled', amount: 450, method: 'Card', status: 'rejected', employee: 'Nora Ali' },
];

export default function ReturnsPage() {
    const { addToast } = useToast();
    const { t, lang } = useTranslation();
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');

    const filteredReturns = returns.filter((r) => {
        const matchSearch = r.client.toLowerCase().includes(search.toLowerCase()) ||
            r.id.toLowerCase().includes(search.toLowerCase()) ||
            r.item.toLowerCase().includes(search.toLowerCase());
        const matchTab = activeTab === 'all' || r.type === activeTab;
        return matchSearch && matchTab;
    });

    const totalRefunded = returns.filter(r => r.status === 'approved').reduce((s, r) => s + r.amount, 0);
    const pendingCount = returns.filter(r => r.status === 'pending').length;

    const typeConfig: Record<string, { bg: string; color: string; label: string }> = {
        service: { bg: 'var(--color-info-light)', color: 'var(--color-info)', label: t('rtn.lblService') },
        advance: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: t('rtn.lblAdvance') },
        petty: { bg: 'var(--color-primary-50)', color: 'var(--color-primary-600)', label: t('rtn.lblPetty') },
    };

    const statusConfig: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
        approved: { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: t('rtn.lblApproved'), icon: <CheckCircle2 size={12} /> },
        pending: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: t('rtn.lblPending'), icon: <Clock size={12} /> },
        rejected: { bg: 'var(--color-error-light)', color: 'var(--color-error)', label: t('rtn.lblRejected'), icon: <XCircle size={12} /> },
    };

    const tabItems = [
        { label: t('rtn.tabAll'), key: 'all', icon: <RotateCcw size={16} /> },
        { label: t('rtn.tabSrvRefunds'), key: 'service', icon: <Receipt size={16} /> },
        { label: t('rtn.tabAdvCancellations'), key: 'advance', icon: <CreditCard size={16} /> },
        { label: t('rtn.tabPetty'), key: 'petty', icon: <Wallet size={16} /> },
    ];

    return (
        <div className={styles.page} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.h1}>{t('rtn.title')}</h1>
                    <p className={styles.sub}>{t('rtn.sub')}</p>
                </div>
                <button className={styles.btnP}><Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('rtn.newBtn')}</button>
            </div>

            <div className={styles.tabs}>
                {tabItems.map((t) => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)} className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            <div className={styles.kpiRow}>
                <div className={styles.kpi}>
                    <div className={styles.kpiL}>{t('rtn.kpiTotal')}</div>
                    <div className={styles.kpiV}>{returns.length}</div>
                </div>
                <div className={styles.kpi}>
                    <div className={styles.kpiL}>{t('rtn.kpiRefunded')}</div>
                    <div className={`${styles.kpiV} ${styles.kpiVError}`} dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{totalRefunded.toLocaleString()} EGP</div>
                </div>
                <div className={styles.kpi}>
                    <div className={styles.kpiL}>{t('rtn.kpiPending')}</div>
                    <div className={`${styles.kpiV} ${styles.kpiVWarning}`}>{pendingCount}</div>
                </div>
                <div className={styles.kpi}>
                    <div className={styles.kpiL}>{t('rtn.kpiAvgTime')}</div>
                    <div className={styles.kpiV} dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>1.2 {lang === 'ar' ? 'أيام' : 'days'}</div>
                </div>
            </div>

            <div className={styles.ctrl}>
                <div className={styles.sw}>
                    <Search size={16} className={styles.si} style={lang === 'ar' ? { right: 12, left: 'auto' } : undefined} />
                    <input className={styles.inp} style={lang === 'ar' ? { paddingRight: 40, paddingLeft: 12 } : undefined} placeholder={t('rtn.searchRtn')} value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.tableResponsive}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th className={styles.th} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('rtn.thRtnNum')}</th>
                                <th className={styles.th} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('rtn.thDate')}</th>
                                <th className={styles.th} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('rtn.thType')}</th>
                                <th className={styles.th} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('rtn.thClient')}</th>
                                <th className={styles.th} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('rtn.thItem')}</th>
                                <th className={styles.th} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('rtn.thReason')}</th>
                                <th className={`${styles.th} ${styles.thRight}`}>{t('rtn.thAmount')}</th>
                                <th className={styles.th} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('rtn.thStatus')}</th>
                                <th className={styles.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReturns.map((r) => {
                                const tp = typeConfig[r.type];
                                const st = statusConfig[r.status];
                                return (
                                    <tr key={r.id} className={`${styles.tr} ${styles.trInteractive}`} onClick={() => addToast('info', `Viewing return ${r.id} details`)}>
                                        <td className={`${styles.td} ${styles.idCell}`}>{r.id}</td>
                                        <td className={styles.td}>
                                            <div className={styles.dateCell}>{r.date}</div>
                                            <div className={styles.timeCell}>{r.time}</div>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.badge} style={{ background: tp.bg, color: tp.color }}>{tp.label}</span>
                                        </td>
                                        <td className={`${styles.td} ${r.client !== '—' ? styles.clientName : ''}`}>
                                            {r.client}
                                        </td>
                                        <td className={`${styles.td} ${styles.truncate}`}>{r.item}</td>
                                        <td className={`${styles.td} ${styles.truncateReason}`}>{r.reason}</td>
                                        <td className={`${styles.td} ${styles.amountRefund}`} dir="ltr" style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
                                            -{r.amount.toLocaleString()} EGP
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.badge} style={{ background: st.bg, color: st.color }}>
                                                {st.icon} {st.label}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <DropdownMenu
                                                trigger={<button className={styles.actionBtn}><MoreVertical size={16} /></button>}
                                                items={[
                                                    { label: t('rtn.actionView'), icon: <Search size={14} />, onClick: () => addToast('info', 'Viewing return details') },
                                                    { label: t('rtn.actionApprove'), icon: <CheckCircle2 size={14} />, onClick: () => addToast('success', 'Return approved') },
                                                    { label: t('rtn.actionReject'), icon: <XCircle size={14} />, onClick: () => addToast('error', 'Return rejected'), destructive: true },
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={styles.pag}>
                    <span className={styles.pageInfo}>
                        {t('exp.showing').replace('{visible}', filteredReturns.length.toString()).replace('{total}', returns.length.toString())}
                    </span>
                </div>
            </div>
        </div>
    );
}
