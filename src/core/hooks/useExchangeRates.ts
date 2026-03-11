import { useQuery } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';

interface IKurYaniti {
  basarili: boolean;
  kurlar: Record<string, number>; // { "TRY": 1, "USD": 0.028, ... }
  guncelleme?: string;
  mesaj?: string;
}

const kUrlariGetir = async (): Promise<Record<string, number>> => {
  const yanit = await apiIstemcisi.get<IKurYaniti>('/exchange-rates');
  return yanit.data.kurlar;
};

/**
 * Anlık döviz kurlarını döndürür (TRY bazlı: 1 TRY = X döviz).
 * Örn: { TRY: 1, USD: 0.028 } → 1 TRY = 0.028 USD → 1 USD = 35.7 TRY
 *
 * TRY karşılığı hesaplama: priceInTRY = price / kurlar[currency]
 */
export const useDovizKurlari = () => {
  return useQuery({
    queryKey: ['dovizKurlari'],
    queryFn: kUrlariGetir,
    staleTime: 1000 * 60 * 60, // 1 saat
    gcTime: 1000 * 60 * 120,
  });
};

/**
 * Verilen döviz cinsindeki fiyatı TRY'ye çevirir.
 * @param fiyat - Orijinal döviz fiyatı
 * @param dovizKodu - "USD", "EUR" vb.
 * @param kurlar - useDovizKurlari'ndan gelen rates objesi
 */
export function tryeVevir(
  fiyat: number,
  dovizKodu: string,
  kurlar: Record<string, number>
): number {
  if (dovizKodu === 'TRY' || !kurlar[dovizKodu]) return fiyat;
  // kurlar TRY-bazlı: kurlar["USD"] = 1 TRY'nin USD cinsinden değeri
  // Örn: kurlar.USD = 0.028 → 1 TRY = 0.028 USD → 1 USD = 1/0.028 TRY
  return fiyat / kurlar[dovizKodu];
}
