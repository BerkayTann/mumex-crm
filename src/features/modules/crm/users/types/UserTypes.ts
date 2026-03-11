// Kişinin unvanlarını tutacağımız Enum (Doktor, Eczacı vb.)
export enum UserTitle {
  DOCTOR = 'DOCTOR',
  PHARMACIST = 'PHARMACIST',
  NURSE = 'NURSE',
  MANAGER = 'MANAGER', // Klinik veya hastane yöneticisi
}

// Müşteri segmentasyonu (ciro bazlı dinamik)
export type KisiSegmenti = 'A' | 'B' | 'C';

// Temel Kişi (User) objemizin Frontend ve Backend arasındaki arayüzü
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  title: UserTitle;
  specialty?: string;
  phone?: string;
  email?: string;
  address?: string;
  companyId: string; // Populate edildiğinde ICompany objesi olur
  isActive: boolean;
  segment?: KisiSegmenti; // Aggregation ile hesaplanan A/B/C sınıfı
  createdAt: Date;
  updatedAt: Date;
}

// Yeni kayıt oluştururken _id ve tarihleri yollamayacağımız tip
export type ICreateUserPayload = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;