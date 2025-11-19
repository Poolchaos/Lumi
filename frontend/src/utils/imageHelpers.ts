/**
 * Workout type to image mapping
 * Maps workout focus/type to corresponding images
 */

export function getWorkoutTypeImage(focus: string): string {
  const normalizedFocus = focus.toLowerCase();

  if (normalizedFocus.includes('strength') || normalizedFocus.includes('power')) {
    return '/images/workout-types/strength-training.jpg';
  }
  if (normalizedFocus.includes('cardio') || normalizedFocus.includes('endurance')) {
    return '/images/workout-types/cardio.jpg';
  }
  if (normalizedFocus.includes('hiit') || normalizedFocus.includes('intensity')) {
    return '/images/workout-types/hiit.jpg';
  }
  if (normalizedFocus.includes('yoga') || normalizedFocus.includes('flexibility')) {
    return '/images/workout-types/flexibility-yoga.jpg';
  }
  if (normalizedFocus.includes('recovery') || normalizedFocus.includes('mobility')) {
    return '/images/workout-types/recovery-mobility.jpg';
  }

  // Default to strength training
  return '/images/workout-types/strength-training.jpg';
}

export function getEmptyStateImage(type: 'no-workouts' | 'no-plan' | 'rest-day'): string {
  const imageMap = {
    'no-workouts': '/images/empty-states/no-workouts.jpg',
    'no-plan': '/images/empty-states/no-active-plan.jpg',
    'rest-day': '/images/empty-states/rest-day.jpg',
  };
  return imageMap[type];
}

export function getGamificationIcon(type: 'level-up' | 'streak' | 'xp' | 'first-workout' | 'week-warrior'): string {
  const iconMap = {
    'level-up': '/images/gamification/level-up-badge.png',
    'streak': '/images/gamification/streak-fire.png',
    'xp': '/images/gamification/xp-crystal.png',
    'first-workout': '/images/gamification/first-workout-trophy.png',
    'week-warrior': '/images/gamification/week-warrior-medal.png',
  };
  return iconMap[type];
}

export function getExerciseImage(exerciseName: string): string {
  const normalized = exerciseName.toLowerCase();

  if (normalized.includes('push') || normalized.includes('pushup')) {
    return '/images/exercises/pushup-demo.jpg';
  }
  if (normalized.includes('squat')) {
    return '/images/exercises/squat-demo.jpg';
  }
  if (normalized.includes('plank')) {
    return '/images/exercises/plank-demo.jpg';
  }
  if (normalized.includes('lunge')) {
    return '/images/exercises/lunge-demo.jpg';
  }
  if (normalized.includes('burpee')) {
    return '/images/exercises/burpee-demo.jpg';
  }
  if (normalized.includes('mountain') && normalized.includes('climber')) {
    return '/images/exercises/mountain-climber-demo.jpg';
  }
  if (normalized.includes('deadlift')) {
    return '/images/exercises/deadlift-demo.jpg';
  }
  if (normalized.includes('bench') && normalized.includes('press')) {
    return '/images/exercises/bench-press-demo.jpg';
  }
  if (normalized.includes('pull') && (normalized.includes('up') || normalized.includes('ups'))) {
    return '/images/exercises/pullup-demo.jpg';
  }
  if (normalized.includes('row')) {
    return '/images/exercises/dumbbell-row-demo.jpg';
  }

  // Default to pushup demo
  return '/images/exercises/pushup-demo.jpg';
}
