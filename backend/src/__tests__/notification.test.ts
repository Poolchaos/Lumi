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

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User, { IUser } from '../models/User';
import { Medication, IMedication } from '../models/Medication';
import { NotificationLog } from '../models/NotificationLog';
import * as notificationService from '../services/notificationService';

// Mock web-push to avoid actual push notifications in tests
jest.mock('web-push', () => ({
  setVapidDetails: jest.fn(),
  sendNotification: jest.fn().mockResolvedValue({}),
  generateVAPIDKeys: jest.fn().mockReturnValue({
    publicKey: 'test-public-key',
    privateKey: 'test-private-key',
  }),
}));

describe('Notification API', () => {
  let authToken: string;
  let userId: string;
  let medicationId: string;

  beforeAll(async () => {
    const testDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumi-test';
    await mongoose.connect(testDbUri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Medication.deleteMany({});
    await NotificationLog.deleteMany({});

    // Create a test user and get token
    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'Password123',
      });

    authToken = signupResponse.body.accessToken;

    // Get user ID
    const user = await User.findOne({ email: 'test@example.com' });
    userId = String(user!._id);

    // Create a test medication
    const medication = await Medication.create({
      user_id: userId,
      name: 'Test Medication',
      type: 'prescription',
      dosage: {
        amount: 10,
        unit: 'mg',
        form: 'tablet',
      },
      frequency: {
        times_per_day: 2,
        specific_times: ['08:00', '20:00'],
        with_food: false,
      },
      inventory: {
        current_quantity: 30,
        total_quantity: 30,
        unit: 'tablet',
        refill_reminder_threshold: 7,
      },
    });
    medicationId = String(medication._id);
  });

  describe('GET /api/notifications/vapid-public-key', () => {
    it('should return VAPID public key', async () => {
      const response = await request(app)
        .get('/api/notifications/vapid-public-key')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('publicKey');
      expect(typeof response.body.publicKey).toBe('string');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/notifications/vapid-public-key');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/notifications/register-device', () => {
    const validSubscription = {
      subscription: {
        endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint',
        keys: {
          p256dh: 'test-p256dh-key',
          auth: 'test-auth-key',
        },
      },
    };

    it('should register push subscription', async () => {
      const response = await request(app)
        .post('/api/notifications/register-device')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validSubscription);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Push subscription registered successfully');

      // Verify subscription was saved
      const user = await User.findById(userId);
      expect(user?.notification_preferences?.push_subscription).toBeDefined();
      expect(user?.notification_preferences?.push_subscription?.endpoint).toBe(validSubscription.subscription.endpoint);
    });

    it('should validate subscription endpoint is URL', async () => {
      const response = await request(app)
        .post('/api/notifications/register-device')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          subscription: {
            endpoint: 'not-a-url',
            keys: {
              p256dh: 'test-p256dh-key',
              auth: 'test-auth-key',
            },
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should validate required keys', async () => {
      const response = await request(app)
        .post('/api/notifications/register-device')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          subscription: {
            endpoint: 'https://test.com',
            keys: {
              p256dh: '',
              auth: 'test-auth-key',
            },
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/notifications/register-device')
        .send(validSubscription);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/notifications/unregister-device', () => {
    beforeEach(async () => {
      // Register a subscription first
      await request(app)
        .post('/api/notifications/register-device')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          subscription: {
            endpoint: 'https://test.com/endpoint',
            keys: {
              p256dh: 'test-p256dh-key',
              auth: 'test-auth-key',
            },
          },
        });
    });

    it('should unregister push subscription', async () => {
      const response = await request(app)
        .delete('/api/notifications/unregister-device')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Push subscription unregistered successfully');

      // Verify subscription was removed
      const user = await User.findById(userId);
      const subscription = user?.notification_preferences?.push_subscription;
      expect(!subscription || !subscription.endpoint).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/api/notifications/unregister-device');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/notifications/preferences', () => {
    it('should return default preferences for new user', async () => {
      const response = await request(app)
        .get('/api/notifications/preferences')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.medication_reminders).toBeDefined();
      expect(response.body.medication_reminders.enabled).toBe(true);
      expect(response.body.medication_reminders.advance_minutes).toBe(15);
      expect(response.body.medication_reminders.escalation_minutes).toBe(30);
      expect(response.body.medication_reminders.quiet_hours).toBeDefined();
    });

    it('should return custom preferences after update', async () => {
      // Update preferences
      await request(app)
        .put('/api/notifications/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          enabled: false,
          advance_minutes: 30,
        });

      const response = await request(app)
        .get('/api/notifications/preferences')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.medication_reminders.enabled).toBe(false);
      expect(response.body.medication_reminders.advance_minutes).toBe(30);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/notifications/preferences');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/notifications/preferences', () => {
    it('should update notification preferences', async () => {
      const response = await request(app)
        .put('/api/notifications/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          enabled: false,
          advance_minutes: 30,
          escalation_minutes: 60,
          quiet_hours: {
            enabled: true,
            start: '23:00',
            end: '08:00',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.medication_reminders.enabled).toBe(false);
      expect(response.body.medication_reminders.advance_minutes).toBe(30);
      expect(response.body.medication_reminders.escalation_minutes).toBe(60);
      expect(response.body.medication_reminders.quiet_hours.enabled).toBe(true);
      expect(response.body.medication_reminders.quiet_hours.start).toBe('23:00');
      expect(response.body.medication_reminders.quiet_hours.end).toBe('08:00');
    });

    it('should validate advance_minutes range', async () => {
      const response = await request(app)
        .put('/api/notifications/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          advance_minutes: 200, // Max is 120
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should validate time format for quiet hours', async () => {
      const response = await request(app)
        .put('/api/notifications/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quiet_hours: {
            enabled: true,
            start: '25:00', // Invalid hour
            end: '08:00',
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should update partial preferences', async () => {
      const response = await request(app)
        .put('/api/notifications/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          advance_minutes: 20,
        });

      expect(response.status).toBe(200);
      expect(response.body.medication_reminders.advance_minutes).toBe(20);
      // Other fields should retain defaults
      expect(response.body.medication_reminders.enabled).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put('/api/notifications/preferences')
        .send({ enabled: false });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/notifications/test', () => {
    beforeEach(async () => {
      // Register a push subscription
      await request(app)
        .post('/api/notifications/register-device')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          subscription: {
            endpoint: 'https://test.com/endpoint',
            keys: {
              p256dh: 'test-p256dh-key',
              auth: 'test-auth-key',
            },
          },
        });
    });

    it('should send test notification', async () => {
      const response = await request(app)
        .post('/api/notifications/test')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Test notification sent successfully');
    });

    it('should fail without push subscription', async () => {
      // Unregister first
      await request(app)
        .delete('/api/notifications/unregister-device')
        .set('Authorization', `Bearer ${authToken}`);

      const response = await request(app)
        .post('/api/notifications/test')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/notifications/test');

      expect(response.status).toBe(401);
    });
  });

  describe('Notification Service', () => {
    let testUser: IUser | null;
    let testMedication: IMedication | null;

    beforeEach(async () => {
      testUser = await User.findById(userId);
      testMedication = await Medication.findById(medicationId);
    });

    describe('sendMedicationReminder', () => {
      it('should send notification when subscription exists', async () => {
        // Register subscription
        await notificationService.registerPushSubscription(userId, {
          endpoint: 'https://test.com/endpoint',
          keys: {
            p256dh: 'test-p256dh-key',
            auth: 'test-auth-key',
          },
        });

        testUser = await User.findById(userId);
        const result = await notificationService.sendMedicationReminder(
          testUser!,
          testMedication!,
          new Date()
        );

        expect(result).toBe(true);
      });

      it('should not send when notifications disabled', async () => {
        // Register subscription but disable notifications
        await notificationService.registerPushSubscription(userId, {
          endpoint: 'https://test.com/endpoint',
          keys: {
            p256dh: 'test-p256dh-key',
            auth: 'test-auth-key',
          },
        });

        await notificationService.updateNotificationPreferences(userId, {
          enabled: false,
        });

        testUser = await User.findById(userId);
        const result = await notificationService.sendMedicationReminder(
          testUser!,
          testMedication!,
          new Date()
        );

        expect(result).toBe(false);
      });

      it('should not send during quiet hours', async () => {
        // Register subscription and set quiet hours
        await notificationService.registerPushSubscription(userId, {
          endpoint: 'https://test.com/endpoint',
          keys: {
            p256dh: 'test-p256dh-key',
            auth: 'test-auth-key',
          },
        });

        const now = new Date();
        const currentHour = now.getHours().toString().padStart(2, '0');
        const currentMinute = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHour}:${currentMinute}`;

        // Set quiet hours to include current time
        await notificationService.updateNotificationPreferences(userId, {
          quiet_hours: {
            enabled: true,
            start: currentTime,
            end: currentTime,
          },
        });

        testUser = await User.findById(userId);
        const result = await notificationService.sendMedicationReminder(
          testUser!,
          testMedication!,
          new Date()
        );

        expect(result).toBe(false);
      });

      it('should return false when no subscription', async () => {
        const result = await notificationService.sendMedicationReminder(
          testUser!,
          testMedication!,
          new Date()
        );

        expect(result).toBe(false);
      });
    });

    describe('updateNotificationPreferences', () => {
      it('should update all preferences', async () => {
        const updatedUser = await notificationService.updateNotificationPreferences(userId, {
          enabled: false,
          advance_minutes: 45,
          escalation_minutes: 90,
          quiet_hours: {
            enabled: true,
            start: '22:30',
            end: '07:30',
          },
        });

        expect(updatedUser).toBeDefined();
        expect(updatedUser?.notification_preferences?.medication_reminders?.enabled).toBe(false);
        expect(updatedUser?.notification_preferences?.medication_reminders?.advance_minutes).toBe(45);
        expect(updatedUser?.notification_preferences?.medication_reminders?.escalation_minutes).toBe(90);
        expect(updatedUser?.notification_preferences?.medication_reminders?.quiet_hours?.enabled).toBe(true);
        expect(updatedUser?.notification_preferences?.medication_reminders?.quiet_hours?.start).toBe('22:30');
      });

      it('should update partial preferences', async () => {
        const updatedUser = await notificationService.updateNotificationPreferences(userId, {
          advance_minutes: 10,
        });

        expect(updatedUser).toBeDefined();
        expect(updatedUser?.notification_preferences?.medication_reminders?.advance_minutes).toBe(10);
        // Other preferences should retain defaults
        expect(updatedUser?.notification_preferences?.medication_reminders?.enabled).toBe(true);
      });
    });

    describe('getNotificationPreferences', () => {
      it('should return null for non-existent user', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const preferences = await notificationService.getNotificationPreferences(fakeId);

        expect(preferences).toBeNull();
      });

      it('should return preferences for existing user', async () => {
        const preferences = await notificationService.getNotificationPreferences(userId);

        expect(preferences).toBeDefined();
        expect(preferences?.medication_reminders).toBeDefined();
      });
    });
  });

  describe('NotificationLog Model', () => {
    it('should create notification log entry', async () => {
      const log = await NotificationLog.create({
        user_id: userId,
        medication_id: medicationId,
        scheduled_time: new Date(),
        notification_type: 'advance',
        sent_at: new Date(),
        status: 'sent',
        delivery_method: 'push',
      });

      expect(log).toBeDefined();
      expect(log.user_id.toString()).toBe(userId);
      expect(log.medication_id.toString()).toBe(medicationId);
      expect(log.notification_type).toBe('advance');
      expect(log.status).toBe('sent');
      expect(log.delivery_method).toBe('push');
    });

    it('should validate notification_type enum', async () => {
      try {
        await NotificationLog.create({
          user_id: userId,
          medication_id: medicationId,
          scheduled_time: new Date(),
          notification_type: 'invalid', // Should fail
          sent_at: new Date(),
          status: 'sent',
          delivery_method: 'push',
        });
        fail('Should have thrown validation error');
      } catch (error: unknown) {
        expect((error as Error & { name: string }).name).toBe('ValidationError');
      }
    });

    it('should validate status enum', async () => {
      try {
        await NotificationLog.create({
          user_id: userId,
          medication_id: medicationId,
          scheduled_time: new Date(),
          notification_type: 'advance',
          sent_at: new Date(),
          status: 'invalid', // Should fail
          delivery_method: 'push',
        });
        fail('Should have thrown validation error');
      } catch (error: unknown) {
        expect((error as Error & { name: string }).name).toBe('ValidationError');
      }
    });

    it('should track acknowledgment', async () => {
      const log = await NotificationLog.create({
        user_id: userId,
        medication_id: medicationId,
        scheduled_time: new Date(),
        notification_type: 'advance',
        sent_at: new Date(),
        status: 'sent',
        delivery_method: 'push',
      });

      // Acknowledge
      log.status = 'acknowledged';
      log.acknowledged_at = new Date();
      await log.save();

      const updated = await NotificationLog.findById(log._id);
      expect(updated?.status).toBe('acknowledged');
      expect(updated?.acknowledged_at).toBeDefined();
    });

    it('should track snooze', async () => {
      const log = await NotificationLog.create({
        user_id: userId,
        medication_id: medicationId,
        scheduled_time: new Date(),
        notification_type: 'advance',
        sent_at: new Date(),
        status: 'sent',
        delivery_method: 'push',
      });

      // Snooze
      const snoozeUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      log.status = 'snoozed';
      log.snoozed_until = snoozeUntil;
      await log.save();

      const updated = await NotificationLog.findById(log._id);
      expect(updated?.status).toBe('snoozed');
      expect(updated?.snoozed_until).toBeDefined();
    });

    it('should find logs by user and medication', async () => {
      // Create multiple logs
      await NotificationLog.create([
        {
          user_id: userId,
          medication_id: medicationId,
          scheduled_time: new Date(),
          notification_type: 'advance',
          sent_at: new Date(),
          status: 'sent',
          delivery_method: 'push',
        },
        {
          user_id: userId,
          medication_id: medicationId,
          scheduled_time: new Date(Date.now() + 60000),
          notification_type: 'escalation',
          sent_at: new Date(),
          status: 'sent',
          delivery_method: 'push',
        },
      ]);

      const logs = await NotificationLog.find({
        user_id: userId,
        medication_id: medicationId,
      });

      expect(logs).toHaveLength(2);
      expect(logs[0].notification_type).toBe('advance');
      expect(logs[1].notification_type).toBe('escalation');
    });
  });
});
