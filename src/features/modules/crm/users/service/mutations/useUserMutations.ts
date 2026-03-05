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

// 1. KİŞİ GÜNCELLE
export const kisiGuncelle = async ({ id, guncelVeri }: { id: string, guncelVeri: ICreateUserPayload }): Promise<IUser> => {
  const yanit = await apiIstemcisi.put<IApiYaniti<IUser>>(`/users/${id}`, guncelVeri);
  return yanit.data.veri;
};

export const useKisiGuncelle = () => {
  const sorguIstemcisi = useQueryClient();
  return useMutation({
    mutationFn: kisiGuncelle,
    onSuccess: () => sorguIstemcisi.invalidateQueries({ queryKey: ['kisiler'] }),
  });
};

// 2. KİŞİ SİL
export const kisiSil = async (id: string): Promise<boolean> => {
  const yanit = await apiIstemcisi.delete<IApiYaniti<null>>(`/users/${id}`);
  return yanit.data.basarili;
};

export const useKisiSil = () => {
  const sorguIstemcisi = useQueryClient();
  return useMutation({
    mutationFn: kisiSil,
    onSuccess: () => sorguIstemcisi.invalidateQueries({ queryKey: ['kisiler'] }),
  });
};