$ErrorActionPreference = 'Stop'

$MongoHome = $env:SHOP_SPHERE_MONGO_HOME
if (-not $MongoHome) { $MongoHome = 'C:\Users\harsh\mongodb' }

$DataDir = Join-Path $MongoHome 'data'
$LogDir = Join-Path $MongoHome 'logs'
$LogFile = Join-Path $LogDir 'mongod.log'
$Port = 27017

function Test-MongoPort {
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

if (Test-MongoPort -Port $Port) {
  Write-Output "MongoDB is already running on 127.0.0.1:$Port"
  exit 0
}

$MongodExe = Get-ChildItem -Path (Join-Path $MongoHome 'server') -Recurse -Filter 'mongod.exe' -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $MongodExe) {
  Write-Error "mongod.exe not found under $MongoHome\server. Set SHOP_SPHERE_MONGO_HOME to the MongoDB install folder."
  exit 1
}

New-Item -ItemType Directory -Force -Path $DataDir, $LogDir | Out-Null

Start-Process -FilePath $MongodExe.FullName -ArgumentList @(
  '--dbpath', $DataDir,
  '--logpath', $LogFile,
  '--port', "$Port",
  '--bind_ip', '127.0.0.1'
) -WindowStyle Hidden | Out-Null

for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Milliseconds 500
  if (Test-MongoPort -Port $Port) {
    Write-Output "MongoDB started on 127.0.0.1:$Port (data: $DataDir)"
    exit 0
  }
}

Write-Error "MongoDB did not start. Check $LogFile"
exit 1
