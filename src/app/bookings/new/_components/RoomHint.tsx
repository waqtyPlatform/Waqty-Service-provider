'use client';

import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { busySlotsInRange } from '../lib/bookingHelpers';
import { ROOM_BUSY } from '../data/bookingMocks';
import { s } from '../lib/bookingStyles';

export function RoomHint({ roomId, date, time, dur }: { roomId: string; date: string; time: string; dur: number }) {
    const { t } = useTranslation();
    if (!roomId) return <div style={s.hint}>{t('newBooking.roomAutoAssigned')}</div>;
    const busy = busySlotsInRange(ROOM_BUSY, roomId, date, time, dur);
    return busy.length > 0 ? (
        <div style={s.hintErr}>
            <AlertTriangle size={11} />
            {t('newBooking.roomOccupiedAt').replace('{list}', busy.join(', '))}
        </div>
    ) : (
        <div style={s.hintOk}>
            <CheckCircle size={11} />
            {t('bookings.roomAvailable')}
        </div>
    );
}
