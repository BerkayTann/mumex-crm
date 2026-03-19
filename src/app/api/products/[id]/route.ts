import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { urunEklemeSemasi } from '@/features/modules/crm/product/schema';
import { ProductModel } from '@/features/modules/crm/product/schema/ProductModel';
import { apiKimlikDogrula } from '@/core/api/apiAuthGuard';
import mongoose from 'mongoose';

// DELETE /api/products/[id]
export async function DELETE(
  _istek: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { kullanici, hata } = await apiKimlikDogrula();
    if (hata) return hata;

    await veritabaninaBaglan();
    const { id } = await params;

    const kullaniciId = new mongoose.Types.ObjectId(kullanici._id);
    const silinen = await ProductModel.findOneAndDelete({ _id: id, createdBy: kullaniciId });

    if (!silinen) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Ürün bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { basarili: true, mesaj: 'Ürün silindi.' },
      { status: 200 }
    );
  } catch (hata) {
    console.error('Ürün silinirken hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası.' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id]
export async function PUT(
  istek: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { kullanici, hata } = await apiKimlikDogrula();
    if (hata) return hata;

    await veritabaninaBaglan();
    const { id } = await params;
    const govde = await istek.json();

    const dogrulama = urunEklemeSemasi.partial().safeParse(govde);
    if (!dogrulama.success) {
      return NextResponse.json(
        {
          basarili: false,
          mesaj: 'Geçersiz veri.',
          hatalar: dogrulama.error.format(),
        },
        { status: 400 }
      );
    }

    const kullaniciId = new mongoose.Types.ObjectId(kullanici._id);
    const guncellenen = await ProductModel.findOneAndUpdate(
      { _id: id, createdBy: kullaniciId },
      dogrulama.data,
      { new: true }
    );

    if (!guncellenen) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Ürün bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { basarili: true, veri: guncellenen },
      { status: 200 }
    );
  } catch (hata) {
    console.error('Ürün güncellenirken hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası.' },
      { status: 500 }
    );
  }
}
