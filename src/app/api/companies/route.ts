import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
// Zod şemasını ve Mongoose modelini doğrudan kendi dosyalarından alıyoruz
import { sirketEklemeSemasi } from '../../../features/modules/crm/company/schema';
import { CompanyModel } from '../../../features/modules/crm/company/schema/CompanyModel';

// 1. KURUMLARI LİSTELEME (GET İsteği)
export async function GET() {
  try {
    // Önce veritabanına bağlanıyoruz
    await veritabaninaBaglan();

    // Veritabanındaki tüm kurumları en yeni eklenen en üstte olacak şekilde getiriyoruz
    const sirketler = await CompanyModel.find().sort({ createdAt: -1 });

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
    await veritabaninaBaglan();

    // İstek gövdesini (body) JSON olarak alıyoruz
    const istekGovdesi = await istek.json();

    // Gelen veriyi Zod şemamız ile doğruluyoruz (Validation)
    // safeParse hata fırlatmaz, sonucu bir nesne olarak döner. Bu sayede try-catch patlamaz.
    const dogrulamaSonucu = sirketEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
      // Eğer Zod kurallarına uymazsa (örn: isim 3 karakterden kısaysa), 400 Bad Request dönüyoruz
      return NextResponse.json(
        { 
          basarili: false, 
          mesaj: 'Gönderilen veriler geçersiz.', 
          hatalar: dogrulamaSonucu.error.format() 
        },
        { status: 400 }
      );
    }

    // Doğrulamadan geçen tertemiz veri ile veritabanında yeni kayıt oluşturuyoruz
    const yeniSirket = await CompanyModel.create(dogrulamaSonucu.data);

    return NextResponse.json(
      { basarili: true, mesaj: 'Kurum başarıyla eklendi.', veri: yeniSirket },
      { status: 201 } // 201 Created (Oluşturuldu) durum kodu
    );
  } catch (hata) {
    console.error('Kurum eklenirken hata oluştu:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, kurum eklenemedi.' },
      { status: 500 }
    );
  }
}