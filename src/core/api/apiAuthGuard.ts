import { NextResponse } from "next/server";
import { aktifKullaniciyiGetir } from "@/features/auth/lib/server";
import type { IAuthSessionUser } from "@/features/auth/types/AuthTypes";

const yetkisizYanit = () =>
  NextResponse.json(
    { basarili: false, mesaj: "Bu işlem için giriş yapmanız gerekmektedir." },
    { status: 401 },
  );

export const apiKimlikDogrula = async (): Promise<
  | { kullanici: IAuthSessionUser; hata: null }
  | { kullanici: null; hata: NextResponse }
> => {
  const kullanici = await aktifKullaniciyiGetir();

  if (!kullanici) {
    return { kullanici: null, hata: yetkisizYanit() };
  }

  return { kullanici, hata: null };
};
