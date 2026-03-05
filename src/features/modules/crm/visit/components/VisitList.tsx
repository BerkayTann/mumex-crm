import React from "react";
import { IVisit, VisitStatus } from "../types";
import { MapPin, PlusCircle, Calendar, DollarSign } from "lucide-react";
import { ICompany } from "../../company/types";
import { IUser } from "../../users/types";
import { IProduct } from "../../product/types";

interface IVisitListProps {
  ziyaretler: IVisit[];
  onYeniZiyaretEkleTiklandi: () => void;
}

export const VisitList: React.FC<IVisitListProps> = ({
  ziyaretler,
  onYeniZiyaretEkleTiklandi,
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-purple-600" />
          Ziyaretler ve Satışlar
        </h1>
        <button
          onClick={onYeniZiyaretEkleTiklandi}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          Yeni Ziyaret / Satış Gir
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Tarih
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Kurum / Doktor
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Satış Detayı
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">
                Toplam Ciro
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ziyaretler.map((ziyaret) => (
              <tr
                key={ziyaret._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(ziyaret.visitDate).toLocaleDateString("tr-TR")}
                  </div>
                  <span
                    className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${ziyaret.status === VisitStatus.COMPLETED ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}
                  >
                    {ziyaret.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {/* Backend'den populate edilerek gelen veriler */}
                  <div className="font-semibold text-slate-800">
                    {(ziyaret.companyId as unknown as ICompany)?.name || "-"}
                  </div>
                  <div className="text-sm text-slate-500">
                    {(ziyaret.userId as unknown as IUser)?.firstName}{" "}
                    {(ziyaret.userId as unknown as IUser)?.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {ziyaret.products.length > 0 ? (
                    <ul className="list-disc pl-4">
                      {ziyaret.products.map((p, idx) => (
                        <li key={idx}>
                          {(p.productId as unknown as IProduct)?.name}{" "}
                          <span className="text-slate-400">
                            ({p.quantity} Adet)
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-400">Ürün satışı yok</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 font-bold text-emerald-600">
                    <DollarSign className="w-4 h-4" />
                    {ziyaret.totalAmount.toLocaleString("tr-TR")} ₺
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ziyaretler.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Henüz hiçbir ziyaret kaydedilmemiş.
          </div>
        )}
      </div>
    </div>
  );
};
