import React from "react";
import { Bell, Search } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
      {/* Arama Alanı (Şimdilik Görsel) */}
      <div className="flex items-center bg-slate-100 px-3 py-2 rounded-md w-96">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input
          type="text"
          placeholder="Kurum, doktor veya ürün ara..."
          className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
        />
      </div>

      {/* Bildirimler */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
