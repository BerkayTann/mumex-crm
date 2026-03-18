import React from "react";

export type TimeRangeKey = "day" | "week" | "month" | "year";

export type TimeRangeOption = {
  key: TimeRangeKey;
  label: string;
};

interface TimeRangeTabsProps {
  options: TimeRangeOption[];
  value: TimeRangeKey;
  onChange: (value: TimeRangeKey) => void;
}

export const TimeRangeTabs: React.FC<TimeRangeTabsProps> = ({ options, value, onChange }) => {
  return (
    <div
      className="inline-flex rounded-full border border-border p-1 text-xs"
      style={{
        backgroundColor: "var(--surface-1)",
        boxShadow: "var(--elevation-sm)",
      }}
    >
      {options.map((option) => {
        const aktifMi = option.key === value;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            aria-pressed={aktifMi}
            className={`rounded-full px-3 py-1 font-semibold transition ${
              aktifMi ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            style={
              aktifMi
                ? {
                    backgroundColor: "var(--card)",
                    boxShadow: "var(--elevation-sm)",
                  }
                : {
                    backgroundColor: "transparent",
                  }
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
