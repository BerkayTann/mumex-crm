import mongoose, { Document, Model, Schema } from "mongoose";
import { AuthRole } from "../types/AuthTypes";

export interface IAuthUserDocument extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle: string;
  dailyCiroTarget: number;
  weeklyCiroTarget: number;
  monthlyCiroTarget: number;
  role: AuthRole;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const authUserSchema = new Schema<IAuthUserDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    company: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    dailyCiroTarget: { type: Number, min: 0, default: 0 },
    weeklyCiroTarget: { type: Number, min: 0, default: 0 },
    monthlyCiroTarget: { type: Number, min: 0, default: 0 },
    role: {
      type: String,
      enum: ["ADMIN", "USER"] satisfies AuthRole[],
      default: "USER",
      required: true,
    },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const mevcutModel = mongoose.models.AuthUser as Model<IAuthUserDocument> | undefined;

// Dev hot-reload sirasinda eski schema cache'i yeni hedef alanlarini tasimayabilir.
if (
  mevcutModel &&
  (!mevcutModel.schema.path("dailyCiroTarget") ||
    !mevcutModel.schema.path("weeklyCiroTarget") ||
    !mevcutModel.schema.path("monthlyCiroTarget"))
) {
  mongoose.deleteModel("AuthUser");
}

export const AuthUserModel =
  (mongoose.models.AuthUser as Model<IAuthUserDocument> | undefined) ||
  mongoose.model<IAuthUserDocument>("AuthUser", authUserSchema);
