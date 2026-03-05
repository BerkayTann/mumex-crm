import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiIstemcisi } from '../../../../../../core/api/apiClient';
import { ICompany, ICreateCompanyPayload } from '../../types';

interface IApiYaniti<T> {
  basarili: boolean;
  veri: T;
  mesaj?: string;
}

// 1. Yeni kurum ekleme API isteğimiz
export const sirketEkle = async (yeniSirketVerisi: ICreateCompanyPayload): Promise<ICompany> => {
  const yanit = await apiIstemcisi.post<IApiYaniti<ICompany>>('/companies', yeniSirketVerisi);
  return yanit.data.veri;
};

// 2. Form gönderildiğinde kullanacağımız Custom Hook
export const useSirketEkle = () => {
  const sorguIstemcisi = useQueryClient();

  return useMutation({
    mutationFn: sirketEkle,
    onSuccess: () => {
      // ÇOK KRİTİK: Yeni kurum eklendiğinde 'sirketler' cache'ini geçersiz kılıyoruz (invalidate).
      // Bu sayede listeleme ekranı sayfayı yenilemeye gerek kalmadan otomatik olarak güncellenir!
      sorguIstemcisi.invalidateQueries({ queryKey: ['sirketler'] });
    },
  });
};

export const sirketGuncelle = async ({ id, guncelVeri }: { id: string, guncelVeri: ICreateCompanyPayload }): Promise<ICompany> => {
  const yanit = await apiIstemcisi.put<IApiYaniti<ICompany>>(`/companies/${id}`, guncelVeri);
  return yanit.data.veri;
};

export const useSirketGuncelle = () => {
  const sorguIstemcisi = useQueryClient();
  return useMutation({
    mutationFn: sirketGuncelle,
    onSuccess: () => {
      // Güncelleme başarılı olursa listeyi yenile
      sorguIstemcisi.invalidateQueries({ queryKey: ['sirketler'] });
    },
  });
};

// 2. SİLME İŞLEMİ
export const sirketSil = async (id: string): Promise<boolean> => {
  const yanit = await apiIstemcisi.delete<IApiYaniti<null>>(`/companies/${id}`);
  return yanit.data.basarili;
};

export const useSirketSil = () => {
  const sorguIstemcisi = useQueryClient();
  return useMutation({
    mutationFn: sirketSil,
    onSuccess: () => {
      // Silme başarılı olursa listeyi yenile
      sorguIstemcisi.invalidateQueries({ queryKey: ['sirketler'] });
    },
  });
};