import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { getMoneyToneClass } from "@/core/utils/money";
import { MoneyText } from "@/components/common/MoneyText";
import { TimeRangeTabs } from "./TimeRangeTabs";
import type { TimeRangeKey, TimeRangeOption } from "./TimeRangeTabs";

interface GoalProgressCardProps {
  baslik: string;
  aralik: TimeRangeKey;
  araliklar: TimeRangeOption[];
  aralikDegistir: (value: TimeRangeKey) => void;
  gerceklesen: number;
  hedef: number;
  donemEtiketi: string;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  baslik,
  aralik,
  araliklar,
  aralikDegistir,
  gerceklesen,
  hedef,
  donemEtiketi,
}) => {
  const progress = hedef > 0 ? gerceklesen / hedef : 0;
  const progressPercent = hedef > 0 ? Math.round(progress * 100) : 0;
  const cappedProgress = Math.min(progress, 1);
  const fark = gerceklesen - hedef;
  const kalanEtiketi = fark >= 0 ? "Hedef Fazlası" : "Kalan";
  const kalanDegeri = Math.abs(fark);
  const durumEtiketi =
    progressPercent >= 100 ? "Hedef aşıldı" : progressPercent >= 75 ? "Hedefe yakın" : "Takipte";
  const gerceklesenTone = getMoneyToneClass(gerceklesen);
  const hedefTone = getMoneyToneClass(hedef);
  const kalanTone = getMoneyToneClass(fark);

  const size = 156;
  const stroke = 13;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - cappedProgress);

  return (
    <div
      className="flex h-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground"
      style={{ boxShadow: "var(--elevation-md)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-primary"
            style={{
              backgroundColor: "color-mix(in oklab, var(--primary) 14%, var(--card))",
            }}
          >
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{baslik}</p>
            <p className="text-xs text-muted-foreground">{donemEtiketi}</p>
          </div>
        </div>
        <TimeRangeTabs options={araliklar} value={aralik} onChange={aralikDegistir} />
      </div>

      {hedef <= 0 ? (
        <div
          className="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground"
          style={{ backgroundColor: "var(--surface-1)" }}
        >
          <p>Bu dönem için ciro hedefi belirlenmemiş.</p>
          <Link href="/profile" className="mt-3 text-sm font-semibold text-primary hover:opacity-85">
            Profilinden hedef belirle
          </Link>
        </div>
      ) : (
        <div className="mt-5 flex flex-1 flex-col justify-between gap-5">
          <div className="grid gap-5 lg:grid-cols-[auto,1fr] lg:items-center">
            <div
              className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full border border-border"
              style={{
                backgroundColor: "var(--surface-1)",
                boxShadow: "var(--elevation-sm)",
              }}
            >
              <svg width={size} height={size} className="h-[156px] w-[156px] -rotate-90">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={stroke}
                  fill="transparent"
                  style={{ stroke: "color-mix(in oklab, var(--border) 82%, transparent)" }}
                />
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset: dashOffset }}
                  initial={{ strokeDashoffset: circumference }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ stroke: "var(--primary)" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${progressPercent >= 100 ? "text-primary" : "text-foreground"}`}>
                  %{progressPercent}
                </span>
                <span className="mt-1 text-[11px] font-medium text-muted-foreground">
                  {donemEtiketi}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div
                className="inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
                style={{
                  borderColor: "color-mix(in oklab, var(--primary) 18%, var(--border))",
                  backgroundColor: "color-mix(in oklab, var(--primary) 10%, var(--card))",
                }}
              >
                {durumEtiketi}
              </div>

              <div
                className="rounded-2xl border border-border px-4 py-4"
                style={{ backgroundColor: "var(--surface-1)" }}
              >
                <p className="text-xs font-medium text-muted-foreground">Gerçekleşen</p>
                <MoneyText
                  as="p"
                  value={gerceklesen}
                  className={`mt-2 text-2xl font-bold ${gerceklesenTone}`}
                />
                <p className="mt-1 text-xs text-muted-foreground">Seçili dönem performansı</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div
                  className="rounded-2xl border border-border px-4 py-3"
                  style={{ backgroundColor: "var(--surface-1)" }}
                >
                  <p className="text-xs font-medium text-muted-foreground">Hedef</p>
                  <MoneyText
                    as="p"
                    value={hedef}
                    className={`mt-1 text-base font-semibold ${hedefTone}`}
                  />
                </div>
                <div
                  className="rounded-2xl border border-border px-4 py-3"
                  style={{ backgroundColor: "var(--surface-1)" }}
                >
                  <p className="text-xs font-medium text-muted-foreground">{kalanEtiketi}</p>
                  <MoneyText
                    as="p"
                    value={kalanDegeri}
                    className={`mt-1 text-base font-semibold ${kalanTone}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>İlerleme</span>
              <span>%{progressPercent}</span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--surface-2)" }}
            >
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
