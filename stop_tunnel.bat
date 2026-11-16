@echo off
echo Stopping Cloudflare Tunnel and Background Services...
taskkill /F /IM cloudflared.exe 2>nul
taskkill /F /FI "WINDOWTITLE eq MediCore Django Backend*" /IM cmd.exe 2>nul
taskkill /F /FI "WINDOWTITLE eq MediCore Vite Frontend*" /IM cmd.exe 2>nul
echo All processes stopped.

