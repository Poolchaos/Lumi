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
 * Notification Log Model
 *
 * Tracks notification delivery, acknowledgment, and user interactions
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationLog extends Document {
  user_id: mongoose.Types.ObjectId;
  medication_id: mongoose.Types.ObjectId;
  scheduled_time: Date;
  notification_type: 'advance' | 'escalation';
  sent_at: Date;
  acknowledged_at?: Date;
  snoozed_until?: Date;
  status: 'sent' | 'acknowledged' | 'snoozed' | 'failed';
  delivery_method: 'push' | 'in_app' | 'email';
  failure_reason?: string;
}

const NotificationLogSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    medication_id: {
      type: Schema.Types.ObjectId,
      ref: 'Medication',
      required: true,
      index: true,
    },
    scheduled_time: {
      type: Date,
      required: true,
      index: true,
    },
    notification_type: {
      type: String,
      enum: ['advance', 'escalation'],
      required: true,
    },
    sent_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    acknowledged_at: {
      type: Date,
    },
    snoozed_until: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['sent', 'acknowledged', 'snoozed', 'failed'],
      required: true,
      default: 'sent',
      index: true,
    },
    delivery_method: {
      type: String,
      enum: ['push', 'in_app', 'email'],
      required: true,
    },
    failure_reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for finding notifications by user, medication, and time
NotificationLogSchema.index({ user_id: 1, medication_id: 1, scheduled_time: 1 });

// Index for cleanup queries (finding old acknowledged notifications)
NotificationLogSchema.index({ status: 1, acknowledged_at: 1 });

export const NotificationLog = mongoose.model<INotificationLog>(
  'NotificationLog',
  NotificationLogSchema
);
