import React, { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { MoneyText } from "@/components/common/MoneyText";
import { TimeRangeTabs } from "./TimeRangeTabs";
import type { TimeRangeKey, TimeRangeOption } from "./TimeRangeTabs";

export interface MetricChartPoint {
  label: string;
  detail: string;
  value: number;
}

interface MetricInfographicCardProps {
  baslik: string;
  ikon?: LucideIcon;
  renkClass?: string;
  degerEtiketi: React.ReactNode;
  degerClassName?: string;
  parasalMi?: boolean;
  donemEtiketi: string;
  seri: MetricChartPoint[];
  aralik: TimeRangeKey;
  araliklar: TimeRangeOption[];
  aralikDegistir: (value: TimeRangeKey) => void;
  degerFormatter: (value: number) => string;
  chartLineColor?: string;
  chartFillColor?: string;
}

type TooltipState = {
  x: number;
  y: number;
  placement: "top" | "bottom";
};

const chartWidth = 320;
const chartHeight = 220;
const chartPaddingX = 24;
const chartPaddingTop = 18;
const chartPaddingBottom = 34;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const formatCompactValue = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  }

  return Math.round(value).toLocaleString("tr-TR");
};

export const MetricInfographicCard: React.FC<MetricInfographicCardProps> = ({
  baslik,
  ikon: Ikon,
  degerEtiketi,
  degerClassName,
  parasalMi = false,
  donemEtiketi,
  seri,
  aralik,
  araliklar,
  aralikDegistir,
  degerFormatter,
  chartLineColor = "var(--chart-1)",
  chartFillColor = "color-mix(in oklab, var(--chart-1) 18%, transparent)",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(() => Math.max(seri.length - 1, 0));
  const [tooltipPosition, setTooltipPosition] = useState<TooltipState | null>(null);

  const chartData = useMemo(() => {
    if (!seri.length) {
      return null;
    }

    const maxValue = Math.max(...seri.map((point) => point.value), 0);
    const safeMax = maxValue === 0 ? 1 : maxValue;
    const usableWidth = chartWidth - chartPaddingX * 2;
    const usableHeight = chartHeight - chartPaddingTop - chartPaddingBottom;

    const points = seri.map((point, index) => {
      const x =
        seri.length === 1
          ? chartWidth / 2
          : chartPaddingX + (index / (seri.length - 1)) * usableWidth;
      const y = chartPaddingTop + (1 - point.value / safeMax) * usableHeight;

      return {
        ...point,
        x,
        y,
      };
    });

    return {
      safeMax,
      points,
      linePath: points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" "),
      areaPath: [
        `M ${points[0].x} ${chartHeight - chartPaddingBottom}`,
        ...points.map((point) => `L ${point.x} ${point.y}`),
        `L ${points[points.length - 1].x} ${chartHeight - chartPaddingBottom}`,
        "Z",
      ].join(" "),
    };
  }, [seri]);

  const safeHoveredIndex = Math.min(hoveredIndex, Math.max(seri.length - 1, 0));
  const activePoint = chartData?.points[safeHoveredIndex] ?? null;

  const metricSummary = useMemo(() => {
    if (!seri.length) {
      return null;
    }

    const total = seri.reduce((sum, point) => sum + point.value, 0);
    const peakPoint = seri.reduce((topPoint, point) =>
      point.value > topPoint.value ? point : topPoint,
    );
    const latestPoint = seri[seri.length - 1];

    return {
      average: total / seri.length,
      peakPoint,
      latestPoint,
    };
  }, [seri]);

  const iconStyle = useMemo(
    () => ({
      color: chartLineColor,
      backgroundColor: `color-mix(in oklab, ${chartLineColor} 16%, var(--card))`,
      boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.06)",
    }),
    [chartLineColor],
  );

  const handleChartMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!chartData) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();

    if (!bounds.width) {
      return;
    }

    const relativeX = ((event.clientX - bounds.left) / bounds.width) * chartWidth;
    const relativeMouseX = event.clientX - bounds.left;
    const relativeMouseY = event.clientY - bounds.top;

    let nextIndex = safeHoveredIndex;
    let nearestDistance = Number.POSITIVE_INFINITY;

    chartData.points.forEach((point, index) => {
      const distance = Math.abs(point.x - relativeX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nextIndex = index;
      }
    });

    if (nextIndex !== safeHoveredIndex) {
      setHoveredIndex(nextIndex);
    }

    const minTooltipX = 96;
    const maxTooltipX = Math.max(minTooltipX, bounds.width - 96);
    const showBelow = relativeMouseY <= 72;

    setTooltipPosition({
      x: clamp(relativeMouseX, minTooltipX, maxTooltipX),
      y: showBelow
        ? Math.min(relativeMouseY + 18, bounds.height - 12)
        : Math.max(relativeMouseY - 14, 74),
      placement: showBelow ? "bottom" : "top",
    });
  };

  return (
    <div
      className="flex h-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground"
      style={{ boxShadow: "var(--elevation-md)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {Ikon ? (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70"
              style={iconStyle}
            >
              <Ikon className="h-5 w-5" />
            </div>
          ) : null}
          <div>
            <p className="text-sm font-semibold text-foreground">{baslik}</p>
            <p className="text-xs text-muted-foreground">{donemEtiketi}</p>
          </div>
        </div>
        <TimeRangeTabs options={araliklar} value={aralik} onChange={aralikDegistir} />
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-4">
        <div>
          <div className={`text-2xl font-bold text-foreground ${degerClassName ?? ""}`}>{degerEtiketi}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            {activePoint ? activePoint.detail : donemEtiketi}
          </p>
        </div>

        {metricSummary ? (
          <div className="grid gap-2 sm:grid-cols-3">
            <div
              className="rounded-xl border border-border px-3 py-2"
              style={{ backgroundColor: "var(--surface-1)" }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Zirve
              </p>
              {parasalMi ? (
                <MoneyText
                  as="p"
                  value={metricSummary.peakPoint.value}
                  className="mt-1 text-sm font-semibold"
                />
              ) : (
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {degerFormatter(metricSummary.peakPoint.value)}
                </p>
              )}
              <p className="mt-1 text-[11px] text-muted-foreground">
                {metricSummary.peakPoint.detail}
              </p>
            </div>
            <div
              className="rounded-xl border border-border px-3 py-2"
              style={{ backgroundColor: "var(--surface-1)" }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Ortalama
              </p>
              {parasalMi ? (
                <MoneyText
                  as="p"
                  value={metricSummary.average}
                  className="mt-1 text-sm font-semibold"
                />
              ) : (
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {degerFormatter(metricSummary.average)}
                </p>
              )}
              <p className="mt-1 text-[11px] text-muted-foreground">{donemEtiketi}</p>
            </div>
            <div
              className="rounded-xl border border-border px-3 py-2"
              style={{ backgroundColor: "var(--surface-1)" }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Son Nokta
              </p>
              {parasalMi ? (
                <MoneyText
                  as="p"
                  value={metricSummary.latestPoint.value}
                  className="mt-1 text-sm font-semibold"
                />
              ) : (
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {degerFormatter(metricSummary.latestPoint.value)}
                </p>
              )}
              <p className="mt-1 text-[11px] text-muted-foreground">
                {metricSummary.latestPoint.detail}
              </p>
            </div>
          </div>
        ) : null}

        {chartData ? (
          <div
            className="rounded-2xl border border-border p-4"
            style={{ backgroundColor: "var(--surface-1)" }}
          >
            <div className="relative">
              {activePoint && tooltipPosition ? (
                <div
                  className={`pointer-events-none absolute z-10 min-w-36 -translate-x-1/2 rounded-xl border border-border bg-popover/95 px-3 py-2 text-popover-foreground backdrop-blur ${
                    tooltipPosition.placement === "top" ? "-translate-y-full" : "translate-y-0"
                  }`}
                  style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                    boxShadow: "var(--elevation-sm)",
                  }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {activePoint.label}
                  </p>
                  {parasalMi ? (
                    <MoneyText
                      as="p"
                      value={activePoint.value}
                      className="mt-1 text-sm font-semibold"
                    />
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {degerFormatter(activePoint.value)}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-muted-foreground">{activePoint.detail}</p>
                </div>
              ) : null}

              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-52 w-full"
                aria-hidden="true"
                onMouseMove={handleChartMouseMove}
                onMouseLeave={() => {
                  setHoveredIndex(Math.max(seri.length - 1, 0));
                  setTooltipPosition(null);
                }}
              >
                {[0.25, 0.5, 0.75].map((ratio) => {
                  const y =
                    chartPaddingTop +
                    (chartHeight - chartPaddingTop - chartPaddingBottom) * ratio;

                  return (
                    <line
                      key={ratio}
                      x1={chartPaddingX}
                      x2={chartWidth - chartPaddingX}
                      y1={y}
                      y2={y}
                      strokeDasharray="4 5"
                      style={{ stroke: "color-mix(in oklab, var(--border) 74%, transparent)" }}
                    />
                  );
                })}

                {[1, 0.5, 0].map((ratio) => {
                  const y =
                    chartPaddingTop +
                    (chartHeight - chartPaddingTop - chartPaddingBottom) * (1 - ratio);

                  return (
                    <text
                      key={ratio}
                      x={4}
                      y={y + 4}
                      fontSize="10"
                      fontWeight="600"
                      style={{ fill: "var(--muted-foreground)" }}
                    >
                      {formatCompactValue(chartData.safeMax * ratio)}
                    </text>
                  );
                })}

                <path d={chartData.areaPath} style={{ fill: chartFillColor }} />
                <path
                  d={chartData.linePath}
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ stroke: chartLineColor }}
                />

                {activePoint ? (
                  <line
                    x1={activePoint.x}
                    x2={activePoint.x}
                    y1={chartPaddingTop}
                    y2={chartHeight - chartPaddingBottom}
                    strokeDasharray="3 4"
                    style={{ stroke: chartLineColor, opacity: 0.22 }}
                  />
                ) : null}

                {chartData.points.map((point, index) => {
                  const aktifMi = index === safeHoveredIndex;

                  return (
                    <g key={`${point.label}-${index}`} pointerEvents="none">
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={aktifMi ? 5 : 3.5}
                        style={{
                          fill: "var(--card)",
                          stroke: chartLineColor,
                          strokeWidth: aktifMi ? 3 : 2,
                        }}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="mt-2 flex justify-between gap-2 text-[11px] font-medium text-muted-foreground">
              {seri.map((point, index) => (
                <span
                  key={`${point.label}-label-${index}`}
                  className={index === safeHoveredIndex ? "text-foreground" : undefined}
                >
                  {point.label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="flex h-40 items-center justify-center rounded-2xl border border-border text-sm text-muted-foreground"
            style={{ backgroundColor: "var(--surface-1)" }}
          >
            Grafik verisi yok
          </div>
        )}
      </div>
    </div>
  );
};
