export type ThemeKey = "light" | "dark";

export const THEME_KEY = "mumex-il-theme";
export const LEGACY_THEME_KEY = "mumex-theme";
export const DEFAULT_THEME: ThemeKey = "light";

export const DARK_THEMES: ThemeKey[] = ["dark"];

export const SHADCN_THEME_OPTIONS: { key: ThemeKey; label: string; description: string }[] = [
  {
    key: "light",
    label: "Claude Light",
    description: "Sicak krem zemin, yumusak kontrast ve sakin vurgular.",
  },
  {
    key: "dark",
    label: "Claude Dark",
    description: "Kahverengi-grafit yuzeyler, dusuk parlama ve net okunurluk.",
  },
];
