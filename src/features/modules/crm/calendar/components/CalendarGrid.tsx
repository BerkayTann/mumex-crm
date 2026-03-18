"use client";

import React from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
} from "date-fns";
import { ICalendarEvent } from "../types";
import { CalendarDayCell } from "./CalendarDayCell";

interface ICalendarGridProps {
  ay: number;       // 0-indexed
  yil: number;
  etkinlikler: ICalendarEvent[];
  seciliGun: Date | null;
  tatilTarihleri: Set<string>; // ISO date strings
  onGunSecildi: (tarih: Date) => void;
}

const GUN_ISIMLERI = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export const CalendarGrid = ({
  ay,
  yil,
  etkinlikler,
  seciliGun,
  tatilTarihleri,
  onGunSecildi,
}: ICalendarGridProps) => {
  const ayTarihi = new Date(yil, ay);
  const ayBaslangici = startOfMonth(ayTarihi);
  const ayBitisi = endOfMonth(ayTarihi);

  // Grid hücreleri: ayın ilk gününü içeren hafta başlangıcından, son gününü içeren hafta sonuna kadar
  const gridBaslangici = startOfWeek(ayBaslangici, { weekStartsOn: 1 }); // Pazartesi başlangıç
  const gridBitisi = endOfWeek(ayBitisi, { weekStartsOn: 1 });

  const gunler = eachDayOfInterval({ start: gridBaslangici, end: gridBitisi });

  // Etkinlikleri tarihe göre grupla (verimli erişim için)
  const tarihEtkinlikHaritasi = new Map<string, ICalendarEvent[]>();
  for (const etkinlik of etkinlikler) {
    const tarihStr = etkinlik.date.split("T")[0];
    if (!tarihEtkinlikHaritasi.has(tarihStr)) {
      tarihEtkinlikHaritasi.set(tarihStr, []);
    }
    tarihEtkinlikHaritasi.get(tarihStr)!.push(etkinlik);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      {/* Gün isimleri başlıkları */}
      <div className="grid grid-cols-7 border-b border-border/60 bg-muted/30">
        {GUN_ISIMLERI.map((gun) => (
          <div
            key={gun}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {gun}
          </div>
        ))}
      </div>

      {/* Takvim hücreleri */}
      <div className="grid grid-cols-7 gap-px bg-border/30 p-px">
        {gunler.map((gun) => {
          const tarihStr = gun.toISOString().split("T")[0];
          const gunEtkinlikleri = tarihEtkinlikHaritasi.get(tarihStr) || [];

          return (
            <CalendarDayCell
              key={tarihStr}
              tarih={gun}
              etkinlikler={gunEtkinlikleri}
              seciliMi={seciliGun ? isSameDay(gun, seciliGun) : false}
              bugunMu={isToday(gun)}
              buAydaMi={isSameMonth(gun, ayTarihi)}
              tatilMi={tatilTarihleri.has(tarihStr)}
              onTiklandi={() => onGunSecildi(gun)}
            />
          );
        })}
      </div>
    </div>
  );
};
