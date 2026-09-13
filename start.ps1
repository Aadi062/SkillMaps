# SkillMap AI - Single-Command Development Launcher
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "🚀 Launching SkillMap AI Prototype (Full-Stack)" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

# Check Python and Node
Write-Host "Checking runtime environments..." -ForegroundColor Yellow
python --version
node -v

Write-Host "`nStarting FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Cyan
$backendJob = Start-Process -FilePath "python" -ArgumentList "-m uvicorn main:app --reload --port 8000" -WorkingDirectory "$PSScriptRoot\backend" -PassThru

Write-Host "Starting React PWA Frontend on http://localhost:5173 ..." -ForegroundColor Cyan
$frontendJob = Start-Process -FilePath "npm" -ArgumentList "run dev -- --port 5173" -WorkingDirectory "$PSScriptRoot\frontend" -PassThru

Write-Host "`nBoth services launched!" -ForegroundColor Green
Write-Host "• Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "• Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "• API Docs:  http://localhost:8000/docs" -ForegroundColor White
Write-Host "`nPress Ctrl+C or close this terminal to stop." -ForegroundColor Yellow

try {
    Wait-Process -Id $frontendJob.Id, $backendJob.Id
} finally {
    Stop-Process -Id $backendJob.Id -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendJob.Id -ErrorAction SilentlyContinue
}
