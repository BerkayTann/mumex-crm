import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { kisiEklemeSemasi } from '@/features/modules/crm/users/schema';
import { UserModel } from '@/features/modules/crm/users/schema/UserModel';
// Şirket modelini de import ediyoruz çünkü 'populate' işlemi için modelin kayıtlı olması gerekir
import { CompanyModel } from '@/features/modules/crm/company/schema/CompanyModel';

// 1. KİŞİLERİ LİSTELEME (GET)
export async function GET() {
  try {
    await veritabaninaBaglan();

    // Verileri çekerken .populate('companyId') diyoruz.
    // Bu sayede companyId alanında sadece "ID" değil, o şirketin tüm bilgileri gelecek.
    const kisiler = await UserModel.find()
      .populate('companyId') 
      .sort({ createdAt: -1 });

    return NextResponse.json({ basarili: true, veri: kisiler }, { status: 200 });
  } catch (hata) {
    console.error('Kişiler getirilirken hata oluştu:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, kişiler getirilemedi.' },
      { status: 500 }
    );
  }
}

// 2. YENİ KİŞİ EKLEME (POST)
export async function POST(istek: NextRequest) {
  try {
    await veritabaninaBaglan();

    const istekGovdesi = await istek.json();

    // Zod ile gelen veriyi doğruluyoruz
    const dogrulamaSonucu = kisiEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
      return NextResponse.json(
        { 
          basarili: false, 
          mesaj: 'Veriler geçersiz.', 
          hatalar: dogrulamaSonucu.error.format() 
        },
        { status: 400 }
      );
    }

    // Veritabanına kaydetme işlemi
    const yeniKisi = await UserModel.create(dogrulamaSonucu.data);

    return NextResponse.json(
      { basarili: true, mesaj: 'Kişi başarıyla kaydedildi.', veri: yeniKisi },
      { status: 201 }
    );
  } catch (hata) {
    console.error('Kişi eklenirken hata oluştu:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, kişi kaydedilemedi.' },
      { status: 500 }
    );
  }
}