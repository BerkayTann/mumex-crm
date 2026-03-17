import { NextRequest, NextResponse } from "next/server";
import { veritabaninaBaglan } from "@/lib/dbConnect";
import { girisSemasi } from "@/features/auth/schema/AuthSchema";
import { AuthUserModel } from "@/features/auth/schema/AuthUserModel";
import { parolaDogrula } from "@/features/auth/lib/password";
import { kullaniciAdiniNormalizeEt, varsayilanAdminiGarantiEt } from "@/features/auth/lib/server";
import { oturumUret, yanitaOturumCookieEkle } from "@/features/auth/lib/session";

export async function POST(request: NextRequest) {
  try {
    await varsayilanAdminiGarantiEt();
    await veritabaninaBaglan();

    const body = await request.json();
    const parsed = girisSemasi.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          basarili: false,
          mesaj: "Giriş bilgileri geçersiz.",
          hatalar: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const username = kullaniciAdiniNormalizeEt(parsed.data.username);

    const kullanici = await AuthUserModel.findOne({ username });

    if (!kullanici || !parolaDogrula(parsed.data.password, kullanici.passwordHash)) {
      return NextResponse.json(
        { basarili: false, mesaj: "Kullanıcı adı veya parola hatalı." },
        { status: 401 },
      );
    }

    const { token, expiresAt } = await oturumUret(kullanici._id.toString());

    const response = NextResponse.json(
      {
        basarili: true,
        mesaj: "Giriş başarılı.",
        veri: {
          _id: kullanici._id.toString(),
          username: kullanici.username,
        },
      },
      { status: 200 },
    );

    yanitaOturumCookieEkle(response, token, expiresAt);
    return response;
  } catch (error) {
    console.error("Giriş yapılırken hata oluştu:", error);
    return NextResponse.json(
      { basarili: false, mesaj: "Sunucu hatası nedeniyle giriş yapılamadı." },
      { status: 500 },
    );
  }
}

