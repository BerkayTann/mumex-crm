import { useQuery } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';
import { IUser } from '../../types';

interface IApiYaniti<T> {
  basarili: boolean;
  veri: T;
  mesaj?: string;
}

// Tüm kişileri getiren fonksiyon (İlişkili şirket verisiyle birlikte gelir)
export const kisileriGetir = async (): Promise<IUser[]> => {
  const yanit = await apiIstemcisi.get<IApiYaniti<IUser[]>>('/users');
  return yanit.data.veri;
};

export const useKisileriGetir = () => {
  return useQuery({
    queryKey: ['kisiler'],
    queryFn: kisileriGetir,
  });
};