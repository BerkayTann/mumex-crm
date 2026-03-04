"use client";

import React, { useState } from "react";
import { useKisileriGetir, useKisiEkle } from "../service";
import { useSirketleriGetir } from "../../company"; // Barrel export üzerinden (GEMINI.md kuralı)
import { UserList, UserForm } from "../components";
import { IKisiFormVerisi } from "../schema/UserSchema";

export const UserListContainer = () => {
  const [formAcikMi, setFormAcikMi] = useState(false);

  // 1. Verileri Çekiyoruz
  const { data: kisiler, isLoading: kisilerYukleniyor } = useKisileriGetir();
  const { data: sirketler, isLoading: sirketlerYukleniyor } =
    useSirketleriGetir();

  // 2. Mutasyon (Ekleme)
  const { mutateAsync: kisiEkleMutasyonu, isPending: eklemeSuruyor } =
    useKisiEkle();

  const onKisiKaydet = async (veri: IKisiFormVerisi) => {
    try {
      await kisiEkleMutasyonu(veri);
      setFormAcikMi(false);
    } catch (hata) {
      alert("Hata oluştu.");
    }
  };

  if (kisilerYukleniyor || sirketlerYukleniyor)
    return <div className="p-10 text-center">Veriler hazırlanıyor...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {formAcikMi ? (
        <div className="p-6 max-w-2xl mx-auto">
          <UserForm
            sirketler={sirketler || []}
            onFormuGonder={onKisiKaydet}
            onIptalEt={() => setFormAcikMi(false)}
            yukleniyorMu={eklemeSuruyor}
          />
        </div>
      ) : (
        <UserList
          kisiler={kisiler || []}
          onYeniKisiEkleTiklandi={() => setFormAcikMi(true)}
        />
      )}
    </div>
  );
};
