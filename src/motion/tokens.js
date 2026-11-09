export const ease = [0.22, 1, 0.36, 1];

export const dur = {
  micro: 0.25,
  base: 0.6,
  slow: 0.9,
  hero: 1.1,
};

export const stagger = 0.08;

export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25 },
  },
};

