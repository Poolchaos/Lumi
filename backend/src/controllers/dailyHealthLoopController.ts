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

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  processMorningCheckIn,
  processEveningCheckIn,
  getDailyLoopStatus,
} from '../services/dailyHealthLoopService';

export const submitMorningCheckIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { mood, energy_level, sleep_quality, sleep_hours, notes } = req.body;

    const result = await processMorningCheckIn(userId, {
      userId,
      date: new Date(),
      type: 'morning',
      mood,
      energy_level,
      sleep_quality,
      sleep_hours,
      notes,
    });

    res.json({
      success: true,
      result,
      message: 'Morning check-in completed',
    });
  } catch (error) {
    console.error('Morning check-in controller error:', error);
    res.status(500).json({ error: 'Failed to process morning check-in' });
  }
};

export const submitEveningCheckIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { mood, water_intake, notes } = req.body;

    const result = await processEveningCheckIn(userId, {
      userId,
      date: new Date(),
      type: 'evening',
      mood,
      water_intake,
      notes,
    });

    res.json({
      success: true,
      result,
      message: 'Evening check-in completed',
    });
  } catch (error) {
    console.error('Evening check-in controller error:', error);
    res.status(500).json({ error: 'Failed to process evening check-in' });
  }
};

export const getLoopStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const status = await getDailyLoopStatus(userId);

    res.json({
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get loop status controller error:', error);
    res.status(500).json({ error: 'Failed to get daily loop status' });
  }
};
