import React, { useState } from "react";
import { IUser, KisiSegmenti } from "../types";
import {
  Users,
  UserPlus,
  Building,
  Pencil,
  Trash2,
  Eye,
  MapPin,
  Search,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BolgeRenkleri, Bolgeler } from "@/core/constants/regions";
import { ICompany } from "../../company/types";

interface IUserListProps {
  kisiler: IUser[];
  onYeniKisiEkleTiklandi: () => void;
  onDuzenleTiklandi: (kisi: IUser) => void;
  onSilTiklandi: (id: string) => void;
}

type SiralamaKolonu = "adSoyad" | "kurum" | "il" | "bolge" | "sinif";
type SiralamaYonu = "asc" | "desc";

// Segment badge stilleri
const SEGMENT_STIL: Record<KisiSegmenti, { bg: string; text: string; label: string }> = {
  A: { bg: "bg-emerald-100", text: "text-emerald-700", label: "A Sınıfı" },
  B: { bg: "bg-blue-100", text: "text-blue-700", label: "B Sınıfı" },
  C: { bg: "bg-amber-100", text: "text-amber-700", label: "C Sınıfı" },
};

export const UserList: React.FC<IUserListProps> = ({
  kisiler,
  onYeniKisiEkleTiklandi,
  onDuzenleTiklandi,
  onSilTiklandi,
}) => {
  const router = useRouter();

  const [aramaMetni, setAramaMetni] = useState("");
  const [seciliBolge, setSeciliBolge] = useState<string>("");
  const [seciliSinif, setSeciliSinif] = useState<string>("");
  const [siralamaKolonu, setSiralamaKolonu] = useState<SiralamaKolonu | null>(null);
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
    if (siralamaKolonu !== kolon) return <ChevronsUpDown className="w-3 h-3 ml-1 text-slate-400" />;
    return siralamaYonu === "asc"
      ? <ChevronUp className="w-3 h-3 ml-1 text-indigo-600" />
      : <ChevronDown className="w-3 h-3 ml-1 text-indigo-600" />;
  };

  // FİLTRELEME
  const filtrelenmisKisiler = kisiler.filter((kisi) => {
    const kurum = kisi.companyId as unknown as ICompany;
    const adSoyad = `${kisi.firstName} ${kisi.lastName}`.toLowerCase();
    const kurumAdi = (kurum?.name || "").toLowerCase();
    const ilIlce = `${kurum?.city || ""} ${kurum?.district || ""}`.toLowerCase();

    const aramaUyuyor =
      adSoyad.includes(aramaMetni.toLowerCase()) ||
      kurumAdi.includes(aramaMetni.toLowerCase()) ||
      ilIlce.includes(aramaMetni.toLowerCase());

    const bolgeUyuyor = seciliBolge === "" || kurum?.region === seciliBolge;
    const sinifUyuyor = seciliSinif === "" || kisi.segment === seciliSinif;

    return aramaUyuyor && bolgeUyuyor && sinifUyuyor;
  });

  // SIRALAMA
  const siraliKisiler = [...filtrelenmisKisiler].sort((a, b) => {
    if (!siralamaKolonu) return 0;
    const kurumA = a.companyId as unknown as ICompany;
    const kurumB = b.companyId as unknown as ICompany;

    let degerA = "";
    let degerB = "";

    if (siralamaKolonu === "adSoyad") {
      degerA = `${a.firstName} ${a.lastName}`;
      degerB = `${b.firstName} ${b.lastName}`;
    } else if (siralamaKolonu === "kurum") {
      degerA = kurumA?.name || "";
      degerB = kurumB?.name || "";
    } else if (siralamaKolonu === "il") {
      degerA = kurumA?.city || "";
      degerB = kurumB?.city || "";
    } else if (siralamaKolonu === "bolge") {
      degerA = kurumA?.region || "";
      degerB = kurumB?.region || "";
    } else if (siralamaKolonu === "sinif") {
      degerA = a.segment || "C";
      degerB = b.segment || "C";
    }

    return siralamaYonu === "asc"
      ? degerA.localeCompare(degerB, "tr")
      : degerB.localeCompare(degerA, "tr");
  });

  const satiraTiklandi = (kisiId: string) => {
    router.push(`/users/${kisiId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Kişiler ve Doktorlar
        </h1>
        <button
          onClick={onYeniKisiEkleTiklandi}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-all shadow-sm"
        >
          <UserPlus className="w-5 h-5" /> Yeni Kişi Ekle
        </button>
      </div>

      {/* FİLTRE ÇUBUĞU */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Doktor, Kurum veya İl Ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            className="w-full pl-10 p-2 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="w-full md:w-52">
          <select
            value={seciliBolge}
            onChange={(e) => setSeciliBolge(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tüm Bölgeler</option>
            {Object.values(Bolgeler).map((bolge) => (
              <option key={bolge} value={bolge}>{bolge}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-40">
          <select
            value={seciliSinif}
            onChange={(e) => setSeciliSinif(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tüm Sınıflar</option>
            <option value="A">A Sınıfı (VIP)</option>
            <option value="B">B Sınıfı (Düzenli)</option>
            <option value="C">C Sınıfı (Potansiyel)</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  className="px-6 py-4 text-sm font-semibold text-slate-600 cursor-pointer select-none hover:bg-slate-100"
                  onClick={() => siralamaToggle("adSoyad")}
                >
                  <span className="flex items-center">
                    Ad Soyad / Uzmanlık <SiralamaIkon kolon="adSoyad" />
                  </span>
                </th>
                <th
                  className="px-6 py-4 text-sm font-semibold text-slate-600 cursor-pointer select-none hover:bg-slate-100"
                  onClick={() => siralamaToggle("kurum")}
                >
                  <span className="flex items-center">
                    Kurum Bilgisi <SiralamaIkon kolon="kurum" />
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
                  className="px-6 py-4 text-sm font-semibold text-slate-600 cursor-pointer select-none hover:bg-slate-100"
                  onClick={() => siralamaToggle("sinif")}
                >
                  <span className="flex items-center">
                    Sınıf <SiralamaIkon kolon="sinif" />
                  </span>
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Açık Adres
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {siraliKisiler.map((kisi) => {
                const kurum = kisi.companyId as unknown as ICompany;
                const bolgeAdi = kurum?.region as Bolgeler;
                const bolgeRengi =
                  bolgeAdi && BolgeRenkleri[bolgeAdi]
                    ? BolgeRenkleri[bolgeAdi]
                    : null;
                const sinifStil = kisi.segment ? SEGMENT_STIL[kisi.segment] : null;

                return (
                  <tr
                    key={kisi._id}
                    onClick={() => satiraTiklandi(kisi._id)}
                    className="hover:bg-indigo-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {kisi.firstName} {kisi.lastName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {kisi.title} - {kisi.specialty || "Belirtilmemiş"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1 font-medium">
                        <Building className="w-4 h-4 text-slate-400" />
                        {kurum?.name || "Bilinmiyor"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {kurum?.city || "-"}
                        {kurum?.district ? ` / ${kurum.district}` : ""}
                      </div>
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
                    <td className="px-6 py-4">
                      {sinifStil ? (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${sinifStil.bg} ${sinifStil.text}`}
                        >
                          {sinifStil.label}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-[150px]">
                      {kisi.address ? (
                        <span className="block truncate" title={kisi.address}>
                          {kisi.address}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className="flex justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => router.push(`/users/${kisi._id}`)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Profili İncele"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDuzenleTiklandi(kisi)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Düzenle"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSilTiklandi(kisi._id)}
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
        {siraliKisiler.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Aranan kriterlere uygun kişi bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};
