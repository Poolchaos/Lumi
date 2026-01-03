# add-copyright-headers.ps1
#
# Automatically prepends copyright headers to all TypeScript/JavaScript source files.
# Safe to run multiple times - skips files that already have the header.
#
# Usage: .\scripts\add-copyright-headers.ps1

$ErrorActionPreference = "Stop"

# Configuration
$Owner = "Phillip-Juan van der Berg"
$YearStart = "2025"
$YearEnd = "2026"

# The copyright header to prepend
$Header = @"
/**
 * Copyright (c) 2025-2026 Phillip-Juan van der Berg. All Rights Reserved.
 * 
 * This file is part of PersonalFit.
 * 
 * PersonalFit is licensed under the PolyForm Noncommercial License 1.0.0.
 * You may not use this file except in compliance with the License.
 * 
 * Commercial use requires a separate paid license.
 * Contact: phillipjuan.vdb@gmail.com
 * 
 * See the LICENSE file for the full license text.
 */


"@

# Marker to detect if header already exists
$Marker = "Copyright (c)"

# Counters
$FilesUpdated = 0
$FilesSkipped = 0
$FilesFailed = 0

Write-Host ""
Write-Host "[COPYRIGHT] PersonalFit Copyright Header Injector" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Owner: $Owner"
Write-Host "Years: $YearStart-$YearEnd"
Write-Host ""

# Find all TypeScript and JavaScript files
$ExcludeDirs = @("node_modules", "dist", "build", ".git", "coverage", "playwright-report", "test-results")
$Extensions = @("*.ts", "*.tsx", "*.js", "*.jsx")

$Files = @()
foreach ($ext in $Extensions) {
    $Files += Get-ChildItem -Path . -Filter $ext -Recurse -File | Where-Object {
        $path = $_.FullName
        -not ($ExcludeDirs | Where-Object { $path -like "*\$_\*" })
    }
}

$TotalFiles = $Files.Count
Write-Host "Found $TotalFiles source files to process."
Write-Host ""

foreach ($file in $Files) {
    $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if ($null -eq $content) {
        Write-Host "[FAIL] Failed to read: $($file.FullName)" -ForegroundColor Red
        $FilesFailed++
        continue
    }
    
    # Check if file already has the copyright header
    if ($content -match [regex]::Escape($Marker)) {
        Write-Host "[SKIP] Already has header: $($file.FullName)" -ForegroundColor DarkGray
        $FilesSkipped++
        continue
    }
    
    try {
        # Add header at the beginning
        $newContent = $Header + $content
        Set-Content -Path $file.FullName -Value $newContent -NoNewline -Encoding UTF8
        Write-Host "[OK] Updated: $($file.FullName)" -ForegroundColor Green
        $FilesUpdated++
    }
    catch {
        Write-Host "[FAIL] Failed: $($file.FullName) - $_" -ForegroundColor Red
        $FilesFailed++
    }
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[OK] Files updated: $FilesUpdated" -ForegroundColor Green
Write-Host "[SKIP] Files skipped: $FilesSkipped" -ForegroundColor DarkGray
Write-Host "[FAIL] Files failed: $FilesFailed" -ForegroundColor $(if ($FilesFailed -gt 0) { "Red" } else { "DarkGray" })
Write-Host "[TOTAL] Total files: $TotalFiles"
Write-Host ""

if ($FilesFailed -gt 0) {
    Write-Host "[WARNING] Some files failed to update. Check the output above." -ForegroundColor Yellow
    exit 1
}

Write-Host "[SUCCESS] Copyright headers successfully applied!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Review the changes: git diff"
Write-Host "  2. Commit the changes"
Write-Host ""
