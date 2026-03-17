import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sirketEklemeSemasi,
  type ISirketFormGirdisi,
  type ISirketFormVerisi,
} from "../schema/CompanySchema";
import { CompanyType, ICompany } from "../types";
import { TURKIYE_ILLERI, ildenBolgeGetir } from "@/core/constants/cities";

interface ICompanyFormProps {
  seciliSirket: ICompany | null;
  onFormuGonder: (veri: ISirketFormVerisi) => void;
  onIptalEt: () => void;
  yukleniyorMu: boolean;
}

export const CompanyForm: React.FC<ICompanyFormProps> = ({
  seciliSirket,
  onFormuGonder,
  onIptalEt,
  yukleniyorMu,
}) => {
  const islemGuncellemeMi = !!seciliSirket;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ISirketFormGirdisi, unknown, ISirketFormVerisi>({
    resolver: zodResolver(sirketEklemeSemasi),
    defaultValues: {
      isActive: true,
      type: CompanyType.HOSPITAL,
    },
  });

  const seciliSehir = watch("city");

  // Şehir değiştiğinde bölgeyi otomatik ata
  useEffect(() => {
    if (seciliSehir) {
      const bolge = ildenBolgeGetir(seciliSehir);
      if (bolge) {
        setValue("region", bolge);
      }
    }
  }, [seciliSehir, setValue]);

  // Form açıldığında seçili şirketi doldur
  useEffect(() => {
    if (seciliSirket) {
      reset({
        name: seciliSirket.name,
        type: seciliSirket.type,
        city: seciliSirket.city,
        district: seciliSirket.district || "",
        region: seciliSirket.region,
        address: seciliSirket.address || "",
        phone: seciliSirket.phone || "",
        isActive: seciliSirket.isActive,
      });
    }
  }, [seciliSirket, reset]);

  return (
    <form
      onSubmit={handleSubmit(onFormuGonder)}
      className="space-y-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        {islemGuncellemeMi ? "Kurum Bilgilerini Güncelle" : "Yeni Kurum Ekle"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Kurum Adı
          </label>
          <input
            {...register("name")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
            placeholder="Örn: Ege Üniversitesi Hastanesi"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Kurum Tipi
          </label>
          <select
            {...register("type")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900"
          >
            <option value={CompanyType.HOSPITAL}>Hastane</option>
            <option value={CompanyType.PHARMACY}>Eczane</option>
            <option value={CompanyType.CLINIC}>Klinik</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Şehir (İl)
          </label>
          <select
            {...register("city")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900"
          >
            <option value="">Şehir Seçiniz...</option>
            {TURKIYE_ILLERI.map((s) => (
              <option key={s.il} value={s.il}>
                {s.il}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            İlçe
          </label>
          <input
            {...register("district")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
            placeholder="Örn: Bornova"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Bölge
          </label>
          <input
            {...register("region")}
            readOnly
            className="w-full p-2 border border-slate-200 rounded-md text-slate-500 bg-slate-50 cursor-not-allowed"
            placeholder="Şehir seçilince otomatik atanır"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Telefon
          </label>
          <input
            {...register("phone")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
            placeholder="0232 XXX XX XX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Adres
          </label>
          <input
            {...register("address")}
            className="w-full p-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400"
            placeholder="Mahalle, Sokak, No..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {yukleniyorMu
            ? "Kaydediliyor..."
            : islemGuncellemeMi
              ? "Güncelle"
              : "Kaydet"}
        </button>
      </div>
    </form>
  );
};
