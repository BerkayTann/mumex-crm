"use client";

import React, { useMemo } from "react";
import { useZiyaretleriGetir } from "../../visit/service";
import { useKisileriGetir } from "../../users/service";
import { useSirketleriGetir } from "../../company/service";
import { StatCard } from "../components";
import { Banknote, MapPin, Users, Building2, TrendingUp } from "lucide-react";
import { useAuth } from "@/features/auth/components/AuthProvider";

export const DashboardContainer = () => {
  const { user } = useAuth();
  const { data: ziyaretler, isLoading: zYukleniyor } = useZiyaretleriGetir();
  const { data: kisiler, isLoading: kYukleniyor } = useKisileriGetir();
  const { data: sirketler, isLoading: sYukleniyor } = useSirketleriGetir();

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
      <div className="flex justify-center p-10">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!istatistikler) return null;

  const ciroGosterim = `${istatistikler.toplamCiro.toLocaleString("tr-TR")} ₺`;
  const ciroAltMetin = `Bu Ay: ${istatistikler.buAykiCiro.toLocaleString("tr-TR")} ₺`;

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
                  <td className="px-4 py-3 text-right font-bold text-emerald-600 sm:px-5">
                    {z.totalAmount.toLocaleString("tr-TR")} ₺
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
