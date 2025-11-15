import { useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { profileAPI } from '../api';
import type { UserProfile, UserPreferences } from '../types';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: profileAPI.getProfile,
  });

  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});

  const updateProfileMutation = useMutation({
    mutationFn: profileAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert('Profile updated successfully!');
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: profileAPI.updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert('Preferences updated successfully!');
    },
  });

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profile);
  };

  const handlePreferencesSubmit = (e: FormEvent) => {
    e.preventDefault();
    updatePreferencesMutation.mutate(preferences);
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="label">First Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder={data?.user.profile.first_name || 'Enter first name'}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder={data?.user.profile.last_name || 'Enter last name'}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Height (cm)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder={data?.user.profile.height_cm?.toString() || '170'}
                    onChange={(e) => setProfile({ ...profile, height_cm: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="label">Weight (kg)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder={data?.user.profile.weight_kg?.toString() || '70'}
                    onChange={(e) => setProfile({ ...profile, weight_kg: Number(e.target.value) })}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Workout Preferences</h2>
            <form onSubmit={handlePreferencesSubmit} className="space-y-4">
              <div>
                <label className="label">Preferred Workout Duration (minutes)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder={data?.user.preferences.preferred_workout_duration?.toString() || '60'}
                  onChange={(e) => setPreferences({ ...preferences, preferred_workout_duration: Number(e.target.value) })}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={updatePreferencesMutation.isPending}>
                {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
