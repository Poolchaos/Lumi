import type { UserProfile } from '../../types';

export interface OnboardingData {
  openai_token?: string;
  workout_modality?: 'strength' | 'cardio' | 'hybrid';
  profile: Partial<UserProfile>;
  equipment: string[];
  preferences: {
    preferred_workout_duration?: number;
    workout_frequency?: number;
  };
}

export interface StepContentProps {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
  tokenTested?: boolean;
  testAIConfigMutation?: {
    mutate: () => void;
    isPending: boolean;
  };
}
