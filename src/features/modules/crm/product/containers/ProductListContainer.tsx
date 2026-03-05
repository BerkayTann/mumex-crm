"use client";

import React, { useState } from "react";
// Barrel export (index.ts) üzerinden temiz import
import {
  useUrunleriGetir,
  useUrunEkle,
  useUrunSil,
  useUrunGuncelle,
} from "../service";
import { ProductList, ProductForm } from "../components";
import { IUrunFormVerisi } from "../schema/ProductSchema";
import { IProduct, ICreateProductPayload } from "../types";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export const ProductListContainer = () => {
  const [formAcikMi, setFormAcikMi] = useState(false);
  const [duzenlenecekUrun, setDuzenlenecekUrun] = useState<IProduct | null>(
    null,
  );
  const [silinecekUrunId, setSilinecekUrunId] = useState<string | null>(null);

  const {
    data: urunler,
    isLoading: listeYukleniyor,
    isError: hataMevcut,
  } = useUrunleriGetir();

  // Mutasyonlar
  const { mutateAsync: urunEkleMutasyonu, isPending: eklemeIslemiSuruyor } =
    useUrunEkle();
  const { mutateAsync: urunSilMutasyonu, isPending: silmeIslemiSuruyor } =
    useUrunSil();
  const {
    mutateAsync: urunGuncelleMutasyonu,
    isPending: guncellemeIslemiSuruyor,
  } = useUrunGuncelle();

  const onUrunKaydet = async (formVerisi: IUrunFormVerisi) => {
    try {
      const payload: ICreateProductPayload = {
        name: formVerisi.name,
        category: formVerisi.category,
        price: formVerisi.price,
        description: formVerisi.description || "",
        isActive: formVerisi.isActive,
      };

      if (duzenlenecekUrun) {
        // GÜNCELLEME
        await urunGuncelleMutasyonu({
          id: duzenlenecekUrun._id,
          guncelVeri: payload,
        });
      } else {
        // YENİ KAYIT
        await urunEkleMutasyonu(payload);
      }

      setFormAcikMi(false);
      setDuzenlenecekUrun(null);
    } catch (hata) {
      console.error("Ürün kaydedilirken hata oluştu:", hata);
      alert("İşlem başarısız, lütfen tekrar deneyin.");
    }
  };

  // Silme işlemini başlatan fonksiyon
  const onUrunSilTiklandi = (id: string) => {
    setSilinecekUrunId(id);
  };

  // Silme işlemini onaylayan (API'ye gönderen) fonksiyon
  const onSilmeOnayla = async () => {
    if (!silinecekUrunId) return;
    try {
      await urunSilMutasyonu(silinecekUrunId);
      setSilinecekUrunId(null);
    } catch {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  // Düzenleme modunu açan fonksiyon
  const onUrunDuzenleTiklandi = (urun: IProduct) => {
    setDuzenlenecekUrun(urun);
    setFormAcikMi(true);
  };

  if (listeYukleniyor) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (hataMevcut) {
    return (
      <div className="p-6 text-red-500 bg-red-50 rounded-lg m-6 border border-red-200">
        Veriler çekilirken hata oluştu.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* SİLME ONAY MODALI */}
      <ConfirmModal
        acikMi={!!silinecekUrunId}
        baslik="Ürünü Sil"
        mesaj="Bu ürünü silmek istediğinize emin misiniz? DİKKAT: Bu ürünü silerseniz, bu ürüne bağlı geçmiş satış kayıtları, ziyaret raporları ve stok analizleri tutarsız hale gelebilir. Bu işlem geri alınamaz!"
        onIptal={() => setSilinecekUrunId(null)}
        onOnayla={onSilmeOnayla}
        yukleniyorMu={silmeIslemiSuruyor}
      />

      {formAcikMi ? (
        <div className="p-6 max-w-2xl mx-auto mt-10">
          <ProductForm
            onFormuGonder={onUrunKaydet}
            onIptalEt={() => {
              setFormAcikMi(false);
              setDuzenlenecekUrun(null);
            }}
            yukleniyorMu={eklemeIslemiSuruyor || guncellemeIslemiSuruyor}
            ilkVeriler={duzenlenecekUrun || undefined}
          />
        </div>
      ) : (
        <ProductList
          urunler={urunler || []}
          onYeniUrunEkleTiklandi={() => {
            setDuzenlenecekUrun(null);
            setFormAcikMi(true);
          }}
          onDuzenleTiklandi={onUrunDuzenleTiklandi}
          onSilTiklandi={onUrunSilTiklandi}
        />
      )}
    </div>
  );
};
