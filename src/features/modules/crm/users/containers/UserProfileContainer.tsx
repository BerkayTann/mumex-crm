"use client";

import React from "react";
import { useKullaniciProfiliGetir } from "../service/queries/useUserProfileQueries";
import { Bolgeler, BolgeTemalari } from "@/core/constants/regions";
import { ildenBolgeGetir } from "@/core/constants/cities";
import { MapPin, Phone, Mail, Award, Calendar, Package } from "lucide-react";

interface IProps {
  userId: string;
}

// Segment etiketi
const SEGMENT_ETIKET: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  A: { label: "A Sınıfı — VIP", bg: "bg-yellow-400", text: "text-yellow-900" },
  B: { label: "B Sınıfı — Düzenli", bg: "bg-blue-400", text: "text-blue-900" },
  C: {
    label: "C Sınıfı — Potansiyel",
    bg: "bg-slate-300",
    text: "text-slate-700",
  },
};

export const UserProfileContainer: React.FC<IProps> = ({ userId }) => {
  const { data: profil, isLoading } = useKullaniciProfiliGetir(userId);

  if (isLoading)
    return (
      <div className="p-10 text-center font-medium text-slate-500">
        profil yükleniyor
      </div>
    );
  if (!profil)
    return (
      <div className="p-10 text-center text-red-500">Profil bulunamadı.</div>
    );

  const { doktor, analiz, gecmisZiyaretler } = profil;
  const kurum = doktor.companyId || {};
  const kurumTyped = kurum as {
    region?: Bolgeler;
    city?: string;
    name?: string;
  };

  // Bölge: önce DB'den al, yoksa şehir adından hesapla
  const bolge: Bolgeler | undefined =
    kurumTyped.region ||
    (kurumTyped.city
      ? (ildenBolgeGetir(kurumTyped.city) as Bolgeler | undefined)
      : undefined);

  // Bölgeye özgü tema
  const tema =
    bolge && BolgeTemalari[bolge]
      ? BolgeTemalari[bolge]
      : {
          gradient: "from-slate-700 via-slate-600 to-slate-500",
          desen: "🏥",
          slogan: "Türkiye Geneli",
        };

  // Segment bilgisi
  const segmentBilgisi =
    SEGMENT_ETIKET[analiz.segment?.charAt(0) || "C"] || SEGMENT_ETIKET["C"];

  return (
    <div className="w-full space-y-6">
      {/* 1. KART: Bölge Temalı Hero Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl shadow-xl text-white p-6 sm:p-8 bg-linear-to-br ${tema.gradient}`}
      >
        {/* Dekoratif arka plan desen */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute -right-8 -top-8 text-9xl opacity-10 select-none">
            {tema.desen}
          </span>
          <span className="absolute -left-4 -bottom-8 text-8xl opacity-10 select-none rotate-12">
            {tema.desen}
          </span>
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
          <div className="absolute left-0 bottom-0 w-48 h-48 rounded-full bg-black/10 translate-y-1/3 -translate-x-1/3" />
        </div>

        {/* ANA İÇERİK — flex layout, mobil uyumlu */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* SOL: İsim, ünvan, kurum, iletişim */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {doktor.title}
              </span>
              <span
                className={`flex items-center gap-1 ${segmentBilgisi.bg} ${segmentBilgisi.text} px-3 py-1 rounded-full text-xs font-bold shadow-sm`}
              >
                <Award className="w-4 h-4" />
                {segmentBilgisi.label}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 drop-shadow">
              {doktor.firstName} {doktor.lastName}
            </h1>
            <p className="text-base sm:text-lg opacity-90 mb-4 flex items-center gap-2">
              {kurumTyped.name || "Bağımsız"}
              <span className="text-sm opacity-75">
                ({doktor.specialty || "Uzmanlık Belirtilmemiş"})
              </span>
            </p>

            {doktor.address && (
              <p className="text-sm opacity-80 mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {doktor.address}
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-sm font-medium">
              {doktor.phone && (
                <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full">
                  <Phone className="w-4 h-4" /> {doktor.phone}
                </div>
              )}
              {doktor.email && (
                <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full">
                  <Mail className="w-4 h-4" /> {doktor.email}
                </div>
              )}
            </div>
          </div>

          {/* SAĞ: İl + Bölge (mobilde üstte, desktop'ta sağda) */}
          <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold tracking-wider">
              <MapPin className="w-4 h-4" />
              {kurumTyped.city?.toUpperCase() || "İL BİLİNMİYOR"}
            </div>
            {bolge && (
              <span className="text-xs bg-white/15 px-3 py-1 rounded-full font-medium">
                {tema.slogan}
              </span>
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
