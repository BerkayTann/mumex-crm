import { useQuery } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';
import { IVisit } from '../../types';

interface IApiYaniti<T> {
  basarili: boolean;
  veri: T;
  mesaj?: string;
}

export const ziyaretleriGetir = async (): Promise<IVisit[]> => {
  const yanit = await apiIstemcisi.get<IApiYaniti<IVisit[]>>('/visits');
  return yanit.data.veri;
};

export const useZiyaretleriGetir = () => {
  return useQuery({
    queryKey: ['ziyaretler'],
    queryFn: ziyaretleriGetir,
  });
};