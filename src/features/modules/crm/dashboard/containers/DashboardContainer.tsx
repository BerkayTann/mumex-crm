"use client";

import React, { useMemo } from "react";
import { useZiyaretleriGetir } from "../../visit/service";
import { useKisileriGetir } from "../../users/service";
import { useSirketleriGetir } from "../../company/service";
import { StatCard } from "../components";
import { DollarSign, MapPin, Users, Building2, TrendingUp } from "lucide-react";

export const DashboardContainer = () => {
  //Tüm modüllerden veri çekilir.
  const { data: ziyaretler, isLoading: zYukleniyor } = useZiyaretleriGetir();
  const { data: kisiler, isLoading: kYukleniyor } = useKisileriGetir();
  const { data: sirketler, isLoading: sYukleniyor } = useSirketleriGetir();

  //Veriler canlı hespalanır
  const istatistikler = useMemo(() => {
    if (!ziyaretler || !kisiler || !sirketler) return null;

    //1.Toplam Ciro Hesaplama(ziyaretlerdeki totalAmount ları topla)
    const toplamCiro = ziyaretler.reduce(
      (toplam, z) => toplam + z.totalAmount,
      0,
    );

    //2.Bu ay yapılan satışları bul
    const buAy = new Date().getMonth();
    const buAykiCiro = ziyaretler
      .filter((z) => new Date(z.visitDate).getMonth() === buAy)
      .reduce((toplam, z) => toplam + z.totalAmount, 0);

    // 3. En son yapılan 5 ziyareti al
    const sonZiyaretler = [...ziyaretler]
      .sort(
        (a, b) =>
          new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime(),
      )
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Hoş Geldin, Mümessil! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          İşte sahadaki güncel satış ve ziyaret performansın.
        </p>
      </div>

      {/* Üst Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          baslik="Toplam Ciro"
          deger={`${istatistikler.toplamCiro.toLocaleString("tr-TR")} ₺`}
          altMetin={`Bu Ay: ${istatistikler.buAykiCiro.toLocaleString("tr-TR")} ₺`}
          Ikon={DollarSign}
          renkClass="text-emerald-600 bg-emerald-100"
        />
        <StatCard
          baslik="Gerçekleşen Ziyaret"
          deger={istatistikler.ziyaretSayisi}
          Ikon={MapPin}
          renkClass="text-purple-600 bg-purple-100"
        />
        <StatCard
          baslik="Kayıtlı Doktor/Kişi"
          deger={istatistikler.kisiSayisi}
          Ikon={Users}
          renkClass="text-blue-600 bg-blue-100"
        />
        <StatCard
          baslik="Kayıtlı Kurum"
          deger={istatistikler.sirketSayisi}
          Ikon={Building2}
          renkClass="text-orange-600 bg-orange-100"
        />
      </div>

      {/* Alt Tablo: Son Aktiviteler */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-400" /> Son Satışlar ve
            Ziyaretler
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Tarih</th>
                <th className="px-6 py-4 font-medium">Kurum</th>
                <th className="px-6 py-4 font-medium">Doktor</th>
                <th className="px-6 py-4 font-medium text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {istatistikler.sonZiyaretler.map((z) => (
                <tr key={z._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(z.visitDate).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {typeof z.companyId === "object" ? z.companyId.name : "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {typeof z.userId === "object"
                      ? `${z.userId.firstName} ${z.userId.lastName}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">
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
