import { redirect } from "next/navigation";
import { aktifKullaniciyiGetir } from "@/features/auth/lib/server";

export default async function RootPage() {
  const kullanici = await aktifKullaniciyiGetir();
  redirect(kullanici ? "/dashboard" : "/login");
}
