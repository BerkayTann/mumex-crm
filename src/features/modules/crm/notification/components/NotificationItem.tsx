"use client";

import React from "react";
import { MapPin, Package, Truck, Star, Calendar, X } from "lucide-react";
import { INotification, NotificationType, BILDIRIM_ETIKETLERI } from "../types";

interface INotificationItemProps {
  bildirim: INotification;
  onKapat: (id: string) => void;
}

const TIP_IKONU: Record<NotificationType, React.ElementType> = {
  [NotificationType.PLANNED_VISIT]: MapPin,
  [NotificationType.CARGO_ARRIVING]: Package,
  [NotificationType.DELIVERY_DUE]: Truck,
  [NotificationType.MANUAL_PLAN]: Star,
  [NotificationType.HOLIDAY]: Calendar,
};

export const NotificationItem = ({ bildirim, onKapat }: INotificationItemProps) => {
  const Ikon = TIP_IKONU[bildirim.type];

  return (
    <div className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50">
      {/* İkon */}
      <div
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: bildirim.color + "20", color: bildirim.color }}
      >
        <Ikon className="h-3.5 w-3.5" />
      </div>

      {/* İçerik */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {bildirim.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {bildirim.description}
        </p>
        <span
          className="mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: bildirim.color + "15", color: bildirim.color }}
        >
          {BILDIRIM_ETIKETLERI[bildirim.type]}
        </span>
      </div>

      {/* Kapat butonu */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onKapat(bildirim.id);
        }}
        className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100"
        title="Bildirimi kapat"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
