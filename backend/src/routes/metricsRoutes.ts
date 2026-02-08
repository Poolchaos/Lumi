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
import { authenticate } from '../middleware/auth';
import {
  createMetrics,
  getMetrics,
  getMetricsById,
  updateMetrics,
  deleteMetrics,
  getLatestMetrics,
  getMetricsTrends,
} from '../controllers/metricsController';
import {
  createMetricsValidation,
  updateMetricsValidation,
  getMetricsValidation,
  getTrendsValidation,
} from '../validators/metricsValidators';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create new metrics entry
router.post('/', createMetricsValidation, createMetrics);

// Get all metrics for user (with pagination and filtering)
router.get('/', getMetricsValidation, getMetrics);

// Get latest metrics entry (must be before /:id)
router.get('/latest', getLatestMetrics);

// Get metrics trends and statistics (must be before /:id)
router.get('/trends', getTrendsValidation, getMetricsTrends);

// Get specific metrics entry
router.get('/:id', getMetricsById);

// Update metrics entry
router.patch('/:id', updateMetricsValidation, updateMetrics);

// Delete metrics entry
router.delete('/:id', deleteMetrics);

export default router;
