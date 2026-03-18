"use client";

import React, { useState } from 'react';
import { Warehouse } from 'lucide-react';
import { useEnvanterGetir } from '../service';
import { InventoryStatCards, InventoryTable } from '../components';

export const InventoryListContainer = () => {
  const [aramaMetni, setAramaMetni] = useState('');

  const { data, isLoading, isError } = useEnvanterGetir();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Warehouse className="w-6 h-6 text-emerald-600" />
          Depo / Stok Yönetimi
        </h1>
        <InventoryStatCards
          ozet={{ toplamUrunSayisi: 0, toplamKalanStok: 0, toplamStokDegeri: 0, toplamSatisDegeri: 0 }}
          yukleniyorMu={true}
        />
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg mx-4 border border-red-200">
        Envanter verileri çekilirken hata oluştu.
      </div>
    );
  }

  const kalemler = data?.kalemler ?? [];
  const ozet = data?.ozet ?? {
    toplamUrunSayisi: 0,
    toplamKalanStok: 0,
    toplamStokDegeri: 0,
    toplamSatisDegeri: 0,
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <Warehouse className="w-6 h-6 text-emerald-600" />
        Depo / Stok Yönetimi
      </h1>

      <InventoryStatCards ozet={ozet} yukleniyorMu={false} />

      <InventoryTable
        kalemler={kalemler}
        aramaMetni={aramaMetni}
        onAramaMetniDegisti={setAramaMetni}
      />
    </div>
  );
};
