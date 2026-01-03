import type { StepContentProps } from './types';

const EQUIPMENT_OPTIONS = [
  'Dumbbells',
  'Barbell',
  'Bench',
  'Pull-up Bar',
  'Resistance Bands',
  'Kettlebells',
  'Treadmill',
  'Stationary Bike',
  'Jump Rope',
  'None (Bodyweight)',
];

export function Step6Equipment({ data, setData }: StepContentProps) {
  const handleEquipmentToggle = (eq: string) => {
    if (data.equipment.includes(eq)) {
      setData({ ...data, equipment: data.equipment.filter((e: string) => e !== eq) });
    } else {
      setData({ ...data, equipment: [...data.equipment, eq] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Available Equipment</h3>
        <p className="text-neutral-600 mb-6">What equipment do you have access to?</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {EQUIPMENT_OPTIONS.map((eq) => {
          const isSelected = data.equipment.includes(eq);

          return (
            <button
              key={eq}
              onClick={() => handleEquipmentToggle(eq)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
            >
              {eq}
            </button>
          );
        })}
      </div>
    </div>
  );
}
