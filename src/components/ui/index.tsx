'use client';

import React, { useState, useCallback, useEffect, createContext, useContext, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    Search,
    ChevronRight,
    ChevronLeft,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Check,
    Plus,
    MoreVertical,
    AlertTriangle,
    Info,
    RefreshCw,
    Inbox,
    CheckCircle2,
    CircleDot,
    Clock,
    XCircle,
    Circle,
} from 'lucide-react';
import styles from './ui.module.css';

// ─── Shared overlay behaviour ────────────────────────────────────────
// Lock body scroll + close on Escape while an overlay (Modal/SlideOver) is open.
function useLockBodyAndEscape(open: boolean, onClose: () => void) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);
}

// ─── Button ──────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    iconOnly?: boolean;
    loading?: boolean;
}

export function Button({
    variant = 'primary',
    size = 'md',
    fullWidth,
    iconOnly,
    loading = false,
    disabled,
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${iconOnly ? styles.iconOnly : ''} ${className || ''}`}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...props}
        >
            {loading && <span className={styles.btnSpinner} aria-hidden="true" />}
            {children}
        </button>
    );
}

// ─── Badge ───────────────────────────────────────────────────────────
type BadgeColor = 'success' | 'error' | 'destructive' | 'warning' | 'info' | 'neutral' | 'primary' | 'purple' | 'amber';

interface BadgeProps {
    color?: BadgeColor;
    size?: 'sm' | 'md';
    children: ReactNode;
    style?: React.CSSProperties;
}

export function Badge({ color = 'neutral', size = 'md', children, style }: BadgeProps) {
    const colorMap: Record<BadgeColor, string> = {
        success: styles.badgeSuccess,
        error: styles.badgeError,
        destructive: styles.badgeError, // Alias for error
        warning: styles.badgeWarning,
        info: styles.badgeInfo,
        neutral: styles.badgeNeutral,
        primary: styles.badgePrimary,
        purple: styles.badgePurple,
        amber: styles.badgeAmber,
    };
    const sizeClass = size === 'sm' ? styles.badgeSm : '';
    return (
        <span className={`${styles.badge} ${colorMap[color]} ${sizeClass}`} style={style}>
            {children}
        </span>
    );
}

// ─── Switch ──────────────────────────────────────────────────────────
// Unified toggle used everywhere in the dashboard. Renders a proper ARIA switch
// (role="switch" + aria-checked) backed by a real <button> so keyboard users can
// toggle with Space/Enter. Supports controlled (sync with `checked` prop) and
// uncontrolled use (falls back to internal state when `onChange` is omitted).
interface SwitchProps {
    checked?: boolean;
    onChange?: (val: boolean) => void;
    label?: string;
    disabled?: boolean;
    'aria-label'?: string;
}

export function Switch({ checked = false, onChange, label, disabled = false, ...rest }: SwitchProps) {
    const isControlled = onChange !== undefined;
    const [internalOn, setInternalOn] = useState(checked);
    const on = isControlled ? checked : internalOn;

    const handleToggle = () => {
        if (disabled) return;
        const next = !on;
        if (!isControlled) setInternalOn(next);
        onChange?.(next);
    };

    return (
        <label
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
            }}
        >
            <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={rest['aria-label'] ?? label}
                disabled={disabled}
                onClick={handleToggle}
                className={`${styles.toggle} ${on ? styles.toggleOn : styles.toggleOff}`}
                style={{ border: 'none', padding: 0 }}
            >
                <span className={`${styles.toggleDot} ${on ? styles.toggleDotOn : styles.toggleDotOff}`} />
            </button>
            {label && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{label}</span>}
        </label>
    );
}

// ─── Input ───────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, hint, error, className, ...props },
    ref
) {
    return (
        <div className={styles.inputWrapper}>
            {label && <label className={styles.inputLabel}>{label}</label>}
            <input
                ref={ref}
                className={`${styles.input} ${error ? styles.inputHasError : ''} ${className || ''}`}
                aria-invalid={error ? true : undefined}
                {...props}
            />
            {hint && !error && <span className={styles.inputHint}>{hint}</span>}
            {error && <span className={styles.inputError}>{error}</span>}
        </div>
    );
});

// ─── Select ──────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
    { label, options, className, ...props },
    ref
) {
    return (
        <div className={styles.inputWrapper}>
            {label && <label className={styles.inputLabel}>{label}</label>}
            <select ref={ref} className={`${styles.selectField} ${className || ''}`} {...props}>
                {options.map(o => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
});

// ─── Textarea ────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
    { label, className, ...props },
    ref
) {
    return (
        <div className={styles.inputWrapper}>
            {label && <label className={styles.inputLabel}>{label}</label>}
            <textarea ref={ref} className={`${styles.textareaField} ${className || ''}`} {...props} />
        </div>
    );
});

// ─── Checkbox ────────────────────────────────────────────────────────
interface CheckboxProps {
    checked?: boolean;
    onChange?: (val: boolean) => void;
    label: string;
}

export function Checkbox({ checked = false, onChange, label }: CheckboxProps) {
    const [on, setOn] = useState(checked);
    const toggle = () => {
        const n = !on;
        setOn(n);
        onChange?.(n);
    };
    return (
        <div className={styles.checkbox} onClick={toggle}>
            <div className={`${styles.checkboxInput} ${on ? styles.checkboxChecked : ''}`}>
                {on && <Check size={12} />}
            </div>
            {label}
        </div>
    );
}

// ─── Modal ───────────────────────────────────────────────────────────
interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
    useLockBodyAndEscape(open, onClose);
    if (!open) return null;
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={e => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitle}>{title}</div>
                    <button className={styles.modalClose} onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>
                </div>
                <div className={styles.modalBody}>{children}</div>
                {footer && <div className={styles.modalFooter}>{footer}</div>}
            </div>
        </div>
    );
}

// ─── SlideOver ────────────────────────────────────────────────────────
interface SlideOverProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
}

export function SlideOver({ open, onClose, title, children, footer }: SlideOverProps) {
    useLockBodyAndEscape(open, onClose);
    if (!open) return null;
    return (
        <>
            <div className={styles.slideOverOverlay} onClick={onClose} />
            <div className={styles.slideOver} role="dialog" aria-modal="true" aria-label={title}>
                <div className={styles.slideOverHeader}>
                    <div className={styles.modalTitle}>{title}</div>
                    <button className={styles.modalClose} onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>
                </div>
                <div className={styles.slideOverBody}>{children}</div>
                {footer && <div className={styles.slideOverFooter}>{footer}</div>}
            </div>
        </>
    );
}

// ─── EmptyState ──────────────────────────────────────────────────────
interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>{icon}</div>
            <div className={styles.emptyTitle}>{title}</div>
            <div className={styles.emptyDesc}>{description}</div>
            {action}
        </div>
    );
}

// ─── Skeleton ────────────────────────────────────────────────────────
interface SkeletonProps {
    variant?: 'text' | 'title' | 'circle' | 'card';
    width?: number | string;
    height?: number | string;
}

export function Skeleton({ variant = 'text', width, height }: SkeletonProps) {
    const variantClass = {
        text: styles.skeletonText,
        title: styles.skeletonTitle,
        circle: styles.skeletonCircle,
        card: styles.skeletonCard,
    };
    return <div className={`${styles.skeleton} ${variantClass[variant]}`} style={{ width, height }} />;
}

// ─── Toast System ────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'warning' | 'info';
interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
    undoAction?: () => void;
}

const ToastCtx = createContext<{ addToast: (type: ToastType, message: string, undoAction?: () => void) => void }>({
    addToast: () => {},
});

export function useToast() {
    return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = useCallback((type: ToastType, message: string, undoAction?: () => void) => {
        const id = Math.random().toString(36).slice(2);
        setToasts(prev => [...prev, { id, type, message, undoAction }]);
        // Errors persist until dismissed; success/info/warning auto-dismiss after 5s.
        if (type !== 'error') {
            setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
        }
    }, []);

    const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

    const typeClass = {
        success: styles.toastSuccess,
        error: styles.toastError,
        warning: styles.toastWarning,
        info: styles.toastInfo,
    };

    return (
        <ToastCtx.Provider value={{ addToast }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.length > 1 && (
                    <button type="button" className={styles.toastDismissAll} onClick={() => setToasts([])}>
                        Dismiss all
                    </button>
                )}
                {toasts.map(t => (
                    <div key={t.id} className={`${styles.toast} ${typeClass[t.type]}`} role="status">
                        <span>{t.message}</span>
                        {t.undoAction && (
                            <button
                                type="button"
                                className={styles.toastUndo}
                                onClick={() => {
                                    t.undoAction?.();
                                    remove(t.id);
                                }}
                            >
                                Undo
                            </button>
                        )}
                        <button
                            type="button"
                            className={styles.toastClose}
                            onClick={() => remove(t.id)}
                            aria-label="Dismiss"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastCtx.Provider>
    );
}

// ─── Breadcrumbs ─────────────────────────────────────────────────────
interface BreadcrumbItem {
    label: string;
    href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav className={styles.breadcrumbs}>
            {items.map((item, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <ChevronRight size={14} className={styles.breadcrumbSep} />}
                    {item.href ? (
                        <a href={item.href} className={styles.breadcrumbItem}>
                            {item.label}
                        </a>
                    ) : (
                        <span className={`${styles.breadcrumbItem} ${styles.breadcrumbCurrent}`}>{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}

// ─── Tabs ────────────────────────────────────────────────────────────
interface TabItem {
    key: string;
    label: string;
    icon?: ReactNode;
}

interface TabsProps {
    items: TabItem[];
    active: string;
    onChange: (key: string) => void;
}

export function Tabs({ items, active, onChange }: TabsProps) {
    return (
        <div className={styles.tabGroup}>
            {items.map(tab => (
                <button
                    key={tab.key}
                    className={`${styles.tabItem} ${active === tab.key ? styles.tabItemActive : ''}`}
                    onClick={() => onChange(tab.key)}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
        </div>
    );
}

// ─── Stepper ─────────────────────────────────────────────────────────
interface StepperProps {
    steps: string[];
    current: number;
}

export function Stepper({ steps, current }: StepperProps) {
    return (
        <div className={styles.stepper}>
            {steps.map((step, i) => (
                <React.Fragment key={i}>
                    {i > 0 && (
                        <div className={`${styles.stepConnector} ${i <= current ? styles.stepConnectorDone : ''}`} />
                    )}
                    <div className={styles.step}>
                        <div
                            className={`${styles.stepCircle} ${i < current ? styles.stepDone : i === current ? styles.stepActive : styles.stepPending}`}
                        >
                            {i < current ? <Check size={14} /> : i + 1}
                        </div>
                        <span className={i === current ? styles.stepLabelActive : styles.stepLabel}>{step}</span>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

// ─── FAB ─────────────────────────────────────────────────────────────
interface FABAction {
    label: string;
    icon: ReactNode;
    onClick: () => void;
}

export function FAB({ actions }: { actions: FABAction[] }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            {open && (
                <div className={styles.fabMenu}>
                    {actions.map((a, i) => (
                        <button
                            key={i}
                            className={styles.fabItem}
                            onClick={() => {
                                a.onClick();
                                setOpen(false);
                            }}
                        >
                            {a.icon} {a.label}
                        </button>
                    ))}
                </div>
            )}
            <button className={styles.fab} onClick={() => setOpen(!open)}>
                <Plus
                    size={24}
                    style={{
                        transition: 'transform var(--transition-fast)',
                        transform: open ? 'rotate(45deg)' : 'none',
                    }}
                />
            </button>
        </>
    );
}

// ─── Timeline ────────────────────────────────────────────────────────
interface TimelineEvent {
    time: string;
    title: string;
    description?: string;
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
    return (
        <div className={styles.timeline}>
            {events.map((e, i) => (
                <div key={i} className={styles.timelineItem}>
                    <div className={styles.timelineDot} />
                    {i < events.length - 1 && <div className={styles.timelineLine} />}
                    <div className={styles.timelineTime}>{e.time}</div>
                    <div className={styles.timelineTitle}>{e.title}</div>
                    {e.description && <div className={styles.timelineDesc}>{e.description}</div>}
                </div>
            ))}
        </div>
    );
}

// ─── SearchBar ───────────────────────────────────────────────────────
interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChange?: (val: string) => void;
    shortcut?: string;
}

export function SearchBar({ placeholder = 'Search...', value, onChange, shortcut }: SearchBarProps) {
    return (
        <div className={styles.searchBar}>
            <Search size={16} className={styles.searchBarIcon} />
            <input
                className={styles.searchBarInput}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange?.(e.target.value)}
            />
            {shortcut && <span className={styles.searchShortcut}>{shortcut}</span>}
        </div>
    );
}

// ─── KPICard ─────────────────────────────────────────────────────────
interface KPICardProps {
    icon: ReactNode;
    iconBg: string;
    iconColor: string;
    value: string | number;
    label: string;
    trend?: { value: string; up: boolean };
}

export function KPICard({ icon, iconBg, iconColor, value, label, trend }: KPICardProps) {
    return (
        <div className={styles.kpiCard}>
            <div className={styles.kpiCardHeader}>
                <div className={styles.kpiCardLabel}>{label}</div>
                <div className={styles.kpiCardIcon} style={{ background: iconBg, color: iconColor }}>
                    {icon}
                </div>
            </div>
            <div className={styles.kpiCardBody}>
                <div className={styles.kpiCardValue}>{value}</div>
                {trend && (
                    <div className={`${styles.kpiTrend} ${trend.up ? styles.kpiTrendUp : styles.kpiTrendDown}`}>
                        {trend.up ? '↑' : '↓'} {trend.value}
                    </div>
                )}
            </div>
        </div>
    );
}
// ─── DropdownMenu ────────────────────────────────────────────────────
interface DropdownItemProps {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    destructive?: boolean;
}
interface DropdownMenuProps {
    trigger: ReactNode;
    items: DropdownItemProps[];
    align?: 'left' | 'right';
}

export function DropdownMenu({ trigger, items, align = 'right' }: DropdownMenuProps) {
    const [open, setOpen] = useState(false);
    // Use a type cast or a more specific type if ref issues arise, but HTMLDivElement is correct for div
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.dropdown} ref={ref}>
            <div
                onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setOpen(!open);
                }}
            >
                {trigger}
            </div>
            {open && (
                <div
                    className={`${styles.dropdownMenu} ${align === 'right' ? styles.dropdownRight : styles.dropdownLeft}`}
                >
                    {items.map((item, i) => (
                        <button
                            key={i}
                            className={`${styles.dropdownItem} ${item.destructive ? styles.dropdownItemDestructive : ''}`}
                            onClick={e => {
                                e.stopPropagation();
                                item.onClick();
                                setOpen(false);
                            }}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── StatusPill ──────────────────────────────────────────────────────
// Status as icon + colour + label — never colour alone (a11y + scannability).
type StatusTone = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'purple';

const STATUS_MAP: Record<string, { tone: StatusTone; icon: ReactNode }> = {
    completed: { tone: 'success', icon: <CheckCircle2 size={13} /> },
    confirmed: { tone: 'info', icon: <CheckCircle2 size={13} /> },
    'work-done': { tone: 'info', icon: <CheckCircle2 size={13} /> },
    active: { tone: 'success', icon: <CheckCircle2 size={13} /> },
    paid: { tone: 'success', icon: <CheckCircle2 size={13} /> },
    arrived: { tone: 'purple', icon: <CircleDot size={13} /> },
    unconfirmed: { tone: 'warning', icon: <Clock size={13} /> },
    'waiting-pay': { tone: 'warning', icon: <Clock size={13} /> },
    pending: { tone: 'warning', icon: <Clock size={13} /> },
    cancelled: { tone: 'error', icon: <XCircle size={13} /> },
    'no-show': { tone: 'neutral', icon: <Circle size={13} /> },
    disabled: { tone: 'neutral', icon: <Circle size={13} /> },
    inactive: { tone: 'neutral', icon: <Circle size={13} /> },
};

const statusToneClass: Record<StatusTone, string> = {
    success: styles.badgeSuccess,
    error: styles.badgeError,
    warning: styles.badgeWarning,
    info: styles.badgeInfo,
    neutral: styles.badgeNeutral,
    purple: styles.badgePurple,
};

export function StatusPill({
    status,
    label,
    icon,
    tone,
}: {
    status?: string;
    label: string;
    icon?: ReactNode;
    tone?: StatusTone;
}) {
    const mapped = status ? STATUS_MAP[status.toLowerCase()] : undefined;
    const finalTone = tone ?? mapped?.tone ?? 'neutral';
    const finalIcon = icon ?? mapped?.icon ?? <Circle size={13} />;
    return (
        <span className={`${styles.statusPill} ${statusToneClass[finalTone]}`}>
            {finalIcon}
            {label}
        </span>
    );
}

// ─── ConfirmDialog ───────────────────────────────────────────────────
// Standard confirmation surface — replaces ad-hoc Modal + custom logic.
interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    loading?: boolean;
}

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    loading = false,
}: ConfirmDialogProps) {
    const iconClass =
        variant === 'danger'
            ? styles.confirmIconDanger
            : variant === 'warning'
              ? styles.confirmIconWarning
              : styles.confirmIconInfo;
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'destructive' : 'primary'}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            <div className={styles.confirmBody}>
                <div className={`${styles.confirmIcon} ${iconClass}`}>
                    {variant === 'info' ? <Info size={22} /> : <AlertTriangle size={22} />}
                </div>
                <div className={styles.confirmText}>{message}</div>
            </div>
        </Modal>
    );
}

// ─── Tooltip ─────────────────────────────────────────────────────────
export function Tooltip({ content, children }: { content: string; children: ReactNode }) {
    return (
        <span className={styles.tooltipWrap}>
            {children}
            <span className={styles.tooltipBubble} role="tooltip">
                {content}
            </span>
        </span>
    );
}

// ─── StateView ───────────────────────────────────────────────────────
// One wrapper for loading / error / empty / content — replaces the
// "render mock data instantly" anti-pattern. Drive flags from useApiQuery.
interface StateViewProps {
    loading?: boolean;
    error?: boolean;
    empty?: boolean;
    onRetry?: () => void;
    loadingFallback?: ReactNode;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyIcon?: ReactNode;
    emptyAction?: ReactNode;
    errorTitle?: string;
    errorDescription?: string;
    children: ReactNode;
}

export function StateView({
    loading,
    error,
    empty,
    onRetry,
    loadingFallback,
    emptyTitle = 'Nothing here yet',
    emptyDescription = 'There is no data to show.',
    emptyIcon,
    emptyAction,
    errorTitle = "Couldn't load this",
    errorDescription = 'Something went wrong. Please try again.',
    children,
}: StateViewProps) {
    if (loading) {
        return (
            <>
                {loadingFallback ?? (
                    <div className={styles.stateView}>
                        <Skeleton variant="title" />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                    </div>
                )}
            </>
        );
    }
    if (error) {
        return (
            <div className={styles.stateView} role="alert">
                <div className={`${styles.stateIcon} ${styles.stateIconError}`}>
                    <AlertTriangle size={26} />
                </div>
                <div className={styles.stateTitle}>{errorTitle}</div>
                <div className={styles.stateDesc}>{errorDescription}</div>
                {onRetry && (
                    <Button variant="secondary" onClick={onRetry}>
                        <RefreshCw size={15} /> Try again
                    </Button>
                )}
            </div>
        );
    }
    if (empty) {
        return (
            <div className={styles.stateView}>
                <div className={styles.stateIcon}>{emptyIcon ?? <Inbox size={26} />}</div>
                <div className={styles.stateTitle}>{emptyTitle}</div>
                <div className={styles.stateDesc}>{emptyDescription}</div>
                {emptyAction}
            </div>
        );
    }
    return <>{children}</>;
}

// ─── RowActionsMenu ──────────────────────────────────────────────────
// Accessible row menu, portaled to <body> so it is never clipped by the
// table's overflow container (a known issue with inline-positioned menus).
export interface RowAction {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    destructive?: boolean;
    disabled?: boolean;
}

export function RowActionsMenu({ actions, label = 'Row actions' }: { actions: RowAction[]; label?: string }) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
    const btnRef = React.useRef<HTMLButtonElement>(null);

    const toggle = () => {
        if (!open && btnRef.current) {
            const r = btnRef.current.getBoundingClientRect();
            const menuWidth = 188;
            setPos({ top: r.bottom + 4, left: Math.max(8, r.right - menuWidth) });
        }
        setOpen(o => !o);
    };

    useEffect(() => {
        if (!open) return;
        const close = () => setOpen(false);
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        const onClick = (e: MouseEvent) => {
            if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
        };
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);
        document.addEventListener('keydown', onKey);
        const t = setTimeout(() => document.addEventListener('mousedown', onClick), 0);
        return () => {
            clearTimeout(t);
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onClick);
        };
    }, [open]);

    return (
        <span className={styles.rowMenu}>
            <button
                ref={btnRef}
                type="button"
                className={styles.rowMenuTrigger}
                aria-label={label}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={e => {
                    e.stopPropagation();
                    toggle();
                }}
            >
                <MoreVertical size={16} />
            </button>
            {open &&
                pos &&
                createPortal(
                    <div
                        className={styles.dropdownMenu}
                        role="menu"
                        style={{ position: 'fixed', top: pos.top, left: pos.left, marginTop: 0, minWidth: 188 }}
                        onClick={e => e.stopPropagation()}
                    >
                        {actions.map((a, i) => (
                            <button
                                key={i}
                                type="button"
                                role="menuitem"
                                disabled={a.disabled}
                                className={`${styles.dropdownItem} ${a.destructive ? styles.dropdownItemDestructive : ''}`}
                                onClick={e => {
                                    e.stopPropagation();
                                    a.onClick();
                                    setOpen(false);
                                }}
                            >
                                {a.icon} {a.label}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
        </span>
    );
}

// ─── Pagination ──────────────────────────────────────────────────────
interface PaginationProps {
    page: number; // 1-based
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
}

export function Pagination({
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 25, 50, 100],
}: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    return (
        <div className={styles.pagination}>
            <span className={styles.pageInfo}>
                {start}–{end} of {total}
            </span>
            <div className={styles.pageControls}>
                {onPageSizeChange && (
                    <select
                        className={styles.pageSizeSelect}
                        value={pageSize}
                        onChange={e => onPageSizeChange(Number(e.target.value))}
                        aria-label="Rows per page"
                    >
                        {pageSizeOptions.map(s => (
                            <option key={s} value={s}>
                                {s} / page
                            </option>
                        ))}
                    </select>
                )}
                <div className={styles.pageBtns}>
                    <button
                        type="button"
                        className={styles.pageBtn}
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className={styles.pageBtn} style={{ cursor: 'default' }} aria-current="page">
                        {page} / {totalPages}
                    </span>
                    <button
                        type="button"
                        className={styles.pageBtn}
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── FiltersBar / FilterPill ─────────────────────────────────────────
export function FilterPill({
    active,
    onClick,
    children,
    count,
}: {
    active?: boolean;
    onClick: () => void;
    children: ReactNode;
    count?: number;
}) {
    return (
        <button
            type="button"
            className={`${styles.filterPill} ${active ? styles.filterPillActive : ''}`}
            aria-pressed={active}
            onClick={onClick}
        >
            {children}
            {count !== undefined && <span className={styles.filterPillCount}>{count}</span>}
        </button>
    );
}

export function FiltersBar({ children }: { children: ReactNode }) {
    return <div className={styles.filtersBar}>{children}</div>;
}

// ─── DataTable ───────────────────────────────────────────────────────
export interface DataColumn<T> {
    key: string;
    header: ReactNode;
    render?: (row: T) => ReactNode;
    sortable?: boolean;
    align?: 'start' | 'center' | 'end';
}

interface DataTableProps<T> {
    columns: DataColumn<T>[];
    rows: T[];
    rowKey: (row: T) => string;
    selectable?: boolean;
    selectedKeys?: string[];
    onSelectionChange?: (keys: string[]) => void;
    bulkActions?: ReactNode;
    sort?: { key: string; dir: 'asc' | 'desc' } | null;
    onSortChange?: (sort: { key: string; dir: 'asc' | 'desc' }) => void;
    loading?: boolean;
    error?: boolean;
    onRetry?: () => void;
    filtered?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyIcon?: ReactNode;
    emptyAction?: ReactNode;
    onRowClick?: (row: T) => void;
    density?: 'comfortable' | 'compact';
    pagination?: ReactNode;
}

export function DataTable<T>({
    columns,
    rows,
    rowKey,
    selectable = false,
    selectedKeys = [],
    onSelectionChange,
    bulkActions,
    sort,
    onSortChange,
    loading = false,
    error = false,
    onRetry,
    filtered = false,
    emptyTitle,
    emptyDescription,
    emptyIcon,
    emptyAction,
    onRowClick,
    density = 'comfortable',
    pagination,
}: DataTableProps<T>) {
    const allSelected = selectable && rows.length > 0 && rows.every(r => selectedKeys.includes(rowKey(r)));
    const someSelected = selectable && selectedKeys.length > 0 && !allSelected;
    const headerCheckRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (headerCheckRef.current) headerCheckRef.current.indeterminate = someSelected;
    }, [someSelected]);

    const toggleAll = () => {
        if (!onSelectionChange) return;
        const pageKeys = rows.map(rowKey);
        if (allSelected) {
            const drop = new Set(pageKeys);
            onSelectionChange(selectedKeys.filter(k => !drop.has(k)));
        } else {
            onSelectionChange([...new Set([...selectedKeys, ...pageKeys])]);
        }
    };

    const toggleRow = (k: string) => {
        if (!onSelectionChange) return;
        onSelectionChange(selectedKeys.includes(k) ? selectedKeys.filter(x => x !== k) : [...selectedKeys, k]);
    };

    const handleSort = (col: DataColumn<T>) => {
        if (!col.sortable || !onSortChange) return;
        const dir = sort?.key === col.key && sort.dir === 'asc' ? 'desc' : 'asc';
        onSortChange({ key: col.key, dir });
    };

    const thAlign = (a?: 'start' | 'center' | 'end') =>
        a === 'end' ? styles.dtThEnd : a === 'center' ? styles.dtThCenter : '';
    const tdAlign = (a?: 'start' | 'center' | 'end') =>
        a === 'end' ? styles.dtTdEnd : a === 'center' ? styles.dtTdCenter : '';

    const colCount = columns.length + (selectable ? 1 : 0);

    return (
        <div className={styles.dtRoot}>
            {selectable && selectedKeys.length > 0 && (
                <div className={styles.dtBulkBar}>
                    <span className={styles.dtBulkCount}>{selectedKeys.length} selected</span>
                    <div className={styles.dtBulkActions}>
                        {bulkActions}
                        <Button variant="ghost" size="sm" onClick={() => onSelectionChange?.([])}>
                            Clear
                        </Button>
                    </div>
                </div>
            )}

            <div className={`${styles.dtWrap} ${density === 'compact' ? styles.dtCompact : ''}`}>
                <table className={styles.dtTable}>
                    <thead className={styles.dtThead}>
                        <tr>
                            {selectable && (
                                <th className={`${styles.dtTh} ${styles.dtCheckCell}`}>
                                    <input
                                        ref={headerCheckRef}
                                        type="checkbox"
                                        className={styles.dtCheckbox}
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        aria-label="Select all rows"
                                    />
                                </th>
                            )}
                            {columns.map(col => {
                                const active = sort?.key === col.key;
                                return (
                                    <th
                                        key={col.key}
                                        className={`${styles.dtTh} ${thAlign(col.align)} ${col.sortable ? styles.dtThSortable : ''}`}
                                        aria-sort={
                                            active
                                                ? sort!.dir === 'asc'
                                                    ? 'ascending'
                                                    : 'descending'
                                                : col.sortable
                                                  ? 'none'
                                                  : undefined
                                        }
                                        onClick={() => handleSort(col)}
                                    >
                                        <span className={styles.dtThInner}>
                                            {col.header}
                                            {col.sortable && (
                                                <span
                                                    className={`${styles.dtSortIcon} ${active ? styles.dtSortActive : ''}`}
                                                >
                                                    {active ? (
                                                        sort!.dir === 'asc' ? (
                                                            <ChevronUp size={13} />
                                                        ) : (
                                                            <ChevronDown size={13} />
                                                        )
                                                    ) : (
                                                        <ChevronsUpDown size={13} />
                                                    )}
                                                </span>
                                            )}
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={`sk-${i}`} className={styles.dtSkeletonRow}>
                                    <td colSpan={colCount}>
                                        <Skeleton variant="text" />
                                    </td>
                                </tr>
                            ))
                        ) : error ? (
                            <tr>
                                <td colSpan={colCount}>
                                    <StateView error onRetry={onRetry}>
                                        {null}
                                    </StateView>
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={colCount}>
                                    <StateView
                                        empty
                                        emptyTitle={
                                            emptyTitle ?? (filtered ? 'No matching results' : 'Nothing here yet')
                                        }
                                        emptyDescription={
                                            emptyDescription ??
                                            (filtered
                                                ? 'Try adjusting your filters or search.'
                                                : 'There is no data to show.')
                                        }
                                        emptyIcon={emptyIcon}
                                        emptyAction={emptyAction}
                                    >
                                        {null}
                                    </StateView>
                                </td>
                            </tr>
                        ) : (
                            rows.map(row => {
                                const k = rowKey(row);
                                const selected = selectedKeys.includes(k);
                                return (
                                    <tr
                                        key={k}
                                        className={`${styles.dtRow} ${onRowClick ? styles.dtRowClickable : ''} ${selected ? styles.dtRowSelected : ''}`}
                                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                                        tabIndex={onRowClick ? 0 : undefined}
                                        onKeyDown={
                                            onRowClick
                                                ? e => {
                                                      if (e.key === 'Enter') onRowClick(row);
                                                  }
                                                : undefined
                                        }
                                    >
                                        {selectable && (
                                            <td
                                                className={`${styles.dtTd} ${styles.dtCheckCell}`}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className={styles.dtCheckbox}
                                                    checked={selected}
                                                    onChange={() => toggleRow(k)}
                                                    aria-label="Select row"
                                                />
                                            </td>
                                        )}
                                        {columns.map(col => (
                                            <td key={col.key} className={`${styles.dtTd} ${tdAlign(col.align)}`}>
                                                {col.render
                                                    ? col.render(row)
                                                    : (row as Record<string, ReactNode>)[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {pagination}
        </div>
    );
}
