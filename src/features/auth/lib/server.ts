import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { veritabaninaBaglan } from "@/lib/dbConnect";
import { IAuthSessionUser } from "../types/AuthTypes";
import { AuthUserModel, IAuthUserDocument } from "../schema/AuthUserModel";
import { AuthSessionModel } from "../schema/AuthSessionModel";
import { parolaHashle } from "./password";
import {
  AUTH_COOKIE_NAME,
  oturumTokeniHashle,
  suresiDolmusOturumlariTemizle,
} from "./session";

const varsayilanAdmin = {
  firstName: "Berkay",
  lastName: "Admin",
  username: "admin",
  email: "admin@mumex.local",
  phone: "+90 555 000 00 00",
  company: "Mumex",
  jobTitle: "Sistem Yöneticisi",
  role: "ADMIN" as const,
  password: "Berkay1997",
};

const kullaniciHaritala = (kullanici: IAuthUserDocument): IAuthSessionUser => {
  const fullName = `${kullanici.firstName} ${kullanici.lastName}`.trim();

  return {
    _id: kullanici._id.toString(),
    firstName: kullanici.firstName,
    lastName: kullanici.lastName,
    username: kullanici.username,
    email: kullanici.email,
    phone: kullanici.phone,
    company: kullanici.company,
    jobTitle: kullanici.jobTitle,
    role: kullanici.role,
    createdAt: kullanici.createdAt.toISOString(),
    updatedAt: kullanici.updatedAt.toISOString(),
    fullName,
    initials: `${kullanici.firstName[0] ?? ""}${kullanici.lastName[0] ?? ""}`.toUpperCase(),
  };
};

export const kullaniciAdiniNormalizeEt = (username: string) => username.trim().toLowerCase();
export const emailiNormalizeEt = (email: string) => email.trim().toLowerCase();

export const varsayilanAdminiGarantiEt = async () => {
  await veritabaninaBaglan();

  const adminVarMi = await AuthUserModel.exists({
    username: kullaniciAdiniNormalizeEt(varsayilanAdmin.username),
  });

  if (adminVarMi) {
    return;
  }

  const { password, ...adminVerisi } = varsayilanAdmin;

  await AuthUserModel.create({
    ...adminVerisi,
    username: kullaniciAdiniNormalizeEt(adminVerisi.username),
    email: emailiNormalizeEt(adminVerisi.email),
    passwordHash: parolaHashle(password),
  });
};

export const aktifKullaniciyiGetir = cache(async (): Promise<IAuthSessionUser | null> => {
  await varsayilanAdminiGarantiEt();
  await suresiDolmusOturumlariTemizle();

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  await veritabaninaBaglan();

  const session = await AuthSessionModel.findOne({
    tokenHash: oturumTokeniHashle(sessionToken),
    expiresAt: { $gt: new Date() },
  }).populate<{ userId: IAuthUserDocument }>("userId");

  if (!session || !session.userId) {
    return null;
  }

  return kullaniciHaritala(session.userId);
});

export const kimlikDogrulamaZorunlu = async () => {
  const kullanici = await aktifKullaniciyiGetir();

  if (!kullanici) {
    redirect("/login");
  }

  return kullanici;
};

export const girisYapmissaYonlendir = async () => {
  const kullanici = await aktifKullaniciyiGetir();

  if (kullanici) {
    redirect("/dashboard");
  }
};
