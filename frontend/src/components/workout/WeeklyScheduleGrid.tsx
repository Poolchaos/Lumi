import { motion } from 'framer-motion';
import { Check, Dumbbell, Moon } from 'lucide-react';

interface WorkoutDay {
  day: string;
  workout?: {
    name: string;
    duration_minutes: number;
    focus: string;
    exercises: Array<{
      name: string;
      target_muscles: string[];
    }>;
  };
}

interface WeeklyScheduleGridProps {
  schedule: WorkoutDay[];
  totalXP: number;
}

export function WeeklyScheduleGrid({ schedule, totalXP }: WeeklyScheduleGridProps) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Map schedule to days of week
  const weekGrid = daysOfWeek.map(day => {
    const daySchedule = schedule.find(s => s.day === day);
    return {
      day,
      ...daySchedule,
    };
  });

  const workoutDays = schedule.filter(d => d.workout).length;
  const restDays = 7 - workoutDays;
  const xpPerWorkout = totalXP / workoutDays;

  return (
    <div className="space-y-6">
      {/* Week Overview Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-200">
          <div className="text-3xl font-bold text-primary-600">{workoutDays}</div>
          <div className="text-sm text-neutral-600 mt-1">Workout Days</div>
        </div>
        <div className="text-center p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="text-3xl font-bold text-neutral-600">{restDays}</div>
          <div className="text-sm text-neutral-600 mt-1">Rest Days</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-3xl font-bold text-yellow-600">{Math.round(xpPerWorkout)}</div>
          <div className="text-sm text-neutral-600 mt-1">XP/Workout</div>
        </div>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekGrid.map((dayData, index) => {
          const isWorkoutDay = !!dayData.workout;

          return (
            <motion.div
              key={dayData.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg
                ${isWorkoutDay
                  ? 'border-primary-300 bg-gradient-to-br from-primary-50 to-primary-100'
                  : 'border-neutral-200 bg-neutral-50'
                }
              `}
            >
              {/* Day Header */}
              <div className={`p-3 text-center font-semibold ${
                isWorkoutDay ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-700'
              }`}>
                {dayData.day.substring(0, 3)}
              </div>

              {/* Day Content */}
              <div className="p-4 min-h-[200px] flex flex-col">
                {isWorkoutDay && dayData.workout ? (
                  <>
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                        <Dumbbell className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-center text-neutral-900 mb-2">
                      {dayData.workout.name}
                    </h4>

                    <div className="text-xs text-center mb-3">
                      <span className="px-2 py-1 bg-primary-200 text-primary-800 rounded-full font-medium">
                        {dayData.workout.focus}
                      </span>
                    </div>

                    <div className="text-xs text-center text-neutral-600 mb-2">
                      {dayData.workout.duration_minutes} min
                    </div>

                    <div className="text-xs text-center text-neutral-600 mb-3">
                      {dayData.workout.exercises.length} exercises
                    </div>

                    {/* Target muscles preview */}
                    <div className="flex flex-wrap gap-1 justify-center mt-auto">
                      {[...new Set(dayData.workout.exercises.flatMap(ex => ex.target_muscles))].slice(0, 3).map((muscle, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-1 text-yellow-600 font-bold text-sm mt-3">
                      <span>+{Math.round(xpPerWorkout)} XP</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center mb-3 mt-8">
                      <div className="w-12 h-12 bg-neutral-300 rounded-full flex items-center justify-center">
                        <Moon className="w-6 h-6 text-neutral-500" />
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-center text-neutral-600 mb-2">
                      Rest Day
                    </h4>
                    <p className="text-xs text-center text-neutral-500">
                      Recovery & regeneration
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly XP Forecast */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Weekly XP Forecast</h3>
            <p className="text-sm text-neutral-600">
              Complete all {workoutDays} workouts to earn maximum XP
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-yellow-600">{totalXP}</div>
            <div className="text-sm text-neutral-600">Total XP</div>
          </div>
        </div>

        {/* Progress visualization */}
        <div className="mt-4 space-y-2">
          {schedule.filter(d => d.workout).map((day, index) => (
            <div key={day.day} className="flex items-center gap-3">
              <div className="w-24 text-sm font-medium text-neutral-700">{day.day}</div>
              <div className="flex-1 h-8 bg-white rounded-full overflow-hidden border border-yellow-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(xpPerWorkout / totalXP) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-end pr-2"
                >
                  <span className="text-xs font-bold text-white">+{Math.round(xpPerWorkout)} XP</span>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Week Projection */}
      <div className="bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-300 rounded-xl p-6">
        <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-primary-600" />
          4-Week Projection
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((week) => (
            <motion.div
              key={week}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: week * 0.1 }}
              className="bg-white rounded-lg p-4 text-center border-2 border-primary-200"
            >
              <div className="text-sm font-semibold text-neutral-600 mb-2">Week {week}</div>
              <div className="text-2xl font-bold text-primary-600">{totalXP}</div>
              <div className="text-xs text-neutral-500 mt-1">XP</div>
              <div className="text-xs text-neutral-600 mt-2">{workoutDays} workouts</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <div className="inline-block bg-gradient-to-r from-primary-500 to-purple-500 text-white px-6 py-3 rounded-full">
            <span className="font-bold text-2xl">{totalXP * 4}</span>
            <span className="text-sm ml-2">Total XP in 4 Weeks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
