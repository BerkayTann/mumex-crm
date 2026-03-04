import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { sirketEklemeSemasi, ISirketFormVerisi } from '../schema'; YERİNE:
import { sirketEklemeSemasi, type ISirketFormVerisi } from "../schema";
import { CompanyType } from "../types";

// Container'dan gelecek olan props tipleri
interface ICompanyFormProps {
  onFormuGonder: (veri: ISirketFormVerisi) => void;
  onIptalEt: () => void;
  yukleniyorMu: boolean;
}

export const CompanyForm: React.FC<ICompanyFormProps> = ({
  onFormuGonder,
  onIptalEt,
  yukleniyorMu,
}) => {
  // React Hook Form kurulumu ve Zod entegrasyonu
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISirketFormVerisi>({
    resolver: zodResolver(sirketEklemeSemasi), // Doğrulama motoru olarak Zod kullanıyoruz
    defaultValues: {
      isActive: true,
      type: CompanyType.HOSPITAL, // Varsayılan değer
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onFormuGonder)}
      className="space-y-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Yeni Kurum Ekle
      </h2>

      {/* Kurum Adı Alanı */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Kurum Adı
        </label>
        <input
          {...register("name")}
          type="text"
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Örn: Acıbadem Hastanesi"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Kurum Tipi Alanı */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Kurum Tipi
        </label>
        <select
          {...register("type")}
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value={CompanyType.HOSPITAL}>Hastane</option>
          <option value={CompanyType.PHARMACY}>Eczane</option>
          <option value={CompanyType.CLINIC}>Klinik</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
        )}
      </div>

      {/* Şehir Alanı */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Şehir
        </label>
        <input
          {...register("city")}
          type="text"
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Örn: İstanbul"
        />
        {errors.city && (
          <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
        )}
      </div>

      {/* Adres ve Telefon (İsteğe Bağlı) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Telefon (Opsiyonel)
          </label>
          <input
            {...register("phone")}
            type="text"
            className="w-full p-2 border border-slate-300 rounded-md outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Adres (Opsiyonel)
          </label>
          <input
            {...register("address")}
            type="text"
            className="w-full p-2 border border-slate-300 rounded-md outline-none"
          />
        </div>
      </div>

      {/* Aksiyon Butonları */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onIptalEt}
          className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={yukleniyorMu}
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
        >
          {yukleniyorMu ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
};
