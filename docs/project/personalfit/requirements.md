# PersonalFit: Requirements

## Functional Requirements

### Authentication & User Management

**FR-001: User Registration**
- System shall allow users to create accounts with email and password
- Password strength validation required (minimum 8 characters, mix of letters/numbers)
- Email verification optional (MVP: not required, Post-MVP: email confirmation)
- Duplicate email prevention enforced

**FR-002: User Authentication**
- System shall authenticate users via JWT tokens
- Token expiry: 24 hours with refresh capability
- Session persistence across browser restarts
- Logout functionality clears tokens

**FR-003: Profile Management**
- Users shall create profiles with: name, age, gender, height, weight
- Fitness background: years training, current frequency, experience level
- Goals: multi-select from predefined list + custom text
- Constraints: injuries, equipment availability, time per session, training style
- Profile editable at any time

### AI Plan Generation

**FR-004: AI Workout Plan Creation**
- System shall generate personalized workout plans via OpenAI API
- Input parameters: training phase, duration (4/8/12 weeks), focus areas, difficulty
- Output: Weekly schedule with exercises (name, sets, reps, rest, notes)
- Rationale provided explaining why plan suits user
- Generation time target: <10 seconds

**FR-005: AI Nutrition Plan Creation**
- System shall generate nutrition recommendations based on goals
- Calculate TDEE and caloric targets (deficit/surplus/maintenance)
- Macro split (protein, carbs, fat) aligned with training phase
- Meal examples provided (5-6 meals with food lists and macros)
- Adjustments based on body metrics trends (Post-MVP)

**FR-006: Plan Acceptance/Rejection**
- Users shall review generated plans before activation
- Options: Accept, Regenerate with same params, Edit manually, Cancel
- Only one plan active at a time
- Historical plans accessible for review

### Workout Management

**FR-007: Workout Logging**
- Users shall log completed workouts with: sets, reps, weight, perceived difficulty
- Each exercise tracked separately
- Notes field for form feedback or observations
- "Copy from last session" functionality for progressive overload
- Completion timestamp recorded

**FR-008: Workout Scheduling**
- System shall display today's scheduled workout on dashboard
- Weekly schedule visible in calendar view
- Rest days marked explicitly
- Past scheduled workouts accessible in history

**FR-009: Workout History**
- Users shall view all logged workouts (filterable by date range)
- Exercise-specific history (e.g., all bench press sessions)
- Volume calculations (sets × reps × weight) per workout and cumulative
- Consistency metrics (completion percentage over time)

### Body Metrics Tracking

**FR-010: Metrics Logging**
- Users shall log: weight, body fat %, measurements (chest, waist, hips, arm, thigh, calf)
- Progress photo uploads supported
- Date-stamped entries
- Notes field for observations

**FR-011: Progress Visualization**
- System shall generate charts: weight trend, body composition, measurements over time
- Workout consistency heatmap (calendar view)
- Volume progression (monthly bar chart)
- Strength progress per exercise (line chart)
- Comparison with starting values and change calculations

**FR-012: Body Composition Analysis**
- System shall estimate fat loss and muscle gain based on:
  - Weight changes
  - Measurement changes (waist down = fat loss, arm up = muscle gain)
  - Workout volume trends
- Automatic trend interpretation ("You've lost 3kg fat while gaining 0.5kg muscle")

### Accountability System

**FR-013: Missed Workout Detection**
- System shall detect missed workouts (scheduled date passes without log entry)
- Detection runs daily at midnight UTC
- Grace period: 24 hours after scheduled time
- Missed workouts recorded in accountability log

**FR-014: Penalty Assignment**
- System shall assign penalties based on difficulty level:
  - Easy: +10min light cardio
  - Medium: +30min cardio
  - Sergeant: Doubled workout or extra session
  - Beast: Triple intensity or new workout day added
- Penalties have due dates (within 48-72 hours)
- Multiple missed workouts = cumulative penalties

**FR-015: Streak Tracking**
- System shall track consecutive days with logged workouts
- Streak increments daily if workout logged within 24 hours of scheduled time
- Streak breaks if workout missed (resets to 0)
- Historical longest streak recorded
- Streak milestones: 7, 14, 30, 60, 100 days

**FR-016: Penalty Completion**
- Users shall mark penalties as complete with optional notes
- Completed penalties removed from active list
- Completion logged with timestamp
- Penalty completion rate tracked (lifetime stat)

### Difficulty Modes

**FR-017: Difficulty Selection**
- Users shall select difficulty during onboarding: Easy, Medium, Sergeant, Beast
- Difficulty affects: workout intensity, rest days, penalties, messaging tone
- Difficulty changeable at any time
- Difficulty change history logged with reasons

**FR-018: Difficulty-Based Behavior**
- System shall adjust UI messaging based on selected difficulty:
  - Easy: Encouraging, supportive tone
  - Medium: Balanced accountability
  - Sergeant: Strict, no-excuses tone
  - Beast: Aggressive, demanding tone
- Workout parameters scale with difficulty (duration, intensity RPE targets)

### Sharing & Collaboration

**FR-019: Invite System**
- Users shall invite others via email
- Access levels: View Only, Comment, Full Access
- Invitation acceptance workflow (signup/login + auto-accept)
- Revoke access capability

**FR-020: Shared Access**
- View Only: See workouts, metrics, progress (no modifications)
- Comment: View + add encouragement comments
- Full Access: Edit workouts, modify plans (for training partners)
- Shared users visible in /community section

### Manual Plan Creation

**FR-021: Custom Workout Builder**
- Users shall create manual plans without AI
- Weekly schedule builder (7 days)
- Per-day workout configuration: name, exercises, sets, reps, rest
- Exercise library searchable
- Drag-to-reorder exercises
- Save and activate custom plans

### Equipment Management

**FR-022: Equipment Inventory**
- Users shall maintain inventory of available equipment
- Equipment types: cardio (treadmill, bike, jump rope), free weights (barbell, dumbbells, kettlebells), accessories (bands, TRX, ab wheel), machines (bench, pull-up bar, cable machine), bodyweight only, improvised (bricks, sandbags, water jugs)
- Weight-specific equipment (dumbbells, kettlebells) shall support multiple weight options per item
- Quantity tracking for each equipment type (1-10+ units)
- Condition status: good, fair, broken
- User notes field for equipment details

**FR-023: Equipment CRUD Operations**
- Users shall add new equipment to inventory at any time
- Users shall edit existing equipment (quantity, weight options, condition, notes)
- Users shall remove equipment from inventory (after selling or disposal)
- Equipment inventory accessible via dedicated settings page
- Quick-add functionality for common equipment types

**FR-024: Equipment Selection During Onboarding**
- Onboarding flow shall include equipment selection step
- Visual grid of common equipment types (clickable toggles)
- Weight-specific equipment shall expand to show weight selection interface
- Users may skip equipment setup and configure later
- Default state: no equipment selected (forces intentional choice)

**FR-025: Equipment-Aware AI Plan Generation**
- AI plan generation shall accept equipment filter parameter (boolean)
- When filter enabled: generate workouts using only available equipment
- When filter disabled: generate ideal workouts with substitution suggestions for unavailable equipment
- Generated plans shall include equipment summary: equipment used, equipment not used, substitutions made
- Substitution rationale provided for each alternative exercise

**FR-026: Equipment Validation Service**
- Backend shall validate exercise feasibility against user equipment inventory
- Return: can_perform (boolean), required_equipment (array), missing_equipment (array), substitutions (array)
- Substitutions ranked by: equipment match, muscle group similarity, difficulty equivalence
- Bodyweight alternatives provided when no equipment-based substitute available

**FR-027: Equipment Utilization Tracking**
- System shall track which equipment used in active plan
- Equipment utilization rate calculated: (equipment used / total equipment) × 100
- Display on dashboard: "Using X of Y equipment pieces (Z%)"
- Highlight underutilized equipment with suggestions
- Historical utilization tracking over time (Post-MVP)

## Non-Functional Requirements

### Performance

**NFR-001: Response Time**
- Page load: <2 seconds (initial load)
- API responses: <500ms (database queries)
- AI plan generation: <10 seconds (OpenAI API call)
- Chart rendering: <1 second (with 12 months data)

**NFR-002: Scalability**
- Support 100 concurrent users without degradation
- Database queries optimized with indexes
- Image storage: Up to 100MB per user (progress photos)

### Reliability

**NFR-003: Uptime**
- Target: 99.5% uptime (acceptable downtime: 3.6 hours/month)
- Automated health checks (backend API)
- Database backups: Daily automated
- Rollback capability for failed deployments

**NFR-004: Data Integrity**
- All data mutations logged (audit trail)
- No data loss on failed operations (transactions)
- Validation on all inputs (frontend + backend)
- Consistency checks for related data (e.g., active plan references valid template)

### Security

**NFR-005: Authentication Security**
- Passwords hashed with bcrypt (salt rounds: 12)
- JWT tokens secure (httpOnly cookies for web)
- Token expiry enforced (24 hours)
- Rate limiting on auth endpoints (5 attempts per 15 min)

**NFR-006: Data Privacy**
- User data isolated (no cross-user data leakage)
- Progress photos access-controlled (signed URLs)
- No third-party analytics or tracking
- HTTPS required for all traffic

**NFR-007: API Security**
- OpenAI API key stored in environment variables (never in code)
- API rate limiting to prevent abuse
- Input sanitization to prevent injection attacks
- CORS configured for frontend domain only

### Usability

**NFR-008: Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation supported (all actions accessible)
- Screen reader compatible (semantic HTML, ARIA labels)
- Color contrast ratios: 4.5:1 (text), 3:1 (UI components)
- Touch targets: Minimum 44×44px

**NFR-009: Responsive Design**
- Mobile-first approach
- Breakpoints: Mobile (<640px), Tablet (640-1024px), Desktop (>1024px)
- Touch-friendly interactions (no hover-only functionality)
- Readable text without zooming (minimum 16px base)

**NFR-010: Browser Support**
- Modern browsers: Chrome, Firefox, Safari, Edge (last 2 versions)
- No Internet Explorer support
- Progressive enhancement (core functionality works without JavaScript for critical paths)

### Maintainability

**NFR-011: Code Quality**
- TypeScript strict mode enabled
- ESLint + Prettier configured
- Zero TypeScript compilation errors
- Test coverage: ≥85% for critical paths
- Component documentation (purpose, props, behavior)

**NFR-012: Documentation**
- API endpoints documented (request/response schemas)
- Database schema documented with relationships
- Deployment procedures documented
- Environment setup instructions complete

### Compatibility

**NFR-013: Platform Support**
- Web application (primary)
- Mobile web responsive (full functionality)
- Native mobile app: Post-MVP (React Native)
- Desktop PWA capability (optional install)

**NFR-014: Data Portability**
- Export functionality: JSON and CSV formats
- Import from export files (user migration)
- No vendor lock-in (MongoDB can be replaced with schema migration)

**NFR-015: Equipment Data Validation**
- Weight values validated: 2.5kg-100kg for dumbbells, 4kg-100kg for kettlebells, 5kg-200kg for barbells
- Quantity limited: 1-10 per equipment type
- Equipment type must match predefined catalog
- Invalid equipment types rejected with suggested alternatives
- Duplicate equipment entries prevented (same type + weight combination)

## MVP vs Post-MVP

### MVP Scope (Weeks 1-10)

**Core Features:**
- Authentication (signup, login, logout)
- Profile creation and management
- Equipment inventory management (add, edit, delete, onboarding setup)
- Equipment-aware AI plan generation (workouts only)
- Workout logging
- Body metrics tracking
- Basic accountability (missed detection, penalties, streaks)
- Difficulty modes (all 4 levels)
- Dashboard with today's workout
- Progress charts (5 core types)
- Manual plan builder (basic)
- Equipment utilization tracking (basic)

**Excluded from MVP:**
- Sharing/collaboration features
- Nutrition tracking
- Notifications (email/SMS)
- Achievement badges
- Advanced analytics (exercise-specific trends)
- Mobile app
- Wearable integration

### Post-MVP Phase 1 (Weeks 11-16)

**Add:**
- Sharing with friends/family (invite system, access levels)
- Achievement badges system
- Notifications (email for missed workouts, daily reminders)
- Nutrition tracking (basic meal logging, macro tracking)
- Advanced analytics (per-exercise strength progression)
- Equipment recommendations based on goals and current inventory

### Post-MVP Phase 2 (Months 4-6)

**Add:**
- Adaptive plan adjustments (AI analyzes performance, suggests changes)
- Exercise library with video demonstrations
- Mobile app (React Native)
- Recovery recommendations (deload weeks, mobility work)
- Subscription management (if monetizing)

### Post-MVP Phase 3 (Months 7-12)

**Add:**
- Form check assistance (video upload + AI analysis)
- Wearable integration (Apple Health, Google Fit)
- Injury prevention patterns (overtraining detection)
- Community challenges (private, small-group)
- Advanced periodization (block periodization models)

## Acceptance Criteria

### Authentication & Onboarding

**AC-001:**
- Given a new user, when they complete signup, then account is created and JWT token issued
- Given valid credentials, when user logs in, then session established and redirected to dashboard
- Given invalid credentials, when user attempts login, then error message displayed

**AC-002:**
- Given a new user, when they complete onboarding wizard (5 steps), then profile created and saved
- Given profile data, when AI generates first plan, then user redirected to dashboard with active plan

### Workout Logging

**AC-003:**
- Given today's scheduled workout, when user logs all exercises with sets/reps/weight, then workout marked complete
- Given completed workout, when saved, then streak increments and volume calculated
- Given perceived difficulty, when logged per exercise, then data stored for future plan adjustments

### Accountability

**AC-004:**
- Given scheduled workout, when 24 hours pass without log entry, then marked as missed
- Given missed workout, when detected, then penalty assigned based on difficulty level
- Given penalty, when user marks complete, then removed from active penalties and stats updated

### AI Plan Generation

**AC-005:**
- Given user profile and plan parameters, when generate plan requested, then OpenAI returns valid JSON within 10 seconds
- Given generated plan, when user accepts, then plan activated and first workout scheduled
- Given OpenAI failure, when API unreachable, then fallback message displayed with manual plan option

### Equipment Management

**AC-006:**
- Given onboarding flow, when user reaches equipment step, then visual grid of equipment types displayed
- Given equipment selection, when user selects dumbbells, then weight options interface expands
- Given equipment inventory, when user adds new equipment, then inventory updated and visible in settings
- Given equipment removal, when user deletes equipment, then item removed from inventory and AI plans reflect change
- Given AI plan generation with equipment filter enabled, when plan generated, then only exercises using available equipment included
- Given AI plan generation with equipment filter disabled, when plan generated, then ideal exercises suggested with substitutions for missing equipment
- Given exercise requiring unavailable equipment, when displayed, then substitution alternatives provided with rationale

### Progress Tracking

**AC-007:**
- Given body metrics logged, when user views timeline, then chart displays weight/measurements over time
- Given 12 weeks of data, when chart renders, then trend line shows overall direction
- Given measurements, when waist decreases and weight decreases, then estimated fat loss calculated

### Difficulty Modes

**AC-008:**
- Given Easy mode selected, when workout missed, then 10min cardio penalty assigned
- Given Sergeant mode selected, when workout missed, then doubled workout or extra session penalty assigned
- Given difficulty changed, when saved, then future workouts and penalties reflect new level

## Platform Support

### Web Application (MVP)

**Primary Platform:**
- Responsive web app (React + TypeScript)
- Mobile-first design (80% of usage expected on mobile)
- Desktop experience optimized for data entry and chart viewing
- No app store distribution required

**Browser Requirements:**
- Chrome/Edge (Chromium): Full support
- Safari (iOS/macOS): Full support
- Firefox: Full support
- Mobile browsers: Safari (iOS), Chrome (Android)

### Mobile Expectations (MVP)

**Touch Interactions:**
- All buttons minimum 44×44px tap targets
- Swipe gestures for navigation (optional, not required)
- No hover-dependent functionality
- Form inputs optimized for mobile keyboards (type="number" for weights, etc.)

**Performance:**
- Initial load <3 seconds on 4G connection
- Smooth scrolling (60fps)
- Lazy loading for images (progress photos)
- Offline support: Post-MVP (service workers)

**Screen Sizes:**
- Minimum: 320px width (iPhone SE)
- Optimal: 375-428px (modern smartphones)
- Tablet: 768-1024px (iPad)
- Desktop: 1280px+ (optimal data visualization)

### Native Mobile App (Post-MVP)

**Platform:**
- React Native (shared codebase with web)
- iOS: 15.0+
- Android: API 26+ (Android 8.0+)

**Native Features:**
- Push notifications (workout reminders)
- Camera access (progress photos)
- Health app integration (Apple Health, Google Fit)
- Offline workout logging (sync when online)

**Distribution:**
- iOS: TestFlight (beta), App Store (public)
- Android: Google Play (internal test, then production)

### Data Synchronization

**Cross-Device:**
- Web and mobile share same backend (real-time sync)
- User logs workout on mobile → immediately visible on web
- No device-specific data silos

**Offline Capability (Post-MVP):**
- Workouts logged offline → queued for sync
- View cached plans and history offline
- Conflict resolution: Last write wins (simple strategy)

## Constraints

### Technical Constraints

**TC-001: Solo Development**
- All development by single founder initially
- Technology choices favor rapid development over cutting-edge
- Maintenance burden must remain low (<5 hours/week post-launch)

**TC-002: Budget**
- Hosting: <$50/month for MVP (10 users)
- API costs: <$50/month (OpenAI usage)
- Total infrastructure: <$100/month target

**TC-003: AI Reliability**
- OpenAI API may fail or return invalid JSON
- Fallback to manual plan creation required
- User should never be blocked by AI failure

### Regulatory Constraints

**RC-001: Health Disclaimers**
- App must display: "This is not medical advice. Consult doctor before starting."
- No diagnosis, treatment, or medical claims
- User assumes risk for workout safety

**RC-002: Data Privacy**
- GDPR compliance not required initially (personal use)
- Data export capability provided (user ownership)
- Clear privacy policy before scaling to public

### User Constraints

**UC-001: Experience Level**
- App assumes basic fitness knowledge (users know what "bench press" means)
- Exercise form not taught (external resources linked)
- Users responsible for proper technique

**UC-002: Equipment Access**
- Plans assume equipment availability as specified in profile
- App does not verify equipment access (user honesty required)

## Dependencies

### External Services

**DEP-001: OpenAI API**
- Required for: Workout plan generation, nutrition recommendations
- Fallback: Manual plan builder if API unavailable
- Rate limits: Monitored to avoid quota exhaustion

**DEP-002: MongoDB Atlas**
- Required for: All data persistence
- Backup: Daily automated snapshots
- Migration: Schema documented for portability

**DEP-003: Image Storage (AWS S3 or Cloudinary)**
- Required for: Progress photo uploads
- Fallback: Disable photo uploads if service unavailable (non-blocking)

**DEP-004: Email Service (SendGrid - Post-MVP)**
- Required for: Notifications, invitations
- Fallback: In-app notifications only if email fails

### Internal Dependencies

**DEP-005: Authentication Must Precede All Features**
- No workout logging without authenticated user
- No plan generation without profile data
- No sharing without user account

**DEP-006: Profile Required for AI**
- OpenAI cannot generate plans without complete profile
- Onboarding must be completed before plan generation
- Partial profiles blocked from AI features

**DEP-007: Active Plan Required for Accountability**
- Missed workout detection requires scheduled workouts
- Streaks require active plan with scheduled training days
- Penalties cannot be assigned without defined workout schedule
