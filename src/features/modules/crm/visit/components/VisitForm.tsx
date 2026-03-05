import React, { useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ziyaretEklemeSemasi, IVisitFormVerisi } from "../schema/VisitSchema";
import { VisitStatus } from "../types";
import { ICompany } from "../../company/types";
import { IUser } from "../../users/types";
import { IProduct } from "../../product/types";
import { Plus, Trash2 } from "lucide-react";

interface IVisitFormProps {
  sirketler: ICompany[];
  kisiler: IUser[];
  urunler: IProduct[];
  onFormuGonder: (veri: IVisitFormVerisi) => void;
  onIptalEt: () => void;
  yukleniyorMu: boolean;
}

export const VisitForm: React.FC<IVisitFormProps> = ({
  sirketler,
  kisiler,
  urunler,
  onFormuGonder,
  onIptalEt,
  yukleniyorMu,
}) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IVisitFormVerisi>({
    resolver: zodResolver(ziyaretEklemeSemasi),
    defaultValues: {
      visitDate: new Date().toISOString().split("T")[0], // Bugünü varsayılan yapar
      status: VisitStatus.COMPLETED,
      products: [],
      totalAmount: 0,
    },
  });

  // Mimarın Sırrı 1: Dinamik Satırlar (Dizi Yönetimi)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  // Mimarın Sırrı 2: Formdaki "companyId" değiştikçe izle
  const seciliSirketId = watch("companyId");

  // Mimarın Sırrı 3: Sadece seçili kurumda çalışan doktorları filtrele!
  const filtrelenmisKisiler = useMemo(() => {
    if (!seciliSirketId) return [];
    return kisiler.filter(
      (k) =>
        // Populate durumunu da göz önünde bulundurarak ID kontrolü
        (typeof k.companyId === "object"
          ? (k.companyId as unknown as { _id: string })._id
          : k.companyId) === seciliSirketId,
    );
  }, [kisiler, seciliSirketId]);

  // Arka planda hesaplamaları yapıp üst bileşene fırlatan kapsayıcı fonksiyon
  const onSubmitWrapper = (data: IVisitFormVerisi) => {
    let genelToplam = 0;

    // Her bir ürün satırının toplamını bul ve genel toplama ekle
    const islenmisUrunler = data.products.map((p) => {
      const satirToplami = p.quantity * p.unitPrice;
      genelToplam += satirToplami;
      return { ...p, totalPrice: satirToplami };
    });

    // Kusursuz veriyi fırlat! (Geçmiş asla değişmeyecek)
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
        Yeni Ziyaret & Satış Girişi
      </h2>

      {/* 1. ÜST KISIM: Ziyaret Bilgileri */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Kurum Seçiniz
          </label>
          <select
            {...register("companyId")}
            className="w-full p-2 border rounded-md"
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
          <label className="block text-sm font-medium mb-1">
            Görüşülen Kişi (Doktor/Yetkili)
          </label>
          <select
            {...register("userId")}
            disabled={!seciliSirketId}
            className="w-full p-2 border rounded-md disabled:bg-slate-100"
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
          <label className="block text-sm font-medium mb-1">
            Ziyaret Tarihi
          </label>
          <input
            type="date"
            {...register("visitDate")}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Durum</label>
          <select
            {...register("status")}
            className="w-full p-2 border rounded-md"
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
      </div>

      {/* 2. ORTA KISIM: Dinamik Satış Listesi */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-700">Satılan Ürünler</h3>
          <button
            type="button"
            onClick={() =>
              append({
                productId: "",
                quantity: 1,
                unitPrice: 0,
                totalPrice: 0,
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

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-3 items-start bg-white p-3 rounded border"
            >
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">
                  Ürün
                </label>
                {/* Ürün seçildiğinde o ürünün fiyatını otomatik olarak unitPrice alanına yazdırıyoruz! */}
                <select
                  {...register(`products.${index}.productId`)}
                  className="w-full p-2 text-sm border rounded"
                  onChange={(e) => {
                    register(`products.${index}.productId`).onChange(e); // Formun kendi state'ini güncelle
                    const secilenUrun = urunler.find(
                      (u) => u._id === e.target.value,
                    );
                    if (secilenUrun)
                      setValue(
                        `products.${index}.unitPrice`,
                        secilenUrun.price,
                      ); // Fiyatı kopyala (Snapshot)
                  }}
                >
                  <option value="">-- Ürün --</option>
                  {urunler.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-xs text-slate-500 mb-1">
                  Adet
                </label>
                <input
                  type="number"
                  {...register(`products.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  className="w-full p-2 text-sm border rounded"
                />
              </div>
              <div className="w-32">
                <label className="block text-xs text-slate-500 mb-1">
                  Birim Fiyat (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register(`products.${index}.unitPrice`, {
                    valueAsNumber: true,
                  })}
                  className="w-full p-2 text-sm border rounded bg-yellow-50"
                />
              </div>
              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ALT KISIM: Notlar */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Ziyaret Notları
        </label>
        <textarea
          {...register("notes")}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Görüşme detayları..."
        ></textarea>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onIptalEt}
          className="px-4 py-2 bg-slate-100 rounded-md"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={yukleniyorMu}
          className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium"
        >
          {yukleniyorMu ? "Kaydediliyor..." : "Ziyareti & Satışı Kaydet"}
        </button>
      </div>
    </form>
  );
};
