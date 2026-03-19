import mongoose, { Schema, Document, Types } from 'mongoose';
import { ICompany, CompanyType } from '../types';
import { Bolgeler } from '@/core/constants/regions';

// Mongoose'un kendi Document tipi ile kendi ICompany tipimizi birleştiriyoruz
export interface ICompanyDocument extends Omit<ICompany, '_id' | 'createdBy'>, Document {
  createdBy: Types.ObjectId;
}

// Veritabanı tablomuzun (Collection) özelliklerini belirliyoruz
const sirketVeritabaniSemasi = new Schema<ICompanyDocument>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(CompanyType),
      required: true,
    },
    city: { type: String, required: true },
    district: { type: String },
    region: { type: String, enum: Object.values(Bolgeler) },
    address: { type: String },
    phone: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AuthUser', required: true, index: true },
  },
  {
    timestamps: true, // Bu ayar createdAt ve updatedAt alanlarını MongoDB'de otomatik oluşturur
  }
);

// Next.js Hot Reloading sırasında model şemasının güncellenmesini garanti altına almak için:
if (mongoose.models.Company) {
  delete mongoose.models.Company;
}

export const CompanyModel = mongoose.model<ICompanyDocument>('Company', sirketVeritabaniSemasi);