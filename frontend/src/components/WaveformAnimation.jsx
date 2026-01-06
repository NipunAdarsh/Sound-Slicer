import React from 'react';
import { motion } from 'framer-motion';

export default function WaveformAnimation({
  barCount = 10,
  animate = true,
  color = 'ios'
}) {
  const bars = Array.from({ length: barCount });

  const getBarStyle = () => {
    switch (color) {
      case 'ios':
        return {
          background: '#007AFF',
          boxShadow: 'none'
        };
      case 'cyan':
        return {
          background: '#00ffff',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
        };
      case 'magenta':
        return {
          background: '#ff00ff',
          boxShadow: '0 0 10px rgba(255, 0, 255, 0.8)'
        };
      case 'gradient':
      default:
        return {
          background: 'linear-gradient(180deg, #007AFF, #5856D6)',
          boxShadow: '0 4px 10px rgba(0, 122, 255, 0.2)'
        };
    }
  };

  const barStyle = getBarStyle();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        height: '80px'
      }}
    >
      {bars.map((_, index) => (
        <motion.div
          key={index}
          style={{
            width: '6px',
            borderRadius: '4px',
            ...barStyle
          }}
          animate={
            animate
              ? {
                height: [20, 45, 30, 60, 25, 50, 20, 55, 35, 20]
              }
              : { height: 10 }
          }
          transition={{
            duration: 0.8,
            repeat: animate ? Infinity : 0,
            ease: 'easeInOut',
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  );
}
