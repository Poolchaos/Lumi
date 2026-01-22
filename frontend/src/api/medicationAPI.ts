import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export const medicationKeys = {
  all: ['medications'] as const,
  lists: () => [...medicationKeys.all, 'list'] as const,
  list: (userId: string) => [...medicationKeys.lists(), userId] as const,
  details: () => [...medicationKeys.all, 'detail'] as const,
  detail: (id: string) => [...medicationKeys.details(), id] as const,
  adherence: (id: string) => [...medicationKeys.details(), id, 'adherence'] as const,
};

export interface Medication {
  _id: string;
  userId: string;
  name: string;
  type: 'prescription' | 'supplement' | 'otc';
  dosage: {
    amount: number;
    unit: 'mg' | 'ml' | 'iu' | 'mcg' | 'g';
    form: 'tablet' | 'capsule' | 'liquid' | 'injection';
  };
  frequency: {
    times_per_day: number;
    cron?: string;
    days?: number[];
  };
  inventory: {
    count: number;
    refill_date?: string;
    auto_refill: boolean;
  };
  health_tags: string[];
  warnings: string[];
  affects_metrics: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Get all medications
export function useMedications() {
  return useQuery({
    queryKey: medicationKeys.lists(),
    queryFn: async () => {
      const response = await apiClient.get('/medications');
      return response.data as Medication[];
    },
  });
}

// Get single medication
export function useMedication(id: string) {
  return useQuery({
    queryKey: medicationKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/medications/${id}`);
      return response.data as Medication;
    },
  });
}

// Get adherence stats
export function useMedicationAdherence(id: string, daysBack: number = 30) {
  return useQuery({
    queryKey: medicationKeys.adherence(id),
    queryFn: async () => {
      const response = await apiClient.get(`/medications/${id}/adherence`, {
        params: { days: daysBack },
      });
      return response.data;
    },
  });
}

// Create medication
export function useCreateMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/medications', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
    },
  });
}

// Update medication
export function useUpdateMedication(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.put(`/medications/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
    },
  });
}

// Delete medication
export function useDeleteMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/medications/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
    },
  });
}

// Log a dose
export function useLogDose(medicationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notes?: string) => {
      const response = await apiClient.post(`/medications/${medicationId}/log-dose`, {
        notes,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicationKeys.adherence(medicationId) });
    },
  });
}
