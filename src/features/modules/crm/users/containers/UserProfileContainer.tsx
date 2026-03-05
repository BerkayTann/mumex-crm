"use client";

import React from "react";
import { useKullaniciProfiliGetir } from "../service/queries/useUserProfileQueries";
import { BolgeRenkleri, Bolgeler } from "@/core/constants/regions";
import {
  MapPin,
  Phone,
  Mail,
  Award,
  TrendingUp,
  Calendar,
  Package,
} from "lucide-react";

interface IProps {
  userId: string;
}

export const UserProfileContainer: React.FC<IProps> = ({ userId }) => {
  const { data: profil, isLoading } = useKullaniciProfiliGetir(userId);

  if (isLoading)
    return (
      <div className="p-10 text-center font-medium text-slate-500">
        Müşteri İstihbarat Dosyası Yükleniyor...
      </div>
    );
  if (!profil)
    return (
      <div className="p-10 text-center text-red-500">Profil bulunamadı.</div>
    );

  const { doktor, analiz, gecmisZiyaretler } = profil;
  const kurum = doktor.companyId || {};

  // Bölge rengini belirle (Eğer kurumun bölgesi yoksa varsayılan olarak Marmara veya Gri bir ton alabiliriz)
  const bolge = (kurum as { region?: Bolgeler }).region;
  const renkPaleti =
    bolge && BolgeRenkleri[bolge]
      ? BolgeRenkleri[bolge]
      : { anaRenk: "#475569", vurguRengi: "#94A3B8" };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 1. KART: Müşteri Kimliği ve Bölge Teması */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-lg text-white p-8"
        style={{ backgroundColor: renkPaleti.anaRenk }}
      >
        {/* Dekoratif Arka Plan Çemberi */}
        <div
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-20"
          style={{ backgroundColor: renkPaleti.vurguRengi }}
        ></div>

        {/* SAĞ ÜST İL BİLGİSİ */}
        <div className="absolute top-6 right-6 flex flex-col items-end">
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold tracking-wider">
            <MapPin className="w-4 h-4" />
            {(kurum as { city?: string }).city?.toUpperCase() ||
              "İL BİLİNMİYOR"}
          </div>
          {bolge && (
            <span className="text-xs mt-2 opacity-80 font-medium">
              {bolge} Bölgesi
            </span>
          )}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {doktor.title}
            </span>
            {/* VIP / SEGMENT BİLGİSİ */}
            <span className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              <Award className="w-4 h-4" />
              {analiz.segment}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            {doktor.firstName} {doktor.lastName}
          </h1>
          <p className="text-lg opacity-90 mb-6 flex items-center gap-2">
            {(kurum as { name?: string }).name || "Bağımsız"}
            <span className="text-sm opacity-75">
              ({doktor.specialty || "Uzmanlık Belirtilmemiş"})
            </span>
          </p>

          <div className="flex gap-6 text-sm font-medium">
            {doktor.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> {doktor.phone}
              </div>
            )}
            {doktor.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> {doktor.email}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. SATIŞ İSTATİSTİKLERİ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">
            Toplam Sağlanan Ciro
          </p>
          <h3 className="text-3xl font-bold text-emerald-600">
            {analiz.toplamCiro.toLocaleString("tr-TR")} ₺
          </h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">
            Gerçekleşen Ziyaret
          </p>
          <h3 className="text-3xl font-bold text-blue-600">
            {analiz.toplamZiyaret} Kez
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Son:{" "}
            {analiz.sonZiyaretTarihi
              ? new Date(analiz.sonZiyaretTarihi).toLocaleDateString("tr-TR")
              : "Yok"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">
            Toplam Ürün Çıkışı
          </p>
          <h3 className="text-3xl font-bold text-purple-600">
            {analiz.toplamUrunAdedi} Adet
          </h3>
        </div>
      </div>

      {/* 3. GEÇMİŞ ZİYARETLER VE ÜRÜN TERCİHLERİ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ürün Dağılımı Özeti */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-500" /> Tercih Edilen
            Ürünler
          </h3>
          <div className="space-y-4">
            {analiz.urunDagilimi.length > 0 ? (
              analiz.urunDagilimi.map((urun, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-slate-700">{urun.ad}</p>
                    <p className="text-xs text-slate-500">
                      {urun.adet} Adet Satıldı
                    </p>
                  </div>
                  <div className="font-bold text-emerald-600">
                    {urun.ciro.toLocaleString("tr-TR")} ₺
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Henüz ürün satışı yok.</p>
            )}
          </div>
        </div>

        {/* Ziyaret Geçmişi Tablosu */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" /> Ziyaret ve Satış
            Geçmişi
          </h3>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">
                    Tarih
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-600">
                    Durum
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-600 text-right">
                    Ciro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gecmisZiyaretler.map((z, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {new Date(z.visitDate).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                        {z.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">
                      {z.totalAmount.toLocaleString("tr-TR")} ₺
                    </td>
                  </tr>
                ))}
                {gecmisZiyaretler.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-slate-400">
                      Geçmiş ziyaret bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
