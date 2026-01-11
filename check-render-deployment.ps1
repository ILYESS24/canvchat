# Script PowerShell pour vérifier le déploiement Render
# Vérifie l'état de tous les services et bases de données

Write-Host "🔍 Vérification du déploiement Render..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# URLs à vérifier
$frontendUrl = "https://suna-frontend.onrender.com"
$backendUrl = "https://suna-backend.onrender.com"
$healthUrl = "https://suna-backend.onrender.com/health"

Write-Host "🌐 URLs à vérifier :" -ForegroundColor Yellow
Write-Host "  Frontend: $frontendUrl" -ForegroundColor White
Write-Host "  Backend:  $backendUrl" -ForegroundColor White
Write-Host "  Health:   $healthUrl" -ForegroundColor White
Write-Host ""

# Fonction pour tester une URL
function Test-RenderService {
    param(
        [string]$Url,
        [string]$ServiceName
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 30 -Method GET
        $statusCode = $response.StatusCode

        if ($statusCode -eq 200) {
            Write-Host "✅ $ServiceName : OK (Status: $statusCode)" -ForegroundColor Green

            # Pour l'health check, afficher le contenu
            if ($Url -like "*health*") {
                $content = $response.Content
                Write-Host "   Response: $content" -ForegroundColor Gray
            }
        } else {
            Write-Host "⚠️  $ServiceName : Status $statusCode" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "❌ $ServiceName : ÉCHEC - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Tester tous les services
Write-Host "🔍 Test des services Render..." -ForegroundColor Cyan
Write-Host ""

Test-RenderService -Url $frontendUrl -ServiceName "Frontend"
Test-RenderService -Url $backendUrl -ServiceName "Backend API"
Test-RenderService -Url $healthUrl -ServiceName "Health Check"

Write-Host ""
Write-Host "📋 Instructions si les services ne sont pas prêts :" -ForegroundColor Yellow
Write-Host "1. Attendez encore 5-10 minutes (premier déploiement)" -ForegroundColor White
Write-Host "2. Vérifiez les logs dans le dashboard Render" -ForegroundColor White
Write-Host "3. Redéployez manuellement si nécessaire" -ForegroundColor White
Write-Host ""

Write-Host "🌐 Liens utiles :" -ForegroundColor Cyan
Write-Host "  Dashboard Render: https://dashboard.render.com" -ForegroundColor White
Write-Host "  Documentation: https://docs.render.com" -ForegroundColor White
Write-Host "  Status: https://status.render.com" -ForegroundColor White

Write-Host ""
Write-Host "🎉 Vérification terminée !" -ForegroundColor Green
