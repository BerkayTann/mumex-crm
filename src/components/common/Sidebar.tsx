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
  Settings,
  X,
} from "lucide-react";

interface IMenuElemani {
  baslik: string;
  yol: string;
  ikon: React.ElementType;
}

const menuElemanlari: IMenuElemani[] = [
  { baslik: "Dashboard", yol: "/dashboard", ikon: LayoutDashboard },
  { baslik: "Kişiler (Doktorlar)", yol: "/users", ikon: Users },
  { baslik: "Kurumlar", yol: "/company", ikon: Building2 },
  { baslik: "Ürünler", yol: "/product", ikon: Package },
  { baslik: "Ziyaretler", yol: "/visit", ikon: MapPin },
];

interface ISidebarProps {
  acikMi: boolean;
  daralmisMi: boolean;
  onKapat: () => void;
}

export const Sidebar = ({ acikMi, daralmisMi, onKapat }: ISidebarProps) => {
  const aktifYol = usePathname();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 bg-slate-900 text-slate-300 flex flex-col
        transition-all duration-300 w-64
        lg:relative lg:z-auto lg:translate-x-0
        ${acikMi ? "translate-x-0" : "-translate-x-full"}
        ${daralmisMi ? "lg:w-16 lg:overflow-hidden" : "lg:w-64"}
      `}
    >
      {/* Logo ve Marka Alanı */}
      <div className="h-16 flex items-center justify-between px-4 bg-slate-950 text-white font-bold text-xl tracking-wider shrink-0">
        <Link
          href="/dashboard"
          onClick={onKapat}
          className={`hover:opacity-80 transition-opacity ${daralmisMi ? "mx-auto" : "flex-1 min-w-0"}`}
        >
          {daralmisMi ? (
            <span className="text-blue-500">✦</span>
          ) : (
            <span className="truncate block">
              <span className="text-blue-500 mr-2">✦</span> Mumex
              <span className="text-slate-400 font-light">.in</span>
            </span>
          )}
        </Link>
        <button
          onClick={onKapat}
          className="lg:hidden p-1 text-slate-400 hover:text-white rounded shrink-0"
          aria-label="Menüyü kapat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigasyon Linkleri */}
      <nav className="flex-1 py-6 flex flex-col gap-1 px-2 overflow-y-auto">
        {menuElemanlari.map((eleman) => {
          const aktifMi = aktifYol.startsWith(eleman.yol);
          return (
            <Link
              key={eleman.yol}
              href={eleman.yol}
              onClick={onKapat}
              title={daralmisMi ? eleman.baslik : undefined}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200
                ${aktifMi ? "bg-blue-600 text-white font-medium shadow-md" : "hover:bg-slate-800 hover:text-white"}
                ${daralmisMi ? "justify-center" : ""}
              `}
            >
              <eleman.ikon
                className={`w-5 h-5 shrink-0 ${aktifMi ? "text-white" : "text-slate-400"}`}
              />
              {!daralmisMi && <span className="truncate">{eleman.baslik}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Ayarlar Linki */}
      <div className="px-2 pb-2">
        <Link
          href="/settings"
          onClick={onKapat}
          title={daralmisMi ? "Ayarlar" : undefined}
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 hover:bg-slate-800 hover:text-white
            ${aktifYol.startsWith("/settings") ? "bg-blue-600 text-white font-medium" : ""}
            ${daralmisMi ? "justify-center" : ""}
          `}
        >
          <Settings
            className={`w-5 h-5 shrink-0 ${aktifYol.startsWith("/settings") ? "text-white" : "text-slate-400"}`}
          />
          {!daralmisMi && <span className="truncate">Ayarlar</span>}
        </Link>
      </div>

      {/* Alt Kullanıcı Alanı */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
        <div className={`flex items-center gap-3 ${daralmisMi ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold shrink-0 text-sm">
            AE
          </div>
          {!daralmisMi && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Ali Yılmaz</p>
              <p className="text-xs text-slate-500 truncate">Kıdemli Mümessil</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
