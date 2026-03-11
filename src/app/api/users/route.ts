import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { kisiEklemeSemasi } from '@/features/modules/crm/users/schema';
import { UserModel } from '@/features/modules/crm/users/schema/UserModel';
import { CompanyModel } from '@/features/modules/crm/company/schema/CompanyModel';
import { ildenBolgeGetir } from '@/core/constants/cities';
import mongoose from 'mongoose';

// 1. KİŞİLERİ LİSTELEME (GET) - Aggregation ile segment (A/B/C) dahil
export async function GET() {
  try {
    await veritabaninaBaglan();

    const kisiler = await UserModel.aggregate([
      {
        $lookup: {
          from: 'visits',
          localField: '_id',
          foreignField: 'userId',
          as: 'ziyaretler',
        },
      },
      {
        $addFields: {
          toplamCiro: { $sum: '$ziyaretler.totalAmount' },
        },
      },
      {
        $addFields: {
          segment: {
            $switch: {
              branches: [
                { case: { $gt: ['$toplamCiro', 50000] }, then: 'A' },
                { case: { $gt: ['$toplamCiro', 10000] }, then: 'B' },
              ],
              default: 'C',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'companyData',
        },
      },
      {
        $addFields: {
          companyId: { $arrayElemAt: ['$companyData', 0] },
        },
      },
      {
        $project: { ziyaretler: 0, companyData: 0, toplamCiro: 0 },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json({ basarili: true, veri: kisiler }, { status: 200 });
  } catch (hata) {
    console.error('Kişiler getirilirken hata oluştu:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, kişiler getirilemedi.' },
      { status: 500 }
    );
  }
}

// 2. YENİ KİŞİ EKLEME (POST) - find-or-create company mantığı
export async function POST(istek: NextRequest) {
  try {
    await veritabaninaBaglan();

    const istekGovdesi = await istek.json();

    const dogrulamaSonucu = kisiEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
      return NextResponse.json(
        {
          basarili: false,
          mesaj: 'Veriler geçersiz.',
          hatalar: dogrulamaSonucu.error.format(),
        },
        { status: 400 }
      );
    }

    const { sirketAdi, sirketTipi, sehir, ilce, ...kisiVerisi } = dogrulamaSonucu.data;

    // Aynı isimli kurum varsa bağla, yoksa oluştur
    const bolge = ildenBolgeGetir(sehir);

    let kurum = await CompanyModel.findOne({
      name: { $regex: new RegExp(`^${sirketAdi.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    });

    if (!kurum) {
      kurum = await CompanyModel.create({
        name: sirketAdi.trim(),
        type: sirketTipi,
        city: sehir,
        district: ilce || undefined,
        region: bolge || undefined,
        isActive: true,
      });
    }

    const yeniKisi = await UserModel.create({
      ...kisiVerisi,
      companyId: new mongoose.Types.ObjectId(String(kurum._id)),
    });

    return NextResponse.json(
      { basarili: true, mesaj: 'Kişi başarıyla kaydedildi.', veri: yeniKisi },
      { status: 201 }
    );
  } catch (hata) {
    console.error('Kişi eklenirken hata oluştu:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, kişi kaydedilemedi.' },
      { status: 500 }
    );
  }
}