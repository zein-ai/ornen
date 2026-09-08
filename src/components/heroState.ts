/**
 * Shared mutable render state for the hero — written by DOM scroll/pointer
 * listeners, read inside the R3F frame loop. No React re-renders involved.
 * Kept in its own module so HeroScene can stay lazily loaded.
 */
export const heroState = {
  scroll: 0, // 0 → 1 across the hero scroll zone
  pointerX: 0, // -1 → 1
  pointerY: 0, // -1 → 1
}
