"use client";

import React, { useState, useMemo, useCallback } from "react";
import { isSameDay, format } from "date-fns";
import { CalendarGrid } from "../components/CalendarGrid";
import { CalendarHeader } from "../components/CalendarHeader";
import { CalendarEventList } from "../components/CalendarEventList";
import { PlanForm } from "../components/PlanForm";
import { PlanCard } from "../components/PlanCard";
import { usePlanlariGetir } from "../service/queries/useCalendarQueries";
import { usePlanEkle, usePlanGuncelle, usePlanSil } from "../service/mutations/usePlanMutations";
import { useZiyaretleriGetir } from "@/features/modules/crm/visit";
import {
  ziyarettenEtkinlikleredonustur,
  plandanEtkinligeDonustur,
  tatildenEtkinligeDonustur,
} from "../service/transformers/calendarTransformers";
import { ayinTatilleriniGetir } from "@/core/constants/holidays";
import { IPlan, ICalendarEvent, ICreatePlanPayload } from "../types";
import { IPlanFormVerisi } from "../schema";

export const CalendarPageContainer = () => {
  const bugun = new Date();
  const [gorunenAy, gorunenAyiAyarla] = useState(bugun.getMonth());
  const [gorunenYil, gorunenYiliAyarla] = useState(bugun.getFullYear());
  const [seciliGun, seciliGunuAyarla] = useState<Date | null>(bugun);
  const [formAcikMi, formAcikMiAyarla] = useState(false);
  const [duzenlenecekPlan, duzenlenecekPlaniAyarla] = useState<IPlan | null>(null);

  // Veri çekme
  const { data: planlar = [], isLoading: planlarYukleniyor } = usePlanlariGetir(gorunenAy, gorunenYil);
  const { data: ziyaretler = [], isLoading: ziyaretlerYukleniyor } = useZiyaretleriGetir();

  // Mutations
  const planEkle = usePlanEkle();
  const planGuncelle = usePlanGuncelle();
  const planSilMutation = usePlanSil();

  // Tatilleri hesapla
  const tatilVerisi = useMemo(() => {
    return ayinTatilleriniGetir(gorunenYil, gorunenAy);
  }, [gorunenYil, gorunenAy]);

  // Tatil tarihlerini Set olarak tut (hızlı erişim)
  const tatilTarihleri = useMemo(() => {
    return new Set(tatilVerisi.map((t) => format(t.tarih, "yyyy-MM-dd")));
  }, [tatilVerisi]);

  // Tüm etkinlikleri birleştir
  const tumEtkinlikler: ICalendarEvent[] = useMemo(() => {
    const ziyaretEtkinlikleri = ziyaretler.flatMap(ziyarettenEtkinlikleredonustur);
    const planEtkinlikleri = planlar.map(plandanEtkinligeDonustur);
    const tatilEtkinlikleri = tatilVerisi.map(tatildenEtkinligeDonustur);
    return [...ziyaretEtkinlikleri, ...planEtkinlikleri, ...tatilEtkinlikleri];
  }, [ziyaretler, planlar, tatilVerisi]);

  // Seçili gün etkinlikleri
  const seciliGunEtkinlikleri = useMemo(() => {
    if (!seciliGun) return [];
    return tumEtkinlikler.filter((e) => {
      const etkinlikTarihi = new Date(e.date);
      return isSameDay(etkinlikTarihi, seciliGun);
    });
  }, [seciliGun, tumEtkinlikler]);

  // Seçili ayın planları (sadece plan card'ları için)
  const ayinPlanlari = useMemo(() => {
    return planlar.filter((p) => !p.isCompleted);
  }, [planlar]);

  // Ay navigasyonu
  const oncekiAyaGit = useCallback(() => {
    if (gorunenAy === 0) {
      gorunenAyiAyarla(11);
      gorunenYiliAyarla((y) => y - 1);
    } else {
      gorunenAyiAyarla((a) => a - 1);
    }
  }, [gorunenAy]);

  const sonrakiAyaGit = useCallback(() => {
    if (gorunenAy === 11) {
      gorunenAyiAyarla(0);
      gorunenYiliAyarla((y) => y + 1);
    } else {
      gorunenAyiAyarla((a) => a + 1);
    }
  }, [gorunenAy]);

  const buguneGit = useCallback(() => {
    const simdi = new Date();
    gorunenAyiAyarla(simdi.getMonth());
    gorunenYiliAyarla(simdi.getFullYear());
    seciliGunuAyarla(simdi);
  }, []);

  // Plan işlemleri
  const onPlanFormuGonder = useCallback(
    async (veri: IPlanFormVerisi) => {
      const payload: ICreatePlanPayload = {
        title: veri.title,
        description: veri.description || undefined,
        date: new Date(veri.date).toISOString(),
        endDate: veri.endDate ? new Date(veri.endDate).toISOString() : undefined,
        type: veri.type,
        isCompleted: veri.isCompleted,
        color: veri.color,
      };

      if (duzenlenecekPlan) {
        await planGuncelle.mutateAsync({ id: duzenlenecekPlan._id, veri: payload });
      } else {
        await planEkle.mutateAsync(payload);
      }
      formAcikMiAyarla(false);
      duzenlenecekPlaniAyarla(null);
    },
    [duzenlenecekPlan, planEkle, planGuncelle]
  );

  const onPlanSil = useCallback(
    async (id: string) => {
      await planSilMutation.mutateAsync(id);
    },
    [planSilMutation]
  );

  const onPlanTamamlandi = useCallback(
    async (id: string) => {
      const plan = planlar.find((p) => p._id === id);
      if (!plan) return;
      const payload: ICreatePlanPayload = {
        title: plan.title,
        description: plan.description,
        date: plan.date,
        endDate: plan.endDate,
        type: plan.type,
        isCompleted: true,
        color: plan.color,
      };
      await planGuncelle.mutateAsync({ id, veri: payload });
    },
    [planlar, planGuncelle]
  );

  const onPlanDuzenle = useCallback((plan: IPlan) => {
    duzenlenecekPlaniAyarla(plan);
    formAcikMiAyarla(true);
  }, []);

  const yukleniyor = planlarYukleniyor || ziyaretlerYukleniyor;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
      {/* Üst başlık */}
      <CalendarHeader
        ay={gorunenAy}
        yil={gorunenYil}
        onOncekiAy={oncekiAyaGit}
        onSonrakiAy={sonrakiAyaGit}
        onBugun={buguneGit}
      />

      {/* Yükleniyor durumu */}
      {yukleniyor && (
        <div className="flex items-center justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-sm text-muted-foreground">Yükleniyor...</span>
        </div>
      )}

      {/* Ana içerik: Grid + Etkinlik Listesi */}
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Takvim Grid */}
        <div className="flex-1 lg:min-w-0">
          <CalendarGrid
            ay={gorunenAy}
            yil={gorunenYil}
            etkinlikler={tumEtkinlikler}
            seciliGun={seciliGun}
            tatilTarihleri={tatilTarihleri}
            onGunSecildi={seciliGunuAyarla}
          />
        </div>

        {/* Sağ panel: Etkinlik listesi */}
        <div className="w-full lg:w-80 xl:w-96">
          <CalendarEventList
            etkinlikler={seciliGunEtkinlikleri}
            seciliTarih={seciliGun}
            onPlanEkleTiklandi={() => {
              duzenlenecekPlaniAyarla(null);
              formAcikMiAyarla(true);
            }}
          />
        </div>
      </div>

      {/* Yaklaşan planlar listesi */}
      {ayinPlanlari.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Bu Ayın Planları ({ayinPlanlari.length})
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {ayinPlanlari.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onDuzenleTiklandi={onPlanDuzenle}
                onSilTiklandi={onPlanSil}
                onTamamlandiTiklandi={onPlanTamamlandi}
              />
            ))}
          </div>
        </div>
      )}

      {/* Plan formu modal */}
      {formAcikMi && (
        <PlanForm
          onFormuGonder={onPlanFormuGonder}
          onIptalEt={() => {
            formAcikMiAyarla(false);
            duzenlenecekPlaniAyarla(null);
          }}
          yukleniyorMu={planEkle.isPending || planGuncelle.isPending}
          ilkVeriler={duzenlenecekPlan || undefined}
          seciliTarih={seciliGun}
        />
      )}
    </div>
  );
};
