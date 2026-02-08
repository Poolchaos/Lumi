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

import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  submitMorningCheckIn,
  submitEveningCheckIn,
  getLoopStatus,
} from '../controllers/dailyHealthLoopController';

const router = Router();

router.use(authenticate);

router.post(
  '/morning',
  [
    body('mood').optional().isIn(['great', 'good', 'okay', 'tired', 'stressed']),
    body('energy_level').optional().isInt({ min: 1, max: 5 }),
    body('sleep_quality').optional().isInt({ min: 1, max: 5 }),
    body('sleep_hours').optional().isFloat({ min: 0, max: 24 }),
    body('notes').optional().isString(),
  ],
  submitMorningCheckIn
);

router.post(
  '/evening',
  [
    body('mood').optional().isIn(['great', 'good', 'okay', 'tired', 'stressed']),
    body('water_intake').optional().isInt({ min: 0, max: 30 }),
    body('notes').optional().isString(),
  ],
  submitEveningCheckIn
);

router.get('/status', getLoopStatus);

export default router;
