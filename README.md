# Halk Eğitim Bordro Sistemi

Türkiye Halk Eğitim Merkezi eğitmenleri için bordro hesaplama ve yönetim sistemi.

## Özellikler

### 🆕 2025 Güncellemeleri

#### MEB Ek Ders Ücretleri (Otomatik)
- ✅ **Gündüz:** 163,83 TL/saat
- ✅ **Gece:** 191,25 TL/saat
- ✅ Otomatik doldurma veya manuel değiştirme

#### Akıllı Gün Hesaplama
- ✅ **8 saat = 1 gün** kuralı
- ✅ Otomatik prim gün hesaplama
- ✅ Detaylı gösterim (saat, gün, gün ücreti)

### Bordro Özellikleri
- 📋 Bordro oluşturma ve listeleme
- 🧮 Otomatik vergi hesaplama (Damga Vergisi, Gelir Vergisi)
- 📊 Detaylı bordro görüntüleme
- 🖨️ Yazdırma desteği
- 💾 Yerel depolama (localStorage)

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Üretim için derle
npm run build
```

## Teknolojiler

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router

## Kullanım

1. Ana sayfada "Yeni Bordro" butonuna tıklayın
2. Eğitmen seçin
3. Çalışma türünü seçin (Gündüz/Gece)
4. Çalışma saatini girin
5. MEB otomatik ücretini kullanın veya manuel girin
6. "Bordro Oluştur" butonuna tıklayın
7. Bordro detayını görüntüleyin ve yazdırın

## Lisans

MIT
