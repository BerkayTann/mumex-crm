"use client";

import { useState, useEffect } from "react";
import { Settings, Palette, Info, Sun, Moon, Monitor } from "lucide-react";

type Tema = "acik" | "koyu" | "sistem";

const TEMA_SECENEKLERI: { deger: Tema; etiket: string; ikon: React.ElementType; aciklama: string }[] = [
  { deger: "acik", etiket: "Açık", ikon: Sun, aciklama: "Her zaman açık tema" },
  { deger: "koyu", etiket: "Koyu", ikon: Moon, aciklama: "Her zaman koyu tema" },
  { deger: "sistem", etiket: "Sistem", ikon: Monitor, aciklama: "Cihaz ayarını takip et" },
];

export default function AyarlarSayfasi() {
  const [aktifTema, setAktifTema] = useState<Tema>("acik");

  useEffect(() => {
    const kayitliTema = (localStorage.getItem("mumex-tema") as Tema) || "acik";
    setAktifTema(kayitliTema);
  }, []);

  const temayiUygula = (tema: Tema) => {
    setAktifTema(tema);
    localStorage.setItem("mumex-tema", tema);

    if (tema === "koyu") {
      document.documentElement.classList.add("dark");
    } else if (tema === "acik") {
      document.documentElement.classList.remove("dark");
    } else {
      // sistem: medya sorgusuna göre
      const sistemKoyu = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", sistemKoyu);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <Settings className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ayarlar</h1>
          <p className="text-sm text-slate-500">Uygulama tercihlerinizi yönetin</p>
        </div>
      </div>

      {/* GÖRÜNÜM */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <Palette className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-semibold text-slate-800">Görünüm</h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-600 mb-4">Uygulamanın renk temasını seçin.</p>
          <div className="grid grid-cols-3 gap-3">
            {TEMA_SECENEKLERI.map(({ deger, etiket, ikon: Ikon, aciklama }) => (
              <button
                key={deger}
                onClick={() => temayiUygula(deger)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  aktifTema === deger
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Ikon
                  className={`w-6 h-6 ${aktifTema === deger ? "text-indigo-600" : "text-slate-500"}`}
                />
                <span
                  className={`text-sm font-medium ${aktifTema === deger ? "text-indigo-700" : "text-slate-700"}`}
                >
                  {etiket}
                </span>
                <span className="text-xs text-slate-400 text-center">{aciklama}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HAKKINDA */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <Info className="w-5 h-5 text-slate-500" />
          <h2 className="text-base font-semibold text-slate-800">Uygulama Hakkında</h2>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-600">Uygulama Adı</span>
            <span className="text-sm font-medium text-slate-800">Mumex CRM</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-slate-600">Versiyon</span>
            <span className="text-sm font-medium text-slate-800 font-mono">1.0.0-mvp</span>
          </div>
        </div>
      </section>
    </div>
  );
}
