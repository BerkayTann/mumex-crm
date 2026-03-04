import mongoose, { Schema, Document } from 'mongoose';
import { ICompany, CompanyType } from '../types';

// Mongoose'un kendi Document tipi ile kendi ICompany tipimizi birleştiriyoruz
export interface ICompanyDocument extends Omit<ICompany, '_id'>, Document {}

// Veritabanı tablomuzun (Collection) özelliklerini belirliyoruz
const sirketVeritabaniSemasi = new Schema<ICompanyDocument>(
  {
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: Object.values(CompanyType), 
      required: true 
    },
    city: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // Bu ayar createdAt ve updatedAt alanlarını MongoDB'de otomatik oluşturur
  }
);

// Next.js (App Router) geliştirme ortamında dosyaları sürekli yeniden derlediği için
// modelin zaten var olup olmadığını (mongoose.models.Company) kontrol etmemiz ÇOK KRİTİKTİR.
// Aksi takdirde "OverwriteModelError" hatası alırız.
export const CompanyModel = mongoose.models.Company || mongoose.model<ICompanyDocument>('Company', sirketVeritabaniSemasi);