---
description: Proje kodlama standartları, mimari kurallar, DDD/FBA prensipleri ve best practices.
alwaysApply: true
project: Mumex.iL (Mümessil CRM)
domain: crm
---

# 🚀 Proje Bağlamı ve Kimliği (Project Context)

Bu proje, ilaç mümessillerinin doktor, hastane ve eczane ziyaretlerini yönettiği, satışlarını takip ettiği ve akıllı analizler sunan bir **B2B SaaS CRM** uygulamasıdır. 
Sahada hareket halinde olan kullanıcılar için sistemin hızlı, verimli, mobil uyumlu ve ölçeklenebilir olması kritiktir.Mumex.iL, ilaç mümessillerinin saha operasyonlarını manuel Excel süreçlerinden kurtarıp dijitalleştiren, veri odaklı kararlar almalarını sağlayan modüler bir SaaS CRM platformudur.

## 🛠️ Teknoloji Yığını (Tech Stack)
- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **State & Veri Çekme:** Zustand (Global Client State), TanStack React Query (Server State)
- **Backend & DB:** Next.js Route Handlers (API), MongoDB, Mongoose
- **Form & Doğrulama:** React Hook Form, Zod

---

# 🏛️ Mimari Prensipler (Architecture Guidelines)



Bu projede SIKI BİR ŞEKİLDE **Domain-Driven Design (DDD)** ve **Feature-Based Architecture (FBA)** uygulanacaktır. Spagetti kod yazmak ve katmanları birbirine karıştırmak kesinlikle yasaktır.

## 📁 Genel Proje Klasör Ağacı
```text
src/
├── app/                           # 🌐 NEXT.JS APP ROUTER (Sadece Sayfalar)
│   ├── (auth)/                    # Kimlik doğrulama (Sidebar YOK)
│   ├── (main)/                    # Ana Uygulama (Sidebar VAR)
│   ├── api/                       # Backend Route Handlers (Node.js)
│   └── globals.css
│
├── core/                          # ⚙️ CORE UTILITIES (Global)
│   ├── api/                       # apiService (Axios instance vb.)
│   └── providers/                 # ReactQueryProvider, NextThemeProvider vb.
│
├── features/                      # 🧩 FEATURE MODULES (DDD - İş Mantığı Burada)
│   └── modules/
│       └── crm/                   # Ana Domain
│           ├── company/           # Kurumlar (Hastane, Eczane)
│           ├── users/             # Kişiler (Doktorlar)
│           ├── product/           # Ürünler / İlaçlar
│           └── visit/             # Ziyaret ve Satış Modülü
│
├── components/                    # 🧱 GLOBAL UI (Paylaşılan Bileşenler)
│   ├── common/                    # Bize ait global bileşenler
│   └── ui/                        # shadcn/ui bileşenleri
│
└── lib/                           # Yardımcı fonksiyonlar (utils.ts, db.ts)
🏗️ Katmanların Kesin Ayrımı (Separation of Concerns)
Yeni eklenecek her modül (feature), @/features/modules/crm/[modul-adi]/ dizini altında kendi içinde tamamen izole bir yapıda olmalıdır. Bir modülün standart yapısı:

Plaintext
[modul-adi]/
├── components/    # 1. Pure UI (Dumb Components)
├── containers/    # 2. Smart Components
├── service/       # 3. API & Logic
│   ├── queries/
│   ├── mutations/
│   └── transformers/
├── schema/        # 4. Doğrulama ve DB Şemaları
├── types/         # 5. TypeScript Arayüzleri
└── index.ts       # 6. Public API (Barrel Export)
1. components/ (Pure UI Katmanı)
SADECE görsel bileşenleri içerir (Örn: CompanyCard.tsx, VisitForm.tsx).

İçerisinde hiçbir API isteği (useQuery, useMutation) barındıramaz.

Tüm veriyi dışarıdan props olarak alır ve kullanıcı eylemlerini (onClick vb.) yine dışarıya fırlatır.

2. containers/ (Smart Katman)
Sayfanın beyni burasıdır. State yönetimini ve React Query hook'larını burada çağırırız.

API'den gelen yükleniyor (isLoading), hata (isError) ve data durumlarını yönetir.

Gelen veriyi components/ katmanındaki yapılara props olarak aktarır.

3. service/ (İş Mantığı ve Veri Katmanı)
queries/: Sadece GET isteklerini barındıran hook'lar (Örn: useCompanyList).

mutations/: POST, PUT, DELETE isteklerini barındıran hook'lar (Örn: useDeleteCompany).

transformers/: API'den gelen karmaşık JSON verisini, Frontend'in UI tiplerine (Entity) dönüştüren saf fonksiyonlar.

4. schema/ & 5. types/
schema/: Zod form doğrulama şemaları ve Mongoose veritabanı modelleri (.model.ts).

types/: API Response/Request tipleri ve Frontend Entity interfaceleri.

🔄 Veri Akışı ve App Router Bağlantısı
Next.js app/ dizini sadece yönlendirme (routing) yapar. İş mantığı barındırmaz.

Örnek Bir Sayfanın Çağrılışı:

TypeScript
// app/(main)/company/page.tsx
import { CompanyListContainer } from "@/features/modules/crm/company";

export default function CompanyPage() {
  // Sadece Container çağrılır. Başka mantık yazılmaz!
  return <CompanyListContainer />;
}
Route Grupları:

(auth)/: Sadece giriş yapılmamış ekranlar (Login/Register). Sidebar veya Header içermez.

(main)/: Ana uygulama sayfaları. Root layout'unda Sidebar ve Üst Bar bulunur.

📝 İsimlendirme Standartları (ÇOK ÖNEMLİ)
Projenin okunabilirliğini artırmak için Çift Dilli (Bilingual) İsimlendirme kuralı uygulanır:

Dosya İsimleri ve UI Bileşenleri (İNGİLİZCE & PascalCase):

✅ Doğru: CompanyCard.tsx, VisitFormContainer.tsx

❌ Yanlış: kurumKarti.tsx, company-karti.tsx

İş Mantığı, Fonksiyonlar ve Hook'lar (TÜRKÇE & camelCase):

İş akışını okumayı kolaylaştırmak için fonksiyonlar ve olay dinleyicileri Türkçe adlandırılır.

✅ Doğru: const kayitSil = useDeleteCompany();, islemGuncelle, verileriGetir, const onZiyaretKaydet = () => {}

❌ Yanlış: handleDelete, fetchData

Klasör İsimleri (İNGİLİZCE & kebab-case):

✅ Doğru: company-list, user-profile

Tipler ve Arayüzler (İNGİLİZCE & PascalCase):

✅ Doğru: CompanyEntity, IVisitResponse

🚫 Kesin Yasaklar (Strictly Forbidden)
any Kullanımı Yasaktır: Her değişkenin ve API yanıtının TypeScript types klasöründe kesin bir arayüzü (Interface) olmalıdır.

Doğrudan Import Yasaktır: Bir modül dışından iç dosyalara doğrudan erişilemez. Sadece modülün ana dizinindeki index.ts (Barrel Export) üzerinden import yapılmalıdır.

✅ Doğru: import { CompanyCard } from "@/features/modules/crm/company";

❌ Yanlış: import { CompanyCard } from "@/features/modules/crm/company/components/CompanyCard";

shadcn/ui Modifikasyonu: src/components/ui içine CLI ile kurulan shadcn bileşenlerinin kaynak kodları, çok zaruri olmadıkça doğrudan değiştirilmemelidir. Özelleştirmeler className veya tailwind ile dışarıdan yapılmalıdır.

ÖRNEK DOSYA YAPISI: 

src/
├── app/                           # 🌐 Next.js App Router
│   ├── (auth)/                    # Kimlik doğrulama (Sidebar YOK)
│   │   ├── layout.tsx
│   │   └── page.tsx               # Login sayfası (Baban ve diğer reps için)
│   ├── (main)/                    # Ana Uygulama (Sidebar VAR)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── company/               # Kurumlar (Hastane, Eczane)
│   │   │   └── page.tsx           
│   │   ├── users/                 # Kişiler (Doktorlar)
│   │   │   └── page.tsx
│   │   ├── product/               # İlaçlar/Ürünler
│   │   │   └── page.tsx
│   │   ├── visit/                 # Ziyaret ve Satış İşlemleri
│   │   │   └── page.tsx
│   │   └── layout.tsx             # Sidebar ve Header içeren Layout
│   ├── globals.css
│   └── layout.tsx                 # Root Layout (Providers: TanStack, Zustand)
│
├── core/                          # ⚙️ Core Utilities
│   ├── api/                       # apiService (Axios instance)
│   └── providers/                 # ReactQueryProvider vb.
│
├── features/                      # 🧩 FEATURE-BASED MODULES (DDD)
│   └── modules/
│       └── crm/                   # Bizim Ana Domainimiz
│           │
│           ├── company/           # --- KURUMLAR MODÜLÜ (Örnek Açılım) ---
│           │   ├── __mocks__/     # companyMockData.ts
│           │   ├── components/    # Pure UI (CompanyCard, CompanyForm, index.ts)
│           │   ├── containers/    # Smart (CompanyListContainer, index.ts)
│           │   ├── service/       
│           │   │   ├── queries/   # useCompanyQueries.ts
│           │   │   ├── mutations/ # useCompanyMutations.ts
│           │   │   ├── transformers/# companyTransformers.ts
│           │   │   └── index.ts
│           │   ├── schema/        # companySchema.ts (Zod)
│           │   ├── types/         # companyApiTypes.ts, index.ts
│           │   └── index.ts       # Public API (Barrel Export)
│           │
│           ├── users/             # --- KİŞİLER/DOKTORLAR MODÜLÜ ---
│           │   └── ... (Aynı yapı)
│           │
│           ├── product/           # --- ÜRÜNLER MODÜLÜ ---
│           │   └── ... (Aynı yapı)
│           │
│           └── visit/             # --- ZİYARET/SATIŞ MODÜLÜ ---
│               └── ... (Aynı yapı)
│
├── components/                    # 🧱 Global Ortak Bileşenler
│   ├── common/                    # Paylaşılan genel componentler
│   └── ui/                        # shadcn/ui componentleri (Kesinlikle dokunulmaz!)
│
└── lib/                           # utils.ts (Tailwind cn vb.)
