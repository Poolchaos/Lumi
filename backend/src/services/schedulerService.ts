import cron from 'node-cron';
import { findMissedWorkouts } from './missedWorkoutService';

/**
 * Initialize all scheduled tasks
 */
export const initializeScheduler = (): void => {
  console.log('🕐 Initializing scheduled tasks...');

  // Run missed workout detection daily at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running scheduled missed workout detection...');
    try {
      const results = await findMissedWorkouts();
      console.log(`✅ Missed workout detection completed: ${results.length} users processed`);
    } catch (error) {
      console.error('❌ Scheduled missed workout detection failed:', error);
    }
  }, {
    timezone: 'UTC'
  });

  // Optional: Run detection every 6 hours for more frequent checks
  // Uncomment if you want more frequent detection
  // cron.schedule('0 */6 * * *', async () => {
  //   console.log('⏰ Running 6-hourly missed workout detection...');
  //   try {
  //     const results = await findMissedWorkouts();
  //     console.log(`✅ Missed workout detection completed: ${results.length} users processed`);
  //   } catch (error) {
  //     console.error('❌ Scheduled missed workout detection failed:', error);
  //   }
  // }, {
  //   timezone: 'UTC'
  // });

  console.log('✅ Scheduler initialized successfully');
  console.log('   - Missed workout detection: Daily at 00:00 UTC');
};

/**
 * Run missed workout detection immediately (for manual triggers)
 */
export const runMissedWorkoutDetection = async (): Promise<void> => {
  console.log('🔄 Running manual missed workout detection...');
  try {
    const results = await findMissedWorkouts();
    console.log(`✅ Detection completed: ${results.length} users processed`);
  } catch (error) {
    console.error('❌ Manual detection failed:', error);
    throw error;
  }
};
