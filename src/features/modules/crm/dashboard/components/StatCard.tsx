import { LucideIcon } from "lucide-react";
import React from "react";
import Link from "next/link";

interface IStatCardProps {
  baslik: string;
  deger: string | number;
  Ikon: LucideIcon;
  renkClass: string;
  altMetin?: string;
  href?: string;
}

export const StatCard: React.FC<IStatCardProps> = ({
  baslik,
  deger,
  altMetin,
  Ikon,
  renkClass,
  href,
}) => {
  const icerik = (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow h-full">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${renkClass} bg-opacity-10`}
      >
        <Ikon
          className={`w-7 h-7 ${renkClass.replace("text-", "text-").replace("bg-", "text-")}`}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{baslik}</p>
        <h3 className="text-2xl font-bold text-slate-800">{deger}</h3>
        {altMetin && <p className="text-xs text-slate-400 mt-1">{altMetin}</p>}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{icerik}</Link>;
  }

  return icerik;
};
