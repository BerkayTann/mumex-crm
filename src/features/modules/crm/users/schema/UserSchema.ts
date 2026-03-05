import { z } from 'zod';
import { UserTitle } from '../types';

// Zod ile form ve API veri doğrulama kurallarımız
export const kisiEklemeSemasi = z.object({
  firstName: z.string().min(2, { message: "Ad en az 2 karakter olmalıdır." }),
  lastName: z.string().min(2, { message: "Soyad en az 2 karakter olmalıdır." }),
  title: z.nativeEnum(UserTitle, { message: "Geçerli bir unvan seçiniz." }),
  specialty: z.string().optional(),
  phone: z.string().optional(),
  // E-posta ya geçerli bir formatta olmalı ya da tamamen boş bırakılabilmeli
  email: z.string().email({ message: "Geçerli bir e-posta giriniz." }).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')), 
  companyId: z.string().min(1, { message: "Lütfen kişinin çalıştığı kurumu seçiniz." }),
  isActive: z.boolean().default(true),
});

export type IKisiFormVerisi = z.infer<typeof kisiEklemeSemasi>;