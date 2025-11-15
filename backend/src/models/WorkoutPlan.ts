import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkoutPlan extends Document {
  user_id: mongoose.Types.ObjectId;
  plan_data: {
    plan_overview: {
      duration_weeks: number;
      sessions_per_week: number;
      focus_areas: string[];
      equipment_required: string[];
    };
    weekly_schedule: Array<{
      day: string;
      workout: {
        name: string;
        duration_minutes: number;
        focus: string;
        exercises: Array<{
          name: string;
          sets?: number;
          reps?: number;
          duration_seconds?: number;
          rest_seconds?: number;
          equipment?: string[];
          target_muscles: string[];
          instructions: string;
          modifications?: string;
        }>;
      };
    }>;
    progression_notes: string;
    safety_reminders: string[];
  };
  generation_context: {
    user_goals?: string[];
    experience_level?: string;
    equipment_used?: string[];
  };
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const workoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plan_data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    generation_context: {
      user_goals: [String],
      experience_level: String,
      equipment_used: [String],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Index for efficient plan queries
workoutPlanSchema.index({ user_id: 1, is_active: 1, created_at: -1 });

export default mongoose.model<IWorkoutPlan>('WorkoutPlan', workoutPlanSchema);
