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
 * Medication Reminder Service
 *
 * Checks for upcoming medication doses and sends notifications
 */

import User from '../models/User';
import { Medication, IMedication } from '../models/Medication';
import { NotificationLog } from '../models/NotificationLog';
import * as notificationService from './notificationService';

/**
 * Check for upcoming medication doses and send notifications
 */
export async function checkMedicationReminders(): Promise<void> {
  try {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    console.log(`🔔 Checking medication reminders at ${currentTime}...`);

    // Get all active users with notification preferences
    const users = await User.find({
      'notification_preferences.medication_reminders.enabled': true,
    }).lean();

    if (users.length === 0) {
      console.log('No users with notifications enabled');
      return;
    }

    let notificationsSent = 0;
    let notificationsSkipped = 0;

    for (const user of users) {
      const advanceMinutes =
        user.notification_preferences?.medication_reminders?.advance_minutes || 15;

      // Get user's medications with scheduled times
      const medications = await Medication.find({
        user_id: user._id,
        'frequency.specific_times': { $exists: true, $ne: [] },
      }).lean();

      if (medications.length === 0) {
        continue;
      }

      // Check each medication's scheduled times
      for (const medication of medications) {
        const specificTimes = medication.frequency.specific_times || [];

        for (const timeString of specificTimes) {
          // Check if we should send a notification for this time
          if (shouldSendNotification(timeString, currentTime, advanceMinutes)) {
            // Create scheduled time for today
            const [hours, minutes] = timeString.split(':').map(Number);
            const scheduledTime = new Date();
            scheduledTime.setHours(hours, minutes, 0, 0);

            // Check if we already sent a notification for this dose today
            const existingLog = await NotificationLog.findOne({
              user_id: user._id,
              medication_id: medication._id,
              notification_type: 'advance',
              scheduled_time: scheduledTime,
              sent_at: {
                $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
              },
            });

            if (existingLog) {
              notificationsSkipped++;
              continue; // Already notified
            }

            // Send notification
            const userDoc = await User.findById(user._id);
            if (userDoc) {
              const sent = await notificationService.sendMedicationReminder(
                userDoc,
                medication as unknown as IMedication,
                scheduledTime
              );

              if (sent) {
                // Log the notification
                await NotificationLog.create({
                  user_id: user._id,
                  medication_id: medication._id,
                  scheduled_time: scheduledTime,
                  notification_type: 'advance',
                  sent_at: now,
                  status: 'sent',
                  delivery_method: 'push',
                });

                notificationsSent++;
                console.log(
                  `✅ Sent notification to user ${user._id} for ${medication.name} at ${timeString}`
                );

                // Schedule escalation check
                await scheduleEscalation(
                  String(user._id),
                  String(medication._id),
                  scheduledTime
                );
              }
            }
          }
        }
      }
    }

    console.log(
      `✅ Reminder check complete: ${notificationsSent} sent, ${notificationsSkipped} skipped`
    );
  } catch (error) {
    console.error('❌ Error checking medication reminders:', error);
  }
}

/**
 * Check if we should send a notification for this time
 */
function shouldSendNotification(
  scheduledTime: string,
  currentTime: string,
  advanceMinutes: number
): boolean {
  const [schedHours, schedMinutes] = scheduledTime.split(':').map(Number);
  const [currHours, currMinutes] = currentTime.split(':').map(Number);

  // Calculate total minutes since midnight
  const schedTotalMinutes = schedHours * 60 + schedMinutes;
  const currTotalMinutes = currHours * 60 + currMinutes;

  // Calculate when we should notify (advance minutes before scheduled time)
  const notifyMinutes = schedTotalMinutes - advanceMinutes;

  // Check if current time is within a 5-minute window of notification time
  // This accounts for the fact that the cron runs every 5 minutes
  const diff = Math.abs(currTotalMinutes - notifyMinutes);
  return diff <= 5;
}

/**
 * Schedule an escalation notification check
 */
async function scheduleEscalation(
  userId: string,
  medicationId: string,
  scheduledTime: Date
): Promise<void> {
  try {
    // Get user's escalation settings
    const user = await User.findById(userId);
    if (!user) return;

    const escalationMinutes =
      user.notification_preferences?.medication_reminders?.escalation_minutes || 30;

    if (escalationMinutes === 0) {
      return; // Escalation disabled
    }

    // Create a marker for escalation check
    // This will be picked up by the escalation checker
    await NotificationLog.create({
      user_id: userId,
      medication_id: medicationId,
      scheduled_time: scheduledTime,
      notification_type: 'escalation',
      sent_at: new Date(),
      status: 'sent', // Marking as sent means "scheduled for escalation"
      delivery_method: 'push',
    });
  } catch (error) {
    console.error('❌ Error scheduling escalation:', error);
  }
}

/**
 * Check for escalation notifications
 * (for doses that weren't logged after the advance notification)
 */
export async function checkEscalationReminders(): Promise<void> {
  try {
    const now = new Date();
    console.log('���� Checking escalation reminders...');

    // Find all escalation logs that need to be checked
    const escalationLogs = await NotificationLog.find({
      notification_type: 'escalation',
      status: 'sent',
    }).lean();

    if (escalationLogs.length === 0) {
      return;
    }

    let escalationsSent = 0;

    for (const log of escalationLogs) {
      // Get the user
      const user = await User.findById(log.user_id);
      if (!user) continue;

      const escalationMinutes =
        user.notification_preferences?.medication_reminders?.escalation_minutes || 30;

      // Calculate when escalation should be sent
      const escalationTime = new Date(log.scheduled_time);
      escalationTime.setMinutes(escalationTime.getMinutes() + escalationMinutes);

      // Check if it's time for escalation (within 5 minute window)
      const timeDiff = Math.abs(now.getTime() - escalationTime.getTime());
      const minutesDiff = timeDiff / (1000 * 60);

      if (minutesDiff <= 5) {
        // Check if dose was logged
        const medication = await Medication.findById(log.medication_id);
        if (!medication) continue;

        // Check if there's a dose log for this scheduled time
        const medicationData = medication.toObject ? medication.toObject() : medication;
        const doseLogged = (
          medicationData as unknown as { dose_history?: Array<{ logged_at: Date }> }
        ).dose_history?.some((dose: { logged_at: Date }) => {
            const doseTime = new Date(dose.logged_at);
            const schedTime = new Date(log.scheduled_time);
            // Check if dose was logged within 1 hour of scheduled time
            const diff = Math.abs(doseTime.getTime() - schedTime.getTime());
            return diff <= 60 * 60 * 1000; // 1 hour
          }
        );

        if (!doseLogged) {
          // Send escalation notification
          const sent = await notificationService.sendMedicationReminder(
            user,
            medication as unknown as IMedication,
            new Date(log.scheduled_time)
          );

          if (sent) {
            // Mark escalation as acknowledged (sent)
            await NotificationLog.findByIdAndUpdate(log._id, {
              status: 'acknowledged',
              acknowledged_at: now,
            });

            escalationsSent++;
            console.log(
              `⚠️ Sent escalation to user ${user._id} for ${medication.name}`
            );
          }
        } else {
          // Dose was logged, mark escalation as acknowledged
          await NotificationLog.findByIdAndUpdate(log._id, {
            status: 'acknowledged',
            acknowledged_at: now,
          });
        }
      }
    }

    if (escalationsSent > 0) {
      console.log(`✅ Sent ${escalationsSent} escalation notifications`);
    }
  } catch (error) {
    console.error('❌ Error checking escalation reminders:', error);
  }
}

/**
 * Clean up old notification logs (older than 30 days)
 */
export async function cleanupNotificationLogs(): Promise<void> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await NotificationLog.deleteMany({
      sent_at: { $lt: thirtyDaysAgo },
    });

    console.log(`🧹 Cleaned up ${result.deletedCount} old notification logs`);
  } catch (error) {
    console.error('❌ Error cleaning up notification logs:', error);
  }
}
