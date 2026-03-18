"use client";

import React from "react";
import { BellOff } from "lucide-react";
import { INotification } from "../types";
import { NotificationItem } from "./NotificationItem";

interface INotificationDropdownProps {
  bildirimler: INotification[];
  acikMi: boolean;
  onBildirimKapat: (id: string) => void;
  onTumunuOkunduIsaretle: () => void;
}

const GUN_GRUPLARI: { daysUntil: number; etiket: string }[] = [
  { daysUntil: 0, etiket: "Bugün" },
  { daysUntil: 1, etiket: "Yarın" },
  { daysUntil: 2, etiket: "2 Gün Sonra" },
  { daysUntil: 3, etiket: "3 Gün Sonra" },
];

export const NotificationDropdown = ({
  bildirimler,
  acikMi,
  onBildirimKapat,
  onTumunuOkunduIsaretle,
}: INotificationDropdownProps) => {
  if (!acikMi) return null;

  // Grupla
  const gruplar = GUN_GRUPLARI.map((g) => ({
    ...g,
    bildirimler: bildirimler.filter((b) => b.daysUntil === g.daysUntil),
  })).filter((g) => g.bildirimler.length > 0);

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border/60 bg-card shadow-xl sm:w-96">
      {/* Başlık */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Bildirimler</h3>
        {bildirimler.length > 0 && (
          <button
            type="button"
            onClick={onTumunuOkunduIsaretle}
            className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            Tümünü oku
          </button>
        )}
      </div>

      {/* İçerik */}
      <div className="max-h-[400px] overflow-y-auto">
        {gruplar.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <BellOff className="mb-2 h-8 w-8" />
            <p className="text-sm">Yaklaşan bildirim yok</p>
            <p className="text-xs">Tüm işler yolunda!</p>
          </div>
        ) : (
          <div className="py-1">
            {gruplar.map((grup) => (
              <div key={grup.daysUntil}>
                {/* Grup başlığı */}
                <div className="sticky top-0 bg-card/95 px-4 py-1.5 backdrop-blur-sm">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {grup.etiket}
                  </span>
                </div>
                {/* Bildirimler */}
                {grup.bildirimler.map((bildirim) => (
                  <NotificationItem
                    key={bildirim.id}
                    bildirim={bildirim}
                    onKapat={onBildirimKapat}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
