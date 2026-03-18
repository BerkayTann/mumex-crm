import { NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { ProductModel } from '@/features/modules/crm/product/schema/ProductModel';
import { VisitModel } from '@/features/modules/crm/visit/schema/VisitModel';
import { IEnvanterKalemi, IEnvanterOzet } from '@/features/modules/crm/inventory/types';
import { VisitStatus } from '@/features/modules/crm/visit/types';

export async function GET() {
  try {
    await veritabaninaBaglan();

    // VisitModel'i kayıtlı olduğundan emin olmak için referans et
    void VisitModel;

    const pipeline = [
      // 1. Sadece aktif ürünleri al
      { $match: { isActive: true } },

      // 2. COMPLETED ziyaretlerden bu ürüne ait satış toplamını çek
      {
        $lookup: {
          from: 'visits',
          let: { pid: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$status', VisitStatus.COMPLETED] },
                    { $in: ['$$pid', '$products.productId'] },
                  ],
                },
              },
            },
            { $unwind: '$products' },
            {
              $match: {
                $expr: { $eq: ['$products.productId', '$$pid'] },
              },
            },
            {
              $group: {
                _id: null,
                toplamSatis: { $sum: '$products.quantity' },
              },
            },
          ],
          as: 'satisVerisi',
        },
      },

      // 3. Türetilmiş alanları hesapla
      {
        $addFields: {
          satisAdedi: {
            $ifNull: [{ $arrayElemAt: ['$satisVerisi.toplamSatis', 0] }, 0],
          },
          birimFiyatTRY: { $ifNull: ['$priceInTRY', '$price'] },
          // Mevcut ürünlerde quantity alanı olmayabilir → 0 olarak kabul et
          gercekMiktar: { $ifNull: ['$quantity', 0] },
        },
      },
      {
        $addFields: {
          kalanStok: { $max: [{ $subtract: ['$gercekMiktar', '$satisAdedi'] }, 0] },
        },
      },
      {
        $addFields: {
          stokDegeri: { $multiply: ['$kalanStok', '$birimFiyatTRY'] },
          satirToplam: { $multiply: ['$satisAdedi', '$birimFiyatTRY'] },
        },
      },

      // 4. Çıktı alanlarını şekillendir
      {
        $project: {
          _id: 0,
          productId: { $toString: '$_id' },
          urunAdi: '$name',
          kategori: '$category',
          baslangicStok: '$gercekMiktar',
          satisAdedi: 1,
          kalanStok: 1,
          birimFiyatTRY: 1,
          stokDegeri: 1,
          satirToplam: 1,
          isActive: 1,
        },
      },

      // 5. Ürün adına göre sırala
      { $sort: { urunAdi: 1 as const } },
    ];

    const kalemler = await ProductModel.aggregate<IEnvanterKalemi>(pipeline);

    // Özet istatistikler JS'de hesaplanır
    const ozet: IEnvanterOzet = kalemler.reduce(
      (acc, kalem) => {
        acc.toplamUrunSayisi += 1;
        acc.toplamKalanStok += kalem.kalanStok;
        acc.toplamStokDegeri += kalem.stokDegeri;
        acc.toplamSatisDegeri += kalem.satirToplam;
        return acc;
      },
      {
        toplamUrunSayisi: 0,
        toplamKalanStok: 0,
        toplamStokDegeri: 0,
        toplamSatisDegeri: 0,
      } as IEnvanterOzet,
    );

    return NextResponse.json({ basarili: true, veri: { kalemler, ozet } });
  } catch (hata) {
    console.error('[GET /api/inventory] Hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Envanter verileri alınırken bir hata oluştu.' },
      { status: 500 },
    );
  }
}
