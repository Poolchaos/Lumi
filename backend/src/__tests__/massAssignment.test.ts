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
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';
import WorkoutSession from '../models/WorkoutSession';
import ExerciseLog from '../models/ExerciseLog';
import BodyMetrics from '../models/BodyMetrics';
import Equipment from '../models/Equipment';
import WorkoutPlan from '../models/WorkoutPlan';

/**
 * Mass Assignment Prevention Tests (S0-1)
 * ========================================
 *
 * These tests verify that controllers reject attempts to overwrite
 * protected fields (user_id, _id, session_id, created_at, updated_at)
 * via req.body injection.
 *
 * Coverage rationale:
 *   POSITIVE - Normal CRUD works correctly with whitelisted fields
 *   NEGATIVE - Protected fields in body are silently stripped (not errors)
 *   EDGE     - Empty body, extra unknown fields, nested injection attempts
 *
 * Attack vector: Without this fix, `{ user_id: 'attacker_id', ...req.body }`
 * with spread AFTER user_id allows an attacker's `user_id` in the body to
 * overwrite the authenticated user's ID, enabling impersonation.
 */

// ─── Test Infrastructure ────────────────────────────────────────────────────────

let authToken: string;
let userId: string;
let attackerToken: string;
let attackerId: string;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const testDbUri = mongoServer.getUri();
  await mongoose.connect(testDbUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await WorkoutSession.deleteMany({});
  await ExerciseLog.deleteMany({});
  await BodyMetrics.deleteMany({});
  await Equipment.deleteMany({});
  await WorkoutPlan.deleteMany({});

  // Create victim user
  const victimRes = await request(app).post('/api/auth/signup').send({
    email: 'victim@example.com',
    password: 'Victim123!',
  });
  authToken = victimRes.body.accessToken;
  userId = victimRes.body.user.id;

  // Create attacker user
  const attackerRes = await request(app).post('/api/auth/signup').send({
    email: 'attacker@example.com',
    password: 'Attacker123!',
  });
  attackerToken = attackerRes.body.accessToken;
  attackerId = attackerRes.body.user.id;
});

// ─── Session Controller ─────────────────────────────────────────────────────────

describe('Session Controller - Mass Assignment Prevention', () => {
  // ── POSITIVE CASES ──

  describe('POST /api/sessions (createSession)', () => {
    it('should create a session with whitelisted fields correctly', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          session_date: new Date().toISOString(),
          completion_status: 'planned',
          planned_duration_minutes: 60,
          exercises_planned: 5,
          notes: 'Leg day',
          mood_before: 'great',
        });

      expect(res.status).toBe(201);
      expect(res.body.session.user_id).toBe(userId);
      expect(res.body.session.planned_duration_minutes).toBe(60);
      expect(res.body.session.notes).toBe('Leg day');
      expect(res.body.session.mood_before).toBe('great');
    });

    // ── NEGATIVE CASES (attack vectors) ──

    it('should NOT allow user_id override via body injection', async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: fakeUserId,
          session_date: new Date().toISOString(),
          completion_status: 'planned',
        });

      expect(res.status).toBe(201);
      // user_id must be the authenticated user, not the injected value
      expect(res.body.session.user_id).toBe(userId);
      expect(res.body.session.user_id).not.toBe(fakeUserId);
    });

    it('should NOT allow _id override via body injection', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          _id: fakeId,
          session_date: new Date().toISOString(),
          completion_status: 'planned',
        });

      expect(res.status).toBe(201);
      // _id should be auto-generated, not the injected value
      expect(res.body.session._id).not.toBe(fakeId);
    });

    it('should NOT allow created_at/updated_at override', async () => {
      const fakeDate = '2020-01-01T00:00:00.000Z';

      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          created_at: fakeDate,
          updated_at: fakeDate,
          session_date: new Date().toISOString(),
          completion_status: 'planned',
        });

      expect(res.status).toBe(201);
      expect(res.body.session.created_at).not.toBe(fakeDate);
    });

    // ── EDGE CASES ──

    it('should silently ignore unknown/extra fields', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          session_date: new Date().toISOString(),
          completion_status: 'planned',
          __proto__: { admin: true },
          constructor: { prototype: { admin: true } },
          admin_override: true,
          $set: { user_id: 'hacked' },
        });

      expect(res.status).toBe(201);
      expect(res.body.session.user_id).toBe(userId);
    });

    it('should work with attacker token - session owned by attacker', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${attackerToken}`)
        .send({
          user_id: userId, // tries to create session under victim's account
          session_date: new Date().toISOString(),
          completion_status: 'planned',
        });

      expect(res.status).toBe(201);
      // Must be attacker's session, not victim's
      expect(res.body.session.user_id).toBe(attackerId);
      expect(res.body.session.user_id).not.toBe(userId);
    });
  });

  describe('PUT /api/sessions/:id (updateSession)', () => {
    let sessionId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          session_date: new Date().toISOString(),
          completion_status: 'planned',
          planned_duration_minutes: 45,
        });
      sessionId = res.body.session._id;
    });

    it('should update only whitelisted fields', async () => {
      const res = await request(app)
        .patch(`/api/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          completion_status: 'completed',
          actual_duration_minutes: 50,
          mood_after: 'accomplished',
        });

      expect(res.status).toBe(200);
      expect(res.body.session.completion_status).toBe('completed');
      expect(res.body.session.actual_duration_minutes).toBe(50);
      expect(res.body.session.mood_after).toBe('accomplished');
    });

    it('should NOT allow user_id override on update', async () => {
      const res = await request(app)
        .patch(`/api/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: attackerId,
          completion_status: 'in_progress',
        });

      expect(res.status).toBe(200);
      expect(res.body.session.user_id).toBe(userId);
      expect(res.body.session.user_id).not.toBe(attackerId);
    });

    it('should NOT allow _id override on update', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .patch(`/api/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          _id: fakeId,
          completion_status: 'in_progress',
        });

      expect(res.status).toBe(200);
      expect(res.body.session._id).toBe(sessionId);
    });
  });

  describe('POST /api/sessions/:id/exercises (logExercise)', () => {
    let sessionId: string;

    beforeEach(async () => {
      const sessionRes = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          session_date: new Date().toISOString(),
          completion_status: 'in_progress',
          exercises_planned: 3,
        });
      sessionId = sessionRes.body.session._id;
    });

    it('should create exercise log with whitelisted fields', async () => {
      const res = await request(app)
        .post(`/api/sessions/${sessionId}/exercises`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          exercise_name: 'Bench Press',
          exercise_type: 'strength',
          target_muscles: ['chest', 'triceps'],
          sets_completed: 3,
          target_sets: 4,
        });

      expect(res.status).toBe(201);
      expect(res.body.exercise.exercise_name).toBe('Bench Press');
      expect(res.body.exercise.user_id).toBe(userId);
      expect(res.body.exercise.session_id).toBe(sessionId);
    });

    it('should NOT allow user_id override in exercise log', async () => {
      const res = await request(app)
        .post(`/api/sessions/${sessionId}/exercises`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: attackerId,
          session_id: new mongoose.Types.ObjectId().toString(),
          exercise_name: 'Squat',
          exercise_type: 'strength',
          target_muscles: ['quads'],
        });

      expect(res.status).toBe(201);
      // user_id and session_id must come from auth/params, not body
      expect(res.body.exercise.user_id).toBe(userId);
      expect(res.body.exercise.session_id).toBe(sessionId);
    });

    it('should NOT allow _id or created_at override in exercise log', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .post(`/api/sessions/${sessionId}/exercises`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          _id: fakeId,
          created_at: '2020-01-01T00:00:00.000Z',
          exercise_name: 'Deadlift',
          exercise_type: 'strength',
          target_muscles: ['back'],
        });

      expect(res.status).toBe(201);
      expect(res.body.exercise._id).not.toBe(fakeId);
    });
  });

  describe('PUT /api/sessions/:id/exercises/:exerciseId (updateExercise)', () => {
    let sessionId: string;
    let exerciseId: string;

    beforeEach(async () => {
      const sessionRes = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          session_date: new Date().toISOString(),
          completion_status: 'in_progress',
          exercises_planned: 2,
        });
      sessionId = sessionRes.body.session._id;

      const exerciseRes = await request(app)
        .post(`/api/sessions/${sessionId}/exercises`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          exercise_name: 'Pull-up',
          exercise_type: 'strength',
          target_muscles: ['back', 'biceps'],
          sets_completed: 2,
        });
      exerciseId = exerciseRes.body.exercise._id;
    });

    it('should update exercise with whitelisted fields only', async () => {
      const res = await request(app)
        .put(`/api/sessions/${sessionId}/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sets_completed: 4,
          personal_record: true,
          difficulty_rating: 8,
        });

      expect(res.status).toBe(200);
      expect(res.body.exercise.sets_completed).toBe(4);
      expect(res.body.exercise.personal_record).toBe(true);
      expect(res.body.exercise.difficulty_rating).toBe(8);
    });

    it('should NOT allow user_id or session_id override on exercise update', async () => {
      const res = await request(app)
        .put(`/api/sessions/${sessionId}/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: attackerId,
          session_id: new mongoose.Types.ObjectId().toString(),
          sets_completed: 5,
        });

      expect(res.status).toBe(200);
      expect(res.body.exercise.user_id).toBe(userId);
      expect(res.body.exercise.session_id).toBe(sessionId);
    });
  });
});

// ─── Metrics Controller ─────────────────────────────────────────────────────────

describe('Metrics Controller - Mass Assignment Prevention', () => {
  describe('POST /api/metrics (createMetrics)', () => {
    it('should create metrics with whitelisted fields', async () => {
      const res = await request(app)
        .post('/api/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          measurement_date: new Date().toISOString(),
          weight_kg: 75.5,
          body_fat_percentage: 18,
          notes: 'Morning measurement',
        });

      expect(res.status).toBe(201);
      expect(res.body.metrics.weight_kg).toBe(75.5);
      expect(res.body.metrics.user_id).toBe(userId);
    });

    it('should NOT allow user_id override via body', async () => {
      const res = await request(app)
        .post('/api/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: attackerId,
          measurement_date: new Date().toISOString(),
          weight_kg: 80,
        });

      expect(res.status).toBe(201);
      expect(res.body.metrics.user_id).toBe(userId);
      expect(res.body.metrics.user_id).not.toBe(attackerId);
    });

    it('should NOT allow _id override via body', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .post('/api/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          _id: fakeId,
          measurement_date: new Date().toISOString(),
          weight_kg: 70,
        });

      expect(res.status).toBe(201);
      expect(res.body.metrics._id).not.toBe(fakeId);
    });

    it('should handle nested measurements correctly', async () => {
      const res = await request(app)
        .post('/api/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          measurement_date: new Date().toISOString(),
          weight_kg: 75,
          measurements: {
            chest_cm: 100,
            waist_cm: 82,
            bicep_left_cm: 36,
          },
        });

      expect(res.status).toBe(201);
      expect(res.body.metrics.measurements.chest_cm).toBe(100);
    });

    // ── EDGE CASE ──

    it('should reject Mongo operator injection ($set, $unset)', async () => {
      const res = await request(app)
        .post('/api/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          measurement_date: new Date().toISOString(),
          weight_kg: 75,
          $set: { user_id: attackerId },
          $unset: { password_hash: '' },
        });

      expect(res.status).toBe(201);
      expect(res.body.metrics.user_id).toBe(userId);
    });
  });

  describe('PUT /api/metrics/:id (updateMetrics)', () => {
    let metricsId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          measurement_date: new Date().toISOString(),
          weight_kg: 75,
        });
      metricsId = res.body.metrics._id;
    });

    it('should update only whitelisted fields', async () => {
      const res = await request(app)
        .patch(`/api/metrics/${metricsId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          weight_kg: 74.5,
          body_fat_percentage: 17.5,
        });

      expect(res.status).toBe(200);
      expect(res.body.metrics.weight_kg).toBe(74.5);
      expect(res.body.metrics.body_fat_percentage).toBe(17.5);
    });

    it('should NOT allow user_id override on update', async () => {
      const res = await request(app)
        .patch(`/api/metrics/${metricsId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: attackerId,
          weight_kg: 74,
        });

      expect(res.status).toBe(200);
      expect(res.body.metrics.user_id).toBe(userId);
      expect(res.body.metrics.user_id).not.toBe(attackerId);
    });

    it('should NOT allow _id override on update', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .patch(`/api/metrics/${metricsId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          _id: fakeId,
          weight_kg: 73,
        });

      expect(res.status).toBe(200);
      expect(res.body.metrics._id).toBe(metricsId);
    });
  });
});

// ─── Equipment Controller ────────────────────────────────────────────────────────

describe('Equipment Controller - Mass Assignment Prevention', () => {
  describe('POST /api/equipment (createEquipment)', () => {
    it('should create equipment with whitelisted fields', async () => {
      const res = await request(app)
        .post('/api/equipment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          equipment_name: 'Barbell',
          equipment_type: 'free_weights',
          quantity: 1,
          condition: 'good',
          is_available: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.equipment.equipment_name).toBe('Barbell');
      expect(res.body.equipment.user_id).toBe(userId);
    });

    it('should NOT allow user_id override via body', async () => {
      const res = await request(app)
        .post('/api/equipment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: attackerId,
          equipment_name: 'Kettlebell',
          equipment_type: 'free_weights',
        });

      expect(res.status).toBe(201);
      expect(res.body.equipment.user_id).toBe(userId);
      expect(res.body.equipment.user_id).not.toBe(attackerId);
    });

    it('should NOT allow _id override via body', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .post('/api/equipment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          _id: fakeId,
          equipment_name: 'Resistance Band',
          equipment_type: 'accessories',
        });

      expect(res.status).toBe(201);
      expect(res.body.equipment._id).not.toBe(fakeId);
    });

    it('should handle specifications subdocument correctly', async () => {
      const res = await request(app)
        .post('/api/equipment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          equipment_name: 'Adjustable Dumbbell Set',
          equipment_type: 'free_weights',
          specifications: {
            adjustable: true,
            min_weight_kg: 2.5,
            max_weight_kg: 25,
          },
        });

      expect(res.status).toBe(201);
      expect(res.body.equipment.specifications.adjustable).toBe(true);
      expect(res.body.equipment.specifications.min_weight_kg).toBe(2.5);
    });

    // ── EDGE CASE ──

    it('should silently strip prototype pollution fields', async () => {
      const res = await request(app)
        .post('/api/equipment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          equipment_name: 'Foam Roller',
          equipment_type: 'accessories',
          __proto__: { admin: true },
          constructor: { prototype: { isAdmin: true } },
        });

      expect(res.status).toBe(201);
      expect(res.body.equipment.user_id).toBe(userId);
      expect((res.body.equipment as Record<string, unknown>).admin).toBeUndefined();
    });
  });

  describe('PUT /api/equipment/:id (updateEquipment)', () => {
    let equipmentId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/equipment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          equipment_name: 'Pull-up Bar',
          equipment_type: 'bodyweight',
          condition: 'new',
          is_available: true,
        });
      equipmentId = res.body.equipment._id;
    });

    it('should update only whitelisted fields', async () => {
      const res = await request(app)
        .put(`/api/equipment/${equipmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          condition: 'good',
          is_available: false,
        });

      expect(res.status).toBe(200);
      expect(res.body.equipment.condition).toBe('good');
      expect(res.body.equipment.is_available).toBe(false);
    });

    it('should NOT allow user_id override on update', async () => {
      const res = await request(app)
        .put(`/api/equipment/${equipmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: attackerId,
          condition: 'fair',
        });

      expect(res.status).toBe(200);
      expect(res.body.equipment.user_id).toBe(userId);
      expect(res.body.equipment.user_id).not.toBe(attackerId);
    });

    it('should NOT allow _id override on update', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .put(`/api/equipment/${equipmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          _id: fakeId,
          condition: 'poor',
        });

      expect(res.status).toBe(200);
      expect(res.body.equipment._id).toBe(equipmentId);
    });

    it('should NOT allow created_at/updated_at override on update', async () => {
      const fakeDate = '2020-01-01T00:00:00.000Z';

      const res = await request(app)
        .put(`/api/equipment/${equipmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          created_at: fakeDate,
          updated_at: fakeDate,
          condition: 'good',
        });

      expect(res.status).toBe(200);
      expect(res.body.equipment.created_at).not.toBe(fakeDate);
    });
  });
});

// ─── Cross-Controller: User Isolation ────────────────────────────────────────────

describe('Cross-Controller User Isolation', () => {
  it('attacker cannot create resources under victim user_id via sessions', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${attackerToken}`)
      .send({
        user_id: userId,
        session_date: new Date().toISOString(),
        completion_status: 'planned',
      });

    expect(res.status).toBe(201);
    expect(res.body.session.user_id).toBe(attackerId);

    // Verify victim has NO sessions
    const victimSessions = await request(app)
      .get('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`);

    expect(victimSessions.body.sessions).toHaveLength(0);
  });

  it('attacker cannot create resources under victim user_id via metrics', async () => {
    const res = await request(app)
      .post('/api/metrics')
      .set('Authorization', `Bearer ${attackerToken}`)
      .send({
        user_id: userId,
        measurement_date: new Date().toISOString(),
        weight_kg: 99,
      });

    expect(res.status).toBe(201);
    expect(res.body.metrics.user_id).toBe(attackerId);
  });

  it('attacker cannot create resources under victim user_id via equipment', async () => {
    const res = await request(app)
      .post('/api/equipment')
      .set('Authorization', `Bearer ${attackerToken}`)
      .send({
        user_id: userId,
        equipment_name: 'Stolen Dumbbell',
        equipment_type: 'free_weights',
      });

    expect(res.status).toBe(201);
    expect(res.body.equipment.user_id).toBe(attackerId);
  });
});
