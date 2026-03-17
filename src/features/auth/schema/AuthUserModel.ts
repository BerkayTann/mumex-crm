import mongoose, { Document, Schema } from "mongoose";
import { AuthRole } from "../types/AuthTypes";

export interface IAuthUserDocument extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle: string;
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

export const AuthUserModel =
  mongoose.models.AuthUser || mongoose.model<IAuthUserDocument>("AuthUser", authUserSchema);
