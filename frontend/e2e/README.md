# E2E Testing with Playwright

This directory contains end-to-end tests for the Lumi frontend application.

## Test Structure

- `auth.spec.ts` - Authentication flow (signup, login, logout, protected routes)
- `profile.spec.ts` - Profile management (personal info, fitness preferences)
- `equipment.spec.ts` - Equipment CRUD operations
- `metrics.spec.ts` - Body metrics tracking and progress photos
- `workouts.spec.ts` - Workout generation and management
- `accountability.spec.ts` - Accountability system (streaks, penalties, progress)
- `helpers.ts` - Shared test utilities and helper functions

## Running Tests

**Prerequisites:**
- Backend must be running on `http://localhost:5000`
- Database must be accessible
- Frontend dev server will start automatically

**Run all tests:**
```bash
npm run test:e2e
```

**Run with UI mode (interactive):**
```bash
npm run test:e2e:ui
```

**Run in headed mode (see browser):**
```bash
npm run test:e2e:headed
```

**Debug tests:**
```bash
npm run test:e2e:debug
```

**Run specific test file:**
```bash
npx playwright test auth.spec.ts
```

**Run specific test:**
```bash
npx playwright test -g "should register a new user"
```

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Configuration

Tests are configured in `playwright.config.ts`:
- Tests run in Chromium browser
- Sequential execution (not parallel) to avoid database conflicts
- Screenshots captured on failure
- Trace recorded on first retry

## Writing Tests

Each test suite:
1. Creates a unique test user with timestamp-based email
2. Registers and logs in before each test
3. Performs isolated test actions
4. Cleans up automatically (users remain in test database)

**Test user isolation:**
- Each test uses unique email addresses to avoid conflicts
- Format: `{suite}-test-{timestamp}@example.com`
- Password: `Test123456` (meets validation requirements)

## Test Coverage

✅ **Authentication:** 6 tests
- User registration with validation
- Login/logout flow
- Protected route enforcement
- Password strength validation
- Credential error handling

✅ **Profile Management:** 2 tests
- Personal information updates
- Fitness preferences configuration

✅ **Equipment Management:** 5 tests
- Add equipment
- Edit equipment
- Delete equipment
- Multiple items handling
- Empty state display

✅ **Body Metrics:** 3 tests
- Metrics entry
- Progress photo upload
- Metrics history

✅ **Workouts:** 4 tests
- Workout generation form
- AI workout generation (requires OpenAI API key)
- Workout library display
- Form validation

✅ **Accountability:** 4 tests
- Dashboard display
- Streak tracking
- Penalty system
- Weekly progress

**Total: 24 E2E tests covering critical user flows**

## CI/CD Integration

Tests can be run in CI with:
```bash
npx playwright install --with-deps
npm run test:e2e
```

Set `CI=true` environment variable for:
- No server reuse
- 2 retries on failure
- Stricter test-only mode enforcement

## Known Limitations

1. **Photo upload tests:** Use placeholder SVG file (vite.svg) - real image testing requires test fixtures
2. **AI workout generation:** Requires valid `OPENAI_API_KEY` environment variable in backend
3. **Database cleanup:** Test users remain in database after tests (manual cleanup needed for production)
4. **Sequential execution:** Tests run one at a time to avoid race conditions with shared backend

## Troubleshooting

**Tests fail with timeout:**
- Ensure backend is running on port 5000
- Check MongoDB connection
- Verify MinIO service is healthy

**CORS errors:**
- Confirm backend `CORS_ORIGIN` includes `http://localhost:5173`

**Authentication fails:**
- Check JWT secrets are configured
- Verify password meets requirements (8+ chars, upper, lower, number)

**Photo upload fails:**
- Ensure `frontend/public/vite.svg` exists
- Check MinIO service is accessible
