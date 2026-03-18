export enum NotificationType {
  PLANNED_VISIT = 'PLANNED_VISIT',
  CARGO_ARRIVING = 'CARGO_ARRIVING',
  DELIVERY_DUE = 'DELIVERY_DUE',
  MANUAL_PLAN = 'MANUAL_PLAN',
  HOLIDAY = 'HOLIDAY',
}

export const BILDIRIM_RENKLERI: Record<NotificationType, string> = {
  [NotificationType.PLANNED_VISIT]: '#f59e0b',
  [NotificationType.CARGO_ARRIVING]: '#3b82f6',
  [NotificationType.DELIVERY_DUE]: '#8b5cf6',
  [NotificationType.MANUAL_PLAN]: '#6366f1',
  [NotificationType.HOLIDAY]: '#f43f5e',
};

export const BILDIRIM_ETIKETLERI: Record<NotificationType, string> = {
  [NotificationType.PLANNED_VISIT]: 'Planlanan Ziyaret',
  [NotificationType.CARGO_ARRIVING]: 'Kargo Takibi',
  [NotificationType.DELIVERY_DUE]: 'Teslimat',
  [NotificationType.MANUAL_PLAN]: 'Plan / Hatırlatıcı',
  [NotificationType.HOLIDAY]: 'Resmi Tatil',
};

export interface INotification {
  id: string;            // deterministic: "TYPE_sourceId_dateStr"
  title: string;
  description: string;
  date: string;          // ISO string
  daysUntil: number;     // 0=bugün, 1=yarın, 2, 3
  type: NotificationType;
  sourceId?: string;
  color: string;
}
