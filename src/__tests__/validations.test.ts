import { describe, it, expect } from 'vitest';
import {
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    otpSchema,
    newBookingSchema,
    newServiceSchema,
    newEmployeeSchema,
    newCustomerSchema,
    expenseSchema,
    deductionSchema,
    promoCodeSchema,
} from '@/lib/validations';

describe('loginSchema', () => {
    it('accepts valid email + password', () => {
        const result = loginSchema.safeParse({
            identifier: 'test@example.com',
            password: 'password123',
        });
        expect(result.success).toBe(true);
    });

    it('rejects empty identifier', () => {
        const result = loginSchema.safeParse({
            identifier: '',
            password: 'password123',
        });
        expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
        const result = loginSchema.safeParse({
            identifier: 'test@example.com',
            password: '12345',
        });
        expect(result.success).toBe(false);
    });

    it('rejects invalid email format', () => {
        const result = loginSchema.safeParse({
            identifier: 'not-an-email@',
            password: 'password123',
        });
        expect(result.success).toBe(false);
    });

    it('accepts valid phone number', () => {
        const result = loginSchema.safeParse({
            identifier: '01234567890',
            password: 'password123',
        });
        expect(result.success).toBe(true);
    });
});

describe('forgotPasswordSchema', () => {
    it('accepts valid email', () => {
        const result = forgotPasswordSchema.safeParse({ identifier: 'test@example.com' });
        expect(result.success).toBe(true);
    });

    it('rejects empty identifier', () => {
        const result = forgotPasswordSchema.safeParse({ identifier: '' });
        expect(result.success).toBe(false);
    });
});

describe('resetPasswordSchema', () => {
    it('accepts valid reset data', () => {
        const result = resetPasswordSchema.safeParse({
            code: '123456',
            newPassword: 'NewPass1',
            confirmPassword: 'NewPass1',
        });
        expect(result.success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
        const result = resetPasswordSchema.safeParse({
            code: '123456',
            newPassword: 'NewPass1',
            confirmPassword: 'DifferentPass1',
        });
        expect(result.success).toBe(false);
    });

    it('rejects code that is not 6 digits', () => {
        const result = resetPasswordSchema.safeParse({
            code: '12345',
            newPassword: 'NewPass1',
            confirmPassword: 'NewPass1',
        });
        expect(result.success).toBe(false);
    });

    it('rejects password without uppercase', () => {
        const result = resetPasswordSchema.safeParse({
            code: '123456',
            newPassword: 'newpass1',
            confirmPassword: 'newpass1',
        });
        expect(result.success).toBe(false);
    });
});

describe('otpSchema', () => {
    it('accepts valid 6-digit code', () => {
        const result = otpSchema.safeParse({ code: '123456' });
        expect(result.success).toBe(true);
    });

    it('rejects non-numeric code', () => {
        const result = otpSchema.safeParse({ code: 'abcdef' });
        expect(result.success).toBe(false);
    });

    it('rejects wrong length', () => {
        const result = otpSchema.safeParse({ code: '12345' });
        expect(result.success).toBe(false);
    });
});

describe('newBookingSchema', () => {
    it('accepts valid booking', () => {
        const result = newBookingSchema.safeParse({
            clientName: 'John Doe',
            clientPhone: '01234567890',
            serviceId: 'svc-1',
            employeeId: 'emp-1',
            date: '2025-06-15',
            time: '10:00',
        });
        expect(result.success).toBe(true);
    });

    it('rejects missing required fields', () => {
        const result = newBookingSchema.safeParse({
            clientName: '',
            serviceId: '',
            employeeId: '',
            date: '',
            time: '',
        });
        expect(result.success).toBe(false);
    });
});

describe('newServiceSchema', () => {
    it('accepts valid service', () => {
        const result = newServiceSchema.safeParse({
            name: 'Haircut',
            category: 'Hair',
            duration: 30,
            price: 50,
        });
        expect(result.success).toBe(true);
    });

    it('rejects duration less than 5 minutes', () => {
        const result = newServiceSchema.safeParse({
            name: 'Quick trim',
            category: 'Hair',
            duration: 2,
            price: 10,
        });
        expect(result.success).toBe(false);
    });
});

describe('newEmployeeSchema', () => {
    it('accepts valid employee', () => {
        const result = newEmployeeSchema.safeParse({
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '01234567890',
            role: 'staff',
            position: 'Stylist',
            startDate: '2025-01-01',
        });
        expect(result.success).toBe(true);
    });

    it('rejects invalid role', () => {
        const result = newEmployeeSchema.safeParse({
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '01234567890',
            role: 'superadmin',
            position: 'Stylist',
            startDate: '2025-01-01',
        });
        expect(result.success).toBe(false);
    });
});

describe('newCustomerSchema', () => {
    it('accepts valid customer', () => {
        const result = newCustomerSchema.safeParse({
            name: 'Alice Smith',
            phone: '01234567890',
        });
        expect(result.success).toBe(true);
    });

    it('accepts customer with optional email', () => {
        const result = newCustomerSchema.safeParse({
            name: 'Alice Smith',
            phone: '01234567890',
            email: 'alice@test.com',
        });
        expect(result.success).toBe(true);
    });

    it('allows empty email string', () => {
        const result = newCustomerSchema.safeParse({
            name: 'Alice Smith',
            phone: '01234567890',
            email: '',
        });
        expect(result.success).toBe(true);
    });
});

describe('expenseSchema', () => {
    it('accepts valid expense', () => {
        const result = expenseSchema.safeParse({
            category: 'Supplies',
            amount: 150.5,
            description: 'Shampoo bulk order',
            date: '2025-06-01',
            paymentMethod: 'cash',
        });
        expect(result.success).toBe(true);
    });

    it('rejects zero amount', () => {
        const result = expenseSchema.safeParse({
            category: 'Supplies',
            amount: 0,
            description: 'Free stuff',
            date: '2025-06-01',
            paymentMethod: 'cash',
        });
        expect(result.success).toBe(false);
    });
});

describe('deductionSchema', () => {
    it('accepts valid deduction', () => {
        const result = deductionSchema.safeParse({
            employeeId: 'emp-1',
            type: 'attendance',
            amount: 50,
            description: 'Late arrival',
            date: '2025-06-01',
        });
        expect(result.success).toBe(true);
    });
});

describe('promoCodeSchema', () => {
    it('accepts valid percentage promo', () => {
        const result = promoCodeSchema.safeParse({
            code: 'SUMMER20',
            discountType: 'percentage',
            discountValue: 20,
        });
        expect(result.success).toBe(true);
    });

    it('rejects percentage over 100', () => {
        const result = promoCodeSchema.safeParse({
            code: 'TOOBIG',
            discountType: 'percentage',
            discountValue: 150,
        });
        expect(result.success).toBe(false);
    });

    it('accepts fixed discount over 100', () => {
        const result = promoCodeSchema.safeParse({
            code: 'BIGDEAL',
            discountType: 'fixed',
            discountValue: 200,
        });
        expect(result.success).toBe(true);
    });

    it('rejects lowercase code', () => {
        const result = promoCodeSchema.safeParse({
            code: 'lowercase',
            discountType: 'fixed',
            discountValue: 10,
        });
        expect(result.success).toBe(false);
    });
});
