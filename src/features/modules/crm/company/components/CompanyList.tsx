import React, { useState, useMemo } from "react";
import { ICompany, CompanyType } from "../types";
import { Building2, Pencil, Trash2, Info, Search } from "lucide-react";
import { BolgeRenkleri, Bolgeler } from "@/core/constants/regions";

interface ICompanyListProps {
  sirketler: ICompany[];
  onDuzenleTiklandi: (sirket: ICompany) => void;
  onSilTiklandi: (id: string) => void;
}

const KURUM_TIP_ETIKET: Record<CompanyType, string> = {
  [CompanyType.HOSPITAL]: "Hastane",
  [CompanyType.PHARMACY]: "Eczane",
  [CompanyType.CLINIC]: "Klinik",
};

export const CompanyList: React.FC<ICompanyListProps> = ({
  sirketler,
  onDuzenleTiklandi,
  onSilTiklandi,
}) => {
  const [aramaMetni, setAramaMetni] = useState("");
  const [seciliTip, setSeciliTip] = useState<CompanyType | "">("");
  const [seciliBolge, setSeciliBolge] = useState<Bolgeler | "">("");

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          Kurumlar
        </h1>
        <span className="text-sm text-slate-500">{filtrelenmis.length} / {sirketler.length} kurum</span>
      </div>

      {/* Bilgi notu */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          Kurumlar, kişi kaydı oluşturulurken otomatik eklenir. Yeni kurum eklemek için
          <strong> Kişiler</strong> sayfasından kişi kaydı oluşturun.
        </span>
      </div>

      {/* Filtre Çubuğu */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Kurum adı veya şehir ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            className="bg-transparent outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <select
          value={seciliTip}
          onChange={(e) => setSeciliTip(e.target.value as CompanyType | "")}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white outline-none"
        >
          <option value="">Tüm Tipler</option>
          {Object.entries(KURUM_TIP_ETIKET).map(([deger, etiket]) => (
            <option key={deger} value={deger}>{etiket}</option>
          ))}
        </select>
        <select
          value={seciliBolge}
          onChange={(e) => setSeciliBolge(e.target.value as Bolgeler | "")}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white outline-none"
        >
          <option value="">Tüm Bölgeler</option>
          {Object.values(Bolgeler).map((bolge) => (
            <option key={bolge} value={bolge}>{bolge}</option>
          ))}
        </select>
      </div>

      {filtrelenmis.length === 0 ? (
        <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          {sirketler.length === 0
            ? "Henüz hiç kurum kaydı yok. Kişiler sayfasından kişi ekleyerek kurum oluşturabilirsiniz."
            : "Filtre kriterlerine uyan kurum bulunamadı."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrelenmis.map((sirket) => {
            const bolgeAdi = sirket.region as Bolgeler;
            const bolgeRengi = bolgeAdi && BolgeRenkleri[bolgeAdi] ? BolgeRenkleri[bolgeAdi] : null;

            return (
              <div
                key={sirket._id}
                className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-slate-800 leading-tight">
                    {sirket.name}
                  </h3>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full shrink-0 ml-2">
                    {KURUM_TIP_ETIKET[sirket.type] || sirket.type}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-1">
                  📍 {sirket.city}
                  {sirket.district ? ` / ${sirket.district}` : ""}
                </p>

                {bolgeRengi && (
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1 border"
                    style={{
                      backgroundColor: `${bolgeRengi.anaRenk}15`,
                      color: bolgeRengi.anaRenk,
                      borderColor: `${bolgeRengi.anaRenk}30`,
                    }}
                  >
                    {bolgeAdi}
                  </span>
                )}

                {sirket.phone && (
                  <p className="text-sm text-slate-500">📞 {sirket.phone}</p>
                )}

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
