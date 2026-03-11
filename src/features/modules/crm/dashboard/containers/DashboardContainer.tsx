"use client";

import React, { useMemo, useState } from "react";
import { useZiyaretleriGetir } from "../../visit/service";
import { useKisileriGetir } from "../../users/service";
import { useSirketleriGetir } from "../../company/service";
import { StatCard } from "../components";
import { Banknote, MapPin, Users, Building2, TrendingUp } from "lucide-react";
import { useDovizKurlari } from "@/core/hooks/useExchangeRates";
import { DESTEKLENEN_KURLAR } from "@/core/constants/currencies";

export const DashboardContainer = () => {
  const { data: ziyaretler, isLoading: zYukleniyor } = useZiyaretleriGetir();
  const { data: kisiler, isLoading: kYukleniyor } = useKisileriGetir();
  const { data: sirketler, isLoading: sYukleniyor } = useSirketleriGetir();
  const { data: kurlar } = useDovizKurlari();
  const [ciroDovizi, setCiroDovizi] = useState("TRY");

  const istatistikler = useMemo(() => {
    if (!ziyaretler || !kisiler || !sirketler) return null;

    const toplamCiro = ziyaretler.reduce((toplam, z) => toplam + z.totalAmount, 0);

    const buAy = new Date().getMonth();
    const buAykiCiro = ziyaretler
      .filter((z) => new Date(z.visitDate).getMonth() === buAy)
      .reduce((toplam, z) => toplam + z.totalAmount, 0);

    const sonZiyaretler = [...ziyaretler]
      .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
      .slice(0, 5);

    return {
      toplamCiro,
      buAykiCiro,
      ziyaretSayisi: ziyaretler.length,
      kisiSayisi: kisiler.length,
      sirketSayisi: sirketler.length,
      sonZiyaretler,
    };
  }, [ziyaretler, kisiler, sirketler]);

  if (zYukleniyor || kYukleniyor || sYukleniyor) {
    return (
      <div className="p-10 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!istatistikler) return null;

  const ciroGosterim =
    ciroDovizi === "TRY" || !kurlar
      ? `${istatistikler.toplamCiro.toLocaleString("tr-TR")} ₺`
      : `≈ ${(istatistikler.toplamCiro * kurlar[ciroDovizi]).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ${ciroDovizi}`;

  const ciroAltMetin =
    ciroDovizi === "TRY" || !kurlar
      ? `Bu Ay: ${istatistikler.buAykiCiro.toLocaleString("tr-TR")} ₺`
      : `TRY: ${istatistikler.toplamCiro.toLocaleString("tr-TR")} ₺`;

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Hoş Geldin, Mümessil! 👋</h1>
        <p className="text-slate-500 mt-1">İşte sahadaki güncel satış ve ziyaret performansın.</p>
      </div>

      {/* Ciro döviz seçici */}
      <div className="flex justify-end -mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Ciro görüntüleme:</span>
          <select
            value={ciroDovizi}
            onChange={(e) => setCiroDovizi(e.target.value)}
            disabled={!kurlar}
            className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600 bg-white disabled:opacity-50"
          >
            {DESTEKLENEN_KURLAR.map((d) => (
              <option key={d.kod} value={d.kod}>{d.kod}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        <StatCard
          baslik="Toplam Ciro"
          deger={ciroGosterim}
          altMetin={ciroAltMetin}
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-400" /> Son Satışlar ve Ziyaretler
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-4 sm:px-5 py-3 font-medium">Tarih</th>
                <th className="px-4 sm:px-5 py-3 font-medium">Kurum</th>
                <th className="px-4 sm:px-5 py-3 font-medium">Doktor</th>
                <th className="px-4 sm:px-5 py-3 font-medium text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {istatistikler.sonZiyaretler.map((z) => (
                <tr key={z._id} className="hover:bg-slate-50">
                  <td className="px-4 sm:px-5 py-3 text-slate-600">
                    {new Date(z.visitDate).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 sm:px-5 py-3 font-medium text-slate-800">
                    {typeof z.companyId === "object" ? z.companyId.name : "-"}
                  </td>
                  <td className="px-4 sm:px-5 py-3 text-slate-600">
                    {typeof z.userId === "object"
                      ? `${z.userId.firstName} ${z.userId.lastName}`
                      : "-"}
                  </td>
                  <td className="px-4 sm:px-5 py-3 text-right font-bold text-emerald-600">
                    {z.totalAmount.toLocaleString("tr-TR")} ₺
                  </td>
                </tr>
              ))}
              {istatistikler.sonZiyaretler.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
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
