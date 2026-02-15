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

import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dumbbell,
  Calendar,
  Clock,
  Users,
  Eye,
  Download,
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, Button } from '../design-system';
import { sharedAPI, sharedQueryKeys, queryKeys } from '../api';
import { useAuthStore } from '../store/authStore';

const MODALITY_LABELS = {
  strength: 'Strength Training',
  hiit: 'HIIT',
  flexibility: 'Flexibility & Mobility',
  cardio: 'Cardio',
  hybrid: 'Hybrid',
};

const MODALITY_COLORS = {
  strength: 'bg-blue-500/20 text-blue-400',
  hiit: 'bg-orange-500/20 text-orange-400',
  flexibility: 'bg-purple-500/20 text-purple-400',
  cardio: 'bg-red-500/20 text-red-400',
  hybrid: 'bg-emerald-500/20 text-emerald-400',
};

export default function SharedPlanPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: plan, isLoading, error } = useQuery({
    queryKey: sharedQueryKeys.detail(code || ''),
    queryFn: () => sharedAPI.getSharedPlan(code!),
    enabled: !!code,
    retry: false,
  });

  const importMutation = useMutation({
    mutationFn: () => sharedAPI.importPlan(code!),
    onSuccess: () => {
      toast.success('Plan imported to your workouts!');
      queryClient.invalidateQueries({ queryKey: queryKeys.workouts.all });
      navigate('/workouts');
    },
    onError: () => {
      toast.error('Failed to import plan');
    },
  });

  const handleImport = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to import this plan');
      navigate(`/login?redirect=/shared/${code}`);
      return;
    }
    importMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <span className="text-gray-400">Loading shared plan...</span>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Plan Not Found</h1>
            <p className="text-gray-400 mb-6">
              This share link may have expired or been removed.
            </p>
            <Link to="/">
              <Button variant="primary">Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { plan_data } = plan;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lumi
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{plan.title}</h1>
              {plan.description && (
                <p className="text-gray-400 mb-3">{plan.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {plan.view_count} views
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {plan.import_count} imports
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleImport}
              disabled={importMutation.isPending}
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Import Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Plan Overview */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Plan Overview</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${MODALITY_COLORS[plan.workout_modality]}`}
                >
                  {MODALITY_LABELS[plan.workout_modality]}
                </span>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <p className="text-white font-semibold">
                  {plan_data.plan_overview.duration_weeks} weeks
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Dumbbell className="w-4 h-4" />
                  <span className="text-sm">Sessions/Week</span>
                </div>
                <p className="text-white font-semibold">
                  {plan_data.plan_overview.sessions_per_week}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Focus Areas</span>
                </div>
                <p className="text-white font-semibold">
                  {plan_data.plan_overview.focus_areas.length}
                </p>
              </div>
            </div>

            {plan_data.plan_overview.equipment_required.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Equipment Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {plan_data.plan_overview.equipment_required.map((equipment) => (
                    <span
                      key={equipment}
                      className="px-2 py-1 bg-gray-800 rounded text-sm text-gray-300"
                    >
                      {equipment}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Weekly Schedule</h2>

            <div className="space-y-3">
              {plan_data.weekly_schedule.map((day, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 font-semibold min-w-[80px]">
                        {day.day}
                      </span>
                      <span className="text-white">{day.workout.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{day.workout.duration_minutes} min</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 ml-20">
                    {day.workout.exercises.length} exercises • {day.workout.focus}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progression Notes */}
        {plan_data.progression_notes && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-3">
                Progression Notes
              </h2>
              <p className="text-gray-400">{plan_data.progression_notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Safety Reminders */}
        {plan_data.safety_reminders?.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-3">
                Safety Reminders
              </h2>
              <ul className="space-y-2">
                {plan_data.safety_reminders.map((reminder, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-400">
                    <span className="text-yellow-500 mt-1">•</span>
                    {reminder}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* CTA Banner */}
        {!isAuthenticated && (
          <Card className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-emerald-500/30">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Want to try this plan?
              </h3>
              <p className="text-gray-300 mb-4">
                Sign up for free to import this workout plan and track your progress.
              </p>
              <div className="flex justify-center gap-3">
                <Link to={`/login?redirect=/shared/${code}`}>
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to={`/signup?redirect=/shared/${code}`}>
                  <Button variant="primary">Sign Up Free</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
