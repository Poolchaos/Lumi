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

import cron from 'node-cron';
import { findMissedWorkouts } from './missedWorkoutService';
import {
  checkMedicationReminders,
  checkEscalationReminders,
  cleanupNotificationLogs,
} from './medicationReminderService';

/**
 * Initialize all scheduled tasks
 */
export const initializeScheduler = (): void => {
  console.log('ðŸ• Initializing scheduled tasks...');

  // Run missed workout detection daily at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('â° Running scheduled missed workout detection...');
    try {
      const results = await findMissedWorkouts();
      console.log(`âœ… Missed workout detection completed: ${results.length} users processed`);
    } catch (error) {
      console.error('âŒ Scheduled missed workout detection failed:', error);
    }
  }, {
    timezone: 'UTC'
  });

  // Optional: Run detection every 6 hours for more frequent checks
  // Uncomment if you want more frequent detection
  // cron.schedule('0 */6 * * *', async () => {
  //   console.log('â° Running 6-hourly missed workout detection...');
  //   try {
  //     const results = await findMissedWorkouts();
  //     console.log(`âœ… Missed workout detection completed: ${results.length} users processed`);
  //   } catch (error) {
  //     console.error('âŒ Scheduled missed workout detection failed:', error);
  //   }
  // }, {
  //   timezone: 'UTC'
  // });

  // Check for medication reminders every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      await checkMedicationReminders();
    } catch (error) {
      console.error('❌ Scheduled medication reminder check failed:', error);
    }
  }, {
    timezone: 'UTC'
  });

  // Check for escalation reminders every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    try {
      await checkEscalationReminders();
    } catch (error) {
      console.error('❌ Scheduled escalation reminder check failed:', error);
    }
  }, {
    timezone: 'UTC'
  });

  // Clean up old notification logs daily at 02:00 UTC
  cron.schedule('0 2 * * *', async () => {
    console.log('🧹 Running notification log cleanup...');
    try {
      await cleanupNotificationLogs();
    } catch (error) {
      console.error('❌ Notification log cleanup failed:', error);
    }
  }, {
    timezone: 'UTC'
  });

  console.log('✅ Scheduler initialized successfully');
  console.log('   - Missed workout detection: Daily at 00:00 UTC');
  console.log('   - Medication reminders: Every 5 minutes');
  console.log('   - Escalation reminders: Every 10 minutes');
  console.log('   - Notification log cleanup: Daily at 02:00 UTC');
};

/**
 * Run missed workout detection immediately (for manual triggers)
 */
export const runMissedWorkoutDetection = async (): Promise<void> => {
  console.log('ðŸ”„ Running manual missed workout detection...');
  try {
    const results = await findMissedWorkouts();
    console.log(`âœ… Detection completed: ${results.length} users processed`);
  } catch (error) {
    console.error('âŒ Manual detection failed:', error);
    throw error;
  }
};
