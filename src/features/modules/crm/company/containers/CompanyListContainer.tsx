"use client";

import React, { useState } from "react";
import { useSirketleriGetir, useSirketEkle } from "../service";
import { CompanyList, CompanyForm } from "../components";
import type { ISirketFormVerisi } from "../schema/CompanySchema";

// Container bileşeni

export const CompanyListContainer = () => {
  // UI State: Formun açık/kapalı olma durumunu tutuyoruz (Local State)
  const [formAcikMi, setFormAcikMi] = useState(false);

  // 1. Veri çekme servisi (GET)
  const {
    data: sirketler,
    isLoading: listeYukleniyor,
    isError: hataMevcut,
  } = useSirketleriGetir();

  // 2. Veri ekleme servisi (POST)
  const { mutateAsync: sirketEkleMutasyonu, isPending: eklemeIslemiSuruyor } =
    useSirketEkle();

  // İş mantığı fonksiyonları (Türkçe)
  const formuAc = () => setFormAcikMi(true);
  const formuKapat = () => setFormAcikMi(false);

  const onYeniSirketKaydet = async (formVerisi: ISirketFormVerisi) => {
    try {
      // API'ye gönderiyoruz. useSirketEkle içindeki onSuccess tetiklenip listeyi otomatik yenileyecek!
      await sirketEkleMutasyonu(formVerisi);
      formuKapat(); // Başarılı olursa formu kapat
    } catch (hata) {
      console.error("Şirket kaydedilirken hata oluştu:", hata);
      alert("Kurum kaydedilemedi, lütfen tekrar deneyin.");
    }
  };

  // Yüklenme ve Hata Durumları
  if (listeYukleniyor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (hataMevcut) {
    return (
      <div className="p-6 text-red-500 bg-red-50 rounded-lg m-6 border border-red-200">
        Kurum verileri çekilirken bir hata oluştu.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Eğer form açıksa formu göster, kapalıysa listeyi göster */}
      {formAcikMi ? (
        <div className="p-6 max-w-2xl mx-auto mt-10">
          <CompanyForm
            onFormuGonder={onYeniSirketKaydet}
            onIptalEt={formuKapat}
            yukleniyorMu={eklemeIslemiSuruyor}
          />
        </div>
      ) : (
        <CompanyList
          sirketler={sirketler || []}
          onYeniSirketEkleTiklandi={formuAc}
        />
      )}
    </div>
  );
};
