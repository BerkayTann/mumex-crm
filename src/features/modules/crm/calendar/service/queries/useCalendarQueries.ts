import { useQuery } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';
import { IPlan } from '../../types';

interface IApiYaniti<T> {
  basarili: boolean;
  veri: T;
  mesaj?: string;
}

const planlariGetir = async (ay: number, yil: number): Promise<IPlan[]> => {
  const ayStr = String(ay + 1).padStart(2, '0'); // 0-indexed -> 1-indexed
  const yanit = await apiIstemcisi.get<IApiYaniti<IPlan[]>>(`/plans?month=${yil}-${ayStr}`);
  return yanit.data.veri;
};

export const usePlanlariGetir = (ay: number, yil: number) => {
  return useQuery({
    queryKey: ['planlar', yil, ay],
    queryFn: () => planlariGetir(ay, yil),
  });
};
