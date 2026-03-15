import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { kisiEklemeSemasi } from '@/features/modules/crm/users/schema';
import { UserModel } from '@/features/modules/crm/users/schema/UserModel';
import { CompanyModel } from '@/features/modules/crm/company/schema/CompanyModel';
import { ildenBolgeGetir } from '@/core/constants/cities';
import mongoose from 'mongoose';

// 1. KİŞİLERİ LİSTELEME (GET) - Aggregation ile segment (A/B/C) dahil
export async function GET() {
  try {
    await veritabaninaBaglan();

    const kisiler = await UserModel.aggregate([
      {
        $lookup: {
          from: 'visits',
          localField: '_id',
          foreignField: 'userId',
          as: 'ziyaretler',
        },
      },
      {
        $addFields: {
          toplamCiro: { $sum: '$ziyaretler.totalAmount' },
        },
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'companyData',
        },
      },
      {
        $addFields: {
          companyId: { $arrayElemAt: ['$companyData', 0] },
        },
      },
      {
        $project: { ziyaretler: 0, companyData: 0 },
      },
      { $sort: { createdAt: -1 } },
    ]);

    // ABC Katkı Payı Analizi:
    // A → Toplam cironun ilk %70'ini oluşturanlar ("garantili alıcılar")
    // B → %70-%90 arası ("gelişmekte")
    // C → Kalan + sıfır ciro ("potansiyel / geliştirilmeli")
    const satisYapanlar = (kisiler as any[])
      .filter((k) => k.toplamCiro > 0)
      .sort((a, b) => b.toplamCiro - a.toplamCiro);

    const genelToplam: number = satisYapanlar.reduce((s, k) => s + k.toplamCiro, 0);
    let kumulatif = 0;

    satisYapanlar.forEach((kisi) => {
      kumulatif += kisi.toplamCiro;
      const oran = genelToplam > 0 ? kumulatif / genelToplam : 1;
      kisi.segment = oran <= 0.70 ? 'A' : oran <= 0.90 ? 'B' : 'C';
    });

    (kisiler as any[]).filter((k) => k.toplamCiro === 0).forEach((k) => {
      k.segment = 'C';
    });

    (kisiler as any[]).forEach((k) => delete k.toplamCiro);

    return NextResponse.json({ basarili: true, veri: kisiler }, { status: 200 });
  } catch (hata) {
    console.error('Kişiler getirilirken hata oluştu:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, kişiler getirilemedi.' },
      { status: 500 },
    );
  }
}

// 2. YENİ KİŞİ EKLEME (POST) - find-or-create company mantığı
export async function POST(istek: NextRequest) {
  try {
    await veritabaninaBaglan();

    const istekGovdesi = await istek.json();

    const dogrulamaSonucu = kisiEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
      return NextResponse.json(
        {
          basarili: false,
          mesaj: 'Veriler geçersiz.',
          hatalar: dogrulamaSonucu.error.format(),
        },
        { status: 400 },
      );
    }

    const { sirketAdi, sirketTipi, sehir, ilce, sirketAdresi, forceNewCompany = false, ...kisiVerisi } =
      dogrulamaSonucu.data;

    // Aynı isimli kurum varsa bağla, yoksa oluştur
    const bolge = ildenBolgeGetir(sehir);
    const temizIsim = sirketAdi.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameRegex = new RegExp(`^${temizIsim}$`, 'i');
    const benzerKurumlar = await CompanyModel.find({ name: { $regex: nameRegex } });

    let kurum = null;
    let hataNedeni: 'DUPLICATE_COMPANY_DIFFERENT_CITY' | 'DUPLICATE_COMPANY_DIFFERENT_ADDRESS' | null = null;

    if (sirketAdresi && sirketAdresi.trim()) {
      // ADRES BAZLI EŞLEŞME
      const ayniAdresteKurum = benzerKurumlar.find(
        (k) => (k.address || '').toLowerCase().trim() === sirketAdresi.toLowerCase().trim(),
      );
      kurum = ayniAdresteKurum || null;

      if (!kurum && benzerKurumlar.length > 0 && !forceNewCompany) {
        hataNedeni = 'DUPLICATE_COMPANY_DIFFERENT_ADDRESS';
      }
    } else {
      // ŞEHİR BAZLI EŞLEŞME (mevcut davranış)
      const ayniSehirdeKurum = benzerKurumlar.find(
        (k) => k.city?.toLowerCase().trim() === sehir.toLowerCase().trim(),
      );
      kurum = ayniSehirdeKurum || null;

      if (!kurum && benzerKurumlar.length > 0 && !forceNewCompany) {
        hataNedeni = 'DUPLICATE_COMPANY_DIFFERENT_CITY';
      }
    }

    // Aynı isim farklı konumdaysa, önce onay iste
    if (hataNedeni && !forceNewCompany) {
      return NextResponse.json(
        {
          basarili: false,
          mesaj:
            hataNedeni === 'DUPLICATE_COMPANY_DIFFERENT_ADDRESS'
              ? 'Bu isimdeki kurum farklı bir adreste zaten kayıtlı. Yeni kurum olarak oluşturmak ister misiniz?'
              : 'Bu isimdeki kurum farklı bir şehirde zaten kayıtlı. Yeni kurum olarak oluşturmak ister misiniz?',
          kod: hataNedeni,
          mevcutKayitlar: benzerKurumlar.map((k) => ({
            id: k._id,
            city: k.city,
            district: k.district,
            address: k.address,
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
        address: sirketAdresi || undefined,
        isActive: true,
      });
    }

    const yeniKisi = await UserModel.create({
      ...kisiVerisi,
      companyId: new mongoose.Types.ObjectId(String(kurum._id)),
    });

    return NextResponse.json(
      { basarili: true, mesaj: 'Kişi başarıyla kaydedildi.', veri: yeniKisi },
      { status: 201 },
    );
  } catch (hata) {
    console.error('Kişi eklenirken hata oluştu:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, kişi kaydedilemedi.' },
      { status: 500 },
    );
  }
}
