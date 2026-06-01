# Sync extensao-n8n-teste: push local-only, pull remote-only
$ErrorActionPreference = "Stop"
Set-Location "c:\Users\kenio\automacoes e testes"

npx --yes n8nac env use "extensao n8n teste" | Out-Host

$localJson = (npx --yes n8nac list --local --json 2>&1) -join "`n"
$localJson = $localJson.TrimStart([char]0xFEFF)
$local = @($localJson | ConvertFrom-Json)

$remoteJson = (npx --yes n8nac list --remote --json 2>&1) -join "`n"
$remoteJson = $remoteJson.TrimStart([char]0xFEFF)
$remote = @($remoteJson | ConvertFrom-Json)

Write-Host "`n=== PULL remote-only ($($remote.Count)) ===" -ForegroundColor Cyan
foreach ($w in $remote) {
    Write-Host "Pull $($w.name) ($($w.id))..."
    npx --yes n8nac pull $w.id 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { Write-Warning "Pull failed: $($w.name)" }
}

Write-Host "`n=== PUSH local-only ($($local.Count)) ===" -ForegroundColor Cyan
$base = "workflows\n8n\extensao-n8n-teste"
foreach ($w in $local) {
    $path = Join-Path $base $w.filename
    if (-not (Test-Path $path)) {
        Write-Warning "Skip missing file: $path"
        continue
    }
    Write-Host "Push $($w.name)..."
    npx --yes n8nac push $path --verify 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { Write-Warning "Push failed: $($w.name)" }
}

Write-Host "`n=== LIST summary ===" -ForegroundColor Cyan
npx --yes n8nac list 2>&1 | Select-Object -Last 8
