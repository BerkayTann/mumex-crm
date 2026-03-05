"use client";

import React, { useState } from "react";
import { useZiyaretleriGetir, useZiyaretEkle } from "../service";
import { useSirketleriGetir } from "../../company/service";
import { useKisileriGetir } from "../../users/service";
import { useUrunleriGetir } from "../../product/service";
import { VisitList, VisitForm } from "../components";
import { IVisitFormVerisi } from "../schema/VisitSchema";

export const VisitListContainer = () => {
  const [formAcikMi, setFormAcikMi] = useState(false);

  // Mimarın Şovu: 4 farklı kaynaktan aynı anda veri çekiyoruz!
  const { data: ziyaretler, isLoading: zYukleniyor } = useZiyaretleriGetir();
  const { data: sirketler, isLoading: sYukleniyor } = useSirketleriGetir();
  const { data: kisiler, isLoading: kYukleniyor } = useKisileriGetir();
  const { data: urunler, isLoading: uYukleniyor } = useUrunleriGetir();

  const { mutateAsync: ziyaretEkle, isPending: kaydediliyor } =
    useZiyaretEkle();

  const onZiyaretKaydet = async (veri: IVisitFormVerisi) => {
    try {
      await ziyaretEkle(veri);
      setFormAcikMi(false);
    } catch (hata) {
      alert("Ziyaret kaydedilemedi.");
    }
  };

  const sayfaYukleniyor =
    zYukleniyor || sYukleniyor || kYukleniyor || uYukleniyor;

  if (sayfaYukleniyor) {
    return (
      <div className="p-10 text-center font-medium text-slate-500">
        Ziyaret paneli hazırlanıyor...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {formAcikMi ? (
        <div className="p-6 max-w-4xl mx-auto mt-6">
          <VisitForm
            sirketler={sirketler || []}
            kisiler={kisiler || []}
            urunler={urunler || []}
            onFormuGonder={onZiyaretKaydet}
            onIptalEt={() => setFormAcikMi(false)}
            yukleniyorMu={kaydediliyor}
          />
        </div>
      ) : (
        <VisitList
          ziyaretler={ziyaretler || []}
          onYeniZiyaretEkleTiklandi={() => setFormAcikMi(true)}
        />
      )}
    </div>
  );
};
