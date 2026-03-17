import { z } from 'zod';
import { UserTitle } from '../types';
import { CompanyType } from '../../company/types';

export const kisiEklemeSemasi = z.object({
  firstName: z.string().min(2, { message: "Ad en az 2 karakter olmalıdır." }),
  lastName: z.string().min(2, { message: "Soyad en az 2 karakter olmalıdır." }),
  title: z.nativeEnum(UserTitle, { message: "Geçerli bir unvan seçiniz." }),
  specialty: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Geçerli bir e-posta giriniz." }).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  sirketAdi: z.string().min(2, { message: "Kurum adı en az 2 karakter olmalıdır." }),
  sirketTipi: z.nativeEnum(CompanyType, { message: "Geçerli bir kurum tipi seçiniz." }),
  sehir: z.string().min(2, { message: "Şehir alanı zorunludur." }),
  ilce: z.string().optional(),
  sirketAdresi: z.string().optional().or(z.literal('')),
  forceNewCompany: z.boolean().optional().default(false),
});

export type IKisiFormGirdisi = z.input<typeof kisiEklemeSemasi>;
export type IKisiFormVerisi = z.output<typeof kisiEklemeSemasi>;
