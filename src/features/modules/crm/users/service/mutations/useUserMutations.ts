import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';
import { IUser } from '../../types';
import { IKisiFormVerisi } from '../../schema/UserSchema';

interface IApiYaniti<T> {
  basarili: boolean;
  veri: T;
  mesaj?: string;
}

export const kisiEkle = async (yeniKisiVerisi: IKisiFormVerisi): Promise<IUser> => {
  const yanit = await apiIstemcisi.post<IApiYaniti<IUser>>('/users', yeniKisiVerisi);
  return yanit.data.veri;
};

export const useKisiEkle = () => {
  const sorguIstemcisi = useQueryClient();

  return useMutation({
    mutationFn: kisiEkle,
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ['kisiler'] });
      sorguIstemcisi.invalidateQueries({ queryKey: ['sirketler'] });
    },
  });
};

// 1. KİŞİ GÜNCELLE
export const kisiGuncelle = async ({ id, guncelVeri }: { id: string, guncelVeri: IKisiFormVerisi }): Promise<IUser> => {
  const yanit = await apiIstemcisi.put<IApiYaniti<IUser>>(`/users/${id}`, guncelVeri);
  return yanit.data.veri;
};

export const useKisiGuncelle = () => {
  const sorguIstemcisi = useQueryClient();
  return useMutation({
    mutationFn: kisiGuncelle,
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ['kisiler'] });
      sorguIstemcisi.invalidateQueries({ queryKey: ['sirketler'] });
    },
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