import { ProductCategory } from '../../product/types';

// Her ürün için hesaplanmış envanter satırı
export interface IEnvanterKalemi {
  productId: string;
  urunAdi: string;
  kategori: ProductCategory;
  baslangicStok: number;      // product.quantity (depoya giren miktar)
  satisAdedi: number;         // COMPLETED ziyaretlerdeki toplam satış adedi
  kalanStok: number;          // baslangicStok - satisAdedi (min 0)
  birimFiyatTRY: number;      // priceInTRY ?? price
  stokDegeri: number;         // kalanStok * birimFiyatTRY
  satirToplam: number;        // satisAdedi * birimFiyatTRY (satılan ürünlerin değeri)
  isActive: boolean;
}

// Sayfanın üst kısmındaki özet istatistikler
export interface IEnvanterOzet {
  toplamUrunSayisi: number;
  toplamKalanStok: number;
  toplamStokDegeri: number;
  toplamSatisDegeri: number;
}

// GET /api/inventory yanıt tipi
export interface IEnvanterApiYaniti {
  basarili: boolean;
  veri: {
    kalemler: IEnvanterKalemi[];
    ozet: IEnvanterOzet;
  };
  mesaj?: string;
}
