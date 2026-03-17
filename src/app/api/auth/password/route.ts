import { NextRequest, NextResponse } from "next/server";
import { veritabaninaBaglan } from "@/lib/dbConnect";
import { aktifKullaniciyiGetir } from "@/features/auth/lib/server";
import { parolaDogrula, parolaHashle } from "@/features/auth/lib/password";
import { sifreDegistirmeSemasi } from "@/features/auth/schema/AuthSchema";
import { AuthUserModel } from "@/features/auth/schema/AuthUserModel";

export async function PATCH(request: NextRequest) {
  try {
    const aktifKullanici = await aktifKullaniciyiGetir();

    if (!aktifKullanici) {
      return NextResponse.json(
        { basarili: false, mesaj: "Aktif oturum bulunamadı." },
        { status: 401 },
      );
    }

    await veritabaninaBaglan();

    const body = await request.json();
    const parsed = sifreDegistirmeSemasi.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          basarili: false,
          mesaj: "Şifre değiştirme verileri geçersiz.",
          hatalar: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const kullanici = await AuthUserModel.findById(aktifKullanici._id);

    if (!kullanici) {
      return NextResponse.json(
        { basarili: false, mesaj: "Kullanıcı bulunamadı." },
        { status: 404 },
      );
    }

    if (!parolaDogrula(parsed.data.currentPassword, kullanici.passwordHash)) {
      return NextResponse.json(
        { basarili: false, mesaj: "Mevcut şifre hatalı." },
        { status: 400 },
      );
    }

    if (parsed.data.currentPassword === parsed.data.newPassword) {
      return NextResponse.json(
        { basarili: false, mesaj: "Yeni şifre mevcut şifre ile aynı olamaz." },
        { status: 400 },
      );
    }

    kullanici.passwordHash = parolaHashle(parsed.data.newPassword);
    await kullanici.save();

    return NextResponse.json(
      { basarili: true, mesaj: "Şifreniz güncellendi." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Şifre değiştirilirken hata oluştu:", error);
    return NextResponse.json(
      { basarili: false, mesaj: "Şifre değiştirilemedi." },
      { status: 500 },
    );
  }
}

