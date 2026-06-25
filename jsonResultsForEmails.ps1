$json = Get-Content "$PSScriptRoot\test-results\results.json" -Raw | ConvertFrom-Json

$total   = $json.stats.expected + $json.stats.unexpected + $json.stats.skipped + $json.stats.flaky
$passed  = $json.stats.expected
$failed  = $json.stats.unexpected
$skipped = $json.stats.skipped

$html = @"
<table style='border-collapse:collapse;width:350px;text-align:center;'>
<tr style='background:#343a40;color:white;'>
<th style='padding:10px;border:1px solid #ddd;'>Metric</th>
<th style='padding:10px;border:1px solid #ddd;'>Count</th>
</tr>

<tr>
<td style='padding:10px;border:1px solid #ddd;'>Total Tests</td>
<td style='padding:10px;border:1px solid #ddd;'>$total</td>
</tr>

<tr style='background:#eafaf1;'>
<td style='padding:10px;border:1px solid #ddd;color:#28a745;'><b>Passed</b></td>
<td style='padding:10px;border:1px solid #ddd;color:#28a745;'><b>$passed</b></td>
</tr>

<tr style='background:#fdecea;'>
<td style='padding:10px;border:1px solid #ddd;color:#dc3545;'><b>Failed</b></td>
<td style='padding:10px;border:1px solid #ddd;color:#dc3545;'><b>$failed</b></td>
</tr>

<tr style='background:#fff8e1;'>
<td style='padding:10px;border:1px solid #ddd;color:#ff9800;'><b>Skipped</b></td>
<td style='padding:10px;border:1px solid #ddd;color:#ff9800;'><b>$skipped</b></td>
</tr>
</table>
"@

$html | Out-File "$PSScriptRoot\test-summary.html" -Encoding utf8