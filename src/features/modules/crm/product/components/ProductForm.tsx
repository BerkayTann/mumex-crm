import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { urunEklemeSemasi, IUrunFormVerisi } from "../schema/ProductSchema";
import { IProduct, ProductCategory } from "../types";

interface IProductFormProps {
  onFormuGonder: (veri: IUrunFormVerisi) => void;
  onIptalEt: () => void;
  yukleniyorMu: boolean;
  ilkVeriler?: IProduct; // Düzenleme için başlangıç verileri
}

export const ProductForm: React.FC<IProductFormProps> = ({
  onFormuGonder,
  onIptalEt,
  yukleniyorMu,
  ilkVeriler,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUrunFormVerisi>({
    resolver: zodResolver(urunEklemeSemasi),
    defaultValues: {
      name: ilkVeriler?.name || "",
      category: ilkVeriler?.category || ProductCategory.MEDICINE,
      price: ilkVeriler?.price || 0,
      description: ilkVeriler?.description || "",
      isActive: ilkVeriler?.isActive ?? true,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onFormuGonder)}
      className="space-y-4 bg-white p-8 rounded-xl border border-slate-200 shadow-lg"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        {ilkVeriler ? "Ürün Bilgilerini Güncelle" : "Yeni Ürün Kaydı"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Ürün Adı */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium mb-1">Ürün Adı</label>
          <input
            {...register("name")}
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Örn: Parol 500mg"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Kategori */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <select
            {...register("category")}
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value={ProductCategory.MEDICINE}>İlaç</option>
            <option value={ProductCategory.SUPPLEMENT}>Gıda Takviyesi</option>
            <option value={ProductCategory.MEDICAL_DEVICE}>Tıbbi Cihaz</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Fiyat (KRİTİK NOKTA: valueAsNumber: true) */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium mb-1">
            Güncel Satış Fiyatı (₺)
          </label>
          <input
            type="number"
            step="0.01" // Kuruşlu girilmesine izin verir
            {...register("price", { valueAsNumber: true })}
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Açıklama */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">
            Kısa Açıklama / İçerik
          </label>
          <input
            {...register("description")}
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Örn: Ağrı kesici ve ateş düşürücü..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
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
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors disabled:opacity-50"
        >
          {yukleniyorMu
            ? "Kaydediliyor..."
            : ilkVeriler
              ? "Ürünü Güncelle"
              : "Ürünü Kaydet"}
        </button>
      </div>
    </form>
  );
};
