import { NextResponse } from 'next/server';
import { veritabaninaBaglan } from '@/lib/dbConnect';
import { VisitModel } from '@/features/modules/crm/visit/schema/VisitModel';
import { PlanModel } from '@/features/modules/crm/calendar/schema/PlanModel';
import { araliktakiTatilleriGetir } from '@/core/constants/holidays';
import { startOfDay, endOfDay, addDays, differenceInCalendarDays } from 'date-fns';
import { NotificationType, BILDIRIM_RENKLERI } from '@/features/modules/crm/notification/types';
import { INotification } from '@/features/modules/crm/notification/types';

// Populate için modellerin bellekte olması ZORUNLUDUR
import '@/features/modules/crm/company/schema/CompanyModel';
import '@/features/modules/crm/users/schema/UserModel';

// Yardımcı: Populated visit'ten kurum/kişi adını çek
const kurumAdiGetir = (companyId: unknown): string => {
  if (companyId && typeof companyId === 'object' && 'name' in companyId) {
    return (companyId as { name: string }).name;
  }
  return '';
};

const kisiAdiGetir = (userId: unknown): string => {
  if (userId && typeof userId === 'object' && 'firstName' in userId && 'lastName' in userId) {
    const kisi = userId as { firstName: string; lastName: string };
    return `${kisi.firstName} ${kisi.lastName}`;
  }
  return '';
};

const gunAciklamasi = (gunSayisi: number): string => {
  if (gunSayisi === 0) return 'Bugün';
  if (gunSayisi === 1) return 'Yarın';
  return `${gunSayisi} gün sonra`;
};

// GET /api/notifications
// Yaklaşan 3 gün içindeki tüm etkinlikleri hesaplar
export async function GET() {
  try {
    await veritabaninaBaglan();

    const bugun = startOfDay(new Date());
    const ucGunSonra = endOfDay(addDays(bugun, 3));
    const tarihAraligi = { $gte: bugun, $lte: ucGunSonra };

    const bildirimler: INotification[] = [];

    // 1. Planlanan ziyaretler
    const planlananZiyaretler = await VisitModel.find({
      plannedDate: tarihAraligi,
      status: 'PLANNED',
    }).populate('companyId userId');

    for (const z of planlananZiyaretler) {
      const plannedDate = z.plannedDate;
      if (!plannedDate) continue;
      const gunSayisi = differenceInCalendarDays(plannedDate, bugun);
      const kurumAdi = kurumAdiGetir(z.companyId);
      const kisiAdi = kisiAdiGetir(z.userId);

      bildirimler.push({
        id: `PLANNED_VISIT_${z._id}_${plannedDate.toISOString().split('T')[0]}`,
        title: `Planlanan Ziyaret${kurumAdi ? ': ' + kurumAdi : ''}`,
        description: `${kisiAdi ? kisiAdi + ' - ' : ''}${gunAciklamasi(gunSayisi)}`,
        date: plannedDate.toISOString(),
        daysUntil: gunSayisi,
        type: NotificationType.PLANNED_VISIT,
        sourceId: z._id.toString(),
        color: BILDIRIM_RENKLERI[NotificationType.PLANNED_VISIT],
      });
    }

    // 2. Kargodaki ziyaretler (kargo tarihi yaklaşıyor)
    const kargodakiZiyaretler = await VisitModel.find({
      cargoDate: tarihAraligi,
      cargoStatus: 'Kargoda',
    }).populate('companyId userId');

    for (const z of kargodakiZiyaretler) {
      const cargoDate = z.cargoDate;
      if (!cargoDate) continue;
      const gunSayisi = differenceInCalendarDays(cargoDate, bugun);
      const kurumAdi = kurumAdiGetir(z.companyId);

      bildirimler.push({
        id: `CARGO_${z._id}_${cargoDate.toISOString().split('T')[0]}`,
        title: `Kargo Takibi${kurumAdi ? ': ' + kurumAdi : ''}`,
        description: `Kargo gönderim tarihi - ${gunAciklamasi(gunSayisi)}`,
        date: cargoDate.toISOString(),
        daysUntil: gunSayisi,
        type: NotificationType.CARGO_ARRIVING,
        sourceId: z._id.toString(),
        color: BILDIRIM_RENKLERI[NotificationType.CARGO_ARRIVING],
      });
    }

    // 3. Teslimat tarihi yaklaşanlar
    const teslimatZiyaretleri = await VisitModel.find({
      deliveryDate: tarihAraligi,
    }).populate('companyId userId');

    for (const z of teslimatZiyaretleri) {
      const deliveryDate = z.deliveryDate;
      if (!deliveryDate) continue;
      const gunSayisi = differenceInCalendarDays(deliveryDate, bugun);
      const kurumAdi = kurumAdiGetir(z.companyId);

      bildirimler.push({
        id: `DELIVERY_${z._id}_${deliveryDate.toISOString().split('T')[0]}`,
        title: `Teslimat${kurumAdi ? ': ' + kurumAdi : ''}`,
        description: `Teslim tarihi - ${gunAciklamasi(gunSayisi)}`,
        date: deliveryDate.toISOString(),
        daysUntil: gunSayisi,
        type: NotificationType.DELIVERY_DUE,
        sourceId: z._id.toString(),
        color: BILDIRIM_RENKLERI[NotificationType.DELIVERY_DUE],
      });
    }

    // 4. Yaklaşan manuel planlar
    const yaklasanPlanlar = await PlanModel.find({
      date: tarihAraligi as unknown as Date,
      isCompleted: false,
    });

    for (const p of yaklasanPlanlar) {
      const gunSayisi = differenceInCalendarDays(p.date, bugun);

      bildirimler.push({
        id: `PLAN_${p._id}_${p.date.toISOString().split('T')[0]}`,
        title: p.title,
        description: `${p.description || 'Plan / Hatırlatıcı'} - ${gunAciklamasi(gunSayisi)}`,
        date: p.date.toISOString(),
        daysUntil: gunSayisi,
        type: NotificationType.MANUAL_PLAN,
        sourceId: p._id.toString(),
        color: BILDIRIM_RENKLERI[NotificationType.MANUAL_PLAN],
      });
    }

    // 5. Resmi tatiller
    const tatiller = araliktakiTatilleriGetir(bugun, ucGunSonra);
    for (const t of tatiller) {
      const gunSayisi = differenceInCalendarDays(t.tarih, bugun);

      bildirimler.push({
        id: `HOLIDAY_${t.ad.replace(/\s/g, '_')}_${t.tarih.toISOString().split('T')[0]}`,
        title: t.ad,
        description: `Resmi Tatil - ${gunAciklamasi(gunSayisi)}`,
        date: t.tarih.toISOString(),
        daysUntil: gunSayisi,
        type: NotificationType.HOLIDAY,
        color: BILDIRIM_RENKLERI[NotificationType.HOLIDAY],
      });
    }

    // Yakınlığa göre sırala (bugün en üstte)
    bildirimler.sort((a, b) => a.daysUntil - b.daysUntil);

    return NextResponse.json({ basarili: true, veri: bildirimler }, { status: 200 });
  } catch (hata) {
    console.error('Bildirimler hesaplanırken hata:', hata);
    return NextResponse.json(
      { basarili: false, mesaj: 'Sunucu hatası, bildirimler getirilemedi.' },
      { status: 500 }
    );
  }
}
