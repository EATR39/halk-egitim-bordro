# Halk Eğitim Bordro Yönetim Sistemi

Türkiye'deki Halk Eğitim Merkezleri için geliştirilmiş, tam çalışır offline bordro yönetim sistemi.

## 🎯 Özellikler

- **Usta Öğretici Yönetimi**: Kayıt, düzenleme ve silme işlemleri
- **Bordro Hesaplama**: Otomatik brüt/net maaş hesaplama
- **SGK Primi Hesaplama**: Emekli ve işsiz durumuna göre farklı hesaplama
- **Gelir Vergisi**: 2025 vergi dilimleri ile artan oranlı hesaplama
- **Yazdırma**: Bordro yazdırma desteği
- **Veri Yedekleme**: JSON formatında dışa/içe aktarma
- **Offline Çalışma**: İnternet bağlantısı gerektirmez

## 🚀 Kurulum

### Gereksinimler

- Node.js 18 veya üzeri ([İndir](https://nodejs.org/))
- Modern web tarayıcısı (Chrome, Firefox, Edge)

### Hızlı Başlangıç

1. ZIP dosyasını indirin ve çıkartın
2. `KURULUM.bat` dosyasına çift tıklayın
3. Kurulum tamamlandığında program otomatik açılacaktır

### Manuel Kurulum

```bash
npm install
npm run dev
```

Tarayıcınızda http://localhost:5173 adresini açın.

## 📖 Kullanım

### Usta Öğretici Ekleme

1. Sol menüden "Usta Öğreticiler" sayfasına gidin
2. "Yeni Usta Öğretici" butonuna tıklayın
3. Gerekli bilgileri doldurun ve kaydedin

### Bordro Oluşturma

1. "Bordrolar" sayfasına gidin
2. "Yeni Bordro" butonuna tıklayın
3. Usta öğretici seçin
4. Dönem, saat ve gün bilgilerini girin
5. "Hesapla ve Kaydet" butonuna tıklayın

### Bordro Yazdırma

1. Bordro listesinden detay sayfasına gidin
2. "Yazdır" butonuna tıklayın

## 💰 Hesaplama Detayları

### SGK Primi

| Durum | İşçi Payı | İşveren Payı |
|-------|-----------|--------------|
| Emekli | - | %14.5 (İştirakçi) |
| İşsiz | %14 | %15.5 |

### 2025 Vergi Dilimleri

| Dilim | Oran |
|-------|------|
| 0 - 110.000 TL | %15 |
| 110.000 - 230.000 TL | %20 |
| 230.000 - 580.000 TL | %27 |
| 580.000 - 3.000.000 TL | %35 |
| 3.000.000 TL üzeri | %40 |

### Damga Vergisi

- Oran: %0.759

## 🛠️ Geliştirme

### Proje Yapısı

```
src/
├── components/     # UI bileşenleri
├── pages/          # Sayfa bileşenleri
├── services/       # Servis katmanı
├── types/          # TypeScript tipleri
├── utils/          # Yardımcı fonksiyonlar
└── main.tsx        # Uygulama giriş noktası
```

### Komutlar

```bash
npm run dev      # Geliştirme sunucusu
npm run build    # Üretim derlemesi
npm run preview  # Derleme önizleme
npm run lint     # Kod denetimi
```

## 📝 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/yenilik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik ekle'`)
4. Branch'i push edin (`git push origin feature/yenilik`)
5. Pull Request oluşturun

## 📞 Destek

Sorunlarınız için GitHub Issues kullanabilirsiniz.
