'use client';

import React, { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'fade-in' | 'zoom-in' | 'scale-up';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: AnimationType;
  duration?: number;
  reduceMotion?: boolean; // Accessibility option
}

// Easing curve mượt mà - cubic-bezier cho cảm giác tự nhiên
const EASE_SMOOTH: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

// Base variants được cache
const createVariants = (
  animation: AnimationType,
  duration: number,
  delay: number
): Variants => {
  const baseDelay = delay / 1000;

  const baseTransition = {
    duration,
    delay: baseDelay,
    ease: EASE_SMOOTH,
  };

  const variantsMap: Record<AnimationType, Variants> = {
    'fade-up': {
      hidden: { 
        opacity: 0, 
        y: 30,
        filter: 'blur(4px)',
        willChange: 'opacity, transform, filter' 
      },
      visible: { 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)',
        willChange: 'auto', 
        transition: baseTransition 
      },
    },
    'fade-down': {
      hidden: { 
        opacity: 0, 
        y: -30,
        filter: 'blur(4px)',
        willChange: 'opacity, transform, filter' 
      },
      visible: { 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)',
        willChange: 'auto', 
        transition: baseTransition 
      },
    },
    'fade-left': {
      hidden: { 
        opacity: 0, 
        x: 30,
        filter: 'blur(4px)',
        willChange: 'opacity, transform, filter' 
      },
      visible: { 
        opacity: 1, 
        x: 0, 
        filter: 'blur(0px)',
        willChange: 'auto', 
        transition: baseTransition 
      },
    },
    'fade-right': {
      hidden: { 
        opacity: 0, 
        x: -30,
        filter: 'blur(4px)',
        willChange: 'opacity, transform, filter' 
      },
      visible: { 
        opacity: 1, 
        x: 0, 
        filter: 'blur(0px)',
        willChange: 'auto', 
        transition: baseTransition 
      },
    },
    'fade-in': {
      hidden: { 
        opacity: 0, 
        filter: 'blur(6px)',
        willChange: 'opacity, filter' 
      },
      visible: { 
        opacity: 1, 
        filter: 'blur(0px)',
        willChange: 'auto', 
        transition: baseTransition 
      },
    },
    'zoom-in': {
      hidden: { 
        opacity: 0, 
        scale: 0.95,
        filter: 'blur(4px)',
        willChange: 'opacity, transform, filter' 
      },
      visible: { 
        opacity: 1, 
        scale: 1, 
        filter: 'blur(0px)',
        willChange: 'auto', 
        transition: baseTransition 
      },
    },
    'scale-up': {
      hidden: { 
        opacity: 0, 
        scale: 0.98, 
        y: 15,
        filter: 'blur(4px)',
        willChange: 'opacity, transform, filter' 
      },
      visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        filter: 'blur(0px)',
        willChange: 'auto', 
        transition: baseTransition 
      },
    },
  };

  return variantsMap[animation] || variantsMap['fade-up'];
};

// Reduced motion variants cho accessibility
const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  delay = 0,
  animation = 'fade-up',
  duration = 0.8,
  reduceMotion = false,
}) => {
  // Memoize variants để tránh tạo lại mỗi render
  const variants = useMemo(() => {
    if (reduceMotion) return reducedMotionVariants;
    return createVariants(animation, duration, delay);
  }, [animation, duration, delay, reduceMotion]);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: true, 
        amount: 0.1,
        margin: "0px 0px -50px 0px" 
      }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};
