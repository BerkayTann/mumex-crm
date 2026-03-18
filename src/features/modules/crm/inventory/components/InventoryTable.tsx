import React, { useMemo } from 'react';
import { Search, Warehouse } from 'lucide-react';
import { IEnvanterKalemi } from '../types';
import { ProductCategory } from '../../product/types';

interface IInventoryTableProps {
  kalemler: IEnvanterKalemi[];
  aramaMetni: string;
  onAramaMetniDegisti: (deger: string) => void;
}

const kategoriEtiket = (kategori: ProductCategory): string => {
  if (kategori === ProductCategory.MEDICINE) return 'İlaç';
  if (kategori === ProductCategory.SUPPLEMENT) return 'Takviye';
  return 'Tıbbi Cihaz';
};

const kalanStokRengi = (kalan: number, baslangic: number): string => {
  if (kalan === 0) return 'text-red-600 font-bold';
  if (baslangic > 0 && kalan <= baslangic * 0.2) return 'text-amber-600 font-semibold';
  return 'text-emerald-600 font-semibold';
};

export const InventoryTable: React.FC<IInventoryTableProps> = ({
  kalemler,
  aramaMetni,
  onAramaMetniDegisti,
}) => {
  const filtrelenmisKalemler = useMemo(() => {
    if (!aramaMetni.trim()) return kalemler;
    const kucukArama = aramaMetni.toLowerCase();
    return kalemler.filter((kalem) =>
      kalem.urunAdi.toLowerCase().includes(kucukArama),
    );
  }, [kalemler, aramaMetni]);

  return (
    <div className="space-y-4">
      {/* Arama */}
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border-b-2 border-transparent hover:border-slate-200 focus:border-emerald-500 rounded-lg bg-slate-50/50 text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 sm:text-sm transition-all"
            placeholder="Ürün adı ile ara..."
            value={aramaMetni}
            onChange={(e) => onAramaMetniDegisti(e.target.value)}
          />
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full min-w-[720px] text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600">Ürün Adı</th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600">Kategori</th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 text-right">Başlangıç Stok</th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 text-right">Satılan Adet</th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 text-right">Kalan Stok</th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 text-right">Birim Fiyat</th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 text-right">Stok Değeri</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrelenmisKalemler.map((kalem) => (
              <tr key={kalem.productId} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 sm:px-5 py-3">
                  <span className="font-medium text-slate-900">{kalem.urunAdi}</span>
                  {kalem.kalanStok === 0 && (
                    <span className="ml-2 text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                      Tükendi
                    </span>
                  )}
                </td>
                <td className="px-4 sm:px-5 py-3">
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {kategoriEtiket(kalem.kategori)}
                  </span>
                </td>
                <td className="px-4 sm:px-5 py-3 text-right text-slate-600">
                  {(kalem.baslangicStok ?? 0).toLocaleString('tr-TR')}
                </td>
                <td className="px-4 sm:px-5 py-3 text-right">
                  <span className="text-amber-600 font-medium">
                    {(kalem.satisAdedi ?? 0).toLocaleString('tr-TR')}
                  </span>
                </td>
                <td className="px-4 sm:px-5 py-3 text-right">
                  <span className={kalanStokRengi(kalem.kalanStok ?? 0, kalem.baslangicStok ?? 0)}>
                    {(kalem.kalanStok ?? 0).toLocaleString('tr-TR')}
                  </span>
                </td>
                <td className="px-4 sm:px-5 py-3 text-right text-slate-600">
                  {(kalem.birimFiyatTRY ?? 0).toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                </td>
                <td className="px-4 sm:px-5 py-3 text-right">
                  <span className="font-semibold text-slate-800">
                    {(kalem.stokDegeri ?? 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtrelenmisKalemler.length === 0 && (
          <div className="text-center py-10 text-slate-400 flex flex-col items-center gap-2">
            <Warehouse className="w-8 h-8 text-slate-300" />
            {aramaMetni ? 'Arama kriterlerine uygun ürün bulunamadı.' : 'Depoda henüz ürün bulunmuyor.'}
          </div>
        )}
      </div>
    </div>
  );
};
