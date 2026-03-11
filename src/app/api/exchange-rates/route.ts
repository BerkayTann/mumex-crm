import { NextResponse } from 'next/server';

// open.er-api.com — ücretsiz, auth gerektirmez, günlük güncelleme
const KUR_API_URL = 'https://open.er-api.com/v6/latest/TRY';

export const revalidate = 3600; // 1 saat Next.js önbelleği

export async function GET() {
  try {
    const yanit = await fetch(KUR_API_URL, {
      next: { revalidate: 3600 },
    });

    if (!yanit.ok) {
      throw new Error(`Kur API hatası: ${yanit.status}`);
    }

    const veri = await yanit.json();

    // rates objesi: { "USD": 0.028, "EUR": 0.026, ... }
    // TRY her zaman 1
    const kurlar: Record<string, number> = { TRY: 1, ...(veri.rates || {}) };

    return NextResponse.json(
      { basarili: true, kurlar, guncelleme: veri.time_last_update_utc },
      {
        status: 200,
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=600',
        },
      }
    );
  } catch (hata) {
    console.error('Döviz kurları alınamadı:', hata);
    // Fallback: hardcoded yaklaşık kurlar (API erişilemezse)
    return NextResponse.json(
      {
        basarili: false,
        kurlar: { TRY: 1, USD: 0.028, EUR: 0.026, GBP: 0.022, CHF: 0.025, SAR: 0.105, AED: 0.103 },
        mesaj: 'Canlı kur alınamadı, yaklaşık değerler kullanılıyor.',
      },
      { status: 200 }
    );
  }
}
