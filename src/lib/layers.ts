/** Single source of truth for stacking order. Use these instead of ad-hoc z-index values. */
export const Z = {
  ambient: 0,
  content: 10,
  corner: 30,
  header: 40,
  progress: 45,
  menuButton: 50,
  menu: 48,
  toast: 60,
  grain: 70,
  modal: 75,
  cursor: 80,
  loader: 90,
} as const;
