@echo off
echo Program durduruluyor...
taskkill /F /IM node.exe 2>nul
echo ✅ Program durduruldu!
timeout /t 2 >nul
