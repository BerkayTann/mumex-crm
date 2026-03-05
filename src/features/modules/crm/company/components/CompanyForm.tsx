import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sirketEklemeSemasi,
  type ISirketFormVerisi,
} from "../schema/CompanySchema";
import { CompanyType, ICompany } from "../types";

interface ICompanyFormProps {
  seciliSirket: ICompany | null; // Eğer null ise "Ekleme", doluysa "Düzenleme" modu
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
  const islemGuncellemeMi = !!seciliSirket; // seciliSirket varsa true olur

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISirketFormVerisi>({
    resolver: zodResolver(sirketEklemeSemasi),
    defaultValues: {
      isActive: true,
      type: CompanyType.HOSPITAL,
    },
  });

  // Mimarın Sırrı: Form açıldığında, eğer seçili bir şirket varsa React Hook Form'u o verilerle doldur (resetle)
  useEffect(() => {
    if (seciliSirket) {
      reset({
        name: seciliSirket.name,
        type: seciliSirket.type,
        city: seciliSirket.city,
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
      {/* Başlık Dinamik Oldu */}
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        {islemGuncellemeMi ? "Kurum Bilgilerini Güncelle" : "Yeni Kurum Ekle"}
      </h2>

      {/* ... (DİĞER INPUT ALANLARI TAMAMEN AYNI KALACAK - UZATMAMAK İÇİN KISALTILDI) ... */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Kurum Adı</label>
          <input
            {...register("name")}
            className="w-full p-2 border rounded-md"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kurum Tipi</label>
          <select
            {...register("type")}
            className="w-full p-2 border rounded-md"
          >
            <option value={CompanyType.HOSPITAL}>Hastane</option>
            <option value={CompanyType.PHARMACY}>Eczane</option>
            <option value={CompanyType.CLINIC}>Klinik</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Şehir</label>
          <input
            {...register("city")}
            className="w-full p-2 border rounded-md"
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefon</label>
          <input
            {...register("phone")}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Adres</label>
          <input
            {...register("address")}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onIptalEt}
          className="px-4 py-2 bg-slate-100 rounded-md"
        >
          İptal
        </button>
        {/* Buton Metni Dinamik Oldu */}
        <button
          type="submit"
          disabled={yukleniyorMu}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
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
