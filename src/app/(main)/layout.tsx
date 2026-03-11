import React from "react";
import { AppShell } from "@/components/common";

export default function AnaUygulamaDuzeni({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
