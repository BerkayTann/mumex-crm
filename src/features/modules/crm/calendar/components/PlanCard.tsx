"use client";

import React from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { IPlan, PlanType } from "../types";

interface IPlanCardProps {
  plan: IPlan;
  onDuzenleTiklandi: (plan: IPlan) => void;
  onSilTiklandi: (id: string) => void;
  onTamamlandiTiklandi: (id: string) => void;
}

const TIP_ETIKETLERI: Record<PlanType, string> = {
  [PlanType.VISIT_PLAN]: "Ziyaret Planı",
  [PlanType.REMINDER]: "Hatırlatıcı",
  [PlanType.MEETING]: "Toplantı",
  [PlanType.TASK]: "Görev",
  [PlanType.OTHER]: "Diğer",
};

export const PlanCard = ({
  plan,
  onDuzenleTiklandi,
  onSilTiklandi,
  onTamamlandiTiklandi,
}: IPlanCardProps) => {
  const tarihMetni = format(new Date(plan.date), "d MMM yyyy", { locale: tr });

  return (
    <div
      className={`
        flex items-start gap-3 rounded-lg border p-3 transition-all
        ${plan.isCompleted
          ? "border-border/30 bg-muted/30 opacity-60"
          : "border-border/50 bg-background/50 hover:border-border hover:shadow-sm"
        }
      `}
    >
      {/* Sol renk çizgisi */}
      <div
        className="mt-1 h-10 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: plan.color || "#6366f1" }}
      />

      {/* İçerik */}
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${plan.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {plan.title}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{tarihMetni}</span>
          <span>•</span>
          <span>{TIP_ETIKETLERI[plan.type]}</span>
        </div>
        {plan.description && (
          <p className="mt-1 truncate text-xs text-muted-foreground">{plan.description}</p>
        )}
      </div>

      {/* Aksiyonlar */}
      <div className="flex shrink-0 items-center gap-1">
        {!plan.isCompleted && (
          <button
            type="button"
            onClick={() => onTamamlandiTiklandi(plan._id)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-950 dark:hover:text-emerald-400"
            title="Tamamlandı olarak işaretle"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDuzenleTiklandi(plan)}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Düzenle"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onSilTiklandi(plan._id)}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-400"
          title="Sil"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
