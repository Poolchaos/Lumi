/**
 * Copyright (c) 2025-2026 Phillip-Juan van der Berg. All Rights Reserved.
 *
 * This file is part of Lumi.
 *
 * Lumi is licensed under the PolyForm Noncommercial License 1.0.0.
 * You may not use this file except in compliance with the License.
 *
 * Commercial use requires a separate paid license.
 * Contact: phillipjuanvanderberg@gmail.com
 *
 * See the LICENSE file for the full license text.
 */

import { useState } from 'react';
import { Sparkles, Check, Edit2, Trash2, Loader2 } from 'lucide-react';
import { Modal, Button, Card } from '../../design-system';
import type { CreateMedicationInput } from '../../types';

interface ParsedMedication {
  name: string;
  type: 'prescription' | 'supplement' | 'otc';
  dosage: {
    amount: number;
    unit: string;
    form: string;
  };
  frequency: {
    times_per_day: number;
    schedule_times?: string[];
  };
  purpose?: string;
  notes?: string;
}

interface MedicationParsingModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  onParse: (notes: string) => Promise<{ medications: ParsedMedication[]; suggestions?: string }>;
  onAddMedications: (medications: CreateMedicationInput[]) => void;
  isParsing: boolean;
}

const TYPE_LABELS = {
  prescription: '💊 Prescription',
  supplement: '🌿 Supplement',
  otc: '🏪 Over-the-Counter',
};

const TYPE_COLORS = {
  prescription: 'bg-purple-100 text-purple-800 border-purple-200',
  supplement: 'bg-green-100 text-green-800 border-green-200',
  otc: 'bg-blue-100 text-blue-800 border-blue-200',
};

export default function MedicationParsingModal({
  isOpen,
  onClose,
  notes,
  onParse,
  onAddMedications,
  isParsing,
}: MedicationParsingModalProps) {
  const [parsedMedications, setParsedMedications] = useState<ParsedMedication[]>([]);
  const [suggestions, setSuggestions] = useState<string | undefined>();
  const [selectedMedications, setSelectedMedications] = useState<Set<number>>(new Set());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<ParsedMedication | null>(null);
  const [hasStartedParsing, setHasStartedParsing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleParse = async () => {
    setHasStartedParsing(true);
    setErrorMessage(null);
    try {
      const result = await onParse(notes);
      setParsedMedications(result.medications);
      setSuggestions(result.suggestions);
      // Auto-select all by default
      setSelectedMedications(new Set(result.medications.map((_, idx) => idx)));
    } catch (error: unknown) {
      console.error('Parsing failed:', error);
      let message = 'Failed to parse medications. Please try again.';
      if (error && typeof error === 'object') {
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
          const data = error.response.data as { message?: string };
          message = data?.message || message;
        } else if ('message' in error && typeof error.message === 'string') {
          message = error.message;
        }
      }
      setErrorMessage(message);
    }
  };

  const handleToggleSelection = (index: number) => {
    const newSelection = new Set(selectedMedications);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedMedications(newSelection);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingData({ ...parsedMedications[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingData) {
      const updated = [...parsedMedications];
      updated[editingIndex] = editingData;
      setParsedMedications(updated);
      setEditingIndex(null);
      setEditingData(null);
    }
  };

  const handleDelete = (index: number) => {
    const updated = parsedMedications.filter((_, idx) => idx !== index);
    setParsedMedications(updated);
    const newSelection = new Set(selectedMedications);
    newSelection.delete(index);
    // Adjust indices
    const adjusted = new Set<number>();
    newSelection.forEach((idx) => {
      if (idx > index) adjusted.add(idx - 1);
      else if (idx < index) adjusted.add(idx);
    });
    setSelectedMedications(adjusted);
  };

  const handleAddSelected = () => {
    const medicationsToAdd: CreateMedicationInput[] = parsedMedications
      .filter((_, idx) => selectedMedications.has(idx))
      .map((med) => ({
        name: med.name,
        type: med.type,
        dosage: {
          amount: med.dosage.amount,
          unit: med.dosage.unit as 'mg' | 'ml' | 'iu' | 'mcg' | 'g' | 'tablets' | 'capsules',
          form: med.dosage.form as 'tablet' | 'capsule' | 'liquid' | 'injection' | 'topical' | 'powder' | 'other',
        },
        frequency: {
          times_per_day: med.frequency.times_per_day,
          schedule_times: med.frequency.schedule_times || [],
        },
        notes: [med.purpose, med.notes].filter(Boolean).join('. '),
      }));

    onAddMedications(medicationsToAdd);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Medication Parser"
      size="lg"
    >
      <div className="space-y-6">
        {/* Original Notes */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Notes</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
            {notes}
          </div>
        </div>

        {/* Parse Button */}
        {!hasStartedParsing && (
          <Button
            onClick={handleParse}
            loading={isParsing}
            className="w-full flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Parse with AI
          </Button>
        )}

        {/* Parsing Loading State */}
        {isParsing && (
          <Card className="p-8 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-gray-600">AI is analyzing your medications...</p>
            <p className="text-sm text-gray-500 mt-1">This usually takes 3-5 seconds</p>
          </Card>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-red-100 p-1">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-red-900">Parsing Error</h3>
                <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
                {errorMessage.includes('not configured') && (
                  <p className="mt-2 text-xs text-red-600">
                    💡 Tip: Make sure ANTHROPIC_API_KEY is set in your .env file and restart the backend.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Parsed Medications */}
        {hasStartedParsing && !isParsing && !errorMessage && parsedMedications.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Found {parsedMedications.length} medication{parsedMedications.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-xs text-gray-500">
                {selectedMedications.size} selected
              </p>
            </div>

            {/* AI Suggestions */}
            {suggestions && (
              <Card className="bg-blue-50 border-blue-200 p-3">
                <p className="text-sm text-blue-900">
                  <strong>💡 AI Suggestion:</strong> {suggestions}
                </p>
              </Card>
            )}

            {/* Medications List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {parsedMedications.map((med, idx) => (
                <Card
                  key={idx}
                  className={`p-4 transition-all ${
                    selectedMedications.has(idx)
                      ? 'border-blue-400 border-2 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  {editingIndex === idx ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingData?.name || ''}
                        onChange={(e) =>
                          setEditingData({ ...editingData!, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Medication name"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check className="w-4 h-4" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingIndex(null);
                            setEditingData(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedMedications.has(idx)}
                        onChange={() => handleToggleSelection(idx)}
                        className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{med.name}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${
                              TYPE_COLORS[med.type]
                            }`}
                          >
                            {TYPE_LABELS[med.type]}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                          <div>
                            <span className="font-medium">Dosage:</span>{' '}
                            {med.dosage.amount} {med.dosage.unit} ({med.dosage.form})
                          </div>
                          <div>
                            <span className="font-medium">Frequency:</span>{' '}
                            {med.frequency.times_per_day}x per day
                          </div>
                        </div>

                        {med.purpose && (
                          <p className="text-xs text-gray-600 mb-1">
                            <span className="font-medium">Purpose:</span> {med.purpose}
                          </p>
                        )}

                        {med.notes && (
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Notes:</span> {med.notes}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStartEdit(idx)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleAddSelected}
                disabled={selectedMedications.size === 0}
                className="flex-1"
              >
                Add {selectedMedications.size > 0 ? selectedMedications.size : ''} Medication
                {selectedMedications.size !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {hasStartedParsing && !isParsing && !errorMessage && parsedMedications.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-2">No medications found</p>
            <p className="text-sm text-gray-500">
              Try adding more details like dosages and frequencies
            </p>
          </Card>
        )}
      </div>
    </Modal>
  );
}
