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
} from "lucide-react";

// Menü elemanlarımızın tipini belirliyoruz
interface IMenuElemani {
  baslik: string;
  yol: string;
  ikon: React.ElementType;
}

// Menü listemiz (Türkçe değişken kuralımıza uyarak)
const menuElemanlari: IMenuElemani[] = [
  { baslik: "Dashboard", yol: "/dashboard", ikon: LayoutDashboard },
  { baslik: "Kurumlar", yol: "/company", ikon: Building2 },
  { baslik: "Kişiler (Doktorlar)", yol: "/users", ikon: Users },
  { baslik: "Ürünler", yol: "/product", ikon: Package },
  { baslik: "Ziyaretler", yol: "/visit", ikon: MapPin },
];

export const Sidebar = () => {
  const aktifYol = usePathname(); // Mevcut URL'i alıyoruz

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col transition-all duration-300">
      {/* Logo ve Marka Alanı */}
      <div className="h-16 flex items-center px-6 bg-slate-950 text-white font-bold text-xl tracking-wider">
        <span className="text-blue-500 mr-2">✦</span> Mumex
        <span className="text-slate-400 font-light">.in</span>
      </div>

      {/* Navigasyon Linkleri */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
        {menuElemanlari.map((eleman) => {
          const aktifMi = aktifYol.startsWith(eleman.yol); // Şu an bu sayfada mıyız?

          return (
            <Link
              key={eleman.yol}
              href={eleman.yol}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                aktifMi
                  ? "bg-blue-600 text-white font-medium shadow-md"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <eleman.ikon
                className={`w-5 h-5 ${aktifMi ? "text-white" : "text-slate-400"}`}
              />
              {eleman.baslik}
            </Link>
          );
        })}
      </nav>

      {/* Alt Kullanıcı Alanı (Şimdilik Statik) */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
            AE
          </div>
          <div>
            <p className="text-sm font-medium text-white">Ali Yılmaz</p>
            <p className="text-xs text-slate-500">Kıdemli Mümessil</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
