# PersonalFit: Features

## Core Features (MVP)

### Authentication & Security

**Purpose:** Secure user account management and session handling

**Features:**
- Email/password signup with validation
- JWT-based authentication
- Secure password hashing (bcrypt, 12 rounds)
- Token refresh mechanism
- Logout functionality
- Password strength requirements (min 8 chars, letters + numbers)

**Rationale:** Essential foundation for personal data security. JWT tokens enable stateless backend scalability. No social auth needed (personal use app).

**Dependencies:**
- bcrypt library
- jsonwebtoken library
- None (blocking)

**Priority:** P0 (Week 1)

**Expected User Impact:** Secure, frictionless access to personal fitness data

---

### Profile Management

**Purpose:** Comprehensive user profile for AI personalization

**Features:**
- Onboarding wizard (5 steps: Basic info, Fitness background, Goals, Constraints, Difficulty)
- Profile editing (update any field)
- Difficulty mode selection (Easy, Medium, Sergeant, Beast)
- Goal management (1-5 goals, multi-select)
- Constraint specification (injuries, equipment, time, training style)
- Profile data validation

**Rationale:** Profile completeness directly impacts AI plan quality. Onboarding wizard reduces overwhelming data entry. Difficulty modes create distinct behavioral profiles.

**Dependencies:**
- Authentication (user must be logged in)

**Priority:** P0 (Week 1-2)

**Expected User Impact:** Personalized experience from day one, appropriate plan difficulty, AI understands limitations

---

### AI Workout Plan Generation

**Purpose:** Generate evidence-based, personalized workout plans

**Features:**
- Plan parameter selection (training phase, duration, focus areas, difficulty)
- OpenAI GPT-4o integration with structured prompts
- JSON response parsing and validation
- Plan rationale display (explains why plan suits user)
- Weekly schedule overview (days, exercises, rest)
- Exercise details (sets, reps, rest times, notes)
- Plan preview before activation
- Regeneration option (same params, different output)

**Rationale:** Core differentiator. True AI personalization (not templates). OpenAI understands user context and constraints, generates suitable plans.

**Dependencies:**
- Profile must be complete (user data required for prompt)
- OpenAI API key configured
- Network connection

**Priority:** P0 (Week 2-3)

**Expected User Impact:** No more generic programs. Plans adapt to individual needs, equipment, time constraints. Confidence in plan suitability.

---

### Workout Logging

**Purpose:** Track workout performance for progress measurement

**Features:**
- Today's workout display (scheduled workout for current day)
- Exercise-by-exercise logging interface
- Set/rep/weight input with validation
- Perceived difficulty rating (1-10 slider)
- Exercise notes (form feedback, observations)
- Rest timer between sets (countdown)
- "Copy from last session" button (progressive overload support)
- Skip exercise option
- Workout completion summary (volume, duration, sets)
- Retroactive logging (log past workouts)

**Rationale:** Detailed logging enables progress tracking, progressive overload, and AI plan adjustments. Rest timers keep users on track. Copy function reduces data entry friction.

**Dependencies:**
- Active workout plan required
- Authentication

**Priority:** P0 (Week 3-4)

**Expected User Impact:** Easy workout tracking, visible progress, data-driven training decisions

---

### Body Metrics Tracking

**Purpose:** Monitor body composition changes over time

**Features:**
- Weight logging (kg/lbs)
- Body fat percentage (optional)
- Measurements (chest, waist, hips, arm, thigh, calf)
- Progress photo uploads
- Timeline view (all entries chronologically)
- Change calculations (compared to last entry)
- Trend analysis (weight change per week, measurement changes)
- Estimated body composition (fat loss vs muscle gain)

**Rationale:** Weight alone insufficient for body recomposition tracking. Measurements reveal fat loss (waist down) and muscle gain (arm up) independently. Photos provide visual confirmation.

**Dependencies:**
- Image storage (AWS S3 or Cloudinary)
- Authentication

**Priority:** P0 (Week 4)

**Expected User Impact:** Accurate progress tracking beyond scale weight. Motivation from visible changes. Data-driven goal adjustments.

---

### Accountability System

**Purpose:** Enforce consistency through consequence-based accountability

**Features:**
- Missed workout detection (24-hour grace period)
- Automatic penalty assignment (based on difficulty level)
- Streak tracking (consecutive days trained)
- Weekly status dashboard (workouts completed/missed)
- Penalty list with due dates
- Penalty completion tracking
- Difficulty-based messaging (tone changes per mode)
- Weekly report generation

**Rationale:** Core differentiator. Unlike reminder-only apps, PersonalFit enforces consequences. Loss aversion (streaks) and penalties create stronger commitment.

**Dependencies:**
- Active workout plan
- Cron jobs (backend scheduled tasks)

**Priority:** P0 (Week 4-5)

**Expected User Impact:** Increased adherence through accountability. Streaks create habit momentum. Penalties discourage skipping.

---

### Difficulty Modes

**Purpose:** Tailor training intensity and accountability to user readiness

**Features:**
- Four distinct modes: Easy, Medium, Sergeant, Beast
- Mode affects: workout frequency, session duration, rest days, penalties, messaging tone
- Mode selection during onboarding
- Mode change capability (with history tracking)
- Auto-suggestions based on performance (too easy/hard)
- Difficulty-specific workout parameters (RPE targets, volume)

**Rationale:** One-size-fits-all fails. Beginners need support, advanced users need intensity. Sergeant mode targets self-motivated fitness enthusiasts. Beast mode for extreme dedication.

**Dependencies:**
- Profile management
- Accountability system

**Priority:** P0 (Week 2 + integrated throughout)

**Expected User Impact:** Appropriate challenge level. Prevents burnout (too hard) and boredom (too easy). Users can progress through difficulty levels as fitness improves.

---

### Progress Visualization

**Purpose:** Make progress tangible through charts and metrics

**Features:**
- Weight trend chart (line chart, 12-week rolling view)
- Body composition chart (estimated fat vs lean mass)
- Measurements chart (multi-line: chest, waist, arm, leg)
- Workout consistency heatmap (calendar view, color-coded)
- Volume progression chart (monthly bar chart, total weight lifted)
- Strength progress per exercise (line chart, max weight × reps)
- Comparison with starting values
- Trend line overlays

**Rationale:** Visual feedback reinforces behavior. Charts reveal patterns invisible in raw data. Heatmaps show consistency issues (e.g., always missing Wednesdays).

**Dependencies:**
- Workout logs
- Body metrics
- Chart library (Recharts)

**Priority:** P0 (Week 5-6)

**Expected User Impact:** Motivation from visible progress. Easy pattern identification. Data-driven decisions (adjust volume, change focus areas).

---

### Dashboard

**Purpose:** Centralized view of critical information

**Features:**
- Today's workout card (hero element)
- Weekly status summary (workouts completed/scheduled)
- Streak counter with visual emphasis
- Current weight and recent change
- Upcoming workouts (this week)
- Quick progress charts (weight trend, consistency heatmap)
- Penalty warnings (if pending)
- Quick actions (Start Workout, Log Metrics, Generate Plan)

**Rationale:** Information-dense homepage reduces navigation. Most important data (today's workout) prominently displayed. Quick actions enable immediate engagement.

**Dependencies:**
- All core features (aggregates data)

**Priority:** P0 (Week 6-7)

**Expected User Impact:** Immediate situational awareness. No hunting for today's workout. Friction-free logging.

---

### Manual Plan Builder

**Purpose:** Fallback and customization option for users who want control

**Features:**
- Custom plan creation (name, duration, training phase)
- Weekly schedule builder (7 days)
- Exercise addition (searchable library or text input)
- Set/rep/rest configuration per exercise
- Drag-to-reorder exercises
- Rest day marking
- Optional nutrition planning
- Plan activation

**Rationale:** AI fallback if OpenAI unavailable. Advanced users want customization. Training partners may share custom plans.

**Dependencies:**
- Exercise library (basic list or searchable database)

**Priority:** P1 (Week 7-8)

**Expected User Impact:** Full control for advanced users. No AI dependency. Can replicate proven programs manually.

---

## Post-MVP Phase 1 (Weeks 11-16)

### Sharing & Collaboration

**Purpose:** Enable family/friends to track progress together

**Features:**
- Invitation system (email invites)
- Access levels (View Only, Comment, Full Access)
- Shared progress viewing (workouts, metrics, charts)
- Encouragement comments (if Comment access)
- Community feed (view shared connections)
- Access revocation

**Rationale:** Mutual accountability. Family can monitor progress (concerned parent use case). Training partners can coordinate workouts.

**Dependencies:**
- Email service (SendGrid)
- Profile management

**Priority:** P1 (Week 11-12)

**Expected User Impact:** Social accountability without social media pressure. Private progress sharing. Training partner coordination.

---

### Achievement Badges

**Purpose:** Gamify milestones without dark patterns

**Features:**
- Milestone badges (100 workouts, 30-day streak, 5kg lost, etc.)
- Surprise achievements (Comeback Kid, Scientist, etc.)
- Badge display on profile (optional, private by default)
- Badge notification on unlock
- All-time stats page

**Rationale:** Celebrates milestones. Creates mini-goals. Ethical gamification (no loot boxes, no forced progression).

**Dependencies:**
- Accountability system (streak tracking)
- Workout logs (total workouts)
- Body metrics (weight loss)

**Priority:** P1 (Week 13)

**Expected User Impact:** Additional motivation. Celebration of progress. No manipulation or addiction mechanics.

---

### Notifications (Email)

**Purpose:** Remind users without being in-app constantly

**Features:**
- Daily workout reminders (scheduled time)
- Missed workout warnings (day after miss)
- Streak milestone notifications (7, 14, 30, 100 days)
- Weekly summary emails (workouts completed, progress highlights)
- Plan ending reminders ("Plan ends in 1 week")

**Rationale:** Email extends accountability beyond app. Reduces need for constant app checking. Weekly summaries create reflection moments.

**Dependencies:**
- Email service (SendGrid)
- Cron jobs (scheduled sends)

**Priority:** P1 (Week 14)

**Expected User Impact:** Reduced missed workouts. Habit reinforcement. Passive progress awareness.

---

### Basic Nutrition Tracking

**Purpose:** Optional meal logging for users who want complete tracking

**Features:**
- Meal logging (foods, calories, macros)
- Daily summary (calories and macros vs targets)
- Meal plan from AI (if plan includes nutrition)
- Quick-log meals from plan
- Timeline view (nutrition over time)

**Rationale:** Some users want holistic tracking. Not forced (workouts remain primary focus). AI nutrition plans complement workout plans.

**Dependencies:**
- AI plan generation (for meal plans)

**Priority:** P1 (Week 15)

**Expected User Impact:** Complete tracking for dedicated users. No feature for casual users who don't care.

---

### Advanced Analytics

**Purpose:** Deeper insights for data-driven users

**Features:**
- Per-exercise strength progression (max weight over time)
- Body part progress (arm growth rate, waist reduction rate)
- Volume periodization analysis (loading/deload detection)
- Recovery metrics (rest days vs performance)
- Workout distribution (muscle group frequency)

**Rationale:** Power users want detailed analysis. Identify lagging body parts. Optimize training variables.

**Dependencies:**
- Significant workout history (3+ months data)

**Priority:** P1 (Week 16)

**Expected User Impact:** Actionable insights. Optimize training focus. Identify weaknesses.

---

## Post-MVP Phase 2 (Months 4-6)

### Adaptive Plan Adjustments

**Purpose:** AI analyzes performance and suggests mid-cycle changes

**Features:**
- Performance analysis (perceived difficulty, completion rate, volume trend)
- AI-generated adjustment suggestions
- Automatic plan modifications (if user accepts)
- Progressive overload recommendations (increase weight by X%)
- Deload week suggestions (if overtraining detected)

**Rationale:** Static plans become suboptimal as user adapts. AI learns from logged data. Dynamic adjustments maximize results.

**Dependencies:**
- Workout logs (2+ weeks of data)
- OpenAI API

**Priority:** P2 (Month 4)

**Expected User Impact:** Plans that adapt to user. No plateaus from static programming. Continuous optimization.

---

### Exercise Library with Videos

**Purpose:** Demonstrate proper form and technique

**Features:**
- Searchable exercise database (500+ exercises)
- Video demonstrations (YouTube embeds)
- Muscle group categorization
- Equipment filtering
- Form cues and common mistakes
- Alternative exercises (similar movement patterns)

**Rationale:** Users need form guidance. YouTube embeds avoid content creation burden. Searchable library improves manual plan builder.

**Dependencies:**
- Video hosting (YouTube embeds, not self-hosted)

**Priority:** P2 (Month 4-5)

**Expected User Impact:** Confidence in exercise execution. Reduced injury risk. Learning resource.

---

### Mobile App (React Native)

**Purpose:** Native mobile experience for on-the-go logging

**Features:**
- All web app features (full parity)
- Push notifications (workout reminders, missed workout alerts)
- Camera integration (progress photos)
- Offline workout logging (sync when online)
- Apple Health / Google Fit integration (read weight data)

**Rationale:** Gym logging on mobile more convenient than web. Push notifications more reliable than web notifications. Health app integration reduces data entry.

**Dependencies:**
- React Native setup
- Native build tooling
- App store accounts (Apple, Google)

**Priority:** P2 (Month 5-6)

**Expected User Impact:** Better gym experience. Offline capability. Health data sync convenience.

---

### Recovery Recommendations

**Purpose:** Prevent overtraining and optimize recovery

**Features:**
- Deload week detection (based on volume and perceived difficulty)
- Rest day recommendations (if overreaching)
- Mobility and stretching routines (for weak points)
- Sleep tracking integration (if wearable data available)
- Recovery score (simple algorithm)

**Rationale:** Training is only half the equation. Recovery optimization improves results. Deload weeks prevent burnout.

**Dependencies:**
- Workout logs (volume and difficulty data)
- Wearable integration (optional, for sleep)

**Priority:** P2 (Month 6)

**Expected User Impact:** Reduced injury risk. Optimized recovery. Long-term training sustainability.

---

## Post-MVP Phase 3 (Months 7-12)

### Form Check Assistance (AI Video Analysis)

**Purpose:** Provide automated form feedback on exercise videos

**Features:**
- Video upload (user records set)
- AI video analysis (pose detection)
- Form feedback (bar path, depth, tempo)
- Suggestions for improvement
- Comparison with ideal form (side-by-side)

**Rationale:** Form checking is expensive (personal trainers) or unavailable (solo training). AI video analysis democratizes coaching.

**Dependencies:**
- Video AI model (not OpenAI GPT, requires computer vision)
- Significant R&D (complex feature)

**Priority:** P3 (Month 7-9)

**Expected User Impact:** Improved form. Injury prevention. Self-coaching capability.

---

### Wearable Integration

**Purpose:** Auto-import data from fitness devices

**Features:**
- Apple Health integration (iOS)
- Google Fit integration (Android)
- Import weight data automatically
- Import heart rate (for cardio intensity tracking)
- Import sleep data (for recovery analysis)
- Import step count (for activity level)

**Rationale:** Reduces manual data entry. Users already track weight on smart scales. Sleep data improves recovery recommendations.

**Dependencies:**
- Native mobile app (wearable APIs unavailable on web)
- Health app permissions

**Priority:** P3 (Month 9-10)

**Expected User Impact:** Less data entry friction. Automatic weight tracking. Holistic health view.

---

### Injury Prevention Patterns

**Purpose:** Detect overtraining and injury risk

**Features:**
- Volume spike detection (sudden increase = injury risk)
- Perceived difficulty trends (consistently high = overtraining)
- Muscle imbalance detection (push/pull ratio, left/right symmetry)
- Injury risk warnings (modal notifications)
- Preventive exercise suggestions (mobility work, antagonist training)

**Rationale:** Injuries derail progress. Early detection prevents serious issues. Data-driven injury prevention.

**Dependencies:**
- Extensive workout history (6+ months)
- Advanced analytics

**Priority:** P3 (Month 10-11)

**Expected User Impact:** Fewer injuries. Training longevity. Proactive health management.

---

### Community Challenges

**Purpose:** Private, small-group challenges for motivation

**Features:**
- Challenge creation (e.g., "Most workouts in December")
- Invite friends to challenge
- Leaderboard (private, invite-only)
- Challenge rules (consistency, volume, weight loss, etc.)
- Challenge completion badges

**Rationale:** Friendly competition without social media toxicity. Private challenges avoid external pressure. Mutual motivation.

**Dependencies:**
- Sharing & collaboration features
- Achievement system

**Priority:** P3 (Month 11-12)

**Expected User Impact:** Group motivation. Friendly competition. Shared goals.

---

### Advanced Periodization

**Purpose:** Implement block periodization models

**Features:**
- Periodization templates (accumulation, intensification, realization)
- Auto-generated training blocks (4-week cycles)
- Volume and intensity wave planning
- Deload week scheduling (every 3-4 weeks)
- Peak week planning (for competitions, events)

**Rationale:** Advanced lifters need periodization for continued gains. Automated block planning removes complexity.

**Dependencies:**
- AI plan generation
- Adaptive plan adjustments

**Priority:** P3 (Month 12)

**Expected User Impact:** Advanced programming for serious lifters. Structured long-term planning. Peak performance timing.

---

## Feature Summary Table

| Feature | Priority | Week/Month | Dependencies | Impact |
|---------|----------|------------|--------------|--------|
| Authentication | P0 | Week 1 | None | Security foundation |
| Profile Management | P0 | Week 1-2 | Auth | Personalization |
| AI Plan Generation | P0 | Week 2-3 | Profile, OpenAI | Core differentiator |
| Workout Logging | P0 | Week 3-4 | Active plan | Progress tracking |
| Body Metrics | P0 | Week 4 | Image storage | Body comp tracking |
| Accountability | P0 | Week 4-5 | Active plan | Adherence enforcement |
| Difficulty Modes | P0 | Week 2+ | Profile, Accountability | Tailored intensity |
| Progress Charts | P0 | Week 5-6 | Logs, Metrics | Visual motivation |
| Dashboard | P0 | Week 6-7 | All core features | Centralized hub |
| Manual Plan Builder | P1 | Week 7-8 | None | AI fallback |
| Sharing | P1 | Week 11-12 | Email service | Social accountability |
| Achievement Badges | P1 | Week 13 | Accountability | Milestone celebration |
| Email Notifications | P1 | Week 14 | Email service | Habit reinforcement |
| Nutrition Tracking | P1 | Week 15 | AI plans | Holistic tracking |
| Advanced Analytics | P1 | Week 16 | Workout history | Deep insights |
| Adaptive Adjustments | P2 | Month 4 | Logs, OpenAI | Dynamic optimization |
| Exercise Library | P2 | Month 4-5 | Video hosting | Form guidance |
| Mobile App | P2 | Month 5-6 | React Native | Native experience |
| Recovery Recs | P2 | Month 6 | Logs | Overtraining prevention |
| Form Check AI | P3 | Month 7-9 | Video AI | Automated coaching |
| Wearable Integration | P3 | Month 9-10 | Mobile app | Auto data import |
| Injury Prevention | P3 | Month 10-11 | Analytics | Health protection |
| Community Challenges | P3 | Month 11-12 | Sharing | Group motivation |
| Advanced Periodization | P3 | Month 12 | AI plans | Elite programming |

---

## Feature Exclusions (Deliberately Not Included)

**Social Feed / Public Profiles:**
- Reason: Creates comparison anxiety, not aligned with personal progress focus
- Alternative: Private sharing only

**In-App Purchases / Freemium Dark Patterns:**
- Reason: Ethical concerns, creates friction
- Alternative: Simple subscription model if monetized

**Exercise Marketplace (Paid Programs):**
- Reason: Conflicts with AI generation, adds complexity
- Alternative: AI generates programs for free

**Live Classes / Streaming:**
- Reason: High production cost, not differentiating
- Alternative: YouTube video embeds for exercise demos

**Calorie Tracking from Photos:**
- Reason: Inaccurate, frustrating UX
- Alternative: Manual entry or skip nutrition entirely

**Public Leaderboards:**
- Reason: Creates unhealthy competition, comparison anxiety
- Alternative: Private friend leaderboards only

**Infinite Scrolling Feeds:**
- Reason: Time-wasting, addictive design
- Alternative: Finite, purposeful navigation

**Automated Workout Music Playlists:**
- Reason: Licensing complexity, user preferences vary
- Alternative: Users bring own music apps
