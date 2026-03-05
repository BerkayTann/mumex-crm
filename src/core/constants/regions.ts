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