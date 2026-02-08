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

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { authAPI } from '../api';
import { useAuthStore } from '../store/authStore';
import type { LoginCredentials } from '../types';
import { AuroraBackground, GlassCard, GlassInput, GlassButton, LumiLogo } from '../components/auth';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Welcome back to clarity');
      navigate('/dashboard');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message || 'Invalid email or password';
      toast.error(message);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated aurora background */}
      <AuroraBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className="mb-8">
            <LumiLogo />
          </div>

          {/* Glassmorphic card */}
          <GlassCard>
            {/* Headline */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back to clarity
              </h2>
              <p className="text-white/60">
                Continue your health journey
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <GlassInput
                id="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
                autoComplete="email"
              />

              <GlassInput
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                autoComplete="current-password"
              />

              {loginMutation.isError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-error-light/20 backdrop-blur-sm border border-error-light/30 text-white rounded-lg text-sm flex items-center gap-2"
                >
                  <AlertCircle size={16} />
                  <span>
                    {loginMutation.error instanceof Error && loginMutation.error.message
                      ? loginMutation.error.message
                      : 'Invalid email or password. Please try again.'}
                  </span>
                </motion.div>
              )}

              <GlassButton
                type="submit"
                loading={loginMutation.isPending}
                className="w-full"
              >
                Continue your journey →
              </GlassButton>
            </form>

            {/* Sign up link */}
            <motion.div
              className="mt-6 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="text-white/60">New here? </span>
              <Link
                to="/signup"
                className="text-primary-400 hover:text-primary-300 font-semibold transition-colors relative group"
              >
                <span className="relative">
                  Begin →
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            </motion.div>
          </GlassCard>

          {/* Footer tagline */}
          <motion.div
            className="mt-8 text-center text-white/50 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <p>Self-hosted • Private • Intelligent</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
