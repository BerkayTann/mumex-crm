import { useQuery } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';
import { IUser } from '../../types';
import { IVisit } from '@/features/modules/crm/visit/types';

// API'den dönecek karmaşık verinin tipi
export interface IUserProfileData {
  doktor: IUser;
  analiz: {
    toplamCiro: number;
    toplamZiyaret: number;
    toplamUrunAdedi: number;
    segment: string;
    sonZiyaretTarihi: string | null;
    urunDagilimi: { ad: string; adet: number; ciro: number }[];
  };
  gecmisZiyaretler: IVisit[];
}

export const kullaniciProfiliniGetir = async (id: string): Promise<IUserProfileData> => {
  const yanit = await apiIstemcisi.get(`/users/${id}/profile`);
  return yanit.data.veri;
};

export const useKullaniciProfiliGetir = (id: string) => {
  return useQuery({
    queryKey: ['kisiProfili', id],
    queryFn: () => kullaniciProfiliniGetir(id),
    enabled: !!id, // ID yoksa boşuna istek atma
  });
};