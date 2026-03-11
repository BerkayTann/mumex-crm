"use client";

import { useState } from "react";
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
import { useSirketleriGetir } from "../../company/service";

export const UserListContainer = () => {
  const [formAcikMi, setFormAcikMi] = useState(false);
  const [duzenlenecekKisi, setDuzenlenecekKisi] = useState<IUser | null>(null);
  const [silinecekKisiId, setSilinecekKisiId] = useState<string | null>(null);
  const [duplikasyonUyarisiAcik, setDuplikasyonUyarisiAcik] = useState(false);
  const [bekleyenVeri, setBekleyenVeri] = useState<IKisiFormVerisi | null>(null);

  const { data: kisiler, isLoading: kisilerYukleniyor } = useKisileriGetir();
  const { data: sirketler } = useSirketleriGetir();

  const { mutateAsync: kisiEkleMutasyonu, isPending: eklemeSuruyor } = useKisiEkle();
  const { mutateAsync: kisiSilMutasyonu, isPending: silmeSuruyor } = useKisiSil();
  const { mutateAsync: kisiGuncelleMutasyonu, isPending: guncellemeSuruyor } = useKisiGuncelle();

  const kisiKaydet = async (veri: IKisiFormVerisi) => {
    try {
      if (duzenlenecekKisi) {
        await kisiGuncelleMutasyonu({ id: duzenlenecekKisi._id, guncelVeri: veri });
      } else {
        await kisiEkleMutasyonu(veri);
      }
      setFormAcikMi(false);
      setDuzenlenecekKisi(null);
    } catch (hata: any) {
      const kod = hata?.response?.data?.kod;
      if (kod === "DUPLICATE_COMPANY_DIFFERENT_CITY" && !veri.forceNewCompany) {
        setBekleyenVeri(veri);
        setDuplikasyonUyarisiAcik(true);
        return;
      }
      alert("İşlem sırasında bir hata oluştu.");
    }
  };

  const onKisiKaydet = async (veri: IKisiFormVerisi) => {
    const temizVeri: IKisiFormVerisi = { ...veri, forceNewCompany: veri.forceNewCompany ?? false };

    // Düzenleme modunda: mevcut kurumun adı ve şehri değişmemişse duplikasyon kontrolünü atla
    if (duzenlenecekKisi) {
      const mevcutKurum = duzenlenecekKisi.companyId as unknown as {
        name?: string;
        city?: string;
      };
      const kurumDegismedi =
        mevcutKurum?.name?.trim().toLowerCase() === temizVeri.sirketAdi.trim().toLowerCase() &&
        mevcutKurum?.city?.trim().toLowerCase() === temizVeri.sehir.trim().toLowerCase();

      if (kurumDegismedi) {
        await kisiKaydet(temizVeri);
        return;
      }
    }

    const ayniIsimliKurumlar = (sirketler || []).filter(
      (sirket) => sirket.name.trim().toLowerCase() === temizVeri.sirketAdi.trim().toLowerCase(),
    );

    // Aynı isim + aynı şehirde zaten kayıt varsa → mevcut kuruma bağlanacak, uyarı gerekmez
    const ayniSehirdeVar = ayniIsimliKurumlar.some(
      (sirket) => (sirket.city || "").trim().toLowerCase() === temizVeri.sehir.trim().toLowerCase(),
    );

    // Yalnızca "aynı şehirde yokken farklı şehirde var" durumunda sor → yeni şube mi?
    const yeniSubeOlusacak = !ayniSehirdeVar && ayniIsimliKurumlar.length > 0;

    if (yeniSubeOlusacak && !temizVeri.forceNewCompany) {
      setBekleyenVeri(temizVeri);
      setDuplikasyonUyarisiAcik(true);
      return;
    }

    await kisiKaydet(temizVeri);
  };

  const duplikasyonOnayla = async () => {
    if (!bekleyenVeri) return;
    await kisiKaydet({ ...bekleyenVeri, forceNewCompany: true });
    setBekleyenVeri(null);
    setDuplikasyonUyarisiAcik(false);
  };

  const duplikasyonIptal = () => {
    setBekleyenVeri(null);
    setDuplikasyonUyarisiAcik(false);
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

      <ConfirmModal
        acikMi={duplikasyonUyarisiAcik}
        baslik="Farklı Şehirde Yeni Şube"
        mesaj={`"${bekleyenVeri?.sirketAdi}" adlı kurum farklı bir şehirde zaten kayıtlı. Seçilen şehir (${bekleyenVeri?.sehir}) için ayrı bir şube kaydı oluşturulacak. Mevcut hiçbir kayıt silinmeyecek. Onaylıyor musunuz?`}
        onIptal={duplikasyonIptal}
        onOnayla={duplikasyonOnayla}
        yukleniyorMu={eklemeSuruyor || guncellemeSuruyor}
        onayMetni="Evet, Oluştur"
        yukleniyorMetni="Oluşturuluyor..."
        onayTipi="bilgi"
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
