import type { Metadata } from "next";
import { Inter } from "next/font/google";
// CSS dosyamızı her yerden güvenle bulabilmesi için @ kullanıyoruz
import "@/app/globals.css";
import { QueryProvider } from "@/core/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mumex.in - CRM",
  description: "İlaç Mümessilleri için Yeni Nesil CRM",
};

// En tepe HTML iskeletimiz
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
