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

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LumiLogoProps {
  className?: string;
}

export const LumiLogo = ({ className = '' }: LumiLogoProps) => {
  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow container */}
      <div className="relative">
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 blur-2xl bg-primary-500/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Logo content */}
        <div className="relative flex items-center gap-3">
          {/* Icon */}
          <motion.div
            className="relative"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-10 h-10 text-primary-400" strokeWidth={2} />

            {/* Particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [0, Math.cos((i * 2 * Math.PI) / 3) * 20],
                  y: [0, Math.sin((i * 2 * Math.PI) / 3) * 20],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>

          {/* Text */}
          <div>
            <motion.h1
              className="text-4xl font-bold text-white tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Lumi
            </motion.h1>
            <motion.p
              className="text-sm text-primary-300 font-light tracking-wide"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Your AI Health Lead
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
