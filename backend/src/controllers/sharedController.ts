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
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import SharedWorkoutPlan from '../models/SharedWorkoutPlan';
import WorkoutPlan from '../models/WorkoutPlan';
import {
  generateUniqueShareCode,
  isValidShareCode,
} from '../utils/shareCodeGenerator';

/**
 * Create a new shared workout plan
 * POST /api/shared/create
 */
export async function createShare(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user!.userId;
    const { planId, title, description } = req.body;

    // Check if plan exists and belongs to user
    const plan = await WorkoutPlan.findOne({
      _id: planId,
      user_id: userId,
    });

    if (!plan) {
      return res.status(404).json({
        error: 'Workout plan not found or you do not have access to it',
      });
    }

    // Generate unique share code
    const shareCode = await generateUniqueShareCode();

    // Create shared plan with frozen snapshot
    const sharedPlan = new SharedWorkoutPlan({
      share_code: shareCode,
      original_plan_id: plan._id,
      creator_id: userId,
      plan_snapshot: plan.plan_data,
      workout_modality: plan.workout_modality,
      title: title.trim(),
      description: description?.trim(),
      is_public: true,
    });

    await sharedPlan.save();

    return res.status(201).json({
      share_code: sharedPlan.share_code,
      share_url: `/shared/${sharedPlan.share_code}`,
      title: sharedPlan.title,
      created_at: sharedPlan.created_at,
    });
  } catch (error) {
    console.error('Error creating share:', error);
    return res.status(500).json({ error: 'Failed to create share' });
  }
}

/**
 * Get a shared plan by code (public endpoint)
 * GET /api/shared/:code
 */
export async function getSharedPlan(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const { code } = req.params;

    if (!isValidShareCode(code)) {
      return res.status(400).json({ error: 'Invalid share code format' });
    }

    const sharedPlan = await SharedWorkoutPlan.findOneAndUpdate(
      { share_code: code.toUpperCase(), is_public: true },
      { $inc: { view_count: 1 } },
      { new: true }
    ).lean();

    if (!sharedPlan) {
      return res.status(404).json({ error: 'Shared plan not found' });
    }

    // Check if expired
    if (sharedPlan.expires_at && new Date(sharedPlan.expires_at) < new Date()) {
      return res.status(404).json({ error: 'This share link has expired' });
    }

    return res.json({
      share_code: sharedPlan.share_code,
      title: sharedPlan.title,
      description: sharedPlan.description,
      workout_modality: sharedPlan.workout_modality,
      plan_data: sharedPlan.plan_snapshot,
      view_count: sharedPlan.view_count,
      import_count: sharedPlan.import_count,
      created_at: sharedPlan.created_at,
    });
  } catch (error) {
    console.error('Error getting shared plan:', error);
    return res.status(500).json({ error: 'Failed to get shared plan' });
  }
}

/**
 * Import a shared plan to user's account
 * POST /api/shared/:code/import
 */
export async function importSharedPlan(req: AuthRequest, res: Response): Promise<Response> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { code } = req.params;
    const userId = req.user!.userId;

    if (!isValidShareCode(code)) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Invalid share code format' });
    }

    // Find shared plan
    const sharedPlan = await SharedWorkoutPlan.findOne({
      share_code: code.toUpperCase(),
      is_public: true,
    }).session(session);

    if (!sharedPlan) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Shared plan not found' });
    }

    // Check if expired
    if (sharedPlan.expires_at && new Date(sharedPlan.expires_at) < new Date()) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'This share link has expired' });
    }

    // Deactivate user's current active plan (if any)
    await WorkoutPlan.updateMany(
      { user_id: userId, is_active: true },
      { is_active: false },
      { session }
    );

    // Clone the plan to user's account
    const newPlan = new WorkoutPlan({
      user_id: userId,
      workout_modality: sharedPlan.workout_modality,
      plan_data: sharedPlan.plan_snapshot,
      generation_context: {
        imported_from: sharedPlan.share_code,
      },
      is_active: true,
    });

    await newPlan.save({ session });

    // Increment import count
    await SharedWorkoutPlan.updateOne(
      { _id: sharedPlan._id },
      { $inc: { import_count: 1 } },
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({
      message: 'Plan imported successfully',
      plan_id: newPlan._id,
      title: sharedPlan.title,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error importing shared plan:', error);
    return res.status(500).json({ error: 'Failed to import shared plan' });
  } finally {
    session.endSession();
  }
}

/**
 * Get user's shared plans
 * GET /api/shared/my-shares
 */
export async function getUserShares(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const userId = req.user!.userId;

    const shares = await SharedWorkoutPlan.find({ creator_id: userId })
      .sort({ created_at: -1 })
      .select(
        'share_code title description workout_modality view_count import_count is_public created_at expires_at'
      )
      .lean();

    return res.json({
      shares: shares.map((share) => ({
        share_code: share.share_code,
        share_url: `/shared/${share.share_code}`,
        title: share.title,
        description: share.description,
        workout_modality: share.workout_modality,
        view_count: share.view_count,
        import_count: share.import_count,
        is_public: share.is_public,
        created_at: share.created_at,
        expires_at: share.expires_at,
      })),
      total: shares.length,
    });
  } catch (error) {
    console.error('Error getting user shares:', error);
    return res.status(500).json({ error: 'Failed to get shares' });
  }
}

/**
 * Delete a shared plan
 * DELETE /api/shared/:code
 */
export async function deleteShare(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const { code } = req.params;
    const userId = req.user!.userId;

    if (!isValidShareCode(code)) {
      return res.status(400).json({ error: 'Invalid share code format' });
    }

    const result = await SharedWorkoutPlan.findOneAndDelete({
      share_code: code.toUpperCase(),
      creator_id: userId,
    });

    if (!result) {
      return res.status(404).json({
        error: 'Share not found or you do not have permission to delete it',
      });
    }

    return res.json({ message: 'Share deleted successfully' });
  } catch (error) {
    console.error('Error deleting share:', error);
    return res.status(500).json({ error: 'Failed to delete share' });
  }
}
