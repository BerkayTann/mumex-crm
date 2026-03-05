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
  productId: string; // Hangi ürün satıldı?
  quantity: number;  // Kaç adet satıldı?
  unitPrice: number; // Satıldığı andaki birim fiyatı (Snapshot)
  totalPrice: number; // quantity * unitPrice (Satır toplamı)
}

// Ana Ziyaret Objemiz
export interface IVisit {
  _id: string;
  companyId: string | ICompany; // Hangi Kuruma gidildi?
  userId: string | IUser;    // Hangi Doktora/Kişiye gidildi?
  visitDate: string; // Ziyaret tarihi
  status: VisitStatus;
  notes?: string;    // Mümessilin görüşme notları
  products: IVisitProduct[]; // Satılan ürünler listesi
  totalAmount: number; // Ziyaretin KDV dahil Genel Toplam Cirosu
  createdAt: string;
  updatedAt: string;
}

export type ICreateVisitPayload = Omit<IVisit, '_id' | 'createdAt' | 'updatedAt'>;