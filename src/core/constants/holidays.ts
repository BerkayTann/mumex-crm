// Türkiye Resmi ve İdari Tatilleri
// Sabit tatiller yıl bağımsız (MM-DD), hareketli tatiller yıllık tarihlerle

import { addDays } from 'date-fns';

export interface IResmiTatil {
  ad: string;
  tarih: string;           // "MM-DD" sabit tatiller için
  sure: number;            // Gün sayısı (arife dahil)
  hareketliMi: boolean;
  yillikTarihler?: Record<number, string>; // Hareketli tatiller: { 2025: "2025-03-30", ... }
}

export const RESMI_TATILLER: IResmiTatil[] = [
  // --- Sabit Tatiller ---
  { ad: "Yılbaşı", tarih: "01-01", sure: 1, hareketliMi: false },
  { ad: "Ulusal Egemenlik ve Çocuk Bayramı", tarih: "04-23", sure: 1, hareketliMi: false },
  { ad: "Emek ve Dayanışma Günü", tarih: "05-01", sure: 1, hareketliMi: false },
  { ad: "Atatürk'ü Anma, Gençlik ve Spor Bayramı", tarih: "05-19", sure: 1, hareketliMi: false },
  { ad: "Zafer Bayramı", tarih: "08-30", sure: 1, hareketliMi: false },
  { ad: "Cumhuriyet Bayramı", tarih: "10-29", sure: 1, hareketliMi: false },

  // --- Hareketli (Dini) Tatiller ---
  {
    ad: "Ramazan Bayramı",
    tarih: "",
    sure: 3,
    hareketliMi: true,
    yillikTarihler: {
      2025: "2025-03-30",
      2026: "2026-03-20",
      2027: "2027-03-10",
      2028: "2028-02-27",
      2029: "2029-02-14",
      2030: "2030-02-04",
    },
  },
  {
    ad: "Kurban Bayramı",
    tarih: "",
    sure: 4,
    hareketliMi: true,
    yillikTarihler: {
      2025: "2025-06-06",
      2026: "2026-05-27",
      2027: "2027-05-16",
      2028: "2028-05-04",
      2029: "2029-04-24",
      2030: "2030-04-13",
    },
  },
];

export interface ITatilGunu {
  ad: string;
  tarih: Date;
}

/**
 * Verilen yıl ve ay için o aydaki tüm resmi tatil günlerini döner.
 * Çok günlü tatiller (Ramazan 3 gün, Kurban 4 gün) tek tek günlere açılır.
 * @param yil - Örn: 2026
 * @param ay - 0-indexed (Ocak = 0, Aralık = 11)
 */
export const ayinTatilleriniGetir = (yil: number, ay: number): ITatilGunu[] => {
  const sonuc: ITatilGunu[] = [];

  for (const tatil of RESMI_TATILLER) {
    if (tatil.hareketliMi) {
      // Hareketli tatil: yıllık tarihlerden bul
      const baslangicStr = tatil.yillikTarihler?.[yil];
      if (!baslangicStr) continue;

      const baslangic = new Date(baslangicStr);
      for (let g = 0; g < tatil.sure; g++) {
        const gun = addDays(baslangic, g);
        if (gun.getFullYear() === yil && gun.getMonth() === ay) {
          sonuc.push({ ad: tatil.ad, tarih: gun });
        }
      }
    } else {
      // Sabit tatil: MM-DD'den tarih oluştur
      const [mmStr, ddStr] = tatil.tarih.split('-');
      const tatilAyi = parseInt(mmStr, 10) - 1; // 0-indexed
      if (tatilAyi !== ay) continue;

      const tatilGunu = new Date(yil, tatilAyi, parseInt(ddStr, 10));
      sonuc.push({ ad: tatil.ad, tarih: tatilGunu });
    }
  }

  return sonuc;
};

/**
 * Verilen tarih aralığındaki tüm tatilleri döner (bildirimler için).
 */
export const araliktakiTatilleriGetir = (baslangic: Date, bitis: Date): ITatilGunu[] => {
  const sonuc: ITatilGunu[] = [];
  const yil = baslangic.getFullYear();

  // Aynı yıl içinde en fazla 2 farklı ay olabilir (3 günlük aralık)
  const aylar = new Set([baslangic.getMonth()]);
  if (bitis.getMonth() !== baslangic.getMonth()) {
    aylar.add(bitis.getMonth());
  }
  // Yıl geçişi durumu
  if (bitis.getFullYear() !== yil) {
    const bitisTatilleri = ayinTatilleriniGetir(bitis.getFullYear(), bitis.getMonth());
    for (const t of bitisTatilleri) {
      if (t.tarih >= baslangic && t.tarih <= bitis) {
        sonuc.push(t);
      }
    }
    // Sadece başlangıç yılı aylarını kontrol et
    for (const a of aylar) {
      const tatiller = ayinTatilleriniGetir(yil, a);
      for (const t of tatiller) {
        if (t.tarih >= baslangic && t.tarih <= bitis) {
          sonuc.push(t);
        }
      }
    }
    return sonuc;
  }

  for (const a of aylar) {
    const tatiller = ayinTatilleriniGetir(yil, a);
    for (const t of tatiller) {
      if (t.tarih >= baslangic && t.tarih <= bitis) {
        sonuc.push(t);
      }
    }
  }

  return sonuc;
};
