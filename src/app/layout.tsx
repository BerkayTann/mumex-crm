import type { Metadata } from "next";
import "@/app/globals.css";
import { QueryProvider } from "@/core/providers/QueryProvider";
import { ThemeProvider } from "@/core/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Mumex.iL - CRM",
  description: "Mumex.iL, ilaç mümessilleri için yeni nesil CRM",
};

// En tepe HTML iskeletimiz
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
