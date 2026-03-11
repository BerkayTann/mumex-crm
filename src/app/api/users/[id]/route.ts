import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { UserModel } from '@/features/modules/crm/users/schema/UserModel';
import { CompanyModel } from '@/features/modules/crm/company/schema/CompanyModel';
import { kisiEklemeSemasi } from '@/features/modules/crm/users/schema';
import { ildenBolgeGetir } from '@/core/constants/cities';
import mongoose from 'mongoose';

interface IRouteParams {
  params: Promise<{ id: string }>;
}

// 1. KİŞİ GÜNCELLEME (PUT) - find-or-create company mantığı
export async function PUT(istek: NextRequest, { params }: IRouteParams) {
  try {
    const { id } = await params;
    await veritabaninaBaglan();
    const istekGovdesi = await istek.json();
    const dogrulamaSonucu = kisiEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
      return NextResponse.json({ basarili: false, mesaj: 'Geçersiz veri.' }, { status: 400 });
    }

    const { sirketAdi, sirketTipi, sehir, ilce, ...kisiVerisi } = dogrulamaSonucu.data;

    const bolge = ildenBolgeGetir(sehir);

    let kurum = await CompanyModel.findOne({
      name: { $regex: new RegExp(`^${sirketAdi.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    });

    if (!kurum) {
      kurum = await CompanyModel.create({
        name: sirketAdi.trim(),
        type: sirketTipi,
        city: sehir,
        district: ilce || undefined,
        region: bolge || undefined,
        isActive: true,
      });
    }

    const guncellenenKisi = await UserModel.findByIdAndUpdate(
      id,
      { ...kisiVerisi, companyId: new mongoose.Types.ObjectId(String(kurum._id)) },
      { new: true }
    );
    if (!guncellenenKisi) return NextResponse.json({ basarili: false, mesaj: 'Kişi bulunamadı.' }, { status: 404 });

    return NextResponse.json({ basarili: true, veri: guncellenenKisi }, { status: 200 });
  } catch (hata) {
    return NextResponse.json({ basarili: false, mesaj: 'Güncelleme hatası.' }, { status: 500 });
  }
}

// 2. KİŞİ SİLME (DELETE)
export async function DELETE(istek: NextRequest, { params }: IRouteParams) {
  try {
    const { id } = await params;
    await veritabaninaBaglan();
    const silinenKisi = await UserModel.findByIdAndDelete(id);
    if (!silinenKisi) return NextResponse.json({ basarili: false, mesaj: 'Kişi bulunamadı.' }, { status: 404 });

    return NextResponse.json({ basarili: true, mesaj: 'Başarıyla silindi.' }, { status: 200 });
  } catch (hata) {
    return NextResponse.json({ basarili: false, mesaj: 'Silme hatası.' }, { status: 500 });
  }
}