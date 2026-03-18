import { dovizSembolGetir } from "../constants/currencies";

export type MoneyTone = "positive" | "negative" | "neutral";

interface FormatMoneyOptions {
  currency?: string;
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  showCurrency?: boolean;
  currencyDisplay?: "symbol" | "code";
}

export const getMoneyToneClass = (value: number | null | undefined) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value === 0) {
    return "money-neutral";
  }

  return value > 0 ? "money-positive" : "money-negative";
};

export const getMoneyTone = (value: number | null | undefined): MoneyTone => {
  if (typeof value !== "number" || !Number.isFinite(value) || value === 0) {
    return "neutral";
  }

  return value > 0 ? "positive" : "negative";
};

export const formatMoney = (
  value: number | null | undefined,
  {
    currency = "TRY",
    locale = "tr-TR",
    maximumFractionDigits = 2,
    minimumFractionDigits,
    showCurrency = true,
    currencyDisplay = "symbol",
  }: FormatMoneyOptions = {},
) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "-";
  }

  const formattedValue = value.toLocaleString(locale, {
    maximumFractionDigits,
    minimumFractionDigits,
  });

  if (!showCurrency) {
    return formattedValue;
  }

  const currencyLabel =
    currencyDisplay === "code" ? currency : dovizSembolGetir(currency);

  return `${formattedValue} ${currencyLabel}`.trim();
};
