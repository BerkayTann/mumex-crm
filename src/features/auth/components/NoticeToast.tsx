"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type NoticeTone = "success" | "error" | "info";

const toneMap: Record<
  NoticeTone,
  {
    icon: React.ElementType;
    wrapper: string;
    iconColor: string;
    title: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    wrapper: "border-emerald-200/80 bg-emerald-50/95 text-emerald-900",
    iconColor: "text-emerald-600",
    title: "Başarılı",
  },
  error: {
    icon: AlertCircle,
    wrapper: "border-rose-200/80 bg-rose-50/95 text-rose-900",
    iconColor: "text-rose-600",
    title: "Kontrol et",
  },
  info: {
    icon: Info,
    wrapper: "border-sky-200/80 bg-sky-50/95 text-sky-900",
    iconColor: "text-sky-600",
    title: "Bilgi",
  },
};

export const NoticeToast = ({
  message,
  tone,
  onClose,
}: {
  message: string;
  tone: NoticeTone;
  onClose: () => void;
}) => {
  const config = toneMap[tone];
  const Icon = config.icon;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 max-w-sm sm:right-6 sm:top-6">
      <div
        className={`pointer-events-auto rounded-[1.4rem] border px-4 py-4 shadow-2xl backdrop-blur-xl ${config.wrapper}`}
      >
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 ${config.iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] opacity-75">
              {config.title}
            </p>
            <p className="mt-1 text-sm font-medium leading-6">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 opacity-65 transition hover:bg-black/5 hover:opacity-100"
            aria-label="Bildirimi kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

