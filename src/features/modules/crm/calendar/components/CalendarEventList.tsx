"use client";

import React from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Plus, MapPin, Package, Truck, Calendar, Star } from "lucide-react";
import { ICalendarEvent, CalendarEventSource, ETKINLIK_ETIKETLERI } from "../types";
import { MoneyText } from "@/components/common/MoneyText";

interface ICalendarEventListProps {
  etkinlikler: ICalendarEvent[];
  seciliTarih: Date | null;
  onPlanEkleTiklandi: () => void;
}

const KAYNAK_IKONU: Record<CalendarEventSource, React.ElementType> = {
  [CalendarEventSource.VISIT]: MapPin,
  [CalendarEventSource.PLANNED_VISIT]: Calendar,
  [CalendarEventSource.CARGO]: Package,
  [CalendarEventSource.DELIVERY]: Truck,
  [CalendarEventSource.MANUAL_PLAN]: Star,
  [CalendarEventSource.HOLIDAY]: Star,
};

export const CalendarEventList = ({
  etkinlikler,
  seciliTarih,
  onPlanEkleTiklandi,
}: ICalendarEventListProps) => {
  const tarihMetni = seciliTarih
    ? format(seciliTarih, "d MMMM yyyy, EEEE", { locale: tr })
    : "Bir gün seçin";

  // İlk harf büyük
  const baslikMetni = tarihMetni.charAt(0).toUpperCase() + tarihMetni.slice(1);

  return (
    <div className="flex h-full flex-col rounded-xl border border-border/60 bg-card shadow-sm">
      {/* Başlık */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">{baslikMetni}</h2>
        <button
          type="button"
          onClick={onPlanEkleTiklandi}
          className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Plan Ekle</span>
        </button>
      </div>

      {/* Etkinlik listesi */}
      <div className="flex-1 overflow-y-auto p-3">
        {!seciliTarih ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Etkinlikleri görüntülemek için takvimden bir gün seçin.
          </p>
        ) : etkinlikler.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Bu gün için kayıtlı etkinlik bulunmuyor.
          </p>
        ) : (
          <div className="space-y-2">
            {etkinlikler.map((etkinlik) => {
              const Ikon = KAYNAK_IKONU[etkinlik.source];
              return (
                <div
                  key={etkinlik.id}
                  className="flex items-start gap-3 rounded-lg border border-border/40 bg-background/50 p-3 transition-colors hover:bg-accent/30"
                >
                  {/* Sol renk çizgisi + ikon */}
                  <div
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: etkinlik.color + "20", color: etkinlik.color }}
                  >
                    <Ikon className="h-3.5 w-3.5" />
                  </div>

                  {/* İçerik */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {etkinlik.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ETKINLIK_ETIKETLERI[etkinlik.source]}
                    </p>
                    {etkinlik.meta?.companyName && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {etkinlik.meta.companyName}
                        {etkinlik.meta.userName ? ` • ${etkinlik.meta.userName}` : ""}
                      </p>
                    )}
                    {etkinlik.meta?.amount && (
                      <MoneyText
                        value={etkinlik.meta.amount}
                        as="p"
                        className="mt-0.5 text-xs font-medium"
                      />
                    )}
                    {etkinlik.meta?.description && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {etkinlik.meta.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
