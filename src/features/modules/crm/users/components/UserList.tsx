import React from "react";
import { IUser, UserTitle } from "../types";
import { ICompany } from "../../company/types";
import { Users, UserPlus, Building } from "lucide-react";

interface IUserListProps {
  kisiler: IUser[];
  onYeniKisiEkleTiklandi: () => void;
}

export const UserList: React.FC<IUserListProps> = ({
  kisiler,
  onYeniKisiEkleTiklandi,
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Kişiler ve Doktorlar
        </h1>
        <button
          onClick={onYeniKisiEkleTiklandi}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-all shadow-sm"
        >
          <UserPlus className="w-5 h-5" />
          Yeni Kişi Ekle
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Ad Soyad / Unvan
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Uzmanlık
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Çalıştığı Kurum
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                İletişim
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kisiler.map((kisi) => (
              <tr
                key={kisi._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">
                    {kisi.firstName} {kisi.lastName}
                  </div>
                  <div className="text-xs text-slate-500 uppercase">
                    {kisi.title}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {kisi.specialty || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" />
                    {/* Populate ettiğimiz için companyId artık bir nesne olarak geliyor */}
                    {(kisi.companyId as unknown as ICompany)?.name ||
                      "Bilinmiyor"}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {kisi.email || kisi.phone || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {kisiler.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Kayıtlı kişi bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};
