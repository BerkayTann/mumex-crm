import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { CompanyModel } from '@/features/modules/crm/company/schema/CompanyModel';
import { sirketEklemeSemasi } from '@/features/modules/crm/company/schema';

// URL'den gelen parametrenin tipini belirliyoruz
interface IRouteParams {
  params: {
    id: string;
  };
}

// 1. KURUM GÜNCELLEME (PUT İsteği)
export async function PUT(istek: NextRequest, { params }: IRouteParams) {
  try {
    await veritabaninaBaglan();
    const istekGovdesi = await istek.json();

    // Zod ile gelen güncel veriyi doğruluyoruz
    const dogrulamaSonucu = sirketEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
        return NextResponse.json({ basarili: false, mesaj: 'Geçersiz veri.' }, { status: 400 });
    }

    // Veritabanında o ID'ye sahip kurumu bul ve yeni veriyle değiştir (Güncelle)
    const guncellenenSirket = await CompanyModel.findByIdAndUpdate(
      params.id, 
      dogrulamaSonucu.data, 
      { new: true } // new: true -> Güncellenmiş yeni veriyi geri döndürür
    );

    if (!guncellenenSirket) {
      return NextResponse.json({ basarili: false, mesaj: 'Kurum bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({ basarili: true, mesaj: 'Kurum güncellendi.', veri: guncellenenSirket }, { status: 200 });
  } catch (hata) {
    return NextResponse.json({ basarili: false, mesaj: 'Güncelleme hatası.' }, { status: 500 });
  }
}

// 2. KURUM SİLME (DELETE İsteği)
export async function DELETE(istek: NextRequest, { params }: IRouteParams) {
  try {
    await veritabaninaBaglan();

    // Veritabanından silme işlemi
    const silinenSirket = await CompanyModel.findByIdAndDelete(params.id);

    if (!silinenSirket) {
      return NextResponse.json({ basarili: false, mesaj: 'Kurum bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({ basarili: true, mesaj: 'Kurum başarıyla silindi.' }, { status: 200 });
  } catch (hata) {
    return NextResponse.json({ basarili: false, mesaj: 'Silme hatası.' }, { status: 500 });
  }
}