import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { profileAPI, accountabilityAPI, sessionAPI } from '../api';

export default function DashboardPage() {
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: profileAPI.getProfile,
  });

  const { data: accountabilityData } = useQuery({
    queryKey: ['accountability'],
    queryFn: accountabilityAPI.getStatus,
  });

  const { data: sessionsData } = useQuery({
    queryKey: ['sessions'],
    queryFn: sessionAPI.getAll,
  });

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Current Streak</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">
              {accountabilityData?.streak.current || 0} days
            </p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Workouts This Week</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">
              {accountabilityData?.current_week.workouts_completed || 0} / {accountabilityData?.current_week.workouts_planned || 0}
            </p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Total Workouts</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">
              {accountabilityData?.totals.workouts_completed || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Profile Status</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {profileData?.user.profile.first_name || 'Not set'} {profileData?.user.profile.last_name || ''}</p>
              <p><span className="font-medium">Goals:</span> {profileData?.user.profile.fitness_goals?.join(', ') || 'Not set'}</p>
              <p><span className="font-medium">Experience:</span> {profileData?.user.profile.experience_level || 'Not set'}</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {sessionsData?.sessions.slice(0, 5).map((session) => (
              <div key={session._id} className="py-2 border-b last:border-0">
                <p className="text-sm font-medium">{session.session_date}</p>
                <p className="text-xs text-gray-600">{session.duration_minutes} minutes</p>
              </div>
            )) || <p className="text-sm text-gray-500">No recent activity</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
