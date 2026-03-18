"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { NotificationBadge } from "../components/NotificationBadge";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useBildirimleriGetir } from "../service/queries/useNotificationQueries";
import { useNotificationStore } from "../store/useNotificationStore";

export const NotificationContainer = () => {
  const [acikMi, acikMiAyarla] = useState(false);
  const referans = useRef<HTMLDivElement>(null);

  const { data: tumBildirimler = [] } = useBildirimleriGetir();
  const { kapatilmisBildirimIdleri, bildirimKapat, tumunuOkunduIsaretle } =
    useNotificationStore();

  // Kapatılmamış bildirimleri filtrele
  const gorunurBildirimler = useMemo(() => {
    return tumBildirimler.filter(
      (b) => !kapatilmisBildirimIdleri.includes(b.id)
    );
  }, [tumBildirimler, kapatilmisBildirimIdleri]);

  // Dışarı tıklama ile kapat
  const disariTiklandiHandler = useCallback((e: MouseEvent) => {
    if (referans.current && !referans.current.contains(e.target as Node)) {
      acikMiAyarla(false);
    }
  }, []);

  useEffect(() => {
    if (acikMi) {
      document.addEventListener("mousedown", disariTiklandiHandler);
    }
    return () => {
      document.removeEventListener("mousedown", disariTiklandiHandler);
    };
  }, [acikMi, disariTiklandiHandler]);

  const onTumunuOku = useCallback(() => {
    tumunuOkunduIsaretle();
    // Tüm görünür bildirimleri kapat
    for (const b of gorunurBildirimler) {
      bildirimKapat(b.id);
    }
    acikMiAyarla(false);
  }, [gorunurBildirimler, bildirimKapat, tumunuOkunduIsaretle]);

  return (
    <div ref={referans} className="relative">
      <NotificationBadge
        bildirimSayisi={gorunurBildirimler.length}
        onTiklandi={() => acikMiAyarla((onceki) => !onceki)}
      />
      <NotificationDropdown
        bildirimler={gorunurBildirimler}
        acikMi={acikMi}
        onBildirimKapat={bildirimKapat}
        onTumunuOkunduIsaretle={onTumunuOku}
      />
    </div>
  );
};
