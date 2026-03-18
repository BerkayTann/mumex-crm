import mongoose, { Schema, Document } from 'mongoose';
import { IPlan, PlanType } from '../types';

// IPlan'daki string tarih alanlarını Mongoose Date ile eziyoruz
export interface IPlanDocument extends Omit<IPlan, '_id' | 'date' | 'endDate' | 'createdAt' | 'updatedAt'>, Document {
  date: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const planVeritabaniSemasi = new Schema<IPlanDocument>(
  {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, maxlength: 1000 },
    date: { type: Date, required: true },
    endDate: { type: Date },
    type: {
      type: String,
      enum: Object.values(PlanType),
      default: PlanType.REMINDER,
    },
    relatedCompanyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    relatedUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    isCompleted: { type: Boolean, default: false },
    color: { type: String, default: '#6366f1' },
  },
  {
    timestamps: true,
  }
);

// Tarih aralığı sorguları için index
planVeritabaniSemasi.index({ date: 1 });
planVeritabaniSemasi.index({ isCompleted: 1, date: 1 });

// Next.js Hot Reloading sırasında model güncellenmesini garanti altına almak için:
if (mongoose.models.Plan) {
  delete mongoose.models.Plan;
}

export const PlanModel = mongoose.model<IPlanDocument>('Plan', planVeritabaniSemasi);
