"use client";

import React, { useState } from "react";
import {
  useKisileriGetir,
  useKisiEkle,
  useKisiSil,
  useKisiGuncelle,
} from "../service";
import { useSirketleriGetir } from "../../company"; // Barrel export üzerinden (GEMINI.md kuralı)
import { UserList, UserForm } from "../components";
import { IKisiFormVerisi } from "../schema/UserSchema";
import { IUser } from "../types";
import { ConfirmModal } from "@/components/common/ConfirmModal";

//Kullanıcı Listesi Container
export const UserListContainer = () => {
  const [formAcikMi, setFormAcikMi] = useState(false); //Formun açık olup olmadığını tutan state
  const [duzenlenecekKisi, setDuzenlenecekKisi] = useState<IUser | null>(null); //Düzenlenecek kişinin bilgisini tutan state
  const [silinecekKisiId, setSilinecekKisiId] = useState<string | null>(null); //Silinecek kişinin ID'sini tutan state

  // 1. Verileri Çekiyoruz
  const { data: kisiler, isLoading: kisilerYukleniyor } = useKisileriGetir();
  const { data: sirketler, isLoading: sirketlerYukleniyor } =
    useSirketleriGetir();

  // 2. Mutasyonlar
  const { mutateAsync: kisiEkleMutasyonu, isPending: eklemeSuruyor } =
    useKisiEkle();
  const { mutateAsync: kisiSilMutasyonu, isPending: silmeSuruyor } =
    useKisiSil();
  const { mutateAsync: kisiGuncelleMutasyonu, isPending: guncellemeSuruyor } =
    useKisiGuncelle();

  //Formu kaydetme fonksiyonu (Hem Ekleme Hem Güncelleme)
  const onKisiKaydet = async (veri: IKisiFormVerisi) => {
    try {
      if (duzenlenecekKisi) {
        // GÜNCELLEME
        await kisiGuncelleMutasyonu({
          id: duzenlenecekKisi._id,
          guncelVeri: veri,
        });
      } else {
        // YENİ KAYIT
        await kisiEkleMutasyonu(veri);
      }
      setFormAcikMi(false);
      setDuzenlenecekKisi(null);
    } catch (hata) {
      alert("İşlem sırasında bir hata oluştu.");
    }
  };

  //Düzenleme modunu açan fonksiyon
  const onKisiDuzenle = (kisi: IUser) => {
    setDuzenlenecekKisi(kisi);
    setFormAcikMi(true);
  };

  //Silme modunu açan fonksiyon
  const onKisiSil = (id: string) => {
    setSilinecekKisiId(id);
  };

  // Silme işlemini onaylayan (api'ye gönderen) fonksiyon
  const onSilmeOnayla = async () => {
    if (!silinecekKisiId) return;
    try {
      await kisiSilMutasyonu(silinecekKisiId);
      setSilinecekKisiId(null);
    } catch {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  if (kisilerYukleniyor || sirketlerYukleniyor)
    return <div className="p-10 text-center">Veriler hazırlanıyor...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* SİLME ONAY MODALI */}
      <ConfirmModal
        acikMi={!!silinecekKisiId}
        baslik="Kişiyi Sil"
        mesaj="Bu kişiyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onIptal={() => setSilinecekKisiId(null)}
        onOnayla={onSilmeOnayla}
        yukleniyorMu={silmeSuruyor}
      />

      {formAcikMi ? (
        <div className="p-6 max-w-2xl mx-auto">
          <UserForm
            sirketler={sirketler || []}
            onFormuGonder={onKisiKaydet}
            onIptalEt={() => {
              setFormAcikMi(false);
              setDuzenlenecekKisi(null);
            }}
            yukleniyorMu={eklemeSuruyor || guncellemeSuruyor}
            ilkVeriler={duzenlenecekKisi || undefined}
          />
        </div>
      ) : (
        <UserList
          kisiler={kisiler || []}
          onYeniKisiEkleTiklandi={() => {
            setDuzenlenecekKisi(null);
            setFormAcikMi(true);
          }}
          onDuzenleTiklandi={onKisiDuzenle}
          onSilTiklandi={onKisiSil}
        />
      )}
    </div>
  );
};
