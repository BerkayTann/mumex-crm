export interface IDoviz {
  kod: string;
  sembol: string;
  ad: string;
}

export const DESTEKLENEN_KURLAR: IDoviz[] = [
  { kod: "TRY", sembol: "₺", ad: "Türk Lirası" },
  { kod: "USD", sembol: "$", ad: "Amerikan Doları" },
  { kod: "EUR", sembol: "€", ad: "Euro" },
  { kod: "GBP", sembol: "£", ad: "İngiliz Sterlini" },
  { kod: "CHF", sembol: "Fr", ad: "İsviçre Frangı" },
  { kod: "SAR", sembol: "﷼", ad: "Suudi Riyali" },
  { kod: "AED", sembol: "د.إ", ad: "BAE Dirhemi" },
];

export const VARSAYILAN_DOVIZ = "TRY";

export function dovizSembolGetir(kod: string): string {
  return DESTEKLENEN_KURLAR.find((d) => d.kod === kod)?.sembol ?? kod;
}
