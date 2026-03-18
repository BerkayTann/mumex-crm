import { NextRequest, NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { planEklemeSemasi } from '@/features/modules/crm/calendar/schema';
import { PlanModel } from '@/features/modules/crm/calendar/schema/PlanModel';

// 1. PLAN GÜNCELLEME (PUT)
export async function PUT(
  istek: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await veritabaninaBaglan();
    const { id } = await params;

    const istekGovdesi = await istek.json();
    const dogrulamaSonucu = planEklemeSemasi.safeParse(istekGovdesi);

    if (!dogrulamaSonucu.success) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Geçersiz plan verisi.', hatalar: dogrulamaSonucu.error.format() },
        { status: 400 }
      );
    }

    const temizVeri = {
      ...dogrulamaSonucu.data,
      description: dogrulamaSonucu.data.description || undefined,
      endDate: dogrulamaSonucu.data.endDate || undefined,
      relatedCompanyId: dogrulamaSonucu.data.relatedCompanyId || undefined,
      relatedUserId: dogrulamaSonucu.data.relatedUserId || undefined,
    };

    const guncellenenPlan = await PlanModel.findByIdAndUpdate(id, temizVeri, { new: true });

    if (!guncellenenPlan) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Plan bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { basarili: true, mesaj: 'Plan güncellendi.', veri: guncellenenPlan },
      { status: 200 }
    );
  } catch (hata) {
    console.error('Plan güncellenirken hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, plan güncellenemedi.' },
      { status: 500 }
    );
  }
}

// 2. PLAN SİLME (DELETE)
export async function DELETE(
  _istek: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await veritabaninaBaglan();
    const { id } = await params;

    const silinenPlan = await PlanModel.findByIdAndDelete(id);

    if (!silinenPlan) {
      return NextResponse.json(
        { basarili: false, mesaj: 'Plan bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { basarili: true, mesaj: 'Plan silindi.' },
      { status: 200 }
    );
  } catch (hata) {
    console.error('Plan silinirken hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, plan silinemedi.' },
      { status: 500 }
    );
  }
}
