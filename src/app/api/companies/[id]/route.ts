import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { CompanyModel } from '@/features/modules/crm/company/schema/CompanyModel';
import { sirketEklemeSemasi } from '@/features/modules/crm/company/schema';
import { apiKimlikDogrula } from '@/core/api/apiAuthGuard';
import mongoose from 'mongoose';

interface IRouteParams {
  params: Promise<{
    id: string;
  }>;
}

// 1. KURUM GÜNCELLEME (PUT İsteği)
export async function PUT(istek: NextRequest, { params }: IRouteParams) {
  try {
    const { kullanici, hata } = await apiKimlikDogrula();
    if (hata) return hata;

    const { id } = await params;
    await veritabaninaBaglan();
    const istekGovdesi = await istek.json();

    const dogrulamaSonucu = sirketEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
        return NextResponse.json({ basarili: false, mesaj: 'Geçersiz veri.' }, { status: 400 });
    }

    const kullaniciId = new mongoose.Types.ObjectId(kullanici._id);
    const guncellenenSirket = await CompanyModel.findOneAndUpdate(
      { _id: id, createdBy: kullaniciId },
      dogrulamaSonucu.data,
      { new: true }
    );

    if (!guncellenenSirket) {
      return NextResponse.json({ basarili: false, mesaj: 'Kurum bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({ basarili: true, mesaj: 'Kurum güncellendi.', veri: guncellenenSirket }, { status: 200 });
  } catch (hata) {
    console.error('Şirket güncelleme hatası:', hata);
    return NextResponse.json({ basarili: false, mesaj: 'Güncelleme hatası.' }, { status: 500 });
  }
}

// 2. KURUM SİLME (DELETE İsteği)
export async function DELETE(istek: NextRequest, { params }: IRouteParams) {
  try {
    const { kullanici, hata } = await apiKimlikDogrula();
    if (hata) return hata;

    const { id } = await params;
    await veritabaninaBaglan();

    const kullaniciId = new mongoose.Types.ObjectId(kullanici._id);
    const silinenSirket = await CompanyModel.findOneAndDelete({ _id: id, createdBy: kullaniciId });

    if (!silinenSirket) {
      return NextResponse.json({ basarili: false, mesaj: 'Kurum bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({ basarili: true, mesaj: 'Kurum başarıyla silindi.' }, { status: 200 });
  } catch (hata) {
    console.error('Şirket silme hatası:', hata);
    return NextResponse.json({ basarili: false, mesaj: 'Silme hatası.' }, { status: 500 });
  }
}
