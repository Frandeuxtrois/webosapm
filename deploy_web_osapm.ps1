# Deploy del Sistema Web OSAPM (pagina oficial www.osapm.org)
# React 19 + Vite. Build local -> robocopy a la carpeta del sitio IIS "WebOSAPM" en WEB01.
# Uso:
#   1) cd "C:\GyF\Pagina OSAPM\OSAPM FrontEnd"; npm run build
#   2) powershell.exe -ExecutionPolicy Bypass -File "C:\GyF\Pagina OSAPM\OSAPM FrontEnd\deploy_web_osapm.ps1"
$ErrorActionPreference = 'Stop'
$src  = 'C:\GyF\Pagina OSAPM\OSAPM FrontEnd\dist'
$dst  = '\\WEB01\c$\inetpub\wwwroot\WebOSAPM'
$bak  = "\\WEB01\c`$\inetpub\wwwroot\_WebOSAPM_bak_$(Get-Date -Format yyyyMMdd)"

if (-not (Test-Path $src)) { throw "No existe el build: $src  (corre 'npm run build' primero)" }
if (-not (Test-Path (Join-Path $src 'index.html'))) { throw "El build no tiene index.html" }

Write-Host "== Backup del sitio actual =="
robocopy $dst $bak /E /NFL /NDL /NJH /NJS /NP /R:1 /W:1 | Out-Null
Write-Host "   backup -> $bak"

Write-Host "== Deploy del build nuevo (sin borrar web.config) =="
# /E copia subdirectorios, NO borra lo que no esta en el origen (preserva web.config).
# Los assets llevan hash en el nombre; el JS/CSS viejo queda huerfano pero no molesta.
robocopy $src $dst /E /NFL /NDL /NJH /NJS /NP /R:1 /W:1
$code = $LASTEXITCODE
Write-Host ("robocopy exit code: " + $code + " (0-7 = OK)")
if ($code -ge 8) { throw "robocopy fallo (code $code)" }

Write-Host "== index.html deployado apunta a: =="
Select-String -Path (Join-Path $dst 'index.html') -Pattern 'assets/index-[A-Za-z0-9_-]+\.(js|css)' -AllMatches |
    ForEach-Object { $_.Matches } | ForEach-Object { Write-Host ('   ' + $_.Value) }
Write-Host "== DEPLOY WEB OSAPM OK =="
Write-Host "Verificar en vivo:  curl -sk https://www.osapm.org/ | grep index-  (debe coincidir el hash)"
