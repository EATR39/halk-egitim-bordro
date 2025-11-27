@echo off
chcp 65001 >nul
color 0B
title Bordro Sistemi

echo 🚀 Program başlatılıyor...
timeout /t 2 >nul
start http://localhost:5173
call npm run dev
pause
