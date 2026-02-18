'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Plus,
    Download,
    AlertTriangle,
    Package,
    BarChart3,
    RotateCcw,
    Truck,
    Box,
    Archive,
} from 'lucide-react';

const products = [
    { id: 'P001', name: 'L\'Oréal Hair Color – Natural Brown', sku: 'LRHC-NB-001', category: 'Hair Color', stock: 24, minStock: 10, price: 85, cost: 55, status: 'in-stock' },
    { id: 'P002', name: 'Olaplex No.3 Hair Perfector', sku: 'OPX3-HP-001', category: 'Hair Treatment', stock: 8, minStock: 10, price: 250, cost: 150, status: 'low' },
    { id: 'P003', name: 'Dermalogica Daily Microfoliant', sku: 'DRM-DMF-001', category: 'Skincare', stock: 15, minStock: 5, price: 320, cost: 200, status: 'in-stock' },
    { id: 'P004', name: 'OPI Infinite Shine – Berry Ballet', sku: 'OPI-IS-BB1', category: 'Nail Polish', stock: 32, minStock: 15, price: 65, cost: 35, status: 'in-stock' },
    { id: 'P005', name: 'Wella Professional Keratin Treatment', sku: 'WP-KT-001', category: 'Hair Treatment', stock: 3, minStock: 5, price: 180, cost: 120, status: 'low' },
    { id: 'P006', name: 'Massage Oil – Lavender Blend', sku: 'MO-LB-001', category: 'Body Care', stock: 0, minStock: 5, price: 120, cost: 60, status: 'out' },
    { id: 'P007', name: 'Dyson Airwrap Complete', sku: 'DYS-AW-001', category: 'Equipment', stock: 2, minStock: 1, price: 15000, cost: 12000, status: 'in-stock' },
    { id: 'P008', name: 'Disposable Gloves – Box of 100', sku: 'DG-100-001', category: 'Supplies', stock: 45, minStock: 20, price: 80, cost: 40, status: 'in-stock' },
];

const statusMap: Record<string, { bg: string; color: string; label: string }> = {
    'in-stock': { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'In Stock' },
    low: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: 'Low Stock' },
    out: { bg: 'var(--color-error-light)', color: 'var(--color-error)', label: 'Out of Stock' },
};

const tabItems = [
    { label: 'Products', href: '/inventory', icon: <Package size={16} /> },
    { label: 'Stock Levels', href: '/inventory/stock', icon: <BarChart3 size={16} /> },
    { label: 'Purchase Orders', href: '/inventory/orders', icon: <Truck size={16} /> },
    { label: 'Stock Adjustments', href: '/inventory/adjustments', icon: <RotateCcw size={16} /> },
    { label: 'Categories', href: '/inventory/categories', icon: <Box size={16} /> },
    { label: 'Warehouse', href: '/inventory/warehouse', icon: <Archive size={16} /> },
];

export default function InventoryPage() {
    const [search, setSearch] = useState('');
    const [stockFilter, setStockFilter] = useState('all');

    const filtered = products.filter((p) => {
        const matchSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase());
        const matchStock = stockFilter === 'all' || p.status === stockFilter;
        return matchSearch && matchStock;
    });

    const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);
    const lowCount = products.filter((p) => p.status === 'low').length;
    const outCount = products.filter((p) => p.status === 'out').length;

    const cs: Record<string, React.CSSProperties> = {
        page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
        h1: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
        sub: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' },
        row: { display: 'flex', gap: 'var(--space-3)' },
        btnP: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
        btnO: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' },
        tabs: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
        tab: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', textDecoration: 'none', whiteSpace: 'nowrap' as const },
        tabA: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
        kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' },
        kpi: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' },
        kpiL: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
        kpiV: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginTop: 'var(--space-1)' },
        ctrl: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' as const, alignItems: 'center' },
        sw: { position: 'relative' as const, flex: '1', minWidth: 200, maxWidth: 320 },
        si: { position: 'absolute' as const, left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' as const },
        inp: { width: '100%', height: 40, padding: '0 var(--space-4) 0 36px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
        sel: { height: 40, padding: '0 var(--space-8) 0 var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', cursor: 'pointer' },
        card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
        th: { textAlign: 'left' as const, padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' as const },
        td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle' as const },
        badge: { display: 'inline-flex', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' },
        bar: { height: 6, borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)', width: 60, overflow: 'hidden' },
    };

    return (
        <div style={cs.page}>
            <div style={cs.header}>
                <div>
                    <h1 style={cs.h1}>Inventory</h1>
                    <p style={cs.sub}>Manage products, stock levels, and purchase orders.</p>
                </div>
                <div style={cs.row}>
                    <button style={cs.btnO}><Download size={16} /> Export</button>
                    <button style={cs.btnP}><Plus size={16} /> Add Product</button>
                </div>
            </div>

            <div style={cs.tabs}>
                {tabItems.map((t) => (
                    <Link key={t.href} href={t.href} style={t.href === '/inventory' ? { ...cs.tab, ...cs.tabA } : cs.tab}>
                        {t.icon} {t.label}
                    </Link>
                ))}
            </div>

            <div style={cs.kpiGrid}>
                <div style={cs.kpi}>
                    <div style={cs.kpiL}>Total Products</div>
                    <div style={cs.kpiV}>{products.length}</div>
                </div>
                <div style={cs.kpi}>
                    <div style={cs.kpiL}>Inventory Value</div>
                    <div style={{ ...cs.kpiV, color: 'var(--color-primary-600)' }}>{totalValue.toLocaleString()} EGP</div>
                </div>
                <div style={cs.kpi}>
                    <div style={cs.kpiL}>Low Stock Alerts</div>
                    <div style={{ ...cs.kpiV, color: 'var(--color-warning)' }}>{lowCount}</div>
                </div>
                <div style={cs.kpi}>
                    <div style={cs.kpiL}>Out of Stock</div>
                    <div style={{ ...cs.kpiV, color: 'var(--color-error)' }}>{outCount}</div>
                </div>
            </div>

            <div style={cs.ctrl}>
                <div style={cs.sw}>
                    <Search size={16} style={cs.si} />
                    <input style={cs.inp} placeholder="Search products or SKU..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select style={cs.sel} value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                    <option value="all">All Stock Levels</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low">Low Stock</option>
                    <option value="out">Out of Stock</option>
                </select>
            </div>

            <div style={cs.card}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={cs.th}>Product</th>
                            <th style={cs.th}>SKU</th>
                            <th style={cs.th}>Category</th>
                            <th style={cs.th}>Stock</th>
                            <th style={cs.th}>Min</th>
                            <th style={{ ...cs.th, textAlign: 'right' }}>Cost</th>
                            <th style={{ ...cs.th, textAlign: 'right' }}>Price</th>
                            <th style={cs.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p) => {
                            const st = statusMap[p.status];
                            const stockPct = Math.min((p.stock / (p.minStock * 3)) * 100, 100);
                            return (
                                <tr key={p.id} style={{ transition: 'background var(--transition-fast)' }}>
                                    <td style={{ ...cs.td, fontWeight: 'var(--font-medium)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            {p.name}
                                            {p.status === 'low' && <AlertTriangle size={14} style={{ color: 'var(--color-warning)' }} />}
                                            {p.status === 'out' && <AlertTriangle size={14} style={{ color: 'var(--color-error)' }} />}
                                        </div>
                                    </td>
                                    <td style={{ ...cs.td, fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{p.sku}</td>
                                    <td style={cs.td}>{p.category}</td>
                                    <td style={cs.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <span style={{ fontWeight: 'var(--font-semibold)', minWidth: 24 }}>{p.stock}</span>
                                            <div style={cs.bar}>
                                                <div style={{ height: '100%', borderRadius: 'var(--radius-full)', width: `${stockPct}%`, background: p.status === 'out' ? 'var(--color-error)' : p.status === 'low' ? 'var(--color-warning)' : 'var(--color-success)' }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ ...cs.td, color: 'var(--text-tertiary)' }}>{p.minStock}</td>
                                    <td style={{ ...cs.td, textAlign: 'right', color: 'var(--text-tertiary)' }}>{p.cost} EGP</td>
                                    <td style={{ ...cs.td, textAlign: 'right', fontWeight: 'var(--font-semibold)' }}>{p.price} EGP</td>
                                    <td style={cs.td}>
                                        <span style={{ ...cs.badge, background: st.bg, color: st.color }}>{st.label}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
