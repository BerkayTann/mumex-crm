"use client";

import React from "react";
import Link from "next/link";
import { Bell, Search, Menu, Sun, Moon, Settings } from "lucide-react";
import { useTheme } from "@/core/providers/ThemeProvider";

interface IHeaderProps {
  onMenuAc: () => void;
}

export const Header = ({ onMenuAc }: IHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-border/70 bg-background/80 px-4 text-foreground shadow-sm backdrop-blur-xl lg:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          onClick={onMenuAc}
          className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Menüyü aç"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex max-w-sm flex-1 items-center rounded-xl border border-border/80 bg-card/95 px-3 py-2 shadow-sm">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Kurum, doktor veya ürün ara..."
            className="w-full border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-3">
        <button className="relative rounded-full border border-transparent p-2 text-muted-foreground transition-colors hover:border-border/80 hover:bg-accent hover:text-accent-foreground hover:shadow-sm">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </button>
        <Link
          href="/settings"
          className="rounded-full border border-border/80 bg-card/95 p-2 text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-ring hover:bg-accent hover:text-accent-foreground"
          title="Ayarlar"
          aria-label="Ayarlar"
        >
          <Settings className="h-4 w-4" />
        </Link>
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Açık tema" : "Koyu tema"}
          className="rounded-full border border-border/80 bg-card/95 p-2 text-muted-foreground shadow-sm transition-colors hover:border-ring hover:bg-accent hover:text-accent-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
};
