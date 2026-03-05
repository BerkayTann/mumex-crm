import React from "react";
import { IProduct, ProductCategory } from "../types";
import { Package, PlusCircle, Tag, Pencil, Trash2 } from "lucide-react";

interface IProductListProps {
  urunler: IProduct[];
  onYeniUrunEkleTiklandi: () => void;
  onDuzenleTiklandi: (urun: IProduct) => void;
  onSilTiklandi: (id: string) => void;
}

export const ProductList: React.FC<IProductListProps> = ({
  urunler,
  onYeniUrunEkleTiklandi,
  onDuzenleTiklandi,
  onSilTiklandi,
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Package className="w-6 h-6 text-emerald-600" />
          Ürünler ve İlaçlar
        </h1>
        <button
          onClick={onYeniUrunEkleTiklandi}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          Yeni Ürün Ekle
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Ürün Adı
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Kategori
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">
                Güncel Fiyat
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Durum
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {urunler.map((urun) => (
              <tr
                key={urun._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{urun.name}</div>
                  {urun.description && (
                    <div className="text-xs text-slate-500 mt-1">
                      {urun.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {urun.category === ProductCategory.MEDICINE
                      ? "İlaç"
                      : urun.category === ProductCategory.SUPPLEMENT
                        ? "Takviye"
                        : "Tıbbi Cihaz"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 font-semibold text-emerald-600">
                    {urun.price.toLocaleString("tr-TR")} ₺
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${urun.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {urun.isActive ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onDuzenleTiklandi(urun)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Düzenle"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSilTiklandi(urun._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {urunler.length === 0 && (
          <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-2">
            <Tag className="w-8 h-8 text-slate-300" />
            Sistemde henüz hiç ürün bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
};
