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

import { apiClient } from './client';

/**
 * Shared workout plan types
 */
export interface SharedPlanSummary {
  share_code: string;
  share_url: string;
  title: string;
  description?: string;
  workout_modality: 'strength' | 'hiit' | 'flexibility' | 'cardio' | 'hybrid';
  view_count: number;
  import_count: number;
  is_public: boolean;
  created_at: string;
  expires_at?: string;
}

export interface SharedPlanDetail {
  share_code: string;
  title: string;
  description?: string;
  workout_modality: 'strength' | 'hiit' | 'flexibility' | 'cardio' | 'hybrid';
  plan_data: {
    plan_overview: {
      duration_weeks: number;
      sessions_per_week: number;
      focus_areas: string[];
      equipment_required: string[];
    };
    weekly_schedule: Array<{
      day: string;
      workout: {
        name: string;
        duration_minutes: number;
        focus: string;
        exercises: Array<{
          name: string;
          sets?: number;
          reps?: number;
          duration_seconds?: number;
          rest_seconds?: number;
          work_seconds?: number;
          rounds?: number;
          equipment?: string[];
          target_muscles: string[];
          instructions: string;
          modifications?: string;
        }>;
      };
    }>;
    progression_notes: string;
    safety_reminders: string[];
  };
  view_count: number;
  import_count: number;
  created_at: string;
}

export interface CreateShareResponse {
  share_code: string;
  share_url: string;
  title: string;
  created_at: string;
}

export interface ImportPlanResponse {
  message: string;
  plan_id: string;
  title: string;
}

/**
 * Query keys for shared plans
 */
export const sharedQueryKeys = {
  all: ['shared'] as const,
  myShares: () => [...sharedQueryKeys.all, 'my-shares'] as const,
  detail: (code: string) => [...sharedQueryKeys.all, 'detail', code] as const,
};

/**
 * Shared workout plans API
 */
export const sharedAPI = {
  /**
   * Create a share link for a workout plan
   */
  createShare: async (
    planId: string,
    title: string,
    description?: string
  ): Promise<CreateShareResponse> => {
    const response = await apiClient.post('/api/shared/create', {
      planId,
      title,
      description,
    });
    return response.data;
  },

  /**
   * Get a shared plan by code (public)
   */
  getSharedPlan: async (code: string): Promise<SharedPlanDetail> => {
    const response = await apiClient.get(`/api/shared/${code}`);
    return response.data;
  },

  /**
   * Import a shared plan to user's account
   */
  importPlan: async (code: string): Promise<ImportPlanResponse> => {
    const response = await apiClient.post(`/api/shared/${code}/import`);
    return response.data;
  },

  /**
   * Get user's shared plans
   */
  getMyShares: async (): Promise<{ shares: SharedPlanSummary[]; total: number }> => {
    const response = await apiClient.get('/api/shared/my-shares');
    return response.data;
  },

  /**
   * Delete a share link
   */
  deleteShare: async (code: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/shared/${code}`);
    return response.data;
  },
};
