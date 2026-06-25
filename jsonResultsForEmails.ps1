$json = Get-Content "$PSScriptRoot\test-results\results.json" -Raw | ConvertFrom-Json

$total   = $json.stats.expected + $json.stats.unexpected + $json.stats.skipped + $json.stats.flaky
$passed  = $json.stats.expected
$failed  = $json.stats.unexpected
$skipped = $json.stats.skipped

$total   | Out-File "$PSScriptRoot\total.txt" -Encoding ascii
$passed  | Out-File "$PSScriptRoot\passed.txt" -Encoding ascii
$failed  | Out-File "$PSScriptRoot\failed.txt" -Encoding ascii
$skipped | Out-File "$PSScriptRoot\skipped.txt" -Encoding ascii