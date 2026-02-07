/**
 * Copyright (c) 2025-2026 Phillip-Juan van der Berg. All Rights Reserved.
 *
 * This file is part of PersonalFit.
 *
 * PersonalFit is licensed under the PolyForm Noncommercial License 1.0.0.
 * You may not use this file except in compliance with the License.
 *
 * Commercial use requires a separate paid license.
 * Contact: phillipjuanvanderberg@gmail.com
 *
 * See the LICENSE file for the full license text.
 */

import mongoose from 'mongoose';
import { generateDailyHealthScore } from './healthScoreService';
import { generateCoachingRecommendations } from './coachingService';
import User from '../models/User';

interface DailyCheckIn {
  userId: string;
  date: Date;
  type: 'morning' | 'evening';
  mood?: 'great' | 'good' | 'okay' | 'tired' | 'stressed';
  energy_level?: number; // 1-5
  sleep_quality?: number; // 1-5
  sleep_hours?: number;
  water_intake?: number; // cups
  notes?: string;
}

interface DailyLoopResult {
  health_score_calculated: boolean;
  coaching_generated: boolean;
  check_in_completed: boolean;
  insights: string[];
}

/**
 * Process morning check-in routine
 * - Calculate yesterday's health score if not done
 * - Prompt for sleep quality and morning mood
 * - Generate daily coaching recommendations
 */
export async function processMorningCheckIn(
  userId: string,
  checkInData: Partial<DailyCheckIn>
): Promise<DailyLoopResult> {
  const insights: string[] = [];
  let healthScoreCalculated = false;
  let coachingGenerated = false;

  try {
    // Calculate yesterday's health score if missing
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    try {
      const yesterdayScore = await generateDailyHealthScore(userId, yesterday);
      if (yesterdayScore) {
        healthScoreCalculated = true;
        insights.push(`Yesterday's health score: ${yesterdayScore.total_score}/100`);
      }
    } catch (error) {
      console.log('Yesterday score already exists or error:', error);
    }

    // Generate coaching recommendations for today
    try {
      const recommendations = await generateCoachingRecommendations(userId, 'anthropic');
      if (recommendations && recommendations.length > 0) {
        coachingGenerated = true;
        insights.push(`${recommendations.length} personalized recommendations ready`);
      }
    } catch (error) {
      console.error('Failed to generate coaching:', error);
    }

    // Process sleep quality data
    if (checkInData.sleep_quality && checkInData.sleep_hours) {
      insights.push(
        `Logged ${checkInData.sleep_hours}h sleep (quality: ${checkInData.sleep_quality}/5)`
      );
    }

    // Mood-based insights
    if (checkInData.mood === 'great') {
      insights.push('Starting the day with high energy! 🌟');
    } else if (checkInData.mood === 'tired' || checkInData.mood === 'stressed') {
      insights.push('Consider a lighter workout or extra rest today');
    }

    return {
      health_score_calculated: healthScoreCalculated,
      coaching_generated: coachingGenerated,
      check_in_completed: true,
      insights,
    };
  } catch (error) {
    console.error('Morning check-in error:', error);
    return {
      health_score_calculated: healthScoreCalculated,
      coaching_generated: coachingGenerated,
      check_in_completed: false,
      insights: ['Error processing morning check-in'],
    };
  }
}

/**
 * Process evening check-in routine
 * - Review today's activities
 * - Calculate today's health score
 * - Prompt for evening reflection
 */
export async function processEveningCheckIn(
  userId: string,
  checkInData: Partial<DailyCheckIn>
): Promise<DailyLoopResult> {
  const insights: string[] = [];
  let healthScoreCalculated = false;

  try {
    // Calculate today's health score
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const todayScore = await generateDailyHealthScore(userId, today);
      if (todayScore) {
        healthScoreCalculated = true;
        insights.push(`Today's health score: ${todayScore.total_score}/100`);

        // Provide contextual feedback
        if (todayScore.total_score >= 80) {
          insights.push('Excellent day! Keep up the momentum 🎉');
        } else if (todayScore.total_score >= 60) {
          insights.push('Good progress today 👍');
        } else {
          insights.push("Tomorrow is a fresh start - you've got this! 💪");
        }
      }
    } catch (error) {
      console.log('Today score calculation error:', error);
    }

    // Water intake tracking
    if (checkInData.water_intake) {
      const cups = checkInData.water_intake;
      if (cups >= 8) {
        insights.push(`Great hydration: ${cups} cups 💧`);
      } else {
        insights.push(`Hydration: ${cups}/8 cups - aim for more tomorrow`);
      }
    }

    // Evening mood reflection
    if (checkInData.mood === 'stressed') {
      insights.push('Consider meditation or light stretching before bed');
    }

    return {
      health_score_calculated: healthScoreCalculated,
      coaching_generated: false,
      check_in_completed: true,
      insights,
    };
  } catch (error) {
    console.error('Evening check-in error:', error);
    return {
      health_score_calculated: healthScoreCalculated,
      coaching_generated: false,
      check_in_completed: false,
      insights: ['Error processing evening check-in'],
    };
  }
}

/**
 * Automatically calculate health scores for all active users
 * Run this via cron job at midnight
 */
export async function calculateAllUserHealthScores(date?: Date): Promise<void> {
  const targetDate = date || new Date();
  targetDate.setDate(targetDate.getDate() - 1); // Calculate for previous day
  targetDate.setHours(0, 0, 0, 0);

  try {
    // Get all active users with health scoring enabled
    const users = await User.find({
      'preferences.unified_health_score_enabled': true,
    }).select('_id');

    console.log(`[Daily Health Loop] Calculating scores for ${users.length} users...`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        await generateDailyHealthScore(String(user._id), targetDate);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Failed to calculate score for user ${user._id}:`, error);
      }
    }

    console.log(
      `[Daily Health Loop] Complete: ${successCount} success, ${errorCount} errors`
    );
  } catch (error) {
    console.error('[Daily Health Loop] Batch calculation error:', error);
  }
}

/**
 * Get daily loop status for a user
 */
export async function getDailyLoopStatus(userId: string): Promise<{
  morning_check_in_completed: boolean;
  evening_check_in_completed: boolean;
  health_score_calculated: boolean;
  coaching_available: boolean;
}> {
  try {
    const HealthScore = (await import('../models/HealthScore')).default;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Check if today's health score exists
    const todayScore = await HealthScore.findOne({
      user_id: new mongoose.Types.ObjectId(userId),
      score_date: todayStr,
    });

    return {
      morning_check_in_completed: false, // TODO: Track in database
      evening_check_in_completed: false, // TODO: Track in database
      health_score_calculated: !!todayScore,
      coaching_available: true, // Always available
    };
  } catch (error) {
    console.error('Get daily loop status error:', error);
    return {
      morning_check_in_completed: false,
      evening_check_in_completed: false,
      health_score_calculated: false,
      coaching_available: false,
    };
  }
}
