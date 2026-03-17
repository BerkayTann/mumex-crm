import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAuthSessionDocument extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const authSessionSchema = new Schema<IAuthSessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "AuthUser", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  {
    timestamps: true,
  },
);

export const AuthSessionModel =
  mongoose.models.AuthSession ||
  mongoose.model<IAuthSessionDocument>("AuthSession", authSessionSchema);

