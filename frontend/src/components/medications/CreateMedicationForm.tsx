import React, { useState } from 'react';
import { useCreateMedication } from '../api/medicationAPI';
import { Pill, Plus, X } from 'lucide-react';

interface CreateMedicationFormProps {
  onSuccess?: () => void;
}

export function CreateMedicationForm({ onSuccess }: CreateMedicationFormProps) {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateMedication();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'supplement' as 'prescription' | 'supplement' | 'otc',
    dosage: {
      amount: 1,
      unit: 'mg' as const,
      form: 'tablet' as const,
    },
    frequency: {
      times_per_day: 1,
    },
    inventory: {
      count: 0,
      auto_refill: false,
    },
    health_tags: [] as string[],
    warnings: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      setOpen(false);
      setFormData({
        name: '',
        type: 'supplement',
        dosage: {
          amount: 1,
          unit: 'mg',
          form: 'tablet',
        },
        frequency: {
          times_per_day: 1,
        },
        inventory: {
          count: 0,
          auto_refill: false,
        },
        health_tags: [],
        warnings: [],
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create medication', error);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex gap-2 items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        <Plus size={18} /> Add Medication
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex gap-2 items-center mb-6">
          <Pill className="text-blue-500" />
          <h2 className="text-xl font-bold">Add Medication</h2>
          <button
            onClick={() => setOpen(false)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medication Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Metformin, Vitamin D3"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="prescription">Prescription</option>
                <option value="supplement">Supplement</option>
                <option value="otc">OTC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency (per day) *
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.frequency.times_per_day}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    frequency: { times_per_day: parseInt(e.target.value) },
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                value={formData.dosage.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dosage: { ...formData.dosage, amount: parseFloat(e.target.value) },
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <select
                value={formData.dosage.unit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dosage: { ...formData.dosage, unit: e.target.value as any },
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="iu">IU</option>
                <option value="mcg">mcg</option>
                <option value="g">g</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Form *
              </label>
              <select
                value={formData.dosage.form}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dosage: { ...formData.dosage, form: e.target.value as any },
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="liquid">Liquid</option>
                <option value="injection">Injection</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inventory Count
            </label>
            <input
              type="number"
              min="0"
              value={formData.inventory.count}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  inventory: { ...formData.inventory, count: parseInt(e.target.value) },
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Adding...' : 'Add Medication'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
