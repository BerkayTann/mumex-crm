import { IVisit } from '../../../visit/types';
import { IPlan, ICalendarEvent, CalendarEventSource, ETKINLIK_RENKLERI } from '../../types';
import { ITatilGunu } from '@/core/constants/holidays';
import { format } from 'date-fns';

/**
 * Ziyaret kaydından takvim etkinliklerine dönüştürme.
 * Bir ziyaretin birden fazla tarihi olabilir (visitDate, plannedDate, cargoDate, deliveryDate).
 */
export const ziyarettenEtkinlikleredonustur = (ziyaret: IVisit): ICalendarEvent[] => {
  const etkinlikler: ICalendarEvent[] = [];
  const kurumAdi = typeof ziyaret.companyId === 'object' && ziyaret.companyId !== null
    ? (ziyaret.companyId as { name?: string }).name || ''
    : '';
  const kisiAdi = typeof ziyaret.userId === 'object' && ziyaret.userId !== null
    ? `${(ziyaret.userId as { firstName?: string }).firstName || ''} ${(ziyaret.userId as { lastName?: string }).lastName || ''}`.trim()
    : '';

  // Gerçekleşen ziyaret tarihi
  if (ziyaret.visitDate) {
    etkinlikler.push({
      id: `VISIT_${ziyaret._id}`,
      title: `Ziyaret${kurumAdi ? ': ' + kurumAdi : ''}`,
      date: ziyaret.visitDate,
      source: CalendarEventSource.VISIT,
      color: ETKINLIK_RENKLERI[CalendarEventSource.VISIT],
      sourceId: ziyaret._id,
      meta: { companyName: kurumAdi, userName: kisiAdi, status: ziyaret.status, amount: ziyaret.totalAmount },
    });
  }

  // Planlanan ziyaret tarihi
  if (ziyaret.plannedDate) {
    etkinlikler.push({
      id: `PLANNED_${ziyaret._id}`,
      title: `Planlanan Ziyaret${kurumAdi ? ': ' + kurumAdi : ''}`,
      date: ziyaret.plannedDate,
      source: CalendarEventSource.PLANNED_VISIT,
      color: ETKINLIK_RENKLERI[CalendarEventSource.PLANNED_VISIT],
      sourceId: ziyaret._id,
      meta: { companyName: kurumAdi, userName: kisiAdi, status: ziyaret.status },
    });
  }

  // Kargo tarihi
  if (ziyaret.cargoDate) {
    etkinlikler.push({
      id: `CARGO_${ziyaret._id}`,
      title: `Kargo${kurumAdi ? ': ' + kurumAdi : ''}`,
      date: ziyaret.cargoDate,
      source: CalendarEventSource.CARGO,
      color: ETKINLIK_RENKLERI[CalendarEventSource.CARGO],
      sourceId: ziyaret._id,
      meta: { companyName: kurumAdi, status: ziyaret.cargoStatus },
    });
  }

  // Teslimat tarihi
  if (ziyaret.deliveryDate) {
    etkinlikler.push({
      id: `DELIVERY_${ziyaret._id}`,
      title: `Teslimat${kurumAdi ? ': ' + kurumAdi : ''}`,
      date: ziyaret.deliveryDate,
      source: CalendarEventSource.DELIVERY,
      color: ETKINLIK_RENKLERI[CalendarEventSource.DELIVERY],
      sourceId: ziyaret._id,
      meta: { companyName: kurumAdi },
    });
  }

  return etkinlikler;
};

/**
 * Plan kaydından takvim etkinliğine dönüştürme.
 */
export const plandanEtkinligeDonustur = (plan: IPlan): ICalendarEvent => {
  return {
    id: `PLAN_${plan._id}`,
    title: plan.title,
    date: plan.date,
    source: CalendarEventSource.MANUAL_PLAN,
    color: plan.color || ETKINLIK_RENKLERI[CalendarEventSource.MANUAL_PLAN],
    sourceId: plan._id,
    meta: { description: plan.description },
  };
};

/**
 * Resmi tatilden takvim etkinliğine dönüştürme.
 */
export const tatildenEtkinligeDonustur = (tatil: ITatilGunu): ICalendarEvent => {
  return {
    id: `HOLIDAY_${tatil.ad.replace(/\s/g, '_')}_${format(tatil.tarih, 'yyyy-MM-dd')}`,
    title: tatil.ad,
    date: tatil.tarih.toISOString(),
    source: CalendarEventSource.HOLIDAY,
    color: ETKINLIK_RENKLERI[CalendarEventSource.HOLIDAY],
  };
};
