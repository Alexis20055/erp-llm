# start-erp.ps1 — Arranca todo el ERP con IA en Windows
# Uso: .\start-erp.ps1
# Requiere: Node.js, Docker Desktop, npm install ya ejecutado

Write-Host "Arrancando ERP con IA..." -ForegroundColor Cyan

# 1. Arrancar MongoDB con Docker
try {
    $mongo = Invoke-WebRequest -Uri "http://localhost:27017" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "   MongoDB ya esta corriendo" -ForegroundColor Green
} catch {
    Write-Host "   Arrancando MongoDB (Docker)..." -ForegroundColor Yellow
    $container = docker ps -a --filter "name=mongodb" --format "{{.Names}}" 2>$null
    if ($container -eq "mongodb") {
        docker start mongodb
    } else {
        docker run -d --name mongodb -p 27017:27017 mongo:7
    }
    Start-Sleep -Seconds 3
    Write-Host "   MongoDB listo" -ForegroundColor Green
}

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 2. Arrancar backend
Write-Host "   Arrancando backend..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev
} -ArgumentList "$rootDir/backend"
Write-Host "   Backend iniciado (Job ID: $($backendJob.Id))" -ForegroundColor Green

# 3. Arrancar frontend
Write-Host "   Arrancando frontend..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev
} -ArgumentList "$rootDir/frontend"
Write-Host "   Frontend iniciado (Job ID: $($frontendJob.Id))" -ForegroundColor Green

Start-Sleep -Seconds 3

# 4. Poblar BD
Write-Host "   Poblando BD con datos de prueba..." -ForegroundColor Yellow
$seeded = $false
for ($i = 0; $i -lt 3; $i++) {
    try {
        $res = Invoke-WebRequest -Uri "http://localhost:5000/api/seed" -Method POST -UseBasicParsing -TimeoutSec 5
        if ($res.StatusCode -eq 201) {
            Write-Host "   BD poblada correctamente" -ForegroundColor Green
            $seeded = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}
if (-not $seeded) {
    Write-Host "   No se pudo poblar BD. Ejecuta luego: curl -X POST http://localhost:5000/api/seed" -ForegroundColor Red
}

Write-Host ""
Write-Host "ERP listo en http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para ver logs LLM:   curl http://localhost:5000/api/llm/logs" -ForegroundColor Gray
Write-Host ""
Write-Host "Presiona Ctrl+C para parar todo" -ForegroundColor Gray

# Esperar y limpiar al salir
try {
    while ($true) { Start-Sleep -Seconds 1 }
} finally {
    Write-Host "   Parando backend y frontend..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -ErrorAction SilentlyContinue
    Write-Host "   Todo parado" -ForegroundColor Green
}
