Set-Location $PSScriptRoot
Write-Host "Starting Shipping Backend Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Make sure no other server is running on port 8000!" -ForegroundColor Yellow
Write-Host ""
& "..\venv\Scripts\python.exe" manage.py runserver
