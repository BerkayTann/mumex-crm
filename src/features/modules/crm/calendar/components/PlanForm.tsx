"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { IPlan, PlanType } from "../types";
import { IPlanFormVerisi } from "../schema";

interface IPlanFormProps {
  onFormuGonder: (veri: IPlanFormVerisi) => void;
  onIptalEt: () => void;
  yukleniyorMu: boolean;
  ilkVeriler?: IPlan;
  seciliTarih?: Date | null;
}

const PLAN_TIPLERI: { deger: PlanType; etiket: string }[] = [
  { deger: PlanType.VISIT_PLAN, etiket: "Ziyaret Planı" },
  { deger: PlanType.REMINDER, etiket: "Hatırlatıcı" },
  { deger: PlanType.MEETING, etiket: "Toplantı" },
  { deger: PlanType.TASK, etiket: "Görev" },
  { deger: PlanType.OTHER, etiket: "Diğer" },
];

const RENK_SECENEKLERI = [
  { deger: "#6366f1", etiket: "Indigo" },
  { deger: "#f59e0b", etiket: "Amber" },
  { deger: "#10b981", etiket: "Yeşil" },
  { deger: "#3b82f6", etiket: "Mavi" },
  { deger: "#8b5cf6", etiket: "Mor" },
  { deger: "#f43f5e", etiket: "Kırmızı" },
  { deger: "#ec4899", etiket: "Pembe" },
  { deger: "#14b8a6", etiket: "Turkuaz" },
];

export const PlanForm = ({
  onFormuGonder,
  onIptalEt,
  yukleniyorMu,
  ilkVeriler,
  seciliTarih,
}: IPlanFormProps) => {
  const varsayilanTarih = ilkVeriler
    ? ilkVeriler.date.split("T")[0]
    : seciliTarih
      ? seciliTarih.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

  const { register, handleSubmit, watch, formState: { errors } } = useForm<IPlanFormVerisi>({
    defaultValues: {
      title: ilkVeriler?.title || "",
      description: ilkVeriler?.description || "",
      date: varsayilanTarih,
      endDate: ilkVeriler?.endDate?.split("T")[0] || "",
      type: ilkVeriler?.type || PlanType.REMINDER,
      isCompleted: ilkVeriler?.isCompleted || false,
      color: ilkVeriler?.color || "#6366f1",
      relatedCompanyId: "",
      relatedUserId: "",
    },
  });

  const seciliRenk = watch("color");
  const duzenlemeModu = !!ilkVeriler;

  const onFormGonder = handleSubmit((veri) => {
    onFormuGonder(veri);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border/60 bg-card shadow-2xl">
        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            {duzenlemeModu ? "Plan Düzenle" : "Yeni Plan Oluştur"}
          </h2>
          <button
            type="button"
            onClick={onIptalEt}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onFormGonder} className="space-y-4 p-5">
          {/* Başlık */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Başlık <span className="text-destructive">*</span>
            </label>
            <input
              {...register("title", { required: "Başlık zorunludur.", maxLength: { value: 200, message: "En fazla 200 karakter." } })}
              type="text"
              placeholder="Örn: Dr. Yılmaz ile görüşme"
              className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground"
            />
            {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Tarih + Bitiş Tarihi */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Tarih <span className="text-destructive">*</span>
              </label>
              <input
                {...register("date", { required: "Tarih zorunludur." })}
                type="date"
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
              {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Bitiş Tarihi
              </label>
              <input
                {...register("endDate")}
                type="date"
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Tip */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Tür</label>
            <select
              {...register("type")}
              className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
            >
              {PLAN_TIPLERI.map((tip) => (
                <option key={tip.deger} value={tip.deger}>
                  {tip.etiket}
                </option>
              ))}
            </select>
          </div>

          {/* Açıklama */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Açıklama</label>
            <textarea
              {...register("description", { maxLength: { value: 1000, message: "En fazla 1000 karakter." } })}
              rows={3}
              placeholder="Opsiyonel detaylar..."
              className="w-full resize-none rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground"
            />
          </div>

          {/* Renk seçimi */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Renk</label>
            <div className="flex flex-wrap gap-2">
              {RENK_SECENEKLERI.map((renk) => (
                <label key={renk.deger} className="cursor-pointer" title={renk.etiket}>
                  <input
                    {...register("color")}
                    type="radio"
                    value={renk.deger}
                    className="sr-only"
                  />
                  <span
                    className={`
                      block h-7 w-7 rounded-full border-2 transition-all
                      ${seciliRenk === renk.deger
                        ? "scale-110 border-foreground shadow-md"
                        : "border-transparent hover:scale-105"
                      }
                    `}
                    style={{ backgroundColor: renk.deger }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onIptalEt}
              className="rounded-lg border border-border/80 bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={yukleniyorMu}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {yukleniyorMu ? "Kaydediliyor..." : duzenlemeModu ? "Güncelle" : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
