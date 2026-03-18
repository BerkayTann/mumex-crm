import React from "react";
import { formatMoney, getMoneyToneClass } from "@/core/utils/money";

type MoneyTextElement = "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4";
type MoneyTextTone = "auto" | "positive" | "negative" | "neutral";

interface MoneyTextProps extends React.HTMLAttributes<HTMLElement> {
  value: number | null | undefined;
  as?: MoneyTextElement;
  currency?: string;
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  showCurrency?: boolean;
  currencyDisplay?: "symbol" | "code";
  tone?: MoneyTextTone;
  fallback?: React.ReactNode;
}

const toneClassMap: Record<Exclude<MoneyTextTone, "auto">, string> = {
  positive: "money-positive",
  negative: "money-negative",
  neutral: "money-neutral",
};

export const MoneyText: React.FC<MoneyTextProps> = ({
  value,
  as = "span",
  className,
  currency = "TRY",
  locale = "tr-TR",
  maximumFractionDigits = 2,
  minimumFractionDigits,
  showCurrency = true,
  currencyDisplay = "symbol",
  tone = "auto",
  fallback = "-",
  ...rest
}) => {
  const Component = as;
  const toneClass =
    tone === "auto" ? getMoneyToneClass(value) : toneClassMap[tone];

  const content =
    typeof value === "number" && Number.isFinite(value)
      ? formatMoney(value, {
          currency,
          locale,
          maximumFractionDigits,
          minimumFractionDigits,
          showCurrency,
          currencyDisplay,
        })
      : fallback;

  const mergedClassName = [toneClass, className].filter(Boolean).join(" ");

  return (
    <Component className={mergedClassName} {...rest}>
      {content}
    </Component>
  );
};
