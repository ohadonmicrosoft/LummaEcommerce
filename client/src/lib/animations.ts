import { Variants } from "framer-motion";

// Use the Framer Motion Variants type directly 
// This ensures compatibility with framer-motion's typing system
type AnimationVariants = Variants;

// Fade in animation
export const fadeIn: AnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

// Slide up animation
export const slideUp: AnimationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

// Slide down animation
export const slideDown: AnimationVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Slide in from right animation
export const slideInRight: AnimationVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 }
};

// Slide in from left animation
export const slideInLeft: AnimationVariants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
};

// Scale animation
export const scaleUp: AnimationVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

// Fade animation with delay
export const fadeWithDelay: AnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

// Staggered container animations
export const staggerContainer: AnimationVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Staggered item animations
export const staggerItem: AnimationVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 }
};

// Cart item animation
export const cartItemVariants: AnimationVariants = {
  initial: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { 
    opacity: 1, 
    height: "auto", 
    marginBottom: "1rem"
  },
  exit: { 
    opacity: 0, 
    height: 0, 
    marginBottom: 0
  }
};

// Mobile menu item animation
export const menuItemVariants: AnimationVariants = {
  closed: { x: -10, opacity: 0 },
  open: { x: 0, opacity: 1 }
};

// Pulse animation
export const pulseVariants: AnimationVariants = {
  initial: { scale: 1 },
  pulse: { 
    scale: [1, 1.05, 1],
  }
};

// Notification badge animation
export const badgeVariants: AnimationVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 }
};
