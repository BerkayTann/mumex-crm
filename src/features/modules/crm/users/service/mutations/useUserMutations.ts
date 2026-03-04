import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';
import { IUser, ICreateUserPayload } from '../../types';

interface IApiYaniti<T> {
  basarili: boolean;
  veri: T;
  mesaj?: string;
}

export const kisiEkle = async (yeniKisiVerisi: ICreateUserPayload): Promise<IUser> => {
  const yanit = await apiIstemcisi.post<IApiYaniti<IUser>>('/users', yeniKisiVerisi);
  return yanit.data.veri;
};

export const useKisiEkle = () => {
  const sorguIstemcisi = useQueryClient();

  return useMutation({
    mutationFn: kisiEkle,
    onSuccess: () => {
      // Kişi eklenince hem 'kisiler' listesini hem de istatistikleri güncellemek isteyebiliriz
      sorguIstemcisi.invalidateQueries({ queryKey: ['kisiler'] });
    },
  });
};