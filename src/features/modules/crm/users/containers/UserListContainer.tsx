"use client";

import React, { useState } from "react";
import {
  useKisileriGetir,
  useKisiEkle,
  useKisiSil,
  useKisiGuncelle,
} from "../service";
import { UserList, UserForm } from "../components";
import { IKisiFormVerisi } from "../schema/UserSchema";
import { IUser } from "../types";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export const UserListContainer = () => {
  const [formAcikMi, setFormAcikMi] = useState(false);
  const [duzenlenecekKisi, setDuzenlenecekKisi] = useState<IUser | null>(null);
  const [silinecekKisiId, setSilinecekKisiId] = useState<string | null>(null);

  const { data: kisiler, isLoading: kisilerYukleniyor } = useKisileriGetir();

  const { mutateAsync: kisiEkleMutasyonu, isPending: eklemeSuruyor } = useKisiEkle();
  const { mutateAsync: kisiSilMutasyonu, isPending: silmeSuruyor } = useKisiSil();
  const { mutateAsync: kisiGuncelleMutasyonu, isPending: guncellemeSuruyor } = useKisiGuncelle();

  const onKisiKaydet = async (veri: IKisiFormVerisi) => {
    try {
      if (duzenlenecekKisi) {
        await kisiGuncelleMutasyonu({ id: duzenlenecekKisi._id, guncelVeri: veri });
      } else {
        await kisiEkleMutasyonu(veri);
      }
      setFormAcikMi(false);
      setDuzenlenecekKisi(null);
    } catch {
      alert("İşlem sırasında bir hata oluştu.");
    }
  };

  const onKisiDuzenle = (kisi: IUser) => {
    setDuzenlenecekKisi(kisi);
    setFormAcikMi(true);
  };

  const onKisiSil = (id: string) => setSilinecekKisiId(id);

  const onSilmeOnayla = async () => {
    if (!silinecekKisiId) return;
    try {
      await kisiSilMutasyonu(silinecekKisiId);
      setSilinecekKisiId(null);
    } catch {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  if (kisilerYukleniyor)
    return <div className="p-10 text-center">Veriler hazırlanıyor...</div>;

  return (
    <div className="w-full">
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
