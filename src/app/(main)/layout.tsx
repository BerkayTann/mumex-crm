import React from "react";
import { AppShell } from "@/components/common";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { kimlikDogrulamaZorunlu } from "@/features/auth/lib/server";

export default async function AnaUygulamaDuzeni({
  children,
}: {
  children: React.ReactNode;
}) {
  const kullanici = await kimlikDogrulamaZorunlu();

  return (
    <AuthProvider initialUser={kullanici}>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
