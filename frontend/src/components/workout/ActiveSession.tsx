import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Clock, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../design-system/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../design-system/components/Card';
import { workoutAPI } from '../../api';
import type { WorkoutPlan, Exercise } from '../../types';

interface ActiveSessionProps {
  workout: WorkoutPlan;
  onComplete: () => void;
  onCancel: () => void;
}

interface ExerciseProgress {
  exercise_id: string;
  completed_sets: number;
  total_sets: number;
}

export function ActiveSession({ workout, onComplete, onCancel }: ActiveSessionProps) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<ExerciseProgress[]>(
    workout.exercises.map((ex: Exercise, index: number) => ({
      exercise_id: `${workout._id}-${index}`,
      completed_sets: 0,
      total_sets: ex.sets || 3,
    }))
  );
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [restExerciseName, setRestExerciseName] = useState<string>('');

  // Rest timer countdown
  useEffect(() => {
    if (restTimer === null || restTimer <= 0) return;

    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev === null || prev <= 1) {
          // Play audio alert when rest is over
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBz2U1vLTfC0GK3vK8N+TQwsWY7jq7axZFgxLpePlvnAgCECX2PLYgDIHH2m/7OirWRYNU6jl5cJyHgg+ltXy0nkoBC1+zPDhljMEJm3A7OmpWRYNXq3l6MF6IQg7k9Ty2oggBSV5xvDfmTYELXHD7OiqWhYNYrDl6MRyIQg5kdPy14gdBCl5w/DemTYEK2+97OirWhYOXqvl6MNyIQg6k9Xy14gdBSV5xfDemTYELXLD7OirWhYOYrDl6MNyIQg5kdTy14gdBSV5xfDemTYELXLD7OirWhYOYrDl6MNyIQg5kdTy14gdBSV5xfDemTYELXLD7OirWhYOYrDl6MNyIQg5kdTy14gdBSV5xfDemTYELXLD7OirWhYOYrDl6MNyIQg5kdTy14gdBSV5xfDemTYELXLD7OirWhYOYrDl6MNyIQg5kdTy14gdBSV5xfDemTYELXLD7OirWhYOYrDl6MNyIQg5kdTy14gdBSV5xfDemTYELXLD7OirWg==');
          audio.play().catch(() => {
            // Audio playback failed, just show toast
          });
          toast.success('Rest period complete! 💪', { duration: 2000 });
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer]);

  const completeSetMutation = useMutation({
    mutationFn: async () => {
      // In a real app, this would update the backend
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });

  const completeWorkoutMutation = useMutation({
    mutationFn: async () => {
      // Mark workout as completed (simplified for now)
      return workoutAPI.update(workout._id, { ...workout });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast.success('🎉 Workout completed! Great job!');
      onComplete();
    },
    onError: () => {
      toast.error('Failed to save workout completion');
    },
  });

  const handleSetComplete = (exerciseId: string, exerciseName: string, restPeriod: number) => {
    setProgress(prev => prev.map(p => 
      p.exercise_id === exerciseId 
        ? { ...p, completed_sets: Math.min(p.completed_sets + 1, p.total_sets) }
        : p
    ));
    completeSetMutation.mutate();
    
    // Start rest timer if not the last set
    const exerciseProgress = progress.find(p => p.exercise_id === exerciseId);
    if (exerciseProgress && exerciseProgress.completed_sets + 1 < exerciseProgress.total_sets) {
      setRestTimer(restPeriod);
      setRestExerciseName(exerciseName);
    }
  };

  const handleComplete = () => {
    const allComplete = progress.every(p => p.completed_sets === p.total_sets);
    if (!allComplete) {
      toast.error('Please complete all sets before finishing');
      return;
    }
    completeWorkoutMutation.mutate();
  };

  const totalSets = progress.reduce((sum, p) => sum + p.total_sets, 0);
  const completedSets = progress.reduce((sum, p) => sum + p.completed_sets, 0);
  const progressPercent = Math.round((completedSets / totalSets) * 100);

  return (
    <div className="space-y-6">
      {/* Rest Timer Modal */}
      {restTimer !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <Clock className="h-6 w-6 text-primary animate-pulse" />
                Rest Time
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-primary mb-4">
                {restTimer}
              </div>
              <p className="text-gray-600 mb-4">Resting after {restExerciseName}</p>
              <Button
                variant="outline"
                onClick={() => setRestTimer(null)}
                className="w-full"
              >
                Skip Rest
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Session Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{workout.workout_name}</h2>
              <p className="text-gray-600">{workout.description}</p>
            </div>
            <Button
              variant="ghost"
              onClick={onCancel}
              size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-semibold text-gray-900">
                {completedSets} / {totalSets} sets ({progressPercent}%)
              </span>
            </div>
            <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <div className="space-y-4">
        {workout.exercises.map((exercise: Exercise, index: number) => {
          const exerciseId = `${workout._id}-${index}`;
          const exerciseProgress = progress.find(p => p.exercise_id === exerciseId);
          const isComplete = exerciseProgress?.completed_sets === exerciseProgress?.total_sets;
          const sets = exercise.sets || 3;
          const reps = exercise.reps || 10;
          const restPeriod = exercise.rest_seconds || 60;

          return (
            <Card 
              key={exerciseId}
              className={isComplete ? 'bg-green-50 border-green-200' : ''}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {exercise.exercise_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {sets} sets × {reps} reps
                      {exercise.duration_seconds && ` • ${exercise.duration_seconds}s duration`}
                      {` • ${restPeriod}s rest`}
                    </p>

                    {/* Set Checkboxes */}
                    <div className="flex gap-2 flex-wrap mb-3">
                      {[...Array(sets)].map((_, setIndex) => {
                        const isSetComplete = (exerciseProgress?.completed_sets || 0) > setIndex;
                        return (
                          <button
                            key={setIndex}
                            onClick={() => {
                              if (setIndex === exerciseProgress?.completed_sets) {
                                handleSetComplete(exerciseId, exercise.exercise_name, restPeriod);
                              }
                            }}
                            disabled={setIndex !== exerciseProgress?.completed_sets}
                            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                              isSetComplete
                                ? 'bg-green-500 border-green-500 text-white'
                                : setIndex === exerciseProgress?.completed_sets
                                ? 'border-primary hover:bg-primary/10 cursor-pointer'
                                : 'border-neutral-300 text-neutral-400 cursor-not-allowed'
                            }`}
                          >
                            {isSetComplete ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <span className="text-sm font-medium">{setIndex + 1}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {exercise.notes && (
                      <p className="text-xs text-gray-500 italic">{exercise.notes}</p>
                    )}
                  </div>

                  {isComplete && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Complete Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleComplete}
            variant="primary"
            className="w-full"
            size="lg"
            loading={completeWorkoutMutation.isPending}
            disabled={completedSets < totalSets}
          >
            <Check className="h-5 w-5 mr-2" />
            Complete Workout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
