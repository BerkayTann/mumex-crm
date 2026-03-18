import { NextRequest, NextResponse } from "next/server";
import { veritabaninaBaglan } from "@/lib/dbConnect";
import { profilBilgileriGuncellemeSemasi } from "@/features/auth/schema/AuthSchema";
import { AuthUserModel } from "@/features/auth/schema/AuthUserModel";
import {
  aktifKullaniciyiGetir,
  emailiNormalizeEt,
  kullaniciAdiniNormalizeEt,
} from "@/features/auth/lib/server";

const guvenliAlanlar = {
  passwordHash: 0,
  __v: 0,
};

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
    console.error("Profil bilgisi alınırken hata oluştu:", error);
    return NextResponse.json(
      { basarili: false, mesaj: "Profil bilgisi alınamadı." },
      { status: 500 },
    );
  }
}

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
    const parsed = profilBilgileriGuncellemeSemasi.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          basarili: false,
          mesaj: "Profil verileri geçersiz.",
          hatalar: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const username = kullaniciAdiniNormalizeEt(parsed.data.username);
    const email = emailiNormalizeEt(parsed.data.email);
    const phone = parsed.data.phone?.trim() || undefined;

    const [usernameOwner, emailOwner] = await Promise.all([
      AuthUserModel.findOne({ username }, { _id: 1 }),
      AuthUserModel.findOne({ email }, { _id: 1 }),
    ]);

    if (usernameOwner && usernameOwner._id.toString() !== aktifKullanici._id) {
      return NextResponse.json(
        { basarili: false, mesaj: "Bu kullanıcı adı başka bir hesaba ait." },
        { status: 409 },
      );
    }

    if (emailOwner && emailOwner._id.toString() !== aktifKullanici._id) {
      return NextResponse.json(
        { basarili: false, mesaj: "Bu e-posta başka bir hesaba ait." },
        { status: 409 },
      );
    }

    const updatedUser = await AuthUserModel.findByIdAndUpdate(
      aktifKullanici._id,
      {
        ...parsed.data,
        username,
        email,
        phone,
      },
      {
        new: true,
        runValidators: true,
        projection: guvenliAlanlar,
      },
    );

    if (!updatedUser) {
      return NextResponse.json(
        { basarili: false, mesaj: "Kullanıcı güncellenemedi." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        basarili: true,
        mesaj: "Profil güncellendi.",
        veri: {
          _id: updatedUser._id.toString(),
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          username: updatedUser.username,
          email: updatedUser.email,
          phone: updatedUser.phone,
          company: updatedUser.company,
          jobTitle: updatedUser.jobTitle,
          dailyCiroTarget: updatedUser.dailyCiroTarget ?? 0,
          weeklyCiroTarget: updatedUser.weeklyCiroTarget ?? 0,
          monthlyCiroTarget: updatedUser.monthlyCiroTarget ?? 0,
          role: updatedUser.role,
          createdAt: updatedUser.createdAt.toISOString(),
          updatedAt: updatedUser.updatedAt.toISOString(),
          fullName: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
          initials: `${updatedUser.firstName[0] ?? ""}${updatedUser.lastName[0] ?? ""}`.toUpperCase(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profil güncellenirken hata oluştu:", error);
    return NextResponse.json(
      { basarili: false, mesaj: "Profil güncellenemedi." },
      { status: 500 },
    );
  }
}
