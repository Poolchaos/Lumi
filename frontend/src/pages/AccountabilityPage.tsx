import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { accountabilityAPI } from '../api';

export default function AccountabilityPage() {
  const { data } = useQuery({
    queryKey: ['accountability'],
    queryFn: accountabilityAPI.getStatus,
  });

  const { data: penaltiesData } = useQuery({
    queryKey: ['penalties'],
    queryFn: accountabilityAPI.getPenalties,
  });

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Accountability</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Current Streak</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">
              {data?.streak.current || 0} 🔥
            </p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Longest Streak</h3>
            <p className="mt-2 text-3xl font-bold text-gray-700">
              {data?.streak.longest || 0} days
            </p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Workouts Completed</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {data?.totals.workouts_completed || 0}
            </p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Workouts Missed</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {data?.totals.workouts_missed || 0}
            </p>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">This Week's Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Planned</p>
              <p className="text-2xl font-bold">{data?.current_week.workouts_planned || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">{data?.current_week.workouts_completed || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Missed</p>
              <p className="text-2xl font-bold text-red-600">{data?.current_week.workouts_missed || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-primary-600">
                {Math.round((data?.current_week.completion_rate || 0) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Active Penalties</h2>
          {penaltiesData?.penalties.filter(p => !p.completed).length ? (
            <div className="space-y-3">
              {penaltiesData.penalties
                .filter(p => !p.completed)
                .map((penalty) => (
                  <div key={penalty._id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-red-800">{penalty.penalty_type}</p>
                        <p className="text-sm text-red-700">{penalty.description}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Missed: {new Date(penalty.missed_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No active penalties. Keep it up! 💪</p>
          )}
        </div>

        {penaltiesData?.penalties.filter(p => p.completed).length ? (
          <div className="card mt-6">
            <h2 className="text-xl font-semibold mb-4">Completed Penalties</h2>
            <div className="space-y-2">
              {penaltiesData.penalties
                .filter(p => p.completed)
                .slice(0, 5)
                .map((penalty) => (
                  <div key={penalty._id} className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="font-medium text-green-800">{penalty.penalty_type}</p>
                    <p className="text-xs text-gray-600">
                      Completed: {penalty.completed_date ? new Date(penalty.completed_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
