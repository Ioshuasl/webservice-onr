# ONLYOFFICE Document Server - healthcheck (Windows / PowerShell)
# Uso:
#   .\onlyoffice\scripts\healthcheck.ps1
#   npm run onlyoffice:health
#   .\onlyoffice\scripts\healthcheck.ps1 -Json
#   .\onlyoffice\scripts\healthcheck.ps1 -VerboseCheck

param(
    [string]$ContainerName = "onlyoffice-docs-dev",
    [string]$BaseUrl = "",
    [int]$AppPort = 0,
    [switch]$Json,
    [switch]$VerboseCheck,
    [switch]$SkipDocker
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$envFile = Join-Path $repoRoot "onlyoffice\.env"

function Read-EnvFile {
    param([string]$Path)
    $map = @{}
    if (-not (Test-Path $Path)) { return $map }
    Get-Content $Path | ForEach-Object {
        $line = $_.Trim()
        if (-not $line -or $line.StartsWith("#")) { return }
        $eq = $line.IndexOf("=")
        if ($eq -lt 1) { return }
        $key = $line.Substring(0, $eq).Trim()
        $val = $line.Substring($eq + 1).Trim()
        $map[$key] = $val
    }
    return $map
}

$envVars = Read-EnvFile -Path $envFile
if (-not $BaseUrl) {
    $port = if ($envVars["ONLYOFFICE_HTTP_PORT"]) { $envVars["ONLYOFFICE_HTTP_PORT"] } else { "8080" }
    $BaseUrl = "http://localhost:$port"
}
if ($AppPort -eq 0) {
    $AppPort = if ($envVars["ONLYOFFICE_APP_PORT"]) { [int]$envVars["ONLYOFFICE_APP_PORT"] } else { 3001 }
}

$results = [ordered]@{
    timestamp   = (Get-Date).ToString("o")
    container   = $ContainerName
    baseUrl     = $BaseUrl
    checks      = @()
    ok          = $true
}

function Add-Check {
    param(
        [string]$Name,
        [bool]$Pass,
        [string]$Detail = "",
        [string]$Severity = "error"
    )
    $script:results.checks += [ordered]@{
        name     = $Name
        pass     = $Pass
        detail   = $Detail
        severity = $Severity
    }
    if (-not $Pass -and $Severity -eq "error") {
        $script:results.ok = $false
    }
}

function Invoke-HttpText {
    param([string]$Url, [int]$TimeoutSec = 10)
    try {
        $resp = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $TimeoutSec
        return @{ Ok = $true; StatusCode = $resp.StatusCode; Body = $resp.Content }
    } catch {
        $status = $null
        if ($_.Exception.Response) { $status = [int]$_.Exception.Response.StatusCode }
        return @{ Ok = $false; StatusCode = $status; Body = $_.Exception.Message }
    }
}

# --- Docker daemon ---
if (-not $SkipDocker) {
    try {
        $null = docker version --format "{{.Server.Version}}" 2>&1
        if ($LASTEXITCODE -ne 0) { throw "docker exit $LASTEXITCODE" }
        Add-Check -Name "docker_daemon" -Pass $true -Detail "Docker disponivel"
    } catch {
        Add-Check -Name "docker_daemon" -Pass $false -Detail $_.Exception.Message
    }

    # --- Container running ---
    try {
        $state = docker inspect -f "{{.State.Status}}" $ContainerName 2>$null
        if ($LASTEXITCODE -ne 0 -or -not $state) {
            Add-Check -Name "container_running" -Pass $false -Detail "Container '$ContainerName' nao encontrado"
        } elseif ($state -ne "running") {
            Add-Check -Name "container_running" -Pass $false -Detail "Status: $state"
        } else {
            $image = docker inspect -f "{{.Config.Image}}" $ContainerName 2>$null
            Add-Check -Name "container_running" -Pass $true -Detail "running - $image"
        }
    } catch {
        Add-Check -Name "container_running" -Pass $false -Detail $_.Exception.Message
    }
}

# --- HTTP /healthcheck ---
$hc = Invoke-HttpText -Url "$BaseUrl/healthcheck"
$hcBody = ($hc.Body -as [string]).Trim()
$hcPass = $hc.Ok -and $hc.StatusCode -eq 200 -and $hcBody -eq "true"
$hcDetail = if ($hcPass) { "200 true" } else { "status=$($hc.StatusCode) body=$hcBody" }
Add-Check -Name "http_healthcheck" -Pass $hcPass -Detail $hcDetail

# --- Welcome page ---
$welcome = Invoke-HttpText -Url "$BaseUrl/welcome/"
$welcomePass = $welcome.Ok -and $welcome.StatusCode -eq 200 -and ($welcome.Body -match "ONLYOFFICE")
$welcomeDetail = if ($welcomePass) { "200 ONLYOFFICE welcome" } else { "status=$($welcome.StatusCode)" }
Add-Check -Name "http_welcome" -Pass $welcomePass -Detail $welcomeDetail -Severity "warn"

# --- api.js ---
$apiJs = Invoke-HttpText -Url "$BaseUrl/web-apps/apps/api/documents/api.js"
$apiPass = $apiJs.Ok -and $apiJs.StatusCode -eq 200 -and ($apiJs.Body -match "DocsAPI")
$apiDetail = if ($apiPass) { "200 DocsAPI" } else { "status=$($apiJs.StatusCode)" }
Add-Check -Name "http_api_js" -Pass $apiPass -Detail $apiDetail

# --- Supervisor (inside container) ---
if (-not $SkipDocker -and ($results.checks | Where-Object { $_.name -eq "container_running" -and $_.pass })) {
    try {
        $sup = docker exec $ContainerName supervisorctl status 2>&1 | Out-String
        $docOk = $sup -match "ds:docservice\s+RUNNING"
        $convOk = $sup -match "ds:converter\s+RUNNING"
        $detail = ($sup.Trim() -split "`n" | Where-Object { $_ -match "^ds:" }) -join "; "
        $docDetail = if ($docOk) { "RUNNING" } else { $detail }
        $convDetail = if ($convOk) { "RUNNING" } else { $detail }
        Add-Check -Name "supervisor_docservice" -Pass $docOk -Detail $docDetail
        Add-Check -Name "supervisor_converter" -Pass $convOk -Detail $convDetail
    } catch {
        Add-Check -Name "supervisor_docservice" -Pass $false -Detail $_.Exception.Message
        Add-Check -Name "supervisor_converter" -Pass $false -Detail $_.Exception.Message
    }
}

# --- Dev app (optional) ---
$appHc = Invoke-HttpText -Url "http://localhost:$AppPort/health" -TimeoutSec 3
if ($appHc.Ok) {
    Add-Check -Name "dev_app" -Pass $true -Detail "http://localhost:$AppPort/health OK" -Severity "warn"
} else {
    Add-Check -Name "dev_app" -Pass $false -Detail "offline (npm run onlyoffice:dev)" -Severity "warn"
}

# --- Output ---
if ($Json) {
    $results | ConvertTo-Json -Depth 5
} else {
    $icon = if ($results.ok) { "[OK]" } else { "[FAIL]" }
    Write-Host ""
    Write-Host "$icon ONLYOFFICE healthcheck - $BaseUrl" -ForegroundColor $(if ($results.ok) { "Green" } else { "Red" })
    Write-Host "Container: $ContainerName" -ForegroundColor DarkGray
    Write-Host ""
    foreach ($c in $results.checks) {
        $mark = if ($c.pass) { "PASS" } else { if ($c.severity -eq "warn") { "WARN" } else { "FAIL" } }
        $color = switch ($mark) {
            "PASS" { "Green" }
            "WARN" { "Yellow" }
            default { "Red" }
        }
        $line = ("  {0,-22} {1,-4} {2}" -f $c.name, $mark, $c.detail)
        Write-Host $line -ForegroundColor $color
        if ($VerboseCheck -and -not $c.pass -and $c.severity -eq "error") {
            Write-Host '    ver onlyoffice/troubleshooting.md na skill' -ForegroundColor DarkGray
        }
    }
    Write-Host ""
}

if (-not $results.ok) { exit 1 }
exit 0
