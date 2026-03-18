import { z } from "zod";

const usernameRegex = /^[a-z0-9._-]+$/i;

const ciroHedefiSemasi = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return 0;
  if (typeof value === "number" && Number.isNaN(value)) return 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return value;
}, z.number().min(0, "Ciro hedefi 0 veya üzeri olmalıdır."));

export const kayitOlSemasi = z.object({
  firstName: z.string().trim().min(2, "Ad en az 2 karakter olmalıdır."),
  lastName: z.string().trim().min(2, "Soyad en az 2 karakter olmalıdır."),
  username: z
    .string()
    .trim()
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır.")
    .max(24, "Kullanıcı adı en fazla 24 karakter olabilir.")
    .regex(usernameRegex, "Kullanıcı adı sadece harf, rakam, nokta, alt çizgi ve tire içerebilir."),
  email: z.string().trim().email("Geçerli bir e-posta giriniz."),
  phone: z
    .string()
    .trim()
    .min(10, "Telefon numarası en az 10 karakter olmalıdır.")
    .max(20, "Telefon numarası en fazla 20 karakter olabilir.")
    .optional()
    .or(z.literal("")),
  company: z.string().trim().min(2, "Şirket adı en az 2 karakter olmalıdır."),
  jobTitle: z.string().trim().min(2, "Ünvan en az 2 karakter olmalıdır."),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
});

export const girisSemasi = z.object({
  username: z.string().trim().min(3, "Kullanıcı adı zorunludur."),
  password: z.string().min(1, "Parola zorunludur."),
});

export const profilBilgileriGuncellemeSemasi = kayitOlSemasi.omit({ password: true });

export const ciroHedefleriGuncellemeSemasi = z.object({
  dailyCiroTarget: ciroHedefiSemasi,
  weeklyCiroTarget: ciroHedefiSemasi,
  monthlyCiroTarget: ciroHedefiSemasi,
});

export const profilGuncellemeSemasi = profilBilgileriGuncellemeSemasi.extend(
  ciroHedefleriGuncellemeSemasi.shape,
);

export const sifreDegistirmeSemasi = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre zorunludur."),
    newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalıdır."),
    confirmPassword: z.string().min(8, "Yeni şifre tekrarı zorunludur."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Yeni şifre tekrar alanı eşleşmiyor.",
    path: ["confirmPassword"],
  });

export type IKayitOlVerisi = z.infer<typeof kayitOlSemasi>;
export type IGirisVerisi = z.infer<typeof girisSemasi>;
export type IProfilBilgileriGuncellemeVerisi = z.infer<typeof profilBilgileriGuncellemeSemasi>;
export type ICiroHedefleriGuncellemeVerisi = z.infer<typeof ciroHedefleriGuncellemeSemasi>;
export type IProfilGuncellemeVerisi = z.infer<typeof profilGuncellemeSemasi>;
export type ISifreDegistirmeVerisi = z.infer<typeof sifreDegistirmeSemasi>;
