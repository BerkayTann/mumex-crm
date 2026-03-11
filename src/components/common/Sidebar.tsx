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
  X,
} from "lucide-react";

interface IMenuElemani {
  baslik: string;
  yol: string;
  ikon: React.ElementType;
}

const menuElemanlari: IMenuElemani[] = [
  { baslik: "Dashboard", yol: "/dashboard", ikon: LayoutDashboard },
  { baslik: "Kurumlar", yol: "/company", ikon: Building2 },
  { baslik: "Kişiler (Doktorlar)", yol: "/users", ikon: Users },
  { baslik: "Ürünler", yol: "/product", ikon: Package },
  { baslik: "Ziyaretler", yol: "/visit", ikon: MapPin },
];

interface ISidebarProps {
  acikMi: boolean;
  onKapat: () => void;
}

export const Sidebar = ({ acikMi, onKapat }: ISidebarProps) => {
  const aktifYol = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300
        lg:static lg:translate-x-0 lg:z-auto
        ${acikMi ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Logo ve Marka Alanı */}
      <div className="h-16 flex items-center justify-between px-6 bg-slate-950 text-white font-bold text-xl tracking-wider shrink-0">
        <span>
          <span className="text-blue-500 mr-2">✦</span> Mumex
          <span className="text-slate-400 font-light">.in</span>
        </span>
        <button
          onClick={onKapat}
          className="lg:hidden p-1 text-slate-400 hover:text-white rounded"
          aria-label="Menüyü kapat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigasyon Linkleri */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
        {menuElemanlari.map((eleman) => {
          const aktifMi = aktifYol.startsWith(eleman.yol);

          return (
            <Link
              key={eleman.yol}
              href={eleman.yol}
              onClick={onKapat}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                aktifMi
                  ? "bg-blue-600 text-white font-medium shadow-md"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <eleman.ikon
                className={`w-5 h-5 shrink-0 ${aktifMi ? "text-white" : "text-slate-400"}`}
              />
              {eleman.baslik}
            </Link>
          );
        })}
      </nav>

      {/* Alt Kullanıcı Alanı */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold shrink-0">
            AE
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">Ali Yılmaz</p>
            <p className="text-xs text-slate-500 truncate">Kıdemli Mümessil</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
