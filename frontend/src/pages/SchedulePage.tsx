import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
import { WeeklyCalendar } from '../components/calendar/WeeklyCalendar';
import { MonthlyCalendar } from '../components/calendar/MonthlyCalendar';
import { PageTransition } from '../components/layout/PageTransition';
import { Card } from '../design-system';
import { workoutAPI, sessionAPI } from '../api';

type ViewMode = 'weekly' | 'monthly';

interface WorkoutDay {
  date: string;
  dayName: string;
  workout?: {
    name: string;
    duration_minutes: number;
    focus: string;
    xpEarned?: number;
  };
  isCompleted: boolean;
  isToday: boolean;
  isRestDay: boolean;
}

export default function SchedulePage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');

  const { data: workoutsData } = useQuery({
    queryKey: ['workouts'],
    queryFn: workoutAPI.getAll,
  });

  const { data: sessionsData } = useQuery({
    queryKey: ['sessions'],
    queryFn: sessionAPI.getAll,
  });

  // Transform workouts data into calendar format
  const workoutDays = useMemo((): WorkoutDay[] => {
    if (!workoutsData?.workouts || workoutsData.workouts.length === 0) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activePlan: any = workoutsData.workouts.find((w: any) => w.is_active);
    if (!activePlan?.plan_data?.weekly_schedule) {
      return [];
    }

    const days: WorkoutDay[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schedule: any[] = activePlan.plan_data.weekly_schedule;

    // Generate workout days for the next 90 days (3 months)
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('en-US');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scheduledWorkout = schedule.find((s: any) => s.day === dayName);

      // Check if this workout was completed (from sessions)
      const isCompleted = sessionsData?.sessions?.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session: any) => {
          const sessionDate = new Date(session.date).toLocaleDateString('en-US');
          return sessionDate === dateStr;
        }
      ) || false;

      if (scheduledWorkout?.workout) {
        const exercises = scheduledWorkout.workout.exercises || [];
        const duration = scheduledWorkout.workout.duration_minutes || 30;
        const xpEarned = isCompleted ? exercises.length * 10 : undefined;

        days.push({
          date: dateStr,
          dayName,
          workout: {
            name: scheduledWorkout.workout.workout_name || `${scheduledWorkout.workout.focus} Day`,
            duration_minutes: duration,
            focus: scheduledWorkout.workout.focus || 'Full Body',
            xpEarned,
          },
          isCompleted,
          isToday: dateStr === today.toLocaleDateString('en-US'),
          isRestDay: false,
        });
      } else {
        // Rest day
        days.push({
          date: dateStr,
          dayName,
          isCompleted: false,
          isToday: dateStr === today.toLocaleDateString('en-US'),
          isRestDay: true,
        });
      }
    }

    return days;
  }, [workoutsData, sessionsData]);

  const handleDayClick = (day: WorkoutDay) => {
    if (day.workout) {
      navigate('/workouts');
    }
  };

  // Calculate stats across all days
  const totalCompleted = workoutDays.filter(d => d.isCompleted).length;
  const totalPlanned = workoutDays.filter(d => d.workout).length;
  const completionRate = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;
  const totalXP = workoutDays
    .filter(d => d.isCompleted && d.workout?.xpEarned)
    .reduce((sum, d) => sum + (d.workout?.xpEarned || 0), 0);

  return (
    <Layout>
      <PageTransition>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Workout Schedule</h1>
                <p className="text-neutral-600">Track your progress and plan ahead</p>
              </div>

              {/* View toggle */}
              <div className="flex bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('weekly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'weekly'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'monthly'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>

            {/* Overall stats */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Overall Progress</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-success-50 rounded-lg">
                  <p className="text-3xl font-bold text-success-600">{totalCompleted}</p>
                  <p className="text-sm text-neutral-600 mt-1">Completed</p>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <p className="text-3xl font-bold text-primary-600">{totalPlanned}</p>
                  <p className="text-sm text-neutral-600 mt-1">Planned</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">{totalXP}</p>
                  <p className="text-sm text-neutral-600 mt-1">Total XP</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">{completionRate}%</p>
                  <p className="text-sm text-neutral-600 mt-1">Completion</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Calendar view */}
          {workoutDays.length === 0 ? (
            <Card className="p-12 text-center">
              <CalendarIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Workout Plan Found</h3>
              <p className="text-neutral-500 mb-6">
                Generate your first AI-powered workout plan to get started
              </p>
              <button
                onClick={() => navigate('/workouts')}
                className="btn-primary"
              >
                Generate Workout Plan
              </button>
            </Card>
          ) : (
            <>
              {viewMode === 'weekly' ? (
                <WeeklyCalendar workouts={workoutDays} onDayClick={handleDayClick} />
              ) : (
                <MonthlyCalendar workouts={workoutDays} onDayClick={handleDayClick} />
              )}
            </>
          )}
        </div>
      </PageTransition>
    </Layout>
  );
}
