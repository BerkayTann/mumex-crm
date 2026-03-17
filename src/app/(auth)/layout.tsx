import React from "react";
import { girisYapmissaYonlendir } from "@/features/auth/lib/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await girisYapmissaYonlendir();
  return children;
}

