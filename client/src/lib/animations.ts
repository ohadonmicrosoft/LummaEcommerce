import { Variants } from "framer-motion";

// Use the Framer Motion Variants type directly 
// This ensures compatibility with framer-motion's typing system
type AnimationVariants = Variants;

// Fade in animation
export const fadeIn: AnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

// Slide up animation
export const slideUp: AnimationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.5 }
};

// Slide down animation
export const slideDown: AnimationVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
};

// Slide in from right animation
export const slideInRight: AnimationVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
  transition: { duration: 0.3, type: "tween" }
};

// Slide in from left animation
export const slideInLeft: AnimationVariants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
  transition: { duration: 0.3, type: "tween" }
};

// Scale animation
export const scaleUp: AnimationVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3 }
};

// Staggered children animation
export const staggerContainer: AnimationVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

// Child animation for staggered containers
export const staggerItem: AnimationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Hover scale animation for cards
export const hoverScale: AnimationVariants = {
  whileHover: { scale: 1.03, transition: { duration: 0.3 } }
};

// Hover lift animation for product cards
export const hoverLift: AnimationVariants = {
  whileHover: { 
    y: -5, 
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 } 
  }
};

// Pulse animation
export const pulse: AnimationVariants = {
  animate: { 
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" 
    } 
  }
};

// Rotate animation for 360 product view
export const rotate360: AnimationVariants = {
  animate: { 
    rotate: 360,
    transition: { 
      duration: 20,
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear"
    } 
  }
};
