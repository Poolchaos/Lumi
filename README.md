# PersonalFit

**Self-hosted fitness tracking application with AI-powered workout generation**

Zero cost • Full privacy • Complete control

---

## 🚀 Features

### ✅ Complete Feature Set
- **User Authentication** - JWT-based with refresh tokens
- **Profile Management** - Goals, preferences, measurements
- **Equipment Inventory** - Track your gym equipment
- **AI Workout Generation** - OpenAI/Anthropic/OpenRouter integration
- **Workout Sessions** - Log and track workouts
- **HIIT Intervals** - Built-in interval timer
- **Body Metrics** - Weight, body fat, measurements tracking
- **Progress Photos** - Upload front/side/back photos to MinIO
- **Accountability System** - Streak tracking with penalties
- **Automated Detection** - Daily cron job for missed workouts

### 🎨 Modern Tech Stack

**Backend:**
- Node.js 20 + Express 5 + TypeScript
- MongoDB 7.0 for data storage
- MinIO for S3-compatible photo storage
- JWT authentication with refresh tokens
- Multi-provider AI (OpenAI, Anthropic, OpenRouter)
- Automated cron scheduling
- 172/172 tests passing

**Frontend:**
- React 18 + TypeScript
- Vite for fast development
- TailwindCSS 3 for styling
- React Router 6 + TanStack Query
- Zustand for state management
- Responsive design

---

## 📦 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend development)

### 1. Clone Repository
```bash
git clone https://github.com/Poolchaos/PersonalFit.git
cd PersonalFit
```

### 2. Start Backend Services (Docker)
```bash
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- MinIO on ports 9002 (API) and 9003 (Console)
- Backend API on port 5000

### 3. Start Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

### 4. Access the Application
- **Web App**: http://localhost:5173
- **API**: http://localhost:5000
- **MinIO Console**: http://localhost:9003 (minioadmin/minioadmin123)

---

## 🎯 Usage

1. **Sign Up**: Create account at http://localhost:5173/signup
2. **Set Profile**: Add your fitness goals and preferences
3. **Add Equipment**: List your available gym equipment
4. **Generate Workout**: Click "Generate AI Workout" (requires OpenAI API key)
5. **Track Progress**: Log body metrics and upload progress photos
6. **Build Streaks**: Complete workouts to build your streak!

---

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```bash
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/personalfit

# JWT Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_REFRESH_EXPIRES_IN=7d

# Encryption
ENCRYPTION_SECRET=your-encryption-key-here

# CORS (Frontend URL)
CORS_ORIGIN=http://localhost:5173

# AI Provider (Optional - for workout generation)
OPENAI_API_KEY=sk-your-key-here
# Or use Anthropic:
# ANTHROPIC_API_KEY=sk-ant-your-key-here
# Or use OpenRouter:
# OPENROUTER_API_KEY=sk-or-your-key-here

# MinIO Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_EXTERNAL_URL=http://localhost:9002
```

### Frontend Environment Variables

Create `frontend/.env`:

```bash
VITE_API_URL=http://localhost:5000
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

**Status**: ✅ 172/172 tests passing

### Manual API Testing
```bash
# Test script included
.\test-api.ps1
```

---

## 📁 Project Structure

```
PersonalFit/
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   └── config/         # Configuration
│   ├── tests/              # Jest tests
│   ├── Dockerfile
│   └── package.json
├── frontend/                # React app
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── store/         # Zustand state
│   │   └── types/         # TypeScript types
│   ├── public/
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── test-api.ps1           # API test script
└── README.md              # This file
```

---

## 🐳 Docker Services

| Service | Port | Container | Description |
|---------|------|-----------|-------------|
| Backend | 5000 | personalfit-backend | Node.js API |
| MongoDB | 27017 | personalfit-mongodb | Database |
| MinIO API | 9002 | personalfit-minio | Object storage |
| MinIO Console | 9003 | personalfit-minio | Admin UI |

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend

# Stop all services
docker-compose down

# Reset everything (⚠️ deletes data)
docker-compose down -v
```

---

## 🔧 Development

### Backend Development
```bash
cd backend
npm install
npm run dev        # Hot reload with nodemon
npm test          # Run tests
npm run build     # Build for production
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev       # Dev server on :5173
npm run build     # Production build
npm run preview   # Preview production build
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `PUT /api/profile/preferences` - Update preferences

### Equipment
- `GET /api/equipment` - List equipment
- `POST /api/equipment` - Add equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Workouts
- `POST /api/workouts/generate` - Generate AI workout
- `GET /api/workouts` - List workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get workout details

### Metrics
- `GET /api/metrics` - List body metrics
- `POST /api/metrics` - Add metrics
- `PUT /api/metrics/:id` - Update metrics

### Photos
- `POST /api/photos/upload` - Upload progress photo
- `GET /api/photos` - List photos
- `DELETE /api/photos/:userId/:type/:timestamp` - Delete photo

### Accountability
- `GET /api/accountability/status` - Get streak & stats
- `GET /api/accountability/penalties` - List penalties
- `PUT /api/accountability/penalties/:id/complete` - Complete penalty

### Sessions
- `GET /api/sessions` - List workout sessions
- `POST /api/sessions` - Log workout session
- `PUT /api/sessions/:id` - Update session

---

## 🚢 Production Deployment

### 1. Build Frontend
```bash
cd frontend
npm run build
# Output: dist/
```

### 2. Update Environment Variables
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure production MongoDB URI
- Set production CORS origin
- Add real API keys

### 3. Deploy Options

**Option A: Docker Compose (Recommended)**
- Update `docker-compose.yml` for production
- Add nginx service for frontend
- Configure SSL/TLS
- Use environment file for secrets

**Option B: Separate Hosting**
- Backend: Deploy to any Node.js host (Heroku, Render, VPS)
- Frontend: Deploy to Netlify, Vercel, or Cloudflare Pages
- Database: MongoDB Atlas or self-hosted
- Storage: MinIO on VPS or cloud provider

### 4. Security Checklist
- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up backups (MongoDB + MinIO)
- [ ] Enable rate limiting
- [ ] Configure CORS for production domain
- [ ] Review and remove test data

---

## 🔒 Security Features

- Bcrypt password hashing
- JWT with automatic refresh
- Protected API routes
- CORS configuration
- Input validation (Joi)
- File type validation
- XSS protection
- SQL injection protection (Mongoose)

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

This is a personal project, but suggestions and issues are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📚 Documentation

- **Backend Tests**: See `backend/tests/`
- **API Testing**: See `DOCKER_TESTING.md`
- **Test Results**: See `DOCKER_TEST_RESULTS.md`
- **Frontend Guide**: See `FRONTEND_COMPLETE.md`

---

## 🐛 Troubleshooting

### CORS Errors
- Check `CORS_ORIGIN` in backend matches frontend URL
- Restart backend: `docker-compose restart backend`

### Authentication Issues
- Clear browser localStorage
- Check JWT secrets are set
- Verify backend is running

### Database Connection Failed
- Check MongoDB container: `docker-compose ps`
- View logs: `docker-compose logs mongodb`

### Photos Not Uploading
- Check MinIO container: `docker-compose ps`
- Verify MinIO credentials in backend `.env`
- Access MinIO console: http://localhost:9003

### Frontend Can't Connect to Backend
- Verify backend is running: `curl http://localhost:5000/health`
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for errors

---

## ⭐ Features Roadmap

- [ ] Playwright E2E tests
- [ ] Workout session timer
- [ ] Exercise library
- [ ] Nutrition tracking
- [ ] Social features
- [ ] Mobile app (React Native)
- [ ] Progressive Web App
- [ ] Dark mode
- [ ] Export data to CSV/PDF

---

## 💡 Why Self-Hosted?

- **Privacy**: Your data stays on your server
- **Cost**: Zero monthly fees (just hosting)
- **Control**: Customize everything
- **Learning**: Great project to understand full-stack development
- **Offline**: Works without internet (after initial load)

---

## 📞 Support

For issues or questions:
1. Check this README
2. Review documentation files
3. Check Docker logs
4. Open an issue on GitHub

---

**Built with ❤️ for fitness enthusiasts who value privacy and control**

**Status**: ✅ Production Ready | 🧪 172/172 Tests Passing | 🎨 Full Frontend UI
