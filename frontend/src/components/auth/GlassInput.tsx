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
import { motion } from 'framer-motion';
import { cn } from '../../design-system/utils/cn';

interface GlassInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
}

export const GlassInput = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
}: GlassInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      {/* Floating label */}
      <motion.label
        htmlFor={id}
        className={cn(
          'absolute left-4 transition-all duration-200 pointer-events-none',
          'text-white/70',
          isFocused || hasValue
            ? 'top-0 -translate-y-1/2 text-xs bg-[#0F1729] px-2'
            : 'top-1/2 -translate-y-1/2 text-base'
        )}
        animate={{
          color: isFocused ? '#3b82f6' : 'rgba(255, 255, 255, 0.7)',
        }}
      >
        {label}
      </motion.label>

      {/* Input with glow effect */}
      <motion.div
        className="relative"
        animate={{
          boxShadow: isFocused
            ? '0 0 0 2px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)'
            : '0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
        transition={{ duration: 0.2 }}
        style={{ borderRadius: '12px' }}
      >
        <input
          id={id}
          type={type}
          placeholder={isFocused ? placeholder : ''}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          autoComplete={autoComplete}
          className={cn(
            'w-full px-4 py-3.5 rounded-xl',
            'bg-white/5 backdrop-blur-sm',
            'border border-white/10',
            'text-white placeholder:text-white/30',
            'outline-none',
            'transition-all duration-200',
            'focus:bg-white/10',
            'focus:border-primary-500/50'
          )}
        />
      </motion.div>
    </div>
  );
};
