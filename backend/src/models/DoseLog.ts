import { Schema, model, Document } from 'mongoose';

export interface IDoseLog extends Document {
  userId: Schema.Types.ObjectId;
  medication_id: Schema.Types.ObjectId;
  taken_at: Date;
  notes?: string;
  created_at: Date;
}

const doseLogSchema = new Schema<IDoseLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    medication_id: {
      type: Schema.Types.ObjectId,
      ref: 'Medication',
      required: true,
      index: true,
    },
    taken_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: String,
  },
  { timestamps: true }
);

// Compound index for efficient queries: user + date range
doseLogSchema.index({ userId: 1, taken_at: -1 });
doseLogSchema.index({ medication_id: 1, taken_at: -1 });

export const DoseLog = model<IDoseLog>('DoseLog', doseLogSchema);
