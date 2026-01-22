import { Schema, model, Document } from 'mongoose';

export interface IMedication extends Document {
  userId: Schema.Types.ObjectId;
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
    refill_date?: Date;
    auto_refill: boolean;
  };
  
  health_tags: string[];
  warnings: string[];
  affects_metrics: string[];
  
  bottle_image?: string;
  ocr_extracted_at?: Date;
  manually_verified?: boolean;
  
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const medicationSchema = new Schema<IMedication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['prescription', 'supplement', 'otc'],
      default: 'supplement',
    },
    dosage: {
      amount: { type: Number, required: true },
      unit: {
        type: String,
        enum: ['mg', 'ml', 'iu', 'mcg', 'g'],
        required: true,
      },
      form: {
        type: String,
        enum: ['tablet', 'capsule', 'liquid', 'injection'],
        required: true,
      },
    },
    frequency: {
      times_per_day: { type: Number, required: true, min: 1, max: 12 },
      cron: String,
      days: [{ type: Number, min: 0, max: 6 }],
    },
    inventory: {
      count: { type: Number, default: 0, min: 0 },
      refill_date: Date,
      auto_refill: { type: Boolean, default: false },
    },
    health_tags: [String],
    warnings: [String],
    affects_metrics: [String],
    
    bottle_image: String,
    ocr_extracted_at: Date,
    manually_verified: { type: Boolean, default: false },
    
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Medication = model<IMedication>('Medication', medicationSchema);
