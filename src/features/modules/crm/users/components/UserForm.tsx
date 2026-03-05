import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kisiEklemeSemasi, IKisiFormVerisi } from "../schema/UserSchema";
import { IUser, UserTitle } from "../types";
import { ICompany } from "../../company/types"; // Diğer modülden tip import ediyoruz

interface IUserFormProps {
  sirketler: ICompany[];
  onFormuGonder: (veri: IKisiFormVerisi) => void;
  onIptalEt: () => void;
  yukleniyorMu: boolean;
  ilkVeriler?: Partial<IUser>; // Düzenleme için başlangıç verileri
}

export const UserForm: React.FC<IUserFormProps> = ({
  sirketler,
  onFormuGonder,
  onIptalEt,
  yukleniyorMu,
  ilkVeriler,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IKisiFormVerisi>({
    resolver: zodResolver(kisiEklemeSemasi),
    defaultValues: {
      firstName: ilkVeriler?.firstName || "",
      lastName: ilkVeriler?.lastName || "",
      title: ilkVeriler?.title || UserTitle.DOCTOR,
      specialty: ilkVeriler?.specialty || "",
      companyId:
        (ilkVeriler?.companyId as unknown as { _id: string })?._id ||
        ilkVeriler?.companyId ||
        "", // Populate edilmiş olabilir
      email: ilkVeriler?.email || "",
      phone: ilkVeriler?.phone || "",
      address: ilkVeriler?.address || "",
    },
  });

  // Veriler değiştiğinde formu resetle
  React.useEffect(() => {
    if (ilkVeriler) {
      reset({
        firstName: ilkVeriler.firstName || "",
        lastName: ilkVeriler.lastName || "",
        title: ilkVeriler.title || UserTitle.DOCTOR,
        specialty: ilkVeriler.specialty || "",
        companyId:
          (ilkVeriler.companyId as unknown as { _id: string })?._id ||
          (ilkVeriler.companyId as string) ||
          "",
        email: ilkVeriler.email || "",
        phone: ilkVeriler.phone || "",
        address: ilkVeriler.address || "",
      });
    }
  }, [ilkVeriler, reset]);

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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ad</label>
          <input
            {...register("firstName")}
            className="w-full p-2 border rounded-md"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Soyad</label>
          <input
            {...register("lastName")}
            className="w-full p-2 border rounded-md"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Unvan</label>
          <select
            {...register("title")}
            className="w-full p-2 border rounded-md"
          >
            {Object.values(UserTitle).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Çalıştığı Kurum
          </label>
          <select
            {...register("companyId")}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Kurum Seçiniz...</option>
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
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Uzmanlık Alanı</label>
        <input
          {...register("specialty")}
          placeholder="Örn: Kardiyoloji"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* YENİ EKLENEN İLETİŞİM VE ADRES BÖLÜMÜ */}
      <h3 className="text-md font-bold text-slate-700 mt-6 border-b pb-2">
        İletişim ve Adres
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Telefon</label>
          <input
            {...register("phone")}
            className="w-full p-2 border rounded-md"
            placeholder="05XX XXX XX XX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">E-Posta</label>
          <input
            {...register("email")}
            type="email"
            className="w-full p-2 border rounded-md"
            placeholder="ornek@hastane.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Açık Adres</label>
          <textarea
            {...register("address")}
            rows={2}
            className="w-full p-2 border rounded-md"
            placeholder="Mahalle, Sokak, No..."
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
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
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          {yukleniyorMu ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
};
