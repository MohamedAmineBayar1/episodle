param([ValidateSet("secrets","sast","deps","image","all")]$Check = "all")
$ErrorActionPreference = "Stop"
$pwdPath = (Get-Location).Path

function Run-Secrets { pre-commit run gitleaks --all-files }
function Run-Sast    { docker run --rm -v "${pwdPath}:/src" -w /src semgrep/semgrep semgrep scan --config p/owasp-top-ten --config p/typescript --config p/nextjs --config p/react --severity ERROR --error }
function Run-Deps    { docker run --rm -v "${pwdPath}:/src" aquasec/trivy fs --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 /src }
function Run-Image   { docker build -t episodle:local . ; docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 episodle:local }

switch ($Check) {
  "secrets" { Run-Secrets }
  "sast"    { Run-Sast }
  "deps"    { Run-Deps }
  "image"   { Run-Image }
  "all"     { Run-Secrets; Run-Sast; Run-Deps; Run-Image }
}