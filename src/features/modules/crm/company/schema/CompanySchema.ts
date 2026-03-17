import { z } from 'zod';
import { CompanyType } from '../types';
import { Bolgeler } from '@/core/constants/regions';

export const sirketEklemeSemasi = z.object({
  name: z.string().min(3, { message: "Kurum adı en az 3 karakter olmalıdır." }),
  type: z.nativeEnum(CompanyType, { error: "Geçerli bir kurum tipi seçiniz." }),
  city: z.string().min(2, { message: "Şehir alanı zorunludur." }),
  district: z.string().optional(),
  region: z.nativeEnum(Bolgeler).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type ISirketFormGirdisi = z.input<typeof sirketEklemeSemasi>;
export type ISirketFormVerisi = z.output<typeof sirketEklemeSemasi>;
