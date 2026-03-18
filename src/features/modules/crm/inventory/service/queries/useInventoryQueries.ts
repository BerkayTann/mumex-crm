import { useQuery } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';
import { IEnvanterApiYaniti } from '../../types';

const envanterVerisiniGetir = async (): Promise<IEnvanterApiYaniti['veri']> => {
  const yanit = await apiIstemcisi.get<IEnvanterApiYaniti>('/inventory');
  return yanit.data.veri;
};

export const useEnvanterGetir = () => {
  return useQuery({
    queryKey: ['envanter'],
    queryFn: envanterVerisiniGetir,
    staleTime: 1000 * 60 * 2, // 2 dakika
  });
};
