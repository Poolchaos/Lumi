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

export const colors = {
  // Lumi Brand Colors - Luminous Blue
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Base - Luminous Blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Aurora Gradient Colors
  aurora: {
    'indigo-deep': '#0F1729',
    'violet-soft': '#2D1B69',
    'amber-warm': '#FFA726',
    'cyan-cool': '#00E5FF',
  },

  // Background Colors
  background: {
    'dark': '#0A0E27',
    'light': '#FAF8F5',
  },

  // Accent Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10B981',  // Mint Green - Growth, wellness
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    light: '#10b981',
    DEFAULT: '#059669',
    dark: '#047857',
  },
  secondary: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#FF6B9D',  // Soft Coral - Energy, vitality
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
  warning: {
    light: '#f59e0b',
    DEFAULT: '#d97706',
    dark: '#b45309',
  },
  error: {
    light: '#ef4444',
    DEFAULT: '#dc2626',
    dark: '#b91c1c',
  },
  achievement: {
    light: '#fbbf24',
    DEFAULT: '#FBBF24',  // Golden - Achievement
    dark: '#f59e0b',
  },
  xp: {
    light: '#fbbf24',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },

  // Neutral
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;
