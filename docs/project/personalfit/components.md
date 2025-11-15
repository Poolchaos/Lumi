# PersonalFit: Component Library

## Component Architecture

### Component Hierarchy

```
App.tsx
├── Router
│   ├── Public Routes
│   │   ├── LandingPage
│   │   ├── LoginPage
│   │   └── SignupPage
│   │
│   ├── Authenticated Routes (Protected by AuthGuard)
│   │   ├── DashboardLayout
│   │   │   ├── Sidebar (Desktop)
│   │   │   ├── BottomNav (Mobile)
│   │   │   └── Outlet (Page Content)
│   │   │
│   │   ├── DashboardPage
│   │   │   ├── TodayWorkoutCard
│   │   │   ├── StreakCard
│   │   │   ├── QuickStatsGrid
│   │   │   └── UpcomingPenaltiesCard
│   │   │
│   │   ├── WorkoutPages
│   │   │   ├── WorkoutListPage
│   │   │   ├── WorkoutLogPage
│   │   │   │   ├── ExerciseLogger
│   │   │   │   │   ├── SetLogger
│   │   │   │   │   ├── DifficultySlider
│   │   │   │   │   └── NotesInput
│   │   │   │   └── WorkoutSummary
│   │   │   └── WorkoutHistoryPage
│   │   │
│   │   ├── MetricsPages
│   │   │   ├── MetricsLogPage
│   │   │   │   ├── WeightInput
│   │   │   │   ├── MeasurementInputs
│   │   │   │   └── PhotoUpload
│   │   │   └── MetricsAnalyticsPage
│   │   │       ├── WeightChart
│   │   │       ├── BodyCompChart
│   │   │       └── MeasurementComparisonChart
│   │   │
│   │   ├── PlansPages
│   │   │   ├── PlansListPage
│   │   │   ├── PlanGeneratorPage
│   │   │   │   ├── GenerationForm
│   │   │   │   ├── LoadingState
│   │   │   │   └── PlanPreview
│   │   │   └── ManualPlanBuilderPage
│   │   │       ├── PlanEditorForm
│   │   │       ├── ExerciseSelector
│   │   │       └── WorkoutDayBuilder
│   │   │
│   │   ├── AccountabilityPage
│   │   │   ├── StreakDisplay
│   │   │   ├── PenaltiesTable
│   │   │   └── WeeklyProgressHeatmap
│   │   │
│   │   ├── SettingsPage
│   │   │   ├── ProfileForm
│   │   │   ├── DifficultySelector
│   │   │   ├── NotificationSettings
│   │   │   └── DangerZone
│   │   │
│   │   └── OnboardingPage
│   │       ├── ProgressIndicator
│   │       ├── StepBasicInfo
│   │       ├── StepFitnessBackground
│   │       ├── StepGoals
│   │       ├── StepConstraints
│   │       └── StepDifficulty
│   │
│   └── Shared Components (Used Across Pages)
│       ├── Button
│       ├── Input
│       ├── Select
│       ├── Modal
│       ├── Card
│       ├── Badge
│       ├── Spinner
│       ├── Toast
│       └── EmptyState
```

---

## Core Components

### Button

**Purpose:** Primary interactive element for actions across the app.

**Props:**
```typescript
interface ButtonProps {
  children: React.ReactNode; // Button text or content
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'; // Style variant
  size?: 'sm' | 'md' | 'lg'; // Size variant
  fullWidth?: boolean; // Stretch to full width
  disabled?: boolean; // Disable button
  loading?: boolean; // Show loading spinner
  icon?: React.ReactNode; // Icon element (before text)
  iconPosition?: 'left' | 'right'; // Icon placement
  onClick?: () => void; // Click handler
  type?: 'button' | 'submit' | 'reset'; // HTML button type
  className?: string; // Additional Tailwind classes
}
```

**Behavior:**
- Primary: Blue background, white text (CTA actions)
- Secondary: Gray background, dark text (Non-critical actions)
- Outline: Border only, transparent background (Tertiary actions)
- Ghost: No border, transparent background (Low-priority actions)
- Danger: Red background, white text (Destructive actions)
- Loading state: Spinner replaces text, button disabled
- Disabled state: Reduced opacity, cursor not-allowed

**Usage:**
```tsx
<Button variant="primary" size="lg" onClick={handleLogin}>
  Login
</Button>

<Button variant="danger" loading={isDeleting}>
  Delete Account
</Button>

<Button variant="outline" icon={<PlusIcon />} iconPosition="left">
  Add Exercise
</Button>
```

**Accessibility:**
- Focus ring on keyboard focus
- ARIA attributes for loading state
- Disabled buttons not focusable

---

### Input

**Purpose:** Text input for forms (email, password, name, numbers).

**Props:**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string; // Field label (above input)
  error?: string; // Validation error message
  disabled?: boolean;
  required?: boolean; // Show asterisk
  autoFocus?: boolean;
  icon?: React.ReactNode; // Icon inside input (left side)
  suffix?: React.ReactNode; // Suffix element (e.g., "kg" for weight)
  min?: number; // For type="number"
  max?: number;
  step?: number;
  className?: string;
}
```

**Behavior:**
- Error state: Red border, error message below
- Focus state: Blue border
- Disabled state: Gray background, reduced opacity
- Icon displayed inside input (left padding)
- Suffix displayed inside input (right side)

**Usage:**
```tsx
<Input
  type="email"
  label="Email Address"
  value={email}
  onChange={setEmail}
  placeholder="you@example.com"
  required
  error={emailError}
/>

<Input
  type="number"
  label="Weight"
  value={weight}
  onChange={setWeight}
  suffix="kg"
  min={30}
  max={300}
  step={0.1}
/>
```

**Accessibility:**
- Label linked to input (htmlFor)
- ARIA attributes for errors
- Required indicator in label

---

### Select

**Purpose:** Dropdown selection for predefined options.

**Props:**
```typescript
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  label?: string;
  placeholder?: string; // Default "Select..."
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}
```

**Behavior:**
- Dropdown opens on click
- Keyboard navigation (arrow keys)
- Error state: Red border, error message below
- Selected value displayed in select button

**Usage:**
```tsx
<Select
  label="Gender"
  value={gender}
  onChange={setGender}
  options={[
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ]}
  required
/>
```

**Accessibility:**
- ARIA attributes for expanded/collapsed state
- Keyboard navigation (arrow keys, enter, escape)

---

### Card

**Purpose:** Container for grouped content (dashboard cards, workout cards).

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;
  title?: string; // Card title (top of card)
  subtitle?: string; // Subtitle (below title)
  headerActions?: React.ReactNode; // Actions in header (e.g., edit icon)
  footer?: React.ReactNode; // Footer content (bottom of card)
  variant?: 'default' | 'flat' | 'bordered';
  className?: string;
  onClick?: () => void; // Make card clickable
}
```

**Behavior:**
- Default: White background, shadow
- Flat: White background, no shadow
- Bordered: White background, border, no shadow
- Clickable: Hover effect, cursor pointer

**Usage:**
```tsx
<Card title="Today's Workout" subtitle="Chest & Triceps">
  <p>4 exercises, 60 minutes</p>
</Card>

<Card
  title="Streak"
  headerActions={<InfoIcon />}
  footer={<Button>View Details</Button>}
>
  <h2>13 Days</h2>
</Card>
```

**Accessibility:**
- Semantic HTML (header, main, footer)
- Clickable cards: Button wrapper with ARIA

---

### Modal

**Purpose:** Overlay dialog for confirmations, forms, details.

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean; // Control visibility
  onClose: () => void; // Close handler
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode; // Footer content (actions)
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Modal width
  closeOnOverlayClick?: boolean; // Default: true
  closeOnEsc?: boolean; // Default: true
  className?: string;
}
```

**Behavior:**
- Overlay darkens background
- Modal centered on screen
- Close on overlay click (optional)
- Close on ESC key (optional)
- Traps focus inside modal
- Body scroll locked when open

**Usage:**
```tsx
<Modal
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  title="Delete Account"
  size="sm"
  footer={
    <>
      <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
>
  <p>This action cannot be undone. All your data will be permanently deleted.</p>
</Modal>
```

**Accessibility:**
- Focus trap (focus stays inside modal)
- ARIA role="dialog"
- ARIA-labelledby for title
- Close button with ARIA label

---

### Badge

**Purpose:** Status indicators, tags, labels.

**Props:**
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}
```

**Behavior:**
- Default: Gray background
- Success: Green background (e.g., "Active")
- Warning: Orange background (e.g., "Pending")
- Danger: Red background (e.g., "Overdue")
- Info: Blue background (e.g., "New")

**Usage:**
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="danger">Overdue</Badge>
<Badge variant="info">AI-Generated</Badge>
```

---

### Spinner

**Purpose:** Loading indicator for async operations.

**Props:**
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}
```

**Behavior:**
- Rotating animation (infinite)
- Size variants: 16px, 24px, 48px

**Usage:**
```tsx
<Spinner size="lg" color="primary" />

{loading && <Spinner />}
```

**Accessibility:**
- ARIA role="status"
- ARIA-live="polite"

---

### Toast

**Purpose:** Temporary notifications (success, error, info).

**Props:**
```typescript
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // Auto-dismiss time (ms), default 3000
  onClose?: () => void;
}
```

**Behavior:**
- Slide in from top-right
- Auto-dismiss after duration
- Close button (X)
- Stack multiple toasts vertically

**Usage:**
```tsx
// Use via context/store
const { addToast } = useToast();

addToast({ message: 'Workout logged!', type: 'success' });
addToast({ message: 'Failed to save', type: 'error', duration: 5000 });
```

**Implementation:**
```tsx
// ToastContainer (in App.tsx)
<ToastContainer />

// Individual toast
<Toast
  message="Workout logged!"
  type="success"
  onClose={() => removeToast(id)}
/>
```

**Accessibility:**
- ARIA role="alert"
- ARIA-live="assertive" for errors

---

## Page Components

### DashboardPage

**Purpose:** Main landing page after login.

**Props:** None (uses global state)

**Subcomponents:**
- TodayWorkoutCard: Displays today's scheduled workout
- StreakCard: Current streak + longest streak
- QuickStatsGrid: Weekly stats (workouts completed, volume, avg duration)
- UpcomingPenaltiesCard: Pending penalties (if any)

**Behavior:**
- Fetches today's workout on mount
- Displays "Rest Day" if no workout scheduled
- Displays "No Active Plan" if user has no plan
- Quick actions: "Start Workout", "View Plan", "Log Metrics"

**Usage:**
```tsx
<DashboardPage />
```

**Data Flow:**
- Fetch GET /api/v1/workouts/today
- Fetch GET /api/v1/accountability
- Display data in cards

---

### TodayWorkoutCard

**Purpose:** Show today's scheduled workout with quick actions.

**Props:**
```typescript
interface TodayWorkoutCardProps {
  workout: {
    name: string;
    exercises: Array<{ name: string; sets: number; reps: string }>;
    estimated_duration_minutes: number;
  } | null;
  log: {
    completed: boolean;
    completion_time_minutes: number;
  } | null;
}
```

**Behavior:**
- If workout && !log: Show [Start Workout] button
- If workout && log: Show "Completed" badge + [View Details]
- If !workout: Show "Rest Day" message

**Usage:**
```tsx
<TodayWorkoutCard workout={todayWorkout} log={todayLog} />
```

---

### StreakCard

**Purpose:** Display current streak and longest streak.

**Props:**
```typescript
interface StreakCardProps {
  current_streak_days: number;
  longest_streak_days: number;
}
```

**Behavior:**
- Large number for current streak
- Small text for longest streak
- Fire icon if streak > 0

**Usage:**
```tsx
<StreakCard current_streak_days={13} longest_streak_days={21} />
```

---

### WorkoutLogPage

**Purpose:** Exercise-by-exercise workout logging interface.

**Props:**
```typescript
interface WorkoutLogPageProps {
  date: string; // ISO date
}
```

**Subcomponents:**
- ExerciseLogger: Logs sets for single exercise
- SetLogger: Logs individual set (weight, reps)
- DifficultySlider: Perceived difficulty (1-10)
- NotesInput: Free-form notes per exercise
- WorkoutSummary: Final summary before submission

**Behavior:**
- Loads scheduled workout for date
- Steps through exercises one-by-one
- Tracks completion progress (e.g., "Exercise 2 of 5")
- [Next Exercise] button after all sets logged
- Final [Complete Workout] submits data

**Usage:**
```tsx
<WorkoutLogPage date="2024-12-16" />
```

**Data Flow:**
- Fetch GET /api/v1/workouts/scheduled?date=2024-12-16
- Local state: Accumulate sets/reps/notes
- Submit POST /api/v1/workouts/log on completion

---

### ExerciseLogger

**Purpose:** Log all sets for a single exercise.

**Props:**
```typescript
interface ExerciseLoggerProps {
  exercise: {
    name: string;
    target_sets: number;
    target_reps: string;
    rest_seconds: number;
    notes: string;
  };
  onComplete: (data: {
    reps_per_set: number[];
    weight_used_kg: number[];
    perceived_difficulty: number;
    notes: string;
    skipped: boolean;
  }) => void;
}
```

**Behavior:**
- Displays exercise name, target sets/reps
- Provides inputs for each set
- Rest timer starts after each set
- [Skip Exercise] button
- [Complete Exercise] after all sets logged

**Usage:**
```tsx
<ExerciseLogger
  exercise={{
    name: 'Barbell Bench Press',
    target_sets: 4,
    target_reps: '6-8',
    rest_seconds: 120,
    notes: 'Focus on form'
  }}
  onComplete={handleExerciseComplete}
/>
```

---

### SetLogger

**Purpose:** Log single set (weight, reps).

**Props:**
```typescript
interface SetLoggerProps {
  setNumber: number;
  targetReps: string;
  onSave: (data: { weight_kg: number; reps: number }) => void;
}
```

**Behavior:**
- Two inputs: Weight (kg), Reps
- [Save Set] button
- Prefills weight from previous set (if available)
- Displays target reps for reference

**Usage:**
```tsx
<SetLogger
  setNumber={1}
  targetReps="6-8"
  onSave={({ weight_kg, reps }) => {
    weights.push(weight_kg);
    reps_per_set.push(reps);
  }}
/>
```

---

### DifficultySlider

**Purpose:** Perceived exertion slider (1-10).

**Props:**
```typescript
interface DifficultySliderProps {
  value: number;
  onChange: (value: number) => void;
}
```

**Behavior:**
- Slider from 1 (Too Easy) to 10 (Too Hard)
- Labels at key points: 1=Too Easy, 5=Moderate, 10=Too Hard
- Visual feedback (color changes with difficulty)

**Usage:**
```tsx
<DifficultySlider value={difficulty} onChange={setDifficulty} />
```

---

### MetricsLogPage

**Purpose:** Log body metrics (weight, measurements, photos).

**Props:** None

**Subcomponents:**
- WeightInput: Weight input (kg)
- MeasurementInputs: Chest, waist, arm, leg measurements
- PhotoUpload: Progress photo uploader

**Behavior:**
- Date picker (defaults to today)
- Optional fields (user can skip measurements)
- Photo upload with preview
- [Save Metrics] button

**Usage:**
```tsx
<MetricsLogPage />
```

**Data Flow:**
- Submit POST /api/v1/metrics/log (weight, measurements, notes)
- If photo: POST /api/v1/metrics/upload-photo first, then include photo_url

---

### PhotoUpload

**Purpose:** Upload progress photos.

**Props:**
```typescript
interface PhotoUploadProps {
  onUpload: (url: string) => void;
}
```

**Behavior:**
- Click to select image
- Preview thumbnail
- Upload on selection
- Show loading spinner during upload
- Return photo_url on success

**Usage:**
```tsx
<PhotoUpload onUpload={(url) => setPhotoUrl(url)} />
```

**Implementation:**
```tsx
const handleFileSelect = async (file: File) => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch('/api/v1/metrics/upload-photo', {
    method: 'POST',
    body: formData
  });

  const { photo_url } = await response.json();
  onUpload(photo_url);
};
```

---

### MetricsAnalyticsPage

**Purpose:** Visualize body metrics over time.

**Props:** None

**Subcomponents:**
- WeightChart: Line chart (weight over time)
- BodyCompChart: Multi-line chart (weight + body fat %)
- MeasurementComparisonChart: Bar chart (measurements over time)

**Behavior:**
- Time range selector (1 month, 3 months, 6 months, All)
- Fetches metrics based on time range
- Displays charts with Recharts

**Usage:**
```tsx
<MetricsAnalyticsPage />
```

**Data Flow:**
- Fetch GET /api/v1/metrics/timeline?start=...&end=...
- Transform data for charts
- Render with Recharts

---

### WeightChart

**Purpose:** Line chart for weight over time.

**Props:**
```typescript
interface WeightChartProps {
  data: Array<{ date: string; weight_kg: number }>;
}
```

**Behavior:**
- X-axis: Dates
- Y-axis: Weight (kg)
- Tooltip on hover
- Trend line (linear regression)

**Usage:**
```tsx
<WeightChart data={weightData} />
```

**Implementation (Recharts):**
```tsx
<LineChart data={data} width={600} height={300}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="weight_kg" stroke="#3b82f6" />
</LineChart>
```

---

### PlanGeneratorPage

**Purpose:** AI plan generation interface.

**Props:** None

**Subcomponents:**
- GenerationForm: Input for plan parameters
- LoadingState: AI generation in progress
- PlanPreview: Display generated plan with rationale

**Behavior:**
- User fills form (training phase, duration, focus areas)
- [Generate Plan] → Loading state (10-15 seconds)
- Plan preview displayed
- [Accept] [Regenerate] [Edit] [Cancel] actions

**Usage:**
```tsx
<PlanGeneratorPage />
```

**Data Flow:**
- Submit POST /api/v1/ai/generate-plan
- Display loading spinner
- Receive plan + rationale
- User accepts → PUT /api/v1/plans/:id/activate

---

### GenerationForm

**Purpose:** Collect parameters for AI plan generation.

**Props:**
```typescript
interface GenerationFormProps {
  onSubmit: (params: {
    training_phase: string;
    duration_weeks: number;
    focus_areas: string[];
    difficulty_override: string | null;
  }) => void;
}
```

**Behavior:**
- Select: Training phase (strength, hypertrophy, endurance, cutting)
- Number input: Duration (4-16 weeks)
- Multi-select: Focus areas (full body, upper, lower, arms, core)
- Select: Difficulty override (optional)
- [Generate Plan] button

**Usage:**
```tsx
<GenerationForm onSubmit={handleGenerate} />
```

---

### PlanPreview

**Purpose:** Display AI-generated plan with rationale.

**Props:**
```typescript
interface PlanPreviewProps {
  plan: {
    name: string;
    workouts: Array<{
      day_of_week: number;
      name: string;
      exercises: Array<{ name: string; sets: number; reps: string }>;
    }>;
    nutrition: {
      calories_target: number;
      macros: { protein_g: number; carbs_g: number; fat_g: number };
    };
    rationale: string;
  };
  onAccept: () => void;
  onRegenerate: () => void;
  onEdit: () => void;
  onCancel: () => void;
}
```

**Behavior:**
- Displays workout schedule (accordion per day)
- Displays nutrition plan
- Displays rationale (collapsible)
- Action buttons at bottom

**Usage:**
```tsx
<PlanPreview
  plan={generatedPlan}
  onAccept={activatePlan}
  onRegenerate={regeneratePlan}
  onEdit={editPlan}
  onCancel={() => navigate('/plans')}
/>
```

---

### OnboardingPage

**Purpose:** Multi-step onboarding flow.

**Props:** None

**Subcomponents:**
- ProgressIndicator: Step progress (1/5, 2/5, etc.)
- StepBasicInfo: Name, age, gender, height, weight
- StepFitnessBackground: Years training, frequency, level
- StepGoals: Goal selection (multi-select)
- StepConstraints: Equipment, time, preferences
- StepDifficulty: Difficulty mode selection

**Behavior:**
- Step-by-step wizard (5 steps)
- [Next] button (validates current step)
- [Back] button (returns to previous step)
- Final step: [Complete Onboarding] submits data
- Redirect to /dashboard on completion

**Usage:**
```tsx
<OnboardingPage />
```

**Data Flow:**
- Local state: Accumulate data across steps
- Submit POST /api/v1/profiles on final step

---

### ProgressIndicator

**Purpose:** Visual progress through multi-step flow.

**Props:**
```typescript
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}
```

**Behavior:**
- Progress bar (filled based on currentStep)
- Step numbers (1, 2, 3, 4, 5)
- Current step highlighted

**Usage:**
```tsx
<ProgressIndicator currentStep={3} totalSteps={5} />
```

---

### StepBasicInfo

**Purpose:** Collect basic profile info.

**Props:**
```typescript
interface StepBasicInfoProps {
  data: {
    name: string;
    age: number;
    gender: string;
    height_cm: number;
    current_weight_kg: number;
  };
  onChange: (data: Partial<StepBasicInfoProps['data']>) => void;
  onNext: () => void;
}
```

**Behavior:**
- Input: Name
- Number input: Age (16-100)
- Select: Gender (Male, Female, Other)
- Number input: Height (cm)
- Number input: Weight (kg)
- [Next] button (validates all fields)

**Usage:**
```tsx
<StepBasicInfo
  data={basicInfo}
  onChange={(updates) => setBasicInfo({ ...basicInfo, ...updates })}
  onNext={() => setStep(2)}
/>
```

---

### AccountabilityPage

**Purpose:** View streaks, penalties, progress.

**Props:** None

**Subcomponents:**
- StreakDisplay: Current + longest streak
- PenaltiesTable: Active penalties with status
- WeeklyProgressHeatmap: Workout completion calendar

**Behavior:**
- Displays current accountability status
- Lists active penalties (due date, description, status)
- [Complete Penalty] button (marks penalty complete)
- Heatmap shows last 12 weeks (green=completed, red=missed)

**Usage:**
```tsx
<AccountabilityPage />
```

**Data Flow:**
- Fetch GET /api/v1/accountability
- Display penalties table
- POST /api/v1/accountability/penalties/:id/complete on penalty completion

---

### PenaltiesTable

**Purpose:** List active penalties.

**Props:**
```typescript
interface PenaltiesTableProps {
  penalties: Array<{
    penalty_id: string;
    reason: string;
    penalty_type: string;
    description: string;
    due_by: number; // timestamp
    completed: boolean;
  }>;
  onComplete: (penalty_id: string) => void;
}
```

**Behavior:**
- Table: Reason, Description, Due By, Status, Actions
- Status badge: "Active" (orange), "Overdue" (red), "Completed" (green)
- [Complete] button (only for active penalties)

**Usage:**
```tsx
<PenaltiesTable
  penalties={activePenalties}
  onComplete={(id) => completePenalty(id)}
/>
```

---

### WeeklyProgressHeatmap

**Purpose:** Calendar heatmap of workout completion.

**Props:**
```typescript
interface WeeklyProgressHeatmapProps {
  data: Array<{
    date: string; // ISO date
    completed: boolean;
  }>;
}
```

**Behavior:**
- Grid: 7 columns (days) × 12 rows (weeks)
- Green cell: Workout completed
- Red cell: Workout missed
- Gray cell: Rest day or no scheduled workout
- Tooltip on hover: Date + status

**Usage:**
```tsx
<WeeklyProgressHeatmap data={last12Weeks} />
```

**Implementation:**
```tsx
// Use library like react-calendar-heatmap
<CalendarHeatmap
  startDate={new Date('2024-09-01')}
  endDate={new Date('2024-12-16')}
  values={data}
  classForValue={(value) => {
    if (!value) return 'color-empty';
    return value.completed ? 'color-completed' : 'color-missed';
  }}
/>
```

---

## Layout Components

### DashboardLayout

**Purpose:** Persistent layout for authenticated pages.

**Props:**
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode; // Page content
}
```

**Behavior:**
- Desktop: Sidebar on left, content on right
- Mobile: Bottom navigation, content full-width
- Sidebar/BottomNav always visible

**Usage:**
```tsx
<DashboardLayout>
  <DashboardPage />
</DashboardLayout>
```

**Implementation:**
```tsx
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:block" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav className="md:hidden" />
    </div>
  );
};
```

---

### Sidebar

**Purpose:** Desktop navigation menu.

**Props:** None

**Behavior:**
- Vertical list of nav links
- Active link highlighted
- Icons + labels
- User profile at bottom

**Usage:**
```tsx
<Sidebar />
```

**Implementation:**
```tsx
const Sidebar = () => {
  return (
    <nav className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">PersonalFit</h1>
      </div>

      <div className="flex-1 space-y-2 p-4">
        <NavLink to="/dashboard" icon={<HomeIcon />} label="Dashboard" />
        <NavLink to="/workouts" icon={<DumbbellIcon />} label="Workouts" />
        <NavLink to="/metrics" icon={<ChartIcon />} label="Metrics" />
        <NavLink to="/plans" icon={<CalendarIcon />} label="Plans" />
        <NavLink to="/accountability" icon={<TargetIcon />} label="Accountability" />
        <NavLink to="/settings" icon={<SettingsIcon />} label="Settings" />
      </div>

      <UserProfile />
    </nav>
  );
};
```

---

### BottomNav

**Purpose:** Mobile navigation menu.

**Props:** None

**Behavior:**
- Fixed at bottom of screen
- Icons only (no labels)
- Active icon highlighted

**Usage:**
```tsx
<BottomNav />
```

**Implementation:**
```tsx
const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
      <NavIconLink to="/dashboard" icon={<HomeIcon />} />
      <NavIconLink to="/workouts" icon={<DumbbellIcon />} />
      <NavIconLink to="/metrics" icon={<ChartIcon />} />
      <NavIconLink to="/plans" icon={<CalendarIcon />} />
      <NavIconLink to="/settings" icon={<SettingsIcon />} />
    </nav>
  );
};
```

---

### NavLink

**Purpose:** Navigation link (sidebar).

**Props:**
```typescript
interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}
```

**Behavior:**
- Active state: Blue background
- Inactive state: Transparent background
- Hover state: Gray background

**Usage:**
```tsx
<NavLink to="/dashboard" icon={<HomeIcon />} label="Dashboard" />
```

**Implementation:**
```tsx
const NavLink = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded ${
        isActive ? 'bg-blue-600' : 'hover:bg-gray-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
```

---

## Utility Components

### EmptyState

**Purpose:** Display when no data available.

**Props:**
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Behavior:**
- Centered content
- Large icon (if provided)
- Title + description
- Optional CTA button

**Usage:**
```tsx
<EmptyState
  icon={<CalendarIcon />}
  title="No Active Plan"
  description="Generate an AI plan or build your own to get started."
  action={{
    label: 'Generate Plan',
    onClick: () => navigate('/plans/generate')
  }}
/>
```

---

### ErrorBoundary

**Purpose:** Catch React errors and display fallback UI.

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Custom error UI
}
```

**Behavior:**
- Wraps component tree
- Catches errors in children
- Displays fallback UI or default error message
- Logs error to console (or error tracking service)

**Usage:**
```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Implementation:**
```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h1>Something went wrong</h1>
          <p>Please refresh the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Reusability Guidelines

### Composition Over Props Drilling

**Bad:**
```tsx
<WorkoutLogPage
  userId={userId}
  workout={workout}
  onSave={onSave}
  onCancel={onCancel}
  theme={theme}
  locale={locale}
/>
```

**Good:**
```tsx
// Use context for shared state
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
    <WorkoutLogPage workout={workout} onSave={onSave} />
  </ThemeContext.Provider>
</UserContext.Provider>
```

---

### Extract Reusable Logic into Hooks

**Example: useWorkoutLog**
```tsx
const useWorkoutLog = (date: string) => {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkout(date)
      .then(setWorkout)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [date]);

  const saveLog = async (logData) => {
    await api.post('/workouts/log', logData);
  };

  return { workout, loading, error, saveLog };
};

// Usage
const WorkoutLogPage = ({ date }) => {
  const { workout, loading, saveLog } = useWorkoutLog(date);

  if (loading) return <Spinner />;

  return <ExerciseLogger workout={workout} onSave={saveLog} />;
};
```

---

### Component Variants Over Separate Components

**Bad:**
```tsx
<PrimaryButton>Save</PrimaryButton>
<SecondaryButton>Cancel</SecondaryButton>
<DangerButton>Delete</DangerButton>
```

**Good:**
```tsx
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
```

---

### Controlled vs Uncontrolled Components

**Controlled (Recommended):**
```tsx
// Parent manages state
const [value, setValue] = useState('');

<Input value={value} onChange={setValue} />
```

**Uncontrolled (Use sparingly):**
```tsx
// Component manages own state
const inputRef = useRef();

<input ref={inputRef} />

// Access value via inputRef.current.value
```

**Guideline:** Prefer controlled components for forms. Use uncontrolled for performance-critical inputs (e.g., search with debounce).

---

### Conditional Rendering Patterns

**If-Else:**
```tsx
{isLoading ? <Spinner /> : <Content />}
```

**Null Check:**
```tsx
{user && <UserProfile user={user} />}
```

**Multiple Conditions:**
```tsx
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataTable data={data} />}
```

---

### Component Testing Strategy

**Unit Tests (Vitest + React Testing Library):**
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  screen.getByText('Click').click();
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

**Integration Tests:**
```tsx
test('workout log flow', async () => {
  render(<WorkoutLogPage date="2024-12-16" />);

  // Wait for workout to load
  await screen.findByText('Barbell Bench Press');

  // Log set 1
  userEvent.type(screen.getByLabelText('Weight (kg)'), '70');
  userEvent.type(screen.getByLabelText('Reps'), '8');
  userEvent.click(screen.getByText('Save Set'));

  // Complete exercise
  userEvent.click(screen.getByText('Complete Exercise'));

  // Verify next exercise displayed
  expect(screen.getByText('Incline Dumbbell Press')).toBeInTheDocument();
});
```

---

## Component File Structure

```
src/
├── components/
│   ├── ui/                   # Core reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   ├── Toast.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── layout/               # Layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   └── NavLink.tsx
│   │
│   ├── workouts/             # Workout-specific components
│   │   ├── TodayWorkoutCard.tsx
│   │   ├── ExerciseLogger.tsx
│   │   ├── SetLogger.tsx
│   │   ├── DifficultySlider.tsx
│   │   └── WorkoutSummary.tsx
│   │
│   ├── metrics/              # Metrics-specific components
│   │   ├── WeightInput.tsx
│   │   ├── MeasurementInputs.tsx
│   │   ├── PhotoUpload.tsx
│   │   ├── WeightChart.tsx
│   │   └── BodyCompChart.tsx
│   │
│   ├── plans/                # Plan-specific components
│   │   ├── GenerationForm.tsx
│   │   ├── PlanPreview.tsx
│   │   ├── ExerciseSelector.tsx
│   │   └── WorkoutDayBuilder.tsx
│   │
│   ├── accountability/       # Accountability-specific components
│   │   ├── StreakCard.tsx
│   │   ├── StreakDisplay.tsx
│   │   ├── PenaltiesTable.tsx
│   │   └── WeeklyProgressHeatmap.tsx
│   │
│   └── onboarding/           # Onboarding-specific components
│       ├── ProgressIndicator.tsx
│       ├── StepBasicInfo.tsx
│       ├── StepFitnessBackground.tsx
│       ├── StepGoals.tsx
│       ├── StepConstraints.tsx
│       └── StepDifficulty.tsx
│
├── pages/                    # Page components (route handlers)
│   ├── DashboardPage.tsx
│   ├── WorkoutListPage.tsx
│   ├── WorkoutLogPage.tsx
│   ├── WorkoutHistoryPage.tsx
│   ├── MetricsLogPage.tsx
│   ├── MetricsAnalyticsPage.tsx
│   ├── PlansListPage.tsx
│   ├── PlanGeneratorPage.tsx
│   ├── ManualPlanBuilderPage.tsx
│   ├── AccountabilityPage.tsx
│   ├── SettingsPage.tsx
│   ├── OnboardingPage.tsx
│   ├── LoginPage.tsx
│   └── SignupPage.tsx
│
└── hooks/                    # Custom hooks
    ├── useAuth.ts
    ├── useWorkoutLog.ts
    ├── useMetrics.ts
    ├── usePlans.ts
    ├── useAccountability.ts
    └── useToast.ts
```

---

## Props Naming Conventions

**Boolean Props:**
- Prefix with `is`, `has`, `should`, `can`
- Examples: `isLoading`, `hasError`, `shouldValidate`, `canEdit`

**Event Handlers:**
- Prefix with `on`
- Examples: `onClick`, `onChange`, `onSubmit`, `onClose`

**Callback Props:**
- Describe what happens when called
- Examples: `onSave`, `onComplete`, `onDelete`

**Data Props:**
- Singular for single item, plural for arrays
- Examples: `user`, `users`, `workout`, `workouts`

**Style Props:**
- Use `className` (not `class`)
- Optional `style` object for inline styles

---

## Accessibility Checklist

**Keyboard Navigation:**
- All interactive elements focusable (buttons, links, inputs)
- Focus visible (outline on focus)
- Tab order logical (top-to-bottom, left-to-right)
- Escape closes modals

**Screen Readers:**
- ARIA labels for icons without text
- ARIA-live regions for dynamic content (toasts, loading states)
- Semantic HTML (header, nav, main, footer, article, section)

**Touch Targets:**
- Minimum 44×44px for all buttons/links
- Adequate spacing between targets

**Color Contrast:**
- WCAG AA compliance (4.5:1 for text, 3:1 for UI elements)
- Do not rely on color alone (use icons/text)

**Forms:**
- Labels linked to inputs
- Error messages associated with inputs (ARIA-describedby)
- Required fields indicated (asterisk + ARIA-required)
