import { Bolgeler } from './regions';

export interface ISehirBilgisi {
  il: string;
  bolge: Bolgeler;
}

export const TURKIYE_ILLERI: ISehirBilgisi[] = [
  // ADANA - AKDENİZ
  { il: 'Adana', bolge: Bolgeler.AKDENIZ },
  // ADIYAMAN - GÜNEYDOĞU ANADOLU
  { il: 'Adıyaman', bolge: Bolgeler.GUNEYDOGU_ANADOLU },
  // AFYONKARAHİSAR - İÇ ANADOLU
  { il: 'Afyonkarahisar', bolge: Bolgeler.IC_ANADOLU },
  // AĞRI - DOĞU ANADOLU
  { il: 'Ağrı', bolge: Bolgeler.DOGU_ANADOLU },
  // AKSARAY - İÇ ANADOLU
  { il: 'Aksaray', bolge: Bolgeler.IC_ANADOLU },
  // AMASYA - KARADENİZ
  { il: 'Amasya', bolge: Bolgeler.KARADENIZ },
  // ANKARA - İÇ ANADOLU
  { il: 'Ankara', bolge: Bolgeler.IC_ANADOLU },
  // ANTALYA - AKDENİZ
  { il: 'Antalya', bolge: Bolgeler.AKDENIZ },
  // ARDAHAN - DOĞU ANADOLU
  { il: 'Ardahan', bolge: Bolgeler.DOGU_ANADOLU },
  // ARTVİN - KARADENİZ
  { il: 'Artvin', bolge: Bolgeler.KARADENIZ },
  // AYDIN - EGE
  { il: 'Aydın', bolge: Bolgeler.EGE },
  // BALIKESİR - MARMARA
  { il: 'Balıkesir', bolge: Bolgeler.MARMARA },
  // BARTIN - KARADENİZ
  { il: 'Bartın', bolge: Bolgeler.KARADENIZ },
  // BATMAN - GÜNEYDOĞU ANADOLU
  { il: 'Batman', bolge: Bolgeler.GUNEYDOGU_ANADOLU },
  // BAYBURT - KARADENİZ
  { il: 'Bayburt', bolge: Bolgeler.KARADENIZ },
  // BİLECİK - MARMARA
  { il: 'Bilecik', bolge: Bolgeler.MARMARA },
  // BİNGÖL - DOĞU ANADOLU
  { il: 'Bingöl', bolge: Bolgeler.DOGU_ANADOLU },
  // BİTLİS - DOĞU ANADOLU
  { il: 'Bitlis', bolge: Bolgeler.DOGU_ANADOLU },
  // BOLU - KARADENİZ
  { il: 'Bolu', bolge: Bolgeler.KARADENIZ },
  // BURDUR - AKDENİZ
  { il: 'Burdur', bolge: Bolgeler.AKDENIZ },
  // BURSA - MARMARA
  { il: 'Bursa', bolge: Bolgeler.MARMARA },
  // ÇANAKKALE - MARMARA
  { il: 'Çanakkale', bolge: Bolgeler.MARMARA },
  // ÇANKIRI - İÇ ANADOLU
  { il: 'Çankırı', bolge: Bolgeler.IC_ANADOLU },
  // ÇORUM - KARADENİZ
  { il: 'Çorum', bolge: Bolgeler.KARADENIZ },
  // DENİZLİ - EGE
  { il: 'Denizli', bolge: Bolgeler.EGE },
  // DİYARBAKIR - GÜNEYDOĞU ANADOLU
  { il: 'Diyarbakır', bolge: Bolgeler.GUNEYDOGU_ANADOLU },
  // DÜZCE - KARADENİZ
  { il: 'Düzce', bolge: Bolgeler.KARADENIZ },
  // EDİRNE - MARMARA
  { il: 'Edirne', bolge: Bolgeler.MARMARA },
  // ELAZIĞ - DOĞU ANADOLU
  { il: 'Elazığ', bolge: Bolgeler.DOGU_ANADOLU },
  // ERZİNCAN - DOĞU ANADOLU
  { il: 'Erzincan', bolge: Bolgeler.DOGU_ANADOLU },
  // ERZURUM - DOĞU ANADOLU
  { il: 'Erzurum', bolge: Bolgeler.DOGU_ANADOLU },
  // ESKİŞEHİR - İÇ ANADOLU
  { il: 'Eskişehir', bolge: Bolgeler.IC_ANADOLU },
  // GAZİANTEP - GÜNEYDOĞU ANADOLU
  { il: 'Gaziantep', bolge: Bolgeler.GUNEYDOGU_ANADOLU },
  // GİRESUN - KARADENİZ
  { il: 'Giresun', bolge: Bolgeler.KARADENIZ },
  // GÜMÜŞHANE - KARADENİZ
  { il: 'Gümüşhane', bolge: Bolgeler.KARADENIZ },
  // HAKKARİ - DOĞU ANADOLU
  { il: 'Hakkari', bolge: Bolgeler.DOGU_ANADOLU },
  // HATAY - AKDENİZ
  { il: 'Hatay', bolge: Bolgeler.AKDENIZ },
  // IĞDIR - DOĞU ANADOLU
  { il: 'Iğdır', bolge: Bolgeler.DOGU_ANADOLU },
  // ISPARTA - AKDENİZ
  { il: 'Isparta', bolge: Bolgeler.AKDENIZ },
  // İSTANBUL - MARMARA
  { il: 'İstanbul', bolge: Bolgeler.MARMARA },
  // İZMİR - EGE
  { il: 'İzmir', bolge: Bolgeler.EGE },
  // KAHRAMANMARAŞ - AKDENİZ
  { il: 'Kahramanmaraş', bolge: Bolgeler.AKDENIZ },
  // KARABÜK - KARADENİZ
  { il: 'Karabük', bolge: Bolgeler.KARADENIZ },
  // KARAMAN - AKDENİZ
  { il: 'Karaman', bolge: Bolgeler.AKDENIZ },
  // KARS - DOĞU ANADOLU
  { il: 'Kars', bolge: Bolgeler.DOGU_ANADOLU },
  // KASTAMONU - KARADENİZ
  { il: 'Kastamonu', bolge: Bolgeler.KARADENIZ },
  // KAYSERİ - İÇ ANADOLU
  { il: 'Kayseri', bolge: Bolgeler.IC_ANADOLU },
  // KIRIKKALE - İÇ ANADOLU
  { il: 'Kırıkkale', bolge: Bolgeler.IC_ANADOLU },
  // KIRKLARELİ - MARMARA
  { il: 'Kırklareli', bolge: Bolgeler.MARMARA },
  // KIRŞEHİR - İÇ ANADOLU
  { il: 'Kırşehir', bolge: Bolgeler.IC_ANADOLU },
  // KİLİS - GÜNEYDOĞU ANADOLU
  { il: 'Kilis', bolge: Bolgeler.GUNEYDOGU_ANADOLU },
  // KOCAELİ - MARMARA
  { il: 'Kocaeli', bolge: Bolgeler.MARMARA },
  // KONYA - İÇ ANADOLU
  { il: 'Konya', bolge: Bolgeler.IC_ANADOLU },
  // KÜTAHYA - EGE
  { il: 'Kütahya', bolge: Bolgeler.EGE },
  // MALATYA - DOĞU ANADOLU
  { il: 'Malatya', bolge: Bolgeler.DOGU_ANADOLU },
  // MANİSA - EGE
  { il: 'Manisa', bolge: Bolgeler.EGE },
  // MARDİN - GÜNEYDOĞU ANADOLU
  { il: 'Mardin', bolge: Bolgeler.GUNEYDOGU_ANADOLU },
  // MERSİN - AKDENİZ
  { il: 'Mersin', bolge: Bolgeler.AKDENIZ },
  // MUĞLA - EGE
  { il: 'Muğla', bolge: Bolgeler.EGE },
  // MUŞ - DOĞU ANADOLU
  { il: 'Muş', bolge: Bolgeler.DOGU_ANADOLU },
  // NEVŞEHİR - İÇ ANADOLU
  { il: 'Nevşehir', bolge: Bolgeler.IC_ANADOLU },
  // NİĞDE - İÇ ANADOLU
  { il: 'Niğde', bolge: Bolgeler.IC_ANADOLU },
  // ORDU - KARADENİZ
  { il: 'Ordu', bolge: Bolgeler.KARADENIZ },
  // OSMANİYE - AKDENİZ
  { il: 'Osmaniye', bolge: Bolgeler.AKDENIZ },
  // RİZE - KARADENİZ
  { il: 'Rize', bolge: Bolgeler.KARADENIZ },
  // SAKARYA - MARMARA
  { il: 'Sakarya', bolge: Bolgeler.MARMARA },
  // SAMSUN - KARADENİZ
  { il: 'Samsun', bolge: Bolgeler.KARADENIZ },
  // SİİRT - GÜNEYDOĞU ANADOLU
  { il: 'Siirt', bolge: Bolgeler.GUNEYDOGU_ANADOLU },
  // SİNOP - KARADENİZ
  { il: 'Sinop', bolge: Bolgeler.KARADENIZ },
  // SİVAS - İÇ ANADOLU
  { il: 'Sivas', bolge: Bolgeler.IC_ANADOLU },
  // ŞANLIURFA - GÜNEYDOĞU ANADOLU
  { il: 'Şanlıurfa', bolge: Bolgeler.GUNEYDOGU_ANADOLU },
  // ŞIRNAK - GÜNEYDOĞU ANADOLU
  { il: 'Şırnak', bolge: Bolgeler.GUNEYDOGU_ANADOLU },
  // TEKİRDAĞ - MARMARA
  { il: 'Tekirdağ', bolge: Bolgeler.MARMARA },
  // TOKAT - KARADENİZ
  { il: 'Tokat', bolge: Bolgeler.KARADENIZ },
  // TRABZON - KARADENİZ
  { il: 'Trabzon', bolge: Bolgeler.KARADENIZ },
  // TUNCELİ - DOĞU ANADOLU
  { il: 'Tunceli', bolge: Bolgeler.DOGU_ANADOLU },
  // UŞAK - EGE
  { il: 'Uşak', bolge: Bolgeler.EGE },
  // VAN - DOĞU ANADOLU
  { il: 'Van', bolge: Bolgeler.DOGU_ANADOLU },
  // YALOVA - MARMARA
  { il: 'Yalova', bolge: Bolgeler.MARMARA },
  // YOZGAT - İÇ ANADOLU
  { il: 'Yozgat', bolge: Bolgeler.IC_ANADOLU },
  // ZONGULDAK - KARADENİZ
  { il: 'Zonguldak', bolge: Bolgeler.KARADENIZ },
];

/** İl adından bölgeyi döndürür. Bulunamazsa undefined. */
export function ildenBolgeGetir(il: string): Bolgeler | undefined {
  const bulunan = TURKIYE_ILLERI.find(
    (s) => s.il.toLowerCase() === il.toLowerCase()
  );
  return bulunan?.bolge;
}
