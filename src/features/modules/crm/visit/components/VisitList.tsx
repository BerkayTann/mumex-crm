import React from "react";
import { IVisit, VisitStatus } from "../types";
import { MapPin, PlusCircle, Calendar, Pencil, Trash2 } from "lucide-react";
import { ICompany } from "../../company/types";
import { IUser } from "../../users/types";
import { IProduct } from "../../product/types";

interface IVisitListProps {
  ziyaretler: IVisit[];
  onYeniZiyaretEkleTiklandi: () => void;
  onDuzenleTiklandi: (ziyaret: IVisit) => void;
  onSilTiklandi: (id: string) => void;
}

export const VisitList: React.FC<IVisitListProps> = ({
  ziyaretler,
  onYeniZiyaretEkleTiklandi,
  onDuzenleTiklandi,
  onSilTiklandi,
}) => {
  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-purple-600" />
          Ziyaretler ve Satışlar
        </h1>
        <button
          onClick={onYeniZiyaretEkleTiklandi}
          className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm w-full sm:w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          Yeni Ziyaret / Satış Gir
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600">Tarih</th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600">
                Kurum / Doktor
              </th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600">
                Satış Detayı
              </th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 text-right">
                Toplam Ciro
              </th>
              <th className="px-4 sm:px-5 py-3 text-sm font-semibold text-slate-600 text-right">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ziyaretler.map((ziyaret) => (
              <tr key={ziyaret._id} className="hover:bg-slate-50 transition-colors">
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
                <td className="px-4 sm:px-5 py-3 text-sm text-slate-600">
                  {ziyaret.products.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {ziyaret.products.map((p, idx) => (
                        <li key={idx}>
                          {(p.productId as unknown as IProduct)?.name}{" "}
                          <span className="text-slate-400">× {p.quantity}</span>
                          {p.currency && p.currency !== "TRY" ? (
                            <span className="ml-1 text-slate-500">
                              {" — "}
                              <span className="font-medium">{p.unitPrice?.toLocaleString("tr-TR")}</span>
                              <span className="text-blue-600 font-semibold ml-0.5"> {p.currency}</span>
                              <span className="text-slate-400 text-xs ml-1">
                                (≈ {p.totalPrice.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺)
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs ml-1">
                              — {p.totalPrice.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-400">Ürün satışı yok</span>
                  )}
                </td>
                <td className="px-4 sm:px-5 py-3 text-right">
                  <div className="font-bold text-emerald-600">
                    {ziyaret.totalAmount.toLocaleString("tr-TR")} ₺
                  </div>
                </td>
                <td className="px-4 sm:px-5 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onDuzenleTiklandi(ziyaret)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Düzenle"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSilTiklandi(ziyaret._id)}
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
        {ziyaretler.length === 0 && (
          <div className="text-center py-10 text-slate-400">Henüz hiçbir ziyaret kaydedilmemiş.</div>
        )}
      </div>
    </div>
  );
};
