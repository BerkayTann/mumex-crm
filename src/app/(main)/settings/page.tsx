"use client";

import Link from "next/link";
import { Check, Info, LogOut, MoonStar, Palette, Settings, Sparkles, SunMedium, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SHADCN_THEME_OPTIONS, ThemeKey } from "@/core/constants/themeKeys";
import { useTheme } from "@/core/providers/ThemeProvider";
import { useAuth } from "@/features/auth";

const THEME_ICONS: Record<ThemeKey, LucideIcon> = {
  light: SunMedium,
  dark: MoonStar,
};

export default function AyarlarSayfasi() {
  const { theme, setTheme } = useTheme();
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-2 lg:p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[1.6rem] bg-secondary text-primary shadow-sm">
          <Settings className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ayarlar</h1>
          <p className="text-sm text-muted-foreground">Tema, hesap ve uygulama bilgileri.</p>
        </div>
      </div>

      {user ? (
        <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-primary/12 text-xl font-black text-primary">
                {user.initials}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{user.fullName}</h2>
                  <span className="rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
                    {user.role}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  @{user.username} • {user.jobTitle} • {user.company}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/profile"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-background/80 px-4 text-sm font-semibold text-foreground"
              >
                <UserRound className="h-4 w-4 text-primary" />
                Profilimi aç
              </Link>
              <button
                type="button"
                onClick={logout}
                disabled={isLoggingOut}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-background/80 px-4 text-sm font-semibold text-foreground disabled:opacity-70"
              >
                <LogOut className="h-4 w-4 text-primary" />
                {isLoggingOut ? "Çıkış yapılıyor..." : "Oturumu kapat"}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-[2rem] border border-border bg-card/95 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <Palette className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-base font-semibold text-foreground">Kişiselleştirme</h2>
            <p className="text-sm text-muted-foreground">
              Koyu ve açık temalar arasında geçiş yaparak arayüzü kişiselleştirin.
            </p>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          {SHADCN_THEME_OPTIONS.map(({ key, label, description }) => {
            const Icon = THEME_ICONS[key];
            const aktifMi = theme === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                aria-pressed={aktifMi}
                className={`group rounded-[1.5rem] border p-5 text-left transition-all ${
                  aktifMi
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-background/80 hover:border-primary/40 hover:bg-accent"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        aktifMi ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{label}</div>
                      <div className="text-xs text-muted-foreground">{description}</div>
                    </div>
                  </div>
                  {aktifMi && <Check className="h-5 w-5 text-primary" />}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="h-10 rounded-xl border border-border bg-background" />
                  <div className="h-10 rounded-xl border border-border bg-card" />
                  <div className="h-10 rounded-xl bg-primary" />
                  <div className="h-10 rounded-xl bg-secondary" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-border bg-card/95 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border px-6 py-5">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">İletişim</h2>
          </div>
          <div className="space-y-3 px-6 py-5 text-sm text-muted-foreground">
            <p>E-posta: brkytn97@gmail.com</p>
            <p></p>
            <p></p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card/95 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border px-6 py-5">
            <Info className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Hakkında</h2>
          </div>
          <div className="space-y-3 px-6 py-5 text-sm text-muted-foreground">
            <p>Mumex.iL V1.4</p>
            <p>Mumex.iL founded by Berkay Tan © 2026</p>
          </div>
        </div>
      </section>
    </div>
  );
}
