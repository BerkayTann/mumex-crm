"use client";

import React, { useState } from "react";
import {
  useSirketleriGetir,
  useSirketGuncelle,
  useSirketSil,
} from "../service";
import { CompanyList, CompanyForm } from "../components";
import { type ISirketFormVerisi } from "../schema/CompanySchema";
import { ICompany } from "../types";
import { ConfirmModal } from "@/components/common";

export const CompanyListContainer = () => {
  const [formAcikMi, setFormAcikMi] = useState(false);
  const [seciliSirket, setSeciliSirket] = useState<ICompany | null>(null);
  const [silinecekSirketId, setSilinecekSirketId] = useState<string | null>(null);

  const { data: sirketler, isLoading: listeYukleniyor } = useSirketleriGetir();
  const { mutateAsync: sirketGuncelle, isPending: guncelleniyor } = useSirketGuncelle();
  const { mutateAsync: sirketSil, isPending: siliniyor } = useSirketSil();

  const formuAc = (sirket: ICompany) => {
    setSeciliSirket(sirket);
    setFormAcikMi(true);
  };

  const formuKapat = () => {
    setFormAcikMi(false);
    setSeciliSirket(null);
  };

  // Sadece güncelleme - ekleme kişi kaydı üzerinden otomatik yapılır
  const onSirketKaydet = async (formVerisi: ISirketFormVerisi) => {
    if (!seciliSirket) return;
    try {
      await sirketGuncelle({ id: seciliSirket._id, guncelVeri: formVerisi });
      formuKapat();
    } catch {
      alert("Güncelleme başarısız oldu.");
    }
  };

  const onSilmeOnayla = async () => {
    if (!silinecekSirketId) return;
    try {
      await sirketSil(silinecekSirketId);
      setSilinecekSirketId(null);
    } catch {
      alert("Silme işlemi başarısız.");
    }
  };

  if (listeYukleniyor)
    return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="w-full">
      <ConfirmModal
        acikMi={!!silinecekSirketId}
        baslik="Kurumu Sil"
        mesaj="Bu kurumu silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve bu kuruma bağlı doktorların verileri etkilenebilir."
        onIptal={() => setSilinecekSirketId(null)}
        onOnayla={onSilmeOnayla}
        yukleniyorMu={siliniyor}
      />

      {formAcikMi && seciliSirket ? (
        <div className="p-6 max-w-2xl mx-auto mt-10">
          <CompanyForm
            seciliSirket={seciliSirket}
            onFormuGonder={onSirketKaydet}
            onIptalEt={formuKapat}
            yukleniyorMu={guncelleniyor}
          />
        </div>
      ) : (
        <CompanyList
          sirketler={sirketler || []}
          onDuzenleTiklandi={formuAc}
          onSilTiklandi={(id) => setSilinecekSirketId(id)}
        />
      )}
    </div>
  );
};
