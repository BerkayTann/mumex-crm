import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { sirketEklemeSemasi } from '../../../features/modules/crm/company/schema';
import { CompanyModel } from '../../../features/modules/crm/company/schema/CompanyModel';
import { apiKimlikDogrula } from '@/core/api/apiAuthGuard';
import mongoose from 'mongoose';

// 1. KURUMLARI LİSTELEME (GET İsteği)
export async function GET() {
  try {
    const { kullanici, hata } = await apiKimlikDogrula();
    if (hata) return hata;

    await veritabaninaBaglan();

    const kullaniciId = new mongoose.Types.ObjectId(kullanici._id);
    const sirketler = await CompanyModel.find({ createdBy: kullaniciId }).sort({ createdAt: -1 });

    return NextResponse.json({ basarili: true, veri: sirketler }, { status: 200 });
  } catch (hata) {
    console.error('Kurumlar getirilirken hata oluştu:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, kurumlar getirilemedi.' },
      { status: 500 }
    );
  }
}

// 2. YENİ KURUM EKLEME (POST İsteği)
export async function POST(istek: NextRequest) {
  try {
    const { kullanici, hata } = await apiKimlikDogrula();
    if (hata) return hata;

    await veritabaninaBaglan();

    const istekGovdesi = await istek.json();
    const dogrulamaSonucu = sirketEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
      return NextResponse.json(
        {
          basarili: false,
          mesaj: 'Gönderilen veriler geçersiz.',
          hatalar: dogrulamaSonucu.error.format()
        },
        { status: 400 }
      );
    }

    const kullaniciId = new mongoose.Types.ObjectId(kullanici._id);
    const yeniSirket = await CompanyModel.create({
      ...dogrulamaSonucu.data,
      createdBy: kullaniciId,
    });

    return NextResponse.json(
      { basarili: true, mesaj: 'Kurum başarıyla eklendi.', veri: yeniSirket },
      { status: 201 }
    );
  } catch (hata) {
    console.error('Kurum eklenirken hata oluştu:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, kurum eklenemedi.' },
      { status: 500 }
    );
  }
}
