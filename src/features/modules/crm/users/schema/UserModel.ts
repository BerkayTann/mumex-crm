import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser, UserTitle } from '../types';

/**
 * Mongoose döküman tipi için IUser arayüzünü genişletiyoruz.
 * companyId frontend tarafında string olarak kullanılırken, 
 * veritabanı seviyesinde Types.ObjectId olarak saklanır.
 */
export interface IUserDocument extends Omit<IUser, '_id' | 'companyId'>, Document {
  companyId: Types.ObjectId;
}

// MongoDB veritabanı şeması
const kisiVeritabaniSemasi = new Schema<IUserDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    title: { type: String, enum: Object.values(UserTitle), required: true },
    specialty: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    // companyId artık IUserDocument içindeki Types.ObjectId ile tam uyumludur
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik yönetir
  }
);

// Model daha önce tanımlanmışsa onu kullan (Next.js Hot Reload desteği için kritik)
export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', kisiVeritabaniSemasi);