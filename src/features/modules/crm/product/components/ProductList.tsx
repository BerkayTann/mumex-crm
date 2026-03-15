import React, { useState, useMemo } from "react";
import { IProduct, ProductCategory } from "../types";
import {
  Package,
  PlusCircle,
  Tag,
  Pencil,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export type ProductSortField = "name" | "category" | "price" | "status";

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
  const [aramaMetni, setAramaMetni] = useState("");
  const [kategoriFiltresi, setKategoriFiltresi] = useState<string>("TUMU");

  const [siralaAlan, setSiralaAlan] = useState<ProductSortField>("name");
  const [siralaYon, setSiralaYon] = useState<"asc" | "desc">("asc");

  const siralamaDegistir = (alan: ProductSortField) => {
    if (siralaAlan === alan) {
      setSiralaYon(siralaYon === "asc" ? "desc" : "asc");
    } else {
      setSiralaAlan(alan);
      setSiralaYon("asc");
    }
  };

  const renderSiralamaOki = (alan: ProductSortField) => {
    if (siralaAlan !== alan)
      return (
        <ArrowUpDown className="w-4 h-4 text-slate-300 ml-1 inline-block" />
      );
    return siralaYon === "asc" ? (
      <ArrowUp className="w-4 h-4 text-slate-700 ml-1 inline-block" />
    ) : (
      <ArrowDown className="w-4 h-4 text-slate-700 ml-1 inline-block" />
    );
  };

  const filtrelenmisUrunler = useMemo(() => {
    const filtrelenmis = urunler.filter((urun) => {
      const aramaEslesiyor =
        urun.name.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        urun.description?.toLowerCase().includes(aramaMetni.toLowerCase());
      const kategoriEslesiyor =
        kategoriFiltresi === "TUMU" || urun.category === kategoriFiltresi;
      return aramaEslesiyor && kategoriEslesiyor;
    });

    filtrelenmis.sort((a, b) => {
      let degerA: string | number;
      let degerB: string | number;

      if (siralaAlan === "name") {
        degerA = a.name.toLowerCase();
        degerB = b.name.toLowerCase();
      } else if (siralaAlan === "status") {
        degerA = a.isActive ? 1 : 0;
        degerB = b.isActive ? 1 : 0;
      } else {
        const aa = a as unknown as Record<string, string | number>;
        const bb = b as unknown as Record<string, string | number>;
        degerA = aa[siralaAlan] ?? 0;
        degerB = bb[siralaAlan] ?? 0;
      }

      if (degerA < degerB) return siralaYon === "asc" ? -1 : 1;
      if (degerA > degerB) return siralaYon === "asc" ? 1 : -1;
      return 0;
    });

    return filtrelenmis;
  }, [urunler, aramaMetni, kategoriFiltresi, siralaAlan, siralaYon]);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Package className="w-6 h-6 text-emerald-600" />
          Ürünler ve İlaçlar
        </h1>
        <button
          onClick={onYeniUrunEkleTiklandi}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm w-full sm:w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          Yeni Ürün Ekle
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border-b-2 border-transparent hover:border-slate-200 focus:border-emerald-500 rounded-lg bg-slate-50/50 text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 sm:text-sm transition-all"
            placeholder="Ürün adı veya açıklama ile ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-400" />
          </div>
          <select
            className="block w-full pl-9 pr-10 py-2 border-b-2 border-transparent hover:border-slate-200 focus:border-emerald-500 rounded-lg bg-slate-50/50 text-slate-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 sm:text-sm transition-all appearance-none cursor-pointer"
            value={kategoriFiltresi}
            onChange={(e) => setKategoriFiltresi(e.target.value)}
          >
            <option value="TUMU" className="text-slate-700">
              Tüm Kategoriler
            </option>
            <option value={ProductCategory.MEDICINE} className="text-slate-700">
              İlaç
            </option>
            <option
              value={ProductCategory.SUPPLEMENT}
              className="text-slate-700"
            >
              Gıda Takviyesi
            </option>
            <option
              value={ProductCategory.MEDICAL_DEVICE}
              className="text-slate-700"
            >
              Tıbbi Cihaz
            </option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full min-w-[600px] text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th
                className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                onClick={() => siralamaDegistir("name")}
              >
                Ürün Adı {renderSiralamaOki("name")}
              </th>
              <th
                className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                onClick={() => siralamaDegistir("category")}
              >
                Kategori {renderSiralamaOki("category")}
              </th>
              <th
                className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 text-right cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                onClick={() => siralamaDegistir("price")}
              >
                Güncel Fiyat {renderSiralamaOki("price")}
              </th>
              <th
                className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                onClick={() => siralamaDegistir("status")}
              >
                Durum {renderSiralamaOki("status")}
              </th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 text-right">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrelenmisUrunler.map((urun) => (
              <tr
                key={urun._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 sm:px-5 py-3">
                  <div className="font-medium text-slate-900">{urun.name}</div>
                  {urun.description && (
                    <div className="text-xs text-slate-500 mt-1">
                      {urun.description}
                    </div>
                  )}
                </td>
                <td className="px-4 sm:px-5 py-3">
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {urun.category === ProductCategory.MEDICINE
                      ? "İlaç"
                      : urun.category === ProductCategory.SUPPLEMENT
                        ? "Takviye"
                        : "Tıbbi Cihaz"}
                  </span>
                </td>
                <td className="px-4 sm:px-5 py-3 text-right">
                  <div className="font-semibold text-emerald-600">
                    {urun.price.toLocaleString("tr-TR")}{" "}
                    {!urun.currency || urun.currency === "TRY" ? "₺" : urun.currency}
                  </div>
                  {urun.currency &&
                    urun.currency !== "TRY" &&
                    urun.priceInTRY != null && (
                      <div className="text-xs text-slate-400 mt-0.5">
                        {urun.priceInTRY.toLocaleString("tr-TR", {
                          maximumFractionDigits: 2,
                        })}{" "}
                        ₺
                      </div>
                    )}
                </td>
                <td className="px-4 sm:px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      urun.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {urun.isActive ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-4 sm:px-5 py-3 text-right">
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
        {filtrelenmisUrunler.length === 0 && (
          <div className="text-center py-10 text-slate-400 flex flex-col items-center gap-2">
            <Tag className="w-8 h-8 text-slate-300" />
            Arama kriterlerine uygun ürün bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};
