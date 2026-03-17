import { z } from 'zod';
import { VisitStatus } from '../types';

export const visitProductSchema = z.object({
  productId: z.string().min(1, "Ürün seçimi zorunludur."),
  quantity: z.number().min(1, "Adet en az 1 olmalıdır."),
  unitPrice: z.number().min(0, "Fiyat 0'dan küçük olamaz."),
  unitPriceInTRY: z.number().min(0).optional(),
  currency: z.string().default('TRY'),
  totalPrice: z.number().min(0),
  unit: z.string().optional()
});

export const ziyaretEklemeSemasi = z.object({
  companyId: z.string().min(1, "Lütfen bir kurum seçiniz."),
  userId: z.string().min(1, "Lütfen görüştüğünüz doktoru/kişiyi seçiniz."),
  visitDate: z.string().min(1, "Ziyaret tarihi zorunludur."),
  status: z.nativeEnum(VisitStatus).default(VisitStatus.COMPLETED),
  notes: z.string().optional(),
  cargoStatus: z.string().optional(),
  plannedDate: z.string().optional().or(z.literal('')).transform(v => !v ? undefined : v),
  cargoDate: z.string().optional().or(z.literal('')).transform(v => !v ? undefined : v),
  deliveryDate: z.string().optional().or(z.literal('')).transform(v => !v ? undefined : v),
  products: z.array(visitProductSchema).default([]),
  totalAmount: z.number().min(0).default(0),
}).superRefine((data, ctx) => {
  if (data.status === VisitStatus.PLANNED && !data.plannedDate) {
    ctx.addIssue({
      code: 'custom',
      path: ['plannedDate'],
      message: 'Durum "Planlandı" seçildiğinde planlanan tarih zorunludur.',
    });
  }
  if (data.cargoStatus === 'Kargoda' && !data.cargoDate) {
    ctx.addIssue({
      code: 'custom',
      path: ['cargoDate'],
      message: 'Kargo durumu "Kargoda" iken kargo tarihi zorunludur.',
    });
  }
  if (data.cargoStatus === 'Ulaştı' && !data.deliveryDate) {
    ctx.addIssue({
      code: 'custom',
      path: ['deliveryDate'],
      message: 'Kargo durumu "Ulaştı" iken teslim tarihi zorunludur.',
    });
  }
});

export type IVisitFormGirdisi = z.input<typeof ziyaretEklemeSemasi>;
export type IVisitFormVerisi = z.output<typeof ziyaretEklemeSemasi>;
