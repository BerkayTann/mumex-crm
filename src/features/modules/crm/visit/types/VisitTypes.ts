import { ICompany } from "../../company/types";
import { IUser } from "../../users/types";

// Ziyaretin durumu (Planlandı, Tamamlandı, İptal vs.)
export enum VisitStatus {
  PLANNED = 'PLANNED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// KRİTİK: Ziyaretin içinde satılan tek bir ürünün yapısı (Tarihe Mühür Vurulan Yer!)
export interface IVisitProduct {
  productId: string;          // Hangi ürün satıldı?
  quantity: number;           // Kaç adet satıldı?
  unitPrice: number;          // Satıldığı andaki birim fiyatı - ürünün KENDİ dövizinde (Snapshot)
  unitPriceInTRY?: number;    // Satış anındaki TRY karşılığı (Snapshot)
  currency?: string;          // Satış anındaki döviz cinsi, örn. "USD" (Snapshot)
  totalPrice: number;         // quantity * unitPriceInTRY — her zaman TRY (Satır toplamı)
  unit?: string;              // Satılan ürünün birimi (Kutu, Adet, vs.)
}

// Ana Ziyaret Objemiz
export interface IVisit {
  _id: string;
  companyId: string | ICompany; // Hangi Kuruma gidildi?
  userId: string | IUser;    // Hangi Doktora/Kişiye gidildi?
  visitDate: string; // Ziyaret tarihi
  status: VisitStatus;
  notes?: string;    // Mümessilin görüşme notları
  cargoStatus?: string; // Bekliyor, Kargoda, Ulaştı
  plannedDate?: string | null; // Durum PLANNED olduğunda, planlanan ziyaret tarihi
  cargoDate?: string | null; // Kargo durumu "Kargoda" olduğunda, kargo gönderme tarihi
  deliveryDate?: string | null; // Kargo durumu "Ulaştı" olduğunda, teslim tarihi
  products: IVisitProduct[]; // Satılan ürünler listesi
  totalAmount: number; // Ziyaretin KDV dahil Genel Toplam Cirosu
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type ICreateVisitPayload = Omit<IVisit, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>;