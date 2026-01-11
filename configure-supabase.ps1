# Script PowerShell pour configurer Supabase sur Vercel
# Utilise les credentials fournis par l'utilisateur

Write-Host "🚀 Configuration de Supabase sur Vercel..." -ForegroundColor Green

# Fonction pour ajouter une variable d'environnement
function Add-VercelEnv {
    param(
        [string]$Name,
        [string]$Value,
        [switch]$Sensitive
    )

    Write-Host "📝 Configuration de $Name..." -ForegroundColor Yellow

    if ($Sensitive) {
        # Pour les variables sensibles, utiliser une approche différente
        $tempFile = [System.IO.Path]::GetTempFileName()
        $Value | Out-File -FilePath $tempFile -Encoding UTF8 -NoNewline

        # Utiliser vercel env add avec redirection
        $process = Start-Process -FilePath "vercel" -ArgumentList "env", "add", $Name, "production" -RedirectStandardInput $tempFile -NoNewWindow -Wait -PassThru

        Remove-Item $tempFile -Force

        if ($process.ExitCode -eq 0) {
            Write-Host "✅ $Name configuré avec succès" -ForegroundColor Green
        } else {
            Write-Host "❌ Erreur lors de la configuration de $Name" -ForegroundColor Red
        }
    } else {
        # Pour les variables non sensibles
        $Value | vercel env add $Name production
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $Name configuré avec succès" -ForegroundColor Green
        } else {
            Write-Host "❌ Erreur lors de la configuration de $Name" -ForegroundColor Red
        }
    }
}

# Configuration des variables d'environnement
Write-Host "🔑 Configuration des credentials Supabase..." -ForegroundColor Cyan

# Variables publiques (non sensibles)
Add-VercelEnv -Name "NEXT_PUBLIC_SUPABASE_URL" -Value "https://otxxjczxwhtngcferckz.supabase.co"
Add-VercelEnv -Name "NEXT_PUBLIC_SUPABASE_ANON_KEY" -Value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90eHhqY3p4d2h0bmdjZmVyY2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDcxOTEsImV4cCI6MjA4MTIyMzE5MX0.B4A300qQZCwP-aG4J29KfeazJM_Pp1eHKXQ98_bLMw8"
Add-VercelEnv -Name "SUPABASE_URL" -Value "https://otxxjczxwhtngcferckz.supabase.co"
Add-VercelEnv -Name "SUPABASE_ANON_KEY" -Value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90eHhqY3p4d2h0bmdjZmVyY2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDcxOTEsImV4cCI6MjA4MTIyMzE5MX0.B4A300qQZCwP-aG4J29KfeazJM_Pp1eHKXQ98_bLMw8"

# Variable sensible (service role)
Add-VercelEnv -Name "SUPABASE_SERVICE_ROLE_KEY" -Value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90eHhqY3p4d2h0bmdjZmVyY2t6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTY0NzE5MSwiZXhwIjoyMDgxMjIzMTkxfQ.flRp7SzQGQwZJBG2NTecgwpMmVhUXmBAOVQJoibv-bg" -Sensitive

Write-Host "🎉 Configuration Supabase terminée !" -ForegroundColor Green
Write-Host "📦 Redéploiement de l'application..." -ForegroundColor Cyan

# Redéployer
vercel --prod --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Application redéployée avec succès !" -ForegroundColor Green
    Write-Host "🌐 URL : https://suna-main.vercel.app" -ForegroundColor Cyan
} else {
    Write-Host "❌ Erreur lors du redéploiement" -ForegroundColor Red
}
