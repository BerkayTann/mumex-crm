"use client";

import React, { useState } from "react";
import {
  useZiyaretleriGetir,
  useZiyaretEkle,
  useZiyaretSil,
  useZiyaretGuncelle,
} from "../service";
import { useSirketleriGetir } from "../../company/service";
import { useKisileriGetir } from "../../users/service";
import { useUrunleriGetir } from "../../product/service";
import { VisitList, VisitForm, VisitReportModal } from "../components";
import { IVisit } from "../types";
import { IVisitFormVerisi } from "../schema/VisitSchema";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export const VisitListContainer = () => {
  const [formAcikMi, setFormAcikMi] = useState(false);
  const [duzenlenecekZiyaret, setDuzenlenecekZiyaret] = useState<IVisit | null>(
    null,
  );
  const [silinecekZiyaretId, setSilinecekZiyaretId] = useState<string | null>(
    null,
  );
  const [raporModalAcikMi, setRaporModalAcikMi] = useState(false);

  const { data: ziyaretler, isLoading: zYukleniyor } = useZiyaretleriGetir();
  const { data: sirketler, isLoading: sYukleniyor } = useSirketleriGetir();
  const { data: kisiler, isLoading: kYukleniyor } = useKisileriGetir();
  const { data: urunler, isLoading: uYukleniyor } = useUrunleriGetir();

  const { mutateAsync: ziyaretEkle, isPending: ekleniyor } = useZiyaretEkle();
  const { mutateAsync: ziyaretGuncelle, isPending: guncelleniyor } =
    useZiyaretGuncelle();
  const { mutateAsync: ziyaretSil, isPending: siliniyor } = useZiyaretSil();

  const onZiyaretKaydet = async (veri: IVisitFormVerisi) => {
    try {
      if (duzenlenecekZiyaret) {
        await ziyaretGuncelle({ id: duzenlenecekZiyaret._id, veri });
      } else {
        await ziyaretEkle(veri);
      }
      setFormAcikMi(false);
      setDuzenlenecekZiyaret(null);
    } catch {
      alert("Ziyaret kaydedilemedi.");
    }
  };

  const onDuzenleTiklandi = (ziyaret: IVisit) => {
    setDuzenlenecekZiyaret(ziyaret);
    setFormAcikMi(true);
  };

  const onSilOnaylandi = async () => {
    if (!silinecekZiyaretId) return;
    try {
      await ziyaretSil(silinecekZiyaretId);
    } catch {
      alert("Ziyaret silinemedi.");
    } finally {
      setSilinecekZiyaretId(null);
    }
  };

  const onFormIptal = () => {
    setFormAcikMi(false);
    setDuzenlenecekZiyaret(null);
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
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <VisitList
        ziyaretler={ziyaretler || []}
        onYeniZiyaretEkleTiklandi={() => setFormAcikMi(true)}
        onDuzenleTiklandi={onDuzenleTiklandi}
        onSilTiklandi={(id) => setSilinecekZiyaretId(id)}
        onRaporlaTiklandi={() => setRaporModalAcikMi(true)}
      />

      <ConfirmModal
        acikMi={!!silinecekZiyaretId}
        baslik="Ziyareti Sil"
        mesaj="Bu ziyaret kaydını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        onOnayla={onSilOnaylandi}
        onIptal={() => setSilinecekZiyaretId(null)}
        yukleniyorMu={siliniyor}
      />

      {formAcikMi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <VisitForm
              sirketler={sirketler || []}
              kisiler={kisiler || []}
              urunler={urunler || []}
              onFormuGonder={onZiyaretKaydet}
              onIptalEt={onFormIptal}
              yukleniyorMu={ekleniyor || guncelleniyor}
              ilkVeriler={duzenlenecekZiyaret || undefined}
            />
          </div>
        </div>
      )}

      <VisitReportModal
        acikMi={raporModalAcikMi}
        onKapat={() => setRaporModalAcikMi(false)}
        ziyaretler={ziyaretler || []}
      />
    </div>
  );
};
