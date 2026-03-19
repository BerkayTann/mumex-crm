import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { planEklemeSemasi } from '@/features/modules/crm/calendar/schema';
import { PlanModel } from '@/features/modules/crm/calendar/schema/PlanModel';
import { startOfMonth, endOfMonth } from 'date-fns';
import { apiKimlikDogrula } from '@/core/api/apiAuthGuard';
import mongoose from 'mongoose';

// Populate için diğer modellerin bellekte derlenmiş olması ZORUNLUDUR
import '@/features/modules/crm/company/schema/CompanyModel';
import '@/features/modules/crm/users/schema/UserModel';

// 1. PLANLARI LİSTELEME (GET)
// Query: ?month=2026-03 (YYYY-MM formatında)
export async function GET(istek: NextRequest) {
  try {
    const { kullanici, hata } = await apiKimlikDogrula();
    if (hata) return hata;

    await veritabaninaBaglan();

    const kullaniciId = new mongoose.Types.ObjectId(kullanici._id);
    const ayParametresi = istek.nextUrl.searchParams.get('month');

    const filtre: Record<string, unknown> = { createdBy: kullaniciId };
    if (ayParametresi) {
      const [yilStr, ayStr] = ayParametresi.split('-');
      const yil = parseInt(yilStr, 10);
      const ay = parseInt(ayStr, 10) - 1; // 0-indexed
      const ayBaslangici = startOfMonth(new Date(yil, ay));
      const ayBitisi = endOfMonth(new Date(yil, ay));
      filtre.date = { $gte: ayBaslangici, $lte: ayBitisi };
    }

    const planlar = await PlanModel.find(filtre)
      .populate('relatedCompanyId')
      .populate('relatedUserId')
      .sort({ date: 1 });

    return NextResponse.json({ basarili: true, veri: planlar }, { status: 200 });
  } catch (hata) {
    console.error('Planlar getirilirken hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, planlar getirilemedi.' },
      { status: 500 }
    );
  }
}

// 2. YENİ PLAN EKLEME (POST)
export async function POST(istek: NextRequest) {
  try {
    const { kullanici, hata } = await apiKimlikDogrula();
    if (hata) return hata;

    await veritabaninaBaglan();

    const kullaniciId = new mongoose.Types.ObjectId(kullanici._id);
    const istekGovdesi = await istek.json();
    const dogrulamaSonucu = planEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Geçersiz plan verisi.', hatalar: dogrulamaSonucu.error.format() },
        { status: 400 }
      );
    }

    // Boş string değerleri undefined'a çevir (MongoDB için)
    const temizVeri = {
      ...dogrulamaSonucu.data,
      description: dogrulamaSonucu.data.description || undefined,
      endDate: dogrulamaSonucu.data.endDate || undefined,
      relatedCompanyId: dogrulamaSonucu.data.relatedCompanyId || undefined,
      relatedUserId: dogrulamaSonucu.data.relatedUserId || undefined,
      createdBy: kullaniciId,
    };

    const yeniPlan = await PlanModel.create(temizVeri);

    return NextResponse.json(
      { basarili: true, mesaj: 'Plan başarıyla kaydedildi.', veri: yeniPlan },
      { status: 201 }
    );
  } catch (hata) {
    console.error('Plan eklenirken hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, plan kaydedilemedi.' },
      { status: 500 }
    );
  }
}
