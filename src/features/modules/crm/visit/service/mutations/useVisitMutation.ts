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
      // Bir ziyaret eklendiğinde, doktorların veya kurumların istatistikleri de değişeceği için 
      // ileride o query'leri de burada invalidate edeceğiz (tazeleyeceğiz).
    },
  });
};