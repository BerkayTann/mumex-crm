import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';
import { IVisit, ICreateVisitPayload } from '../../types';

interface IApiYaniti<T> {
  basarili: boolean;
  veri: T;
  mesaj?: string;
}

export const ziyaretEkle = async (yeniZiyaret: ICreateVisitPayload): Promise<IVisit> => {
  const yanit = await apiIstemcisi.post<IApiYaniti<IVisit>>('/visits', yeniZiyaret);
  return yanit.data.veri;
};

export const useZiyaretEkle = () => {
  const sorguIstemcisi = useQueryClient();

  return useMutation({
    mutationFn: ziyaretEkle,
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ['ziyaretler'] });
      sorguIstemcisi.invalidateQueries({ queryKey: ['kisiler'] });
    },
  });
};

export const useZiyaretSil = () => {
  const sorguIstemcisi = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiIstemcisi.delete(`/visits/${id}`);
    },
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ['ziyaretler'] });
      sorguIstemcisi.invalidateQueries({ queryKey: ['kisiler'] });
    },
  });
};

export const useZiyaretGuncelle = () => {
  const sorguIstemcisi = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, veri }: { id: string; veri: ICreateVisitPayload }) => {
      const yanit = await apiIstemcisi.put<IApiYaniti<IVisit>>(`/visits/${id}`, veri);
      return yanit.data.veri;
    },
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ['ziyaretler'] });
      sorguIstemcisi.invalidateQueries({ queryKey: ['kisiler'] });
    },
  });
};
