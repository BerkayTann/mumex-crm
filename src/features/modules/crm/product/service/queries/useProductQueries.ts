import { useQuery } from '@tanstack/react-query';
import { apiIstemcisi } from '@/core/api/apiClient';
import { IProduct } from '../../types';

interface IApiYaniti<T> {
    basarili: boolean;
    veri: T;
    mesaj?: string;
}

//Ürünleri Çekme Fonksiyonu
const urunleriGetir = async (): Promise<IProduct[]> => {
    const yanit = await apiIstemcisi.get<IApiYaniti<IProduct[]>>('/products');
    return yanit.data.veri;
}

//React Query Hook'u
export const useUrunleriGetir = () => {
    return useQuery<IProduct[]>({ queryKey: ['urunler'], queryFn: urunleriGetir });
}
    