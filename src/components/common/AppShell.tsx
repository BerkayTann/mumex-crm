"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [mobilAcik, setMobilAcik] = useState(false);
  const [daralmisMi, setDaralmisMi] = useState(false);

  const onMenuToggle = () => {
    setMobilAcik((v) => !v);
    setDaralmisMi((v) => !v);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {mobilAcik && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobilAcik(false)} />
      )}

      <Sidebar acikMi={mobilAcik} daralmisMi={daralmisMi} onKapat={() => setMobilAcik(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
        <Header onMenuAc={onMenuToggle} />
        <main className="flex-1 overflow-y-auto bg-background p-4 text-foreground lg:p-6">{children}</main>
      </div>
    </div>
  );
};
