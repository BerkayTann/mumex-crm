import mongoose, { Schema, Document } from 'mongoose';
import { IVisit, VisitStatus } from '../types';

// Veritabanı seviyesinde kullanılacak döküman arayüzü
// IVisit'ten gelen string tiplerini, Mongoose'un beklediği tiplerle eziyoruz (Override)
export interface IVisitDocument extends Omit<IVisit, '_id' | 'companyId' | 'userId' | 'visitDate' | 'products' | 'createdAt' | 'updatedAt'>, Document {
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  visitDate: Date;
  products: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    unitPriceInTRY?: number;
    currency?: string;
    totalPrice: number;
    unit?: string;
  }[];
  cargoStatus?: string;
}

// MongoDB için Alt-Döküman (Subdocument) Şeması
const visitProductDbSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  unitPriceInTRY: { type: Number, min: 0 },
  currency: { type: String, default: 'TRY' },
  totalPrice: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'Adet' }
});

const ziyaretVeritabaniSemasi = new Schema<IVisitDocument>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    visitDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(VisitStatus), default: VisitStatus.COMPLETED },
    notes: { type: String },
    cargoStatus: { type: String },
    products: [visitProductDbSchema],
    totalAmount: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const VisitModel = mongoose.models.Visit || mongoose.model<IVisitDocument>('Visit', ziyaretVeritabaniSemasi);
