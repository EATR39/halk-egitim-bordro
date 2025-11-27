@echo off
chcp 65001 >nul
color 0A
title Halk Eğitim Bordro Sistemi - Otomatik Kurulum

echo. 
echo ╔════════════════════════════════════════════════════════╗
echo ║  HALK EĞİTİM BORDRO YÖNETİM SİSTEMİ                   ║
echo ║  Otomatik Kurulum Başlatılıyor...                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.
timeout /t 2 >nul

echo [ADIM 1/6] Node.js kontrol ediliyor...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ HATA: Node.js bulunamadı! 
    echo 👉 https://nodejs.org/
    pause
    start https://nodejs.org/
    exit /b 1
)
echo ✅ Node.js bulundu! 
node --version
echo.

echo [ADIM 2/6] Kurulum klasörü hazırlanıyor...
cd /d "%~dp0"
echo ✅ Kurulum klasörü: %cd%
echo.

echo [ADIM 3/6] Proje dosyaları kontrol ediliyor...
if not exist "package.json" (
    echo ❌ HATA: package.json bulunamadı! 
    pause
    exit /b 1
)
echo ✅ Proje dosyaları bulundu!
echo.

echo [ADIM 4/6] Paketler yükleniyor (2-5 dakika)...
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Paket yüklemesi başarısız!
        pause
        exit /b 1
    )
    echo ✅ Paketler yüklendi!
) else (
    echo ✅ Paketler zaten yüklü!
)
echo.

echo [ADIM 5/6] Sistem ayarları...
timeout /t 2 >nul

echo [ADIM 6/6] Program başlatılıyor...
echo ╔════════════════════════════════════════════════════════╗
echo ║  ✅ KURULUM TAMAMLANDI!                                 ║
echo ╚════════════════════════════════════════════════════════╝
echo 📌 http://localhost:5173
echo ⚠️  Bu pencereyi KAPATMAYIN!
timeout /t 3 >nul

start http://localhost:5173
call npm run dev
pause