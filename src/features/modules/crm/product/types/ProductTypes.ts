//Ürün kategorileri standartlaştırılır.
//Enum: veri tabanına yanlışlıkla örn: "ilaç" yerine "ilac" yazılmasını engeller.
export enum ProductCategory {
    MEDICINE = 'MEDICINE',
    SUPPLEMENT = 'SUPPLEMENT',
    MEDICAL_DEVICE = 'MEDICAL_DEVICE',
}


//Frontend ve Backendin ortak dili olan arayüz
export interface IProduct {
    _id: string;
    name: string;
    category: ProductCategory;
    price: number;
    currency?: string;      // "TRY" | "USD" | "EUR" vb. — default "TRY"
    priceInTRY?: number;    // Kayıt anındaki TRY karşılığı (live kur ile hesaplanır)
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


// Yeni ürün oluştururken veritabanının otomatik atayacağı alanları dışarıda bırakıyoruz
export type ICreateProductPayload = Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>;