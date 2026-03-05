import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { ziyaretEklemeSemasi } from '@/features/modules/crm/visit/schema';
import { VisitModel } from '@/features/modules/crm/visit/schema/VisitModal';

// Populate işlemi için diğer modellerin bellekte derlenmiş olması ZORUNLUDUR
import '@/features/modules/crm/company/schema/CompanyModel';
import '@/features/modules/crm/users/schema/UserModel';
import '@/features/modules/crm/product/schema/ProductModel';

// 1. ZİYARETLERİ VE SATIŞLARI LİSTELEME (GET)
export async function GET() {
  try {
    await veritabaninaBaglan();

    // Mimarın Şovu: Tek bir sorguda 4 farklı tablodan veri birleştiriyoruz!
    const ziyaretler = await VisitModel.find()
      .populate('companyId') // Kurum bilgilerini getir
      .populate('userId')    // Doktor bilgilerini getir
      .populate('products.productId') // Satılan ürünlerin detaylarını getir (İç içe populate)
      .sort({ visitDate: -1, createdAt: -1 }); // En yeni ziyaret en üstte

    return NextResponse.json({ basarili: true, veri: ziyaretler }, { status: 200 });
  } catch (hata) {
    console.error('Ziyaretler getirilirken hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, ziyaretler getirilemedi.' },
      { status: 500 }
    );
  }
}

// 2. YENİ ZİYARET / SATIŞ EKLEME (POST)
export async function POST(istek: NextRequest) {
  try {
    await veritabaninaBaglan();

    const istekGovdesi = await istek.json();

    // Zod şemamız veriyi denetliyor (Ürünlerin adetleri, fiyatları vb. kurallara uygun mu?)
    const dogrulamaSonucu = ziyaretEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Geçersiz ziyaret verisi.', hatalar: dogrulamaSonucu.error.format() },
        { status: 400 }
      );
    }

    const yeniZiyaret = await VisitModel.create(dogrulamaSonucu.data);

    return NextResponse.json(
      { basarili: true, mesaj: 'Ziyaret başarıyla kaydedildi.', veri: yeniZiyaret },
      { status: 201 }
    );
  } catch (hata) {
    console.error('Ziyaret eklenirken hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, ziyaret kaydedilemedi.' },
      { status: 500 }
    );
  }
}