import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  oturumuSil,
  yanittanOturumCookieSil,
} from "@/features/auth/lib/session";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    await oturumuSil(token);

    const response = NextResponse.json({ basarili: true, mesaj: "Çıkış yapıldı." }, { status: 200 });
    yanittanOturumCookieSil(response);
    return response;
  } catch (error) {
    console.error("Çıkış yapılırken hata oluştu:", error);
    return NextResponse.json(
      { basarili: false, mesaj: "Çıkış yapılırken bir hata oluştu." },
      { status: 500 },
    );
  }
}

