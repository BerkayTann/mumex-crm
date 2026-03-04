import mongoose from 'mongoose';

// Ortam değişkenlerinden MongoDB bağlantı adresini alıyoruz. 
// Yoksa yerel bilgisayarımızdaki (localhost) veritabanına bağlanacak.
const BAGLANTI_ADRESI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mumex_crm';

// any kullanmamak için global nesnemize mongoose önbellek (cache) tipini tanımlıyoruz
declare global {
  var mongooseOnbellek: {
    baglanti: typeof mongoose | null;
    soz: Promise<typeof mongoose> | null;
  };
}

// Global nesnemizde önceden oluşturulmuş bir bağlantı var mı diye kontrol ediyoruz
let onbellek = global.mongooseOnbellek;

if (!onbellek) {
  onbellek = global.mongooseOnbellek = { baglanti: null, soz: null };
}

// Tüm API isteklerinde çağıracağımız asıl bağlantı fonksiyonumuz (Türkçe ve camelCase)
export const veritabaninaBaglan = async () => {
  if (onbellek.baglanti) {
    return onbellek.baglanti;
  }

  if (!onbellek.soz) {
    onbellek.soz = mongoose.connect(BAGLANTI_ADRESI, {
      bufferCommands: false,
    }).then((mongooseNesnesi) => {
      return mongooseNesnesi;
    });
  }

  try {
    onbellek.baglanti = await onbellek.soz;
  } catch (hata) {
    onbellek.soz = null;
    throw hata;
  }

  return onbellek.baglanti;
};