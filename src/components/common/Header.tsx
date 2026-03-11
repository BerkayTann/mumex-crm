"use client";

import React from "react";
import { Bell, Search, Menu } from "lucide-react";

interface IHeaderProps {
  onMenuAc: () => void;
}

export const Header = ({ onMenuAc }: IHeaderProps) => {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 shadow-sm z-10 shrink-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Hamburger - sadece mobilde */}
        <button
          onClick={onMenuAc}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors shrink-0"
          aria-label="Menüyü aç"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Arama Alanı */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-md flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Kurum, doktor veya ürün ara..."
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Bildirimler */}
      <div className="flex items-center gap-4 ml-4 shrink-0">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
