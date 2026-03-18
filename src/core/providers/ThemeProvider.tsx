"use client";

import {
  DARK_THEMES,
  DEFAULT_THEME,
  LEGACY_THEME_KEY,
  SHADCN_THEME_OPTIONS,
  THEME_KEY,
  ThemeKey,
} from "@/core/constants/themeKeys";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

interface ThemeContextValue {
  theme: ThemeKey;
  setTheme: React.Dispatch<React.SetStateAction<ThemeKey>>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isKnownTheme = (value: unknown): value is ThemeKey =>
  typeof value === "string" && SHADCN_THEME_OPTIONS.some((option) => option.key === value);

const applyThemeToDocument = (theme: ThemeKey) => {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  const isDark = DARK_THEMES.includes(theme);
  document.documentElement.classList.toggle("dark", isDark);
};

const readStoredTheme = (): ThemeKey => {
  const stored =
    (localStorage.getItem(THEME_KEY) ?? localStorage.getItem(LEGACY_THEME_KEY)) ?? DEFAULT_THEME;
  return isKnownTheme(stored) ? stored : DEFAULT_THEME;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // SSR ile eşleşmesi için her zaman DEFAULT_THEME ile başla (localStorage okuma yok)
  const [theme, setTheme] = useState<ThemeKey>(DEFAULT_THEME);
  const isIlkMount = useRef(true);

  // Client mount'ta depolanmış temayı oku ve uygula
  useEffect(() => {
    const stored = readStoredTheme();
    setTheme(stored);
    applyThemeToDocument(stored);
  }, []);

  // Kullanıcı tema değiştirdiğinde kaydet (ilk mount'ta atla)
  useEffect(() => {
    if (isIlkMount.current) {
      isIlkMount.current = false;
      return;
    }
    applyThemeToDocument(theme);
    localStorage.setItem(THEME_KEY, theme);
    localStorage.removeItem(LEGACY_THEME_KEY);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_KEY && event.newValue && isKnownTheme(event.newValue)) {
        setTheme(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
