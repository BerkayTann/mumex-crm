import React, { useState, useMemo } from "react";
import { IVisit, VisitStatus } from "../types";
import {
  MapPin,
  PlusCircle,
  Calendar,
  Pencil,
  Trash2,
  Search,
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileDown,
} from "lucide-react";
import { ICompany } from "../../company/types";
import { IUser } from "../../users/types";
import { IProduct } from "../../product/types";
import { MoneyText } from "@/components/common/MoneyText";

export type VisitSortField = "date" | "company" | "totalAmount";

interface IVisitListProps {
  ziyaretler: IVisit[];
  onYeniZiyaretEkleTiklandi: () => void;
  onDuzenleTiklandi: (ziyaret: IVisit) => void;
  onSilTiklandi: (id: string) => void;
  onRaporlaTiklandi: () => void;
}

export const VisitList: React.FC<IVisitListProps> = ({
  ziyaretler,
  onYeniZiyaretEkleTiklandi,
  onDuzenleTiklandi,
  onSilTiklandi,
  onRaporlaTiklandi,
}) => {
  const [aramaMetni, setAramaMetni] = useState("");
  const [durumFiltresi, setDurumFiltresi] = useState<string>("TUMU");
  const [tarihFiltresi, setTarihFiltresi] = useState<string>("");
  const [detayModalZiyaret, setDetayModalZiyaret] = useState<IVisit | null>(
    null,
  );

  const [siralaAlan, setSiralaAlan] = useState<VisitSortField>("date");
  const [siralaYon, setSiralaYon] = useState<"desc" | "asc">("desc");

  const siralamaDegistir = (alan: VisitSortField) => {
    if (siralaAlan === alan) {
      setSiralaYon(siralaYon === "asc" ? "desc" : "asc");
    } else {
      setSiralaAlan(alan);
      setSiralaYon("desc"); // when clicking new column, prefer desc.
    }
  };

  const renderSiralamaOki = (alan: VisitSortField) => {
    if (siralaAlan !== alan)
      return (
        <ArrowUpDown className="w-4 h-4 text-slate-300 ml-1 inline-block" />
      );
    return siralaYon === "asc" ? (
      <ArrowUp className="w-4 h-4 text-slate-700 ml-1 inline-block" />
    ) : (
      <ArrowDown className="w-4 h-4 text-slate-700 ml-1 inline-block" />
    );
  };

  const filtrelenmisZiyaretler = useMemo(() => {
    const filtrelenmis = ziyaretler.filter((z) => {
      const kurumAdi = (
        (z.companyId as unknown as ICompany)?.name || ""
      ).toLowerCase();
      const doktorAd = (
        (z.userId as unknown as IUser)?.firstName || ""
      ).toLowerCase();
      const doktorSoyad = (
        (z.userId as unknown as IUser)?.lastName || ""
      ).toLowerCase();

      const urunAdlari = z.products
        .map((p) =>
          ((p.productId as unknown as IProduct)?.name || "").toLowerCase(),
        )
        .join(" ");

      const aranacakMetin = `${kurumAdi} ${doktorAd} ${doktorSoyad} ${urunAdlari}`;

      const aramaEslesiyor = aranacakMetin.includes(aramaMetni.toLowerCase());
      const durumEslesiyor =
        durumFiltresi === "TUMU" || z.status === durumFiltresi;

      const zTarih = new Date(z.visitDate).toISOString().split("T")[0];
      const tarihEslesiyor = tarihFiltresi ? zTarih === tarihFiltresi : true;

      return aramaEslesiyor && durumEslesiyor && tarihEslesiyor;
    });

    filtrelenmis.sort((a, b) => {
      let degerA: string | number = 0;
      let degerB: string | number = 0;

      if (siralaAlan === "date") {
        degerA = new Date(a.visitDate).getTime();
        degerB = new Date(b.visitDate).getTime();
      } else if (siralaAlan === "company") {
        degerA = (
          (a.companyId as unknown as ICompany)?.name || ""
        ).toLowerCase();
        degerB = (
          (b.companyId as unknown as ICompany)?.name || ""
        ).toLowerCase();
      } else if (siralaAlan === "totalAmount") {
        degerA = a.totalAmount;
        degerB = b.totalAmount;
      }

      if (degerA < degerB) return siralaYon === "asc" ? -1 : 1;
      if (degerA > degerB) return siralaYon === "asc" ? 1 : -1;
      return 0;
    });

    return filtrelenmis;
  }, [
    ziyaretler,
    aramaMetni,
    durumFiltresi,
    tarihFiltresi,
    siralaAlan,
    siralaYon,
  ]);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-purple-600" />
          Ziyaretler ve Satışlar
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onYeniZiyaretEkleTiklandi}
            className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm flex-1 sm:flex-none"
          >
            <PlusCircle className="w-5 h-5" />
            Yeni Ziyaret / Satış Gir
          </button>
          <button
            onClick={onRaporlaTiklandi}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm flex-1 sm:flex-none"
          >
            <FileDown className="w-5 h-5" />
            Raporla
          </button>
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4 md:grid-cols-[minmax(0,1.35fr)_minmax(0,220px)_minmax(0,220px)] md:items-end">
        <div className="flex flex-col gap-1.5">
          <label className="pl-1 text-xs font-medium text-slate-400">Arama</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2.5 border-b-2 border-transparent hover:border-slate-200 focus:border-purple-500 rounded-lg bg-slate-50/50 text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 sm:text-sm transition-all"
              placeholder="Kurum, doktor veya ürün ara..."
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 pl-1 text-xs font-medium text-slate-400">
            <Calendar className="h-3 w-3" />
            Tarih
          </label>
          <input
            type="date"
            className="w-full py-2.5 px-3 border-b-2 border-transparent hover:border-slate-200 focus:border-purple-500 rounded-lg bg-slate-50/50 text-slate-700 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all cursor-pointer"
            value={tarihFiltresi}
            onChange={(e) => setTarihFiltresi(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 pl-1 text-xs font-medium text-slate-400">
            <Filter className="h-3 w-3" />
            Durum
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
            <select
              className="block w-full pl-9 pr-10 py-2.5 border-b-2 border-transparent hover:border-slate-200 focus:border-purple-500 rounded-lg bg-slate-50/50 text-slate-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 sm:text-sm transition-all appearance-none cursor-pointer"
              value={durumFiltresi}
              onChange={(e) => setDurumFiltresi(e.target.value)}
            >
              <option value="TUMU">Tüm Durumlar</option>
              <option value={VisitStatus.COMPLETED}>Tamamlandı</option>
              <option value={VisitStatus.PLANNED}>Planlandı</option>
              <option value={VisitStatus.CANCELLED}>İptal Edildi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th
                className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                onClick={() => siralamaDegistir("date")}
              >
                Tarih {renderSiralamaOki("date")}
              </th>
              <th
                className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                onClick={() => siralamaDegistir("company")}
              >
                Müşteri(Kurum/Doktor) {renderSiralamaOki("company")}
              </th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600">
                Kargo
              </th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600">
                Ürün İsmi
              </th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 text-center">
                Ürün Miktarı
              </th>
              <th
                className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 text-right cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                onClick={() => siralamaDegistir("totalAmount")}
              >
                Toplam {renderSiralamaOki("totalAmount")}
              </th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 text-right">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrelenmisZiyaretler.map((ziyaret) => (
              <tr
                key={ziyaret._id}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setDetayModalZiyaret(ziyaret)}
              >
                <td className="px-4 sm:px-5 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(ziyaret.visitDate).toLocaleDateString("tr-TR")}
                  </div>
                  <span
                    className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                      ziyaret.status === VisitStatus.COMPLETED
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {ziyaret.status}
                  </span>
                </td>
                <td className="px-4 sm:px-5 py-3">
                  <div className="font-semibold text-slate-800">
                    {(ziyaret.companyId as unknown as ICompany)?.name || "-"}
                  </div>
                  <div className="text-sm text-slate-500">
                    {(ziyaret.userId as unknown as IUser)?.firstName}{" "}
                    {(ziyaret.userId as unknown as IUser)?.lastName}
                  </div>
                </td>
                <td className="px-4 sm:px-5 py-3">
                  {ziyaret.cargoStatus ? (
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-700 rounded-full">
                      {ziyaret.cargoStatus}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">-</span>
                  )}
                </td>
                <td className="px-4 sm:px-5 py-3">
                  <div className="flex flex-col gap-1">
                    {ziyaret.products.length > 0 ? (
                      ziyaret.products.map((p, idx) => (
                        <span
                          key={idx}
                          className="block text-sm font-medium text-slate-700 whitespace-nowrap"
                        >
                          {(p.productId as unknown as IProduct)?.name ||
                            "Bilinmiyor"}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-sm">Ürün yok</span>
                    )}
                  </div>
                </td>
                <td className="px-4 sm:px-5 py-3 text-center">
                  <div className="flex flex-col gap-1">
                    {ziyaret.products.length > 0 ? (
                      ziyaret.products.map((p, idx) => (
                        <span
                          key={idx}
                          className="block text-sm text-slate-600"
                        >
                          {p.quantity}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </div>
                </td>
                <td className="px-4 sm:px-5 py-3 text-right">
                  <MoneyText
                    as="div"
                    value={ziyaret.totalAmount}
                    className="font-bold"
                  />
                </td>
                <td className="px-4 sm:px-5 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onDuzenleTiklandi(ziyaret); }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Düzenle"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onSilTiklandi(ziyaret._id); }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrelenmisZiyaretler.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            Arama kriterlerine uygun ziyaret bulunamadı.
          </div>
        )}
      </div>

      {detayModalZiyaret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                Ziyaret ve Ürün Meta Verileri
              </h3>
              <button
                onClick={() => setDetayModalZiyaret(null)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                <div>
                  <span className="block text-slate-500 text-xs mb-1">
                    Müşteri
                  </span>
                  <span className="font-semibold text-slate-800">
                    {(detayModalZiyaret.companyId as unknown as ICompany)
                      ?.name || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 text-xs mb-1">
                    Doktor / Yetkili
                  </span>
                  <span className="font-medium text-slate-700">
                    {(detayModalZiyaret.userId as unknown as IUser)?.firstName}{" "}
                    {(detayModalZiyaret.userId as unknown as IUser)?.lastName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {detayModalZiyaret.plannedDate && (
                  <div className="col-span-1">
                    <span className="block text-slate-500 text-xs mb-1">
                      Planlanan Tarih
                    </span>
                    <span className="font-semibold text-slate-800">
                      {new Date(detayModalZiyaret.plannedDate).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                )}
                {detayModalZiyaret.cargoDate && (
                  <div className="col-span-1">
                    <span className="block text-slate-500 text-xs mb-1">
                      Kargo Tarihi
                    </span>
                    <span className="font-semibold text-slate-800">
                      {new Date(detayModalZiyaret.cargoDate).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                )}
                {detayModalZiyaret.deliveryDate && (
                  <div className="col-span-1">
                    <span className="block text-slate-500 text-xs mb-1">
                      Teslim Tarihi
                    </span>
                    <span className="font-semibold text-slate-800">
                      {new Date(detayModalZiyaret.deliveryDate).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-2 border-b pb-1 text-sm">
                  Ürün Kur Detayları
                </h4>
                {detayModalZiyaret.products.length > 0 ? (
                  <div className="space-y-3">
                    {detayModalZiyaret.products.map((p, idx) => (
                      <div
                        key={idx}
                        className="bg-white border rounded-lg p-3 shadow-sm text-sm flex flex-col gap-2"
                      >
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-bold text-slate-800">
                            {(p.productId as unknown as IProduct)?.name}
                          </span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold">
                            {p.quantity} {p.unit || "Adet"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
                          <div>
                            <span className="text-slate-500 text-xs block">
                              Orijinal Satış Kuru
                            </span>
                            <span className="font-semibold text-blue-700">
                              {p.unitPrice?.toLocaleString("tr-TR")}{" "}
                              {p.currency || "TRY"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs block">
                              İşlem Gördüğü Çeviri
                            </span>
                            <span className="font-medium text-emerald-700">
                              <MoneyText
                                value={p.unitPriceInTRY ?? p.unitPrice}
                              />
                            </span>
                          </div>
                          <div className="col-span-2 bg-slate-50 p-2 rounded mt-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500">
                                Kayıt Edilen Satır Toplamı (TRY)
                              </span>
                              <MoneyText
                                value={p.totalPrice}
                                as="span"
                                className="text-sm font-bold text-slate-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm py-4 text-center bg-slate-50 rounded">
                    Bu ziyarette ürün satışı gerçekleşmemiş.
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="text-sm text-slate-500">
                Ziyaret Toplam Cirosu:
              </span>
              <MoneyText
                value={detayModalZiyaret.totalAmount}
                as="span"
                className="text-lg font-bold"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
