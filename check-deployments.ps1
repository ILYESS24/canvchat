# Script PowerShell pour vérifier les déploiements Suna
Write-Host "🔍 Vérification des déploiements Suna..." -ForegroundColor Cyan

# URLs à vérifier (remplacer par vos vraies URLs Render)
$frontendUrl = "https://votre-frontend-suna.onrender.com"
$backendUrl = "https://votre-backend-suna.onrender.com"

Write-Host "🌐 Test Frontend: $frontendUrl" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $frontendUrl -TimeoutSec 10
    Write-Host "✅ Frontend OK - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend KO - Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🔧 Test Backend: $backendUrl/health" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/health" -TimeoutSec 10
    Write-Host "✅ Backend OK - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend KO - Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "📋 Instructions finales:" -ForegroundColor Cyan
Write-Host "1. Remplacez les URLs dans ce script par vos vraies URLs Render" -ForegroundColor White
Write-Host "2. Exécutez ce script pour vérifier que tout fonctionne" -ForegroundColor White
Write-Host "3. Votre Suna AI Platform devrait être opérationnelle !" -ForegroundColor Green
