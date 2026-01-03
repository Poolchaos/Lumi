#!/usr/bin/env bash
#
# add-copyright-headers.sh
# 
# Automatically prepends copyright headers to all TypeScript/JavaScript source files.
# Safe to run multiple times - skips files that already have the header.
#
# Usage: ./scripts/add-copyright-headers.sh
#

set -e

# Configuration
OWNER="Phillip-Juan van der Berg"
YEAR_START="2025"
YEAR_END="2026"
EMAIL="phillipjuan.vdb@gmail.com"

# The copyright header to prepend
read -r -d '' HEADER << 'EOF' || true
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

EOF

# Marker to detect if header already exists
MARKER="Copyright (c)"

# Counter for stats
FILES_UPDATED=0
FILES_SKIPPED=0
FILES_FAILED=0

echo "PersonalFit Copyright Header Injector"
echo "======================================"
echo ""
echo "Owner: $OWNER"
echo "Years: $YEAR_START-$YEAR_END"
echo ""

# Find all TypeScript and JavaScript files (excluding node_modules, dist, build)
find_files() {
    find . \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
        -not -path "*/node_modules/*" \
        -not -path "*/dist/*" \
        -not -path "*/build/*" \
        -not -path "*/.git/*" \
        -not -path "*/coverage/*" \
        -not -path "*/playwright-report/*" \
        -not -path "*/test-results/*" \
        -type f
}

# Process each file
process_file() {
    local file="$1"
    
    # Check if file already has the copyright header
    if grep -q "$MARKER" "$file" 2>/dev/null; then
        echo "[SKIP] Already has header: $file"
        ((FILES_SKIPPED++))
        return 0
    fi
    
    # Create temp file with header + original content
    local temp_file=$(mktemp)
    
    # Check if file starts with shebang
    if head -n 1 "$file" | grep -q "^#!"; then
        # Preserve shebang, add header after
        head -n 1 "$file" > "$temp_file"
        echo "" >> "$temp_file"
        echo "$HEADER" >> "$temp_file"
        tail -n +2 "$file" >> "$temp_file"
    else
        # Add header at the beginning
        echo "$HEADER" > "$temp_file"
        cat "$file" >> "$temp_file"
    fi
    
    # Replace original file
    if mv "$temp_file" "$file"; then
        echo "[OK] Updated: $file"
        ((FILES_UPDATED++))
    else
        echo "[FAIL] Failed: $file"
        ((FILES_FAILED++))
        rm -f "$temp_file"
    fi
}

# Main execution
echo "Scanning for source files..."
echo ""

# Store files in array to get count
mapfile -t FILES < <(find_files)
TOTAL_FILES=${#FILES[@]}

echo "Found $TOTAL_FILES source files to process."
echo ""

# Process each file
for file in "${FILES[@]}"; do
    process_file "$file"
done

echo ""
echo "======================================"
echo "SUMMARY"
echo "======================================"
echo "[OK] Files updated: $FILES_UPDATED"
echo "[SKIP] Files skipped: $FILES_SKIPPED"
echo "[FAIL] Files failed: $FILES_FAILED"
echo "[TOTAL] Total files: $TOTAL_FILES"
echo ""

if [ $FILES_FAILED -gt 0 ]; then
    echo "[WARNING] Some files failed to update. Check the output above."
    exit 1
fi

echo "[SUCCESS] Copyright headers successfully applied!"
echo ""
echo "Next steps:"
echo "  1. Review the changes: git diff"
echo "  2. Commit the changes"
echo ""
