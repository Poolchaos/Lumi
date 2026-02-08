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

import React, { useState, useEffect } from 'react';
import { Sun, Moon, CheckCircle, Circle } from 'lucide-react';
import { apiClient } from '../../api/client';
import { DailyCheckInModal } from './DailyCheckInModal';

interface DailyLoopStatus {
  morning_check_in_completed: boolean;
  evening_check_in_completed: boolean;
  health_score_calculated: boolean;
  coaching_available: boolean;
}

export const DailyLoopWidget: React.FC = () => {
  const [status, setStatus] = useState<DailyLoopStatus | null>(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInType, setCheckInType] = useState<'morning' | 'evening'>('morning');
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await apiClient.get('/api/daily-loop/status');
      setStatus(response.data.status);
    } catch (error) {
      console.error('Failed to fetch daily loop status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCheckInClick = (type: 'morning' | 'evening') => {
    setCheckInType(type);
    setShowCheckIn(true);
  };

  const handleCheckInComplete = () => {
    fetchStatus(); // Refresh status after check-in
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
          <div className="h-10 bg-neutral-200 rounded"></div>
          <div className="h-10 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 5 && currentHour < 12;
  const isEvening = currentHour >= 17 && currentHour < 23;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Daily Health Loop
        </h3>

        <div className="space-y-3">
          {/* Morning Check-In */}
          <button
            onClick={() => handleCheckInClick('morning')}
            disabled={status.morning_check_in_completed}
            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
              status.morning_check_in_completed
                ? 'border-green-200 bg-green-50'
                : isMorning
                ? 'border-primary-200 bg-primary-50 hover:border-primary-300 cursor-pointer'
                : 'border-neutral-200 bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className={`w-5 h-5 ${status.morning_check_in_completed ? 'text-green-600' : 'text-yellow-500'}`} />
              <div className="text-left">
                <div className="font-medium text-neutral-900">Morning Check-In</div>
                <div className="text-xs text-neutral-600">
                  {status.morning_check_in_completed ? 'Completed' : 'Log sleep & set intentions'}
                </div>
              </div>
            </div>
            {status.morning_check_in_completed ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {/* Evening Check-In */}
          <button
            onClick={() => handleCheckInClick('evening')}
            disabled={status.evening_check_in_completed}
            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
              status.evening_check_in_completed
                ? 'border-green-200 bg-green-50'
                : isEvening
                ? 'border-primary-200 bg-primary-50 hover:border-primary-300 cursor-pointer'
                : 'border-neutral-200 bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className={`w-5 h-5 ${status.evening_check_in_completed ? 'text-green-600' : 'text-blue-500'}`} />
              <div className="text-left">
                <div className="font-medium text-neutral-900">Evening Reflection</div>
                <div className="text-xs text-neutral-600">
                  {status.evening_check_in_completed ? 'Completed' : 'Review day & track habits'}
                </div>
              </div>
            </div>
            {status.evening_check_in_completed ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {/* Health Score Status */}
          {status.health_score_calculated && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-neutral-700">
              ✓ Today's health score calculated
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
            <span>Daily Progress</span>
            <span className="font-medium">
              {[status.morning_check_in_completed, status.evening_check_in_completed].filter(Boolean).length}/2
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${([status.morning_check_in_completed, status.evening_check_in_completed].filter(Boolean).length / 2) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <DailyCheckInModal
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        type={checkInType}
        onComplete={handleCheckInComplete}
      />
    </>
  );
};
