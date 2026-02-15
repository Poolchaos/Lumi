/**
 * Copyright (c) 2025-2026 Phillip-Juan van der Berg. All Rights Reserved.
 *
 * This file is part of Lumi.
 *
 * Lumi is licensed under the PolyForm Noncommercial License 1.0.0.
 * You may not use this file except in compliance with the License.
 *
 * Commercial use requires a separate paid license.
 * Contact: phillipjuanvanderberg@gmail.com
 *
 * See the LICENSE file for the full license text.
 */

import SharedWorkoutPlan from '../models/SharedWorkoutPlan';

/** Characters used for share codes (uppercase alphanumeric, excluding confusables) */
const SHARE_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes I, O, 0, 1

const SHARE_CODE_LENGTH = 6;
const MAX_RETRIES = 5;

/**
 * Generate a random share code
 */
function generateRandomCode(): string {
  let code = '';
  for (let i = 0; i < SHARE_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * SHARE_CODE_CHARS.length);
    code += SHARE_CODE_CHARS[randomIndex];
  }
  return code;
}

/**
 * Generate a unique share code with collision checking
 * Uses retry logic with exponential backoff if collision detected
 */
export async function generateUniqueShareCode(): Promise<string> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const code = generateRandomCode();

    // Check if code already exists
    const existing = await SharedWorkoutPlan.findOne({ share_code: code }).lean();

    if (!existing) {
      return code;
    }

    // Exponential backoff before retry (10ms, 20ms, 40ms, 80ms, 160ms)
    if (attempt < MAX_RETRIES - 1) {
      await new Promise((resolve) => setTimeout(resolve, 10 * Math.pow(2, attempt)));
    }
  }

  throw new Error(
    `Failed to generate unique share code after ${MAX_RETRIES} attempts`
  );
}

/**
 * Validate share code format
 */
export function isValidShareCode(code: string): boolean {
  if (typeof code !== 'string' || code.length !== SHARE_CODE_LENGTH) {
    return false;
  }

  const upperCode = code.toUpperCase();
  for (const char of upperCode) {
    if (!SHARE_CODE_CHARS.includes(char)) {
      return false;
    }
  }

  return true;
}
