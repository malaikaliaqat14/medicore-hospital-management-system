@echo off
title MediCore Launcher with Cloudflare Tunnel
echo =====================================================================
echo  Starting MediCore Hospital Management System + Cloudflare Tunnel
echo =====================================================================

REM 1. Start Django Backend on port 8000
echo [1/3] Starting Django Backend on http://127.0.0.1:8000...
start "MediCore Django Backend" cmd /k "cd /d "%~dp0medicore" && venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"

REM 2. Start Vite Frontend on port 5173
echo [2/3] Starting Vite Frontend on http://localhost:5173...
start "MediCore Vite Frontend" cmd /k "cd /d "%~dp0medicore\frontend" && npm.cmd run dev"

REM 3. Give servers a few moments to spin up
echo Waiting 4 seconds for servers to initialize...
timeout /t 4 /nobreak >nul

REM 4. Start Cloudflare Tunnel exposing Vite (which reverse-proxies to Django)
echo [3/3] Launching Cloudflare Tunnel...
cd /d "%~dp0"
.\cloudflared.exe tunnel --url http://localhost:5173

