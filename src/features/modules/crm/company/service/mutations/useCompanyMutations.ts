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