// --- Plan Tipi (Manuel Etkinlik) ---
export enum PlanType {
  VISIT_PLAN = 'VISIT_PLAN',      // Ziyaret planı
  REMINDER = 'REMINDER',          // Hatırlatıcı
  MEETING = 'MEETING',            // Toplantı
  TASK = 'TASK',                   // Görev
  OTHER = 'OTHER',                 // Diğer
}

export interface IPlan {
  _id: string;
  title: string;
  description?: string;
  date: string;                    // ISO string
  endDate?: string;                // ISO string, opsiyonel (çok günlü)
  type: PlanType;
  relatedCompanyId?: string;
  relatedUserId?: string;
  isCompleted: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export type ICreatePlanPayload = Omit<IPlan, '_id' | 'createdAt' | 'updatedAt'>;

// --- Takvim Etkinliği (Birleşik UI Entity) ---
export enum CalendarEventSource {
  VISIT = 'VISIT',
  PLANNED_VISIT = 'PLANNED_VISIT',
  CARGO = 'CARGO',
  DELIVERY = 'DELIVERY',
  MANUAL_PLAN = 'MANUAL_PLAN',
  HOLIDAY = 'HOLIDAY',
}

// Kaynak bazlı renkler
export const ETKINLIK_RENKLERI: Record<CalendarEventSource, string> = {
  [CalendarEventSource.VISIT]: '#10b981',          // Emerald
  [CalendarEventSource.PLANNED_VISIT]: '#f59e0b',  // Amber
  [CalendarEventSource.CARGO]: '#3b82f6',          // Blue
  [CalendarEventSource.DELIVERY]: '#8b5cf6',       // Violet
  [CalendarEventSource.MANUAL_PLAN]: '#6366f1',    // Indigo
  [CalendarEventSource.HOLIDAY]: '#f43f5e',        // Rose
};

export const ETKINLIK_ETIKETLERI: Record<CalendarEventSource, string> = {
  [CalendarEventSource.VISIT]: 'Ziyaret',
  [CalendarEventSource.PLANNED_VISIT]: 'Planlanan Ziyaret',
  [CalendarEventSource.CARGO]: 'Kargo',
  [CalendarEventSource.DELIVERY]: 'Teslimat',
  [CalendarEventSource.MANUAL_PLAN]: 'Plan',
  [CalendarEventSource.HOLIDAY]: 'Resmi Tatil',
};

export interface ICalendarEvent {
  id: string;
  title: string;
  date: string;                    // ISO string
  source: CalendarEventSource;
  color: string;
  sourceId?: string;               // orijinal visit/plan _id
  meta?: {
    companyName?: string;
    userName?: string;
    status?: string;
    amount?: number;
    description?: string;
  };
}
