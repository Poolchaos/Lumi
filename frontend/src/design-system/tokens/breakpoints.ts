/**
 * Breakpoint System
 * Responsive design breakpoints
 */

export const breakpoints = {
  xs: '0px',       // Mobile (portrait)
  sm: '640px',     // Mobile (landscape)
  md: '768px',     // Tablet
  lg: '1024px',    // Desktop
  xl: '1280px',    // Large desktop
  '2xl': '1536px', // Extra large desktop
} as const;

// Media query helpers
export const media = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
} as const;

export type Breakpoint = typeof breakpoints;
export type Media = typeof media;
