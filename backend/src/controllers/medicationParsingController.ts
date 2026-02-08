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

import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { parseMedicationNotes } from '../services/medicationParsingService';

/**
 * Parse free-form medication notes into structured data
 * POST /api/medications/parse-notes
 */
export const parseNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { notes } = req.body;

    if (!notes || typeof notes !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Notes are required',
      });
      return;
    }

    const result = await parseMedicationNotes(notes);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to parse medications',
      });
      return;
    }

    res.json({
      success: true,
      medications: result.medications,
      suggestions: result.suggestions,
    });
  } catch (error) {
    console.error('Error in parseNotes controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to parse medication notes',
    });
  }
};
