# PersonalFit: Data Flows

## Data Movement Architecture

### Data Flow Layers

```
User Interface (React)
    ↕ (Actions/Events)
State Management (Zustand)
    ↕ (API Calls)
API Layer (Express.js)
    ↕ (Queries/Updates)
Database Layer (MongoDB)
    ↕ (Analytics/Reports)
External Services (OpenAI, S3)
```

---

## User Registration & Authentication Flow

### Signup Data Flow

```
User Input (Frontend)
    ↓
Email: string
Password: string
    ↓
Validation (Client-side)
- Email format check
- Password strength check
    ↓
POST /api/v1/auth/signup
    ↓
Backend Validation
- Email format re-check
- Password strength re-check
- Duplicate email check (DB query)
    ↓
Password Hashing
- bcrypt.hash(password, 12)
    ↓
User Document Creation
{
  email: "user@example.com",
  password_hash: "$2b$12$...",
  created_at: Date.now()
}
    ↓
Insert into MongoDB (users collection)
    ↓
JWT Token Generation
{
  userId: user._id,
  email: user.email,
  exp: Date.now() + 86400000 // 24 hours
}
    ↓
Response to Client
{
  success: true,
  data: {
    user: { id, email },
    token: "eyJhbGciOiJIUzI1..."
  }
}
    ↓
Client Storage
- localStorage.setItem('token', token)
- State update (authSlice)
    ↓
Redirect to /onboarding
```

### Login Data Flow

```
User Input
    ↓
Email + Password
    ↓
POST /api/v1/auth/login
    ↓
Backend Lookup
- users.findOne({ email })
    ↓
Password Verification
- bcrypt.compare(password, user.password_hash)
    ↓
If Valid:
  Generate JWT token
  Update user.last_login
  Return token + user data
    ↓
If Invalid:
  Return 401 Unauthorized
  Error: "Invalid credentials"
    ↓
Client Stores Token
Redirect to /dashboard
```

### Protected Route Flow

```
User Action (e.g., view dashboard)
    ↓
GET /api/v1/workouts/today
Headers: { Authorization: "Bearer <token>" }
    ↓
Backend Middleware: auth.middleware.ts
- Extract token from header
- Verify signature (jwt.verify)
- Check expiration
- Decode payload → userId
    ↓
If Valid:
  Attach user to request (req.user = { userId })
  Proceed to route handler
    ↓
If Invalid:
  Return 401 Unauthorized
  Client redirects to /login
```

---

## Profile Data Flow

### Onboarding Data Collection

```
Step 1: Basic Info
User Input → Local State
{
  name: string,
  age: number,
  gender: string,
  height_cm: number,
  current_weight_kg: number
}
    ↓
Step 2: Fitness Background
{
  years_training: number,
  current_training_frequency: number,
  fitness_level: string
}
    ↓
Step 3: Goals
{
  goals: string[] // multi-select
}
    ↓
Step 4: Constraints
{
  constraints: string[],
  available_equipment: string[],
  time_per_session: number,
  preferred_style: string
}
    ↓
Step 5: Difficulty
{
  difficulty_level: string
}
    ↓
All Steps Complete
    ↓
POST /api/v1/profiles
Body: { profile: {...all data}, settings: {...difficulty} }
    ↓
Backend Validation
- Age: 16-100
- Weight: 30-300kg
- Goals: 1-5 selected
    ↓
User Document Update
users.updateOne(
  { _id: userId },
  {
    $set: {
      profile: {...},
      settings: {...}
    }
  }
)
    ↓
Response: Profile saved
    ↓
Client State Update
    ↓
Redirect to /dashboard
```

### Profile Update Flow

```
User Edits Profile (Settings page)
    ↓
Changes fields (e.g., weight: 85kg → 84kg)
    ↓
PUT /api/v1/profiles
Body: { updates: { current_weight_kg: 84 } }
    ↓
Backend Merge
users.updateOne(
  { _id: req.user.id },
  { $set: { "profile.current_weight_kg": 84, "profile.updated_at": Date.now() } }
)
    ↓
Response: Updated profile
    ↓
Client State Update
Dashboard reflects new weight
```

---

## AI Plan Generation Flow

### Plan Creation Data Flow

```
User Input (Plan Form)
{
  training_phase: "hypertrophy",
  duration_weeks: 8,
  focus_areas: ["full_body", "arms"],
  difficulty_override: null // use current
}
    ↓
POST /api/v1/ai/generate-plan
    ↓
Backend: Fetch User Profile
users.findById(userId)
→ { profile: {...}, settings: {...} }
    ↓
Build Dynamic Prompt
aiService.buildWorkoutPrompt(user, params)
→ Constructs text prompt with:
  - User age, gender, height, weight
  - Fitness level, experience, goals
  - Constraints, equipment, time
  - Training phase, focus areas, difficulty
    ↓
Call OpenAI API
openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: dynamicPrompt }
  ],
  response_format: { type: "json_object" }
})
    ↓
OpenAI Response (5-10 seconds)
{
  workouts: [
    {
      day_of_week: 1,
      name: "Chest & Triceps",
      exercises: [
        { name, sets, reps, rest_seconds, notes }
      ]
    }
  ],
  nutrition: {
    calories_target: 2400,
    macros: { protein_g, carbs_g, fat_g },
    meal_plan: [...]
  },
  rationale: "Based on your profile..."
}
    ↓
Backend Validation
- Check JSON structure
- Validate exercise counts (not 50 exercises/day)
- Validate nutrition ranges
    ↓
Store in Database
workout_templates.insertOne({
  user_id: userId,
  name: "8-Week Hypertrophy + Arm Focus",
  workouts: [...],
  nutrition: {...},
  ai_generated: true,
  ai_rationale: rationale,
  status: "pending",
  created_at: Date.now()
})
    ↓
Response to Client
{
  success: true,
  data: {
    plan_id: "abc123",
    plan: {...full plan data},
    rationale: "..."
  }
}
    ↓
Frontend Display
Plan preview with rationale
[Accept] [Regenerate] [Edit] [Cancel]
    ↓
If User Accepts
    ↓
PUT /api/v1/plans/:id/activate
    ↓
Backend Updates
1. Deactivate current plan (if exists)
   workout_templates.updateOne({ user_id, status: "active" }, { $set: { status: "completed" } })
2. Activate new plan
   workout_templates.updateOne({ _id: plan_id }, { $set: { status: "active", start_date: Date.now() } })
3. Update user active_plan_id
   users.updateOne({ _id: userId }, { $set: { active_plan_id: plan_id } })
    ↓
Response: Plan activated
    ↓
Redirect to Dashboard
Today's workout from new plan displayed
```

---

## Workout Logging Flow

### Today's Workout Data Flow

```
User Opens Dashboard
    ↓
GET /api/v1/workouts/today
    ↓
Backend Logic
1. Get user's active plan
   users.findById(userId).active_plan_id
2. Get plan details
   workout_templates.findById(active_plan_id)
3. Determine today's day of week (1-7)
4. Find scheduled workout for today
   plan.workouts.find(w => w.day_of_week === today)
5. Check if already logged
   workout_logs.findOne({ user_id: userId, scheduled_date: today })
    ↓
Response
{
  workout: {
    name: "Chest & Triceps",
    exercises: [
      { name, sets, reps, rest_seconds, notes }
    ],
    estimated_duration_minutes: 60
  },
  log: existingLog || null // null if not yet logged
}
    ↓
Frontend Display
Today's Workout Card
[Start Workout] button if not logged
[View Completed Workout] if already logged
```

### Workout Logging Data Flow

```
User Clicks [Start Workout]
    ↓
Navigate to /workouts/log/[date]
    ↓
Display exercise-by-exercise UI
    ↓
User Performs Exercise 1
    ↓
User Logs Set 1
{
  exercise_name: "Barbell Bench Press",
  set_number: 1,
  weight_kg: 70,
  reps: 8
}
    ↓
Local State Update (not saved to DB yet)
    ↓
User Logs Sets 2-4
    ↓
User Slides Difficulty: 6/10
    ↓
User Adds Note: "Form felt good"
    ↓
User Logs Remaining Exercises
    ↓
User Clicks [Complete Workout]
    ↓
Aggregate Data (Client-side)
{
  user_id: userId,
  workout_template_id: planId,
  scheduled_date: today,
  exercises: [
    {
      exercise_name: "Barbell Bench Press",
      target_sets: 4,
      target_reps: "6-8",
      sets_completed: 4,
      reps_per_set: [8, 7, 6, 6],
      weight_used_kg: [70, 70, 70, 70],
      perceived_difficulty: 6,
      notes: "Form felt good",
      skipped: false
    },
    // ... remaining exercises
  ],
  completed: true,
  completion_time_minutes: 62
}
    ↓
POST /api/v1/workouts/log
    ↓
Backend Processing
1. Validate data (all exercises logged)
2. Calculate total volume
   volume = exercises.reduce((sum, ex) => {
     return sum + ex.sets_completed * avg(ex.reps_per_set) * avg(ex.weight_used_kg)
   }, 0)
3. Store workout log
   workout_logs.insertOne({
     ...logData,
     total_volume_kg: volume,
     logged_at: Date.now(),
     completed_at: Date.now()
   })
4. Update accountability
   - Increment streak (if applicable)
   - Update weekly status (workouts_completed++)
   - Remove penalty if this was late-logged
5. Check for penalties
   - If logged >24 hours late, flag as late
    ↓
Response
{
  success: true,
  data: {
    log_id: "xyz789",
    volume: 8450,
    streak: 13, // updated
    penalties_cleared: ["penalty_abc"]
  }
}
    ↓
Frontend Display
Success Screen
"Workout Complete! 🔥"
Streak: 13 days (+1)
Volume: 8,450kg
```

---

## Body Metrics Flow

### Metrics Logging Data Flow

```
User Navigates to /metrics/log
    ↓
Form Displayed
    ↓
User Inputs
{
  date: "2024-12-16",
  weight_kg: 85.0,
  body_fat_percent: 19.0,
  measurements: {
    chest_cm: 103,
    waist_cm: 87,
    arm_cm: 35.2,
    ...
  },
  photo: File (image upload)
}
    ↓
Photo Upload (if provided)
    ↓
POST /api/v1/metrics/upload-photo
Body: FormData with image file
    ↓
Backend: Upload to S3/Cloudinary
s3.upload({
  Bucket: "personalfit-photos",
  Key: `${userId}/${Date.now()}.jpg`,
  Body: fileBuffer
})
    ↓
Response: photo_url (S3 public URL)
    ↓
Metrics Submission
    ↓
POST /api/v1/metrics/log
Body: {
  date,
  weight_kg,
  body_fat_percent,
  measurements,
  photo_url, // from previous step
  notes
}
    ↓
Backend Processing
1. Fetch last entry for comparison
   body_metrics.findOne({ user_id: userId }).sort({ date: -1 })
2. Calculate changes
   weight_change = current.weight_kg - last.weight_kg
   waist_change = current.waist_cm - last.waist_cm
3. Estimate body composition
   if (weight down && waist down) → fat loss
   if (weight stable && waist down && arm up) → recomposition
4. Store metrics
   body_metrics.insertOne({
     user_id: userId,
     date,
     weight_kg,
     body_fat_percent,
     measurements,
     photo_url,
     notes,
     created_at: Date.now()
   })
    ↓
Response
{
  success: true,
  data: {
    metric_id: "metric123",
    changes: {
      weight_change_kg: -0.5,
      waist_change_cm: -1,
      arm_change_cm: +0.2
    },
    interpretation: "Excellent progress! Fat loss + muscle gain."
  }
}
    ↓
Frontend Display
"Metrics Saved!"
Changes from last entry:
- Weight: -0.5kg ✓
- Waist: -1cm ✓
- Arm: +0.2cm ✓
```

---

## Accountability Flow

### Missed Workout Detection (Backend Cron)

```
Cron Job (Daily at 00:00 UTC)
    ↓
Function: detectMissedWorkouts()
    ↓
Query All Users with Active Plans
users.find({ active_plan_id: { $ne: null } })
    ↓
For Each User:
  1. Get yesterday's scheduled workouts
     plan = workout_templates.findById(user.active_plan_id)
     yesterday = new Date() - 1 day
     scheduled = plan.workouts.find(w => w.day_of_week === yesterday.getDay())

  2. Check if logged
     log = workout_logs.findOne({
       user_id: user._id,
       scheduled_date: yesterday
     })

  3. If NOT logged (missed):
     a. Create accountability entry
        accountability.updateOne(
          { user_id: user._id },
          {
            $inc: { workouts_missed: 1 },
            $push: {
              penalties: {
                penalty_id: uuid(),
                reason: `Missed ${scheduled.name}`,
                penalty_type: getPenaltyType(user.settings.difficulty_level),
                description: getPenaltyDescription(...),
                due_by: Date.now() + 48 hours,
                completed: false
              }
            }
          }
        )

     b. Break streak (if applicable)
        if (accountability.current_streak_days > 0) {
          accountability.updateOne({ user_id }, { $set: { current_streak_days: 0 } })
        }

     c. Create notification
        notifications.insertOne({
          user_id: user._id,
          type: "missed_workout",
          message: `Missed ${scheduled.name}. Penalty assigned.`,
          read: false,
          created_at: Date.now()
        })
    ↓
Penalties Based on Difficulty:
- Easy: "Extra 10min light cardio"
- Medium: "Extra 30min cardio"
- Sergeant: "Doubled workout or extra session"
- Beast: "Triple intensity or new workout day"
```

### Streak Update Flow

```
Workout Logged
    ↓
Backend: updateAccountability()
    ↓
1. Get user's accountability record
   acc = accountability.findOne({ user_id })

2. Check if workout logged within 24 hours of scheduled
   timeDiff = log.completed_at - log.scheduled_date
   if (timeDiff <= 24 hours) → counts for streak

3. Update streak
   if (yesterday had workout logged):
     current_streak_days++
   else:
     current_streak_days = 1 (start new streak)

4. Update longest streak
   if (current_streak_days > longest_streak_days):
     longest_streak_days = current_streak_days

5. Update weekly status
   week_start = start of current week
   workouts_completed++

6. Save
   accountability.updateOne({ user_id }, { $set: {...} })
    ↓
Response: Updated accountability data
    ↓
Frontend: Streak counter updates
Dashboard shows: "Streak: 13 days 🔥"
```

---

## Progress Visualization Flow

### Chart Data Aggregation

```
User Navigates to /metrics/body-comp
    ↓
GET /api/v1/metrics/timeline?start=2024-09-01&end=2024-12-16
    ↓
Backend Query
body_metrics.find({
  user_id: userId,
  date: { $gte: start, $lte: end }
}).sort({ date: 1 })
    ↓
Response (Array of Metrics)
[
  { date: "2024-09-01", weight_kg: 88, body_fat_percent: 22, measurements: {...} },
  { date: "2024-09-15", weight_kg: 87, body_fat_percent: 21, measurements: {...} },
  { date: "2024-10-01", weight_kg: 86, body_fat_percent: 20, measurements: {...} },
  // ... all entries in range
]
    ↓
Frontend Processing
1. Transform data for chart library
   chartData = metrics.map(m => ({
     date: m.date,
     weight: m.weight_kg,
     bodyFat: m.body_fat_percent,
     waist: m.measurements.waist_cm,
     arm: m.measurements.arm_cm
   }))

2. Calculate trends
   weightTrend = linearRegression(chartData.map(d => d.weight))
   estimatedFatLoss = calculateFatLoss(metrics)
   estimatedMuscleGain = calculateMuscleGain(metrics)

3. Render charts
   <LineChart data={chartData}>
     <Line dataKey="weight" stroke="blue" />
     <Line dataKey="bodyFat" stroke="red" />
   </LineChart>
```

### Workout Stats Aggregation

```
GET /api/v1/workouts/stats?period=3months
    ↓
Backend Aggregation
workout_logs.aggregate([
  { $match: {
      user_id: ObjectId(userId),
      completed_at: { $gte: threeMonthsAgo }
    }
  },
  { $group: {
      _id: null,
      total_workouts: { $sum: 1 },
      total_volume_kg: { $sum: "$total_volume_kg" },
      avg_duration: { $avg: "$completion_time_minutes" }
    }
  }
])
    ↓
Response
{
  total_workouts: 36,
  total_volume_kg: 312500,
  avg_duration: 68,
  completion_rate: 90% // calculated from scheduled vs logged
}
    ↓
Frontend Display
Workout Stats dashboard with cards and charts
```

---

## Privacy & Data Lifecycle

### Data Ownership

**User Controls:**
- View all data (GET /api/v1/users/me/data)
- Export data (GET /api/v1/users/me/export → JSON/CSV download)
- Delete account (DELETE /api/v1/users/me)

**Export Data Flow:**
```
User Clicks [Export Data]
    ↓
GET /api/v1/users/me/export
    ↓
Backend Aggregates All User Data
{
  profile: {...},
  workout_logs: [...],
  body_metrics: [...],
  accountability: {...},
  plans: [...]
}
    ↓
Response: JSON or CSV file
    ↓
Browser Downloads File
```

**Account Deletion Flow:**
```
User Clicks [Delete Account]
    ↓
Confirmation Modal: "This cannot be undone"
    ↓
DELETE /api/v1/users/me
    ↓
Backend Cascade Delete
1. Delete user document
2. Delete all workout_logs
3. Delete all body_metrics
4. Delete all workout_templates
5. Delete all shared_access (as owner or recipient)
6. Delete all accountability records
7. Delete progress photos from S3
    ↓
Response: Account deleted
    ↓
Logout + Redirect to landing page
```

### Data Retention

**Active Data (Permanent):**
- User profiles (until account deletion)
- Workout logs (historical data, never auto-deleted)
- Body metrics (progress tracking, never auto-deleted)
- Plans (archived plans preserved)

**Temporary Data (Time-Limited):**
- JWT tokens: 24 hours (auto-expire)
- Password reset tokens: 1 hour
- Invitation tokens: 7 days
- Notifications (read): 30 days (auto-delete)

**Soft-Deleted Data:**
- Deactivated plans: Status changed to "completed" or "abandoned" (not deleted)
- Revoked shares: Status changed to "revoked" (historical record preserved)

### Data Security

**At Rest:**
- Passwords: bcrypt hashed (12 rounds, never plaintext)
- Database: MongoDB Atlas encryption at rest (AES-256)
- Progress photos: S3 with encryption enabled

**In Transit:**
- All API calls: HTTPS only (TLS 1.2+)
- JWT tokens: Signed with secret key (HS256)

**Access Control:**
- Workout logs: user_id check (users cannot access others' logs)
- Body metrics: user_id check
- Shared access: access_level enforcement (View Only, Comment, Full Access)

---

## External Service Integration

### OpenAI API Flow

```
Backend Needs AI Plan
    ↓
Build Prompt (user profile + parameters)
    ↓
Call OpenAI
fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-4o",
    messages: [...],
    response_format: { type: "json_object" }
  })
})
    ↓
OpenAI Response
{
  id: "chatcmpl-...",
  choices: [
    {
      message: {
        content: "{\"workouts\": [...], \"nutrition\": {...}, \"rationale\": \"...\"}"
      }
    }
  ],
  usage: {
    prompt_tokens: 850,
    completion_tokens: 1200,
    total_tokens: 2050
  }
}
    ↓
Parse JSON
plan = JSON.parse(response.choices[0].message.content)
    ↓
Validate Structure
if (!plan.workouts || !plan.nutrition) throw Error
    ↓
Return to Application
```

**Error Handling:**
- Rate limit hit → Retry with exponential backoff
- Timeout (>15s) → Cancel, return error to user
- Invalid JSON → Log error, retry once, then fallback
- Quota exceeded → Disable AI features temporarily, notify admin

### Image Storage (S3) Flow

```
User Uploads Progress Photo
    ↓
Frontend: File selection
<input type="file" accept="image/*" />
    ↓
Convert to Base64 or FormData
    ↓
POST /api/v1/metrics/upload-photo
Body: FormData with file
    ↓
Backend: Validate Image
- File size <10MB
- MIME type: image/jpeg, image/png
- Dimensions: Max 4000×4000px
    ↓
Upload to S3
const s3 = new AWS.S3();
s3.upload({
  Bucket: "personalfit-photos",
  Key: `${userId}/${Date.now()}.jpg`,
  Body: fileBuffer,
  ContentType: "image/jpeg",
  ACL: "private" // not public by default
})
    ↓
Generate Signed URL (for access)
const url = s3.getSignedUrl('getObject', {
  Bucket: "personalfit-photos",
  Key: key,
  Expires: 3600 // 1 hour
});
    ↓
Response: photo_url
    ↓
Store URL in Database
body_metrics.photo_url = url
```

**Privacy:**
- Photos stored with private ACL (not publicly accessible)
- Signed URLs generated on-demand (1-hour expiry)
- Only user can access their own photos (user_id check)

---

## Real-Time Updates (Future)

### Webhook Flow (Post-MVP)

**Stripe Payment Webhook:**
```
Stripe Event: payment_succeeded
    ↓
POST /api/v1/webhooks/stripe
Body: { event: {...} }
    ↓
Backend Verify Signature
stripe.webhooks.constructEvent(body, signature, secret)
    ↓
Process Event
if (event.type === "payment_succeeded"):
  user = users.findOne({ stripe_customer_id: event.customer })
  user.subscription_tier = "pro"
  user.subscription_expires = Date.now() + 30 days
    ↓
Update Database
    ↓
Send Confirmation Email
```

### Push Notification Flow (Mobile App)

```
Backend Cron: Send Daily Reminder
    ↓
Query Users with notification_time = current_hour
    ↓
For Each User:
  Get device tokens (from mobile app registration)
  fcm.send({
    token: user.fcm_token,
    notification: {
      title: "Time to train!",
      body: "Today: Chest & Triceps"
    },
    data: {
      route: "/workouts/today"
    }
  })
    ↓
User Taps Notification
    ↓
Mobile App Opens to /workouts/today
```
