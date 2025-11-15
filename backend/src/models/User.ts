import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password_hash: string;
  profile: {
    first_name?: string;
    last_name?: string;
    date_of_birth?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    height_cm?: number;
    weight_kg?: number;
    activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    fitness_goals?: string[];
    experience_level?: 'beginner' | 'intermediate' | 'advanced';
    medical_conditions?: string[];
    injuries?: string[];
  };
  preferences: {
    preferred_workout_days?: string[];
    preferred_workout_duration?: number;
    preferred_workout_types?: string[];
    equipment_access?: string[];
  };
  created_at: Date;
  updated_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password_hash: {
      type: String,
      required: true,
    },
    profile: {
      first_name: String,
      last_name: String,
      date_of_birth: Date,
      gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      },
      height_cm: Number,
      weight_kg: Number,
      activity_level: {
        type: String,
        enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      },
      fitness_goals: [String],
      experience_level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
      },
      medical_conditions: [String],
      injuries: [String],
    },
    preferences: {
      preferred_workout_days: [String],
      preferred_workout_duration: Number,
      preferred_workout_types: [String],
      equipment_access: [String],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

export default mongoose.model<IUser>('User', userSchema);
