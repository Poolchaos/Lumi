import { useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { equipmentAPI } from '../api';
import type { Equipment } from '../types';

export default function EquipmentPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data } = useQuery({
    queryKey: ['equipment'],
    queryFn: equipmentAPI.getAll,
  });

  const createMutation = useMutation({
    mutationFn: equipmentAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: equipmentAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const equipment: Partial<Equipment> = {
      equipment_name: formData.get('equipment_name') as string,
      equipment_type: formData.get('equipment_type') as Equipment['equipment_type'],
      quantity: Number(formData.get('quantity')),
      condition: formData.get('condition') as Equipment['condition'],
      notes: formData.get('notes') as string,
    };
    createMutation.mutate(equipment);
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Equipment Inventory</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : '+ Add Equipment'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Equipment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Equipment Name</label>
                  <input name="equipment_name" required className="input-field" placeholder="e.g. Adjustable Dumbbells" />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select name="equipment_type" required className="input-field">
                    <option value="free_weights">Free Weights</option>
                    <option value="machines">Machines</option>
                    <option value="cardio">Cardio</option>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="resistance_bands">Resistance Bands</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Quantity</label>
                  <input name="quantity" type="number" required className="input-field" defaultValue={1} />
                </div>
                <div>
                  <label className="label">Condition</label>
                  <select name="condition" required className="input-field">
                    <option value="new">New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea name="notes" className="input-field" rows={3} />
              </div>
              <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Adding...' : 'Add Equipment'}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.equipment.map((item) => (
            <div key={item._id} className="card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{item.equipment_name}</h3>
                <button
                  onClick={() => deleteMutation.mutate(item._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </button>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Type:</span> {item.equipment_type}</p>
                <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                <p><span className="font-medium">Condition:</span> {item.condition}</p>
                {item.notes && <p className="text-xs mt-2">{item.notes}</p>}
              </div>
            </div>
          )) || <p className="text-gray-500">No equipment added yet</p>}
        </div>
      </div>
    </Layout>
  );
}
