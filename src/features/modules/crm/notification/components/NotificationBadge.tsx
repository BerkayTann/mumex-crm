"use client";

import React from "react";
import { Bell } from "lucide-react";

interface INotificationBadgeProps {
  bildirimSayisi: number;
  onTiklandi: () => void;
}

export const NotificationBadge = ({
  bildirimSayisi,
  onTiklandi,
}: INotificationBadgeProps) => {
  return (
    <button
      type="button"
      onClick={onTiklandi}
      className="relative rounded-full border border-transparent p-2 text-muted-foreground transition-colors hover:border-border/80 hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
      title="Bildirimler"
      aria-label={`Bildirimler${bildirimSayisi > 0 ? ` (${bildirimSayisi} yeni)` : ''}`}
    >
      <Bell className="h-5 w-5" />
      {bildirimSayisi > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm">
          {bildirimSayisi > 9 ? "9+" : bildirimSayisi}
        </span>
      )}
    </button>
  );
};
