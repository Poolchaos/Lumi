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
import type { ReactNode } from 'react';
import { cn } from '../../design-system/utils/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        // Base glass effect
        'relative backdrop-blur-xl bg-white/10',
        // Border with glow
        'border border-white/20',
        // Shadow with color glow
        'shadow-[0_8px_32px_0_rgba(59,130,246,0.15)]',
        // Rounded corners
        'rounded-2xl',
        // Padding
        'p-8',
        // Hover effect
        'transition-all duration-300',
        'hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.25)]',
        'hover:border-white/30',
        className
      )}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
