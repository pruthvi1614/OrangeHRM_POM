$json = Get-Content "$env:WORKSPACE\test-results\results.json" -Raw | ConvertFrom-Json

$total = $json.stats.expected +
         $json.stats.unexpected +
         $json.stats.skipped +
         $json.stats.flaky

Write-Host "================================="
Write-Host "Playwright Execution Summary"
Write-Host "================================="
Write-Host "Total Tests :" $total
Write-Host "Passed      :" $json.stats.expected
Write-Host "Failed      :" $json.stats.unexpected
Write-Host "Skipped     :" $json.stats.skipped
Write-Host "Flaky       :" $json.stats.flaky
Write-Host "================================="