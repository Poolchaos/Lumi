import { Medication, IMedication } from '../models/Medication';
import { DoseLog } from '../models/DoseLog';
import { CreateMedicationInput, UpdateMedicationInput } from '../validators/medicationValidator';
import { ObjectId } from 'mongodb';

export class MedicationService {
  /**
   * Create a new medication for a user
   */
  async createMedication(
    userId: ObjectId,
    data: CreateMedicationInput
  ): Promise<IMedication> {
    const medication = new Medication({
      userId,
      ...data,
      is_active: true,
    });
    return medication.save();
  }

  /**
   * Get all medications for a user
   */
  async getMedicationsByUser(userId: ObjectId): Promise<IMedication[]> {
    return Medication.find({ userId, is_active: true }).sort({ created_at: -1 });
  }

  /**
   * Get a single medication by ID
   */
  async getMedicationById(medicationId: ObjectId, userId: ObjectId): Promise<IMedication | null> {
    return Medication.findOne({ _id: medicationId, userId });
  }

  /**
   * Update a medication
   */
  async updateMedication(
    medicationId: ObjectId,
    userId: ObjectId,
    data: UpdateMedicationInput
  ): Promise<IMedication | null> {
    return Medication.findOneAndUpdate(
      { _id: medicationId, userId },
      { $set: { ...data, updated_at: new Date() } },
      { new: true }
    );
  }

  /**
   * Soft delete (deactivate) a medication
   */
  async deleteMedication(medicationId: ObjectId, userId: ObjectId): Promise<boolean> {
    const result = await Medication.updateOne(
      { _id: medicationId, userId },
      { $set: { is_active: false, updated_at: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  /**
   * Log a dose taken
   */
  async logDose(userId: ObjectId, medicationId: ObjectId, notes?: string) {
    // Verify medication exists and belongs to user
    const medication = await this.getMedicationById(medicationId, userId);
    if (!medication) throw new Error('Medication not found');

    const doseLog = new DoseLog({
      userId,
      medication_id: medicationId,
      taken_at: new Date(),
      notes,
    });
    return doseLog.save();
  }

  /**
   * Get dose logs for a medication within a date range
   */
  async getDoseLogs(
    userId: ObjectId,
    medicationId: ObjectId,
    startDate: Date,
    endDate: Date
  ) {
    return DoseLog.find({
      userId,
      medication_id: medicationId,
      taken_at: { $gte: startDate, $lte: endDate },
    }).sort({ taken_at: -1 });
  }

  /**
   * Get adherence stats (how many times taken vs prescribed)
   */
  async getAdherenceStats(userId: ObjectId, medicationId: ObjectId, daysBack: number = 30) {
    const medication = await this.getMedicationById(medicationId, userId);
    if (!medication) throw new Error('Medication not found');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const endDate = new Date();

    const logs = await this.getDoseLogs(userId, medicationId, startDate, endDate);
    const expectedTakes = medication.frequency.times_per_day * daysBack;
    const actualTakes = logs.length;
    const adherenceRate = (actualTakes / expectedTakes) * 100;

    return {
      expectedTakes,
      actualTakes,
      adherenceRate: Math.round(adherenceRate),
      logs,
    };
  }
}

export const medicationService = new MedicationService();
