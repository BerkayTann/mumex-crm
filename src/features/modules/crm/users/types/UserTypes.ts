// Kişinin unvanlarını tutacağımız Enum (Doktor, Eczacı vb.)
export enum UserTitle {
  DOCTOR = 'DOCTOR',
  PHARMACIST = 'PHARMACIST',
  NURSE = 'NURSE',
  MANAGER = 'MANAGER', // Klinik veya hastane yöneticisi
}

// Temel Kişi (User) objemizin Frontend ve Backend arasındaki arayüzü
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  title: UserTitle;
  specialty?: string; // Uzmanlık alanı (Örn: Kardiyoloji, Dahiliye)
  phone?: string;
  email?: string;
  companyId: string; // KRİTİK ALAN: Bu kişinin çalıştığı Kurumun (Company) ID'si
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Yeni kayıt oluştururken _id ve tarihleri yollamayacağımız tip
export type ICreateUserPayload = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;