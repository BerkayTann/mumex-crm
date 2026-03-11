"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [sidebarAcikMi, setSidebarAcikMi] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Mobil Backdrop */}
      {sidebarAcikMi && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarAcikMi(false)}
        />
      )}

      {/* Sol Menü */}
      <Sidebar acikMi={sidebarAcikMi} onKapat={() => setSidebarAcikMi(false)} />

      {/* Sağ Taraf (İçerik Alanı) */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header onMenuAc={() => setSidebarAcikMi(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
