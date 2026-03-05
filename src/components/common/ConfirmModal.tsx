import React from "react";
import { AlertTriangle } from "lucide-react";

interface IConfirmModalProps {
  acikMi: boolean;
  baslik: string;
  mesaj: string;
  onOnayla: () => void;
  onIptal: () => void;
  yukleniyorMu?: boolean;
}

export const ConfirmModal: React.FC<IConfirmModalProps> = ({
  acikMi,
  baslik,
  mesaj,
  onOnayla,
  onIptal,
  yukleniyorMu,
}) => {
  if (!acikMi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">{baslik}</h3>
        </div>
        <p className="text-slate-600 mb-6">{mesaj}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onIptal}
            disabled={yukleniyorMu}
            className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            Vazgeç
          </button>
          <button
            onClick={onOnayla}
            disabled={yukleniyorMu}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
            {yukleniyorMu ? "Siliniyor..." : "Evet, Sil"}
          </button>
        </div>
      </div>
    </div>
  );
};
