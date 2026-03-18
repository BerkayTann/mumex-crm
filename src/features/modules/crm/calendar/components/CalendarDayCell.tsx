"use client";

import React from "react";
import { ICalendarEvent } from "../types";

interface ICalendarDayCellProps {
  tarih: Date;
  etkinlikler: ICalendarEvent[];
  seciliMi: boolean;
  bugunMu: boolean;
  buAydaMi: boolean;
  tatilMi: boolean;
  onTiklandi: () => void;
}

export const CalendarDayCell = ({
  tarih,
  etkinlikler,
  seciliMi,
  bugunMu,
  buAydaMi,
  tatilMi,
  onTiklandi,
}: ICalendarDayCellProps) => {
  const gun = tarih.getDate();
  const gosterilecekEtkinlikler = etkinlikler.slice(0, 3);
  const kalanSayisi = etkinlikler.length - 3;

  return (
    <button
      type="button"
      onClick={onTiklandi}
      className={`
        group relative flex min-h-[72px] flex-col items-start rounded-lg border p-1.5 text-left transition-all
        sm:min-h-[90px] sm:p-2
        ${seciliMi
          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
          : "border-border/50 hover:border-border hover:bg-accent/30"
        }
        ${!buAydaMi ? "opacity-40" : ""}
        ${tatilMi && buAydaMi ? "bg-rose-50/50 dark:bg-rose-950/10" : ""}
      `}
    >
      {/* Gün numarası */}
      <span
        className={`
          inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium
          sm:h-7 sm:w-7 sm:text-sm
          ${bugunMu
            ? "bg-primary text-primary-foreground shadow-sm"
            : buAydaMi
              ? "text-foreground"
              : "text-muted-foreground"
          }
        `}
      >
        {gun}
      </span>

      {/* Etkinlik noktaları */}
      <div className="mt-0.5 flex flex-wrap gap-0.5 sm:mt-1 sm:gap-1">
        {gosterilecekEtkinlikler.map((e) => (
          <span
            key={e.id}
            className="hidden h-1.5 w-1.5 rounded-full sm:block sm:h-2 sm:w-2"
            style={{ backgroundColor: e.color }}
            title={e.title}
          />
        ))}
        {/* Mobilde tek nokta göster */}
        {etkinlikler.length > 0 && (
          <span
            className="block h-1.5 w-1.5 rounded-full sm:hidden"
            style={{ backgroundColor: etkinlikler[0].color }}
          />
        )}
        {kalanSayisi > 0 && (
          <span className="hidden text-[10px] leading-none text-muted-foreground sm:inline">
            +{kalanSayisi}
          </span>
        )}
      </div>
    </button>
  );
};
