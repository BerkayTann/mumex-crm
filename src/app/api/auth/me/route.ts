import { NextResponse } from "next/server";
import { aktifKullaniciyiGetir } from "@/features/auth/lib/server";

export async function GET() {
  try {
    const kullanici = await aktifKullaniciyiGetir();

    if (!kullanici) {
      return NextResponse.json(
        { basarili: false, mesaj: "Aktif oturum bulunamadı." },
        { status: 401 },
      );
    }

    return NextResponse.json({ basarili: true, veri: kullanici }, { status: 200 });
  } catch (error) {
    console.error("Oturum bilgisi alınırken hata oluştu:", error);
    return NextResponse.json(
      { basarili: false, mesaj: "Oturum bilgisi alınamadı." },
      { status: 500 },
    );
  }
}

