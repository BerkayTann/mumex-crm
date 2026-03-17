import { createHash, randomBytes } from "node:crypto";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { veritabaninaBaglan } from "@/lib/dbConnect";
import { AuthSessionModel } from "../schema/AuthSessionModel";

export const AUTH_COOKIE_NAME = "mumex_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

export const oturumTokeniHashle = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export const oturumUret = async (userId: string | Types.ObjectId) => {
  await veritabaninaBaglan();

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await AuthSessionModel.create({
    userId,
    tokenHash: oturumTokeniHashle(token),
    expiresAt,
  });

  return { token, expiresAt };
};

export const yanitaOturumCookieEkle = (
  response: NextResponse,
  token: string,
  expiresAt: Date,
) => {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
};

export const yanittanOturumCookieSil = (response: NextResponse) => {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
};

export const oturumuSil = async (token?: string | null) => {
  if (!token) {
    return;
  }

  await veritabaninaBaglan();
  await AuthSessionModel.deleteOne({ tokenHash: oturumTokeniHashle(token) });
};

export const suresiDolmusOturumlariTemizle = async () => {
  await veritabaninaBaglan();
  await AuthSessionModel.deleteMany({ expiresAt: { $lte: new Date() } });
};

