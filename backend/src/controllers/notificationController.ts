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

/**
 * Notification Controller
 *
 * Handles notification preferences and push subscription management
 */

import { Response } from 'express';
import { validationResult } from 'express-validator';
import * as notificationService from '../services/notificationService';
import User from '../models/User';
import { IMedication } from '../models/Medication';
import { AuthRequest } from '../middleware/auth';

/**
 * Get VAPID public key for push subscription
 */
export async function getVapidPublicKey(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const publicKey = process.env.VAPID_PUBLIC_KEY || '';

    if (!publicKey) {
      res.status(500).json({ error: 'VAPID keys not configured' });
      return;
    }

    res.json({ publicKey });
  } catch (error) {
    console.error('Error getting VAPID key:', error);
    res.status(500).json({ error: 'Failed to get VAPID key' });
  }
}

/**
 * Register push subscription
 */
export async function registerPushSubscription(req: AuthRequest, res: Response): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.user!.userId;
    const { subscription } = req.body;

    await notificationService.registerPushSubscription(userId, subscription);

    res.json({ message: 'Push subscription registered successfully' });
  } catch (error) {
    console.error('Error registering push subscription:', error);
    res.status(500).json({ error: 'Failed to register push subscription' });
  }
}

/**
 * Unregister push subscription
 */
export async function unregisterPushSubscription(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;

    await notificationService.unregisterPushSubscription(userId);

    res.json({ message: 'Push subscription unregistered successfully' });
  } catch (error) {
    console.error('Error unregistering push subscription:', error);
    res.status(500).json({ error: 'Failed to unregister push subscription' });
  }
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;

    const preferences = await notificationService.getNotificationPreferences(userId);

    res.json(preferences || {
      medication_reminders: {
        enabled: true,
        advance_minutes: 15,
        escalation_minutes: 30,
        quiet_hours: {
          enabled: false,
          start: '22:00',
          end: '07:00',
        },
      },
    });
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    res.status(500).json({ error: 'Failed to get notification preferences' });
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(req: AuthRequest, res: Response): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.user!.userId;
    const preferences = req.body;

    const updatedUser = await notificationService.updateNotificationPreferences(
      userId,
      preferences
    );

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(updatedUser.notification_preferences);
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
}

/**
 * Send test notification
 */
export async function sendTestNotification(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Create a test medication object
    const testMedication = {
      _id: 'test',
      name: 'Test Medication',
      dosage: {
        amount: 1,
        unit: 'tablet',
        form: 'Tablet',
      },
      frequency: {
        with_food: false,
      },
    } as unknown as IMedication;

    const sent = await notificationService.sendMedicationReminder(
      user,
      testMedication,
      new Date()
    );

    if (sent) {
      res.json({ message: 'Test notification sent successfully' });
    } else {
      res.status(400).json({ error: 'Failed to send test notification. Check push subscription.' });
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
}
