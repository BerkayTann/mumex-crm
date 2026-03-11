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

    const { sirketAdi, sirketTipi, sehir, ilce, forceNewCompany = false, ...kisiVerisi } =
      dogrulamaSonucu.data;

    const bolge = ildenBolgeGetir(sehir);
    const temizIsim = sirketAdi.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameRegex = new RegExp(`^${temizIsim}$`, 'i');
    const benzerKurumlar = await CompanyModel.find({ name: { $regex: nameRegex } });

    const ayniSehirdeKurum = benzerKurumlar.find(
      (k) => k.city?.toLowerCase().trim() === sehir.toLowerCase().trim(),
    );

    let kurum = ayniSehirdeKurum;

    // Aynı isim farklı şehirdeyse, önce onay iste
    if (!kurum && benzerKurumlar.length > 0 && !forceNewCompany) {
      return NextResponse.json(
        {
          basarili: false,
          mesaj:
            'Bu isimdeki kurum farklı bir şehirde zaten kayıtlı. Yeni kurum olarak oluşturmak ister misiniz?',
          kod: 'DUPLICATE_COMPANY_DIFFERENT_CITY',
          mevcutKayitlar: benzerKurumlar.map((k) => ({
            id: k._id,
            city: k.city,
            district: k.district,
          })),
        },
        { status: 409 },
      );
    }

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
      { new: true },
    );
    if (!guncellenenKisi)
      return NextResponse.json({ basarili: false, mesaj: 'Kişi bulunamadı.' }, { status: 404 });

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
    if (!silinenKisi)
      return NextResponse.json({ basarili: false, mesaj: 'Kişi bulunamadı.' }, { status: 404 });

    return NextResponse.json({ basarili: true, mesaj: 'Başarıyla silindi.' }, { status: 200 });
  } catch (hata) {
    return NextResponse.json({ basarili: false, mesaj: 'Silme hatası.' }, { status: 500 });
  }
}
