/**
 * Copyright (c) 2025-2026 Phillip-Juan van der Berg. All Rights Reserved.
 *
 * This file is part of PersonalFit.
 *
 * PersonalFit is licensed under the PolyForm Noncommercial License 1.0.0.
 * You may not use this file except in compliance with the License.
 *
 * Commercial use requires a separate paid license.
 * Contact: phillipjuanvanderberg@gmail.com
 *
 * See the LICENSE file for the full license text.
 */

/**
 * Notification Routes
 *
 * Routes for push notification subscription and preference management
 */

import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import * as notificationController from '../controllers/notificationController';

const router = express.Router();

/**
 * Get VAPID public key
 * GET /api/notifications/vapid-public-key
 */
router.get(
  '/vapid-public-key',
  authenticate,
  notificationController.getVapidPublicKey
);

/**
 * Register push subscription
 * POST /api/notifications/register-device
 */
router.post(
  '/register-device',
  authenticate,
  [
    body('subscription.endpoint').isURL({ require_protocol: true }),
    body('subscription.keys.p256dh').isString().notEmpty(),
    body('subscription.keys.auth').isString().notEmpty(),
  ],
  notificationController.registerPushSubscription
);

/**
 * Unregister push subscription
 * DELETE /api/notifications/unregister-device
 */
router.delete(
  '/unregister-device',
  authenticate,
  notificationController.unregisterPushSubscription
);

/**
 * Get notification preferences
 * GET /api/notifications/preferences
 */
router.get(
  '/preferences',
  authenticate,
  notificationController.getNotificationPreferences
);

/**
 * Update notification preferences
 * PUT /api/notifications/preferences
 */
router.put(
  '/preferences',
  authenticate,
  [
    body('enabled').optional().isBoolean(),
    body('advance_minutes').optional().isInt({ min: 0, max: 120 }),
    body('escalation_minutes').optional().isInt({ min: 0, max: 120 }),
    body('quiet_hours.enabled').optional().isBoolean(),
    body('quiet_hours.start').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('quiet_hours.end').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  ],
  notificationController.updateNotificationPreferences
);

/**
 * Send test notification
 * POST /api/notifications/test
 */
router.post(
  '/test',
  authenticate,
  notificationController.sendTestNotification
);

export default router;
