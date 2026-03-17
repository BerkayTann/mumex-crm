import { NextRequest, NextResponse } from "next/server";
import { veritabaninaBaglan } from "@/lib/dbConnect";
import { kayitOlSemasi } from "@/features/auth/schema/AuthSchema";
import { AuthUserModel } from "@/features/auth/schema/AuthUserModel";
import { parolaHashle } from "@/features/auth/lib/password";
import {
  emailiNormalizeEt,
  kullaniciAdiniNormalizeEt,
  varsayilanAdminiGarantiEt,
} from "@/features/auth/lib/server";
import { oturumUret, yanitaOturumCookieEkle } from "@/features/auth/lib/session";

export async function POST(request: NextRequest) {
  try {
    await varsayilanAdminiGarantiEt();
    await veritabaninaBaglan();

    const body = await request.json();
    const parsed = kayitOlSemasi.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          basarili: false,
          mesaj: "Kayıt verileri geçersiz.",
          hatalar: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const username = kullaniciAdiniNormalizeEt(parsed.data.username);
    const email = emailiNormalizeEt(parsed.data.email);
    const phone = parsed.data.phone?.trim() || undefined;

    const [usernameExists, emailExists] = await Promise.all([
      AuthUserModel.exists({ username }),
      AuthUserModel.exists({ email }),
    ]);

    if (usernameExists) {
      return NextResponse.json(
        { basarili: false, mesaj: "Bu kullanıcı adı zaten kullanılıyor." },
        { status: 409 },
      );
    }

    if (emailExists) {
      return NextResponse.json(
        { basarili: false, mesaj: "Bu e-posta ile kayıtlı bir kullanıcı zaten var." },
        { status: 409 },
      );
    }

    const yeniKullanici = await AuthUserModel.create({
      ...parsed.data,
      username,
      email,
      phone,
      role: "USER",
      passwordHash: parolaHashle(parsed.data.password),
    });

    const { token, expiresAt } = await oturumUret(yeniKullanici._id.toString());

    const response = NextResponse.json(
      {
        basarili: true,
        mesaj: "Kayıt başarılı.",
        veri: {
          _id: yeniKullanici._id.toString(),
          username: yeniKullanici.username,
        },
      },
      { status: 201 },
    );

    yanitaOturumCookieEkle(response, token, expiresAt);
    return response;
  } catch (error) {
    console.error("Kayıt olunurken hata oluştu:", error);
    return NextResponse.json(
      { basarili: false, mesaj: "Sunucu hatası nedeniyle kayıt oluşturulamadı." },
      { status: 500 },
    );
  }
}
