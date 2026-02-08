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

export interface IDailyCheckIn extends Document {
  user_id: mongoose.Types.ObjectId;
  date: Date;
  morning_completed: boolean;
  evening_completed: boolean;
  morning_data?: {
    mood?: 'great' | 'good' | 'okay' | 'tired' | 'stressed';
    energy_level?: number; // 1-5
    sleep_quality?: number; // 1-5
    sleep_hours?: number;
    notes?: string;
  };
  evening_data?: {
    mood?: 'great' | 'good' | 'okay' | 'tired' | 'stressed';
    water_intake?: number; // cups
    notes?: string;
  };
  created_at: Date;
  updated_at: Date;
}

const dailyCheckInSchema = new Schema<IDailyCheckIn>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    morning_completed: {
      type: Boolean,
      default: false,
    },
    evening_completed: {
      type: Boolean,
      default: false,
    },
    morning_data: {
      mood: {
        type: String,
        enum: ['great', 'good', 'okay', 'tired', 'stressed'],
      },
      energy_level: {
        type: Number,
        min: 1,
        max: 5,
      },
      sleep_quality: {
        type: Number,
        min: 1,
        max: 5,
      },
      sleep_hours: {
        type: Number,
        min: 0,
        max: 24,
      },
      notes: {
        type: String,
        maxlength: 500,
      },
    },
    evening_data: {
      mood: {
        type: String,
        enum: ['great', 'good', 'okay', 'tired', 'stressed'],
      },
      water_intake: {
        type: Number,
        min: 0,
        max: 30,
      },
      notes: {
        type: String,
        maxlength: 500,
      },
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Compound index for efficient user + date queries
dailyCheckInSchema.index({ user_id: 1, date: -1 });

// Unique constraint: one check-in per user per day
dailyCheckInSchema.index(
  { user_id: 1, date: 1 },
  { unique: true }
);

export default mongoose.model<IDailyCheckIn>('DailyCheckIn', dailyCheckInSchema);
