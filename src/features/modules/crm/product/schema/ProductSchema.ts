import { z } from 'zod';
import { ProductCategory } from '../types';

export const urunEklemeSemasi = z.object({
  name: z.string().min(2, { message: "Ürün adı en az 2 karakter olmalıdır." }),
  category: z.nativeEnum(ProductCategory, { message: "Geçerli bir ürün kategorisi seçiniz." }),
  price: z.number().min(0, { message: "Fiyat 0 veya daha büyük olmalıdır." }),
  currency: z.string().default('TRY'),
  priceInTRY: z.number().min(0).optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type IUrunFormGirdisi = z.input<typeof urunEklemeSemasi>;
export type IUrunFormVerisi = z.output<typeof urunEklemeSemasi>;
