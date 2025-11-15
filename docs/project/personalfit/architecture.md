# PersonalFit: Architecture

## High-Level Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  React Web Application (TypeScript)                          │
│  - Component-based UI                                        │
│  - State management (Zustand/Redux)                          │
│  - Client-side routing (React Router)                        │
│  - HTTP client (Axios)                                       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Node.js + Express.js API (TypeScript)                       │
│  ├─ Authentication Middleware (JWT validation)               │
│  ├─ Route Controllers (business logic)                       │
│  ├─ Service Layer (AI, workout, metrics)                     │
│  └─ Validation Middleware (request/response schemas)         │
└────────┬───────────────────────────────┬────────────────────┘
         │                               │
         ▼                               ▼
┌─────────────────────┐        ┌────────────────────────┐
│   Data Layer        │        │   External Services    │
├─────────────────────┤        ├────────────────────────┤
│  MongoDB            │        │  OpenAI API            │
│  - User profiles    │        │  - GPT-4o              │
│  - Workout data     │        │  - Plan generation     │
│  - Metrics          │        │  - Nutrition advice    │
│  - Accountability   │        └────────────────────────┘
└─────────────────────┘        ┌────────────────────────┐
                               │  Image Storage         │
                               │  - AWS S3/Cloudinary   │
                               │  - Progress photos     │
                               └────────────────────────┘
```

### Architecture Principles

**Separation of Concerns:**
- Frontend: Presentation and user interaction only
- Backend: Business logic, data validation, external service orchestration
- Database: Data persistence with referential integrity

**Stateless API:**
- No session state stored on server
- JWT tokens carry authentication state
- Horizontally scalable backend

**API-First Design:**
- Frontend communicates exclusively via REST API
- API versioned for future compatibility
- Swagger/OpenAPI documentation generated

**Security Layers:**
- Frontend: Basic validation, secure token storage
- Backend: Authentication, authorization, data sanitization
- Database: Access control, encryption at rest

## Data Model

### Core Collections

#### Users Collection
```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  username: string (unique, indexed),
  password_hash: string,

  profile: {
    name: string,
    age: number,
    gender: 'male' | 'female' | 'other',
    height_cm: number,
    current_weight_kg: number,

    fitness_level: 'beginner' | 'intermediate' | 'advanced',
    years_training: number,
    current_training_frequency: number,

    goals: string[],
    constraints: string[],
    available_equipment: string[],
    time_per_session: number,
    preferred_style: string,

    timezone: string,
    created_at: Date,
    updated_at: Date
  },

  settings: {
    difficulty_level: 'easy' | 'medium' | 'sergeant' | 'beast',
    notification_enabled: boolean,
    notification_time: string,
    units: 'metric' | 'imperial',
    theme: 'light' | 'dark' | 'system'
  },

  active_plan_id: ObjectId | null,
  created_at: Date,
  last_login: Date
}
```

**Indexes:**
- `email` (unique)
- `username` (unique)
- `created_at` (for analytics)

#### Workout Templates Collection
```typescript
{
  _id: ObjectId,
  user_id: ObjectId (indexed),
  name: string,
  description: string,

  training_phase: 'hypertrophy' | 'strength' | 'endurance' | 'fat_loss',
  difficulty: 'easy' | 'medium' | 'sergeant' | 'beast',
  duration_weeks: number,

  workouts: [
    {
      day_of_week: number (1-7),
      name: string,
      exercises: [
        {
          name: string,
          sets: number,
          reps: string,
          rest_seconds: number,
          notes: string,
          video_url: string | null,
          difficulty_modifier: 'easy' | 'medium' | 'hard'
        }
      ],
      rest_day: boolean,
      estimated_duration_minutes: number
    }
  ],

  nutrition: {
    calories_target: number,
    macros: {
      protein_g: number,
      carbs_g: number,
      fat_g: number
    },
    meal_plan: [
      {
        meal_name: string,
        foods: string[],
        calories: number,
        macros: { protein: number, carbs: number, fat: number }
      }
    ]
  },

  start_date: Date,
  end_date: Date,
  ai_generated: boolean,
  ai_rationale: string | null,
  status: 'active' | 'completed' | 'abandoned',
  created_at: Date
}
```

**Indexes:**
- `user_id` (for user's plan lookup)
- `user_id, status` (compound for active plans)
- `created_at` (for history sorting)

#### Workout Logs Collection
```typescript
{
  _id: ObjectId,
  user_id: ObjectId (indexed),
  workout_template_id: ObjectId,
  scheduled_date: Date (indexed),

  exercises: [
    {
      exercise_name: string,
      target_sets: number,
      target_reps: string,

      sets_completed: number,
      reps_per_set: number[],
      weight_used_kg: number[],

      perceived_difficulty: number (1-10),
      notes: string,
      skipped: boolean
    }
  ],

  completed: boolean,
  completion_time_minutes: number,
  total_volume_kg: number,

  logged_at: Date,
  completed_at: Date | null
}
```

**Indexes:**
- `user_id, scheduled_date` (compound for date queries)
- `user_id, completed_at` (compound for history)
- `workout_template_id` (for plan analytics)

#### Body Metrics Collection
```typescript
{
  _id: ObjectId,
  user_id: ObjectId (indexed),
  date: Date (indexed),

  weight_kg: number,
  body_fat_percent: number | null,

  measurements: {
    chest_cm: number | null,
    waist_cm: number | null,
    hips_cm: number | null,
    arm_cm: number | null,
    thigh_cm: number | null,
    calf_cm: number | null
  },

  photo_url: string | null,
  notes: string,
  created_at: Date
}
```

**Indexes:**
- `user_id, date` (compound for timeline queries)

#### Equipment Collection
```typescript
{
  _id: ObjectId,
  user_id: ObjectId (indexed, unique),

  equipment_list: [
    {
      equipment_id: string,
      name: string,
      category: string,
      quantity: number,
      weight_options: number[] | null,
      condition: string,
      notes: string,
      added_at: Date
    }
  ],

  equipment_categories_available: string[],
  total_equipment_count: number,
  last_updated: Date,
  created_at: Date
}
```

**Indexes:**
- `user_id` (unique - one equipment record per user)
- `equipment_categories_available` (multikey)

#### Accountability Collection
```typescript
{
  _id: ObjectId,
  user_id: ObjectId (indexed),

  week_start: Date (indexed),
  workouts_scheduled: number,
  workouts_completed: number,
  workouts_missed: number,

  current_streak_days: number,
  longest_streak_days: number,

  penalties: [
    {
      penalty_id: string,
      reason: string,
      penalty_type: 'extra_cardio' | 'extra_session' | 'doubled_workout',
      description: string,
      due_by: Date,
      completed: boolean,
      completed_at: Date | null
    }
  ],

  difficulty_history: [
    {
      date: Date,
      from: string,
      to: string,
      reason: string
    }
  ],

  last_updated: Date
}
```

**Indexes:**
- `user_id` (unique per user)
- `week_start` (for weekly queries)

#### Shared Access Collection
```typescript
{
  _id: ObjectId,
  owner_user_id: ObjectId (indexed),
  shared_with_user_id: ObjectId (indexed),

  access_level: 'view_only' | 'comment' | 'full_access',
  status: 'pending' | 'accepted' | 'declined' | 'revoked',

  invited_at: Date,
  accepted_at: Date | null,
  revoked_at: Date | null
}
```

**Indexes:**
- `owner_user_id` (for owner's shared list)
- `shared_with_user_id` (for recipient's shared list)
- `owner_user_id, status` (compound for active shares)

### Data Relationships

```
Users (1) ──── (N) Workout Templates
Users (1) ──── (N) Workout Logs
Users (1) ──── (N) Body Metrics
Users (1) ──── (1) Accountability
Users (1) ──── (N) Shared Access (as owner)
Users (1) ──── (N) Shared Access (as recipient)

Workout Templates (1) ──── (N) Workout Logs
```

### Data Retention

**Permanent:**
- User profiles (until account deletion)
- Workout logs (historical data)
- Body metrics (progress tracking)

**Time-Limited:**
- JWT tokens: 24 hours
- Password reset tokens: 1 hour
- Invitation tokens: 7 days

**Soft Delete:**
- Abandoned plans (status changed, not deleted)
- Revoked shares (status changed, historical record preserved)

## API Architecture

### REST Endpoints Structure

```
/api/v1/
├── /auth
│   ├── POST   /signup
│   ├── POST   /login
│   ├── POST   /logout
│   ├── GET    /verify
│   └── POST   /refresh
│
├── /users
│   ├── GET    /me
│   ├── PUT    /me
│   └── DELETE /me
│
├── /profiles
│   ├── GET    /
│   ├── POST   /
│   └── PUT    /
│
├── /plans
│   ├── GET    /
│   ├── GET    /:id
│   ├── POST   /generate (AI)
│   ├── POST   /manual
│   ├── PUT    /:id
│   ├── DELETE /:id
│   └── POST   /:id/activate
│
├── /workouts
│   ├── GET    /today
│   ├── GET    /history
│   ├── GET    /stats
│   ├── POST   /log
│   ├── GET    /log/:id
│   └── PUT    /log/:id
│
├── /metrics
│   ├── GET    /timeline
│   ├── GET    /stats
│   ├── POST   /log
│   ├── GET    /:id
│   └── DELETE /:id
│
├── /accountability
│   ├── GET    /current
│   ├── GET    /stats
│   ├── POST   /penalty/:id/complete
│   └── GET    /history
│
├── /share
│   ├── POST   /invite
│   ├── GET    /invitations
│   ├── POST   /:id/accept
│   ├── POST   /:id/decline
│   ├── DELETE /:id
│
├── /equipment
│   ├── POST   /setup (onboarding)
│   ├── GET    /
│   ├── POST   /add
│   ├── PUT    /:id
│   ├── DELETE /:id
│   ├── GET    /suggested-exercises
│   └── GET    /utilization
│   └── GET    /user/:id
│
└── /ai
    ├── POST   /generate-plan
    └── POST   /suggest-adjustment
```

### API Design Principles

**RESTful Conventions:**
- Resource-based URLs (nouns, not verbs)
- HTTP methods for actions (GET, POST, PUT, DELETE)
- Plural resource names (`/workouts`, not `/workout`)
- Nested resources for relationships (`/plans/:id/activate`)

**Request/Response Format:**
- Content-Type: `application/json`
- Standard structure:
  ```json
  {
    "success": boolean,
    "data": object | array,
    "error": {
      "code": string,
      "message": string
    } | null
  }
  ```

**Error Handling:**
- HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Error)
- Error codes: `AUTH_INVALID`, `VALIDATION_FAILED`, `RESOURCE_NOT_FOUND`, `AI_UNAVAILABLE`
- User-friendly error messages (no stack traces in production)

**Authentication:**
- JWT token in `Authorization: Bearer <token>` header
- All endpoints except `/auth/*` require authentication
- Token validation middleware on every protected route

**Rate Limiting:**
- AI endpoints: 10 requests per hour per user
- Auth endpoints: 5 requests per 15 minutes per IP
- General API: 100 requests per minute per user

## AI Integration Architecture

### OpenAI Integration Strategy

**API Configuration:**
```typescript
{
  model: "gpt-4o",
  temperature: 0.7,
  max_tokens: 4000,
  response_format: { type: "json_object" }
}
```

**Prompt Engineering:**

**System Prompt (Workout Generation):**
```
You are a fitness planning AI that generates evidence-based workout programs.

CONSTRAINTS:
- Only reference exercises with scientific backing
- Consider user's age, fitness level, injuries, equipment, and goals
- Progressive overload must be realistic (2-5% per week)
- Adjust for gender differences in hormone/muscle physiology
- Warn if recommendations conflict with user constraints

OUTPUT FORMAT (JSON only):
{
  "workouts": [...],
  "nutrition": {...},
  "rationale": "Why this plan suits the user"
}

SAFETY:
- Start with disclaimer: "Consult doctor before starting if medical conditions exist"
- Flag if user seems injured/unwell
- Recommend form checks for heavy compounds
```

**Dynamic Prompt Construction:**
```typescript
function buildWorkoutPrompt(user: User, params: PlanParams): string {
  return `
User Profile:
- Age: ${user.profile.age}, Gender: ${user.profile.gender}
- Height: ${user.profile.height_cm}cm, Weight: ${user.profile.current_weight_kg}kg
- Fitness Level: ${user.profile.fitness_level}
- Experience: ${user.profile.years_training} years
- Current Frequency: ${user.profile.current_training_frequency} days/week

Goals: ${user.profile.goals.join(', ')}
Constraints: ${user.profile.constraints.join(', ')}

Equipment Available:
${buildEquipmentList(user.equipment)}

Time Available: ${user.profile.time_per_session} minutes per session
Training Style: ${user.profile.preferred_style}

Request:
- Training Phase: ${params.training_phase}
- Duration: ${params.duration_weeks} weeks
- Focus Areas: ${params.focus_areas.join(', ')}
- Difficulty: ${user.settings.difficulty_level}
- Equipment Filter: ${params.equipment_filter ? 'STRICT - Only use listed equipment' : 'FLEXIBLE - Suggest ideal + substitutions'}

${params.equipment_filter ?
  'IMPORTANT: Generate workouts using ONLY the equipment listed above. Do not suggest exercises requiring unavailable equipment.' :
  'IMPORTANT: If suggesting exercises requiring unavailable equipment, provide substitutions using available equipment.'}

Generate a ${params.duration_weeks}-week ${params.training_phase} plan.
  `.trim();
}

function buildEquipmentList(userEquipment: Equipment): string {
  if (!userEquipment || userEquipment.total_equipment_count === 0) {
    return 'No equipment (bodyweight only)';
  }

  return userEquipment.equipment_list
    .map(eq => {
      if (eq.weight_options && eq.weight_options.length > 0) {
        return `- ${eq.name} (${eq.quantity}x, weights: ${eq.weight_options.join(', ')}kg)`;
      }
      return `- ${eq.name} (${eq.quantity}x)`;
    })
    .join('\n');
}
```

**Response Validation:**
```typescript
interface AIWorkoutPlan {
  workouts: Array<{
    day_of_week: number;
    name: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest_seconds: number;
      notes?: string;
    }>;
  }>;
  nutrition: {
    calories_target: number;
    macros: { protein_g: number; carbs_g: number; fat_g: number };
    meal_plan?: Array<{ meal_name: string; foods: string[]; calories: number }>;
  };
  rationale: string;
}

// Validation schema enforced with Zod or similar
```

**Error Handling:**
- OpenAI rate limit hit → Queue request, retry with exponential backoff
- Invalid JSON response → Retry once, then fallback to manual plan
- API timeout (>15 seconds) → Cancel, show fallback UI
- Malformed response → Log error, provide manual plan builder

**Caching Strategy:**
- Cache identical prompts for 24 hours (avoid duplicate API calls)
- Cache key: Hash of (user_id + plan_params)
- Invalidate on profile update

### AI Service Architecture

```typescript
class AIService {
  async generateWorkoutPlan(
    userId: string,
    params: PlanParams
  ): Promise<WorkoutPlan> {
    // 1. Fetch user profile
    const user = await UserModel.findById(userId);

    // 2. Check cache
    const cacheKey = this.buildCacheKey(userId, params);
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    // 3. Build prompt
    const prompt = buildWorkoutPrompt(user, params);

    // 4. Call OpenAI
    const response = await this.callOpenAI(prompt);

    // 5. Validate response
    const validated = this.validatePlan(response);

    // 6. Cache result
    await cache.set(cacheKey, validated, 86400); // 24 hours

    // 7. Return
    return validated;
  }

  private async callOpenAI(prompt: string): Promise<any> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      if (error.code === 'rate_limit_exceeded') {
        throw new RateLimitError('OpenAI rate limit hit');
      }
      throw new AIServiceError('OpenAI call failed', error);
    }
  }
}
```

### Equipment Validation Service

```typescript
class EquipmentValidationService {
  private exerciseDatabase: Map<string, ExerciseMetadata>;

  async canPerformExercise(
    exerciseName: string,
    userEquipment: Equipment
  ): Promise<{
    can_perform: boolean;
    required_equipment: string[];
    available_equipment: string[];
    missing_equipment: string[];
    substitutions: Array<{
      original_exercise: string;
      substitute_exercise: string;
      reason: string;
    }>;
  }> {
    const exercise = this.exerciseDatabase.get(exerciseName);
    if (!exercise) {
      throw new Error(`Exercise "${exerciseName}" not found in database`);
    }

    const userEquipmentNames = userEquipment.equipment_list.map(eq => eq.name.toLowerCase());
    const requiredEquipment = exercise.required_equipment.map(eq => eq.toLowerCase());

    const available = requiredEquipment.filter(req =>
      userEquipmentNames.some(user => user.includes(req) || req.includes(user))
    );

    const missing = requiredEquipment.filter(req => !available.includes(req));
    const can_perform = missing.length === 0;
    const substitutions = can_perform ? [] : this.findSubstitutions(exercise, userEquipment);

    return {
      can_perform,
      required_equipment: requiredEquipment,
      available_equipment: available,
      missing_equipment: missing,
      substitutions
    };
  }

  private findSubstitutions(
    exercise: ExerciseMetadata,
    userEquipment: Equipment
  ): Array<{ original_exercise: string; substitute_exercise: string; reason: string }> {
    const substitutes = [];

    for (const [name, metadata] of this.exerciseDatabase.entries()) {
      if (this.muscleGroupMatch(exercise.primary_muscles, metadata.primary_muscles)) {
        const canPerform = metadata.required_equipment.every(req =>
          userEquipment.equipment_list.some(eq => eq.name.toLowerCase().includes(req.toLowerCase()))
        );

        if (canPerform) {
          substitutes.push({
            original_exercise: exercise.name,
            substitute_exercise: metadata.name,
            reason: `Targets same muscles (${metadata.primary_muscles.join(', ')}), uses ${metadata.required_equipment.join(', ')}`
          });
        }
      }
    }

    const bodyweightAlt = this.getBodyweightAlternative(exercise);
    if (bodyweightAlt) {
      substitutes.push(bodyweightAlt);
    }

    return substitutes.slice(0, 3);
  }

  private muscleGroupMatch(primary1: string[], primary2: string[]): boolean {
    return primary1.some(m => primary2.includes(m));
  }

  private getBodyweightAlternative(exercise: ExerciseMetadata): { original_exercise: string; substitute_exercise: string; reason: string } | null {
    const bodyweightAlternatives: Record<string, string> = {
      'barbell bench press': 'push-ups (decline for added difficulty)',
      'dumbbell bench press': 'push-ups',
      'barbell squat': 'bodyweight squats (or pistol squats for advanced)',
      'leg press': 'bodyweight squats',
      'lat pulldown': 'pull-ups or chin-ups (if pull-up bar available)',
      'cable row': 'inverted rows (using table edge or TRX)',
      'barbell curl': 'chin-ups (underhand grip)'
    };

    const alternative = bodyweightAlternatives[exercise.name.toLowerCase()];
    if (alternative) {
      return {
        original_exercise: exercise.name,
        substitute_exercise: alternative,
        reason: 'Bodyweight alternative, no equipment needed'
      };
    }

    return null;
  }

  async validateWorkoutPlan(
    plan: WorkoutPlan,
    userEquipment: Equipment
  ): Promise<{
    valid: boolean;
    invalid_exercises: Array<{
      exercise_name: string;
      missing_equipment: string[];
      suggested_substitutions: string[];
    }>;
  }> {
    const invalid_exercises = [];

    for (const workout of plan.workouts) {
      for (const exercise of workout.exercises) {
        const validation = await this.canPerformExercise(exercise.name, userEquipment);
        if (!validation.can_perform) {
          invalid_exercises.push({
            exercise_name: exercise.name,
            missing_equipment: validation.missing_equipment,
            suggested_substitutions: validation.substitutions.map(s => s.substitute_exercise)
          });
        }
      }
    }

    return {
      valid: invalid_exercises.length === 0,
      invalid_exercises
    };
  }
}

interface ExerciseMetadata {
  name: string;
  required_equipment: string[];
  primary_muscles: string[];
  secondary_muscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  bodyweight_only: boolean;
}
```

## State Management

### Frontend State Architecture

**State Management Tool: Zustand**

Rationale:
- Simpler than Redux (less boilerplate)
- TypeScript-first
- No context provider hell
- DevTools support
- Sufficient for app complexity

**Store Structure:**
```typescript
interface AppState {
  // Auth state
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
  };

  // User profile
  profile: UserProfile | null;

  // Active plan
  activePlan: WorkoutTemplate | null;

  // Today's workout
  todayWorkout: {
    workout: Workout | null;
    log: WorkoutLog | null;
    loading: boolean;
  };

  // Accountability
  accountability: {
    streak: number;
    weekStatus: WeeklyStatus | null;
    penalties: Penalty[];
  };

  // UI state
  ui: {
    theme: 'light' | 'dark' | 'system';
    sidebarOpen: boolean;
    loading: { [key: string]: boolean };
  };

  // Actions
  actions: {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchProfile: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    fetchTodayWorkout: () => Promise<void>;
    logWorkout: (data: WorkoutLogData) => Promise<void>;
    // ... more actions
  };
}
```

**State Persistence:**
- Auth token: localStorage (httpOnly cookie alternative)
- Theme preference: localStorage
- UI state: sessionStorage (transient)
- No sensitive data in client storage

**State Synchronization:**
- Polling: Every 60 seconds for accountability updates
- Manual refresh: User-triggered on pull-to-refresh
- Optimistic updates: UI updates immediately, rollback on error

### Server-Side State

**No Session State:**
- Backend stateless (horizontally scalable)
- All state passed via JWT token or request body
- No in-memory session storage

**Database as Source of Truth:**
- All persistent state in MongoDB
- No in-memory caches for critical data (workout logs, metrics)
- Redis cache for read-heavy, low-change data (user profiles, plans)

## Component Architecture

### Component Hierarchy

```
App
├── AuthLayout
│   ├── LoginPage
│   ├── SignupPage
│   └── OnboardingFlow
│       ├── BasicInfoStep
│       ├── FitnessBackgroundStep
│       ├── GoalsStep
│       ├── ConstraintsStep
│       └── DifficultyStep
│
├── MainLayout
│   ├── Sidebar
│   ├── Header
│   └── MainContent
│       ├── Dashboard
│       │   ├── TodayWorkoutCard
│       │   ├── WeeklyStatsCard
│       │   ├── StreakCard
│       │   └── QuickChartsRow
│       │
│       ├── WorkoutsSection
│       │   ├── WorkoutLogPage
│       │   │   └── ExerciseLogger
│       │   ├── WorkoutHistory
│       │   └── WorkoutStats
│       │
│       ├── PlansSection
│       │   ├── PlansList
│       │   ├── AIPlanGenerator
│       │   ├── ManualPlanBuilder
│       │   └── PlanDetailView
│       │
│       ├── MetricsSection
│       │   ├── MetricsLogForm
│       │   ├── TimelineView
│       │   ├── BodyCompositionCharts
│       │   └── ProgressPhotoGrid
│       │
│       ├── AccountabilitySection
│       │   ├── WeeklyStatusDashboard
│       │   ├── PenaltyList
│       │   └── AccountabilityStats
│       │
│       └── SettingsSection
│           ├── ProfileSettings
│           ├── DifficultySelector
│           └── ShareSettings
│
└── SharedComponents
    ├── Button
    ├── Card
    ├── Modal
    ├── Input
    ├── Select
    ├── Chart
    ├── LoadingSpinner
    └── ErrorBoundary
```

### Component Design Patterns

**Container/Presenter Pattern:**
```typescript
// Container (logic)
function WorkoutLogContainer() {
  const { workout, log } = useTodayWorkout();
  const { logWorkout, loading } = useWorkoutActions();

  const handleSubmit = async (data: WorkoutLogData) => {
    await logWorkout(data);
  };

  return (
    <WorkoutLogPresenter
      workout={workout}
      existingLog={log}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}

// Presenter (UI only)
function WorkoutLogPresenter({ workout, existingLog, onSubmit, loading }) {
  return (
    <div>
      {/* Pure UI rendering */}
    </div>
  );
}
```

**Compound Components (for complex UI):**
```typescript
<Modal>
  <Modal.Header>Confirm Workout Complete</Modal.Header>
  <Modal.Body>
    <p>Total volume: 8,450kg</p>
    <p>Time: 62 minutes</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Complete</Button>
  </Modal.Footer>
</Modal>
```

**Custom Hooks (for logic reuse):**
```typescript
function useTodayWorkout() {
  const [workout, setWorkout] = useState(null);
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayWorkout();
  }, []);

  const fetchTodayWorkout = async () => {
    // API call logic
  };

  return { workout, log, loading, refetch: fetchTodayWorkout };
}
```

## Folder Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── openai.ts
│   │   └── environment.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── WorkoutTemplate.ts
│   │   ├── WorkoutLog.ts
│   │   ├── BodyMetrics.ts
│   │   ├── Accountability.ts
│   │   └── SharedAccess.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── plans.routes.ts
│   │   ├── workouts.routes.ts
│   │   ├── metrics.routes.ts
│   │   ├── accountability.routes.ts
│   │   ├── share.routes.ts
│   │   └── ai.routes.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── plans.controller.ts
│   │   ├── workouts.controller.ts
│   │   ├── metrics.controller.ts
│   │   ├── accountability.controller.ts
│   │   └── share.controller.ts
│   │
│   ├── services/
│   │   ├── ai.service.ts
│   │   ├── workout.service.ts
│   │   ├── metrics.service.ts
│   │   ├── accountability.service.ts
│   │   ├── notification.service.ts
│   │   └── share.service.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── rateLimit.middleware.ts
│   │
│   ├── utils/
│   │   ├── bodyComposition.util.ts
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   ├── logger.util.ts
│   │   └── validation.util.ts
│   │
│   ├── types/
│   │   ├── api.types.ts
│   │   ├── models.types.ts
│   │   └── shared.types.ts
│   │
│   ├── cron/
│   │   ├── missedWorkouts.cron.ts
│   │   ├── streakUpdate.cron.ts
│   │   └── notifications.cron.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   └── OnboardingFlow/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── TodayWorkoutCard.tsx
│   │   │   ├── WeeklyStatsCard.tsx
│   │   │   └── StreakCard.tsx
│   │   │
│   │   ├── workouts/
│   │   │   ├── WorkoutLogPage.tsx
│   │   │   ├── ExerciseLogger.tsx
│   │   │   ├── WorkoutHistory.tsx
│   │   │   └── WorkoutStats.tsx
│   │   │
│   │   ├── plans/
│   │   ├── metrics/
│   │   ├── accountability/
│   │   ├── settings/
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   │
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Input.tsx
│   │       ├── Chart.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTodayWorkout.ts
│   │   ├── useWorkoutLog.ts
│   │   ├── useMetrics.ts
│   │   └── useAccountability.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── workout.service.ts
│   │   ├── metrics.service.ts
│   │   └── plan.service.ts
│   │
│   ├── store/
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   ├── workoutSlice.ts
│   │   ├── metricsSlice.ts
│   │   └── uiSlice.ts
│   │
│   ├── types/
│   │   ├── models.ts
│   │   ├── api.ts
│   │   └── components.ts
│   │
│   ├── utils/
│   │   ├── date.ts
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── calculations.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── tailwind.config.js
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
│
├── public/
│   ├── icons/
│   └── images/
│
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## Technical Decisions & Rationale

### Technology Stack Choices

**Frontend: React + TypeScript**
- **Why React:** Mature ecosystem, excellent TypeScript support, component reusability
- **Why TypeScript:** Type safety prevents runtime errors, better IDE support, self-documenting code
- **Why Vite:** Fast dev server, optimized builds, modern tooling
- **Alternatives considered:** Vue (less mature TypeScript), Svelte (smaller ecosystem)

**Backend: Node.js + Express + TypeScript**
- **Why Node.js:** JavaScript everywhere (shared types with frontend), non-blocking I/O for API calls
- **Why Express:** Minimalist, well-documented, middleware ecosystem
- **Why TypeScript:** Same as frontend (consistency, safety)
- **Alternatives considered:** Python/FastAPI (slower development for solo dev), Go (steeper learning curve)

**Database: MongoDB**
- **Why MongoDB:** Flexible schema (fitness data varies), easy document nesting, JSON-native
- **Why Atlas:** Managed service (less ops burden), free tier suitable for MVP
- **Alternatives considered:** PostgreSQL (more rigid schema), Firebase (vendor lock-in)

**State Management: Zustand**
- **Why Zustand:** Simple API, TypeScript-first, minimal boilerplate
- **Alternatives considered:** Redux (too complex for app size), Context API (performance issues for frequent updates)

**Styling: Tailwind CSS**
- **Why Tailwind:** Rapid development, consistent design system, no CSS file management
- **Alternatives considered:** Styled Components (runtime cost), CSS Modules (more boilerplate)

**Charts: Recharts**
- **Why Recharts:** React-native API, composable, responsive
- **Alternatives considered:** Chart.js (imperative API), D3 (too complex for needs)

**AI: OpenAI GPT-4o**
- **Why OpenAI:** Best instruction-following, JSON mode, reliable
- **Why GPT-4o:** Faster than GPT-4, same quality for structured outputs
- **Alternatives considered:** Claude (excellent but slower response times), open-source models (quality insufficient)

### Deployment Strategy

**Hosting: Vercel (Frontend) + Render (Backend)**
- **Frontend on Vercel:** Zero-config React deployment, edge CDN, free SSL
- **Backend on Render:** Simple Node.js deployment, auto-scaling, managed databases
- **Alternatives considered:** AWS (too complex for solo dev), Heroku (more expensive), Railway (less mature)

**CI/CD:**
- GitHub Actions for automated testing
- Auto-deploy to staging on push to `develop`
- Manual promotion to production after validation

**Monitoring:**
- Sentry for error tracking (free tier)
- Uptime monitoring via healthchecks.io
- MongoDB Atlas built-in monitoring

### Security Architecture

**Authentication Flow:**
```
1. User submits email + password
2. Backend hashes password with bcrypt (12 rounds)
3. Compare with stored hash
4. Generate JWT with payload: { userId, email }
5. Sign with secret key (HS256)
6. Return token to client
7. Client stores in localStorage (httpOnly cookie in production)
8. Include in Authorization header for subsequent requests
9. Backend validates signature and expiry on each request
```

**Authorization Strategy:**
- Role-based access control (RBAC) not needed (single-user initially)
- Ownership verification: `workout.user_id === req.user.id`
- Shared access: Check `shared_access` collection for permissions

**Data Encryption:**
- Passwords: bcrypt hashed (never stored plaintext)
- API keys: Environment variables only (never in code)
- HTTPS enforced (all traffic encrypted in transit)
- Database: Encryption at rest (MongoDB Atlas default)

**Input Sanitization:**
- All user inputs validated with Zod schemas
- SQL injection: N/A (MongoDB, but still validate)
- XSS prevention: React auto-escapes, Content-Security-Policy headers
- CSRF prevention: SameSite cookies, CORS configuration

### Performance Optimizations

**Frontend:**
- Code splitting by route (React.lazy)
- Image lazy loading (progress photos)
- Memoization for expensive calculations (useMemo, useCallback)
- Debounced form inputs (search, filters)

**Backend:**
- Database indexes on frequently queried fields
- Connection pooling (MongoDB driver default)
- Response caching for read-heavy endpoints (user profiles, plans)
- Pagination for large result sets (workout history)

**Network:**
- API response compression (gzip)
- CDN for static assets (Vercel Edge)
- HTTP/2 multiplexing

### Scalability Considerations

**Horizontal Scaling:**
- Stateless backend (can run multiple instances)
- Load balancer distribution (Render auto-scaling)
- Database sharding if >100k users (not needed for MVP)

**Vertical Scaling:**
- Database: MongoDB Atlas auto-scaling
- Backend: Render instance size upgradeable

**Cost Scaling:**
- Current: $0-50/month (10 users)
- 100 users: ~$100/month (larger Render instance, more storage)
- 1000 users: ~$500/month (dedicated infrastructure)
