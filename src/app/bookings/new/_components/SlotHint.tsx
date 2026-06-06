'use client';

import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { busySlotsInRange } from '../lib/bookingHelpers';
import { EMP_BUSY } from '../data/bookingMocks';
import { s } from '../lib/bookingStyles';

export function SlotHint({ empId, date, time, dur }: { empId: string; date: string; time: string; dur: number }) {
    const { t } = useTranslation();
    const busy = busySlotsInRange(EMP_BUSY, empId, date, time, dur);
    return busy.length > 0 ? (
        <div style={s.hintErr}>
            <AlertTriangle size={11} />
            {t('newBooking.staffBusyAt').replace('{list}', busy.join(', '))}
        </div>
    ) : (
        <div style={s.hintOk}>
            <CheckCircle size={11} />
            {t('newBooking.staffAvailable')}
        </div>
    );
}
