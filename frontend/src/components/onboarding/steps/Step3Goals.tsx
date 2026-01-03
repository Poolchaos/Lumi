import type { StepContentProps } from './types';

const FITNESS_GOALS = [
  'Weight Loss',
  'Muscle Gain',
  'Strength',
  'Endurance',
  'Flexibility',
  'General Fitness',
];

export function Step3Goals({ data, setData }: StepContentProps) {
  const handleGoalToggle = (goal: string) => {
    const currentGoals = data.profile.fitness_goals || [];
    const goalKey = goal.toLowerCase().replace(' ', '_');

    if (currentGoals.includes(goalKey)) {
      setData({
        ...data,
        profile: {
          ...data.profile,
          fitness_goals: currentGoals.filter((g: string) => g !== goalKey),
        },
      });
    } else {
      setData({
        ...data,
        profile: {
          ...data.profile,
          fitness_goals: [...currentGoals, goalKey],
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">What are your fitness goals?</h3>
        <p className="text-neutral-600 mb-6">Select all that apply</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {FITNESS_GOALS.map((goal) => {
          const goalKey = goal.toLowerCase().replace(' ', '_');
          const isSelected = data.profile.fitness_goals?.includes(goalKey);

          return (
            <button
              key={goal}
              onClick={() => handleGoalToggle(goal)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
            >
              {goal}
            </button>
          );
        })}
      </div>
    </div>
  );
}
