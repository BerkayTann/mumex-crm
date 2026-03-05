import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { UserModel } from '@/features/modules/crm/users/schema/UserModel';
import { VisitModel } from '@/features/modules/crm/visit/schema/VisitModel';

// Populate için gerekli modeller
import '@/features/modules/crm/company/schema/CompanyModel';
import '@/features/modules/crm/product/schema/ProductModel';

interface IRouteParams { params: Promise<{ id: string }> }

export async function GET(istek: NextRequest, { params }: IRouteParams) {
  const { id } = await params;
  try {
    await veritabaninaBaglan();

    // 1. Doktorun Kişisel ve Kurum (Lokasyon) Bilgilerini Çek
    const doktorBilgisi = await UserModel.findById(id)
      .populate('companyId')
      .lean(); // lean() veriyi saf JSON objesine çevirir, daha hızlıdır.

    if (!doktorBilgisi) {
      return NextResponse.json({ basarili: false, mesaj: 'Doktor bulunamadı.' }, { status: 404 });
    }

    // 2. Bu Doktora Yapılan TÜM Ziyaretleri ve Satışları Çek
    const satisGecmisi = await VisitModel.find({ userId: id })
      .populate('products.productId')
      .sort({ visitDate: -1 }) // En yeniden en eskiye
      .lean();

    // 3. Verileri Mümessil İçin Analiz Et (Aggregation)
    let toplamCiro = 0;
    let toplamUrunAdedi = 0;
    const urunBazliSatislar: Record<string, { ad: string, adet: number, ciro: number }> = {};

    satisGecmisi.forEach((ziyaret) => {
      toplamCiro += ziyaret.totalAmount;
      
      ziyaret.products.forEach((p: { quantity: number; productId?: { name: string }; totalPrice: number }) => {
        toplamUrunAdedi += p.quantity;
        const urunAdi = p.productId?.name || 'Bilinmeyen Ürün';
        
        if (!urunBazliSatislar[urunAdi]) {
          urunBazliSatislar[urunAdi] = { ad: urunAdi, adet: 0, ciro: 0 };
        }
        urunBazliSatislar[urunAdi].adet += p.quantity;
        urunBazliSatislar[urunAdi].ciro += p.totalPrice;
      });
    });

    // Müşteri Segmentasyonu (Önceliklendirme Mantığı)
    // Örn: Toplam cirosu 50.000 TL üzeriyse "A Sınıfı (Öncelikli)", 10.000 üzeriyse "B Sınıfı" vb.
    let segment = 'C Sınıfı (Potansiyel)';
    if (toplamCiro > 50000) segment = 'A Sınıfı (VIP / Öncelikli)';
    else if (toplamCiro > 10000) segment = 'B Sınıfı (Düzenli)';

    // Tüm analizleri paketleyip Frontend'e gönderiyoruz
    const profilVerisi = {
      doktor: doktorBilgisi,
      analiz: {
        toplamCiro,
        toplamZiyaret: satisGecmisi.length,
        toplamUrunAdedi,
        segment,
        sonZiyaretTarihi: satisGecmisi.length > 0 ? satisGecmisi[0].visitDate : null,
        urunDagilimi: Object.values(urunBazliSatislar) // Array'e çeviriyoruz
      },
      gecmisZiyaretler: satisGecmisi // Detaylı liste için (Ne zaman ne alınmış?)
    };

    return NextResponse.json({ basarili: true, veri: profilVerisi }, { status: 200 });

  } catch (hata) {
    console.error('Profil çekilirken hata:', hata);
    return NextResponse.json({ basarili: false, mesaj: 'Sunucu hatası.' }, { status: 500 });
  }
}