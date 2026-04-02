import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      try {
        setPosition({ x: e.clientX, y: e.clientY });
        
        const target = e.target as HTMLElement;
        if (!target) return;

        const computedStyle = window.getComputedStyle(target);
        setIsPointer(
          computedStyle.cursor === 'pointer' ||
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('button') !== null ||
          target.closest('a') !== null
        );
      } catch (err) {
        // Silently fail for cursor style issues
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="custom-cursor hidden lg:block"
      animate={{
        x: position.x - 10,
        y: position.y - 10,
        scale: isPointer ? 2 : 1,
        backgroundColor: isPointer ? 'rgba(242, 125, 38, 0.2)' : 'transparent',
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
    />
  );
};

export default CustomCursor;
