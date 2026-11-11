param([ValidateSet("secrets","sast","deps","image","all")]$Check = "all")
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Invoke-Step([string]$Name, [scriptblock]$Cmd) {
  Write-Host "==> $Name" -ForegroundColor Cyan
  & $Cmd
  if ($LASTEXITCODE -ne 0) {
    Write-Host "FAILED: $Name" -ForegroundColor Red
    exit $LASTEXITCODE
  }
}

function Run-Secrets { Invoke-Step "Gitleaks" { pre-commit run gitleaks --all-files } }
function Run-Sast    { Invoke-Step "Semgrep" { docker run --rm -v "${root}:/src" -w /src semgrep/semgrep semgrep scan --config p/owasp-top-ten --config p/typescript --config p/nextjs --config p/react --severity ERROR --error } }
function Run-Deps    { Invoke-Step "Trivy deps" { docker run --rm -v "${root}:/src" aquasec/trivy fs --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 /src } }
function Run-Image   {
  Invoke-Step "Docker build" { docker build -t episodle:local . }
  Invoke-Step "Trivy image" { docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 episodle:local }
}

switch ($Check) {
  "secrets" { Run-Secrets }
  "sast"    { Run-Sast }
  "deps"    { Run-Deps }
  "image"   { Run-Image }
  "all"     { Run-Secrets; Run-Sast; Run-Deps; Run-Image }
}
Write-Host "All selected checks passed" -ForegroundColor Green