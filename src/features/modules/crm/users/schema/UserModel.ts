import mongoose, { Schema, Document } from 'mongoose';
import { IUser, UserTitle } from '../types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

// MongoDB veritabanı tablomuz
const kisiVeritabaniSemasi = new Schema<IUserDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    title: { type: String, enum: Object.values(UserTitle), required: true },
    specialty: { type: String },
    phone: { type: String },
    email: { type: String },
    // KRİTİK: Burada mongoose'a bu ID'nin 'Company' tablosuyla ilişkili olduğunu söylüyoruz (Relational DB mantığı)
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Model daha önce derlendiyse onu kullan, yoksa yeni oluştur
export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', kisiVeritabaniSemasi);