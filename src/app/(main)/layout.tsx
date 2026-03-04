import React from "react";
import { Sidebar, Header } from "@/components/common";

// Sadece CRM giriş yapılmış ekranlar için geçerli düzen
export default function AnaUygulamaDuzeni({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sol Menü (Sabit) */}
      <Sidebar />

      {/* Sağ Taraf (İçerik Alanı) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Üst Bar */}
        <Header />

        {/* Ana İçerik (Sayfalar buraya render olacak) */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
