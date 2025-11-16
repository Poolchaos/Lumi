import toast from 'react-hot-toast';
import type { OnboardingData } from './types';

export function validateStep(step: number, data: OnboardingData): boolean {
  switch (step) {
    case 0:
      if (!data.openai_token) {
        toast.error('Please enter your OpenAI API key to continue');
        return false;
      }
      break;

    case 1:
      if (!data.profile.first_name) {
        toast.error('Please enter your name to continue');
        return false;
      }
      break;

    case 2:
      if (!data.workout_modality) {
        toast.error('Please select a workout type to continue');
        return false;
      }
      break;

    case 3:
      if (!data.profile.fitness_goals || data.profile.fitness_goals.length === 0) {
        toast.error('Please select at least one fitness goal');
        return false;
      }
      break;
  }

  return true;
}
