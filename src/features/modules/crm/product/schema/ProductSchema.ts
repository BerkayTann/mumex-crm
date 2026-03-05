import { z } from 'zod';
import { ProductCategory } from '../types';

export const urunEklemeSemasi = z.object({
  name: z.string().min(2, { message: "Ürün adı en az 2 karakter olmalıdır." }),
  category: z.nativeEnum(ProductCategory, { message: "Geçerli bir ürün kategorisi seçiniz." }),
  // Fiyat alanı eklendi: Sayı olmak zorunda ve 0'dan küçük olamaz
  price: z.number().min(0, { message: "Fiyat 0 veya daha büyük olmalıdır." }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type IUrunFormVerisi = z.infer<typeof urunEklemeSemasi>;