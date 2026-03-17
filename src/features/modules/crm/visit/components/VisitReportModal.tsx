import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { X, Calendar } from "lucide-react";
import { IVisit, VisitStatus } from "../types";
import { ICompany } from "../../company/types";
import { IUser } from "../../users/types";
import { IProduct } from "../../product/types";

interface IVisitReportModalProps {
  acikMi: boolean;
  onKapat: () => void;
  ziyaretler: IVisit[];
}

type Periyot = "haftalik" | "aylik" | "yillik";

const PERIYOT_BILGISI: Record<Periyot, { label: string; gun: number }> = {
  haftalik: { label: "Haftalık", gun: 7 },
  aylik: { label: "Aylık", gun: 30 },
  yillik: { label: "Yıllık", gun: 365 },
};

const STATUS_ETIKET: Record<string, string> = {
  [VisitStatus.COMPLETED]: "Tamamlandı",
  [VisitStatus.PLANNED]: "Planlandı",
  [VisitStatus.CANCELLED]: "İptal Edildi",
};

export const VisitReportModal: React.FC<IVisitReportModalProps> = ({
  acikMi,
  onKapat,
  ziyaretler,
}) => {
  const [seciliPeriyot, setSeciliPeriyot] = useState<Periyot | null>(null);

  // Filtreleme
  const filtrelenmisZiyaretler = useMemo(() => {
    if (!seciliPeriyot) return [];

    const gunSayisi = PERIYOT_BILGISI[seciliPeriyot].gun;
    const bugun = new Date();
    bugun.setHours(23, 59, 59, 999);

    const baslangic = new Date(bugun);
    baslangic.setDate(baslangic.getDate() - gunSayisi + 1);
    baslangic.setHours(0, 0, 0, 0);

    return ziyaretler.filter((z) => {
      const tarih = new Date(z.visitDate);
      return tarih >= baslangic && tarih <= bugun;
    });
  }, [ziyaretler, seciliPeriyot]);

  // Tarih aralığı hesaplama (gösterim için)
  const tarihAraligi = useMemo(() => {
    if (!seciliPeriyot) return { baslangic: "", bitis: "" };

    const gunSayisi = PERIYOT_BILGISI[seciliPeriyot].gun;
    const bugun = new Date();
    bugun.setHours(23, 59, 59, 999);

    const baslangic = new Date(bugun);
    baslangic.setDate(baslangic.getDate() - gunSayisi + 1);
    baslangic.setHours(0, 0, 0, 0);

    return {
      baslangic: baslangic.toLocaleDateString("tr-TR"),
      bitis: bugun.toLocaleDateString("tr-TR"),
    };
  }, [seciliPeriyot]);

  // Excel'e dönüştür
  const exceleDonustur = () => {
    if (!seciliPeriyot || filtrelenmisZiyaretler.length === 0) return;

    const satirlar = filtrelenmisZiyaretler.map((z) => {
      const kurum = z.companyId as unknown as ICompany;
      const kisi = z.userId as unknown as IUser;
      const urunler = z.products
        .map((p) => {
          const urun = p.productId as unknown as IProduct;
          return `${urun?.name || "-"} (${p.quantity})`;
        })
        .join(" | ");

      return {
        Tarih: new Date(z.visitDate).toLocaleDateString("tr-TR"),
        Kurum: kurum?.name || "-",
        Doktor: `${kisi?.firstName || ""} ${kisi?.lastName || ""}`.trim(),
        Ürünler: urunler,
        "Toplam Tutar (₺)": z.totalAmount,
        Durum: STATUS_ETIKET[z.status] || z.status,
        Kargo: z.cargoStatus || "-",
        Notlar: z.notes || "-",
      };
    });

    const ws = XLSX.utils.json_to_sheet(satirlar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ziyaretler");

    const periyotAd = PERIYOT_BILGISI[seciliPeriyot].label;
    const tarihStr = new Date().toLocaleDateString("tr-TR").replace(/\./g, "-");
    XLSX.writeFile(wb, `Mumex.iL_Raporu_${periyotAd}_${tarihStr}.xlsx`);
  };

  if (!acikMi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Ziyaret Raporu Oluştur</h2>
          <button
            onClick={onKapat}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Period Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["haftalik", "aylik", "yillik"] as const).map((periyot) => (
              <button
                key={periyot}
                onClick={() => setSeciliPeriyot(periyot)}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer text-left ${
                  seciliPeriyot === periyot
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-2 mb-1">
                  <Calendar className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-800">
                    {PERIYOT_BILGISI[periyot].label}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Son {PERIYOT_BILGISI[periyot].gun} gün
                </p>
              </button>
            ))}
          </div>

          {/* Info Text */}
          {seciliPeriyot && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">
                  {filtrelenmisZiyaretler.length} kayıt bulundu
                </span>
                {filtrelenmisZiyaretler.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    ({tarihAraligi.baslangic} – {tarihAraligi.bitis})
                  </span>
                )}
              </p>
            </div>
          )}

          {seciliPeriyot && filtrelenmisZiyaretler.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-700">
                Seçilen tarih aralığında ziyaret kaydı bulunamadı.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onKapat}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
          >
            Kapat
          </button>
          <button
            onClick={exceleDonustur}
            disabled={
              !seciliPeriyot || filtrelenmisZiyaretler.length === 0
            }
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Dışa Aktar (.xlsx)
          </button>
        </div>
      </div>
    </div>
  );
};
