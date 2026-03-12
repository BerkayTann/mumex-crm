import { z } from 'zod';
import { VisitStatus } from '../types';

// Önce satılan ürünün kurallarını belirliyoruz
export const visitProductSchema = z.object({
  productId: z.string().min(1, "Ürün seçimi zorunludur."),
  quantity: z.number().min(1, "Adet en az 1 olmalıdır."),
  unitPrice: z.number().min(0, "Fiyat 0'dan küçük olamaz."),
  unitPriceInTRY: z.number().min(0).optional(),
  currency: z.string().default('TRY'),
  totalPrice: z.number().min(0),
  unit: z.string().optional()
});

// Sonra Ana Ziyaret formunun kurallarını belirliyoruz
export const ziyaretEklemeSemasi = z.object({
  companyId: z.string().min(1, "Lütfen bir kurum seçiniz."),
  userId: z.string().min(1, "Lütfen görüştüğünüz doktoru/kişiyi seçiniz."),
  visitDate: z.string().min(1, "Ziyaret tarihi zorunludur."),
  status: z.nativeEnum(VisitStatus).default(VisitStatus.COMPLETED),
  notes: z.string().optional(),
  cargoStatus: z.string().optional(),
  
  // Ziyarette en az 1 ürün satılmış olmasını (veya görüşülmüş olmasını) isteyebiliriz
  // Şimdilik boş liste de geçebilsin diye empty array'e izin veriyoruz
  products: z.array(visitProductSchema).default([]),
  
  totalAmount: z.number().min(0).default(0),
});

export type IVisitFormVerisi = z.infer<typeof ziyaretEklemeSemasi>;