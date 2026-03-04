import axios from 'axios';

// Tüm projemizde kullanacağımız temel API istemcisi (Türkçe değişken adı kuralımıza uyarak)
export const apiIstemcisi = axios.create({
  baseURL: '/api', // İstekler otomatik olarak current_domain/api adresine gidecek
  headers: {
    'Content-Type': 'application/json',
  },
});