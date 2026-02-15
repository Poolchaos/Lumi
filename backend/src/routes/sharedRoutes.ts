/**
 * Copyright (c) 2025-2026 Phillip-Juan van der Berg. All Rights Reserved.
 *
 * This file is part of Lumi.
 *
 * Lumi is licensed under the PolyForm Noncommercial License 1.0.0.
 * You may not use this file except in compliance with the License.
 *
 * Commercial use requires a separate paid license.
 * Contact: phillipjuanvanderberg@gmail.com
 *
 * See the LICENSE file for the full license text.
 */

import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, optionalAuth } from '../middleware/auth';
import {
  createShare,
  getSharedPlan,
  importSharedPlan,
  getUserShares,
  deleteShare,
} from '../controllers/sharedController';

const router = Router();

// Validation rules
const createShareValidation = [
  body('planId')
    .notEmpty()
    .withMessage('Plan ID is required')
    .isMongoId()
    .withMessage('Invalid plan ID'),
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),
];

const shareCodeValidation = [
  param('code')
    .notEmpty()
    .withMessage('Share code is required')
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage('Share code must be 6 characters'),
];

// Create a new share (requires auth)
router.post('/create', authenticate, createShareValidation, createShare);

// Get user's shares (requires auth)
router.get('/my-shares', authenticate, getUserShares);

// Get shared plan by code (public, optional auth for personalization)
router.get('/:code', optionalAuth, shareCodeValidation, getSharedPlan);

// Import a shared plan (requires auth)
router.post('/:code/import', authenticate, shareCodeValidation, importSharedPlan);

// Delete a share (requires auth, only creator)
router.delete('/:code', authenticate, shareCodeValidation, deleteShare);

export default router;
