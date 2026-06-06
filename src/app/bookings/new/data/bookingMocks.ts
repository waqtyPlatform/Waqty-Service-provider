import type { ServicePriceOverride } from '@/lib/priceResolver';
import type { Service, Employee, Room } from '../types';

// ─── Static data ─────────────────────────────────────────────────────────────

export const SERVICES: Record<string, Service[]> = {
    barber: [
        {
            id: 'B01',
            name: 'Classic Haircut',
            nameAr: 'قص شعر كلاسيكي',
            duration: '30 min',
            durationMins: 30,
            price: 80,
            category: 'Cut',
        },
        {
            id: 'B02',
            name: 'Skin Fade',
            nameAr: 'تدريج سكين فيد',
            duration: '45 min',
            durationMins: 45,
            price: 120,
            category: 'Cut',
        },
        {
            id: 'B03',
            name: 'Beard Trim & Shape',
            nameAr: 'تهذيب وتشكيل اللحية',
            duration: '20 min',
            durationMins: 20,
            price: 60,
            category: 'Beard',
        },
        {
            id: 'B04',
            name: 'Hair & Beard Combo',
            nameAr: 'باقة شعر ولحية',
            duration: '60 min',
            durationMins: 60,
            price: 160,
            category: 'Combo',
        },
        {
            id: 'B05',
            name: 'Hot Towel Shave',
            nameAr: 'حلاقة بالمنشفة الساخنة',
            duration: '30 min',
            durationMins: 30,
            price: 90,
            category: 'Shave',
        },
        {
            id: 'B06',
            name: 'Keratin Smoothing',
            nameAr: 'فرد بالكيراتين',
            duration: '90 min',
            durationMins: 90,
            price: 350,
            category: 'Treatment',
        },
        {
            id: 'B07',
            name: 'Kids Haircut',
            nameAr: 'قص شعر أطفال',
            duration: '20 min',
            durationMins: 20,
            price: 50,
            category: 'Cut',
        },
    ],
    salon: [
        {
            id: 'S01',
            name: 'Haircut & Styling',
            nameAr: 'قص وتصفيف الشعر',
            duration: '45 min',
            durationMins: 45,
            price: 150,
            category: 'Hair',
        },
        {
            id: 'S02',
            name: 'Hair Coloring',
            nameAr: 'صبغ الشعر',
            duration: '90 min',
            durationMins: 90,
            price: 400,
            category: 'Hair',
        },
        {
            id: 'S03',
            name: 'Keratin Treatment',
            nameAr: 'علاج بالكيراتين',
            duration: '120 min',
            durationMins: 120,
            price: 500,
            category: 'Hair',
        },
        {
            id: 'S04',
            name: 'Classic Facial',
            nameAr: 'تنظيف بشرة كلاسيكي',
            duration: '60 min',
            durationMins: 60,
            price: 200,
            category: 'Skin',
        },
        {
            id: 'S05',
            name: 'HydraFacial',
            nameAr: 'هيدرافيشل',
            duration: '75 min',
            durationMins: 75,
            price: 450,
            category: 'Skin',
        },
        {
            id: 'S06',
            name: 'Gel Manicure',
            nameAr: 'مانيكير جل',
            duration: '45 min',
            durationMins: 45,
            price: 150,
            category: 'Nails',
        },
        {
            id: 'S07',
            name: 'Swedish Massage',
            nameAr: 'مساج سويدي',
            duration: '60 min',
            durationMins: 60,
            price: 300,
            category: 'Body',
        },
        {
            id: 'S08',
            name: 'Laser Hair Removal',
            nameAr: 'إزالة الشعر بالليزر',
            duration: '30 min',
            durationMins: 30,
            price: 250,
            category: 'Laser',
        },
        {
            id: 'S09',
            name: 'Bridal Makeup',
            nameAr: 'مكياج عرائس',
            duration: '120 min',
            durationMins: 120,
            price: 800,
            category: 'Makeup',
        },
        {
            id: 'S10',
            name: 'Eyelash Extensions',
            nameAr: 'تركيب رموش',
            duration: '90 min',
            durationMins: 90,
            price: 350,
            category: 'Lash',
        },
    ],
    clinic: [
        {
            id: 'C01',
            name: 'General Consultation',
            nameAr: 'كشف عام',
            duration: '30 min',
            durationMins: 30,
            price: 200,
            category: 'Consultation',
        },
        {
            id: 'C02',
            name: 'Follow-up Visit',
            nameAr: 'زيارة متابعة',
            duration: '20 min',
            durationMins: 20,
            price: 120,
            category: 'Consultation',
        },
        {
            id: 'C03',
            name: 'Dental Checkup',
            nameAr: 'فحص أسنان',
            duration: '45 min',
            durationMins: 45,
            price: 250,
            category: 'Dental',
        },
        {
            id: 'C04',
            name: 'Laser Session',
            nameAr: 'جلسة ليزر',
            duration: '30 min',
            durationMins: 30,
            price: 400,
            category: 'Laser',
        },
        {
            id: 'C05',
            name: 'Botox Treatment',
            nameAr: 'علاج بوتوكس',
            duration: '45 min',
            durationMins: 45,
            price: 800,
            category: 'Aesthetic',
        },
        {
            id: 'C06',
            name: 'Dermatology Exam',
            nameAr: 'فحص جلدية',
            duration: '30 min',
            durationMins: 30,
            price: 300,
            category: 'Dermatology',
        },
        {
            id: 'C07',
            name: 'Physiotherapy Session',
            nameAr: 'جلسة علاج طبيعي',
            duration: '60 min',
            durationMins: 60,
            price: 350,
            category: 'Physio',
        },
        {
            id: 'C08',
            name: 'Lab Tests',
            nameAr: 'تحاليل معملية',
            duration: '20 min',
            durationMins: 20,
            price: 150,
            category: 'Lab',
        },
    ],
};

export const EMPLOYEES: Record<string, Employee[]> = {
    barber: [
        { id: 'E01', name: 'Ahmed Fathy', role: 'Master Barber', color: '#3b82f6', level: 'Senior' },
        { id: 'E02', name: 'Karim Saad', role: 'Senior Barber', color: '#8b5cf6', level: 'Senior' },
        { id: 'E03', name: 'Omar Nasser', role: 'Barber', color: '#10b981', level: 'Mid' },
        { id: 'E04', name: 'Hassan Ali', role: 'Junior Barber', color: '#f59e0b', level: 'Junior' },
    ],
    salon: [
        { id: 'E01', name: 'Sara Ahmed', role: 'Senior Stylist', color: '#ec4899', level: 'Senior' },
        { id: 'E02', name: 'Nora Ali', role: 'Skin Specialist', color: '#8b5cf6', level: 'Senior' },
        { id: 'E03', name: 'Layla Hassan', role: 'Senior Therapist', color: '#10b981', level: 'Senior' },
        { id: 'E04', name: 'Reem Mohamed', role: 'Massage Therapist', color: '#3b82f6', level: 'Mid' },
        { id: 'E05', name: 'Hana Youssef', role: 'Nail Technician', color: '#f59e0b', level: 'Junior' },
    ],
    clinic: [
        { id: 'E01', name: 'Dr. Ahmed Kamal', role: 'General Physician', color: '#3b82f6', level: 'Senior' },
        { id: 'E02', name: 'Dr. Mona Taher', role: 'Dermatologist', color: '#8b5cf6', level: 'Senior' },
        { id: 'E03', name: 'Dr. Yasser Nour', role: 'Dentist', color: '#10b981', level: 'Mid' },
        { id: 'E04', name: 'Dr. Rana Farid', role: 'Physiotherapist', color: '#f59e0b', level: 'Mid' },
        { id: 'E05', name: 'Dr. Omar Sayed', role: 'Aesthetic Specialist', color: '#ec4899', level: 'Senior' },
    ],
};

export const ROOMS: Room[] = [
    { id: 'R1', name: 'Room 1 – VIP' },
    { id: 'R2', name: 'Room 2 – Standard' },
    { id: 'R3', name: 'Room 3 – Treatment' },
    { id: 'R4', name: 'Room 4 – Laser' },
];

// Chronic conditions stored by canonical English value (used as logic/data key);
// `tKey` maps each to its translation key for display under the active locale.
export const CHRONIC_CONDITIONS: { value: string; tKey: string }[] = [
    { value: 'Diabetes', tKey: 'patient.condDiabetes' },
    { value: 'Hypertension', tKey: 'patient.condHypertension' },
    { value: 'Heart Disease', tKey: 'patient.condHeartDisease' },
    { value: 'Asthma', tKey: 'patient.condAsthma' },
    { value: 'Thyroid Disorder', tKey: 'patient.condThyroid' },
    { value: 'Kidney Disease', tKey: 'patient.condKidney' },
    { value: 'Liver Disease', tKey: 'patient.condLiver' },
    { value: 'Cancer', tKey: 'patient.condCancer' },
    { value: 'Autoimmune Disease', tKey: 'patient.condAutoimmune' },
];

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const TODAY = new Date().toISOString().split('T')[0];

export const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
    const h = Math.floor(i / 2) + 9;
    const m = i % 2 === 0 ? '00' : '30';
    return `${h.toString().padStart(2, '0')}:${m}`;
});

// Mock schedule data — replace with API calls
export const EMP_BUSY: Record<string, Record<string, string[]>> = {
    E01: { [TODAY]: ['09:00', '09:30', '10:30', '11:00', '14:00', '14:30'] },
    E02: { [TODAY]: ['10:00', '10:30', '11:00', '15:00', '15:30'] },
    E03: { [TODAY]: ['09:30', '12:00', '12:30', '16:00', '16:30'] },
    E04: { [TODAY]: ['11:30', '13:00', '13:30', '17:00'] },
    E05: { [TODAY]: ['09:00', '09:30', '10:00', '14:30', '15:00'] },
};

export const ROOM_BUSY: Record<string, Record<string, string[]>> = {
    R1: { [TODAY]: ['09:00', '09:30', '10:00', '14:00', '14:30'] },
    R2: { [TODAY]: ['10:30', '11:00', '11:30', '15:00'] },
    R3: { [TODAY]: ['09:00', '12:00', '12:30', '13:00'] },
    R4: { [TODAY]: ['11:00', '16:00', '16:30'] },
};

// Fallback branch ID — overridden by API data when available
export const CURRENT_BRANCH_ID = '1';

// Mock price overrides — used as fallback when API data unavailable
export const MOCK_PRICE_OVERRIDES: ServicePriceOverride[] = [
    // Tier overrides (salon)
    { id: 'to-1', serviceId: 'S01', pricingTier: 'Senior', price: 180 },
    { id: 'to-2', serviceId: 'S01', pricingTier: 'Junior', price: 100 },
    { id: 'to-3', serviceId: 'S02', pricingTier: 'Senior', price: 550 },
    { id: 'to-4', serviceId: 'S03', pricingTier: 'Senior', price: 900 },
    // Employee override
    { id: 'eo-1', serviceId: 'S02', employeeId: 'E01', price: 520 },
    // Tier overrides (barber)
    { id: 'to-5', serviceId: 'B01', pricingTier: 'Senior', price: 80 },
    { id: 'to-6', serviceId: 'B01', pricingTier: 'Junior', price: 40 },
    // Tier overrides (clinic)
    { id: 'to-7', serviceId: 'C01', pricingTier: 'Senior', price: 300 },
    { id: 'to-8', serviceId: 'C05', pricingTier: 'Senior', price: 1000 },
];
