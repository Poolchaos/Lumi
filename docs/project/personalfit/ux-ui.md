# PersonalFit: UX/UI Design

## Navigation Model

### Primary Navigation Structure

**Desktop: Persistent Sidebar (Left)**
```
[Logo: PersonalFit]

Dashboard
Workouts
  › Today
  › Log
  › History
  › Stats
Plans
  › Current
  › Generate
  › Manual
Metrics
  › Log Entry
  › Timeline
  › Charts
Accountability
  › Weekly Status
  › Penalties
Settings
  › Profile
  › Difficulty
  › Sharing

[User Avatar]
[Theme Toggle]
```

**Mobile: Bottom Tab Bar + Hamburger Menu**
```
Bottom Tabs (Primary):
[Dashboard] [Workouts] [Metrics] [More]

Hamburger Menu (Secondary):
- Plans
- Accountability
- Settings
- Help
- Logout
```

**Breadcrumb Navigation (Desktop):**
```
Dashboard > Workouts > History > Dec 2024
```

### Navigation Patterns

**Quick Actions (Floating Action Button - Mobile):**
- Primary: "Log Today's Workout"
- Contextual: Appears on Dashboard, Workouts, Today pages
- Position: Bottom-right corner (60px diameter)
- Color: Primary accent (energetic orange)

**Back Navigation:**
- Desktop: Breadcrumbs + back button in content header
- Mobile: Native back button + in-app back arrow (top-left)
- Browser back button supported (proper routing history)

**Deep Linking:**
- Shareable workout URLs: `/workouts/log/[date]`
- Plan detail URLs: `/plans/[plan_id]`
- Metric timeline URLs: `/metrics/timeline?start=[date]&end=[date]`

## Page/Screen Flow

### Dashboard Flow (Home)

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Header: "Welcome back, [Name]"              │
│ Subtitle: "Today is [Day], [Date]"          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ TODAY'S WORKOUT CARD (Hero)                 │
│ ┌─────────────────────────────────────────┐ │
│ │ Chest & Triceps                         │ │
│ │ Status: Not Started                     │ │
│ │ Duration: ~60 min | 8 exercises         │ │
│ │ [Start Workout] [View Details]          │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌───────────────┬───────────────┬─────────────┐
│ WEEKLY STATUS │ STREAK        │ WEIGHT      │
│ 3/4 workouts  │ 12 days 🔥    │ 85kg        │
│ 75% complete  │ Longest: 28   │ -1kg (2wks) │
└───────────────┴───────────────┴─────────────┘

┌─────────────────────────────────────────────┐
│ UPCOMING THIS WEEK                          │
│ Mon: Chest & Triceps ✓ (Completed)         │
│ Wed: Back & Biceps (Today)                  │
│ Fri: Legs (Scheduled)                       │
│ Sun: Full Body (Scheduled)                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ QUICK PROGRESS (Mini Charts)               │
│ [Weight trend line] [Consistency heatmap]   │
└─────────────────────────────────────────────┘
```

### Workout Logging Flow

**Step 1: Today's Workout Overview**
```
[Header: Chest & Triceps - Monday, Dec 16]
[Estimated Duration: 60 min | 8 exercises]

Exercise List (Collapsed):
1. Barbell Bench Press (4×6-8)
2. Incline Dumbbell Press (3×8-10)
3. Cable Flyes (3×12-15)
...

[Start Workout] [View Video Demos]
```

**Step 2: Exercise Logging (Expanded View)**
```
Exercise 1 of 8: Barbell Bench Press
Target: 4 sets × 6-8 reps, 120s rest
[Video Link] [Notes from last session]

Set 1: [70] kg × [8] reps [✓ Complete]
Set 2: [70] kg × [7] reps [✓ Complete]
Set 3: [70] kg × [6] reps [✓ Complete]
Set 4: [70] kg × [6] reps [✓ Complete]

Perceived Difficulty: [Slider: 1────●────10]
Notes: [Text area]

[Copy from Last Session] [Skip Exercise]
[Next Exercise →]
```

**Step 3: Workout Completion**
```
Workout Complete!

Summary:
- Total Time: 62 minutes
- Total Volume: 8,450 kg
- Sets Completed: 24/24
- Difficulty: Average 6/10

[Save & Finish] [Add Notes]
```

### AI Plan Generation Flow

**Step 1: Plan Parameters**
```
Generate New Workout Plan

Training Phase:
○ Hypertrophy  ○ Strength  ○ Fat Loss  ○ Endurance

Duration:
○ 4 weeks  ○ 8 weeks  ○ 12 weeks

Focus Areas (select multiple):
☑ Full Body  ☐ Chest  ☑ Arms  ☐ Legs  ☐ Core

Difficulty: [Current: Sergeant]
Use current difficulty or override:
○ Current  ○ Easy  ○ Medium  ○ Sergeant  ○ Beast

[Generate Plan] (AI will take 5-10 seconds)
```

**Step 2: AI Processing**
```
[Animated spinner]

AI is creating your personalized plan...
Analyzing your profile and goals...
Building optimal workout schedule...
Calculating nutrition targets...

(Progress indicator: 5-10 seconds)
```

**Step 3: Plan Review**
```
Generated Plan: 4-Week Hypertrophy + Arm Focus

AI Rationale:
"At your fitness level and goals, a 4-day split focusing
on compound movements with caloric deficit supports fat
loss while maintaining arm muscle. Progressive overload
on isolation exercises ensures arm growth."

Weekly Schedule:
Mon: Chest & Triceps (60 min)
Wed: Back & Biceps (60 min)
Fri: Legs (70 min)
Sun: Full Body (60 min)

Total: 8 exercises per session, 4 sessions/week

Nutrition:
- Calories: 2,400/day
- Protein: 180g | Carbs: 240g | Fat: 80g

[Accept Plan] [Regenerate] [Edit Manually] [Cancel]
```

**Step 4: Plan Activation**
```
Plan Activated!

Your first workout is scheduled for Monday.
We'll notify you at 07:00.

[Go to Dashboard] [View Full Plan]
```

### Metrics Logging Flow

**Entry Form:**
```
Log Body Metrics

Date: [Dec 16, 2024]

Weight: [85.0] kg
Body Fat %: [19.0] % (optional)

Measurements (cm):
Chest:  [103] cm
Waist:  [87] cm
Hips:   [98] cm
Arm:    [35.2] cm (right)
Thigh:  [59] cm (right)
Calf:   [38] cm (right)

Progress Photo: [Upload] or [Take Photo]

Notes:
[Text area]

[Save Entry]
```

**After Save - Change Summary:**
```
Metrics Saved!

Changes from last entry (2 weeks ago):
- Weight: -0.5kg (85.5 → 85.0)
- Waist: -1cm (88 → 87) ✓
- Arm: +0.2cm (35.0 → 35.2) ✓
- Body fat: -0.5% (19.5 → 19.0)

Interpretation:
"Excellent progress! You've lost fat (waist down)
while gaining muscle (arm up, weight stable)."

[View Timeline] [Back to Dashboard]
```

### Accountability Dashboard Flow

**Weekly Status View:**
```
┌─────────────────────────────────────────────┐
│ DRILL SERGEANT REPORT                       │
│ Week: Dec 16-22, 2024                       │
└─────────────────────────────────────────────┘

WORKOUTS:
✓ Monday: Chest & Triceps (Completed)
✓ Wednesday: Back & Biceps (Completed)
✗ Friday: Legs (MISSED)
○ Sunday: Full Body (Scheduled)

STATUS: 2/3 workouts complete (66%)
STREAK: 7 days (Don't break it!)

┌─────────────────────────────────────────────┐
│ ⚠️  PENALTIES                                │
│ ┌─────────────────────────────────────────┐ │
│ │ Missed: Friday Legs                     │ │
│ │ Penalty: Extra 30min cardio             │ │
│ │ Due: Sunday before Full Body workout    │ │
│ │ [Mark Complete]                         │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

SERGEANT'S MESSAGE:
"7-day streak! Only 1 missed workout this week.
Complete that penalty before Sunday or face
another. Arm volume up 2,500kg vs. last week.
Keep grinding."

[View Full Stats] [Adjust Difficulty]
```

## UX Principles Applied

### Jakob's Law: Familiarity
- Sidebar navigation (familiar from Notion, Slack, Linear)
- Card-based layouts (familiar from mobile apps)
- Standard form patterns (labels above inputs)
- Modal confirmations for destructive actions

### Hick's Law: Reduce Choices
- Dashboard shows only today's workout (not entire week)
- AI plan generation: 4 parameters (not 20)
- Difficulty modes: 4 options (not a spectrum)
- Primary actions highlighted, secondary actions muted

### Fitts's Law: Target Size
- Buttons minimum 44×44px (touch-friendly)
- Primary actions larger and centered
- Destructive actions smaller and to the side
- Clickable areas extend beyond visible borders

### Miller's Law: Cognitive Load
- Dashboard shows 3-5 key metrics (not 15)
- Workout logging: One exercise at a time (not entire list)
- Progressive disclosure: Details hidden until needed
- Chunking: Stats grouped by category (weekly, monthly, all-time)

### Peak-End Rule: Memorable Moments
- Workout completion celebration (confetti, success message)
- Streak milestones (badges, visual feedback)
- Progress comparisons ("You've lost 3kg fat!")
- Penalty completion clearance (relief moment)

### Serial Position Effect: Information Hierarchy
- Most important on top: Today's workout on dashboard
- Recent items first: Workout history reverse chronological
- Critical actions first: [Complete] before [Cancel]

### Von Restorff Effect: Make Important Stand Out
- Missed workouts: Red, bold, warning icon
- Streaks: Fire emoji, larger font, animated
- Primary actions: Bright accent color (orange)
- Penalties: Yellow background, alert styling

### Zeigarnik Effect: Incomplete Tasks
- Incomplete workouts visible on dashboard (creates tension)
- Pending penalties always shown (must be cleared)
- Progress bars for weekly completion (visual incompleteness)

## Interaction Patterns

### Form Interactions

**Input Fields:**
- Label above input (always visible)
- Placeholder text for format hints ("85.0")
- Inline validation (on blur, not on every keystroke)
- Error messages below field (red text + icon)
- Success indicators subtle (green border, no text)

**Number Inputs (Weight, Reps):**
- Large touch targets (+/- buttons flanking input)
- Keyboard type: numeric on mobile
- Step increments: 2.5kg for weight, 1 for reps
- Long-press for rapid increment/decrement

**Dropdowns/Selects:**
- Native select on mobile (better UX)
- Custom styled on desktop (visual consistency)
- Search enabled for long lists (exercise library)

**Multi-Select (Goals, Focus Areas):**
- Checkboxes with visual state (checked/unchecked)
- "Select All" / "Clear All" shortcuts
- Visual limit indicator ("Select 3-5 goals")

### Navigation Interactions

**Page Transitions:**
- Instant for same-section navigation
- Fade transition (200ms) for cross-section navigation
- Slide transition (300ms) for modals

**Loading States:**
- Skeleton screens for data fetching (preserve layout)
- Spinners for actions (button disabled, spinner inside)
- Progress bars for AI generation (estimated time shown)

**Error States:**
- Inline errors for form validation
- Toast notifications for API errors (top-right, auto-dismiss 5s)
- Full-page error for critical failures (retry button)

### Workout Logging Interactions

**Set Completion Flow:**
```
User taps weight input → Keyboard appears
User enters weight → Taps reps input
User enters reps → Taps [✓ Complete]
Set row updates: Gray → Green, checkmark visible
Rest timer starts (countdown: 120s)
User can start next set or wait for timer
```

**Copy from Last Session:**
```
User taps [Copy from Last Session]
All sets auto-fill with previous weights/reps
User can edit individual sets if needed
Provides starting point for progressive overload
```

**Perceived Difficulty Slider:**
```
User drags slider (1-10 scale)
Visual feedback: Color changes (green → yellow → red)
Haptic feedback on mobile (if supported)
Value updates immediately
Used by AI for future plan adjustments
```

### Chart Interactions

**Hover/Tap Behavior:**
- Desktop: Hover shows tooltip with exact values
- Mobile: Tap data point shows tooltip (sticky until tap elsewhere)
- Tooltip format: "[Date]: [Value] ([Change])"

**Zoom/Pan:**
- Desktop: Mouse wheel zoom, drag to pan
- Mobile: Pinch zoom, two-finger pan
- Reset button returns to default view

**Filter Controls:**
- Date range selector above chart
- Metric toggle buttons (show/hide lines)
- Comparison mode (overlay two time periods)

### Modal Interactions

**Opening:**
- Triggered by button click or automatic (confirmations)
- Fade-in animation (200ms)
- Focus trapped within modal
- Body scroll disabled

**Closing:**
- [X] button in top-right
- ESC key
- [Cancel] button in footer
- Background click: NO (prevents accidental dismissal)

**Focus Management:**
- First focusable element receives focus on open
- Tab cycles through modal elements only
- On close, focus returns to trigger element

## Layout, Spacing, Responsive Grid

### Grid System (Tailwind-based)

**Breakpoints:**
```
sm: 640px   (Large phones, small tablets)
md: 768px   (Tablets)
lg: 1024px  (Small laptops)
xl: 1280px  (Desktops)
2xl: 1536px (Large desktops)
```

**Container Widths:**
```
Mobile (<640px):    100% width, 16px padding
Tablet (640-1024px): 100% width, 24px padding
Desktop (>1024px):   max-width 1280px, centered, 32px padding
```

**Grid Columns:**
```
Mobile: 1 column (full width)
Tablet: 2 columns (cards side-by-side)
Desktop: 3-4 columns (dashboard cards, workout stats)
```

### Spacing Scale

**Consistent Scale (4px base):**
```
xs:  4px   (tight spacing, icon-text gap)
sm:  8px   (compact, form field gap)
md:  16px  (standard, card padding)
lg:  24px  (generous, section spacing)
xl:  32px  (spacious, page margins)
2xl: 48px  (dramatic, hero sections)
```

**Component-Specific Spacing:**
```
Card padding:        16px mobile, 24px desktop
Button padding:      12px vertical, 24px horizontal
Input padding:       12px vertical, 16px horizontal
Section gaps:        24px mobile, 32px desktop
Page margins:        16px mobile, 32px desktop
```

### Responsive Behavior

**Dashboard Cards:**
```
Mobile:   1 column, full width, stacked
Tablet:   2 columns, 50% width each
Desktop:  3 columns, 33% width each (hero spans 2 columns)
```

**Workout Logging:**
```
Mobile:   Single column, exercise-by-exercise
Tablet:   Single column (portrait), 2 columns (landscape)
Desktop:  Sidebar (exercise list) + main (current exercise detail)
```

**Charts:**
```
Mobile:   Full width, reduced height (300px)
Tablet:   Full width, standard height (400px)
Desktop:  2-up or 3-up grid, taller (500px)
```

**Navigation:**
```
Mobile:   Bottom tab bar (4 items) + hamburger menu
Tablet:   Sidebar (collapsible) + bottom bar (optional)
Desktop:  Persistent sidebar + top header
```

### Typography Responsive Scaling

```
                Mobile      Desktop
Page Title:     28px (1.75rem)  36px (2.25rem)
Section Header: 20px (1.25rem)  24px (1.5rem)
Card Title:     18px (1.125rem) 20px (1.25rem)
Body Text:      16px (1rem)     16px (1rem)
Caption:        14px (0.875rem) 14px (0.875rem)
```

## Design System Usage

### Color System

**Primary Colors:**
```
primary-50:  #EFF6FF  (lightest blue)
primary-100: #DBEAFE
primary-500: #3B82F6  (main blue)
primary-700: #1D4ED8  (dark blue)
primary-900: #1E3A8A  (darkest blue)
```

**Accent Colors:**
```
accent-50:  #FFF7ED  (lightest orange)
accent-100: #FFEDD5
accent-500: #F97316  (main orange)
accent-700: #C2410C  (dark orange)
accent-900: #7C2D12  (darkest orange)
```

**Semantic Colors:**
```
success: #22C55E  (green)
warning: #F59E0B  (amber)
danger:  #EF4444  (red)
info:    #3B82F6  (blue)
```

**Neutral Palette:**
```
Light Theme:
  - Text primary: #1E293B (slate-800)
  - Text secondary: #64748B (slate-500)
  - Border: #E2E8F0 (slate-200)
  - Background: #F8FAFC (slate-50)

Dark Theme:
  - Text primary: #F1F5F9 (slate-100)
  - Text secondary: #94A3B8 (slate-400)
  - Border: #334155 (slate-700)
  - Background: #0F172A (slate-900)
```

### Component Tokens

**Buttons:**
```
Primary:
  - Background: accent-500
  - Text: white
  - Hover: accent-600
  - Active: accent-700
  - Disabled: slate-300

Secondary:
  - Background: transparent
  - Text: primary-500
  - Border: primary-500
  - Hover: primary-50
  - Active: primary-100

Danger:
  - Background: danger-500
  - Text: white
  - Hover: danger-600
```

**Cards:**
```
Background: white (light) / slate-800 (dark)
Border: slate-200 (light) / slate-700 (dark)
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Hover Shadow: 0 4px 6px rgba(0,0,0,0.1)
Radius: 8px
```

**Inputs:**
```
Background: white (light) / slate-900 (dark)
Border: slate-300 (light) / slate-600 (dark)
Focus Border: primary-500
Radius: 6px
Text: slate-900 (light) / slate-100 (dark)
```

### Icon System

**Icon Library: Lucide React**
- Consistent 24×24px default size
- 2px stroke width
- Outlined style (not filled)

**Icon Usage:**
```
Navigation: 20×20px
Buttons: 16×16px (with text), 20×20px (icon-only)
Status indicators: 16×16px
Hero sections: 32×32px
```

**Icon Colors:**
```
Default: Inherit text color
Success: success-500
Warning: warning-500
Danger: danger-500
Muted: slate-400
```

## Theming Rules (Light/Dark)

### Theme Toggle

**Implementation:**
- System preference detection (default)
- Manual override in Settings
- Preference saved to localStorage
- Instant switch (no page reload)

**Toggle UI:**
```
[☀️ Light] [🌙 Dark] [💻 System]
```

### Color Mappings

**Background Hierarchy:**
```
                Light           Dark
Canvas:         slate-50        slate-900
Surface:        white           slate-800
Elevated:       white           slate-700
Overlay:        white           slate-800
```

**Text Hierarchy:**
```
                Light           Dark
Primary:        slate-900       slate-50
Secondary:      slate-600       slate-300
Tertiary:       slate-500       slate-400
Disabled:       slate-400       slate-500
```

**Interactive Elements:**
```
                Light           Dark
Primary Action: accent-500      accent-400
Hover:          accent-600      accent-300
Border:         slate-300       slate-600
Focus Ring:     primary-500     primary-400
```

### Theme-Specific Adjustments

**Shadows:**
```
Light: rgba(0,0,0,0.1)  (subtle)
Dark:  rgba(0,0,0,0.5)  (stronger for contrast)
```

**Borders:**
```
Light: 1px solid (visible separation)
Dark:  1px solid (lighter to avoid harshness)
```

**Images:**
```
Light: No filter
Dark:  brightness(0.9) (reduce glare)
```

## Accessibility Considerations

### Keyboard Navigation

**Tab Order:**
- Logical flow: Top to bottom, left to right
- Skip links: "Skip to main content" at page top
- Focus visible: 2px primary-500 outline on all interactive elements
- No keyboard traps (except intentional: modals)

**Keyboard Shortcuts (Optional):**
```
/ : Focus search
n : New workout log
p : Generate plan
s : Open settings
? : Help overlay
```

### Screen Reader Support

**Semantic HTML:**
```html
<header> - Site header with navigation
<nav> - Navigation menus
<main> - Primary content
<article> - Workout logs, plan details
<aside> - Sidebar, related content
<footer> - Site footer
```

**ARIA Labels:**
```html
<!-- Icon-only buttons -->
<button aria-label="Close modal">×</button>

<!-- Status indicators -->
<div role="status" aria-live="polite">
  Workout logged successfully
</div>

<!-- Loading states -->
<div role="alert" aria-busy="true">
  Generating plan...
</div>
```

**Alt Text:**
```html
<!-- Progress photos -->
<img src="photo.jpg" alt="Progress photo from Dec 16, 2024 - front view" />

<!-- Charts -->
<img src="chart.png" alt="Weight trend chart showing 2kg loss over 8 weeks" />
```

### Color Contrast

**WCAG 2.1 AA Requirements:**
- Text (regular): 4.5:1 contrast ratio
- Text (large 18px+): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

**Tested Combinations:**
```
✓ slate-900 on white: 17.5:1 (excellent)
✓ slate-700 on white: 10.1:1 (excellent)
✓ slate-600 on white: 7.5:1 (good)
✓ primary-500 on white: 4.6:1 (pass)
✓ accent-500 on white: 4.1:1 (pass)
```

**Dark Theme Adjustments:**
- Higher luminosity for text colors
- Reduced contrast to prevent eye strain
- Accent colors lightened for visibility

### Focus Indicators

**Visible Focus:**
```css
:focus-visible {
  outline: 2px solid primary-500;
  outline-offset: 2px;
}
```

**Focus Within (for containers):**
```css
.card:focus-within {
  border-color: primary-500;
  box-shadow: 0 0 0 3px primary-100;
}
```

### Motion Preferences

**Respect User Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Alternative Feedback:**
- Animations disabled → Instant state changes
- Loading spinners → Static progress text
- Transitions → Immediate rendering

### Touch Target Sizes

**Minimum Sizes (WCAG 2.5.5):**
- Buttons: 44×44px minimum
- Links: 24px height minimum (with padding)
- Form inputs: 44px height
- Icon buttons: 44×44px (visual 20×20px, padding adds space)

**Spacing Between Targets:**
- Minimum 8px gap between interactive elements
- 16px preferred for primary actions

### Error Prevention

**Form Validation:**
- Inline validation on blur (not on every keystroke)
- Clear error messages ("Weight must be between 30-300kg")
- Prevention before submission (disabled submit if invalid)

**Confirmations:**
- Destructive actions: Modal confirmation required
- Reversible actions: Toast with undo option (5s)
- Critical data loss: "Are you sure? This cannot be undone."

### Language & Readability

**Plain Language:**
- Avoid jargon (unless fitness-standard terms)
- Short sentences (<20 words preferred)
- Active voice ("You completed 3 workouts" not "3 workouts were completed")

**Consistent Terminology:**
- "Workout" not "training session" or "exercise session"
- "Log" not "record" or "track"
- "Plan" not "program" or "routine"

**Reading Level:**
- Target: 8th-grade reading level (Flesch-Kincaid)
- Fitness terms assumed (user is fitness-literate)
- Definitions provided on first use (tooltips)
