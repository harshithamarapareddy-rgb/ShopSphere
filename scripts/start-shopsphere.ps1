param([switch]$Restart)

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$LogDir = Join-Path $env:LOCALAPPDATA 'ShopSphere\logs'
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

if ($Restart) {
  foreach ($port in @(5000, 3000)) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($connection in $connections) {
      Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue
    }
  }
  Start-Sleep -Seconds 2
}

function Test-Port {
  param([int]$Port)
  try {
    $client = New-Object System.Net.Sockets.TcpClient
    $iar = $client.BeginConnect('127.0.0.1', $Port, $null, $null)
    $ok = $iar.AsyncWaitHandle.WaitOne(500, $false)
    if ($ok -and $client.Connected) { $client.EndConnect($iar) }
    $client.Close()
    return $ok
  } catch {
    return $false
  }
}

& (Join-Path $PSScriptRoot 'start-mongodb.ps1')
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if (-not (Test-Port -Port 5000)) {
  Write-Output 'Starting backend on port 5000...'
  Start-Process -FilePath 'node' -ArgumentList 'server.js' `
    -WorkingDirectory (Join-Path $Root 'backend') -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $LogDir 'backend.out.log') `
    -RedirectStandardError (Join-Path $LogDir 'backend.err.log') | Out-Null
} else {
  Write-Output 'Backend already running on port 5000'
}

if (-not (Test-Port -Port 3000)) {
  Write-Output 'Starting frontend on port 3000...'
  Start-Process -FilePath 'npm.cmd' -ArgumentList 'run', 'dev' `
    -WorkingDirectory (Join-Path $Root 'frontend') -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $LogDir 'frontend.out.log') `
    -RedirectStandardError (Join-Path $LogDir 'frontend.err.log') | Out-Null
} else {
  Write-Output 'Frontend already running on port 3000'
}

for ($i = 0; $i -lt 40; $i++) {
  Start-Sleep -Milliseconds 500
  if ((Test-Port -Port 5000) -and (Test-Port -Port 3000)) { break }
}

Write-Output ''
Write-Output 'SHOP SPHERE:'
Write-Output '  Frontend: http://localhost:3000'
Write-Output '  Backend:  http://localhost:5000/api/health'
Write-Output '  MongoDB:  127.0.0.1:27017'
Write-Output "  Logs:     $LogDir"
