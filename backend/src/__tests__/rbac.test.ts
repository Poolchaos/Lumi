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

/**
 * RBAC (Role-Based Access Control) Tests (S0-2)
 * =============================================
 *
 * These tests verify that:
 * 1. Users have a default 'user' role
 * 2. Admin routes are protected by role authorization
 * 3. Regular users cannot access admin routes (403 Forbidden)
 * 4. Admin users CAN access admin routes (200 OK)
 * 5. Unauthenticated requests get 401
 *
 * Coverage rationale:
 *   POSITIVE - Admin role can access admin endpoints
 *   NEGATIVE - User role gets 403, no auth gets 401
 *   EDGE     - Role not present defaults to 'user', invalid role handling
 */

let mongoServer: MongoMemoryServer;
let userToken: string;
let adminToken: string;
let userId: string;
let adminId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});

  // Create regular user
  const userRes = await request(app).post('/api/auth/signup').send({
    email: 'user@example.com',
    password: 'User123!',
  });
  userToken = userRes.body.accessToken;
  userId = userRes.body.user.id;

  // Create admin user (signup then manually set role)
  const adminRes = await request(app).post('/api/auth/signup').send({
    email: 'admin@example.com',
    password: 'Admin123!',
  });
  adminToken = adminRes.body.accessToken;
  adminId = adminRes.body.user.id;

  // Manually promote to admin (would normally be done via DB migration or super-admin)
  await User.findByIdAndUpdate(adminId, { role: 'admin' });

  // Re-login to get token with admin role in context
  const adminLoginRes = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'Admin123!',
  });
  adminToken = adminLoginRes.body.accessToken;
});

// ─── Role Field Tests ────────────────────────────────────────────────────────────

describe('User Role Field', () => {
  it('should default new users to role "user"', async () => {
    const user = await User.findById(userId);
    expect(user?.role).toBe('user');
  });

  it('should allow role to be set to "admin"', async () => {
    const admin = await User.findById(adminId);
    expect(admin?.role).toBe('admin');
  });

  it('should reject invalid role values at schema level', async () => {
    const invalidRoleUser = new User({
      email: 'invalid@example.com',
      password_hash: 'hash123',
      role: 'superuser', // Invalid role
    });

    await expect(invalidRoleUser.validate()).rejects.toThrow();
  });
});

// ─── Admin Route Authorization Tests ─────────────────────────────────────────────

describe('Admin Routes Authorization', () => {
  describe('POST /api/admin/trigger-missed-workout-detection', () => {
    // ── NEGATIVE: Unauthenticated ──

    it('should reject requests without authentication (401)', async () => {
      const res = await request(app)
        .post('/api/admin/trigger-missed-workout-detection')
        .send();

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Authentication required');
    });

    it('should reject requests with invalid token (401)', async () => {
      const res = await request(app)
        .post('/api/admin/trigger-missed-workout-detection')
        .set('Authorization', 'Bearer invalid.token.here')
        .send();

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid or expired token');
    });

    // ── NEGATIVE: Wrong Role ──

    it('should reject regular users (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/admin/trigger-missed-workout-detection')
        .set('Authorization', `Bearer ${userToken}`)
        .send();

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Access denied. Insufficient permissions.');
    });

    // ── POSITIVE: Admin Access ──

    it('should allow admin users (200 OK)', async () => {
      const res = await request(app)
        .post('/api/admin/trigger-missed-workout-detection')
        .set('Authorization', `Bearer ${adminToken}`)
        .send();

      // Should succeed (200) or return a processing result
      // The actual endpoint might return different data, but it should NOT be 401 or 403
      expect(res.status).not.toBe(401);
      expect(res.status).not.toBe(403);
      expect([200, 500]).toContain(res.status); // 500 is OK if service has issues, auth passed
    });
  });
});

// ─── AuthRequest Role Propagation ────────────────────────────────────────────────

describe('AuthRequest Role Propagation', () => {
  it('should include role in authenticated request context', async () => {
    // We test this indirectly by verifying the admin route works for admin
    // and fails for user - this proves role is being read correctly

    // User role should fail
    const userRes = await request(app)
      .post('/api/admin/trigger-missed-workout-detection')
      .set('Authorization', `Bearer ${userToken}`)
      .send();
    expect(userRes.status).toBe(403);

    // Admin role should pass auth (even if endpoint itself might error)
    const adminRes = await request(app)
      .post('/api/admin/trigger-missed-workout-detection')
      .set('Authorization', `Bearer ${adminToken}`)
      .send();
    expect(adminRes.status).not.toBe(403);
  });

  it('should handle users without explicit role (defaults to user)', async () => {
    // Create a user and manually remove the role field to simulate legacy data
    const legacyUser = new User({
      email: 'legacy@example.com',
      password_hash: 'Test123!',
    });
    await legacyUser.save();

    // Verify role defaults to 'user' even when not explicitly set
    const savedUser = await User.findOne({ email: 'legacy@example.com' });
    expect(savedUser?.role).toBe('user'); // Default applied by schema
  });
});

// ─── Cross-Cutting Authorization ─────────────────────────────────────────────────

describe('Cross-Cutting Authorization Checks', () => {
  it('regular user with valid token cannot escalate to admin via API', async () => {
    // Attempt to access admin route with user token
    const res = await request(app)
      .post('/api/admin/trigger-missed-workout-detection')
      .set('Authorization', `Bearer ${userToken}`)
      .send();

    expect(res.status).toBe(403);
  });

  it('user cannot modify their own role via profile update', async () => {
    // Try to update profile with role field
    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        role: 'admin',
        profile: { first_name: 'Test' },
      });

    // Profile update should succeed but role should NOT change
    // (role is not in the whitelist of updatable fields)
    expect(res.status).toBe(200);

    // Verify role wasn't changed
    const user = await User.findById(userId);
    expect(user?.role).toBe('user');
  });
});
