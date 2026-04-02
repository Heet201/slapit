import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Springs for smooth trailing effect
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const ringX = useSpring(0, springConfig);
  const ringY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      const { clientX, clientY } = e;
      setPosition({ x: clientX, y: clientY });
      
      // Update ring position with slight delay via spring
      ringX.set(clientX);
      ringY.set(clientY);
      
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') !== null ||
        target.closest('a') !== null;
      
      setIsPointer(isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, ringX, ringY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-brand-primary rounded-full z-[9999] pointer-events-none hidden lg:block mix-blend-difference"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: isClicking ? 0.5 : isPointer ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
      />

      {/* Outer Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-brand-primary/40 rounded-full z-[9998] pointer-events-none hidden lg:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isPointer ? 1.8 : 1,
          borderWidth: isPointer ? '1px' : '1px',
          borderColor: isPointer ? 'rgba(242, 125, 38, 0.8)' : 'rgba(242, 125, 38, 0.4)',
          backgroundColor: isPointer ? 'rgba(242, 125, 38, 0.05)' : 'transparent',
        }}
      >
        {/* Inner Glow for Ring */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-brand-primary/10 blur-md opacity-0"
          animate={{ opacity: isPointer ? 1 : 0 }}
        />
      </motion.div>

      {/* Subtle Trail Effect */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-brand-primary/20 rounded-full z-[9997] pointer-events-none hidden lg:block"
        animate={{
          x: position.x - 2,
          y: position.y - 2,
          opacity: isPointer ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 150, mass: 1 }}
      />
    </>
  );
};

export default CustomCursor;
