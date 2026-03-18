import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';
import { IPlan, ICreatePlanPayload } from '../../types';

interface IApiYaniti<T> {
  basarili: boolean;
  veri: T;
  mesaj?: string;
}

export const usePlanEkle = () => {
  const sorguIstemcisi = useQueryClient();

  return useMutation({
    mutationFn: async (yeniPlan: ICreatePlanPayload): Promise<IPlan> => {
      const yanit = await apiIstemcisi.post<IApiYaniti<IPlan>>('/plans', yeniPlan);
      return yanit.data.veri;
    },
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ['planlar'] });
      sorguIstemcisi.invalidateQueries({ queryKey: ['bildirimler'] });
    },
  });
};

export const usePlanGuncelle = () => {
  const sorguIstemcisi = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, veri }: { id: string; veri: ICreatePlanPayload }): Promise<IPlan> => {
      const yanit = await apiIstemcisi.put<IApiYaniti<IPlan>>(`/plans/${id}`, veri);
      return yanit.data.veri;
    },
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ['planlar'] });
      sorguIstemcisi.invalidateQueries({ queryKey: ['bildirimler'] });
    },
  });
};

export const usePlanSil = () => {
  const sorguIstemcisi = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiIstemcisi.delete(`/plans/${id}`);
    },
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ['planlar'] });
      sorguIstemcisi.invalidateQueries({ queryKey: ['bildirimler'] });
    },
  });
};
