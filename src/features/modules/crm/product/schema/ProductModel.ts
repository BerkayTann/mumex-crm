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
    quantity: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, required: true },
    currency: { type: String, default: 'TRY' },
    priceInTRY: { type: Number },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Next.js Hot Reloading sırasında model şemasının güncellenmesini garanti altına almak için:
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

export const ProductModel = mongoose.model<IProductDocument>('Product', urunVeritabaniSemasi);