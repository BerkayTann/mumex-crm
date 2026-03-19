import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { ziyaretEklemeSemasi } from '@/features/modules/crm/visit/schema';
import { VisitModel } from '@/features/modules/crm/visit/schema/VisitModel';
import { apiKimlikDogrula } from '@/core/api/apiAuthGuard';
import mongoose from 'mongoose';

// Populate işlemi için diğer modellerin bellekte derlenmiş olması ZORUNLUDUR
import '@/features/modules/crm/company/schema/CompanyModel';
import '@/features/modules/crm/users/schema/UserModel';
import '@/features/modules/crm/product/schema/ProductModel';

// 1. ZİYARETLERİ VE SATIŞLARI LİSTELEME (GET)
export async function GET() {
  try {
    const { kullanici, hata } = await apiKimlikDogrula();
    if (hata) return hata;

    await veritabaninaBaglan();

    const kullaniciId = new mongoose.Types.ObjectId(kullanici._id);
    const ziyaretler = await VisitModel.find({ createdBy: kullaniciId })
      .populate('companyId')
      .populate('userId')
      .populate('products.productId')
      .sort({ visitDate: -1, createdAt: -1 });

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
    const { kullanici, hata } = await apiKimlikDogrula();
    if (hata) return hata;

    await veritabaninaBaglan();

    const istekGovdesi = await istek.json();
    const dogrulamaSonucu = ziyaretEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Geçersiz ziyaret verisi.', hatalar: dogrulamaSonucu.error.format() },
        { status: 400 }
      );
    }

    const kullaniciId = new mongoose.Types.ObjectId(kullanici._id);
    const yeniZiyaret = await VisitModel.create({
      ...dogrulamaSonucu.data,
      createdBy: kullaniciId,
    });

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
