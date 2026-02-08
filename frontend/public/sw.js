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

/// <reference lib="webworker" />

// Service Worker for Push Notifications
console.log('📱 Lumi Service Worker loaded');

// Install event
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Push event - receive push notifications
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification received');

  if (!event.data) {
    console.warn('Push event has no data');
    return;
  }

  try {
    const data = event.data.json();
    console.log('Push data:', data);

    const title = data.title || 'Lumi Reminder';
    const options = {
      body: data.body || 'You have a medication reminder',
      icon: '/images/logo-192.png',
      badge: '/images/badge-72.png',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: data.actions || [
        {
          action: 'take',
          title: 'Take Now',
        },
        {
          action: 'skip',
          title: 'Skip',
        },
      ],
      requireInteraction: true,
      tag: `medication-${data.data?.medicationId || 'reminder'}`,
      renotify: true,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notification clicked:', event.action);

  event.notification.close();

  const data = event.notification.data;

  if (event.action === 'take') {
    // Open app to medications page to log the dose
    event.waitUntil(
      self.clients
        .matchAll({ type: 'window', includeUnowned: true })
        .then((clients) => {
          // Check if there's already a window open
          for (const client of clients) {
            if ('focus' in client) {
              client.focus();
              // Send message to the client to log dose
              client.postMessage({
                type: 'LOG_DOSE',
                medicationId: data?.medicationId,
                scheduledTime: data?.scheduledTime,
              });
              return;
            }
          }

          // No window open, open a new one
          if (self.clients.openWindow) {
            return self.clients.openWindow(
              `/medications?log=${data?.medicationId}&time=${data?.scheduledTime}`
            );
          }
        })
    );
  } else if (event.action === 'skip') {
    // Log that the dose was skipped
    event.waitUntil(
      fetch(`${self.registration.scope}api/medications/${data?.medicationId}/skip-dose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduled_time: data?.scheduledTime,
        }),
      }).catch((error) => {
        console.error('Error skipping dose:', error);
      })
    );
  } else {
    // Default action - just open the medications page
    event.waitUntil(
      self.clients
        .matchAll({ type: 'window', includeUnowned: true })
        .then((clients) => {
          for (const client of clients) {
            if ('focus' in client) {
              client.focus();
              client.postMessage({
                type: 'VIEW_MEDICATIONS',
              });
              return;
            }
          }

          if (self.clients.openWindow) {
            return self.clients.openWindow('/medications');
          }
        })
    );
  }
});

// Background sync for offline dose logging
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);

  if (event.tag === 'sync-dose-logs') {
    event.waitUntil(syncDoseLogs());
  }
});

/**
 * Sync pending dose logs when back online
 */
async function syncDoseLogs() {
  try {
    // Get pending dose logs from IndexedDB
    // This would be implemented with actual IndexedDB operations
    console.log('Syncing pending dose logs...');

    // For now, just log that sync was attempted
    // In a full implementation, this would:
    // 1. Read pending logs from IndexedDB
    // 2. POST them to the API
    // 3. Remove from IndexedDB on success
  } catch (error) {
    console.error('Error syncing dose logs:', error);
    throw error; // This will cause the sync to retry
  }
}

// Message event - receive messages from the app
self.addEventListener('message', (event) => {
  console.log('📨 Service Worker received message:', event.data);

  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
