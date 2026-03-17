export enum Bolgeler {
  MARMARA = 'Marmara',
  EGE = 'Ege',
  AKDENIZ = 'Akdeniz',
  KARADENIZ = 'Karadeniz',
  IC_ANADOLU = 'İç Anadolu',
  DOGU_ANADOLU = 'Doğu Anadolu',
  GUNEYDOGU_ANADOLU = 'Güneydoğu Anadolu',
}

// renk paleti
export const BolgeRenkleri: Record<Bolgeler, { anaRenk: string; vurguRengi: string }> = {
  [Bolgeler.MARMARA]: { anaRenk: '#2E6FA7', vurguRengi: '#F2C94C' },
  [Bolgeler.EGE]: { anaRenk: '#6BBF59', vurguRengi: '#FF7A5C' },
  [Bolgeler.AKDENIZ]: { anaRenk: '#FF9A3D', vurguRengi: '#0077B6' },
  [Bolgeler.KARADENIZ]: { anaRenk: '#0F8B8D', vurguRengi: '#FFD166' },
  [Bolgeler.IC_ANADOLU]: { anaRenk: '#C48E3A', vurguRengi: '#2B2D42' },
  [Bolgeler.DOGU_ANADOLU]: { anaRenk: '#7A4E9E', vurguRengi: '#E6E6FA' },
  [Bolgeler.GUNEYDOGU_ANADOLU]: { anaRenk: '#B33A2E', vurguRengi: '#F6E27F' },
};

// Her bölge için atmosfer teması (profil banner'ı için)
export interface IBolgeTema {
  gradient: string;   // Tailwind bg-gradient-to-br sınıfları
  desen: string;      // Dekoratif emoji/ikon
  slogan: string;     // Bölge sloganı
}

export const BolgeTemalari: Record<Bolgeler, IBolgeTema> = {
  [Bolgeler.MARMARA]: {
    gradient: 'from-blue-800 via-blue-600 to-indigo-500',
    desen: '⚓',
    slogan: "Marmara Bölgesi",
  },
  [Bolgeler.EGE]: {
    gradient: 'from-emerald-600 via-teal-500 to-cyan-400',
    desen: '🫒',
    slogan: "Ege Bölgesi",
  },
  [Bolgeler.AKDENIZ]: {
    gradient: 'from-orange-600 via-amber-500 to-yellow-400',
    desen: '🌊',
    slogan: "Akdeniz Bölgesi",
  },
  [Bolgeler.KARADENIZ]: {
    gradient: 'from-teal-900 via-green-700 to-emerald-600',
    desen: '🌿',
    slogan: "Karadeniz Bölgesi",
  },
  [Bolgeler.IC_ANADOLU]: {
    gradient: 'from-amber-800 via-yellow-700 to-orange-500',
    desen: '🌾',
    slogan: "İçAnadolu Bölgesi",
  },
  [Bolgeler.DOGU_ANADOLU]: {
    gradient: 'from-purple-900 via-violet-700 to-purple-500',
    desen: '⛰️',
    slogan: "DoğuAnadolu Bölgesi",
  },
  [Bolgeler.GUNEYDOGU_ANADOLU]: {
    gradient: 'from-red-900 via-rose-700 to-orange-600',
    desen: '🌙',
    slogan: "Güneydoğu Bölgesi",
  },
};