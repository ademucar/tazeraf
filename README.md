<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:38bdf8,50:3b82f6,100:0d1025&height=200&section=header&text=SKT%20Takip&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Marketler%20için%20Son%20Kullanma%20Tarihi%20Takip%20Sistemi&descAlignY=58&descSize=18" width="100%"/>



> Uygulama `https://takipskt.netlify.app/` adresinde açılır.


</div>

---

## 📌 Proje Hakkında

**SKT Takip**, marketlerin ve işletmelerin ürünlerinin **son kullanma tarihlerini** deftere yazmak yerine dijital olarak takip etmesini sağlayan bir web uygulamasıdır.

Her ürün, fotoğrafı ve son kullanma tarihiyle kaydedilir; kalan güne göre otomatik olarak **Acil / Yaklaşan / Rahat** diye renklenir. Tarihi yaklaşan ürünler ana ekrana düşer, personel ürünü toplayınca kim topladığı kaydedilir ve **aynı anda bütün cihazlarda güncellenir**.

> Bu proje gerçek bir market ihtiyacından yola çıkarak, tek backend yazmadan (Supabase) hızlı ve güvenilir bir çok-kullanıcılı sistem kurmak amacıyla geliştirilmiştir.

---

## ✨ Özellikler

| | Özellik | Açıklama |
|---|---------|----------|
| 📷 | **Fotoğraflı Ürün Kaydı** | Ürün adı, tarih ve fotoğrafla ekleme (fotoğraf tarayıcıda otomatik sıkıştırılır) |
| 🚦 | **Otomatik Durum** | Kalan güne göre Acil / Yaklaşan / Rahat renklendirme |
| 🔄 | **Gerçek Zamanlı Senkron** | Biri ürünü toplayınca diğer cihazlarda anında düşer |
| 👥 | **Personel Takibi** | Her ürün için "kim ekledi / kim topladı" bilgisi |
| 🗂️ | **Kategoriler** | Ürünleri kategorilere ayırma ve kategori bazlı görüntüleme |
| 🔍 | **Arama & Filtre** | Ürün arama + Yaklaşanlar / Tümü / Geçenler / Toplandı sekmeleri |
| 🔐 | **İşletme Girişi** | E-posta/şifre ile güvenli giriş; her işletme yalnızca kendi verisini görür (RLS) |
| 📱 | **Mobil Uyumlu** | Telefon ve masaüstünde tam ekran, duyarlı arayüz |

---

## 🛠️ Kullanılan Teknolojiler

<div align="center">

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | React (Vite) |
| **Veritabanı** | PostgreSQL (Supabase) |
| **Kimlik Doğrulama** | Supabase Auth |
| **Dosya Depolama** | Supabase Storage |
| **Gerçek Zamanlı** | Supabase Realtime |
| **Güvenlik** | Row Level Security (RLS) |
| **Dağıtım (Deploy)** | Netlify |

</div>

---

## 🏗️ Sistem Mimarisi

```
┌──────────────┐   ┌──────────────┐   ┌────────────────────────────┐
│   KULLANICI  │   │   FRONTEND   │   │          SUPABASE          │
│ Web / Mobil  │──▶│ React (Vite) │──▶│  Auth · Postgres · Storage │
│              │   │  (Netlify)   │   │        · Realtime          │
└──────────────┘   └──────────────┘   └────────────────────────────┘
```

**Veritabanı İlişkileri (ER):**

```
ISLETME (1) ──< (∞) PERSONEL
    │
    ├──< (∞) KATEGORI
    │
    └──< (∞) URUN ──▶ (ekleyen / toplayan) PERSONEL
                 └──▶ (kategori) KATEGORI
```

- Bir **işletmenin** birden çok **personeli** ve **kategorisi** olabilir
- Her **ürün** bir işletmeye aittir; ekleyen ve toplayan personeli ile kategorisine bağlıdır
- Ürünün durumu (Acil/Yaklaşan/Rahat/Geçmiş) tarihten **anlık hesaplanır**, veritabanında tutulmaz

---

## 📂 Veritabanı Tabloları

| Tablo | Açıklama |
|-------|----------|
| `isletme` | İşletme bilgisi (auth kullanıcısı = işletme) |
| `personel` | İşletmeye bağlı personel listesi |
| `kategori` | Ürün kategorileri |
| `urun` | Ürünler: ad, foto, SKT, durum, ekleyen/toplayan, kategori |

---

## 🚀 Kurulum ve Çalıştırma (Lokal)

### Gereksinimler
- [Node.js](https://nodejs.org/) (LTS sürümü)
- Bir [Supabase](https://supabase.com/) projesi (URL + anon key)

### Adımlar

```bash
# 1. Bağımlılıkları kur
npm install

# 2. Kök dizinde .env dosyası oluştur:
#    VITE_SUPABASE_URL=...
#    VITE_SUPABASE_ANON_KEY=...

# 3. Geliştirme sunucusunu başlat
npm run dev
```

### Derleme (Build)

```bash
npm run build      # dist/ klasörü oluşur, Netlify'a yayınlanır
```

---

## 🔐 Güvenlik Notları

- Her işletme **yalnızca kendi verisini** görür — Supabase **Row Level Security (RLS)** politikaları ile
- Ürün fotoğrafları işletmenin kendi klasörüne yüklenir; başka işletme erişemez
- Gizli anahtarlar `.env` dosyasında tutulur, koda ve repoya yazılmaz

---

<div align="center">

### 👨‍💻 Geliştirici

**Adem Uçar**
Matematik ve Bilgisayar Bilimleri

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/adem-u%C3%A7ar-39501731a/)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/ademucarr_/)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1025,50:3b82f6,100:38bdf8&height=100&section=footer" width="100%"/>

</div>
