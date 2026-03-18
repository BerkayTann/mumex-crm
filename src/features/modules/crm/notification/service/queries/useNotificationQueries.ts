import { useQuery } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';
import { INotification } from '../../types';

interface IApiYaniti<T> {
  basarili: boolean;
  veri: T;
  mesaj?: string;
}

const bildirimleriGetir = async (): Promise<INotification[]> => {
  const yanit = await apiIstemcisi.get<IApiYaniti<INotification[]>>('/notifications');
  return yanit.data.veri;
};

export const useBildirimleriGetir = () => {
  return useQuery({
    queryKey: ['bildirimler'],
    queryFn: bildirimleriGetir,
    refetchInterval: 5 * 60 * 1000, // 5 dakikada bir yenile
  });
};
