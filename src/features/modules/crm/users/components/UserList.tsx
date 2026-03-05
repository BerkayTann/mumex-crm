import React, { useState } from "react";
import { IUser } from "../types";
import {
  Users,
  UserPlus,
  Building,
  Pencil,
  Trash2,
  Eye,
  MapPin,
  Search,
} from "lucide-react";
import Link from "next/link";
import { BolgeRenkleri, Bolgeler } from "@/core/constants/regions";
import { ICompany } from "../../company/types";

interface IUserListProps {
  kisiler: IUser[];
  onYeniKisiEkleTiklandi: () => void;
  onDuzenleTiklandi: (kisi: IUser) => void;
  onSilTiklandi: (id: string) => void;
}

export const UserList: React.FC<IUserListProps> = ({
  kisiler,
  onYeniKisiEkleTiklandi,
  onDuzenleTiklandi,
  onSilTiklandi,
}) => {
  // FİLTRELEME STATE'LERİ
  const [aramaMetni, setAramaMetni] = useState("");
  const [seciliBolge, setSeciliBolge] = useState<string>("");

  // FİLTRELEME MANTIĞI
  const filtrelenmisKisiler = kisiler.filter((kisi) => {
    const kurum = kisi.companyId as unknown as ICompany;
    const adSoyad = `${kisi.firstName} ${kisi.lastName}`.toLowerCase();
    const kurumAdi = (kurum?.name || "").toLowerCase();
    const ilIlce =
      `${kurum?.city || ""} ${kurum?.district || ""}`.toLowerCase();

    // Arama metni: Ad, Kurum veya İl'de geçiyor mu?
    const aramaUyuyor =
      adSoyad.includes(aramaMetni.toLowerCase()) ||
      kurumAdi.includes(aramaMetni.toLowerCase()) ||
      ilIlce.includes(aramaMetni.toLowerCase());

    // Bölge eşleşiyor mu?
    const bolgeUyuyor = seciliBolge === "" || kurum?.region === seciliBolge;

    return aramaUyuyor && bolgeUyuyor;
  });

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
            className="w-full pl-10 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={seciliBolge}
            onChange={(e) => setSeciliBolge(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tüm Bölgeler</option>
            {Object.values(Bolgeler).map((bolge) => (
              <option key={bolge} value={bolge}>
                {bolge}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Ad Soyad / Uzmanlık
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Kurum Bilgisi
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  İl / İlçe
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Bölge
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrelenmisKisiler.map((kisi) => {
                const kurum = kisi.companyId as unknown as ICompany;
                const bolgeAdi = kurum?.region as Bolgeler;
                const bolgeRengi =
                  bolgeAdi && BolgeRenkleri[bolgeAdi]
                    ? BolgeRenkleri[bolgeAdi]
                    : null;

                return (
                  <tr
                    key={kisi._id}
                    className="hover:bg-slate-50 transition-colors"
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
                        {kurum?.city || "-"}{" "}
                        {kurum?.district ? `/ ${kurum.district}` : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {bolgeRengi ? (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold border"
                          style={{
                            backgroundColor: `${bolgeRengi.anaRenk}15`, // %15 opacity arka plan
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/users/${kisi._id}`}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Profili İncele"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
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
        {filtrelenmisKisiler.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Aranan kriterlere uygun kişi bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};
