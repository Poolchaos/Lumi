import { useQuery } from '@tanstack/react-query';
import { accountabilityAPI, queryKeys } from '../api';

export function useStreak() {
  const { data } = useQuery({
    queryKey: queryKeys.accountability.status(),
    queryFn: accountabilityAPI.getStatus,
  });

  return {
    currentStreak: data?.streak.current || 0,
    longestStreak: data?.streak.longest || 0,
    freezesAvailable: data?.streak.freezes_available || 2,
    nextMilestone: Math.ceil((data?.streak.current || 0) / 7) * 7 + 7, // Next multiple of 7
  };
}
