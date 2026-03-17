import React, { useState, useMemo } from "react";
import { ICompany, CompanyType } from "../types";
import { IUser } from "../../users/types";
import {
  Building2,
  Pencil,
  Trash2,
  Search,
  X,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { BolgeRenkleri, Bolgeler } from "@/core/constants/regions";

interface ICompanyListProps {
  sirketler: ICompany[];
  kisiler: IUser[];
  onDuzenleTiklandi: (sirket: ICompany) => void;
  onSilTiklandi: (id: string) => void;
}

type SiralamaKolonu = "ad" | "tip" | "il" | "bolge" | "kisiSayisi";
type SiralamaYonu = "asc" | "desc";

const KURUM_TIP_ETIKET: Record<CompanyType, string> = {
  [CompanyType.HOSPITAL]: "Hastane",
  [CompanyType.PHARMACY]: "Eczane",
  [CompanyType.CLINIC]: "Klinik",
};

export const CompanyList: React.FC<ICompanyListProps> = ({
  sirketler,
  kisiler,
  onDuzenleTiklandi,
  onSilTiklandi,
}) => {
  const [aramaMetni, setAramaMetni] = useState("");
  const [seciliTip, setSeciliTip] = useState<CompanyType | "">("");
  const [seciliBolge, setSeciliBolge] = useState<Bolgeler | "">("");
  const [detayModalSirket, setDetayModalSirket] = useState<ICompany | null>(
    null
  );
  const [siralamaKolonu, setSiralamaKolonu] = useState<SiralamaKolonu | null>(
    null
  );
  const [siralamaYonu, setSiralamaYonu] = useState<SiralamaYonu>("asc");

  const siralamaToggle = (kolon: SiralamaKolonu) => {
    if (siralamaKolonu === kolon) {
      setSiralamaYonu((y) => (y === "asc" ? "desc" : "asc"));
    } else {
      setSiralamaKolonu(kolon);
      setSiralamaYonu("asc");
    }
  };

  const SiralamaIkon = ({ kolon }: { kolon: SiralamaKolonu }) => {
    if (siralamaKolonu !== kolon)
      return <ChevronsUpDown className="w-3 h-3 ml-1 text-slate-400" />;
    return siralamaYonu === "asc" ? (
      <ChevronUp className="w-3 h-3 ml-1 text-indigo-600" />
    ) : (
      <ChevronDown className="w-3 h-3 ml-1 text-indigo-600" />
    );
  };

  // Filtreleme
  const filtrelenmis = useMemo(() => {
    return sirketler.filter((s) => {
      const aramaUyuyor =
        aramaMetni === "" ||
        s.name.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        (s.city || "").toLowerCase().includes(aramaMetni.toLowerCase());
      const tipUyuyor = seciliTip === "" || s.type === seciliTip;
      const bolgeUyuyor = seciliBolge === "" || s.region === seciliBolge;
      return aramaUyuyor && tipUyuyor && bolgeUyuyor;
    });
  }, [sirketler, aramaMetni, seciliTip, seciliBolge]);

  // Sıralama
  const siraliSirketler = useMemo(() => {
    const sorted = [...filtrelenmis].sort((a, b) => {
      if (!siralamaKolonu) return 0;

      let degerA: string | number = "";
      let degerB: string | number = "";

      if (siralamaKolonu === "ad") {
        degerA = a.name;
        degerB = b.name;
      } else if (siralamaKolonu === "tip") {
        degerA = a.type;
        degerB = b.type;
      } else if (siralamaKolonu === "il") {
        degerA = a.city || "";
        degerB = b.city || "";
      } else if (siralamaKolonu === "bolge") {
        degerA = a.region || "";
        degerB = b.region || "";
      } else if (siralamaKolonu === "kisiSayisi") {
        degerA = kisiler.filter((k) => {
          const cId = (k.companyId as any)?._id || k.companyId;
          return String(cId) === String(a._id);
        }).length;
        degerB = kisiler.filter((k) => {
          const cId = (k.companyId as any)?._id || k.companyId;
          return String(cId) === String(b._id);
        }).length;
      }

      if (typeof degerA === "string" && typeof degerB === "string") {
        return siralamaYonu === "asc"
          ? degerA.localeCompare(degerB, "tr")
          : degerB.localeCompare(degerA, "tr");
      }
      return siralamaYonu === "asc"
        ? (degerA as number) - (degerB as number)
        : (degerB as number) - (degerA as number);
    });
    return sorted;
  }, [filtrelenmis, siralamaKolonu, siralamaYonu, kisiler]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          Kurumlar
        </h1>
        <span className="text-sm text-slate-500">
          {filtrelenmis.length} / {sirketler.length} kurum
        </span>
      </div>

      {/* Filtre Çubuğu */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Kurum adı veya şehir ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            className="w-full pl-10 p-2 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={seciliTip}
          onChange={(e) => setSeciliTip(e.target.value as CompanyType | "")}
          className="w-full md:w-40 p-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tüm Tipler</option>
          {Object.entries(KURUM_TIP_ETIKET).map(([deger, etiket]) => (
            <option key={deger} value={deger}>
              {etiket}
            </option>
          ))}
        </select>
        <select
          value={seciliBolge}
          onChange={(e) => setSeciliBolge(e.target.value as Bolgeler | "")}
          className="w-full md:w-40 p-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tüm Bölgeler</option>
          {Object.values(Bolgeler).map((bolge) => (
            <option key={bolge} value={bolge}>
              {bolge}
            </option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  className="px-6 py-4 text-sm font-semibold text-slate-600 cursor-pointer select-none hover:bg-slate-100"
                  onClick={() => siralamaToggle("ad")}
                >
                  <span className="flex items-center">
                    Kurum Adı <SiralamaIkon kolon="ad" />
                  </span>
                </th>
                <th
                  className="px-6 py-4 text-sm font-semibold text-slate-600 cursor-pointer select-none hover:bg-slate-100"
                  onClick={() => siralamaToggle("tip")}
                >
                  <span className="flex items-center">
                    Tip <SiralamaIkon kolon="tip" />
                  </span>
                </th>
                <th
                  className="px-6 py-4 text-sm font-semibold text-slate-600 cursor-pointer select-none hover:bg-slate-100"
                  onClick={() => siralamaToggle("il")}
                >
                  <span className="flex items-center">
                    İl / İlçe <SiralamaIkon kolon="il" />
                  </span>
                </th>
                <th
                  className="px-6 py-4 text-sm font-semibold text-slate-600 cursor-pointer select-none hover:bg-slate-100"
                  onClick={() => siralamaToggle("bolge")}
                >
                  <span className="flex items-center">
                    Bölge <SiralamaIkon kolon="bolge" />
                  </span>
                </th>
                <th
                  className="px-6 py-4 text-sm font-semibold text-slate-600 cursor-pointer select-none hover:bg-slate-100 text-center"
                  onClick={() => siralamaToggle("kisiSayisi")}
                >
                  <span className="flex items-center justify-center">
                    Kişi Sayısı <SiralamaIkon kolon="kisiSayisi" />
                  </span>
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {siraliSirketler.map((sirket) => {
                const bolgeAdi = sirket.region as Bolgeler;
                const bolgeRengi =
                  bolgeAdi && BolgeRenkleri[bolgeAdi]
                    ? BolgeRenkleri[bolgeAdi]
                    : null;
                const kisiSayisi = kisiler.filter((k) => {
                  const cId = (k.companyId as any)?._id || k.companyId;
                  return String(cId) === String(sirket._id);
                }).length;

                return (
                  <tr
                    key={sirket._id}
                    onClick={() => setDetayModalSirket(sirket)}
                    className="hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {sirket.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {KURUM_TIP_ETIKET[sirket.type] || sirket.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {sirket.city}
                      {sirket.district ? ` / ${sirket.district}` : ""}
                    </td>
                    <td className="px-6 py-4">
                      {bolgeRengi ? (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold border"
                          style={{
                            backgroundColor: `${bolgeRengi.anaRenk}15`,
                            color: bolgeRengi.anaRenk,
                            borderColor: `${bolgeRengi.anaRenk}30`,
                          }}
                        >
                          {bolgeAdi}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center font-semibold">
                      {kisiSayisi}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className="flex justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onDuzenleTiklandi(sirket)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Düzenle"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSilTiklandi(sirket._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detay Modal */}
      {detayModalSirket && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                {detayModalSirket.name}
              </h3>
              <button
                onClick={() => setDetayModalSirket(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
              {/* Kurum Bilgileri */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                  Kurum Bilgileri
                </h4>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs mb-0.5">
                      Tip
                    </span>
                    <p className="text-slate-700">
                      {KURUM_TIP_ETIKET[detayModalSirket.type] ||
                        detayModalSirket.type}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-xs mb-0.5">
                      Şehir / İlçe
                    </span>
                    <p className="text-slate-700">
                      {detayModalSirket.city}
                      {detayModalSirket.district &&
                        ` / ${detayModalSirket.district}`}
                    </p>
                  </div>

                  {detayModalSirket.region && (
                    <div>
                      <span className="text-slate-500 block text-xs mb-0.5">
                        Bölge
                      </span>
                      <p className="text-slate-700">
                        {detayModalSirket.region}
                      </p>
                    </div>
                  )}

                  {detayModalSirket.phone && (
                    <div>
                      <span className="text-slate-500 block text-xs mb-0.5">
                        Telefon
                      </span>
                      <p className="text-slate-700">
                        {detayModalSirket.phone}
                      </p>
                    </div>
                  )}

                  {detayModalSirket.address && (
                    <div>
                      <span className="text-slate-500 block text-xs mb-0.5">
                        Açık Adres
                      </span>
                      <p className="text-slate-700">
                        {detayModalSirket.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Kayıtlı Kişiler */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                  Bu Kuruma Kayıtlı Müşteriler
                </h4>
                <div className="space-y-2">
                  {kisiler
                    .filter((k) => {
                      const cId = (k.companyId as any)?._id || k.companyId;
                      return String(cId) === String(detayModalSirket._id);
                    })
                    .map((kisi) => (
                      <div
                        key={kisi._id}
                        className="p-2 bg-slate-50 rounded text-sm border border-slate-100"
                      >
                        <p className="font-medium text-slate-800">
                          {kisi.firstName} {kisi.lastName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {kisi.title}
                          {kisi.specialty ? ` - ${kisi.specialty}` : ""}
                        </p>
                      </div>
                    ))}
                  {kisiler.filter((k) => {
                    const cId = (k.companyId as any)?._id || k.companyId;
                    return String(cId) === String(detayModalSirket._id);
                  }).length === 0 && (
                    <p className="text-xs text-slate-400 italic">
                      — Kayıtlı kişi yok
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
              <button
                onClick={() => setDetayModalSirket(null)}
                className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  onDuzenleTiklandi(detayModalSirket);
                  setDetayModalSirket(null);
                }}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >
                Düzenle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
