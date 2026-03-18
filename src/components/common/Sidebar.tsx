"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  MapPin,
  UserRound,
  LogOut,
  X,
  Warehouse,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "@/features/auth/components/AuthProvider";

interface IMenuElemani {
  baslik: string;
  yol: string;
  ikon: React.ElementType;
}

const menuElemanlari: IMenuElemani[] = [
  { baslik: "Ana Sayfa", yol: "/dashboard", ikon: LayoutDashboard },
  { baslik: "Musteriler", yol: "/users", ikon: Users },
  { baslik: "Kurumlar", yol: "/company", ikon: Building2 },
  { baslik: "Urunler", yol: "/product", ikon: Package },
  { baslik: "Depo / Stok", yol: "/inventory", ikon: Warehouse },
  { baslik: "Satis ve Ziyaret", yol: "/visit", ikon: MapPin },
  { baslik: "Takvim", yol: "/calendar", ikon: CalendarDays },
  { baslik: "Profilim", yol: "/profile", ikon: UserRound },
];

interface ISidebarProps {
  acikMi: boolean;
  daralmisMi: boolean;
  onKapat: () => void;
}

export const Sidebar = ({ acikMi, daralmisMi, onKapat }: ISidebarProps) => {
  const aktifYol = usePathname();
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl
        transition-all duration-300
        lg:relative lg:z-auto lg:translate-x-0
        ${acikMi ? "translate-x-0" : "-translate-x-full"}
        ${daralmisMi ? "lg:w-16 lg:overflow-hidden" : "lg:w-64"}
      `}
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 text-xl font-bold tracking-wider text-sidebar-foreground shadow-sm">
        <Link
          href="/dashboard"
          onClick={onKapat}
          className={`transition-opacity hover:opacity-80 ${daralmisMi ? "mx-auto" : "min-w-0 flex-1"}`}
        >
          {daralmisMi ? (
            <span className="text-primary">✦</span>
          ) : (
            <span className="block truncate">
              <span className="mr-2 text-primary">✦</span> Mumex
              <span className="font-light text-muted-foreground">.iL</span>
            </span>
          )}
        </Link>
        <button
          onClick={onKapat}
          className="shrink-0 rounded p-1 text-muted-foreground hover:text-foreground lg:hidden"
          aria-label="Menüyü kapat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-6">
        {menuElemanlari.map((eleman) => {
          const aktifMi = aktifYol.startsWith(eleman.yol);
          return (
            <Link
              key={eleman.yol}
              href={eleman.yol}
              onClick={onKapat}
              title={daralmisMi ? eleman.baslik : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors duration-200 ${
                aktifMi
                  ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground shadow-sm"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm"
              } ${daralmisMi ? "justify-center" : ""}`}
            >
              <eleman.ikon
                className={`h-5 w-5 shrink-0 ${
                  aktifMi ? "text-sidebar-primary-foreground" : "text-muted-foreground"
                }`}
              />
              {!daralmisMi && <span className="truncate">{eleman.baslik}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border bg-sidebar p-3">
        {user ? (
          <div className="space-y-3">
            <Link
              href="/profile"
              onClick={onKapat}
              className={`flex items-center gap-3 rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/40 px-3 py-3 ${daralmisMi ? "justify-center" : ""}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-bold text-sidebar-foreground">
                {user.initials}
              </div>
              {!daralmisMi && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-sidebar-foreground">{user.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.jobTitle}</p>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors hover:bg-sidebar-accent disabled:opacity-70 ${daralmisMi ? "justify-center" : ""}`}
            >
              <LogOut className="h-4 w-4 shrink-0 text-muted-foreground" />
              {!daralmisMi && <span>{isLoggingOut ? "Çıkış yapılıyor..." : "Oturumu kapat"}</span>}
            </button>
          </div>
        ) : null}
      </div>
    </aside>
  );
};
