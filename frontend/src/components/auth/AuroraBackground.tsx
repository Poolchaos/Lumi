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
import { useEffect, useState } from 'react';

export const AuroraBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F1729] via-[#2D1B69] to-[#0F1729]" />

      {/* Animated aurora layers */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, #FFA726 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, #00E5FF 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, #FFA726 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, #FFA726 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Parallax gradient orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] bg-[#3b82f6] opacity-20"
        style={{
          top: '20%',
          left: '10%',
        }}
        animate={{
          x: mousePosition.x * 30,
          y: mousePosition.y * 30,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] bg-[#FF6B9D] opacity-20"
        style={{
          bottom: '10%',
          right: '10%',
        }}
        animate={{
          x: mousePosition.x * -40,
          y: mousePosition.y * -40,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      />

      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full blur-[80px] bg-[#10B981] opacity-15"
        style={{
          top: '60%',
          left: '50%',
        }}
        animate={{
          x: mousePosition.x * 20,
          y: mousePosition.y * 20,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
    </div>
  );
};
