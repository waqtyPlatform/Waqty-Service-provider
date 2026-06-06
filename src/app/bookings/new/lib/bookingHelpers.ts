import type { Service, Employee, BookingItem } from '../types';
import { TODAY } from '../data/bookingMocks';

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function busySlotsInRange(
    map: Record<string, Record<string, string[]>>,
    id: string,
    date: string,
    startTime: string,
    durationMins: number
): string[] {
    const busy = map[id]?.[date] ?? [];
    const [sh, sm] = startTime.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = start + durationMins;
    return busy.filter(t => {
        const [th, tm] = t.split(':').map(Number);
        const tMin = th * 60 + tm;
        return tMin >= start && tMin < end;
    });
}

export function initItem(services: Service[], employees: Employee[], prev?: BookingItem): BookingItem {
    return {
        id: Date.now().toString(),
        service: services[0],
        employee: employees[0],
        date: prev?.date ?? TODAY,
        time: prev?.time ?? '10:00',
        room: '',
    };
}
