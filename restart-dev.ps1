# Restart Development Servers Script

Write-Host "Restarting development servers..." -ForegroundColor Cyan

# Kill any existing Node processes on ports 3001 and 4200
Write-Host "`nStopping existing servers..." -ForegroundColor Yellow

$processes = Get-NetTCPConnection -LocalPort 3001,4200 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($proc in $processes) {
    Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

# Start backend server
Write-Host "`nStarting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

Start-Sleep -Seconds 3

# Start frontend server
Write-Host "Starting frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm start"

Write-Host "`nServers are starting!" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "`nWait a few seconds for servers to fully start..." -ForegroundColor Yellow
