/**
 * Media query hook for responsive design
 */

import { useState, useEffect } from 'react';
import { breakpoints } from '../tokens/breakpoints';

type Breakpoint = keyof typeof breakpoints;

export function useMediaQuery(breakpoint: Breakpoint): boolean {
  const query = `(min-width: ${breakpoints[breakpoint]})`;
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

// Convenience hooks for common breakpoints
export function useIsMobile() {
  return !useMediaQuery('md');
}

export function useIsTablet() {
  const isAboveMd = useMediaQuery('md');
  const isBelowLg = !useMediaQuery('lg');
  return isAboveMd && isBelowLg;
}

export function useIsDesktop() {
  return useMediaQuery('lg');
}
