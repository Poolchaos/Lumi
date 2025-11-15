import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, refresh } from '../controllers/authController';

const router = Router();

// Signup route
router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ],
  signup
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  login
);

// Refresh token route
router.post('/refresh', refresh);

export default router;
