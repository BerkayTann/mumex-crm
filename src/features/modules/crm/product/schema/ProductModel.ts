import mongoose, { Schema, Document } from 'mongoose';
import { IProduct, ProductCategory } from '../types';

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

const urunVeritabaniSemasi = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    category: { 
      type: String, 
      enum: Object.values(ProductCategory), 
      required: true 
    },
    // Veritabanına fiyat sütunu zorunlu (required) olarak eklendi
    price: { type: Number, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = mongoose.models.Product || mongoose.model<IProductDocument>('Product', urunVeritabaniSemasi);