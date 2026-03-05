import React from "react";
import { ICompany, CompanyType } from "../types";
import { Building2, PlusCircle, Pencil, Trash2 } from "lucide-react";

// Bileşenin dışarıdan alacağı verilerin (props) tipini belirliyoruz
interface ICompanyListProps {
  sirketler: ICompany[];
  onYeniSirketEkleTiklandi: () => void; // Butona tıklanma olayını (event) yukarıya (Container'a) iletiyoruz
  onDuzenleTiklandi: (sirket: ICompany) => void; // Düzenleme olayını yukarıya iletiyoruz
  onSilTiklandi: (id: string) => void; // Silme olayını yukarıya iletiyoruz
}

// Saf bileşenimiz (İngilizce isim, içerideki mantık Türkçe)
export const CompanyList: React.FC<ICompanyListProps> = ({
  sirketler,
  onYeniSirketEkleTiklandi,
  onDuzenleTiklandi,
  onSilTiklandi,
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          Kurumlar
        </h1>
        <button
          onClick={onYeniSirketEkleTiklandi}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Yeni Kurum Ekle
        </button>
      </div>

      {sirketler.length === 0 ? (
        <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          Henüz hiç kurum eklenmemiş.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sirketler.map((sirket) => (
            <div
              key={sirket._id}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-slate-800">
                  {sirket.name}
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                  {sirket.type === CompanyType.HOSPITAL
                    ? "Hastane"
                    : sirket.type === CompanyType.PHARMACY
                      ? "Eczane"
                      : "Klinik"}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-1">📍 {sirket.city}</p>
              {sirket.phone && (
                <p className="text-sm text-slate-500">📞 {sirket.phone}</p>
              )}

              {/* YENİ: Aksiyon Butonları */}
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
          ))}
        </div>
      )}
    </div>
  );
};
