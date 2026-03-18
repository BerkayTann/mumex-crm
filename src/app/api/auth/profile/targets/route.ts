import { NextRequest, NextResponse } from "next/server";
import { veritabaninaBaglan } from "@/lib/dbConnect";
import { ciroHedefleriGuncellemeSemasi } from "@/features/auth/schema/AuthSchema";
import { AuthUserModel } from "@/features/auth/schema/AuthUserModel";
import { aktifKullaniciyiGetir } from "@/features/auth/lib/server";

const guvenliAlanlar = {
  passwordHash: 0,
  __v: 0,
};

export async function PATCH(request: NextRequest) {
  try {
    const aktifKullanici = await aktifKullaniciyiGetir();

    if (!aktifKullanici) {
      return NextResponse.json(
        { basarili: false, mesaj: "Aktif oturum bulunamadi." },
        { status: 401 },
      );
    }

    await veritabaninaBaglan();

    const body = await request.json();
    const parsed = ciroHedefleriGuncellemeSemasi.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          basarili: false,
          mesaj: "Ciro hedefleri gecersiz.",
          hatalar: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const updatedUser = await AuthUserModel.findByIdAndUpdate(
      aktifKullanici._id,
      parsed.data,
      {
        new: true,
        runValidators: true,
        projection: guvenliAlanlar,
      },
    );

    if (!updatedUser) {
      return NextResponse.json(
        { basarili: false, mesaj: "Kullanici guncellenemedi." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        basarili: true,
        mesaj: "Ciro hedefleri guncellendi.",
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
    console.error("Ciro hedefleri guncellenirken hata olustu:", error);
    return NextResponse.json(
      { basarili: false, mesaj: "Ciro hedefleri guncellenemedi." },
      { status: 500 },
    );
  }
}
