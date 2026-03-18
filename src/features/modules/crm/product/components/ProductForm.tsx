import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { urunEklemeSemasi, IUrunFormGirdisi, IUrunFormVerisi } from "../schema/ProductSchema";
import { IProduct, ProductCategory } from "../types";
import { useDovizKurlari, tryeVevir } from "@/core/hooks/useExchangeRates";
import { DESTEKLENEN_KURLAR } from "@/core/constants/currencies";
import { MoneyText } from "@/components/common/MoneyText";

interface IProductFormProps {
  onFormuGonder: (veri: IUrunFormVerisi) => void;
  onIptalEt: () => void;
  yukleniyorMu: boolean;
  ilkVeriler?: IProduct;
}

export const ProductForm: React.FC<IProductFormProps> = ({
  onFormuGonder,
  onIptalEt,
  yukleniyorMu,
  ilkVeriler,
}) => {
  const { data: kurlar, isLoading: kurYukleniyor } = useDovizKurlari();
  const [seciliDoviz, setSeciliDoviz] = useState(ilkVeriler?.currency || "TRY");
  const [girilenFiyat, setGirilenFiyat] = useState(ilkVeriler?.price || 0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IUrunFormGirdisi, unknown, IUrunFormVerisi>({
    resolver: zodResolver(urunEklemeSemasi),
    defaultValues: {
      name: ilkVeriler?.name || "",
      category: ilkVeriler?.category || ProductCategory.MEDICINE,
      quantity: ilkVeriler?.quantity ?? 0,
      price: ilkVeriler?.price || 0,
      currency: ilkVeriler?.currency || "TRY",
      priceInTRY: ilkVeriler?.priceInTRY,
      description: ilkVeriler?.description || "",
      isActive: ilkVeriler?.isActive ?? true,
    },
  });

  const izlenenFiyat = watch("price");

  useEffect(() => {
    setGirilenFiyat(izlenenFiyat || 0);
  }, [izlenenFiyat]);

  // TRY karşılığını hesapla
  const tryKarsiligi: number | null =
    kurlar && seciliDoviz !== "TRY"
      ? tryeVevir(girilenFiyat, seciliDoviz, kurlar)
      : null;

  // 1 birim dövizin TRY değeri (gösterim için)
  const birDovizTry: number | null =
    kurlar && seciliDoviz !== "TRY" && kurlar[seciliDoviz]
      ? 1 / kurlar[seciliDoviz]
      : null;

  const onSubmitWrapper = (data: IUrunFormVerisi) => {
    const priceInTRY =
      seciliDoviz === "TRY"
        ? data.price
        : kurlar
        ? tryeVevir(data.price, seciliDoviz, kurlar)
        : data.price;

    onFormuGonder({ ...data, currency: seciliDoviz, priceInTRY });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitWrapper)}
      className="space-y-4 bg-white p-8 rounded-xl border border-slate-200 shadow-lg"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        {ilkVeriler ? "Ürün Bilgilerini Güncelle" : "Yeni Ürün Kaydı"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Ürün Adı */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Ürün Adı</label>
          <input
            {...register("name")}
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
            placeholder="Örn: Parol 500mg"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Kategori */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
          <select
            title="Kategori Seçin"
            {...register("category")}
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          >
            <option value={ProductCategory.MEDICINE}>İlaç</option>
            <option value={ProductCategory.SUPPLEMENT}>Gıda Takviyesi</option>
            <option value={ProductCategory.MEDICAL_DEVICE}>Tıbbi Cihaz</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Fiyat + Döviz Seçici */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Güncel Satış Fiyatı
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="flex-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
              placeholder="0.00"
            />
            <select
              title="Para Birimi Seçin"
              value={seciliDoviz}
              onChange={(e) => setSeciliDoviz(e.target.value)}
              disabled={kurYukleniyor}
              className="w-28 p-2 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white disabled:bg-slate-100"
            >
              {DESTEKLENEN_KURLAR.map((d) => (
                <option key={d.kod} value={d.kod}>
                  {d.kod} {d.sembol}
                </option>
              ))}
            </select>
          </div>
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
          {/* Canlı TRY karşılığı — sadece TRY dışı dövizlerde göster */}
          {tryKarsiligi !== null && girilenFiyat > 0 && (
            <p className="text-xs text-slate-500 mt-1.5">
              ≈{" "}
              <MoneyText
                value={tryKarsiligi}
                as="span"
                className="font-semibold"
              />
              {birDovizTry !== null && (
                <span className="ml-2">
                  (1 {seciliDoviz} ={" "}
                  <MoneyText
                    value={birDovizTry}
                    as="span"
                    className="font-medium"
                  />
                  )
                </span>
              )}
            </p>
          )}
          {kurYukleniyor && (
            <p className="text-xs text-slate-400 mt-1">Döviz kurları yükleniyor...</p>
          )}
          {!kurlar && !kurYukleniyor && seciliDoviz !== "TRY" && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠ Canlı kur alınamadı. TRY seçilmesi önerilir.
            </p>
          )}
        </div>

        {/* Başlangıç Stok Adedi */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Başlangıç Stok Adedi <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="1"
            {...register("quantity", { valueAsNumber: true })}
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
            placeholder="0"
          />
          {errors.quantity && (
            <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
          )}
        </div>

        {/* Açıklama */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Kısa Açıklama / İçerik
          </label>
          <input
            {...register("description")}
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
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
