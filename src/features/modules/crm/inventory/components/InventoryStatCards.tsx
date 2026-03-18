import React from 'react';
import { Package, Warehouse, TrendingUp, ShoppingCart } from 'lucide-react';
import { IEnvanterOzet } from '../types';

interface IInventoryStatCardsProps {
  ozet: IEnvanterOzet;
  yukleniyorMu: boolean;
}

const kartVerileri = (ozet: IEnvanterOzet) => [
  {
    baslik: 'Toplam Ürün',
    deger: ozet.toplamUrunSayisi.toString(),
    birim: 'çeşit',
    ikon: Package,
    renk: 'text-blue-600',
    arkaplan: 'bg-blue-50',
    sinir: 'border-blue-100',
  },
  {
    baslik: 'Toplam Kalan Stok',
    deger: ozet.toplamKalanStok.toLocaleString('tr-TR'),
    birim: 'adet',
    ikon: Warehouse,
    renk: 'text-emerald-600',
    arkaplan: 'bg-emerald-50',
    sinir: 'border-emerald-100',
  },
  {
    baslik: 'Toplam Stok Değeri',
    deger: ozet.toplamStokDegeri.toLocaleString('tr-TR', { maximumFractionDigits: 0 }),
    birim: '₺',
    ikon: TrendingUp,
    renk: 'text-purple-600',
    arkaplan: 'bg-purple-50',
    sinir: 'border-purple-100',
  },
  {
    baslik: 'Toplam Satılan Değer',
    deger: ozet.toplamSatisDegeri.toLocaleString('tr-TR', { maximumFractionDigits: 0 }),
    birim: '₺',
    ikon: ShoppingCart,
    renk: 'text-orange-600',
    arkaplan: 'bg-orange-50',
    sinir: 'border-orange-100',
  },
];

export const InventoryStatCards: React.FC<IInventoryStatCardsProps> = ({ ozet, yukleniyorMu }) => {
  if (yukleniyorMu) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
            <div className="h-7 bg-slate-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kartVerileri(ozet).map((kart) => (
        <div
          key={kart.baslik}
          className={`bg-white rounded-xl border ${kart.sinir} shadow-sm p-5 flex flex-col gap-3`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">{kart.baslik}</span>
            <div className={`p-2 rounded-lg ${kart.arkaplan}`}>
              <kart.ikon className={`w-4 h-4 ${kart.renk}`} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-800">{kart.deger}</span>
            <span className="text-sm text-slate-400">{kart.birim}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
