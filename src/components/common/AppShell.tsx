"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [mobilAcik, setMobilAcik] = useState(false);
  const [daralmisMi, setDaralmisMi] = useState(false);

  // Sayfa yüklenirken localStorage'dan tema uygula
  useEffect(() => {
    const tema = localStorage.getItem("mumex-tema") || "acik";
    if (tema === "koyu") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const onMenuToggle = () => {
    setMobilAcik((v) => !v);   // mobile overlay aç/kapa
    setDaralmisMi((v) => !v);  // desktop daralt/genişlet
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Mobil Backdrop */}
      {mobilAcik && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobilAcik(false)}
        />
      )}

      {/* Sol Menü */}
      <Sidebar
        acikMi={mobilAcik}
        daralmisMi={daralmisMi}
        onKapat={() => setMobilAcik(false)}
      />

      {/* Sağ Taraf (İçerik Alanı) */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header onMenuAc={onMenuToggle} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 dark:bg-slate-900">{children}</main>
      </div>
    </div>
  );
};
