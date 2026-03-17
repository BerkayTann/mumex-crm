import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { UserModel } from '@/features/modules/crm/users/schema/UserModel';
import { VisitModel } from '@/features/modules/crm/visit/schema/VisitModel';

import '@/features/modules/crm/company/schema/CompanyModel';
import '@/features/modules/crm/product/schema/ProductModel';

interface IRouteParams {
  params: Promise<{ id: string }>;
}

type IPopulatedVisitProduct = {
  quantity: number;
  totalPrice: number;
  productId?: { name?: string } | string | null;
};

export async function GET(_istek: NextRequest, { params }: IRouteParams) {
  const { id } = await params;

  try {
    await veritabaninaBaglan();

    const doktorBilgisi = await UserModel.findById(id).populate('companyId').lean();

    if (!doktorBilgisi) {
      return NextResponse.json({ basarili: false, mesaj: 'Doktor bulunamadı.' }, { status: 404 });
    }

    const satisGecmisi = await VisitModel.find({ userId: id })
      .populate('products.productId')
      .sort({ visitDate: -1 })
      .lean();

    let toplamCiro = 0;
    let toplamUrunAdedi = 0;
    const urunBazliSatislar: Record<string, { ad: string; adet: number; ciro: number }> = {};

    satisGecmisi.forEach((ziyaret) => {
      toplamCiro += ziyaret.totalAmount;

      const ziyaretUrunleri = ziyaret.products as IPopulatedVisitProduct[];

      ziyaretUrunleri.forEach((urun) => {
        toplamUrunAdedi += urun.quantity;

        const urunAdi =
          urun.productId && typeof urun.productId === 'object' && 'name' in urun.productId
            ? urun.productId.name || 'Bilinmeyen Ürün'
            : 'Bilinmeyen Ürün';

        if (!urunBazliSatislar[urunAdi]) {
          urunBazliSatislar[urunAdi] = { ad: urunAdi, adet: 0, ciro: 0 };
        }

        urunBazliSatislar[urunAdi].adet += urun.quantity;
        urunBazliSatislar[urunAdi].ciro += urun.totalPrice;
      });
    });

    let segment = 'C Sınıfı (Potansiyel)';
    if (toplamCiro > 50000) segment = 'A Sınıfı (VIP / Öncelikli)';
    else if (toplamCiro > 10000) segment = 'B Sınıfı (Düzenli)';

    const profilVerisi = {
      doktor: doktorBilgisi,
      analiz: {
        toplamCiro,
        toplamZiyaret: satisGecmisi.length,
        toplamUrunAdedi,
        segment,
        sonZiyaretTarihi: satisGecmisi.length > 0 ? satisGecmisi[0].visitDate : null,
        urunDagilimi: Object.values(urunBazliSatislar),
      },
      gecmisZiyaretler: satisGecmisi,
    };

    return NextResponse.json({ basarili: true, veri: profilVerisi }, { status: 200 });
  } catch (hata) {
    console.error('Profil çekilirken hata:', hata);
    return NextResponse.json({ basarili: false, mesaj: 'Sunucu hatası.' }, { status: 500 });
  }
}
