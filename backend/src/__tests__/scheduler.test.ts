import { initializeScheduler, runMissedWorkoutDetection } from '../services/schedulerService';
import * as missedWorkoutService from '../services/missedWorkoutService';

// Mock node-cron
jest.mock('node-cron');

// Mock missed workout service
jest.mock('../services/missedWorkoutService');

describe('Scheduler Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console logs during tests
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initializeScheduler', () => {
    it('should initialize scheduler without errors', () => {
      expect(() => initializeScheduler()).not.toThrow();
    });

    it('should log initialization messages', () => {
      initializeScheduler();

      expect(console.log).toHaveBeenCalledWith('🕐 Initializing scheduled tasks...');
      expect(console.log).toHaveBeenCalledWith('✅ Scheduler initialized successfully');
      expect(console.log).toHaveBeenCalledWith('   - Missed workout detection: Daily at 00:00 UTC');
    });
  });

  describe('runMissedWorkoutDetection', () => {
    it('should run detection successfully', async () => {
      const mockResults = [
        { user_id: 'user1', missed_count: 2 },
        { user_id: 'user2', missed_count: 1 },
      ];

      (missedWorkoutService.findMissedWorkouts as jest.Mock).mockResolvedValue(mockResults);

      await runMissedWorkoutDetection();

      expect(missedWorkoutService.findMissedWorkouts).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('🔄 Running manual missed workout detection...');
      expect(console.log).toHaveBeenCalledWith(`✅ Detection completed: ${mockResults.length} users processed`);
    });

    it('should handle detection errors', async () => {
      const error = new Error('Detection failed');
      (missedWorkoutService.findMissedWorkouts as jest.Mock).mockRejectedValue(error);

      await expect(runMissedWorkoutDetection()).rejects.toThrow('Detection failed');

      expect(console.error).toHaveBeenCalledWith('❌ Manual detection failed:', error);
    });

    it('should process empty results', async () => {
      (missedWorkoutService.findMissedWorkouts as jest.Mock).mockResolvedValue([]);

      await runMissedWorkoutDetection();

      expect(console.log).toHaveBeenCalledWith('✅ Detection completed: 0 users processed');
    });
  });
});
