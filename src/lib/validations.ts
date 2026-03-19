import { z } from 'zod';

// ── Login ────────────────────────────────────────────────
export const loginSchema = z.object({
    identifier: z
        .string()
        .min(1, 'Email or phone is required')
        .refine(
            val => (val.includes('@') ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) : val.length >= 8),
            'Enter a valid email or phone number'
        ),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// ── Forgot Password ──────────────────────────────────────
export const forgotPasswordSchema = z.object({
    identifier: z
        .string()
        .min(1, 'Email or phone is required')
        .refine(
            val => (val.includes('@') ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) : val.length >= 8),
            'Enter a valid email or phone number'
        ),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ── Reset Password ───────────────────────────────────────
export const resetPasswordSchema = z
    .object({
        code: z
            .string()
            .length(6, 'Verification code must be 6 digits')
            .regex(/^\d+$/, 'Code must contain only numbers'),
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
            .regex(/[0-9]/, 'Must contain at least one number'),
        confirmPassword: z.string(),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ── OTP Verification ─────────────────────────────────────
export const otpSchema = z.object({
    code: z.string().length(6, 'Enter the 6-digit code').regex(/^\d+$/, 'Code must contain only numbers'),
});
export type OTPFormData = z.infer<typeof otpSchema>;

// ── New Booking ──────────────────────────────────────────
export const newBookingSchema = z.object({
    clientName: z.string().min(1, 'Client name is required'),
    clientPhone: z.string().min(8, 'Phone number is too short').optional().or(z.literal('')),
    clientEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
    serviceId: z.string().min(1, 'Please select a service'),
    employeeId: z.string().min(1, 'Please select an employee'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    notes: z.string().optional(),
});
export type NewBookingFormData = z.infer<typeof newBookingSchema>;

// ── New Service ──────────────────────────────────────────
export const newServiceSchema = z.object({
    name: z.string().min(1, 'Service name is required').max(100, 'Name too long'),
    nameAr: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    duration: z.coerce.number().min(5, 'Minimum 5 minutes').max(480, 'Maximum 8 hours'),
    price: z.coerce.number().min(0, 'Price cannot be negative'),
    description: z.string().max(500, 'Description too long').optional(),
    isActive: z.boolean().default(true),
});
export type NewServiceFormData = z.infer<typeof newServiceSchema>;

// ── New Employee ─────────────────────────────────────────
export const newEmployeeSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Enter a valid email'),
    phone: z.string().min(8, 'Phone is too short'),
    role: z.enum(['admin', 'manager', 'staff']),
    position: z.string().min(1, 'Position is required'),
    department: z.string().optional(),
    baseSalary: z.coerce.number().min(0, 'Salary cannot be negative').optional(),
    startDate: z.string().min(1, 'Start date is required'),
});
export type NewEmployeeFormData = z.infer<typeof newEmployeeSchema>;

// ── New Customer ─────────────────────────────────────────
export const newCustomerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    phone: z.string().min(8, 'Phone is too short'),
    email: z.string().email('Enter a valid email').optional().or(z.literal('')),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: z.string().optional(),
    notes: z.string().max(500, 'Notes too long').optional(),
});
export type NewCustomerFormData = z.infer<typeof newCustomerSchema>;

// ── Expense ──────────────────────────────────────────────
export const expenseSchema = z.object({
    category: z.string().min(1, 'Category is required'),
    amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
    description: z.string().min(1, 'Description is required').max(300),
    date: z.string().min(1, 'Date is required'),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    receipt: z.string().optional(),
});
export type ExpenseFormData = z.infer<typeof expenseSchema>;

// ── Deduction ────────────────────────────────────────────
export const deductionSchema = z.object({
    employeeId: z.string().min(1, 'Select an employee'),
    type: z.string().min(1, 'Select deduction type'),
    amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
    description: z.string().min(1, 'Description is required').max(500),
    date: z.string().min(1, 'Date is required'),
});
export type DeductionFormData = z.infer<typeof deductionSchema>;

// ── Business Settings ────────────────────────────────────
export const businessSettingsSchema = z.object({
    businessName: z.string().min(1, 'Business name is required').max(200),
    legalName: z.string().min(1, 'Legal name is required').max(200),
    crNumber: z.string().optional(),
    vatNumber: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    phone: z.string().min(8, 'Phone is too short'),
    email: z.string().email('Enter a valid email'),
});
export type BusinessSettingsFormData = z.infer<typeof businessSettingsSchema>;

// ── Branch Settings ──────────────────────────────────────
export const branchSchema = z
    .object({
        name: z.string().min(1, 'Branch name is required').max(100),
        address: z.string().min(1, 'Address is required'),
        phone: z.string().min(8, 'Phone is too short'),
        manager: z.string().optional(),
        isActive: z.boolean().default(true),
        email: z.string().email('Enter a valid email'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });
export type BranchFormData = z.infer<typeof branchSchema>;

export const branchEditSchema = z
    .object({
        name: z.string().min(1, 'Branch name is required').max(100),
        address: z.string().min(1, 'Address is required'),
        phone: z.string().min(8, 'Phone is too short'),
        manager: z.string().optional(),
        isActive: z.boolean().default(true),
        email: z.string().email('Enter a valid email'),
        password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
        confirmPassword: z.string().optional().or(z.literal('')),
    })
    .refine(
        data => {
            if (data.password && data.password !== data.confirmPassword) return false;
            return true;
        },
        {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        }
    );

export const branchResetPasswordSchema = z
    .object({
        newPassword: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string(),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

// ── Promo Code ───────────────────────────────────────────
export const promoCodeSchema = z
    .object({
        code: z
            .string()
            .min(3, 'Code must be at least 3 characters')
            .max(20, 'Code too long')
            .regex(/^[A-Z0-9_-]+$/, 'Only uppercase letters, numbers, hyphens and underscores'),
        discountType: z.enum(['percentage', 'fixed']),
        discountValue: z.coerce.number().min(0.01, 'Discount must be greater than 0'),
        maxUses: z.coerce.number().min(1, 'At least 1 use').optional(),
        expiresAt: z.string().optional(),
        isActive: z.boolean().default(true),
    })
    .refine(
        data => {
            if (data.discountType === 'percentage' && data.discountValue > 100) {
                return false;
            }
            return true;
        },
        {
            message: 'Percentage discount cannot exceed 100%',
            path: ['discountValue'],
        }
    );
export type PromoCodeFormData = z.infer<typeof promoCodeSchema>;
