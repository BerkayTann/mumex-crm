import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kisiEklemeSemasi, IKisiFormGirdisi, IKisiFormVerisi } from "../schema/UserSchema";
import { IUser, UserTitle } from "../types";
import { CompanyType } from "../../company/types";
import { TURKIYE_ILLERI, ildenBolgeGetir } from "@/core/constants/cities";

interface IUserFormProps {
  onFormuGonder: (veri: IKisiFormVerisi) => void;
  onIptalEt: () => void;
  yukleniyorMu: boolean;
  ilkVeriler?: Partial<IUser>;
}

export const UserForm: React.FC<IUserFormProps> = ({
  onFormuGonder,
  onIptalEt,
  yukleniyorMu,
  ilkVeriler,
}) => {
  const kurum = ilkVeriler?.companyId as unknown as {
    name?: string;
    type?: CompanyType;
    city?: string;
    district?: string;
  } | undefined;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IKisiFormGirdisi, unknown, IKisiFormVerisi>({
    resolver: zodResolver(kisiEklemeSemasi),
    defaultValues: {
      firstName: ilkVeriler?.firstName || "",
      lastName: ilkVeriler?.lastName || "",
      title: ilkVeriler?.title || UserTitle.DOCTOR,
      specialty: ilkVeriler?.specialty || "",
      email: ilkVeriler?.email || "",
      phone: ilkVeriler?.phone || "",
      address: ilkVeriler?.address || "",
      sirketAdi: kurum?.name || "",
      sirketTipi: kurum?.type || CompanyType.HOSPITAL,
      sehir: kurum?.city || "",
      ilce: kurum?.district || "",
      sirketAdresi: (kurum as any)?.address || "",
      forceNewCompany: false,
    },
  });

  const seciliSehir = watch("sehir");

  // Şehir seçildiğinde bölgeyi otomatik hesapla (form submission için)
  useEffect(() => {
    if (seciliSehir) {
      ildenBolgeGetir(seciliSehir); // bölge backend'de atanır
    }
  }, [seciliSehir]);

  // Düzenleme modunda form verilerini doldur
  useEffect(() => {
    if (ilkVeriler) {
      reset({
        firstName: ilkVeriler.firstName || "",
        lastName: ilkVeriler.lastName || "",
        title: ilkVeriler.title || UserTitle.DOCTOR,
        specialty: ilkVeriler.specialty || "",
        email: ilkVeriler.email || "",
        phone: ilkVeriler.phone || "",
        address: ilkVeriler.address || "",
        sirketAdi: kurum?.name || "",
        sirketTipi: kurum?.type || CompanyType.HOSPITAL,
        sehir: kurum?.city || "",
        ilce: kurum?.district || "",
        sirketAdresi: (kurum as any)?.address || "",
        forceNewCompany: false,
      });
    }
  }, [ilkVeriler, reset, kurum?.name, kurum?.type, kurum?.city, kurum?.district]);

  return (
    <form
      onSubmit={handleSubmit(onFormuGonder)}
      className="space-y-4 bg-white p-8 rounded-xl border border-slate-200 shadow-lg"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        {ilkVeriler
          ? "Kişi/Doktor Bilgilerini Güncelle"
          : "Yeni Kişi/Doktor Kaydı"}
      </h2>

      {/* KİŞİSEL BİLGİLER */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ad</label>
          <input
            {...register("firstName")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
            placeholder="Örn: Ahmet"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label>
          <input
            {...register("lastName")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
            placeholder="Örn: Yılmaz"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Unvan</label>
          <select
            {...register("title")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900"
          >
            {Object.values(UserTitle).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Uzmanlık Alanı</label>
          <input
            {...register("specialty")}
            placeholder="Örn: Kardiyoloji"
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* KURUM BİLGİLERİ */}
      <h3 className="text-md font-bold text-slate-700 mt-6 border-b border-slate-200 pb-2">
        Kurum Bilgileri
      </h3>
      <p className="text-xs text-slate-500 -mt-2">
        Kurum zaten kayıtlıysa aynı adı girin, otomatik eşleştirilir. Yeni kurum ise kayıt oluşturulur.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Kurum / Hastane / Eczane Adı
          </label>
          <input
            {...register("sirketAdi")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
            placeholder="Örn: Ege Üniversitesi Hastanesi"
          />
          {errors.sirketAdi && (
            <p className="text-red-500 text-xs mt-1">{errors.sirketAdi.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Kurum Tipi</label>
          <select
            {...register("sirketTipi")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900"
          >
            <option value={CompanyType.HOSPITAL}>Hastane</option>
            <option value={CompanyType.PHARMACY}>Eczane</option>
            <option value={CompanyType.CLINIC}>Klinik</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Şehir (İl)</label>
          <select
            {...register("sehir")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900"
          >
            <option value="">Şehir Seçiniz...</option>
            {TURKIYE_ILLERI.map((s) => (
              <option key={s.il} value={s.il}>{s.il}</option>
            ))}
          </select>
          {errors.sehir && (
            <p className="text-red-500 text-xs mt-1">{errors.sehir.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">İlçe</label>
          <input
            {...register("ilce")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
            placeholder="Örn: Bornova"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Kurum Adresi <span className="text-slate-400">(opsiyonel - şube ayrımı için)</span>
        </label>
        <input
          {...register("sirketAdresi")}
          className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
          placeholder="Kurum açık adresi (aynı adresteki şubeleri ayırmak için)"
        />
      </div>

      {/* İLETİŞİM VE ADRES */}
      <h3 className="text-md font-bold text-slate-700 mt-6 border-b border-slate-200 pb-2">
        İletişim ve Adres
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
          <input
            {...register("phone")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
            placeholder="05XX XXX XX XX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">E-Posta</label>
          <input
            {...register("email")}
            type="email"
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
            placeholder="ornek@hastane.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Açık Adres</label>
          <textarea
            {...register("address")}
            rows={2}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
            placeholder="Mahalle, Sokak, No..."
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onIptalEt}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={yukleniyorMu}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {yukleniyorMu ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
};
