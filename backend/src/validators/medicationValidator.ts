import { z } from 'zod';

export const CreateMedicationSchema = z.object({
  name: z.string().min(1, 'Medication name required').trim(),
  type: z.enum(['prescription', 'supplement', 'otc']),
  dosage: z.object({
    amount: z.number().positive('Amount must be positive'),
    unit: z.enum(['mg', 'ml', 'iu', 'mcg', 'g']),
    form: z.enum(['tablet', 'capsule', 'liquid', 'injection']),
  }),
  frequency: z.object({
    times_per_day: z.number().int().min(1).max(12),
    cron: z.string().optional(),
    days: z.array(z.number().min(0).max(6)).optional(),
  }),
  inventory: z.object({
    count: z.number().nonnegative().default(0),
    refill_date: z.date().optional(),
    auto_refill: z.boolean().default(false),
  }).optional(),
  health_tags: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  affects_metrics: z.array(z.string()).default([]),
});

export const UpdateMedicationSchema = CreateMedicationSchema.partial();

export const DoseLogSchema = z.object({
  medication_id: z.string().min(1),
  taken_at: z.date().default(() => new Date()),
  notes: z.string().optional(),
});

export type CreateMedicationInput = z.infer<typeof CreateMedicationSchema>;
export type UpdateMedicationInput = z.infer<typeof UpdateMedicationSchema>;
export type DoseLogInput = z.infer<typeof DoseLogSchema>;
