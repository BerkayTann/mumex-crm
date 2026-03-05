import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { UserModel } from '@/features/modules/crm/users/schema/UserModel';
import { kisiEklemeSemasi } from '@/features/modules/crm/users/schema';

interface IRouteParams {
  params: Promise<{ id: string }>;
}

// 1. KİŞİ GÜNCELLEME (PUT)
export async function PUT(istek: NextRequest, { params }: IRouteParams) {
  try {
    const { id } = await params;
    await veritabaninaBaglan();
    const istekGovdesi = await istek.json();
    const dogrulamaSonucu = kisiEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
      return NextResponse.json({ basarili: false, mesaj: 'Geçersiz veri.' }, { status: 400 });
    }

    const guncellenenKisi = await UserModel.findByIdAndUpdate(id, dogrulamaSonucu.data, { new: true });
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