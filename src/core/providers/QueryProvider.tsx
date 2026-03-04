"use client"; // Bu bileşen client-side (tarayıcı) tarafında çalışacak

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

// Uygulamamızı sarmalayacak olan ana Provider bileşeni
export const QueryProvider = ({ children }: { children: ReactNode }) => {
  // QueryClient'ı state içinde tutuyoruz ki Next.js renderları arasında kaybolmasın
  const [sorguIstemcisi] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // Veriler 5 dakika boyunca taze (fresh) kabul edilecek
            refetchOnWindowFocus: false, // Pencereye geri dönünce otomatik yenilemeyi kapatıyoruz
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={sorguIstemcisi}>
      {children}
    </QueryClientProvider>
  );
};
