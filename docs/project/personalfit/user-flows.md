# PersonalFit: User Flows

## Complete User Journey Maps

### New User Journey (Days 1-30)

**Day 1: Discovery & Signup**
```
User hears about PersonalFit (personal invitation)
  ↓
Visits landing page or signup link
  ↓
Clicks [Sign Up]
  ↓
Enters email + password
  ↓
Account created → Auto-login → JWT token issued
  ↓
Redirected to onboarding flow (5 steps)
```

**Day 1: Onboarding (15-20 minutes)**
```
Step 1: Basic Info
- Enter name, age, gender
- Enter height and current weight
- Select measurement units (metric/imperial)
[Next]

Step 2: Fitness Background
- Slider: Years training (0-10+)
- Slider: Current training frequency (0-7 days/week)
- Dropdown: Fitness level (Beginner/Intermediate/Advanced)
[Next]

Step 3: Goals (Multi-select)
- Checkboxes: Lose belly fat, Gain muscle, Build arms, etc.
- Minimum 1, maximum 5 goals
- Visual feedback: "X goals selected"
[Next]

Step 4: Constraints & Equipment
- Multi-select: Injuries (knee pain, back issues, etc.)
- Multi-select: Equipment (gym, dumbbells, barbell, bodyweight)
- Dropdown: Time per session (15/30/45/60/90+ min)
- Dropdown: Preferred style (Weightlifting/Calisthenics/Cardio/Mixed)
[Next]

Step 5: Difficulty Selection
- Visual cards for each mode with descriptions
- Easy: "Supportive, flexible, light accountability"
- Medium: "Balanced expectations, moderate consequences"
- Sergeant: "Strict discipline, no excuses" [Recommended]
- Beast: "Maximum intensity, brutal accountability"
- User selects one
[Complete Setup]

Profile saved → Redirected to Dashboard
  ↓
Welcome message: "Profile complete! Ready to generate your first plan?"
  ↓
Large CTA: [Generate First Plan]
```

**Day 1: First Plan Generation (5-10 minutes)**
```
User clicks [Generate First Plan]
  ↓
Form displayed:
- Training Phase: Hypertrophy (pre-selected based on goals)
- Duration: 4 weeks (recommended for first plan)
- Focus Areas: Auto-selected based on goals (editable)
- Difficulty: Current setting (editable)
[Generate Plan]
  ↓
Loading screen (AI processing 5-10s)
"AI is creating your personalized plan..."
  ↓
Plan displayed:
- Weekly schedule overview
- Exercise list (expandable)
- Nutrition targets
- AI rationale
  ↓
User reviews → [Accept Plan]
  ↓
Plan activated → First workout scheduled
  ↓
Success message: "Plan activated! First workout: Monday at 07:00"
  ↓
Dashboard now shows today's (or next scheduled) workout
```

**Days 2-7: First Week Usage**
```
Monday Morning:
- User opens app
- Dashboard shows: "Today: Chest & Triceps"
- Clicks [Start Workout]
- Logs each exercise (sets, reps, weight)
- Marks workout complete
- Streak: 1 day

Wednesday:
- Repeats workout logging
- Streak: 3 days (Mon + Wed, Tue was rest)

Friday:
- User misses workout (forgets or busy)
- System detects miss at midnight
- Penalty assigned: "Extra 30min cardio"
- Streak maintains (grace period logic)

Sunday:
- User logs workout + penalty cardio
- Completes penalty
- Week status: 3/4 workouts (75%)
```

**Days 8-30: Habit Formation**
```
Week 2:
- User logs weight and measurements
- Sees first progress comparison
- Continues workout routine
- Streak grows to 14 days (milestone badge)

Week 3:
- User explores charts (weight trend, volume progression)
- Adjusts difficulty (Easy → Medium) to increase challenge
- Invites training partner (shares access)

Week 4:
- Plan completion approaching
- System prompts: "Plan ends in 1 week. Generate next plan?"
- User generates 8-week plan (increased confidence)
- 30-day streak achieved (major milestone)
```

### Returning User Journey (Daily Flow)

**Morning Routine (7:00 AM)**
```
Notification: "Time to train! Today: Back & Biceps"
  ↓
User opens app (notification tap or manual)
  ↓
Dashboard shows:
- Today's Workout card (hero)
- Streak: X days
- Weekly status: Y/Z workouts
  ↓
User clicks [Start Workout] or [View Details]
  ↓
Workout logging page opens
```

**During Workout (60-90 minutes)**
```
User in gym with phone
  ↓
Exercise 1: Deadlift
- Reads target: 3×5, 180s rest
- Performs set 1 → Logs: 100kg × 5 reps → Taps [✓]
- Rest timer starts (180s countdown)
- Performs sets 2-3, logs each
- Slides difficulty: 7/10
- Adds note: "Form felt solid"
  ↓
Exercise 2-6: Repeat process
  ↓
All exercises complete
- Taps [Complete Workout]
- Modal: "Total time: 68 min, Volume: 9,200kg"
- Confirms → [Save & Finish]
```

**Post-Workout (Immediate)**
```
Success screen:
"Workout Complete! 🔥"
- Streak: 15 days (+1)
- Volume: 9,200kg (new personal record)
- [View Stats] [Back to Dashboard]
  ↓
User returns to dashboard
- Today's Workout card: ✓ Completed
- Streak updated
- Weekly status: 3/4 workouts
```

**Evening (Before Bed)**
```
User logs body metrics (weekly ritual)
  ↓
Navigates to Metrics > Log Entry
  ↓
Enters:
- Weight: 84.5kg (down 0.5kg from last week)
- Waist: 86cm (down 1cm)
- Arm: 35.3cm (up 0.1cm)
  ↓
Uploads progress photo
  ↓
Saves entry
  ↓
System calculates trends:
"You've lost 0.5kg fat while maintaining muscle. Excellent!"
```

**Weekly Routine (Sunday Evening)**
```
User reviews weekly accountability
  ↓
Navigates to Accountability
  ↓
Views report:
- 4/4 workouts complete (100%)
- Streak: 21 days
- No penalties
- Message: "Perfect week! Sergeant is proud. 💪"
  ↓
Plans next week
- Reviews upcoming workouts
- Adjusts schedule if needed (manual reschedule)
```

## Onboarding Flow (Detailed)

### Step 1: Basic Information

**Objective:** Collect foundational demographic and physical data

**UI Layout:**
```
[Progress: 1/5]

Welcome to PersonalFit!
Let's set up your profile.

Name: [Text input]
Age: [Number input, 16-100]
Gender:
  ○ Male  ○ Female  ○ Other

Height: [Number input] [cm ▾]
Current Weight: [Number input] [kg ▾]

[Next]
```

**Validation:**
- Name: Required, 2-50 characters
- Age: Required, 16-100
- Gender: Required
- Height: Required, 100-250cm or 3'0"-8'0"
- Weight: Required, 30-300kg or 66-660lbs

**Error Handling:**
- Inline validation on blur
- Red text below invalid fields
- Submit disabled until valid

### Step 2: Fitness Background

**Objective:** Assess current fitness level and experience

**UI Layout:**
```
[Progress: 2/5]

Tell us about your fitness background.

Years Training:
[Slider: 0──────●───10+]
0 years (Currently: 3 years)

Current Training Frequency:
[Slider: 0──────●──7]
0 days/week (Currently: 4 days/week)

Fitness Level:
○ Beginner (0-1 years, learning basics)
○ Intermediate (1-3 years, consistent training)
● Advanced (3+ years, experienced)

[Back] [Next]
```

**Defaults:**
- Years training: 0
- Frequency: 0
- Fitness level: Beginner

**Info Tooltips:**
- Beginner: "New to structured training or returning after long break"
- Intermediate: "Training consistently, know proper form"
- Advanced: "Experienced, can handle complex programming"

### Step 3: Goals

**Objective:** Define training objectives for AI personalization

**UI Layout:**
```
[Progress: 3/5]

What are your fitness goals?
(Select 1-5 goals)

Primary Goals:
☑ Lose belly fat
☑ Gain muscle mass
☐ Increase strength
☐ Improve endurance

Body-Specific Goals:
☑ Build arms
☐ Build legs
☐ Build chest
☐ Build back
☐ Improve core

Other Goals:
☐ Broad shoulders
☐ Increase flexibility
☐ Sport-specific training: [Text input]

[2 goals selected]

[Back] [Next]
```

**Validation:**
- Minimum 1 goal required
- Maximum 5 goals (prevent overwhelm)
- If "Sport-specific" selected, text input required

**UX Notes:**
- Visual feedback: Selected checkboxes green
- Counter updates: "X goals selected"
- Warning if >5 attempted: "Max 5 goals. Focus for better results."

### Step 4: Constraints & Equipment

**Objective:** Identify limitations and available resources

**UI Layout:**
```
[Progress: 4/5]

Constraints & Equipment

Any injuries or limitations?
☐ Knee pain/injury
☐ Lower back issues
☐ Shoulder issues
☐ Wrist pain
☐ None
☐ Other: [Text input]

Equipment Available:
☑ Gym membership (full access)
☐ Dumbbells (home)
☐ Barbell (home)
☐ Resistance bands
☐ Bodyweight only

Time per Session:
○ 15 minutes
○ 30 minutes
● 60 minutes
○ 90+ minutes

Preferred Training Style:
○ Weightlifting (barbell/dumbbell focus)
● Mixed (weights + cardio)
○ Calisthenics (bodyweight)
○ Cardio-focused

[Back] [Next]
```

**Smart Defaults:**
- If "Gym membership" selected → Assumes full equipment
- If only "Bodyweight" → Style defaults to Calisthenics
- Time affects exercise selection (fewer exercises if 15min)

### Step 5: Difficulty Selection

**Objective:** Set accountability level and training intensity

**UI Layout:**
```
[Progress: 5/5]

Choose Your Difficulty Mode

┌─────────────────────────────────────┐
│ EASY MODE                           │
│ 3-4 days/week | 30-45 min sessions  │
│ Supportive tone, flexible schedule  │
│ Light penalties for missed workouts │
│ [Select Easy]                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ MEDIUM MODE                         │
│ 4 days/week | 45-60 min sessions    │
│ Balanced accountability             │
│ Moderate penalties, clear structure │
│ [Select Medium]                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ SERGEANT MODE [RECOMMENDED]         │
│ 4-5 days/week | 60-90 min sessions  │
│ Strict discipline, no-excuses tone  │
│ Significant penalties, streak focus │
│ [Select Sergeant] ◄ Most Popular    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ BEAST MODE                          │
│ 5-6 days/week | 90-120 min sessions │
│ Maximum intensity, brutal honesty   │
│ Extreme penalties, relentless push  │
│ [Select Beast] ⚠ Advanced Users Only│
└─────────────────────────────────────┘

[Back] [Complete Setup]
```

**Default:** Sergeant (pre-selected as recommended)

**Confirmation Modal (Beast Mode only):**
```
"Beast Mode is intense and unforgiving.
Are you sure you're ready?

- 5-6 days/week minimum
- 90+ minute sessions
- Extreme penalties for misses
- No flexibility

This is NOT for beginners.

[Yes, I'm Ready] [Choose Different Mode]"
```

### Onboarding Completion

**After [Complete Setup]:**
```
Profile saved → Redirected to Dashboard
  ↓
Welcome Modal:
"Welcome to PersonalFit!

Your profile is complete.
Ready to generate your first workout plan?

[Generate Plan Now] [Explore First]"
```

**If [Explore First]:**
- Dashboard with empty states
- Prompts to generate plan
- Tutorial tooltips (optional, dismissible)

**If [Generate Plan Now]:**
- Immediately to plan generation flow

## Goal-Setting Flow

### Initial Goals (During Onboarding)
Covered in Step 3 above.

### Updating Goals (From Settings)

**Entry Point:**
```
Settings > Profile > Edit Goals
OR
Dashboard > Profile Card > [Edit Goals]
```

**Flow:**
```
User clicks [Edit Goals]
  ↓
Modal opens with current goals pre-selected
  ↓
User modifies selections:
- Unchecks "Lose belly fat" (goal achieved)
- Checks "Increase strength" (new focus)
  ↓
Clicks [Save Changes]
  ↓
Validation: 1-5 goals required
  ↓
PUT /profile (goals: [...])
  ↓
Success toast: "Goals updated"
  ↓
Modal closes
  ↓
Info message appears on dashboard:
"Goals updated! Current plan not affected.
Generate new plan to reflect updated goals.
[Generate Plan] [Later]"
```

**Impact on Active Plan:**
- Active plan NOT automatically changed (continuity)
- User prompted to generate new plan (optional)
- Goals apply to NEXT generated plan

## Creating & Modifying Workout Plans

### AI-Generated Plan Flow (Detailed)

**Entry Points:**
- Dashboard > [Generate First Plan] (new user)
- Plans > [Generate New Plan]
- End of current plan: "Plan ending. Generate next?"

**Step 1: Plan Configuration**
```
User navigates to /plans/new
  ↓
Form displayed:

Training Phase:
"What's your primary focus?"
○ Hypertrophy (Muscle growth)
● Strength (Max power)
○ Fat Loss (Calorie burn + muscle preservation)
○ Endurance (Stamina, conditioning)

Duration:
"How long should this plan run?"
○ 4 weeks (Quick cycle)
● 8 weeks (Recommended)
○ 12 weeks (Full program)

Focus Areas:
"Emphasize specific body parts?"
☑ Full Body (balanced)
☐ Chest
☑ Arms (checked based on user goals)
☐ Legs
☐ Back
☐ Core

Difficulty:
"Use current difficulty or override?"
● Current (Sergeant)
○ Easy
○ Medium
○ Sergeant
○ Beast

[Generate Plan]
```

**Step 2: AI Processing**
```
User clicks [Generate Plan]
  ↓
Loading screen:
[Animated spinner]

"AI is creating your personalized plan..."
Progress text:
- Analyzing your profile and goals...
- Building optimal workout schedule...
- Calculating nutrition targets...
- Generating exercise recommendations...

(5-10 seconds, real API call to OpenAI)
```

**Backend Process:**
```
POST /ai/generate-plan
  ↓
1. Fetch user profile from DB
2. Validate plan parameters
3. Build dynamic prompt for OpenAI
4. Call OpenAI GPT-4o API
5. Parse JSON response
6. Validate workout structure
7. Store as workout_template in DB
8. Return plan_id + full plan data
```

**Step 3: Plan Review**
```
Plan displayed:

┌─────────────────────────────────────────┐
│ Generated Plan: 8-Week Strength Focus   │
├─────────────────────────────────────────┤
│ AI Rationale:                           │
│ "Based on your experience and strength  │
│ goals, this plan emphasizes compound    │
│ lifts with progressive overload. Arm    │
│ isolation included 2x/week for growth.  │
│ 4-day split balances recovery and      │
│ volume for optimal strength gains."     │
└─────────────────────────────────────────┘

Weekly Schedule:
┌──────────────────────────────────┐
│ Monday: Upper Power (75 min)    │
│ - Bench Press, Rows, OHP, etc.  │
├──────────────────────────────────┤
│ Tuesday: REST                    │
├──────────────────────────────────┤
│ Wednesday: Lower Power (80 min) │
│ - Squat, Deadlift, Leg Press    │
├──────────────────────────────────┤
│ Thursday: REST                   │
├──────────────────────────────────┤
│ Friday: Upper Hypertrophy (70min)│
│ - Incline Press, Curls, Triceps │
├──────────────────────────────────┤
│ Saturday: Lower Hypertrophy      │
│ - Lunges, Leg Curls, Calves     │
├──────────────────────────────────┤
│ Sunday: REST or Active Recovery  │
└──────────────────────────────────┘

Total: 24 exercises/week, 4 sessions
Avg Duration: 75 min/session

Nutrition Targets:
- Calories: 2,600/day (100 cal surplus)
- Protein: 180g | Carbs: 280g | Fat: 85g

[Accept Plan] [Regenerate] [Edit Manually] [Cancel]
```

**User Actions:**

**If [Accept Plan]:**
```
Confirmation: "Activate this plan?"
[Yes] [No]
  ↓
PUT /profile (active_plan_id: new_plan_id)
  ↓
Success: "Plan activated!"
  ↓
Redirect to Dashboard
  ↓
Dashboard shows first scheduled workout
```

**If [Regenerate]:**
```
Same form, same parameters
  ↓
New API call (different seed/prompt variation)
  ↓
New plan displayed (may differ slightly)
```

**If [Edit Manually]:**
```
Plan loaded into manual editor
  ↓
User can modify:
- Exercise names
- Sets/reps
- Rest times
- Add/remove exercises
- Reorder days
  ↓
Save as custom plan
```

**If [Cancel]:**
```
Redirect to /plans
  ↓
Plan NOT saved (API response discarded)
```

### Manual Plan Creation Flow

**Entry Point:**
```
Plans > [Create Manual Plan]
```

**Step 1: Plan Details**
```
Plan Name: [Text input, e.g., "Custom Strength Cycle"]
Description: [Text area, optional]
Duration: [Number input, weeks]
Training Phase: [Dropdown: Hypertrophy/Strength/etc.]

[Next: Build Schedule]
```

**Step 2: Weekly Schedule Builder**
```
Week 1 Schedule:

Monday:
[+] Add Workout
  Workout Name: [Text input]
  Estimated Duration: [Number, minutes]
  [+ Add Exercise]

Exercise 1:
  Name: [Searchable dropdown or text input]
  Sets: [Number]
  Reps: [Text, e.g., "6-8" or "AMRAP"]
  Rest: [Number, seconds]
  Notes: [Text area]
  [Remove] [Move Up] [Move Down]

[+ Add Another Exercise]

Tuesday:
● Mark as Rest Day
OR
[ ] Add Workout

[Continue for Wed-Sun]

[Save as Draft] [Activate Plan] [Cancel]
```

**Exercise Library (Searchable Dropdown):**
```
User types: "bench"
  ↓
Dropdown filters:
- Barbell Bench Press
- Dumbbell Bench Press
- Incline Bench Press
- Close-Grip Bench Press

User selects → Auto-fills name
```

**Step 3: Nutrition (Optional)**
```
Add Nutrition Plan? (Optional)

○ Yes, add nutrition targets
● No, skip for now

[If Yes:]
Calories Target: [Number]
Macros:
  Protein: [Number] g
  Carbs: [Number] g
  Fat: [Number] g

Meal Plan: [Text area or structured input]

[Save Plan]
```

**Step 4: Activation**
```
Plan saved
  ↓
Modal: "Activate this plan now?"
[Activate] [Save as Draft]
  ↓
If [Activate]:
  Current plan deactivated (status: completed)
  New plan activated
  First workout scheduled
  ↓
Success: "Plan activated!"
Redirect to Dashboard
```

### Modifying Existing Plans

**Entry Point:**
```
Plans > Current Plan > [Edit]
OR
Plans > Plan History > Select Plan > [Edit]
```

**Edit Mode:**
```
Same interface as manual builder
  ↓
All fields pre-filled with current data
  ↓
User makes changes:
- Add/remove exercises
- Modify sets/reps
- Reorder workouts
- Update nutrition
  ↓
[Save Changes] [Cancel]
```

**Save Confirmation:**
```
Modal: "Update plan?"

Changes will affect future scheduled workouts.
Past logs remain unchanged.

[Update Plan] [Cancel]
  ↓
If [Update]:
  PUT /plans/:id
  Success toast: "Plan updated"
  Redirect to plan detail view
```

## Tracking Exercises Flow

### Logging Today's Workout (Complete Flow)

**Entry:**
```
Dashboard > Today's Workout Card > [Start Workout]
OR
Workouts > Today > [Start Workout]
OR
Quick Action FAB (mobile) > [Log Workout]
```

**Step 1: Workout Overview**
```
Page: /workouts/log/[date]

Header:
Chest & Triceps - Monday, Dec 16
Estimated Duration: 60 min | 8 exercises

Exercise List (Collapsed):
1. ☐ Barbell Bench Press (4×6-8, 120s rest)
2. ☐ Incline Dumbbell Press (3×8-10, 90s rest)
3. ☐ Cable Flyes (3×12-15, 60s rest)
4. ☐ Tricep Dips (3×8-12, 60s rest)
5. ☐ Skull Crushers (3×10-12, 60s rest)
6. ☐ Overhead Tricep Extension (3×12-15, 45s rest)
7. ☐ Close-Grip Bench (3×8-10, 90s rest)
8. ☐ Incline Treadmill (1×15min steady)

[Start Workout] [View Video Demos]
  ↓
User clicks [Start Workout]
  ↓
Expanded view (Exercise 1)
```

**Step 2: Exercise-by-Exercise Logging**
```
Exercise 1 of 8: Barbell Bench Press
Target: 4 sets × 6-8 reps, 120s rest
[📹 Video Demo] [📋 Last Session: 70kg × 8,7,6,6]

┌─────────────────────────────────────┐
│ Set 1:                              │
│ Weight: [70] kg  Reps: [8]         │
│ [✓ Complete Set]                    │
├─────────────────────────────────────┤
│ Set 2:                              │
│ Weight: [70] kg  Reps: [7]         │
│ [✓ Complete Set]                    │
│ Rest Timer: 120s [Skip]            │
├─────────────────────────────────────┤
│ Set 3:                              │
│ Weight: [70] kg  Reps: [6]         │
│ [✓ Complete Set]                    │
├─────────────────────────────────────┤
│ Set 4:                              │
│ Weight: [70] kg  Reps: [6]         │
│ [✓ Complete Set]                    │
└─────────────────────────────────────┘

Perceived Difficulty: [Slider: 1────●────10]
(Currently: 6/10)

Notes:
[Text area: "Form felt good, could probably add 2.5kg next time"]

[Copy from Last Session] [Skip Exercise] [Next Exercise →]
```

**User Interaction:**
```
User performs Set 1 in gym
  ↓
Returns to phone
  ↓
Enters weight: 70kg
  ↓
Enters reps: 8
  ↓
Taps [✓ Complete Set]
  ↓
Set 1 row turns green, checkmark appears
  ↓
Rest timer starts: "120s remaining" (countdown)
  ↓
User rests, waits for timer or skips
  ↓
Performs Set 2, repeats logging
  ↓
After all 4 sets complete:
  ↓
Slides difficulty to 6/10
  ↓
Adds note (optional)
  ↓
Taps [Next Exercise →]
  ↓
Exercise 2 displayed (same interface)
```

**Copy from Last Session:**
```
User taps [Copy from Last Session]
  ↓
All sets auto-fill with previous weights/reps:
Set 1: 70kg × 8
Set 2: 70kg × 7
Set 3: 70kg × 6
Set 4: 70kg × 6
  ↓
User can edit individual sets if performance changed
```

**Skip Exercise:**
```
User taps [Skip Exercise]
  ↓
Confirmation: "Skip Barbell Bench Press?"
[Yes] [No]
  ↓
If [Yes]:
  Exercise marked as skipped
  Move to next exercise
  (Logged as skipped in database)
```

**Step 3: Workout Completion**
```
After Exercise 8 logged:
  ↓
[Complete Workout] button appears
  ↓
User taps [Complete Workout]
  ↓
Confirmation Modal:

"Complete Workout?"

Summary:
- Exercises: 8/8 completed
- Total Volume: 8,450kg
- Duration: 62 minutes (auto-calculated or manual input)

[Yes, Complete] [No, Keep Editing]
  ↓
If [Yes]:
  POST /workouts/log (full workout data)
  ↓
  Backend:
    1. Store workout_log
    2. Calculate volume
    3. Update streak
    4. Check for penalties (if late log)
  ↓
Success Screen:
"Workout Complete! 🔥"
- Streak: 13 days (+1)
- Volume: 8,450kg
- Personal Record: Bench Press 70kg × 8

[View Stats] [Back to Dashboard]
```

### Logging Past Workouts (Retroactive)

**Entry:**
```
Workouts > History > Calendar View
  ↓
User clicks on past date (e.g., "Friday, Dec 13")
  ↓
If workout logged: View details
If not logged: [Log Workout] button
```

**Flow:**
```
User clicks [Log Workout] on past date
  ↓
Same logging interface as today
  ↓
Header: "Legs - Friday, Dec 13 (Late Log)"
  ↓
User logs exercises as normal
  ↓
On save:
  Backend checks if this was a missed workout
  ↓
If yes:
  Remove penalty (if penalty was assigned)
  OR mark as "late-logged" (penalty stands, but workout counts)
  ↓
Success: "Workout logged (late)"
Toast: "Penalty for missed workout remains"
```

## Tracking Nutrition (Optional Feature)

### Meal Logging Flow

**Entry:**
```
Metrics > Nutrition > [Log Meal]
OR
Dashboard > Quick Actions > [Log Meal]
```

**Form:**
```
Log Meal

Date: [Dec 16, 2024] (datepicker)
Meal: [Dropdown: Breakfast/Lunch/Dinner/Snack/Post-Workout]

Foods:
[Text area]
"200g chicken breast
100g rice
50g broccoli"

Calories: [650] (optional auto-calc or manual)

Macros:
Protein: [50] g
Carbs: [70] g
Fat: [10] g

[Save Meal]
```

**After Save:**
```
Daily Summary Updated:

Today's Nutrition:
- Calories: 1,450 / 2,400 (60%)
- Protein: 110g / 180g (61%)
- Carbs: 150g / 240g (63%)
- Fat: 35g / 80g (44%)

[Progress bars for each]

[Log Another Meal] [View Timeline]
```

### Meal Plan from AI

**If AI generated nutrition plan:**
```
User navigates to Nutrition > Today's Meal Plan
  ↓
Displays:

Today's Meal Plan

Breakfast (550 cal):
- 4 eggs
- 1 cup oatmeal
- Banana

[Quick Log] (pre-fills macros)

Lunch (650 cal):
- 200g chicken breast
- 200g rice
- 200g broccoli

[Quick Log]

... (remaining meals)

[Log Custom Meal] (manual entry)
```

## Reading Analytics / Progress Flow

### Dashboard Quick Stats (Always Visible)

**What's Displayed:**
```
Dashboard loads
  ↓
API calls:
- GET /accountability/current (streak, weekly status)
- GET /metrics/latest (most recent weight)
- GET /workouts/today (today's workout)
  ↓
Cards display:
- Weekly Status: 3/4 workouts (75%)
- Streak: 12 days 🔥
- Weight: 85kg (-1kg from 2 weeks ago)
- Next workout: "Wednesday: Back & Biceps"
```

### Deep Dive: Workout Stats

**Entry:**
```
Workouts > Stats
```

**Display:**
```
Workout Statistics

Filter:
[Dropdown: Last 4 weeks / 3 months / 6 months / 1 year / All time]
Currently: Last 3 months

Total Workouts: 36
Completion Rate: 90% (36/40 scheduled)
Avg Duration: 68 minutes
Total Volume: 312,500 kg

┌─────────────────────────────────────┐
│ Volume Progression (Bar Chart)      │
│ [Chart: Monthly bars showing growth]│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Consistency Heatmap (Calendar)      │
│ [Green: completed, Red: missed,     │
│  Gray: rest day]                    │
└─────────────────────────────────────┘

Exercise Records:
- Bench Press: 80kg × 6 (Dec 10)
- Deadlift: 120kg × 5 (Dec 15)
- Squat: 100kg × 8 (Dec 8)

[View Exercise Details]
```

### Deep Dive: Body Composition

**Entry:**
```
Metrics > Body Composition
```

**Display:**
```
Body Composition

Date Range: [Last 12 weeks]

┌─────────────────────────────────────┐
│ Weight Trend (Line Chart)           │
│ [Chart: 88kg → 85kg over 12 weeks] │
│ Trend: -3kg (0.25kg/week avg)      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Measurements (Multi-line Chart)     │
│ [Lines: Chest, Waist, Arm, Leg]    │
│ Waist: -5cm (92 → 87)              │
│ Arm: +1.2cm (34 → 35.2)            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Estimated Body Composition          │
│ Fat Loss: 3.5kg                     │
│ Muscle Gain: 0.5kg                  │
│ Net Change: -3kg                    │
└─────────────────────────────────────┘

Interpretation:
"Excellent progress! You've lost 3.5kg fat
while gaining 0.5kg muscle. Waist down 5cm
(goal achieved). Continue current plan."

[Export Data] [View Photos]
```

### Progress Photos Timeline

**Entry:**
```
Metrics > Progress Photos
```

**Display:**
```
Progress Photos

Filter: [All / Front / Side / Back]
Sort: [Newest First]

┌───────┬───────┬───────┬───────┐
│ Dec16 │ Dec02 │ Nov18 │ Nov04 │
│ 85kg  │ 85.5  │ 86kg  │ 87kg  │
│ 19%   │ 19.5% │ 20%   │ 21%   │
│[Photo]│[Photo]│[Photo]│[Photo]│
└───────┴───────┴───────┴───────┘

[+ Upload New Photo]

[Select for Comparison]
  ↓
User selects 2 photos
  ↓
Side-by-Side View:

Before (Nov 04):      After (Dec 16):
87kg, 21% BF          85kg, 19% BF
[Photo]               [Photo]

Change: -2kg, -2% body fat
Waist: -4cm

[Download Comparison] [Share]
```

## AI-Driven Feature Usage Flow

### Adaptive Plan Adjustment (Post-MVP)

**Trigger:**
```
User completes Week 2 of 8-week plan
  ↓
Backend cron job analyzes:
- Avg perceived difficulty: 3/10 (too easy)
- Completion rate: 100% (sustainable)
- Volume trend: Increasing steadily
  ↓
AI generates suggestion:
POST /ai/suggest-adjustment
  ↓
Notification created:
"AI Suggestion: Your workouts seem too easy"
```

**User Interaction:**
```
User sees notification on dashboard
  ↓
Clicks notification
  ↓
Modal:

"AI Adjustment Suggestion"

Analysis:
- Your avg difficulty rating: 3/10
- All workouts completed on time
- Volume increasing 5% weekly (good)

Suggestion:
"Workouts may be too easy for optimal gains.
Consider:
1. Increase weight by 5% on compound lifts
2. Add 1 extra set to isolation exercises
3. OR: Upgrade to Medium difficulty"

[Apply Suggestions] [Dismiss] [Generate New Plan]
```

**If [Apply Suggestions]:**
```
Backend modifies active plan:
- Increases target weights (progressive overload)
- Adds sets where suggested
  ↓
Success: "Plan adjusted for increased intensity"
  ↓
Future workouts reflect changes
```

## Notifications & Habit Support Flow

### Daily Reminder

**Setup:**
```
User sets notification time in Settings
  ↓
Settings > Notifications:
  Enable Notifications: ☑
  Time: [07:00]
  Timezone: [Africa/Johannesburg]
  [Save]
```

**Daily Flow:**
```
Backend cron job (runs every hour)
  ↓
Checks users with notification_time = current_hour
  ↓
For each user:
  Check if today's workout logged
  ↓
If not logged:
  Create in-app notification
  Send email (if enabled)
  ↓
Notification:
"Time to train! Today: Chest & Triceps"
[Open App]
```

**User Sees Notification:**
```
Mobile: Push notification → Tap → Opens app to /today
Desktop: Browser notification → Click → Opens app
In-app: Badge on bell icon → Click → Notification list
```

### Missed Workout Detection & Penalty

**Backend Process (Daily at Midnight UTC):**
```
Cron job: detectMissedWorkouts()
  ↓
For each user:
  1. Get yesterday's scheduled workouts
  2. Check if workout_log exists
  3. If not: Mark as missed
  ↓
If missed:
  1. Create accountability entry
  2. Assign penalty (based on difficulty)
  3. Break streak (if applicable)
  4. Create notification
```

**User Experience:**
```
User missed Friday workout
  ↓
Saturday morning (opens app)
  ↓
Dashboard shows:
⚠️ Warning Badge: "Missed Workout"
  ↓
User clicks warning
  ↓
Redirects to Accountability page:

"Friday Workout Missed"

Scheduled: Legs (Friday, Dec 13, 07:00)
Missed: No log entry within 24 hours

Penalty Assigned:
- Extra 30min cardio before next session
- Due: Sunday before Full Body workout
- [Mark Complete] [Log Late]

Streak: Reset to 0 (was 12 days)
```

## Subscription Management Flow (If Monetized)

### Viewing Subscription

**Entry:**
```
Settings > Subscription
```

**Display:**
```
Subscription

Current Plan: Free (Personal Use)
- 1 user
- Unlimited workout logs
- AI plan generation: 3 per month
- Basic analytics

[Upgrade to Pro]

Available Plans:

┌─────────────────────────────────────┐
│ PRO - $10/month                     │
│ - Unlimited AI plan generation      │
│ - Advanced analytics                │
│ - Priority support                  │
│ [Select Pro]                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ FAMILY - $20/month                  │
│ - 5 users                           │
│ - All Pro features                  │
│ - Shared progress tracking          │
│ [Select Family]                     │
└─────────────────────────────────────┘
```

### Upgrading

**Flow:**
```
User clicks [Select Pro]
  ↓
Redirect to Stripe Checkout:
"Upgrade to Pro - $10/month"
[Payment form]
  ↓
User completes payment
  ↓
Stripe webhook: payment.succeeded
  ↓
Backend: Update user.subscription_tier = "pro"
  ↓
Redirect to /dashboard
  ↓
Success Modal:
"Upgraded to Pro!"
- Unlimited AI plans ✓
- Advanced analytics ✓
[Explore Features]
```

### Cancelling

**Flow:**
```
Settings > Subscription > [Cancel Subscription]
  ↓
Confirmation Modal:
"Cancel Pro Subscription?"

Your subscription will remain active until Jan 16, 2025.
After that:
- AI plan generation: 3 per month
- Advanced analytics: Disabled

Are you sure?

[Yes, Cancel] [Keep Subscription]
  ↓
If [Yes]:
  POST /subscription/cancel
  Stripe: Schedule cancellation at period end
  ↓
Success: "Subscription will cancel on Jan 16, 2025"
```

## Community or Friend Features Flow

### Sharing Progress (Entry Point)

**From Settings:**
```
Settings > Sharing > [Invite Friend]
```

**From Dashboard:**
```
Dashboard > Share Progress Card > [Invite]
```

### Invitation Flow

**Step 1: Send Invite**
```
Modal: "Invite Friend"

Email: [friend@example.com]
Access Level:
○ View Only (See workouts, metrics, progress)
○ Comment (View + add encouragement)
○ Full Access (View + edit workouts, for training partners)

[Send Invite]
  ↓
POST /share/invite
  ↓
Backend:
  1. Create shared_access (status: pending)
  2. Generate invite token
  3. Send email to friend
  ↓
Success: "Invitation sent to friend@example.com"
```

**Step 2: Friend Receives Email**
```
Email:
"[Your Name] invited you to track fitness together on PersonalFit"

[Accept Invite]
  ↓
Link: /signup?invite_token=abc123
```

**Step 3: Friend Accepts**
```
Friend clicks [Accept Invite]
  ↓
If no account: /signup (pre-filled email)
If has account: /login
  ↓
After auth:
  POST /share/:share_id/accept
  ↓
Backend: Update status: accepted
  ↓
Redirect to /community/:owner_user_id
  ↓
Success: "You can now view [Name]'s progress"
```

**Step 4: Owner Notified**
```
Dashboard notification:
"[Friend Name] accepted your invite"
  ↓
Shared users visible in Settings > Sharing
```

### Viewing Shared Progress

**Entry:**
```
Community > [Friend Name]
```

**Display (View Only Access):**
```
[Friend Name]'s Profile

Goals: Gain muscle, Build arms
Difficulty: Sergeant
Streak: 18 days 🔥

This Week:
✓ Monday: Chest & Triceps
✓ Wednesday: Back & Biceps
✓ Friday: Legs
○ Sunday: Full Body (scheduled)

Recent Progress:
- Weight: 78kg (-2kg from 4 weeks ago)
- Arm: 36cm (+1cm)

[View Full Stats (if access allows)]
[Add Encouragement]
```

**Adding Encouragement (Comment Access):**
```
User clicks [Add Encouragement]
  ↓
Modal: "Leave a message"
[Text area]
  ↓
User types: "Great progress on arms! Keep it up! 💪"
  ↓
[Send]
  ↓
POST /share/comment
  ↓
Comment appears on friend's dashboard
```
