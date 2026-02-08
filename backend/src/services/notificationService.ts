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
 * Notification Service
 *
 * Handles push notifications for medication reminders using Web Push API
 */

import webpush from 'web-push';
import User, { IUser } from '../models/User';
import { IMedication } from '../models/Medication';

// VAPID keys for web push (should be in environment variables)
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@lumi.io';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export interface MedicationNotification {
  title: string;
  body: string;
  data: {
    type: 'medication_reminder';
    medicationId: string;
    medicationName: string;
    scheduledTime: string;
    dosage: {
      amount: number;
      unit: string;
      form: string;
    };
    withFood?: boolean;
  };
  actions: Array<{
    action: string;
    title: string;
  }>;
}

/**
 * Register push subscription for a user
 */
export async function registerPushSubscription(
  userId: string,
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }
): Promise<void> {
  await User.findByIdAndUpdate(
    userId,
    {
      'notification_preferences.push_subscription': subscription,
    },
    { new: true }
  );
}

/**
 * Unregister push subscription for a user
 */
export async function unregisterPushSubscription(
  userId: string
): Promise<void> {
  await User.findByIdAndUpdate(
    userId,
    {
      $unset: { 'notification_preferences.push_subscription': '' },
    }
  );
}

/**
 * Send medication reminder notification
 */
export async function sendMedicationReminder(
  user: IUser,
  medication: IMedication,
  scheduledTime: Date
): Promise<boolean> {
  try {
    // Check if user has push subscription
    const subscription = user.notification_preferences?.push_subscription;
    if (!subscription || !subscription.endpoint) {
      console.log(`No push subscription for user ${user._id}`);
      return false;
    }

    // Check if notifications are enabled
    if (!user.notification_preferences?.medication_reminders?.enabled) {
      console.log(`Notifications disabled for user ${user._id}`);
      return false;
    }

    // Check quiet hours
    if (isQuietHours(user)) {
      console.log(`Quiet hours active for user ${user._id}`);
      return false;
    }

    // Build notification payload
    const notification: MedicationNotification = {
      title: `Time for ${medication.name}`,
      body: `${medication.dosage.amount} ${medication.dosage.unit} ${medication.dosage.form}${
        medication.frequency.with_food ? ' • Take with food' : ''
      }`,
      data: {
        type: 'medication_reminder',
        medicationId: String(medication._id),
        medicationName: medication.name,
        scheduledTime: scheduledTime.toISOString(),
        dosage: {
          amount: medication.dosage.amount,
          unit: medication.dosage.unit,
          form: medication.dosage.form,
        },
        withFood: medication.frequency.with_food,
      },
      actions: [
        {
          action: 'take',
          title: 'Take Now',
        },
        {
          action: 'skip',
          title: 'Skip',
        },
      ],
    };

    // Send push notification
    await webpush.sendNotification(
      subscription,
      JSON.stringify(notification)
    );

    console.log(`Push notification sent to user ${user._id} for ${medication.name}`);
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    // If subscription is expired/invalid, remove it
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 410) {
      await unregisterPushSubscription(String(user._id));
    }
    return false;
  }
}

/**
 * Check if current time is within user's quiet hours
 */
function isQuietHours(user: IUser): boolean {
  const quietHours = user.notification_preferences?.medication_reminders?.quiet_hours;
  if (!quietHours?.enabled) {
    return false;
  }

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const start = quietHours.start || '22:00';
  const end = quietHours.end || '07:00';

  // Handle overnight quiet hours (e.g., 22:00 - 07:00)
  if (start > end) {
    return currentTime >= start || currentTime <= end;
  }

  // Handle same-day quiet hours (e.g., 01:00 - 05:00)
  return currentTime >= start && currentTime <= end;
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: {
    enabled?: boolean;
    advance_minutes?: number;
    escalation_minutes?: number;
    quiet_hours?: {
      enabled: boolean;
      start: string;
      end: string;
    };
  }
): Promise<IUser | null> {
  const update: Record<string, unknown> = {};

  if (preferences.enabled !== undefined) {
    update['notification_preferences.medication_reminders.enabled'] = preferences.enabled;
  }
  if (preferences.advance_minutes !== undefined) {
    update['notification_preferences.medication_reminders.advance_minutes'] = preferences.advance_minutes;
  }
  if (preferences.escalation_minutes !== undefined) {
    update['notification_preferences.medication_reminders.escalation_minutes'] = preferences.escalation_minutes;
  }
  if (preferences.quiet_hours) {
    update['notification_preferences.medication_reminders.quiet_hours'] = preferences.quiet_hours;
  }

  return User.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true }
  );
}

/**
 * Get user's notification preferences
 */
export async function getNotificationPreferences(
  userId: string
): Promise<IUser['notification_preferences'] | null> {
  const user = await User.findById(userId).select('notification_preferences');
  return user?.notification_preferences || null;
}
