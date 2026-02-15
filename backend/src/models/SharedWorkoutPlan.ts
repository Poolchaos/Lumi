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

import mongoose, { Schema, Document } from 'mongoose';
import type { IWorkoutPlan } from './WorkoutPlan';

export interface ISharedWorkoutPlan extends Document {
  share_code: string;
  original_plan_id: mongoose.Types.ObjectId;
  creator_id: mongoose.Types.ObjectId;
  /** Frozen snapshot of plan_data at time of sharing (no user PII) */
  plan_snapshot: IWorkoutPlan['plan_data'];
  /** Workout modality for display */
  workout_modality: IWorkoutPlan['workout_modality'];
  title: string;
  description?: string;
  is_public: boolean;
  view_count: number;
  import_count: number;
  created_at: Date;
  expires_at?: Date;
}

const sharedWorkoutPlanSchema = new Schema<ISharedWorkoutPlan>(
  {
    share_code: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 6,
      maxlength: 6,
      uppercase: true,
    },
    original_plan_id: {
      type: Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
      required: true,
    },
    creator_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plan_snapshot: {
      type: Schema.Types.Mixed,
      required: true,
    },
    workout_modality: {
      type: String,
      enum: ['strength', 'hiit', 'flexibility', 'cardio', 'hybrid'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    is_public: {
      type: Boolean,
      default: true,
    },
    view_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    import_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    expires_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

// TTL index for auto-expiring shares (optional - only if expires_at is set)
sharedWorkoutPlanSchema.index(
  { expires_at: 1 },
  { expireAfterSeconds: 0, sparse: true }
);

// Index for finding user's shares
sharedWorkoutPlanSchema.index({ creator_id: 1, created_at: -1 });

export default mongoose.model<ISharedWorkoutPlan>(
  'SharedWorkoutPlan',
  sharedWorkoutPlanSchema
);
