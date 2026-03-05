"use client";

import React, { useState } from "react";
import {
  useSirketleriGetir,
  useSirketEkle,
  useSirketGuncelle,
  useSirketSil,
} from "../service";
import { CompanyList, CompanyForm } from "../components";
import { type ISirketFormVerisi } from "../schema/CompanySchema";
import { ICompany } from "../types";
import { ConfirmModal } from "@/components/common";

export const CompanyListContainer = () => {
  // --- UI DURUMLARI (STATE) ---
  const [formAcikMi, setFormAcikMi] = useState(false);
  const [seciliSirket, setSeciliSirket] = useState<ICompany | null>(null);
  const [silinecekSirketId, setSilinecekSirketId] = useState<string | null>(
    null,
  );

  // --- SERVİSLER (REACT QUERY) ---
  const { data: sirketler, isLoading: listeYukleniyor } = useSirketleriGetir();
  const { mutateAsync: sirketEkle, isPending: ekleniyor } = useSirketEkle();
  const { mutateAsync: sirketGuncelle, isPending: guncelleniyor } =
    useSirketGuncelle();
  const { mutateAsync: sirketSil, isPending: siliniyor } = useSirketSil();

  // --- İŞ MANTIKLARI ---

  // 1. Yeni Ekleme veya Güncelleme Formunu Açma
  const formuAc = (sirket?: ICompany) => {
    setSeciliSirket(sirket || null);
    setFormAcikMi(true);
  };

  const formuKapat = () => {
    setFormAcikMi(false);
    setSeciliSirket(null);
  };

  // 2. Form Gönderildiğinde (Ekleme veya Güncelleme kararı)
  const onSirketKaydet = async (formVerisi: ISirketFormVerisi) => {
    try {
      if (seciliSirket) {
        // Düzenleme Modu
        await sirketGuncelle({ id: seciliSirket._id, guncelVeri: formVerisi });
      } else {
        // Yeni Ekleme Modu
        await sirketEkle(formVerisi);
      }
      formuKapat();
    } catch (hata) {
      alert("İşlem başarısız oldu.");
    }
  };

  // 3. Silme İşlemleri
  const onSilmeOnayla = async () => {
    if (!silinecekSirketId) return;
    try {
      await sirketSil(silinecekSirketId);
      setSilinecekSirketId(null); // Modalı kapat
    } catch (hata) {
      alert("Silme işlemi başarısız.");
    }
  };

  if (listeYukleniyor)
    return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* SİLME ONAY MODALI */}
      <ConfirmModal
        acikMi={!!silinecekSirketId}
        baslik="Kurumu Sil"
        mesaj="Bu kurumu silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve bu kuruma bağlı doktorların verileri etkilenebilir."
        onIptal={() => setSilinecekSirketId(null)}
        onOnayla={onSilmeOnayla}
        yukleniyorMu={siliniyor}
      />

      {formAcikMi ? (
        <div className="p-6 max-w-2xl mx-auto mt-10">
          <CompanyForm
            seciliSirket={seciliSirket}
            onFormuGonder={onSirketKaydet}
            onIptalEt={formuKapat}
            yukleniyorMu={ekleniyor || guncelleniyor}
          />
        </div>
      ) : (
        <CompanyList
          sirketler={sirketler || []}
          onYeniSirketEkleTiklandi={() => formuAc()}
          onDuzenleTiklandi={(sirket) => formuAc(sirket)}
          onSilTiklandi={(id) => setSilinecekSirketId(id)}
        />
      )}
    </div>
  );
};
