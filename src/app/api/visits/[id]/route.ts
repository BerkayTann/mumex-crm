import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { ziyaretEklemeSemasi } from '@/features/modules/crm/visit/schema';
import { VisitModel } from '@/features/modules/crm/visit/schema/VisitModel';

import '@/features/modules/crm/company/schema/CompanyModel';
import '@/features/modules/crm/users/schema/UserModel';
import '@/features/modules/crm/product/schema/ProductModel';

// DELETE /api/visits/[id]
export async function DELETE(
  _istek: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await veritabaninaBaglan();
    const { id } = await params;
    const silinen = await VisitModel.findByIdAndDelete(id);

    if (!silinen) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Ziyaret bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ basarili: true, mesaj: 'Ziyaret silindi.' }, { status: 200 });
  } catch (hata) {
    console.error('Ziyaret silinirken hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası.' },
      { status: 500 }
    );
  }
}

// PUT /api/visits/[id]
export async function PUT(
  istek: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await veritabaninaBaglan();
    const { id } = await params;
    const govde = await istek.json();

    const dogrulama = ziyaretEklemeSemasi.safeParse(govde);
    if (!dogrulama.success) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Geçersiz veri.', hatalar: dogrulama.error.format() },
        { status: 400 }
      );
    }

    const guncellenen = await VisitModel.findByIdAndUpdate(id, dogrulama.data, { new: true })
      .populate('companyId')
      .populate('userId')
      .populate('products.productId');

    if (!guncellenen) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Ziyaret bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ basarili: true, veri: guncellenen }, { status: 200 });
  } catch (hata) {
    console.error('Ziyaret güncellenirken hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası.' },
      { status: 500 }
    );
  }
}
