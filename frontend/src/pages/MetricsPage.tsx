import { useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { metricsAPI, photosAPI } from '../api';

export default function MetricsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoType, setPhotoType] = useState<'front' | 'side' | 'back'>('front');

  const { data } = useQuery({
    queryKey: ['metrics'],
    queryFn: metricsAPI.getAll,
  });

  const createMetricsMutation = useMutation({
    mutationFn: metricsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      setShowForm(false);
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: ({ file, type, date }: { file: File; type: 'front' | 'side' | 'back'; date: string }) =>
      photosAPI.upload(file, type, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      alert('Photo uploaded successfully!');
      setPhotoFile(null);
    },
  });

  const handleMetricsSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMetricsMutation.mutate({
      measurement_date: formData.get('measurement_date') as string,
      weight_kg: Number(formData.get('weight_kg')),
      body_fat_percentage: Number(formData.get('body_fat_percentage')),
      notes: formData.get('notes') as string,
    });
  };

  const handlePhotoUpload = () => {
    if (photoFile) {
      uploadPhotoMutation.mutate({
        file: photoFile,
        type: photoType,
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Body Metrics & Progress</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : '+ Add Metrics'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Metrics</h2>
            <form onSubmit={handleMetricsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Date</label>
                  <input name="measurement_date" type="date" required className="input-field" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="label">Weight (kg)</label>
                  <input name="weight_kg" type="number" step="0.1" className="input-field" />
                </div>
                <div>
                  <label className="label">Body Fat (%)</label>
                  <input name="body_fat_percentage" type="number" step="0.1" className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea name="notes" className="input-field" rows={3} />
              </div>
              <button type="submit" className="btn-primary" disabled={createMetricsMutation.isPending}>
                {createMetricsMutation.isPending ? 'Saving...' : 'Save Metrics'}
              </button>
            </form>
          </div>
        )}

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Progress Photo</h2>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="label">Photo Type</label>
              <select value={photoType} onChange={(e) => setPhotoType(e.target.value as 'front' | 'side' | 'back')} className="input-field">
                <option value="front">Front</option>
                <option value="side">Side</option>
                <option value="back">Back</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="label">Select Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className="input-field"
              />
            </div>
            <button
              onClick={handlePhotoUpload}
              disabled={!photoFile || uploadPhotoMutation.isPending}
              className="btn-primary"
            >
              {uploadPhotoMutation.isPending ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {data?.metrics.map((metric) => (
            <div key={metric._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{new Date(metric.measurement_date).toLocaleDateString()}</h3>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {metric.weight_kg && (
                      <div>
                        <p className="text-gray-500">Weight</p>
                        <p className="font-semibold">{metric.weight_kg} kg</p>
                      </div>
                    )}
                    {metric.body_fat_percentage && (
                      <div>
                        <p className="text-gray-500">Body Fat</p>
                        <p className="font-semibold">{metric.body_fat_percentage}%</p>
                      </div>
                    )}
                  </div>
                  {metric.notes && <p className="mt-2 text-sm text-gray-600">{metric.notes}</p>}
                </div>
                {(metric.progress_photos?.front_url || metric.progress_photos?.side_url || metric.progress_photos?.back_url) && (
                  <div className="flex gap-2">
                    {metric.progress_photos.front_url && (
                      <img src={metric.progress_photos.front_url} alt="Front" className="w-16 h-16 object-cover rounded" />
                    )}
                    {metric.progress_photos.side_url && (
                      <img src={metric.progress_photos.side_url} alt="Side" className="w-16 h-16 object-cover rounded" />
                    )}
                    {metric.progress_photos.back_url && (
                      <img src={metric.progress_photos.back_url} alt="Back" className="w-16 h-16 object-cover rounded" />
                    )}
                  </div>
                )}
              </div>
            </div>
          )) || <p className="text-gray-500">No metrics recorded yet</p>}
        </div>
      </div>
    </Layout>
  );
}
