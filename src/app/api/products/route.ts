import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { urunEklemeSemasi } from '@/features/modules/crm/product/schema';
import { ProductModel } from '@/features/modules/crm/product/schema/ProductModel';
import { apiKimlikDogrula } from '@/core/api/apiAuthGuard';
import mongoose from 'mongoose';

// 1. ÜRÜNLERİ LİSTELEME (GET)
export async function GET() {
  try {
    const { kullanici, hata } = await apiKimlikDogrula();
    if (hata) return hata;

    await veritabaninaBaglan();

    const kullaniciId = new mongoose.Types.ObjectId(kullanici._id);
    const urunler = await ProductModel.find({ createdBy: kullaniciId }).sort({ createdAt: -1 });

    return NextResponse.json({ basarili: true, veri: urunler }, { status: 200 });
  } catch (hata) {
    console.error('Ürünler getirilirken hata oluştu:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, ürünler getirilemedi.' },
      { status: 500 }
    );
  }
}

// 2. YENİ ÜRÜN EKLEME (POST)
export async function POST(istek: NextRequest) {
  try {
    const { kullanici, hata } = await apiKimlikDogrula();
    if (hata) return hata;

    await veritabaninaBaglan();

    const istekGovdesi = await istek.json();
    const dogrulamaSonucu = urunEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Geçersiz ürün verisi.', hatalar: dogrulamaSonucu.error.format() },
        { status: 400 }
      );
    }

    const kullaniciId = new mongoose.Types.ObjectId(kullanici._id);
    const yeniUrun = await ProductModel.create({
      ...dogrulamaSonucu.data,
      createdBy: kullaniciId,
    });

    return NextResponse.json(
      { basarili: true, mesaj: 'Ürün başarıyla eklendi.', veri: yeniUrun },
      { status: 201 }
    );
  } catch (hata) {
    console.error('Ürün eklenirken hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, ürün kaydedilemedi.' },
      { status: 500 }
    );
  }
}
