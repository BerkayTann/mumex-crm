import React, { useMemo, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ziyaretEklemeSemasi, IVisitFormVerisi } from "../schema/VisitSchema";
import { IVisit, VisitStatus } from "../types";
import { ICompany } from "../../company/types";
import { IUser } from "../../users/types";
import { IProduct } from "../../product/types";
import { Plus, Trash2 } from "lucide-react";
import { useDovizKurlari, tryeVevir } from "@/core/hooks/useExchangeRates";

interface IVisitFormProps {
  sirketler: ICompany[];
  kisiler: IUser[];
  urunler: IProduct[];
  onFormuGonder: (veri: IVisitFormVerisi) => void;
  onIptalEt: () => void;
  yukleniyorMu: boolean;
  ilkVeriler?: IVisit;
}

export const VisitForm: React.FC<IVisitFormProps> = ({
  sirketler,
  kisiler,
  urunler,
  onFormuGonder,
  onIptalEt,
  yukleniyorMu,
  ilkVeriler,
}) => {
  const duzenlemeModuMu = !!ilkVeriler;
  const { data: kurlar } = useDovizKurlari();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IVisitFormVerisi>({
    resolver: zodResolver(ziyaretEklemeSemasi),
    defaultValues: ilkVeriler
      ? {
          companyId:
            typeof ilkVeriler.companyId === "object"
              ? (ilkVeriler.companyId as unknown as ICompany)._id
              : ilkVeriler.companyId,
          userId:
            typeof ilkVeriler.userId === "object"
              ? (ilkVeriler.userId as unknown as IUser)._id
              : ilkVeriler.userId,
          visitDate: ilkVeriler.visitDate
            ? ilkVeriler.visitDate.split("T")[0]
            : new Date().toISOString().split("T")[0],
          status: ilkVeriler.status,
          notes: ilkVeriler.notes || "",
          cargoStatus: ilkVeriler.cargoStatus || "",
          plannedDate: ilkVeriler.plannedDate
            ? new Date(ilkVeriler.plannedDate).toISOString().split("T")[0]
            : "",
          cargoDate: ilkVeriler.cargoDate
            ? new Date(ilkVeriler.cargoDate).toISOString().split("T")[0]
            : "",
          deliveryDate: ilkVeriler.deliveryDate
            ? new Date(ilkVeriler.deliveryDate).toISOString().split("T")[0]
            : "",
          products: ilkVeriler.products.map((p) => ({
            productId:
              typeof p.productId === "object"
                ? (p.productId as unknown as IProduct)._id
                : p.productId,
            quantity: p.quantity,
            unitPrice: p.unitPrice,
            unitPriceInTRY: p.unitPriceInTRY ?? p.unitPrice,
            currency: p.currency ?? "TRY",
            totalPrice: p.totalPrice,
            unit: p.unit ?? "Adet",
          })),
          totalAmount: ilkVeriler.totalAmount,
        }
      : {
          visitDate: new Date().toISOString().split("T")[0],
          status: VisitStatus.COMPLETED,
          cargoStatus: "",
          plannedDate: "",
          cargoDate: "",
          deliveryDate: "",
          products: [],
          totalAmount: 0,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const seciliSirketId = watch("companyId");
  const izlenenDurum = watch("status");
  const izlenenKargoDurumu = watch("cargoStatus");
  const izlenenUrunler = useWatch({ control, name: "products" });

  const filtrelenmisKisiler = useMemo(() => {
    if (!seciliSirketId) return [];
    return kisiler.filter(
      (k) =>
        (typeof k.companyId === "object"
          ? (k.companyId as unknown as { _id: string })._id
          : k.companyId) === seciliSirketId,
    );
  }, [kisiler, seciliSirketId]);

  const onSubmitWrapper = (data: IVisitFormVerisi) => {
    let genelToplam = 0;
    const islenmisUrunler = data.products.map((p) => {
      // Her satır toplamı = TRY cinsinden hesap
      const satirToplami = p.quantity * (p.unitPriceInTRY ?? p.unitPrice);
      genelToplam += satirToplami;
      return { ...p, totalPrice: satirToplami };
    });
    onFormuGonder({
      ...data,
      products: islenmisUrunler,
      totalAmount: genelToplam,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitWrapper)}
      className="space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-lg"
    >
      <h2 className="text-xl font-bold text-slate-800 border-b pb-4">
        {duzenlemeModuMu ? "Ziyareti Düzenle" : "Yeni Ziyaret & Satış Girişi"}
      </h2>

      {/* 1. ÜST KISIM: Ziyaret Bilgileri */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Kurum Seçiniz
          </label>
          <select
            {...register("companyId")}
            className="w-full p-2 border rounded-md text-slate-900"
          >
            <option value="">-- Kurum Seçin --</option>
            {sirketler.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.companyId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.companyId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Görüşülen Kişi (Doktor/Yetkili)
          </label>
          <select
            {...register("userId")}
            disabled={!seciliSirketId}
            className="w-full p-2 border rounded-md text-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">-- Önce Kurum Seçin --</option>
            {filtrelenmisKisiler.map((k) => (
              <option key={k._id} value={k._id}>
                {k.firstName} {k.lastName}
              </option>
            ))}
          </select>
          {errors.userId && (
            <p className="text-red-500 text-xs mt-1">{errors.userId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Ziyaret Tarihi
          </label>
          <input
            type="date"
            {...register("visitDate")}
            className="w-full p-2 border rounded-md text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Durum
          </label>
          <select
            {...register("status")}
            className="w-full p-2 border rounded-md text-slate-900"
          >
            <option value={VisitStatus.COMPLETED}>
              Tamamlandı (Satış Yapıldı)
            </option>
            <option value={VisitStatus.PLANNED}>
              Planlandı (Henüz Gidilmedi)
            </option>
            <option value={VisitStatus.CANCELLED}>İptal Edildi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Kargo Durumu
          </label>
          <select
            {...register("cargoStatus")}
            className="w-full p-2 border rounded-md text-slate-900"
          >
            <option value="">-- Kargo Yok / Belirtilmedi --</option>
            <option value="Bekliyor">Bekliyor</option>
            <option value="Kargoda">Kargoda</option>
            <option value="Ulaştı">Ulaştı</option>
          </select>
        </div>

        {izlenenDurum === VisitStatus.PLANNED && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Planlanan Tarih <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("plannedDate")}
              className="w-full p-2 border rounded-md text-slate-900"
            />
            {errors.plannedDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.plannedDate.message}
              </p>
            )}
          </div>
        )}

        {izlenenKargoDurumu === "Kargoda" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Kargo Tarihi <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("cargoDate")}
              className="w-full p-2 border rounded-md text-slate-900"
            />
            {errors.cargoDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.cargoDate.message}
              </p>
            )}
          </div>
        )}

        {izlenenKargoDurumu === "Ulaştı" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Teslim Tarihi <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("deliveryDate")}
              className="w-full p-2 border rounded-md text-slate-900"
            />
            {errors.deliveryDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.deliveryDate.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 2. ORTA KISIM: Dinamik Satış Listesi */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800">Satılan Ürünler</h3>
          <button
            type="button"
            onClick={() =>
              append({
                productId: "",
                quantity: 1,
                unitPrice: 0,
                unitPriceInTRY: 0,
                currency: "TRY",
                totalPrice: 0,
                unit: "Adet",
              })
            }
            className="flex items-center gap-1 text-sm bg-slate-800 text-white px-3 py-1.5 rounded"
          >
            <Plus className="w-4 h-4" /> Satır Ekle
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-slate-500 italic">
            Henüz ürün eklenmedi. Satış yoksa not yazarak kaydedebilirsiniz.
          </p>
        )}

        {!kurlar && fields.length > 0 && (
          <div className="mb-4 bg-yellow-50 text-yellow-800 p-3 rounded text-sm border border-yellow-200 font-medium">
            ⚠ Güncel döviz şuanda alınamıyor, lütfen TL giriş yapınız.
          </div>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => {
            const satirDoviz = izlenenUrunler?.[index]?.currency || "TRY";
            const satirBirimFiyat = izlenenUrunler?.[index]?.unitPrice || 0;
            const satirBirimFiyatTRY =
              izlenenUrunler?.[index]?.unitPriceInTRY ?? satirBirimFiyat;
            const satirAdet = izlenenUrunler?.[index]?.quantity || 0;
            const satirToplamTRY = satirAdet * satirBirimFiyatTRY;

            return (
              <div
                key={field.id}
                className="flex gap-3 items-start bg-white p-3 rounded border"
              >
                {/* Ürün Seçici */}
                <div className="flex-1">
                  <label className="block text-xs text-slate-600 mb-1">
                    Ürün
                  </label>
                  <select
                    {...register(`products.${index}.productId`)}
                    className="w-full p-2 text-sm border rounded text-slate-900"
                    onChange={(e) => {
                      register(`products.${index}.productId`).onChange(e);
                      const secilenUrun = urunler.find(
                        (u) => u._id === e.target.value,
                      );
                      if (secilenUrun) {
                        const doviz = secilenUrun.currency || "TRY";
                        const fiyatTRY =
                          doviz === "TRY"
                            ? secilenUrun.price
                            : kurlar
                              ? tryeVevir(secilenUrun.price, doviz, kurlar)
                              : (secilenUrun.priceInTRY ?? secilenUrun.price);
                        setValue(
                          `products.${index}.unitPrice`,
                          secilenUrun.price,
                        );
                        setValue(`products.${index}.unitPriceInTRY`, fiyatTRY);
                        setValue(`products.${index}.currency`, doviz);
                      }
                    }}
                  >
                    <option value="">-- Ürün --</option>
                    {urunler.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                        {u.currency && u.currency !== "TRY"
                          ? ` (${u.price} ${u.currency})`
                          : ` (${u.price} ₺)`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Adet */}
                <div className="w-20">
                  <label className="block text-xs text-slate-600 mb-1">
                    Miktar
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register(`products.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    className="w-full p-2 text-sm border rounded text-slate-900"
                  />
                </div>

                {/* Birim */}
                <div className="w-24">
                  <label className="block text-xs text-slate-600 mb-1">
                    Birim
                  </label>
                  <select
                    {...register(`products.${index}.unit`)}
                    className="w-full p-2 text-sm border rounded text-slate-900 bg-white"
                  >
                    <option value="Adet">Adet</option>
                    <option value="Kutu">Kutu</option>
                    <option value="Şişe">Şişe</option>
                    <option value="Ampul">Ampul</option>
                    <option value="Flakon">Flakon</option>
                  </select>
                </div>

                {/* Birim Fiyat (orijinal döviz cinsinde) */}
                <div className="w-36">
                  <label className="block text-xs text-slate-600 mb-1">
                    Birim Fiyat ({satirDoviz === "TRY" ? "₺" : satirDoviz})
                  </label>
                  <div className="flex gap-1 items-center">
                    <input
                      type="number"
                      step="0.01"
                      {...register(`products.${index}.unitPrice`, {
                        valueAsNumber: true,
                        onChange: (e) => {
                          const yeniFiyat = parseFloat(e.target.value) || 0;
                          if (satirDoviz !== "TRY" && kurlar) {
                            setValue(
                              `products.${index}.unitPriceInTRY`,
                              tryeVevir(yeniFiyat, satirDoviz, kurlar),
                            );
                          } else {
                            setValue(
                              `products.${index}.unitPriceInTRY`,
                              yeniFiyat,
                            );
                          }
                        },
                      })}
                      className="w-full p-2 text-sm border rounded bg-yellow-50 text-slate-900"
                    />
                    {satirDoviz !== "TRY" && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-1 rounded border border-blue-200 shrink-0">
                        {satirDoviz}
                      </span>
                    )}
                  </div>
                  {/* TRY karşılığı */}
                  {satirDoviz !== "TRY" && satirBirimFiyatTRY > 0 && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      ≈{" "}
                      {satirBirimFiyatTRY.toLocaleString("tr-TR", {
                        maximumFractionDigits: 2,
                      })}{" "}
                      ₺
                    </p>
                  )}
                </div>

                {/* Satır Toplamı (TRY) */}
                {satirToplamTRY > 0 && (
                  <div className="w-28 pt-5">
                    <p className="text-xs text-slate-500">
                      {satirDoviz !== "TRY" && (
                        <span className="block text-slate-400">
                          {(satirAdet * satirBirimFiyat).toLocaleString(
                            "tr-TR",
                            { maximumFractionDigits: 2 },
                          )}{" "}
                          {satirDoviz}
                        </span>
                      )}
                      <span className="font-semibold text-emerald-700">
                        {satirToplamTRY.toLocaleString("tr-TR", {
                          maximumFractionDigits: 2,
                        })}{" "}
                        ₺
                      </span>
                    </p>
                  </div>
                )}

                {/* Sil Butonu */}
                <div className="pt-5">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Hidden fields */}
                <input
                  type="hidden"
                  {...register(`products.${index}.unitPriceInTRY`, {
                    valueAsNumber: true,
                  })}
                />
                <input
                  type="hidden"
                  {...register(`products.${index}.currency`)}
                />
              </div>
            );
          })}
        </div>

        {/* Genel Toplam (TRY) */}
        {fields.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200 flex justify-end">
            <p className="text-sm font-semibold text-slate-700">
              Tahmini Toplam:{" "}
              <span className="text-emerald-700 text-base">
                {(izlenenUrunler || [])
                  .reduce((toplam, p) => {
                    return (
                      toplam +
                      (p?.quantity || 0) *
                        (p?.unitPriceInTRY ?? p?.unitPrice ?? 0)
                    );
                  }, 0)
                  .toLocaleString("tr-TR", { maximumFractionDigits: 2 })}{" "}
                ₺
              </span>
            </p>
          </div>
        )}
      </div>

      {/* 3. ALT KISIM: Notlar */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Ziyaret Notları
        </label>
        <textarea
          {...register("notes")}
          className="w-full p-2 border rounded-md text-slate-900 placeholder:text-slate-400"
          rows={3}
          placeholder="Görüşme detayları..."
        ></textarea>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onIptalEt}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={yukleniyorMu}
          className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium"
        >
          {yukleniyorMu
            ? "Kaydediliyor..."
            : duzenlemeModuMu
              ? "Değişiklikleri Kaydet"
              : "Ziyareti & Satışı Kaydet"}
        </button>
      </div>
    </form>
  );
};
