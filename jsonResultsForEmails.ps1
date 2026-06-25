Write-Host "Script started..."

$jsonPath = "$PSScriptRoot\test-results\results.json"
Write-Host "Reading: $jsonPath"

$json = Get-Content $jsonPath -Raw | ConvertFrom-Json

$total   = $json.stats.expected + $json.stats.unexpected + $json.stats.skipped + $json.stats.flaky
$passed  = $json.stats.expected
$failed  = $json.stats.unexpected
$skipped = $json.stats.skipped

$outputPath = "$PSScriptRoot\test-summary.txt"

@"
Total Tests: $total
Passed: $passed
Failed: $failed
Skipped: $skipped
"@ | Out-File $outputPath -Encoding ascii

Write-Host "Created file: $outputPath"