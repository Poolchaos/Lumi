import type { OnboardingData } from '../types';

export interface StepContentProps {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
}

export interface Step0Props extends StepContentProps {
  hasExistingKey: boolean;
  tokenTested: boolean;
  testAIConfigMutation: {
    mutate: () => void;
    isPending: boolean;
  };
}
