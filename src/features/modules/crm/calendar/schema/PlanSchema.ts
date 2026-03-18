import { z } from 'zod';
import { PlanType } from '../types';

export const planEklemeSemasi = z.object({
  title: z
    .string()
    .min(1, 'Başlık zorunludur.')
    .max(200, 'Başlık en fazla 200 karakter olabilir.'),
  description: z
    .string()
    .max(1000, 'Açıklama en fazla 1000 karakter olabilir.')
    .optional()
    .or(z.literal('')),
  date: z.string().min(1, 'Tarih zorunludur.'),
  endDate: z.string().optional().or(z.literal('')),
  type: z.nativeEnum(PlanType).default(PlanType.REMINDER),
  relatedCompanyId: z.string().optional().or(z.literal('')),
  relatedUserId: z.string().optional().or(z.literal('')),
  isCompleted: z.boolean().default(false),
  color: z.string().optional().default('#6366f1'),
});

export type IPlanFormVerisi = z.infer<typeof planEklemeSemasi>;
