import { Card, CardContent, CardHeader, CardTitle } from '../../design-system/components/Card';
import type { WorkoutPlan } from '../../types';

interface ActiveSessionProps {
  workout: WorkoutPlan;
  onComplete: () => void;
  onCancel: () => void;
}

export function ActiveSession({ onCancel }: ActiveSessionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Session</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600">
          Please use Start Workout from the dashboard instead.
        </p>
        <button onClick={onCancel} className="mt-4 px-4 py-2 bg-neutral-500 text-white rounded">
          Close
        </button>
      </CardContent>
    </Card>
  );
}