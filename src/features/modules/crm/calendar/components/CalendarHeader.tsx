"use client";

import React from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface ICalendarHeaderProps {
  ay: number;       // 0-indexed
  yil: number;
  onOncekiAy: () => void;
  onSonrakiAy: () => void;
  onBugun: () => void;
}

export const CalendarHeader = ({
  ay,
  yil,
  onOncekiAy,
  onSonrakiAy,
  onBugun,
}: ICalendarHeaderProps) => {
  const ayAdi = format(new Date(yil, ay), "LLLL yyyy", { locale: tr });
  // İlk harf büyük
  const baslikMetni = ayAdi.charAt(0).toUpperCase() + ayAdi.slice(1);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalendarDays className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {baslikMetni}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBugun}
          className="rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent sm:text-sm"
        >
          Bugün
        </button>

        <div className="flex items-center overflow-hidden rounded-lg border border-border/80 bg-card shadow-sm">
          <button
            type="button"
            onClick={onOncekiAy}
            className="p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="Önceki ay"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="h-5 w-px bg-border/80" />
          <button
            type="button"
            onClick={onSonrakiAy}
            className="p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="Sonraki ay"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
