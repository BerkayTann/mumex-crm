import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface INotificationState {
  kapatilmisBildirimIdleri: string[];
  sonGorulmeTarihi: string | null;
  bildirimKapat: (id: string) => void;
  tumunuOkunduIsaretle: () => void;
  sifirla: () => void;
}

export const useNotificationStore = create<INotificationState>()(
  persist(
    (set) => ({
      kapatilmisBildirimIdleri: [],
      sonGorulmeTarihi: null,

      bildirimKapat: (id: string) =>
        set((durum) => ({
          kapatilmisBildirimIdleri: [...durum.kapatilmisBildirimIdleri, id],
        })),

      tumunuOkunduIsaretle: () =>
        set({
          sonGorulmeTarihi: new Date().toISOString(),
        }),

      sifirla: () =>
        set({
          kapatilmisBildirimIdleri: [],
          sonGorulmeTarihi: null,
        }),
    }),
    {
      name: 'mumex-bildirimler', // localStorage key
    }
  )
);
