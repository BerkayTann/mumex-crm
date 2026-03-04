import { useQuery } from '@tanstack/react-query';
import { apiIstemcisi } from '../../../../../../core/api/apiClient';
import { ICompany } from '../../types';

// API'den dönen standart yanıt tipimiz (any kullanmamak için jenerik tip yazıyoruz)
interface IApiYaniti<T> {
  basarili: boolean;
  veri: T;
  mesaj?: string;
}

// 1. Asıl API isteğini atan asenkron fonksiyonumuz (İş mantığı: Türkçe)
export const sirketleriGetir = async (): Promise<ICompany[]> => {
  const yanit = await apiIstemcisi.get<IApiYaniti<ICompany[]>>('/companies');
  return yanit.data.veri;
};

// 2. React bileşenlerinde çağıracağımız Custom Hook'umuz
export const useSirketleriGetir = () => {
  return useQuery({
    queryKey: ['sirketler'], // Bu anahtar, veriyi cache'te (önbellek) tutmak için kullanılır
    queryFn: sirketleriGetir,
  });
};