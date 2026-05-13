import type { Variants } from "framer-motion";

// ─── Shared Animation Variants ──────────────────────────────────────────────
// Defined at module level to avoid re-allocation on every render.

/** Stagger-in container — use with `initial="hidden" animate="show"`. */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

/** Fade-up spring item for staggered lists. */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

/** Bento-card style entrance. */
export const bentoVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

/** Pop-in scale entrance. */
export const popVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

/** Slide in from the left. */
export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

/** Slide in from the right. */
export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

/** Table row entrance (used by market page). */
export const rowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};
