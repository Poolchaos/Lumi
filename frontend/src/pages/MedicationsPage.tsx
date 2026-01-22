import React from 'react';
import { useMedications, useLogDose } from '../api/medicationAPI';
import { CreateMedicationForm } from '../components/medications/CreateMedicationForm';
import { Pill, CheckCircle, AlertCircle } from 'lucide-react';

export function MedicationsPage() {
  const { data: medications, isLoading } = useMedications();

  if (isLoading) {
    return <div className="p-8 text-center">Loading medications...</div>;
  }

  const activeMeds = medications?.filter((m) => m.is_active) || [];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex gap-4 items-center justify-between mb-8">
        <div className="flex gap-2 items-center">
          <Pill className="text-blue-500" size={32} />
          <h1 className="text-3xl font-bold">Medications & Supplements</h1>
        </div>
        <CreateMedicationForm />
      </div>

      {activeMeds.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Pill className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 mb-4">No medications yet</p>
          <p className="text-sm text-gray-500">
            Add your medications and supplements to track adherence and correlate with fitness metrics
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeMeds.map((med) => (
            <MedicationCard key={med._id} medication={med} />
          ))}
        </div>
      )}
    </div>
  );
}

interface MedicationCardProps {
  medication: any;
}

function MedicationCard({ medication }: MedicationCardProps) {
  const logDoseMutation = useLogDose(medication._id);

  const handleLogDose = async () => {
    try {
      await logDoseMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to log dose', error);
    }
  };

  const typeColors = {
    prescription: 'bg-red-50 border-red-200',
    supplement: 'bg-blue-50 border-blue-200',
    otc: 'bg-green-50 border-green-200',
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${typeColors[medication.type]}`}>
      <div className="flex gap-4 items-start justify-between">
        <div className="flex-1">
          <div className="flex gap-2 items-center mb-2">
            <h3 className="text-lg font-bold">{medication.name}</h3>
            <span className="text-xs px-2 py-1 bg-white rounded capitalize">
              {medication.type}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
            <div>
              <p className="font-semibold">Dosage</p>
              <p>
                {medication.dosage.amount} {medication.dosage.unit} ({medication.dosage.form})
              </p>
            </div>
            <div>
              <p className="font-semibold">Frequency</p>
              <p>{medication.frequency.times_per_day}x daily</p>
            </div>
            {medication.inventory && (
              <div>
                <p className="font-semibold">Inventory</p>
                <p>{medication.inventory.count} remaining</p>
              </div>
            )}
          </div>

          {medication.warnings.length > 0 && (
            <div className="flex gap-2 items-start bg-yellow-50 border border-yellow-200 rounded p-2 text-sm">
              <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                {medication.warnings.map((w: string, i: number) => (
                  <p key={i} className="text-yellow-800">
                    {w}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleLogDose}
          disabled={logDoseMutation.isPending}
          className="flex gap-2 items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 whitespace-nowrap"
        >
          <CheckCircle size={18} /> Log Dose
        </button>
      </div>
    </div>
  );
}
