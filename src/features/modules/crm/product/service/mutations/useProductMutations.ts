import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';
import { IProduct, ICreateProductPayload } from '../../types';

interface IApiYaniti<T> {
  basarili: boolean;
  veri: T;
  mesaj?: string;
}

export const urunEkle = async (yeniUrunVerisi: ICreateProductPayload): Promise<IProduct> => {
  const yanit = await apiIstemcisi.post<IApiYaniti<IProduct>>('/products', yeniUrunVerisi);
  return yanit.data.veri;
};

export const useUrunEkle = () => {
  const sorguIstemcisi = useQueryClient();

  return useMutation({
    mutationFn: urunEkle,
    onSuccess: () => {
      // Ürün başarıyla eklenince listeyi yenile
      sorguIstemcisi.invalidateQueries({ queryKey: ['urunler'] });
    },
  });
};

// ÜRÜN GÜNCELLE
export const urunGuncelle = async ({ id, guncelVeri }: { id: string, guncelVeri: ICreateProductPayload }): Promise<IProduct> => {
  const yanit = await apiIstemcisi.put<IApiYaniti<IProduct>>(`/products/${id}`, guncelVeri);
  return yanit.data.veri;
};

export const useUrunGuncelle = () => {
  const sorguIstemcisi = useQueryClient();
  return useMutation({
    mutationFn: urunGuncelle,
    onSuccess: () => sorguIstemcisi.invalidateQueries({ queryKey: ['urunler'] }),
  });
};

// ÜRÜN SİL
export const urunSil = async (id: string): Promise<boolean> => {
  const yanit = await apiIstemcisi.delete<IApiYaniti<null>>(`/products/${id}`);
  return yanit.data.basarili;
};

export const useUrunSil = () => {
  const sorguIstemcisi = useQueryClient();
  return useMutation({
    mutationFn: urunSil,
    onSuccess: () => sorguIstemcisi.invalidateQueries({ queryKey: ['urunler'] }),
  });
};