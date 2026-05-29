@echo off
title ERP con IA

echo Arrancando ERP con IA...
echo.

REM 1. Arrancar MongoDB con Docker
docker start mongodb 2>nul
if errorlevel 1 (
    echo   Arrancando MongoDB (Docker)...
    docker run -d --name mongodb -p 27017:27017 mongo:7 >nul 2>&1
    timeout /T 3 /NOBREAK >nul
    echo   MongoDB listo
) else (
    echo   MongoDB ya esta corriendo
)

REM 2. Arrancar backend
echo   Arrancando backend...
start "Backend" cmd /C "cd /d %~dp0backend && npm run dev"

REM 3. Arrancar frontend
echo   Arrancando frontend...
start "Frontend" cmd /C "cd /d %~dp0frontend && npm run dev"

REM 4. Poblar BD
timeout /T 5 /NOBREAK >nul
echo   Poblando BD con datos de prueba...
curl -X POST http://localhost:5000/api/seed 2>nul
echo.
echo ERP listo en http://localhost:5173
echo.
echo Cierra las ventanas para parar.
pause
