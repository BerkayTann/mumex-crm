"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useZiyaretleriGetir } from "../../visit/service";
import { useKisileriGetir } from "../../users/service";
import { useSirketleriGetir } from "../../company/service";
import { VisitStatus } from "../../visit/types";
import { GoalProgressCard, MetricInfographicCard, StatCard } from "../components";
import type { MetricChartPoint, TimeRangeKey, TimeRangeOption } from "../components";
import { Banknote, MapPin, Users, Building2, TrendingUp, ShoppingCart } from "lucide-react";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { formatMoney, getMoneyToneClass } from "@/core/utils/money";
import { MoneyText } from "@/components/common/MoneyText";

const RANGE_DEFINITIONS: Record<
  TimeRangeKey,
  { label: string; ms: number; bucketCount: number }
> = {
  day: { label: "Son 24 Saat", ms: 24 * 60 * 60 * 1000, bucketCount: 8 },
  week: { label: "Son 7 Gün", ms: 7 * 24 * 60 * 60 * 1000, bucketCount: 7 },
  month: { label: "Son 30 Gün", ms: 30 * 24 * 60 * 60 * 1000, bucketCount: 10 },
  year: { label: "Son 365 Gün", ms: 365 * 24 * 60 * 60 * 1000, bucketCount: 12 },
};

const RANGE_OPTIONS: TimeRangeOption[] = [
  { key: "day", label: "Gün" },
  { key: "week", label: "Hafta" },
  { key: "month", label: "Ay" },
  { key: "year", label: "Yıl" },
];

const formatTRY = (value: number) => formatMoney(value);
const formatCount = (value: number) => value.toLocaleString("tr-TR");
const pad = (value: number) => value.toString().padStart(2, "0");
const formatTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;
const formatShortDate = (date: Date) => `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;
const formatMonth = (date: Date) => `${pad(date.getMonth() + 1)}/${date.getFullYear().toString().slice(-2)}`;

const sumRange = <T extends { visitDate: string }>(
  items: T[],
  range: TimeRangeKey,
  nowMs: number,
  valueAccessor: (item: T) => number,
) => {
  const start = nowMs - RANGE_DEFINITIONS[range].ms;
  return items.reduce((total, item) => {
    const timestamp = new Date(item.visitDate).getTime();
    if (!Number.isFinite(timestamp) || timestamp < start || timestamp > nowMs) {
      return total;
    }
    return total + valueAccessor(item);
  }, 0);
};

const getBucketMeta = (range: TimeRangeKey, bucketStartMs: number, bucketEndMs: number) => {
  const startDate = new Date(bucketStartMs);
  const endDate = new Date(bucketEndMs);

  switch (range) {
    case "day":
      return {
        label: formatTime(startDate),
        detail: `${formatTime(startDate)} - ${formatTime(endDate)}`,
      };
    case "week":
      return {
        label: formatShortDate(startDate),
        detail: `${formatShortDate(startDate)} günü`,
      };
    case "month":
      return {
        label: formatShortDate(startDate),
        detail: `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`,
      };
    case "year":
      return {
        label: formatMonth(startDate),
        detail: `${formatMonth(startDate)} dönemi`,
      };
  }
};

const buildSeries = <T extends { visitDate: string }>(
  items: T[],
  range: TimeRangeKey,
  nowMs: number,
  valueAccessor: (item: T) => number,
) => {
  const { ms, bucketCount } = RANGE_DEFINITIONS[range];
  const start = nowMs - ms;
  const bucketMs = ms / bucketCount;
  const buckets: MetricChartPoint[] = Array.from({ length: bucketCount }, (_, index) => {
    const bucketStartMs = start + bucketMs * index;
    const bucketEndMs = index === bucketCount - 1 ? nowMs : start + bucketMs * (index + 1);

    return {
      ...getBucketMeta(range, bucketStartMs, bucketEndMs),
      value: 0,
    };
  });

  items.forEach((item) => {
    const timestamp = new Date(item.visitDate).getTime();
    if (!Number.isFinite(timestamp) || timestamp < start || timestamp > nowMs) {
      return;
    }
    const rawIndex = Math.floor((timestamp - start) / bucketMs);
    const index = Math.min(bucketCount - 1, Math.max(0, rawIndex));
    buckets[index].value += valueAccessor(item);
  });

  return buckets;
};

export const DashboardContainer = () => {
  const { user } = useAuth();
  const { data: ziyaretler, isLoading: zYukleniyor } = useZiyaretleriGetir();
  const { data: kisiler, isLoading: kYukleniyor } = useKisileriGetir();
  const { data: sirketler, isLoading: sYukleniyor } = useSirketleriGetir();
  const [ciroRange, setCiroRange] = useState<TimeRangeKey>("day");
  const [satisRange, setSatisRange] = useState<TimeRangeKey>("day");
  const [hedefRange, setHedefRange] = useState<TimeRangeKey>("day");
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const istatistikler = useMemo(() => {
    if (!ziyaretler || !kisiler || !sirketler) return null;

    const tamamlananZiyaretler = ziyaretler.filter((z) => z.status === VisitStatus.COMPLETED);
    const toplamCiro = tamamlananZiyaretler.reduce((toplam, z) => toplam + z.totalAmount, 0);
    const ciroByRange = {} as Record<TimeRangeKey, number>;
    const satisByRange = {} as Record<TimeRangeKey, number>;
    const ciroSeries = {} as Record<TimeRangeKey, MetricChartPoint[]>;
    const satisSeries = {} as Record<TimeRangeKey, MetricChartPoint[]>;

    (Object.keys(RANGE_DEFINITIONS) as TimeRangeKey[]).forEach((range) => {
      ciroByRange[range] = sumRange(
        tamamlananZiyaretler,
        range,
        nowMs,
        (visit) => visit.totalAmount,
      );
      satisByRange[range] = sumRange(tamamlananZiyaretler, range, nowMs, () => 1);
      ciroSeries[range] = buildSeries(
        tamamlananZiyaretler,
        range,
        nowMs,
        (visit) => visit.totalAmount,
      );
      satisSeries[range] = buildSeries(tamamlananZiyaretler, range, nowMs, () => 1);
    });

    const sonZiyaretler = [...ziyaretler]
      .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
      .slice(0, 5);

    return {
      toplamCiro,
      ciroByRange,
      satisByRange,
      ciroSeries,
      satisSeries,
      ziyaretSayisi: tamamlananZiyaretler.length,
      kisiSayisi: kisiler.length,
      sirketSayisi: sirketler.length,
      sonZiyaretler,
    };
  }, [kisiler, nowMs, sirketler, ziyaretler]);

  if (zYukleniyor || kYukleniyor || sYukleniyor) {
    return (
      <div className="flex justify-center p-10">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!istatistikler) return null;

  const ciroAltIcerik = (
    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-400">
      <span className="inline-flex gap-1">
        <span className="text-slate-500">Gün:</span>
        <MoneyText value={istatistikler.ciroByRange.day} className="text-xs font-medium" />
      </span>
      <span className="inline-flex gap-1">
        <span className="text-slate-500">Hafta:</span>
        <MoneyText value={istatistikler.ciroByRange.week} className="text-xs font-medium" />
      </span>
      <span className="inline-flex gap-1">
        <span className="text-slate-500">Ay:</span>
        <MoneyText value={istatistikler.ciroByRange.month} className="text-xs font-medium" />
      </span>
      <span className="inline-flex gap-1">
        <span className="text-slate-500">Yıl:</span>
        <MoneyText value={istatistikler.ciroByRange.year} className="text-xs font-medium" />
      </span>
    </div>
  );

  const hedefler: Record<TimeRangeKey, number> = {
    day: user?.dailyCiroTarget ?? 0,
    week: user?.weeklyCiroTarget ?? 0,
    month: user?.monthlyCiroTarget ?? 0,
    year: (user?.monthlyCiroTarget ?? 0) * 12,
  };

  return (
    <div className="w-full space-y-6 px-4 py-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Hoş Geldin {user?.firstName || user?.fullName || "Kullanıcı"}! 👋
        </h1>
        <p className="mt-1 text-slate-500">İşte sahadaki güncel satış ve ziyaret performansın.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <StatCard
          baslik="Toplam Ciro"
          deger={<MoneyText value={istatistikler.toplamCiro} />}
          degerClassName={getMoneyToneClass(istatistikler.toplamCiro)}
          altIcerik={ciroAltIcerik}
          Ikon={Banknote}
          renkClass="text-emerald-600 bg-emerald-100"
          href="/visit"
        />
        <StatCard
          baslik="Gerçekleşen Ziyaret"
          deger={istatistikler.ziyaretSayisi}
          Ikon={MapPin}
          renkClass="text-purple-600 bg-purple-100"
          href="/visit"
        />
        <StatCard
          baslik="Kayıtlı Doktor/Kişi"
          deger={istatistikler.kisiSayisi}
          Ikon={Users}
          renkClass="text-blue-600 bg-blue-100"
          href="/users"
        />
        <StatCard
          baslik="Kayıtlı Kurum"
          deger={istatistikler.sirketSayisi}
          Ikon={Building2}
          renkClass="text-orange-600 bg-orange-100"
          href="/company"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <MetricInfographicCard
          baslik="Ciro İnfografiği"
          ikon={TrendingUp}
          renkClass="text-emerald-600 bg-emerald-100"
          degerEtiketi={<MoneyText value={istatistikler.ciroByRange[ciroRange]} />}
          donemEtiketi={RANGE_DEFINITIONS[ciroRange].label}
          seri={istatistikler.ciroSeries[ciroRange]}
          aralik={ciroRange}
          araliklar={RANGE_OPTIONS}
          aralikDegistir={setCiroRange}
          degerClassName={getMoneyToneClass(istatistikler.ciroByRange[ciroRange])}
          parasalMi
          degerFormatter={formatTRY}
          chartLineColor="var(--chart-1)"
          chartFillColor="color-mix(in oklab, var(--chart-1) 18%, transparent)"
        />
        <MetricInfographicCard
          baslik="Satış İnfografiği"
          ikon={ShoppingCart}
          renkClass="text-indigo-600 bg-indigo-100"
          degerEtiketi={`${formatCount(istatistikler.satisByRange[satisRange])} adet`}
          donemEtiketi={RANGE_DEFINITIONS[satisRange].label}
          seri={istatistikler.satisSeries[satisRange]}
          aralik={satisRange}
          araliklar={RANGE_OPTIONS}
          aralikDegistir={setSatisRange}
          degerFormatter={(value) => `${formatCount(value)} adet`}
          chartLineColor="var(--chart-2)"
          chartFillColor="color-mix(in oklab, var(--chart-2) 18%, transparent)"
        />
        <GoalProgressCard
          baslik="Ciro Hedefi"
          aralik={hedefRange}
          araliklar={RANGE_OPTIONS}
          aralikDegistir={setHedefRange}
          gerceklesen={istatistikler.ciroByRange[hedefRange]}
          hedef={hedefler[hedefRange]}
          donemEtiketi={RANGE_DEFINITIONS[hedefRange].label}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <TrendingUp className="h-5 w-5 text-slate-400" /> Son Satışlar ve Ziyaretler
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-5">Tarih</th>
                <th className="px-4 py-3 font-medium sm:px-5">Kurum</th>
                <th className="px-4 py-3 font-medium sm:px-5">Doktor</th>
                <th className="px-4 py-3 text-right font-medium sm:px-5">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {istatistikler.sonZiyaretler.map((z) => (
                <tr key={z._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600 sm:px-5">
                    {new Date(z.visitDate).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 sm:px-5">
                    {typeof z.companyId === "object" ? z.companyId.name : "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-600 sm:px-5">
                    {typeof z.userId === "object" ? `${z.userId.firstName} ${z.userId.lastName}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-bold sm:px-5">
                    <MoneyText value={z.totalAmount} />
                  </td>
                </tr>
              ))}
              {istatistikler.sonZiyaretler.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Henüz son aktivite bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
