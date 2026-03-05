import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { urunEklemeSemasi } from '@/features/modules/crm/product/schema';
import { ProductModel } from '@/features/modules/crm/product/schema/ProductModel';

// 1. ÜRÜNLERİ LİSTELEME (GET)
export async function GET() {
  try {
    await veritabaninaBaglan();
    
    // Tüm ürünleri en yeni en üstte olacak şekilde getiriyoruz
    const urunler = await ProductModel.find().sort({ createdAt: -1 });
    
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
    await veritabaninaBaglan();
    
    const istekGovdesi = await istek.json();
    
    // Zod şemamız (fiyat kuralı dahil) gelen veriyi denetliyor
    const dogrulamaSonucu = urunEklemeSemasi.safeParse(istekGovdesi);
    
    if (!dogrulamaSonucu.success) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Geçersiz ürün verisi.', hatalar: dogrulamaSonucu.error.format() },
        { status: 400 }
      );
    }
    
    const yeniUrun = await ProductModel.create(dogrulamaSonucu.data);
    
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