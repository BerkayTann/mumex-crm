// Kurum tiplerini standartlaştırdığımız Enum yapısı
export enum CompanyType {
  HOSPITAL = 'HOSPITAL',
  PHARMACY = 'PHARMACY',
  CLINIC = 'CLINIC',
}

// Frontend ve Backend arasında dolaşacak olan temel Kurum (Company) objemizin yapısı
export interface ICompany {
  _id: string;
  name: string;
  type: CompanyType;
  city: string;
  address?: string; // Soru işareti (?) bu alanın zorunlu olmadığını belirtir
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Yeni bir kurum oluştururken ID ve Tarih bilgileri bizde olmayacağı için onları 'Omit' ile çıkarıyoruz
export type ICreateCompanyPayload = Omit<ICompany, '_id' | 'createdAt' | 'updatedAt'>;